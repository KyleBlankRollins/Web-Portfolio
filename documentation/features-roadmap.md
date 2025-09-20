# Feature Roadmap

## Blog

### Blog post heading anchor link copy

Each heading in a blog post should have a button that copies a link to that heading's full URL, allowing people to share the link and land on the same part of the blog post.

### Filter blog posts by tag collection

This is partially enabled in `post-list`, but hasn't been fully implemented. This feature should allow filtering by URL query parameter. When people click a tag button anywhere on the site, it should bring them to `blog.html` and apply that tag to the filter.

### Blog post persistent highlighting

Using local storage, implement a UI that allows people to select arbitray blog post content (but only blog post content) and apply one of several highlight colors. This feature is strictly limited to individual readers and their specific browser because it'll be using local storage.

## Infrastructure

### CSS bundling

If possible, the builder or Vite should bundle all of the CSS files for the site to make everything as performant and data saving as possible. Need to look at modern approaches to this, as I'm not sure what the best practice is here now.
