# Phase 5 Review: Static Content And Progressive Enhancement

Review of the Phase 5 implementation against the objective and hard gates in `phase-5-static-content-enhancement.md`.

**Verification status:** `npx tsc --noEmit` clean, 90 tests across 16 files, `npm run build` succeeds. The behavior goals are met; the implementation reintroduces a pattern earlier phases deliberately removed.

## What works

The user-facing outcome is real. The build-output gate added in `source/builder/build-output.test.ts` is good, repeatable coverage:

```ts
expect(blogHtml.match(/data-static-blog/g)).toHaveLength(1);
expect(blogHtml.match(/data-post-card/g)).toHaveLength(7);
expect(blogHtml).not.toMatch(/<kbr-(?:post-list|post-card|tag-filter)\b/i);
expect(careerHtml.match(/class="timeline-entry"/g)).toHaveLength(15);
expect(careerHtml).not.toMatch(/<kbr-(?:timeline|timeline-entry)\b/i);
```

That covers Gate 5.2's duplicate-prevention requirement statically — exactly one static container per page and no legacy mounts.

`source/site/static-blog-enhancement.ts` is the strongest code in this phase: DOM-only filtering over pre-rendered cards, no fetches, `aria-pressed` on controls, `CSS.escape` on the selector, URL state through `replaceState`, focus management after activation, and correct empty-state toggling. It is a textbook progressive-enhancement module.

The four timeline component files are genuinely deleted, the runtime icon fetch is gone, and icons are bundled at Vite transform time.

Two findings from the Phase 4 review were also fixed here: `loadSiteSource` now takes an explicit `publicRoot` parameter instead of escaping `siteRoot` by `../..` traversal, and `site-content.ts` no longer emits `data/experience-data.json`, leaving Vite's `publicDir` as its single owner.

## Headline: TypeScript HTML builders are back

`source/builder/static-content.ts` is 437 lines that build HTML by string concatenation:

- 39 raw HTML tag literals
- 71 template interpolations
- 32 manual `escapeHtml(...)` call sites
- zero imports of `HtmlAstRenderer`, and no `.html` fragment files

This is the exact pattern Phase 3 removed. Phase 3's Step 8 read "Delete TypeScript HTML builders after their template outputs replace them," and its Completion Evidence claimed "Deleted TypeScript HTML builders with no remaining imports." Phase 3 replaced them with declarative fragments — `blog-tags.html`, `blog-metadata.html`, `blog-citations.html` — using `data-kbr-for`, `data-kbr-if`, and `{{ }}`.

Phase 5's own Step 1 asks for the same thing: "Create HTML fragments and typed view models for post cards, tag controls, highlights, series navigation, and supplement items." What was built is view models plus string templates, not fragments. Compare the two styles for the same job:

Phase 3, `blog-citations.html`:
```html
<template data-kbr-for="citation of citationItems">
  <li id="citation-{{citation.id}}">
    <em>{{citation.title}}</em> by {{citation.author}}
  </li>
</template>
```

Phase 5, `static-content.ts`:
```ts
`<article class="highlight-item">
   <h3><a href="${escapeHtml(latestPost.url)}">${escapeHtml(
     latestPost.title
   )}</a></h3>
   <p>${escapeHtml(latestPost.description)}</p>
 </article>`
```

The second form loses automatic escaping, source-located diagnostics, and directive validation — the three things Phases 2 and 3 were built to provide.

## The three largest pages bypass the renderer entirely

The generated strings reach the page through `data-kbr-html`:

| Page | Injection |
|---|---|
| `blog.html` | `<template data-kbr-html="blogStaticContent"></template>` |
| `index.html` | `<template data-kbr-html="blogStaticContent"></template>` |
| `career.html` | `<template data-kbr-html="timelineStaticContent"></template>` |

`data-kbr-html` is the opaque raw-fragment escape hatch designed in Phase 2 for trusted Markdown post bodies — it is replaced post-serialization and is never parsed, escaped, validated, or given source origins. Routing build-generated structural markup through it means the blog index, homepage, and career page sit outside the AST renderer that Phases 2 and 3 exist to provide.

## Escaping is correct today, but it is now manual

I audited all 32 `escapeHtml` call sites and the interpolations that lack one. **No escaping bug is present.** The unescaped interpolations are legitimately pre-rendered HTML (nested render results, `.map().join()` output) or numbers. `renderTimelineCompany` and `renderTimelinePosition` escape every field they emit, including `href` attributes.

The finding is structural rather than a defect: correctness now depends on an author remembering `escapeHtml` at every new interpolation. In the template form, escaping is the default and forgetting it is impossible. One missed call in a future edit is a silent output-corruption bug with no test that would catch it.

