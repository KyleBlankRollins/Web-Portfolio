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

Timeline markup is rendered by the builder from `public/data/experience-data.json`.
`static-timeline.css` provides page-level styling; the table of contents is the only client-side enhancement.

### Timeline Markup

The career page includes the `timeline-static-content.html` partial, which is
expanded by the AST renderer, and does not mount a timeline custom element.

## Workflow

### 1. Development

- Edit CSS files directly in `source/site/components/`
- CSS files have full access to all theme variables from `themes/properties.css`
- Styles are scoped to the component via Shadow DOM

### 2. Styling Benefits

- ✅ **Style Encapsulation**: Shadow DOM prevents style leakage
- ✅ **Theme Integration**: Full access to CSS custom properties
- ✅ **Familiar Workflow**: Edit CSS directly in dedicated files
- ✅ **Performance**: External CSS can be cached separately

## Theme Variables Available

All CSS custom properties from `themes/properties.css` are available:

```css
/* Colors */
--color-primary, --color-primary-hover, --color-primary-active
--color-accent
--color-background
--color-text, --color-text-secondary, --color-text-tertiary
--color-border, --color-border-strong

/* Spacing */
--space-2xs, --space-xs, --space-sm, --space-md, --space-lg, --space-xl

/* Typography */
--font-family-primary, --font-family-heading, --font-family-mono
--font-size-base, --font-size-lg, --font-size-xl, etc.

/* Layout */
--content-max-width, --content-narrow

/* Elevation */
--shadow-xs, --shadow-sm, --shadow-md, --shadow-lg, --shadow-focus

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
      /* CSS custom properties from themes/properties.css are available */
      color: var(--color-text);
      font-family: var(--font-family-primary);
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
