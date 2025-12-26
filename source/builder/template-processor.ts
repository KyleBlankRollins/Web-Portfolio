import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { BuildLogger } from "./helpers.js";

/**
 * Series information for blog posts
 */
export interface SeriesInfo {
  name: string;
  part: number;
}

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
}

/**
 * Template processor for handling page templates with variable substitution
 */
export class TemplateProcessor {
  private templateCache: Map<string, string> = new Map();
  private defaultTemplate: string = "base.html";

  /**
   * Check if content is already a complete HTML document
   */
  public isCompleteHtmlDocument(content: string): boolean {
    const trimmedContent = content.trim();
    return (
      (trimmedContent.toLowerCase().startsWith("<!doctype html>") ||
        trimmedContent.toLowerCase().startsWith("<html")) &&
      trimmedContent.toLowerCase().includes("</html>")
    );
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
   * Returns both the extracted metadata and the content with metadata comments removed
   */
  public extractMetadata(htmlContent: string): {
    metadata: Partial<TemplateVariables>;
    content: string;
  } {
    const metadata: Partial<TemplateVariables> = {};
    let content = htmlContent;

    // Look for HTML meta comments and remove them from content
    const titleMatch = htmlContent.match(/<!--\s*title:\s*(.+?)\s*-->/i);
    if (titleMatch) {
      metadata.title = titleMatch[1].trim();
      content = content.replace(titleMatch[0], "");
    }

    const descMatch = htmlContent.match(/<!--\s*description:\s*(.+?)\s*-->/i);
    if (descMatch) {
      metadata.description = descMatch[1].trim();
      content = content.replace(descMatch[0], "");
    }

    const keywordsMatch = htmlContent.match(/<!--\s*keywords:\s*(.+?)\s*-->/i);
    if (keywordsMatch) {
      metadata.keywords = keywordsMatch[1].trim();
      content = content.replace(keywordsMatch[0], "");
    }

    // Blog-specific metadata
    const dateMatch = htmlContent.match(/<!--\s*date:\s*(.+?)\s*-->/i);
    if (dateMatch) {
      metadata.date = dateMatch[1].trim();
      content = content.replace(dateMatch[0], "");
    }

    const formattedDateMatch = htmlContent.match(
      /<!--\s*formattedDate:\s*(.+?)\s*-->/i
    );
    if (formattedDateMatch) {
      metadata.formattedDate = formattedDateMatch[1].trim();
      content = content.replace(formattedDateMatch[0], "");
    }

    const tagsMatch = htmlContent.match(/<!--\s*tags:\s*(.+?)\s*-->/i);
    if (tagsMatch) {
      metadata.tags = tagsMatch[1]
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      content = content.replace(tagsMatch[0], "");
    }

    const isBlogPostMatch = htmlContent.match(
      /<!--\s*isBlogPost:\s*true\s*-->/i
    );
    if (isBlogPostMatch) {
      metadata.isBlogPost = true;
      content = content.replace(isBlogPostMatch[0], "");
    }

    // Series metadata
    const seriesNameMatch = htmlContent.match(
      /<!--\s*series\.name:\s*(.+?)\s*-->/i
    );
    const seriesPartMatch = htmlContent.match(
      /<!--\s*series\.part:\s*(.+?)\s*-->/i
    );
    if (seriesNameMatch && seriesPartMatch) {
      const partNum = parseInt(seriesPartMatch[1].trim(), 10);
      metadata.series = {
        name: seriesNameMatch[1].trim(),
        part: partNum,
      };
      content = content.replace(seriesNameMatch[0], "");
      content = content.replace(seriesPartMatch[0], "");
    }

    // Also remove template comment if present
    const templateMatch = htmlContent.match(/<!--\s*template:\s*(.+?)\s*-->/i);
    if (templateMatch) {
      content = content.replace(templateMatch[0], "");
    }

    // Clean up any extra whitespace/newlines at the beginning
    content = content.replace(/^\s+/, "");

    return { metadata, content };
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
      /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/
    );
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      content = frontmatterMatch[2];

      // Parse simple YAML-like frontmatter
      const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
      if (titleMatch) {
        metadata.title = titleMatch[1].trim().replace(/^["']|["']$/g, "");
      }

      const descMatch = frontmatter.match(/^description:\s*(.+)$/m);
      if (descMatch) {
        metadata.description = descMatch[1].trim().replace(/^["']|["']$/g, "");
      }

      const keywordsMatch = frontmatter.match(/^keywords:\s*(.+)$/m);
      if (keywordsMatch) {
        metadata.keywords = keywordsMatch[1].trim().replace(/^["']|["']$/g, "");
      }

      // Extract blog-specific metadata
      const dateMatch = frontmatter.match(/^date:\s*(.+)$/m);
      if (dateMatch) {
        const dateStr = dateMatch[1].trim().replace(/^["']|["']$/g, "");
        metadata.date = dateStr;
        metadata.formattedDate = this.formatDate(dateStr);
        metadata.isBlogPost = true;
      }

      const tagsMatch = frontmatter.match(/^tags:\s*(.+)$/m);
      if (tagsMatch) {
        const tagsStr = tagsMatch[1].trim();
        // Handle both array format [tag1, tag2] and comma-separated format
        if (tagsStr.startsWith("[") && tagsStr.endsWith("]")) {
          // Array format: [tag1, tag2, tag3]
          metadata.tags = tagsStr
            .slice(1, -1)
            .split(",")
            .map((tag) => tag.trim().replace(/^["']|["']$/g, ""))
            .filter((tag) => tag.length > 0);
        } else {
          // Comma-separated format: tag1, tag2, tag3
          metadata.tags = tagsStr
            .split(",")
            .map((tag) => tag.trim().replace(/^["']|["']$/g, ""))
            .filter((tag) => tag.length > 0);
        }
        if (metadata.tags.length > 0) {
          metadata.isBlogPost = true;
        }
      }

      // Extract series metadata (optional)
      const seriesMatch = frontmatter.match(/^series:\s*$/m);
      if (seriesMatch) {
        // Multi-line series object format
        const seriesNameMatch = frontmatter.match(/^\s+name:\s*(.+)$/m);
        const seriesPartMatch = frontmatter.match(/^\s+part:\s*(.+)$/m);

        if (seriesNameMatch && seriesPartMatch) {
          const seriesName = seriesNameMatch[1]
            .trim()
            .replace(/^["']|["']$/g, "");
          const partStr = seriesPartMatch[1].trim().replace(/^["']|["']$/g, "");
          const partNum = parseInt(partStr, 10);

          // Validate part number
          if (isNaN(partNum) || partNum <= 0) {
            BuildLogger.error(
              `Invalid series part number "${partStr}" - must be a positive integer`
            );
            throw new Error(
              `Invalid series part number: ${partStr}. Part must be a positive integer.`
            );
          }

          metadata.series = {
            name: seriesName,
            part: partNum,
          };
        }
      }
    }

    return { metadata, content };
  }

  /**
   * Format a date string for display
   * Parses YYYY-MM-DD format and creates date in local timezone to avoid day-off errors
   */
  private formatDate(dateStr: string): string {
    try {
      // Parse YYYY-MM-DD format to avoid timezone issues
      const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (match) {
        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1; // Month is 0-indexed
        const day = parseInt(match[3], 10);
        const date = new Date(year, month, day);

        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }

      // Fallback for other date formats
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return dateStr; // Return original string if date is invalid
      }

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr; // Return original string if formatting fails
    }
  }

  /**
   * Get template content with caching
   */
  private getTemplate(templateName: string): string {
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName)!;
    }

    const templatePath = join("source", "site", "templates", templateName);

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

    // Flatten nested objects for dot notation support
    const flatVariables = this.flattenObject(variables);

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
    Object.entries(flatVariables).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const tripleRegex = new RegExp(`\\{\\{\\{${key}\\}\\}\\}`, "g");
        result = result.replace(tripleRegex, String(value));
      }
    });

    // Handle double-brace variables (escaped: {{variable}})
    Object.entries(flatVariables).forEach(([key, value]) => {
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
   * Flatten nested object properties for dot notation support
   * e.g., { series: { name: "Test" } } becomes { "series.name": "Test" }
   */
  private flattenObject(obj: any, prefix: string = ""): Record<string, any> {
    const flattened: Record<string, any> = {};

    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        // Recursively flatten nested objects
        Object.assign(flattened, this.flattenObject(value, fullKey));
      } else {
        // Add both the original key and the flattened key
        flattened[fullKey] = value;
      }
    });

    return flattened;
  }

  /**
   * Clear template cache
   */
  public clearCache(): void {
    this.templateCache.clear();
  }
}
