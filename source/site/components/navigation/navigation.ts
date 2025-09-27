import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { navigationStyles } from "./navigation-styles.js";
import {
  typographyStyles,
  buttonStyles,
  layoutStyles,
} from "../../styles/shared-styles.js";

/**
 * KBR Navigation Web Component
 *
 * A Lit Element component that renders site navigation across all pages.
 * Usage: <kbr-navigation></kbr-navigation>
 */
@customElement("kbr-navigation")
export class KbrNavigation extends LitElement {
  @state()
  private declare currentPath: string;

  static styles = [
    typographyStyles,
    buttonStyles,
    layoutStyles,
    navigationStyles,
  ];

  connectedCallback() {
    super.connectedCallback();
    this.currentPath = window.location.pathname;
  }

  render() {
    return html`
      <header class="site-header">
        <div class="header-content">
          <div class="logo">
            <a href="/">K_R</a>
          </div>

          <nav class="main-nav">
            <ul>
              <li>
                <a
                  href="/blog.html"
                  class="nav-link ${this.getLinkClass("/blog.html")}"
                  >Blog</a
                >
              </li>
              <li>
                <a
                  href="/portfolio.html"
                  class="nav-link ${this.getLinkClass(
                    "/portfolio.html"
                  )}"
                  >Portfolio</a
                >
              </li>
              <li>
                <a
                  href="/career.html"
                  class="nav-link ${this.getLinkClass(
                    "/career.html"
                  )}"
                  >Career</a
                >
              </li>
            </ul>
          </nav>
        </div>
      </header>
    `;
  }

  private getLinkClass(linkPath: string): string {
    // Handle home page and exact matches
    if (
      (this.currentPath === "/" && linkPath === "/") ||
      (this.currentPath === "/index.html" && linkPath === "/") ||
      (this.currentPath === linkPath && linkPath !== "/")
    ) {
      return "active";
    }
    return "";
  }
}
