# Blog post supplementary files

## Status

Proposed project plan and implementation specification.

## Problem

The current builder recursively publishes Markdown files under
`source/site/content/`, except for files below `__drafts/`. Every generated
document is flattened to a root-level filename. That model works for standalone
posts, but it cannot represent a post with related documents and supporting
assets:

- nested Markdown files can produce colliding output names;
- a supplement has no stable relationship to its parent post;
- the build cannot distinguish a published document from an unpublished one;
- relative links and future media paths have no defined URL semantics.

This feature introduces a published content boundary and post directories that
can contain supplementary Markdown documents. A supplement is a separate,
addressable document associated with a post. It is not automatically embedded
in the parent post.

## Goals

1. Publish content only from `source/site/content/published/`.
2. Preserve the current standalone-post workflow during migration.
3. Support a post directory with one parent post and a `supplements/`
   directory containing related Markdown documents.
4. Give every published document a deterministic, collision-free URL.
5. Link published supplements from their parent post.
6. Allow frontmatter to control whether a supplement is published.
7. Validate invalid structure and broken relationships during the build.
8. Keep the design compatible with existing series and citation metadata.

## Non-goals

- Copying or transforming `media/` files in the first implementation.
- Automatically inserting supplement content into the parent post.
- Changing the existing blog listing behavior to list supplements as posts.
- Replacing the existing frontmatter parser with a general-purpose content CMS.

## Content model

### Published content root

Only files below `source/site/content/published/` are production candidates.
The existing `__drafts/` directory remains available for work in progress but
is outside the published root and must never be emitted.

### Supported layouts

Standalone posts remain supported:

```text
source/site/content/published/
└── post-1.md
```

Post directories contain one Markdown parent post and may contain supplements:

```text
source/site/content/published/
└── post-2/
		├── post-2.md
		└── supplements/
				├── notes.md
				└── research.md
```

For the first implementation, the parent Markdown filename must match its
containing directory (`post-2/post-2.md`). This makes ownership explicit and
leaves room for future directory-local files without introducing an additional
index-file convention.

The builder must reject a post directory that has zero or multiple candidate
parent Markdown files. Markdown files directly below `published/` are always
standalone posts. Markdown files below a post's `supplements/` directory are
supplements, not standalone posts.

### Supplement frontmatter

Supplements use the existing metadata fields and add an explicit publication
flag:

```yaml
---
title: "Research Notes"
description: "Supporting research for Post 2."
date: "2026-08-01"
published: true
---
```

The `published` field is required for supplements. `published: false` keeps the
source file available locally but excludes it from generated HTML, manifests,
and parent-post links. A missing or invalid value is a build error rather than
an implicit publication decision.

Parent posts retain the current publication rule for compatibility: a valid
post under `published/` is published. A later phase may require the same
explicit flag for parent posts after existing content has migrated.

## URL and output rules

The source path, not the basename alone, determines the output path.

| Source                                  | Output URL                       |
| --------------------------------------- | -------------------------------- |
| `published/post-1.md`                   | `/post-1.html`                   |
| `published/post-2/post-2.md`            | `/post-2.html`                   |
| `published/post-2/supplements/notes.md` | `/post-2/supplements/notes.html` |

Generated output must preserve the relative directory structure beneath
`published/`. The output map must reject duplicate URLs before emitting files.

The public URL is also the canonical identifier used in manifests and links.
Source paths should remain internal implementation details and must not be
exposed in generated HTML.

## Supplement relationships

The post directory establishes the parent-child relationship. A supplement does
not need a manually duplicated `parent` field in frontmatter. The builder
should derive the parent post from the directory and validate that the parent
exists and is published.

The parent post's manifest entry should include published supplements:

```json
{
  "title": "Post 2",
  "url": "/post-2.html",
  "supplements": [
    {
      "title": "Research Notes",
      "description": "Supporting research for Post 2.",
      "url": "/post-2/supplements/notes.html",
      "filename": "post-2/supplements/notes.html"
    }
  ]
}
```

Supplements must not appear in the top-level `posts` collection or affect blog
post counts, tag counts, series totals, or post-list filtering. They may retain
their own title, description, date, citations, and other document metadata.

The blog-post template should render a supplements section only when the
parent has at least one published supplement. The initial UI can be a semantic
heading and list of links; a new component is optional unless the styling
requires one.

## Links and Markdown rendering

Markdown links to local documents must resolve using the source document's
location and the generated URL map. The existing global `.md` to `.html`
replacement is insufficient for nested documents.

Required behavior:

- links from a parent post to its supplements resolve to the supplement URL;
- links between supplements resolve to sibling or parent document URLs;
- links to unpublished or nonexistent local Markdown files fail the build with
  the source path and target in the error;
- external URLs retain their current behavior;
- generated links never expose `source/site/content/` paths.

