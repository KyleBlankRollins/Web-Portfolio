# Local host admin site

I'd like to create a UI for managing blog posts. It should handle admin things, not creating/editing content. For example, post state management and reports.

This site should only run locally and use JSON files as a data transfer medium.

## Data architecture

Blog post data should be sourced from the [backlog markdown file](./source/site/content/__drafts/backlog.md). The markdown file will need to be translated into a JSON file that the admin site can parse. And when updates are made in the admin site, they should be reflected in the markdown file because it is the data source.

## Data models

These data models describe the data that should be available. These are necessary for the translation to and from the source markdown file and the admin site.

### Backlog markdown file

<!-- Need to describe the overall file structure: where data lives and how to work with it. -->

### Blog post

<!-- Need to describe the parts of a blog post's metadata. Describe how to find them and work with them. -->

## Blog post management page

This page shows all planned blog posts and their current status. There are three high-level sections: a Kanban status board, a completed blog posts section, and a section that shows blog posts that have been discarded.

### Kanban board

The Kanboard board should contain every blog post that has a state that is not "published". Each Kanban board post can be in one state of:

- "planned"
- "researching"
- "outlining"
- "writing"
- "editing"

When a post is in the "editing" column, there should be a button on the card with the text "Published". When clicked, this button updates the blog post's state to "published", which moves the post out of the Kanban board and into the completed blog posts section. It also records the date the blog post was published. (could use time of click or blog post frontmatter)

### Completed posts section

The completed blog posts section should contain a searchable and sortable list of all completed blog posts. Searching should search the blog title, description, and content. Sorting should allow ascending and descending sort based on alphabetical order of title and publish date.

Posts in the completed blog posts section should be draggable. I should be able to drag and drop a post from the section to a column in the Kanban board to faciliate putting a blog post back into the content lifecycle.

### Discarded posts section

This section contains blog posts that have been deleted or blog post ideas that were abandaned for one reason or another. When a blog post card is dragged into this section, there should be a modal that asks what the reason is for discard the blog post. The discard reason should be visible for all posts in this section.

Posts in this section cannot be moved out of the section. If I want to use the blog post again in the future, I should create a new blog post that addresses the reason the original blog post was discarded.

### Drag and drop

Blog post cards on the management page should be movable. I should be able to drag and drop cards to move them through the content lifecycle.

### Content lifecycle

These are the content lifecycle states:

1. planned
2. researching
3. outlining
4. writing
5. editing
6. published

A post can move backwards to any previous state. However, it can only ever move one state forward. When a post is in the "editing" state, it can be moved to the completed posts section. A post can only move to the completed posts section from the "editing" state.

In addition to the above, all blog posts can be moved to the discarded posts section from any point in the content lifecycle. However, posts in the discard section cannot be moved out of the discard section.
