/**
 * Manage Posts Page Component
 *
 * Main page for managing blog posts via Kanban board,
 * completed posts section, and discarded posts section.
 */

import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { managePostsPageStyles } from "./manage-posts-page.styles.js";
import type { PostMetadata } from "../../types/post-metadata.js";
import "../components/kanban-board/kanban-board.js";
import "../components/completed-posts-section/completed-posts-section.js";
import "../components/discarded-posts-section/discarded-posts-section.js";

@customElement("manage-posts-page")
export class ManagePostsPage extends LitElement {
  static styles = managePostsPageStyles;

  @state()
  private allPosts: PostMetadata[] = [];

  @state()
  private syncing = false;

  connectedCallback() {
    super.connectedCallback();
    this.fetchPosts();

    // Listen for post updates from child components
    this.addEventListener(
      "post-status-change",
      this.handlePostStatusChange.bind(this)
    );
    this.addEventListener("post-discard", this.handlePostDiscard.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(
      "post-status-change",
      this.handlePostStatusChange.bind(this)
    );
    this.removeEventListener("post-discard", this.handlePostDiscard.bind(this));
  }

  private async fetchPosts() {
    this.syncing = true;
    try {
      const response = await fetch("http://localhost:4000/api/posts");
      const data = await response.json();

      if (data.success) {
        this.allPosts = data.data;
        this.updateChildComponents();
      }
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      this.syncing = false;
    }
  }

  private handleRefresh() {
    this.fetchPosts();
  }

  private updateChildComponents() {
    // Update completed posts section
    const completedSection = this.shadowRoot?.querySelector(
      "completed-posts-section"
    ) as any;
    if (completedSection) {
      completedSection.setPosts(this.allPosts);
    }

    // Update discarded posts section
    const discardedSection = this.shadowRoot?.querySelector(
      "discarded-posts-section"
    ) as any;
    if (discardedSection) {
      discardedSection.setPosts(this.allPosts);
    }
  }

  private async handlePostStatusChange(e: Event) {
    const customEvent = e as CustomEvent;
    const { post, newStatus } = customEvent.detail;

    try {
      const response = await fetch(
        `http://localhost:4000/api/posts/${post.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        await this.fetchPosts(); // Refresh all posts
      }
    } catch (error) {
      console.error("Failed to update post status", error);
    }
  }

  private async handlePostDiscard(e: Event) {
    const customEvent = e as CustomEvent;
    const { post, reason } = customEvent.detail;

    try {
      // For now, just update to discarded status
      // TODO: Need to update backend to support discard_reason
      const response = await fetch(
        `http://localhost:4000/api/posts/${post.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "discarded",
            discard_reason: reason,
          }),
        }
      );

      if (response.ok) {
        await this.fetchPosts(); // Refresh all posts
      }
    } catch (error) {
      console.error("Failed to discard post", error);
    }
  }

  render() {
    const totalPosts = this.allPosts.length;
    const publishedCount = this.allPosts.filter(
      (p) => p.status === "published"
    ).length;

    return html`
      <div class="page-header">
        <h1 class="page-title">Manage Posts</h1>
        <p class="page-description">
          Drag and drop posts to manage their status in the content lifecycle
        </p>
      </div>

      <div class="toolbar">
        <div class="toolbar-left">
          <div class="status-indicator">
            <span class="status-dot ${this.syncing ? "syncing" : ""}"></span>
            ${this.syncing ? "Syncing..." : "Connected"}
          </div>
          <div class="stats">
            <span class="stat-item">📊 ${totalPosts} total</span>
            <span class="stat-item">✅ ${publishedCount} published</span>
          </div>
        </div>
        <div class="toolbar-right">
          <button class="action-button" @click=${this.handleRefresh}>
            🔄 Refresh
          </button>
        </div>
      </div>

      <div class="kanban-section">
        <admin-kanban-board></admin-kanban-board>
      </div>

      <completed-posts-section></completed-posts-section>
      <discarded-posts-section></discarded-posts-section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "manage-posts-page": ManagePostsPage;
  }
}
