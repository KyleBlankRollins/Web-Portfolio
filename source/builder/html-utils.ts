import {
  TemplateProcessor,
  type TemplateVariables,
} from "./template-processor.js";

/**
 * Shared utility functions for HTML processing
 */
export class HtmlProcessingUtils {
  /**
   * Extract title from HTML content if not in metadata
   */
  static extractTitleFromContent(content: string): string | null {
    // Look for h1 tags
    const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (h1Match) {
      return h1Match[1].replace(/<[^>]*>/g, "").trim();
    }

    // Look for title in kbr-page-head attributes
    const titleAttrMatch = content.match(
      /title\s*=\s*["']([^"']*)["']/i
    );
    if (titleAttrMatch) {
      return titleAttrMatch[1].trim();
    }

    return null;
  }

  /**
   * Process HTML content using the TemplateProcessor
   */
  static async processHtmlContent(
    templateProcessor: TemplateProcessor,
    content: string,
    defaultTitle: string = "Untitled"
  ): Promise<string> {
    // Extract metadata from HTML comments or existing structure
    const metadata = templateProcessor.extractMetadata(content);

    // Create template variables - if no title found, try to extract from content
    const templateVariables: TemplateVariables = {
      title:
        metadata.title ||
        this.extractTitleFromContent(content) ||
        defaultTitle,
      description: metadata.description,
      keywords: metadata.keywords,
      additionalHead: metadata.additionalHead,
      content: "", // This will be overridden by processTemplate
      // Include blog-specific metadata
      date: metadata.date,
      formattedDate: metadata.formattedDate,
      tags: metadata.tags,
      isBlogPost: metadata.isBlogPost,
    };

    return templateProcessor.processTemplate(
      content,
      templateVariables
    );
  }
}
