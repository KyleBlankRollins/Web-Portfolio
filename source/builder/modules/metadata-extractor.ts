/**
 * Metadata Extractor Module
 * Extracts metadata from HTML comments in processed files
 */

import { StringHelper } from "../helpers.js";
import { unescapeHtmlComment } from "./html-utils.js";
import type { SeriesInfo } from "./frontmatter-parser.js";

/**
 * Extracted metadata structure
 */
export interface ExtractedMetadata {
  title?: string;
  description?: string;
  keywords?: string;
  date?: string;
  formattedDate?: string;
  tags?: string[];
  isBlogPost?: boolean;
  series?: SeriesInfo;
  citationsHtml?: string;
  supplementsHtml?: string;
  [key: string]: string | string[] | boolean | SeriesInfo | undefined;
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

    // Extract date
    const dateMatch = htmlContent.match(/<!--\s*date:\s*(.+?)\s*-->/i);
    if (dateMatch) {
      metadata.date = dateMatch[1].trim();
      content = content.replace(dateMatch[0], "");
    }

    // Extract formatted date
    const formattedDateMatch = htmlContent.match(
      /<!--\s*formattedDate:\s*(.+?)\s*-->/i
    );
    if (formattedDateMatch) {
      metadata.formattedDate = formattedDateMatch[1].trim();
      content = content.replace(formattedDateMatch[0], "");
    }

    // Extract tags
    const tagsMatch = htmlContent.match(/<!--\s*tags:\s*(.+?)\s*-->/i);
    if (tagsMatch) {
      metadata.tags = tagsMatch[1]
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      content = content.replace(tagsMatch[0], "");
    }

    // Extract isBlogPost flag
    const isBlogPostMatch = htmlContent.match(
      /<!--\s*isBlogPost:\s*true\s*-->/i
    );
    if (isBlogPostMatch) {
      metadata.isBlogPost = true;
      content = content.replace(isBlogPostMatch[0], "");
    }

    // Extract series metadata
    const seriesNameMatch = htmlContent.match(
      /<!--\s*series\.name:\s*(.+?)\s*-->/i
    );
    const seriesPartMatch = htmlContent.match(
      /<!--\s*series\.part:\s*(.+?)\s*-->/i
    );
    if (seriesNameMatch && seriesPartMatch) {
      const partNum = parseInt(seriesPartMatch[1].trim(), 10);
      metadata.series = {
        name: seriesNameMatch[1].trim(),
        part: partNum,
      };
      content = content.replace(seriesNameMatch[0], "");
      content = content.replace(seriesPartMatch[0], "");
    }

    // Extract citations HTML
    const citationsHtmlMatch = htmlContent.match(
      /<!--\s*citationsHtml:\s*([\s\S]*?)\s*-->/i
    );
    if (citationsHtmlMatch) {
      metadata.citationsHtml = unescapeHtmlComment(
        citationsHtmlMatch[1].trim()
      );
      content = content.replace(citationsHtmlMatch[0], "");
    }

    // Extract supplements HTML
    const supplementsHtmlMatch = htmlContent.match(
      /<!--\s*supplementsHtml:\s*([\s\S]*?)\s*-->/i
    );
    if (supplementsHtmlMatch) {
      metadata.supplementsHtml = unescapeHtmlComment(
        supplementsHtmlMatch[1].trim()
      );
      content = content.replace(supplementsHtmlMatch[0], "");
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

  /**
   * Format a date string for display
   * Parses YYYY-MM-DD format and creates date in local timezone to avoid day-off errors
   */
  public formatDate(dateStr: string): string {
    try {
      // Parse YYYY-MM-DD format to avoid timezone issues
      const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (match) {
        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1; // Month is 0-indexed
        const day = parseInt(match[3], 10);
        const date = new Date(year, month, day);

        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }

      // Fallback for other date formats
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return dateStr; // Return original if invalid
      }

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr; // Return original if formatting fails
    }
  }
}
