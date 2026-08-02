# Phase 5 — Shared data contracts

**Findings:** AF-03
**Depends on:** Phase 1 only. Independent of Phases 2, 3, 4 — may run in parallel with them.
**Risk:** Medium — this is site-side runtime code with no snapshot coverage of its behaviour, only of its bundle.

Read this entire file before taking any action.

## Why this phase exists

`blog-manifest.json` is produced by `BlogManifestBuilder` with proper types, then consumed by five components that each re-declare a different partial shape of it by hand:

| Component                                               | Re-declares                                                        |
| ------------------------------------------------------- | ------------------------------------------------------------------ |
| `components/post-list/post-list.ts:21,32`               | `BlogPostMetadata`, `BlogManifest`                                 |
| `components/post-series/post-series.ts:20,25,37`        | `SeriesInfo`, `BlogPost`, `BlogManifest`                           |
| `components/supplement-list/supplement-list.ts:9,16,21` | `SupplementManifestEntry`, `BlogPostManifestEntry`, `BlogManifest` |
| `components/home-highlights/home-highlights.ts:9,17`    | `BlogPostSummary`, `BlogManifest`                                  |
| `components/tag-filter/tag-filter.ts:20`                | `BlogManifest`                                                     |

Four independent definitions of `BlogManifest`. Nothing prevents the builder from renaming a field, and nothing fails until a page renders blank in production.

The same five components each call `fetch("/data/blog-manifest.json")` independently, each with its own `response.ok` check and `console.error` fallback. A blog post page instantiates both `post-series` and `supplement-list`, so it issues two requests, two parses, and two error paths for one file.

## Target design

Two new modules.

**`source/shared/manifest-types.ts`** — type-only definitions, the single source of truth for the shape of `blog-manifest.json` and `theme-manifest.json`. Imported by both halves of the codebase with `import type`, which erases at compile time under the existing `verbatimModuleSyntax`, so this adds no runtime coupling between builder and site.

Move the canonical declarations here from `builder/modules/blog-manifest.ts`: `BlogPostManifestEntry`, `SupplementManifestEntry`, `TagWithCount`, `BlogManifest`. Re-export them from their old location so builder imports keep working, or update the builder imports — either is fine, but pick one and be consistent.

`SeriesInfo` currently lives in `builder/modules/frontmatter-parser.ts` and is part of the manifest shape. Move it too.

**`source/site/data/blog-manifest.ts`** — a memoized loader:

