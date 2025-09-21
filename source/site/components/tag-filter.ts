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

class KbrTagFilter extends HTMLElement {
  private tagsWithCounts: { tag: string; count: number }[] = [];
  private activeTag: string | null = null;
  private isLoading: boolean = false;
  private visibleTagCount: number = 5;
  private isExpanded: boolean = false;

  static get observedAttributes() {
    return ["active-tag"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.loadAvailableTags();

    // Don't check URL parameters immediately - do it after tags are loaded
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ) {
    if (oldValue === newValue) return;

    if (name != "active-tag") return;

    // Update internal state to match the attribute
    this.activeTag = newValue || null;

    // Only re-render if the component is fully loaded
    if (!this.isLoading && this.tagsWithCounts.length > 0) {
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
      // Set both the internal state and the attribute
      this.activeTag = tagParam;
      this.setAttribute("active-tag", tagParam);

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

      this.tagsWithCounts = manifest.tagsWithCounts || [];

      this.isLoading = false;
      this.renderWithEvents();

      // Check for URL parameter after tags are loaded and rendered
      this.checkUrlParameters();
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

    // Set the attribute (this will trigger attributeChangedCallback which handles rendering)
    this.setAttribute("active-tag", tag);
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

    // Remove the attribute (this will trigger attributeChangedCallback which handles rendering)
    this.removeAttribute("active-tag");
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

    // Don't manipulate attributes to avoid recursion - let the event system handle it
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

    if (this.tagsWithCounts.length === 0) {
      return '<div class="error">No tags found. Make sure blog posts have tags defined.</div>';
    }

    // Determine how many tags to show
    const tagsToShow = this.isExpanded
      ? this.tagsWithCounts
      : this.tagsWithCounts.slice(0, this.visibleTagCount);

    const tagButtons = tagsToShow
      .map(
        ({ tag, count }) => `
        <button 
          class="tag-button ${this.activeTag === tag ? "active" : ""}"
          data-tag="${tag}"
        >
          ${tag} <span class="tag-count">(${count})</span>
        </button>
      `
      )
      .join("");

    // Show more/less button logic
    let expandButton = "";
    if (this.tagsWithCounts.length > this.visibleTagCount) {
      if (this.isExpanded) {
        expandButton = `<button class="expand-tags-btn" data-action="collapse-tags">Less tags</button>`;
      } else {
        const remaining =
          this.tagsWithCounts.length - this.visibleTagCount;
        expandButton = `<button class="expand-tags-btn" data-action="expand-tags">More tags (+${remaining})</button>`;
      }
    }

    return `
      <div class="filter-header">
        <div class="ui-label filter-title">Filter by Tag</div>
      </div>
      <div class="tags-grid">
        ${tagButtons}
      </div>
      ${
        expandButton
          ? `<div class="expand-controls">${expandButton}</div>`
          : ""
      }
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
        e.preventDefault();
        e.stopPropagation();

        // Get the button element even if span was clicked
        const target = (e.target as HTMLElement).closest(
          ".tag-button"
        ) as HTMLElement;
        if (target) {
          const tag = target.getAttribute("data-tag");
          if (tag) {
            this.handleTagClick(tag);
          }
        }
      });
    });

    // Expand/collapse button
    const expandButton = this.shadowRoot.querySelector(
      ".expand-tags-btn"
    );
    if (expandButton) {
      expandButton.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const action = target.getAttribute("data-action");
        if (action === "expand-tags") {
          this.expandTags();
        } else if (action === "collapse-tags") {
          this.collapseTags();
        }
      });
    }
  }

  /**
   * Expand to show more tags
   */
  private expandTags(): void {
    this.isExpanded = true;
    this.renderWithEvents();
  }

  /**
   * Collapse to show fewer tags
   */
  private collapseTags(): void {
    this.isExpanded = false;
    this.renderWithEvents();
  }

  /**
   * Render the component with event listeners
   */
  private renderWithEvents(): void {
    this.render();
    // Use requestAnimationFrame for better timing
    requestAnimationFrame(() => {
      this.addEventListeners();
    });
  }
}

// Register the custom element
customElements.define("kbr-tag-filter", KbrTagFilter);

export default KbrTagFilter;
