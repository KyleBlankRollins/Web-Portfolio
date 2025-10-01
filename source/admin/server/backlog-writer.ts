import * as fs from "fs";
import type { PostStatus } from "../types/post-metadata.js";

/**
 * Backlog Writer
 *
 * Updates backlog.md while preserving formatting and structure.
 * Handles moving posts between sections, updating metadata, and adding new posts.
 */
export class BacklogWriter {
  private backlogPath: string;

  constructor(backlogPath: string) {
    this.backlogPath = backlogPath;
  }

  /**
   * Update a post's status by moving it to the appropriate section
   */
  updatePostStatus(postId: string, newStatus: PostStatus): boolean {
    try {
      const content = fs.readFileSync(this.backlogPath, "utf-8");
      const lines = content.split("\n");

      // Find and remove the post from its current location
      let postTitle: string | null = null;
      const filteredLines: string[] = [];

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("-")) {
          const title = trimmed.replace(/^-\s+/, "").trim();
          const id = this.titleToId(title);

          if (id === postId) {
            postTitle = title;
            continue; // Skip this line (remove post)
          }
        }
        filteredLines.push(line);
      }

      if (!postTitle) {
        console.warn(`Admin: Post ${postId} not found in backlog`);
        return false;
      }

      // Add post to new section
      const newContent = this.addPostToSection(
        filteredLines.join("\n"),
        postTitle,
        newStatus
      );

      fs.writeFileSync(this.backlogPath, newContent, "utf-8");
      console.log(`Admin: Moved post "${postTitle}" to ${newStatus}`);
      return true;
    } catch (error) {
      console.error("Admin: Failed to update post status", error);
      return false;
    }
  }

  /**
   * Add a post to a specific section
   */
  private addPostToSection(
    content: string,
    postTitle: string,
    status: PostStatus
  ): string {
    const lines = content.split("\n");
    const sectionName = this.statusToSectionName(status);
    const sectionHeader = `## ${sectionName}`;

    // Find the target section
    let sectionIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line === sectionHeader) {
        sectionIndex = i;
        break;
      }
    }

    // If section not found, create it
    if (sectionIndex === -1) {
      lines.push("");
      lines.push(sectionHeader);
      lines.push("");
      sectionIndex = lines.length - 2;
    }

    // Find where to insert (after section header, skip blank lines)
    let insertIndex = sectionIndex + 1;
    while (
      insertIndex < lines.length &&
      lines[insertIndex].trim() === ""
    ) {
      insertIndex++;
    }

    // Insert the post
    lines.splice(insertIndex, 0, `- ${postTitle}`);

    return lines.join("\n");
  }

  /**
   * Map status to section name
   */
  private statusToSectionName(status: PostStatus): string {
    switch (status) {
      case "planned":
        return "Planned";
      case "researching":
        return "Researching";
      case "outlining":
        return "Outlining";
      case "writing":
        return "In progress";
      case "editing":
        return "Editing";
      case "published":
        return "Done";
      case "discarded":
        return "Discarded";
      default:
        return "Planned";
    }
  }

  /**
   * Convert post title to ID (must match parser logic)
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
   * Add a new post to backlog
   */
  addPost(title: string, status: PostStatus = "planned"): boolean {
    try {
      const content = fs.readFileSync(this.backlogPath, "utf-8");
      const newContent = this.addPostToSection(
        content,
        title,
        status
      );
      fs.writeFileSync(this.backlogPath, newContent, "utf-8");
      console.log(`Admin: Added new post "${title}" to ${status}`);
      return true;
    } catch (error) {
      console.error("Admin: Failed to add post", error);
      return false;
    }
  }

  /**
   * Remove a post from backlog (used for discarding)
   */
  removePost(postId: string): boolean {
    try {
      const content = fs.readFileSync(this.backlogPath, "utf-8");
      const lines = content.split("\n");

      const filteredLines = lines.filter((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("-")) {
          const title = trimmed.replace(/^-\s+/, "").trim();
          const id = this.titleToId(title);
          return id !== postId;
        }
        return true;
      });

      fs.writeFileSync(
        this.backlogPath,
        filteredLines.join("\n"),
        "utf-8"
      );
      console.log(`Admin: Removed post ${postId}`);
      return true;
    } catch (error) {
      console.error("Admin: Failed to remove post", error);
      return false;
    }
  }
}
