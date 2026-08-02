# Design Fixes Implementation Plan

This plan turns the findings in [fable-design-audit.md](./fable-design-audit.md) into gated implementation phases.

## Current State

Some audit work is already present in the repository and should be preserved:

- Portfolio content reserves space for its fixed TOC at wide viewports.
- The shared page wrapper has a content-width constraint.
- Theme attributes are bootstrapped before first paint.
- The theme switcher is slotted into the navigation header instead of floating over content.
- Blog heading spacing has already been scoped to blog content.

The remaining work is implementation and verification, not a redesign.

## Phase Order

1. [Phase 1: Shared Shell and Page Metadata](./phase-1-shared-shell.md)
2. [Phase 2: Layout, Typography, and Anchors](./phase-2-layout-typography.md)
3. [Phase 3: Home Page and Blog Card Content](./phase-3-content-discovery.md)
4. [Phase 4: Mobile and Theme Controls](./phase-4-mobile-themes.md)
5. [Phase 5: Cross-Viewport Verification](./phase-5-verification.md)

## Working Rules

- Read the current implementation before editing. Existing audit fixes may have changed the original code path.
- Keep each phase focused on its own acceptance criteria.
- Do not start the next phase until the current phase gate is cleared.
- Preserve existing theme tokens, Lit component conventions, and static-builder behavior.
- Use root-cause fixes instead of page-specific overrides when the problem belongs to a shared abstraction.
- Avoid changing content meaning while improving structure or presentation.

## Global Completion Gate

The work is complete only when all phase gates are cleared and the final verification confirms:

- No content is hidden or overlapped at the tested desktop and mobile widths.
- Footer links work from every page.
- Heading anchors and TOC links resolve to unique targets.
- Typography hierarchy is readable in both themes and color schemes.
- The homepage exposes useful content without requiring a second navigation click.
- Production and development builds both pass.
- No new TypeScript, build, accessibility, or browser-console errors are introduced.
