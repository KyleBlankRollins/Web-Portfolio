import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * Timeline Entry Web Component
 *
 * A component for displaying individual job positions in a career timeline.
 * Used by kbr-timeline component.
 *
 * Usage: <kbr-timeline-entry title="..." description="..." skills='["skill1", "skill2"]'></kbr-timeline-entry>
 */

@customElement("kbr-timeline-entry")
export class KbrTimelineEntry extends LitElement {
  @property({ type: String }) declare title: string;
  @property({ type: String, attribute: "start-date" })
  declare startDate: string;
  @property({ type: String, attribute: "end-date" })
  declare endDate: string;
  @property({ type: String, attribute: "date-range" })
  declare dateRange: string;
  @property({ type: String }) declare duration: string;
  @property({ type: String }) declare location: string;
  @property({ type: String, attribute: "employment-type" })
  declare employmentType: string;
  @property({ type: String }) declare description: string;
  @property({ type: String }) declare skills: string; // JSON string of skills array

  static styles = css`
    :host {
      display: block;
      position: relative;
      margin-bottom: 2rem;
    }

    .timeline-entry {
      background: var(--color-bg-secondary);
      border-radius: 8px;
      padding: 1.5rem;
      border: 1px solid var(--color-border);
      transition: all 0.2s ease;
    }

    .timeline-entry:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .entry-title {
      flex: 1;
    }

    .job-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-text);
      margin: 0;
      line-height: 1.3;
    }

    .entry-meta {
      text-align: right;
      font-size: 0.875rem;
      color: var(--color-text-muted);
      line-height: 1.4;
    }

    .date-range {
      font-weight: 500;
      color: var(--color-text);
    }

    .duration,
    .employment-type,
    .location {
      display: block;
      margin-top: 0.25rem;
    }

    .description {
      margin-bottom: 1rem;
      color: var(--color-text);
      line-height: 1.6;
      white-space: pre-line;
    }

    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .skill-tag {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: var(--color-background-secondary);
      color: white;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.025em;
      transition: background-color 0.2s ease;
    }

    @media (max-width: 768px) {
      :host {
        margin-bottom: 1.5rem;
      }

      .timeline-entry {
        padding: 1rem;
      }

      .entry-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .entry-meta {
        text-align: left;
      }

      .job-title {
        font-size: 1.125rem;
      }
    }
  `;

  private get parsedSkills(): string[] {
    try {
      return this.skills ? JSON.parse(this.skills) : [];
    } catch {
      return [];
    }
  }

  private formatDescription(description: string): string {
    if (!description) return "";

    // Replace escaped characters with actual characters
    // \n -> newlines (works with white-space: pre-line CSS)
    // \" -> actual quote characters
    return description.replace(/\\n/g, "\n").replace(/\\"/g, '"');
  }

  render() {
    const skills = this.parsedSkills;
    const formattedDescription = this.formatDescription(
      this.description
    );

    return html`
      <div class="timeline-entry">
        <div class="entry-header">
          <div class="entry-title">
            <h3 class="job-title">${this.title}</h3>
          </div>
          <div class="entry-meta">
            <div class="date-range">${this.dateRange}</div>
            <div class="duration">${this.duration}</div>
            <div class="employment-type">${this.employmentType}</div>
            <div class="location">${this.location}</div>
          </div>
        </div>

        ${formattedDescription
          ? html`
              <div class="description">${formattedDescription}</div>
            `
          : ""}
        ${skills.length > 0
          ? html`
              <div class="skills">
                ${skills.map(
                  (skill) => html`
                    <span class="skill-tag">${skill}</span>
                  `
                )}
              </div>
            `
          : ""}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "kbr-timeline-entry": KbrTimelineEntry;
  }
}
