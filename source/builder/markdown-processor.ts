import { readFileSync } from "fs";
import { basename } from "path";
import { marked } from "marked";
import Prism from "prismjs";
import { BuildLogger } from "./helpers.js";
import { TemplateProcessor } from "./template-processor.js";
import type { TemplateVariables } from "./template-processor.js";

// Import common languages for Prism
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-shell-session";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-python";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-diff";

export interface BlogPostManifestEntry {
  title: string;
  description: string;
  date: string;
  formattedDate: string;
  tags: string[];
  url: string;
  filename: string;
  keywords?: string;
}

export interface GeneratedHtmlFile {
  filename: string;
  content: string;
  metadata: Partial<TemplateVariables>;
}

/**
 * Processes Markdown files and converts them to HTML using templates
 */
export class MarkdownProcessor {
  private templateProcessor: TemplateProcessor;
  private blogPostManifest: BlogPostManifestEntry[] = [];
  private generatedFiles: Map<string, GeneratedHtmlFile> = new Map();

  constructor() {
    this.templateProcessor = new TemplateProcessor();

    // Configure marked options for better HTML output
    marked.setOptions({
      gfm: true,
      breaks: false,
    });

    // Configure custom renderer for automatic heading IDs and syntax highlighting
    this.setupCustomRenderer();
  }

  /**
   * Setup custom renderer for headings and code blocks with syntax highlighting
   */
  private setupCustomRenderer(): void {
    const renderer = new marked.Renderer();

    // Override heading renderer to add IDs
    renderer.heading = (text: string, level: number) => {
      const headingId = this.generateAnchorId(text);
      return `<h${level} id="${headingId}">${text}</h${level}>`;
    };

    // Override code renderer to add syntax highlighting
    renderer.code = (code: string, language: string | undefined) => {
      // Handle language aliases and fallbacks
      const lang = this.normalizeLanguage(language);

      if (lang && Prism.languages[lang]) {
        try {
          const highlighted = Prism.highlight(
            code,
            Prism.languages[lang],
            lang
          );
          return `<pre class="language-${lang}"><code class="language-${lang}">${highlighted}</code></pre>`;
        } catch (error) {
          BuildLogger.warn(
            `Failed to highlight code block with language '${lang}': ${error}`
          );
          // Fall back to plain code block
        }
      }

      // Default behavior for unsupported languages or errors
      const escapedCode = this.escapeHtml(code);
      const langClass = lang ? ` class="language-${lang}"` : "";
      return `<pre${langClass}><code${langClass}>${escapedCode}</code></pre>`;
    };

    marked.setOptions({
      renderer: renderer,
    });
  }

