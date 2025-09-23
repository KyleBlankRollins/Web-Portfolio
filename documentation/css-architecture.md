# CSS Architecture Documentation

## Overview

This document outlines the CSS architecture strategy for the KBR Portfolio site, including how we handle Shadow DOM constraints with Lit Element components, typography systems, and development server CSS management.

## Architecture Philosophy

The site uses a **hybrid CSS architecture** that combines:

- Global styles for document-level layout and theming
- Embedded component styles using Lit's `css` tagged template literals
- A centralized design token system for consistency
- Strategic use of programmatic style injection for components that manipulate external DOM

## File Structure

```
public/
├── data/
│   └── experience-data.json    # Career timeline data (served at /data/)
├── styles/                     # Static CSS files copied during build
├── components/                 # Legacy component CSS (if any remain)
└── fonts/                      # Web fonts and typography assets

source/site/styles/
├── theme.css                    # Design tokens and CSS custom properties
├── typography.css               # Font-face declarations and global typography
├── style.css                    # Global layout, base styles, and utilities
├── blog-post.css               # Blog post specific styles
└── index.css                   # Entry point that imports other styles

source/site/components/
├── navigation.ts               # Lit component with embedded CSS
├── post-list.ts               # Lit component with embedded CSS
├── post-card.ts               # Lit component with embedded CSS
├── tag-filter.ts              # Lit component with embedded CSS
├── table-of-contents.ts       # Lit component with embedded CSS
├── anchor-copy.ts             # Lit component with programmatic style injection
├── timeline.ts                # Lit component with embedded CSS
└── timeline-entry.ts          # Lit component with embedded CSS
```

**Note**: Data files are now properly located in the `public/` directory for static asset serving, separate from source code.

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

**Component Integration**: Fonts defined here are inherited by Lit components through CSS custom properties.

### 3. Global Layout Layer (`style.css`)

**Purpose**: Base layout, utilities, and document-level components

**Contains**:

- CSS reset and base styles
- Layout utilities (grid, flexbox, container queries)
- Card components
- Navigation styling
- Responsive design rules
- Performance optimizations (content-visibility)

### 4. Component Style Layer (Lit Embedded CSS)

**Purpose**: Component-specific styling embedded within Lit components

**Architecture Pattern**:
Each Lit component includes its styles using the `css` tagged template literal:

```typescript
import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("my-component")
export class MyComponent extends LitElement {
  static styles = css`
    :host {
      display: block;
      color: var(--color-text);
    }

    .component-element {
      background: var(--color-background);
      padding: var(--space-md);
    }
  `;

  render() {
    return html`<div class="component-element">Content</div>`;
  }
}
```

## Lit Element Shadow DOM Strategy

### The Lit Advantage

Lit Element provides an elegant solution for Shadow DOM styling challenges:

- **Embedded CSS**: Styles are defined using the `css` tagged template literal within the component
- **Automatic Scoping**: Shadow DOM isolation is handled automatically
- **Design Token Access**: CSS custom properties from `:root` are accessible
- **No External Files**: Eliminates the need for separate CSS files and complex loading patterns

### Component Architecture Patterns

#### 1. Standard Lit Component

Most components use embedded CSS with design token integration:

