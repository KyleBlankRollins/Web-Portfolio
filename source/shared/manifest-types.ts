export interface SupplementManifestEntry {
  title: string;
  description: string;
  url: string;
  filename: string;
}

export interface SeriesInfo {
  name: string;
  part: number;
}

export interface BlogPostManifestEntry {
  title: string;
  description: string;
  date: string;
  formattedDate: string;
  tags: string[];
  url: string;
  filename: string;
  keywords?: string;
  series?: SeriesInfo;
  supplements?: SupplementManifestEntry[];
}

export interface TagWithCount {
  tag: string;
  count: number;
}

export interface BlogManifest {
  posts: BlogPostManifestEntry[];
  totalPosts: number;
  availableTags: string[];
  tagsWithCounts: TagWithCount[];
}

export interface ThemeConfig {
  name: string;
  id: string;
}

export interface ThemeManifestEntry {
  id: string;
  name: string;
  version?: string;
  author?: string;
  description?: string;
  file: string;
  metadata: Record<string, string>;
}

export interface ThemeManifest {
  themes: ThemeManifestEntry[];
  totalThemes: number;
}
