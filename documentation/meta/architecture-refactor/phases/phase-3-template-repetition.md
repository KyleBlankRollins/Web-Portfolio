# Phase 3: Template Repetition And Post Markup

## Objective

Add safe template repetition, then move repeated blog-post HTML from TypeScript strings into HTML fragments backed by typed render view models.

## Scope

- Add `data-kbr-for` to the AST renderer.
- Move title/date metadata, tag buttons, and citation-list markup into HTML templates.
- Keep citation reference parsing, numbering, validation, and back-reference calculation in content processing.
- Reject leading Markdown H1 elements so layouts own post titles.

Do not migrate frontmatter to TOML or statically render the blog index/home collections yet.

## Implementation Steps

1. Implement `data-kbr-for="item of collection"` with a local immutable loop scope and dot-path collection expression.
2. Preserve source origins when cloning loop bodies and confirm each clone traverses nested `template.content`.
3. Define narrow typed view models for post metadata, tag controls, citations, citation links, and citation back-references.
4. Change citation processing to return typed citation display data rather than a serialized citations section.
5. Add fragments for blog metadata, tag list, and citation list. Use `data-kbr-if` for optional URL/purchase URL/back-reference markup.
6. Change Markdown rendering to expose only rendered post body as a trusted raw fragment and structured display data separately.
7. Validate Markdown source does not begin with an H1; render the post title only from a template fragment.
8. Delete TypeScript HTML builders after their template outputs replace them.

## Hard Gates

### Gate 3.1: Loop Correctness

Before using loops in site templates:

1. Test zero, one, and multiple iterations.
2. Test nested paths inside a loop and an `if` nested inside a loop.
3. Test a loop in `<ul>` and `<ol>` and confirm final children are valid list items without directive nodes.
4. Test an invalid loop expression and verify its origin diagnostic.

**Pass condition:** Every rendered collection has correct order/scope and no `<template data-kbr-for>` remains in output.

### Gate 3.2: Citation Behavior Preservation

Before deleting citation HTML generation:

1. Test citations with no links, View link, Buy link, both links, one reference, and multiple references.
2. Test missing, duplicate, and unused citation IDs.
3. Confirm reference numbers and back-reference targets match the current behavior.

**Pass condition:** Typed citation data and template output preserve citation semantics and escaping.

### Gate 3.3: Single Title Owner

Before deleting `injectTitleAndMetadata`:

1. Test a post without a Markdown H1.
2. Test a post whose Markdown begins with H1.
3. Confirm the first renders one layout-owned H1 and the second fails with the Markdown source path.

**Pass condition:** Rendered posts never contain duplicate title H1 elements.

## Completion Evidence

- Loop/citation/title validation test paths.
- HTML fragments now responsible for tags, citations, and post metadata.
- Deleted TypeScript HTML builders with no remaining imports.
- Passing `npm test` and `npm run build`.

## Completion Status

Completed. Phase 3 is ready for the Phase 4 handoff.

### Gate Evidence

- **Gate 3.1:** `source/builder/modules/html-ast-renderer.test.ts` covers zero, one, and multiple iterations; nested collection paths; conditionals inside loops; `<ul>` and `<ol>` output; and invalid loop diagnostics. The renderer replaces loop templates with their cloned children, preserves nested `template.content`, and detaches cloned parent links.
- **Gate 3.2:** `source/builder/modules/citation-processor.test.ts` covers no links, View-only, Buy-only, both links and separator state, single and multiple references, missing IDs, duplicate IDs, unused IDs, and typed display data. Citation reference anchors and display back-reference targets are asserted together.
- **Gate 3.3:** `source/builder/markdown-processor.test.ts` covers body-only posts and leading Markdown H1 rejection with the source path. Built blog output owns the title H1 in `source/site/templates/blog-post.html`.

### Verification

- `npm test`: 75 tests passed across 14 files.
- `npm run build`: passed with TypeScript compilation and production output generation.
- No production references remain to `injectTitleAndMetadata`, `generateTagsHtml`, or `citationsHtml`.

## Handoff To Phase 4

Proceed only after all gates pass. The next phase replaces untyped metadata with validated TOML-backed content records; do not broaden template expressions to compensate for missing types.
