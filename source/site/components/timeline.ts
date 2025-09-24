import { LitElement, html, css } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import "./timeline-entry.js";
import "./table-of-contents.js";

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
  private declare experienceData: CompanyData[];

  @state()
  private declare isLoading: boolean;

  @state()
  private declare error: string | null;

  static styles = css`
    :host {
      display: block;
      position: relative;
    }

    .timeline {
      display: grid;
      grid-template-columns: 280px 1fr;
      grid-template-areas: "sidebar content";
      gap: var(--space-xl);
      max-width: var(--content-max-width);
      margin: 0 auto;
      padding: var(--space-lg);
      min-height: calc(
        100vh - 80px
      ); /* Account for navigation height */
    }

    .timeline-header {
      grid-area: content;
      text-align: center;
      margin-bottom: 3rem;
    }

    .timeline-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--color-text);
      margin: 0 0 1rem 0;
      line-height: 1.2;
    }

    .timeline-subtitle {
      font-size: 1.125rem;
      color: var(--color-text-muted);
      margin: 0;
      line-height: 1.5;
    }

    .timeline-sidebar {
      grid-area: sidebar;
      min-width: 0; /* Prevent grid overflow */
    }

    .timeline-sidebar kbr-table-of-contents {
      position: sticky;
      top: var(--space-lg);
    }

    .timeline-content {
      grid-area: content;
      position: relative;
      min-width: 0; /* Prevent grid overflow */
    }

    .company-group {
      margin-bottom: 3rem;
    }

    .company-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .company-name {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--color-primary);
      text-decoration: none;
      transition: opacity 0.2s ease;
    }

    .company-name:hover {
      opacity: 0.8;
    }

    .company-name {
      a {
        color: var(--color-primary);
      }
    }

    .company-positions {
      position: relative;
      margin-bottom: 2rem;
      padding: 1rem 1.5rem 1rem 2rem;
    }

    .loading {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--color-text-muted);
    }

    .error {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--color-error);
      background: var(--color-error-background);
      border-radius: 0.5rem;
      border: 1px solid var(--color-error);
    }

    @media (max-width: 1024px) {
      .timeline {
        grid-template-columns: 1fr;
        grid-template-areas:
          "sidebar"
          "content";
        gap: var(--space-lg);
        padding: var(--space-md);
      }

      .timeline-sidebar {
        order: 1;
      }

      .timeline-header,
      .timeline-content {
        order: 2;
      }
    }

    @media (max-width: 768px) {
      .timeline {
        padding: var(--space-sm);
        gap: var(--space-md);
      }

      .timeline-title {
        font-size: 2rem;
      }

      .timeline-subtitle {
        font-size: 1rem;
      }

      .company-header {
        padding: 1rem;
        margin-bottom: 1.5rem;
      }

      .company-name {
        font-size: 1.25rem;
      }

      .company-group {
        margin-bottom: 2rem;
      }
    }
  `;

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
    console.log(
      "Timeline: Updated called with changes:",
      Array.from(changedProperties.keys())
    );

    // Update TOC when data has loaded
    if (
      changedProperties.has("experienceData") &&
      this.experienceData.length > 0
    ) {
      console.log("Timeline: Experience data loaded, updating TOC");
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
        throw new Error(
          `Failed to load experience data: ${response.status}`
        );
      }

      const data: CompanyData[] = await response.json();
      this.experienceData = data;
    } catch (error) {
      console.error("Error loading experience data:", error);
      this.error =
        error instanceof Error
          ? error.message
          : "Unknown error occurred";
    } finally {
      this.isLoading = false;
    }
  }

  private generateCompanyId(companyName: string): string {
    // Create a URL-friendly ID from the company name
    return companyName
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/--+/g, "-") // Replace multiple hyphens with single
      .trim();
  }

  private updateTableOfContents(): void {
    console.log("Timeline: Updating table of contents...");

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

    console.log("Timeline: Generated headings data:", headingsData);

    // Find the TOC component in our shadow DOM
    const tocComponent = this.shadowRoot?.querySelector(
      "kbr-table-of-contents"
    ) as any;
    console.log("Timeline: Found TOC component:", tocComponent);

    if (tocComponent) {
      // Pass the headings data directly to the TOC
      tocComponent.updateWithHeadings(headingsData);
      console.log("Timeline: Updated TOC with headings");
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
            <h3>Error Loading Timeline</h3>
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
              <div class="company-group">
                <div class="company-header">
                  ${company.companyWebsite
                    ? html`<h3 class="company-name" id="${companyId}">
                        <a
                          href="${company.companyWebsite}"
                          target="_blank"
                          rel="noopener"
                          >${company.company}</a
                        >
                      </h3>`
                    : html`<h3 class="company-name" id="${companyId}">
                        ${company.company}
                      </h3>`}
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
                        skills=${JSON.stringify(
                          position.skills || []
                        )}
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
