# Phase 2: HTML AST Renderer

## Objective

Replace regex template substitution with a `parse5`-based renderer that implements the closed valid-HTML directive contract. Templates remain `.html` files and template behavior remains intentionally small.

## Scope

- Install and use `parse5` directly with source-location information.
- Implement includes, page metadata, layout selection, slots, conditionals, escaped interpolation, raw-fragment placeholders, and asset placement.
- Migrate layouts, partials, and authored pages to directive syntax.
- Delete the old template engine, processor, metadata extractor, and raw-variable allowlist.

Do not add loops, migrate frontmatter to TOML, or statically render collection components in this phase.

## Implementation Steps

1. Define renderer node/origin types around the `parse5` AST. Every parsed node records source path and location.
2. Implement directive walkers that traverse both ordinary children and `template.content`.
3. Implement include resolution relative to the including file, reject source-root escapes, and detect recursive include cycles.
4. Extract `<template data-kbr-page data-layout="...">` metadata from meta-style children and remove it from page output.
5. Render a page fragment first; insert its rendered subtree into the selected layout's `data-kbr-slot="content"`.
6. Implement `data-kbr-if` with the specified truthiness contract.
7. Implement escaped dot-path interpolation only in text and attribute nodes; never interpolate script/style contents.
8. Implement `data-kbr-html` as an opaque placeholder token. Serialize the surrounding document first, then replace each token with the exact trusted fragment. Reject token collisions and invalid raw values.
9. Implement `data-kbr-assets` using `SiteAssets`.
10. Migrate base/blog layouts and all three partials, then migrate every page from comment metadata to `data-kbr-page` metadata.
11. Remove the legacy engine and metadata-comment compatibility path.

## Hard Gates

### Gate 2.1: Directive Semantics

Before migrating any site template:

1. Add focused fixtures for each directive, nested paths, empty/missing values, series part `0`, empty arrays, script/style content, and template content.
2. Add failure fixtures for malformed directives, unresolved required paths, invalid raw targets, source-root escape, and include cycles.
3. Run the directive test suite.

**Pass condition:** Every valid fixture renders the expected DOM; every invalid fixture fails with its source file and location.

### Gate 2.2: Opaque Raw HTML

Before rendering Markdown through `data-kbr-html`:

1. Use a trusted raw fixture containing entities, custom elements, and literal `{{ value }}` text.
2. Render it into a complete layout.
3. Confirm the surrounding layout serializes normally and the raw fragment is byte-for-byte identical to its input.

**Pass condition:** No AST parse, escaping, interpolation, or serializer normalization changes the raw fragment.

### Gate 2.3: Site Migration Parity

Before deleting the legacy renderer:

1. Render every Phase 0 fixture with the old implementation and the AST renderer.
2. Compare outputs using the normalized DOM comparator.
3. Review exact snapshot diffs for intentional directive/asset changes only.
4. Run `npm test` and `npm run build`.

**Pass condition:** No unexplained semantic output difference remains, and the legacy template modules have no production callers.

## Completion Evidence

- Directive unit-test paths and failure-diagnostic examples.
- Normalized DOM parity results and reviewed snapshots.
- Confirmation that output contains no `data-kbr-*` build directives.
- Passing full tests and build after removing the old renderer.

## Handoff To Phase 3

Proceed only after all gates pass. Phase 3 may add `data-kbr-for`; it must build on this renderer rather than adding a separate rendering path.
