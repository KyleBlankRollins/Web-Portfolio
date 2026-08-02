import {
  TemplateProcessor,
  type TemplateVariables,
} from "./template-processor.js";
import { escapeHtml } from "./modules/html-utils.js";
import { MetadataExtractor } from "./modules/metadata-extractor.js";

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

  /**
   * Process HTML content using the TemplateProcessor
   */
  static async processHtmlContent(
    templateProcessor: TemplateProcessor,
    content: string,
    options: {
      defaultTitle?: string;
      assets?: { css: string[]; js: string[] };
      metadata?: Partial<TemplateVariables>;
    } = {}
  ): Promise<string> {
    // Hand-written pages use metadata comments; generated documents provide
    // their already-parsed metadata directly.
    const extracted = options.metadata
      ? { metadata: options.metadata, content }
      : metadataExtractor.extract(content);
    const metadata = extracted.metadata as Partial<TemplateVariables>;
    const cleanedContent = extracted.content;

    // Create template variables - if no title found, try to extract from content
    const templateVariables: TemplateVariables = {
      title:
        metadata.title ||
        this.extractTitleFromContent(cleanedContent) ||
        options.defaultTitle ||
        "Untitled",
      description: metadata.description,
      keywords: metadata.keywords,
      additionalHead: metadata.additionalHead,
      content: "", // This will be overridden by processTemplate
      // Include blog-specific metadata
      date: metadata.date,
      formattedDate: metadata.formattedDate,
      tags: metadata.tags,
      isBlogPost: metadata.isBlogPost,
      series: metadata.series, // Include series metadata
      citationsHtml: metadata.citationsHtml, // Include citations HTML
      supplements: metadata.supplements,
      // Generate tags HTML for sidebar
      tagsHtml: this.generateTagsHtml(metadata.tags),
    };

    const processedContent = templateProcessor.processTemplate(
      cleanedContent,
      templateVariables
    );

    // Inject assets if provided (for non-index HTML files)
    if (options.assets) {
      return this.injectAssets(processedContent, options.assets);
    }

    return processedContent;
  }

  /**
   * Move asset tags that ended up inside <body> into their proper place.
   *
   * Pages under pages/ get their assets from injectAssets(), which already
   * puts stylesheets in <head> and scripts before </body>. index.html is
   * different: it is Vite's HTML entry, so Vite injects the bundle at the
   * position of the <script type="module"> tag in the source file. That tag
   * sits in the page content, which the base template drops inside
   * <main class="page-content"> - so the stylesheet link landed in the middle
   * of the body and the page painted unstyled before it arrived (DF-06).
   *
   * The script tag cannot simply be deleted from index.html: it is what marks
   * the file as Vite's entry, and without it there is no bundle to emit. So
   * the placement is corrected here instead, after templating, which also
   * means it stays correct regardless of where the tag sits in the source.
   *
   * Idempotent: tags already in the right place are left alone.
   */
  static normalizeAssetPlacement(htmlContent: string): string {
    const headEnd = htmlContent.indexOf("</head>");
    if (headEnd === -1) return htmlContent;

    const head = htmlContent.slice(0, headEnd);
    let body = htmlContent.slice(headEnd);

    const stylesheets: string[] = [];
    const scripts: string[] = [];

    // Stylesheets and modulepreload hints both belong in <head>: a preload
    // hint placed after the markup it is meant to front-run does nothing.
    body = body.replace(
      /[ \t]*<link\b[^>]*rel=["'](?:stylesheet|modulepreload)["'][^>]*>\n?/gi,
      (tag) => {
        stylesheets.push(tag.trim());
        return "";
      }
    );

    body = body.replace(
      /[ \t]*<script\b[^>]*\btype=["']module["'][^>]*><\/script>\n?/gi,
      (tag) => {
        scripts.push(tag.trim());
        return "";
      }
    );

    if (stylesheets.length === 0 && scripts.length === 0) {
      return htmlContent;
    }

    const headBlock = stylesheets.length
      ? `${stylesheets.map((t) => `    ${t}`).join("\n")}\n`
      : "";

    let result = head + headBlock + body;

    if (scripts.length) {
      const scriptBlock = `${scripts.map((t) => `    ${t}`).join("\n")}\n`;
      result = result.replace("</body>", `${scriptBlock}  </body>`);
    }

    return result;
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
        .map((href) => `    <link rel="stylesheet" crossorigin href="${href}">`)
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
