import { readFileSync, writeFileSync } from "fs";
import { marked } from "marked";
import { BuildLogger } from "./helpers.js";
import { TemplateProcessor } from "./template-processor.js";

/**
 * Processes Markdown files and converts them to HTML using templates
 */
export class MarkdownProcessor {
  private templateProcessor: TemplateProcessor;

  constructor() {
    this.templateProcessor = new TemplateProcessor();

    // Configure marked options for better HTML output
    marked.setOptions({
      gfm: true,
      breaks: false,
    });
  }

  /**
   * Process a single Markdown file and convert it to HTML content (without template)
   * The template will be applied later by the HtmlBundleProcessor
   */
  public processMarkdownFile(filePath: string): string {
    BuildLogger.info(`Processing Markdown file: ${filePath}`);

    const markdownContent = readFileSync(filePath, "utf-8");

    // Extract frontmatter metadata and content
    const { metadata, content } =
      this.templateProcessor.extractMarkdownFrontmatter(
        markdownContent
      );

    // Convert Markdown to HTML
    const htmlContent = marked(content);

    // Create HTML content with metadata comments for later processing
    const htmlWithMetadata = [
      metadata.title ? `<!-- title: ${metadata.title} -->` : "",
      metadata.description
        ? `<!-- description: ${metadata.description} -->`
        : "",
      metadata.keywords
        ? `<!-- keywords: ${metadata.keywords} -->`
        : "",
      htmlContent,
    ]
      .filter(Boolean)
      .join("\n");

    // Generate output file path (same location, .html extension)
    const outputPath = filePath.replace(/\.md$/, ".html");

    // Write the HTML content (without template - that will be applied later)
    writeFileSync(outputPath, htmlWithMetadata, "utf-8");

    BuildLogger.success(`Generated HTML file: ${outputPath}`);

    return outputPath;
  }
}
