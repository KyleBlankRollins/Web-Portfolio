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
