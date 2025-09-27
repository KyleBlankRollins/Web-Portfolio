# KBR Portfolio Site - Content Guide

## Overview

This directory contains the source content for the Kyle Blank Rollins portfolio site. This guide covers how to create and edit HTML pages, write blog posts, and work with the template system.

## Directory Structure

```
source/site/
├── pages/              # Static HTML pages (About, Portfolio, etc.)
├── templates/          # HTML template files
├── content/           # Blog posts (Markdown files)
├── components/        # Web components (TypeScript)
├── styles/            # CSS stylesheets
└── main.ts           # Application entry point
```

## Working with HTML Pages

### Creating a New Page

1. **Create the HTML file** in `/source/site/pages/`
2. **Add metadata** using HTML comments at the top
3. **Write your content** using standard HTML
4. **Access your page** at `http://localhost:3000/page-name.html`

### Page Structure

```html
<!-- title: Page Title -->
<!-- description: SEO description for search engines -->
<!-- keywords: seo, keywords, comma separated -->

<section class="hero">
  <h1>Your Page Title</h1>
  <p>Your page content goes here.</p>
</section>

<div class="content">
  <!-- Rest of your HTML content -->
</div>
```

### Metadata Options

- **title**: Page title (appears in browser tab and SEO)
- **description**: SEO description for search engines
- **keywords**: Comma-separated keywords for SEO
- **template**: Optional custom template (defaults to `base.html`)

### Examples

**Simple About Page:**

```html
<!-- title: About Kyle -->
<!-- description: Learn about Kyle Blank Rollins, technical writer and developer -->
<!-- keywords: about, bio, technical writer, developer -->

<section class="about-hero">
  <h1>About Me</h1>
  <p class="lead">
    I'm a technical writer and developer passionate about creating
    clear, user-focused documentation and web experiences.
  </p>
</section>

<div class="bio-content">
  <h2>Background</h2>
  <p>Your background information here...</p>
</div>
```

**Portfolio Page with Components:**

```html
<!-- title: Portfolio -->
<!-- description: Showcase of technical writing and development projects -->

<section class="portfolio-hero">
  <h1>My Work</h1>
</section>

<!-- Include table of contents component -->
<kbr-table-of-contents
  min-level="2"
  max-level="4"
></kbr-table-of-contents>

<!-- Include timeline component -->
<kbr-timeline data-url="/data/experience-data.json"></kbr-timeline>
```

## Writing Blog Posts

### Creating a Blog Post

1. **Create a Markdown file** in `/source/site/content/`
2. **Add frontmatter** with metadata (required)
3. **Write your content** in Markdown
4. **Publish** - the post will automatically appear on the blog page

### Blog Post Structure

```markdown
---
title: "Your Blog Post Title"
description: "Brief description for SEO and post previews"
date: "2024-01-15"
tags: ["web-dev", "typescript", "tutorials"]
keywords: "optional, seo, keywords"
---

# Your Blog Post Title

Your introduction paragraph goes here. This will be used as a preview on the blog listing page.

## Section Heading

Your content here. You can use:

- **Bold text**
- _Italic text_
- `Code snippets`
- [Links](https://example.com)
- Images: ![Alt text](./image.jpg)

### Subsection

More content here...

## Code Examples

\`\`\`typescript
function example() {
return "Hello, world!";
}
\`\`\`
```

### Frontmatter Fields

**Required:**

- **title**: Post title
- **description**: SEO description and post preview
- **date**: Publication date (YYYY-MM-DD format)
- **tags**: Array of tags for categorization

**Optional:**

- **keywords**: Additional SEO keywords

### Tags

Tags are used for:

- Categorizing posts
- Filtering on the blog page
- SEO enhancement

**Tag Guidelines:**

- Use lowercase with hyphens: `web-dev`, `css-tips`
- Be consistent with existing tags
- Use 2-5 tags per post
- Common tags: `web-dev`, `typescript`, `css`, `javascript`, `tutorials`, `tools`

### Draft Posts

Place draft posts in `/source/site/content/__drafts/` to exclude them from the published site while working on them.

## Working with Templates

### Available Templates

- **`base.html`**: Standard page template with navigation
- **`blog-post.html`**: Blog post template with table of contents

### Template Features

Templates automatically handle:

