Three things, in dependency order — each one is easier once the one before it lands.

---

1. Invert the build: make rendering a pure function, demote Vite to an asset pipeline

Right now the generator is smuggled into Vite's plugin lifecycle. Content is processed in buildStart (source/builder/index.ts:396), HTML
is emitted in generateBundle (index.ts:427) with enforce: "post", and the dev server is a second, independent implementation of the same
render path (dev-server-middleware.ts:186).

The tells that this is fighting the tool, not using it:

- HtmlProcessingUtils.normalizeAssetPlacement (html-utils.ts:102-146) — 45 lines plus a 20-line comment that exist solely to move <link 
  rel=stylesheet> back into <head> after Vite injected it wherever the entry <script> happened to sit in the page body.
- injectDevAssets (dev-server-middleware.ts:350) adds <script src="/main.ts"> in dev; removeDevelopmentEntryScript
  (html-bundle-processor.ts:207) regex-strips it back out at build. Two functions to undo each other.
- The dev server hand-rolls its own 404, its own manifest endpoints, its own MIME headers, and its own template invocation — so dev and
  prod can silently disagree. AF-13 in your audit is exactly this class of bug, and the **snapshots**/ suite exists largely to police the
  drift.

Replacement: one pure core — renderSite(content, assetManifest) → Map<outputPath, string>. Build = call it, write files. Dev = call it,
serve from the map, invalidate on watch events. Vite runs first and independently, building only main.ts + CSS and emitting manifest.json;
the renderer reads that manifest and writes the asset tags itself, in the right place, once. No generateBundle hook, no emit dance, no
placement normalization, no dev/prod divergence.

Delete while you're in there: the entire git-aware incremental subsystem — git-aware-pipeline.ts (163), git-utils.ts (281), and ~150 lines
of stale-output/missing-output reconciliation in index.ts:66-292. That's ~600 lines of cache-invalidation logic, historically the
buggiest category of code there is, protecting a one-second build. If incrementality is ever needed again, content-hash it in ten lines.

2. Replace the regex template engine with typed component rendering

TemplateEngine.substituteVariables (modules/template-engine.ts:76-164) makes five passes over the whole document, constructing a fresh
RegExp per variable per pass, and decides HTML escaping by variable name via a hardcoded allowlist:

const rawHtmlVariableNames = new Set(["content", "head", "header", "footer", "tagsHtml", ...]);

Escaping should be a property of the call site, not of what you happened to name the field. This design has already produced correctness
bugs (AF-08: literal braces deleted from content; AF-11: generateTagsHtml skipped escaping). It also has no includes — which is why
TemplateProcessor.loadPartial (template-processor.ts:69) reads partials off disk and passes them in as triple-brace variables — and no
loops, which is why every list on the site had to become a client-side component (see #3). Meanwhile HTML is also being built by string
concatenation elsewhere: injectTitleAndMetadata, createBlogMetadataHTML (markdown-processor.ts:182-220), generateTagsHtml
(html-utils.ts:190).

Replacement: you already ship Lit. @lit-labs/ssr renders your existing LitElement components to HTML at build time with declarative shadow
DOM, and they hydrate client-side. Templates become html\`functions with real parameters, real composition, escaping by default, and type
errors when a page forgetsdescription. base.html/blog-post.html/ the three partials become four component functions. The alternative if
you'd rather not couple to Lit's SSR: JSX viapreact-render-to-string. Either way, template-engine.ts, template-processor.ts,
html-utils.ts, and the metadata-comment extractor go away — and so does <!-- title: ... --> as a page metadata format
(pages/blog.html:1`), which is a parser looking for a data structure.

3. Give content a validated schema, and actually generate the listing pages

Two problems that are really one problem.

Frontmatter is parsed by hand, field by field, with no schema. frontmatter-parser.ts has a dedicated regex method per key — parseTitle,
parseDescription, parseTags, parseSeries, parseCitations (262 lines, no YAML library). Everything downstream is typed as FrontmatterData /
TemplateVariables with [key: string]: any, so a typo'd tag: instead of tags: fails silently and ships. ContentDiscovery (439 lines) then
reconstructs the content graph from directory conventions, and inferParentUrlFromSupplementPath (index.ts:174) re-derives parent/child
relationships by slicing path strings — a relationship that should be a typed edge, not string surgery.

Replacement: real YAML parse → Zod schema per content type (post, supplement, page) → a typed content graph built once, with parent/child
as actual references. Invalid frontmatter fails the build with a field-level message instead of vanishing.

