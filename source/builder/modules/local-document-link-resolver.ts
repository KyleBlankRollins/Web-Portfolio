/**
 * Local document link resolver
 * Resolves relative Markdown links using discovered content source paths.
 */

import { dirname, relative, resolve, sep } from "node:path";
import type { ContentDocument } from "./content-discovery.js";

export interface LocalDocumentLinkIndexEntry {
  sourcePath: string;
  publicUrl: string;
  kind: ContentDocument["kind"];
  isPublished: boolean;
}

export interface LocalDocumentLinkIndex {
  publishedRootPath: string;
  entriesBySourcePath: Map<string, LocalDocumentLinkIndexEntry[]>;
}

export interface ResolveLocalDocumentLinkInput {
  currentSourcePath: string;
  targetHref: string;
  documentIndex: LocalDocumentLinkIndex;
}

export interface ResolveLocalDocumentLinkResult {
  resolvedHref: string;
  didRewrite: boolean;
}

const EXTERNAL_URL_PATTERN = /^[a-zA-Z][a-zA-Z\d+.-]*:/;

/**
 * Build a source-path index for local Markdown link resolution.
 */
export function createLocalDocumentLinkIndex(
  documents: ContentDocument[],
  publishableDocuments: ContentDocument[],
  publishedRootPath: string
): LocalDocumentLinkIndex {
  const normalizedPublishedRootPath = normalizeAbsolutePath(publishedRootPath);
  const publishedSourcePaths = new Set(
    publishableDocuments.map((document) =>
      normalizeAbsolutePath(document.sourcePath)
    )
  );

  const entriesBySourcePath = new Map<string, LocalDocumentLinkIndexEntry[]>();

  for (const document of documents) {
    const normalizedSourcePath = normalizeAbsolutePath(document.sourcePath);
    const existingEntries = entriesBySourcePath.get(normalizedSourcePath) || [];

    existingEntries.push({
      sourcePath: normalizedSourcePath,
      publicUrl: document.publicUrl,
      kind: document.kind,
      isPublished: publishedSourcePaths.has(normalizedSourcePath),
    });

    entriesBySourcePath.set(normalizedSourcePath, existingEntries);
  }

  return {
    publishedRootPath: normalizedPublishedRootPath,
    entriesBySourcePath,
  };
}

/**
 * Resolve a local Markdown href to its published public URL.
 */
export function resolveLocalDocumentLink({
  currentSourcePath,
  targetHref,
  documentIndex,
}: ResolveLocalDocumentLinkInput): ResolveLocalDocumentLinkResult {
  const { pathPart, suffix } = splitHrefComponents(targetHref);

  if (!shouldResolveMarkdownTarget(pathPart)) {
    return {
      resolvedHref: targetHref,
      didRewrite: false,
    };
  }

  const normalizedCurrentSourcePath = normalizeAbsolutePath(currentSourcePath);
  const normalizedPublishedRootPath = normalizeAbsolutePath(
    documentIndex.publishedRootPath
  );
  const currentDirectory = dirname(normalizedCurrentSourcePath);
  const resolvedTargetSourcePath = normalizeAbsolutePath(
    resolve(currentDirectory, pathPart)
  );

  if (
    !isPathWithinRoot(resolvedTargetSourcePath, normalizedPublishedRootPath)
  ) {
    throw new Error(
      `Invalid local Markdown link in "${toDisplayPath(normalizedCurrentSourcePath)}": target "${targetHref}" resolves to "${toDisplayPath(resolvedTargetSourcePath)}", which escapes published content root "${toDisplayPath(normalizedPublishedRootPath)}".`
    );
  }

  const targetEntries = documentIndex.entriesBySourcePath.get(
    resolvedTargetSourcePath
  );

  if (!targetEntries || targetEntries.length === 0) {
    throw new Error(
      `Invalid local Markdown link in "${toDisplayPath(normalizedCurrentSourcePath)}": target "${targetHref}" resolves to "${toDisplayPath(resolvedTargetSourcePath)}", but no Markdown document was discovered at that source path.`
    );
  }

  if (targetEntries.length > 1) {
    const conflictingTargets = targetEntries
      .map((entry) => entry.publicUrl)
      .sort()
      .join(", ");

    throw new Error(
      `Ambiguous local Markdown link in "${toDisplayPath(normalizedCurrentSourcePath)}": target "${targetHref}" resolves to "${toDisplayPath(resolvedTargetSourcePath)}" with multiple destinations (${conflictingTargets}).`
    );
  }

  const [targetEntry] = targetEntries;
  if (!targetEntry.isPublished) {
    throw new Error(
      `Invalid local Markdown link in "${toDisplayPath(normalizedCurrentSourcePath)}": target "${targetHref}" resolves to unpublished document "${toDisplayPath(resolvedTargetSourcePath)}" (${targetEntry.publicUrl}).`
    );
  }

  return {
    resolvedHref: `${targetEntry.publicUrl}${suffix}`,
    didRewrite: true,
  };
}

function splitHrefComponents(targetHref: string): {
  pathPart: string;
  suffix: string;
} {
  const queryIndex = targetHref.indexOf("?");
  const hashIndex = targetHref.indexOf("#");

  let splitIndex = targetHref.length;
  if (queryIndex >= 0 && queryIndex < splitIndex) {
    splitIndex = queryIndex;
  }

  if (hashIndex >= 0 && hashIndex < splitIndex) {
    splitIndex = hashIndex;
  }

  return {
    pathPart: targetHref.slice(0, splitIndex),
    suffix: targetHref.slice(splitIndex),
  };
}

function shouldResolveMarkdownTarget(pathPart: string): boolean {
  if (!pathPart) {
    return false;
  }

  if (pathPart.startsWith("#")) {
    return false;
  }

  if (pathPart.startsWith("/")) {
    return false;
  }

  if (pathPart.startsWith("//")) {
    return false;
  }

  if (EXTERNAL_URL_PATTERN.test(pathPart)) {
    return false;
  }

  return pathPart.toLowerCase().endsWith(".md");
}

function normalizeAbsolutePath(pathValue: string): string {
  return normalizePath(resolve(pathValue));
}

function normalizePath(pathValue: string): string {
  return pathValue.split(sep).join("/");
}

function isPathWithinRoot(candidatePath: string, rootPath: string): boolean {
  const relativePath = normalizePath(relative(rootPath, candidatePath));

  return (
    relativePath === "" ||
    (relativePath !== ".." && !relativePath.startsWith("../"))
  );
}

function toDisplayPath(pathValue: string): string {
  const relativeToCwd = normalizePath(relative(process.cwd(), pathValue));

  if (
    relativeToCwd !== ".." &&
    !relativeToCwd.startsWith("../") &&
    relativeToCwd.length > 0
  ) {
    return relativeToCwd;
  }

  return pathValue;
}
