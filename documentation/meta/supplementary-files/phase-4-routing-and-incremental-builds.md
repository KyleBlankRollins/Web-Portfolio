# Phase 4: Routing and Incremental Builds

## Agent brief

Make nested supplement URLs work in development and make git-aware builds correctly respond to supplement creation, deletion, publication changes, and parent changes. Preserve the existing root-level page and blog routes.

## Prerequisites

Phases 1 through 3 must be complete. The normalized document index, supplement manifest contract, and local-link resolver must already exist.

## Scope

### In scope

- Route nested `.html` URLs through generated documents in development.
- Resolve development requests using normalized public URLs, not ad hoc basename lookup.
- Block direct source-content access, including nested published paths.
- Invalidate generated documents and manifests when relevant Markdown files change.
- Handle supplement creation and deletion.
- Handle `published` frontmatter changes.
- Handle parent directory and parent-post changes.
- Preserve existing root-level pages, blog posts, and manifest endpoints.

### Out of scope

- Media watcher/copy behavior.
- A new client-side navigation system.
- Reworking unrelated Vite HMR behavior.

## Implementation sequence

1. Extend generated-document lookup to accept nested public paths.
2. Update development route matching for `/post/supplements/file.html`.
3. Confirm source path blocking covers `/content/`, `/published/`, and nested variants.
4. Trace git-aware changed-file classification for all Markdown files below `published/`.
5. Add invalidation rules for parent and supplement relationships.
6. Ensure manifest regeneration occurs when a supplement is added, removed, or changes publication state.
7. Verify stale generated files are not retained after deletion.

## Gates

### Gate 1: Route matrix

Before editing the watcher, verify these development requests:

- existing root-level post;
- nested parent post;
- published supplement;
- nonexistent nested HTML;
- direct `/content/...` source path;
- direct `/published/...` source path.

The gate is clear only when each request has an observed status and content type, with source paths blocked.

### Gate 2: Change matrix

Use isolated temporary changes or fixtures to prove each event causes the required work:

| Change                    | Required result                                   |
| ------------------------- | ------------------------------------------------- |
| edit supplement           | supplement HTML and parent manifest entry refresh |
| add supplement            | nested HTML and parent link appear                |
| set `published: false`    | supplement HTML and parent link disappear         |
| delete supplement         | stale HTML and manifest entry disappear           |
| edit parent               | parent HTML and manifest refresh                  |
| add/remove post directory | document map and manifest refresh                 |

The gate is clear only when the generated output is inspected after every case.

### Gate 3: Git-aware build

Run:

```bash
npm run build:git-aware
```

The gate is clear only when changed supplements are processed, unchanged documents are not needlessly regenerated where the pipeline promises incremental behavior, and deletions do not leave stale output.

If the repository's current git-aware behavior cannot safely detect directory changes, stop and document the concrete limitation before changing unrelated pipeline behavior.

### Gate 4: Browser verification

Run the development server and open the parent and nested supplement URLs. The gate is clear only when both render the correct template, internal links work, the source directory remains inaccessible, and the browser console has no new errors.

## Deliverables

- Nested development routing.
- Source-content blocking for nested paths.
- Git-aware invalidation and deletion handling.
- Regression checks for root-level routes.
- Browser verification notes.

## Stop conditions

Stop before proceeding if:

- a deleted or unpublished supplement remains reachable;
- a stale manifest survives a supplement change;
- direct source content is served by the development server;
- root-level routes regress while nested routing is added.
