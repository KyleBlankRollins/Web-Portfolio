import { LitElement, html, css } from "lit";
import { customElement, state, property } from "lit/decorators.js";

/**
 * Blog Tag Filter Web Component
 *
 * This component displays all available tags and allows filtering the blog post list.
 * Works in conjunction with kbr-post-list to provide tag-based filtering.
 *
 * Usage: <kbr-tag-filter></kbr-tag-filter>
 */

interface BlogManifest {
  posts: any[];
  totalPosts: number;
  availableTags: string[];
  tagsWithCounts: { tag: string; count: number }[];
  generatedAt: string;
}

@customElement("kbr-tag-filter")
export default class KbrTagFilter extends LitElement {
  @property({ type: String, attribute: "active-tag" })
  declare activeTag: string | null;

  @state()
  private declare tagsWithCounts: { tag: string; count: number }[];

  @state()
  private declare isLoading: boolean;

  @state()
  private declare visibleTagCount: number;

  @state()
  private declare isExpanded: boolean;

  static styles = css`
    /* Host element - the <kbr-tag-filter> tag itself */
    :host {
      display: block;
      margin-bottom: 2rem;
    }

    .tag-filter-container {
      background: var(--bg-secondary, #f8f9fa);
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .filter-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .filter-title {
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
      font-size: 1rem;
    }

    .clear-filter-btn {
      background: none;
      border: 1px solid var(--border-color);
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
      color: var(--text-secondary);
      transition: all 0.2s ease;
    }

    .clear-filter-btn:hover {
      background: var(--accent-primary);
      color: white;
      border-color: var(--accent-primary);
    }

    .clear-filter-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .tags-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag-button {
      background: white;
      border: 1px solid var(--border-color);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s ease;
      color: var(--text-secondary);
    }

    .tag-button:hover {
      border-color: var(--accent-primary);
      color: var(--accent-primary);
      transform: translateY(-1px);
    }

    .tag-button.active {
      background: var(--accent-primary);
      border-color: var(--accent-primary);
      color: white;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: var(--text-secondary);
    }

    .error {
      color: var(--error-color);
      text-align: center;
      padding: 1rem;
      background: var(--error-bg);
      border-radius: 4px;
    }

    /* Tag count styles */
    .tag-count {
      opacity: 0.7;
      font-weight: normal;
      margin-left: 0.25rem;
    }

    .tag-button.active .tag-count {
      opacity: 1;
      font-weight: 500;
    }

    /* Expand/collapse controls */
    .expand-controls {
      margin-top: 1rem;
      text-align: center;
    }

    .expand-tags-btn {
      background: none;
      border: 1px solid var(--border-color);
      padding: 0.5rem 1rem;
      border-radius: 6px;
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }

    .expand-tags-btn:hover {
      border-color: var(--accent-primary);
      color: var(--accent-primary);
      background: var(--bg-primary);
    }

    .expand-tags-btn:focus {
      outline: 2px solid var(--accent-primary);
      outline-offset: 2px;
    }

    /* Dark theme support */
    @media (prefers-color-scheme: dark) {
      .tag-filter-container {
        background: var(--bg-secondary-dark);
      }

      .filter-title {
        color: var(--text-primary-dark);
      }

      .tag-button {
        background: var(--bg-primary-dark);
        border-color: var(--border-color-dark);
        color: var(--text-secondary-dark);
      }

      .tag-button:hover {
        border-color: var(--accent-primary-dark);
        color: var(--accent-primary-dark);
      }

      .tag-button.active {
        background: var(--accent-primary-dark);
        border-color: var(--accent-primary-dark);
      }

      .expand-tags-btn {
        border-color: var(--border-color-dark);
        color: var(--text-secondary-dark);
      }

      .expand-tags-btn:hover {
        border-color: var(--accent-primary-dark);
        color: var(--accent-primary-dark);
        background: var(--bg-primary-dark);
      }
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .tag-filter-container {
        padding: 1rem;
      }

      .filter-header {
        flex-direction: column;
        align-items: stretch;
        text-align: center;
      }

      .tags-grid {
        justify-content: center;
      }
    }
  `;

  constructor() {
    super();

    // Initialize properties
    this.activeTag = null;
    this.tagsWithCounts = [];
    this.isLoading = false;
    this.visibleTagCount = 5;
    this.isExpanded = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadAvailableTags();
  }

  updated(changedProperties: Map<PropertyKey, unknown>) {
    super.updated(changedProperties);

    if (
      changedProperties.has("activeTag") &&
      !this.isLoading &&
      this.tagsWithCounts.length > 0
    ) {
      // Property change handling is automatic with Lit's reactive update cycle
      this.requestUpdate();
    }
  }

