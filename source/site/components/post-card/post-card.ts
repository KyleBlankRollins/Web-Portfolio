import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { postCardStyles } from "./post-card.style.js";
import {
  typographyStyles,
  buttonStyles,
  layoutStyles,
  reducedMotionStyles,
} from "../../styles/shared-styles.js";

/**
 * Blog Post Card Web Component
 *
 * A reusable card component for displaying individual blog posts in lists.
 * Used by kbr-post-list component.
 *
 * Usage: <kbr-post-card title="..." description="..." date="..." tags='["tag1", "tag2"]' url="..."></kbr-post-card>
 */

interface PostCardData {
  title: string;
  description: string;
  date: string;
  formattedDate: string;
  tags: string[];
  url: string;
}

@customElement("kbr-post-card")
export class KbrPostCard extends LitElement {
  @property({ type: String }) declare title: string;
  @property({ type: String }) declare description: string;
  @property({ type: String }) declare date: string;
  @property({ type: String, attribute: "formatted-date" })
  declare formattedDate: string;
  @property({ type: String }) declare tags: string;
  @property({ type: String }) declare url: string;

  private get parsedTags(): string[] {
    try {
      return JSON.parse(this.tags || "[]");
    } catch {
      // Fallback to comma-separated parsing
      return (this.tags || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
    }
  }

  private get displayDate(): string {
    return this.formattedDate || this.date || "";
  }

  private get displayTitle(): string {
    return this.title || "Untitled Post";
  }

  private get displayUrl(): string {
    return this.url || "#";
  }

  static styles = [
    typographyStyles,
    buttonStyles,
    layoutStyles,
    postCardStyles,
    reducedMotionStyles,
  ];

  render() {
    return html`
      <article class="post-card">
        <div class="post-card-content">
          <header class="post-card-header">
            <h3 class="post-card-title">
              <a href="${this.displayUrl}" class="post-title-link"
                >${this.displayTitle}</a
              >
            </h3>
            ${this.displayDate
              ? html`
                  <div class="post-card-date">
                    <time datetime="${this.date || ""}"
                      >${this.displayDate}</time
                    >
                  </div>
                `
              : ""}
          </header>

          ${this.description
            ? html`
                <div class="post-card-description">
                  <p>${this.description}</p>
                </div>
              `
            : ""}
          ${this.parsedTags.length > 0
            ? html`
                <div class="post-card-tags">
                  <div class="tag-list">
                    ${this.parsedTags.map(
                      (tag) =>
                        html`<button
                          class="post-tag"
                          data-tag="${tag}"
                          @click="${this.handleTagClick}"
                        >
                          ${tag}
                        </button>`
                    )}
                  </div>
                </div>
              `
            : ""}
        </div>
      </article>
    `;
  }

  private handleTagClick(e: Event): void {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const tag = target.dataset.tag;

    if (tag) {
      // Navigate to blog page with tag filter (consistent with other tag buttons)
      const blogUrl = new URL("/blog.html", window.location.origin);
      blogUrl.searchParams.set("tag", tag);
      window.location.href = blogUrl.href;
    }
  }
}

export { type PostCardData };
