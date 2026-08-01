# Design Audit

Source of truth for comprehensive design updates to `kyleblankrollins.com`.

This document records design defects and inconsistencies found in an audit of the site's CSS architecture, Lit component styles, templates, and shipped `dist/` output. It is a findings registry, not an implementation plan. Each finding is independently actionable and carries a stable ID so work can reference it across branches and sessions.

## How to use this document

- Each finding has an ID (`DF-NN`), a location, evidence, and a fix direction.
- Findings are grouped by category, and ordered by impact within each group.
- **Fix `DF-01` first.** It is the root cause of roughly a dozen visible defects across the site. Several later findings become no-ops once it lands.
- Contrast ratios are computed WCAG 2.1 relative-luminance values, not estimates. Anything below 4.5:1 fails AA for normal text; below 3:1 fails AA for large text and UI components.
- "Confirmed in build" means the defect was verified in `dist/assets/`, not only in source.

### Status legend

Update the status column as work lands.

| Status        | Meaning                                           |
| ------------- | ------------------------------------------------- |
| `open`        | Not yet addressed                                 |
| `in-progress` | Being worked                                      |
| `partial`     | Some of it landed as a side effect of another fix |
| `fixed`       | Landed and verified                               |
| `wontfix`     | Deliberately accepted, with a note explaining why |

## Triage summary

| ID    | Finding                                               | Severity | Status |
| ----- | ----------------------------------------------------- | -------- | ------ |
| DF-01 | `--color-primary` role collision breaks ~35 consumers | Critical | fixed  |
| DF-02 | Syntax highlighting fails contrast in light mode      | High     | fixed  |
| DF-03 | `.card` padding token and container query are dead    | High     | fixed  |
| DF-04 | Mobile TOC toggle renders on desktop                  | High     | fixed  |
| DF-05 | Three `post-series` transitions are invalid CSS       | Medium   | fixed  |
| DF-06 | Homepage flashes unstyled content                     | High     | fixed  |
| DF-07 | Blog post template is missing the favicon link        | Low      | fixed  |
| DF-08 | Career page renders no heading                        | Medium   | fixed  |
| DF-09 | Navigation states are invisible in light mode         | High     | fixed  |
| DF-10 | Dead rule blocks and duplicate declarations           | Low      | fixed  |
| DF-11 | `theme-demo.html` ships broken                        | Medium   | open   |
| DF-12 | Two competing dark-mode mechanisms                    | High     | fixed  |
| DF-13 | No `data-theme` until JavaScript runs                 | Medium   | fixed  |
| DF-14 | `canney-valley` light mode omits surface tokens       | Medium   | fixed  |
| DF-15 | Reduced-motion override produces invalid CSS          | Low      | fixed  |
| DF-16 | Dark-mode font-weight override is never consumed      | Low      | open   |
| DF-17 | 49 of 139 design tokens are unreferenced              | Medium   | open   |
| DF-18 | Three competing card surface colors                   | Medium   | open   |
| DF-19 | Radius scale is unused; ~45 hardcoded values          | Medium   | open   |
| DF-20 | Admonition headers fail contrast in light mode        | High     | fixed  |
| DF-21 | Spacing tokens ignored in three components            | Low      | open   |
| DF-22 | Reduced-motion coverage is uneven                     | Medium   | open   |
| DF-23 | Portfolio page has no measure constraint              | Medium   | fixed  |
| DF-24 | `a:hover` reflows text                                | Low      | fixed  |
| DF-25 | Lightbox modal is not full-screen                     | Medium   | fixed  |
| DF-26 | Font fallback stacks are miscategorized               | Low      | open   |
| DF-27 | Negative-margin layout hacks                          | Low      | open   |
| DF-28 | Article glass surface has 1rem padding                | Low      | open   |
| DF-29 | Nested sticky positioning on blog TOC                 | Low      | open   |
| DF-30 | `var()` fallbacks contradict documented rule          | Low      | fixed  |
| DF-31 | Theme switcher occludes article text                  | Medium   | fixed  |

DF-31 was added after the original 30, during browser verification of the
fixes. Findings discovered by rendering rather than by reading source are
noted as such in their entry.

---

## Category 1: Root cause

### DF-01 — `--color-primary` role collision

**Severity:** Critical
**Status:** fixed

The token changed meaning and its consumers were never updated.

`themes/properties.css:38` defines `--color-primary` as a dark brand **foreground**:

```css
--color-primary: #2d2d2d;
```

Both shipped themes redefine it as a light **surface tint**:

- `themes/theme-base.css:12` — `#e2e8f0` (light mode), `:107` — `#1e293b` (dark mode)
- `themes/theme-canney-valley.css:13` — `#81c784` (light mode), `:109` — `#2e7d32` (dark mode)

Roughly 35 rules still treat it as a foreground, border, or icon color. Because the themes always win over `properties.css`, every one of those rules now renders near-invisible.

#### Measured failures

| Consumer                       | Location                                                      | Light      | Dark            |
| ------------------------------ | ------------------------------------------------------------- | ---------- | --------------- |
| Inline code text               | `styles/blog-post.css:70`                                     | **1.17:1** | **1.00:1**      |
| Prism keyword color            | `styles/prism-theme.css:35`                                   | **1.17:1** | n/a (hardcoded) |
| Citation reference marks       | `styles/blog-post.css:286`                                    | **1.23:1** | —               |
| `.blog-tag:hover`              | `styles/blog-post.css:236,238`                                | **1.18:1** | **1.22:1**      |
| `.btn-primary`                 | `styles/shared-styles.ts:195,197`                             | **1.18:1** | **1.22:1**      |
| `.tag-button.active`           | `styles/shared-styles.ts:297,298`                             | **1.18:1** | **1.22:1**      |
| `a:hover` in all components    | `styles/shared-styles.ts:114`                                 | **1.48:1** | **1.00:1**      |
| `.post-list-header h2`         | `components/post-list/post-list.style.ts:24`                  | **1.23:1** | —               |
| `.samples-section h3`          | `styles/style.css:140`                                        | **1.23:1** | —               |
| `.sample-link:hover`           | `styles/style.css:196`                                        | **1.23:1** | —               |
| `.project-link:hover`          | `styles/style.css:240`                                        | **1.23:1** | —               |
| `.toc-link.active` background  | `components/table-of-contents/table-of-contents.style.ts:181` | ok         | **1.00:1**      |
| anchor-copy hover + focus ring | `components/anchor-copy.ts:82,103`                            | invisible  | —               |

The dark-mode `a:hover` case is the most severe: `--color-primary-hover` resolves to `#0f172a`, which is exactly `--color-background`. Hovering any link inside a shadow-DOM component makes it disappear entirely.

#### Full consumer list

Foreground / border / icon usage that must be reviewed:

```
components/anchor-copy.ts:36,46,82,103
components/image-lightbox/image-lightbox.style.ts:69
components/post-list/post-list.style.ts:24,45,85,130,132
components/post-series/post-series.style.ts:159,160
components/supplement-list/supplement-list.style.ts:45
components/table-of-contents/table-of-contents.style.ts:169,181,183,246
components/theme-switcher/theme-switcher.style.ts:236
styles/blog-post.css:56,70,178,236,238,286,293,350,373
styles/prism-theme.css:35
styles/shared-styles.ts:114,195,197,201,202,214,215,227,287,288,297,298,411
styles/style.css:140,196,240,468,594
```

#### Fix direction

Introduce a dedicated foreground token — `--color-on-surface` or similar — and repoint the consumers above, leaving `--color-primary` as the surface tint the themes now define. Every theme must define both roles in both color schemes.

Blanket-swapping the consumers to `--color-accent` also resolves the contrast failures but collapses two visual roles into one and flattens the palette. Prefer the new token.

Once this lands, re-verify: DF-02, DF-09, and the `.toc-link` cases in DF-12 partially depend on it.

#### Resolution

`--color-on-surface`, `--color-on-surface-hover`, and `--color-on-surface-active` were added to `themes/properties.css` (both `:root` and the dark block) and to both themes in both color schemes. `--color-primary` keeps the surface-tint meaning the themes gave it, and now carries a comment saying so.

| Theme / scheme     | `--color-on-surface` | On its surface | Carrying `--color-text-inverse` |
| ------------------ | -------------------- | -------------- | ------------------------------- |
| `properties` light | `#2d2d2d`            | 13.77:1        | 13.77:1                         |
| `properties` dark  | `#e2e8f0`            | 13.44:1        | 16.40:1                         |
| `base` light       | `#1e40af`            | 8.72:1         | 8.34:1                          |
| `base` dark        | `#bfdbfe`            | 10.30:1        | 12.56:1                         |
| `canney` light     | `#1b5e20`            | 7.19:1         | 7.19:1                          |
| `canney` dark      | `#a5d6a7`            | 8.01:1         | 8.01:1                          |

