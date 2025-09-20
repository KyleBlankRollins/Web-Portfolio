# Feature Roadmap

## Blog

### Blog post page-level navigation

This will be a web component that handles page-level navigation for blog posts, making it easy to move around on a post. This is a table of contents for the page.

It should be located on the left side of the page.I'll probably need to create another template file for blog posts, as I want a different layout for blog posts than the top-level site pages. The blog post template should not replicate content in `base.html`, but extend it.

Use CSS Grid to put the table of contents on the left and the blog post content on the right. I will likely explore further layout changes that should apply to every blog post later.

### Blog post heading anchor link copy

Each heading in a blog post should have a button that copies a link to that heading's full URL, allowing people to share the link and land on the same part of the blog post.

### Filter blog posts by tag collection

This is partially enabled in `post-list`, but hasn't been fully implemented. This feature should allow filtering by URL query parameter. When people click a tag button anywhere on the site, it should bring them to `blog.html` and apply that tag to the filter.

### Blog post persistent highlighting

Using local storage, implement a UI that allows people to select arbitray blog post content (but only blog post content) and apply one of several highlight colors. This feature is strictly limited to individual readers and their specific browser because it'll be using local storage.

## Infrastructure

### CSS copy script

The current component css copy script in `package.json` uses powershell. We should make this a platform agnostic script.

### CSS bundling

If possible, the builder or Vite should bundle all of the CSS files for the site to make everything as performant and data saving as possible. Need to look at modern approaches to this, as I'm not sure what the best practice is here now.
