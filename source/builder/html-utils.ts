import {
  TemplateProcessor,
  type TemplateVariables,
} from "./template-processor.js";
import type { SiteAssets } from "./site-renderer.js";

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
    const titleAttrMatch = content.match(/title\s*=\s*["']([^"']*)["']/i);
    if (titleAttrMatch) {
      return titleAttrMatch[1].trim();
    }

    return null;
  }

  static processHtmlContentSync(
    templateProcessor: TemplateProcessor,
    content: string,
    options: {
      defaultTitle?: string;
      assets?: SiteAssets;
      metadata?: Partial<TemplateVariables>;
    } = {}
  ): string {
    const metadata = options.metadata ?? {};
    const cleanedContent = content;
    const templateVariables: TemplateVariables = {
      ...metadata,
      title:
        metadata.title ||
        this.extractTitleFromContent(cleanedContent) ||
        options.defaultTitle ||
        "Untitled",
      description: metadata.description,
      keywords: metadata.keywords,
      additionalHead: metadata.additionalHead,
      content: cleanedContent,
      date: metadata.date,
      formattedDate: metadata.formattedDate,
      titleAnchorId: metadata.titleAnchorId,
      tags: metadata.tags,
      isBlogPost: metadata.isBlogPost,
      series: metadata.series,
      citationItems: metadata.citationItems,
      supplements: metadata.supplements,
      blogStaticContent: metadata.blogStaticContent,
      seriesStaticContent: metadata.seriesStaticContent,
      supplementStaticContent: metadata.supplementStaticContent,
      timelineStaticContent: metadata.timelineStaticContent,
    };
    const processedContent = templateProcessor.processTemplate(
      cleanedContent,
      templateVariables,
      undefined,
      { assets: options.assets }
    );

    return processedContent;
  }
}
