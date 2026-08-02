import type { BlogManifest } from "../../shared/manifest-types.js";

let cached: Promise<BlogManifest> | null = null;

export function loadBlogManifest(): Promise<BlogManifest> {
  cached ??= fetch("/data/blog-manifest.json").then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to load blog manifest: ${response.statusText}`);
    }
    return response.json() as Promise<BlogManifest>;
  });
  return cached;
}
