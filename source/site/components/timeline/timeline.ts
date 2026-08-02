import { LitElement, html } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { timelineStyles } from "./timeline.style.js";
import {
  typographyStyles,
  buttonStyles,
  layoutStyles,
  reducedMotionStyles,
} from "../../styles/shared-styles.js";

// Components
import "../timeline-entry/timeline-entry.js";
import "../table-of-contents/table-of-contents.js";

/**
 * Career Timeline Web Component
 *
 * This component displays a chronological timeline of career positions,
 * loading data from the experience-data.json file and rendering timeline entries.
 *
 * Usage: <kbr-timeline data-url="/data/experience-data.json"></kbr-timeline>
 */

interface PositionData {
  title: string;
  startDate: string;
  endDate: string;
  dateRange: string;
  duration: string;
  location: string;
  employmentType: string;
  description: string;
  skills?: string[];
}

interface CompanyData {
  company: string;
  companyWebsite?: string;
  positions: PositionData[];
  skills?: string[];
}

@customElement("kbr-timeline")
export class KbrTimeline extends LitElement {
  @property({ type: String, attribute: "data-url" })
  declare dataUrl: string;

  @state()
  declare private experienceData: CompanyData[];

  @state()
  declare private isLoading: boolean;

  @state()
  declare private error: string | null;

  static styles = [
    typographyStyles,
    buttonStyles,
    layoutStyles,
    timelineStyles,
    reducedMotionStyles,
  ];

