import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { themeSwitcherStyles } from "./theme-switcher.style.js";
import type { ThemeConfig } from "../../theme-config.js";
import { reducedMotionStyles } from "../../styles/shared-styles.js";
import {
  COLOR_SCHEME_STORAGE_KEY,
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
} from "../../theme-constants.js";

/**
 * Theme Switcher Component
 *
 * Provides UI for switching between themes and color schemes (light/dark mode).
 * Persists user preferences in localStorage and applies them to the document.
 *
 * Themes should be configured programmatically via the themes property or
 * through the theme-config module.
 *
 * @example
 * ```html
 * <kbr-theme-switcher></kbr-theme-switcher>
 * ```
 *
 * Events:
 * - theme-changed: Fired when theme or color scheme changes
 * - theme-loaded: Fired when saved theme is loaded from localStorage
 */

@customElement("kbr-theme-switcher")
export class KbrThemeSwitcher extends LitElement {
  static styles = [themeSwitcherStyles, reducedMotionStyles];

  /**
   * Available themes configuration
   */
  @property({ type: Array })
  declare themes: ThemeConfig[];

  /**
   * Current active theme ID
   */
  @state()
  declare currentTheme: string;

  /**
   * Current color scheme (light/dark)
   */
  @state()
  declare currentColorScheme: "light" | "dark";

  /**
   * Whether the theme switcher is collapsed
   */
  @state()
  declare isCollapsed: boolean;

  /**
   * Storage keys for persistence
   */
  private readonly STORAGE_KEYS = {
    theme: THEME_STORAGE_KEY,
    colorScheme: COLOR_SCHEME_STORAGE_KEY,
  };

  constructor() {
    super();

    // Initialize other properties with minimal defaults
    this.currentTheme = "";
    this.currentColorScheme = "light";
    this.isCollapsed = true;
  }

  connectedCallback() {
    super.connectedCallback();

    // Load saved preferences
    this.loadSavedTheme();

    // Listen for system color scheme changes
    this.setupSystemColorSchemeListener();

    // Update host classes
    this.updateHostClasses();
  }

  /**
   * Load theme and color scheme from localStorage or detect system preferences
   */
  private loadSavedTheme() {
    // Load theme preference
    const savedTheme = localStorage.getItem(this.STORAGE_KEYS.theme);
    // The blocking bootstrap in templates/partials/head.html uses the same constants.
    this.currentTheme = savedTheme || DEFAULT_THEME;

    // Load color scheme preference or detect system preference
    const savedColorScheme = localStorage.getItem(
      this.STORAGE_KEYS.colorScheme
    );
    if (savedColorScheme) {
      this.currentColorScheme = savedColorScheme as "light" | "dark";
    } else {
      // Detect system preference
      this.currentColorScheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches
        ? "dark"
        : "light";
    }

    // Apply theme to document
    this.applyTheme();
  }

  /**
   * Listen for system color scheme changes
   */
  private setupSystemColorSchemeListener() {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    mediaQuery.addEventListener("change", (e) => {
      // Only update if user hasn't explicitly set a preference
      if (!localStorage.getItem(this.STORAGE_KEYS.colorScheme)) {
        this.currentColorScheme = e.matches ? "dark" : "light";
        this.applyTheme();
        this.dispatchChangeEvent();
      }
    });
  }

  /**
   * Apply current theme and color scheme to document
   */
  private applyTheme() {
    const html = document.documentElement;

    // Set theme attribute
    html.setAttribute("data-theme", this.currentTheme);

    // Set color scheme attribute
    html.setAttribute("data-color-scheme", this.currentColorScheme);

    // Also set the color-scheme CSS property for form controls
    html.style.colorScheme = this.currentColorScheme;
  }

  /**
   * Save theme preferences to localStorage
   */
  private saveThemePreferences() {
    localStorage.setItem(this.STORAGE_KEYS.theme, this.currentTheme);
    localStorage.setItem(
      this.STORAGE_KEYS.colorScheme,
      this.currentColorScheme
    );
  }

