# KBR Builder - Custom Vite Plugin

## Overview

The KBR Builder is a comprehensive custom Vite plugin designed specifically for the Kyle Blank Rollins portfolio site. It provides advanced HTML templating, Markdown processing, blog generation, and development server enhancements that extend Vite's capabilities to meet the specific needs of a static site generator with dynamic content processing.

## Architecture

The builder is implemented as a modular Vite plugin with the following structure:

```
source/builder/
├── index.ts                    # Main plugin entry point and orchestration
├── dev-server-middleware.ts    # Development server routing and live processing
├── markdown-processor.ts       # Markdown orchestrator (uses modules)
├── template-processor.ts       # Template orchestrator (uses modules)
├── html-bundle-processor.ts    # Production build HTML processing
├── git-aware-pipeline.ts       # Git-aware build coordination and file detection
├── git-utils.ts               # Git repository utilities and change detection
├── helpers.ts                  # File system utilities and logging
├── types.ts                   # TypeScript type definitions
└── modules/                    # Focused, reusable processing modules
    ├── index.ts                # Barrel export for all modules
    ├── html-utils.ts           # HTML escaping and manipulation utilities
    ├── citation-processor.ts   # Citation parsing and footnote generation
    ├── frontmatter-parser.ts   # YAML frontmatter extraction and parsing
    ├── content-discovery.ts    # Normalized content document discovery/validation
    ├── markdown-renderer.ts    # Marked.js configuration with custom renderers
    ├── content-preprocessor.ts # Content transformation before rendering
    ├── blog-manifest.ts        # Blog manifest building and validation
    ├── metadata-extractor.ts   # HTML comment metadata extraction
    └── template-engine.ts      # Template loading and variable substitution
```

### Modular Design

The builder follows a **modular architecture** where complex processors (markdown and template) delegate to focused, single-responsibility modules:

- **Processors** (`markdown-processor.ts`, `template-processor.ts`): Thin orchestrators that coordinate module interactions
- **Modules** (`modules/`): Reusable, testable components with clear boundaries
- **Shared utilities**: Common functionality used across multiple modules

This design enables:

- **Better testability**: Each module can be tested independently
- **Code reusability**: Modules used by multiple processors
- **Easier maintenance**: Smaller files with focused responsibilities
- **Improved organization**: Clear separation of concerns

## Processing Modules

The `modules/` directory contains focused, reusable components that handle specific aspects of content processing:

### Shared Utilities

#### html-utils.ts

Pure utility functions for HTML manipulation:

- `escapeHtml()` - Escape HTML characters for safe display
- `escapeHtmlAttribute()` - Escape text for use in HTML attributes (XSS prevention)
- `escapeHtmlComment()` / `unescapeHtmlComment()` - Handle `--` in HTML comments

#### citation-processor.ts

Citation parsing and footnote generation:

- Parse citations from YAML frontmatter
- Process `[^id]` references in content → superscript links
- Generate HTML for citations/footnotes section
- Validate citation IDs and detect duplicates/unused citations

#### frontmatter-parser.ts

YAML frontmatter extraction and parsing:

- Extract frontmatter from markdown files
- Parse metadata fields (title, description, date, tags, series)
- Format dates with timezone handling
- Parse series information for multi-part blog posts

#### content-discovery.ts

Normalized content-document discovery and validation:

- Uses `source/site/content/published/` as the publishable content root
- Discovers standalone posts and directory parent posts
- Classifies supplement markdown under reserved `supplements/` directories
- Validates structure and rejects duplicate public output URLs before emission

### Markdown Processing Modules

#### markdown-renderer.ts

Marked.js configuration with custom renderers:

- Custom heading renderer (auto-generates IDs for anchor links)
- Custom link renderer (transforms `.md` → `.html`, XSS protection)
- Custom code renderer (Prism.js syntax highlighting)
- Language normalization for code blocks

#### content-preprocessor.ts

Content transformation before rendering:

