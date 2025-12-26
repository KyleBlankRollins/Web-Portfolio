## Approach

Add an **optional** series name and part number to the frontmatter structure. The total number of posts in a series is dynamically calculated by the component from `blog-manifest.json`.

**Post with series:**

```yaml
---
title: "Intentional Work Patterns: Part 1 - Boundaries"
description: "..."
date: "2025-12-26"
tags: ["productivity", "work"]
series:
  name: "Intentional Work Patterns"
  part: 1
---
```

**Post without series (most posts):**

```yaml
---
title: "Regular Blog Post"
description: "..."
date: "2025-12-26"
tags: ["productivity"]
# No series field - this is completely optional
---
```

**Why this structure?**

- **Series is optional**: Most posts won't be part of a series, so only add when needed
- **Series name**: Groups posts together when present
- **Part number**: Enables "previous/next" navigation and explicit ordering
- **No total field**: Component calculates total dynamically from manifest (prevents manual updates and inconsistencies)

## Implementation Plan

### 1. **Update TypeScript Interfaces**

Add series support to `TemplateVariables` and `BlogPostManifestEntry`:

```typescript
// In template-processor.ts
export interface SeriesInfo {
  name: string;
  part: number;
  // Note: total is NOT stored in frontmatter
  // Component calculates it dynamically from blog-manifest.json
}

export interface TemplateVariables {
  // ...existing fields
  series?: SeriesInfo;
}

// In markdown-processor.ts
export interface BlogPostManifestEntry {
  // ...existing fields
  series?: SeriesInfo;
}
```

### 2. **Update Frontmatter Parser**

Extend `extractMarkdownFrontmatter()` in `template-processor.ts` to parse the optional series field.

**Requirements:**

- Series field must be completely optional - parser should handle posts without it gracefully
- When present, parse both `name` and `part` from the YAML object structure
- Add appropriate validation (e.g., part must be a positive integer)
- Pass parsed series data through to metadata for template processing

### 3. **Create `<kbr-post-series>` Component**

This component would:

- Accept `seriesName` and `currentPart` as properties (passed from template)
- Fetch `blog-manifest.json` on component initialization
- Filter posts by series name and sort by part number
- **Dynamically calculate total** from filtered results (e.g., `seriesPosts.length`)
- Display with progressive disclosure (collapsed by default, expandable)
- Show current position with visual indicator (e.g., "Part 2 of 5")
- Provide previous/next quick navigation

**Component UI:**

- **Collapsed state (default)**: Series name + "Part X of Y" + [⌄] expand button
- **Expanded state**: Series name + "Part X of Y" + prev/next navigation + full list of all parts with current highlighted
- **Visual treatment**: Use your existing card/button styles for consistency
- **Smart navigation**: Disable prev button on part 1, disable next button on last part
- **State persistence**: Does not persist - always starts collapsed on page load

**Example component logic:**

```typescript
// In component's connectedCallback or similar
const manifest = await fetch("/data/blog-manifest.json").then((r) => r.json());
const seriesPosts = manifest.posts
  .filter((post) => post.series?.name === this.seriesName)
  .sort((a, b) => (a.series?.part || 0) - (b.series?.part || 0));

const total = seriesPosts.length;
const currentIndex = seriesPosts.findIndex(
  (p) => p.series?.part === this.currentPart
);
const prevPost = currentIndex > 0 ? seriesPosts[currentIndex - 1] : null;
const nextPost =
  currentIndex < total - 1 ? seriesPosts[currentIndex + 1] : null;
```

### 4. **Update Blog Template**

Add the component in `blog-post.html` inside the sidebar (`<aside class="blog-toc-sidebar">`), above the table of contents. Pass series data via template variables:

```html
<aside class="blog-toc-sidebar">
  <div class="blog-toc-sticky-container">
    {{#series}}
    <kbr-post-series
      series-name="{{series.name}}"
      current-part="{{series.part}}"
    >
    </kbr-post-series>
    {{/series}}
    <kbr-table-of-contents></kbr-table-of-contents>
    {{#tagsHtml}} {{{tagsHtml}}} {{/tagsHtml}}
  </div>
</aside>
```

The conditional `{{#series}}...{{/series}}` ensures the component only appears on posts that are part of a series.

### 5. **Update Manifest Generation**

Ensure series data flows from frontmatter → HTML metadata comments → `blog-manifest.json`.

**HTML Metadata Comments:**
When a post has series data, add these comments (similar to existing metadata):

```html
<!-- series.name: Intentional Work Patterns -->
<!-- series.part: 1 -->
```

The manifest should include the `series` object **only for posts that have it**.

**Example manifest entry with series:**

```json
{
  "title": "Intentional Work Patterns: Part 1 - Boundaries",
  "description": "...",
  "date": "2025-12-26",
  "tags": ["productivity", "work"],
  "series": {
    "name": "Intentional Work Patterns",
    "part": 1
  },
  "url": "/intentional-work-patterns-boundaries.html",
  "filename": "intentional-work-patterns-boundaries"
}
```

**Example manifest entry without series (most posts):**

```json
{
  "title": "Regular Blog Post",
  "description": "...",
  "date": "2025-12-26",
  "tags": ["productivity"],
  "url": "/regular-blog-post.html",
  "filename": "regular-blog-post"
}
```

### 6. **Build-Time Validation**

Validate series data during the build process with useful error messages:

**Validation rules:**

- **Part number must be positive integer**: Reject 0, negative, or non-numeric values
- **Duplicate parts**: Warn if two posts in the same series have the same part number
- **Non-sequential parts**: Log a warning (but allow) if parts skip numbers (e.g., 1, 3, 5)

**Error handling:**

- Invalid part numbers: Build error with clear message
- Duplicate parts: Build error with list of conflicting posts
- Non-sequential parts: Build warning (doesn't block build)

## Benefits of Dynamic Total Calculation

1. **No manual updates**: Adding a new part to a series automatically updates the "Part X of Y" display
2. **Single source of truth**: Part numbers only need to be set in frontmatter
3. **Prevents inconsistencies**: Can't have mismatched totals across posts
4. **Flexible series growth**: Can add parts without updating previous posts
5. **Accurate counts**: Always reflects the actual number of published posts in the series
