import { LitElement, html, css } from "lit";
import { customElement, state, property } from "lit/decorators.js";

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

@customElement("kbr-table-of-contents")
export class KbrTableOfContents extends LitElement {
  @property({ type: Number, attribute: "max-level" })
  declare maxLevel: number;

  @property({ type: String, attribute: "target-selector" })
  declare targetSelector: string;

  @state()
  private declare tocItems: TocItem[];

  @state()
  private declare activeId: string;

  private observer: IntersectionObserver | null = null;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: fit-content;
      position: sticky;
      top: var(--space-lg, 2rem);
    }

    .toc-container {
      background: var(--color-background-secondary, #f8f8f8);
      border: 1px solid var(--color-border, #e0e0e0);
      border-radius: 8px;
      padding: var(--space-lg, 2rem);
      max-height: calc(100vh - 4rem);
      overflow-y: auto;
    }

    /* Navigation container */
    .table-of-contents {
      font-size: 0.9rem;
    }

    .toc-title {
      color: var(--color-primary, #2d2d2d);
      font-weight: 600;
      margin: 0 0 var(--space-md, 1.5rem) 0;
      padding-bottom: var(--space-sm, 1rem);
      border-bottom: 2px solid var(--color-border, #e0e0e0);
    }

    /* Lists */
    .toc-list,
    .toc-sublist {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .toc-sublist {
      margin-left: var(--space-md, 1.5rem);
      margin-top: var(--space-xs, 0.5rem);
    }

    /* List items */
    .toc-item {
      margin: 0;
      padding: 0;
    }

    .toc-item:not(:last-child) {
      margin-bottom: var(--space-xs, 0.5rem);
    }

    /* Links */
    .toc-link {
      display: block;
      color: var(--color-text, #212121);
      text-decoration: none;
      padding: var(--space-xs, 0.5rem) var(--space-sm, 1rem);
      border-radius: 4px;
      line-height: 1.4;
      transition: all var(--transition-fast, 0.2s ease);
      border-left: 3px solid transparent;
    }

    .toc-link:hover {
      background: var(--color-background, #ffffff);
      color: var(--color-primary, #2d2d2d);
      text-decoration: none;
      border-left-color: var(--color-border-dark, #bdbdbd);
    }

    .toc-link:focus {
      outline: 2px solid var(--color-accent, #4a4a4a);
      outline-offset: 2px;
    }

    .toc-link.active {
      background: var(--color-primary, #2d2d2d);
      color: var(--color-text-inverse, #ffffff);
      font-weight: 500;
      border-left-color: var(--color-primary-dark, #1a1a1a);
    }

    /* Level-specific styling */
    .toc-level-1 .toc-link {
      font-weight: 500;
      font-size: 1em;
    }

    .toc-level-2 .toc-link {
      font-size: 0.95em;
    }

    .toc-level-3 .toc-link {
      font-size: 0.9em;
      opacity: 0.9;
    }

    .toc-level-4 .toc-link,
    .toc-level-5 .toc-link,
    .toc-level-6 .toc-link {
      font-size: 0.85em;
      opacity: 0.8;
    }

    /* Empty state */
    .toc-empty {
      color: var(--color-text-muted, #616161);
      font-style: italic;
      text-align: center;
      margin: var(--space-md, 1.5rem) 0;
    }

    /* Scrollbar styling */
    .toc-container::-webkit-scrollbar {
      width: 6px;
    }

    .toc-container::-webkit-scrollbar-track {
      background: var(--color-background, #ffffff);
      border-radius: 3px;
    }

    .toc-container::-webkit-scrollbar-thumb {
      background: var(--color-border-dark, #bdbdbd);
      border-radius: 3px;
    }

    .toc-container::-webkit-scrollbar-thumb:hover {
      background: var(--color-primary, #2d2d2d);
    }

    /* Responsive design */
    @media (max-width: 1024px) {
      :host {
        position: relative;
        top: 0;
      }

      .toc-container {
        max-height: none;
        margin-bottom: var(--space-xl, 3rem);
      }
    }

    @media (max-width: 768px) {
      .toc-container {
        padding: var(--space-md, 1.5rem);
      }

      .toc-sublist {
        margin-left: var(--space-sm, 1rem);
      }

      .toc-link {
        padding: var(--space-xs, 0.5rem);
      }
    }

    /* Animation preferences */
    @media (prefers-reduced-motion: reduce) {
      .toc-link {
        transition: none !important;
      }
    }
  `;

  constructor() {
    super();

    // Initialize properties
    this.maxLevel = 6;
    this.targetSelector = "main, article, .content";
    this.tocItems = [];
    this.activeId = "";
    this.observer = null;
  }

  connectedCallback() {
    super.connectedCallback();
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
    super.disconnectedCallback();
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private generateToc(): void {
    this.extractHeadings();
    this.setupIntersectionObserver();
  }

  private extractHeadings(): void {
    // Find the target container (default to main, article, or .content)
    const targetElement = document.querySelector(this.targetSelector);
    if (!targetElement) {
      console.warn(
        "KbrTableOfContents: No target element found for selector:",
        this.targetSelector
      );
      return;
    }

    // Find all headings within the target element
    const headingSelector = Array.from(
      { length: this.maxLevel },
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

        if (entry.isIntersecting) {
          this.activeId = id;
        }
      });
    }, options);

    // Observe all headings
    this.tocItems.forEach((item) => {
      this.observer?.observe(item.element);
    });
  }

  render() {
    if (this.tocItems.length === 0) {
      return html`
        <div class="toc-container">
          <p class="toc-empty">No headings found</p>
        </div>
      `;
    }

    return html`
      <div class="toc-container">
        <nav
          class="table-of-contents"
          role="navigation"
          aria-label="Table of contents"
        >
          <h2 class="toc-title">Table of Contents</h2>
          <ol class="toc-list">
            ${this.renderTocItems()}
          </ol>
        </nav>
      </div>
    `;
  }

  private renderTocItems() {
    if (this.tocItems.length === 0) return "";

    // Group items by level structure
    const renderItem = (item: TocItem) => html`
      <li class="toc-item toc-level-${item.level}">
        <a
          href="#${item.id}"
          class="toc-link ${this.activeId === item.id
            ? "active"
            : ""}"
          @click="${this.handleLinkClick}"
        >
          ${item.text}
        </a>
      </li>
    `;

    // For simplicity in Lit, render all items linearly
    // In a more complex implementation, you'd build the nested structure
    return this.tocItems.map(renderItem);
  }

  private handleLinkClick(event: Event): void {
    event.preventDefault();
    const target = event.target as HTMLAnchorElement;
    const href = target.getAttribute("href");

    if (href?.startsWith("#")) {
      const id = href.substring(1);
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Update active state immediately
        this.activeId = id;
      }
    }
  }
}
