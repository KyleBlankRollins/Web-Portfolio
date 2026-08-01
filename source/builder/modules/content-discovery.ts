/**
 * Content Discovery Module
 * Discovers and validates normalized content documents for publishing.
 */

import { existsSync, readdirSync, readFileSync } from "fs";
import { join, posix, relative, sep } from "path";
import { BuildLogger } from "../helpers.js";
import {
  FrontmatterParser,
  type FrontmatterData,
} from "./frontmatter-parser.js";

export type ContentDocumentKind =
  | "standalone-post"
  | "directory-post"
  | "supplement-candidate";

export interface ContentDocument {
  sourcePath: string;
  outputPath: string;
  publicUrl: string;
  kind: ContentDocumentKind;
  parentUrl?: string;
  metadata: FrontmatterData;
}

export interface ContentDiscoveryResult {
  documents: ContentDocument[];
  publishableDocuments: ContentDocument[];
  supplementCandidates: ContentDocument[];
}

const RESERVED_DIRECTORY_NAMES = new Set(["supplements", "media"]);

/**
 * Discovers publishable content documents from source/site/content/published.
 */
export class ContentDiscovery {
  private publishedRoot: string;
  private frontmatterParser: FrontmatterParser;

  constructor(
    publishedRoot: string = join(
      process.cwd(),
      "source",
      "site",
      "content",
      "published"
    )
  ) {
    this.publishedRoot = publishedRoot;
    this.frontmatterParser = new FrontmatterParser();
  }

  /**
   * Discover and validate content documents under the published root.
   */
  public discover(): ContentDiscoveryResult {
    if (!existsSync(this.publishedRoot)) {
      BuildLogger.warn(
        `Published content root does not exist: ${this.publishedRoot}`
      );

      return {
        documents: [],
        publishableDocuments: [],
        supplementCandidates: [],
      };
    }

    const documents: ContentDocument[] = [];

    const topLevelEntries = readdirSync(this.publishedRoot, {
      withFileTypes: true,
    });

    for (const entry of topLevelEntries) {
      if (entry.isFile() && entry.name.endsWith(".md")) {
        const sourcePath = join(this.publishedRoot, entry.name);
        const slug = entry.name.replace(/\.md$/, "");

        documents.push(
          this.createDocument(sourcePath, `${slug}.html`, "standalone-post")
        );
        continue;
      }

      if (entry.isDirectory()) {
        if (RESERVED_DIRECTORY_NAMES.has(entry.name)) {
          BuildLogger.warn(
            `Skipping reserved top-level directory in published root: ${entry.name}`
          );
          continue;
        }

        const directoryPath = join(this.publishedRoot, entry.name);
        const directoryDocuments = this.discoverPostDirectory(
          directoryPath,
          entry.name
        );
        documents.push(...directoryDocuments);
      }
    }

    this.assertUniquePublicUrls(documents);

    const publishableDocuments = documents.filter(
      (document) =>
        document.kind === "standalone-post" ||
        document.kind === "directory-post"
    );
    const supplementCandidates = documents.filter(
      (document) => document.kind === "supplement-candidate"
    );

    return {
      documents,
      publishableDocuments,
      supplementCandidates,
    };
  }

