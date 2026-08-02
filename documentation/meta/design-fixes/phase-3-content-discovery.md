# Phase 3: Home Page and Blog Card Content

## Objective

Make the homepage useful on first arrival and improve the information density of the blog listing without weakening accessibility or duplicating navigation.

## Agent Instructions

1. Inspect `source/site/index.html`, `source/site/pages/blog.html`, `source/site/components/post-list/`, `source/site/components/post-card/`, and the blog manifest contract before editing.
2. Add a compact homepage content area that surfaces real material. Use existing data sources where possible:
   - the latest published post title and date;
   - one clearly identified featured project or current role.
3. Do not hard-code generated post content into `index.html` if the manifest or an existing component can provide it. If a small homepage component is needed, keep its data contract narrow and define the loading, empty, and error states.
4. Left-align multi-line introductory body text while keeping the hero composition intact.
5. Simplify blog cards so the title/card has one clear destination. Remove redundant “Read more” treatment only if the entire card becomes a keyboard-accessible link or the existing component structure can provide equivalent semantics.
6. Preserve tag-button behavior. A tag click must filter the blog rather than activate the post card link.
7. Add distinct visual treatment for the three 3M writing samples only if suitable existing assets or document-type icons are available. Do not introduce placeholder stock imagery.

## Scope

Likely files:

- `source/site/index.html`
- `source/site/pages/blog.html`
- `source/site/components/post-list/*`
- `source/site/components/post-card/*`
- `source/site/styles/style.css`
- `source/site/styles/*` only when needed for the affected components

Do not modify the content discovery or manifest builder unless the current data contract cannot support the homepage requirement.

## Gate

Do not proceed to Phase 4 until all answers are objectively yes:

- Does the homepage expose at least the latest post and one useful featured/current item without requiring a second click?
- Is homepage body copy left-aligned and readable at mobile and desktop widths?
- Does each blog card have one clear post destination and one clear tag interaction model?
- Can a keyboard user reach and activate the card destination and tag controls independently?
- Are loading, empty, and failed-manifest states non-destructive and understandable?
- Are all existing blog filters, counts, and URL parameters still functional?

Evidence required: generated blog manifest inspection, browser interaction checks for card and tag keyboard behavior, and screenshots at desktop and mobile widths.
