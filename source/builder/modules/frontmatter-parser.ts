/**
 * Frontmatter Parsing Module
 * Handles YAML frontmatter extraction and parsing from Markdown files
 */

import { BuildLogger } from "../helpers.js";
import { CitationProcessor, type Citation } from "./citation-processor.js";

/**
 * Series information for blog posts
 */
export interface SeriesInfo {
  name: string;
  part: number;
}

/**
 * Parsed frontmatter data structure
 */
export interface FrontmatterData {
  title?: string;
  description?: string;
  keywords?: string;
  date?: string;
  formattedDate?: string;
  tags?: string[];
  published?: boolean;
  publishedRawValue?: string;
  series?: SeriesInfo;
  citations?: Citation[];
  isBlogPost?: boolean;
  [key: string]: any; // Allow additional custom fields
}

/**
 * Result of frontmatter parsing
 */
export interface FrontmatterParseResult {
  metadata: FrontmatterData;
  content: string;
}

/**
 * Frontmatter parser class
 */
export class FrontmatterParser {
  private citationProcessor: CitationProcessor;

  constructor() {
    this.citationProcessor = new CitationProcessor();
  }

  /**
   * Parse YAML frontmatter from markdown content
   * Returns metadata and content without frontmatter
   */
  public parse(markdownContent: string): FrontmatterParseResult {
    const metadata: FrontmatterData = {};
    let content = markdownContent;

    // Check for YAML frontmatter (---\n...\n---\n)
    const frontmatterMatch = markdownContent.match(
      /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/
    );

    if (!frontmatterMatch) {
      return { metadata, content };
    }

    const frontmatter = frontmatterMatch[1];
    content = frontmatterMatch[2];

    // Parse basic fields
    this.parseTitle(frontmatter, metadata);
    this.parseDescription(frontmatter, metadata);
    this.parseKeywords(frontmatter, metadata);
    this.parseDate(frontmatter, metadata);
    this.parseTags(frontmatter, metadata);
    this.parsePublished(frontmatter, metadata);
    this.parseSeries(frontmatter, metadata);
    this.parseCitations(frontmatter, metadata);

    return { metadata, content };
  }

  /**
   * Parse title from frontmatter
   */
  private parseTitle(frontmatter: string, metadata: FrontmatterData): void {
    const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
    if (titleMatch) {
      metadata.title = titleMatch[1].trim().replace(/^["']|["']$/g, "");
    }
  }

  /**
   * Parse description from frontmatter
   */
  private parseDescription(
    frontmatter: string,
    metadata: FrontmatterData
  ): void {
    const descMatch = frontmatter.match(/^description:\s*(.+)$/m);
    if (descMatch) {
      metadata.description = descMatch[1].trim().replace(/^["']|["']$/g, "");
    }
  }

  /**
   * Parse keywords from frontmatter
   */
  private parseKeywords(frontmatter: string, metadata: FrontmatterData): void {
    const keywordsMatch = frontmatter.match(/^keywords:\s*(.+)$/m);
    if (keywordsMatch) {
      metadata.keywords = keywordsMatch[1].trim().replace(/^["']|["']$/g, "");
    }
  }

  /**
   * Parse date from frontmatter
   */
  private parseDate(frontmatter: string, metadata: FrontmatterData): void {
    const dateMatch = frontmatter.match(/^date:\s*(.+)$/m);
    if (dateMatch) {
      const dateStr = dateMatch[1].trim().replace(/^["']|["']$/g, "");
      metadata.date = dateStr;
      metadata.formattedDate = this.formatDate(dateStr);
      metadata.isBlogPost = true;
    }
  }

  /**
   * Parse tags from frontmatter
   * Handles both array format [tag1, tag2] and comma-separated format
   */
  private parseTags(frontmatter: string, metadata: FrontmatterData): void {
    const tagsMatch = frontmatter.match(/^tags:\s*(.+)$/m);
    if (!tagsMatch) return;

    const tagsStr = tagsMatch[1].trim();

    // Handle array format: [tag1, tag2, tag3]
    if (tagsStr.startsWith("[") && tagsStr.endsWith("]")) {
      metadata.tags = tagsStr
        .slice(1, -1)
        .split(",")
        .map((tag) => tag.trim().replace(/^["']|["']$/g, ""))
        .filter((tag) => tag.length > 0);
    } else {
      // Handle comma-separated format: tag1, tag2, tag3
      metadata.tags = tagsStr
        .split(",")
        .map((tag) => tag.trim().replace(/^["']|["']$/g, ""))
        .filter((tag) => tag.length > 0);
    }

    if (metadata.tags.length > 0) {
      metadata.isBlogPost = true;
    }
  }

  /**
   * Parse series metadata from frontmatter
   */
  private parseSeries(frontmatter: string, metadata: FrontmatterData): void {
    const seriesMatch = frontmatter.match(/^series:\s*$/m);
    if (!seriesMatch) return;

    // Multi-line series object format
    const seriesNameMatch = frontmatter.match(/^\s+name:\s*(.+)$/m);
    const seriesPartMatch = frontmatter.match(/^\s+part:\s*(.+)$/m);

    if (!seriesNameMatch || !seriesPartMatch) return;

    const seriesName = seriesNameMatch[1].trim().replace(/^["']|["']$/g, "");
    const partStr = seriesPartMatch[1].trim().replace(/^["']|["']$/g, "");
    const partNum = parseInt(partStr, 10);

    // Validate part number (0 is valid for series intro/summary posts)
    if (isNaN(partNum) || partNum < 0) {
      BuildLogger.error(
        `Invalid series part number "${partStr}" - must be a non-negative integer`
      );
      throw new Error(
        `Invalid series part number: ${partStr}. Part must be a non-negative integer (0 for series intro).`
      );
    }

    metadata.series = {
      name: seriesName,
      part: partNum,
    };
  }

  /**
   * Parse citations from frontmatter
   */
  private parseCitations(frontmatter: string, metadata: FrontmatterData): void {
    const citationsMatch = frontmatter.match(/^citations:\s*$/m);
    if (!citationsMatch) return;

    metadata.citations =
      this.citationProcessor.parseCitationsFromFrontmatter(frontmatter);
  }

  /**
   * Parse published flag from frontmatter
   * Only literal booleans (true/false) are considered valid typed values.
   * Any other value is retained for downstream validation.
   */
  private parsePublished(frontmatter: string, metadata: FrontmatterData): void {
    const publishedMatch = frontmatter.match(/^published:\s*(.+)$/m);
    if (!publishedMatch) return;

    const rawValue = publishedMatch[1].trim();

    if (rawValue === "true") {
      metadata.published = true;
      return;
    }

    if (rawValue === "false") {
      metadata.published = false;
      return;
    }

    metadata.publishedRawValue = rawValue;
  }

  /**
   * Format a date string for display
   * Parses YYYY-MM-DD format and creates date in local timezone to avoid day-off errors
   */
  private formatDate(dateStr: string): string {
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
        return dateStr; // Return original string if date is invalid
      }

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr; // Return original string if formatting fails
    }
  }
}
