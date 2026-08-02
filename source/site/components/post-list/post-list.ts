import { LitElement, html } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { postListStyles } from "./post-list.style.js";

import {
  typographyStyles,
  buttonStyles,
  layoutStyles,
  reducedMotionStyles,
} from "../../styles/shared-styles.js";

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
  declare private posts: BlogPostMetadata[];

  @state()
  declare private filteredPosts: BlogPostMetadata[];

  @state()
  declare private currentFilter: string | null;

  @state()
  declare private currentPage: number;

  @state()
  declare private isLoading: boolean;

  @state()
  declare private loadError: boolean;

  private boundHandleTagFilterChange: (event: Event) => void;

  static styles = [
    typographyStyles,
    buttonStyles,
    layoutStyles,
    postListStyles,
    reducedMotionStyles,
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
    this.loadError = false;

    // Bind the event handler once to use with addEventListener/removeEventListener
    this.boundHandleTagFilterChange = this.handleTagFilterChange.bind(this);

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
    document.addEventListener("tag-changed", this.boundHandleTagFilterChange);
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
        throw new Error(`Failed to load blog posts: ${response.statusText}`);
      }

      const manifest: BlogManifest = await response.json();
      this.posts = manifest.posts;
      this.filteredPosts = [...this.posts];

      this.isLoading = false;
    } catch (error) {
      console.error("Failed to load blog posts:", error);
      this.loadError = true;
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

    if (this.loadError) {
      return html`
        <div class="post-list-container">
          <div class="post-list-error" role="status">
            <p>
              Blog posts are temporarily unavailable. Please try again later.
            </p>
          </div>
        </div>
      `;
    }

    const startIndex = (this.currentPage - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    const currentPosts = this.filteredPosts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);

    return html`
      <div class="post-list-container">
        ${this.currentFilter ? this.renderHeader() : ""}
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
      : "";

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
              class="pagination-btn ${pageInfo.active ? "active" : ""}"
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
        post.tags.some((postTag) => postTag.toLowerCase() === tag.toLowerCase())
      );
    } else {
      // Clear filter without triggering attribute change
      this.currentFilter = null;
      this.currentPage = 1;
      this.filteredPosts = [...this.posts];
    }
  }

  private goToPage(page: number): void {
    const totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);

    if (page >= 1 && page <= totalPages) {
      this.currentPage = page;
    }
  }
}

export { type BlogPostMetadata };
