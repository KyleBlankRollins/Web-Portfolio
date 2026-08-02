# Phase 6 — Collapse duplicated sources of truth

**Findings:** AF-04 (typography duplicated into shadow DOM), AF-05 (head and theme bootstrap in three places)
**Depends on:** Phase 1 only. Independent of Phases 2–5 — may run in parallel.
**Risk:** Medium — both changes are visual. The snapshot catches markup regressions but cannot see rendering.

Read this entire file before taking any action.

## Why this phase exists

Two things in this codebase are maintained by hand in more than one place, and both have already drifted or carry a comment admitting the hazard.

**AF-04.** `shared-styles.ts:45-196` reproduces `typography.css:165-309` almost line for line — the hardcoded scale, the `h1, h2` versus `h3, h4, h5` family split, the link rules, `.ui-label`, and the whole `@media (max-width: 768px)` block including its `/* Reduced from 3rem */` comments. They have already diverged: `typography.css:174-179` sets `h1 { margin-top: 0 }` while `shared-styles.ts` sets `margin-top: 0.91rem`.

**AF-05.** `base.html:19-40` and `blog-post.html:10-30` hold a byte-identical twenty-line theme bootstrap, and each carries a comment saying "Mirrors `loadSavedTheme()` in theme-switcher.ts; keep in sync." Three copies, synchronized by hand. The two templates also duplicate the entire `<head>`, the `<kbr-navigation>` block, and the footer injection; they differ only in `<main>`.

## The constraint that is real

The comment on `reducedMotionStyles` (`shared-styles.ts:14-16`) is correct about the underlying problem: a rule in `styles/style.css` does not cross a shadow boundary, which is why per-component style blocks exist. That constraint is genuine and this phase does not fight it.

What this phase changes is the _source_ of the shadow-DOM styles: one file on disk, adopted into both DOMs, instead of two files maintained in parallel.

## Out of scope

- Do not restyle anything. Every visual change in this phase is a bug.
- Do not touch `buttonStyles`, `layoutStyles`, or `reducedMotionStyles`. Only `typographyStyles` duplicates a CSS file.
- Do not consolidate `style.css` and `blog-post.css`. Their split is untidy but is not duplication.

---

## Step 1 — AF-04: record the drift before removing it

The two copies disagree. Merging them means choosing which value wins, and that is a visual decision, not a mechanical one.

> ### GATE 6.1 — Every divergence is enumerated
>
> - **Trigger:** before any edit.
> - **Action:** extract the rule bodies from `typography.css:165-309` and from `typographyStyles` in `shared-styles.ts:45-196`, normalize whitespace, and diff them.
> - **Checkpoint:** produce a table of every property that differs, with both values and which file each came from. The known one is `h1 { margin-top }` — `0` in the CSS file, `0.91rem` in the TypeScript. Find the rest.
> - **Evidence:** paste the diff and the divergence table.
> - **Blocked:** do not delete either copy until the table exists. Deleting first silently picks a winner for every divergence at once, and any resulting visual change will be indistinguishable from the many other things this phase touches.

For each divergence, decide which value is correct and say why. Default to the `typography.css` value: it governs the light DOM, which is where post body text lives and where the type scale was tuned.

---

## Step 2 — AF-04: make one file the source

Preferred approach — import the CSS text and adopt it:

```ts
import typographyCss from "./typography.css?inline";
export const typographyStyles = unsafeCSS(typographyCss);
```

Vite's `?inline` returns the file contents as a string. `unsafeCSS` is the documented Lit escape hatch for exactly this. The name `typographyStyles` stays, so no component import changes.

Two things to verify rather than assume:

1. `typography.css` is also imported through `styles/index.css`, so its rules apply to the light DOM as well. Adopting it into shadow roots must not cause it to be emitted twice into the built CSS bundle — check the bundle size before and after.
2. `typography.css` may contain selectors that are meaningless inside a shadow root, such as `body`-scoped rules. Those are harmless but wasteful. If there are many, split the file into a shared core plus a light-DOM-only tail, and adopt only the core.

If `?inline` proves unworkable, the documented fallback is to move the type scale into custom properties in `themes/properties.css` — which exists for this purpose — and have both consumers reference tokens. That does not eliminate the duplicate but reduces it to selector plumbing and removes the magic numbers. Report which route you took.

> ### GATE 6.2 — One definition of the type scale
>
> - **Trigger:** the change is applied.
> - **Action:** run `grep -c "3.63rem" source/site/styles/shared-styles.ts source/site/styles/typography.css`, then `npm run build` and compare total `dist/assets/*.css` bytes against the pre-change build.
> - **Checkpoint:** the `h1` line-height literal `3.63rem` appears in **exactly one** file. Total CSS bytes have not grown by more than 2%.
> - **Evidence:** paste both counts and both byte totals.
> - **Blocked:** do not start Step 3. A byte growth above 2% means the CSS is now emitted twice, which trades a maintenance problem for a payload problem.

