# Phase 6: Retire Legacy Infrastructure

## Objective

Remove obsolete Vite-plugin orchestration, duplicate dev/build paths, and git-aware incremental machinery. Leave one documented build workflow and one rendered dev workflow.

## Scope

- Replace plugin lifecycle orchestration with explicit asset build, load, graph, render, and write steps.
- Retain minimal dev middleware only for the in-memory render map plus `transformIndexHtml()`.
- Delete duplicate asset injection, template caches, manifest endpoints, MIME/404 handling where Vite now owns it, and git-aware incremental code.
- Update scripts, deployment configuration, and documentation.

Do not retain deprecated paths "just in case." Each deletion must be backed by a passing check.

## Implementation Steps

1. Implement one production command sequence: build Vite assets, read manifest, load source, build graph, render site, write `dist/`.
2. Implement one development sequence: start Vite assets/HMR, load/build/render complete map, serve rendered documents through `transformIndexHtml()`, and rebuild/reload on every renderer-owned change.
3. Remove `buildStart` and `generateBundle` HTML orchestration.
4. Remove asset placement normalization, development-script injection/removal, per-route renderer paths, template cache invalidation, custom manifest endpoints, and redundant MIME/404 logic.
5. Remove `git-aware-pipeline.ts`, `git-utils.ts`, incremental scripts/options, and stale-output reconciliation.
6. Update package scripts, Vite/Netlify configuration, builder README, site README, and contributor instructions to name the single supported workflow.
7. Search for every deleted symbol/module name and remove dead imports, comments, docs, and tests.

## Hard Gates

### Gate 6.1: Clean-Checkout Production Build

Before deleting compatibility paths:

1. Start from a clean install/build-output state.
2. Run the documented production build command.
3. Confirm `dist/` contains assets, all expected rendered pages, and renderer-owned JSON.
4. Run the full test suite and output snapshots.

**Pass condition:** A clean checkout builds and passes without the legacy plugin lifecycle path.

### Gate 6.2: Development Workflow

Before removing legacy dev middleware behavior:

1. Start the documented dev command.
2. Request a root page, a page fragment route, a Markdown post, and a nested supplement route.
3. Edit a template, a page, a content file, a theme file, and experience data in turn.
4. Confirm each change rebuilds the complete render map and triggers a successful browser reload/HMR connection.

**Pass condition:** Every supported route and change type uses the one documented dev path.

### Gate 6.3: Legacy Deletion Audit

Before marking the refactor complete:

1. Search source, scripts, docs, and configuration for deleted module/symbol names.
2. Confirm the only remaining matches are intentional historical notes.
3. Confirm package scripts expose no git-aware or deprecated build mode.
4. Run TypeScript compilation, tests, production build, and a deployment-equivalent build.

**Pass condition:** No executable legacy path or stale documentation remains.

## Completion Evidence

- Clean-checkout production build output and test results.
- Development route/change matrix results.
- Search results for retired modules/symbols.
- Updated script and deployment documentation paths.

## Definition Of Done

The architecture refactor is complete only when all prior phase gates and all three Phase 6 gates pass. The final system has one pure renderer, valid HTML templates on disk, TOML/Zod content validation, static first-paint collections, and Vite limited to asset compilation and development transforms.
