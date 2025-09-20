/**
 * Web component that adds copy-to-clipboard buttons for heading anchors
 * Automatically scans for headings and adds interactive copy buttons
 */
class AnchorCopyComponent extends HTMLElement {
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

  connectedCallback() {
    this.style.display = "contents";
    this.setupAnchorButtons();
    this.highlightAnchorTarget();
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

// Register the custom element
customElements.define("kbr-anchor-copy", AnchorCopyComponent);

export default AnchorCopyComponent;
