import { describe, expect, it } from "vitest";
import {
  buildBlogStaticModel,
  buildHomeStaticModel,
  buildSeriesStaticModel,
  buildSupplementStaticModel,
  buildTimelineStaticModel,
} from "./static-content.js";

const post = {
  title: "Docs <as> interface",
  description: 'Use "good" docs',
  date: "2026-01-02",
  formattedDate: "January 2, 2026",
  tags: ["writing", "web"],
  url: "/docs.html?x=1&y=2",
  filename: "docs",
};

describe("static content view models", () => {
  it("prepares blog posts and tag counts for AST templates", () => {
    const model = buildBlogStaticModel(
      JSON.stringify({
        posts: [post],
        totalPosts: 1,
        availableTags: ["writing", "web"],
        tagsWithCounts: [
          { tag: "writing", count: 1 },
          { tag: "web", count: 1 },
        ],
      })
    );

    expect(model.posts[0].displayDate).toBe("January 2, 2026");
    expect(model.posts[0].tagsAttribute).toBe("writing|web");
    expect(model.tagsWithCounts).toHaveLength(2);
  });

  it("selects the latest post and current role for the homepage", () => {
    const model = buildHomeStaticModel(
      JSON.stringify({
        posts: [post],
        totalPosts: 1,
        availableTags: [],
        tagsWithCounts: [],
      }),
      JSON.stringify([
        {
          company: "Example Co",
          companyWebsite: "https://example.com",
          positions: [{ title: "Lead", endDate: "Present" }],
        },
      ])
    );

    expect(model.latestPost?.title).toBe(post.title);
    expect(model.currentRole).toMatchObject({
      company: "Example Co",
      title: "Lead",
    });
  });

  it("prepares timeline descriptions as paragraphs and bullets", () => {
    const [company] = buildTimelineStaticModel(
      JSON.stringify([
        {
          company: "Example <Company>",
          companyWebsite: "https://example.com/?x=1&y=2",
          positions: [
            {
              title: "Lead",
              startDate: "2024-01",
              endDate: "Present",
              dateRange: "Jan 2024 - Present",
              duration: "2 years",
              location: "Remote",
              employmentType: "Full-time",
              description: "Built <systems>\\n\\n• Tested <examples>",
            },
          ],
        },
      ])
    );

    expect(company.id).toBe("example-company");
    expect(company.positions[0].blocks).toEqual([
      { paragraph: "Built <systems>" },
      { items: ["Tested <examples>"] },
    ]);
  });

  it("preserves interleaved paragraphs and bullet groups", () => {
    const [position] = buildTimelineStaticModel([
      {
        company: "Example Co",
        positions: [
          {
            title: "Lead",
            startDate: "2024-01",
            endDate: "Present",
            dateRange: "Jan 2024 - Present",
            duration: "2 years",
            location: "Remote",
            employmentType: "Full-time",
            description: "Intro\\n• First\\n• Second\\nDetails\\n• Third",
          },
        ],
      },
    ]).flatMap((company) => company.positions);

    expect(position.blocks).toEqual([
      { paragraph: "Intro" },
      { items: ["First", "Second"] },
      { paragraph: "Details" },
      { items: ["Third"] },
    ]);
  });

  it("orders series posts and identifies adjacent navigation", () => {
    const model = buildSeriesStaticModel(
      JSON.stringify({
        posts: [
          { ...post, title: "Part Two", series: { name: "A Series", part: 2 } },
          { ...post, title: "Part One", series: { name: "A Series", part: 1 } },
        ],
        totalPosts: 2,
        availableTags: [],
        tagsWithCounts: [],
      }),
      "A Series",
      1
    );

    expect(model?.posts.map((entry) => entry.title)).toEqual([
      "Part One",
      "Part Two",
    ]);
    expect(model?.next?.title).toBe("Part Two");
    expect(model?.posts[0].currentClass).toBe("current");
  });

  it("omits empty supplement collections", () => {
    expect(buildSupplementStaticModel([])).toBeUndefined();
    expect(
      buildSupplementStaticModel([
        {
          title: "Checklist",
          description: "A list",
          url: "/checklist.html",
          filename: "checklist",
        },
      ])?.supplements
    ).toHaveLength(1);
  });
});
