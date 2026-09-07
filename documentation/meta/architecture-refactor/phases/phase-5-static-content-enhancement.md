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

## Hard Gates

### Gate 5.1: JavaScript-Disabled Content

Before retaining any enhancement component:

1. Build the site.
2. Load the blog page and homepage with JavaScript disabled.
3. Confirm visible, styled post titles, descriptions, dates, links, tags, highlights, and static navigation.

**Pass condition:** The core content is usable and meaningful without JavaScript.

### Gate 5.2: Enhancement Does Not Regress First Paint

Before declaring a component enhanced:

1. Capture the initial page DOM and screenshot before custom elements upgrade.
2. Enable JavaScript and wait for enhancement.
3. Confirm no duplicate cards/controls, no hidden static content, and no visual layout shift attributable to component replacement.
4. Confirm static content styling comes from page CSS or an explicitly documented equivalent.

**Pass condition:** Enhancement changes behavior only; it does not replace the accessible static content.

### Gate 5.3: Filtering Behavior

Before removing the legacy post-list/tag-filter data path:

1. Use at least two tags, overlapping tags, and a no-match tag in browser tests.
2. Activate and clear each filter.
3. Confirm card visibility, selected control state, counts if shown, and accessible announcements/focus behavior.

**Pass condition:** Filtering operates on pre-rendered DOM with no manifest fetch or duplicate component render.

## Completion Evidence

- JavaScript-disabled browser test results/screenshots.
- Enhancement-contract decision record for each affected component.
- Browser tests for tag filtering and duplicate-content prevention.
- Network evidence that first paint does not require blog manifest, experience data, or per-icon fetches.
- Reviewed output-snapshot changes plus passing `npm test` and `npm run build`.

## Handoff To Phase 6

Proceed only after all gates pass. The final phase removes obsolete glue code; it must not alter the established rendered output or enhancement contracts.
