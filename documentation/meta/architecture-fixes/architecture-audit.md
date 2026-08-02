# Architecture Audit

Source of truth for structural and code-quality work on `kyleblankrollins.com`.

Execution order lives in [`implementation-plan.md`](implementation-plan.md), which allocates all 32 findings across seven phases.

This document records architectural defects, duplication, and dead code found in an audit of the Vite builder plugin, the Lit component site, the admin application, and the shared build configuration. It is a findings registry, not an implementation plan. Each finding is independently actionable and carries a stable ID so work can reference it across branches and sessions.

It is the structural counterpart to `design-fixes/design-audit.md`, which covers visual and CSS defects. Where the two overlap, the design audit owns the rendered result and this document owns the code that produces it.

## Scope of the audit

Reviewed at the commit following `c6f33f71`:

- `source/builder/` — the `kbr-builder` Vite plugin, roughly 2,800 lines
- `source/site/` — Lit components, templates, pages, and styles, roughly 5,500 lines
- `source/admin/` — the backlog admin server and UI, roughly 2,200 lines
- `scripts/`, `vite.config.ts`, `tsconfig.json`, `netlify.toml`, `.github/`

## How to use this document

- Each finding has an ID (`AF-NN`), a location, evidence, and a fix direction.
- Findings are grouped by category, and ordered by impact within each group.
- **Fix `AF-01` first.** Nearly every structural change below rewrites string-handling code that has no automated verification. The test suite is what converts the rest of this list from risky to routine.
- "Verified" means the behaviour was confirmed by running the code, not only by reading it.
- Usage claims for dead code were established by grep across `source/`, `scripts/`, and `vite.config.ts`. Matches inside `README.md` files were not counted as usage, since several document APIs that no longer have callers.

### Status legend

Update the status column as work lands.

| Status        | Meaning                                           |
| ------------- | ------------------------------------------------- |
| `open`        | Not yet addressed                                 |
| `in-progress` | Being worked                                      |
| `partial`     | Some of it landed as a side effect of another fix |
| `fixed`       | Landed and verified                               |
| `wontfix`     | Deliberately accepted, with a note explaining why |

## Triage summary

| ID    | Finding                                                         | Severity | Status |
| ----- | --------------------------------------------------------------- | -------- | ------ |
| AF-01 | No automated tests cover the build pipeline                     | Critical | open   |
| AF-02 | Metadata is serialized to HTML comments and re-parsed           | High     | open   |
| AF-03 | Builder and site share data contracts but no type definitions   | High     | open   |
| AF-04 | `typographyStyles` duplicates `typography.css`, and has drifted | Medium   | open   |
| AF-05 | The document head and theme bootstrap exist in three places     | Medium   | open   |
| AF-06 | Processor facades delegate without adding behaviour             | Low      | open   |
| AF-07 | Admin API routes repeat one try/catch four times                | Low      | open   |
| AF-08 | Template cleanup regex deletes literal braces from content      | High     | open   |
| AF-09 | Code block restoration corrupts content containing `$`          | Medium   | open   |
| AF-10 | Two near-identical HTML escape functions                        | Low      | open   |
| AF-11 | `generateTagsHtml` is the one generator that skips escaping     | Low      | open   |
| AF-12 | `require()` calls in an ESM package                             | Low      | open   |
| AF-13 | Dev server markdown fallback renders differently from build     | Medium   | open   |
| AF-14 | Build status is logged twice per git-aware build                | Low      | open   |
| AF-15 | Three custom events are dispatched with no listeners            | Low      | open   |
| AF-16 | `GitAwareBuildPipeline` has an unreachable subsystem            | Low      | open   |
| AF-17 | `GitUtils` base-branch comparison is entirely unused            | Low      | open   |
| AF-18 | `KBRBuilderOptions.baseBranch` is declared and never read       | Low      | open   |
| AF-19 | Four unused public methods on `MarkdownProcessor`               | Low      | open   |
| AF-20 | `MetadataExtractor` dead methods, and five `formatDate` copies  | Low      | open   |
| AF-21 | `FileSystemHelper.readFile` is unused and misleadingly async    | Low      | open   |
| AF-22 | Two unused exports in `theme-config.ts`                         | Low      | open   |
| AF-23 | `formStyles` has no importers                                   | Low      | open   |
| AF-24 | `ContentDiscovery` re-walks the filesystem per request          | Medium   | open   |
| AF-25 | Rollup and Connect APIs are typed as `any`                      | Medium   | open   |
| AF-26 | `findFiles` guesses at path roots                               | Low      | open   |
| AF-27 | `scripts/lint-prose.ts` is not type-checked                     | Low      | open   |
| AF-28 | Test and demo pages ship to production                          | Medium   | open   |
| AF-29 | `netlify.toml` carries a stale branch context                   | Low      | open   |
| AF-30 | No continuous integration                                       | Medium   | open   |
| AF-31 | Mojibake in build log output                                    | Low      | open   |
| AF-32 | Untracked build artifacts in the repository root                | Low      | open   |

