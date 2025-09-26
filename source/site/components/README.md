# Web Components

This directory contains TypeScript web components and their associated CSS files.

## Component Architecture

### External Stylesheet with Shadow DOM Approach

Each component uses:

- **TypeScript file** (`.ts`) - Contains the web component class and logic
- **CSS file** (`.css`) - Contains scoped styles for the component

### Available Components

#### Blog Components

- `post-list.ts/css` - Displays a list of blog posts with filtering
- `post-card.ts/css` - Individual blog post card
- `tag-filter.ts/css` - Tag filtering for blog posts

#### Navigation & UI

- `navigation.ts/css` - Site navigation component
- `table-of-contents.ts/css` - Auto-generated TOC for blog posts
- `anchor-copy.ts/css` - Copy-to-clipboard for heading anchors

#### Career Timeline

- `timeline.ts/css` - Main timeline component that loads and displays career data
- `timeline-entry.ts/css` - Individual job/position entry in the timeline

### Timeline Components Example

The timeline components work together to display career history:

```html
<!-- Main timeline component -->
<kbr-timeline data-url="/data/experience-data.json"></kbr-timeline>

<!-- Individual entries are created automatically -->
<kbr-timeline-entry
  company="MongoDB"
  title="Documentation Team Lead"
  skills='["Team Management", "CI/CD"]'
>
</kbr-timeline-entry>
```

## Workflow

### 1. Development

- Edit CSS files directly in `source/site/components/`
- CSS files have full access to all theme variables from `theme.css`
- Styles are scoped to the component via Shadow DOM

### 2. Styling Benefits

- ✅ **Style Encapsulation**: Shadow DOM prevents style leakage
- ✅ **Theme Integration**: Full access to CSS custom properties
- ✅ **Familiar Workflow**: Edit CSS directly in dedicated files
- ✅ **Performance**: External CSS can be cached separately

## Theme Variables Available

All CSS custom properties from `theme.css` are available:

```css
/* Colors */
--color-primary
--color-primary-dark
--color-accent
--color-background
--color-text
--color-text-muted

/* Spacing */
--space-xs, --space-sm, --space-md, --space-lg, --space-xl

/* Typography */
--font-family-base, --font-family-mono
--font-size-base, --font-size-lg, --font-size-xl, etc.

/* Layout */
--content-max-width, --content-narrow

/* Animation */
--transition-fast, --transition-normal, --transition-slow
```

## Component Structure

All components now use Lit Element with embedded styles:

```typescript
import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("my-component")
export class MyComponent extends LitElement {
  static styles = css`
    :host {
      display: block;
      /* CSS custom properties from theme.css are available */
      color: var(--color-text);
      font-family: var(--font-family-base);
    }
  `;

  render() {
    return html`
      <div class="content">
        <!-- Component template -->
      </div>
    `;
  }
}
```
