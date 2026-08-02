# Phase 7 — Facades and hygiene

**Findings:** AF-06, AF-07, AF-24, AF-26, AF-28, AF-29, AF-31, AF-32
**Depends on:** Phase 1, Phase 3 (which orphans two methods this phase deletes), Phase 4 (which reshapes the facades)
**Risk:** Low per item, but AF-06 touches the most call sites of any change in the plan.

Read this entire file before taking any action.

## Why this phase exists

Cleanup that only makes sense once the structural work has settled. AF-06 in particular must come last: retiring the processor facades before Phase 4 reshapes them would mean doing the same work twice.

The items are independent of one another. Do them in the order given — cheapest and most isolated first, AF-06 last — and commit each separately.

## Out of scope

- Do not start AF-06 until every other item in this phase is done and committed. It is the only item here that can plausibly break the build, and you want a clean bisect boundary in front of it.
- Do not delete `MarkdownProcessor`'s generated-file maps. They hold real state.

---

## Step 1 — The trivia: AF-31, AF-32, AF-29

**AF-31.** `builder/html-bundle-processor.ts:115` has a Unicode replacement character where an emoji belongs, in the "Processing N pages HTML files" log line. Replace it with a normal emoji matching the surrounding style, or drop the emoji entirely.

**AF-32.** Add to `.gitignore`: `.playwright-mcp/` and the stray root PNGs (`blog-full.png`, `home-desktop.png`, `home-full.png`, `post-full.png`, `themes-menu.png`). Prefer a pattern like `/*.png` scoped to the repository root, since `public/images/` legitimately contains tracked PNGs — verify the pattern does not match those.

**AF-29.** `netlify.toml` ends with:

```toml
[context.DoK-Compare]
command = "vue-cli-service-build"
publish = "dist"
```

`vue-cli-service-build` does not exist in `package.json`, so deploys from that branch fail. `origin/DoK-Compare` still exists, so this is not purely dead configuration — it is broken configuration for a live branch. Remove the context block. If the branch is still wanted, it will build with the root `npm run build` command.

> ### GATE 7.1 — Ignore rules do not hide tracked files
>
> - **Trigger:** `.gitignore` edited.
> - **Action:** run `git status --short` and `git ls-files public/images | head`.
> - **Checkpoint:** the six artifacts no longer appear in `git status`, **and** `git ls-files public/images` still lists tracked PNGs. A `*.png` pattern without a root anchor would silently stop tracking site images.
> - **Evidence:** paste both outputs.
> - **Blocked:** do not commit `.gitignore` until both are confirmed.

---

## Step 2 — AF-28: stop shipping test and demo pages

`content/published/typography-test.md` and `pages/theme-demo.html` are both emitted to `dist/` and are live URLs. `typography-test.md` also counts toward `totalPosts` in `blog-manifest.json`.

Decide, and say which you chose:

- **Internal harnesses** — exclude them from published output. `typography-test.md` can carry `published: false` in frontmatter, which `ContentDiscovery` already honours (it filters on `metadata.published !== false`). `theme-demo.html` needs a mechanism, since everything in `pages/` is emitted unconditionally by `processAdditionalHtmlFiles`; the smallest option is a filename convention such as a leading underscore, honoured in that function.
- **Genuinely public** — then link them from somewhere and treat them as real pages.

The first is almost certainly right. Neither is linked from any navigation today.

> ### GATE 7.2 — Excluded pages are actually gone
>
> - **Trigger:** exclusion applied.
> - **Action:** `npm run build`, then `ls dist/ | grep -c "typography-test\|theme-demo"` and read `totalPosts` from `dist/data/blog-manifest.json`.
> - **Checkpoint:** the grep count is `0`, and `totalPosts` has decreased by exactly 1 from its previous value.
> - **Evidence:** paste both, plus the previous `totalPosts`.
> - **Blocked:** do not proceed. This change legitimately moves the snapshot — two snapshot files must be **deleted** and the manifest snapshot updated. Confirm those are the only changes before running `vitest -u`.

---

## Step 3 — AF-26 and AF-24: paths and caching

**AF-26.** `builder/helpers.ts:19-23`:

```ts
if (directory.includes(join("source", "site"))) {
  directoryPath = directory;
} else {
  directoryPath = join("source", "site", directory);
}
```

A string heuristic standing in for callers passing unambiguous paths. `findFiles` has one external caller — `processAdditionalHtmlFiles` passes the bare string `"pages"`. Change that caller to pass a resolved path and delete the branch.

