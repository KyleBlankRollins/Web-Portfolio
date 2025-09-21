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
  generatedAt: string;
}

class KbrTagFilter extends HTMLElement {
  private availableTags: string[] = [];
  private activeTag: string | null = null;
  private isLoading: boolean = false;

  static get observedAttributes() {
    return ["active-tag"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.loadAvailableTags();

    // Check for URL parameter on initial load
    this.checkUrlParameters();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ) {
    if (oldValue === newValue) return;

    if (name === "active-tag") {
      this.activeTag = newValue;
      this.renderWithEvents();
    }
  }

  /**
   * Check URL query parameters for tag filtering
   */
  private checkUrlParameters(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const tagParam = urlParams.get("tag");

    if (tagParam) {
      this.activeTag = tagParam;
      this.notifyPostList(tagParam);
    }
  }

  /**
   * Load available tags from blog manifest
   */
  private async loadAvailableTags(): Promise<void> {
    this.isLoading = true;
    this.render();

    try {
      // Use absolute URL for manifest
      const manifestUrl = `${window.location.origin}/blog-manifest.json`;

      const response = await fetch(manifestUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to load tags: ${response.status} ${response.statusText}`
        );
      }

      const manifest: BlogManifest = await response.json();

      this.availableTags = manifest.availableTags || [];

      this.isLoading = false;
      this.renderWithEvents();
    } catch (error) {
      console.error("Failed to load available tags:", error);
      this.isLoading = false;
      this.renderError();
    }
  }

  /**
   * Handle tag filter selection
   */
  private handleTagClick(tag: string): void {
    // Toggle tag selection
    if (this.activeTag === tag) {
      this.clearFilter();
    } else {
      this.setActiveTag(tag);
    }
  }

  /**
   * Set active tag and update URL
   */
  private setActiveTag(tag: string): void {
    this.activeTag = tag;
    this.setAttribute("active-tag", tag);

    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set("tag", tag);
    window.history.replaceState({}, "", url.toString());

    // Notify post list component
    this.notifyPostList(tag);

    this.renderWithEvents();
  }

  /**
   * Clear active filter
   */
  private clearFilter(): void {
    this.activeTag = null;
    this.removeAttribute("active-tag");

    // Remove tag from URL
    const url = new URL(window.location.href);
    url.searchParams.delete("tag");
    window.history.replaceState({}, "", url.toString());

    // Notify post list component
    this.notifyPostList(null);

    this.renderWithEvents();
  }

  /**
   * Notify the post list component of filter changes
   */
  private notifyPostList(tag: string | null): void {
    const postListElement = document.querySelector("kbr-post-list");
    if (postListElement) {
      if (tag) {
        postListElement.setAttribute("filter", tag);
      } else {
        postListElement.removeAttribute("filter");
      }
    }
  }

  /**
   * Render the component
   */
  private render(): void {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/styles/component-typography.css">
      <link rel="stylesheet" href="/components/tag-filter.css">
      <div class="tag-filter-container">
        ${this.renderContent()}
      </div>
    `;
  }

  /**
   * Render the main content
   */
  private renderContent(): string {
    if (this.isLoading) {
      return '<div class="loading">Loading tags...</div>';
    }

    if (this.availableTags.length === 0) {
      return '<div class="error">No tags found. Make sure blog posts have tags defined.</div>';
    }

    const tagButtons = this.availableTags
      .map(
        (tag) => `
        <button 
          class="tag-button ${this.activeTag === tag ? "active" : ""}"
          data-tag="${tag}"
        >
          ${tag}
        </button>
      `
      )
      .join("");

    return `
      <div class="filter-header">
        <div class="ui-label filter-title">Filter by Tag</div>
        <button 
          class="clear-filter-btn" 
          ${!this.activeTag ? "disabled" : ""}
        >
          Clear Filter
        </button>
      </div>
      <div class="tags-grid">
        ${tagButtons}
      </div>
    `;
  }

  /**
   * Render error state
   */
  private renderError(): void {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/styles/component-typography.css">
      <link rel="stylesheet" href="/components/tag-filter.css">
      <div class="tag-filter-container">
        <div class="error">Failed to load tags. Please try again.</div>
      </div>
    `;
  }

  /**
   * Add event listeners after rendering
   */
  private addEventListeners(): void {
    if (!this.shadowRoot) return;

    // Tag button clicks
    const tagButtons =
      this.shadowRoot.querySelectorAll(".tag-button");
    tagButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const tag = target.getAttribute("data-tag");
        if (tag) {
          this.handleTagClick(tag);
        }
      });
    });

    // Clear filter button
    const clearButton = this.shadowRoot.querySelector(
      ".clear-filter-btn"
    );
    if (clearButton) {
      clearButton.addEventListener("click", () => {
        this.clearFilter();
      });
    }
  }

  /**
   * Render the component with event listeners
   */
  private renderWithEvents(): void {
    this.render();
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      this.addEventListeners();
    }, 10);
  }
}

// Register the custom element
customElements.define("kbr-tag-filter", KbrTagFilter);

export default KbrTagFilter;