---

## Verification and safety

### AF-01 — No automated tests cover the build pipeline

**Severity:** Critical
**Location:** repository-wide

`find source scripts -iname "*test*"` returns nothing. `package.json` has no test script and no test runner in `devDependencies`.

This matters more here than in a typical static site because the build pipeline is hand-written, and its core operations are string rewriting rather than structured transformation:

- `modules/template-engine.ts` substitutes variables using dynamically constructed `RegExp` objects
- `html-utils.ts:94` relocates `<link>` and `<script>` tags between head and body by regex
- `modules/content-preprocessor.ts:16` strips comments by regex
- `modules/metadata-extractor.ts:42` parses ten metadata fields by regex

Every finding in the "Correctness defects" section below is a bug that unit tests would have caught at authoring time. More importantly, none of the structural work in this document can be undertaken confidently while the only verification available is building the site and looking at it.

**Fix direction.** Add Vitest. Cover the pure modules first, since they are already dependency-injected and free of side effects apart from `fs` reads: `TemplateEngine`, `MetadataExtractor`, `FrontmatterParser`, `ContentPreprocessor`, `CitationProcessor`, `ContentDiscovery`, `HtmlProcessingUtils`. Then add one golden-file test that builds a fixture post end to end and snapshots the resulting HTML. That single snapshot is what makes `AF-02` safe to attempt.

---

## Structural findings

### AF-02 — Metadata is serialized to HTML comments and immediately re-parsed

**Severity:** High
**Location:** `builder/markdown-processor.ts:124-150`, `builder/modules/metadata-extractor.ts:42-140`, `builder/html-bundle-processor.ts:156-164`

This is the largest design flaw in the builder.

`markdown-processor.ts` takes a fully typed metadata object and flattens it into a string of HTML comments:

```ts
const htmlWithMetadata = [
  metadata.title ? `<!-- title: ${metadata.title} -->` : "",
  // ...
  metadata.series?.name ? `<!-- series.name: ${metadata.series.name} -->` : "",
  metadata.citationsHtml
    ? `<!-- citationsHtml: ${escapeHtmlComment(metadata.citationsHtml)} -->`
    : "",
  processedContent,
]
  .filter(Boolean)
  .join("\n");
```

`MetadataExtractor.extract()` then runs roughly ten regexes to turn that string back into an object. Meanwhile the original typed object is still in memory as `GeneratedHtmlFile.metadata` (`markdown-processor.ts:26`). `html-bundle-processor.ts:156-164` holds `fileData.metadata` in hand, reads `fileData.metadata.title` from it for the fallback title, and then passes `fileData.content` through so the same values can be re-derived from comments.

The costs are concrete rather than theoretical:

- `series` had to be flattened into two separate comments and reassembled with `parseInt` (`metadata-extractor.ts:109-117`).
- `citationsHtml` required a bespoke `escapeHtmlComment` / `unescapeHtmlComment` pair (`modules/html-utils.ts:22-32`) purely to survive the trip.
- `supplements` is declared on `TemplateVariables` but has no comment form, so it does not survive the round trip at all. Nothing downstream currently reads it — `addToBlogManifest` works from `contentDocument.metadata` directly — so this is a latent gap rather than a live defect. It is evidence that the transport format and the type have already fallen out of agreement.
- Any title or description containing `-->` corrupts the document.