**AF-24.** `ContentDiscovery.discover()` walks the published tree, reads every markdown file, and parses every frontmatter block. Phase 3 already removed the worst caller — the per-request walk in the dev server. Two remain, both in `builder/index.ts`: `processMarkdownFiles` (`:43`) and `rebuildAllMarkdownDocuments` (`:299`).

In a dev session, `rebuildAllMarkdownDocuments` runs on every published-markdown change, which is correct — the content changed, so rediscovery is the point. The redundancy is that `buildStart` and the watcher callback can both fire a full rediscovery in quick succession.

Also address `handleThemeManifestRequest`, which constructs a `ThemeProcessor` and re-reads every theme CSS file per request. Hoist it to a module-level instance created once, invalidated by the existing watcher when a file under `styles/themes/` changes.

Keep this proportionate. The content corpus is eight posts. This is about removing a per-request full filesystem walk, not about building a caching layer.

> ### GATE 7.3 — Themes are read once per dev session
>
> - **Trigger:** AF-24 applied.
> - **Action:** start `npx vite --port 3111`, request `/data/theme-manifest.json` **three** times, then stop and count `grep -c "Processing 2 theme files" ` in the captured server log.
> - **Checkpoint:** the count is `1`, not `3`.
> - **Evidence:** paste the count and the three HTTP status codes, all of which must be 200.
> - **Blocked:** do not proceed to Step 4.

---

## Step 4 — AF-07: admin route boilerplate

All four handlers in `admin/server/api-routes.ts` repeat one shape: `try`, do one thing, build `ApiResponse<T>`, `catch`, `console.error`, build `ApiResponse<null>`, respond. 152 lines expressing about four lines of behaviour.

**Do not write an `asyncHandler` wrapper.** An earlier revision of this document prescribed one. That was correct for Express 4 and is wrong now. Express 5's router awaits a handler's returned promise and forwards rejections to `next` itself — see `node_modules/router/lib/layer.js:150-156`:

```js
const ret = fn(req, res, next);
if (isPromise(ret)) {
  /* ... rejection is routed to next ... */
}
```

An `asyncHandler` would be a hand-rolled reimplementation of framework behaviour, which is exactly the kind of legacy pattern this plan exists to remove.

**What to do instead.** Delete the `try`/`catch` from all four handlers and let them throw. Add one error-handling middleware — a four-argument `(err, req, res, next)` function — registered in `admin/server/index.ts` **after** the routes and **before** the 404 handler. It logs and emits the `ApiResponse<null>` shape.

Preserve the existing status codes exactly — `400` for a failed write, `500` for a thrown error, `201` for create — because the admin UI branches on them. Note that this means the distinction survives: a _failed_ write returns `400` from the handler explicitly, while a _thrown_ error reaches the error middleware and becomes `500`. Do not collapse the two.

Two Express 5 details to confirm while you are in this file:

- The catch-all 404 at `index.ts:67` uses `app.use()` with no path. That is still valid in Express 5, but it must be registered after the error middleware for both to work.
- `Request<{ id: string }>` annotations are already migrated for path-to-regexp 8. Leave them.

> ### GATE 7.4 — The admin API behaves identically
>
> - **Trigger:** refactor applied.
> - **Action:** start the admin server (`npm run admin:server`) and exercise all five endpoints with `curl`: `GET /health`, `GET /api/posts`, `POST /api/posts` with no title, `PATCH /api/posts/:id` with an empty body, `DELETE /api/posts/:id` with an unknown id. Then force a throw — temporarily point `BACKLOG_PATH` at a directory instead of a file — and request `GET /api/posts` once more.
> - **Checkpoint:** the five normal requests return `200`, `200`, `400`, `400`, `400`, and every body is JSON with a boolean `success` field. The forced-throw request returns **`500`** with the same body shape, proving the error middleware caught a rejection that no `try`/`catch` handled.
> - **Evidence:** paste the six status codes and the six bodies.
> - **Blocked:** do not start Step 5. The admin app has no test coverage and no snapshot, so this manual sweep is the only verification it gets. The sixth request is the one that proves the Express 5 behaviour actually works here — without it you have removed the `try`/`catch` on the strength of a documentation claim rather than an observation.

---

## Step 5 — AF-06: retire the pass-through facades

Last, and only with everything above committed.

`TemplateProcessor` delegates `isCompleteHtmlDocument` (`:87`), `extractMetadata` (`:130`), `extractMarkdownFrontmatter` (`:140`), and `clearCache` (`:150`) in one line each. `MarkdownProcessor` delegates similarly to five module classes. Both were kept "for backward compatibility" with no external consumers — the only importers are files in the same directory.

