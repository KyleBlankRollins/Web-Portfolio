import * as fs from "fs";
import type {
  PostMetadata,
  PostStatus,
} from "../types/post-metadata.js";

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
 * Sections map to statuses:
 * - "Planned" -> planned
 * - "In Progress" / "Researching" / etc -> respective status
 * - "Done" -> published
 * - "Discarded" -> discarded
 */
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
        console.warn(
          `Admin: Backlog file not found at ${this.backlogPath}`
        );
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
    let currentStatus: PostStatus = "planned";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Detect section headers (## Section Name)
      if (line.startsWith("##")) {
        currentSection = line.replace(/^##\s+/, "").trim();
        currentStatus = this.sectionToStatus(currentSection);
        continue;
      }

      // Detect list items (- Post title)
      if (line.startsWith("-")) {
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
   */
  private sectionToStatus(section: string): PostStatus {
    const normalized = section.toLowerCase();

    if (normalized.includes("progress")) return "writing";
    if (normalized.includes("research")) return "researching";
    if (normalized.includes("outline")) return "outlining";
    if (normalized.includes("edit")) return "editing";
    if (
      normalized.includes("done") ||
      normalized.includes("published")
    )
      return "published";
    if (
      normalized.includes("discard") ||
      normalized.includes("abandon")
    )
      return "discarded";

    return "planned"; // Default
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
