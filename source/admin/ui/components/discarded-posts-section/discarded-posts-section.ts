/**
 * Discarded Posts Section Component
 *
 * Displays discarded blog posts with their discard reasons.
 * Acts as a drop zone for posts being moved to the discarded state.
 * Shows a modal to collect discard reason when a post is dropped.
 */

import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import type { PostMetadata } from "../../../types/post-metadata.js";
import { discardedPostsSectionStyles } from "./discarded-posts-section-styles.js";

@customElement("discarded-posts-section")
export class DiscardedPostsSection extends LitElement {
  static styles = discardedPostsSectionStyles;

  @state()
  private posts: PostMetadata[] = [];

  @state()
  private isDragOver = false;

  @state()
  private showModal = false;

  @state()
  private pendingPost: PostMetadata | null = null;

  @state()
  private discardReason = "";

  /**
   * Set the posts to display (only discarded posts)
   */
  setPosts(posts: PostMetadata[]) {
    this.posts = posts.filter((p) => p.status === "discarded");
  }

  private handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer!.dropEffect = "move";
    this.isDragOver = true;
  }

  private handleDragLeave() {
    this.isDragOver = false;
  }

  private handleDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragOver = false;

    try {
      const data = e.dataTransfer!.getData("application/json");
      const post: PostMetadata = JSON.parse(data);

      // Don't allow already-discarded posts to be dropped again
      if (post.status === "discarded") {
        return;
      }

      // Show modal to collect discard reason
      this.pendingPost = post;
      this.discardReason = "";
      this.showModal = true;
    } catch (error) {
      console.error("Failed to parse dropped post data", error);
    }
  }

  private handleModalCancel() {
    this.showModal = false;
    this.pendingPost = null;
    this.discardReason = "";
  }

  private handleModalConfirm() {
    if (!this.pendingPost || !this.discardReason.trim()) {
      return;
    }

    // Dispatch event to update post status
    this.dispatchEvent(
      new CustomEvent("post-discard", {
        detail: {
          post: this.pendingPost,
          reason: this.discardReason.trim(),
        },
        bubbles: true,
        composed: true,
      })
    );

    this.handleModalCancel();
  }

  private handleReasonInput(e: Event) {
    const textarea = e.target as HTMLTextAreaElement;
    this.discardReason = textarea.value;
  }

  private handleModalKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      this.handleModalCancel();
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      this.handleModalConfirm();
    }
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
      <div
        class=${this.isDragOver ? "drag-over" : ""}
        @dragover=${this.handleDragOver}
        @dragleave=${this.handleDragLeave}
        @drop=${this.handleDrop}
      >
        <div class="section-header">
          <h2 class="section-title">🗑️ Discarded Posts</h2>
          <span class="post-count">${this.posts.length} discarded</span>
        </div>

        <div class="drop-zone-hint ${this.isDragOver ? "active" : ""}">
          ${this.isDragOver
            ? "Drop here to discard post..."
            : "Drag posts here to discard them"}
        </div>

        <div class="posts-list">
          ${this.posts.map(
            (post) => html`
              <div class="post-item">
                <div class="post-header">
                  <div class="post-title">${post.title}</div>
                  <div class="post-date">
                    ${this.formatDate(post.discarded_date || post.updated)}
                  </div>
                </div>
                ${post.discard_reason
                  ? html`
                      <div class="discard-reason">
                        <div class="reason-label">Reason:</div>
                        ${post.discard_reason}
                      </div>
                    `
                  : ""}
              </div>
            `
          )}
        </div>
      </div>

      ${this.showModal
        ? html`
            <div
              class="modal-overlay"
              @click=${(e: MouseEvent) => {
                if (e.target === e.currentTarget) {
                  this.handleModalCancel();
                }
              }}
            >
              <div class="modal" @keydown=${this.handleModalKeyDown}>
                <h3 class="modal-title">Discard Post</h3>
                <div class="modal-post-title">"${this.pendingPost?.title}"</div>

                <label class="modal-label">
                  Why are you discarding this post?
                  <textarea
                    class="modal-textarea"
                    placeholder="e.g., Topic no longer relevant, Too broad in scope, Better covered by another post..."
                    .value=${this.discardReason}
                    @input=${this.handleReasonInput}
                    autofocus
                  ></textarea>
                </label>

                <div class="modal-actions">
                  <button
                    class="modal-button cancel"
                    @click=${this.handleModalCancel}
                  >
                    Cancel
                  </button>
                  <button
                    class="modal-button discard"
                    @click=${this.handleModalConfirm}
                    ?disabled=${!this.discardReason.trim()}
                  >
                    Discard Post
                  </button>
                </div>
              </div>
            </div>
          `
        : ""}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "discarded-posts-section": DiscardedPostsSection;
  }
}
