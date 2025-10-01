/**
 * Post Card Component
 *
 * Displays an individual blog post card that can be dragged between columns.
 * Shows post title, metadata (priority, dates), and tags.
 */

import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { PostMetadata } from "../../types/post-metadata.js";
import { postCardStyles } from "./post-card.styles.js";

@customElement("admin-post-card")
export class AdminPostCard extends LitElement {
  @property({ type: Object })
  post!: PostMetadata;

  @property({ type: Boolean, reflect: true })
  dragging = false;

  static styles = postCardStyles;

  private handleDragStart(e: DragEvent) {
    this.dragging = true;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData(
        "application/json",
        JSON.stringify(this.post)
      );
      e.dataTransfer.setData("text/plain", this.post.id);
    }

    // Dispatch custom event for parent components
    this.dispatchEvent(
      new CustomEvent("post-drag-start", {
        detail: { post: this.post },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleDragEnd() {
    this.dragging = false;

    this.dispatchEvent(
      new CustomEvent("post-drag-end", {
        detail: { post: this.post },
        bubbles: true,
        composed: true,
      })
    );
  }

  private formatDate(date?: string): string {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  render() {
    const { post } = this;

    return html`
      <div
        class="post-card ${this.dragging ? "dragging" : ""}"
        draggable="true"
        @dragstart=${this.handleDragStart}
        @dragend=${this.handleDragEnd}
      >
        <div class="drag-handle"></div>

        <div class="post-title">${post.title}</div>

        <div class="post-metadata">
          ${post.priority
            ? html`
                <span
                  class="metadata-badge priority-badge priority-${post.priority}"
                >
                  ${post.priority === "high"
                    ? "🔥"
                    : post.priority === "medium"
                    ? "⚡"
                    : "📌"}
                  ${post.priority}
                </span>
              `
            : ""}
          ${post.created
            ? html`
                <span class="metadata-badge">
                  📅 ${this.formatDate(post.created)}
                </span>
              `
            : ""}
        </div>

        ${post.tags && post.tags.length > 0
          ? html`
              <div class="post-tags">
                ${post.tags.map(
                  (tag) => html`<span class="tag">${tag}</span>`
                )}
              </div>
            `
          : ""}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "admin-post-card": AdminPostCard;
  }
}
