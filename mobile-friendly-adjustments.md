The mobile experience for KBR is not ideal. There are a lot of tweaks we can make to improve this experience. All of the changes suggested in this document apply _only_ to mobile devices, which typically means devices with narrow screens.

## Headings

The heading line heights should be reduced so that they're more compact on mobile devices.

Also, the larger headings (H1 and H2) should be smaller on mobile devices. Not enough to make distinguishing between them and smaller headings difficult, but on smaller mobile screens we need to be careful with how much digital real esatate everything uses.

## Site-wide margins

Generally, margins should be significantly smaller, if not eliminated entirely - particularly left and right margins. We need to take up as much horizontal space as possible becuase there isn't much to begin with on mobile devices.

## Table of contents

This applies to the component as it appears on every page. The table of contents is in the right place. However, we should make 2 major improvements for the mobile experience:

- The table of contents should be expandable and collapsible
- The table of contents should be sticky and always available for expanding and collapsing

## Theme switcher

The theme switcher needs a more vertical layout on mobile devices. Currently, the switcher is unusable on mobile devices because not all of it is visble.

## Page specific changes

### Portfolio

Generally, this page's layout is pretty good. however, the web project cards need to be reworked for the mobile experience. The current layout has the project image on the left and description on the right. I'm inclined to show no image at all to save space in the mobile layout, but perhaps there's a space-efficient way to keep them. Suggest options if this is true.

### Career

The timeline on the career page needs a lot of work. The left and right margins and padding are way too much, leaving the `kbr-timeline-entry` components on the page with little room to spread out horizontally. Ideally, these cards would take the full width of the device display.

There's also way too much space after the H2 headings on the page.

## Blog

The blog page suffers from problems similar to those on the Career page. The `kbr-post-card` components on the page don't have enough room to spread out horizontally.

## Blog post

Headings on blog posts should not show the anchor copy component on the right side. This reduces the horizontal space available for the heading text. Instead, if possible, the anchor copy component should be rendered in-line at the end of the heading. If this isn't easily doable, then we should not show the anchor copy component at all on mobile devices.
