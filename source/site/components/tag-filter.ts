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
      <style>
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
          color: var(--text-primary, #333);
          margin: 0;
          font-size: 1rem;
        }

        .clear-filter-btn {
          background: none;
          border: 1px solid var(--border-color, #ddd);
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
          color: var(--text-secondary, #666);
          transition: all 0.2s ease;
        }

        .clear-filter-btn:hover {
          background: var(--accent-primary, #007acc);
          color: white;
          border-color: var(--accent-primary, #007acc);
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
          border: 1px solid var(--border-color, #ddd);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          color: var(--text-secondary, #666);
        }

        .tag-button:hover {
          border-color: var(--accent-primary, #007acc);
          color: var(--accent-primary, #007acc);
          transform: translateY(-1px);
        }

        .tag-button.active {
          background: var(--accent-primary, #007acc);
          border-color: var(--accent-primary, #007acc);
          color: white;
        }

        .loading {
          text-align: center;
          padding: 2rem;
          color: var(--text-secondary, #666);
        }

        .error {
          color: var(--error-color, #dc3545);
          text-align: center;
          padding: 1rem;
          background: var(--error-bg, #f8d7da);
          border-radius: 4px;
        }

        /* Dark theme support */
        @media (prefers-color-scheme: dark) {
          .tag-filter-container {
            background: var(--bg-secondary-dark, #2a2a2a);
          }
          
          .filter-title {
            color: var(--text-primary-dark, #fff);
          }
          
          .tag-button {
            background: var(--bg-primary-dark, #1a1a1a);
            border-color: var(--border-color-dark, #444);
            color: var(--text-secondary-dark, #aaa);
          }
          
          .tag-button:hover {
            border-color: var(--accent-primary-dark, #4fc3f7);
            color: var(--accent-primary-dark, #4fc3f7);
          }
          
          .tag-button.active {
            background: var(--accent-primary-dark, #4fc3f7);
            border-color: var(--accent-primary-dark, #4fc3f7);
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
      </style>

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
        <h3 class="filter-title">Filter by Tag</h3>
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
      <style>
        .error {
          color: var(--error-color, #dc3545);
          text-align: center;
          padding: 1rem;
          background: var(--error-bg, #f8d7da);
          border-radius: 4px;
        }
      </style>
      <div class="error">Failed to load tags. Please try again.</div>
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
