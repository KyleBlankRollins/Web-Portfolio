/**
 * Builder Modules Barrel Export
 * Convenience exports for all builder modules
 */

// HTML utilities
export * from "./html-utils.js";

// Citation processing
export {
  CitationProcessor,
  type Citation,
  type CitationUsage,
  type CitationProcessingResult,
} from "./citation-processor.js";

// Frontmatter parsing
export {
  FrontmatterParser,
  type SeriesInfo,
  type FrontmatterData,
  type FrontmatterParseResult,
} from "./frontmatter-parser.js";

// Markdown rendering
export {
  MarkdownRenderer,
  type MarkdownRendererOptions,
} from "./markdown-renderer.js";

// Content preprocessing
export { ContentPreprocessor } from "./content-preprocessor.js";

// Content discovery
export {
  ContentDiscovery,
  type ContentDocument,
  type ContentDocumentKind,
  type ContentDiscoveryResult,
  normalizePathForComparison,
} from "./content-discovery.js";

// Local document link resolver
export {
  createLocalDocumentLinkIndex,
  resolveLocalDocumentLink,
  type LocalDocumentLinkIndex,
  type LocalDocumentLinkIndexEntry,
  type ResolveLocalDocumentLinkInput,
  type ResolveLocalDocumentLinkResult,
} from "./local-document-link-resolver.js";

// Blog manifest
export {
  BlogManifestBuilder,
  type BlogPostManifestEntry,
  type SupplementManifestEntry,
  type TagWithCount,
  type BlogManifest,
} from "./blog-manifest.js";

// Metadata extraction
export {
  MetadataExtractor,
  type ExtractedMetadata,
  type MetadataExtractionResult,
} from "./metadata-extractor.js";

// Template engine
export { TemplateEngine, type TemplateVariables } from "./template-engine.js";
