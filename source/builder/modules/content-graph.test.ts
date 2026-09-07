import { describe, expect, it } from "vitest";
import { buildContentGraph } from "./content-graph.js";
import type { ContentDiscoveryResult } from "./content-discovery.js";

function discovery(
  documents: ContentDiscoveryResult["documents"],
  publishedSupplements: ContentDiscoveryResult["publishedSupplements"] = []
): ContentDiscoveryResult {
  return {
    publishedRootPath: "/published",
    documents,
    publishableDocuments: documents.filter(
      (document) => document.kind !== "supplement-candidate"
    ),
    supplementCandidates: [],
    publishedSupplements,
  };
}

function post(
  publicUrl: string,
  date: string,
  tags: string[] = [],
  part?: number
) {
  return {
    sourcePath: `/source${publicUrl.replace(".html", ".md")}`,
    outputPath: publicUrl.slice(1),
    publicUrl,
    kind: "standalone-post" as const,
    metadata: {
      title: publicUrl,
      description: "Description",
      date,
      tags,
      ...(part === undefined ? {} : { series: { name: "Series", part } }),
    },
  };
}

describe("buildContentGraph", () => {
  it("sorts posts by date descending and URL ascending", () => {
    const graph = buildContentGraph(
      discovery([
        post("/z.html", "2026-01-01"),
        post("/b.html", "2026-01-01"),
        post("/a.html", "2027-01-01"),
      ])
    );

    expect(graph.posts.map(({ document }) => document.publicUrl)).toEqual([
      "/a.html",
      "/b.html",
      "/z.html",
    ]);
  });

  it("builds tag and series summaries deterministically", () => {
    const graph = buildContentGraph(
      discovery([
        post("/part-2.html", "2026-01-02", ["docs"], 2),
        post("/intro.html", "2026-01-01", ["docs", "ai"], 0),
      ])
    );

    expect([...graph.tags.entries()]).toEqual([
      ["docs", 2],
      ["ai", 1],
    ]);
    expect(
      graph.series.get("Series")?.map(({ document }) => document.publicUrl)
    ).toEqual(["/part-2.html", "/intro.html"]);
  });

  it("rejects supplements with missing parents", () => {
    const supplement = {
      ...post("/missing/supplement.html", "2026-01-01"),
      kind: "supplement-candidate" as const,
      parentUrl: "/missing.html",
    };

    expect(() =>
      buildContentGraph(discovery([supplement], [supplement]))
    ).toThrow(/missing parent/);
  });

  it("rejects duplicate series parts", () => {
    expect(() =>
      buildContentGraph(
        discovery([
          post("/one.html", "2026-01-01", [], 1),
          post("/two.html", "2026-01-02", [], 1),
        ])
      )
    ).toThrow(/duplicate part 1/);
  });

  it("produces the same render collection for repeated builds", () => {
    const documents = [
      post("/z.html", "2026-01-01"),
      post("/a.html", "2026-01-02"),
    ];
    const first = buildContentGraph(discovery(documents));
    const second = buildContentGraph(discovery([...documents].reverse()));

    expect(first.renderDocuments.map((document) => document.publicUrl)).toEqual(
      second.renderDocuments.map((document) => document.publicUrl)
    );
  });
});
