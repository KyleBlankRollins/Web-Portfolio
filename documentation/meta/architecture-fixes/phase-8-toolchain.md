# Phase 8 — Toolchain modernization

**Findings:** AF-33, AF-34, AF-35, AF-36, AF-37, AF-38, AF-39, AF-40, AF-41, AF-42, AF-43, AF-44
**Depends on:** Phase 1 (snapshot). Independent of Phases 2–7.
**Risk:** Low for Steps 1–5. Step 6 is a spike that may correctly conclude "not yet".

Read this entire file before taking any action.

## Why this phase exists

A dependency upgrade landed alongside Phase 1: Vite 8 with Rolldown, TypeScript 7, Express 5, Marked 18, Glob 13, Vitest 4, Prettier 3.9, and Node 24 in CI. Several were major-version jumps.

**Nothing is broken.** `npm run build` succeeds, `tsc --noEmit` exits zero, and all 35 tests pass. This phase is not repair work. It is about the places where the code still uses the pattern an older major wanted, while the new major ships a first-class replacement — the config option that used to be the default and no longer is, the compat shim standing in for the native API, the type import that reaches around the tool to its own dependency.

## Run this next

Take this phase immediately after Phase 1, before Phase 2. Two reasons:

1. **AF-33 makes every later gate mean the same thing on every machine.** The plan's gates are commands with expected output. Right now the local runtime, CI, and the type definitions describe three different Node versions, so "it passed locally" and "it passed in CI" are not the same claim.
2. Everything here is low risk and mostly mechanical, so it costs little and removes toolchain ambiguity before the structural phases start rewriting the builder.

## Out of scope

- Do not upgrade or downgrade any package except `@types/node` (AF-33) and the two removals (AF-36, AF-44). The versions are the user's decision and are already chosen.
- Do not restructure builder logic. AF-41 changes how `marked` is configured, not what the renderer does.
- Do not touch Phase 7's items even though this phase is also hygiene-flavoured. They stay in Phase 7 because they depend on Phases 3 and 4.

---

## Step 1 — AF-33: one Node version, stated three times

Local runtime is v22.19.0, CI pins 24, `@types/node` is `^26.1.2`. Nothing enforces any of it.

1. Add `"engines": { "node": ">=24" }` to `package.json`.
2. Create `.nvmrc` at the repository root containing `24`.
3. Change `@types/node` to `^24` and reinstall.

Node 24 is the floor because CI already uses it and Vite 8 requires 20.19+/22.12+/24+. If you would rather standardize on 22, that is a legitimate choice — but then change CI too, and say so in your report. What is not acceptable is leaving three different answers.

> ### GATE 8.1 — One answer to "which Node"
>
> - **Trigger:** all three edits made and `npm install` has run.
> - **Action:** run `node -p "require('./package.json').engines.node"`, `cat .nvmrc`, `node -p "require('./node_modules/@types/node/package.json').version"`, and `grep "node-version" .github/workflows/ci.yml`.
> - **Checkpoint:** all four report the same major version.
> - **Evidence:** paste all four outputs side by side.
> - **Blocked:** do not proceed to Step 2. If your local runtime is still below the declared floor, install the right Node first — running the rest of this phase's gates on a runtime the project now formally disallows makes their results meaningless.

> ### GATE 8.2 — The narrower types still satisfy the code
>
> - **Trigger:** `@types/node` downgraded.
> - **Action:** `npx tsc --noEmit && npm test`.
> - **Checkpoint:** `tsc` exits zero, zero snapshot mismatches.
> - **Evidence:** paste both.
> - **Blocked:** do not proceed. A `tsc` failure here is a real finding: it means the code was using a Node API that does not exist in the version you ship on. Report the specific API rather than reverting the type version to make the error disappear.

---

## Step 2 — AF-44, AF-36: dependency placement

**AF-44.** Remove `@types/glob`. Glob has shipped its own types since v8; the installed stub is `8.1.0` against `glob@13.0.6`, so it describes an API five majors old and can shadow the real one.

**AF-36.** `prismjs` runs only at build time. Verify this yourself before acting: `grep -rn "prismjs\|Prism" source/site` should return nothing, and the only importer should be `builder/modules/markdown-renderer.ts`.

Then make three changes:

1. Move `prismjs` from `dependencies` to `devDependencies`.
2. Delete the `prism` branch from `manualChunks` in `vite.config.ts:25-27`. It can never fire.
3. Remove `"prismjs"` from `optimizeDeps.include` (`vite.config.ts:44`). It never enters the client module graph.

