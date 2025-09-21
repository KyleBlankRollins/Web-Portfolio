# CSS Architecture Documentation

## Overview

This document outlines the CSS architecture strategy for the KBR Portfolio site, including how we handle Shadow DOM constraints, typography systems, and development server CSS management.

## Architecture Philosophy

The site uses a **hybrid CSS architecture** that combines:

- Global styles for document-level layout and theming
- Component-scoped styles for web components using Shadow DOM
- A centralized design token system for consistency
- Shadow DOM-compatible typography distribution

## File Structure

```
source/site/styles/
├── theme.css                    # Design tokens and CSS custom properties
├── typography.css               # Font-face declarations and global typography
├── component-typography.css     # Shadow DOM compatible typography styles
├── style.css                    # Global layout, base styles, and utilities
├── blog-post.css               # Blog post specific styles
└── index.css                   # Entry point that imports other styles

source/site/components/
├── navigation.css              # Navigation component styles
├── post-list.css              # Post list component styles
├── post-card.css              # Post card component styles
├── tag-filter.css             # Tag filter component styles
├── table-of-contents.css      # Table of contents component styles
└── anchor-copy.css            # Anchor copy functionality styles
```

## Layer Hierarchy

### 1. Design Token Layer (`theme.css`)

**Purpose**: Central source of truth for design tokens

**Contains**:

- Color system (grayscale theme with light/dark mode support)
- Typography scale and font family definitions
- Spacing system
- Layout constraints (max-widths, breakpoints)
- Animation timing values

**Key Features**:

```css
:root {
  /* Accessible Grayscale Color System */
  --color-primary: #2d2d2d;
  --color-background: #ffffff;
  --color-text: #212121;

  /* Typography */
  --font-family-base: "valkyrie_b", sans-serif;
  --font-family-heading: "valkyrie_b_caps", sans-serif;

  /* Spacing & Layout */
  --space-sm: 1rem;
  --content-max-width: 1200px;
}
```

### 2. Global Typography Layer (`typography.css`)

**Purpose**: Font loading and document-level typography

**Contains**:

- All `@font-face` declarations for Valkyrie B, IBM Plex Sans, and IBM Plex Mono
- Global typography settings for `html` and document elements
- Baseline grid typography scaling
- Font rendering optimizations

**Shadow DOM Limitation**: Cannot be directly imported into Shadow DOM due to `@font-face` declarations and global selectors.

### 3. Component Typography Layer (`component-typography.css`)

**Purpose**: Shadow DOM compatible typography styles

**Contains**:

- Heading styles (h1-h5) without global selectors
- Typography utilities (`.text-center`, `.text-muted`, etc.)
- Link styling
- Code and preformatted text styling
- Loading and error state typography

**Key Design Decision**: Excludes `@font-face` declarations and global selectors that don't work in Shadow DOM contexts.

### 4. Global Layout Layer (`style.css`)

**Purpose**: Base layout, utilities, and document-level components

**Contains**:

- CSS reset and base styles
- Layout utilities (grid, flexbox, container queries)
- Card components
- Navigation styling
- Responsive design rules
- Performance optimizations (content-visibility)

### 5. Component Style Layer

**Purpose**: Component-specific styling for web components

**Architecture Pattern**:
Each web component follows this pattern:

```typescript
// In component TypeScript file
this.shadowRoot.innerHTML = `
  <link rel="stylesheet" href="/styles/component-typography.css">
  <link rel="stylesheet" href="/components/component-name.css">
  <div class="component-container">
    <!-- Component HTML -->
  </div>
`;
```

## Shadow DOM Strategy

### The Problem

Shadow DOM creates style isolation, which prevents:

- Global styles from affecting component internals
- `@font-face` declarations from being inherited properly
- CSS custom properties work, but not when defined in imported stylesheets

### Our Solution

#### 1. Direct Link Loading

Instead of CSS `@import`, we load stylesheets as separate `<link>` tags:

```typescript
// ❌ This doesn't work reliably in Shadow DOM
`<style>@import url("../styles/typography.css");</style>`// ✅ This works consistently
`<link rel="stylesheet" href="/styles/component-typography.css">`;
```

#### 2. Typography Distribution

