# Phase 1 — Safety net

**Findings:** AF-01 (no tests), AF-25 (Rollup/Connect typed as `any`), AF-27 (`scripts/` not type-checked), AF-30 (no CI)
**Depends on:** nothing
**Risk:** Low — this phase adds files and types. It changes no runtime behaviour.

Read this entire file before taking any action.

## Why this phase exists

The builder's core operations are string rewriting: regex-driven variable substitution, regex-driven metadata parsing, regex-driven tag relocation. There is currently no automated check that any of it works. Every later phase in this plan rewrites some of that code.

This phase builds the thing that makes the rest of the plan safe: a **golden-file snapshot of the built site**. Phases 2, 3, 4, 6, and 7 all assert against it. Get this right and the rest of the work is routine. Get it wrong and every later gate silently degrades into a rule.

## Out of scope

Do not, in this phase:

- Fix any bug you find while writing tests. If a test you write fails against current behaviour, that is a Phase 3 finding — write the test to assert **current** behaviour, mark it with a `// AF-NN: asserts current (incorrect) behaviour, see phase 3` comment, and move on.
- Delete any dead code. That is Phase 2.
- Refactor any module to make it easier to test. If a module resists testing, note it and test what you can.

---

## Step 1 — Install Vitest

```bash
npm install --save-dev vitest
```

