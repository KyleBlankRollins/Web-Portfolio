# Todos

This is a list of things that I need or want to do to improve `kyleblankrollins.com`.

## Blog

### Posts

[x] Add code example component (Phase 1 & 2 complete: Visual polish + Syntax highlighting)
[ ] Don't transform markdown code comments into HTML

### Layout

Move tags to be above TOC

### Blog post persistent highlighting

Using local storage, implement a UI that allows people to select arbitray blog post content (but only blog post content) and apply one of several highlight colors. This feature is strictly limited to individual readers and their specific browser because it'll be using local storage.

## Infrastructure

### Logger

Create a logger utility class that can be used for scripts. Should handle all console output, including colors. BuildLogger should be incorporated into this class.

### Performance optimization

If possible, the builder or Vite should bundle all of the CSS files for the site to make everything as performant and data saving as possible. Need to look at modern approaches to this, as I'm not sure what the best practice is here now.

### Accessibility optimization

Need to make sure that the site is accessible for everyone.

## Components

### Create code example component

- Make code examples wrap
- Make code examples prettier
- Add code example syntax highligting
- Add input and output option

### Admonitions

Fix the styles. Make icons bigger, use the right colors for the different types, tweak visual appearance. Shouldn't take up full width if it doesn't need to.

### Procedure

Add a procedure component that handles rendering ordered lists in blog posts. Could also look into adding some form of progressive disclosure through state.

### Procedure code context builder

As readers scroll a procedure, add step code examples to a larger code box to the side. By the end of the procedure, should have a larger, more contextful code example.

## Credits page

Create a new credits page that lists the technology used to build the site. Note that Claude helped build it. Can be used in the future to credit artists, musicians, or other people who create things that I use in the site.

## Career page

[ ] Add job description for MongoDB team lead
[ ] Add job description for MongoDB senior education engineer
[ ] Add job description for 3M Senior Technical Writer/Scrum Master
[ ] Improve layout of cards and arrangement of info

## Portfolio page

[ ] Improve page layout. Consider using masonry layout.
[ ] Add more interesting visual elements to separate sections.
