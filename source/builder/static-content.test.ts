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
      [
        {
          company: "Example Co",
          companyWebsite: "https://example.com",
          positions: [
            {
              title: "Lead",
              startDate: "2024-01",
              endDate: "Present",
              dateRange: "Jan 2024 - Present",
              duration: "2 years",
              location: "Remote",
              employmentType: "Full-time",
              renderedDescription: "<p>Role</p>",
            },
          ],
        },
      ]
    );

    expect(model.latestPost?.title).toBe(post.title);
    expect(model.currentRole).toMatchObject({
      company: "Example Co",
      title: "Lead",
    });
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

  it("builds stable timeline IDs and headings for repeated companies", () => {
    const companies = buildTimelineStaticModel([
      {
        company: "Example <Company>",
        companyWebsite: "https://example.com/?x=1&y=2",
        positions: [
          {
            title: "Earlier",
            startDate: "2018-01",
            endDate: "2020-01",
            dateRange: "Jan 2018 - Jan 2020",
            duration: "2 yrs 1 mo",
            location: "Remote",
            employmentType: "Full-time",
            renderedDescription: "<p>Earlier</p>",
            skills: [],
          },
        ],
      },
      {
        company: "Example <Company>",
        positions: [
          {
            title: "Later",
            startDate: "2021-01",
            endDate: "Present",
            dateRange: "Jan 2021 - Present",
            duration: "6 yrs 9 mos",
            location: "Remote",
            employmentType: "Full-time",
            renderedDescription: "<p>Later</p>",
            skills: [],
          },
        ],
      },
    ]);

    expect(companies.map(({ id, heading }) => ({ id, heading }))).toEqual([
      { id: "example-company", heading: "Example <Company> (2018-2020)" },
      { id: "example-company-2", heading: "Example <Company> (2021-Present)" },
    ]);
    expect(companies[0].website).toBe("https://example.com/?x=1&y=2");
    expect(companies[0].positions[0].renderedDescription).toBe(
      "<p>Earlier</p>"
    );
  });
});
