import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { imageLightboxStyles } from "./image-lightbox-styles.js";

/**
 * Image Lightbox Component
 *
 * A clickable image that opens in a modal overlay for enlarged viewing.
 * Provides keyboard navigation and accessibility features.
 *
 * @example
 * ```html
 * <kbr-image-lightbox
 *   src="/images/project-screenshot.png"
 *   alt="Project screenshot"
 *   caption="My awesome project interface">
 * </kbr-image-lightbox>
 * ```
 */
@customElement("kbr-image-lightbox")
export class KbrImageLightbox extends LitElement {
  static styles = [imageLightboxStyles];

  /**
   * Image source URL
   */
  @property({ type: String })
  declare src: string;

  /**
   * Alt text for accessibility
   */
  @property({ type: String })
  declare alt: string;

  /**
   * Optional caption to show in the modal
   */
  @property({ type: String })
  declare caption: string;

  /**
   * CSS classes to apply to the image element
   */
  @property({ type: String })
  declare classes: string;

  /**
   * Modal open state
   */
  @state()
  private declare isModalOpen: boolean;

  /**
   * Loading state
   */
  @state()
  private declare isLoading: boolean;

  /**
   * Error state
   */
  @state()
  private declare hasError: boolean;

  connectedCallback() {
    super.connectedCallback();

    // Initialize properties
    if (!this.src) this.src = "";
    if (!this.alt) this.alt = "";
    if (!this.caption) this.caption = "";
    if (!this.classes) this.classes = "";
    if (this.isModalOpen === undefined) this.isModalOpen = false;
    if (this.isLoading === undefined) this.isLoading = true;
    if (this.hasError === undefined) this.hasError = false;

    // Add keyboard event listener
    document.addEventListener("keydown", this.handleKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this.handleKeydown);
    this.closeModal(); // Clean up if component is removed
  }

  /**
   * Handle keyboard events
   */
  private handleKeydown = (event: KeyboardEvent) => {
    if (this.isModalOpen && event.key === "Escape") {
      this.closeModal();
    }
  };

  /**
   * Open the modal
   */
  private openModal() {
    this.isModalOpen = true;
    document.body.style.overflow = "hidden"; // Prevent background scrolling

    // Dispatch custom event for any parent components that might need to know
    this.dispatchEvent(
      new CustomEvent("lightbox-opened", {
        bubbles: true,
        composed: true,
        detail: {
          src: this.src,
          alt: this.alt,
          caption: this.caption,
        },
      })
    );
  }

  /**
   * Close the modal
   */
  private closeModal() {
    this.isModalOpen = false;
    document.body.style.overflow = ""; // Restore scrolling

    // Dispatch custom event
    this.dispatchEvent(
      new CustomEvent("lightbox-closed", {
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Handle image click
   */
  private handleImageClick() {
    if (!this.hasError) {
      this.openModal();
    }
  }

  /**
   * Handle modal backdrop click
   */
  private handleModalClick(event: Event) {
    // Close modal if clicking the backdrop (not the content)
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  /**
   * Handle image load
   */
  private handleImageLoad() {
    this.isLoading = false;
    this.hasError = false;
  }

  /**
   * Handle image error
   */
  private handleImageError() {
    this.isLoading = false;
    this.hasError = true;
  }

  /**
   * Stop event propagation for modal content
   */
  private stopPropagation(event: Event) {
    event.stopPropagation();
  }

  render() {
    return html`
      <!-- Main Image -->
      <div
        class="image-container"
        @click=${this.handleImageClick}
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.handleImageClick();
          }
        }}
        tabindex="0"
        role="button"
        aria-label="Click to enlarge image: ${this.alt}"
      >
        ${this.isLoading
          ? html` <div class="loading">Loading...</div> `
          : nothing}
        ${this.hasError
          ? html` <div class="error">Failed to load image</div> `
          : nothing}
        ${!this.hasError
          ? html`
              <img
                class="image ${this.classes}"
                src="${this.src}"
                alt="${this.alt}"
                @load=${this.handleImageLoad}
                @error=${this.handleImageError}
                style="display: ${this.isLoading ? "none" : "block"}"
              />

              <div class="zoom-overlay">
                <span class="zoom-icon">🔍</span>
              </div>
            `
          : nothing}
      </div>

      <!-- Modal -->
      <div
        class="modal ${this.isModalOpen ? "active" : ""}"
        @click=${this.handleModalClick}
      >
        <button
          class="modal-close"
          @click=${this.closeModal}
          aria-label="Close enlarged image"
        >
          ×
        </button>

        <div class="modal-content" @click=${this.stopPropagation}>
          <img
            class="modal-image"
            src="${this.src}"
            alt="${this.alt}"
          />

          ${this.caption
            ? html` <div class="modal-caption">${this.caption}</div> `
            : nothing}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "kbr-image-lightbox": KbrImageLightbox;
  }
}
