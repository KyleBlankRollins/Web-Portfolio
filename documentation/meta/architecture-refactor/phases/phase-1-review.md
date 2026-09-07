# Phase 1 Review: Pure Rendering Boundary

Review of the Phase 1 implementation against the objective and hard gates in `phase-1-pure-rendering-boundary.md`.

**Verification status at time of review:** `npx vitest run` passes — 13 test files, 58 tests. `npx tsc --noEmit` is clean. The phase doc's claim of "11 test files and 53 tests" is stale.

## Behavior regression: shared chunks now emit duplicate script tags

`source/builder/site-assets.ts:38-40` adds every imported chunk to **both** `head` (as `modulepreload`) and `body` (as a module script). The snapshot diff confirms the change in output:

```
-      <link rel="modulepreload" crossorigin href="./assets/lit-HASH.js">
+    <link rel="stylesheet" crossorigin href="/assets/main-HASH.css">
+    <link rel="modulepreload" crossorigin href="/assets/lit-HASH.js">
...
-      <script type="module" crossorigin src="./assets/index-HASH.js"></script>
+      <script type="module" crossorigin src="/assets/main-HASH.js"></script>
+    <script type="module" crossorigin src="/assets/lit-HASH.js"></script>
```

The `lit` chunk is now both preloaded *and* loaded as a top-level entry script. Vite never emits `<script>` for imported chunks — they are pulled in through the entry's import graph, and `modulepreload` exists precisely so a second tag is not needed. It is not fatal at runtime (the module registry dedupes by URL), but it contradicts the objective's "preserving current template semantics," and the phase doc justified the snapshot churn as only the `index-*` to `main-*` rename. The extra script tag was not called out.

**Fix:** drop the `body.add()` call from the import loop in `siteAssetsFromManifest` and let `body` hold the entry file alone.

## The parity gate cannot detect asset divergence

`normalizeServedDocument` in `source/builder/build-output.test.ts:34-44` strips *all* stylesheet and modulepreload links, and *all* scripts pointing at `/@vite/client`, `/main.ts`, or `/assets/` — from both sides of the comparison.

Gate 1.3 step 3 says "allow only expected asset reference and Vite HMR differences," but the normalizer allows any asset difference including tag count and placement. That is exactly how the duplicate `lit` script above slipped through a gate whose stated purpose is asset parity. The gate as written verifies non-asset DOM parity only.

**Fix:** narrow the stripping to hashed filenames and the Vite client, or state in the doc that asset placement is covered solely by the separate `places root and nested page assets` test.

## `renderSite` is pure by fixture, not by construction

The Required Types section says `renderSite()` "may not read the filesystem." But `TemplateEngine.getTemplate`/`getPartial` still fall through to `existsSync`/`readFileSync` whenever a name is missing from the in-memory maps (`source/builder/modules/template-engine.ts:63-70`). The in-memory source is a *cache layer in front of* the filesystem, not a replacement for it.

`source/builder/site-renderer-pure.test.ts` passes only because its fixture happens to supply `base.html` plus all three partials. Add one page referencing an unsupplied partial and the "pure" renderer reads from disk in production without any test noticing. Gate 1.1's pass condition — "requires no filesystem access" — is not structurally enforced.

**Fix:** make `TemplateSource` required rather than defaulting to `{}`, and have the filesystem fallback throw when a source map was provided.

## Duplicated content assembly, already diverging

`source/builder/index.ts:339-382` (`renderDevelopmentSite`) and `source/builder/html-bundle-processor.ts:30-64` (`writeSite`) are the same four steps in the same order: filter pages, append generated files, append blog manifest, construct a `ThemeProcessor` at a hardcoded path and append the theme manifest.

Two copies of a "build the content list" routine is the highest-value cleanup here, because they have *already* drifted:

- Production: `outputPath.split("/").pop()?.startsWith("_")` — `source/builder/html-bundle-processor.ts:34`
- Development: `outputPath.startsWith("_")` — `source/builder/index.ts:346`

A nested `foo/_draft.html` is excluded from the build but served by the dev server. Today `_theme-demo.html` is top-level so both filters agree and nothing fails, but this is a latent dev/prod divergence in code whose whole purpose is dev/prod parity.

**Fix:** extract one `collectSiteContent(source, markdownProcessor)` and have both call sites use it. The differences then reduce to the `SiteAssets` argument, which is the actual intended difference.

Relatedly, `source/builder/site-renderer.ts:102` exports `generatedFileToRenderableContent()` — the exact helper for the generated-files loop — and neither call site uses it. It is dead code.

## `origins` stores content, not origins

`source/builder/site-renderer.ts:50-59` builds `origins` by iterating the other four maps and doing `origins.set(path, value)` where `value` is the file *content*. The doc defines this field as "source-origin records," which reads as path to source filesystem path.

As written it is a fourth copy of every file's bytes with no origin information, and the keys collide across categories (`templates/index.html` would silently overwrite `pages/index.html`, since keys are relative to each category root). `source/builder/site-renderer.test.ts:129-130` asserts `origins.get("index.html") === "<!-- root page -->"`, which locks in the wrong semantics.

