# KBR Builder - Custom Vite Plugin

## Overview

The KBR Builder is a comprehensive custom Vite plugin designed specifically for the Kyle Blank Rollins portfolio site. It provides advanced HTML templating, Markdown processing, blog generation, and development server enhancements that extend Vite's capabilities to meet the specific needs of a static site generator with dynamic content processing.

## Architecture

The builder is implemented as a modular Vite plugin with the following core components:

```
source/builder/
├── index.ts                    # Main plugin entry point and orchestration
├── dev-server-middleware.ts    # Development server routing and live processing
├── markdown-processor.ts       # Markdown to HTML conversion and blog manifest
├── template-processor.ts       # HTML templating engine with variable substitution
├── html-bundle-processor.ts    # Production build HTML processing
├── html-utils.ts              # Shared HTML processing utilities
├── helpers.ts                  # File system utilities and logging
└── types.ts                   # TypeScript type definitions
```

## Core Features

### 1. HTML Templating System

**Purpose**: Process HTML pages with includes, variable substitution, and template inheritance

**Key Capabilities**:

- Template-based page generation with variable substitution
- HTML includes for component reusability
- Metadata extraction from HTML comments and attributes
- Automatic title and description generation
- Support for nested templates and partials

**Templates Directory**: `source/site/templates/`

- `base.html` - Base layout template
- `blog-post.html` - Blog post specific template
- Additional templates as needed

**Variable Substitution**:

````html
**Template Syntax**: The system supports three types of template
syntax: 1. **Escaped Variables**: `{{variable}}` - HTML-escaped
content (safe for text) 2. **Unescaped Variables**: `{{{variable}}}` -
Raw HTML content (for HTML injection) 3. **Conditional Sections**:
`{{#variable}}...{{/variable}}` - Show content only if variable exists
```html
<!-- In template files -->
<title>{{title}}</title>
{{#description}}
<meta name="description" content="{{description}}" />
{{/description}} {{#keywords}}
<meta name="keywords" content="{{keywords}}" />
{{/keywords}}
<main>{{{content}}}</main>
````

````

### 2. Markdown Processing

**Purpose**: Convert Markdown files to HTML with frontmatter support and blog manifest generation

**Key Capabilities**:

- GitHub Flavored Markdown (GFM) support
- Frontmatter parsing for metadata (title, date, tags, description)
- Automatic heading ID generation for anchor links
- Blog post manifest generation with tag aggregation
- Draft post exclusion from production builds

**Frontmatter Format**:

```yaml
---
title: "Blog Post Title"
description: "Post description for SEO"
date: "2024-01-15"
tags: ["web-dev", "typescript", "vite"]
keywords: "optional, seo, keywords"
---
# Your Markdown Content Here
````

**Output Locations**:

- Processed HTML: `source/site/content/` → `dist/`
- Blog Manifest: `public/data/blog-manifest.json`

### 3. Development Server Enhancements

**Purpose**: Provide live reloading and processing during development

**Key Features**:

- **Route Processing**: Automatically process `.html` files through templates
- **Markdown Live Processing**: Real-time Markdown to HTML conversion
- **Template Hot Reloading**: Changes to templates trigger full page reload
- **Directory Blocking**: Prevent direct access to `/pages/` and `/content/` directories
- **Cache Management**: Intelligent template cache invalidation

**Live Processing Workflow**:

1. Request for `/example.html` received
2. Check for `source/site/pages/example.html`
3. Process through template system with variable substitution
4. Serve processed HTML with proper headers
5. Cache results for performance

### 4. Production Build Processing

**Purpose**: Generate optimized static files for production deployment

**Build Process**:

1. **Markdown Processing**: Convert all `.md` files to `.html`
2. **Asset Discovery**: Extract CSS and JS files from Vite bundle
3. **HTML Processing**: Process all HTML files through template system
4. **Asset Injection**: Automatically inject discovered assets into templates
5. **Bundle Generation**: Output final static files to `dist/`

### 5. Blog System

**Purpose**: Automated blog post management with tag filtering and manifest generation

**Blog Manifest Structure**:

```json
{
  "posts": [
    {
      "title": "Post Title",
      "description": "Post description",
      "date": "2024-01-15",
      "formattedDate": "January 15, 2024",
      "tags": ["web-dev", "typescript"],
      "url": "/blog-post-title.html",
      "filename": "blog-post-title.html"
    }
  ],
  "totalPosts": 1,
  "availableTags": ["web-dev", "typescript"],
  "tagsWithCounts": [
    { "tag": "web-dev", "count": 1 },
    { "tag": "typescript", "count": 1 }
  ],
  "generatedAt": "2024-01-15T12:00:00.000Z"
}
```