  constructor() {
    super();
    this.dataUrl = "/data/experience-data.json";
    this.experienceData = [];
    this.isLoading = false;
    this.error = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadExperienceData();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    // Update TOC when data has loaded
    if (
      changedProperties.has("experienceData") &&
      this.experienceData.length > 0
    ) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => this.updateTableOfContents(), 0);
    }
  }

  private async loadExperienceData() {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await fetch(this.dataUrl);
      if (!response.ok) {
        throw new Error(`Failed to load experience data: ${response.status}`);
      }

      const data: CompanyData[] = await response.json();
      this.experienceData = data;
    } catch (error) {
      console.error("Error loading experience data:", error);
      this.error =
        error instanceof Error ? error.message : "Unknown error occurred";
    } finally {
      this.isLoading = false;
    }
  }

  private slugifyCompany(companyName: string): string {
    // Create a URL-friendly slug from the company name
    let id = companyName
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/--+/g, "-") // Replace multiple hyphens with single
      .trim();

    // Ensure ID starts with a letter (CSS requirement)
    if (id && /^[0-9]/.test(id)) {
      id = `company-${id}`;
    }

    return id || "company";
  }

  /**
   * Anchor IDs for the company headings, aligned to experienceData by index.
   *
   * The slug alone is not unique: this history has two separate stints at
   * Purch, and both headings were rendering id="purch". Duplicate IDs meant
   * the TOC built two entries that resolved to the same element, so both
   * highlighted together and the second was unreachable.
   *
   * Suffixes are assigned in data order, and the first occurrence keeps the
   * bare slug - so existing links to #purch still land where they did.
   */
  private get companyIds(): string[] {
    const seen = new Map<string, number>();

    return this.experienceData.map((company) => {
      const base = this.slugifyCompany(company.company);
      const occurrence = (seen.get(base) ?? 0) + 1;
      seen.set(base, occurrence);

      return occurrence === 1 ? base : `${base}-${occurrence}`;
    });
  }

  /**
   * The span of years a company covers, e.g. "2013-2016" or "2021-Present".
   * Dates in the data are "YYYY-MM"; a missing endDate means the role is
   * current.
   */
  private companyYearSpan(company: CompanyData): string {
    const years = company.positions
      .map((position) => position.startDate)
      .filter(Boolean)
      .map((date) => String(date).slice(0, 4))
      .filter((year) => /^\d{4}$/.test(year));

    if (years.length === 0) {
      return "";
    }

    const start = years.reduce((a, b) => (a < b ? a : b));
    const ongoing = company.positions.some((position) => !position.endDate);
    const endYears = company.positions
      .map((position) => String(position.endDate ?? "").slice(0, 4))
      .filter((year) => /^\d{4}$/.test(year));

    const end = ongoing
      ? "Present"
      : endYears.length > 0
        ? endYears.reduce((a, b) => (a > b ? a : b))
        : start;

    return start === end ? start : `${start}-${end}`;
  }

  /**
   * Heading text for a company. Repeated employers get their year span
   * appended, so two "Purch" entries are tellable apart in the heading and in
   * the table of contents - not only by their anchor.
   */
  private companyHeading(index: number): string {
    const company = this.experienceData[index];
    const isRepeated =
      this.experienceData.filter((other) => other.company === company.company)
        .length > 1;

    if (!isRepeated) {
      return company.company;
    }

    const span = this.companyYearSpan(company);
    return span ? `${company.company} (${span})` : company.company;
  }

  private updateTableOfContents(): void {
    // Create heading data from our content
    const headingsData = [
      {
        id: "career-timeline",
        text: "Career Timeline",
        level: 2,
        element: this.shadowRoot?.querySelector(
          ".timeline-title"
        ) as HTMLElement,
      },
      ...this.experienceData.map((_company, index) => {
        const id = this.companyIds[index];
        return {
          id,
          text: this.companyHeading(index),
          level: 3,
          element: this.shadowRoot?.querySelector(`#${id}`) as HTMLElement,
        };
      }),
    ].filter((item) => item.element);

    // Find the TOC component in our shadow DOM
    const tocComponent = this.shadowRoot?.querySelector(
      "kbr-table-of-contents"
    ) as any;

    if (tocComponent) {
      // Pass the headings data directly to the TOC
      tocComponent.updateWithHeadings(headingsData);
    }
  }

  /**
   * The page heading. Rendered in every state so /career.html always has an
   * h1, including while the data is still loading or after it fails. The id
   * is the anchor target for the top entry in the table of contents.
   */
  private renderHeader() {
    return html`
      <header class="timeline-header">
        <h1 class="timeline-title" id="career-timeline">Career Timeline</h1>
        <p class="timeline-subtitle">
          Where I've worked and what I did there, most recent first.
        </p>
      </header>
    `;
  }

  render() {
    if (this.isLoading) {
      return html`
        <div class="timeline">
          ${this.renderHeader()}
          <div class="loading">Loading career timeline...</div>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="timeline">
          ${this.renderHeader()}
          <div class="error">
            <h2>Error Loading Timeline</h2>
            <p>${this.error}</p>
          </div>
        </div>
      `;
    }

    return html`
      <div class="timeline">
        ${this.renderHeader()}

        <div class="timeline-sidebar">
          <kbr-table-of-contents
            min-level="2"
            max-level="3"
            target-selector=".timeline"
          >
          </kbr-table-of-contents>
        </div>

        <div class="timeline-content">
          ${this.experienceData.map((company, index) => {
            const companyId = this.companyIds[index];
            const heading = this.companyHeading(index);
            return html`
              <div>
                <div class="company-header">
                  ${company.companyWebsite
                    ? html`<h2 class="company-name" id="${companyId}">
                        <a
                          href="${company.companyWebsite}"
                          target="_blank"
                          rel="noopener"
                          >${heading}</a
                        >
                      </h2>`
                    : html`<h2 class="company-name" id="${companyId}">
                        ${heading}
                      </h2>`}
                </div>
                <div class="company-positions">
                  ${company.positions.map(
                    (position) => html`
                      <kbr-timeline-entry
                        title=${position.title}
                        start-date=${position.startDate}
                        end-date=${position.endDate}
                        date-range=${position.dateRange}
                        duration=${position.duration}
                        location=${position.location}
                        employment-type=${position.employmentType}
                        description=${position.description}
                        skills=${JSON.stringify(position.skills || [])}
                      ></kbr-timeline-entry>
                    `
                  )}
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "kbr-timeline": KbrTimeline;
  }
}
