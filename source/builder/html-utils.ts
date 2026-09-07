import {
  TemplateProcessor,
  type TemplateVariables,
} from "./template-processor.js";
import { escapeHtml } from "./modules/html-utils.js";
import { MetadataExtractor } from "./modules/metadata-extractor.js";
import type { SiteAssets } from "./site-renderer.js";

const metadataExtractor = new MetadataExtractor();

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
    const extracted = options.metadata
      ? { metadata: options.metadata, content }
      : metadataExtractor.extract(content);
    const metadata = extracted.metadata as Partial<TemplateVariables>;
    const cleanedContent = extracted.content;
    const templateVariables: TemplateVariables = {
      title:
        metadata.title ||
        this.extractTitleFromContent(cleanedContent) ||
        options.defaultTitle ||
        "Untitled",
      description: metadata.description,
      keywords: metadata.keywords,
      additionalHead: metadata.additionalHead,
      content: "",
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
      templateVariables
    );

    if (!options.assets) {
      return processedContent;
    }

    return this.injectAssets(processedContent, options.assets);
  }

  /**
   * Inject CSS and JS assets into HTML content
   */
  static injectAssets(
    htmlContent: string,
    assets: SiteAssets
  ): string {
    let modifiedContent = htmlContent;

    // Inject CSS links before closing </head>
    if (assets.head.length > 0) {
      const headTags = assets.head
        .map((asset) =>
          asset.kind === "stylesheet"
            ? `    <link rel="stylesheet" crossorigin href="${asset.href}">`
            : `    <link rel="modulepreload" crossorigin href="${asset.href}">`
        )
        .join("\n");

      modifiedContent = modifiedContent.replace(
        "</head>",
        `${headTags}\n</head>`
      );
    }

    // Inject JS scripts before closing </body>
    if (assets.body.length > 0) {
      const jsScripts = assets.body
        .map(
          (asset) =>
            `    <script type="module" crossorigin src="${asset.src}"></script>`
        )
        .join("\n");

      modifiedContent = modifiedContent.replace(
        "</body>",
        `${jsScripts}\n</body>`
      );
    }

    return modifiedContent;
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
