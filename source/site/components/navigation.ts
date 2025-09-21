/**
 * KBR Navigation Web Component
 *
 * A web component that renders site navigation across all pages.
 * Usage: <kbr-navigation></kbr-navigation>
 */
class KbrNavigation extends HTMLElement {
  constructor() {
    super();
    // Create shadow DOM for style encapsulation
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="/styles/component-typography.css">
        <link rel="stylesheet" href="/components/navigation.css">
        ${this.getNavigationHTML()}
      `;
      this.attachEventListeners();
    }
  }

  private getNavigationHTML(): string {
    return `
      <header class="site-header">
        <div class="header-content">
          <div class="logo">
            <a href="/">K_R</a>
          </div>

          <nav class="main-nav">
            <ul>
              <li><a href="/blog.html">Blog</a></li>
              <li><a href="/portfolio.html">Portfolio</a></li>
              <li><a href="/projects.html">Projects</a></li>
            </ul>
          </nav>
        </div>
      </header>
    `;
  }

  private attachEventListeners(): void {
    // Add active link highlighting based on current page
    const currentPath = window.location.pathname;
    const navLinks = this.shadowRoot?.querySelectorAll(
      ".main-nav a"
    ) as NodeListOf<HTMLAnchorElement>;

    navLinks?.forEach((link) => {
      const linkPath = link.getAttribute("href");

      // Handle home page and exact matches
      if (
        (currentPath === "/" && linkPath === "/") ||
        (currentPath === "/index.html" && linkPath === "/") ||
        (currentPath === linkPath && linkPath !== "/")
      ) {
        link.classList.add("active");
      }
    });

    // Optional: Add mobile menu toggle if needed in the future
    // const menuToggle = this.shadowRoot?.querySelector('.menu-toggle');
    // if (menuToggle) {
    //   menuToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
    // }
  }
}

// Register the custom element
customElements.define("kbr-navigation", KbrNavigation);