And your static site generator doesn't statically generate its most important page. pages/blog.html ships an empty shell: <kbr-tag-filter>

- <kbr-post-list>, which fetch /data/blog-manifest.json at runtime (site/data/blog-manifest.ts:6) and render into shadow DOM. Same for
  <kbr-post-series>, <kbr-supplement-list>, <kbr-home-highlights>, and <kbr-icon> — which fetches one HTTP request per icon (icon.ts:166).
  All of that data is fully known at build time. The cost is no-JS blankness, layout shift, and a blog index that search engines and link
  previewers see as empty.

Once #2 gives you loops in templates, the fix is mechanical: render the post list, tag list, series nav, and supplement list into the HTML
at build time; keep the components as progressive enhancement over server-rendered markup (tag filtering stays client-side, it just
filters DOM that already exists); inline icons at build time. The manifest JSON survives only for genuinely dynamic filtering.

---

The scrap-it question

Honest read: Astro would subsume all three. Content collections with Zod schemas (#3), component templating with build-time rendering and
islands (#2), and a build that isn't fighting its bundler (#1) are its three headline features. You'd port ~10,700 lines of Lit components
and CSS — which is the actual asset here, and mostly ports as-is — and delete ~4,500 lines of builder.

The hinge is what the builder is for. If it's infrastructure, replace it; nobody hiring you will read git-aware-pipeline.ts. If the
bespoke SSG is itself a portfolio exhibit — a systems-design artifact you want to point at — then keep it and do #1→#2→#3 in that order,
which gets you the same architecture with your name on it.

Either path, two things work in your favor: the full-build snapshot test in build-output.test.ts gives you a real regression net for a
rewrite this size, and a 1-second build means you can iterate fast and throw away the incrementality machinery entirely.

✻ Sautéed for 2m 17s

※ recap: You wanted three architecture improvements for a major refactor of your static site generator; I reviewed the code and delivered
them. Next: decide whether to keep the bespoke builder and do them in order, or replace it with Astro. (disable recaps in /config)

❯ hmm. One of the reasons I built it this way is that I _want_ HTML files on disk to serve as templates. I greatly dislike defining HTML in
JS or TS files. At the time, doing something like `{{{header}}}` for injecting content made sense. But if there's a better way to handle  
includes in HTML files, I'd love to hear it.

⏺ That constraint changes the recommendation, and it's a reasonable one to hold. Let me check something first.

Searched for 1 pattern (ctrl+o to expand)

⏺ Good push-back, and worth saying plainly: the current engine is the reason HTML lives in TS at all. Because it has no loops or includes,
every repeated structure had to be built by string concatenation in TypeScript:

- citation-processor.ts:260 — the entire <section class="citations"> block
- html-utils.ts:198 — tag buttons
- markdown-processor.ts:188 + createBlogMetadataHTML — the post <h1> and metadata block
- template-processor.ts:69 — loadPartial() reading files off disk to fake an include

So we agree on the goal; I aimed at the wrong target. The real defect isn't {{{header}}} as syntax — it's that the engine manipulates
strings with regexes instead of a parsed document, and that missing {% for %} pushed markup into .ts files. Fix that and markup moves back
into HTML files.

Two ways to do this, both keeping templates as files on disk.

---

Option A: a real file-based template engine (Nunjucks, LiquidJS, Eta)

Templates stay .html on disk. You get inheritance, includes, loops, and autoescaping-by-default, with parse errors that name a file and
line number instead of silently substituting "".

The structural win is template inheritance, which your two layouts want badly — base.html and blog-post.html currently duplicate the whole
doctype/head/header/footer scaffold. In Nunjucks:

  <!-- templates/base.html -->
  <!doctype html>
  <html lang="en">
    <head>{% include "partials/head.html" %}</head>
    <body>
      {% include "partials/header.html" %}
      {% block layout %}<main class="page-content">{{ content | safe }}</main>{% endblock %}
      {% include "partials/footer.html" %}
    </body>
  </html>

  <!-- templates/blog-post.html -->

{% extends "base.html" %}
{% block layout %}
  <main class="blog-post-layout">
    <aside class="blog-toc-sidebar">
      <div class="blog-toc-sticky-container">
        {% if series %}
          <kbr-post-series series-name="{{ series.name }}" current-part="{{ series.part }}"></kbr-post-series>
        {% endif %}
        <kbr-table-of-contents></kbr-table-of-contents>

        {# was generateTagsHtml() in html-utils.ts #}
        {% if tags %}
        <div class="blog-post-tags">
          <span class="tags-label">Tags:</span>
          <div class="tag-list">
            {% for tag in tags %}<button class="blog-tag" data-tag="{{ tag }}">{{ tag }}</button>{% endfor %}
          </div>
        </div>
        {% endif %}
      </div>
    </aside>
    <article class="blog-post-content glass-surface">{{ content | safe }}</article>

  </main>
  {% endblock %}

Note what happens to escaping: {{ tag }} is escaped by default and | safe marks the exception at the point of use. That deletes the
rawHtmlVariableNames allowlist in template-engine.ts:81 — the design where escaping was a property of what you named a variable — without
you writing any of it. The citations section and the blog metadata block move out of TypeScript the same way generateTagsHtml does above.

Picking one: Nunjucks has the best inheritance model and is what Eleventy defaults to (stable, low churn). LiquidJS is more actively
maintained with near-identical ergonomics. Eta is tiny and fast but uses <% %> JS syntax, which is closer to the thing you're avoiding.

The honest cost: {% %} isn't HTML, so Prettier won't format these files and you'd .prettierignore the template directory (VS Code
extensions handle highlighting fine). If that's a dealbreaker, go to Option B.

Option B: valid HTML + an AST transform pipeline (PostHTML or rehype)

Templates remain actually valid HTML — Prettier formats them, editors highlight them natively, no custom syntax. Includes become
HTML-native elements resolved by parsing the document into a tree and transforming it, then serializing. posthtml + posthtml-include +
posthtml-expressions does this today:

  <!doctype html>
  <html lang="en">
    <head><include src="partials/head.html"></include></head>
    <body>
      <include src="partials/header.html"></include>
      <main class="page-content">{{ content }}</main>
      <include src="partials/footer.html"></include>
    </body>
  </html>

The deeper advantage is that a serializer, not your regexes, produces the output — malformed HTML becomes structurally impossible, and
transforms compose as tree passes (inline the icon SVGs, rewrite asset URLs, add heading anchors) instead of stacking more String.replace
calls. rehype (unified/parse5) is the same idea with a larger plugin ecosystem.

The cost is the mirror image of A: loops and conditionals via posthtml-expressions are noticeably clunkier than Nunjucks', and you're
assembling a pipeline rather than adopting a finished engine.

---

What I'd do

Nunjucks, unless Prettier-formatting your templates is non-negotiable — then PostHTML. Both are ~200 lines of adoption that delete
template-engine.ts, template-processor.ts, loadPartial, the escaping allowlist, and every HTML string literal in the builder except the
markdown renderer's (which is marked's legitimate business).

Recommendations #1 and #3 stand unchanged — they're orthogonal to this choice. And #3 gets easier, not harder: once templates have {% for
  %}, rendering the blog index and tag lists at build time is a template change, not a new subsystem.

