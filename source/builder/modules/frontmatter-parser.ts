/**
 * Frontmatter Parsing Module
 * Handles TOML frontmatter extraction and validation from Markdown files.
 */

import { parse as parseToml } from "toml";
import { z } from "zod";

import type { Citation } from "./citation-processor.js";
import type { SeriesInfo } from "../../shared/manifest-types.js";
import type { CitationDisplay } from "./citation-processor.js";
import type { SupplementManifestEntry } from "./blog-manifest.js";
import type { TemplateVariables } from "../template-processor.js";

export type { SeriesInfo } from "../../shared/manifest-types.js";

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
  series?: SeriesInfo;
  citations?: Citation[];
  citationItems?: CitationDisplay[];
  supplements?: SupplementManifestEntry[];
  titleAnchorId?: string;
  isBlogPost?: boolean;
  [key: string]: TemplateVariables[string] | undefined;
}

/**
 * Result of frontmatter parsing
 */
export interface FrontmatterParseResult {
  metadata: FrontmatterData;
  content: string;
}

export type FrontmatterMode = "published" | "draft";

const citationSchema = z
  .object({
    id: z
      .string()
      .regex(
        /^[a-z0-9-]+$/,
        "must contain lowercase letters, numbers, and hyphens only"
      ),
    title: z.string().min(1),
    author: z.string().min(1),
    url: z.url().optional(),
    purchaseUrl: z.url().optional(),
  })
  .strict();

const citationsSchema = z
  .array(citationSchema)
  .superRefine((citations, context) => {
    const seen = new Set<string>();
    for (const [index, citation] of citations.entries()) {
      if (seen.has(citation.id)) {
        context.addIssue({
          code: "custom",
          path: [index, "id"],
          message: `duplicate citation ID "${citation.id}"`,
        });
      }
      seen.add(citation.id);
    }
  });

const seriesSchema = z
  .object({
    name: z.string().min(1),
    part: z.number().int().nonnegative(),
  })
  .strict();

const baseFrontmatterSchema = z
  .object({
    title: z.string().min(1),
    description: z.string(),
    keywords: z.string().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "must use YYYY-MM-DD"),
    tags: z.array(z.string()).optional(),
    published: z.boolean().optional(),
    series: seriesSchema.optional(),
    citations: citationsSchema.optional(),
  })
  .strict();

const draftFrontmatterSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
    date: z.string().optional(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().optional(),
    series: seriesSchema.optional(),
    citations: citationsSchema.optional(),
  })
  .strict();

/**
 * Frontmatter parser class
 */
export class FrontmatterParser {
  private mode: FrontmatterMode;

  constructor(mode: FrontmatterMode = "draft") {
    this.mode = mode;
  }

  /**
   * Parse TOML frontmatter from markdown content.
   * Returns metadata and content without frontmatter
   */
  public parse(
    markdownContent: string,
    sourcePath = "<inline frontmatter>"
  ): FrontmatterParseResult {
    let content = markdownContent;

    // Frontmatter must occupy the leading block and use TOML delimiters.
    const frontmatterMatch = markdownContent.match(
      /^\+\+\+\r?\n([\s\S]*?)\r?\n\+\+\+\r?\n([\s\S]*)$/
    );

    if (!frontmatterMatch) {
      return { metadata: {}, content };
    }

    const frontmatter = frontmatterMatch[1];
    content = frontmatterMatch[2];

    let parsed: unknown;
    try {
      parsed = parseToml(frontmatter);
    } catch (error) {
      throw new Error(
        `Invalid TOML frontmatter in "${sourcePath}": ${this.errorMessage(error)}`
      );
    }

    const schema =
      this.mode === "published"
        ? baseFrontmatterSchema
        : draftFrontmatterSchema;
    const validation = schema.safeParse(parsed);
    if (!validation.success) {
      const details = validation.error.issues
        .map(
          (issue) =>
            `${issue.path.join(".") || "frontmatter"}: ${issue.message}`
        )
        .join("; ");
      throw new Error(`Invalid frontmatter in "${sourcePath}": ${details}`);
    }

    const metadata = validation.data as FrontmatterData;
    if (metadata.date !== undefined) {
      const hasDateShape = /^\d{4}-\d{2}-\d{2}$/.test(metadata.date);
      if (this.mode === "published" || hasDateShape) {
        this.validateCalendarDate(metadata.date, sourcePath);
        metadata.formattedDate = this.formatDate(metadata.date);
      }
    }

    return { metadata, content };
  }

  /**
   * Format a date string for display
   * Parses YYYY-MM-DD format and creates date in local timezone to avoid day-off errors
   */
  private formatDate(dateStr: string): string {
    const [year, month, day] = dateStr.split("-").map(Number);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${monthNames[month - 1]} ${day}, ${year}`;
  }

  private validateCalendarDate(dateStr: string, sourcePath: string): void {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      throw new Error(
        `Invalid frontmatter in "${sourcePath}": date: invalid calendar date`
      );
    }
  }

  private errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}
