import { LitElement, html, css } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import {
  typographyStyles,
  buttonStyles,
  layoutStyles,
} from "../styles/shared-styles.js";

/**
 * Blog Post List Web Component
 *
 * This component displays a list of blog posts with metadata from their markdown files.
 * Supports filtering by tags and pagination (5 posts per page).
 *
 * Usage: <kbr-post-list></kbr-post-list>
 */

interface BlogPostMetadata {
  title: string;
  description: string;
  date: string;
  formattedDate: string;
  tags: string[];
  url: string;
  filename: string;
  keywords?: string;
}

interface BlogManifest {
  posts: BlogPostMetadata[];
  totalPosts: number;
  generatedAt: string;
}

@customElement("kbr-post-list")
export class KbrPostList extends LitElement {
  @property({ type: Number, attribute: "posts-per-page" })
  declare postsPerPage: number;

  @state()
  private declare posts: BlogPostMetadata[];

  @state()
  private declare filteredPosts: BlogPostMetadata[];

  @state()
  private declare currentFilter: string | null;

  @state()
  private declare currentPage: number;

  @state()
  private declare isLoading: boolean;

  private boundHandleTagFilterChange: (event: Event) => void;

  static styles = [
    typographyStyles,
    buttonStyles,
    layoutStyles,
    css`
      /* Host element - the <kbr-post-list> tag itself */
      :host {
        display: block;
        width: 100%;
      }

      .post-list-container {
        max-width: var(--content-max-width);
        margin: 0 auto;
        padding: var(--space-lg);
      }

      /* Header */
      .post-list-header {
        margin-bottom: var(--space-xl);
        text-align: center;
      }

      .post-list-header h2 {
        color: var(--color-primary);
        margin: 0;
        font-weight: 600;
      }

      /* Posts grid */
      .post-list-grid {
        display: grid;
        gap: var(--space-xl);
        margin-bottom: var(--space-xl);
      }

      /* Loading state */
      .post-list-loading {
        text-align: center;
        padding: var(--space-2xl) var(--space-lg);
      }

      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--color-border);
        border-top: 3px solid var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto var(--space-md) auto;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .post-list-loading p {
        color: var(--color-text-muted);
        font-size: var(--font-size-lg);
      }

      /* Empty state */
      .post-list-empty {
        text-align: center;
        padding: var(--space-2xl) var(--space-lg);
        color: var(--color-text-muted);
      }

      .post-list-empty p {
        font-size: var(--font-size-lg);
        margin-bottom: var(--space-lg);
      }

      /* Error state */
      .post-list-error {
        text-align: center;
        padding: var(--space-2xl) var(--space-lg);
        color: var(--color-text);
      }

      .post-list-error h2 {
        color: var(--color-primary);
        margin-bottom: var(--space-md);
      }

      .post-list-error p {
        color: var(--color-text-muted);
        font-size: var(--font-size-lg);
      }

      /* Pagination */
      .post-list-pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--space-sm);
        margin-top: var(--space-xl);
        flex-wrap: wrap;
      }

      .pagination-btn {
        background: var(--color-background);
        border: 1px solid var(--color-border);
        color: var(--color-text);
        padding: var(--space-sm) var(--space-md);
        border-radius: 6px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all var(--transition-fast);
        min-width: 44px;
        text-align: center;
      }

      .pagination-btn:hover:not([disabled]) {
        background: var(--color-background-secondary);
        border-color: var(--color-border-dark);
        transform: translateY(-1px);
      }

      .pagination-btn:focus {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }

      .pagination-btn.active {
        background: var(--color-primary);
        color: var(--color-text-inverse);
        border-color: var(--color-primary);
      }

      .pagination-btn[disabled] {
        background: var(--color-background-secondary);
        color: var(--color-text-muted);
        cursor: not-allowed;
        opacity: 0.6;
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .post-list-container {
          padding: var(--space-md);
        }

        .post-list-pagination {
          gap: var(--space-xs);
        }

        .pagination-btn {
          padding: var(--space-xs) var(--space-sm);
          font-size: 0.8rem;
          min-width: 36px;
        }

        .post-list-loading,
        .post-list-empty,
        .post-list-error {
          padding: var(--space-xl) var(--space-md);
        }
      }

      @media (max-width: 480px) {
        .post-list-container {
          padding: var(--space-sm);
        }

        .post-list-pagination {
          flex-direction: column;
          gap: var(--space-xs);
        }

        .pagination-btn {
          width: 100%;
          max-width: 200px;
        }
      }

      /* Animation preferences */
      @media (prefers-reduced-motion: reduce) {
        .loading-spinner {
          animation: none;
        }

        .pagination-btn:hover:not([disabled]) {
          transform: none;
        }

        * {
          transition: none !important;
        }
      }
    `,
  ];

