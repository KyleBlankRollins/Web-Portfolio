# Phase 1: Pure Rendering Boundary

## Objective

Make Vite an asset compiler and make one pure renderer own document output, while preserving current template semantics. Do not implement the new HTML directives in this phase.

## Scope

- Add `loadSiteSource()` and pure `renderSite()` boundaries.
- Build `main.ts` as an explicit Vite input with `build.manifest` enabled and `base: "/"`.
- Make `index.html` an ordinary renderer-owned page.
- Build production assets first and translate Vite's manifest into `SiteAssets`.
- Make dev serve the complete render map, then call `server.transformIndexHtml()` for HMR.
- Rebuild the complete render map and trigger full reload on any renderer-owned source change.

Do not change layouts, page metadata format, template directives, frontmatter syntax, or static list rendering.

## Required Types

Define and use these types before moving production or development call sites:

- `LoadedSiteSource`: immutable content of pages, layouts, and partials.
- `SiteAssets`: typed head and body asset references.
- `RenderedSite`: output paths mapped to HTML/JSON content.

`loadSiteSource()` may read the filesystem. `renderSite()` may not read the filesystem, use process state, inspect Vite state, or mutate its inputs.

## Implementation Steps

1. Add `loadSiteSource()` and fixture-based tests proving it captures all renderer-owned input required by current output.
2. Add a pure `renderSite(source, content, assets)` that initially delegates to the existing template behavior.
3. Convert Vite configuration to an explicit `main.ts` Rollup input, `base: "/"`, and manifest output. Remove the source-page module-script requirement.
4. Replace bundle inspection with a manifest-to-`SiteAssets` adapter.
5. Make the production command build assets, load source, render the site, and write renderer output.
6. Make development load/render the same map, pass served documents through `server.transformIndexHtml()`, and serve the transformed result.
7. Replace cache-clearing and per-route rebuilding with whole-map invalidation on page, template, content, theme, or renderer-data changes.
8. Remove `normalizeAssetPlacement` and production dev-entry stripping once asset ownership is proven by tests.

## In Progress

### Completed

- Added the `LoadedSiteSource`, typed `SiteAssets`, and `RenderedSite` types in `source/builder/site-renderer.ts`.
- Added `loadSiteSource()` and an in-memory `renderSite()` implementation.
- Updated `TemplateEngine` and `TemplateProcessor` to support in-memory templates and partials.
- Added a deterministic pure-rendering test using fully in-memory fixtures.
- Configured Vite with `main.ts` as the explicit Rollup input, `base: "/"`, and `build.manifest: true`.
- Removed source-page `/main.ts` script markers from `source/site/index.html` and `source/site/templates/blog-post.html`.
- Added renderer-owned production emission for `index.html`.
- Added the initial Vite manifest-to-`SiteAssets` adapter in `source/builder/site-assets.ts`.
- Moved production rendering to `writeBundle`, where the final Vite manifest is available.
- Made production emit the complete `RenderedSite.outputs` map for HTML and JSON files.
- Made development serve the complete render map and pass HTML through `server.transformIndexHtml()`.
- Replaced development per-route rendering and manual `/main.ts` injection with shared render-map invalidation.
- Added full renderer-owned development invalidation for pages, templates, content, themes, data, and the root page.
- Updated output snapshots for the intentional `index-*` to `main-*` asset migration and removed duplicate imported-chunk scripts.
- Verified `npm test` passes: 13 test files and 58 tests.
- Verified `npm run build` passes.
- Verified the dev root contains Vite's `@vite/client` and the nested supplement route returns `200` with HMR transformation.
- Added fixture coverage proving `loadSiteSource()` captures pages, root index, templates, and partials.
- Added a filesystem-mocked pure-renderer test proving `renderSite()` can render without filesystem access.
- Added manifest adapter coverage for entry CSS, imported chunks, recursive modulepreload tags, and missing entries.
- Added normalized DOM parity coverage for development and production rendering.
- Removed `normalizeAssetPlacement()` and its obsolete tests.

### Partial

None.

### Remaining

None. Phase 1 implementation and validation are complete.

Phase 1 is complete and may be handed off to Phase 2.

## Hard Gates

### Gate 1.1: Pure Renderer Proof

Before replacing any production or dev call site:

1. Create a fully in-memory `LoadedSiteSource` fixture and deterministic `SiteAssets` fixture.
2. Call `renderSite()` twice with deeply equal inputs.
3. Confirm outputs are deeply equal.
4. Run the test with filesystem reads mocked or prohibited inside `renderSite()`.

**Pass condition:** The renderer produces the same output and requires no filesystem or Vite access.

### Gate 1.2: Asset Ownership Proof

**Status: Passed.** `build-output.test.ts` builds the site and checks both `index.html` and the nested boundary-checklist supplement for root-absolute stylesheet, preload, and module-script URLs, correct head/body placement, and no `/main.ts`.

Before deleting placement workarounds:

1. Run a production build with a root page and nested supplement page.
2. Inspect their emitted asset URLs.
3. Confirm each URL is root-absolute, styles and preload tags occur in `<head>`, and module scripts occur before `</body>`.
4. Confirm neither document contains `/main.ts`.

**Pass condition:** Correct asset placement comes from `SiteAssets`, not a post-render relocation or removal pass.

### Gate 1.3: Dev/Prod Render Parity

**Status: Passed.** `build-output.test.ts` starts Vite on an ephemeral port, verifies `@vite/client`, serves the root and nested supplement routes, removes only expected runtime asset differences, and compares their normalized DOM against the production output.

Before Phase 2:

1. Render the Phase 0 fixture set in production and development modes.
2. Compare each pair with the normalized DOM comparator.
3. Allow only expected asset reference and Vite HMR differences.
4. Load a rendered dev page and confirm Vite HMR connects through `transformIndexHtml()`.

**Pass condition:** Every non-asset DOM difference is explained by a failing test or eliminated.

## Completion Evidence

- Tests for pure in-memory rendering and manifest adaptation.
- Production output showing correct root-absolute asset URLs at nested paths.
- Dev smoke result proving HMR injection.
- Served development/production parity coverage for root and nested supplement pages.
- Deleted workaround paths and passing `npm test` plus `npm run build`.

## Handoff To Phase 2

All Phase 1 gates pass. Preserve the Phase 0 output baseline and use the Phase 1 pure renderer as the only implementation surface for AST directive work.
