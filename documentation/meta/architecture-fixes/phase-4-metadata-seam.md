# Phase 4 — Retire the metadata comment round-trip

**Findings:** AF-02
**Depends on:** Phase 1 (snapshot), Phase 2 (smaller surface), Phase 3 (escape helpers already consolidated)
**Risk:** High — this moves a seam shared by four files. It is the only genuinely difficult change in the plan.

Read this entire file before taking any action. Then read the four files named below before editing any of them.

## Why this phase exists

`markdown-processor.ts:124-150` takes a fully typed metadata object and flattens it into HTML comments. `metadata-extractor.ts:42-140` then runs ten regexes to reconstruct that object. The original is still in memory the whole time, as `GeneratedHtmlFile.metadata`.

`html-bundle-processor.ts:156-164` is where this is most visible: it reads `fileData.metadata.title` for the fallback title, and in the same call passes `fileData.content` so that the same title can be re-derived from a comment.

The consequences already visible in the code:

- `series` is flattened to two comments and reassembled with `parseInt` (`metadata-extractor.ts:109-117`).
- `citationsHtml` required a bespoke `escapeHtmlComment` / `unescapeHtmlComment` pair purely to survive the trip.
- A title or description containing `-->` corrupts the document.
- `supplements` is declared on `TemplateVariables` but has no comment form. Nothing downstream of the round trip currently reads it — `addToBlogManifest` works from `contentDocument.metadata` directly — so this is a latent gap rather than a live defect. Fixing the seam makes the type honest.

## Target design

**The rule:** metadata comments are an _authoring_ format for hand-written pages under `source/site/pages/`. They are not a _transport_ format between two functions that already share an object.

Change `HtmlProcessingUtils.processHtmlContent` from positional parameters to an options object:

```ts
static async processHtmlContent(
  templateProcessor: TemplateProcessor,
  content: string,
  options: {
    defaultTitle?: string;
    assets?: { css: string[]; js: string[] };
    metadata?: Partial<TemplateVariables>;
  } = {}
): Promise<string>
```

Behaviour:

- **`metadata` provided** → use it directly. Do not call `templateProcessor.extractMetadata`. `content` is treated as pure body HTML.
- **`metadata` omitted** → extract from comments exactly as today. This is the path for `pages/*.html` and `index.html`.

Then:

1. `markdown-processor.ts` stops emitting the comment block. `GeneratedHtmlFile.content` becomes body HTML only.
2. Generated-document callers pass their real object.
3. `MetadataExtractor` loses the fields only generated documents ever used.
4. `escapeHtmlComment` and `unescapeHtmlComment` are deleted.

### Call site inventory

There are six callers. Three switch to the typed path; three keep comment extraction.

| Caller                         | File                       | Line | Path after |
| ------------------------------ | -------------------------- | ---- | ---------- |
| `emitGeneratedFiles`           | `html-bundle-processor.ts` | 159  | **typed**  |
| `processAndServeGeneratedFile` | `dev-server-middleware.ts` | 234  | **typed**  |
| `processExistingHtmlFiles`     | `html-bundle-processor.ts` | 86   | comments   |
| `processAdditionalHtmlFiles`   | `html-bundle-processor.ts` | 120  | comments   |
| `handleIndexRequest`           | `dev-server-middleware.ts` | 95   | comments   |
| `processAndServeFile`          | `dev-server-middleware.ts` | 265  | comments   |

Line numbers assume Phases 2 and 3 have landed and will have shifted. Locate by function name.

---

## Step 0 — Establish which comment keys hand-written pages actually use

The plan assumes `pages/*.html` and `index.html` use only `title`, `description`, and `keywords`, and that the blog-only keys — `date`, `formattedDate`, `tags`, `isBlogPost`, `series.name`, `series.part`, `citationsHtml` — appear only in generated output. Step 3 deletes extraction for the blog-only keys, so that assumption has to be verified, not believed.

> ### GATE 4.1 — The comment vocabulary is known
>
> - **Trigger:** before any edit.
> - **Action:** run
>   `grep -rno "<!--[[:space:]]*[a-zA-Z.]*:" source/site/pages source/site/index.html source/site/templates`
> - **Checkpoint:** produce the complete set of distinct comment keys found. Confirm whether any of the seven blog-only keys appears in a hand-written file.
> - **Evidence:** paste the grep output and the deduplicated key set.
> - **Blocked:** do not edit `MetadataExtractor` until this set exists. If a blog-only key **does** appear in a hand-written page, that key stays in the extractor and you note the exception — Step 3's deletion list shrinks accordingly.

---

## Step 1 — Change the signature, keep behaviour identical

Convert `processHtmlContent` to the options object. Update all six call sites to the new shape, **all still on the comment path** — do not pass `metadata` yet.

This is a pure refactor. It must produce no output change, which makes it independently verifiable before the risky part begins.

> ### GATE 4.2 — Signature change is inert
>
> - **Trigger:** all six call sites converted.
> - **Action:** `npx tsc --noEmit && npm test`.
> - **Checkpoint:** `tsc` exits zero and there are **zero snapshot mismatches**.
> - **Evidence:** paste both.
> - **Blocked:** do not start Step 2. If the snapshot moved here, a call site changed meaning during a mechanical conversion — most likely `defaultTitle` was dropped or reordered at `emitGeneratedFiles`, which passes `fileData.metadata.title || "Untitled"`. Fix before continuing.

---

