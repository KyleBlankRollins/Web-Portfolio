---
title: "What Typography on KBR Looks Like"
description: "A comprehensive test of all typography styles, font weights, and text formatting used across the KBR website."
date: "2025-09-24"
tags: ["design", "typography", "testing"]
---

# What Typography on KBR Looks Like

This is a comprehensive typography test post to showcase all the different font styles, weights, and text formatting options available on the KBR website. This post demonstrates the **Valkyrie B** serif font family for body text and headings, along with **IBM Plex Mono** for code snippets.

## Heading Level 2: Font Weights and Styles

This paragraph demonstrates **regular body text** using Valkyrie B at font-weight 400. This serif font provides excellent readability and gives the site a more distinctive, editorial feel compared to typical sans-serif web fonts. It should be _highly readable_ and comfortable for extended reading sessions.

Here's some text with **bold formatting** (font-weight 700) and _italic formatting_ (font-style italic) mixed within a paragraph. You can also combine them for **_bold italic text_** to see how that renders with the Valkyrie serif family.

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

Let's test the various font weights available in Valkyrie B:

**Font Weight 400 (Regular):** This is the standard body text weight for Valkyrie B.

**Font Weight 700 (Bold):** This text is bold and should have significant visual weight in the serif style.

Note that headings use **Valkyrie B Caps**, a small-caps variant of the Valkyrie family that provides distinctive heading styling.

###### Heading Level 6: Special Typography Elements

Here are some additional typography elements:

> This is a blockquote. It might be styled differently from regular paragraph text and could use different spacing or font styling to set it apart from the main content.

Here's a paragraph with a [link to test link styling](#) embedded within the text. Links should have distinct visual treatment.

---

## Code Blocks and Preformatted Text

Here's a larger code example to test monospace typography:

```css
/* CSS using the current typography system */
.typography-test {
  font-family: "valkyrie_b", -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  font-weight: 400;
  line-height: 1.6;
  color: var(--color-text);
}

.heading-example {
  font-family: "valkyrie_b_caps", "IBM Plex Sans", serif;
  font-weight: 400; /* Valkyrie B Caps uses regular weight for headings */
}

.code-block {
  font-family: "IBM Plex Mono", "Cascadia Code", Monaco, monospace;
  font-weight: 400;
  background: var(--color-surface-secondary);
  padding: 1rem;
  border-radius: 0.5rem;
}
```

## Mixed Content Testing

This section combines multiple typography elements to test how they work together:

### Project Analysis: Font Performance

When analyzing the **performance impact** of custom fonts, several key metrics emerge:

1. **FOIT (Flash of Invisible Text):** Using `font-display: auto` for Valkyrie fonts allows optimal loading behavior
2. **FOUT (Flash of Unstyled Text):** Graceful fallback to system fonts during load
3. **CLS (Cumulative Layout Shift):** Proper font metrics and fallback selection reduce layout shifting

_Key insight:_ The **Valkyrie B** serif font family was chosen to give the site a distinctive editorial feel, while **IBM Plex Mono** provides excellent code readability. The system includes comprehensive fallbacks to system fonts.

#### Technical Implementation

The implementation uses separate font files for each family and weight:

```html
<!-- Critical font preloading would include -->
<link
  rel="preload"
  href="/fonts/valkyrie_b_regular.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
<link
  rel="preload"
  href="/fonts/valkyrie_b_caps_regular.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
<link
  rel="preload"
  href="/fonts/IBMPlexMono-Regular.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

**Benefits of this typography system:**

- **Distinctive serif character** for body text
- **Small-caps headings** for editorial hierarchy
- **Excellent code readability** with IBM Plex Mono
- **Comprehensive fallback system** to system fonts
- **Optimal file sizes** with targeted font loading

## Table Typography Test

| Element   | Font Family     | Weight | Use Case             |
| --------- | --------------- | ------ | -------------------- |
| Body Text | Valkyrie B      | 400    | Primary content      |
| Headings  | Valkyrie B Caps | 400    | Section titles       |
| Bold Text | Valkyrie B      | 700    | **Important points** |
| Italics   | Valkyrie B      | 400    | _References_         |
| Code      | IBM Plex Mono   | 400    | Technical content    |

## Final Typography Notes

This comprehensive test demonstrates:

- All six heading levels (H1-H6) using Valkyrie B Caps
- Regular and bold font weights in Valkyrie B serif
- Italic and regular font styles
- Inline code using IBM Plex Mono
- Code blocks with syntax highlighting
- Lists (ordered and unordered)
- Blockquotes and special formatting
- Links and interactive elements
- Mixed content scenarios

The typography system creates a distinctive editorial feel with serif body text, small-caps headings, and excellent code readability. The Valkyrie B font family gives the site character while maintaining excellent readability across all content types.

## Font Family Overview

**Primary Typography:**

- **Body Text:** Valkyrie B (serif) - Creates distinctive, editorial character
- **Headings:** Valkyrie B Caps (small-caps serif) - Elegant hierarchy
- **Code:** IBM Plex Mono - Superior technical readability

**Fallback System:**

- Valkyrie B → system serif → system sans-serif
- IBM Plex Mono → Cascadia Code → Monaco → system monospace

---

_This test post was updated on September 26, 2025, to reflect the current Valkyrie B + IBM Plex Mono typography system on the KBR website._