**Fix direction.** Move the seam. `HtmlProcessingUtils.processHtmlContent` should accept `(content, metadata)` rather than re-deriving metadata from `content`. Generated documents pass their real object. Hand-written pages under `pages/` keep the comment header, which is a legitimate authoring format for them, and parse it once at read time. This deletes the comment escaping helpers, most of `MetadataExtractor`, and the entire class of escaping defects — and it makes `supplements` work.

### AF-03 — Builder and site share data contracts but no type definitions

**Severity:** High
**Location:** `builder/modules/blog-manifest.ts`, five components under `site/components/`

`blog-manifest.json` is produced by `BlogManifestBuilder` with proper types (`BlogPostManifestEntry`, `SupplementManifestEntry`, `BlogManifest`), then consumed by five components that each re-declare a different partial shape of it by hand:

| File                                                    | Re-declares                                                        |
| ------------------------------------------------------- | ------------------------------------------------------------------ |
| `components/post-list/post-list.ts:21,32`               | `BlogPostMetadata`, `BlogManifest`                                 |
| `components/post-series/post-series.ts:20,25,37`        | `SeriesInfo`, `BlogPost`, `BlogManifest`                           |
| `components/supplement-list/supplement-list.ts:9,16,21` | `SupplementManifestEntry`, `BlogPostManifestEntry`, `BlogManifest` |
| `components/home-highlights/home-highlights.ts:9,17`    | `BlogPostSummary`, `BlogManifest`                                  |
| `components/tag-filter/tag-filter.ts:20`                | `BlogManifest`                                                     |

Four independent definitions of `BlogManifest`. Nothing prevents the builder from renaming a field, and nothing fails until a page renders blank in production.

Alongside the type duplication, the same five components each call `fetch("/data/blog-manifest.json")` independently — `post-series.ts:85`, `supplement-list.ts:45`, `home-highlights.ts:116`, `tag-filter.ts:133`, `post-list.ts:115` — each with its own `response.ok` check and `console.error` fallback. A blog post page instantiates both `post-series` and `supplement-list`, so it issues two requests, two parses, and two error paths for one file.

The same pattern applies on a smaller scale to `theme-manifest.json`, whose types are duplicated between `site/theme-config.ts:13-27` and `builder/theme-processor.ts`.

**Fix direction.** Create `source/shared/` holding type-only manifest definitions imported by both halves. `verbatimModuleSyntax` is already enabled, so `import type` erases cleanly and adds no runtime coupling. Then add `source/site/data/blog-manifest.ts` exporting a memoized `loadBlogManifest(): Promise<BlogManifest>` — one fetch, one parse, one error policy — and delete the duplicated loading code from all five components.

### AF-04 — `typographyStyles` duplicates `typography.css`, and has drifted

**Severity:** Medium
**Location:** `site/styles/shared-styles.ts:45-196`, `site/styles/typography.css:165-309`

`shared-styles.ts` reproduces `typography.css` essentially line for line: the hardcoded scale (`3rem` / `3.63rem` / `1.81rem`), the `h1, h2` versus `h3, h4, h5` font-family split, the link rules, `.ui-label`, and the entire `@media (max-width: 768px)` block including its identical `/* Reduced from 3rem */` comments.

The two have already diverged. `typography.css:174-179` sets `h1 { margin-top: 0 }`; `shared-styles.ts` sets `margin-top: 0.91rem`. That is a live inconsistency between an `<h1>` in the light DOM and one inside a shadow root.

The comment on `reducedMotionStyles` (`shared-styles.ts:14-16`) states the underlying constraint correctly — a rule in `styles/style.css` cannot cross the shadow boundary, which is why per-component blocks existed originally. That constraint is real. A second hand-maintained copy of the type scale is not the right answer to it.

**Fix direction.** Keep one source of truth on disk and adopt it into shadow roots. Vite can import the CSS text directly with `import typographyCss from "../styles/typography.css?inline"`, and a single `CSSStyleSheet` can be built once at module load via `unsafeCSS`. One file, both DOMs, drift impossible.

If `?inline` is undesirable, the fallback is to express the scale entirely as custom properties in `themes/properties.css` — which already exists for this purpose — and have both consumers reference tokens rather than literals. That does not eliminate the duplicate, but it reduces it to selector plumbing and removes the magic numbers.

### AF-05 — The document head and theme bootstrap exist in three places