Leave `prism-theme.css` alone. That styles the build-time output and is a genuine site asset. Leave `@types/prismjs` in `devDependencies` — the builder needs it.

> ### GATE 8.3 — Prism was never in the bundle, and still is not
>
> - **Trigger:** all four changes made.
> - **Action:** `npm run build`, then `ls dist/assets/*.js` and `grep -rlc "prism" dist/assets/*.js`.
> - **Checkpoint:** no `prism-*.js` chunk exists — it did not before this change either — and no emitted JS chunk contains Prism's runtime. The CSS bundle still contains the `language-` token classes from `prism-theme.css`.
> - **Evidence:** paste the chunk listing and the grep result.
> - **Blocked:** do not proceed to Step 3. If a chunk _does_ contain Prism, the premise is wrong: something in the site imports it, `prismjs` belongs in `dependencies`, and only the dead `manualChunks` branch should be removed. Report that and stop.

---

## Step 3 — AF-34, AF-35, AF-37: the Vite 8 build config

**AF-34.** Delete `minify: "esbuild"` from `vite.config.ts:14`. The comment claims it is the default; in Vite 8 the default is `oxc` and this line opts out of it. Delete the comment with the line.

**AF-37.** Change `build.target` from `"es2020"` to `"es2022"`, matching `tsconfig.json`'s `target`. Two floors for one codebase is one too many, and the lower one buys downleveling nothing needs.

**AF-35.** Replace the `manualChunks` function with Rolldown's native declarative form:

```ts
output: {
  advancedChunks: {
    groups: [{ name: "lit", test: /node_modules[\\/]lit/ }],
  },
  chunkFileNames: "assets/[name]-[hash].js",
  entryFileNames: "assets/[name]-[hash].js",
  assetFileNames: "assets/[name]-[hash].[ext]",
}
```

Only the `lit` group survives — the `prism` group went in Step 2.

Do these three together and verify once. They all move the same file and all affect the same output.

> ### GATE 8.4 — Same chunks, same content
>
> - **Trigger:** all three changes applied.
> - **Action:** `npm run build`, then compare `ls dist/assets/` against the listing from GATE 8.3, and run `npm test`.
> - **Checkpoint:** the same set of chunks is emitted — one `lit-*.js`, one `index-*.js`, one `index-*.css`. Snapshot mismatches are confined to asset filename hashes, which Phase 1's normalization absorbs, so the expected result is **zero mismatches**.
> - **Evidence:** paste both chunk listings and the test summary.
> - **Blocked:** do not proceed to Step 4. A changed chunk _set_ means `advancedChunks` did not reproduce the previous grouping — most likely the `test` regex does not match on this platform, since Rolldown matches against module IDs and the path separator differs. A snapshot mismatch touching page markup means a minifier or target change altered emitted HTML, which is unexpected and must be explained.

Record the bundle byte totals before and after. The `es2022` target and the oxc minifier should each shrink the output slightly; report the numbers rather than assuming.

---

## Step 4 — AF-38, AF-42, AF-43: import hygiene

Three mechanical rewrites. Commit separately.

**AF-38.** Replace the two imports that reach around Vite:

```ts
// dev-server-middleware.ts:2 — `connect` is not in package.json at all
import type * as Connect from "connect";
// html-bundle-processor.ts:8 — a second copy of the bundler Vite already bundles
import type { OutputBundle, PluginContext } from "rolldown";
```

with Vite's own re-exports:

```ts
import type { Connect, Rolldown } from "vite";
```

Both namespaces are in Vite 8's export list (`node_modules/vite/dist/node/index.d.ts:4054`). Then remove `rolldown` from `devDependencies` — the plugin should depend on Vite's view of the bundler, not the bundler directly.

**AF-42.** Rewrite all 35 bare builtin specifiers to use the `node:` prefix — 16 × `path`, 15 × `fs`, 3 × `child_process`, 1 × `os`, 1 × `http`, across `source/` and `scripts/`.

**AF-43.** Replace the four `__dirname` uses in `source/admin/vite.config.ts` (`:11`, `:20`, `:26`, `:27`) with `import.meta.dirname`. `__dirname` is a CommonJS global in a package declaring `"type": "module"`; it works only because Vite shims config loading.