Hover and active steps follow each theme's existing direction — progressively darker in light mode, progressively lighter in dark. The lowest ratio anywhere in the new set is 6.86:1, so every consumer clears AA for normal text in both roles.

All consumers in the list above were repointed. Two `--color-primary` uses were deliberately left alone because they are genuine surface tints: `post-series.style.ts:159` (`--color-primary-subtle` as a panel background) and the `--gradient-primary` definitions in both themes. The swatches in `pages/theme-demo.html` also still read `--color-primary` on purpose — they exist to display that token (see DF-11).

Verified in the built CSS bundle (6 definitions, 15 consumers) and the built JS bundle (29 consumers).

#### Follow-up: regression found in browser testing

Static verification confirmed the token _definitions_ were sound but missed a
consumer-side error, caught later by rendering the page in a real browser.

Two rules in `table-of-contents.style.ts` had their **fill** repointed to
`--color-on-surface` while their **label** was left behind. `--color-primary`
had been a pale tint (`#e2e8f0` in base/light), so dark text on it was
readable; `--color-on-surface` is a saturated dark blue, so the same text
became dark-on-dark.

| Rule                   | Foreground before      | Base/light | Base/dark  | Canney/light | Canney/dark |
| ---------------------- | ---------------------- | ---------- | ---------- | ------------ | ----------- |
| `.toc-link.active:180` | `--color-text`         | **2.05:1** | **1.15:1** | **1.67:1**   | **1.47:1**  |
| `.toc-link:hover:168`  | `--color-accent-hover` | **1.69:1** | 4.72:1     | **3.12:1**   | 7.49:1      |

Both now set `color: var(--color-text-inverse)`, which is exactly the contract
`properties.css` documents for this token: 8.34 / 12.56 / 7.19 / 8.01:1.
Measured in-browser on the rendered element, not computed from source.

These were the only two affected rules. Every other repointed fill
(`.pagination-btn.active`, `.blog-tag:hover`, `.btn-primary`,
`.tag-button.active`) already carried `--color-text-inverse`; the remaining
changes were border or scrollbar colors with no text on them.

**Lesson for the rest of this audit:** whenever a rule's `background` moves to
`--color-on-surface`, its `color` must move to `--color-text-inverse` in the
same edit. Checking the token's own contrast is not sufficient — the pairing is
what fails.

---

## Category 2: Broken styles

All findings in this category were confirmed against `dist/`, not only source.

### DF-02 — Syntax highlighting fails contrast in light mode

**Severity:** High
**Status:** fixed

`styles/prism-theme.css:28-38` maps Prism tokens onto semantic color tokens chosen for UI accents, not for text on a light code background (`--color-background-secondary`).

| Token              | Source                  | Light contrast |
| ------------------ | ----------------------- | -------------- |
| `--prism-keyword`  | `--color-primary`       | **1.17:1**     |
| `--prism-string`   | `--color-success`       | **2.16:1**     |
| `--prism-operator` | `--color-warning`       | **2.04:1**     |
| `--prism-property` | `--color-error`         | **3.57:1**     |
| `--prism-function` | `--color-accent`        | **3.49:1**     |
| `--prism-comment`  | `--color-text-tertiary` | 4.51:1         |

Under `canney-valley` light the failures are worse: keyword **1.75:1**, function **1.71:1**.

Separately, `styles/prism-theme.css:42-49` hardcodes GitHub-dark hex values for dark mode. The theme system does not reach code blocks at all — `canney-valley` dark renders GitHub blue and purple.

**Fix direction:** Give Prism its own token set with values chosen against the actual code-block background, defined per theme and per color scheme. Do not derive them from the semantic status colors.

**Resolution:** Fixed, but not the way the fix direction above described. That said to define a Prism token set "per theme and per color scheme". It is now explicitly _not_ per theme — see the reasoning below.

**How Prism is actually wired.** Prism runs at build time only, in `source/builder/modules/markdown-renderer.ts`, which bakes `<span class="token …">` into the static HTML; the browser bundle `dist/assets/prism-*.js` is 1 byte. Prism has no color API — a "theme" is only ever CSS targeting `.token.*` class names. No stock theme from `node_modules/prismjs/themes/` is imported, so `styles/prism-theme.css` is the complete theme and editing it is the whole customization mechanism.

**Why the palette is theme-independent.** Syntax highlighting carries a constraint brand palettes do not: token colors must be distinguishable _from each other_, not just from the background. Deriving them per theme fights that, and code highlighting is a distinct visual system that does not need to match site chrome. The palette is now one light set and one dark set, both fixed across themes, with a header comment in the file stating this so nobody re-aliases it onto semantic tokens later.

Values come from GitHub Light and GitHub Dark — well tested for hue separation at small sizes — with the same hue per token group in both schemes so they read as one theme. Two were adjusted where GitHub's own value missed AA against the code-block background:

| Token         | Light     | base / canney | Dark      | base / canney |
| ------------- | --------- | ------------- | --------- | ------------- |
| `comment`     | `#5f6673` | 5.48 / 5.04   | `#9ba7b0` | 5.95 / 5.36   |
| `punctuation` | `#24292f` | 13.90 / 12.78 | `#c9d1d9` | 9.48 / 8.53   |
| `property`    | `#cf222e` | 5.08 / 4.67   | `#ff7b72` | 5.80 / 5.22   |
| `string`      | `#116329` | 7.01 / 6.45   | `#7ee787` | 9.52 / 8.56   |
| `operator`    | `#953800` | 7.01 / 6.44   | `#ffa657` | 7.55 / 6.80   |
| `keyword`     | `#0550ae` | 7.20 / 6.62   | `#79c0ff` | 7.52 / 6.77   |
| `function`    | `#6f42c1` | 6.18 / 5.68   | `#d2a8ff` | 7.51 / 6.76   |
| `variable`    | `#953800` | 7.01 / 6.44   | `#ffa657` | 7.55 / 6.80   |

Adjusted: `comment` was GitHub's `#6e7781` (3.96:1 on canney) and `#8b949e` (4.28:1 on canney); `function` was GitHub's `#8250df` (4.40:1 on canney). Worst case is now 4.67:1 light and 5.22:1 dark. Ratios are against `--color-background-secondary`, which is what `.blog-post-content pre` uses (`blog-post.css:87`), not the page background.

**Three token classes had no rule at all** and were rendering as plain body text inside code blocks. These were not in the original finding; they surfaced from diffing the `.token.*` selectors in the stylesheet against the classes actually present in built pages. `attr-equals` joined the punctuation rule; `interpolation-punctuation` got the same delimiter treatment as `template-punctuation`; `interpolation` resets to `--color-text`. Re-running that diff after the change reports no emitted class left unstyled.

**Do not prune the unmatched selectors.** The same diff shows 22 selectors currently matching nothing — `number`, `boolean`, `class-name`, `variable`, `regex`, `parameter` and others. They are latent, not dead: only css, html, and javascript appear in built pages today, but `markdown-renderer.ts` imports ten language components including python, bash, json, and yaml, so those selectors activate the moment a post uses one. This is the opposite call from the dead blocks removed in DF-10.

**Correction to the measurements above.** The original finding's contrast table is accurate for the token _definitions_, but it overstates what a reader saw, and it measured only against the base theme. By emitted span count the failures were concentrated: the `string` group (`string`, `attr-name`, `selector`) accounted for 31 spans site-wide at 2.16:1, the `property` group 19 spans at 3.57:1, `function` about 7, `comment` 5, and `operator` just 2. `punctuation` — 98 spans, by far the most common — already passed at 7.19:1. Canney Valley was worse throughout and had a failure the original table missed entirely: `comment` at 2.92:1.

### DF-03 — `.card` padding token and container query are dead

**Severity:** High
**Status:** fixed
**Confirmed in build:** the built CSS bundle

`styles/style.css:583` declares a second `.card` rule after the real one at `:66`:

```css
.card {
  padding: 2em;
}
```

Same specificity, later in the sheet. It overrides both `padding: var(--space-lg)` at `:69` and the nested container query at `:74` that was meant to widen padding at 300px. Every card on the site gets `2em`; the token and the container query never apply.

This is leftover Vite starter boilerplate. The same block contains `#app` (`:563`), `.logo` (`:570`), `.logo:hover` (`:576`), and `.logo.vanilla:hover` (`:579`), none of which match any markup on the site — `#app` exists only in the admin UI, which loads its own stylesheet.

**Fix direction:** Delete `styles/style.css:563-585` entirely. Verify card padding and the container query behave as intended afterward.