  constructor() {
    super();

    // Initialize properties
    this.postsPerPage = 5;
    this.posts = [];
    this.filteredPosts = [];
    this.currentFilter = null;
    this.currentPage = 1;
    this.isLoading = false;

    // Bind the event handler once to use with addEventListener/removeEventListener
    this.boundHandleTagFilterChange =
      this.handleTagFilterChange.bind(this);

    // Handle tag filtering events from post cards
    this.addEventListener(
      "tag-filter",
      this.handleTagFilter.bind(this) as EventListener
    );
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadBlogPosts();

    // Listen for tag filter changes from tag-filter components
    // Listen on document since the event bubbles up from tag-filter
    document.addEventListener(
      "tag-changed",
      this.boundHandleTagFilterChange
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Clean up event listener to prevent memory leaks
    document.removeEventListener(
      "tag-changed",
      this.boundHandleTagFilterChange
    );
  }

  private async loadBlogPosts(): Promise<void> {
    this.isLoading = true;

    try {
      const response = await fetch("/data/blog-manifest.json");
      if (!response.ok) {
        throw new Error(
          `Failed to load blog posts: ${response.statusText}`
        );
      }

      const manifest: BlogManifest = await response.json();
      this.posts = manifest.posts;
      this.filteredPosts = [...this.posts];

      this.isLoading = false;
    } catch (error) {
      console.error("Failed to load blog posts:", error);
      this.isLoading = false;
    }
  }

  render() {
    if (this.isLoading) {
      return html`
        <div class="post-list-container">
          <div class="post-list-loading">
            <div class="loading-spinner"></div>
            <p>Loading blog posts...</p>
          </div>
        </div>
      `;
    }

    const startIndex = (this.currentPage - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    const currentPosts = this.filteredPosts.slice(
      startIndex,
      endIndex
    );
    const totalPages = Math.ceil(
      this.filteredPosts.length / this.postsPerPage
    );

    return html`
      <div class="post-list-container">
        ${this.renderHeader()}
        ${currentPosts.length > 0
          ? this.renderPosts(currentPosts)
          : this.renderEmpty()}
        ${totalPages > 1 ? this.renderPagination(totalPages) : ""}
      </div>
    `;
  }

  private renderHeader() {
    const totalPosts = this.filteredPosts.length;
    const headerText = this.currentFilter
      ? `Blog posts tagged "${this.currentFilter}" (${totalPosts})`
      : `Latest blog posts (${totalPosts})`;

    return html`
      <header class="post-list-header">
        <h2>${headerText}</h2>
      </header>
    `;
  }

  private renderPosts(posts: BlogPostMetadata[]) {
    return html`
      <div class="post-list-grid">
        ${posts.map(
          (post) =>
            html`<kbr-post-card
              title="${post.title}"
              description="${post.description}"
              date="${post.date}"
              formatted-date="${post.formattedDate}"
              tags="${JSON.stringify(post.tags)}"
              url="${post.url}"
            >
            </kbr-post-card>`
        )}
      </div>
    `;
  }

  private renderEmpty() {
    const message = this.currentFilter
      ? `No blog posts found with the tag "${this.currentFilter}".`
      : "No blog posts available yet.";

    return html`
      <div class="post-list-empty">
        <p>${message}</p>
      </div>
    `;
  }

  private renderPagination(totalPages: number) {
    const pages = [];

    // Previous button
    const prevDisabled = this.currentPage === 1;
    pages.push({
      text: "← Previous",
      page: this.currentPage - 1,
      disabled: prevDisabled,
      active: false,
    });

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      pages.push({
        text: i.toString(),
        page: i,
        disabled: false,
        active: i === this.currentPage,
      });
    }

    // Next button
    const nextDisabled = this.currentPage === totalPages;
    pages.push({
      text: "Next →",
      page: this.currentPage + 1,
      disabled: nextDisabled,
      active: false,
    });

    return html`
      <nav class="post-list-pagination">
        ${pages.map(
          (pageInfo) =>
            html`<button
              class="pagination-btn ${pageInfo.active
                ? "active"
                : ""}"
              ?disabled="${pageInfo.disabled}"
              @click="${() => this.goToPage(pageInfo.page)}"
              data-page="${pageInfo.page}"
            >
              ${pageInfo.text}
            </button>`
        )}
      </nav>
    `;
  }

  private handleTagFilter(event: Event): void {
    const customEvent = event as CustomEvent;
    const tag = customEvent.detail?.tag;
    if (tag) {
      // Use the same logic as handleTagFilterChange
      this.handleTagFilterChange(event);
    }
  }

  private handleTagFilterChange(event: Event): void {
    const customEvent = event as CustomEvent;
    const tag = customEvent.detail?.tag;

    if (tag) {
      // Update internal state without triggering attribute change
      this.currentFilter = tag;
      this.currentPage = 1;

      this.filteredPosts = this.posts.filter((post) =>
        post.tags.some(
          (postTag) => postTag.toLowerCase() === tag.toLowerCase()
        )
      );
    } else {
      // Clear filter without triggering attribute change
      this.currentFilter = null;
      this.currentPage = 1;
      this.filteredPosts = [...this.posts];
    }
  }

  private goToPage(page: number): void {
    const totalPages = Math.ceil(
      this.filteredPosts.length / this.postsPerPage
    );

    if (page >= 1 && page <= totalPages) {
      this.currentPage = page;
    }
  }
}

export { type BlogPostMetadata };
