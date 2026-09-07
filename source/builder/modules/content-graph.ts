import type {
  ContentDocument,
  ContentDiscoveryResult,
} from "./content-discovery.js";
import type { SeriesInfo } from "./frontmatter-parser.js";

export interface ContentGraphPost {
  document: ContentDocument;
  supplements: ContentDocument[];
}

export interface ContentGraph {
  posts: ContentGraphPost[];
  renderDocuments: ContentDocument[];
  supplements: ContentDocument[];
  tags: Map<string, number>;
  series: Map<string, ContentGraphPost[]>;
  byPublicUrl: Map<string, ContentDocument>;
}

/**
 * Builds the typed, deterministic relationship view used by renderers.
 */
export function buildContentGraph(
  discovery: ContentDiscoveryResult
): ContentGraph {
  const byPublicUrl = new Map<string, ContentDocument>();
  for (const document of discovery.documents) {
    if (byPublicUrl.has(document.publicUrl)) {
      throw new Error(`Duplicate content graph URL: ${document.publicUrl}`);
    }
    byPublicUrl.set(document.publicUrl, document);
  }

  const supplementsByParent = new Map<string, ContentDocument[]>();
  for (const supplement of discovery.publishedSupplements) {
    if (!supplement.parentUrl) {
      throw new Error(
        `Published supplement "${supplement.sourcePath}" is missing a parent URL.`
      );
    }
    if (!byPublicUrl.has(supplement.parentUrl)) {
      throw new Error(
        `Published supplement "${supplement.sourcePath}" references missing parent "${supplement.parentUrl}".`
      );
    }
    const siblings = supplementsByParent.get(supplement.parentUrl) ?? [];
    siblings.push(supplement);
    supplementsByParent.set(supplement.parentUrl, siblings);
  }

  const parentDocuments = discovery.publishableDocuments.filter(
    (document) => document.kind !== "supplement-candidate"
  );
  for (const document of discovery.publishableDocuments) {
    document.metadata.isBlogPost = true;
  }
  const posts = parentDocuments
    .map((document) => ({
      document,
      supplements: (supplementsByParent.get(document.publicUrl) ?? []).sort(
        (left, right) => left.publicUrl.localeCompare(right.publicUrl)
      ),
    }))
    .sort(comparePosts);

  const tags = new Map<string, number>();
  const series = new Map<string, ContentGraphPost[]>();
  for (const post of posts) {
    for (const tag of post.document.metadata.tags ?? []) {
      tags.set(tag, (tags.get(tag) ?? 0) + 1);
    }

    const seriesInfo = post.document.metadata.series as SeriesInfo | undefined;
    if (seriesInfo) {
      const seriesPosts = series.get(seriesInfo.name) ?? [];
      if (seriesPosts.some((candidate) => candidate.document.metadata.series?.part === seriesInfo.part)) {
        throw new Error(
          `Series "${seriesInfo.name}" has duplicate part ${seriesInfo.part}.`
        );
      }
      seriesPosts.push(post);
      series.set(seriesInfo.name, seriesPosts);
    }
  }

  return {
    posts,
    renderDocuments: posts.flatMap(({ document, supplements }) => [
      document,
      ...supplements,
    ]),
    supplements: [...discovery.publishedSupplements].sort((left, right) =>
      left.publicUrl.localeCompare(right.publicUrl)
    ),
    tags,
    series,
    byPublicUrl,
  };
}

function comparePosts(left: ContentGraphPost, right: ContentGraphPost): number {
  const leftDate = left.document.metadata.date ?? "";
  const rightDate = right.document.metadata.date ?? "";
  if (leftDate !== rightDate) {
    return rightDate.localeCompare(leftDate);
  }
  return left.document.publicUrl.localeCompare(right.document.publicUrl);
}
