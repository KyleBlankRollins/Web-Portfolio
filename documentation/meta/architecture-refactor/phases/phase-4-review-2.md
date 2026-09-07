Confirmed fixed
Finding Evidence
Graph had no production caller buildContentGraph now drives both build paths — index.ts:49 and index.ts:314
Duplicate citation IDs passed silently citations.1.id: duplicate citation ID "a"
Draft date leniency inconsistent date = "next tuesday" accepted; 2025-13-45 still rejected
Theme loaded outside loadSiteSource() LoadedSiteSource.themes + experienceData, consumed via source.themes
[key: string]: any metadata bag removed; citationItems?: CitationDisplay[] now typed
Dead normalizeThemeTimestamp deleted, and the snapshot's "generatedAt": "NORMALIZED" line with it
Gate 4.2 fixtures 3/8 now covers missing fields, invalid URLs, bad series parts, duplicate citations, missing supplement parents
Gate 4.3 repeat/order produces the same render collection for repeated builds reverses input order
tsc clean, 83 tests (up from 78), npm run build succeeds, no data-kbr- in dist.

The wiring is real, not nominal — contentGraph.renderDocuments now feeds documentsToProcess, the link index, and the manifest on both the production and dev-rebuild paths, so the graph's supplement-parent and series-part validations actually execute at build time.

Sort determinism shows up in the output, which is the best evidence it's live:

2025-12-26 /intentional-work-patterns-boundaries.html
2025-12-26 /intentional-work-patterns.html
Date descending, slug ascending on the tie — exactly Step 7, and the blog-manifest snapshot diff records the reorder. Built posts remain structurally correct (one <h1>, tags, citations, <time> each), and the remaining +3 −0 snapshot churn is blank lines only.

The duplicate-citation fix is better than what I suggested — a superRefine that reports the offending array index and id (citations.1.id) rather than a flat message.

Correction to my last review
I called publishedRawValue "a dead field, declared and never produced." Half right, and I understated it. There is a consumer at content-discovery.ts:187-190:

if (supplement.metadata.publishedRawValue !== undefined) {
`... published must be a boolean true or false, received "${...}".`
but nothing anywhere assigns the field:

grep "publishedRawValue\s*=" → (no matches)
So it's not merely an unused declaration — it's an unreachable validation branch. The message it would produce is more actionable than Zod's generic expected boolean, received string, so the cleanest resolution is to delete the branch and rely on Zod, or to have the parser populate the field when published fails type validation. Right now it's the worst of both: dead code carrying a better error nobody sees.

New, minor
experience-data.json is written twice. vite.config.ts sets publicDir: "../../public", so Vite already copies public/data/experience-data.json into dist; site-content.ts:44-50 now emits it again through the renderer. Both files are 13,451 bytes, so nothing breaks — writeBundle runs last and wins. But one output path now has two owners, and if the sources ever diverge, load order silently decides. Pick one: either let publicDir keep it, or exclude it there and let the renderer own it as Step 8 intends.

The experience path escapes siteRoot by traversal. site-renderer.ts:55 builds it as join(siteRoot, "..", "..", "public", "data", "experience-data.json"). With a custom root it silently resolves to nothing:

P3 themes: [ 't.css' ] | experienceData: undefined
That degrades gracefully — site-content.ts guards with if (source.experienceData !== undefined) — but the failure mode is silent omission: if the relative path ever breaks, data/experience-data.json just stops being emitted and the kbr-timeline component 404s at runtime with nothing failing the build. A separate publicDir parameter alongside siteRoot would remove the traversal and let a missing file be an explicit decision.

The discovery log reports a different collection than it processes. index.ts:66 logs discoveryResult.publishableDocuments.length while the work runs over contentGraph.renderDocuments. They agree today (Discovered 9 / Processing 9), so it's cosmetic — but the number no longer describes what happens next.

isBlogPost is now set in two places — frontmatter-parser.ts:162 when a date is present, and markdown-processor.ts:68 for supplement candidates. Both are correct and neither conflicts, but the "what counts as a blog post" rule is split across a parser and a processor. Now that the graph exists and classifies documents, that's the natural single owner.

Assessment
Phase 4's gates now hold. Gate 4.1 was already passing; 4.2 has all eight fixtures with source-file-and-field-path diagnostics; 4.3 has both the repeat build and the reordered-input case, with theme JSON timestamp-free. The graph is the data input to rendering rather than an unused artifact, which was the whole point of the phase.

Nothing here blocks Phase 5. The experience-data.json double-write is the one I'd resolve before building on it, since Phase 5 consumes graph collections for first paint and two owners for a data file is the kind of thing that gets debugged at the wrong layer later.
