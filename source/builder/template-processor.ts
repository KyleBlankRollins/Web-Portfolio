import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  TemplateEngine,
  MetadataExtractor,
  FrontmatterParser,
  type SeriesInfo,
  type Citation,
  type SupplementManifestEntry,
} from "./modules/index.js";

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
  private metadataExtractor: MetadataExtractor;
  private frontmatterParser: FrontmatterParser;
  private defaultTemplate: string = "base.html";
  private partialCache: Map<string, string> = new Map();

  constructor() {
    this.engine = new TemplateEngine();
    this.metadataExtractor = new MetadataExtractor();
    this.frontmatterParser = new FrontmatterParser();
  }

  /**
   * Load a shared markup partial from templates/partials, with caching.
   *
   * The template engine only substitutes variables - it has no include
   * syntax - so shared markup is read here and passed in as a triple-brace
   * variable. That keeps one copy of the markup on disk instead of one per
   * page template.
   */
  private loadPartial(name: string): string {
    const cached = this.partialCache.get(name);
    if (cached !== undefined) {
      return cached;
    }

    const partial = readFileSync(
      join("source", "site", "templates", "partials", name),
      "utf-8"
    ).trim();

    this.partialCache.set(name, partial);
    return partial;
  }

  /**
   * Check if content is already a complete HTML document
   */
  public isCompleteHtmlDocument(content: string): boolean {
    return this.engine.isCompleteHtmlDocument(content);
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
    if (this.isCompleteHtmlDocument(content)) {
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
      footer: this.loadPartial("footer.html"),
    };

    return this.engine.render(template, allVariables);
  }

  /**
   * Extract metadata from HTML content (looking for comments or meta tags)
   * Returns both the extracted metadata and the content with metadata comments removed
   */
  public extractMetadata(htmlContent: string): {
    metadata: Partial<TemplateVariables>;
    content: string;
  } {
    return this.metadataExtractor.extract(htmlContent);
  }

  /**
   * Extract metadata from Markdown frontmatter
   */
  public extractMarkdownFrontmatter(markdownContent: string): {
    metadata: Partial<TemplateVariables>;
    content: string;
  } {
    return this.frontmatterParser.parse(markdownContent);
  }

  /**
   * Clear template cache
   */
  public clearCache(): void {
    this.engine.clearCache();
  }
}
