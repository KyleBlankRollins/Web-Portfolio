import { describe, expect, it } from "vitest";
import { parseCareerContent } from "./career-content.js";

describe("parseCareerContent", () => {
  it("parses ordered company metadata and Markdown descriptions", () => {
    const companies = parseCareerContent(
      new Map([
        [
          "later.md",
          `+++
company = "Later"
sortOrder = 2

[[positions]]
title = "Later role"
startDate = "2023-01"
endDate = "Present"
location = "Remote"
employmentType = "Full-time"
+++

## Later role

A **formatted** paragraph with a [link](https://example.com).
`,
        ],
        [
          "first.md",
          `+++
company = "First"
sortOrder = 1

[[positions]]
title = "First role"
startDate = "2022-01"
endDate = "2023-01"
location = "Remote"
employmentType = "Full-time"
+++

## First role
`,
        ],
      ]),
      new Date("2026-09-08T00:00:00Z")
    );

    expect(companies.map((company) => company.company)).toEqual([
      "First",
      "Later",
    ]);
    expect(companies[0].positions[0].renderedDescription).toBeUndefined();
    expect(companies[1].positions[0].dateRange).toBe("Jan 2023 - Present");
    expect(companies[1].positions[0].duration).toBe("3 yrs 9 mos");
    expect(companies[1].positions[0].renderedDescription).toContain(
      "<strong>formatted</strong>"
    );
    expect(companies[1].positions[0].renderedDescription).toContain(
      'href="https://example.com"'
    );
  });

  it("renders description headings below the position title level", () => {
    const [company] = parseCareerContent(
      new Map([
        [
          "headings.md",
          `+++
company = "Headings"
sortOrder = 1

[[positions]]
title = "Role"
startDate = "2024-01"
endDate = "Present"
location = "Remote"
employmentType = "Full-time"
+++

## Role

### Responsibilities

Description.
`,
        ],
      ])
    );

    expect(company.positions[0].renderedDescription).toContain(
      '<h4 id="responsibilities">Responsibilities</h4>'
    );
    expect(company.positions[0].renderedDescription).not.toContain(
      '<h3 id="responsibilities">'
    );
  });

  it("rejects a mismatch between position metadata and Markdown sections", () => {
    expect(() =>
      parseCareerContent(
        new Map([
          [
            "invalid.md",
            `+++
company = "Invalid"
sortOrder = 1

[[positions]]
title = "Role"
startDate = "2024-01"
endDate = "Present"
location = "Remote"
employmentType = "Full-time"

[[positions]]
title = "Missing"
startDate = "2023-01"
endDate = "2024-01"
location = "Remote"
employmentType = "Full-time"
+++

## Role
Description.
`,
          ],
        ])
      )
    ).toThrow(/position sections but 2 position records/);
  });

  it("uses the singular month label for one-month durations", () => {
    const [company] = parseCareerContent(
      new Map([
        [
          "one-month.md",
          `+++
company = "One Month"
sortOrder = 1

[[positions]]
title = "Role"
startDate = "2025-09"
endDate = "2026-09"
location = "Remote"
employmentType = "Full-time"
+++

## Role
`,
        ],
      ])
    );

    expect(company.positions[0].duration).toBe("1 yr 1 mo");
  });

  it("rejects a section heading that does not match its position metadata", () => {
    expect(() =>
      parseCareerContent(
        new Map([
          [
            "misaligned.md",
            `+++
company = "Misaligned"
sortOrder = 1

[[positions]]
title = "Role"
startDate = "2024-01"
endDate = "Present"
location = "Remote"
employmentType = "Full-time"
+++

## Different role
Description.
`,
          ],
        ])
      )
    ).toThrow(/expected "Role"/);
  });

  it("reports invalid dates and missing career frontmatter with the source path", () => {
    expect(() =>
      parseCareerContent(
        new Map([
          [
            "invalid-date.md",
            `+++
company = "Invalid"
sortOrder = 1

[[positions]]
title = "Role"
startDate = "2024"
endDate = "Present"
location = "Remote"
employmentType = "Full-time"
+++

## Role
`,
          ],
        ])
      )
    ).toThrow(/invalid-date\.md.*startDate.*YYYY-MM/);

    expect(() =>
      parseCareerContent(
        new Map([
          [
            "reversed.md",
            `+++
company = "Reversed"
sortOrder = 1

[[positions]]
title = "Role"
startDate = "2025-01"
endDate = "2024-01"
location = "Remote"
employmentType = "Full-time"
+++

## Role
`,
          ],
        ])
      )
    ).toThrow(/reversed\.md.*endDate.*must not precede startDate/);

    expect(() =>
      parseCareerContent(new Map([["missing.md", "## Role\nDescription."]]))
    ).toThrow(/missing\.md.*frontmatter is required/);
  });
});
