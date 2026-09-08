import type {
  BlogManifest,
  BlogPostManifestEntry,
  SupplementManifestEntry,
  TagWithCount,
} from "../shared/manifest-types.js";

export interface StaticBlogPost extends BlogPostManifestEntry {
  readonly displayDate: string;
  readonly tagsAttribute: string;
}

export interface StaticBlogModel {
  readonly posts: readonly StaticBlogPost[];
  readonly tagsWithCounts: readonly TagWithCount[];
}

export interface StaticHomeModel {
  readonly latestPost?: StaticBlogPost;
  readonly currentRole?: {
    readonly company: string;
    readonly companyWebsite: string;
    readonly title: string;
  };
}

export interface StaticTimelinePosition extends Omit<
  TimelinePosition,
  "description" | "skills"
> {
  readonly description: string;
  readonly blocks: readonly TimelineDescriptionBlock[];
  readonly skills: readonly string[];
}

export type TimelineDescriptionBlock =
  { readonly paragraph: string } | { readonly items: readonly string[] };

export interface StaticTimelineCompany {
  readonly id: string;
  readonly heading: string;
  readonly website?: string;
  readonly noWebsite?: boolean;
  readonly positions: readonly StaticTimelinePosition[];
}

function parseValue<T>(value: string | T): T {
  return typeof value === "string" ? (JSON.parse(value) as T) : value;
}

export function buildBlogStaticModel(
  manifestJson: string | BlogManifest
): StaticBlogModel {
  const manifest = parseValue<BlogManifest>(manifestJson);
  return {
    tagsWithCounts: manifest.tagsWithCounts,
    posts: manifest.posts.map((post) => ({
      ...post,
      displayDate: post.formattedDate || post.date,
      tagsAttribute: post.tags.join("|"),
    })),
  };
}

export function buildHomeStaticModel(
  manifestJson: string | BlogManifest,
  experienceJson: string | TimelineCompany[]
): StaticHomeModel {
  const blog = buildBlogStaticModel(manifestJson);
  const companies = parseValue<TimelineCompany[]>(experienceJson);
  const currentCompany = companies.find((company) =>
    company.positions.some(
      (position) => position.endDate.toLowerCase() === "present"
    )
  );
  const currentPosition = currentCompany?.positions.find(
    (position) => position.endDate.toLowerCase() === "present"
  );
  return {
    latestPost: blog.posts[0],
    currentRole:
      currentCompany && currentPosition
        ? {
            company: currentCompany.company,
            companyWebsite: currentCompany.companyWebsite ?? "",
            title: currentPosition.title,
          }
        : undefined,
  };
}

export function buildTimelineStaticModel(
  experienceJson: string | TimelineCompany[]
): readonly StaticTimelineCompany[] {
  const companies = parseValue<TimelineCompany[]>(experienceJson);
  return companies.map((company, index) => {
    const baseId = slugify(company.company);
    const occurrence = companies
      .slice(0, index + 1)
      .filter((entry) => slugify(entry.company) === baseId).length;
    const isRepeated = companies.some(
      (entry, entryIndex) =>
        entryIndex !== index && entry.company === company.company
    );
    return {
      id: occurrence === 1 ? baseId : `${baseId}-${occurrence}`,
      heading: isRepeated
        ? `${company.company} (${companyYearSpan(company)})`
        : company.company,
      website: company.companyWebsite,
      noWebsite: !company.companyWebsite,
      positions: company.positions.map((position) => {
        const lines = position.description
          .replace(/\\n/g, "\n")
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean);
        return {
          ...position,
          blocks: buildTimelineDescriptionBlocks(lines),
          skills: position.skills ?? [],
        };
      }),
    };
  });
}

function buildTimelineDescriptionBlocks(
  lines: readonly string[]
): readonly TimelineDescriptionBlock[] {
  const blocks: TimelineDescriptionBlock[] = [];
  let paragraphLines: string[] = [];
  let bulletItems: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length > 0) {
      blocks.push({ paragraph: paragraphLines.join(" ") });
      paragraphLines = [];
    }
  };
  const flushBullets = () => {
    if (bulletItems.length > 0) {
      blocks.push({ items: bulletItems });
      bulletItems = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith("•")) {
      flushParagraph();
      bulletItems.push(line.slice(1).trim());
    } else {
      flushBullets();
      paragraphLines.push(line);
    }
  }

  flushParagraph();
  flushBullets();
  return blocks;
}

export interface StaticSeriesModel {
  readonly seriesName: string;
  readonly currentIndex: number;
  readonly totalParts: number;
  readonly previous?: BlogPostManifestEntry;
  readonly next?: BlogPostManifestEntry;
  readonly posts: readonly (BlogPostManifestEntry & {
    readonly currentClass: string;
    readonly partLabel: string;
  })[];
}

export function buildSeriesStaticModel(
  manifestJson: string | BlogManifest,
  seriesName: string,
  currentPart: number
): StaticSeriesModel | undefined {
  const manifest = parseValue<BlogManifest>(manifestJson);
  const posts = manifest.posts
    .filter((post) => post.series?.name === seriesName)
    .sort(
      (left, right) => (left.series?.part ?? 0) - (right.series?.part ?? 0)
    );
  if (posts.length === 0) {
    return undefined;
  }
  const currentIndex = posts.findIndex(
    (post) => post.series?.part === currentPart
  );
  return {
    seriesName,
    currentIndex: currentIndex + 1,
    totalParts: posts.length,
    previous: currentIndex > 0 ? posts[currentIndex - 1] : undefined,
    next:
      currentIndex >= 0 && currentIndex < posts.length - 1
        ? posts[currentIndex + 1]
        : undefined,
    posts: posts.map((post) => ({
      ...post,
      currentClass: post.series?.part === currentPart ? "current" : "",
      partLabel:
        post.series?.part === 0
          ? "Series Summary:"
          : `Part ${post.series?.part}`,
    })),
  };
}

export function buildSupplementStaticModel(
  supplements: readonly SupplementManifestEntry[] | undefined
): { readonly supplements: SupplementManifestEntry[] } | undefined {
  return supplements && supplements.length > 0
    ? { supplements: [...supplements] }
    : undefined;
}

interface TimelinePosition {
  title: string;
  dateRange: string;
  duration: string;
  location: string;
  employmentType: string;
  description: string;
  skills?: string[];
  startDate: string;
  endDate: string;
}

interface TimelineCompany {
  company: string;
  companyWebsite?: string;
  positions: TimelinePosition[];
}

function companyYearSpan(company: TimelineCompany): string {
  const startYears = company.positions
    .map((position) => position.startDate.slice(0, 4))
    .filter((year) => /^\d{4}$/.test(year));
  const endYears = company.positions
    .map((position) => position.endDate.slice(0, 4))
    .filter((year) => /^\d{4}$/.test(year));
  if (startYears.length === 0) return "";
  const start = startYears.sort()[0];
  const end = company.positions.some(
    (position) => position.endDate === "Present"
  )
    ? "Present"
    : (endYears.sort().at(-1) ?? start);
  return start === end ? start : `${start}-${end}`;
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim() || "company"
  );
}
