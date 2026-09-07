# Phase 4: TOML Content Graph

## Objective

Replace handwritten frontmatter parsing with TOML plus Zod and produce a deterministic typed content graph that is the sole data input to rendering.

## Scope

- Install `toml` and Zod.
- Migrate frontmatter delimiters from `---` to `+++` and source fields to TOML syntax.
- Define strict schemas for published content and a lenient draft schema mode.
- Build explicit parent/supplement edges, sorted post collections, tags, series, theme data, and experience data.
- Remove locale-dependent date formatting and nondeterministic theme timestamps.

Do not change visual collection rendering or component enhancement in this phase.

## Implementation Steps

1. Add TOML parsing between leading `+++` delimiters. Preserve source path and parser line/column diagnostics.
2. Define Zod schemas for posts, supplements, page metadata, series, citations, and draft content.
3. Require dates to be quoted strings matching `YYYY-MM-DD`; validate calendar dates in schema logic and format dates with a fixed month-name table.
4. Migrate each content file's YAML frontmatter to equivalent TOML. Use TOML arrays for tags, `[series]` for series data, and `[[citations]]` for citations.
5. Make draft discovery use the lenient draft schema mode. Keep heading-based admin backlog parsing separate.
6. Build a `ContentGraph` with typed nodes and explicit edges. Validate publication state, duplicate URLs, supplement parents, and series integrity there.
7. Sort post output deterministically by date descending then slug ascending.
8. Load theme source and `public/data/experience-data.json` through `loadSiteSource()` and emit a timestamp-free theme manifest as renderer-owned JSON.
9. Replace open metadata bags throughout render inputs with narrow typed view models.
10. Remove handwritten frontmatter parsing after all content and tests have migrated.

## Hard Gates

### Gate 4.1: TOML Migration Completeness

Before deleting YAML parsing:

1. Search published and draft content for frontmatter delimiters.
2. Confirm every publishable Markdown document uses `+++` TOML frontmatter.
3. Run parser tests against every content file.
4. Confirm no runtime import or test fixture still exercises YAML parsing.

**Pass condition:** All intended content parses as TOML and the former YAML parser has no caller.

### Gate 4.2: Validation Diagnostics

Before rendering from the graph:

1. Add invalid fixtures for unknown keys, missing required fields, malformed dates, invalid URLs, duplicate citation IDs, bad series part, duplicate URLs, and invalid supplement parent references.
2. Run schema/graph tests.
3. Confirm each failure identifies source file, field path, and actionable message.

**Pass condition:** Invalid authoring input cannot silently publish and errors are usable without source-code debugging.

### Gate 4.3: Deterministic Graph Output

Before Phase 5:

1. Build the graph repeatedly from the same fixture set.
2. Change filesystem enumeration order in a test double or fixture loader.
3. Compare post order, tag summaries, series, formatted dates, and theme JSON.

**Pass condition:** Identical source yields byte-identical graph-derived JSON and stable render ordering.

## Completion Evidence

- TOML/Zod fixture coverage and migrated content count.
- Graph-validation and determinism test results.
- Timestamp-free theme-manifest output.
- Passing `npm test`, `npm run validate:drafts`, and `npm run build`.

## Handoff To Phase 5

Proceed only after all gates pass. Phase 5 consumes typed graph collections and must not fetch build-known content to construct first paint.