## Plugin Integration

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import { kbrBuilder } from "./source/builder/index";

export default defineConfig({
  root: "source/site",
  publicDir: "../../public",
  base: "./",
  build: {
    outDir: "../../dist",
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true,
    watch: {
      ignored: ["!**/pages/**"],
    },
  },
  plugins: [kbrBuilder()], // Custom plugin integration
});
```

### Plugin Hooks Used

The KBR Builder leverages several Vite plugin hooks:

1. **`configureServer`**: Setup development middleware for route processing
2. **`handleHotUpdate`**: Manage hot reloading for templates and pages
3. **`buildStart`**: Process Markdown files and generate blog manifest
4. **`generateBundle`**: Process HTML files and inject assets during build

## File Processing Workflows

### Development Workflow

```mermaid
graph TD
    A[HTTP Request] --> B{Route exists?}
    B -->|Yes| C[Check cache]
    B -->|No| D[Check pages/]
    C -->|Hit| E[Return cached]
    C -->|Miss| F[Process template]
    D -->|Found| F
    D -->|Not found| G[404 Response]
    F --> H[Cache result]
    H --> I[Return HTML]
    E --> I
    I --> J[Serve to browser]
```

### Build Workflow

```mermaid
graph TD
    A[Build Start] --> B[Discover Markdown files]
    B --> C[Process each .md file]
    C --> D[Extract frontmatter]
    D --> E[Convert to HTML]
    E --> F[Apply template]
    F --> G[Generate blog manifest]
    G --> H[Process HTML pages]
    H --> I[Extract Vite assets]
    I --> J[Inject assets into templates]
    J --> K[Emit final files]
