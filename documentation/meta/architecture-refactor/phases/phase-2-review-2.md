# Phase 2 Review (Round 2): HTML AST Renderer

Follow-up review after the fixes applied in response to `phase-2-review.md`. Every finding from the first review was re-verified by probe; one new bug was found in the same family as the one that was fixed.

**Verification status:** `npx tsc --noEmit` clean, 63 tests pass, `npm run build` succeeds.

## Confirmed fixed

| Finding | Evidence |
|---|---|
| Blog post bodies dropped | `BODY PRESENT: true`; `llm-as-sme.html.snap` back to 228 lines; `dist/llm-as-sme.html` contains the real prose |
| Raw-fragment token collision | `<div><em>AAA</em></div><div><em>BBB</em></div>` — correct |
| Include double-walk | `<p>{{ secret }}</p>` — literal braces survive, no re-resolution |
| Escape/cycle diagnostics | `... (templates/base.html:line 1)` and `... (a.html:line 1)` |
| `data-kbr-html` host | now throws `data-kbr-html is only valid on template elements` |

The three new regression tests (`source/builder/modules/html-ast-renderer.test.ts:114`, `:123`, and the `keeps generated Markdown body content` case in `site-renderer.test.ts`) target the exact failures, so they would catch a recurrence.

The include splice rewrite (`source/builder/modules/html-ast-renderer.ts:195-197`) was checked against the edge cases the arithmetic could get wrong — multi-node includes preserve order (`<x>before</x><a>1</a><b>2</b><c>V</c><y>after</y>`) and empty includes do not skip the following sibling (`<x>a</x><y>b</y>`). The `includedLength === 0 ? -1 : includedLength - 1` handles both correctly.

The remaining snapshot churn is legitimate parse5 serialization: void elements losing `/>`, `crossorigin=""`, whitespace normalization, `&#39;` decoded in a double-quoted attribute. No content loss, no leaked directives anywhere in `__snapshots__/`.

Gate 2.3 was rewritten to describe what was actually done rather than the impossible A/B against a deleted renderer. That is the honest fix.

## New: raw fragment values can hijack another fragment's placeholder

The token counter fixed collisions between *generated* tokens, but `replaceRawFragments` (`source/builder/modules/html-ast-renderer.ts:455-466`) still does ordered string replacement over already-substituted output:

```ts
for (const [token, value] of rawFragments) {
  const tokenPattern = new RegExp(`<[^>]+id="${token}"[^>]*><\\/[^>]+>`);
  result = result.replace(tokenPattern, () => value);
}
```

Each iteration rewrites a string that earlier iterations have already injected content into, and the pattern is non-global — it takes the *first* match. So if fragment N's value contains an element shaped like fragment N+1's placeholder, the later replacement lands on the injected element instead of the real one:

```
a = <i id="kbr-raw-fragment-1"></i>,  b = <em>B</em>
-> <div><em>B</em><template id="kbr-raw-fragment-1"></template></div>
```

`b` overwrote the injected `<i>`, and the genuine placeholder leaked into the output.

**This is reachable through the real pipeline.** Sweeping token indices with a post containing a raw HTML block (Markdown permits these):

```
n=0 body=true citation=true tags=true LEAKED=false
n=1 body=true citation=true tags=true LEAKED=false
n=2 body=true citation=true tags=true LEAKED=true
n=3 body=true citation=true tags=true LEAKED=false
```

At `n=2`, a post containing `<div id="kbr-raw-fragment-2"></div>` ships with the citations block rendered in the wrong place and a literal `<template id="kbr-raw-fragment-2"></template>` in the HTML. Only index 2 hits because the sidebar's `tagsHtml` placeholder precedes the article in document order while `citationsHtml` follows it — so which indices are exploitable is a function of layout ordering, not of anything an author can see.

The likelihood is low (it needs a raw HTML block with that exact id), but the failure is silent, it violates Gate 2.2's byte-for-byte guarantee, and it breaks the Completion Evidence promise that output contains no build directives. Worth noting that this review file and the phase docs now contain that literal string, so it is the kind of thing that surfaces when you write about your own tooling.

**Fix:** do one pass instead of N. Build a single global regex over all tokens and resolve each match through the map in a replacer callback — `String.replace` never re-scans replacement text, so injected content cannot be matched. Alternatively, reject raw values containing `RAW_TOKEN_PREFIX`.

## The new collision guard is dead code

`source/builder/modules/html-ast-renderer.ts:248-255`:

```ts
const token = `${RAW_TOKEN_PREFIX}${state.nextRawToken++}`;
if (state.rawFragments.has(token)) {
  throw this.error(element, `Raw fragment token collision: ${token}`, ...);
}
```

`nextRawToken` increments monotonically within a single `state`, and each `render`/`renderDocument`/`renderPage` call creates a fresh one — so this condition can never be true. It reads as satisfying Implementation Step 8's "Reject token collisions," but the vector it guards no longer exists while the one above is unguarded.

**Fix:** delete it, or repoint it at the real check.

Relatedly, `replaceRawFragments` still throws a bare `new Error("Raw fragment token collision or loss: ...")` with no source path or line — the one remaining throw in the renderer that does not go through `this.error()`.

## Carried over, not addressed

These were in the first review and are unchanged. All are cleanups; none block Phase 3.

- **`assetNodes` round-trips through HTML strings** (`source/builder/modules/html-ast-renderer.ts:416-440`) — builds tag text, escapes the href, re-parses each through `parseFragment`. The `kind: string | undefined` parameter is still looser than the validated `"head" | "body"` it receives, and the paired ternaries still read backwards.
- **`walk()` is 151 lines** handling eight concerns in one loop with in-place `splice` and index arithmetic in four places. The two bugs fixed this round both lived in that arithmetic — which is the argument for splitting it before `data-kbr-for` adds a ninth branch.
- **`requiredTargets`** (`source/builder/modules/html-ast-renderer.ts:574`) is a list of directives requiring non-empty values, not targets.
- **Shared mutable renderer** — one `HtmlAstRenderer` with instance `includeStack` serves every page in a build.
- **`matches legacy rendering for raw content in a Phase 0-style fixture`** (`source/builder/modules/html-ast-renderer.test.ts:178`) still does not touch the legacy renderer. Now that the doc's Gate 2.3 has been made accurate, this test name is the last place claiming a comparison that did not happen.

One small new thing: `source/builder/template-processor.ts:55` declares `templateNames` *after* the constructor that assigns it at line 52. It works, but the field declaration belongs with `astRenderer` above the constructor.

## Assessment

Phase 2's gates now hold except for Gate 2.2, which the raw-fragment hijack still violates in the narrow case above.

Recommended: fix that one (a contained change to `replaceRawFragments`) and drop or repoint the dead guard, then Phase 3 can proceed. The `walk()` split is worth doing as the first move *in* Phase 3 rather than a Phase 2 blocker, since `data-kbr-for` will touch that loop anyway.