- HTML document structure (`<html>`, `<head>`, `<body>`)
- Page metadata (title, description, keywords)
- Navigation component inclusion
- CSS and JavaScript asset injection

### Using a Custom Template

Specify a template in your page metadata:

```html
<!-- title: Special Page -->
<!-- template: custom-template.html -->

<div class="special-content">Your content here</div>
```

### Template Variables

Templates use special syntax to include dynamic content:

- `{{title}}` - Page title (HTML-escaped)
- `{{{content}}}` - Main page content (raw HTML)
- `{{description}}` - Page description
- `{{#description}}...{{/description}}` - Conditional content (only shows if description exists)

## Using Web Components

The site includes several custom web components you can use in your pages:

### Navigation

```html
<kbr-navigation></kbr-navigation>
```

Automatically included in templates.

### Table of Contents

```html
<kbr-table-of-contents></kbr-table-of-contents>
<kbr-table-of-contents
  min-level="2"
  max-level="4"
></kbr-table-of-contents>
```

Automatically generates navigation from page headings.

### Timeline

```html
<kbr-timeline data-url="/data/experience-data.json"></kbr-timeline>
```

Displays career timeline from JSON data.

### Post List (Blog Page)

```html
<kbr-post-list></kbr-post-list>
```

Automatically displays all published blog posts with filtering.

### Tag Filter (Blog Page)

```html
<kbr-tag-filter></kbr-tag-filter>
```

Provides tag-based filtering for blog posts.

## Development Workflow

### Local Development

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Create or edit content** in `/pages/` or `/content/`

3. **View changes** at `http://localhost:3000`
   - Changes are automatically reloaded
   - New pages appear immediately
   - Blog posts are processed and indexed automatically

### File Organization Tips

**Pages:**

- Use descriptive filenames: `about.html`, `contact.html`
- Group related content in folders if needed
- Keep URLs clean and SEO-friendly

**Blog Posts:**

- Use descriptive filenames: `getting-started-with-vite.md`
- Include the date for easy sorting: `2024-01-15-new-feature.md`
- Keep drafts in the `__drafts/` folder

## SEO Best Practices

### Page Optimization

- Always include `title` and `description` metadata
- Use descriptive, unique titles for each page
- Write compelling descriptions (150-160 characters)
- Include relevant keywords naturally

### Blog Post Optimization

- Write clear, descriptive titles
- Include relevant tags for discoverability
- Use headings (H2, H3) to structure content
- Add alt text to images
- Link to related content when relevant

### Content Guidelines

- Use semantic HTML elements (`<section>`, `<article>`, `<aside>`)
- Structure content with proper heading hierarchy
- Keep paragraphs concise and scannable
- Use bullet points and numbered lists

## Troubleshooting

### Common Issues

**Page not showing up:**

- Check filename has `.html` extension
- Verify metadata syntax in HTML comments
- Restart development server if needed

**Blog post not appearing:**

- Ensure frontmatter is properly formatted (YAML syntax)
- Check date format: `YYYY-MM-DD`
- Move out of `__drafts/` folder to publish

**Template not working:**

- Verify template file exists in `/templates/`
- Check template name spelling in metadata
- Ensure template has proper variable syntax

**Metadata not showing:**

- Check HTML comment syntax: `<!-- key: value -->`
- Verify YAML frontmatter in Markdown files
- Check for syntax errors in frontmatter

### Getting Help

- Check the [Builder Technical Documentation](../builder/README.md) for technical details
- Review existing pages and posts for examples
- Check browser developer tools for errors
- Restart the development server if changes aren't appearing

## Quick Reference

### New Page Checklist

- [ ] Create `.html` file in `/pages/`
- [ ] Add title and description metadata
- [ ] Write semantic HTML content
- [ ] Test in browser
- [ ] Optimize for SEO

### New Blog Post Checklist

- [ ] Create `.md` file in `/content/`
- [ ] Add required frontmatter (title, description, date, tags)
- [ ] Write engaging content with proper headings
- [ ] Add relevant tags
- [ ] Preview in development server
- [ ] Move out of drafts when ready to publish

This guide should get you started with creating and managing content for the KBR portfolio site. The system is designed to be simple and intuitive while providing powerful features for content management and SEO optimization.