```

## Component Details

### MarkdownProcessor

**Responsibilities**:

- Parse Markdown files with frontmatter
- Convert Markdown to HTML using marked.js
- Generate automatic heading IDs for anchor navigation
- Aggregate blog post metadata
- Create and maintain blog manifest

**Key Methods**:

- `processMarkdownFile()` - Process individual Markdown file
- `generateBlogManifest()` - Create blog post index
- `setupHeadingRenderer()` - Configure automatic heading IDs

### TemplateProcessor

**Responsibilities**:

- Load and cache HTML templates
- Perform variable substitution ({{variable}})
- Extract metadata from HTML comments
- Handle template inheritance
- Manage template cache invalidation

**Key Methods**:

- `processTemplate()` - Apply template with variables
- `extractMetadata()` - Parse HTML metadata
- `loadTemplate()` - Load template from filesystem
- `clearCache()` - Invalidate template cache

### DevServerMiddleware

**Responsibilities**:

- Intercept HTTP requests during development
- Process HTML files through template system
- Handle Markdown file processing
- Block access to restricted directories
- Manage live reloading

**Middleware Stack**:

1. **Blocking Middleware** - Prevent direct access to source directories
2. **Processing Middleware** - Handle template processing and Markdown conversion
3. **Vite Default** - Handle static assets and other files

### HtmlBundleProcessor

**Responsibilities**:

- Process HTML files during production build
- Extract CSS and JS assets from Vite bundle
- Inject assets into HTML templates
- Generate final static files
- Handle file emission to output directory

**Build Steps**:

1. Extract assets from Vite bundle
2. Process existing HTML files in bundle
3. Discover additional HTML files from pages/
4. Process through template system
5. Inject discovered assets
6. Emit final files to dist/

### HtmlProcessingUtils

**Responsibilities**:

- Shared HTML processing functions
- Title extraction from content
- Template variable preparation
- Asset injection utilities

### FileSystemHelper & BuildLogger

**FileSystemHelper**:

- Recursive file discovery with filtering
- File reading utilities
- Path resolution helpers

**BuildLogger**:

- Consistent build logging with prefixes
- Info, warning, error, and success messages
- Visual indicators for build progress

## Configuration & Customization

### Template Variables

The system supports the following template variables:

```typescript
interface TemplateVariables {
  title: string; // Page title
  description?: string; // Meta description
  keywords?: string; // SEO keywords
  additionalHead?: string; // Additional <head> content
  content: string; // Main page content
  date?: string; // Blog post date (ISO format)
  formattedDate?: string; // Human-readable date
  tags?: string[]; // Blog post tags
  isBlogPost?: boolean; // Blog post flag
}
```

### Metadata Extraction

**HTML Pages**: Metadata is extracted from HTML comments at the top of files:

```html
<!-- title: Page Title -->
<!-- description: Page description for SEO -->
<!-- keywords: seo, keywords, comma separated -->
<!-- template: custom-template.html -->
```

**Markdown Files**: Metadata is extracted from YAML frontmatter:

```yaml
---
title: "Blog Post Title"
description: "Post description for SEO"
date: "2024-01-15"
tags: ["web-dev", "typescript", "vite"]
keywords: "optional, seo, keywords"
---
```

### Template Processing Logic

1. **Variable Substitution**: Process all template variables using regex replacement
2. **Conditional Rendering**: Handle `{{#variable}}...{{/variable}}` blocks
3. **HTML Escaping**: Apply HTML escaping to `{{variable}}` but not `{{{variable}}}`
4. **Asset Injection**: Automatically inject CSS and JS assets during build
5. **Cache Management**: Cache processed templates for performance

### Directory Structure Requirements

```
source/site/
├── pages/              # HTML pages (processed through templates)
├── templates/          # Template files
├── content/           # Markdown blog posts
├── styles/            # CSS files
├── components/        # Lit components
└── main.ts           # Application entry point

public/
├── data/             # Generated data files (blog manifest)
├── styles/           # Static CSS files
└── assets/           # Static assets
```

### Excluding Content

**Draft Posts**: Place in `content/__drafts/` to exclude from production builds

**File Filtering**: The system automatically excludes:

- Files in `__drafts/` directories
- Files starting with `_` (underscore)
- Non-Markdown files in content processing

## Performance Optimizations

### Template Caching

Templates are cached in memory during development to improve performance:

- Cache hit: Instant template serving
- Cache miss: Load from filesystem and cache
- Cache invalidation: Triggered by file changes

### Selective Processing

- Only process files that match specific patterns
- Skip unnecessary file processing during development
- Efficient file discovery with extension filtering

### Hot Module Replacement

Intelligent HMR for different file types:

- **Templates/Includes**: Full page reload (affects multiple pages)
- **Pages**: Full page reload (structural changes)
- **CSS/JS**: Standard Vite HMR (fast updates)
- **Markdown**: Process and reload affected pages

## Error Handling

### Development Errors

- Template parsing errors with file references
- Markdown processing errors with line numbers
- Missing file warnings with helpful suggestions
- Asset injection errors with fallback handling

### Production Build Errors

- Comprehensive error reporting during build
- Graceful handling of missing templates
- Asset discovery failure recovery
- Build process interruption on critical errors

## Debugging & Logging

### Log Levels

- **Info**: General build progress and operations
- **Warning**: Non-critical issues that may need attention
- **Error**: Critical issues that stop the build process
- **Success**: Confirmation of completed operations

### Debug Features

- File discovery logging
- Template processing steps
- Asset injection details
- Cache hit/miss reporting
- Build timing information

## Extension Points

### Adding New Template Variables

1. Extend `TemplateVariables` interface in `template-processor.ts`
2. Add extraction logic in `extractMetadata()` method
3. Update template files to use new variables
4. Document new variables in this README

### Custom Markdown Rendering

1. Extend `MarkdownProcessor` class
2. Override `setupHeadingRenderer()` or add new renderers
3. Configure marked.js options in constructor
4. Add custom post-processing steps

### Additional File Types

1. Add new file extensions to discovery logic
2. Create processor for new file type
3. Integrate with existing template system
4. Add development server middleware for live processing

## Troubleshooting

### Common Issues

**Template Not Found**:

- Check template file exists in `source/site/templates/`
- Verify template name matches exactly (case sensitive)
- Ensure template file has `.html` extension

**Variables Not Substituting**:

- Check variable syntax: `{{variableName}}` (no spaces)
- Verify variable exists in TemplateVariables
- Check for typos in variable names

**Hot Reload Not Working**:

- Check file is in watched directory
- Verify Vite configuration includes correct paths
- Clear template cache manually if needed

**Build Failures**:

- Check all Markdown files have valid frontmatter
- Verify all referenced templates exist
- Ensure no circular template dependencies

### Performance Issues

**Slow Development Server**:

- Check template cache hit rate in logs
- Reduce number of files being processed
- Optimize file discovery patterns

**Large Build Times**:

- Profile Markdown processing steps
- Check for unnecessary file processing
- Optimize asset injection logic

## Future Enhancements

### Potential Improvements

1. **Template Hot Reloading**: Update specific components instead of full reload
2. **Incremental Builds**: Only process changed files during development
3. **Asset Optimization**: Automatic image optimization and WebP conversion
4. **SEO Enhancements**: Automatic sitemap generation and meta tag optimization
5. **Performance Monitoring**: Build time analytics and optimization suggestions

### Plugin Architecture

The modular design allows for easy extension and maintenance:

- Each component has a single responsibility
- Clear interfaces between components
- Minimal coupling between modules
- Easy to test individual components
- Straightforward to add new features

This architecture provides a solid foundation for a modern static site generator while maintaining the flexibility and performance benefits of Vite's development experience.
