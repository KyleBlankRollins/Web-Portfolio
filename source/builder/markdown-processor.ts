import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { Marked } from "marked";
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
    const markedInstance = new Marked();
    this.renderer = new MarkdownRenderer(markedInstance);
    this.preprocessor = new ContentPreprocessor(markedInstance);
    this.citationProcessor = new CitationProcessor();
    this.frontmatterParser = new FrontmatterParser();
    this.manifestBuilder = new BlogManifestBuilder();
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
    const { content: citationProcessedContent, citationItems } =
      this.citationProcessor.processCitationReferences(
        commentFreeContent,
        metadata.citations,
        contentDocument.sourcePath
      );

    if (citationItems) {
      metadata.citationItems = citationItems;
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

    // Layouts own blog titles; Markdown contributes only the post body.
    let processedContent = htmlContent;
    if (metadata.isBlogPost) {
      this.rejectLeadingMarkdownH1(
        commentFreeContent,
        contentDocument.sourcePath
      );
      metadata.titleAnchorId = this.renderer.generateAnchorId(
        metadata.title || "Untitled Post"
      );

      // Add to blog post manifest
      this.addToBlogManifest(contentDocument, metadata);
    }

    // Use normalized output filename and store in memory
    const fileName = contentDocument.outputPath;

    // Store the generated file in memory
    const generatedFile: GeneratedHtmlFile = {
      filename: fileName,
      sourcePath: contentDocument.sourcePath,
      publicUrl: contentDocument.publicUrl,
      content: processedContent,
      metadata: metadata,
    };

    this.generatedFiles.set(fileName, generatedFile);

    this.generatedFilesByPublicUrl.set(
      contentDocument.publicUrl,
      generatedFile
    );

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

  private rejectLeadingMarkdownH1(content: string, filePath: string): void {
    if (/^#(?!#)\s+/.test(content.trim())) {
      throw new Error(
        `Markdown blog posts must not begin with an H1; the title is template-owned (${filePath})`
      );
    }
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
   * Get all generated HTML files from memory
   */
  public getGeneratedFiles(): Map<string, GeneratedHtmlFile> {
    return this.generatedFiles;
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
   * Generate blog manifest as JSON string (for emitting to bundle)
   */
  public generateBlogManifestJson(): string {
    return this.manifestBuilder.toJson();
  }
}
