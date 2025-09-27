import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { typographyStyles } from "../../styles/shared-styles.js";
import { admonitionStyles } from "./admonition-styles.js";
import "../icon/icon.js";

/**
 * Admonition types with their corresponding icons
 */
const ADMONITION_CONFIG = {
  note: { icon: "document", class: "admonition-note" },
  tip: { icon: "info_circle", class: "admonition-tip" },
  important: {
    icon: "warning_triangle",
    class: "admonition-important",
  },
  warning: { icon: "warning_hex", class: "admonition-warning" },
  caution: { icon: "warning_hex", class: "admonition-caution" },
} as const;

type AdmonitionType = keyof typeof ADMONITION_CONFIG;

/**
 * Admonition Component
 *
 * Renders styled admonition blocks for blog posts with appropriate icons and colors.
 * Supports five types: note, tip, important, warning, and caution.
 *
 * Shows a header with icon and title when title property is provided,
 * or a compact layout with inline icon when no title is specified.
 *
 * @example
 * ```html
 * <!-- Compact layout (no title) -->
 * <kbr-admonition type="note">
 *   This is a note with no header.
 * </kbr-admonition>
 *
 * <!-- Header layout (with title) -->
 * <kbr-admonition type="warning" title="Important Warning">
 *   This warning has a header with custom title.
 * </kbr-admonition>
 * ```
 */
@customElement("kbr-admonition")
export class KbrAdmonition extends LitElement {
  static styles = [typographyStyles, admonitionStyles];

  /**
   * Type of admonition (note, tip, important, warning, caution)
   */
  @property({ type: String })
  declare type: AdmonitionType;

  /**
   * Optional title for the admonition. When provided, shows a header with icon and title.
   * When not provided, uses compact layout with inline icon.
   */
  @property({ type: String, attribute: "title" })
  declare admonitionTitle?: string;

  private getConfig() {
    return ADMONITION_CONFIG[this.type] || ADMONITION_CONFIG.note;
  }

  private hasTitle(): boolean {
    return Boolean(
      this.admonitionTitle && this.admonitionTitle.trim()
    );
  }

  render() {
    const config = this.getConfig();
    const hasTitle = this.hasTitle();

    return html`
      <div
        class="admonition ${config.class} ${hasTitle
          ? ""
          : "compact"}"
      >
        ${hasTitle
          ? html`
              <!-- Header layout -->
              <div class="admonition-header">
                <kbr-icon name="${config.icon}"></kbr-icon>
                <strong>${this.admonitionTitle}</strong>
              </div>
              <div class="admonition-content">
                <slot></slot>
              </div>
            `
          : html`
              <!-- Compact layout -->
              <div class="admonition-icon">
                <kbr-icon name="${config.icon}"></kbr-icon>
              </div>
              <div class="admonition-content">
                <slot></slot>
              </div>
            `}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "kbr-admonition": KbrAdmonition;
  }
}
