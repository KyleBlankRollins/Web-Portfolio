/**
 * Theme Configuration
 *
 * This module loads themes from the generated theme manifest and configures
 * the theme switcher component. Themes are automatically discovered from CSS files.
 */

export interface ThemeConfig {
  name: string;
  id: string;
}

export interface ThemeManifestEntry {
  id: string;
  name: string;
  version?: string;
  author?: string;
  description?: string;
  file: string;
  metadata: Record<string, string>;
}

export interface ThemeManifest {
  themes: ThemeManifestEntry[];
  totalThemes: number;
  generatedAt: string;
}

// Global cache for themes
let themesCache: ThemeConfig[] | null = null;

/**
 * Load themes from the theme manifest
 */
export async function loadThemes(): Promise<ThemeConfig[]> {
  if (themesCache) {
    return themesCache;
  }

  try {
    const response = await fetch("/data/theme-manifest.json");
    if (!response.ok) {
      throw new Error(
        `Failed to load theme manifest: ${response.status}`
      );
    }

    const manifest: ThemeManifest = await response.json();

    // Convert manifest entries to theme config format
    themesCache = manifest.themes.map(
      (entry: ThemeManifestEntry): ThemeConfig => ({
        id: entry.id,
        name: entry.name,
      })
    );

    return themesCache;
  } catch (error) {
    console.error("Failed to load themes from manifest:", error);

    // Fallback to empty array - components should handle this gracefully
    themesCache = [];
    return themesCache;
  }
}

/**
 * Configure theme switcher components with available themes
 */
export function configureThemeSwitcher() {
  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setupThemes();
    });
  } else {
    setupThemes();
  }
}

async function setupThemes() {
  try {
    // Load themes from manifest
    const themes = await loadThemes();

    // Find all theme switcher components
    const themeSwitchers = document.querySelectorAll(
      "kbr-theme-switcher"
    );

    themeSwitchers.forEach((switcher: any) => {
      // Configure themes
      switcher.themes = themes;

      // Set default theme if not already set
      if (!switcher.currentTheme && themes.length > 0) {
        switcher.currentTheme = themes[0].id;
      }
    });
  } catch (error) {
    console.error("Failed to setup themes:", error);
  }
}

/**
 * Get theme configuration by ID
 */
export async function getThemeById(
  id: string
): Promise<ThemeConfig | undefined> {
  const themes = await loadThemes();
  return themes.find((theme: ThemeConfig) => theme.id === id);
}

/**
 * Get all available theme IDs
 */
export async function getAvailableThemeIds(): Promise<string[]> {
  const themes = await loadThemes();
  return themes.map((theme: ThemeConfig) => theme.id);
}
