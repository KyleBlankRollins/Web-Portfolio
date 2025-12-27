# GitHub Copilot Instructions for Web-Portfolio

## Code style

Prioritize readable code over concision. Especially in the case of variable names. Variable names should be descriptive. Never use obscure one or two letter variable names unless there's a very good reason to do so.

## Project Overview

This is a modern portfolio website built with **Vite + TypeScript + Lit Element web components**, featuring a **custom static site generator (KBR Builder)** implemented as a Vite plugin. The architecture supports blog posts, HTML templating, and an isolated admin system for content management.

## Architecture: The Three-Part System

### 1. Main Site (`source/site/`)

- **Entry point**: `source/site/main.ts` - imports all components and styles
- **Pages**: Static HTML in `source/site/pages/` with metadata in HTML comments
- **Content**: Markdown blog posts in `source/site/content/` with frontmatter
- **Components**: Lit Element web components in `source/site/components/`
- **Templates**: `source/site/templates/base.html` and `blog-post.html`

### 2. KBR Builder (`source/builder/`)

A custom Vite plugin that acts as a static site generator with a modular architecture:

- **Entry point**: `source/builder/index.ts` - orchestrates all processing
- **Processors** (thin orchestrators):
  - `markdown-processor.ts` - Orchestrates markdown conversion (delegates to modules)
  - `template-processor.ts` - Orchestrates HTML templating (delegates to modules)
  - `html-bundle-processor.ts` - Production build HTML processing
  - `dev-server-middleware.ts` - Dev server routing and live reload
  - `git-aware-pipeline.ts` - Intelligent change detection for incremental builds

- **Processing Modules** (`source/builder/modules/`):
  - `html-utils.ts` - HTML escaping and manipulation utilities
  - `citation-processor.ts` - Citation parsing and footnote generation
  - `frontmatter-parser.ts` - YAML frontmatter extraction
  - `markdown-renderer.ts` - Marked.js configuration with custom renderers
  - `content-preprocessor.ts` - Content transformation before rendering
  - `blog-manifest.ts` - Blog manifest building and validation
  - `metadata-extractor.ts` - HTML comment metadata extraction
  - `template-engine.ts` - Template loading and variable substitution
  - `index.ts` - Barrel export for all modules

**Architecture Pattern**: Processors are thin orchestrators (~100-250 lines) that coordinate interactions between focused, single-responsibility modules. Each module can be tested and maintained independently.

### 3. Admin System (`source/admin/`)

Local-only blog management interface (isolated from main site):

- **Server**: Express API on port 4000 (`source/admin/server/`)
- **UI**: Vite app on port 4001 (`source/admin/ui/`)
- **Data source**: `source/site/content/__drafts/backlog.md` (single source of truth)
- Start with: `npm run admin` (runs both server and UI)

## Critical Development Workflows

### Running the Site

```bash
npm run dev              # Standard dev server (port 3000)
npm run dev:git-aware    # Only processes changed files (faster)
npm run build            # Production build to dist/
npm run build:git-aware  # Incremental production build
```

### Running the Admin System

```bash
npm run admin            # Starts both server (4000) and UI (4001)
npm run admin:server     # Server only
npm run admin:ui         # UI only
```

### Content Quality

```bash
npm run lint:prose       # Lint changed Markdown files with Vale
npm run lint:prose:all   # Lint all Markdown files
npm run lint:prose:drafts # Lint only __drafts/ folder
```

Vale uses Google Developer Documentation Style Guide. Config: `.vale.ini`

## Template System

### HTML Page Template Syntax

Pages in `source/site/pages/` use HTML comments for metadata:

```html
<!-- title: Page Title -->
<!-- description: SEO description -->
<!-- keywords: comma, separated, keywords -->
<!-- template: base.html -->

<section>Your content here</section>
```

### Template Variable Substitution

Templates in `source/site/templates/` support:

- `{{variable}}` - Escaped text (safe for text content)
- `{{{variable}}}` - Unescaped HTML (for HTML injection)
- `{{#variable}}...{{/variable}}` - Conditional sections (shown only if variable exists)

### Markdown Frontmatter

Blog posts in `source/site/content/` require YAML frontmatter:

```yaml
---
title: "Post Title"
description: "Post description"
date: "2024-01-15"
tags: ["web-dev", "typescript"]
keywords: "optional, seo, keywords"
---
```

## Web Component Conventions

All components use **Lit Element** with **Shadow DOM**:

### Component Structure

```
source/site/components/
├── component-name/
│   ├── component-name.ts       # Component logic
│   └── component-name.style.ts # Dedicated styles
```

### Naming Conventions

- **Custom element**: `kbr-component-name` (kebab-case)
- **Component file**: `component-name.ts`
- **Styles file**: `component-name.style.ts`
- **Style export**: `componentNameStyles` (camelCase + "Styles")

### Component Pattern

```typescript
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { componentNameStyles } from "./component-name.style.js";
import { typographyStyles, buttonStyles } from "../../styles/shared-styles.js";

@customElement("kbr-component-name")
export class KbrComponentName extends LitElement {
  @property({ type: String }) declare someProp: string;

  static styles = [typographyStyles, buttonStyles, componentNameStyles];

  render() {
    return html`<div>${this.someProp}</div>`;
  }
}
```

