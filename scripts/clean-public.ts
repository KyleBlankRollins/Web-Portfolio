#!/usr/bin/env tsx
/**
 * Public Directory Cleanup Script
 *
 * This script cleans up orphaned HTML files in the /public directory.
 * It removes any HTML files that don't match against URL fields in the blog manifest.
 * This ensures that renamed or deleted blog posts don't leave unused HTML files
 * that get carried over to production.
 *
 * Usage: npm run clean:public
 */

import { readFileSync, unlinkSync, readdirSync, statSync } from "fs";
import { join, extname, basename } from "path";

interface BlogPost {
  title: string;
  description: string;
  date: string;
  formattedDate: string;
  tags: string[];
  url: string;
  filename: string;
  keywords?: string;
}

interface BlogManifest {
  posts: BlogPost[];
  tags: Record<string, number>;
  totalPosts: number;
}

/**
 * Colors for console output
 */
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
};

/**
 * Logger with colored output
 */
const logger = {
  info: (message: string) =>
    console.log(`${colors.blue}ℹ${colors.reset} ${message}`),
  success: (message: string) =>
    console.log(`${colors.green}✓${colors.reset} ${message}`),
  warning: (message: string) =>
    console.log(`${colors.yellow}⚠${colors.reset} ${message}`),
  error: (message: string) =>
    console.log(`${colors.red}✗${colors.reset} ${message}`),
  header: (message: string) =>
    console.log(
      `${colors.bold}${colors.cyan}${message}${colors.reset}`
    ),
  dim: (message: string) =>
    console.log(`${colors.dim}${message}${colors.reset}`),
};

/**
 * Load and parse the blog manifest
 */
function loadBlogManifest(): BlogManifest | null {
  const manifestPath = join(
    process.cwd(),
    "public",
    "data",
    "blog-manifest.json"
  );

  try {
    const manifestContent = readFileSync(manifestPath, "utf-8");
    const manifest: BlogManifest = JSON.parse(manifestContent);
    logger.info(
      `Loaded blog manifest with ${manifest.totalPosts} posts`
    );
    return manifest;
  } catch (error) {
    logger.error(
      `Failed to load blog manifest from ${manifestPath}: ${error}`
    );
    return null;
  }
}

/**
 * Get all HTML files in the public directory
 */
function getPublicHtmlFiles(): string[] {
  const publicDir = join(process.cwd(), "public");

  try {
    const files = readdirSync(publicDir);
    const htmlFiles = files.filter((file) => {
      const filePath = join(publicDir, file);
      const stat = statSync(filePath);
      return stat.isFile() && extname(file).toLowerCase() === ".html";
    });

    logger.info(
      `Found ${htmlFiles.length} HTML files in public directory`
    );
    return htmlFiles;
  } catch (error) {
    logger.error(`Failed to read public directory: ${error}`);
    return [];
  }
}

/**
 * Extract expected HTML filenames from blog manifest
 */
function getExpectedHtmlFiles(manifest: BlogManifest): Set<string> {
  const expectedFiles = new Set<string>();

  manifest.posts.forEach((post) => {
    // Extract filename from URL (e.g., "/sample-blog-post.html" -> "sample-blog-post.html")
    const filename = post.url.startsWith("/")
      ? post.url.slice(1)
      : post.url;
    expectedFiles.add(filename);

    // Also add the filename field with .html extension as a fallback
    if (post.filename && !post.filename.endsWith(".html")) {
      expectedFiles.add(`${post.filename}.html`);
    }
  });

  logger.info(
    `Expected ${expectedFiles.size} HTML files from blog manifest`
  );
  logger.dim(
    `Expected files: ${Array.from(expectedFiles).join(", ")}`
  );

  return expectedFiles;
}

/**
 * Identify orphaned HTML files
 */
