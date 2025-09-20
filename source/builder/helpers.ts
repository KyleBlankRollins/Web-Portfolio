import { readFileSync, existsSync, readdirSync } from "fs";

/**
 * Utility class for file system operations related to the build process
 */
export class FileSystemHelper {
  /**
   * Recursively find all files with specific extensions in a directory
   */
  public static findFiles(
    directory: string,
    extensions: string[]
  ): string[] {
    let directoryPath: string;

    // Avoid concatenating the path for every recursive call
    if (directory.includes("source/site")) {
      directoryPath = directory;
    } else {
      directoryPath = `source/site/${directory}`;
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
      const fullPath = `${directoryPath}/${entry.name}`;

      if (entry.isDirectory()) {
        files.push(...this.findFiles(fullPath, extensions));
      } else if (
        entry.isFile() &&
        extensions.some((ext) => entry.name.endsWith(ext))
      ) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Read file content synchronously
   */
  public static async readFile(filePath: string): Promise<string> {
    return readFileSync(filePath, "utf-8");
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
