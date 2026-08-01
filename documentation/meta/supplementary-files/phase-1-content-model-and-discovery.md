# Phase 1: Content Model and Discovery

## Agent brief

Implement the normalized content-document model and make `source/site/content/published/` the production content root. Preserve the existing public URLs for current published posts. Do not implement supplements, local Markdown-link rewriting, or media copying in this phase.

This phase establishes the identity and path rules that every later phase must consume.

## Scope

### In scope

- Add a `ContentDocument` model for source path, output path, public URL, kind, parent URL, and parsed metadata.
- Discover standalone posts directly under `published/`.
- Discover post directories whose parent file matches the directory name.
- Compute deterministic nested output paths.
- Reject malformed post directories and duplicate output URLs.
- Move or otherwise migrate the current published Markdown files into `published/` without changing their public URLs.
- Keep `__drafts/` excluded.
- Make production build discovery consume the normalized document list.

### Out of scope

- Publishing supplement Markdown files.
- Supplement manifest fields or parent-post UI.
- Relative Markdown-link resolution.
- Media copying.
- Redesigning frontmatter parsing.

## Relevant surfaces

Inspect before editing:

- `source/builder/index.ts`
- `source/builder/helpers.ts`
- `source/builder/markdown-processor.ts`
- `source/builder/modules/frontmatter-parser.ts`
- `source/builder/html-bundle-processor.ts`
- `source/builder/git-aware-pipeline.ts`
- `source/site/content/`

Prefer a focused discovery/normalization module under `source/builder/modules/` rather than placing path classification in the Markdown renderer.

## Required behavior

- `published/post-1.md` maps to `/post-1.html`.
- `published/post-2/post-2.md` maps to `/post-2.html`.
- A directory post must contain exactly one parent Markdown file, named after the directory.
- Directories named `supplements` and `media` are reserved and are not parent-post candidates.
- Source paths must never appear in generated public URLs.
- Output paths must use forward slashes and remain safe within the output directory.
- A malformed structure fails before partial document emission.

## Implementation sequence

1. Inventory current published and draft content.
2. Define the model and discovery result type.
3. Implement path normalization and classification.
4. Add structural validation and duplicate-output detection.
5. Update build-start discovery and Markdown processing to consume normalized identities.
6. Migrate current published posts into `published/`, preserving filenames and URLs.
7. Update only the minimum builder documentation needed to prevent the old root-level workflow from being used accidentally.

## Gates

### Gate 1: Existing content inventory

Before changing content or discovery, record the current published Markdown files and their expected output filenames. The gate is clear only when the inventory exists in the agent's implementation notes and every current post has a migration destination.

If any file has an ambiguous destination, stop and report it.

### Gate 2: Model and path contract

Before wiring the builder, demonstrate with a focused script or unit-level check that these inputs produce the expected URLs:

- `published/post-1.md` -> `/post-1.html`
- `published/post-2/post-2.md` -> `/post-2.html`
- `published/post-2/supplements/notes.md` is classified as a supplement candidate, not a parent post
- two inputs cannot silently produce the same output URL

The gate is clear only when the check passes and the output is inspectable.

### Gate 3: Build output preservation

Run:

```bash
npm run build
```

The gate is clear only when the build succeeds, every current published post still exists at its previous URL, and no file below `__drafts/` is emitted.

### Gate 4: Invalid structure rejection

Create temporary fixture directories outside the real content tree or use an isolated test harness for:

- a directory with no parent Markdown file;
- a directory with multiple parent candidates;
- a mismatched parent filename;
- duplicate public output paths.

The gate is clear only when each case fails with a source path and corrective message. Remove temporary fixtures before completion.

## Deliverables

- Normalized content-document model.
- Discovery and validation implementation.
- Updated build integration.
- Migrated published content, if required by the chosen implementation.
- Focused tests or deterministic checks for path classification.
- Build output showing preserved existing URLs.

## Stop conditions

Stop before proceeding if:

- current URLs cannot be preserved without redirects or a migration decision;
- discovery still depends on basename-only output names;
- a malformed content tree can partially emit output;
- `npm run build` fails for an unrelated pre-existing reason and the failure cannot be isolated.