function identifyOrphanedFiles(
  htmlFiles: string[],
  expectedFiles: Set<string>
): string[] {
  const orphanedFiles = htmlFiles.filter(
    (file) => !expectedFiles.has(file)
  );

  if (orphanedFiles.length > 0) {
    logger.warning(
      `Found ${orphanedFiles.length} orphaned HTML files:`
    );
    orphanedFiles.forEach((file) => logger.dim(`  - ${file}`));
  } else {
    logger.success("No orphaned HTML files found");
  }

  return orphanedFiles;
}

/**
 * Remove orphaned HTML files
 */
function removeOrphanedFiles(orphanedFiles: string[]): number {
  let removedCount = 0;
  const publicDir = join(process.cwd(), "public");

  orphanedFiles.forEach((file) => {
    const filePath = join(publicDir, file);

    try {
      unlinkSync(filePath);
      logger.success(`Removed orphaned file: ${file}`);
      removedCount++;
    } catch (error) {
      logger.error(`Failed to remove ${file}: ${error}`);
    }
  });

  return removedCount;
}

/**
 * Main cleanup function
 */
function cleanupPublicDirectory(): void {
  logger.header("🧹 Public Directory Cleanup");
  logger.info(
    "Starting cleanup of orphaned HTML files in /public directory...\n"
  );

  // Load blog manifest
  const manifest = loadBlogManifest();
  if (!manifest) {
    logger.error("Cannot proceed without blog manifest");
    process.exit(1);
  }

  // Get HTML files in public directory
  const htmlFiles = getPublicHtmlFiles();
  if (htmlFiles.length === 0) {
    logger.info("No HTML files found in public directory");
    return;
  }

  // Get expected HTML files from manifest
  const expectedFiles = getExpectedHtmlFiles(manifest);

  // Identify orphaned files
  const orphanedFiles = identifyOrphanedFiles(
    htmlFiles,
    expectedFiles
  );

  if (orphanedFiles.length === 0) {
    logger.success(
      "\n✨ Public directory is clean - no orphaned files to remove"
    );
    return;
  }

  // Remove orphaned files
  logger.info(`\nRemoving ${orphanedFiles.length} orphaned files...`);
  const removedCount = removeOrphanedFiles(orphanedFiles);

  // Summary
  console.log(); // Empty line
  if (removedCount === orphanedFiles.length) {
    logger.success(
      `✨ Cleanup complete! Removed ${removedCount} orphaned HTML files`
    );
  } else {
    logger.warning(
      `⚠ Partial cleanup: removed ${removedCount} of ${orphanedFiles.length} orphaned files`
    );
  }
}

/**
 * Dry run mode - shows what would be removed without actually removing files
 */
function dryRunCleanup(): void {
  logger.header("🔍 Public Directory Cleanup (Dry Run)");
  logger.info(
    "Analyzing orphaned HTML files in /public directory (no files will be removed)...\n"
  );

  // Load blog manifest
  const manifest = loadBlogManifest();
  if (!manifest) {
    logger.error("Cannot proceed without blog manifest");
    process.exit(1);
  }

  // Get HTML files in public directory
  const htmlFiles = getPublicHtmlFiles();
  if (htmlFiles.length === 0) {
    logger.info("No HTML files found in public directory");
    return;
  }

  // Get expected HTML files from manifest
  const expectedFiles = getExpectedHtmlFiles(manifest);

  // Identify orphaned files
  const orphanedFiles = identifyOrphanedFiles(
    htmlFiles,
    expectedFiles
  );

  // Summary
  console.log(); // Empty line
  if (orphanedFiles.length === 0) {
    logger.success(
      "✨ Public directory is clean - no orphaned files would be removed"
    );
  } else {
    logger.info(
      `📋 Dry run complete: ${orphanedFiles.length} orphaned HTML files would be removed`
    );
    logger.dim(
      "Run without --dry-run flag to actually remove these files"
    );
  }
}

/**
 * Main entry point
 */
function main(): void {
  const args = process.argv.slice(2);
  const isDryRun = args.includes("--dry-run") || args.includes("-d");

  if (isDryRun) {
    dryRunCleanup();
  } else {
    cleanupPublicDirectory();
  }
}

// Run the script
main();
