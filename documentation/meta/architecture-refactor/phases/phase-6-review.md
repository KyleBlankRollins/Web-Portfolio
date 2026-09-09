Phase 6 review
I ran all three gates independently and then swept the codebase for dead code.

Gate results
Gate Result Evidence
6.1 Clean-checkout production build Pass rm -rf dist && npm run build → 104 files: 12 HTML pages incl. nested supplements, hashed assets, data/blog-manifest.json, data/theme-manifest.json. tsc --noEmit clean. 18 files / 103 tests pass.
6.2 Development workflow Pass Live npm run dev: /, /blog.html, /career.html, /llm-as-sme.html, nested supplement, and both JSON routes all 200; HTML routes carry /@vite/client; unknown routes fall through to Vite.
6.3 Legacy deletion audit Fail No executable legacy path remains — that half is genuinely clean. But the gate's pass condition is "no executable legacy path or stale documentation," and substantial stale documentation survives (below).
The infrastructure deletion itself is done well. git-aware-pipeline.ts, git-utils.ts, GIT_AWARE/FORCE_ALL env plumbing, dev:git-aware/build:git-aware scripts, and the conditional emptyOutDir are all gone with no executable residue. Grep for every retired symbol turns up only historical notes in documentation/meta/, which is intentional.

Dead code: client components superseded by static rendering
The largest find. Phase 5 replaced these with static-content.ts + static-blog-enhancement.ts, but the components were never deleted. None are imported by main.ts, and no <kbr-*> tag for any of them appears in any template or page — build-output.test.ts:148 actively asserts they must not appear in output:

components/post-card/, components/post-list/, components/tag-filter/, components/post-series/, components/supplement-list/ — 10 files, all still registering custom elements
components/timeline/ and components/timeline-entry/ — empty leftover directories
data/blog-manifest.ts — transitively dead; its only four importers are the orphans above
They're tree-shaken out of the bundle, so there's no runtime cost — but they still typecheck, still read as live architecture, and source/site/data/ would be empty without them.

Dead code: builder
helpers.ts:7 — FileSystemHelper, an entire recursive file-discovery class with zero call sites
helpers.ts:76 — StringHelper.escapeRegex, zero call sites
index.ts:148 — handleHotUpdate() returns undefined, which is exactly Vite's default; the hook does nothing
content-discovery.ts:395 — normalizePathForComparison is exported and re-exported through the barrel with no consumer anywhere, including tests
Surviving duplicate path
index.ts:26-67 and index.ts:71-104 are the same routine written twice — identical discover → graph → link-index → reset → rebuild-manifest → process-loop → rebuild-manifest sequence, differing only in logging. Phase 6's stated objective is removing duplicate dev/build paths; this is one, and it's in the file the phase rewrote. It should be a single function with a logging flag.

Relatedly, rebuilds are coalesced twice: the module-level markdownRebuildPromise at index.ts:69 and the rebuildPromise/rebuildQueued loop at dev-server-middleware.ts:46-79. The watcher already serializes, so the module-level singleton is redundant — and being module-level, it's shared across plugin instances rather than scoped to one.

Stale documentation (the Gate 6.3 blocker)
.github/copilot-instructions.md — the git-aware sections were correctly removed, but the module list still names metadata-extractor.ts and template-engine.ts; neither file exists (the project plan records the metadata-comment parser as removed). It also still calls source/builder/index.ts the entry point that "orchestrates all processing," and never mentions scripts/build-site.ts — the new production entry point. Phase 6 step 6 specifically required updating contributor instructions to name the single supported workflow.

source/builder/README.md is the bigger problem — it documents the architecture Phase 6 deleted:

Line 356-365, the Development Workflow mermaid diagram, is built entirely on "Check cache → Cache hit/miss → Cache result" and a "404 Response" node. That is precisely the template-cache and custom-404 machinery step 4 removed. I grepped: there is no cache code anywhere in source/builder/.
Line 371-382, the Build Workflow diagram, still runs "Build Start → … → Inject assets into templates," i.e. the plugin lifecycle, not vite build → build-site.ts.
The "Template Caching" section (~558) describes in-memory caching with invalidation on file change. Doesn't exist.
"Selective Processing" (~566) promises "skip unnecessary file processing during development," directly contradicting the full-rebuild guarantee stated 250 lines earlier at line 312.
"Hot Module Replacement" (~572): "Markdown: Process and reload affected pages" — actual behavior is full map rebuild plus full reload.
Line 463-470 documents FileSystemHelper, the dead class above.
Line 458-460 has three orphaned bullets under HtmlProcessingUtils — "Excludes generated files in /public", "Handles both modified and newly added files." That last one is git change-detection prose, stranded from the deleted git-utils section and now misattributed.
Line 731: "Advanced Git Integration: Support for comparing against different base branches" — leftover git-aware roadmap item.
Line 19 lists types.ts, which doesn't exist. The file tree also omits every file Phases 1-5 added (site-renderer.ts, site-content.ts, site-assets.ts, static-content.ts, career-content.ts, theme-processor.ts, plus four modules) and scripts/build-site.ts.
The Vite config example (line 318-340) shows base: "./" (actual: /) and open: true (not present), and omits manifest: true — the one setting the entire production path depends on.
Lines 57-58 document escapeHtml() twice with different descriptions.
Usage examples (~676) show npm run lint:prose --changed | --drafts | --all; the real scripts are lint:prose (already --changed-only), lint:prose:drafts, lint:prose:all.
source/site/README.md:382 and :390 still document <kbr-post-list> and <kbr-tag-filter> as elements authors can drop into a page — both are dead. source/site/components/README.md:18-20 still lists post-list, post-card, and tag-filter as available components.

Minor
dev-server-middleware.test.ts:12 exercises the data-change case with /source/site/data/experience.json. No such file exists — career data moved to Markdown. The test passes because the watcher only pattern-matches the path string, but it's asserting against a fixture with no counterpart in the project. Remove the orphan components and the whole /data/ watch branch becomes dead too.
public/vite.svg is an unreferenced Vite scaffold leftover, still copied into dist/. public/data/ is an empty untracked directory left from when manifests were written there.
Bottom line
The executable cleanup is complete and verified — Gates 6.1 and 6.2 genuinely pass, and I could not find a single reachable legacy code path. What's missing for 6.3 is step 7 ("Search for every deleted symbol/module name and remove dead imports, comments, docs, and tests"), which was applied to the git-aware machinery but not to the earlier phases' removals. The docs still describe a cached, incremental, plugin-lifecycle builder that no longer exists, and two phases' worth of superseded client components are still on disk.

I've only reported here — no files changed. Happy to do the deletions and the doc rewrite if you want; I'd suggest the component/dead-symbol removal as one commit and the documentation pass as a second.
