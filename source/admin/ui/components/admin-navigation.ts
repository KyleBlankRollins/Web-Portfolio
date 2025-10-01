/**
 * Admin Navigation Component
 *
 * Left sidebar navigation for switching between admin pages.
 */

import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { adminNavigationStyles } from "./admin-navigation.styles.js";

export interface NavItem {
  id: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "manage-posts", label: "Manage Posts", icon: "📋" },
  { id: "reports", label: "Reports", icon: "📊" },
];

@customElement("admin-navigation")
export class AdminNavigation extends LitElement {
  @property({ type: String })
  activePage = "manage-posts";

  static styles = adminNavigationStyles;

  private handleNavClick(pageId: string) {
    this.activePage = pageId;
    this.dispatchEvent(
      new CustomEvent("page-change", {
        detail: { pageId },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="nav-header">
        <h2 class="nav-title">Blog Admin</h2>
        <div class="nav-subtitle">Post Management</div>
      </div>

      <nav class="nav-menu">
        ${NAV_ITEMS.map(
          (item) => html`
            <button
              class="nav-item ${this.activePage === item.id
                ? "active"
                : ""}"
              @click=${() => this.handleNavClick(item.id)}
            >
              <span class="nav-icon">${item.icon}</span>
              <span class="nav-label">${item.label}</span>
            </button>
          `
        )}
      </nav>

      <div class="nav-footer">Version 1.0.0</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "admin-navigation": AdminNavigation;
  }
}
