/**
 * Markdown Renderer Module
 * Configures marked.js with custom renderers for headings, links, and code blocks
 */

import { Marked, Parser, Renderer, type Tokens } from "marked";
import Prism from "prismjs";
import { escapeHtml } from "./html-utils.js";
import {
  resolveLocalDocumentLink,
  type LocalDocumentLinkIndex,
} from "./local-document-link-resolver.js";

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
  headingOffset?: number;
}

export interface MarkdownRenderContext {
  currentSourcePath: string;
  documentLinkIndex?: LocalDocumentLinkIndex;
}

/**
 * Markdown renderer class
 */
export class MarkdownRenderer {
  private marked: Marked;
  private syntaxHighlighting: boolean;
  private headingOffset: number;
  private activeRenderContext?: MarkdownRenderContext;

  constructor(
    markedInstance: Marked = new Marked(),
    options: MarkdownRendererOptions = {}
  ) {
    this.marked = markedInstance;
    this.syntaxHighlighting = options.syntaxHighlighting !== false;
    this.headingOffset = options.headingOffset ?? 0;

    // Configure marked options
    this.marked.setOptions({
      gfm: options.gfm !== false,
      breaks: options.breaks || false,
    });

    // Setup custom renderers
    this.setupCustomRenderer();
  }

  /**
   * Render markdown to HTML
   */
  public render(markdown: string, context?: MarkdownRenderContext): string {
    this.activeRenderContext = context;

    try {
      return this.marked.parse(markdown, { async: false });
    } finally {
      this.activeRenderContext = undefined;
    }
  }

  /**
   * Setup custom renderer for headings, links, and code blocks
   */
  private setupCustomRenderer(): void {
    const renderer = new Renderer();

    // Override heading renderer to add IDs
    renderer.heading = ({ tokens, depth }: Tokens.Heading) => {
      const renderedDepth = Math.min(depth + this.headingOffset, 6);
      const renderedHeading = Parser.parseInline(tokens);
      const headingHtml =
        typeof renderedHeading === "string"
          ? renderedHeading
          : escapeHtml(this.extractHeadingText(tokens));
      const headingId = this.generateAnchorId(this.extractHeadingText(tokens));
      return `<h${renderedDepth} id="${escapeHtml(headingId)}">${headingHtml}</h${renderedDepth}>`;
    };

    // Override link renderer to transform .md to .html
    renderer.link = ({ href, title, tokens }: Tokens.Link) => {
      const transformedHref = this.resolveLinkHref(href);
      const renderedLinkText = Parser.parseInline(tokens);
      const text =
        typeof renderedLinkText === "string"
          ? renderedLinkText
          : escapeHtml(this.extractHeadingText(tokens));
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
      return `<a href="${escapeHtml(transformedHref)}"${titleAttr}>${text}</a>`;
    };

    // Override code renderer to add syntax highlighting
    renderer.code = ({ text: code, lang: language }: Tokens.Code) => {
      if (!this.syntaxHighlighting) {
        const escapedCode = escapeHtml(code);
        const langClass = language
          ? ` class="language-${escapeHtml(language)}"`
          : "";
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
          const escapedLang = escapeHtml(lang);
          return `<pre class="language-${escapedLang}"><code class="language-${escapedLang}">${highlighted}</code></pre>`;
        } catch (error) {
          console.error(`Error highlighting ${lang}:`, error);
        }
      }

      // Default behavior for unsupported languages or errors
      const escapedCode = escapeHtml(code);
      const langClass = lang ? ` class="language-${escapeHtml(lang)}"` : "";
      return `<pre${langClass}><code${langClass}>${escapedCode}</code></pre>`;
    };

    this.marked.setOptions({ renderer });
  }

  private extractHeadingText(tokens: Tokens.Generic[]): string {
    const extractedText = tokens
      .map((token) => {
        if ("text" in token && typeof token.text === "string") {
          return token.text;
        }

        return "";
      })
      .join("")
      .trim();

    return extractedText;
  }

  private resolveLinkHref(href: string): string {
    const renderContext = this.activeRenderContext;
    if (!renderContext?.documentLinkIndex) {
      return href.replace(/\.md$/, ".html");
    }

    return resolveLocalDocumentLink({
      currentSourcePath: renderContext.currentSourcePath,
      targetHref: href,
      documentIndex: renderContext.documentLinkIndex,
    }).resolvedHref;
  }

  /**
   * Generate a URL-safe anchor ID from heading text
   */
  public generateAnchorId(text: unknown): string {
    const normalizedText =
      typeof text === "string"
        ? text
        : text === null || text === undefined
          ? ""
          : String(text);

    let id = normalizedText
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/--+/g, "-") // Replace multiple hyphens with single
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

    // Ensure ID starts with a letter (CSS requirement)
    if (id && /^[0-9]/.test(id)) {
      id = `heading-${id}`;
    }

    return id || "section";
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
