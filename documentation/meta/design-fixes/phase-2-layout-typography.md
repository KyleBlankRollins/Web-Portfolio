# Phase 2: Layout, Typography, and Anchors

## Objective

Resolve the remaining structural problems that affect reading and navigation: TOC consistency, body line height, small-caps hierarchy, and duplicate Career anchors.

## Agent Instructions

1. Inspect `source/site/styles/style.css`, `source/site/styles/shared-styles.ts`, `source/site/styles/blog-post.css`, `source/site/components/table-of-contents/`, `source/site/components/timeline/`, and `source/site/components/timeline-entry/`.
2. Verify the existing Portfolio TOC reservation at `1200px` and `1440px` before changing it. Keep the current fix if content is no longer obscured.
3. Choose one TOC pattern for Blog, Portfolio, and Career. Prefer a dedicated rail that reserves layout space rather than a fixed panel that overlays content. Preserve the existing mobile collapse behavior.
4. Replace hard-coded body-copy line-height values with the existing semantic token where the token is the owning abstraction. Do not change heading scale or code-block line height unless a browser check shows a regression.
5. Reduce small-caps usage so it remains an intentional hierarchy signal:
   - Keep small caps for `h1` and `h2` if the current theme supports them.
   - Use regular serif or italic styling for `h3`, TOC entries, and metadata where appropriate.
   - Do not flatten component-specific controls that need their existing emphasis.
6. Make generated Career company IDs unique. If duplicate company names occur, generate deterministic suffixes such as `purch-2` in data order. Preserve stable IDs for the first occurrence.
7. Ensure TOC links point to the generated IDs and that heading text still communicates the year or role when two entries share a company.

## Scope

Likely files:

- `source/site/styles/style.css`
- `source/site/styles/shared-styles.ts`
- `source/site/styles/blog-post.css`
- `source/site/components/table-of-contents/table-of-contents.ts`
- `source/site/components/table-of-contents/table-of-contents.style.ts`
- `source/site/components/timeline/timeline.ts`
- `source/site/components/timeline/timeline-entry.*`

Do not change footer markup or homepage content in this phase.

## Gate

Do not proceed to Phase 3 until all answers are objectively yes:

- At `1200px` and `1440px`, does the Portfolio TOC leave every intro paragraph and writing-sample card readable and clickable?
- Is there one consistent TOC layout model across Blog, Portfolio, and Career on desktop?
- At normal body size, is paragraph line height driven by the theme token rather than the old `1.2777778rem` value?
- Do all Career company headings have unique IDs, including repeated companies such as Purch?
- Does selecting each Career TOC entry scroll to the intended heading?
- Do screenshots in both themes show a clear distinction between page headings, subsections, TOC entries, and metadata?

Evidence required: browser checks at `1200px`, `1440px`, and `390px`, a DOM listing of Career heading IDs, and a successful TypeScript/build check.
