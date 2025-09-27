# Todos

This is a list of things that I need or want to do to improve `kyleblankrollins.com`.

## Blog

### Posts

[ ] Fix inline anchor styles. They're currently impossible to see unless you hover over them.
[ ] Add admonition web components
[ ] Add tl;dr component
[ ] Add post primary image component
[ ] Add code example component
[ ] Don't transform markdown code comments into HTML

##

### Blog post persistent highlighting

Using local storage, implement a UI that allows people to select arbitray blog post content (but only blog post content) and apply one of several highlight colors. This feature is strictly limited to individual readers and their specific browser because it'll be using local storage.

## Infrastructure

### Logger

Create a logger utility class that can be used for scripts. Should handle all console output, including colors. BuildLogger should be incorporated into this class.

### CSS bundling

If possible, the builder or Vite should bundle all of the CSS files for the site to make everything as performant and data saving as possible. Need to look at modern approaches to this, as I'm not sure what the best practice is here now.

## Components

### Create code example component

- Make code examples wrap
- Make code examples prettier
- Add code example syntax highligting
- Add input and output option

### Theme switcher

In the theme switcher's `connectedCallback`, we seem to be bypassing the actual themes with fallbacks. Need to figure out why the themes aren't working and the fallbacks are executed.

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
