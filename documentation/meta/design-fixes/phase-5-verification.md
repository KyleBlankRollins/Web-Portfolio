# Phase 5: Cross-Viewport Verification

## Objective

Prove that the implemented fixes work together across generated page types, viewport sizes, themes, interaction states, and production output.

## Agent Instructions

1. Start from a clean working build state and run the repository's available checks:
   - `npm run build`
   - `npm run build:git-aware` when the repository state permits it
   - relevant prose linting for changed Markdown files
2. Inspect generated output for:
   - root page HTML;
   - Blog, Portfolio, and Career pages;
   - at least one nested supplement page;
   - `data/blog-manifest.json`.
3. Test these viewport widths:
   - `390px` mobile;
   - `768px` breakpoint boundary;
   - `1200px` desktop;
   - `1440px` wide desktop.
4. Test all four theme combinations: Basic Blue light/dark and Canney Valley light/dark.
5. Exercise the following interactions:
   - footer LinkedIn and GitHub links;
   - navigation and theme settings;
   - Portfolio, Blog, and Career TOCs;
   - duplicate Career company entries;
   - blog tag filtering and clear filter;
   - blog card links and tag buttons;
   - keyboard focus order;
   - reduced-motion preference.
6. Record concrete failures with page URL, viewport, theme, reproduction steps, and expected versus actual behavior. Do not waive a failure because the page is “mostly usable.”
7. Fix only regressions caused by the phases. Create a follow-up issue or note for unrelated findings.

## Scope

This phase should normally change no production code. Small test-only or documentation updates are acceptable if they make the verification repeatable.

## Gate

The project is ready to close only when all answers are objectively yes:

- Do all required builds pass?
- Does every generated page load its CSS and JavaScript with the correct MIME types?
- Is there no content overlap or horizontal overflow at the four required widths?
- Are footer links, TOCs, anchors, theme controls, filters, and card interactions keyboard reachable and functional?
- Are all four theme combinations readable, with no known missing token or unstyled control?
- Are there no new browser-console errors or failed network requests attributable to the implementation?
- Has the evidence been recorded in the phase notes or pull request?

The final evidence should include build output, generated-HTML checks, a viewport/theme matrix, and a short list of any intentionally deferred work.

## Verification Evidence

Verified 2026-08-02 against the production preview at `http://127.0.0.1:4174`.

### Builds and Generated Output

- `npm run build` passed (`tsc` and `vite build`).
- `npm run build:git-aware` passed. The builder correctly fell back to full processing because this workspace is not detected as a Git repository by the build pipeline.
- `npm run lint:prose` passed with no changed Markdown files to lint.
- Generated output includes the root page, Blog, Portfolio, Career, two nested supplement pages, and `data/blog-manifest.json`.
- Emitted CSS and JavaScript returned `200` with `text/css` and `text/javascript` content types.
- The generated blog manifest contains 8 posts and 20 tags.

### Viewport and Theme Matrix

The root page, Blog, Portfolio, Career, and `intentional-work-patterns/supplements/boundary-checklist.html` were loaded at `390px`, `768px`, `1200px`, and `1440px` for Basic Blue light/dark and Canney Valley light/dark. No case produced horizontal overflow, failed requests, or browser-console errors.

Theme controls were also checked directly in all four combinations. The document theme attributes, persisted values, native select value, visible Light/Dark label, and checkbox state agreed in every case.

### Interaction Checks

- Footer LinkedIn and GitHub links are present with the expected URLs.
- Portfolio TOC exposes 16 links and toggles between `Expand table of contents` and `Collapse table of contents` at mobile width.
- Career TOC exposes 9 links. Career company headings have 8 unique IDs, including the disambiguated `purch` and `purch-2` anchors.
- Blog card title and tag controls are present. Selecting `AI` updates the URL to `?tag=AI`; `Clear filter` restores `/blog.html` and removes the control.
- Theme settings opens with keyboard `Enter` and exposes the current mode through text and accessible state.
- At `390px`, the keyboard sequence reaches `K_R`, Blog, Portfolio, Career, Theme settings, the tag filters, and post card links/buttons in document order.
- `prefers-reduced-motion: reduce` reduces changed-control transition and animation durations to approximately `0.01ms`.

### Deferred Work

- No Phase 5 regressions remain deferred. The Lit update-cycle warning was fixed in `source/site/components/tag-filter/tag-filter.ts` by deferring tag reordering until after `updated()` completes.
