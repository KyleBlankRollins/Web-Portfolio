# Phase 4: Mobile and Theme Controls

## Objective

Make the header, theme controls, and tag pills compact and legible at mobile widths and correct the Canney Valley dark-mode styling without introducing theme-specific hacks.

## Agent Instructions

1. Inspect `source/site/components/navigation/`, `source/site/components/theme-switcher/`, `source/site/components/tag-filter/`, `source/site/styles/shared-styles.ts`, and both theme files before editing.
2. Test the current slotted theme switcher before changing the header. Keep the existing early theme bootstrap and slot architecture unless a concrete browser failure requires a change.
3. At approximately `390px`, keep the logo and primary navigation usable without consuming roughly one quarter of the viewport before page content. Prefer a compact, accessible layout over hiding navigation or removing labels without an equivalent control.
4. If the theme switcher is relocated or made icon-only, provide an accessible name, visible focus state, and a discoverable tooltip or label. Do not rely on color alone.
5. Add clear sun/moon or equivalent mode indicators to the light/dark control. The checked state, accessible name, and visual state must agree.
6. Trace the Canney Valley dark-mode tag-pill failure to the missing or incorrect token/rule. Fix the shared token or component contract at its owner rather than adding a page-specific override.
7. Add an explicit clear-filter affordance to the tag filter only if it is absent after inspecting the current interaction. It must clear URL state and restore the unfiltered list.
8. Check reduced-motion behavior and focus visibility while changing animated controls.

## Scope

Likely files:

- `source/site/components/navigation/*`
- `source/site/components/theme-switcher/*`
- `source/site/components/tag-filter/*`
- `source/site/styles/shared-styles.ts`
- `source/site/styles/themes/theme-canney-valley.css`
- `source/site/styles/themes/theme-base.css` only if the shared contract requires it
- `source/site/styles/style.css`

Do not redesign the color palettes or change the existing theme bootstrap in this phase.

## Gate

Do not proceed to Phase 5 until all answers are objectively yes:

- At `390px`, can a user identify and activate Blog, Portfolio, Career, and theme settings without content overlap?
- Does the theme control expose the current light/dark state through both text/icon treatment and accessible state?
- Do tag pills retain their background, border, text contrast, hover, active, and focus states in Canney Valley dark mode?
- Does clear-filter restore the canonical unfiltered blog URL and list?
- Does the same interaction work in Basic Blue light/dark and Canney Valley light/dark?
- Does `prefers-reduced-motion: reduce` suppress nonessential motion in the changed controls?

Evidence required: browser checks at `390px` and a desktop width in all four theme/scheme combinations, plus keyboard-only interaction notes.
