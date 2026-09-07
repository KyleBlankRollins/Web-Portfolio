# Phase 2 Review: HTML AST Renderer

Review of the Phase 2 implementation against the objective and hard gates in `phase-2-html-ast-renderer.md`.

**Verification status at time of review:** `npx tsc --noEmit` is clean and all 60 tests pass. The suite is passing over a serious regression — see the blocker below. Each finding in this review was reproduced in isolation before being reported.

## Blocker: every blog post's body content is dropped

All generated Markdown posts now render with an empty `<article>`. Reproduced directly against the real templates:

```
HAS BODY TEXT: false
ARTICLE: blog-post-content glass-surface">
```

**Mechanism.** `source/builder/html-utils.ts:51` sets `content: ""` in `templateVariables` — a leftover from the legacy engine, where the page body was injected by the template's own mechanism rather than passed as a variable. Meanwhile `source/builder/template-processor.ts:83` handles content that lacks a `data-kbr-page` directive by synthesizing:

```ts
let pageContent = '<template data-kbr-html="content"></template>';
```

That resolves `variables.content`, which is `""`. The actual page HTML — sitting right there in the `content` parameter — is never used. Authored pages escape this because they all carry `data-kbr-page` and take the `page.html` branch; generated Markdown carries none, so it takes the empty branch.

**Scope.** Authored pages (`index`, `career`, `blog`, `portfolio`) are fine. Every blog post is not:

```
llm-as-sme                       article-empty=YES
rule-of-thirds                   article-empty=YES
intentional-work-patterns        article-empty=YES
leading-through-change           article-empty=YES
docs-as-interface                article-empty=YES
ai-agent-workflows               article-empty=YES
```

**This is recorded in the committed snapshots.** `llm-as-sme.html.snap` went `+20 -154`, and the deleted lines are the post itself:

```
-<p>Interacting with subject matter experts (SMEs) is a primary responsibility for most technical writers...
-<p>SME roles can range from product manager to customer support to CEO...
```

The phase doc lists "Updated and reviewed build-output snapshots for AST serialization changes" as complete. Six posts losing their entire body is not a serialization change, and the snapshot review did not catch it. That also means Gate 2.3's "review exact snapshot diffs for intentional directive/asset changes only" did not actually hold — the diffs were accepted, not reviewed. Since `renderSite` is shared, dev and prod are equally affected, and the dev/prod parity test still passes because both sides are equally empty.

**Fix:** stop routing page content through a variable. Pass the parsed page fragment into the slot directly, as the `data-kbr-page` branch already does.

## Raw-fragment tokens are not unique

`source/builder/modules/html-ast-renderer.ts:212`:

```ts
const token = `${RAW_TOKEN_PREFIX}${index}-${nodes.length}`;
```

The token is derived from the node's position in its sibling list, not from a counter. Two `data-kbr-html` elements at the same index in equal-length sibling lists produce the same token. Probe:

```
input:  <div><template data-kbr-html="a"></template></div>
        <div><template data-kbr-html="b"></template></div>
output: <div><em>BBB</em></div><div><template id="kbr-raw-fragment-0-1"></template></div>
```

Two failures at once: `a`'s slot receives `b`'s content (the `Map.set` silently overwrote), and the second placeholder survives into the output as a literal `kbr-raw-fragment` element. That directly contradicts the Completion Evidence item "output contains no `data-kbr-*` build directives," and Implementation Step 8's "Reject token collisions" is not implemented — the existing `Raw fragment token collision or loss` error at `source/builder/modules/html-ast-renderer.ts:390` only fires when a token is *missing*, never when two collide.

`blog-post.html` currently escapes this only because whitespace text nodes happen to give `tagsHtml` and `citationsHtml` different indices. Reformatting the template — a Prettier run collapsing whitespace — is enough to silently swap or drop content. Correctness should not depend on indentation.

**Fix:** use a render-scoped monotonic counter, and assert `!rawFragments.has(token)` before setting.

## Includes are walked twice, which re-interpolates rendered values

`source/builder/modules/html-ast-renderer.ts:167-169` walks the included fragment, then splices it in and rewinds:

```ts
nodes.splice(index, 1, ...includedFragment.childNodes);
index -= 1;
continue;
```

After the splice, `index -= 1` followed by the loop's `index += 1` lands back on the first inserted node — which was already walked. Every included node is processed twice, and the second pass interpolates values that the first pass just substituted in. Probe:

```
partial: <p>{{ evil }}</p>
vars:    { evil: "{{ secret }}", secret: "LEAKED" }
output:  <p>LEAKED</p>
```

A value containing `{{ ... }}` gets re-resolved against the variable scope — template injection through ordinary content. Gate 2.2 exists specifically to guarantee literal `{{ value }}` text survives; it does inside opaque raw fragments, but not inside includes, and no fixture covers that path. The second pass also carries the *outer* `sourcePath`, so diagnostics from included files would be misattributed on that pass.

**Fix:** either walk the fragment and skip past it, or splice first and let the rewind do the walking — not both.

## Gate 2.3 can no longer be performed

The gate reads "**Before deleting the legacy renderer:** 1. Render every Phase 0 fixture with the old implementation and the AST renderer." `template-engine.ts` and `metadata-extractor.ts` are deleted in this same change, so the A/B comparison the gate requires is now impossible to run.

The test named `matches legacy rendering for raw content in a Phase 0-style fixture` (`source/builder/modules/html-ast-renderer.test.ts:144`) does not involve the legacy renderer — it compares against a hardcoded expected string. The name asserts a guarantee the test does not provide.

