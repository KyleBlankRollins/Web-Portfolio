import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { iconStyles } from "./icon.style.js";
import { reducedMotionStyles } from "../../styles/shared-styles.js";

/**
 * Available icon names (matches files in assets/icons/)
 */
const AVAILABLE_ICONS = [
  "bookmark",
  "checkbox_checked",
  "chevron_down",
  "chevron_up",
  "code",
  "coffee",
  "compass",
  "document",
  "filter_circle",
  "hierarchy",
  "link",
  "warning_hex",
  "warning_triangle",
  "projector",
  "terminal",
];

/**
 * Icon Component
 *
 * Renders SVG icons from the assets/icons directory.
 * Supports dynamic loading, error handling, and CSS class application.
 *
 * @example
 * ```html
 * <kbr-icon name="document" classes="icon-lg text-primary"></kbr-icon>
 * <kbr-icon name="code" classes="icon-sm"></kbr-icon>
 * ```
 */
@customElement("kbr-icon")
export class KbrIcon extends LitElement {
  static styles = [iconStyles, reducedMotionStyles];

  /**
   * Icon name - should match an SVG file in assets/icons/ without the .svg extension
   */
  @property({ type: String })
  declare name: string;

  /**
   * CSS classes to apply to the host element (space-separated string)
   */
  @property({ type: String })
  declare classes: string;

  /**
   * Optional size override (CSS value like "24px", "2rem", etc.)
   */
  @property({ type: String })
  declare size: string;

  /**
   * Internal state for SVG content
   */
  @state()
  declare private svgContent: string;

  /**
   * Loading state
   */
  @state()
  declare private isLoading: boolean;

  /**
   * Error state
   */
  @state()
  declare private hasError: boolean;

  connectedCallback() {
    super.connectedCallback();

    // Initialize properties with default values
    if (!this.name) this.name = "";
    if (!this.classes) this.classes = "";
    if (!this.size) this.size = "";
    if (!this.svgContent) this.svgContent = "";
    if (this.isLoading === undefined) this.isLoading = false;
    if (this.hasError === undefined) this.hasError = false;

    this.updateClasses();
    this.loadIcon();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has("classes")) {
      this.updateClasses();
    }
    if (changedProperties.has("name")) {
      this.loadIcon();
    }
  }

  /**
   * Apply CSS classes to the host element
   */
  private updateClasses() {
    // Remove all existing classes except component classes
    const existingClasses = Array.from(this.classList);
    existingClasses.forEach((className) => {
      if (!className.startsWith("hydrated") && className !== "kbr-icon") {
        this.classList.remove(className);
      }
    });

    // Add new classes
    if (this.classes) {
      const classArray = this.classes.split(" ").filter((cls) => cls.trim());
      classArray.forEach((className) => {
        this.classList.add(className);
      });
    }

    // Add state classes
    if (this.isLoading) {
      this.classList.add("loading");
    } else {
      this.classList.remove("loading");
    }

    if (this.hasError) {
      this.classList.add("error");
    } else {
      this.classList.remove("error");
    }
  }

  /**
   * Load SVG content from the icons directory
   */
  private async loadIcon() {
    if (!this.name) {
      this.svgContent = "";
      this.hasError = false;
      this.isLoading = false;
      return;
    }

    // Check if icon name is valid
    if (!AVAILABLE_ICONS.includes(this.name)) {
      console.warn(
        `Icon "${this.name}" not found. Available icons:`,
        AVAILABLE_ICONS
      );
      this.hasError = true;
      this.isLoading = false;
      this.updateClasses();
      return;
    }

    this.isLoading = true;
    this.hasError = false;
    this.updateClasses();

    try {
      const response = await fetch(`/assets/icons/${this.name}.svg`);

      if (!response.ok) {
        throw new Error(`Failed to load icon: ${response.status}`);
      }

      let svgText = await response.text();

      // Process the SVG to ensure it works well in our component
      svgText = this.processSvg(svgText);

      this.svgContent = svgText;
      this.hasError = false;
    } catch (error) {
      console.error(`Error loading icon "${this.name}":`, error);
      this.hasError = true;
      this.svgContent = "";
    } finally {
      this.isLoading = false;
      this.updateClasses();
    }
  }

  /**
   * Process SVG content for optimal rendering in the component
   */
  private processSvg(svgText: string): string {
    // Parse the SVG to modify attributes
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, "image/svg+xml");
    const svgElement = doc.querySelector("svg");

    if (!svgElement) {
      throw new Error("Invalid SVG content");
    }

    // Ensure the SVG uses currentColor for stroke and fill if not already set
    if (!svgElement.hasAttribute("fill")) {
      svgElement.setAttribute("fill", "currentColor");
    }

    // Remove fixed dimensions if present, let CSS handle sizing
    svgElement.removeAttribute("width");
    svgElement.removeAttribute("height");

    // Add size override if specified
    if (this.size) {
      svgElement.style.width = this.size;
      svgElement.style.height = this.size;
    }

    return svgElement.outerHTML;
  }

  /**
   * Render a fallback icon when there's an error
   */
  private renderFallback() {
    return html`
      <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
        <g
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="10.5" cy="10.5" r="8" />
          <path d="M10.5 14.5v-4" />
          <circle cx="10.5" cy="6.5" r="0.5" fill="currentColor" />
        </g>
      </svg>
    `;
  }

  render() {
    if (this.hasError) {
      return this.renderFallback();
    }

    if (this.isLoading) {
      return html`
        <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10.5" cy="10.5" r="2" fill="currentColor" opacity="0.5" />
        </svg>
      `;
    }

    if (!this.svgContent) {
      return nothing;
    }

    return html`${unsafeHTML(this.svgContent)}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "kbr-icon": KbrIcon;
  }
}