```typescript
import { LitElement, html, css } from "lit";

@customElement("kbr-timeline")
export class KbrTimeline extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
    }

    .timeline-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .timeline-title {
      font-size: 2.5rem;
      color: var(--color-text);
      font-family: var(--font-family-heading);
    }

    /* All component styles embedded here */
  `;

  render() {
    return html`
      <div class="timeline-header">
        <h2 class="timeline-title">Career Timeline</h2>
      </div>
    `;
  }
}
```

#### 2. External DOM Manipulation Components

Components like `anchor-copy` that need to style elements outside their Shadow DOM use programmatic style injection:

```typescript
@customElement("kbr-anchor-copy")
export class KbrAnchorCopy extends LitElement {
  static styles = css`
    :host {
      display: contents; /* Component itself is invisible */
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.injectGlobalStyles();
  }

  private injectGlobalStyles(): void {
    const styleId = "kbr-anchor-copy-styles";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      /* Styles for elements outside Shadow DOM */
      .anchor-highlighted {
        background-color: var(--color-shadow);
        border-left: 4px solid var(--color-accent);
      }
    `;
    document.head.appendChild(style);
  }
}
```

### Design Token Integration

#### How CSS Custom Properties Work with Lit

CSS custom properties defined in `:root` are automatically accessible within Lit component Shadow DOM:

```css
/* In theme.css - available globally */
:root {
  --color-primary: #2d2d2d;
  --color-background: #ffffff;
  --font-family-base: "valkyrie_b", sans-serif;
  --space-md: 1.5rem;
}
```

```typescript
// In Lit component - can access global tokens
static styles = css`
  :host {
    color: var(--color-primary);
    background: var(--color-background);
    font-family: var(--font-family-base);
    padding: var(--space-md);
  }
`;
```

#### Font Inheritance Strategy

1. **Global Fonts**: Defined in `typography.css` with `@font-face` declarations
2. **Component Access**: Fonts are inherited through CSS custom properties
3. **Fallback Fonts**: Always include system font fallbacks

```css
/* Global typography.css */
:root {
  --font-family-base: "valkyrie_b", system-ui, sans-serif;
  --font-family-heading: "valkyrie_b_caps", system-ui, sans-serif;
}

/* Component styles */
static styles = css`
  h1 {
    font-family: var(--font-family-heading);
  }

  p {
    font-family: var(--font-family-base);
  }
`;
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

### 1. Lit CSS Benefits

- **Build-time Optimization**: Lit's `css` tagged template literals are optimized during build
- **No Network Requests**: Embedded CSS eliminates separate HTTP requests for component styles
- **Tree Shaking**: Unused CSS within components can be eliminated
- **Shadow DOM Scoping**: Automatic style encapsulation prevents style conflicts

### 2. Bundle Optimization

- **Component Bundling**: CSS is bundled with component JavaScript
- **Minification**: CSS within `css` template literals is compressed during build
- **Caching**: Component code and styles are cached together as single modules

### 3. Runtime Performance

- **No External Style Loading**: Components render immediately with embedded styles
- **CSS Custom Properties**: Efficient theming through CSS variables
- **Container Queries**: Component-level responsive design without global media queries

## Best Practices

### 1. Lit Component Styling

