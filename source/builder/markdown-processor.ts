import { readFileSync } from "fs";
import { basename } from "path";
import { marked } from "marked";
import Prism from "prismjs";
import { BuildLogger } from "./helpers.js";
import { TemplateProcessor } from "./template-processor.js";
import type {
  TemplateVariables,
  SeriesInfo,
  Citation,
} from "./template-processor.js";

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
  series?: SeriesInfo;
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

    // Override link renderer to transform .md to .html
    renderer.link = (
      href: string,
      title: string | null | undefined,
      text: string
    ) => {
      // Transform .md links to .html
      const transformedHref = href.replace(/\.md$/, ".html");
      const titleAttr = title ? ` title="${title}"` : "";
      return `<a href="${transformedHref}"${titleAttr}>${text}</a>`;
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
  private normalizeLanguage(language: string | undefined): string | undefined {
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
      processed = processed.replace(`__CODE_BLOCK_${index}__`, codeBlock);
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

    return content.replace(admonitionPattern, (_, attributes, innerContent) => {
      // Trim whitespace from inner content
      const trimmedContent = innerContent.trim();

      // Process markdown content with parseInline to avoid wrapping in <p> tags
      const processedContent = marked.parseInline(trimmedContent);

      // Return admonition with processed content, preserving original attributes
      return `\n\n<kbr-admonition${attributes}>${processedContent}</kbr-admonition>\n\n`;
    });
  }

  /**
   * Process citation references in markdown content.
   * Finds [^id] patterns and replaces them with numbered superscript links.
   * Returns processed content and generates citations HTML section.
   */
  private processCitations(
    content: string,
    citations: Citation[] | undefined,
    filePath: string
  ): { content: string; citationsHtml: string | undefined } {
    if (!citations || citations.length === 0) {
      return { content, citationsHtml: undefined };
    }

    // Track citation usage: Map<citationId, { number, positions }>
    const citationUsage = new Map<
      string,
      { number: number; positions: number[] }
    >();
    const citationPattern = /\[\^([a-z0-9-]+)\]/g;
    let citationNumber = 0;
    let match;

    // First pass: find all citations and assign numbers in order of first appearance
    const matches: Array<{ id: string; index: number }> = [];

    while ((match = citationPattern.exec(content)) !== null) {
      const citationId = match[1];
      matches.push({ id: citationId, index: match.index });

      if (!citationUsage.has(citationId)) {
        // Verify citation exists in frontmatter
        const citation = citations.find((c) => c.id === citationId);
        if (!citation) {
          BuildLogger.error(
            `Citation reference [^${citationId}] not found in frontmatter of ${filePath}`
          );
          throw new Error(
            `Undefined citation reference: [^${citationId}] in ${filePath}`
          );
        }

        citationNumber++;
        citationUsage.set(citationId, {
          number: citationNumber,
          positions: [],
        });
      }

      citationUsage.get(citationId)!.positions.push(match.index);
    }

    // Check for unused citations
    const usedCitationIds = new Set(citationUsage.keys());
    const unusedCitations = citations.filter((c) => !usedCitationIds.has(c.id));

    if (unusedCitations.length > 0) {
      BuildLogger.warn(
        `Unused citations in ${filePath}: ${unusedCitations.map((c) => c.id).join(", ")}`
      );
    }

    // Second pass: build new content by replacing citations with numbered superscript links
    // Use a segment-based approach to avoid index invalidation issues
    const segments: string[] = [];
    let lastIndex = 0;

    // Process matches in forward order, building segments
    for (let i = 0; i < matches.length; i++) {
      const { id, index } = matches[i];
      const usage = citationUsage.get(id)!;
      const refNumber = usage.number;
      const positionIndex = usage.positions.indexOf(index);

      // Create unique ID for back-reference if there are multiple refs to same citation
      const backRefId =
        usage.positions.length > 1
          ? `citation-ref-${id}-${positionIndex + 1}`
          : `citation-ref-${id}`;

      const replacement = `<sup id="${backRefId}"><a href="#citation-${id}" class="citation-ref">[${refNumber}]</a></sup>`;

      // Add the content before this citation
      segments.push(content.substring(lastIndex, index));
      // Add the replacement
      segments.push(replacement);
      // Update lastIndex to after this citation
      lastIndex = index + `[^${id}]`.length;
    }

    // Add any remaining content after the last citation
    segments.push(content.substring(lastIndex));

    // Join all segments to create the final processed content
    const processedContent = segments.join("");

    // Generate citations HTML section
    const citationsHtml = this.generateCitationsHtml(citations, citationUsage);

    return { content: processedContent, citationsHtml };
  }

  /**
   * Generate HTML for the citations/footnotes section
   */
  private generateCitationsHtml(
    citations: Citation[],
    citationUsage: Map<string, { number: number; positions: number[] }>
  ): string {
    // Filter to only used citations and sort by number
    const usedCitations = Array.from(citationUsage.entries())
      .map(([id, usage]) => ({
        citation: citations.find((c) => c.id === id)!,
        number: usage.number,
        positions: usage.positions,
      }))
      .sort((a, b) => a.number - b.number);

    if (usedCitations.length === 0) {
      return "";
    }

    const citationItems = usedCitations
      .map(({ citation, positions }) => {
        const links: string[] = [];

        if (citation.url) {
          links.push(
            `<a href="${citation.url}" target="_blank" rel="noopener noreferrer">Website</a>`
          );
        }

        if (citation.purchaseUrl) {
          links.push(
            `<a href="${citation.purchaseUrl}" target="_blank" rel="noopener noreferrer">Purchase</a>`
          );
        }

        const linksHtml =
          links.length > 0
            ? ` <span class="citation-links">${links.join('<span class="citation-separator"> | </span>')}</span>`
            : "";

        // Generate back-reference links
        const backRefs =
          positions.length > 1
            ? positions
                .map((_, idx) => {
                  const backRefId = `citation-ref-${citation.id}-${idx + 1}`;
                  return `<a href="#${backRefId}" class="citation-backref">↩</a>`;
                })
                .join(" ")
            : `<a href="#citation-ref-${citation.id}" class="citation-backref">↩</a>`;

        return `    <li id="citation-${citation.id}">
      <em>${citation.title}</em> by ${citation.author}${linksHtml}
      <span class="citation-backrefs"> ${backRefs}</span>
    </li>`;
      })
      .join("\n");

    return `<section class="citations">
  <h2>References</h2>
  <ol class="citations-list">
${citationItems}
  </ol>
</section>`;
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
      this.templateProcessor.extractMarkdownFrontmatter(markdownContent);

    // Strip comments from the markdown content
    const commentFreeContent = this.stripComments(content);

    // Process citations before markdown conversion (work on markdown, not HTML)
    const { content: citationProcessedContent, citationsHtml } =
      this.processCitations(commentFreeContent, metadata.citations, filePath);

    // Store citationsHtml in metadata for later template rendering
    if (citationsHtml) {
      metadata.citationsHtml = citationsHtml;
    }

    // Preprocess admonitions to handle markdown within HTML tags
    const preprocessedContent = this.preprocessAdmonitions(
      citationProcessedContent
    );

    // Convert Markdown to HTML
    const htmlContent = marked(preprocessedContent);

    // For blog posts, inject title as H1 and add metadata
    let processedContent = htmlContent;
    if (metadata.isBlogPost) {
      processedContent = this.injectTitleAndMetadata(htmlContent, metadata);

      // Add to blog post manifest
      this.addToBlogManifest(filePath, metadata);
    }

    // Create HTML content with metadata comments for later processing
    const htmlWithMetadata = [
      metadata.title ? `<!-- title: ${metadata.title} -->` : "",
      metadata.description
        ? `<!-- description: ${metadata.description} -->`
        : "",
      metadata.keywords ? `<!-- keywords: ${metadata.keywords} -->` : "",
      // Add blog-specific metadata comments
      metadata.date ? `<!-- date: ${metadata.date} -->` : "",
      metadata.formattedDate
        ? `<!-- formattedDate: ${metadata.formattedDate} -->`
        : "",
      metadata.tags && metadata.tags.length > 0
        ? `<!-- tags: ${metadata.tags.join(", ")} -->`
        : "",
      metadata.isBlogPost ? `<!-- isBlogPost: true -->` : "",
      // Add series metadata comments if present
      metadata.series?.name
        ? `<!-- series.name: ${metadata.series.name} -->`
        : "",
      metadata.series?.part !== undefined
        ? `<!-- series.part: ${metadata.series.part} -->`
        : "",
      // Add citations HTML as metadata comment
      metadata.citationsHtml
        ? `<!-- citationsHtml: ${this.escapeHtmlComment(metadata.citationsHtml)} -->`
        : "",
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

    BuildLogger.success(`Generated blog post: ${fileName} (stored in memory)`);

    return fileName;
  }

  /**
   * Escape HTML content for use in HTML comments
   */
  private escapeHtmlComment(html: string): string {
    return html.replace(/--/g, "&#45;&#45;");
  }

  /**
   * Inject title as H1 and add blog metadata below it.
   * If the content already starts with an H1, it will be used instead of the frontmatter title.
   */
  private injectTitleAndMetadata(
    htmlContent: string,
    metadata: Partial<TemplateVariables>
  ): string {
    const title = metadata.title || "Untitled Post";
    const titleId = this.generateAnchorId(title);
    const titleH1 = `<h1 id="${titleId}">${title}</h1>`;
    const metadataHTML = this.createBlogMetadataHTML(metadata);

    // Check if content already has an H1 at the start (after whitespace)
    const h1Match = htmlContent.trim().match(/^(<h1[^>]*>.*?<\/h1>)/i);

    if (h1Match) {
      // Content has an H1, use it instead of injecting title from frontmatter
      const existingH1 = h1Match[1];
      const afterH1Index = htmlContent.indexOf(existingH1) + existingH1.length;
      const afterH1 = htmlContent.substring(afterH1Index);

      return existingH1 + "\n" + metadataHTML + afterH1;
    }

    // No H1 found, inject title from frontmatter
    return titleH1 + "\n" + metadataHTML + htmlContent;
  }

  /**
   * Create HTML for blog post metadata (date only - tags moved to sidebar)
   */
  private createBlogMetadataHTML(metadata: Partial<TemplateVariables>): string {
    // Only add date - tags will be handled in the template sidebar
    if (metadata.formattedDate) {
      return `
        <div class="blog-post-metadata">
          <div>
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

    // Add series data if present
    if (metadata.series) {
      manifestEntry.series = metadata.series;
    }

    this.blogPostManifest.push(manifestEntry);
  }

  /**
   * Generate the blog post manifest (no longer saves to disk)
   */
  public generateBlogManifest(): void {
    // Validate series data before generating manifest
    this.validateSeriesData();

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
   * Validate series data for consistency
   */
  private validateSeriesData(): void {
    // Group posts by series name
    const seriesMap = new Map<string, BlogPostManifestEntry[]>();

    this.blogPostManifest.forEach((post) => {
      if (post.series) {
        const seriesName = post.series.name;
        if (!seriesMap.has(seriesName)) {
          seriesMap.set(seriesName, []);
        }
        seriesMap.get(seriesName)!.push(post);
      }
    });

    // Validate each series
    seriesMap.forEach((posts, seriesName) => {
      const parts = posts.map((p) => p.series!.part);
      const sortedParts = [...parts].sort((a, b) => a - b);

      // Check for duplicate part numbers
      const duplicates = parts.filter(
        (part, index) => parts.indexOf(part) !== index
      );
      if (duplicates.length > 0) {
        const duplicatePosts = posts.filter((p) =>
          duplicates.includes(p.series!.part)
        );
        BuildLogger.error(
          `Duplicate part numbers in series "${seriesName}": ${duplicates.join(", ")}`
        );
        duplicatePosts.forEach((post) => {
          BuildLogger.error(`  - "${post.title}" (part ${post.series!.part})`);
        });
        throw new Error(
          `Series "${seriesName}" has duplicate part numbers. Each part must be unique.`
        );
      }

      // Check for non-sequential parts (warning only)
      const hasGaps = sortedParts.some((part, index) => {
        if (index === 0) return false;
        return part !== sortedParts[index - 1] + 1;
      });
      if (hasGaps) {
        BuildLogger.warn(
          `Series "${seriesName}" has non-sequential part numbers: ${sortedParts.join(", ")}`
        );
        BuildLogger.warn(`  This is allowed but may indicate missing posts.`);
      }
    });
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
  public getGeneratedFile(filename: string): GeneratedHtmlFile | undefined {
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
