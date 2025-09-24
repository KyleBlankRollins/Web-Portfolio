import { LitElement, html, css } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import {
  typographyStyles,
  buttonStyles,
  layoutStyles,
} from "../styles/shared-styles.js";

/**
 * Table of Contents Web Component
 *
 * Automatically generates a navigation table of contents from headings (h1-h6)
 * in the page content. Used for blog posts to provide easy navigation.
 *
 * Usage:
 *   <kbr-table-of-contents></kbr-table-of-contents>
 *   <kbr-table-of-contents min-level="1" max-level="3"></kbr-table-of-contents>
 *
 * Properties:
 *   - min-level: Minimum heading level to include (default: 2)
 *   - max-level: Maximum heading level to include (default: 6)
 *   - target-selector: CSS selector for the content container (default: "main, article, .content")
 */

interface TocItem {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
}

@customElement("kbr-table-of-contents")
export class KbrTableOfContents extends LitElement {
  @property({ type: Number, attribute: "min-level" })
  declare minLevel: number;

  @property({ type: Number, attribute: "max-level" })
  declare maxLevel: number;

  @property({ type: String, attribute: "target-selector" })
  declare targetSelector: string;

  @state()
  private declare tocItems: TocItem[];

  @state()
  private declare activeId: string;

  @state()
  private declare showTopIndicator: boolean;

  @state()
  private declare showBottomIndicator: boolean;

  private observer: IntersectionObserver | null = null;
  private tocContainer: HTMLElement | null = null;
  private previousActiveId: string = "";

  static styles = [
    typographyStyles,
    buttonStyles,
    layoutStyles,
    css`
      :host {
        display: block;
        width: 100%;
        height: fit-content;
        position: sticky;
        top: var(--space-lg);
      }

      .toc-wrapper {
        position: relative;
        background: var(--color-background-secondary);
        border: 1px solid var(--color-border);
        border-radius: 8px;
        overflow: hidden;
      }

      .toc-container {
        padding: var(--space-lg);
        max-height: min(calc(100vh - 8rem), 600px);
        overflow-y: auto;
        overflow-x: hidden;
      }

      /* Scroll Indicators */
      .scroll-indicator {
        position: absolute;
        left: 0;
        right: 0;
        height: 20px;
        background: linear-gradient(
          transparent,
          var(--color-background-secondary)
        );
        pointer-events: none;
        opacity: 0;
        transition: opacity var(--transition-normal);
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .scroll-indicator.visible {
        opacity: 1;
      }

      .scroll-indicator-top {
        top: 0;
        background: linear-gradient(
          var(--color-background-secondary),
          transparent
        );
        border-radius: 8px 8px 0 0;
      }

      .scroll-indicator-bottom {
        bottom: 0;
        background: linear-gradient(
          transparent,
          var(--color-background-secondary)
        );
        border-radius: 0 0 8px 8px;
      }

      .scroll-indicator-icon {
        width: 32px;
        height: 32px;
        color: var(--color-text-muted);
        opacity: 0.7;
        animation: scroll-pulse 2s ease-in-out infinite;
      }

      @keyframes scroll-pulse {
        0%,
        100% {
          opacity: 0.4;
        }
        50% {
          opacity: 0.8;
        }
      }

      /* Navigation container - uses base typography from shared styles */
      .table-of-contents {
        font-size: 1rem;
        line-height: 1.2777778rem;
      }

      /* Lists */
      .toc-list,
      .toc-sublist {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .toc-sublist {
        margin-left: var(--space-md);
        margin-top: var(--space-xs);
      }

      /* List items */
      .toc-item {
        margin: 0;
        padding: 0;
      }

      .toc-item:not(:last-child) {
        margin-bottom: var(--space-xs);
      }

      /* Links */
      .toc-link {
        display: block;
        color: var(--color-text);
        text-decoration: none;
        padding: var(--space-xs) var(--space-sm);
        border-radius: 4px;
        line-height: 1.4;
        transition: all var(--transition-fast);
        border-left: 3px solid transparent;
      }

      .toc-link:hover {
        background: var(--color-background);
        color: var(--color-primary);
        text-decoration: none;
        border-left-color: var(--color-border-dark);
      }

      .toc-link:focus {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }

      .toc-link.active {
        background: var(--color-primary);
        color: var(--color-text-inverse);
        font-weight: 500;
        border-left-color: var(--color-primary-dark);
      }

      /* Level-specific styling with progressive indentation */
      .toc-level-1 .toc-link {
        font-weight: 500;
        font-size: 1em;
        padding-left: var(--space-sm);
      }

      .toc-level-2 .toc-link {
        font-size: 0.95em;
        padding-left: var(--space-sm);
      }

      .toc-level-3 .toc-link {
        font-size: 0.9em;
        opacity: 0.9;
        padding-left: calc(var(--space-sm) + 0.5rem);
      }

      .toc-level-4 .toc-link {
        font-size: 0.85em;
        opacity: 0.8;
        padding-left: calc(var(--space-sm) + 1rem);
      }

      .toc-level-5 .toc-link {
        font-size: 0.8em;
        opacity: 0.75;
        padding-left: calc(var(--space-sm) + 1.5rem);
      }

      .toc-level-6 .toc-link {
        font-size: 0.75em;
        opacity: 0.7;
        padding-left: calc(var(--space-sm) + 2rem);
      }

      /* Empty state */
      .toc-empty {
        color: var(--color-text-muted);
        font-style: italic;
        text-align: center;
        margin: var(--space-md) 0;
      }

      /* Scrollbar styling */
      .toc-container::-webkit-scrollbar {
        width: 6px;
      }

      .toc-container::-webkit-scrollbar-track {
        background: var(--color-background);
        border-radius: 3px;
      }

      .toc-container::-webkit-scrollbar-thumb {
        background: var(--color-border-dark);
        border-radius: 3px;
      }

      .toc-container::-webkit-scrollbar-thumb:hover {
        background: var(--color-primary);
      }

      /* Responsive design */
      @media (max-width: 1024px) {
        :host {
          position: relative;
          top: 0;
        }

        .toc-container {
          max-height: min(calc(100vh - 6rem), 400px);
          margin-bottom: var(--space-xl);
        }
      }

      @media (max-width: 768px) {
        .toc-container {
          padding: var(--space-md);
          max-height: min(calc(100vh - 4rem), 300px);
        }

        .toc-sublist {
          margin-left: var(--space-sm);
        }

        /* Reduce indentation on mobile for better space usage */
        .toc-level-3 .toc-link {
          padding-left: calc(var(--space-sm) + 0.25rem);
        }

        .toc-level-4 .toc-link {
          padding-left: calc(var(--space-sm) + 0.5rem);
        }

        .toc-level-5 .toc-link {
          padding-left: calc(var(--space-sm) + 0.75rem);
        }

        .toc-level-6 .toc-link {
          padding-left: calc(var(--space-sm) + 1rem);
        }

        .toc-link {
          padding: var(--space-xs);
        }
      }

      /* Animation preferences */
      @media (prefers-reduced-motion: reduce) {
        .toc-link {
          transition: none !important;
        }
      }
    `,
  ];

