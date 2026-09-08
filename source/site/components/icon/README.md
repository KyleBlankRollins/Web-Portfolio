# Icon Component (`kbr-icon`)

A flexible SVG icon component that bundles and renders SVG files from the `/public/assets/icons/` directory.

## Features

- **Bundled Assets**: Includes SVG content in the application bundle, with no runtime icon requests
- **CSS Integration**: Applies custom CSS classes and supports size variants
- **Error Handling**: Shows fallback icons when loading fails
- **Loading States**: Visual feedback during icon loading
- **Accessibility**: Uses `currentColor` for automatic color inheritance
- **Performance**: Processes bundled SVGs for immediate rendering

## Usage

### Basic Usage

```html
<kbr-icon name="document"></kbr-icon>
<kbr-icon name="code" classes="icon-lg"></kbr-icon>
<kbr-icon name="hierarchy" classes="text-primary icon-xl"></kbr-icon>
```

### Available Icons

The following icons are available (matching SVG files in `/public/assets/icons/`):

- `bookmark` - Bookmark/save indicator
- `checkbox_checked` - Completed checkbox
- `chevron_down` - Downward pointing chevron
- `chevron_up` - Upward pointing chevron
- `code` - Code/development symbol
- `coffee` - Coffee cup
- `compass` - Navigation compass
- `document` - Document/file icon
- `filter_circle` - Circular filter symbol
- `hierarchy` - Tree/hierarchy structure
- `info_circle` - Information indicator
- `link` - Chain link symbol
- `projector` - Theme switcher indicator
- `question_circle` - Help indicator
- `terminal` - Command line terminal
- `warning_hex` - Hexagonal warning indicator
- `warning_triangle` - Triangular warning indicator

### Size Variants

Use these CSS classes for different icon sizes:

```html
<kbr-icon name="document" classes="icon-xs"></kbr-icon>
<!-- 0.75em -->
<kbr-icon name="document" classes="icon-sm"></kbr-icon>
<!-- 0.875em -->
<kbr-icon name="document"></kbr-icon>
<!-- 1em (default) -->
<kbr-icon name="document" classes="icon-lg"></kbr-icon>
<!-- 1.25em -->
<kbr-icon name="document" classes="icon-xl"></kbr-icon>
<!-- 1.5em -->
<kbr-icon name="document" classes="icon-2xl"></kbr-icon>
<!-- 2em -->
<kbr-icon name="document" classes="icon-3xl"></kbr-icon>
<!-- 3em -->
```

### Custom Sizing

For custom sizes, use the `size` property:

```html
<kbr-icon name="document" size="24px"></kbr-icon>
<kbr-icon name="document" size="2rem"></kbr-icon>
<kbr-icon name="document" size="32px"></kbr-icon>
```

### CSS Classes Integration

The `classes` property applies CSS classes to the host element:

```html
<!-- Apply utility classes -->
<kbr-icon name="document" classes="text-primary icon-lg m-2"></kbr-icon>

<!-- Multiple classes -->
<kbr-icon name="code" classes="card-icon icon-xl text-blue-500"></kbr-icon>
```

## Properties

| Property  | Type   | Default | Description                                          |
| --------- | ------ | ------- | ---------------------------------------------------- |
| `name`    | string | `""`    | Icon name (matches SVG filename without extension)   |
| `classes` | string | `""`    | Space-separated CSS classes to apply to host element |
| `size`    | string | `""`    | Custom size override (CSS value like "24px", "2rem") |

## States

The component automatically applies state classes:

- `.loading` - Applied during SVG loading
- `.error` - Applied when loading fails or icon not found

## Implementation Example

Replace emoji icons with SVG icons:

```html
<!-- Before -->
<div class="card-icon">✍️</div>

<!-- After -->
<kbr-icon name="document" classes="card-icon icon-xl"></kbr-icon>
```

## Error Handling

When an icon fails to load:

1. **Console Warning**: Logs available icons and the attempted name
2. **Fallback Icon**: Displays a generic alert/info icon
3. **Error Class**: Adds `.error` class for custom styling
4. **Graceful Degradation**: Component remains functional

## Adding New Icons

1. **Add SVG File**: Place the SVG file in `/public/assets/icons/`
2. **Update Icon Data**: Add a raw SVG import and map entry in `icon-data.ts`
3. **Use Icon**: Reference by filename in the `name` property

### SVG Requirements

- **Use `currentColor`**: Ensures icons inherit text color
- **Proper ViewBox**: Include viewBox for scalability
- **Clean Markup**: Remove unnecessary attributes and elements
- **Consistent Style**: Use stroke or fill consistently across icons

## Technical Details

### SVG Processing

The component processes loaded SVGs to:

- Remove fixed `width` and `height` attributes
- Ensure `currentColor` usage for color inheritance
- Apply custom sizing when specified
- Optimize for Shadow DOM rendering

### Performance Considerations

- **Bundled Loading**: SVGs are available without a network request
- **Error Recovery**: Failed loads don't break the component
- **Memory Efficient**: SVG content is retained in component state after processing
- **Network Efficient**: Icon rendering does not require a request

### Browser Compatibility

- **Modern Browsers**: Full support with Shadow DOM and Web Components
- **Fallback**: Graceful degradation for older browsers
- **Accessibility**: Works with screen readers and keyboard navigation

## Examples in Context

### Navigation Cards (index.html)

```html
<a href="/blog.html" class="nav-card card">
  <div class="card-title">
    <kbr-icon name="document" classes="card-icon icon-xl"></kbr-icon>
    <h2>Blog</h2>
  </div>
  <p>Thoughts on technical writing...</p>
</a>
```

### Button Icons

```html
<button type="button">
  <kbr-icon name="chevron_down" classes="icon-sm"></kbr-icon>
  Expand Section
</button>
```

### Status Indicators

```html
<div class="status-item">
  <kbr-icon name="checkbox_checked" classes="icon-sm text-success"></kbr-icon>
  Task completed
</div>
```

This component provides a flexible, performant, and accessible way to use SVG icons throughout the application while maintaining the benefits of the Lit Element architecture.
