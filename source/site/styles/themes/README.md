# Theme System Documentation

## Overview

The KBR Portfolio theme system provides a flexible, accessible, and maintainable approach to visual theming. Built on CSS custom properties (CSS variables), the system supports multiple themes with automatic light/dark mode detection, localStorage persistence, and comprehensive accessibility features.

## Architecture

### Core Files

- **`properties.css`** - Master theme property definitions and documentation
- **`base-theme.css`** - Default grayscale theme implementation
- **`theme-canney-valley.css`** - Nature-inspired theme based on original design
- **`theme-switcher.ts`** - Web component for theme selection

### Theme Structure

Each theme follows a standardized property structure with 280+ semantic CSS custom properties:

```css
[data-theme="theme-name"] {
  /* Theme Metadata */
  --theme-name: "Display Name";
  --theme-version: "1.0.0";

  /* Primary Colors */
  --color-primary: #value;
  --color-primary-hover: #value;
  --color-primary-active: #value;
  --color-primary-subtle: #value;

  /* Secondary, Accent, Semantic Colors... */
  /* Surface, Text, Border, Shadow Colors... */
  /* Gradient Properties... */
}
```

## How the Theme System Works

### 1. Theme Property Foundation

The `properties.css` file serves as the master reference, defining all available CSS custom properties with detailed documentation:

```css
/**
 * Primary Colors - Main brand identity colors
 * Used for: Primary buttons, links, key UI elements, brand accents
 * Accessibility: Ensure WCAG AA contrast ratios (4.5:1 minimum)
 * 
 * --color-primary: Main brand color
 * --color-primary-hover: Hover state (typically darker)
 * --color-primary-active: Active/pressed state (darkest)
 * --color-primary-subtle: Background tint (very light)
 */
```

### 2. Theme Implementation

Individual themes implement these properties with their own color palettes:

```css
/* Base Theme - Professional grayscale */
[data-theme="base"] {
  --color-primary: #2d2d2d;
  --color-primary-hover: #1a1a1a;
  --color-primary-active: #000000;
  --color-primary-subtle: #f5f5f5;
}

/* Canney Valley Theme - Nature-inspired */
[data-theme="canney-valley"] {
  --color-primary: #66ab68;
  --color-primary-hover: #5a9a5c;
  --color-primary-active: #4d8850;
  --color-primary-subtle: #f0f8f0;
}
```

### 3. Light/Dark Mode Support

Each theme includes both light and dark variants:

```css
/* Light mode (default) */
[data-theme="base"] {
  --color-background: #ffffff;
  --color-text: #212529;
}

/* Dark mode */
[data-theme="base"][data-color-scheme="dark"] {
  --color-background: #0f172a;
  --color-text: #f8fafc;
}
```

### 4. Theme Application

Themes are applied via data attributes on the document root:

```html
<html data-theme="canney-valley" data-color-scheme="dark"></html>
```

This allows CSS to target specific theme and color scheme combinations.

## Theme Switcher Component

The theme switcher (`theme-switcher.ts`) provides:

### Features

- **System Preference Detection**: Automatically detects user's OS color scheme preference
- **localStorage Persistence**: Remembers user's theme choice across sessions
- **Live Theme Switching**: Changes themes without page reload
- **Accessibility**: Full keyboard navigation and screen reader support
- **Fixed Positioning**: Bottom-left corner with glass morphism design

### Usage

```html
<kbr-theme-switcher></kbr-theme-switcher>
```

### API

The component exposes these methods:

```typescript
// Get available themes
const themes = themeSwitcher.getAvailableThemes();

// Set theme programmatically
themeSwitcher.setTheme("canney-valley", "dark");

// Listen for theme changes
themeSwitcher.addEventListener("theme-changed", (event) => {
  console.log("New theme:", event.detail.theme);
  console.log("New color scheme:", event.detail.colorScheme);
});
```

## Color System

### Semantic Color Categories

#### Primary Colors

Main brand identity colors used for primary actions and key UI elements.

#### Secondary Colors

Supporting colors for secondary actions and complementary elements.

#### Accent Colors

Highlight colors for special emphasis and interactive elements.

#### Semantic Colors

Status and feedback colors with consistent meaning across themes:

- **Success**: Positive actions, confirmations, completed states
- **Warning**: Caution states, important notices, pending actions
- **Error**: Error states, destructive actions, validation failures
- **Info**: Informational content, helpful tips, neutral notices

#### Surface Colors

Background and container colors with proper contrast relationships.

#### Text Colors

Comprehensive text color system with proper contrast ratios:

- **Primary Text**: Main content text
- **Secondary Text**: Supporting information
- **Tertiary Text**: Meta information, captions
- **Inverse Text**: Text on dark backgrounds
- **Disabled Text**: Inactive or disabled content

### Accessibility Standards

All themes meet WCAG AA accessibility standards:

- **Contrast Ratios**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Color Independence**: Information never conveyed through color alone
- **High Contrast Support**: Compatible with OS high contrast modes
- **Reduced Motion**: Respects `prefers-reduced-motion` setting

## Gradient System

### Gradient Properties

Each theme defines standardized gradient properties:

```css
--gradient-primary: linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 50%, var(--color-accent) 100%);
--gradient-primary-light: /* Subtle transparent version */
--gradient-accent: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
--gradient-surface: linear-gradient(180deg, var(--color-surface) 0%, var(--color-surface-hover) 100%);
```

### Gradient Utility Classes

Use these classes throughout your HTML:

