import { LitElement, html, css } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import "./timeline-entry.js";

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

  @property({ type: Boolean, attribute: "show-company-skills" })
  declare showCompanySkills: boolean;

  @property({ type: String })
  declare filter: string;

  @state()
  private declare experienceData: CompanyData[];

  @state()
  private declare isLoading: boolean;

  @state()
  private declare error: string | null;

  @state()
  private declare allSkills: string[];

  static styles = css`
    :host {
      display: block;
      position: relative;
    }

    .timeline {
      position: relative;
      max-width: 800px;
      margin: 0 auto;
    }

    .timeline-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .timeline-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--color-text, #2d3748);
      margin: 0 0 1rem 0;
      line-height: 1.2;
    }

    .timeline-subtitle {
      font-size: 1.125rem;
      color: var(--color-text-muted, #718096);
      margin: 0;
      line-height: 1.5;
    }

    .timeline-filters {
      display: flex;
      gap: 1rem;
      align-items: center;
      justify-content: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .filter-input {
      padding: 0.5rem 1rem;
      border: 1px solid var(--color-border, #e1e5e9);
      border-radius: 0.5rem;
      font-size: 0.875rem;
      background: var(--color-bg, white);
      color: var(--color-text, #2d3748);
    }

    .filter-input:focus {
      outline: none;
      border-color: var(--color-primary, #007acc);
      box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
    }

    .skills-summary {
      background: var(--color-bg-secondary, #f8f9fa);
      border-radius: 1rem;
      padding: 1.5rem;
      margin-bottom: 2rem;
      border: 1px solid var(--color-border, #e1e5e9);
    }

    .skills-summary h3 {
      margin: 0 0 1rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--color-text, #2d3748);
    }

    .skills-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .skill-cloud-tag {
      padding: 0.375rem 0.75rem;
      background: var(--color-primary, #007acc);
      color: white;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.025em;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .skill-cloud-tag:hover {
      background: var(--color-primary-dark, #005a9e);
      transform: translateY(-1px);
    }

    .skill-cloud-tag.active {
      background: var(--color-accent, #ff6b6b);
    }

    .timeline-content {
      position: relative;
    }

    .loading {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--color-text-muted, #718096);
    }

    .error {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--color-error, #e53e3e);
      background: var(--color-error-bg, #fed7d7);
      border-radius: 0.5rem;
      border: 1px solid var(--color-error, #e53e3e);
    }

    .no-results {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--color-text-muted, #718096);
      font-style: italic;
    }

    @media (max-width: 768px) {
      .timeline-title {
        font-size: 2rem;
      }

      .timeline-subtitle {
        font-size: 1rem;
      }

      .timeline-filters {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;
      }

      .skills-summary {
        padding: 1rem;
      }
    }
  `;

  constructor() {
    super();
    this.dataUrl = "/data/experience-data.json";
    this.showCompanySkills = false;
    this.filter = "";
    this.experienceData = [];
    this.isLoading = false;
    this.error = null;
    this.allSkills = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadExperienceData();
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
      this.extractAllSkills();
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

  private extractAllSkills() {
    const skillsSet = new Set<string>();

    this.experienceData.forEach((company) => {
      // Add company-level skills
      if (company.skills) {
        company.skills.forEach((skill) => skillsSet.add(skill));
      }

      // Add position-level skills
      company.positions.forEach((position) => {
        if (position.skills) {
          position.skills.forEach((skill) => skillsSet.add(skill));
        }
      });
    });

    this.allSkills = Array.from(skillsSet).sort();
  }

  private getFilteredPositions() {
    if (!this.filter) {
      return this.getAllPositions();
    }

    const filterLower = this.filter.toLowerCase();
    const filteredCompanies: CompanyData[] = [];

    this.experienceData.forEach((company) => {
      const matchingPositions = company.positions.filter(
        (position) => {
          // Check title, company name, description, or skills
          const matchesTitle = position.title
            .toLowerCase()
            .includes(filterLower);
          const matchesCompany = company.company
            .toLowerCase()
            .includes(filterLower);
          const matchesDescription = position.description
            .toLowerCase()
            .includes(filterLower);
          const matchesSkills = position.skills?.some((skill) =>
            skill.toLowerCase().includes(filterLower)
          );
          const matchesCompanySkills = company.skills?.some((skill) =>
            skill.toLowerCase().includes(filterLower)
          );

          return (
            matchesTitle ||
            matchesCompany ||
            matchesDescription ||
            matchesSkills ||
            matchesCompanySkills
          );
        }
      );

      if (matchingPositions.length > 0) {
        filteredCompanies.push({
          ...company,
          positions: matchingPositions,
        });
      }
    });

    return filteredCompanies;
  }

  private getAllPositions() {
    return this.experienceData;
  }

  private handleFilterInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.filter = target.value;
  }

  private handleSkillClick(skill: string) {
    this.filter = skill;
    // Update the filter input
    const filterInput = this.shadowRoot?.querySelector(
      ".filter-input"
    ) as HTMLInputElement;
    if (filterInput) {
      filterInput.value = skill;
    }
  }

  private clearFilter() {
    this.filter = "";
    const filterInput = this.shadowRoot?.querySelector(
      ".filter-input"
    ) as HTMLInputElement;
    if (filterInput) {
      filterInput.value = "";
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

    const filteredPositions = this.getFilteredPositions();
    const hasResults =
      filteredPositions.length > 0 &&
      filteredPositions.some(
        (company) => company.positions.length > 0
      );

    return html`
      <div class="timeline">
        <div class="timeline-header">
          <h2 class="timeline-title">Career Timeline</h2>
          <p class="timeline-subtitle">
            My professional journey in technical writing,
            documentation, and software development
          </p>
        </div>

        <div class="timeline-filters">
          <input
            type="text"
            class="filter-input"
            placeholder="Filter by company, role, or skill..."
            .value=${this.filter}
            @input=${this.handleFilterInput}
          />
          ${this.filter
            ? html`
                <button
                  class="skill-cloud-tag"
                  @click=${this.clearFilter}
                  title="Clear filter"
                >
                  ✕ Clear
                </button>
              `
            : ""}
        </div>

        ${this.allSkills.length > 0
          ? html`
              <div class="skills-summary">
                <h3>Skills & Technologies</h3>
                <div class="skills-cloud">
                  ${this.allSkills.map(
                    (skill) => html`
                      <button
                        class="skill-cloud-tag ${this.filter === skill
                          ? "active"
                          : ""}"
                        @click=${() => this.handleSkillClick(skill)}
                        title="Filter by ${skill}"
                      >
                        ${skill}
                      </button>
                    `
                  )}
                </div>
              </div>
            `
          : ""}

        <div class="timeline-content">
          ${!hasResults
            ? html`
                <div class="no-results">
                  No positions found matching "${this.filter}". Try a
                  different search term.
                </div>
              `
            : ""}
          ${filteredPositions.map((company) =>
            company.positions.map(
              (position) => html`
                <kbr-timeline-entry
                  company=${company.company}
                  company-website=${company.companyWebsite || ""}
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
            )
          )}
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