**Resolution:** Block deleted. `.card` in the shipped CSS now carries `padding: var(--space-lg)` with the `@container (min-width: 300px)` rule intact, and `padding:2em` no longer appears anywhere in the built CSS bundle.

### DF-04 — Mobile TOC toggle renders on desktop

**Severity:** High
**Status:** fixed
**Confirmed in build:** the built JS bundle

`components/table-of-contents/table-of-contents.style.ts` sets `display` twice in the same rule:

```
:22   display: none;   /* Hidden by default on desktop */
:35   display: flex;
```

The later declaration wins, so the "Contents" toggle button renders at every viewport, not only under the `max-width: 768px` breakpoint at `:263` that was meant to reveal it. Lit `css` template literals are not minified, so this ships verbatim.

**Fix direction:** Remove the `display: flex` at `:35` and move the flex alignment properties (`align-items`, `justify-content`) so they apply without resetting `display`. The mobile media query at `:270` already sets `display: flex` correctly.

**Resolution:** The second `display` is gone; `align-items` and `justify-content` stay on the rule and take effect once the media query flips `display` to `flex`. Confirmed in the built JS bundle: `.toc-toggle` is `display: none` at the top level and `display: flex` only inside `@media (max-width: 768px)`.

### DF-05 — Three `post-series` transitions are invalid CSS

**Severity:** Medium
**Status:** fixed
**Confirmed in build:** the built JS bundle

`components/post-series/post-series.style.ts:58,97,150`:

```css
transition: transform var(--transition-fast) ease;
transition: all var(--transition-fast) ease;
```

`--transition-fast` already expands to `150ms ease` (`themes/properties.css:235`). The result is `all 150ms ease ease`, which is invalid — the browser drops the declaration. The toggle icon rotation and both hover transitions never animate.

**Fix direction:** Drop the trailing `ease`. Audit for the same pattern elsewhere; these three are currently the only occurrences.

**Resolution:** All three fixed. A repo-wide search for `var(--transition-*) ease` now returns nothing, in source and in the bundle.

### DF-06 — Homepage flashes unstyled content

**Severity:** High
**Status:** fixed
**Confirmed in build:** `dist/index.html`

`source/site/index.html:56` places the module script inside the page content:

```html
<script type="module" src="/main.ts"></script>
```

Because `vite.config.ts` uses `root: "source/site"`, this file is Vite's HTML entry. Vite injects the bundle _and_ the stylesheet `<link>` at that tag's position — which is inside `<main class="page-content">`. The navigation and theme switcher paint before any CSS arrives.

No other page has this problem: `pages/blog.html` and `pages/career.html` carry no script tag, and the KBR builder appends assets before `</body>` with the stylesheet in `<head>`.

Related inconsistency: `base: "./"` in `vite.config.ts:8` gives index.html `./assets/…` paths while the builder emits `/assets/…` for every other page. Both resolve at the site root, so this is latent rather than broken.

**Fix direction:** Move the script tag out of the content and into `templates/base.html`, in `<head>` with `type="module"`, or immediately before `</body>`. Rebuild and confirm the stylesheet link lands in `<head>` for `dist/index.html`.

#### Resolution

Fixed in the builder rather than in the markup, because the prescribed fix is not available: **the script tag is what marks `index.html` as Vite's HTML entry.** Deleting it or moving it into `templates/base.html` — which Vite never sees, since the builder reads it as a template at build time — leaves Vite with no entry and therefore no bundle to emit.

`HtmlProcessingUtils.normalizeAssetPlacement()` now runs on Vite-emitted HTML after templating, in `html-bundle-processor.ts`. It lifts `<link rel="stylesheet">` and `<link rel="modulepreload">` into `<head>` and moves `<script type="module">` to just before `</body>` — the same placement `injectAssets()` already produced for every page under `pages/`. It is idempotent and a no-op for files whose assets are already placed correctly, so the `pages/` path is untouched.

Correcting placement after the fact also means it stays correct wherever the source tag sits, rather than depending on an author remembering where to put it.

Verified in `dist/index.html`: the stylesheet and the modulepreload hint are both inside `<head>`, the module script sits before `</body>`, and `<main>` contains no `<link>` or `<script>` at all. `dist/blog.html`, `dist/career.html` and `dist/typography-test.html` are unchanged — stylesheet in `<head>`, nothing in `<main>`.

Then served the built output with `vite preview` and loaded it: both custom elements upgrade, the gradient and the Valkyrie webfont apply, the stylesheet is in `document.head` with none in `document.body`, and the console is clean — 0 errors, 0 warnings.

The modulepreload hint was worth moving on its own: a preload hint placed after the markup it is meant to front-run does nothing.

**Not addressed:** the `base: "./"` inconsistency noted above. `index.html` still gets `./assets/…` while the builder emits `/assets/…` elsewhere. Both resolve from the site root, so it remains latent. Changing it would touch every emitted page and is better done as its own change.

### DF-07 — Blog post template is missing the favicon link

**Severity:** Low
**Status:** fixed

`templates/base.html:9` includes:

```html
<link rel="icon" type="image/svg+xml" href="./favicon.svg" />
```

`templates/blog-post.html` has no equivalent. Every blog post renders with the browser's default icon.

**Fix direction:** Add the same link to `templates/blog-post.html`. Note the two templates also differ in doctype casing (`<!DOCTYPE html>` vs `<!doctype html>`) and viewport tag formatting — worth normalizing at the same time.

**Resolution:** Added, and both templates normalized to `<!doctype html>` with a single-line viewport tag. The `href` is now root-absolute (`/favicon.svg`) rather than `./favicon.svg`, because supplement pages build to `/<post>/supplements/<page>.html` and the relative form would have 404'd at that depth. Verified present in `dist/index.html`, `dist/portfolio.html`, `dist/rule-of-thirds.html`, and `dist/intentional-work-patterns/supplements/boundary-checklist.html`.

### DF-08 — Career page renders no heading

**Severity:** Medium
**Status:** fixed

`components/timeline/timeline.style.ts:20-39` styles `.timeline-header`, `.timeline-title`, and `.timeline-subtitle`. `components/timeline/timeline.ts` never renders any of them — `render()` emits only `.timeline-sidebar` and `.timeline-content`.

Consequences:

- `/career.html` ships with no `<h1>`, which is both a visual gap and an accessibility and SEO problem.
- The three rules are dead CSS.
- `.timeline-header` and `.timeline-content` are both assigned `grid-area: content` (`:21` and `:52`). If the header is ever restored without changing the grid, the two will overlap.

**Fix direction:** Render a page heading, and give it its own grid area. Otherwise delete the dead rules.

**Resolution:** The heading is rendered. `timeline.ts` gained a `renderHeader()` returning `<header class="timeline-header">` with `<h1 class="timeline-title" id="career-timeline">Career Timeline</h1>` and a subtitle, and it is called from all three render branches — loading, error, and loaded — so `/career.html` always has an `h1` regardless of whether the fetch succeeds.

The grid collision is gone: `.timeline` now declares

```css
grid-template-areas:
  "header header"
  "sidebar content";
```

so the header spans both columns above the sidebar and the entries, and `.timeline-header` owns `header` while `.timeline-content` keeps `content`. The 1024px breakpoint stacks them `header` / `sidebar` / `content`; the `order` declarations there were dropped because `order` does not affect placement of items positioned by `grid-area`, so they were inert and misleading.

Two things fell out of this. `updateTableOfContents()` already built a level-2 entry pointing at `.timeline-title` and then dropped it in a `.filter(item => item.element)` because the element did not exist — that entry now resolves, so "Career Timeline" appears at the top of the career page's TOC as originally intended. And `.loading` / `.error` gained `grid-column: 1 / -1`; without it they would have been auto-placed into the 280px sidebar column now that the explicit areas are filled.

Subtitle copy says "most recent first", which matches the actual ordering in `public/data/experience-data.json` (MongoDB 2024 → Purch 2011).

**Residual caveat — SEO.** The heading lives in `kbr-timeline`'s shadow root, so it exists only after the Lit bundle runs. That fully addresses the visual gap and the accessibility tree, which exposes shadow content normally, but a crawler that does not execute JavaScript still sees `pages/career.html` as a bare `<section>` with no heading. Closing that last part means putting a light-DOM `<h1>` in `career.html`, which in turn means the heading no longer participates in the component's grid and the TOC's top entry stops resolving. Filed here rather than fixed, because the trade-off is a judgment call, not a defect.

### DF-09 — Navigation states are invisible in light mode

**Severity:** High
**Status:** fixed

The navigation styles were written for a dark header background that no longer exists — `components/navigation/navigation.style.ts:11` sets `background: transparent`, so the header now sits on the light page gradient.

