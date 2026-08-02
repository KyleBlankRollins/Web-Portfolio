# Phase 1: Shared Shell and Page Metadata

## Objective

Make the site shell consistent across the homepage, static pages, blog posts, and nested supplement pages. Add the required contact path without introducing page-specific footer markup.

## Agent Instructions

1. Inspect `source/site/templates/base.html`, `source/site/templates/blog-post.html`, `source/site/components/navigation/`, and the global styles before editing.
2. Implement one shared footer in the appropriate template or shared shell boundary.
3. Include only the required links:
   - LinkedIn: `https://www.linkedin.com/in/kyle-blank-rollins/`
   - GitHub: `https://github.com/KyleBlankRollins/Web-Portfolio`
4. Use semantic `<footer>` and navigation markup. External links must use `target="_blank"` and `rel="noopener noreferrer"` unless the existing site convention requires an internal navigation pattern.
5. Style the footer with existing theme tokens. Do not add one-off colors, hard-coded theme values, or duplicate footer markup across page types.
6. Update page titles where the audit calls for clearer identity, starting with the home page and static Blog/Portfolio/Career pages. Keep titles concise and avoid changing SEO descriptions unless needed.
7. Confirm that root-absolute asset and favicon paths continue to work from nested supplement URLs.

## Scope

Likely files:

- `source/site/templates/base.html`
- `source/site/templates/blog-post.html`
- `source/site/styles/style.css`
- `source/site/pages/*.html`
- Any shared navigation or footer component created only if the existing template boundary cannot support the footer cleanly

Do not redesign the navigation or implement mobile changes in this phase.

## Gate

Do not proceed to Phase 2 until all answers are objectively yes:

- Does every generated page contain exactly one semantic `<footer>`?
- Does the footer contain working LinkedIn and GitHub links in both templates?
- Does `npm run build` pass after a clean production build?
- Does a generated nested supplement page contain root-absolute CSS/JS/favicon URLs and no source-only `/main.ts` reference?
- Are the home, Blog, Portfolio, and Career document titles distinct and descriptive?

Evidence required: generated HTML inspection for one root page, one static page, one blog page, and one nested supplement page, plus the successful build output.
