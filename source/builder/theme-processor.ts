import * as fs from "node:fs";
import * as path from "node:path";
import { BuildLogger } from "./helpers.js";

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
}

/**
 * Theme Processor
 *
 * Discovers and processes CSS theme files to generate a theme manifest.
 * Extracts metadata from CSS custom properties in theme files.
 */
export class ThemeProcessor {
  private themes: ThemeManifestEntry[] = [];
  private themesDir: string;

  constructor(themesDir = "") {
    this.themesDir = themesDir;
  }

  /**
   * Discover and process all theme CSS files
   */
  public processThemes(): void {
    if (!fs.existsSync(this.themesDir)) {
      BuildLogger.warn(`Themes directory not found: ${this.themesDir}`);
      return;
    }

    const files = fs.readdirSync(this.themesDir);
    const themeFiles = files.filter(
      (file) => file.startsWith("theme-") && file.endsWith(".css")
    );

    BuildLogger.info(`🎨 Processing ${themeFiles.length} theme files...`);

    this.processThemeSources(
      new Map(
        themeFiles.map((file) => [
          file,
          fs.readFileSync(path.join(this.themesDir, file), "utf-8"),
        ])
      )
    );
  }

  public processThemeSources(themeSources: ReadonlyMap<string, string>): void {
    this.themes = [];
    for (const [file, content] of themeSources) {
      if (!file.startsWith("theme-") || !file.endsWith(".css")) {
        continue;
      }
      const theme = this.processThemeContent(content, file);
      if (theme) {
        this.themes.push(theme);
        BuildLogger.info(`✓ Processed theme: ${theme.name} (${theme.id})`);
      }
    }
  }

  /**
   * Process a single theme CSS file and extract metadata
   */
  private processThemeContent(
    content: string,
    fileName: string
  ): ThemeManifestEntry | null {
    try {
      // Extract theme ID from filename (theme-{id}.css)
      const themeId = fileName.replace(/^theme-/, "").replace(/\.css$/, "");

      // Find the theme selector block
      const selectorMatch = content.match(
        new RegExp(`\\[data-theme="${themeId}"\\]\\s*\\{([^}]+)\\}`, "s")
      );
      if (!selectorMatch) {
        BuildLogger.warn(
          `Could not find theme selector for ${themeId} in ${fileName}`
        );
        return null;
      }

      const themeBlock = selectorMatch[1];

      // Extract metadata from CSS custom properties
      const metadata = this.extractMetadata(themeBlock);

      const theme: ThemeManifestEntry = {
        id: themeId,
        name: metadata["name"] || this.formatThemeName(themeId),
        version: metadata["version"],
        author: metadata["author"],
        description: metadata["description"],
        file: fileName,
        metadata,
      };

      return theme;
    } catch (error) {
      BuildLogger.error(`Error processing theme file ${fileName}: ${error}`);
      return null;
    }
  }

  /**
   * Extract metadata from CSS custom properties
   */
  private extractMetadata(cssBlock: string): Record<string, string> {
    const metadata: Record<string, string> = {};

    // Match CSS custom properties that start with --theme-
    const metadataRegex = /--theme-([^:]+):\s*"([^"]+)"/g;
    let match;

    while ((match = metadataRegex.exec(cssBlock)) !== null) {
      const key = match[1].trim();
      const value = match[2].trim();
      metadata[key] = value;
    }

    return metadata;
  }

  /**
   * Format theme ID into a readable name
   */
  private formatThemeName(themeId: string): string {
    return themeId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  /**
   * Generate theme manifest as JSON string
   */
  public generateThemeManifestJson(): string {
    const manifest: ThemeManifest = {
      themes: this.themes,
      totalThemes: this.themes.length,
    };

    return JSON.stringify(manifest, null, 2);
  }

  /**
   * Get theme manifest data
   */
  public getThemeManifest(): ThemeManifest {
    return {
      themes: this.themes,
      totalThemes: this.themes.length,
    };
  }
}
