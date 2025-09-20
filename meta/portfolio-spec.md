# KyleBlankRollins.com

This document outlines the features and goals of my new portfolio website.

To support the authoring experience I want, I need a custom build tool. Details for the build tool can be found in the [Build system and page generation](#build-system-and-page-generation) section.

## Tech stack and style

KyleBlankRollins.com should be built with Vite + TypeScript. TypeScript should mostly be used for interactions on the site and in the build tooling. Prefer to use HTML for site pages, except for blog content which will be written in Markdown.

Ensure that TypeScript, CSS, and HTML files use the latest best practices. Target compatibility with modern browsers.

Code should be written with readability in mind. Use verbose variable names and ensure that there are spaces between semantic chunks in the code. Use modern commenting standards in the TypeScript code.

## Project directory structure

This is the expected project directory structure. Note that `source/` contains two sections: one for code and content directly related to the site and one for the custom build tools.

```text
web-portfolio/
├─ meta/
├─ public/
├─ source/
│  ├─ site/
│  │  ├─ components/
│  │  ├─ content/
│  │  ├─ includes/
│  ├─ builder/
```

## Build system and page generation

The main pages for the site will be built in HTML by hand - no templating. However, there are some things I want to do in custom build tools:

- HTML includes. I want to be able to inject HTML fragments (which are custom HTML elements) into my HTML pages and generate hydrated versions of my HTML pages that are what actually get published to the internet. For example, a Header HTML fragment that can be reused across all pages on the site.
- Markdown conversion. For blog posts, I want to write in Markdown and convert the Markdown to HTML. Then process that HTML to add global HTML includes.

### Technology

The build tools should be written in TypeScript and executed as an `npm` script through `npm run`.

### File processing

#### HTML files

The builder should look for all HTML files in `/source/site`, but not in `/source/site/content`. It should process every file and look for the custom HTML elements defined in `includeNames` in `/source/builder/types.ts`. When it finds a custom element, it should replace that custom element declaration with the HTML fragment in the associated includes file. Refer to the `IncludeResolver` class in `helpers.ts` for context.

#### Markdown files

The builder should parse all Markdown files in `/source/site/content`. It should use a common well documented Markdown parser to convert the Markdown into HTML. The converted HTML file should live alongside the Markdown source file.

As part of the conversion, the builder should handle any custom HTML elements defined in `includeNames` in `/source/builder/types.ts`. This should work the same way as the HTML file behavior described above.

#### Global includes

After processing all HTML files and converting Markdown files to HTML files, the builder should go through all HTML files and inject global includes. All files in `source/site/includes/global` should be injected into every HTML file.

The builder will need a class that understands what the global includes are and contains information about things like where the global include should be placed on a page.

## Site structure

### Landing page

The landing page for the site should include links to the other sections of the site: portfolio, blog, and experiments and projects.

### Portfolio

The main portion of the site is dedicated to my portfolio. This should includes examples of my work, a timeline of jobs and experience, and highlight particularly interesting work projects.

### Blog

There should also be a section of the site dedicated to a blog. There should be an index page that include links to every blog post. Each blog page should should include a link to the previous and next blog post (if they exist).

### Projects

The last section of the site should highlight my programming and other experiments outside of work. This is largely a landing page that includes some high-level information about the projects, then links directly to the projects.

## Design system and CSS architecture

The design for the site should rely on semantic HTML and CSS.

For the CSS, use:

- @property to define custom properties
- Nesting
- Container queries to create components
- Grid
- content-visibility

### CSS architecture

All color and theme-related properties should be custom properties. This makes theme maintenance easier. Theme-related rules should all be contained in their own `.css` file.

Layout and structure CSS should be separated from theme and visual CSS. Follow the Object-oriented CSS (OOCSS) architecture.