| Rule                  | Location                      | Problem                                                                    |
| --------------------- | ----------------------------- | -------------------------------------------------------------------------- |
| Focus ring            | `navigation.style.ts:85`      | `rgba(255,255,255,0.8)` on a light background — no visible focus indicator |
| Active-page underline | `navigation.style.ts:77`      | `--color-text-inverse`, **1.05:1**                                         |
| Nav link hover        | `styles/shared-styles.ts:254` | `rgba(255,255,255,0.1)` — invisible                                        |
| Nav link active       | `styles/shared-styles.ts:264` | `rgba(255,255,255,0.2)` — invisible                                        |
| Nav link hover shadow | `navigation.style.ts:66`      | `rgba(0,0,0,0.15)` box-shadow on an inline link                            |

The missing focus indicator is a WCAG 2.4.7 failure on the site's primary navigation.

**Fix direction:** Repoint the focus ring to `--focus-ring-color` and the underline to `--color-text`. Replace the white-alpha hover and active backgrounds with theme-aware surface tokens.

#### Resolution

Fixed, but **not as prescribed** — measuring the fix direction in a browser showed it would have made the focus ring worse.

`--focus-ring-color` was defined as `var(--color-accent)`. Measured against the header at the nav's actual on-screen position, `--color-accent` ranges **1.03:1 to 1.68:1** across the four theme/scheme combinations — below the white ring it was meant to replace, and far below the 3:1 minimum for UI components. The token was the defect, not just its consumers, and it had six other consumers inheriting the same weakness (`theme-switcher`, `supplement-list`, `theme-demo`, and `--shadow-focus` via `shared-styles` and `tag-filter`).

`--focus-ring-color` now tracks `--color-on-surface`, which is contract-bound to clear 4.5:1 against every theme's surfaces. `properties.css` carries a comment stating the constraint any future redefinition must hold.

The header has no background of its own — `background: transparent` over the page gradient — so every ratio below is measured against the gradient sampled at the element's real viewport position, not against a flat token.

| State                    | Was                      | Now                    | base/light | base/dark | canney/light | canney/dark |
| ------------------------ | ------------------------ | ---------------------- | ---------- | --------- | ------------ | ----------- |
| Focus ring               | `rgba(255,255,255,0.8)`  | `--focus-ring-color`   | 4.48       | 8.43      | 3.89         | 3.83        |
| _(the prescribed fix)_   | —                        | _`--color-accent`_     | _1.68_     | _1.30_    | _1.03_       | _1.13_      |
| Active-page underline    | `--color-text-inverse`   | `--color-text`         | 8.58       | 9.41      | 6.52         | 5.75        |
| Hover fill vs. gradient  | `rgba(255,255,255,0.1)`  | `--color-on-surface`   | 3.99       | 7.97      | 3.90         | 4.00        |
| Hover label on that fill | inherited `--color-text` | `--color-text-inverse` | 8.34       | 12.56     | 7.19         | 8.01        |

Worst case anywhere is 3.83:1, above the 3:1 UI-component threshold; all text pairings clear 4.5:1.

Two further changes in the same rules:

- `.nav-link.active` lost its background entirely. Hover now fills, so giving active the same treatment would have made the two states identical; the current page is marked by weight plus the underline instead.
- A `@media (prefers-color-scheme: dark)` block in `navigation.style.ts` was deleted. It re-applied white-alpha hover and active backgrounds keyed to the **OS** preference, so it fired even when the reader had explicitly selected the site's light scheme. This is one instance of DF-12 and is noted there.

The `.main-nav a:hover` box-shadow moved from a hardcoded `rgba(0,0,0,0.15)` to `--color-shadow-strong`, which is that exact value in light mode and a stronger one in dark.

Verified by focusing and hovering real elements in a browser across all four theme/scheme combinations, then reading computed styles — not from source. Note that `.main-nav a:focus` outranks `.nav-link:focus` ((0,2,1) vs (0,2,0)), so both had to be corrected; fixing only the `shared-styles` rule would have changed nothing on screen.

### DF-10 — Dead rule blocks and duplicate declarations

**Severity:** Low
**Status:** fixed

Dead blocks — no matching markup anywhere in `source/`:

| Block                                                       | Location                                                    | Notes                                                                                 |
| ----------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `.navigation` and children                                  | `styles/style.css:466-513`                                  | ~48 lines. Real nav is `kbr-navigation` shadow DOM using `.site-header`               |
| `#app`, `.logo`, `.logo.vanilla`                            | `styles/style.css:563-581`                                  | Vite starter boilerplate — see DF-03                                                  |
| `.blog-hero`, `.blog-hero h1`                               | `styles/style.css:622-632`                                  | The `h1` rule is `display: none`, so the block was an empty padded box even when used |
| `.theme-preview`, `.color-swatch`, `.swatch-*`              | `components/theme-switcher/theme-switcher.style.ts:217-245` | `render()` notes the swatches were removed                                            |
| `.timeline-header`, `.timeline-title`, `.timeline-subtitle` | `components/timeline/timeline.style.ts:20-39`               | See DF-08                                                                             |

Duplicate declarations where the first is silently discarded:

| Duplicate                                                                             | Location                               |
| ------------------------------------------------------------------------------------- | -------------------------------------- |
| `background: var(--color-surface)` overwritten by `var(--color-background-secondary)` | `theme-switcher.style.ts:30` and `:35` |
| `.company-name` declared as two separate rule blocks                                  | `timeline.style.ts:63-70` and `:76-80` |

**Fix direction:** Delete the dead blocks. Merge the duplicates and pick the intended value deliberately — the theme switcher should probably use `--color-surface`, which is the token documented for container surfaces.

**Resolution:** All five dead blocks are gone or alive. Deleted: `.navigation`, the `#app`/`.logo` boilerplate, `.blog-hero`, and the theme-switcher swatch rules — including two orphaned `.theme-preview` media-query rules the original finding missed. The `.timeline-header` / `.timeline-title` / `.timeline-subtitle` rules were resolved the other way: DF-08 made them live rather than deleting them.

Both duplicates are merged. The theme switcher keeps `--color-surface`, the token documented for container surfaces, and `.company-name` is now a single rule with the nested `a` selector folded in and its hardcoded `0.2s ease` converted to `var(--transition-fast)`.

### DF-11 — `theme-demo.html` ships broken

**Severity:** Medium
**Status:** open

`pages/theme-demo.html` builds to `dist/theme-demo.html` and is publicly reachable.

- `:188-191` use `.btn`, `.btn-primary`, `.btn-secondary` in light DOM. `buttonStyles` is defined in `styles/shared-styles.ts` and only applied inside component shadow roots, so these classes have no styles. The buttons pick up only the global `button` rule at `styles/style.css:587`.
- `.btn-accent` (`:190`) and `.btn-success` (`:191`) do not exist in any stylesheet.
- `:244` hardcodes `color: white` on `.color-swatch`, which is unreadable over the light `--color-primary` and `--color-primary-subtle` swatches.
- `:18` calls the theme "Base Grayscale"; the manifest name is "Basic Blue" and the palette is blue-tinted.

Related: `content/published/typography-test.md` is a test post that appears in `dist/data/blog-manifest.json` and is listed on the blog index. Its own admonition states it was generated as a reference. Both pages are development artifacts currently published.

**Fix direction:** Decide whether these pages are public. If they are, fix the button classes (either move them to light-DOM CSS or drop them) and correct the theme name. If not, exclude them from the production build.

---

## Category 3: Theme system

### DF-12 — Two competing dark-mode mechanisms

**Severity:** High
**Status:** fixed

The site switches color scheme via the `[data-color-scheme]` attribute, set by `components/theme-switcher/theme-switcher.ts:148`. Three stylesheets instead branch on the OS-level media query:

- `styles/blog-post.css:154`
- `components/navigation/navigation.style.ts:151`
- `components/tag-filter/tag-filter.style.ts:244`

These rules fire off the operating system setting and ignore the reader's choice, so they can apply in direct contradiction to the active theme.

The tag filter case is the most visible. `tag-filter.style.ts:264-267` overrides `.tag-button.active` to use `--color-accent`, while `styles/shared-styles.ts:297` uses `--color-primary`. Which one a reader sees depends on their OS preference, not on the theme they selected:

| OS preference | Site toggle | Result                                                       |
| ------------- | ----------- | ------------------------------------------------------------ |
| Dark          | Light       | Accent-blue active tags — inconsistent with every other page |
| Light         | Dark        | `--color-primary` active tags — invisible, **1.22:1**        |

**Fix direction:** Convert all three blocks to `[data-color-scheme="dark"]` selectors. Inside shadow DOM this requires `:host-context([data-color-scheme="dark"])` or driving the variation through tokens rather than selectors — prefer tokens.

#### Resolution

