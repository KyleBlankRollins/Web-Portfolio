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
  /** Whether this file has been processed */
  processed: boolean;
}