**Severity:** Medium
**Location:** `site/templates/base.html:19-40`, `site/templates/blog-post.html:10-30`, `site/components/theme-switcher/theme-switcher.ts:58-59`

Both templates contain a byte-identical twenty-line inline theme bootstrap script, and both carry a comment stating that it "Mirrors `loadSavedTheme()` in theme-switcher.ts; keep in sync." The same logic and the same two storage keys therefore live in three files, synchronized by hand.

Beyond the script, the two templates also duplicate the entire `<head>`, the `<kbr-navigation>` block with its slotted theme switcher, and the footer injection. They differ only in the contents of `<main>`.

The mechanism to fix this already exists and is already in use: `TemplateProcessor.loadPartial()` (`template-processor.ts:69`) injects `templates/partials/footer.html` as a triple-brace variable, with caching, precisely so that shared markup lives in one file.

**Fix direction.** Extract `partials/head.html` (including the bootstrap) and `partials/header.html`, and inject them the way `footer` already is. That collapses two templates of 66 and 81 lines down to their actual difference. For the third copy, have the inline bootstrap and `theme-switcher.ts` read their storage keys and default theme from one shared constant rather than restating `"kbr-theme"`, `"kbr-color-scheme"`, and `"base"` in both.

### AF-06 — Processor facades delegate without adding behaviour

**Severity:** Low
**Location:** `builder/template-processor.ts`, `builder/markdown-processor.ts`

`TemplateProcessor` is 153 lines, of which `isCompleteHtmlDocument` (`:87`), `extractMetadata` (`:130`), `extractMarkdownFrontmatter` (`:140`), and `clearCache` (`:150`) are single-line delegations to `TemplateEngine`, `MetadataExtractor`, and `FrontmatterParser`. `MarkdownProcessor` delegates similarly to five module classes.

`meta/refactor-processors.md` records this as a deliberate extract-modules refactor, and the modules are the better-factored half of the result. The facades were retained for backward compatibility — see the comments at `markdown-processor.ts:18` and `template-processor.ts:12` — but there are no external consumers to be compatible with. This is a single application, and the only importers are three files in the same directory.

**Fix direction.** Let callers use the modules directly. Retain a facade only where it encapsulates state worth owning: `MarkdownProcessor`'s two generated-file maps qualify. `TemplateProcessor`'s `partialCache` is a single `Map` that belongs on `TemplateEngine`, next to the template cache it duplicates in purpose.

Sequence this **after** `AF-01` and `AF-02`. It is the lowest-risk-per-line change in this section but touches the most call sites, so it benefits most from having tests already in place.

### AF-07 — Admin API routes repeat one try/catch four times

**Severity:** Low
**Location:** `admin/server/api-routes.ts`

All four handlers follow an identical shape: open a `try`, perform one operation, construct an `ApiResponse<T>`, `catch`, `console.error`, construct an `ApiResponse<null>`, and respond with a 4xx or 5xx. The file is 152 lines expressing roughly four lines of actual behaviour.

**Fix direction.** One `asyncHandler` wrapper plus a single Express error-handling middleware. Worth doing whenever the admin application is next touched; there is no urgency.

---

## Correctness defects

### AF-08 — Template cleanup regex deletes literal braces from content

**Severity:** High
**Location:** `builder/modules/template-engine.ts:125`

```ts
result = result.replace(/\{\{\{?\w+\}?\}\}/g, "");
```

This cleanup pass runs over the fully rendered post body, not just the template. Markdown code blocks have already been converted to HTML by this point, so a published post containing a Mustache, Jinja, Vue, Liquid, or Angular snippet — `{{ title }}`, `{{user}}` — has it silently deleted from the output.

For a blog about documentation and tooling this is a realistic content-loss scenario, and it fails silently: the build succeeds, and the omission is only visible by reading the published page.

**Fix direction.** Apply the cleanup to the template before content is injected, or adopt a placeholder delimiter that cannot collide with prose and code samples.

### AF-09 — Code block restoration corrupts content containing `$`

**Severity:** Medium
**Location:** `builder/modules/content-preprocessor.ts:37`

```ts
processed = processed.replace(`__CODE_BLOCK_${index}__`, codeBlock);
```

`String.prototype.replace` interprets `$&`, `` $` ``, `$'`, and `$1` within the _replacement_ string. A fenced code block containing any of those — a shell snippet, a regex example, a `sed` invocation — is mangled on restoration.

