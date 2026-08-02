/**
 * Metadata Extractor Module
 * Extracts metadata from HTML comments in processed files
 */

import { StringHelper } from "../helpers.js";

/**
 * Extracted metadata structure
 */
export interface ExtractedMetadata {
  title?: string;
  description?: string;
  keywords?: string;
  [key: string]: string | undefined;
}

/**
 * Result of metadata extraction
 */
export interface MetadataExtractionResult {
  metadata: ExtractedMetadata;
  content: string;
}

/**
 * Metadata extractor class
 */
export class MetadataExtractor {
  /**
   * Extract all metadata from HTML comments
   * Returns metadata and content with comments removed
   */
  public extract(htmlContent: string): MetadataExtractionResult {
    const metadata: ExtractedMetadata = {};
    let content = htmlContent;

    // Extract title
    const titleMatch = htmlContent.match(/<!--\s*title:\s*(.+?)\s*-->/i);
    if (titleMatch) {
      metadata.title = titleMatch[1].trim();
      content = content.replace(titleMatch[0], "");
    }

    // Extract description
    const descMatch = htmlContent.match(/<!--\s*description:\s*(.+?)\s*-->/i);
    if (descMatch) {
      metadata.description = descMatch[1].trim();
      content = content.replace(descMatch[0], "");
    }

    // Extract keywords
    const keywordsMatch = htmlContent.match(/<!--\s*keywords:\s*(.+?)\s*-->/i);
    if (keywordsMatch) {
      metadata.keywords = keywordsMatch[1].trim();
      content = content.replace(keywordsMatch[0], "");
    }

    // Remove template comment if present
    const templateMatch = htmlContent.match(/<!--\s*template:\s*(.+?)\s*-->/i);
    if (templateMatch) {
      content = content.replace(templateMatch[0], "");
    }

    // Clean up extra whitespace at the beginning
    content = content.replace(/^\s+/, "");

    return { metadata, content };
  }

  /**
   * Extract specific metadata by comment pattern
   */
  public extractComment(htmlContent: string, key: string): string | undefined {
    const escapedKey = StringHelper.escapeRegex(key);
    const regex = new RegExp(`<!--\\s*${escapedKey}:\\s*(.+?)\\s*-->`, "i");
    const match = htmlContent.match(regex);
    return match ? match[1].trim() : undefined;
  }
}
