import { readFileSync } from "fs";
import { basename } from "path";
import { BuildLogger } from "./helpers.js";
import {
  MarkdownRenderer,
  ContentPreprocessor,
  CitationProcessor,
  FrontmatterParser,
  BlogManifestBuilder,
  type ContentDocument,
  type BlogPostManifestEntry,
  type SupplementManifestEntry,
  type LocalDocumentLinkIndex,
  escapeHtmlComment,
} from "./modules/index.js";
import type { TemplateVariables } from "./template-processor.js";

// Re-export types for backward compatibility
export type { BlogPostManifestEntry };

export interface GeneratedHtmlFile {
  filename: string;
  sourcePath: string;
  publicUrl: string;
  content: string;
  metadata: Partial<TemplateVariables>;
}

/**
 * Processes Markdown files and converts them to HTML using templates
 */
export class MarkdownProcessor {
  private renderer: MarkdownRenderer;
  private preprocessor: ContentPreprocessor;
  private citationProcessor: CitationProcessor;
  private frontmatterParser: FrontmatterParser;
  private manifestBuilder: BlogManifestBuilder;
  private localDocumentLinkIndex?: LocalDocumentLinkIndex;
  private generatedFiles: Map<string, GeneratedHtmlFile> = new Map();
  private generatedFilesByPublicUrl: Map<string, GeneratedHtmlFile> = new Map();

  constructor() {
    this.renderer = new MarkdownRenderer();
    this.preprocessor = new ContentPreprocessor();
    this.citationProcessor = new CitationProcessor();
    this.frontmatterParser = new FrontmatterParser();
    this.manifestBuilder = new BlogManifestBuilder();
  }

  /**
   * Process a single Markdown file and convert it to HTML content (without template)
   * The template will be applied later by the HtmlBundleProcessor
   */
  public processMarkdownFile(filePath: string): string {
    const fileName = basename(filePath).replace(/\.md$/, ".html");
    const contentDocument: ContentDocument = {
      sourcePath: filePath,
      outputPath: fileName,
      publicUrl: `/${fileName}`,
      kind: "standalone-post",
      metadata: {},
    };

    return this.processContentDocument(contentDocument);
  }

  /**
   * Process a normalized content document and convert it to HTML content.
   */
  public processContentDocument(contentDocument: ContentDocument): string {
    BuildLogger.info(
      `Processing Markdown document: ${contentDocument.sourcePath}`
    );

    const markdownContent = readFileSync(contentDocument.sourcePath, "utf-8");

    // Extract frontmatter metadata and content
    const { metadata: parsedMetadata, content } =
      this.frontmatterParser.parse(markdownContent);
    const metadata = { ...parsedMetadata, ...contentDocument.metadata };

    // Supplements are independently published pages and should use blog rendering.
    if (contentDocument.kind === "supplement-candidate") {
      metadata.isBlogPost = true;
    }

    // Strip comments from the markdown content
    const commentFreeContent = this.preprocessor.stripComments(content);

    // Process citations before markdown conversion
    const { content: citationProcessedContent, citationsHtml } =
      this.citationProcessor.processCitationReferences(
        commentFreeContent,
        metadata.citations,
        contentDocument.sourcePath
      );

    // Store citations HTML in metadata
    if (citationsHtml) {
      metadata.citationsHtml = citationsHtml;
    }

    // Preprocess admonitions to handle markdown within HTML tags
    const preprocessedContent = this.preprocessor.preprocessAdmonitions(
      citationProcessedContent
    );

    // Convert Markdown to HTML
    const htmlContent = this.renderer.render(preprocessedContent, {
      currentSourcePath: contentDocument.sourcePath,
      documentLinkIndex: this.localDocumentLinkIndex,
    });

    // For blog posts, inject title as H1 and add metadata
    let processedContent = htmlContent;
    if (metadata.isBlogPost) {
      processedContent = this.injectTitleAndMetadata(htmlContent, metadata);

      // Add to blog post manifest
      this.addToBlogManifest(contentDocument, metadata);
    }

    // Create HTML content with metadata comments for later processing
    const htmlWithMetadata = [
      metadata.title ? `<!-- title: ${metadata.title} -->` : "",
      metadata.description
        ? `<!-- description: ${metadata.description} -->`
        : "",
      metadata.keywords ? `<!-- keywords: ${metadata.keywords} -->` : "",
      metadata.date ? `<!-- date: ${metadata.date} -->` : "",
      metadata.formattedDate
        ? `<!-- formattedDate: ${metadata.formattedDate} -->`
        : "",
      metadata.tags && metadata.tags.length > 0
        ? `<!-- tags: ${metadata.tags.join(", ")} -->`
        : "",
      metadata.isBlogPost ? `<!-- isBlogPost: true -->` : "",
      metadata.series?.name
        ? `<!-- series.name: ${metadata.series.name} -->`
        : "",
      metadata.series?.part !== undefined
        ? `<!-- series.part: ${metadata.series.part} -->`
        : "",
      metadata.citationsHtml
        ? `<!-- citationsHtml: ${escapeHtmlComment(metadata.citationsHtml)} -->`
        : "",
      processedContent,
    ]
      .filter(Boolean)
      .join("\n");

    // Use normalized output filename and store in memory
    const fileName = contentDocument.outputPath;

    // Store the generated file in memory
    this.generatedFiles.set(fileName, {
      filename: fileName,
      sourcePath: contentDocument.sourcePath,
      publicUrl: contentDocument.publicUrl,
      content: htmlWithMetadata,
      metadata: metadata,
    });

    this.generatedFilesByPublicUrl.set(contentDocument.publicUrl, {
      filename: fileName,
      sourcePath: contentDocument.sourcePath,
      publicUrl: contentDocument.publicUrl,
      content: htmlWithMetadata,
      metadata: metadata,
    });

    BuildLogger.success(`Generated blog post: ${fileName} (stored in memory)`);

    return fileName;
  }