  constructor() {
    super();

    // Initialize properties
    this.minLevel = 2; // Default: start from h2
    this.maxLevel = 6; // Default: include up to h6
    this.targetSelector = "main, article, .content";
    this.tocItems = [];
    this.activeId = "";
    this.observer = null;
    this.showTopIndicator = false;
    this.showBottomIndicator = false;
    this.tocContainer = null;
    this.previousActiveId = "";
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

  firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
    super.firstUpdated(changedProperties);
    this.tocContainer = this.shadowRoot?.querySelector(
      ".toc-container"
    ) as HTMLElement;
    if (this.tocContainer) {
      this.tocContainer.addEventListener(
        "scroll",
        this.handleScroll.bind(this)
      );
      // Initial check for scroll indicators
      this.updateScrollIndicators();
    }
  }

  updated(changedProperties: Map<PropertyKey, unknown>) {
    super.updated(changedProperties);

    // If activeId changed, scroll to make it visible
    if (
      changedProperties.has("activeId") &&
      this.activeId !== this.previousActiveId
    ) {
      this.scrollActiveEntryIntoView();
      this.previousActiveId = this.activeId;
    }
  }

  private handleScroll(): void {
    this.updateScrollIndicators();
  }

  private updateScrollIndicators(): void {
    if (!this.tocContainer) return;

    const { scrollTop, scrollHeight, clientHeight } =
      this.tocContainer;

    // Show top indicator if scrolled down
    this.showTopIndicator = scrollTop > 10;

    // Show bottom indicator if there's more content below
    this.showBottomIndicator =
      scrollTop < scrollHeight - clientHeight - 10;
  }

