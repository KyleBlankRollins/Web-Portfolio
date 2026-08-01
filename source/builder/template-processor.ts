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

  constructor() {
    this.engine = new TemplateEngine();
    this.metadataExtractor = new MetadataExtractor();
    this.frontmatterParser = new FrontmatterParser();
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

    // Create a complete variables object with content
    const allVariables: TemplateVariables = {
      ...variables,
      content,
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
