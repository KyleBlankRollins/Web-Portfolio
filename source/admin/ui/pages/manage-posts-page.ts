/**
 * Manage Posts Page Component
 *
 * Main page for managing blog posts via Kanban board.
 */

import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { managePostsPageStyles } from "./manage-posts-page.styles.js";
import "../components/kanban-board.js";

@customElement("manage-posts-page")
export class ManagePostsPage extends LitElement {
  static styles = managePostsPageStyles;

  render() {
    return html`
      <div class="page-header">
        <h1 class="page-title">Manage Posts</h1>
        <p class="page-description">
          Drag and drop posts between columns to change their status
        </p>
      </div>

      <div class="page-content">
        <admin-kanban-board></admin-kanban-board>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "manage-posts-page": ManagePostsPage;
  }
}
