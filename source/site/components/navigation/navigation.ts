import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { navigationStyles } from "./navigation.style.js";
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
  declare private currentPath: string;

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

          <!-- The links and the theme switcher travel together as one
               right-hand cluster, so the switcher lands at the far edge of
               .header-content rather than splitting the two apart, which is
               what a bare space-between across three children would do. -->
          <div class="header-actions">
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
                    class="nav-link ${this.getLinkClass("/portfolio.html")}"
                    >Portfolio</a
                  >
                </li>
                <li>
                  <a
                    href="/career.html"
                    class="nav-link ${this.getLinkClass("/career.html")}"
                    >Career</a
                  >
                </li>
              </ul>
            </nav>

            <!-- Filled by <kbr-theme-switcher slot="theme-switcher"> in the
                 page templates. Slotted rather than rendered here so the
                 navigation component does not depend on the switcher. -->
            <slot name="theme-switcher"></slot>
          </div>
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
