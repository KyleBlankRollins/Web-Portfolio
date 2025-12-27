# Refactor Plan: Processors Modularization

## Overview

Break down `markdown-processor.ts` and `template-processor.ts` into focused, reusable modules. This refactor will:

- Improve code maintainability and testability
- Reduce file size and complexity
- Enable code sharing between processors
- Follow single responsibility principle

## Current State Analysis

### markdown-processor.ts (740 lines)

**Responsibilities:**

- Markdown → HTML conversion (marked.js integration)
- Custom rendering (headings, links, code blocks)
- Syntax highlighting (Prism.js)
- Comment stripping from content
- Admonition preprocessing
- Citation processing (find, replace, generate HTML)
- Blog metadata injection
- Blog manifest generation and validation
- Series data validation

### template-processor.ts (518 lines)

**Responsibilities:**

- Template loading and caching
- Variable substitution (escaped, unescaped, conditional)
- Metadata extraction from HTML comments
- Frontmatter parsing from Markdown YAML
- Citation parsing from frontmatter
- Date formatting
- Object flattening for dot notation support
- Validation (series part numbers, citation IDs, duplicates)

## Proposed Module Structure

### 1. Citation Module (Shared)

**File:** `source/builder/modules/citation-processor.ts`

**Purpose:** Handle all citation-related logic for both processors

**Exports:**

```typescript
export interface Citation {
  id: string;
  title: string;
  author: string;
  url?: string;
  purchaseUrl?: string;
}

export class CitationProcessor {
  // Parse citations from frontmatter YAML
  parseCitationsFromFrontmatter(frontmatter: string): Citation[]

  // Process [^id] references in content → superscript links
  processCitationReferences(content: string, citations: Citation[], filePath: string): {
    content: string;
    usedCitations: Map<string, { number: number; positions: number[] }>;
  }

  // Generate HTML for citations/footnotes section
  generateCitationsHtml(citations: Citation[], usedCitations: Map<...>): string

  // Validate citation data
  validateCitations(citations: Citation[]): void // throws on invalid

  // Escape HTML for use in HTML comments
  escapeForHtmlComment(html: string): string
}
```

**Logic Moved From:**

- `template-processor.ts`: `parseCitations()` (lines 312-395)
- `markdown-processor.ts`: `processCitations()` (lines 233-330), `generateCitationsHtml()` (lines 336-408)
- Both: Citation validation logic

**Benefits:**

- Single source of truth for citation processing
- Easier to test citation logic in isolation
- Consistent citation handling across processors

---

### 2. Frontmatter Module (Shared)

**File:** `source/builder/modules/frontmatter-parser.ts`

**Purpose:** Parse and validate YAML frontmatter from Markdown files

**Exports:**

```typescript
export interface FrontmatterData {
  title?: string;
  description?: string;
  keywords?: string;
  date?: string;
  tags?: string[];
  series?: SeriesInfo;
  citations?: Citation[];
  [key: string]: any; // Allow additional custom fields
}

export class FrontmatterParser {
  // Parse YAML frontmatter block
  parse(markdownContent: string): {
    metadata: FrontmatterData;
    content: string; // Content without frontmatter
  };

  // Parse series metadata from frontmatter
  parseSeriesInfo(frontmatter: string): SeriesInfo | undefined;

  // Parse tags (handles both array and comma-separated formats)
  parseTags(tagsStr: string): string[];

  // Validate frontmatter structure
  validate(metadata: FrontmatterData): void; // throws on invalid
}
```

**Logic Moved From:**

- `template-processor.ts`: `extractMarkdownFrontmatter()` (lines 192-315)
- Series parsing logic (lines 241-286)
- Tag parsing logic (lines 224-239)

**Benefits:**

- Centralized frontmatter parsing
- Can add support for more frontmatter formats (TOML, JSON)
- Easier to extend with new fields

---

### 3. Metadata Extractor Module (Template Processor)

**File:** `source/builder/modules/metadata-extractor.ts`

**Purpose:** Extract metadata from HTML comments in processed files

**Exports:**

```typescript
export interface ExtractedMetadata {
  title?: string;
  description?: string;
  keywords?: string;
  date?: string;
  formattedDate?: string;
  tags?: string[];
  isBlogPost?: boolean;
  series?: SeriesInfo;
  citationsHtml?: string;
  [key: string]: any;
}

export class MetadataExtractor {
  // Extract all metadata from HTML comments
  extract(htmlContent: string): {
    metadata: ExtractedMetadata;
    content: string; // Content with comments removed
  };

  // Extract specific metadata by comment pattern
  extractComment(htmlContent: string, key: string): string | undefined;

  // Format date for display
  formatDate(dateStr: string): string;
}
```

