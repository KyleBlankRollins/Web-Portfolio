import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";

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

  static styles = css`
    /* Host element - the <kbr-navigation> tag itself */
    :host {
      display: block;
    }

    /* Main navigation header */
    .site-header {
      background: linear-gradient(
        135deg,
        var(--color-primary) 0%,
        var(--color-accent) 100%
      );
      padding: var(--space-md, 1.5rem) 0;
      box-shadow: 0 2px 4px var(--color-shadow, rgba(0, 0, 0, 0.12));
      position: relative;
    }

    /* Header content container */
    .header-content {
      max-width: var(--content-max-width, 1200px);
      margin: 0 auto;
      padding: 0 var(--space-md, 1.5rem);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* Logo styling */
    .logo a {
      font-family: var(
        --font-family-mono,
        "JetBrains Mono",
        monospace
      );
      font-size: var(--font-size-lg, 1.25rem);
      font-weight: bold;
      color: var(--color-text-inverse, #ffffff);
      text-decoration: none;
      transition: all var(--transition-fast, 0.2s ease);
      letter-spacing: 0.1em;
    }

    .logo a:hover {
      opacity: 0.8;
      transform: scale(1.05);
    }

    /* Main navigation */
    .main-nav ul {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: var(--space-lg, 2rem);
    }

    .main-nav li {
      position: relative;
    }

    .main-nav a {
      color: var(--color-text-inverse, #ffffff);
      text-decoration: none;
      font-weight: 500;
      padding: var(--space-xs, 0.5rem) var(--space-sm, 1rem);
      border-radius: 6px;
      transition: all var(--transition-fast, 0.2s ease);
      position: relative;
      display: block;
    }

    .main-nav a:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    /* Active link styling */
    .main-nav a.active {
      background-color: rgba(255, 255, 255, 0.2);
      font-weight: 600;
    }

    .main-nav a.active::after {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 2px;
      background-color: var(--color-text-inverse, #ffffff);
      border-radius: 1px;
      opacity: 0.9;
    }

    /* Focus states for accessibility */
    .logo a:focus,
    .main-nav a:focus {
      outline: 2px solid rgba(255, 255, 255, 0.8);
      outline-offset: 2px;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .header-content {
        padding: 0 var(--space-sm, 1rem);
        gap: var(--space-sm, 1rem);
      }

      .logo a {
        font-size: var(--font-size-base, 1rem);
      }

      .main-nav ul {
        gap: var(--space-md, 1.5rem);
      }

      .main-nav a {
        padding: var(--space-xs, 0.5rem);
        font-size: 0.9rem;
      }
    }

    @media (max-width: 480px) {
      .header-content {
        flex-direction: column;
        gap: var(--space-sm, 1rem);
        text-align: center;
      }

      .main-nav ul {
        gap: var(--space-sm, 1rem);
        flex-wrap: wrap;
        justify-content: center;
      }

      .main-nav a {
        padding: var(--space-xs, 0.5rem) var(--space-sm, 1rem);
        font-size: 0.85rem;
      }
    }

    /* Animation for better user experience */
    @media (prefers-reduced-motion: no-preference) {
      .main-nav a {
        transition: all var(--transition-normal, 0.3s ease);
      }

      .main-nav a:hover {
        animation: subtle-pulse 0.3s ease;
      }
    }

    @keyframes subtle-pulse {
      0%,
      100% {
        transform: translateY(-1px) scale(1);
      }
      50% {
        transform: translateY(-2px) scale(1.02);
      }
    }

    /* Dark mode adjustments (if needed beyond theme variables) */
    @media (prefers-color-scheme: dark) {
      .main-nav a:hover {
        background-color: rgba(255, 255, 255, 0.15);
      }

      .main-nav a.active {
        background-color: rgba(255, 255, 255, 0.25);
      }
    }
  `;

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
                  class="${this.getLinkClass("/blog.html")}"
                  >Blog</a
                >
              </li>
              <li>
                <a
                  href="/portfolio.html"
                  class="${this.getLinkClass("/portfolio.html")}"
                  >Portfolio</a
                >
              </li>
              <li>
                <a
                  href="/projects.html"
                  class="${this.getLinkClass("/projects.html")}"
                  >Projects</a
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
