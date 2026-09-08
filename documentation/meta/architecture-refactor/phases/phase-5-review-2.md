# Phase 5 Review (Round 2): Static Content And Progressive Enhancement

Follow-up review after the fixes applied in response to `phase-5-review.md`. The headline architectural finding is fully resolved. Two new issues were found, one of which changes rendered content.

**Verification status:** `npx tsc --noEmit` clean, `npm run build` succeeds, **1 of 90 tests fails**.

## Confirmed fixed

| Finding | Evidence |
|---|---|
| TypeScript HTML builders | `static-content.ts` 437 to 230 lines, **0 HTML tag literals**, 5 new `.html` partials |
| `escapeHtml` duplicated | private copy removed; only `modules/html-utils.ts:9` remains |
| No accessible announcements | `role="status" aria-live="polite" aria-atomic="true"` on empty state and a new `[data-filter-results]` region |
| Four-branch nested ternary | replaced with a `Map<string, Partial<TemplateVariables>>` lookup |
| Hard-coded test counts | now derived from `blogManifest.posts.length` and a reduce over `experienceData` |
| Doc test-count drift | corrected to 90 |

The migration is high quality. `blog-static-content.html`, `home-highlights.html`, `timeline-static-content.html`, `post-series.html`, and `supplement-list.html` are declarative partials using `data-kbr-for`, `data-kbr-if`, and `{{ }}`, so escaping is automatic again and the markup is back inside the AST renderer that Phases 2 and 3 built. `static-content.ts` is now purely view-model construction, which is exactly the shape Step 1 asked for.

The enhancement module correctly populates the new live region with counts:

```ts
resultsStatus.textContent = normalizedTag
  ? `${visibleCount} ${visibleCount === 1 ? "post" : "posts"} found for ${normalizedTag}.`
  : `${visibleCount} ${visibleCount === 1 ? "post" : "posts"} shown.`;
```

That closes the Gate 5.3 announcement gap.

## Blocker: the suite does not pass, and four snapshots are stale

`build-output.test.ts > matches the built HTML pages and manifests` fails. The doc's line 41 states "Updated output snapshots and verified `npm test` passes: 16 test files and 90 tests" — the count is right, the pass claim is not.

The test throws on the first mismatch, so the failure message only names `blog.html`. Comparing every snapshot against `dist` (normalizing asset hashes) shows **four** stale files:

```
stale snapshots: 4
  index.html
  blog.html
  intentional-work-patterns.html
  career.html
```

Three of those are hidden behind the first failure and will surface one at a time as each is regenerated.

**The differences are whitespace-only — no content is lost.** Verified by normalizing whitespace and diffing; the only content-level deltas are asset hashes, which the test already normalizes. The migration to partials reflows text nodes:

```
- <div class="ui-label filter-title" id="blog-filter-title">Filter by Tag</div>
+ <div class="ui-label filter-title" id="blog-filter-title"> Filter by Tag </div>

- <button class="post-tag" type="button" data-tag="AI">AI</button>
+ <button class="post-tag" type="button" data-tag="AI"> AI </button>
```

This is not purely cosmetic. Leading and trailing whitespace inside an `inline-block` or flex button renders as a real space, so every tag pill and the filter title gain padding they did not have before. Regenerating the snapshots is the fix, but the reflow should be looked at in the browser first — if the pills widen visibly, the partials need their interpolations tightened (`>{{tag}}<` rather than a newline-separated `{{tag}}`).

## Content regression: timeline descriptions are reordered

`buildTimelineStaticModel` partitions each description into two independent lists:

```ts
paragraphs: lines.filter((line) => !line.startsWith("•")),
bullets: lines
  .filter((line) => line.startsWith("•"))
  .map((line) => line.slice(1).trim()),
```

and `timeline-static-content.html` renders all paragraphs, then all bullets. Authored descriptions interleave the two — a paragraph introduces a group of bullets, then another paragraph introduces the next group. Scanning the real `public/data/experience-data.json`:

```
INTERLEAVED: 3M       | Senior Technical Writer/Web Developer | ppbbp
INTERLEAVED: 3M       | Technical Writer                      | pbbbpbbpbbpb
INTERLEAVED: Lightcast| Technical Writer                      | ppbbbbpbbbbpbbbbpbb
INTERLEAVED: Purch    | Electronics Writer                    | ppbbbbbbpbbbpbbbpbbpbbbb
interleaved positions: 4 | positions with >1 paragraph line: 6
```

Four real career entries are affected. The Purch entry authored as four paragraph-introduced bullet groups now renders as six stacked paragraphs followed by one undifferentiated 18-item list — confirmed in `dist/career.html`, whose tag order is `p p p p p p ul li li li ...`.

For reference, the deleted Lit component did not parse bullets at all. `timeline-entry.ts` only did:

```ts
return description.replace(/\\n/g, "\n").replace(/\\"/g, '"');
```

and relied on `white-space: pre-line` CSS, so authored order was preserved by construction. Both Phase 5 rounds diverge from that, but round 1's `renderTimelineDescription` walked lines in order with alternating `flushParagraph`/`flushBullets` calls, so it at least kept the interleaving. The round-2 partition model does not.

**Fix:** make the view model a single ordered list of blocks rather than two parallel arrays — for example `blocks: Array<{ kind: "paragraph"; text } | { kind: "list"; items }>` — and render it with one `data-kbr-for` plus `data-kbr-if` per block kind. That preserves authored order and keeps the markup declarative. Consecutive paragraph lines should also be rejoined into a single `<p>`; the old parser did this with `paragraph.join(" ")` and the current one emits one `<p>` per line, which affects the 6 positions with multiple paragraph lines.

## Still open

**Icons ship twice.** Unchanged: the Vite transform inlines every SVG into the `ICONS` map, and `publicDir` still copies all 17 files (68K) into `dist/assets/icons`, where nothing requests them. Step 8's "remove per-icon HTTP fetches" is satisfied; the dead files are still deployed.

**`noWebsite` is an inverse flag in the view model.** `timeline-static-content.html` renders the company heading twice, once inside an `<a data-kbr-if="company.website">` and once inside a `<span data-kbr-if="company.noWebsite">`, which requires the model to carry a derived negation. This is a reasonable workaround given the directive language has no `else`, and Phase 3's handoff explicitly said not to broaden template expressions to compensate — but it does duplicate `{{company.heading}}` in two places, so a future edit has to remember both.

**Browser gates remain manual by decision.** The doc now states this plainly rather than listing it as outstanding work:

> Browser evidence is intentionally manual for this phase. The repository does not add a browser-test dependency; the documented browser checks remain the accepted validation method.

That is a defensible call and an improvement over the previous wording, which listed a harness as required work while the Handoff forbade proceeding without it. Worth noting that Gates 5.1 through 5.3 as written still say "before" and describe browser steps, so the gate text and the accepted validation method now disagree; aligning the gate wording would remove the ambiguity for Phase 6.

## Assessment

The architectural regression is genuinely reversed — this is now the phase the plan described, with markup in fragments, view models in TypeScript, and escaping handled by the renderer. The `Map` lookup, derived test counts, and live region are all clean.

Two things to resolve before Phase 6, which is meant to remove glue code without altering rendered output:

1. **Fix the timeline description ordering**, then regenerate all four stale snapshots and confirm `npm test` passes. Doing this after Phase 6 starts would make it a rendered-output change inside a phase that forbids them.
2. **Check the whitespace reflow in a browser.** If the tag pills and filter title widened, tighten the interpolations before baking the new spacing into snapshots.

The icon double-ship and the `noWebsite` flag are minor and can ride along with Phase 6's cleanup.
