import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { themeSwitcherStyles } from "./theme-switcher-styles.js";

/**
 * Theme Switcher Component
 *
 * Provides UI for switching between themes and color schemes (light/dark mode).
 * Persists user preferences in localStorage and applies them to the document.
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

interface ThemeConfig {
  name: string;
  id: string;
  colors: {
    primary: string;
    accent: string;
    secondary: string;
  };
}

@customElement("kbr-theme-switcher")
export class KbrThemeSwitcher extends LitElement {
  static styles = [themeSwitcherStyles];

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
   * Whether to show theme preview swatches
   */
  @property({ type: Boolean, attribute: "show-preview" })
  declare showPreview: boolean;

  /**
   * Whether the theme switcher is collapsed
   */
  @state()
  declare isCollapsed: boolean;

  /**
   * Storage keys for persistence
   */
  private readonly STORAGE_KEYS = {
    theme: "kbr-theme",
    colorScheme: "kbr-color-scheme",
  };

  connectedCallback() {
    super.connectedCallback();

    // Initialize default themes if none provided
    if (!this.themes) {
      this.themes = [
        {
          name: "Basic Blue",
          id: "base",
          colors: {
            primary: "#2d2d2d",
            accent: "#2563eb",
            secondary: "#4a4a4a",
          },
        },
        {
          name: "Canney Valley",
          id: "canney-valley",
          colors: {
            primary: "#66ab68",
            accent: "#96687f",
            secondary: "#263238",
          },
        },
      ];
    }

    // Initialize properties
    if (this.showPreview === undefined) this.showPreview = true;
    if (this.isCollapsed === undefined) this.isCollapsed = true; // Collapsed by default

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
    this.currentTheme = savedTheme || "base";

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

    // Dispatch loaded event
    this.dispatchEvent(
      new CustomEvent("theme-loaded", {
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
   * Listen for system color scheme changes
   */
  private setupSystemColorSchemeListener() {
    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

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
  private handleColorSchemeToggle(event: Event) {
    console.log("Toggle clicked!", event);
    console.log("Current scheme:", this.currentColorScheme);

    this.currentColorScheme =
      this.currentColorScheme === "light" ? "dark" : "light";

    console.log("New scheme:", this.currentColorScheme);

    this.applyTheme();
    this.saveThemePreferences();
    this.dispatchChangeEvent();
  }

  /**
   * Get current theme configuration
   */
  private getCurrentThemeConfig(): ThemeConfig | undefined {
    return this.themes.find(
      (theme) => theme.id === this.currentTheme
    );
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
    const currentThemeConfig = this.getCurrentThemeConfig();

    return html`
      <div
        class="theme-switcher ${this.isCollapsed
          ? "collapsed"
          : "expanded"}"
      >
        ${this.isCollapsed
          ? html`
              <!-- Collapsed State -->
              <div
                class="collapsed-trigger"
                @click=${this.handleToggle}
              >
                <kbr-icon
                  name="projector"
                  classes="trigger-icon"
                ></kbr-icon>
                <span class="trigger-text">Themes</span>
              </div>
            `
          : html`
              <!-- Expanded State -->
              <div
                class="expanded-header"
                @click=${this.handleToggle}
              >
                <kbr-icon
                  name="projector"
                  classes="trigger-icon"
                ></kbr-icon>
                <span class="trigger-text">Themes</span>
              </div>
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
                        <option value=${theme.id}>
                          ${theme.name}
                        </option>
                      `
                    )}
                  </select>
                </div>
                <!-- Theme Preview -->
                ${this.showPreview && currentThemeConfig
                  ? html`
                      <div
                        class="theme-preview"
                        title="Theme colors preview"
                      >
                        <div
                          class="color-swatch swatch-primary"
                          style="background-color: ${currentThemeConfig
                            .colors.primary}"
                          title="Primary color"
                        ></div>
                        <div
                          class="color-swatch swatch-accent"
                          style="background-color: ${currentThemeConfig
                            .colors.accent}"
                          title="Accent color"
                        ></div>
                        <div
                          class="color-swatch swatch-secondary"
                          style="background-color: ${currentThemeConfig
                            .colors.secondary}"
                          title="Secondary color"
                        ></div>
                      </div>
                    `
                  : ""}

                <!-- Color Scheme Toggle -->
                <div class="color-scheme-toggle">
                  <label for="color-scheme-toggle">Mode:</label>
                  <div class="toggle-switch">
                    <input
                      type="checkbox"
                      id="color-scheme-toggle"
                      class="toggle-input"
                      .checked=${this.currentColorScheme === "dark"}
                      @click=${this.handleColorSchemeToggle}
                      aria-label="Toggle between light and dark mode"
                    />
                    <div class="toggle-track"></div>
                    <div class="toggle-thumb"></div>
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
