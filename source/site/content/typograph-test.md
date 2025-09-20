---
title: "What Typography on KBR Looks Like"
description: "A comprehensive test of all typography styles, font weights, and text formatting used across the KBR website."
date: "2025-09-20"
tags: ["design", "typography", "testing"]
---

# What Typography on KBR Looks Like

This is a comprehensive typography test post to showcase all the different font styles, weights, and text formatting options available on the KBR website. This post demonstrates the IBM Plex Sans and IBM Plex Mono font families in action.

## Heading Level 2: Font Weights and Styles

This paragraph demonstrates **regular body text** using IBM Plex Sans at font-weight 400. This is what most content on the site will look like. It should be _highly readable_ and comfortable for extended reading sessions.

Here's some text with **bold formatting** (font-weight 700) and _italic formatting_ (font-style italic) mixed within a paragraph. You can also combine them for **_bold italic text_** to see how that renders.

### Heading Level 3: Code and Monospace Text

When discussing technical topics, we often need to reference `inline code` snippets that use IBM Plex Mono. Here's how that looks within a paragraph.

For larger code blocks, we use:

```javascript
// This is a code block using IBM Plex Mono
function demonstrateTypography() {
  const fontFamily = "IBM Plex Mono";
  const weight = "400"; // Regular weight

  console.log(`Code blocks use ${fontFamily} at weight ${weight}`);
  return "Perfect for displaying code!";
}
```

#### Heading Level 4: Lists and Structure

Typography isn't just about individual letters—it's about how text flows and creates hierarchy. Here are some examples:

**Unordered Lists:**

- This is a regular list item
- _This list item has italic emphasis_
- **This list item is bold**
- This item has `inline code` within it

**Ordered Lists:**

1. First item demonstrates regular weight
2. Second item shows **bold emphasis**
3. Third item includes _italic text_
4. Fourth item has a `code snippet` embedded

##### Heading Level 5: Different Font Weights

Let's test the various font weights available in IBM Plex Sans:

**Font Weight 100 (Thin):** This text should appear very thin and light.

**Font Weight 400 (Regular):** This is the standard body text weight.

**Font Weight 500 (Medium):** This text has a medium weight, slightly heavier than regular.

**Font Weight 700 (Bold):** This text is bold and should have significant visual weight.

###### Heading Level 6: Special Typography Elements

Here are some additional typography elements:

> This is a blockquote. It might be styled differently from regular paragraph text and could use different spacing or font styling to set it apart from the main content.

Here's a paragraph with a [link to test link styling](#) embedded within the text. Links should have distinct visual treatment.

---

## Code Blocks and Preformatted Text

Here's a larger code example to test monospace typography:

```css
/* CSS using IBM Plex Mono */
.typography-test {
  font-family: "IBM Plex Sans", system-ui, sans-serif;
  font-weight: 400;
  line-height: 1.6;
  color: var(--text-primary);
}

.code-block {
  font-family: "IBM Plex Mono", monospace;
  font-weight: 400;
  background: var(--bg-code);
  padding: 1rem;
  border-radius: 0.5rem;
}
```

## Mixed Content Testing

This section combines multiple typography elements to test how they work together:

### Project Analysis: Font Performance

When analyzing the **performance impact** of custom fonts, several key metrics emerge:

1. **FOIT (Flash of Invisible Text):** Using `font-display: swap` minimizes this
2. **FOUT (Flash of Unstyled Text):** Brief appearance of system fonts before custom fonts load
3. **CLS (Cumulative Layout Shift):** Proper font metrics reduce layout shifting

_Key insight:_ The IBM Plex font family was chosen because it has excellent `font-display: swap` behavior and similar metrics to system fonts.

#### Technical Implementation

The implementation uses separate font files for each weight:

```html
<!-- Preload critical fonts -->
<link
  rel="preload"
  href="/fonts/IBMPlexSans-Regular.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
<link
  rel="preload"
  href="/fonts/IBMPlexSans-Bold.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

**Benefits of this approach:**

- Precise weight control
- No font synthesis
- Optimal file sizes
- Better rendering quality

## Table Typography Test

| Element   | Font Family   | Weight     | Use Case             |
| --------- | ------------- | ---------- | -------------------- |
| Body Text | IBM Plex Sans | 400        | Primary content      |
| Headings  | IBM Plex Sans | 700        | Section titles       |
| Code      | IBM Plex Mono | 400        | Technical content    |
| Emphasis  | IBM Plex Sans | 700        | **Important points** |
| Citations | IBM Plex Sans | 400 italic | _References_         |

## Final Typography Notes

This comprehensive test demonstrates:

- All six heading levels (H1-H6)
- Regular, medium, and bold font weights
- Italic and regular font styles
- Inline code using monospace font
- Code blocks with syntax highlighting
- Lists (ordered and unordered)
- Blockquotes and special formatting
- Links and interactive elements
- Mixed content scenarios

The typography system should create clear visual hierarchy while maintaining excellent readability across all content types.

---

_This test post was generated on September 20, 2025, to validate the complete typography system on the KBR website._