> ### GATE 8.5 — Nothing reaches outside the declared dependency set
>
> - **Trigger:** all three rewrites done and `npm install` has run.
> - **Action:** run `grep -rn "from \"connect\"\|from \"rolldown\"" source`, then `grep -rn "from \"\(fs\|path\|os\|http\|child_process\)\"" source scripts`, then `grep -rn "__dirname" source scripts vite.config.ts`, then `npx tsc --noEmit && npm test`.
> - **Checkpoint:** the first three greps return **nothing**. `tsc` exits zero, zero snapshot mismatches.
> - **Evidence:** paste all three greps and both command results.
> - **Blocked:** do not proceed to Step 5 until the greps are empty. A partial `node:` rewrite is worse than none — it makes the remaining bare specifiers look deliberate.

> ### GATE 8.6 — The admin build still resolves its own paths
>
> - **Trigger:** AF-43 applied.
> - **Action:** `npx vite build --config source/admin/vite.config.ts`.
> - **Checkpoint:** the build succeeds and emits `dist-admin/index.html` plus one JS and one CSS asset.
> - **Evidence:** paste the build output.
> - **Blocked:** the phase cannot close. Nothing else in this plan exercises the admin Vite config, and `import.meta.dirname` returning `undefined` would surface as a confusing root-resolution error rather than a clean failure. Delete `dist-admin/` afterwards — it is not tracked and not part of the site build.

---

## Step 5 — AF-39, AF-41: shed the legacy runtime patterns

**AF-39.** Set `emitDecoratorMetadata: false` in `tsconfig.json`.

The production bundle currently contains 74 `design:type` and 6 `design:paramtypes` `Reflect.metadata` calls. Nothing reads them — no `reflect-metadata` import, no DI container, no `Reflect.getMetadata` anywhere in `source/`. Measured effect: 122,770 → 120,699 bytes raw, 27,486 → 27,225 gzipped.

This is independent of AF-40 and should land regardless of how the spike turns out.

**AF-41.** `MarkdownRenderer`'s constructor calls `marked.setOptions` twice (`markdown-renderer.ts:51`, `:128`), configuring the global singleton. `ContentPreprocessor.preprocessAdmonitions` (`content-preprocessor.ts:60`) then calls `marked.parseInline`, reading whatever options the renderer installed — two modules coupled through a global, with no import between them expressing it.

Marked has exported a `Marked` class since v5 for exactly this. Give `MarkdownRenderer` its own instance:

```ts
private marked = new Marked({ gfm, breaks, renderer });
```

and have `ContentPreprocessor` accept a `Marked` instance as a constructor parameter rather than reaching for the global. `MarkdownProcessor` already constructs both (`markdown-processor.ts:43-44`), so it is the natural place to create the instance and pass it in.

This makes the coupling explicit and both modules independently testable, which the Phase 1 test files will immediately benefit from.

> ### GATE 8.7 — No global marked state remains
>
> - **Trigger:** both changes applied.
> - **Action:** run `grep -rn "marked.setOptions\|marked.parseInline\|marked.parse(" source`, then `grep -c "design:type" dist/assets/index-*.js` after a rebuild, then `npm test`.
> - **Checkpoint:** the first grep shows no call on the bare `marked` import — every call goes through an instance. `design:type` count is `0`. Zero snapshot mismatches.
> - **Evidence:** paste the grep, the count, and the test summary.
> - **Blocked:** do not start Step 6. A snapshot mismatch here is significant: it would mean the global options and the instance options were not equivalent, and the diff shows which rendering setting was actually in effect before. Investigate and report rather than updating the baseline.

---

## Step 6 — AF-40: the standard decorators spike — RESOLVED, do not re-run