**Logic Moved From:**

- `template-processor.ts`: `extractMetadata()` (lines 103-190)
- `template-processor.ts`: `formatDate()` (lines 397-427)

**Benefits:**

- Clear separation between HTML comment extraction and frontmatter parsing
- Can be used independently for processing existing HTML files

---

### 4. Markdown Renderer Module (Markdown Processor)

**File:** `source/builder/modules/markdown-renderer.ts`

**Purpose:** Configure marked.js with custom renderers and transformations

**Exports:**

```typescript
export interface MarkdownRendererOptions {
  gfm?: boolean;
  breaks?: boolean;
  syntaxHighlighting?: boolean;
}

export class MarkdownRenderer {
  constructor(options?: MarkdownRendererOptions);

  // Render markdown to HTML
  render(markdown: string): string;

  // Setup custom renderer for headings (with IDs)
  private setupHeadingRenderer(): void;

  // Setup custom link renderer (transform .md → .html)
  private setupLinkRenderer(): void;

  // Setup code block renderer with syntax highlighting
  private setupCodeRenderer(): void;

  // Generate URL-safe anchor ID from text
  generateAnchorId(text: string): string;

  // Normalize language aliases for Prism
  normalizeLanguage(language: string | undefined): string | undefined;
}
```

**Logic Moved From:**

- `markdown-processor.ts`: Constructor and marked setup (lines 54-116)
- `generateAnchorId()` (lines 156-170)
- `normalizeLanguage()` (lines 121-139)
- Custom renderer setup logic

**Benefits:**

- Marked.js configuration isolated from processing logic
- Easy to test rendering behavior
- Can create different renderer configurations for different contexts

---

### 5. Content Preprocessor Module (Markdown Processor)

**File:** `source/builder/modules/content-preprocessor.ts`

**Purpose:** Transform content before markdown rendering

**Exports:**

```typescript
export class ContentPreprocessor {
  // Remove JavaScript/CSS comments from markdown (outside code blocks)
  stripComments(content: string): string;

  // Process admonitions to handle markdown within HTML tags
  preprocessAdmonitions(content: string): string;

  // Future: other preprocessing steps (e.g., custom syntax, macros)
}
```

**Logic Moved From:**

- `markdown-processor.ts`: `stripComments()` (lines 175-202)
- `markdown-processor.ts`: `preprocessAdmonitions()` (lines 209-226)

**Benefits:**

- Clear separation of concerns
- Easy to add new preprocessing steps
- Can disable specific preprocessors via configuration

---

### 6. Template Engine Module (Template Processor)

**File:** `source/builder/modules/template-engine.ts`

**Purpose:** Handle template loading, caching, and variable substitution

**Exports:**

```typescript
export interface TemplateVariables {
  [key: string]: any;
}

export class TemplateEngine {
  constructor(templateDir: string);

  // Load template with caching
  loadTemplate(templateName: string): string;

  // Render template with variables
  render(template: string, variables: TemplateVariables): string;

  // Substitute variables (handles {{var}}, {{{var}}}, {{#var}}...{{/var}})
  private substituteVariables(
    template: string,
    variables: TemplateVariables
  ): string;

  // Flatten nested objects for dot notation support
  private flattenObject(obj: any, prefix?: string): Record<string, any>;

  // Clear template cache
  clearCache(): void;

  // Check if content is complete HTML document
  isCompleteHtmlDocument(content: string): boolean;
}
```

**Logic Moved From:**

- `template-processor.ts`: `getTemplate()` (lines 429-444)
- `template-processor.ts`: `substituteVariables()` (lines 449-503)
- `template-processor.ts`: `flattenObject()` (lines 508-525)
- `template-processor.ts`: `isCompleteHtmlDocument()` (lines 60-68)
- `template-processor.ts`: `clearCache()` (lines 530-532)

**Benefits:**

- Pure template engine without metadata concerns
- Can be used for other templating needs
- Easy to test variable substitution logic

---

### 7. Blog Manifest Module (Markdown Processor)

**File:** `source/builder/modules/blog-manifest.ts`

**Purpose:** Build and validate blog post manifest data

**Exports:**