> ### GATE 6.3 — Headings still render at the right size
>
> - **Trigger:** GATE 6.2 passed.
> - **Action:** `npm run build && npx vite preview --port 3111`. On a post page, measure the computed `font-size` of the post `<h1>` in the light DOM, and of an `<h1>` or `<h2>` inside a shadow root — `kbr-post-card` on `/blog.html` or `kbr-timeline-entry` on `/career.html`. Do this at viewport widths 1280px and 375px.
> - **Checkpoint:** at 1280px the `h1` computes to `48px` (3rem); at 375px it computes to `36px` (2.25rem). The shadow-DOM headings follow the same scale at both widths.
> - **Evidence:** paste the four measurements.
> - **Blocked:** do not proceed. This is the only check that the responsive block survived adoption — a `@media` query dropped during the move produces headings that never shrink on mobile, which is invisible to every other gate in this plan.

---

## Step 3 — AF-05: extract the shared template partials

The mechanism already exists. `TemplateProcessor.loadPartial()` (`template-processor.ts:69`) reads a file from `templates/partials/`, caches it, and injects it as a triple-brace variable — that is how `footer.html` works today.

Create two partials:

- **`templates/partials/head.html`** — everything from `<meta charset>` through `</head>`, including the theme bootstrap script, the favicon link, `<title>{{title}}</title>`, and the description/keywords/additionalHead conditionals.
- **`templates/partials/header.html`** — the `<kbr-navigation>` block with its slotted `<kbr-theme-switcher>`.

Inject both the way `footer` is injected in `processTemplate` (`:117-121`), so every page type gets identical markup through both the build and the dev server.

Two ordering hazards:

1. The partial contains `{{title}}` and the conditional blocks. If the partial is injected as a triple-brace value **after** variable substitution, those placeholders never resolve. Injection must happen before substitution, or the partial must be substituted itself. Check how `footer` behaves today — it contains no placeholders, so it does not exercise this. Verify with a real title before assuming.
2. Phase 3 restructured `substituteVariables` into three ordered passes and put `footer` in the deferred raw-HTML set. `head` and `header` must be handled consistently with whatever that produced.

> ### GATE 6.4 — Placeholders inside partials resolve
>
> - **Trigger:** both partials created and injected.
> - **Action:** `npm run build`, then `grep -o "<title>[^<]*</title>" dist/index.html dist/blog.html dist/rule-of-thirds.html` and `grep -c "{{" dist/index.html dist/blog.html dist/rule-of-thirds.html`.
> - **Checkpoint:** every page has its correct, non-empty title, and the count of literal `{{` in each built page is **zero**.
> - **Evidence:** paste both outputs.
> - **Blocked:** do not proceed to Step 4. A nonzero `{{` count means the partial was injected after substitution and its placeholders shipped raw to production.

---

## Step 4 — AF-05: unify the third copy of the bootstrap

The bootstrap logic still exists twice: once in `partials/head.html`, once in `loadSavedTheme()` in `theme-switcher.ts`. They must agree on the storage keys `kbr-theme` and `kbr-color-scheme`, the default theme `base`, and the `prefers-color-scheme` fallback.

Export those values as named constants from one module and have `theme-switcher.ts` import them. The inline script cannot import — it is a blocking classic script that must run before the bundle parses — so it necessarily keeps its own literals. Reduce the duplication to those literals alone, and leave a comment at each site naming the other.

Do not attempt to eliminate the inline script. It exists to set `data-theme` before first paint, and `base.html:7-18` records the flash-of-unstyled-content defect (DF-13) that resulted from doing this in `connectedCallback`.

> ### GATE 6.5 — No flash, and the keys agree
>
> - **Trigger:** Step 4 applied.
> - **Action:** `npx vite preview --port 3111`. Set a non-default theme in the switcher, hard-reload the page, and observe the first paint. Then run `grep -rn "kbr-theme\"\|kbr-color-scheme\"" source | grep -v README`.
> - **Checkpoint:** the reloaded page paints directly in the selected theme with no visible flash of the default. The grep shows the keys in exactly two places — the inline partial and the constants module — and **not** in `theme-switcher.ts` as literals.
> - **Evidence:** paste the grep output and state explicitly whether a flash occurred.
> - **Blocked:** the phase cannot close. A flash means the bootstrap stopped running before paint, which is the exact defect the inline script exists to prevent.

---

## Exit gate

> ### GATE 6.6 — Phase 6 complete
>
> - **Trigger:** Steps 1 through 4 done.
> - **Action:** `npx tsc --noEmit && npx prettier --check . && npm test`, plus the checks below.
> - **Checkpoint:** all of the following:
>   1. Three commands exit zero.
>   2. `3.63rem` appears in exactly one source file.
>   3. `base.html` and `blog-post.html` are each **under 35 lines**, down from 66 and 81.
>   4. Zero literal `{{` in any built HTML page.
>   5. Heading measurements from GATE 6.3 correct at both widths.
>   6. No theme flash per GATE 6.5.
>   7. Snapshot mismatches are confined to `<head>` and header markup **reordering**. Any change to visible page content is unexpected and must be explained before updating the baseline.
> - **Evidence:** paste all seven, numbered. For item 7, include the diff hunks.
> - **Blocked:** do not close until every item passes.

## Report on completion

1. The seven exit-gate results.
2. The full divergence table from GATE 6.1, and which value you chose for each, with reasoning.
3. Which AF-04 route you took — `?inline` adoption or custom-property tokens — and why.
4. CSS bundle bytes before and after.
5. Line counts for both templates before and after.

Then set AF-04 and AF-05 to `fixed` in `architecture-audit.md`.
