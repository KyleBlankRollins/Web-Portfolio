# Phase 5: Static Content And Progressive Enhancement

## Objective

Render content known at build time into meaningful, styled HTML, then retain only the client behavior that actually requires JavaScript.

## Scope

- Statically render the blog index, tag controls, home highlights, series navigation, and supplement lists.
- Define an explicit enhancement/styling contract for every affected shadow-DOM component.
- Replace runtime manifest/data fetches required for first paint.
- Turn tag filtering into DOM behavior over pre-rendered cards.
- Inline or bundle icon data where it avoids per-icon fetches.

Do not reintroduce a second renderer or client-side duplication of static content.

## Implementation Steps

1. Create HTML fragments and typed view models for post cards, tag controls, highlights, series navigation, and supplement items.
2. Render blog cards and filter controls from `ContentGraph`, attaching the tag data required for client-side DOM filtering.
3. Render home highlights from loaded experience data and render post-specific series/supplement navigation.
4. For each affected component, choose exactly one contract:
   - static HTML plus page CSS and a small behavior module;
   - a component that enhances existing light DOM with styles moved from Shadow DOM; or
   - an intentional client-only component with a documented no-JS fallback.
5. Implement the selected contract. Never mount a shadow-DOM renderer that hides or duplicates server-rendered light DOM.
6. Replace composed event coordination between tag filter and post list with DOM filtering over the static cards.
7. Remove first-paint data fetches and retain `blog-manifest.json` only where a remaining dynamic API has a demonstrated need.
8. Inline/bundle icon assets and remove per-icon HTTP fetches where technically practical.

## In Progress

### Completed

- Added typed build-time view models for static content and rendered the page markup through the existing HTML AST partial system.
- Replaced the blog page's empty `kbr-tag-filter` and `kbr-post-list` mounts with escaped, styled static HTML.
- Added DOM-only tag filtering over pre-rendered cards, including URL state, active-button state, clear behavior, and empty-state handling.
- Rendered homepage highlights from the build-time blog manifest and loaded experience data.
- Rendered post-specific series navigation and supplement lists from generated post metadata.
- Added page-level styling and focused renderer tests for the static blog and homepage content.
- Updated output snapshots and verified `npm test` passes: 16 test files and 91 tests.
- Verified `npm run build` passes and generated blog/home pages contain static content without the legacy first-paint mounts.
- Verified with browser checks that the blog and homepage retain meaningful content with JavaScript requests blocked.
- Verified enabled-JavaScript filtering for overlapping tags, clearing, and a no-match tag: 2, 2, 7, and 0 visible cards respectively.
- Bundled all supported SVG icons at Vite transform time and removed the runtime icon fetch path; obsolete blog-renderer registrations were also removed from the site entry point.
- Verified the homepage and a blog post using admonition icons make no requests for blog manifest data, experience data, or icon assets.
- Added a repeatable build-output gate covering static blog/home content, emitted card count, and absence of legacy blog renderer mounts; the focused build-output suite passes.
- Re-verified with scripts blocked that the blog exposes 7 post cards with no legacy mounts and the homepage exposes 2 highlight items plus 3 navigation cards with no legacy home mount.
- Re-verified enabled-JavaScript filtering: AI shows 2 cards, overlapping intentionality shows 2, clearing restores 7, and an unknown tag shows 0 cards with the empty state visible.
- Re-verified the homepage network audit has no blog-manifest, experience-data, or icon requests.
- Converted the career timeline to build-time static light DOM with page-level CSS and retained only the table-of-contents enhancement.
- Added repeatable career-output assertions and verified the no-script career page exposes 8 companies and 15 entries without legacy timeline elements.
- Verified the enabled career page makes no experience-data or icon requests.
- Added a polite live result announcement for tag filtering, including zero-result states.
- Replaced hard-coded output counts in the build gate with counts derived from the generated manifest and experience source data.
- Removed the TypeScript HTML string builders and duplicate escaping helper; static-content code now prepares typed template models only.
- Preserved authored timeline description order with ordered paragraph/list blocks and grouped consecutive paragraph lines.
- Tightened inline tag interpolations to prevent template whitespace from widening filter and post-tag controls.
- Regenerated four affected snapshots; the full suite now passes with 16 test files and 91 tests.

### Enhancement Contracts

- Blog index: build-time static HTML plus `static-blog.css` and `static-blog-enhancement.ts` for filtering only.
- Homepage highlights: build-time static HTML plus page CSS; no client enhancement.
- Series and supplement navigation: build-time static HTML plus page CSS; no client enhancement.
- Timeline: build-time static HTML plus page-level CSS, with `kbr-table-of-contents` as the only client enhancement.
- Icons: all supported SVG data is bundled at build time; the component renders the bundled map without network requests.

### Partial

- Browser evidence is intentionally manual for this phase. The repository does not add a browser-test dependency; the documented browser checks remain the accepted validation method.

### Remaining

- Retain the legacy blog data modules until their remaining consumers and documentation are handled by a separate cleanup slice.
- Formal browser automation is deferred by decision; manual checks cover JavaScript-disabled content, enhancement parity, filtering, announcements, and network behavior.
- Final manual checks confirmed the first tag control renders as `AI (2)`, filtering shows 2 cards and announces the result, and the career description renders in authored paragraph/list order.

## Hard Gates

### Gate 5.1: JavaScript-Disabled Content

Manual validation record for retained enhancement components:

1. Build the site.
2. Load the blog page and homepage with JavaScript disabled.
3. Confirm visible, styled post titles, descriptions, dates, links, tags, highlights, and static navigation.

**Pass condition:** The core content is usable and meaningful without JavaScript.

### Gate 5.2: Enhancement Does Not Regress First Paint

Manual validation record before declaring a component enhanced:

1. Capture the initial page DOM and screenshot before custom elements upgrade.
2. Enable JavaScript and wait for enhancement.
3. Confirm no duplicate cards/controls, no hidden static content, and no visual layout shift attributable to component replacement.
4. Confirm static content styling comes from page CSS or an explicitly documented equivalent.

**Pass condition:** Enhancement changes behavior only; it does not replace the accessible static content.

### Gate 5.3: Filtering Behavior

Manual validation record before removing the legacy post-list/tag-filter data path:

1. Use at least two tags, overlapping tags, and a no-match tag in the browser check.
2. Activate and clear each filter.
3. Confirm card visibility, selected control state, counts if shown, and accessible announcements/focus behavior.

**Pass condition:** Filtering operates on pre-rendered DOM with no manifest fetch or duplicate component render.

## Completion Evidence

- Manual JavaScript-disabled browser results and screenshots.
- Enhancement-contract decision record for each affected component.
- Repeatable build-output checks plus recorded manual evidence for tag filtering and duplicate-content prevention.
- Network evidence that first paint does not require blog manifest, experience data, or per-icon fetches.
- Reviewed output-snapshot changes plus passing `npm test` and `npm run build`.

## Handoff To Phase 6

Proceed only after all gates pass. The final phase removes obsolete glue code; it must not alter the established rendered output or enhancement contracts.