The placeholder is also collision-prone: markdown containing the literal text `__CODE_BLOCK_0__` breaks the round trip.

**Fix direction.** Use the function form, `replace(placeholder, () => codeBlock)`, which performs no substitution on the replacement. Consider a placeholder token that cannot occur in prose.

### AF-10 — Two near-identical HTML escape functions

**Severity:** Low
**Location:** `builder/modules/html-utils.ts:9`, `:38`

`escapeHtml` and `escapeHtmlAttribute` differ only in emitting `&#39;` versus `&#x27;` for the apostrophe — semantically the same entity. Two names for one behaviour invites picking the wrong one, and the distinction implies a safety difference that does not exist.

**Fix direction.** Collapse to one function.

### AF-11 — `generateTagsHtml` is the one generator that skips escaping

**Severity:** Low
**Location:** `builder/html-utils.ts:182-190`

```ts
(tag) => `<button class="blog-tag" data-tag="${tag}">${tag}</button>`;
```

`tag` is interpolated raw into both an attribute and a text node, while every other generator in the builder routes through `escapeHtmlAttribute`. Tags come from author-controlled frontmatter, so this is not an injection vector today, but a tag containing a double quote breaks the markup, and the inconsistency is the kind that gets copied into the next generator someone writes.

**Fix direction.** Escape both positions, matching the rest of the builder.

### AF-12 — `require()` calls in an ESM package

**Severity:** Low
**Location:** `builder/dev-server-middleware.ts:146`, `builder/git-aware-pipeline.ts:119-120`

Three CommonJS `require` calls in a package declaring `"type": "module"`.

**Verified:** the dev server endpoint `/data/theme-manifest.json` returns HTTP 200 with valid JSON, so Vite's current config bundling supplies a working `require` at runtime. This is latent rather than active — it breaks under native ESM config loading, and it is inconsistent with every other import in both files.

Note that the `git-aware-pipeline.ts` occurrence sits inside code that is already unreachable; see `AF-16`.

**Fix direction.** Convert to static imports.

### AF-13 — Dev server markdown fallback renders differently from build

**Severity:** Medium
**Location:** `builder/dev-server-middleware.ts:285-327`

`processAndServeMarkdown` calls `MarkdownProcessor.renderMarkdownBody`, which skips citation processing, title and date injection, and the `isBlogPost` template selection that the build path applies. A page served through this branch would not match its published counterpart.

The branch is close to unreachable in practice: `buildStart` pre-renders every document into memory (`builder/index.ts:402-408`), so the `getGeneratedFileByPublicUrl` lookup at `:187` satisfies the request first. That makes it a third rendering path that exists only to be wrong.

**Fix direction.** Delete it and let the miss fall through to the 404 handler. Dev and build should share exactly one rendering path.

### AF-14 — Build status is logged twice per git-aware build

**Severity:** Low
**Location:** `builder/git-aware-pipeline.ts:26`, `builder/index.ts:412`

The `GitAwareBuildPipeline` constructor calls `GitUtils.logRepositoryStatus()`, and `buildStart` subsequently calls `pipeline.logBuildStrategy()`. Both print the current branch, the changed-file count, the changed markdown list, and the changed HTML list. Every git-aware build emits the same report twice, and each shells out to `git` separately to produce it.

**Fix direction.** Keep `logBuildStrategy`, which is the one invoked at a meaningful point in the lifecycle. Drop the constructor call.

### AF-15 — Three custom events are dispatched with no listeners

**Severity:** Low
**Location:** `site/components/theme-switcher/theme-switcher.ts:112`, `site/components/image-lightbox/image-lightbox.ts:107`, `:128`

`theme-loaded`, `lightbox-opened`, and `lightbox-closed` are constructed and dispatched; nothing in `source/` listens for any of them.

`theme-changed` (`theme-switcher.ts:171`) is in the same position but is documented as a public integration point in `site/styles/themes/README.md:366`, so it is reasonably treated as deliberate extension surface. The other three have no such justification.

**Fix direction.** Remove the three undocumented dispatches, or document them alongside `theme-changed` if they are intended as API.

---

## Dead code

Roughly 400 lines are provably unreachable. Removing them is safe today and safer still once `AF-01` lands.

