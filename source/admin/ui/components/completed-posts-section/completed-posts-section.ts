/**
 * Completed Posts Section Component
 *
 * Displays a searchable and sortable list of published blog posts.
 * Posts can be dragged back to the Kanban board to re-enter the content lifecycle.
 */

import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import type { PostMetadata } from "../../../types/post-metadata.js";
import { completedPostsSectionStyles } from "./completed-posts-section-styles.js";

type SortOption = "title-asc" | "title-desc" | "date-asc" | "date-desc";

@customElement("completed-posts-section")
export class CompletedPostsSection extends LitElement {
  static styles = completedPostsSectionStyles;

  @state()
  private posts: PostMetadata[] = [];

  @state()
  private filteredPosts: PostMetadata[] = [];

  @state()
  private searchQuery = "";

  @state()
  private sortOption: SortOption = "date-desc";

  @state()
  private draggingPost: PostMetadata | null = null;

  /**
   * Set the posts to display (only published posts)
   */
  setPosts(posts: PostMetadata[]) {
    this.posts = posts.filter((p) => p.status === "published");
    this.applyFiltersAndSort();
  }

  /**
   * Apply search filter and sorting
   */
  private applyFiltersAndSort() {
    let filtered = [...this.posts];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.notes?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (this.sortOption) {
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "date-asc":
          return (
            new Date(a.published || a.created || "").getTime() -
            new Date(b.published || b.created || "").getTime()
          );
        case "date-desc":
          return (
            new Date(b.published || b.created || "").getTime() -
            new Date(a.published || a.created || "").getTime()
          );
      }
    });

    this.filteredPosts = filtered;
  }

  private handleSearchInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.applyFiltersAndSort();
  }

  private handleSortChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.sortOption = select.value as SortOption;
    this.applyFiltersAndSort();
  }

  private handleDragStart(e: DragEvent, post: PostMetadata) {
    this.draggingPost = post;
    e.dataTransfer!.effectAllowed = "move";
    e.dataTransfer!.setData("application/json", JSON.stringify(post));

    // Dispatch event to notify parent components
    this.dispatchEvent(
      new CustomEvent("post-drag-start", {
        detail: { post },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleDragEnd() {
    this.draggingPost = null;

    // Dispatch event to notify parent components
    this.dispatchEvent(
      new CustomEvent("post-drag-end", {
        bubbles: true,
        composed: true,
      })
    );
  }

  private formatDate(dateStr?: string): string {
    if (!dateStr) return "Unknown date";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  render() {
    return html`
      <div class="section-header">
        <h2 class="section-title">✓ Completed Posts</h2>
        <span class="post-count">${this.filteredPosts.length} posts</span>
      </div>

      <div class="controls">
        <input
          type="text"
          class="search-box"
          placeholder="Search posts by title or content..."
          .value=${this.searchQuery}
          @input=${this.handleSearchInput}
        />

        <div class="sort-controls">
          <span class="sort-label">Sort by:</span>
          <select
            class="sort-select"
            .value=${this.sortOption}
            @change=${this.handleSortChange}
          >
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>
        </div>
      </div>

      <div class="posts-list">
        ${this.filteredPosts.map(
          (post) => html`
            <div
              class="post-item ${this.draggingPost?.id === post.id
                ? "dragging"
                : ""}"
              draggable="true"
              @dragstart=${(e: DragEvent) => this.handleDragStart(e, post)}
              @dragend=${this.handleDragEnd}
            >
              <div class="post-info">
                <div class="post-title">${post.title}</div>
                <div class="post-meta">
                  Published: ${this.formatDate(post.published || post.created)}
                </div>
              </div>
              <div class="drag-handle" title="Drag to move back to workflow">
                ⋮⋮
              </div>
            </div>
          `
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "completed-posts-section": CompletedPostsSection;
  }
}
