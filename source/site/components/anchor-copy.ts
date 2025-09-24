import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

/**
 * Web component that adds copy-to-clipboard buttons for heading anchors
 * Automatically scans for headings and adds interactive copy buttons
 */
@customElement("kbr-anchor-copy")
export default class AnchorCopyComponent extends LitElement {
  private checkIcon = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20,6 9,17 4,12"></polyline>
    </svg>
  `;

  private linkIcon = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  `;

  static styles = css`
    :host {
      display: contents;
    }

    /* Global styles for anchor functionality */
    :host-context(body) .anchor-highlighted {
      background-color: var(--color-shadow);
      border-left: 4px solid var(--color-accent);
      padding-left: 1rem;
      margin-left: -1.25rem;
      border-radius: 4px;
      animation: anchor-highlight-fade 3s ease-out forwards;
    }

    @keyframes anchor-highlight-fade {
      0% {
        background-color: var(--color-shadow-dark);
        border-left-color: var(--color-accent);
      }
      100% {
        background-color: transparent;
        border-left-color: transparent;
      }
    }

    :host-context(body) .heading-with-anchor {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    :host-context(body) .anchor-copy-btn {
      opacity: 0;
      background: none;
      border: none;
      padding: 0.25rem;
      border-radius: 0.25rem;
      cursor: pointer;
      color: var(--text-secondary);
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 24px;
      height: 24px;
      flex-shrink: 0;
    }

    :host-context(body) .anchor-copy-btn:hover {
      color: var(--accent-primary);
      background-color: var(--bg-secondary);
      transform: scale(1.1);
    }

    :host-context(body) .anchor-copy-btn:active {
      transform: scale(0.95);
    }

    :host-context(body) .anchor-copy-btn.copied {
      color: var(--success-color);
    }

    /* Show button on heading hover */
    :host-context(body) .heading-with-anchor:hover .anchor-copy-btn {
      opacity: 1;
    }

    /* Always show on focus for accessibility */
    :host-context(body) .anchor-copy-btn:focus {
      opacity: 1;
      outline: 2px solid var(--accent-primary);
      outline-offset: 2px;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      :host-context(body) .anchor-copy-btn {
        opacity: 1; /* Always visible on mobile */
        position: static;
        margin-left: auto;
      }

      :host-context(body) .heading-with-anchor {
        flex-wrap: wrap;
      }
    }

    /* Dark theme support */
    @media (prefers-color-scheme: dark) {
      :host-context(body) .anchor-copy-btn {
        color: var(--text-secondary-dark);
      }

      :host-context(body) .anchor-copy-btn:hover {
        color: var(--accent-primary-dark);
        background-color: var(--bg-secondary-dark);
      }

      :host-context(body) .anchor-highlighted {
        background-color: var(--accent-primary-light-dark);
        border-left-color: var(--accent-primary-dark);
      }

      @keyframes anchor-highlight-fade {
        0% {
          background-color: var(--accent-primary-light-dark);
          border-left-color: var(--accent-primary-dark);
        }
        100% {
          background-color: transparent;
          border-left-color: transparent;
        }
      }
    }

    /* Ensure headings inside wrapper maintain their styling */
    :host-context(body) .heading-with-anchor h1,
    :host-context(body) .heading-with-anchor h2,
    :host-context(body) .heading-with-anchor h3,
    :host-context(body) .heading-with-anchor h4,
    :host-context(body) .heading-with-anchor h5,
    :host-context(body) .heading-with-anchor h6 {
      margin: 0;
      flex: 1;
    }

    /* Smooth scroll to anchors */
    :host-context(html) {
      scroll-behavior: smooth;
    }

    /* Add some padding for anchor scroll targets */
    :host-context(body) .heading-with-anchor[id]::before,
    :host-context(body) h1[id]::before,
    :host-context(body) h2[id]::before,
    :host-context(body) h3[id]::before,
    :host-context(body) h4[id]::before,
    :host-context(body) h5[id]::before,
    :host-context(body) h6[id]::before {
      content: "";
      display: block;
      height: 80px; /* Adjust based on your header height */
      margin-top: -80px;
      visibility: hidden;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
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
    button.innerHTML = this.linkIcon;
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

      // Show success feedback
      const originalContent = button.innerHTML;
      button.innerHTML = this.checkIcon;
      button.classList.add("copied");

      // Reset after 2 seconds
      setTimeout(() => {
        button.innerHTML = originalContent;
        button.classList.remove("copied");
      }, 2000);
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

      // Show success feedback
      const originalContent = button.innerHTML;
      button.innerHTML = this.checkIcon;
      button.classList.add("copied");

      setTimeout(() => {
        button.innerHTML = originalContent;
        button.classList.remove("copied");
      }, 2000);
    } catch (err) {
      console.error("Fallback copy failed:", err);
    }

    document.body.removeChild(textArea);
  }
}