```ts
let cached: Promise<BlogManifest> | null = null;

export function loadBlogManifest(): Promise<BlogManifest> {
  cached ??= fetch("/data/blog-manifest.json").then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to load blog manifest: ${response.statusText}`);
    }
    return response.json() as Promise<BlogManifest>;
  });
  return cached;
}
```

Cache the **promise**, not the resolved value, so concurrent callers during initial page load share one in-flight request rather than racing.

Do not swallow the error inside the loader. Each component already has its own error UI — a loading spinner, an error message, or `nothing` — and those differ meaningfully. The loader's job is one fetch and one parse; presentation stays where it is.

## Out of scope

- Do not change component rendering, styling, or error copy. The visible result of this phase is zero.
- Do not consolidate `theme-config.ts`'s loader in this phase beyond moving its types. It already memoizes correctly (`themesCache` at `:30`) and has one consumer.
- Do not touch `experience-data.json` or the `timeline` component. It is a different contract with one consumer.

---

## Step 1 — Establish the true shape

The five hand-written interfaces disagree. Before unifying them, determine which fields the builder actually emits and which are optional.

> ### GATE 5.1 — The real shape is known
>
> - **Trigger:** before creating any file.
> - **Action:** run `npm run build`, then inspect `dist/data/blog-manifest.json` — list its top-level keys, and the union of keys across all entries in `posts`, noting which appear on every entry and which do not.
> - **Checkpoint:** produce a field table with name, type, and required-or-optional, and reconcile it against `BlogPostManifestEntry` in `builder/modules/blog-manifest.ts`.
> - **Evidence:** paste the field table and note any disagreement between the emitted JSON and the builder's declared type.
> - **Blocked:** do not write `manifest-types.ts` until this table exists. Copying the builder's interface without checking the emitted data reproduces any existing inaccuracy into the new single source of truth, where it becomes much harder to notice.

---

## Step 2 — Create the shared types and the loader

Create `source/shared/manifest-types.ts` and `source/site/data/blog-manifest.ts` per the target design. Do not wire any component to them yet.

Confirm `tsconfig.json` covers `source/shared` — its `include` is `["source"]` (plus `"scripts"` after Phase 1), so it does.

> ### GATE 5.2 — New modules compile and are reachable
>
> - **Trigger:** both files created.
> - **Action:** `npx tsc --noEmit`, then confirm both files are inside the tsconfig `include` by running `npx tsc --listFiles | grep -c "source/shared/manifest-types.ts"`.
> - **Checkpoint:** `tsc` exits zero and the grep count is `1`.
> - **Evidence:** paste both.
> - **Blocked:** do not migrate components. A types file outside the compilation graph provides no checking, which would make the rest of this phase cosmetic.

---

## Step 3 — Migrate the five components, one at a time

Order: `supplement-list` → `post-series` → `tag-filter` → `post-list` → `home-highlights`.

That order is smallest-first. `home-highlights` is last because it fetches the manifest **and** `experience-data.json` via `Promise.all` (`:116-117`), so it is the only one where the call shape changes rather than just the types.

For each component:

1. Delete its local interface declarations.
2. Add `import type { ... } from "../../../shared/manifest-types.js";`
3. Replace the `fetch` + `response.ok` + `response.json()` block with `await loadBlogManifest()`.
4. Leave its `try`/`catch`, its state flags, and its error rendering untouched.

> ### GATE 5.3 — Each component compiles against the real shape
>
> - **Trigger:** after **each** component, not after all five.
> - **Action:** `npx tsc --noEmit`.
> - **Checkpoint:** exits zero.
> - **Evidence:** paste the component name and exit status, five times.
> - **Blocked:** do not start the next component until the current one is clean. Migrating all five and then compiling produces a pile of interacting errors that is far harder to attribute than five clean steps. If a component's local interface declared a field the shared type does not have, that is a real finding — report it rather than widening the shared type to accommodate a shape the builder never emits.

---

## Step 4 — Verify the runtime result

The snapshot test covers built HTML and manifests. It does **not** exercise component behaviour, so it cannot confirm this phase worked. The pages must be loaded.

> ### GATE 5.4 — Pages render with real data
>
> - **Trigger:** all five components migrated.
> - **Action:** run `npm run build && npx vite preview --port 3111`. Load `/blog.html` and one post page carrying a series and a supplement (`/intentional-work-patterns.html`). For each page, capture the browser console output and the rendered content.
> - **Checkpoint:** all of the following:
>   1. Zero console errors on both pages.
>   2. `/blog.html` lists more than one post, and the tag filter shows more than one tag.
>   3. The post page renders its series component and its table of contents.
>   4. In the network panel, `blog-manifest.json` is requested **exactly once** per page load.
> - **Evidence:** paste the console output, the visible post count, the tag count, and the manifest request count.
> - **Blocked:** the phase cannot close. Item 4 is the one that proves memoization — before this phase a post page requests the manifest twice, so a count of 2 means components are still fetching independently and at least one migration was missed.

---

## Exit gate

> ### GATE 5.5 — Phase 5 complete
>
> - **Trigger:** Steps 1 through 4 done.
> - **Action:** `npx tsc --noEmit && npx prettier --check . && npm test`, plus the greps below.
> - **Checkpoint:** all of the following:
>   1. Three commands exit zero.
>   2. `grep -rn "interface BlogManifest" source/site` returns nothing.
>   3. `grep -rc "fetch(\"/data/blog-manifest.json\")" source/site` shows the string appears **only** in `source/site/data/blog-manifest.ts`.
>   4. GATE 5.4's four runtime checks all passed.
>   5. Zero snapshot mismatches, **or** mismatches confined to asset filename hashes — the site bundle legitimately changes, and the Phase 1 normalization should absorb it. Any hunk touching page markup is unexpected and must be explained.
> - **Evidence:** paste all five, numbered.
> - **Blocked:** do not close until every item passes.

## Report on completion

1. The five exit-gate results.
2. The field table from GATE 5.1, plus any disagreement found between emitted JSON and the builder's declared type.
3. Any component whose local interface declared a field the manifest does not contain — that is a latent bug worth its own audit entry.
4. Manifest request count per page, before and after.

Then set AF-03 to `fixed` in `architecture-audit.md`.
