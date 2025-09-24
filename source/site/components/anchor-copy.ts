import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { typographyStyles } from "../styles/shared-styles.js";
import "./icon/icon.js";

/**
 * Web component that adds copy-to-clipboard buttons for heading anchors
 * Automatically scans for headings and adds interactive copy buttons
 */
@customElement("kbr-anchor-copy")
export default class AnchorCopyComponent extends LitElement {
  static styles = [
    typographyStyles,
    css`
      :host {
        display: contents;
      }
    `,
  ];

  /**
   * Inject global styles for anchor functionality. Can't use static style because this component needs to affect elements outside of its shadow DOM.
   */
  private injectGlobalStyles(): void {
    // Check if styles are already injected
    if (document.querySelector("#anchor-copy-styles")) {
      return;
    }

    const styleSheet = document.createElement("style");
    styleSheet.id = "anchor-copy-styles";
    styleSheet.textContent = `
      /* Global styles for anchor functionality */
      .anchor-highlighted {
        background-color: var(--color-background-secondary);
        border-left: 4px solid var(--color-primary);
        padding-left: 1rem;
        margin-left: -1.25rem;
        border-radius: 4px;
        animation: anchor-highlight-fade 3s ease-out forwards;
      }

      @keyframes anchor-highlight-fade {
        0% {
          background-color: var(--color-background-secondary);
          border-left-color: var(--color-primary);
        }
        100% {
          background-color: transparent;
          border-left-color: transparent;
        }
      }

      .heading-with-anchor {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .anchor-copy-btn {
        /* Base button styles */
        opacity: 0;
        background: transparent;
        border: 1px solid transparent;
        padding: var(--space-xs);
        border-radius: 4px;
        cursor: pointer;
        color: var(--color-text-muted);
        transition: all var(--transition-fast);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 24px;
        height: 24px;
        flex-shrink: 0;
        font-family: inherit;
        user-select: none;
      }

      .anchor-copy-btn:hover {
        color: var(--color-primary);
        background-color: var(--color-background-secondary);
        transform: scale(1.1);
      }

      .anchor-copy-btn:active {
        transform: scale(0.95);
      }

      .anchor-copy-btn.copied {
        color: var(--color-success);
      }

      /* Show button on heading hover */
      .heading-with-anchor:hover .anchor-copy-btn {
        opacity: 1;
      }

      /* Always show on focus for accessibility */
      .anchor-copy-btn:focus {
        opacity: 1;
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }

      /* Responsive adjustments */
      @media (max-width: 768px) {
        .anchor-copy-btn {
          opacity: 1; /* Always visible on mobile */
          position: static;
          margin-left: auto;
        }

        .heading-with-anchor {
          flex-wrap: wrap;
        }
      }

      /* Ensure headings inside wrapper maintain their styling */
      .heading-with-anchor h1,
      .heading-with-anchor h2,
      .heading-with-anchor h3,
      .heading-with-anchor h4,
      .heading-with-anchor h5,
      .heading-with-anchor h6 {
        margin: 0;
        flex: 1;
      }

      /* Smooth scroll to anchors */
      html {
        scroll-behavior: smooth;
      }

      /* Add some padding for anchor scroll targets */
      .heading-with-anchor[id]::before,
      h1[id]::before,
      h2[id]::before,
      h3[id]::before,
      h4[id]::before,
      h5[id]::before,
      h6[id]::before {
        content: "";
        display: block;
        height: 80px; /* Adjust based on your header height */
        margin-top: -80px;
        visibility: hidden;
      }
    `;

    document.head.appendChild(styleSheet);
  }

  connectedCallback() {
    super.connectedCallback();
    this.injectGlobalStyles();
    this.setupAnchorButtons();
    this.highlightAnchorTarget();
  }

  render() {
    // This component doesn't render its own content
    return html``;
  }

  /**
   * Find all headings and add anchor copy functionality
   */
  private setupAnchorButtons(): void {
    // Look for headings in the main article content
    const article =
      document.querySelector(".blog-post-content") || document;
    const headings = article.querySelectorAll(
      "h1, h2, h3, h4, h5, h6"
    );

    headings.forEach((heading) => {
      this.processHeading(heading as HTMLHeadingElement);
    });
  }

  /**
   * Highlight the target heading if URL contains an anchor
   */
  private highlightAnchorTarget(): void {
    // Check if there's a hash in the URL
    const hash = window.location.hash;
    if (!hash) return;

    // Remove the # from the hash to get the ID
    const targetId = hash.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      // Add highlight class immediately
      targetElement.classList.add("anchor-highlighted");

      // Remove highlight after 3 seconds
      setTimeout(() => {
        targetElement.classList.remove("anchor-highlighted");
      }, 3000);

      // Ensure the element is scrolled into view (with some delay to ensure rendering)
      setTimeout(() => {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }

  /**
   * Process an individual heading to add anchor functionality
   */
  private processHeading(heading: HTMLHeadingElement): void {
    // Generate an ID if the heading doesn't have one
    if (!heading.id) {
      heading.id = this.generateAnchorId(heading.textContent || "");
    }

    // Create the anchor copy button
    const copyButton = this.createCopyButton(heading.id);

    // Create a wrapper to position the button relative to the heading
    const headingWrapper = document.createElement("div");
    headingWrapper.className = "heading-with-anchor";

    // Replace the heading in the DOM
    heading.parentNode?.insertBefore(headingWrapper, heading);
    headingWrapper.appendChild(heading);
    headingWrapper.appendChild(copyButton);
  }

  /**
   * Generate a URL-safe anchor ID from heading text
   */
  private generateAnchorId(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/--+/g, "-") // Replace multiple hyphens with single
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
  }

  /**
   * Create the copy button element
   */
  private createCopyButton(headingId: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = "anchor-copy-btn";

    // Create and append the link icon
    const linkIcon = document.createElement("kbr-icon");
    linkIcon.setAttribute("name", "link");
    linkIcon.setAttribute("classes", "icon-xl");
    button.appendChild(linkIcon);

    button.title = "Copy link to this section";
    button.setAttribute(
      "aria-label",
      `Copy link to ${headingId} section`
    );

    // Add click handler
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      await this.copyAnchorLink(headingId, button);
    });

    return button;
  }

  /**
   * Copy the anchor link to clipboard and show feedback
   */
  private async copyAnchorLink(
    headingId: string,
    button: HTMLButtonElement
  ): Promise<void> {
    const url = `${window.location.origin}${window.location.pathname}#${headingId}`;

    try {
      await navigator.clipboard.writeText(url);

      // Show success feedback by replacing the icon
      const linkIcon = button.querySelector("kbr-icon");
      if (linkIcon) {
        linkIcon.setAttribute("name", "checkbox_checked");
        button.classList.add("copied");

        // Reset after 2 seconds
        setTimeout(() => {
          linkIcon.setAttribute("name", "link");
          button.classList.remove("copied");
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to copy link:", err);

      // Fallback for older browsers
      this.fallbackCopyToClipboard(url, button);
    }
  }

  /**
   * Fallback copy method for older browsers
   */
  private fallbackCopyToClipboard(
    text: string,
    button: HTMLButtonElement
  ): void {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");

      // Show success feedback by replacing the icon
      const linkIcon = button.querySelector("kbr-icon");
      if (linkIcon) {
        linkIcon.setAttribute("name", "checkbox_checked");
        button.classList.add("copied");

        setTimeout(() => {
          linkIcon.setAttribute("name", "link");
          button.classList.remove("copied");
        }, 2000);
      }
    } catch (err) {
      console.error("Fallback copy failed:", err);
    }

    document.body.removeChild(textArea);
  }
}
