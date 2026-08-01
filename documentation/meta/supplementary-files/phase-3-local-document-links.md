# Phase 3: Local Document Links

## Agent brief

Resolve relative Markdown links using the normalized source-to-public URL index. Links must work from parent posts and supplements, and invalid or unpublished targets must block the build. Do not solve this by globally replacing `.md` with `.html`.

## Prerequisites

Phases 1 and 2 must be complete. Published parent and supplement documents must already have normalized source identities and public URLs.

## Scope

### In scope

- Build an index from source Markdown paths to public URLs.
- Resolve relative local Markdown links from the current document's source directory.
- Support parent-to-supplement, supplement-to-sibling, and supplement-to-parent links.
- Preserve fragments and query strings when rewriting local links.
- Reject nonexistent, unpublished, or ambiguous local Markdown targets.
- Keep external URLs and already-public URLs unchanged.
- Use the same resolver in production and development paths where possible.

### Out of scope

- Copying media files.
- Resolving arbitrary source-directory URLs.
- Rewriting links inside code blocks.
- Changing citation reference syntax.

## Required behavior

Given:

```text
published/post-2/post-2.md
published/post-2/supplements/notes.md
published/post-2/supplements/research.md
```

These links must resolve as follows:

| Markdown target                   | Public result from `post-2.md`              |
| --------------------------------- | ------------------------------------------- |
| `supplements/notes.md`            | `/post-2/supplements/notes.html`            |
| `supplements/research.md#methods` | `/post-2/supplements/research.html#methods` |

From `supplements/notes.md`, `../post-2.md` must resolve to `/post-2.html`.

## Implementation sequence

1. Define a resolver API that accepts the current source path, target href, and document index.
2. Normalize paths without allowing traversal outside `published/`.
3. Separate URL components from local filesystem resolution so fragments and queries survive.
4. Resolve only Markdown targets through the index.
5. Produce actionable errors containing source document, target, and expected location.
6. Integrate the resolver with the Markdown renderer without affecting code blocks or external links.
7. Reuse the resolver in development fallback routing if that path still processes source Markdown directly.

## Gates

### Gate 1: Resolver examples

Before integrating the renderer, run focused checks for:

- parent to supplement;
- supplement to sibling;
- supplement to parent;
- a missing target;
- an unpublished target;
- a target containing a fragment;
- an external URL;
- a traversal attempt.

The gate is clear only when every result is explicit and inspectable.

### Gate 2: Rendered-link inspection

Process a fixture containing each supported link type and inspect the generated HTML. The gate is clear only when local links contain public `.html` URLs, fragments remain intact, external URLs are unchanged, and Markdown inside fenced code is untouched.

### Gate 3: Failure gate

Run the build with a fixture containing a broken local link and a link to an unpublished supplement. The gate is clear only when both builds fail before emitting a misleading successful artifact and each error identifies the source and target.

Remove temporary invalid fixtures after the gate is verified.

### Gate 4: Production and development parity

Run:

```bash
npm run build
npm run dev
```

The gate is clear only when a production-generated page and the equivalent development route contain the same local-link destinations.

## Deliverables

- Source-aware local document-link resolver.
- Markdown renderer integration.
- Development-server integration where applicable.
- Focused resolver and rendering tests.
- Documented failure messages.

## Stop conditions

Stop before proceeding if:

- the resolver can escape the published content root;
- local links depend on output basename collisions;
- broken links are only logged as warnings;
- production and development produce different public URLs.
