/**
 * Table of Contents Web Component
 *
 * Automatically generates a navigation table of contents from headings (h1-h6)
 * in the page content. Used for blog posts to provide easy navigation.
 *
 * Usage: <kbr-table-of-contents></kbr-table-of-contents>
 */

interface TocItem {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
}

class KbrTableOfContents extends HTMLElement {
  private tocItems: TocItem[] = [];
  private observer: IntersectionObserver | null = null;

  static get observedAttributes() {
    return ["max-level", "target-selector"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // Wait for DOM to be ready, then generate TOC
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.generateToc()
      );
    } else {
      this.generateToc();
    }
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private generateToc(): void {
    this.extractHeadings();
    this.render();
    this.setupIntersectionObserver();
    this.setupScrollBehavior();
  }

  private extractHeadings(): void {
    const maxLevel = parseInt(
      this.getAttribute("max-level") || "6",
      10
    );
    const targetSelector =
      this.getAttribute("target-selector") ||
      "main, article, .content";

    // Find the target container (default to main, article, or .content)
    const targetElement = document.querySelector(targetSelector);
    if (!targetElement) {
      console.warn(
        "KbrTableOfContents: No target element found for selector:",
        targetSelector
      );
      return;
    }

    // Find all headings within the target element
    const headingSelector = Array.from(
      { length: maxLevel },
      (_, i) => `h${i + 1}`
    ).join(", ");
    const headings = targetElement.querySelectorAll(headingSelector);

    this.tocItems = [];

    headings.forEach((heading, index) => {
      const element = heading as HTMLElement;
      const level = parseInt(element.tagName.charAt(1), 10);
      const text = element.textContent?.trim() || "";

      // Generate an ID if the heading doesn't have one
      let id = element.id;
      if (!id) {
        id = this.generateId(text, index);
        element.id = id;
      }

      // Omit H1s from TOC
      if (level == 1) {
        return;
      }

      this.tocItems.push({
        id,
        text,
        level,
        element,
      });
    });
  }

  private generateId(text: string, index: number): string {
    // Create a URL-friendly ID from the heading text
    const baseId = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove non-word chars except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .trim();

    return baseId || `heading-${index}`;
  }

  private setupIntersectionObserver(): void {
    if (!("IntersectionObserver" in window)) {
      return; // Fallback for older browsers
    }

    const options = {
      rootMargin: "-20% 0% -35% 0%", // Trigger when heading is in the middle third of viewport
      threshold: 0,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const link = this.shadowRoot?.querySelector(
          `a[href="#${id}"]`
        );

        if (entry.isIntersecting) {
          // Remove active class from all links
          this.shadowRoot
            ?.querySelectorAll("a.active")
            .forEach((el) => {
              el.classList.remove("active");
            });
          // Add active class to current link
          link?.classList.add("active");
        }
      });
    }, options);

    // Observe all headings
    this.tocItems.forEach((item) => {
      this.observer?.observe(item.element);
    });
  }

  private setupScrollBehavior(): void {
    // Handle clicks on TOC links
    this.shadowRoot?.addEventListener("click", (event) => {
      event.preventDefault();
      const target = event.target as HTMLElement;

      if (
        target.tagName === "A" &&
        target.getAttribute("href")?.startsWith("#")
      ) {
        const id = target.getAttribute("href")?.substring(1);
        const element = document.getElementById(id || "");

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          // Update active state immediately
          this.shadowRoot
            ?.querySelectorAll("a.active")
            .forEach((el) => {
              el.classList.remove("active");
            });
          target.classList.add("active");
        }
      }
    });
  }

  private render(): void {
    if (!this.shadowRoot) return;

    // Load external CSS
    const typographyLink = document.createElement("link");
    typographyLink.rel = "stylesheet";
    typographyLink.href = "/styles/component-typography.css";

    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = "/components/table-of-contents.css";

    const container = document.createElement("div");
    container.className = "toc-container";

    if (this.tocItems.length === 0) {
      container.innerHTML =
        '<p class="toc-empty">No headings found</p>';
    } else {
      const tocHtml = this.generateTocHtml();
      container.innerHTML = `
        <nav class="table-of-contents" role="navigation" aria-label="Table of contents">
          <h2 class="toc-title">Table of Contents</h2>
          <ol class="toc-list">
            ${tocHtml}
          </ol>
        </nav>
      `;
    }

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(typographyLink);
    this.shadowRoot.appendChild(styleLink);
    this.shadowRoot.appendChild(container);
  }

  private generateTocHtml(): string {
    if (this.tocItems.length === 0) return "";

    let html = "";
    let currentLevel = 0;
    let openLists = 0;

    for (const item of this.tocItems) {
      if (item.level > currentLevel) {
        // Opening deeper levels
        const levelsToOpen = item.level - currentLevel;
        for (let i = 0; i < levelsToOpen; i++) {
          if (
            html &&
            !html.endsWith('<ol class="toc-list">') &&
            !html.endsWith('<ol class="toc-sublist">')
          ) {
            html += '<ol class="toc-sublist">';
          }
          openLists++;
        }
      } else if (item.level < currentLevel) {
        // Closing shallower levels
        const levelsToClose = currentLevel - item.level;
        for (let i = 0; i < levelsToClose; i++) {
          html += "</ol>";
          openLists--;
        }
      }

      html += `
        <li class="toc-item toc-level-${item.level}">
          <a href="#${item.id}" class="toc-link">${item.text}</a>
        </li>
      `;

      currentLevel = item.level;
    }

    // Close any remaining open lists
    for (let i = 0; i < openLists - 1; i++) {
      html += "</ol>";
    }

    return html;
  }
}

// Register the web component
customElements.define("kbr-table-of-contents", KbrTableOfContents);

export { KbrTableOfContents };