### AF-16 — `GitAwareBuildPipeline` has an unreachable subsystem

**Severity:** Low
**Location:** `builder/git-aware-pipeline.ts`

`getBuildPlan()` (`:261`) has no callers. That makes its exclusive dependents dead as well:

- `shouldProcessHtml()` (`:84`)
- `getMissingHtmlFiles()` (`:113`) — sixty lines, and the source of two of the `require` calls in `AF-12`
- `shouldClearTemplateCache()` (`:204`)

Approximately 110 of the file's 285 lines.

### AF-17 — `GitUtils` base-branch comparison is entirely unused

**Severity:** Low
**Location:** `builder/git-utils.ts`

`getChangedBuildFiles()` (`:182`), `getChangedFilesSince()` (`:201`), `getChangedMarkdownFilesSince()` (`:237`), and `getChangedHtmlFilesSince()` (`:260`) form a complete "compare against a base branch" subsystem with no entry point. Approximately 100 of the file's 392 lines.

### AF-18 — `KBRBuilderOptions.baseBranch` is declared and never read

**Severity:** Low
**Location:** `builder/index.ts:26`, `:340`

Declared on the options interface and defaulted to `"main"`, but never consumed. The dead branch-comparison code in `AF-17` was its only plausible consumer. The default was never correct for this repository in any case, since trunk is `prod`.

### AF-19 — Four unused public methods on `MarkdownProcessor`

**Severity:** Low
**Location:** `builder/markdown-processor.ts`

`processMarkdownFile()` (`:54`), `getBlogManifest()` (`:340`), `getGeneratedFile()` (`:354`), and `clearGeneratedFiles()` (`:370`, superseded by `resetBuildState`).

### AF-20 — `MetadataExtractor` dead methods, and five `formatDate` copies

**Severity:** Low
**Location:** `builder/modules/metadata-extractor.ts:145`, `:156`, and four other files

`extractComment()` and `formatDate()` have no callers. The latter is byte-identical to the private, actively used `FrontmatterParser.formatDate` (`modules/frontmatter-parser.ts:234`).

Three further divergent implementations exist in the admin UI:

- `admin/ui/components/post-card/post-card.ts:53`
- `admin/ui/components/completed-posts-section/completed-posts-section.ts:120`
- `admin/ui/components/discarded-posts-section/discarded-posts-section.ts:111`

Five copies in total, formatting the same kind of value with three different output formats.

**Fix direction.** Delete the dead pair; consolidate the remaining implementations into one shared date utility.

### AF-21 — `FileSystemHelper.readFile` is unused and misleadingly async

**Severity:** Low
**Location:** `builder/helpers.ts:65`

No callers, and it is declared `async` while wrapping a synchronous `readFileSync` — so any future caller would be misled about its blocking behaviour.

### AF-22 — Two unused exports in `theme-config.ts`

**Severity:** Low
**Location:** `site/theme-config.ts:109`, `:119`

`getThemeById()` and `getAvailableThemeIds()` have no importers.

### AF-23 — `formStyles` has no importers

**Severity:** Low
**Location:** `site/styles/shared-styles.ts:444-497`

Roughly 54 lines of shared form styling that no component imports. `buttonStyles` and `layoutStyles` in the same file are genuinely used and should stay.

---

## Hygiene

### AF-24 — `ContentDiscovery` re-walks the filesystem per request

**Severity:** Medium
**Location:** `builder/index.ts:43`, `:299`, `builder/dev-server-middleware.ts:439`

`ContentDiscovery.discover()` walks the published content tree, reads every markdown file, and parses every frontmatter block. It is constructed fresh and invoked in three places, with no caching.

The costly one is `resolvePublishedMarkdownSourcePath`, which runs the full walk on **every** `.html` dev-server request that misses the in-memory map. `handleThemeManifestRequest` (`:143`) is analogous: it re-reads and re-parses every theme CSS file per request, confirmed by the repeated "Processing 2 theme files" lines in the dev server log.

**Fix direction.** Instantiate once and cache the result, invalidating on the existing watcher events.

### AF-25 — Rollup and Connect APIs are typed as `any`

**Severity:** Medium
**Location:** `builder/html-bundle-processor.ts:23-25`, `builder/dev-server-middleware.ts`

