import {
  TemplateProcessor,
  type TemplateVariables,
} from "./template-processor.js";
import { escapeHtml } from "./modules/html-utils.js";
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
      tags: metadata.tags,
      isBlogPost: metadata.isBlogPost,
      series: metadata.series,
      citationsHtml: metadata.citationsHtml,
      supplements: metadata.supplements,
      tagsHtml: this.generateTagsHtml(metadata.tags),
    };
    const processedContent = templateProcessor.processTemplate(
      cleanedContent,
      templateVariables,
      undefined,
      { assets: options.assets }
    );

    return processedContent;
  }

  /**
   * Generate HTML for blog post tags
   */
  static generateTagsHtml(tags?: string[]): string {
    if (!tags || tags.length === 0) {
      return "";
    }

    const tagButtons = tags
      .map(
        (tag) =>
          `<button class="blog-tag" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`
      )
      .join("");

    return `
      <div class="blog-post-tags">
        <span class="tags-label">Tags:</span>
        <div class="tag-list">
          ${tagButtons}
        </div>
      </div>
    `;
  }
}
