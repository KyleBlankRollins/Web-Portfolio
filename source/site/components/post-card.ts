import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  typographyStyles,
  buttonStyles,
  layoutStyles,
} from "../styles/shared-styles.js";

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
    css`
      /* Host element - the <kbr-post-card> tag itself */
      :host {
        display: block;
        margin-bottom: var(--space-lg, 2rem);
      }

      .post-card {
        background: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: 12px;
        padding: var(--space-lg, 2rem);
        transition: all var(--transition-normal);
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .post-card:hover {
        box-shadow: 0 8px 25px var(--color-shadow);
        transform: translateY(-2px);
        border-color: var(--color-border-dark);
      }

      .post-card-content {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      /* Header section */
      .post-card-header {
        margin-bottom: var(--space-md);
      }

      .post-card-title {
        margin: 0 0 var(--space-sm) 0;
        font-weight: 600;
      }

      .post-title-link {
        color: var(--color-primary);
        text-decoration: none;
        transition: color var(--transition-fast);
      }

      .post-title-link:hover {
        color: var(--color-primary-dark);
        text-decoration: underline;
      }

      .post-title-link:focus {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
        border-radius: 4px;
      }

      .post-card-date {
        margin-bottom: var(--space-xs);
      }

      .post-card-date time {
        color: var(--color-text-muted);
        font-size: 0.9rem;
        font-style: italic;
      }

      /* Description section */
      .post-card-description {
        margin-bottom: var(--space-md);
        flex-grow: 1;
      }

      .post-card-description p {
        color: var(--color-text, #212121);
        line-height: var(--line-height-base);
        margin: 0;
      }

      /* Tags section */
      .post-card-tags {
        margin-bottom: var(--space-md);
      }

      .tag-list {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-xs, 0.5rem);
      }

      .post-tag {
        background-color: var(--color-background-secondary);
        border: 1px solid var(--color-border);
        color: var(--color-text);
        padding: var(--space-xs) var(--space-sm);
        border-radius: 14px;
        font-size: 0.75rem;
        font-weight: 500;
        cursor: pointer;
        transition: all var(--transition-fast);
        text-decoration: none;
      }

      .post-tag:hover {
        background-color: var(--color-accent);
        color: var(--color-text-inverse);
        transform: translateY(-1px);
        box-shadow: 0 2px 4px var(--color-shadow);
      }

      .post-tag:focus {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }

      /* Footer section */
      .post-card-footer {
        margin-top: auto;
        padding-top: var(--space-sm);
        border-top: 1px solid var(--color-border);
      }

      .read-more-link {
        color: var(--color-primary);
        text-decoration: none;
        font-weight: 500;
        font-size: 0.9rem;
        transition: all var(--transition-fast);
        display: inline-flex;
        align-items: center;
        gap: var(--space-xs);
      }

      .read-more-link:hover {
        color: var(--color-primary-dark);
        transform: translateX(4px);
      }

      .read-more-link:focus {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
        border-radius: 4px;
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .post-card {
          padding: var(--space-md);
        }

        .post-card-title {
          font-size: var(--font-size-lg);
        }

        .tag-list {
          gap: var(--space-xs);
        }

        .post-tag {
          font-size: 0.7rem;
          padding: calc(var(--space-xs) * 0.8) var(--space-xs);
        }
      }

      /* Animation preferences */
      @media (prefers-reduced-motion: reduce) {
        .post-card,
        .post-title-link,
        .post-tag,
        .read-more-link {
          transition: none;
        }

        .post-card:hover {
          transform: none;
        }

        .post-tag:hover {
          transform: none;
        }

        .read-more-link:hover {
          transform: none;
        }
      }
    `,
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

          <footer class="post-card-footer">
            <a href="${this.displayUrl}" class="read-more-link"
              >Read more →</a
            >
          </footer>
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