  /**
   * Normalize language aliases to Prism language identifiers
   */
  private normalizeLanguage(
    language: string | undefined
  ): string | undefined {
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

  /**
   * Escape HTML characters in code
   */
  private escapeHtml(code: string): string {
    return code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * Generate a URL-safe anchor ID from heading text
   */
  private generateAnchorId(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/--+/g, "-") // Replace multiple hyphens with single
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
  }

  /**
   * Remove JavaScript-style comments from markdown content before processing.
   * Only removes comments that appear outside of code blocks - preserves comments within fenced code blocks.
   *
   * Handles:
   * - Line comments: // comment (at start of line)
   * - Block comments: CSS/JS block comments (standalone on their own lines)
   */
  private stripComments(content: string): string {
    // Split content by code blocks to preserve comments inside them
    const codeBlockPattern = /```[\s\S]*?```/g;
    const codeBlocks: string[] = [];
    let processed = content;

    // Extract code blocks and replace with placeholders
    processed = processed.replace(codeBlockPattern, (match) => {
      const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
      codeBlocks.push(match);
      return placeholder;
    });

    // Now strip comments from non-code-block content
    // Remove standalone line comments (// at start of line, optionally with whitespace)
    processed = processed.replace(/^\s*\/\/.*$/gm, "");

    // Remove CSS/JS style block comments (/* ... */) that appear standalone on their own lines
    processed = processed.replace(/^\s*\/\*[\s\S]*?\*\/\s*$/gm, "");

    // Restore code blocks
    codeBlocks.forEach((codeBlock, index) => {
      processed = processed.replace(
        `__CODE_BLOCK_${index}__`,
        codeBlock
      );
    });

    // Clean up any resulting multiple consecutive newlines
    processed = processed.replace(/\n\s*\n\s*\n/g, "\n\n");

    return processed;
  }

  /**
   * Preprocess admonitions to handle markdown content within HTML tags.
   * Extracts content inside kbr-admonition tags, processes it with marked.parseInline(),
   * and preserves the component's HTML attributes unchanged.
   */
  private preprocessAdmonitions(content: string): string {
    const admonitionPattern =
      /<kbr-admonition([^>]*)>([\s\S]*?)<\/kbr-admonition>/g;

    return content.replace(
      admonitionPattern,
      (_, attributes, innerContent) => {
        // Trim whitespace from inner content
        const trimmedContent = innerContent.trim();

        // Process markdown content with parseInline to avoid wrapping in <p> tags
        const processedContent = marked.parseInline(trimmedContent);

        // Return admonition with processed content, preserving original attributes
        return `\n\n<kbr-admonition${attributes}>${processedContent}</kbr-admonition>\n\n`;
      }
    );
  }

  /**
   * Process a single Markdown file and convert it to HTML content (without template)
   * The template will be applied later by the HtmlBundleProcessor
   */
  public processMarkdownFile(filePath: string): string {
    BuildLogger.info(`Processing Markdown file: ${filePath}`);

    const markdownContent = readFileSync(filePath, "utf-8");

    // Extract frontmatter metadata and content
    const { metadata, content } =
      this.templateProcessor.extractMarkdownFrontmatter(
        markdownContent
      );

    // Strip comments from the markdown content
    const commentFreeContent = this.stripComments(content);

    // Preprocess admonitions to handle markdown within HTML tags
    const preprocessedContent = this.preprocessAdmonitions(
      commentFreeContent
    );

    // Convert Markdown to HTML
    const htmlContent = marked(preprocessedContent);

    // For blog posts, add date and tags after the first h1
    let processedContent = htmlContent;
    if (metadata.isBlogPost) {
      processedContent = this.addBlogMetadataToHTML(
        htmlContent,
        metadata
      );

      // Add to blog post manifest
      this.addToBlogManifest(filePath, metadata);
    }

    // Create HTML content with metadata comments for later processing
    const htmlWithMetadata = [
      metadata.title ? `<!-- title: ${metadata.title} -->` : "",
      metadata.description
        ? `<!-- description: ${metadata.description} -->`
        : "",
      metadata.keywords
        ? `<!-- keywords: ${metadata.keywords} -->`
        : "",
      // Add blog-specific metadata comments
      metadata.date ? `<!-- date: ${metadata.date} -->` : "",
      metadata.formattedDate
        ? `<!-- formattedDate: ${metadata.formattedDate} -->`
        : "",
      metadata.tags && metadata.tags.length > 0
        ? `<!-- tags: ${metadata.tags.join(", ")} -->`
        : "",
      metadata.isBlogPost ? `<!-- isBlogPost: true -->` : "",
      processedContent,
    ]
      .filter(Boolean)
      .join("\n");

    // Generate filename and store in memory instead of writing to disk
    const fileName = basename(filePath).replace(/\.md$/, ".html");

    // Store the generated file in memory
    this.generatedFiles.set(fileName, {
      filename: fileName,
      content: htmlWithMetadata,
      metadata: metadata,
    });

    BuildLogger.success(
      `Generated blog post: ${fileName} (stored in memory)`
    );

    return fileName;
  }

  /**
   * Add blog metadata (date and tags) to HTML content after the first h1
   */
  private addBlogMetadataToHTML(
    htmlContent: string,
    metadata: Partial<TemplateVariables>
  ): string {
    // Find the first h1 tag
    const h1Match = htmlContent.match(/(<h1[^>]*>.*?<\/h1>)/i);

    if (!h1Match) {
      // No h1 found, just add metadata at the beginning
      return this.createBlogMetadataHTML(metadata) + htmlContent;
    }

    const h1Tag = h1Match[1];
    const h1Index = htmlContent.indexOf(h1Tag);
    const afterH1Index = h1Index + h1Tag.length;

    // Insert blog metadata after the h1
    const beforeH1 = htmlContent.substring(0, afterH1Index);
    const afterH1 = htmlContent.substring(afterH1Index);

    return (
      beforeH1 +
      "\n" +
      this.createBlogMetadataHTML(metadata) +
      afterH1
    );
  }

  /**
   * Create HTML for blog post metadata (date only - tags moved to sidebar)
   */
  private createBlogMetadataHTML(
    metadata: Partial<TemplateVariables>
  ): string {
    // Only add date - tags will be handled in the template sidebar
    if (metadata.formattedDate) {
      return `
        <div class="blog-post-metadata">
          <div class="blog-post-date">
            <time datetime="${metadata.date}">${metadata.formattedDate}</time>
          </div>
        </div>
      `;
    }

    return "";
  }

  /**
   * Add a blog post to the manifest
   */
  private addToBlogManifest(
    filePath: string,
    metadata: Partial<TemplateVariables>
  ): void {
    if (!metadata.isBlogPost) return;

    const filename = basename(filePath, ".md");
    const url = `/${filename}.html`;

    const manifestEntry: BlogPostManifestEntry = {
      title: metadata.title || "Untitled Post",
      description: metadata.description || "",
      date: metadata.date || "",
      formattedDate: metadata.formattedDate || "",
      tags: metadata.tags || [],
      url: url,
      filename: filename,
      keywords: metadata.keywords,
    };

    this.blogPostManifest.push(manifestEntry);
  }

  /**
   * Generate the blog post manifest (no longer saves to disk)
   */
  public generateBlogManifest(): void {
    // Sort blog posts by date (newest first)
    const sortedPosts = this.blogPostManifest.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    // Generate collection of all unique tags with counts
    const tagCounts = new Map<string, number>();
    sortedPosts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    // Convert to array of objects with tag and count, sorted by count descending, then alphabetically
    const tagsWithCounts = Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => {
        if (b.count !== a.count) {
          return b.count - a.count; // Sort by count descending
        }
        return a.tag.toLowerCase().localeCompare(b.tag.toLowerCase()); // Then alphabetically
      });

    // Keep the simple array for backward compatibility
    const sortedTags = tagsWithCounts.map((item) => item.tag);

    // Note: We no longer write to disk here - the manifest will be emitted via generateBundle
    BuildLogger.success(
      `Generated blog manifest data (${sortedPosts.length} posts, ${sortedTags.length} tags)`
    );
  }

