# Phase 4 Review: TOML Content Graph

Review of the Phase 4 implementation against the objective and hard gates in `phase-4-validated-content-graph.md`.

**Verification status:** `npx tsc --noEmit` clean, 78 tests across 15 files, `npm run build` succeeds. The parsing layer is solid, but the graph it is meant to feed is not connected.

## Blocker: `buildContentGraph` has no production caller

The Objective is "a deterministic typed content graph that is **the sole data input to rendering**." The graph is built only by its own test:

```
=== does the build use the graph? ===
NO PRODUCTION CALLER

buildContentGraph referenced in: content-graph.ts, content-graph.test.ts, modules/index.ts (re-export)
```

Nothing in `source/builder/index.ts`, `source/builder/site-content.ts`, `source/builder/html-bundle-processor.ts`, or `source/builder/markdown-processor.ts` calls it. Rendering still goes `ContentDiscovery` to `MarkdownProcessor` directly, exactly as before Phase 4.

The consequence is that the validations the graph exists to perform never run during `npm run build`:

| Validation | Location | Runs at build? |
|---|---|---|
| Duplicate public URLs | discovery *and* graph | yes (via discovery) |
| Supplement missing parent | graph only | **no** |
| Supplement references missing parent | graph only | **no** |
| Series duplicate part | graph only | **no** |
| Deterministic post sort | graph only | **no** |

So Gate 4.2's "invalid authoring input cannot silently publish" holds for frontmatter but not for the graph-level relationships, and Gate 4.3's determinism guarantee applies to an artifact nothing consumes. The Handoff says "Phase 5 consumes typed graph collections" — Phase 5 would be the first code to actually use it, which inverts the gate's intent that these checks be proven *before* proceeding.

## Regression: duplicate citation IDs now pass silently

Gate 4.2 lists "duplicate citation IDs" as a required invalid fixture. It is not just untested — the check was lost in the migration:

```
OK | duplicate citation ids | {"title":"T",...,"citations":[{"id":"a","title":"T1",...},{"id":"a","title":"T2",...}]}
```

In Phase 3 this threw `Duplicate citation IDs: d. Each citation must have a unique ID.` That guard lives in `CitationProcessor.validateNoDuplicates`, reachable only through `parseCitationsFromFrontmatter` — which now has no production caller. `source/builder/markdown-processor.ts:75-78` passes `metadata.citations` straight from Zod:

```ts
this.citationProcessor.processCitationReferences(content, metadata.citations, path)
```

and the Zod `citations` array has no uniqueness refinement. Two citations sharing an id now produce two `<li id="citation-a">` entries with duplicate DOM ids and ambiguous back-reference targets.

**Fix:** add a `.superRefine` on the array, or call `validateNoDuplicates` from the new path.

## Gate 4.2 fixture coverage: 3 of 8

The gate enumerates eight invalid fixtures. Each was probed; the ones that *are* implemented produce good, actionable messages:

```
THROW| unknown key        | frontmatter: Unrecognized key: "bogus"
THROW| missing required   | title: expected string, received undefined; date: expected string, received undefined
THROW| malformed date     | date: invalid calendar date
THROW| invalid url        | citations.0.url: Invalid URL
THROW| bad series part    | series.part: Too small: expected number to be >=0
```

All carry source file and field path, so the pass condition's quality bar is met by the implementation. But only three have tests — unknown keys, invalid calendar dates, and duplicate URLs (in `content-discovery.test.ts`). Missing required fields, invalid URLs, bad series part, invalid supplement parent references, and duplicate citation IDs have none. That is how the citation regression got through: the behavior was never pinned.

## Gate 4.3: partially met

`content-graph.test.ts` passes deliberately unsorted input (`/z`, `/b`, `/a`) and asserts sorted output, which is real coverage for sort determinism. Missing are the gate's first two steps: building the graph repeatedly from the same fixtures, and varying filesystem enumeration order through a test double. Formatted dates and theme JSON are not compared either.

Theme determinism itself is done — `dist/data/theme-manifest.json` has no `generatedAt`. That leaves `normalizeThemeTimestamp` (`source/builder/build-output.test.ts:30-32`) as dead code, normalizing a field that no longer exists.

## Gate 4.1: passes

23 of 25 Markdown files use `+++`; the two exceptions are `__drafts/README.md` and `__drafts/backlog.md`, which are admin docs, correctly excluded per Step 5. No YAML parser remains — the only `yaml` references are prismjs syntax-highlighting imports. `typography-test.md` is migrated (an initial grep matched a `---` horizontal rule in its body, not frontmatter).

## Step 8 and Step 9 are incomplete

**Step 8** — "Load theme source and `public/data/experience-data.json` through `loadSiteSource()`." Half done. The timestamp is gone, but theme loading still constructs a `ThemeProcessor` against a hardcoded `process.cwd()` path inside `source/builder/site-content.ts:36-39` rather than going through `loadSiteSource()`, and `experience-data.json` is not loaded by the builder at all — it is only fetched at runtime by `timeline.ts` and `home-highlights.ts`. That leaves the Phase 1 purity boundary with a filesystem read outside `loadSiteSource()`.

**Step 9** — "Replace open metadata bags throughout render inputs with narrow typed view models." `source/builder/modules/frontmatter-parser.ts:29` still declares `[key: string]: any` on `FrontmatterData`, and `source/builder/markdown-processor.ts:83` writes through it (`metadata.citationItems = citationItems`). The Zod schemas are `.strict()`, so unknown keys cannot enter from authored TOML — but derived fields are still bolted onto an `any`-typed bag downstream, which is the part Step 9 targets.

## Smaller notes

**`formattedDate` and `isBlogPost` are inferred inside the parser.** `source/builder/modules/frontmatter-parser.ts:131-134` mutates the validated result and sets `isBlogPost = true` for any document with a date. A parser that also classifies documents is doing two jobs, and "has a date implies is a blog post" is a policy decision buried in a parsing module. The graph would be the natural home for it.

**`publishedRawValue` is a dead field** on `FrontmatterData` — declared, never produced, and `.strict()` would reject it if authored. YAML-era leftover.

**Draft leniency is inconsistent on dates.** The draft schema drops the `YYYY-MM-DD` regex, but `validateCalendarDate` still runs on any present date and throws. A draft with `date = "next tuesday"` fails with `invalid calendar date` rather than a format message — reachable, since drafts are exactly where half-written frontmatter lives.

**Tag ordering is first-seen, not sorted.** `graph.tags` is a `Map` whose iteration order follows post order. Deterministic, and the test pins it — but it is an implicit contract worth stating, since a reader would reasonably expect alphabetical or count-descending.

## Assessment

The TOML + Zod layer is genuinely good: strict schemas, precise field-path diagnostics, calendar validation, and a fixed month table with no locale dependence. Content migration is complete and the build is green.

But Phase 4's headline deliverable is not wired in. Recommended: hold the Phase 5 handoff until `buildContentGraph` actually feeds rendering — otherwise Phase 5 inherits an unproven graph and the "sole data input to rendering" claim stays aspirational. The citation-duplicate regression should be fixed alongside it, since it is a real correctness loss with a two-line fix, and the five missing Gate 4.2 fixtures are cheap now that the schemas exist.