```typescript
export interface BlogPostManifestEntry {
  title: string;
  description: string;
  date: string;
  formattedDate: string;
  tags: string[];
  url: string;
  filename: string;
  keywords?: string;
  series?: SeriesInfo;
}

export interface BlogManifest {
  posts: BlogPostManifestEntry[];
  totalPosts: number;
  availableTags: string[];
  tagsWithCounts: Array<{ tag: string; count: number }>;
}

export class BlogManifestBuilder {
  // Add post to manifest
  addPost(entry: BlogPostManifestEntry): void;

  // Get all posts
  getPosts(): BlogPostManifestEntry[];

  // Build final manifest with aggregated data
  buildManifest(): BlogManifest;

  // Validate series data for consistency
  validateSeries(): void; // throws on invalid

  // Generate manifest as JSON string
  toJson(): string;

  // Clear all posts
  clear(): void;
}
```

**Logic Moved From:**

- `markdown-processor.ts`: `addToBlogManifest()` (lines 560-582)
- `markdown-processor.ts`: `generateBlogManifest()` (lines 587-620)
- `markdown-processor.ts`: `validateSeriesData()` (lines 625-673)
- `markdown-processor.ts`: `getBlogManifest()` (lines 678-680)
- `markdown-processor.ts`: `generateBlogManifestJson()` (lines 703-736)

**Benefits:**

- Blog-specific logic separated from markdown processing
- Easier to modify manifest structure
- Can build manifests from different sources

---

### 8. HTML Utilities Module (Shared)

**File:** `source/builder/modules/html-utils.ts`

**Purpose:** Common HTML manipulation utilities

**Exports:**

```typescript
export class HtmlUtils {
  // Escape HTML characters for safe display
  static escape(text: string): string;

  // Escape HTML for use in HTML comments
  static escapeComment(html: string): string;

  // Unescape HTML comment escaping
  static unescapeComment(html: string): string;

  // Generate meta tags HTML from metadata
  static generateMetaTags(metadata: ExtractedMetadata): string;
}
```

**Logic Moved From:**

- `markdown-processor.ts`: `escapeHtml()` (lines 144-151)
- `markdown-processor.ts`: `escapeHtmlComment()` (lines 502-504)
- `template-processor.ts`: HTML escaping in `substituteVariables()` (lines 488-493)
- `template-processor.ts`: Comment unescaping in `extractMetadata()` (lines 183-185)

**Benefits:**

- Reusable HTML utilities
- Consistent escaping across codebase
- Easy to extend with more HTML helpers

---

## Refactored Processor Structure

### MarkdownProcessor (Simplified)

```typescript
// source/builder/markdown-processor.ts
export class MarkdownProcessor {
  private renderer: MarkdownRenderer;
  private preprocessor: ContentPreprocessor;
  private citationProcessor: CitationProcessor;
  private frontmatterParser: FrontmatterParser;
  private manifestBuilder: BlogManifestBuilder;

  processMarkdownFile(filePath: string): string {
    // 1. Read file
    // 2. Parse frontmatter (frontmatterParser)
    // 3. Preprocess content (preprocessor)
    // 4. Process citations (citationProcessor)
    // 5. Render markdown (renderer)
    // 6. Inject blog metadata
    // 7. Add to manifest (manifestBuilder)
    // 8. Return HTML with metadata comments
  }

  // Simplified metadata injection
  private injectTitleAndMetadata(...)
  private createBlogMetadataHTML(...)

  // Delegated methods
  getBlogManifest() → manifestBuilder.getPosts()
  generateBlogManifest() → manifestBuilder.buildManifest()
  generateBlogManifestJson() → manifestBuilder.toJson()
}
```

### TemplateProcessor (Simplified)

```typescript
// source/builder/template-processor.ts
export class TemplateProcessor {
  private engine: TemplateEngine;
  private metadataExtractor: MetadataExtractor;
  private frontmatterParser: FrontmatterParser;
  private citationProcessor: CitationProcessor;

  processTemplate(content: string, variables: TemplateVariables, templateName?: string): string {
    // 1. Check if complete HTML (engine)
    // 2. Load template (engine)
    // 3. Render with variables (engine)
  }

  extractMetadata(htmlContent: string) → metadataExtractor.extract()
  extractMarkdownFrontmatter(markdown: string) → frontmatterParser.parse()
  isCompleteHtmlDocument(content: string) → engine.isCompleteHtmlDocument()
  clearCache() → engine.clearCache()
}
```