All three blocks are gone. None needed converting to a selector: in every case the tokens already carried the per-scheme value, so the override was redundant, contradictory, or both. `:host-context()` was not needed anywhere, which is fortunate — it is still unsupported in Firefox.

**`navigation.style.ts`** — deleted as part of DF-09. It re-applied white-alpha hover and active backgrounds, which are now defined once in theme-aware tokens.

**`tag-filter.style.ts`** — deleted outright. Seven of its nine declarations restated the token-driven base rule verbatim. The two that differed were the bug: `.tag-button.active` used `--color-accent` where `shared-styles.ts` uses `--color-on-surface`, so which treatment a reader saw depended on their OS rather than the theme they chose. The only real loss is `--color-border-strong` in place of `--color-border` on two elements; `--color-border` already resolves per scheme, so the base rule covers it.

**`blog-post.css`** — deleted, and the four shadows it was deepening now use `--color-shadow` and `--color-shadow-light` instead of hardcoded `rgba(0,0,0,…)`. Those tokens already carry a heavier alpha in the dark scheme (0.05/0.1 light, 0.3/0.4 dark), so the intended effect survives without a second mechanism. Shadow geometry is unchanged.

While in `tag-filter.style.ts`, three `--color-accent`-as-foreground failures were fixed — the same defect class as DF-01, missed there because that finding tracked `--color-primary`:

| Rule                      | Was                                   | Measured                                |
| ------------------------- | ------------------------------------- | --------------------------------------- |
| `.clear-filter-btn:hover` | hardcoded `white` on `--color-accent` | 1.96:1 canney/light, 3.68:1 base/light  |
| `.expand-tags-btn:hover`  | `--color-accent` as label text        | 1.79:1 to 3.68:1, all four combinations |
| `.tag-button:focus`       | `--color-accent` outline              | see DF-09 — 1.03:1 to 1.68:1            |

All three now use `--color-on-surface` / `--color-text-inverse` / the focus-ring tokens. Verified in-browser: the active tag renders at 6.76:1.

Remaining `prefers-color-scheme` uses in the codebase are in `theme-switcher.ts`, in JavaScript, reading the OS preference to seed the "auto" scheme. That is the correct use and was left alone.

### DF-13 — No `data-theme` until JavaScript runs

**Severity:** Medium
**Status:** fixed

`styles/style.css:17` sets the page background from a gradient token:

```css
background: var(--gradient-primary);
```

`--gradient-primary` is defined only inside `[data-theme="base"]` and `[data-theme="canney-valley"]`. Neither `templates/base.html` nor `templates/blog-post.html` stamps `data-theme` on `<html>`; it is applied in `theme-switcher.ts` during `connectedCallback`, after the Lit bundle loads.

Until then the page has no background and falls back to the `properties.css` defaults, then visibly repaints when the theme applies. On the homepage this compounds with DF-06.

**Fix direction:** Add a small blocking inline script in `<head>` that reads `kbr-theme` and `kbr-color-scheme` from localStorage (falling back to `matchMedia`) and sets both attributes before first paint. The theme switcher can then adopt the already-applied values.

#### Resolution

Implemented as prescribed, in both `templates/base.html` and `templates/blog-post.html`, placed first in `<head>` — before the stylesheet link, so the attributes exist by the time the CSS is applied.

The script mirrors `loadSavedTheme()` in `theme-switcher.ts` exactly: same two storage keys, same `"base"` default, same `matchMedia` fallback when no colour scheme is stored. It is wrapped in `try/catch`, because `localStorage` throws in private mode with cookies disabled; the fallback there is the same default pair the component would have used.

The component still runs `applyTheme()` afterwards. That is now a no-op rather than a correction — both read the same source. **These two must be kept in sync**; the comment in `base.html` says so, since a divergence would reintroduce the repaint silently.

Verified by seeding `localStorage` with `canney-valley`, reloading, and reading the document at rest: `data-theme="canney-valley"` is applied and `--gradient-primary` resolves to the theme's green immediately, with no fallback value in between. Confirmed present in the served dev HTML and in both `dist/index.html` and a built blog post, and confirmed to sit inside `<head>` ahead of the stylesheet.

### DF-14 — `canney-valley` light mode omits surface tokens

**Severity:** Medium
**Status:** fixed

`themes/theme-canney-valley.css:51-54` defines `--color-background`, `-secondary`, and `-tertiary`, but not `--color-surface`, `--color-surface-hover`, or `--color-surface-active`. They fall through to the `properties.css` defaults — `#ffffff`, `#f8f9fa`, `#e9ecef` — which are cool grays inside a deliberately warm palette.

The dark variant at `:97-99` defines all three, so the omission is inconsistent within the theme itself.

**Fix direction:** Define the three surface tokens in the light block with warm values consistent with the `#f4f5f2` background. Consider adding a build-time check that every theme defines the full token contract described in `properties.css`.

#### Resolution

`--color-surface`, `--color-surface-hover` and `--color-surface-active` are now defined in the light block as `#fbfcf9`, `#f4f5f2`, `#eef0ec`.

The relationship was taken from the theme's own dark block rather than from `theme-base`. `theme-base` sets its surface trio equal to its background trio, but `canney-valley` dark lifts surfaces one step above the background (surface `#263238` over background `#1c2420`), so the light block now does the same: a warm near-white above the warm `#f4f5f2` background, with hover and active stepping back down through the background scale.

This also repaired `--gradient-surface`, defined further down in the same block, which had been built from the inherited cool grays.

Verified in-browser under `canney-valley` light: all three resolve to the warm values and `--gradient-surface` computes to `#fbfcf9 → #f4f5f2`.

The status-colour half of this finding was fixed earlier, under DF-20 — see the note there on why the dark block's omissions resolved to the _light_ values rather than to the `properties.css` dark defaults.

**Still open:** the build-time contract check. Two separate omissions in one theme, both invisible until something rendered, are a good argument for it. Filed as remaining work rather than done.

### DF-15 — Reduced-motion override produces invalid CSS

**Severity:** Low
**Status:** fixed

