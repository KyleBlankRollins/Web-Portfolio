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
    defaultTitle: string = "Untitled",
    assets?: { css: string[]; js: string[] }
  ): Promise<string> {
    // Extract metadata from HTML comments and get cleaned content
    const { metadata, content: cleanedContent } =
      templateProcessor.extractMetadata(content);

    // Create template variables - if no title found, try to extract from content
    const templateVariables: TemplateVariables = {
      title:
        metadata.title ||
        this.extractTitleFromContent(cleanedContent) ||
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

    const processedContent = templateProcessor.processTemplate(
      cleanedContent,
      templateVariables
    );

    // Inject assets if provided (for non-index HTML files)
    if (assets) {
      return this.injectAssets(processedContent, assets);
    }

    return processedContent;
  }

  /**
   * Inject CSS and JS assets into HTML content
   */
  static injectAssets(
    htmlContent: string,
    assets: { css: string[]; js: string[] }
  ): string {
    let modifiedContent = htmlContent;

    // Inject CSS links before closing </head>
    if (assets.css.length > 0) {
      const cssLinks = assets.css
        .map(
          (href) =>
            `    <link rel="stylesheet" crossorigin href="${href}">`
        )
        .join("\n");

      modifiedContent = modifiedContent.replace(
        "</head>",
        `${cssLinks}\n</head>`
      );
    }

    // Inject JS scripts before closing </body>
    if (assets.js.length > 0) {
      const jsScripts = assets.js
        .map(
          (src) =>
            `    <script type="module" crossorigin src="${src}"></script>`
        )
        .join("\n");

      modifiedContent = modifiedContent.replace(
        "</body>",
        `${jsScripts}\n</body>`
      );
    }

    return modifiedContent;
  }
}