- **Global document**: Uses `typography.css` with full font definitions
- **Shadow DOM components**: Use `component-typography.css` without `@font-face`
- **Font inheritance**: Fonts are inherited from the global context

#### 3. Design Token Access

CSS custom properties defined in `:root` are accessible within Shadow DOM, enabling consistent theming:

```css
/* Works in both global and Shadow DOM contexts */
.component {
  color: var(--color-primary);
  background: var(--color-background);
}
```

## Development Server CSS Handling

### Vite Integration

The development server handles CSS through Vite's built-in CSS processing:

1. **Hot Module Replacement (HMR)**: CSS changes trigger immediate updates
2. **Import Resolution**: Resolves CSS imports and assets automatically
3. **PostCSS Processing**: Handles modern CSS features and browser compatibility

### Build Process

During production builds:

1. **CSS Bundling**: All global CSS is concatenated and minified
2. **Asset Hashing**: CSS files get content-based hashes for cache busting
3. **Component CSS**: Served as separate files for Shadow DOM `<link>` loading
4. **Font Loading**: Font assets are copied and paths are resolved

### KBR Builder Integration

The custom build system integrates with CSS handling:

```typescript
// In dev-server-middleware.ts
// CSS files are served with proper MIME types and HMR support
// Component CSS files are made available at /components/*.css
```

## Performance Considerations

### 1. CSS Loading Strategy

- **Critical CSS**: Inlined in HTML for above-the-fold content
- **Component CSS**: Loaded on-demand when components initialize
- **Font Loading**: Uses `font-display: swap` for better perceived performance

### 2. Bundle Optimization

- **Tree Shaking**: Unused CSS classes are removed during build
- **Minification**: CSS is compressed and optimized
- **Caching**: Content-based hashing enables long-term caching

### 3. Runtime Performance

- **CSS Custom Properties**: Used instead of CSS-in-JS for better performance
- **Content Visibility**: Applied to large content sections for rendering optimization
- **Container Queries**: Enable component-level responsive design without global media queries

## Best Practices

### 1. Component Styling

```css
/* Use :host for the component root */
:host {
  display: block;
  container-type: inline-size;
}

/* Scope all styles to component */
.component-class {
  /* styles */
}

/* Use design tokens consistently */
.component-element {
  color: var(--color-text);
  background: var(--color-background);
}
```

### 2. Typography in Components

```typescript
// Always load typography first
this.shadowRoot.innerHTML = `
  <link rel="stylesheet" href="/styles/component-typography.css">
  <link rel="stylesheet" href="/components/my-component.css">
  <!-- component content -->
`;
```

### 3. Color Usage

```css
/* Always use design tokens with fallbacks */
.element {
  color: var(--color-primary, #2d2d2d);
  background: var(--color-background, #ffffff);
}

/* Leverage CSS custom property inheritance */
.themed-component {
  color: var(--color-text); /* Inherits from :root */
}
```

## Common Patterns

### 1. Loading States

```css
.loading {
  color: var(--color-text-muted);
  text-align: center;
  font-style: italic;
}
```

### 2. Error States

```css
.error {
  color: var(--color-text-muted);
  text-align: center;
  font-weight: 500;
}
```

### 3. Responsive Components

```css
/* Use container queries for component-level responsiveness */
@container (max-width: 768px) {
  .component-grid {
    grid-template-columns: 1fr;
  }
}
```

## Troubleshooting

### Typography Not Applying in Components

**Problem**: Headings or text styling not applying in web components
**Solution**: Ensure `component-typography.css` is loaded via `<link>` tag, not `@import`

### Design Tokens Not Working

**Problem**: CSS custom properties not accessible in Shadow DOM
**Solution**: Verify tokens are defined in `:root` in `theme.css` and properly referenced

### Font Loading Issues

**Problem**: Fonts not displaying correctly in components
**Solution**: Fonts are loaded globally via `typography.css`; ensure component inherits font-family from CSS custom properties

## Migration Notes

When adding new components:

1. Create component-specific CSS file in `/components/`
2. Load `component-typography.css` via `<link>` tag
3. Use design tokens from `theme.css`
4. Follow Shadow DOM style loading pattern
5. Test typography inheritance and theming

This architecture provides a scalable, maintainable CSS system that works seamlessly with modern web components and Shadow DOM constraints while maintaining design consistency and performance.