`themes/properties.css:331-338` sets the transition shortcuts to `none`:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --transition-fast: none;
    --transition-normal: none;
    --transition-slow: none;
  }
}
```

Every consumer composes these into a shorthand, e.g. `transition: color var(--transition-normal)`, which resolves to `transition: color none` — invalid, so the browser drops the declaration. The intended outcome (no transition) is reached, but only by accident, and the mechanism is silent and fragile.

**Fix direction:** Set the tokens to a valid zero duration (`0s`) instead of `none`, or drop the token override and disable transitions with an explicit `transition: none` rule inside the media query.

**Resolution:** Set to `0s`, with a comment recording why `none` was wrong. The composed shorthands are now valid CSS that the browser keeps, so the behavior is intentional rather than incidental. This does not close DF-22, which covers the animations the token override never reached.

### DF-16 — Dark-mode font-weight override is never consumed

**Severity:** Low
**Status:** open

`themes/theme-base.css:152-157` states its intent in a comment:

```css
/* Typography - Increased font weight for better readability in dark mode */
--font-weight-normal: 450;
```

No rule anywhere references `var(--font-weight-normal)`. The readability improvement does not happen. `--letter-spacing-normal` from the same block _is_ consumed (`styles/style.css:28`), and `--font-size-base` and `--line-height-normal` are partially consumed, so the block is half-live.

**Fix direction:** Either apply `--font-weight-normal` on `body` so the override takes effect, or delete the line so the file does not claim behavior it does not have.

### DF-17 — 49 of 139 design tokens are unreferenced

**Severity:** Medium
**Status:** open

Tokens defined in `themes/properties.css` and never used via `var()` anywhere in `source/site/`.

The entire component-token layer is dead:

```
--button-border-radius   --button-font-weight   --button-padding-x   --button-padding-y
--card-border-radius     --card-padding         --card-shadow
--nav-link-padding-x     --nav-link-padding-y
```

The upper type scale is dead — headings hardcode rem values in `styles/typography.css`:

```
--font-size-2xl  --font-size-3xl  --font-size-4xl  --font-size-5xl
```

Most weight and layout tokens are dead — components hardcode `500`, `600`, `700`:

```
--font-weight-light  --font-weight-normal  --font-weight-semibold  --font-weight-bold
--line-height-tight  --line-height-loose   --letter-spacing-tight  --letter-spacing-wide
--content-wide  --sidebar-width  --header-height  --footer-height
```

Remaining unused:

```
--animation-duration  --animation-easing  --color-error-hover  --color-info-hover
--color-secondary-active  --color-secondary-hover  --color-secondary-subtle
--color-shadow-dark  --color-success-hover  --color-surface-active
--color-text-disabled  --color-warning-hover  --duration-slower
--easing-ease-in  --easing-ease-in-out  --easing-ease-out
--radius-xl  --space-0  --space-5  --space-10  --space-20  --space-24  --space-32
--transition-slow
```

`--header-height` is the sharpest case: it is defined as `80px` and never used, while the literal `80px` is hardcoded in three places:

- `styles/blog-post.css:17`
- `styles/style.css:368`
- `components/timeline/timeline.style.ts:17`

Note: `--theme-name`, `--theme-version`, and `--theme-author` are not dead. They are parsed at build time by `source/builder/theme-processor.ts` to generate `data/theme-manifest.json`.

**Fix direction:** Two valid paths — adopt the tokens in the places that currently hardcode equivalents, or prune the ones that represent abandoned intent. Prefer adopting for `--header-height`, `--radius-*` (see DF-19), and `--font-weight-*`; prefer pruning for the component-token layer unless it is going to be used.

---

## Category 4: Design inconsistency

### DF-18 — Three competing card surface colors

**Severity:** Medium
**Status:** open

| Surface                        | Location                                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------- |
| `--color-background`           | `styles/style.css:67`, `components/post-card/post-card.style.ts:11`                   |
| `--color-background-secondary` | `styles/shared-styles.ts:332`, `components/timeline-entry/timeline-entry.style.ts:11` |
| `--color-surface`              | `pages/theme-demo.html:261,318`, `components/post-series/post-series.style.ts:13`     |

`--color-surface` is documented in `properties.css:76` as the token for "Card/container surfaces" but is used least. Because post cards use `--color-background`, they are the same color as the page beneath them — only the border separates a card from its background on the blog index.

**Fix direction:** Standardize on `--color-surface` for all elevated containers, and make sure every theme defines it distinctly from `--color-background` (see DF-14).

### DF-19 — Radius scale is unused; ~45 hardcoded values

**Severity:** Medium
**Status:** open

`properties.css:188-193` defines a six-step radius scale. `--radius-xl` is never used and the rest are used rarely. Roughly 45 hardcoded values appear instead: `1px`, `3px`, `4px`, `6px`, `8px`, `12px`, `14px`, `20px`, `50%`, `0.5rem`, `1rem`.

A second pattern uses **spacing** tokens as radii:

- `components/admonition/admonition.style.ts:10,145`
- `components/post-series/post-series.style.ts:11,91,147`
- `components/table-of-contents/table-of-contents.style.ts:16`
- `themes/theme-base.css:197` (`.glass-surface`)

In the admonition this inverts the visual hierarchy: inline code gets `var(--space-sm)` (16px) while its container gets `var(--space-xs)` (8px), so the small inline element is rounder than the block that holds it.

A related 1px mismatch: `table-of-contents.style.ts:16` sets the wrapper radius to `var(--space-xs)` (8px) while the scroll indicators at `:100` and `:106` use `8px 8px 0 0` — these agree today only by coincidence.

**Fix direction:** Repoint all radii to the `--radius-*` scale. Never use spacing tokens for radius.

### DF-20 — Admonition headers fail contrast in light mode

**Severity:** High
**Status:** fixed

`components/admonition/admonition.style.ts` colors each header with the matching status token over that token's `-subtle` background. In light mode these pairings are too close:

| Variant                     | Foreground / background                       | Contrast   |
| --------------------------- | --------------------------------------------- | ---------- |
| Tip                         | `--color-success` on `--color-success-subtle` | **2.07:1** |
| Warning                     | `--color-warning` on `--color-warning-subtle` | **1.93:1** |
| Caution                     | `--color-error` on `--color-error-subtle`     | **2.60:1** |
| Note                        | `--color-info` on `--color-info-subtle`       | **3.01:1** |
| Important (`canney-valley`) | `--color-accent` on `--color-accent-subtle`   | **1.84:1** |

Body text is also inconsistent: `.admonition-content` uses `--color-text-secondary` (`:44`), but only `.admonition-caution` overrides it back to full-contrast `--color-text` (`:114`). Four of five variants render muted body copy for no stated reason.

Inline code inside admonitions uses `--color-background` (`:143`) while `styles/blog-post.css:63` gives article inline code `--color-background-secondary` plus a border and shadow — two different treatments for the same element.

`todos.md` already flags admonition styling; this quantifies the color half of it.

**Fix direction:** Add darker `-strong` variants of the status colors for use as foreground on `-subtle` backgrounds, or invert the pattern so headers use `--color-text` and the status color appears only in the border and icon. Normalize body text to `--color-text` across all variants, and unify inline code with the article treatment.

#### Resolution

Took the first option — `-strong` variants — because it keeps the coloured header, which is the variant's main signal, and because the same broken pairing turned out to exist outside the admonitions.

`--color-{accent,success,warning,error,info}-strong` added to `properties.css` (light and dark) and to both themes. Each is its base hue at adjusted lightness, solved to hold at least 4.75:1 against its own `-subtle` background in the same scheme. `properties.css` carries the contract note: base tokens are fills, `-strong` is for text and icons on the matching `-subtle`.

Measured in-browser across all 40 pairings (5 variants × 4 theme/scheme combinations × header and body). Worst case **4.74:1**; every variant clears AA.

| Variant   | base/light  | base/dark | canney/light | canney/dark |
| --------- | ----------- | --------- | ------------ | ----------- |
| Note      | 2.07 → 4.74 | → 4.75    | → 4.78       | → 4.76      |
| Tip       | 2.07 → 4.74 | → 4.75    | → 4.76       | → 4.76      |
| Important | 1.84 → 4.74 | → 4.77    | → 4.75       | → 4.75      |
| Warning   | 1.93 → 4.77 | → 4.74    | → 4.75       | → 4.75      |
| Caution   | 2.60 → 4.76 | → 4.74    | → 4.77       | → 4.75      |

Body copy normalised to `--color-text` in all five variants, and the `.admonition-caution` override that had been the lone exception was deleted. Body now measures 7.36:1 to 16.40:1. Inline code gained the border, radius, padding, font and weight from the article treatment in `blog-post.css`; it keeps `--color-background` rather than the article's `--color-background-secondary`, because inside an admonition the chip sits on a tinted panel and needs to stay distinct from it.

**Broader than prescribed, deliberately.** Three things beyond the finding:

1. The `border-left` stripe also moved to `-strong`. It is a 4px graphical object carrying the variant's identity and was measuring 1.84:1 to 3.22:1 against the panel behind it — WCAG 1.4.11 wants 3:1.
2. `tag-filter.style.ts:204` and `timeline.style.ts:102` had the identical `--color-error` on `--color-error-subtle` pairing. Both moved to `-strong`. The timeline's 1px border keeps the base token, since it sits against the page rather than the panel.
3. `canney-valley` dark was fixed — see below.

#### Also fixed: canney-valley dark had no status colours at all

Verification in the browser turned up a pre-existing failure the original finding did not capture. `theme-canney-valley.css`'s dark block never defined the status colours. That did **not** fall through to the dark defaults in `properties.css`: that block is `[data-color-scheme="dark"]` and the theme's light block is `[data-theme="canney-valley"]` — equal specificity, theme file second in source order — so the **light** values won in dark mode. Admonitions rendered near-white `-subtle` panels behind the theme's near-white `--color-text`, at **1.02:1 to 1.04:1**.

This was independent of the DF-20 change; the previous `--color-text-secondary` body colour was equally invisible there.

A full dark status set is now defined in that block, carrying the theme's own hues — success and info stay green — with base tones at 4.5:1 on `--color-background` and `-strong` at 4.75:1 on `-subtle`. This closes part of DF-14, which is about the same class of omission.

`--color-accent-subtle` in that block was also replaced. It was `#96687f`, a mid-tone _lighter_ than `--color-accent` itself, inverting the relationship every other `-subtle` token holds; nothing in the accent hue could reach 4.5:1 against it, and even pure white topped out at 4.58:1. It is now `#5d3043`, a dark tint of the same hue at a luminance in line with the other dark `-subtle` values. Only the admonition and the `theme-demo` swatch consume that token.

### DF-21 — Spacing tokens ignored in three components

**Severity:** Low
**Status:** open

`components/tag-filter/tag-filter.style.ts`, `components/timeline/timeline.style.ts`, and `components/timeline-entry/timeline-entry.style.ts` hardcode `0.25rem`, `0.5rem`, `1rem`, `1.5rem`, `2rem`, and `3rem` in their base rules — then switch to `var(--space-*)` inside their mobile media queries. The same file uses both systems, which makes the responsive step look arbitrary rather than proportional.

The tag filter also hardcodes `transition: all 0.2s ease` (`:41`, `:226`) and `0.4s cubic-bezier(...)` (`:64`) rather than using the transition tokens.

**Fix direction:** Convert the base rules to the spacing and transition scales.

