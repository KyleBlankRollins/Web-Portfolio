import { LitElement, html } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { timelineStyles } from "./timeline.style.js";
import {
  typographyStyles,
  buttonStyles,
  layoutStyles,
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

  private generateCompanyId(companyName: string): string {
    // Create a URL-friendly ID from the company name
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
      ...this.experienceData.map((company) => ({
        id: this.generateCompanyId(company.company),
        text: company.company,
        level: 3,
        element: this.shadowRoot?.querySelector(
          `#${this.generateCompanyId(company.company)}`
        ) as HTMLElement,
      })),
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

  render() {
    if (this.isLoading) {
      return html`
        <div class="timeline">
          <div class="loading">Loading career timeline...</div>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="timeline">
          <div class="error">
            <h2>Error Loading Timeline</h2>
            <p>${this.error}</p>
          </div>
        </div>
      `;
    }

    return html`
      <div class="timeline">
        <div class="timeline-sidebar">
          <kbr-table-of-contents
            min-level="2"
            max-level="3"
            target-selector=".timeline"
          >
          </kbr-table-of-contents>
        </div>

        <div class="timeline-content">
          ${this.experienceData.map((company) => {
            const companyId = this.generateCompanyId(company.company);
            return html`
              <div>
                <div class="company-header">
                  ${company.companyWebsite
                    ? html`<h2 class="company-name" id="${companyId}">
                        <a
                          href="${company.companyWebsite}"
                          target="_blank"
                          rel="noopener"
                          >${company.company}</a
                        >
                      </h2>`
                    : html`<h2 class="company-name" id="${companyId}">
                        ${company.company}
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