`escapeHtml` is also now duplicated — `source/builder/modules/html-utils.ts:9` exports one and `source/builder/static-content.ts:430` defines a private copy with the same five replacements.

## Gates 5.1, 5.2, and 5.3 are not formally passed

The doc is honest about this in its own Partial and Remaining sections:

> Browser evidence exists for the static blog/home content and filtering behavior, but it is not yet checked into a repeatable browser test or formal screenshot artifact.

> Add a browser-test harness or formal checked-in browser evidence for Gates 5.1, 5.2, and 5.3.

Confirmed: no Playwright or other browser harness is installed (`vitest` is the only test dependency). All three gates require browser verification — JavaScript-disabled loading (5.1), pre- and post-upgrade DOM and screenshots (5.2), and interactive filtering (5.3). The Completion Evidence section asks for "JavaScript-disabled browser test results/screenshots," and the Handoff says "Proceed only after all gates pass."

The recorded manual numbers (2, 2, 7, and 0 visible cards) are plausible and match what the code should do, but they are not reproducible by anyone else and will not detect a regression.

## Gate 5.3 gap: no accessible announcements

Gate 5.3 step 3 requires confirming "card visibility, selected control state, counts if shown, and **accessible announcements**/focus behavior."

Focus behavior and control state are handled well. Announcements are not implemented — there is no `aria-live` region, `role="status"`, or `aria-atomic` anywhere in `static-content.ts` or `static-blog-enhancement.ts`. Filtering toggles `card.hidden` and the empty state's `hidden` attribute with no announcement, so a screen-reader user activating a tag hears nothing and gets no indication that the result set changed or became empty. Wrapping the empty state and a visible/visually-hidden result count in `role="status"` would close this.

## Smaller items

**Hard-coded content counts in the build gate.** `toHaveLength(7)` for post cards and `toHaveLength(15)` for timeline entries couple the test to content volume — publishing an eighth post breaks a test that has nothing to do with the change. Deriving the expected count from the blog manifest and experience data would keep the duplicate-prevention intent without the brittleness.

**Four-branch nested ternary for page metadata.** `source/builder/site-content.ts:29-41` maps `outputPath` to metadata through chained ternaries covering `career.html`, `blog.html`, `index.html`, and a default. Each new static page adds another nesting level. A small lookup map keyed by output path would read better and stay flat.

**A fourth ad-hoc parser.** `renderTimelineDescription` (`source/builder/static-content.ts:360-399`) hand-parses a bullet format where lines beginning with `•` become `<li>` and the rest become paragraphs. The repository already has Markdown, TOML, and HTML AST parsers; the timeline description is prose that Markdown already handles.

**Icons ship twice.** The Vite transform inlines every SVG into the `ICONS` map, and `publicDir` still copies all 17 files (68K) into `dist/assets/icons`. Nothing requests them any more. Step 8's "remove per-icon HTTP fetches" is satisfied; the now-dead files are still deployed.

**Static content round-trips through JSON.** `renderBlogStaticContent(manifestJson: string)` and `renderTimeline(experienceJson: string)` take serialized JSON and `JSON.parse` it back into loosely-typed shapes via `as` casts. Phase 4 built a typed `ContentGraph`, and its Handoff said "Phase 5 consumes typed graph collections." Phase 5 correctly avoids the runtime *fetch*, but consumes a JSON string rather than the typed graph, so the type safety Phase 4 established is discarded at this boundary.

**Doc drift.** Line 41 records "16 test files and 88 tests"; the suite currently reports 16 files and 90 tests.

## Assessment

Phase 5 achieves its objective: content known at build time is rendered into meaningful, styled HTML, first-paint data fetches are gone, and the enhancement module is well-built. Deleting the timeline components rather than leaving them mounted is the right call, and the enhancement contracts are documented per component as Step 4 requires.

The cost is architectural. Phases 2 and 3 spent four review rounds building and hardening an AST renderer specifically so HTML would stop being assembled from TypeScript strings, and Phase 5 reintroduces that for the three highest-traffic pages while routing the output around the renderer through `data-kbr-html`.

Recommended before Phase 6:

1. Move the card, tag-control, highlight, and timeline markup into `.html` fragments driven by `data-kbr-for` / `data-kbr-if`, as Step 1 specifies and as Phase 3 already did for citations. The view models in `static-content.ts` are the right shape and can be kept as-is; only the string assembly needs to move.
2. Add the `aria-live` region Gate 5.3 requires.
3. Either install a browser harness and check in the Gate 5.1-5.3 evidence, or amend the doc to state plainly that those gates are deferred — the Handoff currently forbids proceeding without them.

Item 1 is the one that matters for Phase 6, which is described as removing obsolete glue code without altering rendered output. Migrating the markup afterward would be a rendered-output change, so it belongs before that boundary rather than after.
