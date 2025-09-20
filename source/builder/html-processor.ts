import * as fs from "fs";
import { IncludeNames } from "./types.js";
import type { IncludeName } from "./types.js";
import { BuildLogger } from "./helpers.js";

/**
 * HTML Processor for replacing custom include tags with their content
 */
export class HtmlProcessor {
  private includeCache: Map<string, string> = new Map();

  /**
   * Process an array of HTML file paths, replacing include tags with their content
   */
  public async processFiles(filePaths: string[]): Promise<void> {
    BuildLogger.info(`Processing ${filePaths.length} HTML files...`);

    for (const filePath of filePaths) {
      try {
        await this.processFile(filePath);
        BuildLogger.info(`✓ Processed: ${filePath}`);
      } catch (error) {
        BuildLogger.error(`Failed to process ${filePath}: ${error}`);
        throw error;
      }
    }
  }

  /**
   * Process a single HTML file
   */
  private async processFile(filePath: string): Promise<void> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    const processedLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const processedLine = await this.processLine(line);
      processedLines.push(processedLine);
    }

    const processedContent = processedLines.join("\n");

    // Write to dist directory instead of overwriting source
    const distFilePath = this.getDistFilePath(filePath);
    this.ensureDistDirectory(distFilePath);
    fs.writeFileSync(distFilePath, processedContent, "utf-8");
  }

  /**
   * Convert source file path to dist file path
   */
  private getDistFilePath(sourcePath: string): string {
    // Handle root index.html
    if (sourcePath === "index.html") {
      return "dist/index.html";
    }

    // Handle pages in source/site/pages/
    if (sourcePath.startsWith("source/site/pages/")) {
      const fileName = sourcePath.replace("source/site/pages/", "");
      return `dist/${fileName}`;
    }

    // Default: mirror the structure in dist
    return sourcePath.replace("source/site/", "dist/");
  }

  /**
   * Ensure the directory exists for the dist file
   */
  private ensureDistDirectory(filePath: string): void {
    const dir = filePath.substring(0, filePath.lastIndexOf("/"));

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Process a single line of HTML, replacing include tags (public for plugin use)
   */
  public async processLine(line: string): Promise<string> {
    let processedLine = line;

    // Check for each include name
    const includeNames = Object.values(IncludeNames);

    for (const includeName of includeNames) {
      const tagPattern = new RegExp(
        `<${includeName}([^>]*)>(?:</${includeName}>)?`,
        "gi"
      );
      const matches = processedLine.match(tagPattern);

      if (matches) {
        for (const match of matches) {
          // Extract attributes from the tag
          const attributeMatch = match.match(
            `<${includeName}([^>]*)>`
          );
          const attributes = attributeMatch
            ? attributeMatch[1].trim()
            : "";

          // Get the include content
          const includeContent = await this.getIncludeContent(
            includeName,
            attributes
          );

          // Replace the tag with the content
          processedLine = processedLine.replace(
            match,
            includeContent
          );
        }
      }
    }

    return processedLine;
  }

  /**
   * Get the content for an include, with caching
   */
  private async getIncludeContent(
    includeName: IncludeName,
    attributes: string
  ): Promise<string> {
    const cacheKey = `${includeName}:${attributes}`;

    if (this.includeCache.has(cacheKey)) {
      return this.includeCache.get(cacheKey)!;
    }

    const includeFilePath = `source/site/includes/global/${includeName}.html`;

    if (!fs.existsSync(includeFilePath)) {
      BuildLogger.warn(`Include file not found: ${includeFilePath}`);
      return `<!-- Include not found: ${includeName} -->`;
    }

    let content = fs.readFileSync(includeFilePath, "utf-8");

    // Process any attributes if needed (e.g., title substitution)
    content = this.processAttributes(content, attributes);

    this.includeCache.set(cacheKey, content);
    return content;
  }

  /**
   * Process attributes within include content (e.g., title substitution)
   */
  private processAttributes(
    content: string,
    attributes: string
  ): string {
    if (!attributes) {
      return content;
    }

    // Parse attributes (simple implementation for title)
    const titleMatch = attributes.match(
      /title\s*=\s*["']([^"']*)["']/i
    );
    if (titleMatch) {
      const title = titleMatch[1];
      // Replace {{title}} placeholders in the content
      content = content.replace(/\{\{title\}\}/g, title);
    }

    return content;
  }

  /**
   * Clear the include cache (useful for development)
   */
  public clearCache(): void {
    this.includeCache.clear();
  }
}
