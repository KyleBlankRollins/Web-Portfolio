# Phase 5.5: Timeline Content Source

## Objective

Document how career timeline content is maintained after Phase 5, while making the next content-format decision explicit.

The timeline is rendered as static HTML at build time and is authored as Markdown files with TOML frontmatter. This phase records that contract and the migration that established it without changing the rendering architecture.

## Current Source Of Truth

The career timeline is maintained in:

```text
source/site/content/career/
  mongodb.md
  netlify.md
  3m.md
  ebay.md
  lightcast.md
  purch.md
  weber-state-university.md
```

Each file contains strict TOML frontmatter for company and position metadata. `## Position` sections contain the corresponding Markdown description, and each heading must match the position title at the same index. The builder parses these files through the existing frontmatter and Markdown infrastructure, derives `dateRange` and `duration` from `startDate` and `endDate`, passes the resulting data through the typed view models in `source/builder/static-content.ts`, then renders the career page through:

```text
source/site/templates/partials/timeline-static-content.html
```

The rendered page is static HTML. The table of contents remains the only timeline enhancement that needs client-side behavior.

## Current Authoring Contract

Each company has a `company`, an optional `companyWebsite`, and a `positions` array. Each position includes structured metadata plus a `description` and optional `skills`.

Descriptions are authored as Markdown. Use normal blank lines to separate paragraphs:

```markdown
## Role title

Opening paragraph.

Second paragraph.
```

Use Markdown list syntax for a list:

```markdown
Context paragraph.

- First item
- Second item

Closing paragraph.
```

Marked preserves the authored Markdown structure, including paragraph breaks and consecutive bullet groups. Keep related bullet items together and use normal Markdown paragraphs for labels such as `Technical writing` and `Project Management`.

An empty `description` is valid and renders no description blocks. Use it when a position has no description yet; the position metadata and skills still render normally.

Do not edit generated HTML or snapshots to change timeline content. Update the appropriate Markdown file, then rebuild and let the output checks identify any expected snapshot changes. Preserve `sortOrder` so companies remain most-recent first. Do not add `dateRange` or `duration` to frontmatter; both are derived at build time using inclusive LinkedIn-style month counting (`yr`, `yrs`, and `mos`).

## Links

`companyWebsite` controls the hyperlink on the company heading. It should contain the canonical company URL in frontmatter, for example:

```toml
companyWebsite = "https://www.netlify.com"
```

Inline Markdown links are rendered as links. For example:

```markdown
See the [Netlify docs](https://docs.netlify.com/).
```

Do not add raw HTML when Markdown expresses the content; the builder renders trusted Markdown output through the static template.

Use `##` only for position sections. Avoid `###` headings inside descriptions because the table of contents scans levels 2 and 3 on the career page and would include those headings as navigation entries.

## Validation

After editing the timeline data, run:

```bash
npm test
npm run build
```

For a quick content check, open `/career.html` in the development server and verify:

- company headings and links are correct;
- paragraph and list order matches the source;
- dates, locations, employment types, and skills are present;
- Markdown links and emphasis render correctly;
- paragraph and list boundaries are visible;
- empty descriptions render no description block.

## Future Direction

The migration to `source/site/content/career/` is complete. The former `public/data/experience-data.json` authoring source has been removed, avoiding the ambiguity of storing authoring input in a public output directory.

```text
source/site/content/career/
  mongodb.md
  netlify.md
  3m.md
```

The career loader reuses the existing frontmatter and Markdown renderer infrastructure for a second content type rather than introducing a parallel blog pipeline. The completed migration included:

1. A validated schema for company, ordering, and position metadata.
2. Markdown parsing for descriptions and inline links through the existing renderer.
3. A migration of all existing timeline entries while preserving company and position order.
4. Removal of the unused, unregistered `home-highlights` runtime component and the old JSON source.
5. Updated parser, build-output tests, and authoring documentation.

## Handoff

Edit the appropriate file under `source/site/content/career/`, keep frontmatter position metadata aligned with the `## Position` sections, and preserve `sortOrder`. Validate with `npm test` and `npm run build`. The career-content tests cover ordering, Markdown rendering, empty descriptions, derived dates, and metadata/section mismatches.
