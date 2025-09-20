import { readFileSync, existsSync, readdirSync, mkdirSync } from "fs";
import { join } from "path";
import { IncludeNames } from "./types.ts";

/**
 * Resolves HTML includes and injects them into HTML content
 */
export class IncludeResolver {
  private includesPath: string;
  private globalIncludesPath: string;

  constructor(
    includesPath: string = "source/site/includes",
    globalIncludesPath: string = "source/site/includes/global"
  ) {
    this.includesPath = includesPath;
    this.globalIncludesPath = globalIncludesPath;
  }

  /**
   * Process a single HTML file and replace custom elements with include content
   */
  public processIncludes(htmlContent: string): string {
    let processedContent = htmlContent;

    // Process each include name defined in our types
    Object.values(IncludeNames).forEach((includeName) => {
      const includeFilePath = this.getIncludeFilePath(includeName);

      if (existsSync(includeFilePath)) {
        const includeContent = readFileSync(includeFilePath, "utf-8");

        // Replace all instances of the custom element
        const customElementRegex = new RegExp(
          `<${includeName}[^>]*>`,
          "g"
        );
        processedContent = processedContent.replace(
          customElementRegex,
          includeContent
        );
      } else {
        console.warn(`Include file not found: ${includeFilePath}`);
      }
    });

    return processedContent;
  }

  /**
   * Process global includes that should be injected into every HTML file
   */
  public processGlobalIncludes(htmlContent: string): string {
    if (!existsSync(this.globalIncludesPath)) {
      return htmlContent;
    }

    let processedContent = htmlContent;
    const globalIncludeFiles = readdirSync(this.globalIncludesPath);

    globalIncludeFiles.forEach((fileName: string) => {
      if (fileName.endsWith(".html")) {
        const includeFilePath = join(
          this.globalIncludesPath,
          fileName
        );
        const includeContent = readFileSync(includeFilePath, "utf-8");

        // Determine injection point based on file name convention
        if (fileName.includes("head")) {
          processedContent = this.injectIntoHead(
            processedContent,
            includeContent
          );
        } else if (fileName.includes("body-start")) {
          processedContent = this.injectIntoBodyStart(
            processedContent,
            includeContent
          );
        } else if (fileName.includes("body-end")) {
          processedContent = this.injectIntoBodyEnd(
            processedContent,
            includeContent
          );
        }
      }
    });

    return processedContent;
  }

  /**
   * Get the file path for a specific include name
   */
  private getIncludeFilePath(includeName: string): string {
    // First, try the global includes directory
    const globalFilePath = join(
      this.globalIncludesPath,
      `${includeName}.html`
    );
    if (existsSync(globalFilePath)) {
      return globalFilePath;
    }

    // Fallback to regular includes directory with kr- prefix removed
    const fileName = includeName.replace("kr-", "") + ".html";
    return join(this.includesPath, fileName);
  }

  /**
   * Inject content into the <head> section
   */
  private injectIntoHead(
    htmlContent: string,
    includeContent: string
  ): string {
    return htmlContent.replace(
      "</head>",
      `  ${includeContent}\n</head>`
    );
  }

  /**
   * Inject content at the start of <body>
   */
  private injectIntoBodyStart(
    htmlContent: string,
    includeContent: string
  ): string {
    return htmlContent.replace(
      "<body>",
      `<body>\n  ${includeContent}`
    );
  }

  /**
   * Inject content before </body>
   */
  private injectIntoBodyEnd(
    htmlContent: string,
    includeContent: string
  ): string {
    return htmlContent.replace(
      "</body>",
      `  ${includeContent}\n</body>`
    );
  }
}

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
      const fullPath = join(directoryPath, entry.name);

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
   * Ensure a directory exists, create it if it doesn't
   */
  public static ensureDirectory(dirPath: string): void {
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
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
