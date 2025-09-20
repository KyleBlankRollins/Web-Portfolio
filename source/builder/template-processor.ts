import { readFileSync, existsSync } from "fs";
import { BuildLogger } from "./helpers.js";

/**
 * Interface for template variables
 */
export interface TemplateVariables {
  title: string;
  description?: string;
  keywords?: string;
  additionalHead?: string;
  content: string;
}

/**
 * Template processor for handling page templates with variable substitution
 */
export class TemplateProcessor {
  private templateCache: Map<string, string> = new Map();
  private defaultTemplate: string = "base.html";

  /**
   * Process content using a template with variable substitution
   */
  public processTemplate(
    content: string,
    variables: TemplateVariables,
    templateName: string = this.defaultTemplate
  ): string {
    const template = this.getTemplate(templateName);

    // Create a complete variables object with content
    const allVariables: TemplateVariables = {
      ...variables,
      content,
    };

    return this.substituteVariables(template, allVariables);
  }

  /**
   * Extract metadata from HTML content (looking for comments or meta tags)
   */
  public extractMetadata(
    htmlContent: string
  ): Partial<TemplateVariables> {
    const metadata: Partial<TemplateVariables> = {};

    // Look for HTML meta comments
    const titleMatch = htmlContent.match(
      /<!--\s*title:\s*(.+?)\s*-->/i
    );
    if (titleMatch) {
      metadata.title = titleMatch[1].trim();
    }

    const descMatch = htmlContent.match(
      /<!--\s*description:\s*(.+?)\s*-->/i
    );
    if (descMatch) {
      metadata.description = descMatch[1].trim();
    }

    const keywordsMatch = htmlContent.match(
      /<!--\s*keywords:\s*(.+?)\s*-->/i
    );
    if (keywordsMatch) {
      metadata.keywords = keywordsMatch[1].trim();
    }

    return metadata;
  }

  /**
   * Extract metadata from Markdown frontmatter
   */
  public extractMarkdownFrontmatter(markdownContent: string): {
    metadata: Partial<TemplateVariables>;
    content: string;
  } {
    const metadata: Partial<TemplateVariables> = {};
    let content = markdownContent;

    // Check for YAML frontmatter
    const frontmatterMatch = markdownContent.match(
      /^---\n(.*?)\n---\n(.*)/s
    );
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      content = frontmatterMatch[2];

      // Parse simple YAML-like frontmatter
      const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
      if (titleMatch) {
        metadata.title = titleMatch[1]
          .trim()
          .replace(/^["']|["']$/g, "");
      }

      const descMatch = frontmatter.match(/^description:\s*(.+)$/m);
      if (descMatch) {
        metadata.description = descMatch[1]
          .trim()
          .replace(/^["']|["']$/g, "");
      }

      const keywordsMatch = frontmatter.match(/^keywords:\s*(.+)$/m);
      if (keywordsMatch) {
        metadata.keywords = keywordsMatch[1]
          .trim()
          .replace(/^["']|["']$/g, "");
      }
    }

    return { metadata, content };
  }

  /**
   * Get template content with caching
   */
  private getTemplate(templateName: string): string {
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName)!;
    }

    const templatePath = `source/site/templates/${templateName}`;

    if (!existsSync(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    const templateContent = readFileSync(templatePath, "utf-8");
    this.templateCache.set(templateName, templateContent);

    BuildLogger.info(`✓ Loaded template: ${templateName}`);
    return templateContent;
  }

  /**
   * Substitute variables in template content
   */
  private substituteVariables(
    template: string,
    variables: TemplateVariables
  ): string {
    let result = template;

    // Handle conditional sections ({{#variable}}...{{/variable}})
    Object.entries(variables).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        // Replace conditional blocks with content
        const conditionalRegex = new RegExp(
          `\\{\\{#${key}\\}\\}([\\s\\S]*?)\\{\\{/${key}\\}\\}`,
          "g"
        );
        result = result.replace(conditionalRegex, "$1");
      } else {
        // Remove conditional blocks if variable is empty
        const conditionalRegex = new RegExp(
          `\\{\\{#${key}\\}\\}[\\s\\S]*?\\{\\{/${key}\\}\\}`,
          "g"
        );
        result = result.replace(conditionalRegex, "");
      }
    });

    // Handle triple-brace variables (unescaped HTML: {{{variable}}})
    Object.entries(variables).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const tripleRegex = new RegExp(
          `\\{\\{\\{${key}\\}\\}\\}`,
          "g"
        );
        result = result.replace(tripleRegex, String(value));
      }
    });

    // Handle double-brace variables (escaped: {{variable}})
    Object.entries(variables).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const doubleRegex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
        // Basic HTML escaping
        const escapedValue = String(value)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#x27;");
        result = result.replace(doubleRegex, escapedValue);
      }
    });

    // Clean up any remaining unmatched template variables
    result = result.replace(/\{\{\{?\w+\}?\}\}/g, "");

    return result;
  }

  /**
   * Clear template cache
   */
  public clearCache(): void {
    this.templateCache.clear();
  }
}
