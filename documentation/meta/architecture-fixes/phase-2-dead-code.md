# Phase 2 — Dead code removal

**Findings:** AF-16, AF-17, AF-18, AF-19, AF-20, AF-21, AF-22, AF-23
**Depends on:** Phase 1 (the golden-file snapshot is this phase's only regression gate)
**Risk:** Low — every deletion here is provably unreachable.

Read this entire file before taking any action.

## Why this phase exists

Roughly 400 lines of the builder and site are unreachable. They are not merely unused: several document behaviour the project does not have — a base-branch comparison mode, a build-plan API, an HTML-change detection path — which misleads anyone reading the code to understand how the build works.

Removing them before Phases 3 and 4 means those phases operate on a smaller, honest surface.

## The deletion standard

Everything in this phase was established unreachable by grep across `source/`, `scripts/`, and `vite.config.ts`. Matches inside `README.md` files were **not** counted as usage, because several READMEs document APIs that no longer have callers.

Before deleting each symbol, re-establish that independently. Do not trust this document's claim on its own — the tree has moved before.

## Out of scope

- Do not fix behaviour. If deleting dead code reveals a bug in live code, note it and leave it.
- Do not delete `buttonStyles` or `layoutStyles` from `shared-styles.ts`. Both are genuinely imported by seven components.
- Do not touch `theme-changed` (`theme-switcher.ts:171`). It is documented public API. `AF-15` covers the other events, in Phase 3.
- Do not update the builder `README.md` files yet. Several document the symbols you are deleting; that cleanup happens in Phase 7 as a single pass.

---

## Step 1 — Prove the deletion set

For each symbol in the table below, run a grep and confirm the only matches are its own declaration, its own internal callers within the dead subtree, and `README.md` files.

| #   | Finding | Symbol                              | File                                    | Line |
| --- | ------- | ----------------------------------- | --------------------------------------- | ---- |
| 1   | AF-16   | `getBuildPlan()`                    | `builder/git-aware-pipeline.ts`         | 261  |
| 2   | AF-16   | `shouldProcessHtml()`               | `builder/git-aware-pipeline.ts`         | 84   |
| 3   | AF-16   | `getMissingHtmlFiles()`             | `builder/git-aware-pipeline.ts`         | 113  |
| 4   | AF-16   | `shouldClearTemplateCache()`        | `builder/git-aware-pipeline.ts`         | 204  |
| 5   | AF-17   | `getChangedBuildFiles()`            | `builder/git-utils.ts`                  | 182  |
| 6   | AF-17   | `getChangedFilesSince()`            | `builder/git-utils.ts`                  | 201  |
| 7   | AF-17   | `getChangedMarkdownFilesSince()`    | `builder/git-utils.ts`                  | 237  |
| 8   | AF-17   | `getChangedHtmlFilesSince()`        | `builder/git-utils.ts`                  | 260  |
| 9   | AF-18   | `baseBranch` on `KBRBuilderOptions` | `builder/index.ts`                      | 26   |
| 10  | AF-18   | `baseBranch: "main"` default        | `builder/index.ts`                      | 340  |
| 11  | AF-19   | `processMarkdownFile()`             | `builder/markdown-processor.ts`         | 54   |
| 12  | AF-19   | `getBlogManifest()`                 | `builder/markdown-processor.ts`         | 340  |
| 13  | AF-19   | `getGeneratedFile()`                | `builder/markdown-processor.ts`         | 354  |
| 14  | AF-19   | `clearGeneratedFiles()`             | `builder/markdown-processor.ts`         | 370  |
| 15  | AF-20   | `extractComment()`                  | `builder/modules/metadata-extractor.ts` | 145  |
| 16  | AF-20   | `formatDate()`                      | `builder/modules/metadata-extractor.ts` | 156  |
| 17  | AF-21   | `FileSystemHelper.readFile()`       | `builder/helpers.ts`                    | 65   |
| 18  | AF-22   | `getThemeById()`                    | `site/theme-config.ts`                  | 109  |
| 19  | AF-22   | `getAvailableThemeIds()`            | `site/theme-config.ts`                  | 119  |
| 20  | AF-23   | `formStyles`                        | `site/styles/shared-styles.ts`          | 444  |

Note the ordering dependency inside AF-16: `getMissingHtmlFiles` and `shouldClearTemplateCache` are reachable **only** through `getBuildPlan`, and `shouldProcessHtml` is reachable only through `getBuildPlan`. Delete `getBuildPlan` first, then re-grep — the other three become unreferenced at that point, not before.

Similarly in AF-17: `getChangedFilesSince` is called only by `getChangedMarkdownFilesSince` and `getChangedHtmlFilesSince`, which have no callers themselves. Delete the two `*Since` variants first.

> ### GATE 2.1 — The set is provably dead
>
> - **Trigger:** you have grepped all 20 symbols.
> - **Action:** for each symbol, run `grep -rn "<symbol>" source scripts vite.config.ts`.
> - **Checkpoint:** for every symbol, each match is one of — its own declaration, a caller that is itself in the deletion set, or a `.md` file.
> - **Evidence:** produce a 20-row table: symbol, match count, and a one-word classification of each non-declaration match (`internal`, `docs`).
> - **Blocked:** do not delete anything until this table exists. If any symbol has a live caller outside the set, remove it from the phase, and report it — the audit was wrong about that one.

---

## Step 2 — Delete, in dependency order

Work in this order, committing after each group:

1. **AF-16** — `git-aware-pipeline.ts`. Delete `getBuildPlan`, then `shouldProcessHtml`, `getMissingHtmlFiles`, `shouldClearTemplateCache`. Also delete the now-unused private field `_changedHtmlFiles` if nothing else reads it. Keep `getChangedHtmlFiles()` — it is still called by `logBuildStrategy` at `:238`. This removes ~110 of 285 lines, including two of the three `require()` calls flagged in AF-12.
2. **AF-17** — `git-utils.ts`. Delete the two `*Since` variants, then `getChangedFilesSince`, then `getChangedBuildFiles`. ~100 of 392 lines.
3. **AF-18** — `builder/index.ts`. Remove the `baseBranch` field from the `KBRBuilderOptions` interface and from the defaults object. Nothing reads it.
4. **AF-19** — `markdown-processor.ts`. Four public methods.
5. **AF-20** — `metadata-extractor.ts`. Delete `extractComment` and `formatDate`. After deleting `extractComment`, check whether `StringHelper` is still imported and used in that file; remove the import if not.
6. **AF-21** — `helpers.ts`. Delete `FileSystemHelper.readFile`. Check whether `readFileSync` is still used in that file; remove the import if not.
7. **AF-22** — `theme-config.ts`. Delete both exports.
8. **AF-23** — `shared-styles.ts`. Delete `formStyles`.

> ### GATE 2.2 — Compiler agrees
>
> - **Trigger:** all eight deletions are done.
> - **Action:** run `npx tsc --noEmit`.
> - **Checkpoint:** exits zero. `noUnusedLocals` and `noUnusedParameters` are enabled, so an orphaned import or parameter will surface here.
> - **Evidence:** paste the exit status.
> - **Blocked:** do not run the snapshot gate until `tsc` is clean.

---

## Step 3 — Verify the published site did not change

Deleting build-time code should leave the published HTML byte-identical. There is one expected exception, and you must confirm it is the only one.

`formStyles` (AF-23) lives in `shared-styles.ts`, which is bundled into the site's JavaScript. Removing it changes the JS bundle, which changes its content hash, which changes the hashed filename. The Phase 1 snapshot normalizes asset fingerprints to `-HASH.js`, so this should be invisible — but the bundle **size** will drop.

Everything in AF-16 through AF-22 is either build-time-only code or unbundled dead exports, so none of it should alter output at all.

> ### GATE 2.3 — Zero output regressions
>
> - **Trigger:** GATE 2.2 passed.
> - **Action:** run `npm test`.
> - **Checkpoint:** **zero snapshot mismatches** across all 13+ snapshot files.
> - **Evidence:** paste the full test summary.
> - **Blocked:** do not commit and do not proceed to Phase 3. A mismatch means something in the deletion set was not dead. Do not update the snapshot to make this pass — that would discard the evidence. Instead: bisect by reverting deletions one group at a time until the mismatch disappears, identify which symbol was live, restore it, and report.

> ### GATE 2.4 — The deletion was real
>
> - **Trigger:** GATE 2.3 passed.
> - **Action:** run `git diff --stat HEAD` against the phase's starting commit.
> - **Checkpoint:** net line change is a reduction of **at least 350 lines** across `source/`.
> - **Evidence:** paste the `--stat` summary line.
> - **Blocked:** do not close the phase. A smaller reduction means deletions were partial — most likely a method body was removed but its JSDoc block, interface entry, or barrel export in `modules/index.ts` was left behind. Re-check each of the eight groups.

---

## Exit gate

> ### GATE 2.5 — Phase 2 complete
>
> - **Trigger:** Steps 1 through 3 are done.
> - **Action:** run `npx tsc --noEmit && npx prettier --check . && npm test`, then re-grep all 20 symbols.
> - **Checkpoint:** all of the following:
>   1. Three commands exit zero.
>   2. Snapshot mismatches: zero.
>   3. All 20 symbols now return **only** `.md` matches, or no matches.
>   4. Net reduction ≥ 350 lines.
> - **Evidence:** paste all four results, numbered. For item 3, paste the grep output.
> - **Blocked:** Phase 3 may not begin until every item passes.

## Report on completion

1. The four exit-gate results.
2. Actual line reduction per file.
3. Any symbol you removed from the phase because it had a live caller, with the caller's location.
4. Any bug you noticed in live code while deleting, deferred rather than fixed.

Then set AF-16 through AF-23 to `fixed` in `architecture-audit.md`. Note in AF-12's row that two of its three `require()` calls were removed as a side effect of AF-16 — set its status to `partial`.