- `stripComments()` - Remove JS/CSS comments (preserves code block comments)
- `preprocessAdmonitions()` - Process markdown inside `<kbr-admonition>` tags

#### blog-manifest.ts

Blog manifest building and validation:

- Add posts to manifest with metadata
- Sort posts by date (newest first)
- Aggregate tags with counts
- Validate series (check for duplicates, detect gaps in part numbers)
- Generate JSON manifest output

### Template Processing Modules

#### metadata-extractor.ts

Extract metadata from HTML comments:

- Parse `<!-- key: value -->` comments
- Extract blog-specific metadata (date, tags, series)
- Remove metadata comments from content
- Support for multi-line values

#### template-engine.ts

Template loading and variable substitution:

- Load templates with caching
- Variable substitution: `{{var}}` (escaped), `{{{var}}}` (unescaped), `{{#var}}...{{/var}}` (conditional)
- Flatten objects for dot notation support (`user.name`)
- Detect complete HTML documents

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
**Template Syntax**: The system supports three types of template syntax: 1.
**Escaped Variables**: `{{variable}}` - HTML-escaped content (safe for text) 2.
**Unescaped Variables**: `{{{variable}}}` - Raw HTML content (for HTML
injection) 3. **Conditional Sections**: `{{#variable}}...{{/variable}}` - Show
content only if variable exists ```html
<!-- In template files -->
<title>{{title}}</title>
{{#description}}
<meta name="description" content="{{description}}" />
{{/description}} {{#keywords}}
<meta name="keywords" content="{{keywords}}" />
{{/keywords}}
<main>{{{content}}}</main>
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
Your markdown content starts here.
```

**Note**: The title from frontmatter is automatically injected as an H1 heading at the top of your post. You don't need to duplicate it in the markdown content. The first heading in your content should be H2 (`##`).

**Output Locations**:

- Processed HTML: `source/site/content/published/**/*.md` → `public/*.html` → `dist/`
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

### 5. Asset Injection System

**Purpose**: Coordinate CSS and JavaScript asset injection between Vite's bundling system and the KBR Builder's template processing

**Critical Design Challenge**:

The KBR Builder processes HTML files through a template system, which can interfere with Vite's ability to detect entry points and properly bundle assets. This system addresses the dual requirements of:

1. **Template-based HTML processing** for consistent layouts and variable substitution
2. **Vite entry point detection** for proper CSS/JS bundling and injection

**Development vs Production Asset Handling**:

#### Development Server Asset Injection

**Mechanism**: The dev server middleware (`dev-server-middleware.ts`) handles asset injection using Vite's built-in development asset resolution.

**Process**:

1. HTML requests are intercepted by the middleware
2. Files are processed through the template system
3. `injectDevAssets()` function automatically injects Vite's development assets:
   - `<script type="module">` tags for hot module replacement
   - CSS imports through JavaScript modules
   - Development-time asset resolution

**Key Implementation**:

```typescript
// Development asset injection
const processedHtml = await this.templateProcessor.processTemplate(
  templateName,
  variables
);
return injectDevAssets(processedHtml); // Injects Vite dev assets
```

**Assets Injected**:

- `/main.ts` entry point as ES module
- Hot reload client code
- CSS imports through JS modules
- Development-time source maps

#### Production Build Asset Injection

**Mechanism**: Production builds require special handling to ensure Vite can detect entry points while maintaining template processing.

**Entry Point Detection Strategy**:

- **Template-based files** (like `index.html`) include a `<script type="module" src="/main.ts"></script>` tag
- This tag **must be present in the source file** for Vite to detect the entry point during build
- The template system preserves this tag during processing
- Vite processes the entry point and generates bundled assets with hashed filenames

**Production Build Process**:

1. **Entry Point Detection**: Vite scans processed HTML files for `<script>` tags
2. **Asset Bundling**: Vite bundles CSS/JS into hashed files (e.g., `index-ABC123.js`, `index-DEF456.css`)
3. **Asset Discovery**: `HtmlBundleProcessor` extracts bundled assets from Vite's bundle object
4. **Asset Injection**: Bundled assets are automatically injected into all HTML templates

