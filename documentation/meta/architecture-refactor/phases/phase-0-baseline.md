# Phase 0: Baseline And Contracts

## Objective

Create a verified baseline and lock the renderer contract before modifying build behavior. This phase adds tests and documentation only unless an existing test that is expected to pass needs a narrowly scoped repair.

## Scope

- Run the existing test suite and production build.
- Record the emitted HTML and JSON surface covered by the existing output snapshots.
- Add characterization tests where snapshots do not isolate page rendering or Markdown rendering behavior.
- Add a normalized DOM comparison helper for serializer-migration parity checks.
- Record the final template-directive contract in the architecture documentation.

Do not change Vite input, template syntax, frontmatter syntax, rendering behavior, or runtime components in this phase.

## Required Contract Decisions

The implementation record must state all of the following without placeholders:

- Page metadata uses a `<template data-kbr-page data-layout="...">` element with meta-style child elements.
- Layouts insert a fully rendered page fragment through `<template data-kbr-slot="content"></template>`.
- `data-kbr-if` treats only `null`, `undefined`, `false`, empty strings, and empty arrays as false. `0` is true.
- Template expressions contain only identifiers and dot paths. Conditional attributes and derived class names are prepared in view models.
- `{{ path }}` is escaped in text and attribute nodes, but never in `script` or `style` nodes.
- `<template data-kbr-html="path"></template>` inserts a typed trusted fragment verbatim after surrounding-document serialization. It is never parsed, traversed, interpolated, or reserialized.
- Include paths resolve from the including source file but must remain under the site source root.
- Invalid directives, include cycles, unresolved required values, and paths outside the source root are errors with source path and location.

## Implementation Steps

1. Run `npm test` and `npm run build` from the repository root.
2. If either command fails, identify whether the failure predates this phase. Do not proceed with refactor work while an expected baseline check fails.
3. Inventory the generated files covered by [build-output.test.ts](../../../../source/builder/build-output.test.ts), including HTML documents and JSON manifests.
4. Add focused characterization fixtures/tests for:
   - a static HTML page with title, description, and keywords;
   - a Markdown post with tags, series part `0`, citations, and literal `{{ ... }}` content;
   - a nested supplement path;
   - theme-manifest output.
5. Implement a normalized DOM comparator using the currently selected `parse5` approach or a test-local equivalent. It must compare document structure and meaningful attributes/text while ignoring serializer-only whitespace and attribute ordering.
6. Add tests proving that the comparator detects semantic changes and ignores only the intended formatting differences.
7. Add the required contract decisions above to the architecture documentation, including examples where helpful.

## Hard Gates

### Gate 0.1: Baseline Is Green

Before adding any renderer, Vite, template, or content-schema code:

1. Run `npm test`.
2. Run `npm run build`.
3. Confirm both commands exit with code `0`.

**Pass condition:** Both commands succeed. If either does not, stop and report the exact failure with whether it predates this work.

### Gate 0.2: Parity Check Is Trustworthy

Before using normalized DOM comparison to approve any renderer migration:

1. Run the comparator against an unchanged fixture.
2. Change only whitespace and attribute order in a copy of that fixture; run the comparator.
3. Change one element, one attribute value, and one text value in separate copies; run the comparator for each.

**Pass condition:** Formatting-only changes compare equal; every semantic change compares unequal.

### Gate 0.3: Contract Is Closed

Before starting Phase 1:

1. Review the required contract decisions above against the architecture documentation.
2. Confirm none is described as undecided, optional, or deferred.

**Pass condition:** The contract names its syntax, trust boundary, truthiness, error behavior, and layout handoff explicitly.

## Completion Evidence

- Commands and exit codes for `npm test` and `npm run build`.
- Paths of added characterization tests and DOM-comparator tests.
- The documentation path containing the closed directive contract.
- A short note listing any known baseline failure that was intentionally left outside scope.

## Handoff To Phase 1

Proceed only after all three hard gates pass. Hand off the known-good snapshot baseline, the comparator, and the closed directive contract. Phase 1 may change orchestration boundaries but must preserve this baseline's behavior except for approved asset-path and asset-placement changes.