Create `vitest.config.ts` at the repository root:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["source/**/*.test.ts"],
    environment: "node",
    testTimeout: 20000,
  },
});
```

Add to `package.json` scripts, preserving the existing entries:

```json
"test": "vitest run",
"test:watch": "vitest"
```

> ### GATE 1.1 — Runner executes
>
> - **Trigger:** you believe Vitest is installed and configured.
> - **Action:** create a throwaway file `source/builder/smoke.test.ts` containing a single `it("runs", () => { expect(1).toBe(1); })`, then run `npm test`.
> - **Checkpoint:** output contains `Test Files  1 passed (1)` and `Tests  1 passed (1)`.
> - **Evidence:** paste the summary block.
> - **Blocked:** do not write any real test until this passes. Delete `smoke.test.ts` immediately after the gate passes.

---

## Step 2 — Unit tests for the pure modules

Create one test file per module, colocated as `<module>.test.ts` beside the module.

These modules are already dependency-injected and free of side effects apart from `fs` reads, so they need no mocking beyond temp fixtures.

| Module                                  | File to create                         | Minimum cases                                                                                                                                                         |
| --------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `modules/template-engine.ts`            | `modules/template-engine.test.ts`      | `{{var}}` escapes; `{{{var}}}` does not; `{{#var}}…{{/var}}` keeps on truthy and strips on empty; `series.name` dot notation resolves; unmatched `{{foo}}` is removed |
| `modules/metadata-extractor.ts`         | `modules/metadata-extractor.test.ts`   | each comment key round-trips; `series.name` + `series.part` reassemble to an object; comments are removed from the returned content                                   |
| `modules/frontmatter-parser.ts`         | `modules/frontmatter-parser.test.ts`   | YAML block parses; `date` produces `formattedDate`; missing frontmatter returns content unchanged; `tags` becomes an array                                            |
| `modules/content-preprocessor.ts`       | `modules/content-preprocessor.test.ts` | `//` line comments stripped outside fences; comments **inside** fenced blocks preserved; `<kbr-admonition>` inner markdown rendered inline                            |
| `modules/citation-processor.ts`         | `modules/citation-processor.test.ts`   | a reference produces a footnote; an unknown reference does not throw; output escapes `title` and `author`                                                             |
| `modules/content-discovery.ts`          | `modules/content-discovery.test.ts`    | standalone post discovered; directory post discovered; `supplements/` classified as supplement candidate; duplicate public URLs throw                                 |
| `html-utils.ts` (`HtmlProcessingUtils`) | `html-utils.test.ts`                   | `extractTitleFromContent` prefers `<h1>`; `injectAssets` places CSS in head and JS before `</body>`; `normalizeAssetPlacement` is idempotent                          |

For `content-discovery.test.ts`, build fixtures under a temp directory with `fs.mkdtempSync(join(tmpdir(), "kbr-"))` and pass the path to the `ContentDiscovery` constructor, which already accepts a `publishedRoot` override. Do not point tests at `source/site/content/published`.

> ### GATE 1.2 — Unit suite is real
>
> - **Trigger:** you believe the seven test files are complete.
> - **Action:** run `npm test`.
> - **Checkpoint:** all of the following hold — `Test Files  7 passed (7)`; total test count is **at least 30**; zero occurrences of the word `failed` in the output.
> - **Evidence:** paste the full summary block, including the test count.
> - **Blocked:** do not start Step 3 until this passes. A suite with fewer than 30 assertions across seven modules is not covering the behaviour the later phases will rewrite — add cases rather than lowering the bar.

Any test that had to assert incorrect behaviour must carry its `// AF-NN` comment. List them in your report.

---

## Step 3 — The golden-file build snapshot

This is the deliverable the rest of the plan depends on.

Create `source/builder/build-output.test.ts`:

1. In a `beforeAll` with a 180-second timeout, run the real build: `execSync("npm run build", { cwd: process.cwd(), stdio: "pipe" })`.
2. Read every `.html` file under `dist/`, recursively, sorted by path.
3. Read `dist/data/blog-manifest.json` and `dist/data/theme-manifest.json`.
4. Normalize, in this exact order:
   - Asset fingerprints: replace `/-[A-Za-z0-9_-]{8}\.(js|css)/g` with `-HASH.$1`.
   - Theme manifest timestamp: replace the value of `"generatedAt"` with `"NORMALIZED"`. This field is `new Date().toISOString()` (`theme-processor.ts:157`, `:170`) and is the only nondeterministic value in the output. `blog-manifest.json` has no timestamp and needs no normalization.
5. Assert each normalized document against a per-file snapshot:

```ts
await expect(normalized).toMatchFileSnapshot(
  `./__snapshots__/${relativePath}.snap`
);
```

Commit the generated `__snapshots__/` directory. It is the baseline.

> ### GATE 1.3 — Snapshot is complete
>
> - **Trigger:** the snapshot test has run and written files.
> - **Action:** run `ls source/builder/__snapshots__/ | wc -l` and `npm test`.
> - **Checkpoint:** the snapshot directory contains **at least 13 files** — 11 HTML pages plus 2 manifests. The current build emits `index.html`, `blog.html`, `career.html`, `portfolio.html`, `theme-demo.html`, and six generated post pages including one nested supplement path.
> - **Evidence:** paste the `ls` output and the test summary.
> - **Blocked:** do not proceed to Step 4 until the count is right. A snapshot missing pages will not catch a regression on those pages, which defeats the purpose of the phase.

> ### GATE 1.4 — Snapshot is deterministic
>
> - **Trigger:** GATE 1.3 passed.
> - **Action:** run `npm test` a second time, with no source changes in between.
> - **Checkpoint:** zero snapshot mismatches, and `git status --short source/builder/__snapshots__/` prints nothing.
> - **Evidence:** paste both the test summary and the `git status` output (which must be empty).
> - **Blocked:** do not proceed until the snapshot is stable across runs. **This is the most important gate in the entire plan.** A snapshot that differs between two identical builds contains unnormalized nondeterminism, and every later phase that gates on it will produce false failures — which trains whoever is running those phases to ignore the gate. If this fails, find the varying field, add it to the normalization list in Step 3, regenerate, and re-run this gate.

---

## Step 4 — AF-25: type the Rollup and Connect APIs

Replace `any` with real types. No behaviour changes.

**`source/builder/html-bundle-processor.ts`** — `processBundle(bundle: any, emitFile: any, ...)` at `:23-25`, plus the `bundle: any` parameters on `extractAssets` (`:54`) and `processExistingHtmlFiles` (`:76`), and `emitFile: any` on `processAdditionalHtmlFiles` (`:108`) and `emitGeneratedFiles` (`:149`).

Import from `rollup`: `OutputBundle`, `OutputAsset`, `EmitFile`. Note that `builder/index.ts:432` currently does `this.emitFile.bind(this)` to work around the lost plugin context — once `emitFile` is typed as `EmitFile` the bind can stay, but verify the call still type-checks.

**`source/builder/dev-server-middleware.ts`** — the twenty `req: any, res: any, next: any` annotations. Vite re-exports Connect's types; use `Connect.IncomingMessage`, `http.ServerResponse`, and `Connect.NextFunction`.

Leave `generatedFile: any` at `:229` alone — it becomes `GeneratedHtmlFile` in Phase 4.

> ### GATE 1.5 — Typing added nothing and broke nothing
>
> - **Trigger:** you believe the `any` removal is complete.
> - **Action:** run `npx tsc --noEmit` then `npm test`.
> - **Checkpoint:** `tsc` exits zero, and the snapshot test reports **zero mismatches**.
> - **Evidence:** paste the `tsc` exit status and the test summary.
> - **Blocked:** do not proceed to Step 5. A snapshot mismatch here means you changed behaviour while adding types, which is out of scope for this step — revert and redo with types only.

---

## Step 5 — AF-27 and AF-30: type-check `scripts/`, and add CI

**AF-27.** In `tsconfig.json`, change `"include": ["source"]` to `"include": ["source", "scripts"]`. `scripts/lint-prose.ts` is 418 lines that `tsc` has never seen. If it now reports errors, fix them — they are real. If the fixes are more than mechanical, stop and report rather than reworking the script.

**AF-30.** Create `.github/workflows/ci.yml`. Trigger on `push` and `pull_request`. One job on `ubuntu-latest`, Node 20 with `cache: npm`, running in order:

```
npm ci
npx tsc --noEmit
npx prettier --check .
npm test
```

Do **not** add `npm run lint:prose` to CI in this phase — it requires the Vale binary, which is a separate setup concern. Note it as a follow-up.

> ### GATE 1.6 — CI passes locally
>
> - **Trigger:** the workflow file exists.
> - **Action:** run the four CI commands locally in order, exactly as written in the workflow.
> - **Checkpoint:** all four exit zero. If `prettier --check` fails, run `npx prettier --write .` and re-run the full sequence.
> - **Evidence:** paste the exit status of each of the four commands.
> - **Blocked:** do not open a pull request until all four pass locally. A workflow whose first run is red is worse than no workflow.

---

## Exit gate

> ### GATE 1.7 — Phase 1 complete
>
> - **Trigger:** all five steps are done.
> - **Action:** run `npx tsc --noEmit && npx prettier --check . && npm test`, then `git status --short`.
> - **Checkpoint:** every one of these holds:
>   1. All three commands exit zero.
>   2. Test files ≥ 8, tests ≥ 30, failures 0.
>   3. `source/builder/__snapshots__/` contains ≥ 13 committed files.
>   4. `git status --short` shows no unstaged modifications to snapshot files.
>   5. `grep -rn ": any" source/builder/html-bundle-processor.ts` returns nothing.
> - **Evidence:** paste the output of all five checks, numbered.
> - **Blocked:** Phase 2 may not begin until every item passes. Phase 2's only regression gate is this snapshot.

## Report on completion

State, in this order:

1. The five exit-gate check results.
2. Every test written that asserts known-incorrect behaviour, with its `AF-NN` reference. Phase 3 will invert these.
3. Any module that resisted testing, and why.
4. Whether `tsc` found real errors in `scripts/lint-prose.ts`, and what you changed.

Then update the Status column in `architecture-audit.md` to `fixed` for AF-01, AF-25, AF-27, and AF-30. Change nothing else in that file.