## Step 2 — Switch the two generated-document call sites to typed metadata

Two changes, together, in one commit:

1. In `markdown-processor.ts`, delete the `htmlWithMetadata` comment-block construction. Store `processedContent` directly as `content` in both the `generatedFiles` and `generatedFilesByPublicUrl` maps. Note that both map writes currently build the same object literal twice (`:156-170`) — build it once and store the same reference.
2. At `emitGeneratedFiles` and `processAndServeGeneratedFile`, pass `metadata: fileData.metadata` and `metadata: generatedFile.metadata` respectively.

Also type `generatedFile` at `dev-server-middleware.ts:229` as `GeneratedHtmlFile` — it was left as `any` in Phase 1 specifically for this step.

Expect **zero** snapshot change. The same values reach the template by a shorter route.

> ### GATE 4.3 — The shortcut is equivalent
>
> - **Trigger:** both changes applied.
> - **Action:** `npm test`.
> - **Checkpoint:** **zero snapshot mismatches** across all snapshot files.
> - **Evidence:** paste the test summary.
> - **Blocked:** do not proceed to Step 3, and do not run `vitest -u`. This gate is the entire point of the phase: it proves the object and the comment round-trip carried the same information. A mismatch means they did not, and the diff tells you exactly which field the round-trip was silently transforming — most likely whitespace trimming in the extractor, or the `series.part` `parseInt`. Investigate the diff and report before changing anything.

---

## Step 3 — Remove the now-dead extraction machinery

Only after GATE 4.3 is green.

1. In `modules/metadata-extractor.ts`, delete extraction for the blog-only keys confirmed unused by GATE 4.1: `date`, `formattedDate`, `tags`, `isBlogPost`, `series.name`, `series.part`, `citationsHtml`. Keep `title`, `description`, `keywords`, and the `template` comment strip. Narrow `ExtractedMetadata` to match.
2. In `modules/html-utils.ts`, delete `escapeHtmlComment` and `unescapeHtmlComment`. Remove their import in `markdown-processor.ts` and `metadata-extractor.ts`, and their export from `modules/index.ts`.
3. Update the Phase 1 test `modules/metadata-extractor.test.ts`: delete cases for removed keys, keep cases for the three that remain.
4. Make `supplements` honest. It is on `TemplateVariables` and now genuinely reaches the template via the typed path. Either wire it to something that consumes it, or remove it from `TemplateVariables` and leave it on the manifest types where it is actually used. Removing it is the smaller change and is preferred unless you find a consumer.

> ### GATE 4.4 — Round-trip machinery is gone
>
> - **Trigger:** all four deletions done.
> - **Action:** run `grep -rn "escapeHtmlComment\|unescapeHtmlComment" source` and `grep -rn "isBlogPost:\s*true\s*-->" source`, then `npx tsc --noEmit && npm test`.
> - **Checkpoint:** both greps return nothing; `tsc` exits zero; zero snapshot mismatches.
> - **Evidence:** paste both greps and both command results.
> - **Blocked:** the phase cannot close. `tsc` failing here usually means `modules/index.ts` still re-exports a deleted symbol.

---

## Step 4 — Confirm the hand-written path still works

The comment path is now used only by `pages/*.html` and `index.html`. It has no other consumer, so a break in it would show up in exactly four pages.

> ### GATE 4.5 — Hand-written pages still get their metadata
>
> - **Trigger:** Step 3 complete.
> - **Action:** inspect the built output — `grep -o "<title>[^<]*</title>" dist/blog.html dist/career.html dist/portfolio.html dist/theme-demo.html` and `grep -c 'name="description"' dist/blog.html`.
> - **Checkpoint:** each page has a non-empty `<title>` that is **not** the literal `Untitled`, and `blog.html` has exactly one description meta tag.
> - **Evidence:** paste both outputs.
> - **Blocked:** do not close the phase. The snapshot would also catch this, but this gate states the expected values explicitly, so a snapshot updated by mistake cannot hide it.

---

## Exit gate

> ### GATE 4.6 — Phase 4 complete
>
> - **Trigger:** Steps 0 through 4 done.
> - **Action:** `npx tsc --noEmit && npx prettier --check . && npm test`, plus the checks below.
> - **Checkpoint:** all of the following:
>   1. Three commands exit zero.
>   2. Zero snapshot mismatches — and the snapshot files are **unchanged since Phase 3**, verified by `git diff --stat <phase-3-final-commit> -- source/builder/__snapshots__/` printing nothing.
>   3. `grep -c "<!-- title:" source/builder/markdown-processor.ts` returns `0`.
>   4. `escapeHtmlComment` and `unescapeHtmlComment` return no matches in `source/`.
>   5. `metadata-extractor.ts` is under 90 lines.
>   6. All four hand-written pages have correct titles per GATE 4.5.
> - **Evidence:** paste all six, numbered.
> - **Blocked:** Phase 7 may not begin until every item passes. **Item 2 is the one that matters** — this entire phase should be invisible in the published output, and a snapshot that moved is the signal that it was not.

## Report on completion

1. The six exit-gate results.
2. The comment-key vocabulary from GATE 4.1, and any blog-only key found in a hand-written page.
3. Line reduction in `metadata-extractor.ts` and `markdown-processor.ts`.
4. What you did with `supplements`, and why.
5. Anything the round trip was silently transforming that GATE 4.3 surfaced.

Then set AF-02 to `fixed` in `architecture-audit.md`.
