import * as fs from "fs";
import type { PostMetadata, PostStatus } from "../types/post-metadata.js";

/**
 * Backlog Parser
 *
 * Parses backlog.md into structured PostMetadata objects.
 * The backlog file uses markdown sections to organize posts by status.
 *
 * Format:
 * ## Section Name
 * - Post title
 * - Another post title
 *
 * Valid section headings and their corresponding statuses are defined in VALID_SECTIONS.
 */

/**
 * Valid section headings in backlog.md and their corresponding PostStatus values
 */
const VALID_SECTIONS: Record<string, PostStatus> = {
  Planned: "planned",
  Researching: "researching",
  Outlining: "outlining",
  Writing: "writing",
  Editing: "editing",
  Published: "published",
  Discarded: "discarded",
};

export class BacklogParser {
  private backlogPath: string;

  constructor(backlogPath: string) {
    this.backlogPath = backlogPath;
  }

  /**
   * Check if backlog file exists
   */
  exists(): boolean {
    return fs.existsSync(this.backlogPath);
  }

  /**
   * Parse backlog.md into structured post metadata
   */
  parse(): PostMetadata[] {
    try {
      if (!this.exists()) {
        console.warn(`Admin: Backlog file not found at ${this.backlogPath}`);
        return [];
      }

      const content = fs.readFileSync(this.backlogPath, "utf-8");
      return this.parseContent(content);
    } catch (error) {
      console.error("Admin: Failed to parse backlog.md", error);
      return [];
    }
  }

  /**
   * Parse markdown content into posts
   */
  private parseContent(content: string): PostMetadata[] {
    const posts: PostMetadata[] = [];
    const lines = content.split("\n");

    let currentSection = "";
    let currentStatus: PostStatus | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Detect section headers (## Section Name)
      if (line.startsWith("##")) {
        currentSection = line.replace(/^##\s+/, "").trim();
        currentStatus = this.sectionToStatus(currentSection);
        continue;
      }

      // Detect list items (- Post title)
      // Only parse list items if we're inside a valid section
      if (line.startsWith("-") && currentStatus !== null) {
        const title = line.replace(/^-\s+/, "").trim();
        if (title) {
          const post: PostMetadata = {
            id: this.titleToId(title),
            title,
            status: currentStatus,
            created: new Date().toISOString().split("T")[0], // Default to today
          };
          posts.push(post);
        }
      }
    }

    return posts;
  }

  /**
   * Map section name to post status
   * Validates against allowed section headings and logs warnings for unexpected sections
   * Returns null for invalid sections to signal they should be skipped
   */
  private sectionToStatus(section: string): PostStatus | null {
    // Check if section exactly matches a valid section heading
    if (section in VALID_SECTIONS) {
      return VALID_SECTIONS[section];
    }

    // Section is not valid - log a warning
    console.warn(
      `Admin: Unexpected section heading "${section}" in backlog.md. ` +
        `Valid sections are: ${Object.keys(VALID_SECTIONS).join(", ")}. ` +
        `Posts under this section will be ignored.`
    );

    return null; // Return null to signal invalid section
  }

  /**
   * Convert post title to a slug-based ID
   */
  private titleToId(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  /**
   * Get the raw content of backlog.md
   */
  getContent(): string {
    try {
      if (!this.exists()) {
        return "";
      }
      return fs.readFileSync(this.backlogPath, "utf-8");
    } catch (error) {
      console.error("Admin: Failed to read backlog.md", error);
      return "";
    }
  }

  /**
   * Get file stats for change detection
   */
  getStats(): fs.Stats | null {
    try {
      if (!this.exists()) {
        return null;
      }
      return fs.statSync(this.backlogPath);
    } catch (error) {
      console.error("Admin: Failed to stat backlog.md", error);
      return null;
    }
  }
}