**Key Implementation**:

```typescript
// Extract assets from Vite bundle
const cssFiles = Object.keys(bundle).filter((file) => file.endsWith(".css"));
const jsFiles = Object.keys(bundle).filter((file) => file.endsWith(".js"));

// Inject into all processed HTML
const finalHtml = injectProductionAssets(processedHtml, {
  cssFiles,
  jsFiles,
});
```

**Critical Requirements for Entry Point Detection**:

1. **Source File Script Tag**: Template-based HTML files **must** include the entry point script tag:

   ```html
   <!-- In source/site/index.html -->
   <script type="module" src="/main.ts"></script>
   ```

2. **Template Preservation**: The template system **must not** remove or relocate this script tag during processing

3. **Build Order**: Template processing happens **after** Vite's initial bundle analysis but **before** final asset injection

**Template vs Entry Point Balance**:

The system successfully balances these competing requirements:

- **Templates**: `base.html` and other templates do **not** contain script tags (to avoid duplication)
- **Entry Points**: Only files that serve as Vite entry points (like `index.html`) contain script tags
- **Asset Injection**: Production builds automatically inject bundled assets into **all** processed HTML files, regardless of whether they originally contained script tags

**Troubleshooting Asset Injection**:

**Development Issues**:

- **No CSS/JS loading**: Check that `injectDevAssets()` is being called in middleware
- **Hot reload not working**: Verify Vite dev server is properly configured with middleware

**Production Issues**:

- **No bundled assets generated**: Ensure entry point files contain `<script type="module" src="/main.ts"></script>`
- **Assets not injected**: Check that `HtmlBundleProcessor` is discovering assets from Vite bundle
- **Build shows "✓ 1 modules transformed"**: Indicates Vite cannot detect entry point - verify script tag placement

### 6. Blog System

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

### 6. Git-Aware Build Pipeline

**Purpose**: Optimize build performance by only processing files that have actually changed in the git repository

**Key Capabilities**:

- **Intelligent File Detection**: Automatically detect changed markdown and HTML files
- **Conditional Processing**: Skip processing when no relevant files have changed
- **Coordinated Systems**: Unified pipeline that coordinates all git-aware decisions
- **Performance Optimization**: Dramatically reduce build times for incremental changes
- **Flexible Modes**: Support for git-aware, force-all, and standard build modes

**Build Modes**:

```bash
# Git-aware build (only process changed files)
npm run build:git-aware
GIT_AWARE=true vite build

# Force all files (ignore git status)
npm run build:force-all
GIT_AWARE=true FORCE_ALL=true vite build

# Standard build (process all files)
npm run build
```

**Git-Aware Pipeline Architecture**:

```typescript
GitAwareBuildPipeline
├── shouldProcessMarkdown() → Only when .md files change
├── shouldProcessHtml() → Only when source .html files change
├── shouldGenerateBlogManifest() → Only when markdown changes/deletions
├── shouldClearTemplateCache() → Only when templates change
└── Centralized file change detection with caching
```

**Conditional Processing Logic**:

1. **Markdown Processing**: Only runs when `.md` files in `source/site/content/published/` are modified
2. **HTML Processing**: Only runs when `.html` files in `source/site/pages/` or `source/site/index.html` are modified
3. **Blog Manifest Generation**: Only runs when markdown files change or are deleted
4. **Template Cache**: Intelligently cleared when templates, includes, or pages change

**File Exclusions**:

- **Generated Files**: Files in `/public` directory are excluded (generated by markdown processor)
- **Draft Posts**: Files in `__drafts/` directories are excluded from production
- **Non-Source Files**: Only source files are considered for git-aware processing

**Performance Benefits**:

