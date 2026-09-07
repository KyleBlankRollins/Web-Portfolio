/**
 * Content Discovery Module
 * Discovers and validates normalized content documents for publishing.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join, posix, relative } from "node:path";
import { BuildLogger } from "../helpers.js";
import {
  FrontmatterParser,
  type FrontmatterData,
} from "./frontmatter-parser.js";
import type { SupplementManifestEntry } from "./blog-manifest.js";
import {
  RESERVED_DIRECTORY_NAMES,
  collectMarkdownFiles,
  directMarkdownFileNames,
  resolveDirectoryParent,
  toForwardSlashPath,
} from "./content-structure.js";

export type ContentDocumentKind =
  "standalone-post" | "directory-post" | "supplement-candidate";

export interface ContentDocument {
  sourcePath: string;
  outputPath: string;
  publicUrl: string;
  kind: ContentDocumentKind;
  parentUrl?: string;
  metadata: FrontmatterData;
}

export interface ContentDiscoveryResult {
  publishedRootPath: string;
  documents: ContentDocument[];
  publishableDocuments: ContentDocument[];
  supplementCandidates: ContentDocument[];
  publishedSupplements: ContentDocument[];
}

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
    this.frontmatterParser = new FrontmatterParser("published");
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
        publishedRootPath: this.publishedRoot,
        documents: [],
        publishableDocuments: [],
        supplementCandidates: [],
        publishedSupplements: [],
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

    const supplementCandidates = documents.filter(
      (document) => document.kind === "supplement-candidate"
    );

    for (const supplement of supplementCandidates) {
      this.validateSupplementPublicationMetadata(supplement);
    }

    const documentsByPublicUrl = new Map<string, ContentDocument>(
      documents.map((document) => [document.publicUrl, document])
    );

    const publishableParentDocuments = documents.filter(
      (document) =>
        (document.kind === "standalone-post" ||
          document.kind === "directory-post") &&
        document.metadata.published !== false
    );

    const publishedSupplements = supplementCandidates.filter((supplement) => {
      if (supplement.metadata.published !== true) {
        return false;
      }

      if (!supplement.parentUrl) {
        throw new Error(
          `Supplement "${supplement.sourcePath}" is missing a parent relationship.`
        );
      }

      const parentDocument = documentsByPublicUrl.get(supplement.parentUrl);
      if (!parentDocument) {
        throw new Error(
          `Supplement "${supplement.sourcePath}" references parent URL "${supplement.parentUrl}" but no parent document was discovered.`
        );
      }

      if (parentDocument.metadata.published === false) {
        throw new Error(
          `Supplement "${supplement.sourcePath}" is published, but parent "${parentDocument.sourcePath}" is unpublished (published: false).`
        );
      }

      return true;
    });

    this.attachSupplementsToParents(
      publishableParentDocuments,
      publishedSupplements
    );

    const publishableDocuments = documents.filter(
      (document) =>
        ((document.kind === "standalone-post" ||
          document.kind === "directory-post") &&
          document.metadata.published !== false) ||
        publishedSupplements.includes(document)
    );

    return {
      publishedRootPath: this.publishedRoot,
      documents,
      publishableDocuments,
      supplementCandidates,
      publishedSupplements,
    };
  }

  private validateSupplementPublicationMetadata(
    supplement: ContentDocument
  ): void {
    if (supplement.metadata.published === undefined) {
      throw new Error(
        `Invalid supplement frontmatter in "${supplement.sourcePath}": missing required boolean field "published".`
      );
    }

    if (typeof supplement.metadata.published !== "boolean") {
      throw new Error(
        `Invalid supplement frontmatter in "${supplement.sourcePath}": published must be a boolean true or false.`
      );
    }
  }

  private attachSupplementsToParents(
    parentDocuments: ContentDocument[],
    publishedSupplements: ContentDocument[]
  ): void {
    const parentSupplementMap = new Map<string, SupplementManifestEntry[]>();

    for (const supplement of publishedSupplements) {
      if (!supplement.parentUrl) {
        continue;
      }

      const existing = parentSupplementMap.get(supplement.parentUrl) || [];

      const rawTitle =
        supplement.metadata.title || basename(supplement.outputPath, ".html");
      const rawDescription = supplement.metadata.description || "";

      existing.push({
        title: this.sanitizeSupplementMetadataText(rawTitle),
        description: this.sanitizeSupplementMetadataText(rawDescription),
        url: supplement.publicUrl,
        filename: supplement.outputPath,
      });

      parentSupplementMap.set(supplement.parentUrl, existing);
    }

    for (const parentDocument of parentDocuments) {
      const parentSupplements = parentSupplementMap.get(
        parentDocument.publicUrl
      );

      if (!parentSupplements || parentSupplements.length === 0) {
        delete parentDocument.metadata.supplements;
        continue;
      }

      parentDocument.metadata.supplements = [...parentSupplements].sort(
        (a, b) => a.filename.localeCompare(b.filename)
      );
    }
  }

  private sanitizeSupplementMetadataText(value: string): string {
    return value.replace(/<[^>]*>/g, "").trim();
  }

  private discoverPostDirectory(
    directoryPath: string,
    directoryName: string
  ): ContentDocument[] {
    const documents: ContentDocument[] = [];
    const directEntries = readdirSync(directoryPath, {
      withFileTypes: true,
    });

    const parentResult = resolveDirectoryParent(
      directMarkdownFileNames(directEntries),
      directoryName
    );

    if (!parentResult.ok) {
      if (parentResult.reason === "missing") {
        throw new Error(
          `Invalid post directory "${directoryPath}": missing parent Markdown file. Add "${directoryName}.md".`
        );
      }

      if (parentResult.reason === "multiple") {
        throw new Error(
          `Invalid post directory "${directoryPath}": multiple parent candidates found (${parentResult.candidates.join(", ")}). Keep exactly one parent file named "${directoryName}.md".`
        );
      }

      throw new Error(
        `Invalid post directory "${directoryPath}": parent file name mismatch. Expected "${directoryName}.md", found "${parentResult.foundName}".`
      );
    }

    const parentSourcePath = join(directoryPath, parentResult.parentFileName);
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
      const supplementMarkdownFiles = collectMarkdownFiles(supplementRoot);

      for (const supplementPath of supplementMarkdownFiles) {
        const relativeFromParent = toForwardSlashPath(
          relative(directoryPath, supplementPath)
        );
        const outputPath = toForwardSlashPath(
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

  private createDocument(
    sourcePath: string,
    outputPath: string,
    kind: ContentDocumentKind,
    parentUrl?: string
  ): ContentDocument {
    const normalizedOutputPath = this.normalizeOutputPath(outputPath);
    const markdownContent = readFileSync(sourcePath, "utf-8");
    const { metadata } = this.frontmatterParser.parse(markdownContent, sourcePath);

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
    const forwardSlashPath = toForwardSlashPath(outputPath);
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
}

export function normalizePathForComparison(pathValue: string): string {
  return toForwardSlashPath(pathValue);
}
