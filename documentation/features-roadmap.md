# Feature Roadmap

## Blog

### Blog post persistent highlighting

Using local storage, implement a UI that allows people to select arbitray blog post content (but only blog post content) and apply one of several highlight colors. This feature is strictly limited to individual readers and their specific browser because it'll be using local storage.

### Tag filter

Active tag should move to the top of the tag list. When a tag is no longer the active tag, it should return to its original position.

## Infrastructure

### CSS bundling

If possible, the builder or Vite should bundle all of the CSS files for the site to make everything as performant and data saving as possible. Need to look at modern approaches to this, as I'm not sure what the best practice is here now.

## Components

### Styles

Double check all styles that should be injected and shared in component shadow DOM. Ensure that they exist in the shared styles module. Ensure that styles aren't defined in multiple places.