### Shared Styles

Import from `source/site/styles/shared-styles.ts`:

- `typographyStyles` - Typography utilities
- `buttonStyles` - Button components
- `layoutStyles` - Layout utilities
- `cardStyles` - Card components

### Component Registration

All components must be imported in `source/site/main.ts` to be available globally.

## CSS Architecture and Style

### No fallbacks

Never use fallback values with `var()`. Every `var()` should use a custom property that is defined in a CSS theme file. Fallback values prevent us from using theme values. If a custom property doesn't work, we need to fix that instead of relying on fallback values that are hard to debug.

If no appropriate theme file exists, ask whether you should create one.

### Color definitions and use

All CSS rules that use a color value should use a custom property that's defined in a theme file. There should never be one-off color declarations.

If no appropriate theme file exists, ask whether you should create one.

### Hybrid Approach

1. **Global styles**: `source/site/styles/` - document layout, theme tokens, typography
2. **Component styles**: Embedded in Shadow DOM via Lit's `css` tagged templates
3. **Shared modules**: `shared-styles.ts` - reusable style modules for components

### Style Files

- `theme.css` - Design tokens (colors, spacing, typography scale)
- `typography.css` - Font-face declarations
- `style.css` - Global layout and utilities
- `blog-post.css` - Blog-specific styles
- `index.css` - Entry point that imports all styles

### Theme Variables

All components have access to CSS custom properties:

```css
--color-primary, --color-background, --color-text
--space-xs, --space-sm, --space-md, --space-lg
--font-family-base, --font-family-mono
--font-size-base, --font-size-lg
--transition-fast, --transition-normal
```

## Git-Aware Building

The builder supports incremental builds via `GitAwareBuildPipeline`:

- Enable with: `GIT_AWARE=true npm run dev` or `npm run dev:git-aware`
- Only processes files changed since last commit
- Significantly faster for large blogs
- Falls back to full processing if not a git repo

## Data Flow

### Blog Post Processing

1. Markdown in `source/site/content/*.md` (with frontmatter)
2. → `MarkdownProcessor` orchestrates processing:
   - `FrontmatterParser` extracts metadata
   - `ContentPreprocessor` strips comments and preprocesses admonitions
   - `CitationProcessor` handles citations
   - `MarkdownRenderer` converts to HTML
   - `BlogManifestBuilder` adds to manifest
3. → Generated files: `public/blog-post-title.html` + `public/data/blog-manifest.json`
4. → `blog-manifest.json` consumed by `<kbr-post-list>` component
5. → Production: Files copied to `dist/`

### Admin System Data Flow

1. Blog backlog stored in `source/site/content/__drafts/backlog.md`
2. → Express server parses markdown to JSON via `backlog-parser.ts`
3. → Admin UI (Lit components) displays Kanban board
4. → Updates via API → `backlog-writer.ts` updates markdown file
5. → Markdown remains single source of truth

### Modifying the Builder

- **Adding new features**: Create a new module in `source/builder/modules/` following single-responsibility principle
- **Modifying processing logic**: Update the appropriate module, not the processor
- **Processor changes**: Only modify processors for orchestration logic
- Builder changes require TypeScript compilation: `npm run build`
- Test with `npm run dev` after changes
- Check `source/builder/README.md` for architecture details
- Each module should be independently testable

## Key Files to Reference

- `source/builder/index.ts` - Builder plugin entry point
- `source/builder/README.md` - Comprehensive builder documentation
- `source/site/README.md` - Content authoring guide
- `source/site/styles/README.md` - CSS architecture details
- `source/site/components/README.md` - Component patterns
- `documentation/admin-implementation.md` - Admin system architecture
- `vite.config.ts` - Vite configuration with builder plugin

## Common Patterns

### Adding a New Page

1. Create `source/site/pages/page-name.html`
2. Add metadata via HTML comments
3. Access at `http://localhost:3000/page-name.html`

### Creating a Blog Post

1. Create `source/site/content/post-title.md`
2. Add required frontmatter (title, description, date, tags)
3. Write content in Markdown
4. Processed automatically on dev server start

### Creating a Component

1. Create directory: `source/site/components/component-name/`
2. Add `component-name.ts` and `component-name.style.ts`
3. Import in `source/site/main.ts`
4. Use as `<kbr-component-name>` in HTML

### Modifying the Builder

- Builder changes require TypeScript compilation: `npm run build`
- Test with `npm run dev` after changes
- Check `source/builder/README.md` for architecture details

## Deployment

- **Platform**: Netlify
- **Config**: `netlify.toml`
- **Build command**: `npm run build`
- **Publish directory**: `dist/`
- Static files from `public/` are copied to `dist/` during build

## Important Constraints

- **Admin system is local-only**: Never deploy admin files to production
- **Backlog.md is authoritative**: Don't manually edit generated JSON files
- **Shadow DOM encapsulation**: Component styles don't leak; use shared styles for consistency
- **Template processing**: HTML in `pages/` is processed through `template-processor.ts`, don't expect raw HTML
- **Git-aware mode**: Only works in git repositories; falls back gracefully otherwise
