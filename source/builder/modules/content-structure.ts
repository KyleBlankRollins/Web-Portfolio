/**
 * Content Structure Module
 *
 * Path-only structural helpers shared by content discovery over both the
 * published root and the draft root. These helpers deliberately know nothing
 * about output paths, public URLs, frontmatter, or publication status; that
 * behavior stays in the discovery utility for each root.
 */

import { existsSync, readdirSync, type Dirent } from "node:fs";
import { join, sep } from "node:path";

/**
 * Directory names that are never treated as parent-document candidates.
 * `supplements` holds supporting material; `media` remains opaque.
 */
export const RESERVED_DIRECTORY_NAMES = new Set(["supplements", "media"]);

/**
 * Convert a platform path to a forward-slash path for stable diagnostics and
 * output paths across platforms.
 */
export function toForwardSlashPath(pathValue: string): string {
  return pathValue.split(sep).join("/");
}

/**
 * List the direct entries of a directory with file-type information.
 */
export function listDirectoryEntries(directoryPath: string): Dirent[] {
  return readdirSync(directoryPath, { withFileTypes: true });
}

/**
 * Direct Markdown files (non-recursive) contained in a directory.
 */
export function directMarkdownFileNames(entries: Dirent[]): string[] {
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name);
}

/**
 * Recursively collect Markdown file paths beneath a directory, sorted for
 * deterministic ordering. Returns an empty list when the directory is absent.
 */
export function collectMarkdownFiles(directoryPath: string): string[] {
  if (!existsSync(directoryPath)) {
    return [];
  }

  const markdownFiles: string[] = [];
  const stack: string[] = [directoryPath];

  while (stack.length > 0) {
    const currentDirectory = stack.pop();
    if (!currentDirectory) {
      continue;
    }

    const entries = readdirSync(currentDirectory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentDirectory, entry.name);

      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }

      if (entry.isFile() && entry.name.endsWith(".md")) {
        markdownFiles.push(fullPath);
      }
    }
  }

  return markdownFiles.sort();
}

/**
 * Outcome of validating a directory's single parent Markdown file against the
 * required "parent filename matches directory name" convention.
 */
export type DirectoryParentResult =
  | { ok: true; parentFileName: string }
  | { ok: false; reason: "missing" }
  | { ok: false; reason: "multiple"; candidates: string[] }
  | { ok: false; reason: "mismatch"; foundName: string };

/**
 * Validate that a directory contains exactly one direct Markdown file named
 * after the directory. Returns a structured result so each caller can format a
 * root-appropriate error message rather than sharing error prose.
 */
export function resolveDirectoryParent(
  directMarkdownNames: string[],
  directoryName: string
): DirectoryParentResult {
  if (directMarkdownNames.length === 0) {
    return { ok: false, reason: "missing" };
  }

  if (directMarkdownNames.length > 1) {
    return {
      ok: false,
      reason: "multiple",
      candidates: [...directMarkdownNames].sort(),
    };
  }

  const parentFileName = directMarkdownNames[0];
  if (parentFileName !== `${directoryName}.md`) {
    return { ok: false, reason: "mismatch", foundName: parentFileName };
  }

  return { ok: true, parentFileName };
}