```html
<div class="gradient-bar">Full strength gradient</div>
<div class="gradient-bar-light">Subtle gradient</div>
<div class="gradient-accent">Accent gradient</div>
<div class="gradient-surface">Surface gradient</div>
```

The gradients automatically adapt to the active theme and color scheme.

## Usage in Components

### Lit Element Components

CSS custom properties are automatically available in Shadow DOM:

```typescript
import { LitElement, html, css } from "lit";

export class MyComponent extends LitElement {
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

    .primary-button:hover {
      background: var(--color-primary-hover);
    }
  `;
}
```

### Global CSS

Use theme properties throughout your stylesheets:

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  box-shadow: 0 2px 4px var(--color-shadow);
}

.error-message {
  background: var(--color-error-subtle);
  color: var(--color-error);
  border-left: 4px solid var(--color-error);
}
```

### Design Token Best Practices

**✅ Do:**

- Use semantic color names (`--color-primary`, `--color-error`)
- Reference properties without fallback values
- Use the standardized property naming convention
- Test themes in both light and dark modes

**❌ Don't:**

- Use fallback values: `var(--color-primary, #2d2d2d)`
- Hard-code color values in component CSS
- Create custom color properties outside the theme system
- Mix theme properties with hard-coded values

## Creating New Themes

### 1. Theme File Structure

Create a new theme file following the naming convention:

```
source/site/styles/themes/theme-my-theme.css
```

### 2. Theme Implementation

Use the base theme as a template:

```css
/* My Theme - Description */
[data-theme="my-theme"] {
  /* Theme Metadata */
  --theme-name: "My Theme Name";
  --theme-version: "1.0.0";
  --theme-author: "Your Name";

  /* Implement all required properties from properties.css */
  --color-primary: #yourcolor;
  /* ... all other properties ... */
}

/* Dark Mode Variant */
[data-theme="my-theme"][data-color-scheme="dark"] {
  /* Override properties for dark mode */
  --color-background: #darkcolor;
  --color-text: #lightcolor;
  /* ... other dark mode adjustments ... */
}
```

### 3. Register Theme

Add your theme to the theme switcher's available themes list:

```typescript
// In theme-switcher.ts
private getAvailableThemes() {
  return [
    { value: 'base', label: 'Base Grayscale' },
    { value: 'canney-valley', label: 'Canney Valley' },
    { value: 'my-theme', label: 'My Theme Name' }, // Add here
  ];
}
```

### 4. Import Theme

Include your theme CSS in the build process by importing it in your main CSS file or template.

## System Integration

### localStorage Persistence

Theme preferences are automatically saved:

```javascript
// Theme data stored in localStorage
{
  "selectedTheme": "canney-valley",
  "selectedColorScheme": "dark"
}
```

### System Preference Detection

The system automatically detects and respects OS preferences:

```css
/* CSS media query for system preference */
@media (prefers-color-scheme: dark) {
  /* Dark mode styles applied automatically */
}
```

### Theme Change Events

Listen for theme changes throughout your application:

```typescript
document.addEventListener("theme-changed", (event) => {
  const { theme, colorScheme } = event.detail;
  console.log(`Theme changed to: ${theme} (${colorScheme})`);

  // Update any theme-dependent logic
  updateChartColors(theme);
  refreshVisualization(colorScheme);
});
```

## Performance Considerations

### Efficient Theme Switching

- **CSS Custom Properties**: Leverage native browser performance
- **No Page Reload**: Themes change instantly without navigation
- **Minimal Repaints**: Only affected elements re-render
- **Cached Preferences**: localStorage prevents theme flashing

### Build Optimization

- **CSS Custom Properties**: Compile-time optimization
- **Tree Shaking**: Unused theme properties are eliminated
- **Minification**: Theme CSS is compressed in production builds

## Troubleshooting

### Common Issues

**Theme not applying:**

- Check that `data-theme` attribute is set on `<html>` element
- Verify theme CSS file is imported and loaded
- Ensure property names match properties.css exactly

**Colors not updating:**

- Confirm you're using `var(--property-name)` without fallbacks
- Check that properties are defined for both light and dark modes
- Validate CSS syntax in theme file

**Theme switcher not working:**

- Verify component is properly imported and registered
- Check browser console for JavaScript errors
- Ensure localStorage is available and accessible

**Accessibility issues:**

- Test with screen readers and keyboard navigation
- Verify color contrast meets WCAG AA standards (4.5:1 minimum)
- Check that focus indicators are visible in all themes

### Debugging Tips

1. **Inspect CSS Properties**: Use browser dev tools to check computed values
2. **Validate Theme Structure**: Compare against properties.css
3. **Test Color Schemes**: Switch between light/dark modes
4. **Check localStorage**: Verify theme persistence data
5. **Validate Accessibility**: Use accessibility audit tools

## Future Enhancements

### Planned Features

- **Additional Themes**: More built-in theme options
- **Theme Customization**: User-configurable color picker
- **Animation Themes**: Motion and transition preferences
- **High Contrast Mode**: Enhanced accessibility theme
- **Theme Preview**: Live preview before applying changes

### Extension Points

The theme system is designed for extensibility:

- **Custom Properties**: Add new semantic properties to properties.css
- **Theme Variants**: Create seasonal or event-specific themes
- **Component Themes**: Component-specific theming extensions
- **Dynamic Theming**: API-driven theme generation

This theme system provides a robust foundation for consistent, accessible, and maintainable visual design across the entire portfolio site.
