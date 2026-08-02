import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Utility class for file system operations related to the build process
 */
export class FileSystemHelper {
  /**
   * Recursively find all files with specific extensions in a directory
   */
  public static findFiles(
    directory: string,
    extensions: string[],
    excludeDirectories: string[] = []
  ): string[] {
    let directoryPath: string;

    // Avoid concatenating the path for every recursive call
    if (directory.includes(join("source", "site"))) {
      directoryPath = directory;
    } else {
      directoryPath = join("source", "site", directory);
    }

    const files: string[] = [];

    if (!existsSync(directoryPath)) {
      BuildLogger.info(`🛑 directory path doesn't exist`);

      return files;
    }

    const entries = readdirSync(directoryPath, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const fullPath = join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        // Skip excluded directories
        if (excludeDirectories.includes(entry.name)) {
          BuildLogger.info(`Skipping excluded directory: ${entry.name}`);
          continue;
        }
        files.push(...this.findFiles(fullPath, extensions, excludeDirectories));
      } else if (
        entry.isFile() &&
        extensions.some((ext) => entry.name.endsWith(ext))
      ) {
        files.push(fullPath);
      }
    }

    return files;
  }
}

/**
 * Logger utility for the build process
 */
export class BuildLogger {
  private static logPrefix = "[Build]";

  public static info(message: string): void {
    console.log(`${this.logPrefix} ${message}`);
  }

  public static warn(message: string): void {
    console.warn(`${this.logPrefix} WARNING: ${message}`);
  }

  public static error(message: string): void {
    console.error(`${this.logPrefix} ERROR: ${message}`);
  }

  public static success(message: string): void {
    console.log(`${this.logPrefix} ✓ ${message}`);
  }
}

/**
 * String utility functions for the build process
 */
export class StringHelper {
  /**
   * Escape regex special characters in a string
   */
  public static escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}