`processBundle(bundle: any, emitFile: any, ...)` sits in a project with `strict`, `noUnusedLocals`, `noUnusedParameters`, and `noUncheckedSideEffectImports` all enabled. Rollup exports `OutputBundle` and `EmitFile`; `builder/index.ts:432` even resorts to `this.emitFile.bind(this)` to work around the lost plugin context.

`dev-server-middleware.ts` carries twenty `any` annotations on `req`, `res`, and `next` that Vite's re-exported Connect types would cover.

**Fix direction.** Adopt the real types. This is the cheapest available increase in the compiler's leverage over the build pipeline.

### AF-26 — `findFiles` guesses at path roots

**Severity:** Low
**Location:** `builder/helpers.ts:19-23`

```ts
if (directory.includes(join("source", "site"))) {
  directoryPath = directory;
} else {
  directoryPath = join("source", "site", directory);
}
```

A string heuristic standing in for callers passing unambiguous absolute paths. It will do the wrong thing for any path that happens to contain that segment for another reason.

**Fix direction.** Require absolute paths at the call sites and drop the branch.

### AF-27 — `scripts/lint-prose.ts` is not type-checked

**Severity:** Low
**Location:** `tsconfig.json`

`include` is `["source"]`, so the 418-line prose linting script is never seen by the `tsc` step in `npm run build`.

**Fix direction.** Add `scripts` to `include`.

### AF-28 — Test and demo pages ship to production

**Severity:** Medium
**Location:** `site/content/published/typography-test.md`, `site/pages/theme-demo.html`

Both appear in `dist/` and are therefore live URLs. `typography-test.md` also counts toward the post total in `blog-manifest.json`.

**Fix direction.** If these are internal design harnesses, exclude them from published output rather than leaving them addressable. If they are intended to be public, they should be linked and treated as real pages.

### AF-29 — `netlify.toml` carries a stale branch context

**Severity:** Low
**Location:** `netlify.toml`

```toml
[context.DoK-Compare]
command = "vue-cli-service-build"
```

A Vue CLI command with no counterpart in `package.json`. `origin/DoK-Compare` still exists, so deploys from that branch fail.

**Fix direction.** Remove the context, or retire the branch.

### AF-30 — No continuous integration

**Severity:** Medium
**Location:** `.github/`

`.github/` contains Copilot instructions and agent definitions but no `workflows/` directory. Nothing runs `tsc`, `prettier --check`, or `lint:prose` on push.

**Fix direction.** Once `AF-01` lands, a ten-line workflow running typecheck, format check, prose lint, and tests covers the whole surface.

### AF-31 — Mojibake in build log output

**Severity:** Low
**Location:** `builder/html-bundle-processor.ts:115`

A Unicode replacement character occupies the position of an intended emoji in the "Processing N pages HTML files" log line.

### AF-32 — Untracked build artifacts in the repository root

**Severity:** Low
**Location:** repository root

`.playwright-mcp/`, `blog-full.png`, `home-desktop.png`, `home-full.png`, `post-full.png`, and `themes-menu.png` are untracked and unignored.

**Fix direction.** Add to `.gitignore`.

---

## Suggested sequencing

1. **`AF-01`** — tests for the pure builder modules, plus one end-to-end golden-file snapshot. Everything below becomes verifiable rather than hopeful.
2. **`AF-16` through `AF-23`** — delete the dead code. Zero risk, and it shrinks the surface everything else has to reason about.
3. **`AF-08`, `AF-09`, `AF-10`, `AF-11`** — the silent content-corruption defects. These damage published output today.
4. **`AF-02`** — retire the metadata comment round trip. Highest structural payoff in the builder; the snapshot test from step 1 is what makes it safe.
5. **`AF-03`** — shared contracts and a memoized manifest loader. Highest payoff on the site side.
6. **`AF-04`, `AF-05`** — collapse the typography and template duplication.
7. **`AF-06`** — retire the pass-through facades, once everything above has settled.

Steps 1 through 3 are mechanical. Step 4 is the one genuinely difficult change, since it moves a seam shared by four files, and it is the one worth doing properly rather than working around again.

Hygiene findings (`AF-24` through `AF-32`) are independent of this ordering and can land at any point. `AF-25` and `AF-30` pair naturally with step 1.
