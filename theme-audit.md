We need to make sure that the site is set up to respect the new theme system. We created the system, but haven't propagated the new custom variables throughout the site. There are some old CSS rules spread across the site that no longer reference real custom properties.

We will break this work into chunks, as there are a lot of files to process.

## Sequence of work

1. Look at `/source/site/index.html` and all of the HTML files in `/source/site/templates` and `source/site/pages`. If there are references to CSS classes or custom properties that not longer exist, replace them with a reasonable alternative from one of the CSS files in `/source/sit/styles/themes`.
2. Stop. Ask if we're ready to proceed to the next step.
3. Look at styles in files in `/source/site/components/icon` and `/source/site/components/image-lightbox`. If there are references to CSS classes or custom properties that not longer exist, replace them with a reasonable alternative from one of the CSS files in `/source/sit/styles/themes`.
4. Stop. Ask if we're ready to proceed to the next step.
5. Look at styles in files in `/source/site/components/navigation` and `/source/site/components/post-card`. If there are references to CSS classes or custom properties that not longer exist, replace them with a reasonable alternative from one of the CSS files in `/source/sit/styles/themes`.
6. Stop. Ask if we're ready to proceed to the next step.
7. Look at styles in files in `/source/site/components/post-list` and `/source/site/components/table-of-contents`. If there are references to CSS classes or custom properties that not longer exist, replace them with a reasonable alternative from one of the CSS files in `/source/sit/styles/themes`.
8. Stop. Ask if we're ready to proceed to the next step.
9. Look at styles in files in `/source/site/components/tag-filter` and `/source/site/components/theme-switcher`. If there are references to CSS classes or custom properties that not longer exist, replace them with a reasonable alternative from one of the CSS files in `/source/sit/styles/themes`.
10. Stop. Ask if we're ready to proceed to the next step.
11. Look at styles in files in `/source/site/components/timeline` and `/source/site/components/timeline-entry`. If there are references to CSS classes or custom properties that not longer exist, replace them with a reasonable alternative from one of the CSS files in `/source/sit/styles/themes`.
12. Stop. Ask if we're ready to proceed to the next step.
13. Look at styles in `/source/site/components/anchor-copy.ts`. If there are references to CSS classes or custom properties that not longer exist, replace them with a reasonable alternative from one of the CSS files in `/source/sit/styles/themes`.
