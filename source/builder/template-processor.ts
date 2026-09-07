import {
  HtmlAstRenderer,
  type SeriesInfo,
  type Citation,
  type SupplementManifestEntry,
} from "./modules/index.js";
import type {
  HtmlAstPreparedPage,
  HtmlAstSource,
} from "./modules/html-ast-renderer.js";
import type { SiteAssets } from "./site-renderer.js";

// Re-export types for backward compatibility
export type { SeriesInfo, Citation };

/**
 * Interface for template variables
 */
export interface TemplateVariables {
  title: string;
  description?: string;
  keywords?: string;
  additionalHead?: string;
  content: string;
  // Blog-specific metadata
  date?: string;
  tags?: string[];
  formattedDate?: string; // Human-readable date format
  isBlogPost?: boolean; // Flag to identify blog posts
  tagsHtml?: string; // Rendered tags HTML for sidebar
  series?: SeriesInfo; // Optional series information
  citations?: Citation[]; // Optional citations array
  citationsHtml?: string; // Rendered citations HTML for footnotes section
  supplements?: SupplementManifestEntry[]; // Optional published supplements for parent posts
  [key: string]:
    | string
    | number
    | boolean
    | string[]
    | SeriesInfo
    | Citation[]
    | SupplementManifestEntry[]
    | undefined; // Allow additional custom fields with constrained types
}

/**
 * Template processor for handling page templates with variable substitution
 */
export class TemplateProcessor {
  private astRenderer: HtmlAstRenderer;
  private defaultTemplate: string = "base.html";
  private readonly templateNames: ReadonlyMap<string, string>;

  constructor(source: HtmlAstSource) {
    this.astRenderer = new HtmlAstRenderer(source);
    this.templateNames = source.templates ?? new Map();
  }

  /**
   * Process content using a template with variable substitution
   */
  public processTemplate(
    content: string,
    variables: TemplateVariables,
    templateName?: string,
    options: { assets?: SiteAssets } = {}
  ): string {
    // Complete documents cannot safely bypass directive processing.
    if (this.isCompleteHtmlDocument(content)) {
      if (content.includes("data-kbr-")) {
        throw new Error(
          "Complete HTML documents cannot contain data-kbr-* directives"
        );
      }
      return content;
    }

    // Automatically select blog post template for blog posts
    if (!templateName) {
      templateName = variables.isBlogPost
        ? "blog-post.html"
        : this.defaultTemplate;
    }

    if (!this.templateNames.has(templateName)) {
      throw new Error(`Template not found in loaded source: ${templateName}`);
    }

    const pageContent = '<template data-kbr-html="content"></template>';
    let astVariables = variables;
    let preparedPage: HtmlAstPreparedPage | undefined;
    if (content.includes("data-kbr-page")) {
      preparedPage = this.astRenderer.preparePage(content);
      astVariables = { ...variables, ...preparedPage.metadata };
    }
    return this.astRenderer.renderPage(
      preparedPage ?? pageContent,
      astVariables,
      {
        layout: templateName,
        assets: options.assets,
      }
    ).html;
  }

  private isCompleteHtmlDocument(content: string): boolean {
    const trimmedContent = content.trim().toLowerCase();
    return (
      (trimmedContent.startsWith("<!doctype html>") ||
        trimmedContent.startsWith("<html")) &&
      trimmedContent.includes("</html>")
    );
  }
}
