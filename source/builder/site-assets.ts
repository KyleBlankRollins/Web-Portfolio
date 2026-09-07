import type { SiteAssets } from "./site-renderer.js";

interface ViteManifestEntry {
  file?: string;
  css?: string[];
  imports?: string[];
}

type ViteManifest = Record<string, ViteManifestEntry>;

export function siteAssetsFromManifest(manifest: ViteManifest): SiteAssets {
  const entry = manifest["main.ts"];
  if (!entry?.file) {
    throw new Error("Vite manifest does not contain the main.ts entry");
  }

  const head = new Map<string, SiteAssets["head"][number]>();
  const body: SiteAssets["body"] = [{ kind: "module", src: `/${entry.file}` }];
  const visited = new Set<string>();

  const visit = (entryKey: string): void => {
    if (visited.has(entryKey)) {
      return;
    }
    visited.add(entryKey);
    const imported = manifest[entryKey];
    if (!imported) {
      return;
    }

    for (const stylesheet of imported.css ?? []) {
      head.set(`stylesheet:${stylesheet}`, {
        kind: "stylesheet",
        href: `/${stylesheet}`,
      });
    }
    for (const importKey of imported.imports ?? []) {
      const importedEntry = manifest[importKey];
      if (importedEntry?.file) {
        head.set(`modulepreload:${importedEntry.file}`, {
          kind: "modulepreload",
          href: `/${importedEntry.file}`,
        });
      }
      visit(importKey);
    }
  };

  visit("main.ts");
  return { head: [...head.values()], body };
}

export function developmentSiteAssets(): SiteAssets {
  return { head: [], body: [{ kind: "module", src: "/main.ts" }] };
}
