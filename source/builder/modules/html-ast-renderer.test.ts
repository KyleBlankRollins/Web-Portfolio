import { describe, expect, it } from "vitest";
import { HtmlAstRenderer } from "./html-ast-renderer.js";
import { normalizeDom } from "../test-support/normalized-dom.js";

describe("HtmlAstRenderer", () => {
  it("renders escaped text and attributes through nested paths", () => {
    const result = new HtmlAstRenderer().render(
      '<p title="{{ series.name }}">{{series.name}} {{series.part}}</p>',
      { series: { name: "A & B", part: 0 } }
    );

    expect(result.html).toBe('<p title="A &amp; B">A &amp; B 0</p>');
  });

  it("applies conditionals while preserving zero and empty arrays", () => {
    const result = new HtmlAstRenderer().render(
      '<p data-kbr-if="series.part">zero</p><p data-kbr-if="items">items</p><p data-kbr-if="missing">missing</p>',
      { series: { part: 0 }, items: [] }
    );

    expect(result.html).toBe("<p>zero</p>");
  });

  it("expands zero, one, and multiple loop iterations with local scope", () => {
    const renderer = new HtmlAstRenderer();

    expect(
      renderer.render(
        '<ul><template data-kbr-for="item of items"><li>{{item.name}}</li></template></ul>',
        { items: [] }
      ).html
    ).toBe("<ul></ul>");
    expect(
      renderer.render(
        '<ol><template data-kbr-for="item of items"><li>{{item.name}}</li></template></ol>',
        { items: [{ name: "one" }] }
      ).html
    ).toBe("<ol><li>one</li></ol>");
    expect(
      renderer.render(
        '<ul><template data-kbr-for="item of data.items"><li data-kbr-if="item.visible">{{item.name}}</li></template></ul>',
        {
          data: {
            items: [
              { name: "one", visible: true },
              { name: "two", visible: false },
              { name: "three", visible: true },
            ],
          },
        }
      ).html
    ).toBe("<ul><li>one</li><li>three</li></ul>");
  });

  it("rejects invalid loop expressions with the source origin", () => {
    expect(() =>
      new HtmlAstRenderer().render(
        '<template data-kbr-for="item in items"><p>{{item}}</p></template>',
        { items: [] },
        { sourcePath: "templates/list.html" }
      )
    ).toThrow(
      'data-kbr-for requires the form "item of collection" (templates/list.html:line 1)'
    );
  });

  it("does not interpolate script or style contents", () => {
    const result = new HtmlAstRenderer().render(
      "<script>const value = '{{ value }}';</script><style>.x::after{content:'{{ value }}'}</style>",
      { value: "changed" }
    );

    expect(result.html).toContain("{{ value }}");
  });

  it("inserts raw fragments without parsing or escaping them", () => {
    const raw = '<x-card title="&amp;">{{ literal }}</x-card>';
    const result = new HtmlAstRenderer().render(
      '<template data-kbr-html="content"></template>',
      { content: raw }
    );

    expect(result.html).toBe(raw);
  });

  it("preserves an opaque raw fragment inside a complete layout", () => {
    const raw = '<x-card title="&amp;">{{ literal }}</x-card>';
    const result = new HtmlAstRenderer({
      templates: new Map([
        [
          "base.html",
          '<!doctype html><html><body><template data-kbr-slot="content"></template></body></html>',
        ],
      ]),
    }).renderPage(
      '<template data-kbr-page data-layout="base.html"></template><template data-kbr-html="content"></template>',
      { content: raw }
    );

    expect(result.html).toBe(
      '<!DOCTYPE html><html><head></head><body><x-card title="&amp;">{{ literal }}</x-card></body></html>'
    );
  });

  it("extracts page metadata and expands includes", () => {
    const result = new HtmlAstRenderer({
      partials: new Map([["header.html", "<header>Header</header>"]]),
    }).render(
      '<template data-kbr-page data-layout="base.html"><meta name="title" content="Home"></template><template data-kbr-include="header.html"></template>',
      {}
    );

    expect(result.metadata).toEqual({ title: "Home", layout: "base.html" });
    expect(result.html).toBe("<header>Header</header>");
  });

  it("rejects source-root escapes and recursive includes", () => {
    expect(() =>
      new HtmlAstRenderer({
        partials: new Map([["header.html", "Header"]]),
      }).render(
        '<template data-kbr-include="../../header.html"></template>',
        {},
        { sourcePath: "nested/page.html" }
      )
    ).toThrow(
      "Include escapes the template source root: ../../header.html (nested/page.html:line 1)"
    );

    expect(() =>
      new HtmlAstRenderer({
        partials: new Map([
          ["a.html", '<template data-kbr-include="b.html"></template>'],
          ["b.html", '<template data-kbr-include="a.html"></template>'],
        ]),
      }).render('<template data-kbr-include="a.html"></template>', {})
    ).toThrow(
      "Recursive template include: a.html -> b.html -> a.html (b.html:line 1)"
    );
  });

  it("rejects non-string raw targets", () => {
    expect(() =>
      new HtmlAstRenderer().render(
        '<template data-kbr-html="content"></template>',
        { content: { unsafe: true } }
      )
    ).toThrow('data-kbr-html requires a string value at "content"');

    expect(() =>
      new HtmlAstRenderer().render('<div data-kbr-html="content"></div>', {
        content: "<em>unsafe host</em>",
      })
    ).toThrow("data-kbr-html is only valid on template elements");
  });

  it("keeps raw fragments distinct regardless of sibling position", () => {
    const result = new HtmlAstRenderer().render(
      '<div><template data-kbr-html="a"></template></div><div><template data-kbr-html="b"></template></div>',
      { a: "<em>AAA</em>", b: "<em>BBB</em>" }
    );

    expect(result.html).toBe("<div><em>AAA</em></div><div><em>BBB</em></div>");
  });

  it("does not let raw values hijack another raw placeholder", () => {
    const result = new HtmlAstRenderer().render(
      '<div><template data-kbr-html="a"></template><template data-kbr-html="b"></template></div>',
      { a: '<i id="kbr-raw-fragment-1"></i>', b: "<em>B</em>" }
    );

    expect(result.html).toBe(
      '<div><i id="kbr-raw-fragment-1"></i><em>B</em></div>'
    );
  });

  it("walks included fragments exactly once", () => {
    const result = new HtmlAstRenderer({
      partials: new Map([["partial.html", "<p>{{ evil }}</p>"]]),
    }).render('<template data-kbr-include="partial.html"></template>', {
      evil: "{{ secret }}",
      secret: "LEAKED",
    });

    expect(result.html).toBe("<p>{{ secret }}</p>");
  });

  it("rejects malformed directive targets with source locations", () => {
    expect(() =>
      new HtmlAstRenderer().render(
        '<div data-kbr-include="header.html"></div>',
        {},
        { sourcePath: "pages/home.html" }
      )
    ).toThrow(
      "data-kbr-include is only valid on template elements (pages/home.html:line 1)"
    );

    expect(() =>
      new HtmlAstRenderer().render(
        '<template data-kbr-assets="footer"></template>',
        {},
        { sourcePath: "templates/base.html" }
      )
    ).toThrow('data-kbr-assets requires the value "head" or "body"');

    for (const [markup, message] of [
      ['<div data-kbr-if=""></div>', "data-kbr-if requires a non-empty value"],
      [
        '<template data-kbr-html=""></template>',
        "data-kbr-html requires a non-empty value",
      ],
      [
        '<main data-kbr-slot="sidebar"></main>',
        'data-kbr-slot requires the value "content"',
      ],
      [
        '<main data-layout="base.html"></main>',
        "data-layout is only valid on data-kbr-page elements",
      ],
    ] as const) {
      expect(() =>
        new HtmlAstRenderer().render(
          markup,
          {},
          { sourcePath: "pages/home.html" }
        )
      ).toThrow(`${message} (pages/home.html:line 1)`);
    }
  });

  it("preserves raw content in a Phase 0-style fixture", () => {
    const variables = {
      title: "About",
      content: "<main><h1>About</h1><p>{{ value }}</p></main>",
    };
    const ast = new HtmlAstRenderer().render(
      '<section title="{{title}}"><template data-kbr-html="content"></template></section>',
      variables
    ).html;

    expect(normalizeDom(ast)).toEqual(
      normalizeDom(
        '<section title="About"><main><h1>About</h1><p>{{ value }}</p></main></section>'
      )
    );
  });

  it("replaces head and body asset placeholders", () => {
    const result = new HtmlAstRenderer().render(
      '<head><template data-kbr-assets="head"></template></head><body><template data-kbr-assets="body"></template></body>',
      {},
      {
        assets: {
          head: [{ kind: "stylesheet", href: "/site.css" }],
          body: [{ kind: "module", src: "/main.js" }],
        },
      }
    );

    expect(result.html).toContain(
      '<link rel="stylesheet" crossorigin="" href="/site.css">'
    );
    expect(result.html).toContain(
      '<script type="module" crossorigin="" src="/main.js"></script>'
    );
    expect(result.html).not.toContain("data-kbr-");
  });

  it("renders a page fragment into the selected layout slot", () => {
    const result = new HtmlAstRenderer({
      templates: new Map([
        [
          "base.html",
          '<!doctype html><html><body><main data-kbr-slot="content"></main></body></html>',
        ],
      ]),
    }).renderPage(
      '<template data-kbr-page data-layout="base.html"><meta name="title" content="Home"></template><h1>{{title}}</h1>',
      { title: "Home" }
    );

    expect(result.metadata).toEqual({ title: "Home", layout: "base.html" });
    expect(result.html).toContain("<main><h1>Home</h1></main>");
    expect(result.html).not.toContain("data-kbr-");
  });

  it("fails when the selected layout has no content slot", () => {
    expect(() =>
      new HtmlAstRenderer({
        templates: new Map([["base.html", "<main></main>"]]),
      }).renderPage(
        '<template data-kbr-page data-layout="base.html"></template><p>Page</p>',
        {}
      )
    ).toThrow('Layout does not contain data-kbr-slot="content"');
  });
});
