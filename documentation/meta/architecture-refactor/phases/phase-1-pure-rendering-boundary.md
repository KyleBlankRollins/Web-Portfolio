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

- `LoadedSiteSource`: immutable content of pages, layouts, partials, raw data inputs, and source-origin records.
- `SiteAssets`: typed head and body asset references.
- `RenderMode`: development or production, only where asset descriptors differ.
- `RenderedSite`: output paths mapped to HTML/JSON content.

`loadSiteSource()` may read the filesystem. `renderSite()` may not read the filesystem, use process state, inspect Vite state, or mutate its inputs.

## Implementation Steps

1. Add `loadSiteSource()` and fixture-based tests proving it captures all renderer-owned input required by current output.
2. Add a pure `renderSite(source, content, assets, mode)` that initially delegates to the existing template behavior.
3. Convert Vite configuration to an explicit `main.ts` Rollup input, `base: "/"`, and manifest output. Remove the source-page module-script requirement.
4. Replace bundle inspection with a manifest-to-`SiteAssets` adapter.
5. Make the production command build assets, load source, render the site, and write renderer output.
6. Make development load/render the same map, pass served documents through `server.transformIndexHtml()`, and serve the transformed result.
7. Replace cache-clearing and per-route rebuilding with whole-map invalidation on page, template, content, theme, or renderer-data changes.
8. Remove `normalizeAssetPlacement` and production dev-entry stripping once asset ownership is proven by tests.

## Hard Gates

### Gate 1.1: Pure Renderer Proof

Before replacing any production or dev call site:

1. Create a fully in-memory `LoadedSiteSource` fixture and deterministic `SiteAssets` fixture.
2. Call `renderSite()` twice with deeply equal inputs.
3. Confirm outputs are deeply equal.
4. Run the test with filesystem reads mocked or prohibited inside `renderSite()`.

**Pass condition:** The renderer produces the same output and requires no filesystem or Vite access.

### Gate 1.2: Asset Ownership Proof

Before deleting placement workarounds:

1. Run a production build with a root page and nested supplement page.
2. Inspect their emitted asset URLs.
3. Confirm each URL is root-absolute, styles and preload tags occur in `<head>`, and module scripts occur before `</body>`.
4. Confirm neither document contains `/main.ts`.

**Pass condition:** Correct asset placement comes from `SiteAssets`, not a post-render relocation or removal pass.

### Gate 1.3: Dev/Prod Render Parity

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
- Deleted workaround paths and passing `npm test` plus `npm run build`.

## Handoff To Phase 2

Proceed only after all gates pass. Preserve the Phase 0 output baseline and use the Phase 1 pure renderer as the only implementation surface for AST directive work.