Phase 3 additionally orphaned two methods that must be deleted here: `MarkdownProcessor.renderMarkdownBody` and `TemplateProcessor.extractMarkdownFrontmatter`. Both lost their only caller when the dev-server markdown fallback was removed.

What to do:

1. Delete the two orphaned methods.
2. Move `TemplateProcessor.partialCache` onto `TemplateEngine`, beside the template cache it duplicates in purpose. `clearCache` then clears both, and `TemplateProcessor` stops holding state.
3. Have callers use the modules directly where the facade adds nothing. `isCompleteHtmlDocument` and `extractMetadata` are the clear cases.
4. **Keep** `MarkdownProcessor`. Its two generated-file maps are real state with real lifecycle (`resetBuildState`, `rebuildManifestFromDocuments`) and belong in a class.
5. `TemplateProcessor` may survive as a thin composition root if `processTemplate` still earns it after Phase 4 — that method does template selection and partial injection, which is genuine behaviour. Judge it on what remains, not on the original intent.

> ### GATE 7.5 — The facade retirement changed no output
>
> - **Trigger:** the refactor is applied.
> - **Action:** `npx tsc --noEmit && npm test`.
> - **Checkpoint:** `tsc` exits zero and there are **zero snapshot mismatches**.
> - **Evidence:** paste both.
> - **Blocked:** do not close the phase and do not run `vitest -u`. This is a pure structural refactor — a snapshot change means behaviour moved, and the only correct response is to find out why. This gate is why AF-06 is sequenced last: everything before it is already committed, so `git bisect` has a clean boundary.

---

## Step 6 — Reconcile the documentation

Phase 2 deliberately deferred this. The builder READMEs document symbols that no longer exist.

Known stale references, all in `source/builder/README.md`: `shouldProcessHtml()` (`:718`), `getChangedHtmlFiles()` (`:721`, `:746`), `getChangedMarkdownFiles()` (`:720`, `:745`), `processMarkdownFile()` (`:605`), `escapeHtmlAttribute()` (`:61`), `escapeHtmlComment()` / `unescapeHtmlComment()` (`:62`), and the manifest example at `:408-414` showing a `generatedAt` field that `blog-manifest.json` does not have.

`source/site/styles/README.md` documents `formStyles` usage that no longer exists.

> ### GATE 7.6 — Docs describe the code that exists
>
> - **Trigger:** README updates applied.
> - **Action:** for every symbol name appearing in a code span in `source/builder/README.md` and `source/site/styles/README.md`, verify it resolves in `source/`.
> - **Checkpoint:** zero documented symbols are missing from the codebase.
> - **Evidence:** list every symbol you checked and its resolution, or state the count checked and name the ones you removed.
> - **Blocked:** the phase cannot close. Documentation describing deleted APIs is what made Phase 2's dead-code analysis require a manual grep of every symbol in the first place — leaving it stale hands the same problem to the next audit.

---

## Exit gate

> ### GATE 7.7 — Phase 7 complete
>
> - **Trigger:** Steps 1 through 6 done.
> - **Action:** `npx tsc --noEmit && npx prettier --check . && npm test`, plus the checks below.
> - **Checkpoint:** all of the following:
>   1. Three commands exit zero.
>   2. Zero snapshot mismatches, other than the two deletions and the manifest update from GATE 7.2.
>   3. `git status --short` is clean — no stray artifacts.
>   4. `grep -rn "renderMarkdownBody\|extractMarkdownFrontmatter" source` returns nothing.
>   5. `grep -c "vue-cli-service-build" netlify.toml` returns `0`.
>   6. Admin endpoint sweep from GATE 7.4 passed.
>   7. Theme files read once per dev session per GATE 7.3.
>   8. No documented symbol in either README is missing from the code.
> - **Evidence:** paste all eight, numbered.
> - **Blocked:** the plan is not complete until every item passes.

## Report on completion

1. The eight exit-gate results.
2. Which route you took for AF-28, and the new `totalPosts`.
3. What survived of `TemplateProcessor`, and the reasoning.
4. Net line change across the whole plan — Phase 1's starting commit to here.
5. Any finding you could not complete, and why.

Then set AF-06, AF-07, AF-24, AF-26, AF-28, AF-29, AF-31, and AF-32 to `fixed` in `architecture-audit.md`. Confirm every one of the 32 rows now reads `fixed` or carries a written justification for another status.
