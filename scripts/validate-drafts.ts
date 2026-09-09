#!/usr/bin/env tsx

/**
 * Draft validation script for the Web Portfolio project
 *
 * Runs draft discovery over `source/site/content/__drafts/` and reports a
 * clear success summary or a structural error. This is an authoring-time
 * check: it is independent of the production build and never renders, routes,
 * or publishes draft content.
 *
 * Usage:
 *   npm run validate:drafts
 *   tsx scripts/validate-drafts.ts
 */

import { relative } from "node:path";
import {
  DraftContentDiscovery,
  summarizeDraftDiscovery,
  type DraftDocument,
} from "../source/builder/modules/draft-content-discovery.js";

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  gray: "\x1b[90m",
};

const KIND_LABELS: Record<DraftDocument["kind"], string> = {
  "standalone-draft": "standalone",
  "directory-draft": "directory",
  "supporting-draft": "supporting",
};

function main(): void {
  const discovery = new DraftContentDiscovery();

  let result;
  try {
    result = discovery.discover();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`${colors.red}✖ Draft validation failed${colors.reset}`);
    console.error(`  ${message}`);
    process.exit(1);
  }

  const root = result.draftRootPath;
  console.log(
    `${colors.bright}Validating drafts in ${relative(process.cwd(), root) || root}${colors.reset}`
  );

  for (const document of [...result.documents].sort((a, b) =>
    a.sourcePath.localeCompare(b.sourcePath)
  )) {
    const label = KIND_LABELS[document.kind];
    const relativePath = relative(root, document.sourcePath);
    console.log(`  ${colors.gray}[${label}]${colors.reset} ${relativePath}`);
  }

  console.log(
    `${colors.green}✓ ${summarizeDraftDiscovery(result)}${colors.reset}`
  );
}

main();
