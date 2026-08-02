import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { postSeriesStyles } from "./post-series.style.js";
import { reducedMotionStyles } from "../../styles/shared-styles.js";
import { loadBlogManifest } from "../../data/blog-manifest.js";
import type { BlogPostManifestEntry } from "../../../shared/manifest-types.js";

/**
 * Post Series Component
 *
 * Displays navigation for a series of related blog posts with progressive disclosure.
 * Fetches blog manifest to find all posts in the series and provides prev/next navigation.
 *
 * Usage:
 *   <kbr-post-series series-name="Series Name" current-part="2"></kbr-post-series>
 *
 * Properties:
 *   - series-name: Name of the series
 *   - current-part: Current part number (1-based)
 */

@customElement("kbr-post-series")
export class KbrPostSeries extends LitElement {
  @property({ type: String, attribute: "series-name" })
  declare seriesName: string;

  @property({ type: Number, attribute: "current-part" })
  declare currentPart: number;

  @state()
  declare private isExpanded: boolean;

  @state()
  declare private seriesPosts: BlogPostManifestEntry[];

  @state()
  declare private loading: boolean;

  @state()
  declare private error: string | null;

  static styles = [postSeriesStyles, reducedMotionStyles];

  constructor() {
    super();
    this.seriesName = "";
    this.currentPart = 1;
    this.isExpanded = false;
    this.seriesPosts = [];
    this.loading = true;
    this.error = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadSeriesData();
  }

  private async loadSeriesData() {
    try {
      this.loading = true;
      this.error = null;

      const manifest = await loadBlogManifest();

      // Filter posts by series name and sort by part number
      this.seriesPosts = manifest.posts
        .filter((post) => post.series?.name === this.seriesName)
        .sort((a, b) => (a.series?.part || 0) - (b.series?.part || 0));

      if (this.seriesPosts.length === 0) {
        this.error = `No posts found for series "${this.seriesName}"`;
      }

      this.loading = false;
    } catch (err) {
      this.error =
        err instanceof Error ? err.message : "Failed to load series data";
      this.loading = false;
    }
  }

  private toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }

  private getCurrentIndex(): number {
    return this.seriesPosts.findIndex(
      (post) => post.series?.part === this.currentPart
    );
  }

  private getPrevPost(): BlogPostManifestEntry | null {
    const currentIndex = this.getCurrentIndex();
    return currentIndex > 0 ? this.seriesPosts[currentIndex - 1] : null;
  }

  private getNextPost(): BlogPostManifestEntry | null {
    const currentIndex = this.getCurrentIndex();
    return currentIndex < this.seriesPosts.length - 1
      ? this.seriesPosts[currentIndex + 1]
      : null;
  }

  private renderHeader() {
    const total = this.seriesPosts.length;
    const positionText = `Post ${this.currentPart + 1} of ${total}`;

    return html`
      <button
        class="series-toggle"
        @click="${this.toggleExpanded}"
        aria-expanded="${this.isExpanded}"
        aria-label="${this.isExpanded ? "Collapse" : "Expand"} series"
      >
        <div class="series-info">
          <h3 class="series-name">${this.seriesName}</h3>
          <p class="series-position">${positionText}</p>
        </div>
        <svg
          class="series-toggle-icon ${
            this.isExpanded ? "expanded" : "collapsed"
          }"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </button>
    `;
  }

  private renderNavigation() {
    const prevPost = this.getPrevPost();
    const nextPost = this.getNextPost();

    return html`
      <div class="series-navigation">
        ${
          prevPost
            ? html`
                <a href="${prevPost.url}" class="nav-button">
                  <span class="nav-text">${prevPost.title}</span>
                  <span class="nav-arrow">←</span>
                </a>
              `
            : ""
        }
        ${
          nextPost
            ? html`
                <a href="${nextPost.url}" class="nav-button">
                  <span class="nav-text">${nextPost.title}</span>
                  <span class="nav-arrow">→</span>
                </a>
              `
            : ""
        }
      </div>
    `;
  }

  private renderPostList() {
    return html`
      <ul class="series-list">
        ${this.seriesPosts.map(
          (post) => html`
            <li class="series-item">
              <a
                href="${post.url}"
                class="series-link ${
                  post.series?.part === this.currentPart ? "current" : ""
                }"
              >
                <span class="part-number"
                  >${
                    post.series?.part === 0
                      ? "Series Summary:"
                      : `Part ${post.series?.part}:`
                  }</span
                >
                <span class="post-title">${post.title}</span>
              </a>
            </li>
          `
        )}
      </ul>
    `;
  }

  render() {
    if (this.loading) {
      return html`
        <div class="series-container">
          <p>Loading series information...</p>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="series-container">
          <p class="error-message">${this.error}</p>
        </div>
      `;
    }

    return html`
      <div class="series-container">
        ${this.renderHeader()}
        <div class="series-content ${this.isExpanded ? "" : "collapsed"}">
          ${this.renderNavigation()} ${this.renderPostList()}
        </div>
      </div>
    `;
  }
}