  /**
   * Get the current blog post manifest
   */
  public getBlogManifest(): BlogPostManifestEntry[] {
    return this.blogPostManifest;
  }

  /**
   * Get all generated HTML files from memory
   */
  public getGeneratedFiles(): Map<string, GeneratedHtmlFile> {
    return this.generatedFiles;
  }

  /**
   * Get a specific generated file by filename
   */
  public getGeneratedFile(
    filename: string
  ): GeneratedHtmlFile | undefined {
    return this.generatedFiles.get(filename);
  }

  /**
   * Clear all generated files from memory
   */
  public clearGeneratedFiles(): void {
    this.generatedFiles.clear();
  }

  /**
   * Generate blog manifest as JSON string (for emitting to bundle)
   */
  public generateBlogManifestJson(): string {
    // Sort posts by date (newest first)
    const sortedPosts = this.blogPostManifest.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Create tags with post counts
    const tagCounts = new Map<string, number>();
    this.blogPostManifest.forEach((post) => {
      post.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    const tagsWithCounts = Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);

    // Keep the simple array for backward compatibility
    const sortedTags = tagsWithCounts.map((item) => item.tag);

    const manifest = {
      posts: sortedPosts,
      totalPosts: sortedPosts.length,
      availableTags: sortedTags,
      tagsWithCounts: tagsWithCounts,
    };

    return JSON.stringify(manifest, null, 2);
  }
}
