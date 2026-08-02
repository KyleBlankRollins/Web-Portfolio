/**
 * Blog Manifest Module
 * Builds and validates blog post manifest data
 */

import { BuildLogger } from "../helpers.js";
import type {
  BlogManifest,
  BlogPostManifestEntry,
} from "../../shared/manifest-types.js";

export type {
  BlogManifest,
  BlogPostManifestEntry,
  SupplementManifestEntry,
  TagWithCount,
} from "../../shared/manifest-types.js";

/**
 * Blog manifest builder class
 */
export class BlogManifestBuilder {
  private posts: BlogPostManifestEntry[] = [];

  /**
   * Add a post to the manifest
   */
  public addPost(entry: BlogPostManifestEntry): void {
    this.posts.push(entry);
  }

  /**
   * Get all posts
   */
  public getPosts(): BlogPostManifestEntry[] {
    return this.posts;
  }

  /**
   * Build final manifest with aggregated data
   */
  public buildManifest(): BlogManifest {
    // Validate series data before building
    this.validateSeries();

    // Sort posts by date (newest first)
    const sortedPosts = [...this.posts].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    // Generate collection of all unique tags with counts
    const tagCounts = new Map<string, number>();
    sortedPosts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    // Convert to array with counts, sorted by count descending, then alphabetically
    const tagsWithCounts = Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => {
        if (b.count !== a.count) {
          return b.count - a.count; // Higher count first
        }
        return a.tag.toLowerCase().localeCompare(b.tag.toLowerCase());
      });

    const sortedTags = tagsWithCounts.map((item) => item.tag);

    BuildLogger.success(
      `Generated blog manifest data (${sortedPosts.length} posts, ${sortedTags.length} tags)`
    );

    return {
      posts: sortedPosts,
      totalPosts: sortedPosts.length,
      availableTags: sortedTags,
      tagsWithCounts,
    };
  }

  /**
   * Validate series data for consistency
   */
  public validateSeries(): void {
    // Group posts by series name
    const seriesMap = new Map<string, BlogPostManifestEntry[]>();

    this.posts.forEach((post) => {
      if (post.series) {
        const existing = seriesMap.get(post.series.name) || [];
        existing.push(post);
        seriesMap.set(post.series.name, existing);
      }
    });

    // Validate each series
    seriesMap.forEach((posts, seriesName) => {
      const parts = posts.map((p) => p.series!.part);
      const sortedParts = [...parts].sort((a, b) => a - b);

      // Check for duplicate part numbers
      const uniqueParts = new Set(parts);
      if (uniqueParts.size !== parts.length) {
        const duplicates = parts.filter(
          (part, index) => parts.indexOf(part) !== index
        );
        BuildLogger.error(
          `Series "${seriesName}" has duplicate part numbers: ${duplicates.join(", ")}`
        );
        throw new Error(
          `Series "${seriesName}" has duplicate part numbers. Each part must be unique.`
        );
      }

      // Check for gaps in part numbers (excluding part 0)
      const nonZeroParts = sortedParts.filter((p) => p !== 0);
      if (nonZeroParts.length > 0) {
        const expectedParts = Array.from(
          { length: nonZeroParts.length },
          (_, i) => i + 1
        );

        const missingParts = expectedParts.filter(
          (expected) => !nonZeroParts.includes(expected)
        );

        if (missingParts.length > 0) {
          BuildLogger.warn(
            `Series "${seriesName}" has gaps in part numbers. Missing parts: ${missingParts.join(", ")}`
          );
        }
      }
    });
  }

  /**
   * Generate manifest as JSON string
   */
  public toJson(): string {
    const manifest = this.buildManifest();
    return JSON.stringify(manifest, null, 2);
  }

  /**
   * Clear all posts
   */
  public clear(): void {
    this.posts = [];
  }
}
