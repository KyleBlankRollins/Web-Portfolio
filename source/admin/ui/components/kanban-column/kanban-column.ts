/**
 * Kanban Column Component
 *
 * Represents a single status column in the Kanban board.
 * Handles drag-and-drop operations for moving posts between statuses.
 */

import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { PostMetadata, PostStatus } from "../../../types/post-metadata.js";
import "../post-card/post-card.js";
import { kanbanColumnStyles } from "./kanban-column-styles.js";

@customElement("admin-kanban-column")
export class AdminKanbanColumn extends LitElement {
  @property({ type: String, reflect: true })
  status!: PostStatus;

  @property({ type: String })
  title!: string;

  @property({ type: Array })
  posts: PostMetadata[] = [];

  @state()
  private dragOver = false;

  static styles = kanbanColumnStyles;

  private handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move";
    }
    this.dragOver = true;
  }

  private handleDragEnter(e: DragEvent) {
    e.preventDefault();
    this.dragOver = true;
  }

  private handleDragLeave(e: DragEvent) {
    // Only set dragOver to false if we're leaving the column entirely
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !this.contains(relatedTarget)) {
      this.dragOver = false;
    }
  }

  private handleDrop(e: DragEvent) {
    e.preventDefault();
    this.dragOver = false;

    if (!e.dataTransfer) return;

    try {
      const postData = e.dataTransfer.getData("application/json");
      if (!postData) return;

      const post: PostMetadata = JSON.parse(postData);

      // Don't do anything if dropping in the same column
      if (post.status === this.status) return;

      // Dispatch event to parent to handle the status change
      this.dispatchEvent(
        new CustomEvent("post-status-change", {
          detail: {
            postId: post.id,
            oldStatus: post.status,
            newStatus: this.status,
          },
          bubbles: true,
          composed: true,
        })
      );
    } catch (error) {
      console.error("Failed to handle drop:", error);
    }
  }

  render() {
    const isEmpty = this.posts.length === 0;

    return html`
      <div
        class="column ${this.dragOver ? "drag-over" : ""}"
        @dragover=${this.handleDragOver}
        @dragenter=${this.handleDragEnter}
        @dragleave=${this.handleDragLeave}
        @drop=${this.handleDrop}
      >
        <div class="column-header">
          <div class="column-title">
            ${this.title}
            <span class="column-count">${this.posts.length}</span>
          </div>
        </div>

        <div class="column-body ${isEmpty ? "empty" : ""}">
          ${isEmpty
            ? html` <div class="empty-message">No posts in this stage</div> `
            : this.posts.map(
                (post) => html`
                  <admin-post-card .post=${post}></admin-post-card>
                `
              )}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "admin-kanban-column": AdminKanbanColumn;
  }
}