Citation references and series metadata continue to operate on each Markdown
document independently. A supplement may contain citations, but it is not a
member of the parent's post series unless a future feature explicitly defines
that relationship.

## Builder design

Introduce a normalized content-document model before changing output behavior:

```typescript
interface ContentDocument {
  sourcePath: string;
  outputPath: string;
  url: string;
  kind: "post" | "supplement";
  parentUrl?: string;
  metadata: FrontmatterData;
}
```

The model should be created by a discovery/normalization step and consumed by
Markdown processing, manifest generation, and development routing. This keeps
path classification out of the renderer and avoids duplicating URL logic in
the build and dev server.

### Discovery

Update content discovery to:

1. scan only `source/site/content/published/` for production content;
2. classify root Markdown files as posts;
3. classify Markdown files in `post-directory/supplements/` as supplements;
4. ignore `__drafts`, `media`, and unknown directories unless explicitly
   supported;
5. create the normalized output path for every candidate;
6. validate structure before processing any document.

### Markdown processing

`MarkdownProcessor` should accept the normalized document identity or an
equivalent output-path argument. It must stop deriving output filenames with
`basename(filePath)`, because that loses nested path information.

Processing a supplement should still use the blog-post template and the same
Markdown features as a parent post, including headings, citations, and syntax
highlighting. Its generated metadata should include its document kind and
parent URL for manifest and template processing.

### Manifest generation

Keep the existing top-level blog manifest shape for posts. Add an optional
`supplements` array to `BlogPostManifestEntry`. The manifest must contain only
published documents and must be generated from normalized document data rather
than reparsing output filenames.

### Development server

Development routing must support nested `.html` URLs such as
`/post-2/supplements/notes.html`. It should first resolve generated documents by
their public URL, then use the same normalized source mapping as the production
build. Direct access to source content directories remains blocked.

### Git-aware builds

Changes to a supplement must rebuild the supplement and its parent manifest
entry. Changes to a supplement's publication state must add or remove its
generated HTML and parent link. Changes to a parent directory, including file
creation or deletion, must invalidate the affected document map and manifest.
Media changes are out of scope until media copying exists.

## Validation rules

Build errors must include the relevant source path and a corrective message.

Reject:

- Markdown outside `published/` being treated as production content;
- a post directory without exactly one parent Markdown file;
- a parent filename that does not match its directory name;
- a supplement outside a recognized `supplements/` directory;
- a supplement with missing or non-boolean `published` metadata;
- a published supplement whose parent post is missing or unpublished;
- duplicate public output URLs;
- broken local Markdown links;
- links to unpublished supplements;
- invalid frontmatter required by the existing blog-post rules.

Warn, but do not fail, for:

- unused files in an otherwise valid post directory that are not in a
  supported directory such as `media/`;
- a post with no supplements (normal case).

## Implementation phases

Each phase is an independently executable implementation brief. A phase must
clear its gates before an agent begins the next phase. The detailed briefs are
in `documentation/meta/supplementary-files/`:

1. [Phase 1: Content Model and Discovery](supplementary-files/phase-1-content-model-and-discovery.md)
2. [Phase 2: Supplement Publication and Manifest](supplementary-files/phase-2-supplement-publication-and-manifest.md)
3. [Phase 3: Local Document Links](supplementary-files/phase-3-local-document-links.md)
4. [Phase 4: Routing and Incremental Builds](supplementary-files/phase-4-routing-and-incremental-builds.md)
5. [Phase 5: Integration, Documentation, and Migration Closure](supplementary-files/phase-5-integration-documentation-and-migration.md)

The phase files are the agent-facing work orders. This document remains the
feature contract: if implementation discovery changes a decision, update this
specification before changing later phase briefs.

## Testing and verification

At minimum, add coverage for:

- standalone post discovery;
- nested parent-post discovery;
- supplement classification;
- publication flag validation;
- parent/supplement manifest output;
- duplicate output paths;
- missing parent posts;
- nested development routes;
- local Markdown link resolution;
- interaction with series and citation metadata.

The final validation sequence is:

```bash
npm run build
npm run dev
```

Inspect the generated `dist/` tree and `data/blog-manifest.json`, then verify
the parent and supplement URLs in a browser. Run the repository's available
TypeScript and lint checks before merging.

## Future media support

The `media/` directory is intentionally reserved but not processed by this
feature. A later media phase should define:

- which file types are allowed;
- whether files are copied unchanged or optimized;
- public paths relative to the parent post;
- validation for missing assets and unsafe paths;
- whether Markdown image references are rewritten or remain relative.

The likely public convention is:

```text
post-2/media/image1.webp -> /post-2/media/image1.webp
```

Media support should reuse the normalized post identity introduced here rather
than inventing a second path system.
