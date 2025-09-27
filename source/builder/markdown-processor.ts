import { readFileSync } from "fs";
import { basename } from "path";
import { marked } from "marked";
import { BuildLogger } from "./helpers.js";
import { TemplateProcessor } from "./template-processor.js";
import type { TemplateVariables } from "./template-processor.js";

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

    // Configure custom renderer for automatic heading IDs
    this.setupHeadingRenderer();
  }

  /**
   * Setup custom renderer to automatically generate heading IDs
   */
  private setupHeadingRenderer(): void {
    const renderer = new marked.Renderer();

    // Override heading renderer to add IDs
    renderer.heading = (text: string, level: number) => {
      const headingId = this.generateAnchorId(text);
      return `<h${level} id="${headingId}">${text}</h${level}>`;
    };

    marked.setOptions({
      renderer: renderer,
    });
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

    // Convert Markdown to HTML
    const htmlContent = marked(content);

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
