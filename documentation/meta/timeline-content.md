# Timeline Content

## Current Source Of Truth

The career timeline is maintained in:

```text
public/data/experience-data.json
```

The builder reads this file during the site build. It passes the parsed data through the typed view models in `source/builder/static-content.ts`, then renders the career page through:

```text
source/site/templates/partials/timeline-static-content.html
```

The rendered page is static HTML. The table of contents remains the only timeline enhancement that needs client-side behavior.

## Editing The JSON

Each company has a `company`, an optional `companyWebsite`, and a `positions` array. Each position includes structured metadata plus a `description` and optional `skills`.

Descriptions are currently stored as JSON strings. Use escaped line breaks to separate paragraphs:

```json
"description": "Opening paragraph.\\n\\nSecond paragraph."
```

Use the bullet character `•` at the beginning of a line for a list item:

```json
"description": "Context paragraph.\\n\\n• First item\\n• Second item\\n\\nClosing paragraph."
```

The builder preserves the authored order of paragraphs and consecutive bullet groups. Keep related bullet items together, and use a paragraph before or after a list when the surrounding prose needs its own block.

The JSON is currently hand-maintained. Do not edit generated HTML or snapshots to change timeline content. Update the source JSON, then rebuild and let the output checks identify any expected snapshot changes.

## Links

`companyWebsite` controls the hyperlink on the company heading. It should contain the canonical company URL, for example:

```json
"companyWebsite": "https://www.netlify.com"
```

Inline URLs inside `description` are currently rendered as escaped text. For example:

```text
See the Netlify docs (https://docs.netlify.com/).
```

There is no content reason to avoid hyperlinks, but the current timeline view model treats descriptions as plain text rather than Markdown or HTML. Do not insert raw HTML into the JSON description; it will be escaped and would make the source harder to maintain. If an inline link is important, record it as plain text for now and track the work as part of the future content-source migration.

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
- descriptions do not contain literal `\\n` sequences.

## Future Direction

JSON was useful when the timeline was fetched by browser components. The career page now renders at build time, so JSON is no longer the best authoring format.

A future cleanup can move the source of truth to Markdown files with frontmatter, for example:

```text
source/site/content/career/
  mongodb.md
  netlify.md
  3m.md
```

Frontmatter would hold company and position metadata, while Markdown would handle paragraphs, lists, emphasis, and links naturally. The builder could parse those files into the existing static timeline model and optionally emit JSON only for any remaining legacy consumer. That migration should be handled as a separate Phase 6 change so it does not mix content-format work with the current static-rendering behavior.
