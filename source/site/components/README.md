# Web Components

This directory contains TypeScript web components and their associated CSS files.

## Component Architecture

### External Stylesheet with Shadow DOM Approach

Each component uses:

- **TypeScript file** (`.ts`) - Contains the web component class and logic
- **CSS file** (`.css`) - Contains scoped styles for the component

### Navigation Component Example

- `navigation.ts` - The web component class
- `navigation.css` - Scoped styles with full access to theme variables

## Workflow

### 1. Development

- Edit CSS files directly in `source/site/components/`
- CSS files have full access to all theme variables from `theme.css`
- Styles are scoped to the component via Shadow DOM

### 2. Building

- Run `npm run copy-component-styles` to copy CSS files to `public/components/`
- Or the build process will automatically include files from `public/`

### 3. Styling Benefits

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

```typescript
class MyComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="/components/my-component.css">
        ${this.getHTML()}
      `;
    }
  }
}
```
