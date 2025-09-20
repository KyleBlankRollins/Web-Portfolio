# Feature Roadmap

## Blog

### Blog post persistent highlighting

Using local storage, implement a UI that allows people to select arbitray blog post content (but only blog post content) and apply one of several highlight colors. This feature is strictly limited to individual readers and their specific browser because it'll be using local storage.

### Landing page post grid

`post-list` should use CSS Grid to create a a two-column layout for blog posts.

### Tag filtering updates

We should add a few UX features to the tags filter.

1. Each tag should show the number of blog posts that use that tag.
2. In the list of tags, only show a maximum of 5 tags at a time. Show the tags that are used on the most posts first. Add a "more tags" button that expands the number of visible tags by 5. If that button is clicked again, show all tags and replace it with a "less tags" button. The "less tags" button hides all tags except the original top 5.
3. Instead of a "clear filter" button, clear the filter when a selected tag is clicked again. When a tag is already selected and another tag is clicked, clear the filter and set the new tag as the filter.

## Infrastructure

### CSS bundling

If possible, the builder or Vite should bundle all of the CSS files for the site to make everything as performant and data saving as possible. Need to look at modern approaches to this, as I'm not sure what the best practice is here now.
