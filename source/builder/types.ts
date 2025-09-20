// This map includes every custom HTML element name for KyleBlankRollins.com

export const IncludeNames = {
  HEADER: "kr-header",
  FOOTER: "kr-page-footer",
  HEAD: "kr-page-head",
} as const;

export type IncludeName =
  (typeof IncludeNames)[keyof typeof IncludeNames];

/**
 * Configuration for global includes that should be injected into every HTML file
 */
export interface GlobalIncludeConfig {
  /** The file path to the include fragment */
  filePath: string;
  /** Where in the HTML document to inject this include */
  target: "head" | "body-start" | "body-end";
  /** Optional selector to inject after/before a specific element */
  selector?: string;
}

/**
 * Represents a processed file in the build system
 */
export interface ProcessedFile {
  /** Original file path */
  originalPath: string;
  /** Processed content */
  content: string;
  /** File type */
  type: "html" | "markdown";
  /** Whether this file has been processed for includes */
  includesProcessed: boolean;
}
