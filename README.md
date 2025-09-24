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
├── netlify.toml                # Deployment configuration
├── public/                     # Static assets served directly
│   ├── styles/                 # Global CSS files
│   ├── fonts/                  # Web font assets
│   └── data/                   # Generated data files (blog manifest)
├── source/
│   ├── builder/                # Custom Vite plugin - KBR Builder
│   │   └── README.md          # 📘 Build system documentation
│   └── site/                   # Site source code
│       ├── README.md          # 📝 Content creation guide
│       ├── main.ts            # Application entry point
│       ├── pages/             # HTML pages (About, Portfolio, etc.)
│       ├── content/           # Blog posts (Markdown)
│       ├── templates/         # HTML templates
│       ├── components/        # Lit Element web components
│       └── styles/            # CSS architecture
│           └── README.md      # 🎨 CSS architecture documentation
└── documentation/             # Additional project documentation
    ├── css-architecture.md    # Detailed CSS patterns and conventions
    ├── blog-implementation.md # Blog system technical details
    └── features-roadmap.md    # Future enhancement plans
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
- Production build optimization and asset injection

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
- **Tag Filter** (`kbr-tag-filter`) - Interactive blog post filtering with animations
- **Timeline** (`kbr-timeline`) - Career timeline with expandable entries
- **Post List** (`kbr-post-list`) - Blog post listing with search and filtering
- **Anchor Copy** (`kbr-anchor-copy`) - Automatic anchor links for headings

### Build System (KBR Builder)

- **Template Processor** - HTML templating with variable substitution and includes
- **Markdown Processor** - Convert Markdown to HTML with frontmatter parsing
- **Dev Server Middleware** - Live processing and hot reloading during development
- **HTML Bundle Processor** - Production build optimization and asset injection

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
4. Test thoroughly in development mode
5. Submit a pull request with clear description

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ About

Built by Kyle Blank Rollins as a showcase of modern web development techniques, performance optimization, and thoughtful user experience design. The site serves as both a portfolio and a demonstration of technical writing and development capabilities.

**Key Technologies**: Vite, TypeScript, Lit Element, CSS Custom Properties, Markdown, Netlify

**Architecture Highlights**: Custom static site generator, hybrid CSS architecture, comprehensive component system, performance-first development