**Fix:** store the absolute source path, or drop the field — nothing reads it.

`rawData` has the same problem in a milder form: `source/builder/site-renderer.ts:49` slurps `source/site/data/`, which today contains only `blog-manifest.ts` (a client-side TS module read as an opaque string). `renderSite` never touches `rawData`. Both fields are loaded and discarded.

## `SiteAssets` is stringly typed

The doc calls for "typed head and body asset references," but `head: readonly string[]` mixes two kinds of value: bare hrefs for stylesheets and fully-rendered `<link rel="modulepreload">` markup for preloads. The consumer recovers the distinction by sniffing the string:

```ts
const stylesheetAssets = options.assets.head.filter((a) => !a.startsWith("<link"));
const preloadAssets = options.assets.head.filter((a) => a.startsWith("<link"));
```

`source/builder/html-utils.ts:75-80`. This is the classic case for a discriminated union — `{ kind: "stylesheet"; href }` / `{ kind: "modulepreload"; href }` / `{ kind: "module"; src }` — which would let `siteAssetsFromManifest` stop hand-rolling HTML and keep tag generation in one place. As it stands, changing the preload tag's attributes means editing a string literal in the manifest adapter and a `startsWith` predicate in the renderer.

The knock-on is `source/builder/html-utils.ts:85-92`: preloads need a *second* `replace("</head>")` pass after `injectAssets` already did one, which is why the emitted order is stylesheet-then-preload rather than the preload-first order the previous output had. Both passes silently no-op on a document without `</head>`.

## Dead `mode` parameter

`source/builder/site-renderer.ts:91-96`:

```ts
switch (mode) {
  case "development":
  case "production":
    outputs.set(page.outputPath, rendered);
    break;
}
```

Both arms are identical — this is `outputs.set(...)` wearing a costume. `RenderMode` is threaded through the whole signature and consumed by nothing. The doc scopes it correctly ("only where asset descriptors differ"), and asset descriptors differ *at the call site* via the `assets` argument, which is the right design. So `mode` has no job.

**Fix:** drop the parameter and the switch. If it is retained for Phase 2, at minimum replace the switch with the plain assignment so it does not read as a real branch.

## Smaller items

**Unguarded concurrent rebuilds.** `source/builder/dev-server-middleware.ts:99-109` fires `void handleRendererFileChange(...)` on `add`/`change`/`unlink` with no debounce or serialization. `rebuildAllMarkdownDocuments` has its own promise guard, but the `renderDevelopmentSite` assignment after it does not — a batch of file events (a git checkout, a save-all) starts overlapping rebuilds that race on `renderedSite`. A trailing debounce plus a single in-flight promise would fix both.

**Dev assets as an inline literal.** `source/builder/index.ts:376-380` hardcodes `{ head: [], body: ["/main.ts"] }` at the call site. Production gets a named, tested adapter (`siteAssetsFromManifest`); development gets a magic literal buried in a function. A `developmentSiteAssets()` counterpart next to the manifest adapter would make the dev/prod asset contract symmetric and greppable.

**Non-HTML outputs assumed to be JSON.** `source/builder/dev-server-middleware.ts:62-65` branches on `.endsWith(".html")` and serves everything else as `application/json`. Fine for today's two manifests, but `RenderableSiteContent.kind: "raw"` does not promise JSON. Deriving the content type from the extension would remove the assumption.

**Windows path separators in map keys.** `source/builder/site-renderer.ts:125` builds nested keys with `join()`, producing backslash-separated keys on Windows, while the dev middleware looks them up with `cleanUrl.slice(1)` (always forward slash). The repo already has `normalizePathForOutput` in `source/builder/index.ts:271` for exactly this.

**Stale scaffolding.** `HtmlBundleProcessor` is now a stateless one-method class — a plain `writeSite()` function would do. Its class comment still says "Handles HTML bundle generation during build" and the method comment "Process HTML files in the Vite bundle," but it no longer touches the bundle; it reads the manifest and renders. The `kbrBuilder` doc block at `source/builder/index.ts:386-393` lists `PluginConfig`, `DevServerMiddleware`, `MarkdownBuildProcessor` — none of which are the current names.

## Doc inconsistency

The phase file contradicts itself:

- Line 73: "None. Phase 1 implementation and validation are complete."
- Line 75: "Phase 1 is not yet complete and should not be handed off to Phase 2."
- Line 126: "All Phase 1 gates pass."

One of these needs to go. Line 75 is likely a leftover guard rail from when the section was written, but given the gate weaknesses above, it may be the accurate one. Line 58's test counts are also stale (11/53 vs the actual 13/58).

## Suggested order

1. **Duplicate `lit` script tag** and the **parity-gate normalizer** — these affect shipped output and the credibility of the gates. Worth fixing before Phase 2, since Phase 2 builds on this renderer as "the only implementation surface."
2. **Extracted `collectSiteContent`** and the **`_`-prefix filter divergence** — real drift in parity-critical code.
3. **`SiteAssets` discriminated union** and **`renderSite` purity enforcement** — structural cleanups that will pay off during AST directive work.
4. **`origins` / `rawData` / `mode` / `generatedFileToRenderableContent`** — all deletions.
