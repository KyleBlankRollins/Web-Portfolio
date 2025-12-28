/**
 * Template Engine Module
 * Handles template loading, caching, and variable substitution
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { BuildLogger, StringHelper } from "../helpers.js";
import { escapeHtml } from "./html-utils.js";

/**
 * Template variables structure
 *
 * Allows any value type for maximum flexibility.
 * The actual structure is defined in template-processor.ts
 */
export interface TemplateVariables {
  [key: string]: any;
}

/**
 * Template engine class
 */
export class TemplateEngine {
  private templateCache: Map<string, string> = new Map();
  private templateDir: string;

  constructor(templateDir: string = "source/site/templates") {
    this.templateDir = templateDir;
  }

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
   * Load template with caching
   */
  public loadTemplate(templateName: string): string {
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName)!;
    }

    const templatePath = join(this.templateDir, templateName);

    if (!existsSync(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    const templateContent = readFileSync(templatePath, "utf-8");
    this.templateCache.set(templateName, templateContent);

    BuildLogger.info(`✓ Loaded template: ${templateName}`);
    return templateContent;
  }

  /**
   * Render template with variables
   */
  public render(template: string, variables: TemplateVariables): string {
    return this.substituteVariables(template, variables);
  }

  /**
   * Substitute variables in template content
   * Handles {{var}}, {{{var}}}, and {{#var}}...{{/var}} syntax
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
      const escapedKey = StringHelper.escapeRegex(key);
      if (value !== undefined && value !== null && value !== "") {
        // Replace conditional blocks with content
        const conditionalRegex = new RegExp(
          `\\{\\{#${escapedKey}\\}\\}([\\s\\S]*?)\\{\\{/${escapedKey}\\}\\}`,
          "g"
        );
        result = result.replace(conditionalRegex, "$1");
      } else {
        // Remove conditional blocks if variable is empty
        const conditionalRegex = new RegExp(
          `\\{\\{#${escapedKey}\\}\\}[\\s\\S]*?\\{\\{/${escapedKey}\\}\\}`,
          "g"
        );
        result = result.replace(conditionalRegex, "");
      }
    });

    // Handle triple-brace variables (unescaped HTML: {{{variable}}})
    Object.entries(flatVariables).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const escapedKey = StringHelper.escapeRegex(key);
        const tripleRegex = new RegExp(`\\{\\{\\{${escapedKey}\\}\\}\\}`, "g");
        result = result.replace(tripleRegex, String(value));
      }
    });

    // Handle double-brace variables (escaped: {{variable}})
    Object.entries(flatVariables).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const escapedKey = StringHelper.escapeRegex(key);
        const doubleRegex = new RegExp(`\\{\\{${escapedKey}\\}\\}`, "g");
        const escapedValue = escapeHtml(String(value));
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
  private flattenObject(
    templateVariables: any,
    prefix: string = ""
  ): Record<string, any> {
    const flattenedVariables: Record<string, any> = {};

    Object.entries(templateVariables).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        // Recursively flatten nested objects
        Object.assign(flattenedVariables, this.flattenObject(value, fullKey));
      } else {
        // Add the flattened key
        flattenedVariables[fullKey] = value;
      }
    });

    return flattenedVariables;
  }

  /**
   * Clear template cache
   */
  public clearCache(): void {
    this.templateCache.clear();
  }
}
