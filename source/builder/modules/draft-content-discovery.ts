/**
 * Draft Content Discovery Module
 *
 * Authoring-time validation for draft posts under
 * `source/site/content/__drafts/`. Drafts are never rendered, routed, or
 * published: this utility only classifies source files and validates the
 * optional directory layout so authors can organize multi-document drafts.
 *
 * It intentionally shares path-only structural helpers with published
 * discovery but does not reuse the publication result type, output paths, or
 * public URLs, and it must not join the production build path.
 */

import { existsSync } from "node:fs";
import { join, relative } from "node:path";
import { BuildLogger } from "../helpers.js";
import {
  RESERVED_DIRECTORY_NAMES,
  collectMarkdownFiles,
  directMarkdownFileNames,
  listDirectoryEntries,
  resolveDirectoryParent,
  toForwardSlashPath,
} from "./content-structure.js";

/**
 * Filename at the draft root reserved for the admin work-tracking board. It is
 * not a draft document and must never be classified as one.
 */
const BACKLOG_FILENAME = "backlog.md";

export type DraftDocumentKind =
  "standalone-draft" | "directory-draft" | "supporting-draft";

export interface DraftDocument {
  sourcePath: string;
  kind: DraftDocumentKind;
  /**
   * Source path of the draft parent for supporting drafts. Deliberately no
   * output path or public URL: drafts are not publishable in this phase.
   */
  parentSourcePath?: string;
}

export interface DraftDiscoveryResult {
  draftRootPath: string;
  documents: DraftDocument[];
}

/**
 * Discovers and validates draft documents under
 * `source/site/content/__drafts/`.
 */
export class DraftContentDiscovery {
  private draftRoot: string;

  constructor(
    draftRoot: string = join(
      process.cwd(),
      "source",
      "site",
      "content",
      "__drafts"
    )
  ) {
    this.draftRoot = draftRoot;
  }

  /**
   * Discover and validate draft documents under the draft root. Returns an
   * empty result, rather than throwing, when the draft root does not exist.
   */
  public discover(): DraftDiscoveryResult {
    if (!existsSync(this.draftRoot)) {
      return { draftRootPath: this.draftRoot, documents: [] };
    }

    const documents: DraftDocument[] = [];
    const topLevelEntries = listDirectoryEntries(this.draftRoot);

    for (const entry of topLevelEntries) {
      if (entry.isFile() && entry.name.endsWith(".md")) {
        if (entry.name === BACKLOG_FILENAME) {
          continue;
        }

        documents.push({
          sourcePath: join(this.draftRoot, entry.name),
          kind: "standalone-draft",
        });
        continue;
      }

      if (entry.isDirectory()) {
        if (RESERVED_DIRECTORY_NAMES.has(entry.name)) {
          BuildLogger.warn(
            `Skipping reserved top-level directory in draft root: ${entry.name}`
          );
          continue;
        }

        const directoryPath = join(this.draftRoot, entry.name);
        documents.push(
          ...this.discoverDraftDirectory(directoryPath, entry.name)
        );
      }
    }

    return { draftRootPath: this.draftRoot, documents };
  }

  private discoverDraftDirectory(
    directoryPath: string,
    directoryName: string
  ): DraftDocument[] {
    const documents: DraftDocument[] = [];
    const directEntries = listDirectoryEntries(directoryPath);

    const parentResult = resolveDirectoryParent(
      directMarkdownFileNames(directEntries),
      directoryName
    );

    if (!parentResult.ok) {
      if (parentResult.reason === "missing") {
        throw new Error(
          `Invalid draft directory "${directoryPath}": missing parent Markdown file. Add "${directoryName}.md".`
        );
      }

      if (parentResult.reason === "multiple") {
        throw new Error(
          `Invalid draft directory "${directoryPath}": multiple parent candidates found (${parentResult.candidates.join(", ")}). Keep exactly one parent file named "${directoryName}.md".`
        );
      }

      throw new Error(
        `Invalid draft directory "${directoryPath}": parent file name mismatch. Expected "${directoryName}.md", found "${parentResult.foundName}".`
      );
    }

    const parentSourcePath = join(directoryPath, parentResult.parentFileName);
    documents.push({ sourcePath: parentSourcePath, kind: "directory-draft" });

    for (const entry of directEntries) {
      if (!entry.isDirectory()) {
        continue;
      }

      if (entry.name === "supplements") {
        const supplementRoot = join(directoryPath, entry.name);
        for (const supplementPath of collectMarkdownFiles(supplementRoot)) {
          documents.push({
            sourcePath: supplementPath,
            kind: "supporting-draft",
            parentSourcePath,
          });
        }
        continue;
      }

      if (entry.name === "media") {
        // `media/` remains opaque to this feature.
        continue;
      }

      BuildLogger.warn(
        `Unknown subdirectory "${toForwardSlashPath(
          relative(this.draftRoot, join(directoryPath, entry.name))
        )}" in draft directory "${directoryName}" was not traversed. Move draft Markdown under "supplements/".`
      );
    }

    return documents;
  }
}

/**
 * Format a concise, author-facing summary of a draft discovery result.
 */
export function summarizeDraftDiscovery(result: DraftDiscoveryResult): string {
  const counts: Record<DraftDocumentKind, number> = {
    "standalone-draft": 0,
    "directory-draft": 0,
    "supporting-draft": 0,
  };

  for (const document of result.documents) {
    counts[document.kind] += 1;
  }

  const parents = counts["standalone-draft"] + counts["directory-draft"];

  return (
    `${result.documents.length} draft document(s): ` +
    `${parents} parent(s) ` +
    `(${counts["standalone-draft"]} standalone, ` +
    `${counts["directory-draft"]} directory), ` +
    `${counts["supporting-draft"]} supporting.`
  );
}