### DF-22 — Reduced-motion coverage is uneven

**Severity:** Medium
**Status:** open

Three different enforcement styles, and several gaps:

| Component           | Approach                                                         |
| ------------------- | ---------------------------------------------------------------- |
| `post-card`         | Scoped rules per selector (`:195-214`)                           |
| `post-list`         | `* { transition: none !important }` (`:193`)                     |
| `table-of-contents` | `.toc-link { transition: none !important }` (`:326-330`)         |
| `tag-filter`        | None                                                             |
| `navigation`        | Inverted — uses `prefers-reduced-motion: no-preference` (`:130`) |

Unguarded continuous animations:

- `components/tag-filter/tag-filter.style.ts:76` — `activeTagPulse`, a 2s infinite box-shadow pulse on the selected tag
- `components/table-of-contents/table-of-contents.style.ts:114` — `scroll-pulse`, 2s infinite
- `components/icon/icon.style.ts:47` — `icon-loading`, 1s infinite
- `components/anchor-copy.ts:130-132` — injects `html { scroll-behavior: smooth }` globally with no guard

**Fix direction:** Pick one approach and apply it consistently. Guard every infinite animation, and gate the injected `scroll-behavior` on `prefers-reduced-motion: no-preference`.

### DF-23 — Portfolio page has no measure constraint

**Severity:** Medium
**Status:** fixed

`styles/style.css:37` sets margins on `.page-content` but no `max-width`:

```css
.page-content {
  margin: var(--space-2xl) var(--space-lg);
}
```

Most pages compensate downstream — `.blog-post-layout`, `.blog-layout`, and `.timeline` all cap at `--content-max-width`, and the homepage constrains `.hero-content` and `.cards`. `pages/portfolio.html` does not: its `<section>` prose runs the full viewport width, producing very long line lengths on wide displays.

A related miscalculation at `styles/style.css:377-380`:

```css
body:has(.portfolio-toc) main {
  margin-right: 400px;
  max-width: calc(100% - 500px);
}
```

The margin and the max-width both reserve space for the fixed TOC, so the reservation is double-counted and leaves a ~100px dead gap. `:368` also hardcodes the `80px` nav height rather than using `--header-height` (see DF-17).

**Fix direction:** Give `.page-content` a `max-width` with auto side margins, and reserve TOC space with one mechanism rather than two.

#### Resolution

`.page-content` now carries `max-width: var(--content-max-width)` with `margin: var(--space-2xl) auto`. The side spacing moved from `margin` to `padding-inline`: with `margin: … auto` the side margins are what centres the block, so they cannot also serve as a fixed gutter.

No-op for the pages that already constrained themselves — `.blog-post-layout`, `.blog-layout`, `.timeline` and the homepage all cap at the same token or below it. The portfolio page was the one with no wrapper.

The double-counted TOC reservation is gone. `margin-right: 400px` **and** `max-width: calc(100% - 500px)` both reserved space for the same 340px sidebar, leaving roughly 100px of dead gap. It is now a single `margin-right: calc(340px + var(--space-lg) * 2)`, derived from the sidebar's actual width plus its offset and one gutter. The hardcoded `80px` nav height became `var(--header-height)`.

Measured at a 1600px viewport: content spans 0–1188, the TOC 1224–1564, a 36px gap between them and no overlap.

**Partially addressed.** The measure is now bounded, but the widest paragraph on the portfolio page is still ~1116px — long for prose. Constraining prose further is a typographic decision about this page's design rather than a defect, so it was left alone.

### DF-24 — `a:hover` reflows text

**Severity:** Low
**Status:** fixed

`styles/typography.css:216-218`:

```css
a:hover {
  font-weight: bold;
}
```

Bolding on hover changes the element's width and reflows surrounding text. It also disagrees with the shadow-DOM link treatment at `styles/shared-styles.ts:113-116`, which uses `text-decoration: underline` — so light-DOM and shadow-DOM links behave differently.

`styles/typography.css:213` also transitions `all`, which under DF-15 becomes `transition: all none` and is dropped.

**Fix direction:** Use `text-decoration: underline` for both, matching the shared-styles behavior.

**Resolution:** Hover now shifts color (`--color-on-surface-hover`) instead of weight, so there is no reflow, and `transition: all` was narrowed to `transition: color`.

The fix direction above said to unify light-DOM links with the shadow-DOM treatment. That was not done, and the finding is closed against a different fix. `shared-styles.ts` sets `text-decoration: none` at rest and underlines on hover, which is right for the nav and UI links inside components. Applying it to light-DOM `a` would strip the resting underline from prose links in article bodies — and since those links inherit `--color-text` from body copy, the underline is the only thing distinguishing them. Removing it would trade a reflow bug for a WCAG 1.4.1 failure. Light-DOM `a` therefore keeps its resting underline, and the components that want a bare link (`.nav-card`, `.sample-link`, `.project-link`, `.citations a`) continue to opt out individually, which they already did.

### DF-25 — Lightbox modal is not full-screen

**Severity:** Medium
**Status:** fixed

`components/image-lightbox/image-lightbox.style.ts:74-93`:

```css
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 75vw;
  height: 75vh;
  background-color: rgba(0, 0, 0, 0.9);
}
```

A 90%-opaque black box covering 75% of the viewport reads as a floating rectangle rather than a lightbox backdrop. Because the dismiss handler is bound to `.modal`, clicking the remaining 25% of the screen does not close it.

`.modal-close` at `:129-132` is positioned against `.modal-content` rather than the modal, so it sits over the top-right of the image instead of at the overlay corner.

**Fix direction:** Make `.modal` a full-viewport backdrop (`inset: 0`) and keep the `75vw`/`75vh` constraint on `.modal-content`. Reposition the close button against the backdrop.

#### Resolution

Done as prescribed. `.modal` is `position: fixed; inset: 0`, and `.modal-content` keeps the `75vw`/`75vh` cap it already had. `.modal-close` moved from `absolute` to `fixed`, so it anchors to the viewport instead of to `.modal-content` — which is `position: relative` and was pulling the button over the image's top-right corner.

Verified by opening a lightbox on the portfolio page at 1600×1000: the backdrop measures exactly the viewport, the content sits inside it, and the close button lands 36px from the top and right edges. Dismissing now works anywhere on screen, since the handler is bound to `.modal` and `.modal` is finally the whole screen.

**One thing this fix exposed.** The backdrop and the theme switcher both used `z-index: 1000` and had never met — the old 75vh box was centred and the switcher is pinned to the bottom edge. A full-viewport backdrop overlaps it, and at equal z-index the switcher won on document order, floating a page control on top of a modal. The modal is now `z-index: 2000`. Confirmed with `elementsFromPoint` at the switcher's position while the lightbox is open: the lightbox is topmost.

### DF-26 — Font fallback stacks are miscategorized

**Severity:** Low
**Status:** open

`themes/properties.css:114-116`:

```css
--font-family-primary:
  "valkyrie_b", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-family-heading: "valkyrie_b_caps", "IBM Plex Sans", serif;
--font-family-mono: "IBM Plex Mono", "Cascadia Code", Monaco, monospace;
```

Valkyrie B is a serif, but `--font-family-primary` falls back to system sans and ends in `sans-serif`. `--font-family-heading` falls back to a named sans (`IBM Plex Sans`) but ends in `serif`. If the webfonts fail to load, body text and headings both change classification, and in opposite directions.

**Fix direction:** End the primary stack in `serif` with a serif fallback chain (`Georgia`, `Cambria`, or similar), and make the heading fallback consistent with it.

### DF-27 — Negative-margin layout hacks

**Severity:** Low
**Status:** open

Overlap is created by pulling elements upward rather than by layout:

- `styles/style.css:716` — `.cards-container { margin-top: calc(var(--space-2xl) * -1) }` (-64px)
- `styles/style.css:553` — `.hero { margin: -0.2em }` inside the mobile breakpoint
- `components/post-list/post-list.style.ts:13,146,168` — three breakpoint-specific negative top margins

These are fragile at intermediate widths and make vertical rhythm hard to reason about. `styles/style.css:408-410` compounds the last one by switching `.page-content` from spacing tokens to `em` units at mobile.

**Fix direction:** Replace with explicit spacing on the neighboring elements.

### DF-28 — Article glass surface has 1rem padding

**Severity:** Low
**Status:** open

`templates/blog-post.html:34` applies `.glass-surface` to the article:

```html
<article class="blog-post-content glass-surface"></article>
```

`.glass-surface` (`themes/theme-base.css:193-203`) sets `padding: var(--space-sm)` — 1rem. That is a utility default sized for small frosted panels, not for long-form article text, and it leaves body copy close to the container edge. The same rule sets `border-radius: var(--space-xs)`, a spacing token used as a radius (see DF-19), and hardcodes two `rgba(0,0,0,…)` shadows rather than using the elevation scale.

