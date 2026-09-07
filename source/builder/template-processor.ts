import {
  TemplateEngine,
  type SeriesInfo,
  type Citation,
  type SupplementManifestEntry,
} from "./modules/index.js";
import type { TemplateSource } from "./modules/template-engine.js";

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
  private engine: TemplateEngine;
  private defaultTemplate: string = "base.html";

  constructor(source: TemplateSource) {
    this.engine = new TemplateEngine("source/site/templates", source);
  }

  /**
   * Process content using a template with variable substitution
   */
  public processTemplate(
    content: string,
    variables: TemplateVariables,
    templateName?: string
  ): string {
    // If content is already a complete HTML document, return it as-is
    if (this.engine.isCompleteHtmlDocument(content)) {
      return content;
    }

    // Automatically select blog post template for blog posts
    if (!templateName) {
      templateName = variables.isBlogPost
        ? "blog-post.html"
        : this.defaultTemplate;
    }

    const template = this.engine.loadTemplate(templateName);

    // Create a complete variables object with content.
    // `footer` is supplied here rather than per caller so every page type -
    // homepage, static pages, blog posts, nested supplements - gets the same
    // markup from the same file, through both the build and the dev server.
    const allVariables: TemplateVariables = {
      ...variables,
      content,
      head: this.engine.render(this.engine.loadPartial("head.html"), variables),
      header: this.engine.loadPartial("header.html"),
      footer: this.engine.loadPartial("footer.html"),
    };

    return this.engine.render(template, allVariables);
  }

  /**
   * Clear template cache
   */
  public clearCache(): void {
    this.engine.clearCache();
  }
}