  /**
   * Dispatch theme change event
   */
  private dispatchChangeEvent() {
    this.dispatchEvent(
      new CustomEvent("theme-changed", {
        bubbles: true,
        composed: true,
        detail: {
          theme: this.currentTheme,
          colorScheme: this.currentColorScheme,
        },
      })
    );
  }

  /**
   * Handle theme selection change
   */
  private handleThemeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.currentTheme = select.value;
    this.applyTheme();
    this.saveThemePreferences();
    this.dispatchChangeEvent();
  }

  /**
   * Handle color scheme toggle
   */
  private handleColorSchemeToggle() {
    this.currentColorScheme =
      this.currentColorScheme === "light" ? "dark" : "light";

    this.applyTheme();
    this.saveThemePreferences();
    this.dispatchChangeEvent();
  }

  /**
   * Update host element classes based on state
   */
  private updateHostClasses() {
    if (this.isCollapsed) {
      this.classList.add("collapsed");
    } else {
      this.classList.remove("collapsed");
    }
  }

  /**
   * Toggle collapsed/expanded state
   */
  private handleToggle() {
    this.isCollapsed = !this.isCollapsed;
    this.updateHostClasses();
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("isCollapsed")) {
      this.updateHostClasses();
    }
  }

  render() {
    // Don't render if themes haven't been configured yet
    if (
      !this.themes ||
      !Array.isArray(this.themes) ||
      this.themes.length === 0
    ) {
      return html`<div class="theme-switcher loading">Loading themes...</div>`;
    }

    // The trigger renders in both states rather than being swapped out for
    // the panel. It lives in the site header now, so if it disappeared while
    // open the host would collapse to zero width and shove the nav links
    // sideways. The panel is absolutely positioned beneath it instead.
    return html`
      <div
        class="theme-switcher ${this.isCollapsed ? "collapsed" : "expanded"}"
      >
        <button
          class="collapsed-trigger"
          @click=${this.handleToggle}
          aria-expanded=${this.isCollapsed ? "false" : "true"}
          aria-label="Theme settings, ${this.currentColorScheme} mode"
        >
          <kbr-icon name="projector" classes="trigger-icon"></kbr-icon>
          <span class="trigger-text">Themes</span>
        </button>
        ${this.isCollapsed
          ? null
          : html`
              <div class="theme-panel">
                <div class="theme-controls">
                  <!-- Theme Selection -->
                  <div class="theme-select">
                    <label for="theme-dropdown">Theme:</label>
                    <select
                      id="theme-dropdown"
                      class="theme-dropdown"
                      .value=${this.currentTheme}
                      @change=${this.handleThemeChange}
                    >
                      ${this.themes.map(
                        (theme) => html`
                          <option
                            value=${theme.id}
                            ?selected=${theme.id === this.currentTheme}
                          >
                            ${theme.name}
                          </option>
                        `
                      )}
                    </select>
                  </div>

                  <!-- Color Scheme Toggle -->
                  <div class="color-scheme-toggle">
                    <label for="color-scheme-toggle">
                      Mode:
                      <span class="mode-indicator"
                        >${this.currentColorScheme === "dark"
                          ? "Dark"
                          : "Light"}</span
                      >
                    </label>
                    <div class="toggle-switch">
                      <input
                        type="checkbox"
                        id="color-scheme-toggle"
                        class="toggle-input"
                        .checked=${this.currentColorScheme === "dark"}
                        @click=${this.handleColorSchemeToggle}
                        aria-label=${this.currentColorScheme === "dark"
                          ? "Switch to light mode"
                          : "Switch to dark mode"}
                      />
                      <div class="toggle-track"></div>
                      <div class="toggle-thumb"></div>
                    </div>
                  </div>
                </div>
              </div>
            `}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "kbr-theme-switcher": KbrThemeSwitcher;
  }
}
