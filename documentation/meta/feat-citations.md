# Citations and Footnotes System

## Approach

Add an **optional** citations array to the frontmatter structure. Citations are defined once in frontmatter and referenced inline using standard markdown footnote syntax `[^id]`. The system automatically generates a footnotes section at the bottom of posts that contain citations.

**Post with citations:**

```yaml
---
title: "Intentional Work Patterns: Part 1 - Boundaries"
description: "..."
date: "2025-12-26"
tags: ["productivity", "work"]
citations:
  - id: atomic-habits
    title: "Atomic Habits"
    author: "James Clear"
    url: "https://jamesclear.com/atomic-habits"
    purchaseUrl: "https://www.amazon.com/dp/0735211299"
  - id: deep-work
    title: "Deep Work"
    author: "Cal Newport"
    url: "https://calnewport.com/deep-work/"
  - id: turn-ship-around
    title: "Turn the Ship Around!"
    author: "L. David Marquet"
    purchaseUrl: "https://www.amazon.com/dp/1591846404"
---
Content with inline references[^atomic-habits]. More text[^deep-work].
```

**Post without citations (most posts):**

```yaml
---
title: "Regular Blog Post"
description: "..."
date: "2025-12-26"
tags: ["productivity"]
# No citations field - this is completely optional
---
```

**Why this structure?**

- **Citations are optional**: Most posts won't have citations, so only add when needed
- **Centralized metadata**: All citation information in one place (frontmatter)
- **Reusable references**: Same citation can be referenced multiple times in content
- **Flexible linking**: Support both web URLs and purchase links (either or both)
- **Standard markdown syntax**: Uses familiar `[^id]` footnote notation
- **Clean content**: Markdown remains readable without citation clutter

## Implementation Plan

### 1. **Update TypeScript Interfaces**

Add citation support to `TemplateVariables` and `BlogPostManifestEntry`:

```typescript
// In template-processor.ts
export interface Citation {
  id: string;
  title: string;
  author: string;
  url?: string; // Optional: link to official site or article
  purchaseUrl?: string; // Optional: link to buy the book/resource
}

export interface TemplateVariables {
  // ...existing fields
  citations?: Citation[];
  citationsHtml?: string; // Rendered HTML for citations section
}

// In markdown-processor.ts (if needed in manifest)
export interface BlogPostManifestEntry {
  // ...existing fields
  // Note: Citations don't need to be in manifest unless we want
  // to show "posts that cite X" features later
}
```

### 2. **Update Frontmatter Parser**

Extend `extractMarkdownFrontmatter()` in `template-processor.ts` to parse the optional citations array.

**Requirements:**

- Citations field must be completely optional - parser handles posts without it gracefully
- When present, parse entire array of citation objects from YAML
- Validate citation structure (id, title, and author are required; urls are optional)
- At least one URL type (url or purchaseUrl) should be present per citation
- Pass parsed citations data through to metadata for template processing

**Validation:**

- **Required fields**: id, title, author
- **At least one URL**: Each citation must have `url` and/or `purchaseUrl`
- **Unique IDs**: No duplicate citation IDs within a post
- **Valid IDs**: Citation IDs should be alphanumeric + hyphens (for use in `[^id]` syntax)

### 3. **Process Inline References**

Convert markdown footnote syntax `[^id]` to superscript anchor links during markdown processing.

**In `markdown-processor.ts`:**

1. Before converting markdown to HTML, scan content for `[^citation-id]` patterns
2. Track which citations are actually used in the content
3. Replace `[^citation-id]` with `<sup><a href="#citation-citation-id" class="citation-ref">[N]</a></sup>`
4. Number citations sequentially in order of first appearance
5. Generate citations HTML section from used citations (preserve appearance order)

**Example transformation:**

```markdown
Building habits requires intentional practice[^atomic-habits].
```

Becomes:

```html
Building habits requires intentional practice<sup
  ><a href="#citation-atomic-habits" class="citation-ref">[1]</a></sup
>.
```

**Important notes:**

- Only include citations in the footnotes section that are actually referenced in the content
- Preserve the order of first appearance for numbering (not frontmatter order)
- Warn if a `[^id]` reference doesn't match any citation in frontmatter
- Warn if a citation in frontmatter is never referenced in the content

### 4. **Create `<kbr-citations>` Component**

This component renders the footnotes section at the bottom of posts.

**Component properties:**

- `citations` - Array of citation objects (JSON string attribute)

**Component UI:**

- **Section header**: "References" or "Citations" (styled consistently with article headings)
- **List format**: Ordered list `<ol>` with each citation as a `<li id="citation-{id}">`
- **Citation format**:
  - Number (from `<ol>`)
  - Title in italics
  - "by" + Author name
  - Links: "[Website]" and/or "[Purchase]" with appropriate icons
- **Visual treatment**: Use existing typography and link styles for consistency
- **Separator**: Visual separator (horizontal rule) above the citations section

**Example rendered output:**

```html
<section class="citations">
  <h2>References</h2>
  <ol>
    <li id="citation-atomic-habits">
      <em>Atomic Habits</em> by James Clear
      <a
        href="https://jamesclear.com/atomic-habits"
        target="_blank"
        rel="noopener"
        >Website</a
      >
      <span class="separator">|</span>
      <a
        href="https://www.amazon.com/dp/0735211299"
        target="_blank"
        rel="noopener"
        >Purchase</a
      >
    </li>
    <li id="citation-deep-work">
      <em>Deep Work</em> by Cal Newport
      <a href="https://calnewport.com/deep-work/" target="_blank" rel="noopener"
        >Website</a
      >
    </li>
  </ol>
</section>
```

