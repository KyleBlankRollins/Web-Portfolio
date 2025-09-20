import { readFileSync, writeFileSync } from "fs";
import { marked } from "marked";
import { IncludeResolver, BuildLogger } from "./helpers.ts";

/**
 * Processes Markdown files and converts them to HTML with includes
 */
export class MarkdownProcessor {
  private includeResolver: IncludeResolver;

  constructor() {
    this.includeResolver = new IncludeResolver();

    // Configure marked options for better HTML output
    marked.setOptions({
      gfm: true,
      breaks: false,
    });
  }

  /**
   * Process a single Markdown file and convert it to HTML
   */
  public processMarkdownFile(filePath: string): string {
    BuildLogger.info(`Processing Markdown file: ${filePath}`);

    const markdownContent = readFileSync(filePath, "utf-8");

    // Convert Markdown to HTML
    const htmlContent = marked(markdownContent);

    // Process includes in the generated HTML
    const processedHtml =
      this.includeResolver.processIncludes(htmlContent);

    // Generate output file path (same location, .html extension)
    const outputPath = filePath.replace(/\.md$/, ".html");

    // Write the processed HTML file
    writeFileSync(outputPath, processedHtml, "utf-8");

    BuildLogger.success(`Generated HTML file: ${outputPath}`);

    return outputPath;
  }
}
