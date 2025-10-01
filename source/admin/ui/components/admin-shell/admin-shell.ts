/**
 * Admin Shell Component
 *
 * Main application shell that contains navigation and page routing.
 */

import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { adminShellStyles } from "./admin-shell-styles.js";
import "../admin-navigation/admin-navigation.js";
import "../../pages/manage-posts-page.js";
import "../../pages/reports-page.js";

@customElement("admin-shell")
export class AdminShell extends LitElement {
  @state()
  private activePage = "manage-posts";

  static styles = adminShellStyles;

  private handlePageChange(e: CustomEvent) {
    this.activePage = e.detail.pageId;
  }

  render() {
    return html`
      <div class="admin-shell">
        <admin-navigation
          .activePage=${this.activePage}
          @page-change=${this.handlePageChange}
        ></admin-navigation>

        <div class="main-content">
          <div class="page-container">
            <manage-posts-page
              ?active=${this.activePage === "manage-posts"}
            ></manage-posts-page>
            <reports-page
              ?active=${this.activePage === "reports"}
            ></reports-page>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "admin-shell": AdminShell;
  }
}