**Fix direction:** Override padding on `.blog-post-content`, and convert `.glass-surface` to the radius and shadow scales.

### DF-29 — Nested sticky positioning on blog TOC

**Severity:** Low
**Status:** open

`styles/blog-post.css:27-29` makes `.blog-toc-sticky-container` sticky at `top: var(--space-lg)`. `components/table-of-contents/table-of-contents.style.ts:8-9` makes the TOC's own `:host` sticky at the same offset. `components/timeline/timeline.style.ts:46-49` adds a third sticky wrapper on the career page.

Nesting sticky elements at identical offsets is redundant, and the inner element cannot move relative to an already-pinned parent.

**Fix direction:** Keep the outer container sticky and make the component's `:host` position static, or the reverse — but not both.

### DF-30 — `var()` fallbacks contradict documented rule

**Severity:** Low
**Status:** fixed

`styles/README.md:527` states the rule in strong terms: CSS custom properties should **never** include fallback values, because fallbacks "hide missing or incorrect token definitions."

Violations:

- `styles/blog-post.css:78` — `var(--color-background-tertiary, var(--color-background-secondary))`
- `styles/blog-post.css:139` — `var(--color-background-tertiary, rgba(0, 0, 0, 0.05))`
- `styles/blog-post.css:293,350` — `var(--color-primary-hover, var(--color-primary))`
- `styles/prism-theme.css:30-37` — eight tokens with hex fallbacks
- `styles/prism-theme.css:185` — `var(--color-background-tertiary, rgba(0, 0, 0, 0.1))`

All referenced tokens are in fact defined, so the fallbacks are inert — but they mask exactly the kind of failure DF-01 represents.

**Fix direction:** Remove the fallbacks. If a token is genuinely optional, define it in `properties.css` with a default instead.

**Resolution:** All twelve removed. Every referenced token was already defined, so no defaults needed adding to `properties.css`.

**Correction — the first verification of this finding was wrong.** It claimed a search for `var(--token,` returned nothing. That search used a single-line pattern, and one fallback had been wrapped across four lines by Prettier:

```css
/* blog-post.css:77, as formatted */
background: var(--color-background-tertiary, var(--color-background-secondary));
```

So it never matched, and the finding was marked fixed while a thirteenth fallback was still shipping. Found later while reading the file for DF-20, not by any search.

Re-verified with a multi-line-aware pattern (`var\(\s*--[a-z0-9-]+\s*,` with `re.S`) across `source/site/**`, excluding the READMEs, which contain fallbacks as illustrations. That now returns nothing. `--color-background-tertiary` is defined in `properties.css` and both themes in both schemes, so the fallback was inert as well as prohibited.

**Lesson:** verify CSS patterns against the formatted file, not the shape you expect the declaration to take. Prettier will wrap any declaration past the print width, and a single-line regex silently under-reports.

### DF-31 — Theme switcher occludes article text

**Severity:** Medium
**Status:** fixed

Found by rendering the page, not by reading source — nothing about the rule set
looks wrong in isolation.

`kbr-theme-switcher` is `position: fixed` with `z-index: 1000`, anchored to the
bottom edge and centred on the **viewport**. The blog reading column is not
viewport-centred: it sits to the right of the TOC sidebar. At 1440×1000 the
button occupies x 657–782 while the article spans x 542–1284, so the control
lands inside the text column rather than beside it.

`document.elementsFromPoint()` at the button's centre returns the switcher, then
an `h3`, then `.blog-post-content` — the button is directly covering a heading.
It is collapsed to 125×52 px, so the occluded area is small but permanent, and
it tracks the reader down the page.

Reproduced in both colour schemes and at the default desktop width.

**Fix direction:** Anchor it to a viewport corner instead of the centre, so it
cannot overlap a centred or offset content column at any width. If the centred
position is deliberate, the alternative is reserving space for it — bottom
padding on `.blog-post-layout` equal to the control's height — but that only
helps at the end of the document, not mid-scroll, so the corner is the better
fix.

Worth checking the same control against the career and portfolio layouts, whose
content columns are positioned differently again.

#### Resolution

Moved into the site header, at the far right of `.header-content`. This is the first of the two options below, chosen by the site's owner after the intermediate fix (bottom-left corner) proved insufficient — see the note at the end.

`kbr-theme-switcher` is now slotted into `kbr-navigation` rather than floating in the body:

- `navigation.ts` wraps the links and a `<slot name="theme-switcher">` in a `.header-actions` cluster. The two travel together so the switcher lands at the far edge; a bare `space-between` across three children would have pushed the links into the middle instead.
- Both templates render `<kbr-theme-switcher slot="theme-switcher">` inside `<kbr-navigation>`. Slotted rather than rendered inside the navigation component, so `navigation.ts` does not depend on the switcher.
- `:host` drops `position: fixed` for `position: relative; display: inline-block`, taking up layout space. **The control can no longer overlap page content at any width** — that is what moving it into the header buys over relocating it.

The component's `render()` changed as well. It used to swap the trigger out for the expanded panel; in the header that made the host collapse to zero width while open and shove the nav links sideways. The trigger now renders in both states and the panel is absolutely positioned beneath it, anchored to the trigger's right edge so it opens inward from the header. The trigger also became a real `<button>` with `aria-expanded`, replacing a `<div>` with a click handler.

Verified at 1440×1000: opening the panel shifts the nav links and the trigger by **0px**, the panel sits below the trigger and stays inside the viewport, and the theme select and mode toggle still write through to `data-theme`, `data-color-scheme` and `localStorage`. The trigger label measures 11.73:1 to 17.85:1 across the four theme/scheme combinations.

**A regression this introduced, caught on mobile and fixed.** At 390px the three links plus the button exceeded the width of the row, wrapping the link list onto a second line beneath the button. `.header-actions` now stacks at the ≤480px breakpoint where `.header-content` already becomes a column, giving logo / links / button. Re-checked at 390×844: no wrapping, no horizontal scroll, panel within the viewport.

The two intermediate states are worth recording, since both were verified and neither was sufficient:

1. **Bottom-centre (original).** Occupied x 657–782 inside an article spanning 542–1284 at 1440×1000 — permanently covering a strip of body text and tracking the reader down the page.
2. **Bottom-left.** Cleared the blog reading column, but the portfolio page's content is full-width, so it clipped the bottom-left of a card. Any `position: fixed` control over a full-width layout overlaps something at some width.

Obsolete CSS removed along the way: the bottom-bar `.theme-switcher` wrapper styles, `.expanded-header` and its hover rule, and the mobile full-width-bottom-bar block. The `prefers-contrast: high` rule was retargeted from the old wrapper to the trigger and panel, which is where the borders now live.

---

## Appendix A: Contrast methodology

Ratios are WCAG 2.1 contrast values computed from relative luminance, using the sRGB linearization in the WCAG definition. Backgrounds were resolved to the concrete token value that applies at that point in the cascade for the named theme and color scheme — not to the page background where an intermediate surface intervenes.

Thresholds:

- **4.5:1** — AA for normal-size text
- **3:1** — AA for large text (18pt+, or 14pt+ bold) and for UI components and graphical objects
- Below **3:1** — fails all AA text and UI thresholds

## Appendix B: Verification notes

The following were confirmed against build output rather than source alone, because source-level reasoning about cascade order and minification is not sufficient on its own:

| Finding | Artifact                                               | What was confirmed                                                                       |
| ------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| DF-03   | the built CSS bundle                                   | Both `.card` rules survive minification in original order; the `2em` rule is last        |
| DF-04   | the built JS bundle                                    | Lit `css` literals ship unminified; both `display` declarations present in the same rule |
| DF-05   | the built JS bundle                                    | All three `var(--transition-fast) ease` declarations ship as written                     |
| DF-06   | `dist/index.html`                                      | Stylesheet `<link>` and module script are emitted inside `<main class="page-content">`   |
| DF-07   | `dist/rule-of-thirds.html`                             | No `<link rel="icon">` in `<head>`                                                       |
| DF-11   | `dist/theme-demo.html`, `dist/data/blog-manifest.json` | Demo page and typography test post are both published                                    |
| DF-17   | `dist/data/theme-manifest.json`                        | Confirms `--theme-name` is consumed at build time and is not dead                        |

## Appendix C: Scope

This audit covers the public site only: `source/site/**` and the templates and builder output that produce it. It does not cover `source/admin/**`, which has a separate stylesheet and component tree.

Not assessed: keyboard navigation order, screen reader semantics beyond heading structure, focus management in the lightbox modal, or performance of the CSS delivery path. `todos.md` lists accessibility optimization and CSS bundling as separate open workstreams.
