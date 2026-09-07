# Phase 2 Review (Round 3): HTML AST Renderer

Follow-up review after the fixes applied in response to `phase-2-review-2.md`. Every round-2 finding was re-verified by probe and is resolved. One new root cause was found in `TemplateProcessor`, producing two latent bugs.

**Verification status:** `npx tsc --noEmit` clean, 64 tests pass, `npm run build` succeeds.

## Confirmed fixed

| Finding | Evidence |
|---|---|
| Raw-fragment hijack | `<div><i id="kbr-raw-fragment-1"></i><em>B</em></div>` — both fragments correct, injected content intact |
| Real-pipeline sweep | `n=0..3` all `leaked=false`, body/citations/tags correct |
| Dead collision guard | removed; the surviving `count > 1` guard is genuinely reachable (below) |
| `rawFragmentError` location | `Raw fragment token collision or loss: kbr-raw-fragment-0 (partials/head.html:line 40)` |
| Shared `includeStack` | moved into per-render `state`; instance reuse after a thrown cycle works (`<p>ok</p>`) |
| Misleading test name | now `preserves raw content in a Phase 0-style fixture` |
| `templateNames` placement | declaration moved above the constructor |

The `replaceRawFragments` rewrite (`source/builder/modules/html-ast-renderer.ts:470-500`) is the right shape — one global regex over all tokens, resolved through the map in a replacer callback. Because `String.replace` never re-scans replacement text, a raw value containing a placeholder-shaped element is now preserved *verbatim* rather than hijacked:

```
a = <template id="kbr-raw-fragment-1"></template>,  b = <em>B</em>
-> <div><template id="kbr-raw-fragment-1"></template><em>B</em></div>
```

That is Gate 2.2's byte-for-byte guarantee holding under adversarial input. Narrowing the pattern to `<template id="..."></template>` (rather than `<[^>]+`) is also now safe, since `data-kbr-html` is template-only.

**Correction to the round-2 review:** it suggested the `count > 1` check might be dead like its predecessor. It is not. There is a live path — a page whose body re-emits a raw value that itself contains a placeholder, colliding with the layout's own token across the two render passes — and it fails loudly with a source location rather than corrupting output. That is Implementation Step 8 working as specified. The diagnostic points at the legitimate fragment (`partials/head.html:line 40`) rather than the content that injected the collision, which is worth improving if it ever fires in practice, but the guard itself is correct.

## New: the two-pass structure in `TemplateProcessor` re-walks rendered output

The renderer-level "walk exactly once" fix is complete and holds. But `source/builder/template-processor.ts:87-97` reintroduces a second walk from the caller:

```ts
if (content.includes("data-kbr-page")) {
  const page = this.astRenderer.render(content, variables);  // pass 1: interpolates
  astVariables = { ...variables, ...page.metadata };
  pageContent = page.html;                                    // already-rendered HTML
}
return this.astRenderer.renderPage(pageContent, astVariables, ...);  // pass 2: walks it again
```

`page.html` is fully-rendered output, and `renderPage` parses and walks it a second time. Two consequences, both confirmed by probe.

### Double interpolation returns through this path

With `description = "{{ keywords }}"` and `keywords = "LEAKED"`, a page body of `<p>{{ description }}</p>` renders:

```
H1 body: "page-content\"><p>LEAKED</p></main>"
```

Pass 1 substitutes `{{ description }}` to `{{ keywords }}`; pass 2 substitutes that to `LEAKED`. Same injection class as the include bug, same fix needed one layer up. The regression test `walks included fragments exactly once` correctly covers the renderer, but nothing covers the caller.

### Metadata is extracted one pass too late for the body that declares it

Page metadata is gathered *during* pass 1, so it is not in scope while pass 1 interpolates. The result is that the same expression resolves to two different values in one document:

```
H2 layout <title>: META TITLE     <- from <meta name="title"> via pass 2
H2 body   {{ title }}: HEADING    <- pass-1 fallback (h1 extraction)
```

And custom metadata never reaches the body at all — `<meta name="custom" content="CUSTOMVAL">` with `{{ custom }}` in the body renders empty (`data-kbr-page custom reaches template: false`).

### Exposure

All five authored pages (`index`, `career`, `blog`, `portfolio`, `_theme-demo`) take this path; generated Markdown does not, since it carries no `data-kbr-page`. No authored page currently uses `{{ }}` in its body, so both bugs are latent today — they activate the first time someone writes `<h1>{{ title }}</h1>` in a page. That is a natural thing to reach for given the metadata is right there at the top of the file.

### Fix

Separate metadata extraction from rendering. Parse the page once, pull `data-kbr-page` metadata without interpolating, merge it into the variables, then do exactly one interpolating walk — and hand `renderPage` the parsed fragment rather than a re-parsed HTML string. That removes both symptoms and the string round-trip between passes.

## Carried over, still open

Unchanged from the previous reviews; all cleanups, none blocking:

- **`assetNodes` round-trips through HTML strings** (`source/builder/modules/html-ast-renderer.ts:439`), and `kind: string | undefined` remains looser than the validated `"head" | "body"` it receives.
- **`walk()` is 150 lines.** Both bugs fixed last round lived in its index arithmetic; `data-kbr-for` will add a ninth branch to it.
- **`requiredTargets`** (`source/builder/modules/html-ast-renderer.ts:635`) still names a list of directives-requiring-values.

## Assessment

The renderer itself is in good shape — Gates 2.1 and 2.2 hold under the adversarial inputs that could be constructed, and the diagnostics carry source locations everywhere except the one collision message noted above. The remaining defects have migrated out of `html-ast-renderer.ts` and into its caller.

Recommended: fix the `TemplateProcessor` two-pass before Phase 3, since it is the same defect class the phase already fixed once and it is a contained change (roughly: add a metadata-only extraction, drop the HTML round-trip). The `walk()` split still reads better as the opening move of Phase 3 than as a Phase 2 blocker.