  firstUpdated() {
    // Check for URL parameters after first render
    this.checkUrlParameters();
  }

  /**
   * Check URL query parameters for tag filtering
   */
  private checkUrlParameters(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const tagParam = urlParams.get("tag");

    if (tagParam) {
      // Set both the internal state and the attribute
      this.activeTag = tagParam;

      // Use a small delay to ensure other components are ready
      setTimeout(() => {
        this.notifyPostList(tagParam);
      }, 50);
    }
  }

  /**
   * Load available tags from blog manifest
   */
  private async loadAvailableTags(): Promise<void> {
    this.isLoading = true;

    try {
      // Use relative URL for manifest
      const manifestUrl = `/data/blog-manifest.json`;

      const response = await fetch(manifestUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to load tags: ${response.status} ${response.statusText}`
        );
      }

      const manifest: BlogManifest = await response.json();
      this.tagsWithCounts = manifest.tagsWithCounts || [];
      this.isLoading = false;

      // Check for URL parameter after tags are loaded and rendered
      this.checkUrlParameters();
    } catch (error) {
      console.error("Failed to load available tags:", error);
      this.isLoading = false;
    }
  }

  render() {
    if (this.isLoading) {
      return html`
        <div class="tag-filter-container">
          <div class="loading">Loading tags...</div>
        </div>
      `;
    }

    if (this.tagsWithCounts.length === 0) {
      return html`
        <div class="tag-filter-container">
          <div class="error">
            No tags found. Make sure blog posts have tags defined.
          </div>
        </div>
      `;
    }

    // Determine how many tags to show
    const tagsToShow = this.isExpanded
      ? this.tagsWithCounts
      : this.tagsWithCounts.slice(0, this.visibleTagCount);

    return html`
      <div class="tag-filter-container">
        <div class="filter-header">
          <div class="ui-label filter-title">Filter by Tag</div>
        </div>
        <div class="tags-grid">
          ${tagsToShow.map(
            ({ tag, count }) =>
              html`<button
                class="tag-button ${this.activeTag === tag
                  ? "active"
                  : ""}"
                @click="${() => this.handleTagClick(tag)}"
                data-tag="${tag}"
              >
                ${tag} <span class="tag-count">(${count})</span>
              </button>`
          )}
        </div>
        ${this.tagsWithCounts.length > this.visibleTagCount
          ? html`<div class="expand-controls">
              ${this.renderExpandButton()}
            </div>`
          : ""}
      </div>
    `;
  }

  private renderExpandButton() {
    if (this.isExpanded) {
      return html`<button
        class="expand-tags-btn"
        @click="${this.collapseTags}"
      >
        Less tags
      </button>`;
    } else {
      const remaining =
        this.tagsWithCounts.length - this.visibleTagCount;
      return html`<button
        class="expand-tags-btn"
        @click="${this.expandTags}"
      >
        More tags (+${remaining})
      </button>`;
    }
  }

  /**
   * Handle tag filter selection
   */
  private handleTagClick(tag: string): void {
    // Toggle tag selection - if same tag is clicked, clear filter
    if (this.activeTag === tag) {
      this.clearFilter();
    } else {
      // Clear any existing filter and set new tag
      this.setActiveTag(tag);
    }
  }

  /**
   * Set active tag and update URL
   */
  private setActiveTag(tag: string): void {
    this.activeTag = tag;

    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set("tag", tag);
    window.history.replaceState({}, "", url.toString());

    // Notify post list component
    this.notifyPostList(tag);
  }

  /**
   * Clear active filter
   */
  private clearFilter(): void {
    this.activeTag = null;

    // Remove tag from URL
    const url = new URL(window.location.href);
    url.searchParams.delete("tag");
    window.history.replaceState({}, "", url.toString());

    // Notify post list component
    this.notifyPostList(null);
  }

  /**
   * Notify the post list component of filter changes
   */
  private notifyPostList(tag: string | null): void {
    // Dispatch custom event that bubbles up to parent components
    this.dispatchEvent(
      new CustomEvent("tag-changed", {
        detail: { tag },
        bubbles: true,
        composed: true, // This allows the event to cross shadow DOM boundaries
      })
    );
  }

  /**
   * Expand to show more tags
   */
  private expandTags(): void {
    this.isExpanded = true;
  }

  /**
   * Collapse to show fewer tags
   */
  private collapseTags(): void {
    this.isExpanded = false;
  }
}