- **No Changes**: ~540ms build time (skips all processing except core Vite bundle)
- **Markdown Only**: Processes only changed markdown files + generates blog manifest
- **HTML Only**: Processes only changed HTML source files
- **Mixed Changes**: Intelligently processes both markdown and HTML as needed

**Build Logging**:

```
[Build] 🔧 Git repository detected (branch: main)
[Build] 📊 Found 5 changed files
[Build] 📝 Found 2 changed markdown files:
[Build]   - source/site/content/published/blog-post.md
[Build]   - source/site/content/published/another-post.md
[Build] 🌐 Found 1 changed HTML files:
[Build]   - source/site/pages/about.html
[Build] ⚡ Git-aware mode: processing 2 changed markdown files
[Build] ⚡ Git-aware mode: processing 1 changed HTML files
[Build] ✓ Generated blog manifest: public/data/blog-manifest.json (5 posts, 8 tags)
```

**Configuration Options**:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    kbrBuilder({
      gitAware: true, // Enable git-aware processing
      baseBranch: "main", // Base branch for comparison
      forceAll: false, // Force process all files
    }),
  ],
});
```

**Environment Variables**:

- `GIT_AWARE=true`: Enable git-aware processing
- `FORCE_ALL=true`: Force processing of all files (overrides git-aware)

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
  plugins: [
    kbrBuilder({
      gitAware: process.env.GIT_AWARE === "true",
      forceAll: process.env.FORCE_ALL === "true",
      baseBranch: "main",
    }),
  ],
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
- Clean metadata comments from processed content

**Key Methods**:

- `processTemplate()` - Apply template with variables
- `extractMetadata()` - Parse HTML metadata and return cleaned content
- `loadTemplate()` - Load template from filesystem
- `clearCache()` - Invalidate template cache

**Enhanced Metadata Processing**:

The `extractMetadata()` method has been enhanced to return both extracted metadata and cleaned content:

```typescript
public extractMetadata(htmlContent: string): {
  metadata: Record<string, string>;
  content: string;
}
```

**Key Features**:

- **Dual Return**: Returns both metadata object and content with comments removed
- **Comment Removal**: Automatically strips metadata comments from content to prevent duplication
- **Template Integration**: Cleaned content is used in template processing to avoid showing metadata comments in final HTML

**Metadata Comment Format**:

```html
<!-- title: Page Title -->
<!-- description: Page description for SEO -->
<!-- keywords: seo, keywords, comma separated -->
<!-- template: custom-template.html -->

<!-- Content starts here - comments above are stripped -->
<section class="hero">...</section>
```

This enhancement ensures that:

1. Metadata is properly extracted for template variable substitution
2. Metadata comments don't appear in the final rendered HTML
3. Content remains clean and properly formatted

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

### GitAwareBuildPipeline

**Responsibilities**:

- Centralized coordination of all git-aware build decisions
- Efficient file change detection with caching
- Conditional processing logic for different file types
- Build strategy logging and reporting

**Key Methods**:

- `shouldProcessMarkdown()` - Determine if markdown processing should run
- `shouldProcessHtml()` - Determine if HTML processing should run
- `shouldGenerateBlogManifest()` - Determine if blog manifest generation should run
- `getChangedMarkdownFiles()` - Get list of changed markdown files
- `getChangedHtmlFiles()` - Get list of changed HTML files
- `logBuildStrategy()` - Log the current build approach and detected changes

**Git-Aware Logic**:

- **Non-Git Repository**: Always process all files
- **Standard Mode**: Always process all files
- **Git-Aware Mode**: Only process files that have changed
- **Force-All Mode**: Process all files but with git-aware logging

### GitUtils

**Responsibilities**:

- Low-level git repository operations
- File change detection using git commands
- Repository status and branch information
- File filtering and path resolution

**Key Methods**:

- `isGitRepository()` - Check if current directory is a git repository
- `getCurrentBranch()` - Get the current git branch name
- `getChangedFiles()` - Get all files that have been modified, added, or renamed
- `getChangedMarkdownFiles()` - Get changed markdown files in content directory
- `getChangedHtmlFiles()` - Get changed HTML files (excludes /public directory)
- `logRepositoryStatus()` - Log current repository status and branch information

**File Detection Logic**:

- Uses `git diff --name-only HEAD` to detect changed files
- Filters results by file extension and directory
- Excludes generated files in `/public` directory
- Handles both modified and newly added files

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

## NPM Scripts

The KBR Builder supports several npm scripts for different build scenarios:

### Build Scripts

```json
{
  "scripts": {
    "build": "tsc && vite build",
    "build:git-aware": "tsc && GIT_AWARE=true vite build",
    "build:force-all": "tsc && GIT_AWARE=true FORCE_ALL=true vite build",
    "clean:public": "tsx scripts/clean-public.ts"
  }
}
```

**Script Descriptions**:

- **`npm run build`**: Standard build - processes all files regardless of git status
- **`npm run build:git-aware`**: Git-aware build - only processes changed files for optimal performance
- **`npm run build:force-all`**: Force all build - processes all files but with git-aware logging
- **`npm run clean:public`**: Clean orphaned HTML files from public directory

### Development Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "preview": "vite preview",
    "lint:prose": "tsx scripts/lint-prose.ts"
  }
}
```