```typescript
@customElement("my-component")
export class MyComponent extends LitElement {
  static styles = css`
    /* Always start with :host styles */
    :host {
      display: block;
      container-type: inline-size;
    }

    /* Use design tokens with fallbacks */
    .component-element {
      color: var(--color-text, #212121);
      background: var(--color-background, #ffffff);
      font-family: var(--font-family-base, system-ui, sans-serif);
    }

    /* Scope all styles to avoid conflicts */
    .header {
      font-size: var(--font-size-lg);
    }

    /* Use container queries for responsive components */
    @container (max-width: 768px) {
      .header {
        font-size: var(--font-size-base);
      }
    }
  `;
}
```

### 2. Typography in Components

```typescript
static styles = css`
  /* Inherit fonts from global context */
  h1, h2, h3 {
    font-family: var(--font-family-heading);
    font-weight: var(--font-weight-bold, 700);
  }

  p, span, div {
    font-family: var(--font-family-base);
    line-height: var(--line-height-base, 1.5);
  }

  /* Use consistent typography scale */
  .title {
    font-size: var(--font-size-xl);
  }

  .body {
    font-size: var(--font-size-base);
  }
`;
```

### 3. Design Token Usage

```typescript
static styles = css`
  /* Always provide fallback values */
  .element {
    color: var(--color-primary, #2d2d2d);
    background: var(--color-background, #ffffff);
    padding: var(--space-md, 1.5rem);
  }

  /* Use semantic tokens when available */
  .error {
    color: var(--color-error, #e53e3e);
    background: var(--color-error-background, #fed7d7);
  }

  /* Leverage inheritance for consistency */
  .themed-content {
    color: var(--color-text); /* No fallback needed for inherited properties */
  }
`;
```

## Common Patterns

### 1. Loading States

```typescript
static styles = css`
  .loading {
    color: var(--color-text-muted, #718096);
    text-align: center;
    font-style: italic;
    animation: pulse 2s ease-in-out infinite alternate;
  }

  @keyframes pulse {
    0% { opacity: 0.6; }
    100% { opacity: 1; }
  }
`;
```

### 2. Error States

```typescript
static styles = css`
  .error {
    color: var(--color-error, #e53e3e);
    background: var(--color-error-background, #fed7d7);
    border: 1px solid var(--color-error-border, #feb2b2);
    padding: var(--space-md);
    border-radius: var(--border-radius, 4px);
    text-align: center;
    font-weight: 500;
  }
`;
```

### 3. Responsive Components

```typescript
static styles = css`
  :host {
    container-type: inline-size;
  }

  .component-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-lg);
  }

  /* Use container queries for component-level responsiveness */
  @container (max-width: 768px) {
    .component-grid {
      grid-template-columns: 1fr;
      gap: var(--space-md);
    }
  }
`;
```

### 4. Interactive Elements

```typescript
static styles = css`
  .button {
    background: var(--color-primary);
    color: var(--color-background);
    border: none;
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: var(--transition-normal, 0.2s ease);
  }

  .button:hover {
    background: var(--color-primary-dark);
    transform: translateY(-1px);
  }

  .button:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
`;
```

## Troubleshooting

### Styles Not Applying in Components

**Problem**: CSS styles defined in `static styles` not applying to component elements
**Solution**: Ensure styles are defined using the `css` tagged template literal, not regular strings

```typescript
// ❌ Incorrect
static styles = `
  .element { color: red; }
`;

// ✅ Correct
static styles = css`
  .element { color: red; }
`;
```

### Design Tokens Not Working

**Problem**: CSS custom properties not accessible in component Shadow DOM
**Solution**: Verify tokens are defined in `:root` in global CSS files (not in Shadow DOM contexts)

```css
/* ✅ Correct - in global theme.css */
:root {
  --color-primary: #2d2d2d;
}

/* ❌ Incorrect - in component Shadow DOM */
:host {
  --color-primary: #2d2d2d; /* Only accessible to this component */
}
```

### Font Loading Issues

**Problem**: Custom fonts not displaying in components
**Solution**: Ensure fonts are defined globally and referenced through CSS custom properties

```css
/* Global typography.css */
:root {
  --font-family-base: "valkyrie_b", system-ui, sans-serif;
}

/* Component */
static styles = css`
  :host {
    font-family: var(--font-family-base);
  }
`;
```

### External DOM Styling

**Problem**: Need to style elements outside the component's Shadow DOM
**Solution**: Use programmatic style injection like the `anchor-copy` component

```typescript
private injectGlobalStyles(): void {
  const styleId = 'my-component-global-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `/* Global styles */`;
  document.head.appendChild(style);
}
```

## Migration Notes

### From External CSS to Lit Embedded Styles

When migrating components from external CSS files to Lit embedded styles:

1. **Convert CSS to `css` tagged template literal**:

   ```typescript
   // Old approach
   this.shadowRoot.innerHTML = `
     <link rel="stylesheet" href="/components/my-component.css">
   `;

   // New approach
   static styles = css`
     /* All component styles here */
   `;
   ```

2. **Update design token references**:

   - All `var(--token-name)` references work the same way
   - Add fallback values for better resilience
   - Remove any `@import` statements (not needed)

3. **Remove external CSS files**:

   - Delete the corresponding `.css` file
   - Remove any imports from global CSS files
   - Update component documentation

4. **Test component functionality**:
   - Verify all styles apply correctly
   - Check responsive design with container queries
   - Ensure design tokens work as expected

### When Adding New Components

1. Create TypeScript file with Lit component class
2. Define styles using `static styles = css\`...\``
3. Use design tokens from global `theme.css`
4. Import component in `main.ts`
5. No separate CSS files needed

### Benefits of Migration

- **Simplified Architecture**: No external CSS files to manage
- **Better Performance**: No additional HTTP requests for styles
- **Improved Developer Experience**: Styles and logic in one file
- **Automatic Scoping**: Shadow DOM isolation built-in
- **Better Tree Shaking**: Unused styles can be eliminated

This architecture provides a modern, maintainable CSS system that leverages Lit Element's strengths while maintaining design consistency and performance optimization.