  private scrollActiveEntryIntoView(): void {
    if (!this.tocContainer || !this.activeId) return;

    // Find the active TOC link element
    const activeLink = this.shadowRoot?.querySelector(
      `.toc-link[href="#${this.activeId}"]`
    ) as HTMLElement;

    if (!activeLink) return;

    // Check if the active link is already in view
    const containerRect = this.tocContainer.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    // Calculate relative positions within the container
    const linkTop =
      linkRect.top - containerRect.top + this.tocContainer.scrollTop;
    const linkBottom = linkTop + linkRect.height;
    const containerTop = this.tocContainer.scrollTop;
    const containerBottom =
      containerTop + this.tocContainer.clientHeight;

    // Add some padding to ensure the item isn't right at the edge
    const padding = 20;

    // Check if we need to scroll
    if (linkTop < containerTop + padding) {
      // Link is above the visible area, scroll up
      this.tocContainer.scrollTo({
        top: linkTop - padding,
        behavior: "smooth",
      });
    } else if (linkBottom > containerBottom - padding) {
      // Link is below the visible area, scroll down
      this.tocContainer.scrollTo({
        top: linkBottom - this.tocContainer.clientHeight + padding,
        behavior: "smooth",
      });
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.tocContainer) {
      this.tocContainer.removeEventListener(
        "scroll",
        this.handleScroll.bind(this)
      );
    }
  }

  private generateToc(): void {
    this.extractHeadings();
    this.setupIntersectionObserver();
  }

  // Public method to trigger TOC regeneration (used by parent components)
  public regenerateToc(): void {
    this.generateToc();
  }

  // Public method to update TOC with heading data directly
  public updateWithHeadings(headings: TocItem[]): void {
    console.log("TOC: Updating with headings data:", headings);
    this.tocItems = headings.filter(
      (item) =>
        item.level >= this.minLevel && item.level <= this.maxLevel
    );
    console.log("TOC: Filtered to TOC items:", this.tocItems);
    this.setupIntersectionObserver();
    this.requestUpdate(); // Trigger re-render

    // Update scroll indicators after re-render
    this.updateComplete.then(() => {
      this.updateScrollIndicators();
    });
  }

  private extractHeadings(): void {
    let targetElement;
    let headings: NodeList;

    // Special handling for kbr-timeline component
    if (this.targetSelector === ".timeline") {
      // Find the timeline component in the document
      const timelineElement = document.querySelector("kbr-timeline");

      if (timelineElement && timelineElement.shadowRoot) {
        // Search within the timeline's shadow DOM
        targetElement =
          timelineElement.shadowRoot.querySelector(".timeline");
      }
    } else {
      // Find the target container (default to main, article, or .content)
      targetElement = document.querySelector(this.targetSelector);
    }

    if (!targetElement) {
      console.warn(
        "KbrTableOfContents: No target element found for selector:",
        this.targetSelector
      );
      return;
    }

    // Build heading selector based on min and max levels
    const headingLevels = Array.from(
      { length: this.maxLevel - this.minLevel + 1 },
      (_, i) => `h${this.minLevel + i}`
    );
    const headingSelector = headingLevels.join(", ");

    headings = targetElement.querySelectorAll(headingSelector);

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

      // Include all headings within the specified range
      if (level >= this.minLevel && level <= this.maxLevel) {
        this.tocItems.push({
          id,
          text,
          level,
          element,
        });
      }
    });

    // Update scroll indicators after extracting headings
    this.updateComplete.then(() => {
      this.updateScrollIndicators();
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
        <div class="toc-wrapper">
          <div class="toc-container">
            <p class="toc-empty">No headings found</p>
          </div>
        </div>
      `;
    }

    return html`
      <div class="toc-wrapper">
        <!-- Top scroll indicator -->
        <div
          class="scroll-indicator scroll-indicator-top ${this
            .showTopIndicator
            ? "visible"
            : ""}"
        >
          <svg
            class="scroll-indicator-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="18,15 12,9 6,15"></polyline>
          </svg>
        </div>

        <div class="toc-container" @scroll="${this.handleScroll}">
          <nav
            class="table-of-contents"
            role="navigation"
            aria-label="Table of contents"
          >
            <ol class="toc-list">
              ${this.renderTocItems()}
            </ol>
          </nav>
        </div>

        <!-- Bottom scroll indicator -->
        <div
          class="scroll-indicator scroll-indicator-bottom ${this
            .showBottomIndicator
            ? "visible"
            : ""}"
        >
          <svg
            class="scroll-indicator-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </div>
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
          class="toc-link ui-label ${this.activeId === item.id
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

      // Find the heading in our TOC items (which have the actual element references)
      const tocItem = this.tocItems.find((item) => item.id === id);

      if (tocItem && tocItem.element) {
        tocItem.element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Update active state immediately
        this.activeId = id;

        // Update URL hash
        window.history.replaceState(null, "", `#${id}`);
      }
    }
  }
}
