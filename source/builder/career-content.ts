import { Marked } from "marked";
import { FrontmatterParser, MarkdownRenderer } from "./modules/index.js";

export interface CareerPosition {
  readonly title: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly dateRange: string;
  readonly duration: string;
  readonly location: string;
  readonly employmentType: string;
  readonly renderedDescription?: string;
  readonly skills?: readonly string[];
}

export interface CareerCompany {
  readonly company: string;
  readonly companyWebsite?: string;
  readonly positions: readonly CareerPosition[];
}

export function parseCareerContent(
  careerFiles: ReadonlyMap<string, string>,
  now = new Date()
): readonly CareerCompany[] {
  const parser = new FrontmatterParser("career");
  const renderer = new MarkdownRenderer(new Marked());

  return [...careerFiles.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([sourcePath, source]) => {
      const parsed = parser.parse(source, sourcePath);
      const metadata = parsed.metadata;
      const sections = splitPositionSections(parsed.content);

      if (sections.length !== metadata.positions.length) {
        throw new Error(
          `Career file "${sourcePath}" has ${sections.length} position sections but ${metadata.positions.length} position records.`
        );
      }

      sections.forEach((section, index) => {
        if (section.title !== metadata.positions[index].title) {
          throw new Error(
            `Career file "${sourcePath}" has position section "${section.title}" at index ${index}, expected "${metadata.positions[index].title}".`
          );
        }
      });

      return {
        company: metadata.company,
        companyWebsite: metadata.companyWebsite,
        sortOrder: metadata.sortOrder,
        positions: metadata.positions.map((position, index) => {
          const description = sections[index].content;
          return {
            ...position,
            dateRange: formatDateRange(position.startDate, position.endDate),
            duration: formatDuration(position.startDate, position.endDate, now),
            renderedDescription: description
              ? renderer.render(description, { currentSourcePath: sourcePath })
              : undefined,
            skills: position.skills ?? [],
          };
        }),
      };
    })
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map(({ sortOrder: _sortOrder, ...company }) => company);
}

function splitPositionSections(
  content: string
): readonly { title: string; content: string }[] {
  const headingPattern = /^##\s+.+$/gm;
  const headings = [...content.matchAll(headingPattern)];

  return headings.map((heading, index) => {
    const sectionStart = (heading.index ?? 0) + heading[0].length;
    const sectionEnd = headings[index + 1]?.index ?? content.length;
    return {
      title: heading[0].replace(/^##\s+/, "").trim(),
      content: content.slice(sectionStart, sectionEnd).trim(),
    };
  });
}

function formatDateRange(startDate: string, endDate: string): string {
  return `${formatMonth(startDate)} - ${endDate.toLowerCase() === "present" ? "Present" : formatMonth(endDate)}`;
}

function formatMonth(value: string): string {
  const [year, month] = value.split("-").map(Number);
  const monthName = new Intl.DateTimeFormat("en-US", {
    month: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
  return `${monthName} ${year}`;
}

function formatDuration(startDate: string, endDate: string, now: Date): string {
  const [startYear, startMonth] = startDate.split("-").map(Number);
  const end =
    endDate.toLowerCase() === "present"
      ? now
      : new Date(`${endDate}-01T00:00:00Z`);
  const totalMonths =
    end.getUTCFullYear() * 12 +
    end.getUTCMonth() -
    (startYear * 12 + startMonth - 1) +
    1;
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? "yr" : "yrs"}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? "mo" : "mos"}`);
  return parts.join(" ");
}
