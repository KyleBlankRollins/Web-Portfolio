import { FileSystemHelper, BuildLogger } from "./helpers.js";

/**
 * Handles plugin configuration and discovery
 */
export class PluginConfig {
  /**
   * Setup plugin configuration
   */
  setupConfig(config: any, command: string): void {
    // Debug: Log Vite configuration info
    BuildLogger.info(`🔍 Vite command: ${command}`);
    BuildLogger.info(`🔍 Vite root: ${config.root || process.cwd()}`);

    // Discover HTML files for processing
    const htmlFiles = [
      ...FileSystemHelper.findFiles("pages", [".html"]),
      ...FileSystemHelper.findFiles("content", [".html"]),
    ];

    BuildLogger.info(
      `📁 Found ${htmlFiles.length} additional HTML files for processing`
    );
    BuildLogger.info(`📁 Letting Vite handle index.html naturally`);
  }
}