**Outcome: ABANDON. AF-40 is `wontfix`, blocked upstream on [oxc#9170](https://github.com/oxc-project/oxc/issues/9170).**

This step is kept as a record rather than an instruction. Do not re-run it. The full evidence is in `architecture-audit.md` under AF-40; the summary is:

- **TypeScript is not the blocker.** TS 7 supports standard decorators and Lit 3.3's typings are standard-decorator-ready. `@state() accessor x!: T` and its variants compile clean.
- **Oxc is the blocker.** It lowers legacy decorators but not standard ones. With `experimentalDecorators: false` and a correctly converted component, the emitted chunk contains raw `@n()accessor supplements=[]` and `node --check` throws `SyntaxError`. The site would not load.
- Re-open when oxc#9170 closes.

### Correction to this step's original instructions

The earlier version of this step told the implementer to "convert exactly **one** component" and then run `npx tsc --noEmit`. **That instruction was wrong**, and it is worth understanding why, because it produced a misleading result.

`experimentalDecorators` is a **project-wide** compiler switch. Flipping it while 96 of 97 decorated fields still use the old form guarantees a wall of errors in the untouched components — 67 × TS1206, 7 × TS1270, 7 × TS1240, 20 × TS6133 across `source/site` alone. Those errors say nothing about feasibility; they say the migration is incomplete, which it was by design.

An implementer following the original step would reasonably read that wall as "TypeScript cannot do this" and stop — which is exactly what happened, and it recorded the wrong reason on the finding. The correct reason lay one step further downstream, in the bundler, and could only be reached by ignoring `tsc` and inspecting the emitted bundle.

**The general lesson for gates in this plan:** when a spike flips a project-wide flag, `tsc` is not a valid checkpoint for a single-file change, because the flag's blast radius is the whole project. The checkpoint has to be the artifact the flag actually affects. Had GATE 8.8 said "run `vite build`, which does not typecheck, and inspect the chunk" rather than implying a `tsc` gate first, it would have reached the right answer directly.

### If this is ever re-run

Use this procedure, not the original one:

1. Branch. Set `experimentalDecorators: false` and `useDefineForClassFields: true`.
2. Convert **all** decorated fields, not one — roughly 58 `@state()` and 39 `@property()` across 30 components. Mechanically, `declare x: T` → `accessor x!: T`, and `private x = init` → `accessor x = init`.
3. `npx tsc --noEmit` should now be clean. If it is not, the migration is still incomplete — that is the only thing a `tsc` failure means here.
4. `npm run build`, then inspect the emitted chunk.

> ### GATE 8.8 — Decide on the bundle, not on the compiler
>
> - **Trigger:** the fully converted build has completed.
> - **Action:** locate the emitted chunk containing a converted component. Run `node --check` on a copy of it, and count occurrences of the literal `accessor` keyword and of raw `@` decorator syntax applied to a class or field.
> - **Checkpoint:** exactly one of two conclusions, stated explicitly:
>   - **PROCEED** — `node --check` parses the chunk, zero surviving `accessor` keyword, zero raw decorator syntax, and a downlevel helper present.
>   - **ABANDON** — `node --check` throws, or either token survives. Revert everything and leave AF-40 `wontfix`.
> - **Evidence:** paste the `node --check` result, the two counts, and the surrounding bundle excerpt. Then state PROCEED or ABANDON.
> - **Blocked:** a green `tsc` does not resolve this gate and never did. The Phase 1 snapshot does not resolve it either — it normalizes asset fingerprints and the emitted HTML is byte-identical whether or not the JavaScript parses, so **every other gate in this plan stays green while the site is completely broken**. `node --check` on the chunk is the only checkpoint that distinguishes the two outcomes.

---

## Exit gate

> ### GATE 8.9 — Phase 8 complete
>
> - **Trigger:** Steps 1 through 6 done, or Step 6 explicitly abandoned.
> - **Action:** `npx tsc --noEmit && npx prettier --check . && npm test`, plus the checks below.
> - **Checkpoint:** all of the following:
>   1. Three commands exit zero, zero snapshot mismatches.
>   2. `engines.node`, `.nvmrc`, `@types/node` major, and CI `node-version` all agree.
>   3. `grep -rn "from \"connect\"\|from \"rolldown\"\|__dirname" source scripts vite.config.ts` returns nothing.
>   4. `grep -rn "from \"\(fs\|path\|os\|http\|child_process\)\"" source scripts` returns nothing.
>   5. `grep -c "design:type" dist/assets/index-*.js` returns `0`.
>   6. `grep -rn "minify:\|manualChunks\|prismjs" vite.config.ts` returns nothing.
>   7. `node -p "Object.keys(require('./package.json').dependencies)"` shows `lit` and `marked` only.
>   8. `npx vite build --config source/admin/vite.config.ts` succeeds, and `dist-admin/` is deleted afterwards.
>   9. AF-40 is resolved as either fully migrated or `wontfix` with bundle evidence.
> - **Evidence:** paste all nine, numbered.
> - **Blocked:** the phase is not complete until every item passes. Item 9 must cite the bundle, not a rationale.

## Report on completion

1. The nine exit-gate results.
2. Bundle byte totals at four points: phase start, after Step 3 (target + minifier), after Step 5 (decorator metadata), and phase end.
3. Whether GATE 8.2 surfaced any code relying on a Node API above the declared floor.
4. The PROCEED or ABANDON decision for AF-40, with the bundle excerpt that decided it.
5. Anything the `marked` singleton was doing that the instance change surfaced.

Then set AF-33 through AF-39 and AF-41 through AF-44 to `fixed` in `architecture-audit.md`, and AF-40 to `fixed` or `wontfix` per the spike outcome.
