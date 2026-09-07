# Phase 3 Review: Template Repetition And Post Markup

Review of the Phase 3 implementation against the objective and hard gates in `phase-3-template-repetition.md`. Every gate was verified empirically; the implementation is correct across all of it, including paths the tests do not reach.

**Verification status:** `npx tsc --noEmit` clean, 68 tests across 14 files, `npm run build` succeeds. No `data-kbr-` directives remain anywhere in `dist`.

## Gates verified

### Gate 3.1 — Loop correctness: passes, and the test is genuinely good

The single loop test covers zero/one/multiple iterations, a nested collection path (`data.items`), `data-kbr-if` inside the loop, and both `<ul>` and `<ol>`, asserting exact strings. Further probing confirms everything holds:

```
L3 nested loops:    <ul><li>a<ul><li>a/1</li><li>a/2</li></ul></li><li>b<ul></ul></li></ul>
L4 shadowing:       <p>OUTER</p><i>x</i><p>OUTER</p>
L5 include-in-loop: <div><b>1</b><b>2</b></div>
L6 raw-in-loop:     <div><em>A</em><em>B</em></div>
L7 non-array:       data-kbr-for requires an array value at "items" (t.html:line 1)
```

Script and style contents are still not interpolated inside loop bodies (L1/L2), and loop scope nests and restores correctly.

### Gate 3.3 — Single title owner: passes

Every built post has exactly one `<h1>`, template-owned, with a real anchor id (`<h1 id="llm-as-sme">`). `rejectLeadingMarkdownH1` throws with the Markdown source path, and both cases are tested in the new `markdown-processor.test.ts`.

### Gate 3.2 — Citation behavior: preserved, but the tests do not establish it

All nine scenarios the gate enumerates were checked by probe, and every one is correct:

```
C1 both links:   [{View,sep:false},{Buy,sep:true}]  -> "View | Buy"
C2 no links:     []  -> <span class="citation-links"> removed entirely
C3 Buy only:     [{Buy,sep:false}]  -> no leading separator
C4 multiple:     backrefs 1/2/3, hrefs match body anchors exactly
C5 unused:       excluded from output
C6 duplicates:   Duplicate citation IDs: d. Each citation must have a unique ID.
C7 escaping:     &lt;Book&gt;, &amp;, href="u?a=1&amp;b=2"
```

Real build output confirms it — four posts render citation lists, and `intentional-work-patterns-boundaries.html` exercises the separator path.

## Finding: Gate 3.2's test coverage does not match its own checklist

The gate lists nine scenarios and says to test them *before* deleting citation HTML generation. The deletion happened; `citation-processor.test.ts` still has four tests, covering roughly three of the nine (View link, one reference, missing ID). Untested: no links, Buy-only, both links, multiple references, unused IDs, duplicate IDs.

The most pointed omission is `showSeparator` — it is new view-model logic introduced by this phase (`source/builder/modules/citation-processor.ts:244-253`) specifically to drive the template, and the only assertion on it pins the `false` case:

```ts
links: [{ label: "View", url: "...", showSeparator: false }],
```

The `true` branch (`Boolean(citation.url)` when both URLs exist) has no test, and it is the branch that decides whether readers see `View | Buy` or `ViewBuy`. Same for multi-reference back-links: the single-reference label is asserted, the numbered variants and the `-1`/`-2` href suffixes are not — and those hrefs have to match anchors emitted by a different code path, which is exactly the kind of coupling worth pinning.

Everything works today. The gap is that nothing stops it from silently breaking, on a gate whose stated purpose was to make deletion safe.

## Code observations

**`cloneNode` aliases the original tree.** `source/builder/modules/html-ast-renderer.ts:789-809` builds clones with `{ ...source }`, which copies `parentNode` — so a cloned child's `parentNode` points at the *original* element, not its clone. `isInScriptOrStyle` survives this (verified in L1/L2) only because it reads `parentNode.nodeName` and the original carries the same tag name. Any future check that compares parent identity, or walks upward from a clone, will read the source tree instead. Clearing `parentNode` (or setting it to the new parent) during the clone would make the subtree genuinely detached.

**`copyOrigins` re-walks what `cloneNode` already walked.** `cloneNode` recurses into children *and* calls `copyOrigins(node, clone)` at every level; `copyOrigins` then walks the whole subtree again. Origins get set O(depth) times per node. `cloneNode` could record its own node's origin inline and let its existing recursion cover descendants, which removes `copyOrigins` (`source/builder/modules/html-ast-renderer.ts:811-837`) entirely.

**`cloneNode` is typed `Element` but receives text and comment nodes** via `childNodes?.map((child) => this.cloneNode(child))`. Runtime is fine; the return type should be `ChildNode`.

**`walk()` is now 189 lines**, up from 150 — `data-kbr-for` added the ninth branch, as predicted in the Phase 2 review. Still the single highest-leverage refactor in this file, and Phase 4 will touch it again.

**Loop output leaves whitespace artifacts** — rendered citation lists show blank lines where the `<template>` elements were. The DOM is correct and this is invisible to readers; it only matters if you diff output.

Carried and unchanged from earlier phases: `assetNodes` still round-trips through HTML strings with a `kind: string | undefined` parameter, and `requiredTargets` still names a list of directives-requiring-values.

## Doc

Unlike Phases 1 and 2, this doc has no In Progress / Completed / Next section and no gate evidence — it still reads as a pure plan. The work is done and the TypeScript builders are deleted (no production references to `injectTitleAndMetadata`, `generateTagsHtml`, or `citationsHtml` remain), but nothing records which gates were checked or how. Given that all three prior phase docs drifted out of sync with reality, the absence of any record here is the thing to fix first.

## Assessment

Implementation is sound — the loop directive held up against every input constructed against it, and citation semantics are preserved exactly, including escaping and back-reference targets.

Before Phase 4: add the six missing Gate 3.2 cases (they are cheap — the view model is a pure function of frontmatter plus usage), and record gate evidence in the phase doc. The `cloneNode` `parentNode` aliasing is worth fixing while the loop code is fresh, since it is a latent trap rather than a current bug.
