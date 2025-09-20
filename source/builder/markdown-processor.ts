import { readFileSync, writeFileSync } from "fs";
import { join, basename } from "path";
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

/**
 * Processes Markdown files and converts them to HTML using templates
 */
export class MarkdownProcessor {
  private templateProcessor: TemplateProcessor;
  private blogPostManifest: BlogPostManifestEntry[] = [];

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

    // Generate output file path (same location, .html extension)
    const outputPath = filePath.replace(/\.md$/, ".html");

    // Write the HTML content (without template - that will be applied later)
    writeFileSync(outputPath, htmlWithMetadata, "utf-8");

    BuildLogger.success(`Generated blog post: ${outputPath}`);

    return outputPath;
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
   * Create HTML for blog post metadata (date and tags)
   */
  private createBlogMetadataHTML(
    metadata: Partial<TemplateVariables>
  ): string {
    const metadataParts = [];

    // Add date if available
    if (metadata.formattedDate) {
      metadataParts.push(`
        <div class="blog-post-date">
          <time datetime="${metadata.date}">${metadata.formattedDate}</time>
        </div>
      `);
    }

    // Add tags if available
    if (metadata.tags && metadata.tags.length > 0) {
      const tagButtons = metadata.tags
        .map(
          (tag) =>
            `<button class="blog-tag" data-tag="${tag}">${tag}</button>`
        )
        .join("");

      metadataParts.push(`
        <div class="blog-post-tags">
          <span class="tags-label">Tags:</span>
          <div class="tag-list">
            ${tagButtons}
          </div>
        </div>
      `);
    }

    if (metadataParts.length > 0) {
      return `
        <div class="blog-post-metadata">
          ${metadataParts.join("\n")}
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
   * Generate and save the blog post manifest JSON file
   */
  public generateBlogManifest(
    outputPath: string = join("source", "site", "blog-manifest.json")
  ): void {
    // Sort blog posts by date (newest first)
    const sortedPosts = this.blogPostManifest.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    // Generate collection of all unique tags
    const allTags = new Set<string>();
    sortedPosts.forEach((post) => {
      post.tags.forEach((tag) => {
        allTags.add(tag);
      });
    });

    // Sort tags alphabetically
    const sortedTags = Array.from(allTags).sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );

    const manifest = {
      posts: sortedPosts,
      totalPosts: sortedPosts.length,
      availableTags: sortedTags,
      generatedAt: new Date().toISOString(),
    };

    writeFileSync(
      outputPath,
      JSON.stringify(manifest, null, 2),
      "utf-8"
    );
    BuildLogger.success(
      `Generated blog manifest: ${outputPath} (${sortedPosts.length} posts, ${sortedTags.length} tags)`
    );
  }

  /**
   * Get the current blog post manifest
   */
  public getBlogManifest(): BlogPostManifestEntry[] {
    return this.blogPostManifest;
  }
}