---

## Migration Strategy

### Phase 1: Create Shared Modules (Low Risk)

1. Create `html-utils.ts` - pure utility functions, no dependencies
2. Create `citation-processor.ts` - extract citation logic
3. Create `frontmatter-parser.ts` - extract frontmatter parsing
4. **Testing:** Unit test each module independently

### Phase 2: Create Processor-Specific Modules (Medium Risk)

1. Create `markdown-renderer.ts` - extract marked.js setup
2. Create `content-preprocessor.ts` - extract preprocessing logic
3. Create `blog-manifest.ts` - extract manifest building
4. Create `metadata-extractor.ts` - extract HTML comment extraction
5. Create `template-engine.ts` - extract template logic
6. **Testing:** Unit test each module with mocked dependencies

### Phase 3: Refactor Processors (Higher Risk)

1. Update `markdown-processor.ts` to use new modules
2. Update `template-processor.ts` to use new modules
3. **Testing:** Integration tests to ensure processors still work correctly
4. **Validation:** Run full build and verify output matches previous version

### Phase 4: Cleanup (Final)

1. Remove old code from processors
2. Update imports throughout codebase
3. Update documentation
4. Add module-level documentation

---

## Benefits Summary

### Maintainability

- Smaller, focused files (each <200 lines)
- Clear separation of concerns
- Single responsibility per module

### Testability

- Easy to unit test individual modules
- Can mock dependencies
- Reduced need for integration tests

### Reusability

- Shared modules used by both processors
- Can use modules in other parts of build system
- Easy to extract for use in other projects

### Extensibility

- New features can be added as new modules
- Existing modules can be extended without modifying processors
- Plugin architecture possible in future

### Developer Experience

- Easier to understand and navigate codebase
- Clear module boundaries
- Better IDE support (smaller files, clearer imports)

---

## File Size Reduction Estimate

**Before:**

- `markdown-processor.ts`: ~740 lines
- `template-processor.ts`: ~518 lines
- **Total: ~1,258 lines**

**After:**

- `markdown-processor.ts`: ~150 lines (orchestration)
- `template-processor.ts`: ~100 lines (orchestration)
- `citation-processor.ts`: ~120 lines
- `frontmatter-parser.ts`: ~150 lines
- `metadata-extractor.ts`: ~100 lines
- `markdown-renderer.ts`: ~150 lines
- `content-preprocessor.ts`: ~80 lines
- `template-engine.ts`: ~120 lines
- `blog-manifest.ts`: ~150 lines
- `html-utils.ts`: ~50 lines
- **Total: ~1,170 lines** (88 lines saved from reduced duplication)

**Largest file after refactor: ~150 lines** (down from 740)

---

## Testing Strategy

### Unit Tests (New)

Each module should have corresponding test file:

- `citation-processor.test.ts`
- `frontmatter-parser.test.ts`
- `metadata-extractor.test.ts`
- `markdown-renderer.test.ts`
- `content-preprocessor.test.ts`
- `template-engine.test.ts`
- `blog-manifest.test.ts`
- `html-utils.test.ts`

### Integration Tests (Existing)

- Keep existing processor integration tests
- Verify output matches pre-refactor behavior
- Add regression tests for known edge cases

### Validation

- Build entire site and compare output
- Run git diff on generated files
- Check that manifest JSON is identical
- Verify all blog posts render correctly

---

## Risks and Mitigations

### Risk: Breaking Changes

**Mitigation:**

- Comprehensive testing before merging
- Keep old code until fully validated
- Use feature flag to toggle between old/new implementation

### Risk: Performance Regression

**Mitigation:**

- Benchmark before and after
- Profile build times
- Optimize hot paths if needed

### Risk: Increased Complexity

**Mitigation:**

- Clear documentation for each module
- Maintain simple, flat module structure
- Avoid over-engineering

### Risk: Import Hell

**Mitigation:**

- Use barrel exports (`modules/index.ts`)
- Keep module dependencies minimal
- Prefer composition over inheritance

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Set up testing infrastructure** (if not already in place)
3. **Create feature branch** for refactor work
4. **Implement Phase 1** (shared modules)
5. **Validate Phase 1** with tests
6. **Continue with remaining phases**
7. **Merge when fully validated**

---

## Conclusion

This refactor will significantly improve code organization while maintaining backward compatibility. The modular structure enables better testing, easier maintenance, and future extensibility. The phased approach minimizes risk while delivering incremental value.
