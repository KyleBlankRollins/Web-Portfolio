# Kyle Blank Rollins - Portfolio Site

A modern, performant portfolio website built with Vite, TypeScript, and Lit Element web components. Features a custom static site generator with advanced templating, blog management, and sophisticated CSS architecture.

## 🚀 Features

- **Modern Web Components**: Built with Lit Element for encapsulated, reusable components
- **Custom Static Site Generator**: KBR Builder - a comprehensive Vite plugin for HTML templating and Markdown processing
- **Advanced CSS Architecture**: Hybrid approach combining global styles, Shadow DOM, and shared style modules
- **Blog System**: Full-featured blog with Markdown support, frontmatter metadata, and tag filtering
- **Performance Optimized**: Vite-powered development with optimized production builds
- **Accessibility First**: WCAG compliant with proper focus management and semantic HTML
- **SEO Ready**: Automated meta tag generation, sitemap support, and structured data
- **Prose Linting**: Automated content quality checks with Vale using Google's style guide

## ✍️ Content Quality with Vale

This project uses [Vale](https://vale.sh/) for linting prose in Markdown blog post content. Vale helps maintain consistent, clear, and accessible writing following the Google Developer Documentation Style Guide.

### What gets linted?

Vale only runs on Markdown files in:

- `source/site/content/published/**/*.md`
- `source/site/content/__drafts/*.md`

### Configuration

- **Main config**: `.vale.ini`
- **Style guide**: Google Developer Documentation Style Guide (automatically downloaded)
- **Styles directory**: `.vale/styles/` (ignored by git)

### Usage

#### Manual linting

```bash
# Lint all Markdown blog content
npm run lint:prose

# Lint only changed files (useful during development)
npm run lint:prose:changed

# Lint only Markdown drafts
npm run lint:prose:drafts

# Verbose output with debugging info
npm run lint:prose:verbose
```

#### Advanced usage

The linting system is powered by a TypeScript script (`scripts/lint-prose.ts`) that provides intelligent file discovery and flexible linting options:

- **Smart file discovery**: Automatically finds relevant Markdown files
- **Git integration**: Can lint only changed, staged, or specific file sets
- **Flexible scoping**: Target all content, drafts only, or specific patterns
- **Enhanced reporting**: Colorized output with progress indicators
- **CLI flexibility**: Mix and match options (e.g., `--drafts-only --verbose`)

### Vale rules

The configuration uses:

- **Google style guide**: Primary rules for technical writing
- **Vale built-in rules**: Basic grammar and spelling
- **Custom settings**: Relaxed rules for blog content vs. technical docs

#### Rule customizations for blog content

- First-person pronouns: Allowed in drafts, warnings in published posts
- Contractions: Suggestions only
- Exclamation points: Allowed in drafts
- Parentheses: Suggestions only

### Adding exceptions

Common technical terms are automatically accepted. To add more terms:

1. Edit `.vale.ini` to add vocabulary support
2. Create vocabulary files in `.vale/config/vocabularies/Blog/`
3. Add terms to `accept.txt` or `reject.txt`

### Installation requirements

Vale CLI must be installed and available in `$PATH`. Install with:

```bash
# macOS
brew install vale

# Linux
curl -sfL https://install.goreleaser.com/github.com/ValeLint/vale.sh | sh

# Or download from https://github.com/errata-ai/vale/releases
```

### Troubleshooting

- **"Vale not found"**: Make sure Vale CLI is installed and in PATH
- **"Styles not found"**: Run `vale sync` to download style guides
- **"Too many errors"**: Check `.vale.ini` for rule customizations

### IDE integration

For real-time linting in your editor:

- **VS Code**: Install the Vale extension
- **Vim**: Use ALE with Vale
- **Emacs**: Use flycheck with Vale

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Development

```bash
# Clone the repository
git clone https://github.com/KyleBlankRollins/Web-Portfolio.git
cd Web-Portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the site in action.

### Build for Production

```bash
# Build static files
npm run build

# Preview production build locally
npm run preview
```

## 📁 Project Structure

```
Web-Portfolio/
├── README.md                    # This file - project overview
├── package.json                 # Dependencies and scripts
├── vite.config.ts              # Vite configuration with custom plugin
├── tsconfig.json               # TypeScript configuration
├── netlify.toml                # Deployment configuration
├── todos.md                    # Project todo list and feature tracking
├── .vale.ini                   # Vale prose linting configuration
├── .vale/                      # Vale linting setup (styles ignored by git)
├── scripts/                    # Development and build scripts
├── public/                     # Static assets served directly
│   ├── styles/                 # Global CSS files (style.css, theme.css, etc.)
│   ├── fonts/                  # Web font assets
│   ├── data/                   # Generated data files (blog-manifest.json)
│   ├── assets/                 # Static assets and images
│   └── samples/                # Portfolio samples and documents
├── source/
│   ├── builder/                # Custom Vite plugin - KBR Builder
│   │   └── README.md          # 📘 Build system documentation
│   └── site/                   # Site source code
│       ├── README.md          # 📝 Content creation guide
│       ├── main.ts            # Application entry point
│       ├── index.html         # Main page template
│       ├── pages/             # HTML pages (About, Portfolio, etc.)
│       ├── content/           # Blog posts (Markdown)
│       │   └── __drafts/      # Draft blog posts
│       ├── templates/         # HTML templates
│       ├── components/        # Lit Element web components
│       └── styles/            # CSS architecture
│           └── README.md      # 🎨 CSS architecture documentation
└── dist/                       # Built site output (generated)
```

## 📚 Documentation

This project includes comprehensive documentation for different aspects of development:

### 🎨 [CSS Architecture](source/site/styles/README.md)

Learn about the hybrid CSS architecture, shared style modules, Shadow DOM patterns, and design token system.

**Key Topics**:

- Lit Element Shadow DOM styling strategies
- Shared style modules and component organization
- Design token philosophy (no fallback values)
- Performance optimization patterns

### 🔧 [Build System](source/builder/README.md)

Deep dive into the KBR Builder - the custom Vite plugin that powers the site's static generation, templating, and development experience.

**Key Topics**:

- HTML templating engine with variable substitution
- Markdown processing and blog manifest generation
- Development server enhancements and live reloading
- Explicit asset compilation and renderer-owned production output

### 📝 [Content Creation](source/site/README.md)

User-friendly guide for creating and editing site content, including HTML pages and blog posts.

**Key Topics**:

- Creating HTML pages with metadata and templates
- Writing blog posts in Markdown with frontmatter
- Using web components in content
- SEO best practices and troubleshooting

## 🧩 Key Components

### Web Components (Lit Element)

- **Navigation** (`kbr-navigation`) - Site navigation with active state management
- **Table of Contents** (`kbr-table-of-contents`) - Auto-generated TOC with scroll indicators
- **Static Blog Content** - Build-time blog markup with progressive enhancement
- **Static Timeline** - Build-time career timeline markup from Markdown
- **Anchor Copy** (`kbr-anchor-copy`) - Automatic anchor links for headings

### Build System (KBR Builder)

- **Template Processor** - HTML templating with variable substitution and includes
- **Markdown Processor** - Convert Markdown to HTML with frontmatter parsing
- **Dev Server Middleware** - Live processing and hot reloading during development
- **HTML Bundle Processor** - Manifest-driven production rendering and output

## 🎯 Development Philosophy

### Modern Web Standards

- **Progressive Enhancement**: Core functionality works without JavaScript
- **Web Components**: Standards-based component architecture
- **CSS Custom Properties**: Design token system for consistent theming
- **Semantic HTML**: Proper document structure and accessibility

### Performance First

- **Vite Development**: Lightning-fast development experience
- **Static Generation**: Pre-rendered HTML for optimal loading
- **Component Bundling**: Efficient CSS and JS delivery
- **Asset Optimization**: Automatic compression and caching headers

### Developer Experience

- **TypeScript**: Full type safety across the codebase
- **Hot Module Replacement**: Instant updates during development
- **Comprehensive Documentation**: Clear guides for all aspects of development
- **Modular Architecture**: Clean separation of concerns

## 🚢 Deployment

### Netlify (Recommended)

The site is configured for deployment on Netlify with optimized build settings:

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"
```

## 🔮 Future Enhancements

- [ ] Image optimization pipeline
- [ ] Progressive Web App features
- [ ] Comment system for blog posts

## 🤝 Contributing

This is a personal portfolio project, but feedback and suggestions are welcome! Please check the documentation files for technical details before proposing changes.

### Development Workflow

1. Read the relevant documentation ([CSS](source/site/styles/README.md), [Build System](source/builder/README.md), or [Content](source/site/README.md))
2. Create a feature branch
3. Make your changes following existing patterns
4. **For blog content**: Prose linting runs automatically on commit, or use `npm run lint:prose`
5. Test thoroughly in development mode
6. Submit a pull request with clear description

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ About

Built by Kyle Blank Rollins as a showcase of modern web development techniques, performance optimization, and thoughtful user experience design. The site serves as both a portfolio and a demonstration of technical writing and development capabilities.

**Key Technologies**: Vite, TypeScript, Lit Element, CSS Custom Properties, Markdown, Netlify

**Architecture Highlights**: Custom static site generator, hybrid CSS architecture, comprehensive component system, performance-first development