  private discoverPostDirectory(
    directoryPath: string,
    directoryName: string
  ): ContentDocument[] {
    const documents: ContentDocument[] = [];
    const directEntries = readdirSync(directoryPath, {
      withFileTypes: true,
    });

    const directMarkdownFiles = directEntries.filter(
      (entry) => entry.isFile() && entry.name.endsWith(".md")
    );

    if (directMarkdownFiles.length === 0) {
      throw new Error(
        `Invalid post directory "${directoryPath}": missing parent Markdown file. Add "${directoryName}.md".`
      );
    }

    if (directMarkdownFiles.length > 1) {
      const fileList = directMarkdownFiles
        .map((file) => file.name)
        .sort()
        .join(", ");
      throw new Error(
        `Invalid post directory "${directoryPath}": multiple parent candidates found (${fileList}). Keep exactly one parent file named "${directoryName}.md".`
      );
    }

    const parentMarkdownFile = directMarkdownFiles[0];
    if (parentMarkdownFile.name !== `${directoryName}.md`) {
      throw new Error(
        `Invalid post directory "${directoryPath}": parent file name mismatch. Expected "${directoryName}.md", found "${parentMarkdownFile.name}".`
      );
    }

    const parentSourcePath = join(directoryPath, parentMarkdownFile.name);
    const parentDocument = this.createDocument(
      parentSourcePath,
      `${directoryName}.html`,
      "directory-post"
    );
    documents.push(parentDocument);

    for (const entry of directEntries) {
      if (!entry.isDirectory()) {
        continue;
      }

      if (!RESERVED_DIRECTORY_NAMES.has(entry.name)) {
        continue;
      }

      if (entry.name !== "supplements") {
        continue;
      }

      const supplementRoot = join(directoryPath, entry.name);
      const supplementMarkdownFiles = this.collectMarkdownFiles(supplementRoot);

      for (const supplementPath of supplementMarkdownFiles) {
        const relativeFromParent = this.toForwardSlashPath(
          relative(directoryPath, supplementPath)
        );
        const outputPath = this.toForwardSlashPath(
          posix.join(
            directoryName,
            "supplements",
            relativeFromParent
              .replace(/^supplements\//, "")
              .replace(/\.md$/, ".html")
          )
        );

        documents.push(
          this.createDocument(
            supplementPath,
            outputPath,
            "supplement-candidate",
            parentDocument.publicUrl
          )
        );
      }
    }

    return documents;
  }

  private collectMarkdownFiles(directoryPath: string): string[] {
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

      const entries = readdirSync(currentDirectory, {
        withFileTypes: true,
      });

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

  private createDocument(
    sourcePath: string,
    outputPath: string,
    kind: ContentDocumentKind,
    parentUrl?: string
  ): ContentDocument {
    const normalizedOutputPath = this.normalizeOutputPath(outputPath);
    const markdownContent = readFileSync(sourcePath, "utf-8");
    const { metadata } = this.frontmatterParser.parse(markdownContent);

    return {
      sourcePath,
      outputPath: normalizedOutputPath,
      publicUrl: `/${normalizedOutputPath}`,
      kind,
      parentUrl,
      metadata,
    };
  }

  private normalizeOutputPath(outputPath: string): string {
    const forwardSlashPath = this.toForwardSlashPath(outputPath);
    const normalizedPath = posix.normalize(forwardSlashPath);

    if (
      normalizedPath === "." ||
      normalizedPath === ".." ||
      normalizedPath.startsWith("../") ||
      normalizedPath.includes("/../") ||
      posix.isAbsolute(normalizedPath)
    ) {
      throw new Error(
        `Unsafe output path "${outputPath}" resolves outside output directory.`
      );
    }

    if (!normalizedPath.endsWith(".html")) {
      throw new Error(
        `Invalid output path "${outputPath}": expected an .html output.`
      );
    }

    return normalizedPath;
  }

  private assertUniquePublicUrls(documents: ContentDocument[]): void {
    const seenByPublicUrl = new Map<string, ContentDocument>();

    for (const document of documents) {
      const existing = seenByPublicUrl.get(document.publicUrl);
      if (existing) {
        throw new Error(
          `Duplicate public output URL "${document.publicUrl}" generated from "${existing.sourcePath}" and "${document.sourcePath}". Rename one source file or directory so each published document has a unique URL.`
        );
      }

      seenByPublicUrl.set(document.publicUrl, document);
    }
  }

  private toForwardSlashPath(pathValue: string): string {
    return pathValue.split(sep).join("/");
  }
}

export function normalizePathForComparison(pathValue: string): string {
  return pathValue.split(sep).join("/");
}
