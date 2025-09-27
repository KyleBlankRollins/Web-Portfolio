# Admonition Component

A flexible admonition component for displaying informational blocks in blog posts and documentation. Supports five different types with appropriate icons and colors, and two layout modes based on whether a title is provided.

## Usage

```html
<!-- Compact layout (no title) -->
<kbr-admonition type="note">
  This is a note with **markdown** content in compact layout.
</kbr-admonition>

<!-- Header layout (with title) -->
<kbr-admonition type="warning" title="Important Warning">
  This warning has a header with the custom title.
</kbr-admonition>
```

## Properties

| Property | Type                                                       | Default     | Description                                                                           |
| -------- | ---------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------- |
| `type`   | `'note' \| 'tip' \| 'important' \| 'warning' \| 'caution'` | `'note'`    | The type of admonition, determines icon and colors                                    |
| `title`  | `string`                                                   | `undefined` | Optional title. When provided, shows header layout. When omitted, uses compact layout |

## Admonition Types

- **note** - Blue theme with document icon
- **tip** - Green theme with info circle icon
- **important** - Purple theme with warning triangle icon
- **warning** - Orange theme with warning hex icon
- **caution** - Red theme with warning hex icon

## Layout Modes

### Compact Layout

When no `title` attribute is provided, the component renders in compact mode with the icon inline with the content.

### Header Layout

When a `title` attribute is provided, the component renders with a distinct header containing the icon and title, followed by the content.

## Features

- Responsive design with theme system integration
- Supports rich markdown content via slot
- Two distinct layout modes (compact vs header)
- Proper typography spacing for nested content
- Semantic color tokens for theming
- No default titles - explicit control over header visibility