### Usage Examples

```bash
# Development with live reloading
npm run dev

# Production build (all files)
npm run build

# Optimized build (only changed files)
npm run build:git-aware

# Force build all files with git logging
npm run build:force-all

# Clean generated files
npm run clean:public

# Lint prose content
npm run lint:prose --changed  # Only changed files
npm run lint:prose --drafts   # Only draft files
npm run lint:prose --all      # All files
```

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

**Asset Injection Issues**:

**Development Server - No CSS/JS Loading**:

- Verify `injectDevAssets()` is being called in dev server middleware
- Check that processed HTML includes proper Vite script tags
- Ensure Vite dev server configuration includes correct middleware setup

**Production Build - No Bundled Assets Generated** (shows "✓ 1 modules transformed"):

- **Root Cause**: Vite cannot detect entry point for bundling
- **Solution**: Ensure template-based HTML files include script tag: `<script type="module" src="/main.ts"></script>`
- **Key Files**: Especially `source/site/index.html` which serves as main entry point
- **Verification**: Check that build output shows "✓ XX modules transformed" (where XX > 1)

**Production Build - Assets Generated But Not Injected**:

- Check `HtmlBundleProcessor` is discovering assets from Vite bundle
- Verify asset extraction logic in `generateBundle` hook
- Confirm final HTML includes `<link>` and `<script>` tags for bundled assets

**Template vs Entry Point Conflicts**:

- **Issue**: Template system processing interferes with Vite entry point detection
- **Solution**: Place script tags in source files (not templates) that serve as Vite entry points
- **Pattern**: Use `base.html` template for structure, but keep entry point scripts in actual page files

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

### Implemented Features

- **✅ Git-Aware Build Pipeline**: Intelligent file change detection and conditional processing
- **✅ Incremental Builds**: Only process changed files during production builds
- **✅ Blog Manifest Optimization**: Generate blog metadata only when needed
- **✅ Coordinated Processing**: Unified pipeline for all build systems

### Potential Future Improvements

1. **Template Hot Reloading**: Update specific components instead of full reload during development
2. **Asset Optimization**: Automatic image optimization and WebP conversion
3. **SEO Enhancements**: Automatic sitemap generation and meta tag optimization
4. **Performance Monitoring**: Build time analytics and optimization suggestions
5. **Advanced Git Integration**: Support for comparing against different base branches

### Plugin Architecture

The modular design allows for easy extension and maintenance:

- Each component has a single responsibility
- Clear interfaces between components
- Minimal coupling between modules
- Easy to test individual components
- Straightforward to add new features

This architecture provides a solid foundation for a modern static site generator while