  /**
   * Configure source-aware link index for local Markdown link resolution.
   */
  public setLocalDocumentLinkIndex(documentLinkIndex: LocalDocumentLinkIndex) {
    this.localDocumentLinkIndex = documentLinkIndex;
  }

  /**
   * Clear in-memory generated files and manifest state before rebuilding.
   */
  public resetBuildState(): void {
    this.generatedFiles.clear();
    this.generatedFilesByPublicUrl.clear();
    this.manifestBuilder.clear();
  }

  /**
   * Rebuild manifest entries from discovered publishable documents.
   * This keeps manifest output complete even when HTML generation is incremental.
   */
  public rebuildManifestFromDocuments(
    contentDocuments: ContentDocument[]
  ): void {
    this.manifestBuilder.clear();

    for (const contentDocument of contentDocuments) {
      if (contentDocument.kind === "supplement-candidate") {
        continue;
      }

      this.addToBlogManifest(contentDocument, contentDocument.metadata);
    }
  }

  /**
   * Render markdown content in development fallback paths using the same resolver.
   */
  public renderMarkdownBody(content: string, sourcePath: string): string {
    const commentFreeContent = this.preprocessor.stripComments(content);
    const preprocessedContent =
      this.preprocessor.preprocessAdmonitions(commentFreeContent);

    return this.renderer.render(preprocessedContent, {
      currentSourcePath: sourcePath,
      documentLinkIndex: this.localDocumentLinkIndex,
    });
  }

  /**
   * Inject title as H1 and add blog metadata below it
   */
  private injectTitleAndMetadata(
    htmlContent: string,
    metadata: Partial<TemplateVariables>
  ): string {
    const title = metadata.title || "Untitled Post";
    const titleId = this.renderer.generateAnchorId(title);
    const titleH1 = `<h1 id="${titleId}">${title}</h1>`;
    const metadataHTML = this.createBlogMetadataHTML(metadata);

    // Check if content already has an H1 at the start
    const h1Match = htmlContent.trim().match(/^(<h1[^>]*>.*?<\/h1>)/i);

    if (h1Match) {
      const existingH1 = h1Match[1];
      const afterH1Index = htmlContent.indexOf(existingH1) + existingH1.length;
      const afterH1 = htmlContent.substring(afterH1Index);

      return existingH1 + "\n" + metadataHTML + afterH1;
    }

    return titleH1 + "\n" + metadataHTML + htmlContent;
  }

  /**
   * Create HTML for blog post metadata (date only - tags moved to sidebar)
   */
  private createBlogMetadataHTML(metadata: Partial<TemplateVariables>): string {
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
    contentDocument: ContentDocument,
    metadata: Partial<TemplateVariables>
  ): void {
    if (!metadata.isBlogPost) return;
    if (contentDocument.kind === "supplement-candidate") return;

    const filename = basename(contentDocument.outputPath, ".html");
    const url = contentDocument.publicUrl;

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

    const supplementEntries = this.getSupplementManifestEntries(metadata);
    if (supplementEntries.length > 0) {
      manifestEntry.supplements = supplementEntries;
    }

    this.manifestBuilder.addPost(manifestEntry);
  }

  private getSupplementManifestEntries(
    metadata: Partial<TemplateVariables>
  ): SupplementManifestEntry[] {
    const supplementsValue = metadata.supplements;
    if (!Array.isArray(supplementsValue)) {
      return [];
    }

    return supplementsValue.filter(
      (supplement): supplement is SupplementManifestEntry => {
        if (!supplement || typeof supplement !== "object") {
          return false;
        }

        const candidate = supplement as Partial<SupplementManifestEntry>;
        return (
          typeof candidate.title === "string" &&
          typeof candidate.description === "string" &&
          typeof candidate.url === "string" &&
          typeof candidate.filename === "string"
        );
      }
    );
  }

  /**
   * Generate the blog post manifest
   */
  public generateBlogManifest(): void {
    this.manifestBuilder.buildManifest();
  }

  /**
   * Get the current blog post manifest
   */
  public getBlogManifest(): BlogPostManifestEntry[] {
    return this.manifestBuilder.getPosts();
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
   * Get a specific generated file by public URL.
   */
  public getGeneratedFileByPublicUrl(
    publicUrl: string
  ): GeneratedHtmlFile | undefined {
    return this.generatedFilesByPublicUrl.get(publicUrl);
  }

  /**
   * Clear all generated files from memory
   */
  public clearGeneratedFiles(): void {
    this.generatedFiles.clear();
    this.generatedFilesByPublicUrl.clear();
  }

  /**
   * Generate blog manifest as JSON string (for emitting to bundle)
   */
  public generateBlogManifestJson(): string {
    return this.manifestBuilder.toJson();
  }
}