**Fix:** rename the test. Snapshot review is a legitimate substitute for the A/B, but only if the diffs are actually reviewed, which the blocker above shows they were not.

## Gate 2.1's location requirement is only half met

Pass condition: "every invalid fixture fails with **its source file and location**." Two of the failure cases the gate names explicitly throw bare errors:

```
D ESCAPE ERR: Include escapes the template source root: ../../etc/passwd
D CYCLE ERR:  Recursive template include: a.html -> a.html
```

No file, no line. `resolveIncludePath` even receives `sourcePath` as a parameter and ignores it (`source/builder/modules/html-ast-renderer.ts:296`). The tests at `source/builder/modules/html-ast-renderer.test.ts:72-91` assert only `.toThrow("escapes the template source root")` — a substring match written to fit the current behavior rather than the gate. The malformed-directive test does assert location, which shows the intended bar.

Also missing: Gate 2.1 step 2 lists "unresolved required paths" as a failure fixture, but there is no required-path concept in the renderer. `{{ nope.deep }}` renders as `""` silently — which is exactly how the blocker above stayed invisible.

## `data-kbr-html` silently destroys its host element

`source/builder/modules/html-ast-renderer.ts:213-214` does `element.attrs = [{ name: "id", value: token }]`, then the whole element is replaced by the raw fragment:

```
input:  <div class="keepme" data-kbr-html="v"></div>
output: <em>X</em>
```

The `class` and the wrapper element both vanish with no diagnostic. `data-kbr-include` and `data-kbr-page` are both restricted to `<template>` via `requireTemplateDirective`; `data-kbr-html` should be too, since any host element is silently discarded anyway. The existing test at `source/builder/modules/html-ast-renderer.test.ts:93` uses a `<div>` host, which locks in the permissive behavior.

## Smaller items

**`isCompleteHtmlDocument` bypass.** `source/builder/template-processor.ts:66` returns content unchanged when it looks like a full document — no directives processed, **no assets injected**. Nothing hits it today, but it is a silent trapdoor: a page that starts with `<html` gets shipped with no stylesheet or script tags and no error. Given `data-kbr-assets` now owns asset placement, this branch should throw rather than pass content through.

**Doubled attribute lookup.** `source/builder/modules/html-ast-renderer.ts:206-207` calls `this.attribute(element, "data-kbr-html")` twice and then uses `!` to defeat the narrowing it just discarded. One `const` removes both.

**`walk()` is doing too much.** Roughly 120 lines handling text interpolation, includes, page metadata, conditionals, raw fragments, assets, slots, and attribute interpolation in one loop, with in-place `splice` and manual index arithmetic in four places. Each directive is independently testable; splitting them into `applyInclude` / `applyConditional` / `applyRawFragment` / `applyAssets` returning a small "what to do with this node" result would make the index bookkeeping (the source of the double-walk bug) exist in exactly one place.

**`loadInclude`'s triple fallback.** `source/builder/modules/html-ast-renderer.ts:308-313` tries `partials.get(name)`, then retries with the `partials/` prefix stripped, then `templates.get(name)`. Three strategies papering over `loadSiteSource` storing partials both under bare names *and* under `partials/x.html` inside `templates` — the duplicate-loading issue from Phase 1. Fixing the loader to key partials one way collapses this to a single lookup.

**`assetNodes` round-trips through HTML strings.** `source/builder/modules/html-ast-renderer.ts:330-360` builds tag strings, escapes the href, then re-parses each through `parseFragment` to get nodes back. Now that `SiteAssets` is a typed union, constructing the element nodes directly skips the escape/parse round trip and the per-asset parser invocation. The `kind: string | undefined` parameter is also looser than the validated `"head" | "body"` it actually receives, and the paired ternaries (`kind === "body" ? [] : head`) read backwards.

**Dead code.** `TemplateProcessor.clearCache()` is an empty method body (`source/builder/template-processor.ts:96`) — the caches it cleared are gone. `astRendererSource` is stored alongside the renderer that already holds it. `requiredTargets` at `source/builder/modules/html-ast-renderer.ts:530` is a list of directives requiring non-empty values, not "targets."

**Shared mutable renderer.** One `HtmlAstRenderer` instance serves every page in a build, carrying `includeStack` across renders. The `try`/`finally` keeps it balanced today, but instance state that spans independent page renders sits awkwardly against the Phase 1 purity boundary.

## Doc inconsistencies

Same pattern as Phase 1 — the status lines contradict each other:

- Line 18: "AST integration and site migration are complete; **parity and legacy deletion remain**."
- Line 38: "Removed the legacy template engine, metadata extractor, processor compatibility path, and raw-variable allowlist." (marked `[x]`)
- Line 44: "None for Phase 2."
- Line 46: "Phase 2 is ready for final verification."

Line 18 is stale relative to line 38, and lines 39-40's "Confirmed the full test suite passes" is true but, as shown, not evidence of correctness.

## Suggested order

1. **Blog post content loss** — the site currently builds six empty posts. Everything else waits.
2. **Token uniqueness** and **the include double-walk** — both are silent-wrong-output bugs, both are small fixes, and both need fixtures that would have caught them.
3. **Regenerate and genuinely review the snapshots** once 1 and 2 are fixed; the current ones encode the regression as expected output.
4. **Gate 2.1 diagnostics** (location on escape/cycle) and the `data-kbr-html` host restriction.
5. Structural cleanups in `walk()`, `loadInclude`, and `assetNodes` before Phase 3 adds `data-kbr-for` on top of them.
