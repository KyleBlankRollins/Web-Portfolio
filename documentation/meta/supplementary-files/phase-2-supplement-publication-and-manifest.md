# Phase 2: Supplement Publication and Manifest

## Agent brief

Implement published supplements as independently addressable Markdown documents associated with a parent post. A supplement is a separate page, not content embedded into the parent. Do not implement general local-link rewriting in this phase.

## Prerequisites

Phase 1 must be complete and its gates must be clear. The normalized document model and public URL map are the source of truth.

## Scope

### In scope

- Classify Markdown files under `post-directory/supplements/` as supplements.
- Require a boolean `published` frontmatter field on supplements.
- Exclude `published: false` supplements from HTML, manifests, and parent links.
- Emit published supplements at nested URLs such as `/post-2/supplements/notes.html`.
- Add optional supplement metadata to the parent post's manifest entry.
- Render a semantic supplements section on parent posts when published supplements exist.
- Preserve citations and series metadata on each document without adding supplements to the top-level post collection.

### Out of scope

- Local Markdown link resolution.
- Media copying.
- Adding supplements to blog post counts, tag counts, series totals, or post-list filtering.
- A dedicated Web Component unless the existing template cannot express the required UI cleanly.

## Required data contract

Use an optional `supplements` array on the top-level post manifest entry:

```json
{
  "title": "Research Notes",
  "description": "Supporting research for Post 2.",
  "url": "/post-2/supplements/notes.html",
  "filename": "post-2/supplements/notes.html"
}
```

The top-level `posts` collection contains parent posts only. Supplement URLs and titles must be public URLs and user-facing metadata; source paths must not leak into the manifest.

## Implementation sequence

1. Extend frontmatter metadata typing and parsing for `published`.
2. Validate that supplement `published` is exactly boolean.
3. Add supplement documents to normalized discovery only when structurally valid.
4. Filter unpublished supplements before processing and manifest construction.
5. Process published supplements through the existing blog template and Markdown features.
6. Aggregate supplements under their parent entry.
7. Add the parent template section and scoped styles if needed.
8. Add representative fixture content, then remove or retain it only if it belongs in the site's real content model.

## Gates

### Gate 1: Publication semantics

Before modifying output behavior, prove the parser distinguishes all three cases:

- `published: true` -> publish candidate;
- `published: false` -> valid but excluded;
- missing, quoted, or non-boolean value -> build error.

The gate is clear only when the check inspects typed values, not string truthiness.

### Gate 2: Parent relationship

Use fixtures to prove that:

- a supplement is linked to the directory's parent post;
- a missing parent fails the build;
- an unpublished parent cannot expose a published supplement;
- a supplement is not added to top-level post counts or series totals.

The gate is clear only when manifest JSON is inspected and contains the expected parent/supplement shape.

### Gate 3: Output and template behavior

Run:

```bash
npm run build
```

The gate is clear only when:

- a published supplement exists at its nested URL;
- an unpublished supplement has no generated HTML;
- the parent page lists only published supplements;
- existing posts, citations, and series navigation remain intact.

### Gate 4: Accessibility and escaping

Inspect generated HTML for a parent with supplements. The gate is clear only when the section uses a heading and list, links have valid escaped attributes, and supplement titles cannot inject HTML into the page or manifest.

## Deliverables

- Supplement classification and publication validation.
- Nested supplement output.
- Parent manifest aggregation.
- Parent-post supplement links and styles.
- Focused tests or deterministic fixture checks.
- Build verification with generated manifest and HTML inspected.

## Stop conditions

Stop before proceeding if:

- unpublished supplements can be reached through generated HTML;
- supplements appear in the blog post list or alter post counts;
- parent relationships are inferred from fragile filename matching after normalization;
- existing citation or series behavior regresses.
