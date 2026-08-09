# Draft Post Directories

## Status

Implemented. Draft discovery lives in
`source/builder/modules/draft-content-discovery.ts` with shared structural
helpers in `source/builder/modules/content-structure.ts`. Validate with
`npm run validate:drafts`. Authoring workflow is documented in
`source/site/README.md`.

## Problem

Published posts can use a directory as their working unit:

```text
published/post-slug/
├── post-slug.md
└── supplements/
    └── notes.md
```

Draft content has no equivalent contract. `source/site/content/__drafts/`
currently mixes the backlog, standalone draft posts, research files, and other
working material in one flat directory. That is workable for small posts, but
it makes a multi-document draft harder to navigate and gives related files no
explicit ownership.

The admin system has a separate responsibility. It reads and writes
`backlog.md` as a local-only work-tracking board; it does not discover or manage draft
documents.

## Goal

Allow an optional directory layout for draft posts, using the same clear parent
file convention as published posts, without making drafts part of the site
build or changing the backlog workflow.

## Non-goals

This work does not:

- Render, route, or publish draft documents.
- Add draft documents to `dist/`, the blog manifest, or any public URL.
- Add draft previews to the site development server.
- Resolve or rewrite Markdown links between drafts.
- Require `published` frontmatter on draft parents or draft supporting files.
- Change the admin API, work-tracking UI, or `backlog.md` format.
- Add draft files to the git-aware build or change-detection behavior.
- Require existing flat draft files to move into directories.

## Content Contract

`source/site/content/__drafts/backlog.md` remains reserved for the admin
system. It is not a draft document and must never be classified as one.

Standalone Markdown files remain valid draft material:

```text
source/site/content/__drafts/
└── syntax-of-documentation.research.md
```

A directory draft contains one parent Markdown file whose name matches the
directory. It may contain recursively nested supporting Markdown files beneath
`supplements/`:

```text
source/site/content/__drafts/
└── syntax-of-documentation/
    ├── syntax-of-documentation.md
    └── supplements/
        ├── research.md
        └── semiotics/
            └── prior-art.md
```

The draft parent is the organizational anchor. Supporting files are draft
materials associated with that parent; they have no public URL, manifest entry,
or publication status in this phase.

Directories named `supplements` and `media` are reserved. A reserved directory
at the draft root is not a draft parent candidate. `media/` remains opaque to
this feature.

## Design

Add a focused draft discovery and validation abstraction near
`source/builder/modules/content-discovery.ts`. It should share path
classification helpers with published discovery where doing so removes real
duplication, but it must not reuse the publication result type or join the
production build path.

The draft result should retain source-only information:

```typescript
type DraftDocumentKind =
  "standalone-draft" | "directory-draft" | "supporting-draft";

interface DraftDocument {
  sourcePath: string;
  kind: DraftDocumentKind;
  parentSourcePath?: string;
}
```

Do not assign an output path or public URL. Their absence is intentional: it
makes it difficult for later code to accidentally treat a draft as publishable.

The discovery utility must:

1. Skip `backlog.md` at the draft root.
2. Classify root-level Markdown files other than `backlog.md` as standalone
   drafts.
3. Require each draft directory to contain exactly one direct Markdown parent
   named after the directory.
4. Classify Markdown below that directory's `supplements/` tree as supporting
   drafts, with a reference to the parent source path.
5. Reject a directory with no parent, more than one direct Markdown file, or a
   mismatched parent filename.
6. Ignore non-Markdown files and `media/` directories.
7. Return an empty result, rather than throw, when `__drafts/` does not exist.

Unknown subdirectories within a draft directory should produce a warning and
not be traversed. This keeps the initial contract small and avoids silently
turning arbitrary scratch files into draft documents.

## Implementation Steps

### 1. Extract shared structural helpers

Review `ContentDiscovery` and identify the smallest path-only operations that
apply to both roots: direct-entry inspection, parent filename validation,
recursive Markdown collection under `supplements/`, and platform-independent
path normalization where needed for diagnostics.

Keep published-only behavior in `ContentDiscovery`: output paths, public URLs,
frontmatter parsing, publication filtering, supplement manifests, and duplicate
URL checks do not belong in the shared layer.

### 2. Add draft discovery

Create a `DraftContentDiscovery` module with a default root of
`source/site/content/__drafts/`. Its result should expose the discovered
documents and the draft root path for tests and diagnostics.

The module is an authoring-time validation utility. Do not import it from the production
builder plugin, `MarkdownProcessor`, development server, or the admin
server.

### 3. Provide an explicit validation entry point

Add a small command or script that invokes draft discovery and reports a clear
success summary or structural error. It should be independently runnable by an
author and CI without running a site build.

Prefer a dedicated command such as `npm run validate:drafts` over embedding
validation in `npm run build`; the production build must continue to be
independent of draft quality and availability.

### 4. Test the contract

Add isolated fixtures for:

- a standalone draft;
- a valid directory draft with a nested supporting file;
- `backlog.md` exclusion;
- a missing draft root;
- a directory with no parent Markdown file;
- multiple direct Markdown parent candidates;
- a mismatched parent filename;
- ignored non-Markdown and `media/` files;
- an unknown directory warning.

Tests should assert only source-path relationships and classifications. They
must also prove that no output path, public URL, or manifest behavior leaks
into the draft result.

### 5. Document the workflow

Update the content-authoring documentation to show both valid draft layouts,
state that flat files remain supported, and explain how to run draft
validation. Update the admin documentation only to clarify that the backlog
tracks work status and is not a draft file index.

Do not update the published-content specification except to link to this plan
if a cross-reference is useful. Published and draft semantics should remain
separate documents.

## Validation Gates

### Gate 1: Structural classification

Run the focused draft discovery tests. The result is clear when parent and
supporting documents have the expected classifications and source-parent relationship,
while `backlog.md` is absent from the result.

### Gate 2: Failure behavior

Run the same tests with each malformed fixture. Every failure must name the
offending source directory and state the expected parent filename or structure.

### Gate 3: Production isolation

Run:

```bash
npm run build
```

The result is clear only when the build succeeds without inspecting drafts and
no file below `source/site/content/__drafts/` appears in `dist/` or
`public/data/blog-manifest.json`.

### Gate 4: Author workflow

Run:

```bash
npm run validate:drafts
npm run lint:prose:drafts
```

The result is clear when nested draft Markdown files are included in prose
linting and the validation command reports the expected document count.

## Follow-up Work

Local draft previews, source-aware links between draft documents, and admin UI
awareness are useful possible extensions. They should be separate work because
each one introduces a new contract: a non-public URL space, a link target
model, or document-level CRUD. None is required for folders to make drafts
easier to author now.
