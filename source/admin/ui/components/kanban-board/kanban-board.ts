/**
 * Kanban Board Component
 *
 * Main component that orchestrates the Kanban board view.
 * Manages columns, fetches data from API, and handles post status updates.
 */

import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import type { PostMetadata, PostStatus } from "../../../types/post-metadata.js";
import "../kanban-column/kanban-column.js";
import { kanbanBoardStyles } from "./kanban-board-styles.js";

const API_BASE = "http://localhost:4000";

interface ColumnConfig {
  status: PostStatus;
  title: string;
  icon: string;
}

const COLUMNS: ColumnConfig[] = [
  { status: "planned", title: "Planned", icon: "📋" },
  { status: "researching", title: "Researching", icon: "🔍" },
  { status: "outlining", title: "Outlining", icon: "📝" },
  { status: "writing", title: "Writing", icon: "✍️" },
  { status: "editing", title: "Editing", icon: "✏️" },
];

@customElement("admin-kanban-board")
export class AdminKanbanBoard extends LitElement {
  @state()
  private posts: PostMetadata[] = [];

  @state()
  private loading = true;

  @state()
  private error: string | null = null;

  static styles = kanbanBoardStyles;

  connectedCallback() {
    super.connectedCallback();
    this.loadPosts();
  }

  /**
   * Fetch posts from the API
   */
  private async loadPosts() {
    this.loading = true;
    this.error = null;

    try {
      const response = await fetch(`${API_BASE}/api/posts`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch posts");
      }

      this.posts = data.data || [];
    } catch (err) {
      this.error = err instanceof Error ? err.message : "Unknown error";
      console.error("Failed to load posts:", err);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Handle post status change from drag-and-drop
   */
  private async handleStatusChange(e: CustomEvent) {
    const { postId, oldStatus, newStatus } = e.detail;

    console.log(`Moving post ${postId} from ${oldStatus} to ${newStatus}`);

    // Optimistically update the UI
    const postIndex = this.posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) return;

    const oldPosts = [...this.posts];
    this.posts = this.posts.map((p) =>
      p.id === postId ? { ...p, status: newStatus } : p
    );

    try {
      const response = await fetch(`${API_BASE}/api/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to update post");
      }

      console.log("✅ Post status updated successfully");
    } catch (err) {
      console.error("Failed to update post status:", err);
      // Revert the optimistic update
      this.posts = oldPosts;
      this.error =
        err instanceof Error ? err.message : "Failed to update post status";
    }
  }

  /**
   * Handle post publish from the publish button
   */
  private async handlePublish(e: CustomEvent) {
    const { post } = e.detail;

    console.log(`Publishing post ${post.id}: ${post.title}`);

    // Ensure the post is in editing status
    if (post.status !== "editing") {
      console.warn("Can only publish posts from 'editing' status");
      return;
    }

    const oldPosts = [...this.posts];
    // Optimistically update the UI - remove from kanban board
    this.posts = this.posts.map((p) =>
      p.id === post.id ? { ...p, status: "published" as PostStatus } : p
    );

    try {
      const response = await fetch(`${API_BASE}/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "published" }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to publish post");
      }

      console.log("✅ Post published successfully");
    } catch (err) {
      console.error("Failed to publish post:", err);
      // Revert the optimistic update
      this.posts = oldPosts;
      this.error =
        err instanceof Error ? err.message : "Failed to publish post";
    }
  }

  /**
   * Get posts for a specific status
   */
  private getPostsForStatus(status: PostStatus): PostMetadata[] {
    return this.posts.filter((p) => p.status === status);
  }

  render() {
    if (this.loading) {
      return html`
        <div class="loading">
          <div class="loading-spinner"></div>
          Loading posts...
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="error">
          <div class="error-title">⚠️ Error</div>
          <div class="error-message">${this.error}</div>
          <button
            class="action-button"
            @click=${this.loadPosts}
            style="margin-top: 1rem;"
          >
            Try Again
          </button>
        </div>
      `;
    }

    return html`
      <div
        class="kanban-board"
        @post-status-change=${this.handleStatusChange}
        @post-publish=${this.handlePublish}
      >
        ${COLUMNS.map(
          (column) => html`
            <admin-kanban-column
              status=${column.status}
              title="${column.icon} ${column.title}"
              .posts=${this.getPostsForStatus(column.status)}
            ></admin-kanban-column>
          `
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "admin-kanban-board": AdminKanbanBoard;
  }
}
