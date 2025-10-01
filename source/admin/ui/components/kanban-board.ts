/**
 * Kanban Board Component
 *
 * Main component that orchestrates the Kanban board view.
 * Manages columns, fetches data from API, and handles post status updates.
 */

import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import type {
  PostMetadata,
  PostStatus,
} from "../../types/post-metadata.js";
import "./kanban-column.js";
import { kanbanBoardStyles } from "./kanban-board.styles.js";

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
  { status: "published", title: "Published", icon: "✅" },
  { status: "discarded", title: "Discarded", icon: "🗑️" },
];

@customElement("admin-kanban-board")
export class AdminKanbanBoard extends LitElement {
  @state()
  private posts: PostMetadata[] = [];

  @state()
  private loading = true;

  @state()
  private error: string | null = null;

  @state()
  private syncing = false;

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
      this.error =
        err instanceof Error ? err.message : "Unknown error";
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

    console.log(
      `Moving post ${postId} from ${oldStatus} to ${newStatus}`
    );

    // Optimistically update the UI
    const postIndex = this.posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) return;

    const oldPosts = [...this.posts];
    this.posts = this.posts.map((p) =>
      p.id === postId ? { ...p, status: newStatus } : p
    );

    this.syncing = true;

    try {
      const response = await fetch(
        `${API_BASE}/api/posts/${postId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

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
        err instanceof Error
          ? err.message
          : "Failed to update post status";
    } finally {
      this.syncing = false;
    }
  }

  /**
   * Refresh posts from the server
   */
  private handleRefresh() {
    this.loadPosts();
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
            @click=${this.handleRefresh}
            style="margin-top: 1rem;"
          >
            Try Again
          </button>
        </div>
      `;
    }

    const totalPosts = this.posts.length;
    const publishedCount = this.posts.filter(
      (p) => p.status === "published"
    ).length;

    return html`
      <div class="toolbar">
        <div class="toolbar-left">
          <div class="status-indicator">
            <span
              class="status-dot ${this.syncing ? "syncing" : ""}"
            ></span>
            ${this.syncing ? "Syncing..." : "Connected"}
          </div>
          <div class="stats">
            <span class="stat-item">📊 ${totalPosts} total</span>
            <span class="stat-item"
              >✅ ${publishedCount} published</span
            >
          </div>
        </div>
        <div class="toolbar-right">
          <button class="action-button" @click=${this.handleRefresh}>
            🔄 Refresh
          </button>
        </div>
      </div>

      <div
        class="kanban-board"
        @post-status-change=${this.handleStatusChange}
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
