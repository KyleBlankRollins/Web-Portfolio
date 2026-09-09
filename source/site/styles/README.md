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
├── data/                       # Generated public data
├── styles/                     # Static CSS files copied during build
├── components/                 # Legacy component CSS (if any remain)
└── fonts/                      # Web fonts and typography assets

source/site/content/career/      # Career timeline Markdown source

source/site/styles/
├── theme.css                    # Design tokens and CSS custom properties
├── typography.css               # Font-face declarations and global typography
├── style.css                    # Global layout, base styles, and utilities
├── blog-post.css               # Blog post specific styles
├── shared-styles.ts            # Shared style modules for web components
└── index.css                   # Entry point that imports other styles

source/site/components/
├── README.md                   # Component documentation
├── anchor-copy.ts             # Simple component with programmatic style injection
├── navigation/
│   ├── navigation.ts          # Lit component logic
│   └── navigation.style.ts    # Dedicated component styles
├── post-card/
│   ├── post-card.ts           # Lit component logic
│   └── post-card.style.ts     # Dedicated component styles
├── post-list/
│   ├── post-list.ts           # Lit component logic
│   └── post-list.style.ts     # Dedicated component styles
├── table-of-contents/
│   ├── table-of-contents.ts   # Lit component logic
│   └── table-of-contents.style.ts # Dedicated component styles
├── tag-filter/
│   ├── tag-filter.ts          # Lit component logic
│   └── tag-filter.style.ts    # Dedicated component styles
├── timeline/
│   ├── timeline.ts            # Lit component logic
│   └── timeline.style.ts      # Dedicated component styles
└── timeline-entry/
    ├── timeline-entry.ts      # Lit component logic
    └── timeline-entry.style.ts # Dedicated component styles
```

**Note**: Data files are now properly located in the `public/` directory for static asset serving, separate from source code.

## Component Organization Conventions

### Directory Structure

Each complex component gets its own directory under `source/site/components/`:

```
source/site/components/
├── component-name/
│   ├── component-name.ts       # Component logic and template
│   └── component-name.style.ts # Component-specific styles
└── simple-component.ts         # Simple components may remain as single files
```

### File Naming Conventions

- **Component Logic**: `kebab-case-name.ts` (matches the custom element name)
- **Component Styles**: `kebab-case-name.style.ts` (same name with `.style` suffix)
- **Style Export**: Export should be `camelCaseName + 'Styles'` (e.g., `tagFilterStyles`)

### Import Patterns

- **Shared Styles**: Import from `../../styles/shared-styles.js`
- **Component Styles**: Import from `./component-name.style.js`
- **Import Order**: Shared styles first, then component styles

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

### 4. Shared Style Layer (`shared-styles.ts`)

**Purpose**: Reusable style modules that can be imported across web components

**Contains**:

- Typography system (fonts, scales, weights)
- Button styles (variants, sizes, states)
- Layout utilities (container, card, flex)

**Architecture Pattern**:
Shared styles are defined as exportable CSS modules:

```typescript
import { css } from "lit";

export const typographyStyles = css`
  :host {
    font-family: var(--font-family-primary);
    font-synthesis: none;
    text-rendering: optimizeLegibility;
  }

  .heading-h1 {
    font-size: 2.6666667rem;
    line-height: 3.8333333rem;
    font-weight: 700;
  }
`;

export const buttonStyles = css`
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-sm) var(--space-md);
    border-radius: 4px;
    font-family: inherit;
  }
`;
```

### 5. Component Style Layer (Dedicated Style Files)

**Purpose**: Component-specific styling in dedicated TypeScript files alongside component logic

**Architecture Pattern**:
Each Lit component has its styles defined in a separate `*.style.ts` file, which is then imported and combined with shared styles:

**Component Styles File** (`my-component.style.ts`):

```typescript
import { css } from "lit";

export const myComponentStyles = css`
  :host {
    display: block;
    color: var(--color-text);
  }

  .component-element {
    background: var(--color-background);
    padding: var(--space-md);
  }

  .component-header {
    border-bottom: 1px solid var(--color-border);
    margin-bottom: var(--space-lg);
  }

  /* All component-specific styles here */
`;
```

**Component Logic File** (`my-component.ts`):

```typescript
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { myComponentStyles } from "./my-component.style.js";
import { typographyStyles, buttonStyles } from "../../styles/shared-styles.js";

