/**
 * Markdown Renderer Module
 * Configures marked.js with custom renderers for headings, links, and code blocks
 */

import { marked } from "marked";
import Prism from "prismjs";
import { escapeHtml, escapeHtmlAttribute } from "./html-utils.js";

// Import common languages for Prism
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-javascript.js";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-tsx.js";
import "prismjs/components/prism-css.js";
import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-json.js";
import "prismjs/components/prism-markdown.js";
import "prismjs/components/prism-yaml.js";
import "prismjs/components/prism-python.js";

/**
 * Markdown renderer options
 */
export interface MarkdownRendererOptions {
  gfm?: boolean;
  breaks?: boolean;
  syntaxHighlighting?: boolean;
}

/**
 * Markdown renderer class
 */
export class MarkdownRenderer {
  private syntaxHighlighting: boolean;

  constructor(options: MarkdownRendererOptions = {}) {
    this.syntaxHighlighting = options.syntaxHighlighting !== false;

    // Configure marked options
    marked.setOptions({
      gfm: options.gfm !== false,
      breaks: options.breaks || false,
    });

    // Setup custom renderers
    this.setupCustomRenderer();
  }

  /**
   * Render markdown to HTML
   */
  public render(markdown: string): string {
    return marked(markdown);
  }

  /**
   * Setup custom renderer for headings, links, and code blocks
   */
  private setupCustomRenderer(): void {
    const renderer = new marked.Renderer();

    // Override heading renderer to add IDs
    renderer.heading = (text: string, level: number) => {
      const headingId = this.generateAnchorId(text);
      return `<h${level} id="${escapeHtmlAttribute(headingId)}">${text}</h${level}>`;
    };

    // Override link renderer to transform .md to .html
    renderer.link = (
      href: string,
      title: string | null | undefined,
      text: string
    ) => {
      const transformedHref = href.replace(/\.md$/, ".html");
      const titleAttr = title ? ` title="${escapeHtmlAttribute(title)}"` : "";
      return `<a href="${escapeHtmlAttribute(transformedHref)}"${titleAttr}>${text}</a>`;
    };

    // Override code renderer to add syntax highlighting
    renderer.code = (code: string, language: string | undefined) => {
      if (!this.syntaxHighlighting) {
        const escapedCode = escapeHtml(code);
        const langClass = language ? ` class="language-${escapeHtmlAttribute(language)}"` : "";
        return `<pre${langClass}><code${langClass}>${escapedCode}</code></pre>`;
      }

      const lang = this.normalizeLanguage(language);

      if (lang && Prism.languages[lang]) {
        try {
          const highlighted = Prism.highlight(
            code,
            Prism.languages[lang],
            lang
          );
          const escapedLang = escapeHtmlAttribute(lang);
          return `<pre class="language-${escapedLang}"><code class="language-${escapedLang}">${highlighted}</code></pre>`;
        } catch (error) {
          console.error(`Error highlighting ${lang}:`, error);
        }
      }

      // Default behavior for unsupported languages or errors
      const escapedCode = escapeHtml(code);
      const langClass = lang ? ` class="language-${escapeHtmlAttribute(lang)}"` : "";
      return `<pre${langClass}><code${langClass}>${escapedCode}</code></pre>`;
    };

    marked.setOptions({ renderer });
  }

  /**
   * Generate a URL-safe anchor ID from heading text
   */
  public generateAnchorId(text: string): string {
    let id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/--+/g, "-") // Replace multiple hyphens with single
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

    // Ensure ID starts with a letter (CSS requirement)
    if (id && /^[0-9]/.test(id)) {
      id = `heading-${id}`;
    }

    return id;
  }

  /**
   * Normalize language aliases to Prism language identifiers
   */
  public normalizeLanguage(language: string | undefined): string | undefined {
    if (!language) return undefined;

    const lang = language.toLowerCase();
    const aliases: Record<string, string> = {
      js: "javascript",
      ts: "typescript",
      sh: "bash",
      shell: "bash",
      yml: "yaml",
      json5: "json",
      md: "markdown",
      py: "python",
    };

    return aliases[lang] || lang;
  }
}