**Component features:**

- Smooth scroll when clicking superscript citation numbers
- Back-to-content links (optional enhancement: add ↩ arrows to return to reference)
- External link icons using existing `<kbr-icon>` component
- Responsive layout for mobile (stack links if needed)

### 5. **Update Blog Template**

Add the citations component in `blog-post.html` at the bottom of the main article content, before the closing `</article>` tag.

```html
<article class="blog-post-content">
  {{{content}}} {{#citationsHtml}}
  <div class="blog-citations-container">{{{citationsHtml}}}</div>
  {{/citationsHtml}}
</article>
```

The conditional `{{#citationsHtml}}...{{/citationsHtml}}` ensures the section only appears on posts that have citations.

**Alternative approach**: Instead of rendering HTML during markdown processing, pass citations data and let the component handle rendering:

```html
{{#citations}}
<kbr-citations citations="{{citationsJson}}"></kbr-citations>
{{/citations}}
```

Choose based on whether we want SSR (pre-rendered HTML) or client-side rendering (component-based).

### 6. **Add Styles**

Create citation-specific styles in `blog-post.css`:

```css
/* Citation inline references */
.citation-ref {
  font-weight: 600;
  text-decoration: none;
  color: var(--color-primary);
  margin-left: 0.1em;
}

.citation-ref:hover {
  text-decoration: underline;
}

/* Citations section */
.blog-citations-container {
  margin-top: var(--space-2xl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--color-border);
}

.citations h2 {
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-md);
}

.citations ol {
  padding-left: var(--space-lg);
}

.citations li {
  margin-bottom: var(--space-sm);
  line-height: 1.6;
}

.citations em {
  font-style: italic;
}

.citations .separator {
  margin: 0 var(--space-xs);
  color: var(--color-text-muted);
}

.citations a {
  color: var(--color-primary);
  text-decoration: none;
}

.citations a:hover {
  text-decoration: underline;
}
```

### 7. **Build-Time Validation**

Validate citation data during the build process with useful error messages:

**Validation rules:**

- **Required fields present**: Each citation must have `id`, `title`, and `author`
- **At least one URL**: Each citation must have `url` and/or `purchaseUrl`
- **Valid IDs**: IDs must match pattern `/^[a-z0-9-]+$/` (lowercase, numbers, hyphens only)
- **Unique IDs**: No duplicate IDs within a post's citations array
- **Referenced citations exist**: All `[^id]` references in content match a citation ID
- **Unused citations**: Warn if a citation is defined but never referenced
- **Invalid references**: Error if `[^id]` doesn't match any defined citation

**Error handling:**

- Missing required fields: Build error with citation index and missing field
- Invalid ID format: Build error with the problematic ID
- Duplicate IDs: Build error listing all duplicates
- Non-existent reference: Build error with line number and missing ID
- Unused citation: Build warning (doesn't block build)

**Example error messages:**

```
Error in post "intentional-work-patterns.md":
  Citation #2 is missing required field "author"

Error in post "intentional-work-patterns.md":
  Invalid citation ID "Atomic Habits" - must be lowercase alphanumeric with hyphens
  Suggested: "atomic-habits"

Warning in post "intentional-work-patterns.md":
  Citation "deep-work" is defined but never referenced in content
```

## Workflow Example

**1. Author defines citations in frontmatter:**

```yaml
---
title: "My Post"
citations:
  - id: atomic-habits
    title: "Atomic Habits"
    author: "James Clear"
    url: "https://jamesclear.com/atomic-habits"
---
```

**2. Author references in content:**

```markdown
Small changes compound over time[^atomic-habits].
```

**3. Build process:**

- Parser extracts citations from frontmatter
- Markdown processor finds `[^atomic-habits]` reference
- Replaces with `<sup><a href="#citation-atomic-habits">[1]</a></sup>`
- Generates citations HTML with full reference details
- Injects into template

**4. Rendered output:**

- Content shows: "Small changes compound over time¹"
- Bottom of post shows:

  **References**
  1. _Atomic Habits_ by James Clear [Website] | [Purchase]

**5. User interaction:**

- Click "¹" to scroll to full citation
- Click "Website" or "Purchase" to visit external link

## Benefits

1. **Clean markdown**: Content remains readable without cluttering inline citations
2. **DRY principle**: Define once, reference many times
3. **Rich metadata**: Store complete citation information for proper attribution
4. **Flexible linking**: Support various link types (official sites, purchase links, papers, etc.)
5. **Build-time validation**: Catch broken references before deployment
6. **Accessible**: Proper semantic HTML with anchor navigation
7. **Reusable**: Could later add "posts citing X" features using citation data

## Future Enhancements (Optional)

- **Citation types**: Add `type` field (book, article, paper, video, etc.) for different formatting
- **Publication year**: Add `year` field for academic-style citations
- **Back-to-reference links**: Add ↩ arrows after each citation to jump back to reference
- **Citation analytics**: Track most-cited sources across all posts
- **Citation index**: Generate a site-wide bibliography page
