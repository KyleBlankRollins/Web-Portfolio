# Phase 5: Integration, Documentation, and Migration Closure

## Agent brief

Close the feature by testing the complete content model, documenting the authoring workflow, and removing temporary compatibility behavior only when the repository is ready. This phase is a review gate, not a place to add new feature scope.

## Prerequisites

Phases 1 through 4 must be complete and their gates must be recorded. Any unresolved stop condition must be addressed or explicitly accepted by the project owner before this phase begins.

## Scope

### In scope

- Run end-to-end checks for standalone posts, directory posts, published supplements, and unpublished supplements.
- Verify interaction with citations and post-series metadata.
- Update `source/site/README.md` with the new content layout and frontmatter rules.
- Update `source/builder/README.md` with discovery, URL, manifest, and validation behavior.
- Update the primary supplementary-files specification if implementation decisions changed.
- Remove temporary compatibility code only if all content has migrated and existing URLs remain stable.
- Review generated output and the final diff for unrelated changes.

### Out of scope

- Media support.
- New blog UI beyond the supplement list.
- New citation or series features.
- Broad refactors discovered during review but unrelated to this feature.

## Required end-to-end fixture matrix

The final repository must exercise:

1. A standalone published post.
2. A directory post whose parent filename matches its directory.
3. A published supplement.
4. An unpublished supplement.
5. A supplement with citations.
6. A post in an existing series with a supplement.
7. Parent, sibling, and supplement-to-parent Markdown links.
8. Invalid structure and broken-link failure cases.

Fixtures may be real content or isolated test fixtures. Do not publish disposable test content.

## Gates

### Gate 1: Contract reconciliation

Compare the implementation against the primary specification and the phase files. The gate is clear only when every goal has one implementation location and every non-goal remains out of scope. Record any intentional deviation in the primary spec before continuing.

### Gate 2: Full build and type validation

Run:

```bash
npm run build
```

The gate is clear only when TypeScript compilation and the production build both succeed, generated files have the expected nested paths, and `data/blog-manifest.json` contains only parent posts at the top level.

### Gate 3: Content behavior

Inspect the generated output and verify:

- published supplements are linked from their parent;
- unpublished supplements are absent;
- citations render correctly on both parent and supplement documents;
- series totals and navigation ignore supplements;
- local links preserve fragments and resolve to public URLs;
- no source path appears in generated HTML or manifest JSON.

The gate is clear only after inspecting actual generated artifacts, not only source code.

### Gate 4: Documentation quality

Run the repository's available prose checks for changed Markdown files. At minimum, inspect the final documents for stale root-level authoring instructions and contradictory publication rules. The gate is clear only when an author can determine where to put a post, how to publish a supplement, and what URL it will receive without reading implementation code.

### Gate 5: Clean review boundary

Review:

```bash
git diff --check
git status --short
```

The gate is clear only when there is no whitespace error, every changed file is intentional, and no generated output or temporary fixture is accidentally included.

## Deliverables

- End-to-end verification record.
- Updated authoring and builder documentation.
- Reconciled primary specification.
- Final migration decision and removal of compatibility behavior if applicable.
- Clean, reviewable change set.

## Stop conditions

Stop before declaring completion if:

- the primary spec and implementation disagree;
- an end-to-end fixture fails without a documented reason;
- generated output contains stale or unpublished content;
- documentation still teaches the old content root;
- the final diff includes unexplained generated files or unrelated refactors.

## Completion statement

The feature is complete only when all five phase gates are clear, the production build passes, and the generated artifact inspection confirms the public content model described by the primary specification.
