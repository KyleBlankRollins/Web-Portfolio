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