✻ Churned for 1m 15s

※ recap: You're planning a major refactor of your custom static site generator, and we just settled the templating question: keep HTML files
on disk and adopt Nunjucks (or PostHTML if Prettier formatting matters). Next: pick one and start replacing the regex template engine.

❯ /usage

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Settings Status Config Usage Stats

Session

  <!doctype html>
  <html lang="en">
    <head><include src="partials/head.html"></include></head>
    <body>
      <include src="partials/header.html"></include>
      <main class="page-content">{{ content }}</main>
      <include src="partials/footer.html"></include>
    </body>
  </html>

The deeper advantage is that a serializer, not your regexes, produces the output — malformed HTML becomes structurally impossible, and
transforms compose as tree passes (inline the icon SVGs, rewrite asset URLs, add heading anchors) instead of stacking more String.replace
calls. rehype (unified/parse5) is the same idea with a larger plugin ecosystem.

The cost is the mirror image of A: loops and conditionals via posthtml-expressions are noticeably clunkier than Nunjucks', and you're
assembling a pipeline rather than adopting a finished engine.

---

What I'd do

Nunjucks, unless Prettier-formatting your templates is non-negotiable — then PostHTML. Both are ~200 lines of adoption that delete
template-engine.ts, template-processor.ts, loadPartial, the escaping allowlist, and every HTML string literal in the builder except the
markdown renderer's (which is marked's legitimate business).

Recommendations #1 and #3 stand unchanged — they're orthogonal to this choice. And #3 gets easier, not harder: once templates have {% for
  %}, rendering the blog index and tag lists at build time is a template change, not a new subsystem.