@customElement("my-component")
export class MyComponent extends LitElement {
  static styles = [
    typographyStyles,
    buttonStyles,
    myComponentStyles, // Component styles imported from dedicated file
  ];

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

#### 1. Complex Components with Dedicated Style Files

Most components use dedicated style files that are imported alongside shared styles:

**Component Styles** (`timeline.style.ts`):

```typescript
import { css } from "lit";

export const timelineStyles = css`
  :host {
    display: block;
    position: relative;
  }

  .timeline-header {
    text-align: center;
    margin-bottom: var(--space-xl);
  }

  .timeline-title {
    /* Uses heading scale from typographyStyles */
    color: var(--color-text);
  }

  .timeline-container {
    position: relative;
    max-width: var(--content-max-width);
    margin: 0 auto;
  }

  /* All component-specific styles defined here */
`;
```

**Component Logic** (`timeline.ts`):

```typescript
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { timelineStyles } from "./timeline-styles.js";
import {
  typographyStyles,
  buttonStyles,
  layoutStyles,
} from "../../styles/shared-styles.js";

@customElement("kbr-timeline")
export class KbrTimeline extends LitElement {
  static styles = [
    typographyStyles,
    buttonStyles,
    layoutStyles,
    timelineStyles, // Component styles from dedicated file
  ];

  render() {
    return html`
      <div class="timeline-header">
        <h2 class="timeline-title heading-h2">Career Timeline</h2>
      </div>
    `;
  }
}
```

#### 2. Simple Components with Inline Styles

Simple components like `anchor-copy` may still use inline styles when the styling is minimal:

```typescript
import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("kbr-anchor-copy")
export class KbrAnchorCopy extends LitElement {
  static styles = css`
    :host {
      display: contents; /* Component itself is invisible */
    }
  `;

  // Simple components with minimal styling don't need dedicated files
}
```

#### 3. External DOM Manipulation Components

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
    font-family: var(--font-family-primary);
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
    font-family: var(--font-family-primary);
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
// Lit components use embedded styles via static styles property
```

## Theme System

The portfolio uses a comprehensive theme system built on CSS custom properties, providing flexible theming with accessibility-first design principles.

### Architecture Overview

- **Theme Properties**: Standardized system with 280+ semantic CSS custom properties
- **Multiple Themes**: Base grayscale theme and nature-inspired Canney Valley theme
- **Light/Dark Mode**: Automatic system preference detection with manual override
- **Accessibility**: WCAG AA compliant with high contrast support
- **Persistence**: localStorage-based theme preference memory

### Key Features

```css
/* Themes use semantic property names */
[data-theme="base"] {
  --color-primary: #2d2d2d;
  --color-text: #212529;
  --color-background: #ffffff;
}

/* Automatic dark mode variants */
[data-theme="base"][data-color-scheme="dark"] {
  --color-primary: #e2e8f0;
  --color-text: #f8fafc;
  --color-background: #0f172a;
}
```

### Component Integration

Lit Element components automatically inherit theme properties:

```typescript
static styles = css`
  :host {
    background: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);
  }

  .primary-button {
    background: var(--color-primary);
    color: var(--color-text-inverse);
  }
`;
```

### Theme Switcher Component

The `<kbr-theme-switcher>` component provides:

- Fixed bottom-left positioning with glass morphism design
- System preference detection and localStorage persistence
- Accessible keyboard navigation and screen reader support
- Live theme switching without page reload

### Detailed Documentation

For comprehensive theming documentation, see: **[Theme System README](./themes/README.md)**

## Design Token Philosophy

### No Fallback Values in CSS Custom Properties

**Critical Rule**: CSS custom properties (design tokens) should **never** include fallback values in `var()` functions.

**Why No Fallbacks**:

- Fallbacks bypass the design token system
- They hide missing or incorrect token definitions
- They create inconsistency in the design system
- They make debugging token issues more difficult

**Correct Approach**:

```css
/* ✅ Correct - No fallback values */
.element {
  color: var(--color-primary);
  background: var(--color-background);
  padding: var(--space-md);
  font-family: var(--font-family-primary);
}
```

**Incorrect Approach**:

```css
/* ❌ Incorrect - Fallback values bypass design system */
.element {
  color: var(--color-primary, #2d2d2d);
  background: var(--color-background, #ffffff);
  padding: var(--space-md, 1.5rem);
  font-family: var(--font-family-primary, sans-serif);
}
```

**Exception**: Fallbacks are acceptable only for progressive enhancement or experimental features:

```css
/* ✅ Acceptable - Feature detection */
.element {
  background: var(--color-background);
  backdrop-filter: var(--glass-blur, none); /* Experimental feature */
}
```

**Problem Resolution Strategy**:
If a CSS custom property doesn't resolve:

1. **Check Token Definition**: Ensure the token is defined in `theme.css`
2. **Verify Token Name**: Check for typos in the property name
3. **Validate Inheritance**: Ensure tokens are defined in `:root` scope
4. **Fix the Root Cause**: Don't mask the issue with fallbacks

This approach ensures design system integrity and makes token-related issues immediately visible during development.

## Performance Considerations

### 1. Shared Styles Benefits

- **Single Source of Truth**: Styles defined once in `shared-styles.ts`, reused across components
- **Build-time Optimization**: Lit's `css` tagged template literals are optimized during build
- **No Network Requests**: Embedded CSS eliminates separate HTTP requests for component styles
- **Tree Shaking**: Unused styles can be eliminated at the module level
- **Shadow DOM Scoping**: Automatic style encapsulation prevents style conflicts
- **Type Safety**: TypeScript ensures correct imports and usage patterns

### 2. Bundle Optimization

- **Component Bundling**: CSS is bundled with component JavaScript
- **Minification**: CSS within `css` template literals is compressed during build
- **Caching**: Component code and styles are cached together as single modules

### 3. Runtime Performance

- **No External Style Loading**: Components render immediately with embedded styles
- **CSS Custom Properties**: Efficient theming through CSS variables
- **Container Queries**: Component-level responsive design without global media queries

## Best Practices

### 1. Dedicated Component Style Files Pattern

**Component Styles File** (`my-component.style.ts`):

```typescript
import { css } from "lit";

export const myComponentStyles = css`
  /* Always start with :host styles */
  :host {
    display: block;
    container-type: inline-size;
  }

  /* Use design tokens WITHOUT fallbacks */
  .component-element {
    color: var(--color-text);
    background: var(--color-background);
    font-family: var(--font-family-primary);
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

  /* All component-specific styles organized here */
  .content-section {
    padding: var(--space-lg);
    border-radius: var(--radius);
  }
`;
```

**Component Logic File** (`my-component.ts`):

```typescript
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { myComponentStyles } from "./my-component-styles.js";
import {
  typographyStyles,
  buttonStyles,
  layoutStyles,
} from "../../styles/shared-styles.js";

@customElement("my-component")
export class MyComponent extends LitElement {
  static styles = [
    typographyStyles,
    buttonStyles,
    layoutStyles,
    myComponentStyles, // Import dedicated component styles
  ];

  render() {
    return html`
      <div class="component-element">
        <header class="header">Component Title</header>
        <section class="content-section">Content</section>
      </div>
    `;
  }
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
    font-family: var(--font-family-primary);
    line-height: var(--line-height-normal, 1.5);
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
static styles = [
  typographyStyles, // Import shared typography
  css`
    /* Never provide fallback values */
    .element {
      color: var(--color-primary);
      background: var(--color-background);
      padding: var(--space-md);
    }

    /* Use semantic tokens consistently */
    .error {
      color: var(--color-error);
      background: var(--color-error-subtle);
    }

    /* Leverage shared typography classes */
    .title {
      /* Use typography class instead of custom styles */
    }

    .content {
      color: var(--color-text);
    }
  `
];
```

## Common Patterns

### 1. Loading States

```typescript
static styles = css`
  .loading {
    color: var(--color-text-secondary, #718096);
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
    background: var(--color-error-subtle, #fed7d7);
    border: 1px solid var(--color-error, #feb2b2);
    padding: var(--space-md);
    border-radius: var(--radius, 4px);
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
    border-radius: var(--radius);
    cursor: pointer;
    transition: var(--transition-normal, 0.2s ease);
  }

  .button:hover {
    background: var(--color-primary-hover);
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

### Missing Shared Styles

**Problem**: Typography or button styles not applying in components
**Solution**: Ensure shared style modules are imported and included in the styles array

```typescript
// ❌ Incorrect - missing shared styles import
import { LitElement, html } from "lit";
import { componentStyles } from "./component-styles.js";

static styles = [componentStyles]; // Missing shared styles

// ✅ Correct - import and use shared styles
import { typographyStyles, buttonStyles } from "../../styles/shared-styles.js";
import { componentStyles } from "./component-styles.js";

static styles = [
  typographyStyles,
  buttonStyles,
  componentStyles, // Component styles come after shared styles
];
```

### Incorrect Style File Import Path

**Problem**: Component styles not loading or build errors about missing files
**Solution**: Ensure correct relative path to component style file

```typescript
// ❌ Incorrect - wrong import path
import { componentStyles } from "../component-styles.js"; // Looking in parent directory

// ✅ Correct - import from same directory
import { componentStyles } from "./component-styles.js"; // Same directory as component
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
    font-family: var(--font-family-primary);
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

### From External CSS to Shared Styles Architecture

When migrating components to the new shared styles system:

1. **Import shared style modules**:

   ```typescript
   // New approach with shared styles
   import { typographyStyles, buttonStyles, layoutStyles } from "../styles/shared-styles.js";

   static styles = [
     typographyStyles,
     buttonStyles,
     layoutStyles,
     css`/* Component-specific styles only */`
   ];
   ```

2. **Remove duplicate styles**:
   - Delete typography definitions (use shared `typographyStyles`)
   - Remove button styles (use shared `buttonStyles`)
   - Remove layout utilities (use shared `layoutStyles`)
   - Keep only component-specific styles in the `css` template

3. **Update design token references**:
   - Remove ALL fallback values from `var()` functions
   - Ensure tokens are properly defined in `theme.css`
   - Use shared typography classes instead of custom font styles

4. **Remove external CSS files**:
   - Delete the corresponding `.css` file
   - Remove any imports from global CSS files
   - Update component documentation

5. **Test component functionality**:
   - Verify all styles apply correctly
   - Check that shared styles work as expected
   - Ensure no fallback values are being used
   - Test responsive design with container queries

### When Adding New Components

1. **Create component directory**: `source/site/components/my-component/`
2. **Create component styles file**: `my-component.style.ts` with exported `css` template
3. **Create component logic file**: `my-component.ts` with Lit component class
4. **Import styles**: Import both shared styles and component styles
5. **Use design tokens**: Reference tokens from global `theme.css` WITHOUT fallbacks
6. **Register component**: Import component in `main.ts`
7. **Follow file structure**: Keep related files organized in component directory

### Benefits of Dedicated Component Style Files

- **Separation of Concerns**: Component logic and styling are cleanly separated
- **Better Code Organization**: Related files are grouped in component directories
- **Enhanced Readability**: Component files focus on logic without style clutter
- **Easier Maintenance**: Styles can be updated independently from component logic
- **Improved Collaboration**: Developers can work on styles and logic separately
- **Better IDE Support**: Syntax highlighting and IntelliSense work better in dedicated files
- **Reusability**: Style files could potentially be shared between similar components
- **Cleaner Diffs**: Changes to styles and logic show up in separate files

### Benefits of Shared Styles Architecture

- **Design Consistency**: All components use the same typography, buttons, and layouts
- **DRY Principle**: Styles defined once, reused everywhere
- **Easy Maintenance**: Update shared styles to change all components
- **Better Performance**: Shared styles are bundled efficiently
- **Type Safety**: TypeScript ensures correct style imports
- **Improved Developer Experience**: Less code duplication
- **Automatic Scoping**: Shadow DOM isolation built-in
- **Better Tree Shaking**: Unused style modules can be eliminated

### Combined Architecture Benefits

This architecture provides a modern, maintainable CSS system that leverages Lit Element's strengths while maintaining design consistency and performance optimization. The combination of shared styles for consistency and dedicated component style files for organization creates an optimal developer experience and maintainable codebase.
