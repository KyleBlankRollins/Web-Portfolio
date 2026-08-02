# Phase 3 — Correctness defects

**Findings:** AF-08, AF-09, AF-10, AF-11, AF-12, AF-13, AF-14, AF-15
**Depends on:** Phase 1 (test harness), Phase 2 (smaller surface, and two of AF-12's three sites already gone)
**Risk:** Medium — this phase deliberately changes behaviour. Snapshot changes are expected here, unlike every other phase.

Read this entire file before taking any action.

## Why this phase exists

Two of these defects silently corrupt published content. A blog post containing `{{ title }}` in a code sample has it deleted from the page; a fenced code block containing `$&` or `` $` `` is mangled. Both fail without any build error, so the only signal is someone eventually reading the published page.

The rest are smaller: an unescaped generator, a duplicated escape helper, an ESM/CommonJS inconsistency, a divergent rendering path, doubled log output, and three events nobody listens to.

## The discipline for this phase

Every fix in Steps 1 through 4 follows **red then green**:

1. Write a test that reproduces the defect. Run it. **Watch it fail.**
2. Apply the fix.
3. Run it again. Watch it pass.

A test written after the fix proves nothing about the defect — it only proves the current code does what it currently does. If Phase 1 already left you a test asserting the incorrect behaviour (marked `// AF-NN`), invert that test rather than writing a new one.

## Out of scope

- Do not touch the metadata comment round-trip. That is Phase 4, and AF-10's escape-helper consolidation is deliberately sequenced **before** it.
- Do not delete `renderMarkdownBody` or `extractMarkdownFrontmatter` when AF-13 makes them dead. Note them for Phase 7.
- Do not touch `theme-changed`. It is documented public API.

---

## Step 1 — AF-08: template cleanup regex deletes literal braces

**Location:** `builder/modules/template-engine.ts:125`

```ts
result = result.replace(/\{\{\{?\w+\}?\}\}/g, "");
```

This runs over the fully rendered document, which by that point contains the post body. Markdown code blocks are already HTML, so a published post containing `{{ title }}`, `{{user}}`, or any Mustache/Jinja/Vue/Liquid/Angular sample has it silently deleted.

**The fix.** The cleanup must run against the template, not against injected content. Restructure `substituteVariables` into three ordered passes:

1. Evaluate `{{#var}}…{{/var}}` conditionals, and substitute every escaped `{{var}}` and every triple-brace value **except** the raw-HTML ones.
2. Run the unmatched-placeholder cleanup. At this point the string is still template, not content.
3. Inject the raw-HTML triple-brace values last: `content`, `footer`, `tagsHtml`, `citationsHtml`, `additionalHead`.

Conditionals in pass 1 still evaluate correctly, because they branch on the variable's truthiness rather than its substituted text — `{{#tagsHtml}} {{{tagsHtml}}} {{/tagsHtml}}` keeps its inner block in pass 1 and receives the markup in pass 3.

Identify the deferred set by name rather than by inspecting values, so behaviour does not depend on whether a given post happens to contain braces.

> ### GATE 3.1 — Braces survive
>
> - **Trigger:** you believe AF-08 is fixed.
> - **Action:** run the new test, which must render a document whose `content` contains all of `{{title}}`, `{{{raw}}}`, and `{{#cond}}x{{/cond}}` as literal text.
> - **Checkpoint:** all three sequences appear **verbatim** in the output, and a genuinely unmatched `{{missing}}` in the _template_ is still removed.
> - **Evidence:** paste the test name, the failing run from before the fix, and the passing run after.
> - **Blocked:** do not start Step 2 without both runs. A green test with no recorded red run does not demonstrate the defect existed.

---

## Step 2 — AF-09: code block restoration corrupts `$` sequences

**Location:** `builder/modules/content-preprocessor.ts:37`

```ts
processed = processed.replace(`__CODE_BLOCK_${index}__`, codeBlock);
```

`String.prototype.replace` interprets `$&`, `` $` ``, `$'`, and `$1` in the **replacement**. A fenced block containing any of them is mangled on restore.

**The fix.** Use the function form, which performs no substitution:

```ts
processed = processed.replace(`__CODE_BLOCK_${index}__`, () => codeBlock);
```

While here, address the placeholder collision: markdown containing the literal text `__CODE_BLOCK_0__` breaks the round trip. Use a token that cannot occur in prose — a private-use Unicode sentinel, or a per-run random suffix.

> ### GATE 3.2 — Dollar sequences survive
>
> - **Trigger:** you believe AF-09 is fixed.
> - **Action:** run a test whose input contains a fenced block holding `echo "$&" && sed 's/x/$1/'` and a backtick-dollar sequence.
> - **Checkpoint:** the fenced block round-trips byte-for-byte.
> - **Evidence:** the red run and the green run.
> - **Blocked:** Step 3 is blocked until both runs are recorded.

---

## Step 3 — AF-10 and AF-11: escaping

**AF-10.** `escapeHtml` (`modules/html-utils.ts:9`) and `escapeHtmlAttribute` (`:38`) differ only in emitting `&#39;` versus `&#x27;` — the same entity. Collapse to one function. Keep the name `escapeHtml`, update all importers (`citation-processor.ts`, `markdown-renderer.ts`, `template-engine.ts`), and re-export nothing under the old name.

Do this **before** Phase 4, which deletes the comment-escaping helpers in the same file.

**AF-11.** `builder/html-utils.ts:187-190`:

```ts
(tag) => `<button class="blog-tag" data-tag="${tag}">${tag}</button>`;
```

`tag` is interpolated raw into both an attribute and a text node, while every other generator in the builder escapes. Escape both positions.

Tags come from author-controlled frontmatter, so this is not an injection vector — it is a correctness and consistency fix. A tag containing a double quote currently breaks the markup.

> ### GATE 3.3 — One escaper, and it is used everywhere
>
> - **Trigger:** both fixes applied.
> - **Action:** run `grep -rn "escapeHtmlAttribute" source` and `npx tsc --noEmit`.
> - **Checkpoint:** grep returns only `.md` matches or nothing, and `tsc` exits zero.
> - **Evidence:** paste both.
> - **Blocked:** Step 4 blocked until the old name is fully gone. A partial rename leaves two escapers with one of them shadowed, which is worse than the starting state.

---

## Step 4 — AF-12 and AF-13: the dev server

**AF-12.** One `require()` remains after Phase 2, at `dev-server-middleware.ts:146`:

```ts
const { ThemeProcessor } = require("./theme-processor.js");
```

This currently works — the endpoint returns HTTP 200 — because Vite's config bundling supplies a `require`. It is latent, not broken. Convert to a static import at the top of the file.

**AF-13.** Delete `processAndServeMarkdown` (`dev-server-middleware.ts:285-327`) and the branch that calls it (`:209-219`), along with the helper `resolvePublishedMarkdownSourcePath` (`:436`).

This path calls `renderMarkdownBody`, which skips citation processing, title and date injection, and `isBlogPost` template selection — so anything served through it would not match its published form. It is near-unreachable already, because `buildStart` pre-renders every document into memory (`builder/index.ts:402-408`) and the lookup at `:187` satisfies the request first. Deleting it removes a third rendering path that exists only to be wrong, and removes the per-request full filesystem walk noted in AF-24.

A request that formerly reached this branch now falls through to `sendNotFoundHtml`, which is correct: if a document is not in the generated map, it is not a published document.

**Do not** delete `MarkdownProcessor.renderMarkdownBody` or `TemplateProcessor.extractMarkdownFrontmatter` even though both become unreferenced. Record them for Phase 7.

> ### GATE 3.4 — Dev server still serves
>
> - **Trigger:** both fixes applied.
> - **Action:** start the dev server on a free port (`npx vite --port 3111`), wait for the ready line, then request three URLs: `/`, `/blog.html`, and one generated post page such as `/rule-of-thirds.html`. Also request `/data/theme-manifest.json`. Stop the server.
> - **Checkpoint:** all four return HTTP 200; the theme manifest response parses as JSON containing a `themes` array of length 2; the post page HTML contains `<h1` and `blog-post-layout`.
> - **Evidence:** paste the four status codes and the theme count.
> - **Blocked:** do not proceed to Step 5. AF-12 and AF-13 both touch request routing, and the snapshot test only covers the build, not the dev server — this gate is the only check on that path.

---

## Step 5 — AF-14 and AF-15: noise

**AF-14.** `GitAwareBuildPipeline`'s constructor calls `GitUtils.logRepositoryStatus()` (`git-aware-pipeline.ts:26`) and `buildStart` calls `pipeline.logBuildStrategy()` (`builder/index.ts:412`). Both print branch, changed-file count, changed markdown, and changed HTML, each shelling out to `git` separately. Remove the constructor call and keep `logBuildStrategy`, which fires at a meaningful point in the lifecycle.

**AF-15.** Delete three dispatches with no listeners: `theme-loaded` (`theme-switcher.ts:112`), `lightbox-opened` (`image-lightbox.ts:107`), `lightbox-closed` (`:128`). Leave `theme-changed` alone.

> ### GATE 3.5 — Logged once
>
> - **Trigger:** AF-14 applied.
> - **Action:** run `GIT_AWARE=true npm run build 2>&1 | grep -c "Git repository detected"`.
> - **Checkpoint:** the count is exactly `1`. It is `2` before the fix.
> - **Evidence:** paste the count from before and after.
> - **Blocked:** Step 6 blocked until the count is 1.

---

## Step 6 — Account for every snapshot change

This is the phase where the golden file legitimately moves. That makes it the phase where it is easiest to lose the baseline by updating it carelessly.

Run `npm test` and expect mismatches. For each one, classify the diff:

| Expected change                                                                              | Caused by |
| -------------------------------------------------------------------------------------------- | --------- |
| A tag containing `"` or `&` now renders escaped in `blog-post-tags`                          | AF-11     |
| Literal `{{…}}` sequences now present in post body where content previously had them deleted | AF-08     |
| A fenced code block containing `$&` or similar now correct                                   | AF-09     |

If no post currently contains such content, expect **zero** mismatches — the defects are real but latent in the present corpus. That is an acceptable outcome and does not mean the fixes did not work; the unit tests from Steps 1 and 2 are what prove they did.

> ### GATE 3.6 — Every diff is explained
>
> - **Trigger:** you have run `npm test` after all fixes.
> - **Action:** for each mismatched snapshot, produce the diff hunk and name the finding that caused it.
> - **Checkpoint:** every hunk maps to a row in the table above. **Zero unexplained hunks.**
> - **Evidence:** a list of `file → hunk → AF-NN`, or an explicit statement that there were zero mismatches.
> - **Blocked:** you may not run `vitest -u` until this list exists. Updating the snapshot before explaining the diff destroys the only evidence that the change was intended, and it is exactly how an unnoticed regression gets baked into the baseline for all later phases.

Once every hunk is explained, update the snapshot with `npx vitest run -u` and commit it in its own commit with a message naming the findings responsible.

---

## Exit gate

> ### GATE 3.7 — Phase 3 complete
>
> - **Trigger:** Steps 1 through 6 done.
> - **Action:** run `npx tsc --noEmit && npx prettier --check . && npm test`, plus the greps below.
> - **Checkpoint:** all of the following:
>   1. Three commands exit zero, zero snapshot mismatches against the updated baseline.
>   2. `grep -rn "require(" source` returns nothing.
>   3. `grep -rn "escapeHtmlAttribute" source` returns only `.md` matches.
>   4. `grep -rn "processAndServeMarkdown\|resolvePublishedMarkdownSourcePath" source` returns nothing.
>   5. `GIT_AWARE=true npm run build 2>&1 | grep -c "Git repository detected"` prints `1`.
>   6. Every fix in Steps 1–2 has a recorded red run and green run.
> - **Evidence:** paste all six, numbered.
> - **Blocked:** Phase 4 may not begin until every item passes. Phase 4 rewrites the same seam Steps 1 and 3 just touched.

## Report on completion

1. The six exit-gate results.
2. For AF-08 and AF-09, the red-run output that demonstrated each defect.
3. The full snapshot-diff classification from GATE 3.6.
4. Confirmation that `renderMarkdownBody` and `extractMarkdownFrontmatter` are now unreferenced and deferred to Phase 7.

Then set AF-08 through AF-15 to `fixed` in `architecture-audit.md`, including finishing AF-12 from `partial`.
