import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  typographyStyles,
  buttonStyles,
  layoutStyles,
  reducedMotionStyles,
} from "../../styles/shared-styles.js";
import { timelineEntryStyles } from "./timeline-entry.style.js";

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

  static styles = [
    typographyStyles,
    buttonStyles,
    layoutStyles,
    timelineEntryStyles,
    reducedMotionStyles,
  ];

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
    const formattedDescription = this.formatDescription(this.description);

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

        ${
          formattedDescription
            ? html` <div class="description">${formattedDescription}</div> `
            : ""
        }
        ${
          skills.length > 0
            ? html`
                <div class="skills">
                  ${skills.map(
                    (skill) => html` <span class="skill-tag">${skill}</span> `
                  )}
                </div>
              `
            : ""
        }
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "kbr-timeline-entry": KbrTimelineEntry;
  }
}
