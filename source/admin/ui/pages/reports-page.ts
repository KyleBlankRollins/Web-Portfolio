/**
 * Reports Page Component
 *
 * Placeholder page for future reporting and analytics features.
 */

import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { reportsPageStyles } from "./reports-page.styles.js";

@customElement("reports-page")
export class ReportsPage extends LitElement {
  static styles = reportsPageStyles;

  render() {
    return html`
      <div class="page-header">
        <h1 class="page-title">Reports</h1>
        <p class="page-description">
          Analytics and insights about your blog posts
        </p>
      </div>

      <div class="page-content">
        <div class="placeholder">
          <div class="placeholder-icon">📊</div>
          <h2 class="placeholder-title">Reports Coming Soon</h2>
          <p class="placeholder-text">
            This page will provide insights and analytics about your blog post
            workflow and publishing patterns.
          </p>

          <div class="feature-list">
            <div class="feature-item">
              <span class="feature-icon">📈</span>
              <span>Post velocity and completion rates</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">⏱️</span>
              <span>Time spent in each status</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🎯</span>
              <span>Priority distribution and trends</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📅</span>
              <span>Publishing schedule visualization</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "reports-page": ReportsPage;
  }
}
