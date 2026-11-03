#!/usr/bin/env tsx

/**
 * Image standard script for the Web Portfolio project
 *
 * Optimizes and checks the images in post `media/` directories, published and
 * draft, against the standard in `documentation/images.md`. PNGs are
 * optimized losslessly with oxipng, which must be installed and on the PATH.
 *
 * Usage:
 *   npm run images:optimize   # Optimize PNGs in place, then check
 *   npm run images:check      # Check only; fails on any problem
 *   tsx scripts/images.ts [--check]
 */

import { spawnSync } from "node:child_process";
import {
  mkdtempSync,
  openSync,
  readFileSync,
  readSync,
  closeSync,
  rmSync,
  statSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, extname, join, relative } from "node:path";
import { glob } from "glob";

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  gray: "\x1b[90m",
};

const PROJECT_ROOT = process.cwd();
const CONTENT_DIR = join(PROJECT_ROOT, "source/site/content");
const OXIPNG_ARGS = ["-o", "4", "--strip", "safe", "--quiet"];
const ALLOWED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".svg", ".gif"]);
const FILE_NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*\.[a-z]+$/;
const MAX_PNG_WIDTH = 1600;
const SIZE_BUDGET_BYTES = 300 * 1024;
// A re-run of oxipng can shave a few bytes off an optimized file; anything
// under this fraction still counts as optimized.
const OPTIMIZED_TOLERANCE = 0.01;

interface Problem {
  file: string;
  message: string;
  severity: "error" | "warning";
}

function main(): void {
  const checkOnly = process.argv.includes("--check");
  ensureOxipng();

  const mediaFiles = glob
    .sync("**/media/**/*", { cwd: CONTENT_DIR, nodir: true, absolute: true })
    .filter((file) => !basename(file).startsWith("."))
    .sort();

  if (!checkOnly) {
    optimizePngs(mediaFiles.filter(isPng));
  }

  const problems = [
    ...mediaFiles.flatMap((file) => checkMediaFile(file, checkOnly)),
    ...checkAltText(),
  ];

  for (const problem of problems) {
    const color = problem.severity === "error" ? colors.red : colors.yellow;
    console.log(
      `${color}${problem.severity}${colors.reset} ${relative(PROJECT_ROOT, problem.file)}: ${problem.message}`
    );
  }

  const errors = problems.filter((problem) => problem.severity === "error");
  if (errors.length > 0) {
    console.error(
      `${colors.red}✖ ${errors.length} image problem(s) in ${mediaFiles.length} media file(s).${colors.reset} See documentation/images.md.`
    );
    process.exit(1);
  }

  console.log(
    `${colors.green}✓ ${mediaFiles.length} media file(s) meet the image standard.${colors.reset}`
  );
}

function ensureOxipng(): void {
  const result = spawnSync("oxipng", ["--version"], { encoding: "utf-8" });
  if (result.error) {
    console.error(
      `${colors.red}✖ oxipng not found.${colors.reset} Install it with \`brew install oxipng\`, or see https://github.com/oxipng/oxipng.`
    );
    process.exit(1);
  }
}

function optimizePngs(pngFiles: string[]): void {
  for (const file of pngFiles) {
    const before = statSync(file).size;
    runOxipng([file]);
    const after = statSync(file).size;
    if (after < before) {
      console.log(
        `${colors.gray}optimized ${relative(PROJECT_ROOT, file)}: ${formatBytes(before)} → ${formatBytes(after)}${colors.reset}`
      );
    }
  }
}

function checkMediaFile(file: string, checkOptimized: boolean): Problem[] {
  const problems: Problem[] = [];
  const name = basename(file);
  const extension = extname(name).toLowerCase();

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    problems.push({
      file,
      severity: "error",
      message: `"${extension}" isn't an allowed image format (PNG, JPEG, SVG, or GIF)`,
    });
  }

  if (!FILE_NAME_PATTERN.test(name)) {
    problems.push({
      file,
      severity: "error",
      message: "file names are lowercase kebab-case, like ci-annotation.png",
    });
  }

  const size = statSync(file).size;
  if (size > SIZE_BUDGET_BYTES) {
    problems.push({
      file,
      severity: "warning",
      message: `${formatBytes(size)} is over the ${formatBytes(SIZE_BUDGET_BYTES)} budget; crop it, or use JPEG for a photo`,
    });
  }

  if (!isPng(file)) {
    return problems;
  }

  const width = readPngWidth(file);
  if (width > MAX_PNG_WIDTH) {
    problems.push({
      file,
      severity: "error",
      message: `${width}px wide is over the ${MAX_PNG_WIDTH}px maximum; crop it to what the reader needs`,
    });
  }

  if (checkOptimized) {
    const optimizedSize = optimizedPngSize(file);
    if (optimizedSize < size * (1 - OPTIMIZED_TOLERANCE)) {
      problems.push({
        file,
        severity: "error",
        message: `not optimized (${formatBytes(size)} → ${formatBytes(optimizedSize)}); run npm run images:optimize`,
      });
    }
  }

  return problems;
}

/**
 * Every Markdown image in content needs alt text.
 */
function checkAltText(): Problem[] {
  return glob
    .sync("**/*.md", { cwd: CONTENT_DIR, absolute: true })
    .sort()
    .flatMap((file) =>
      /!\[\s*\]\(/.test(readFileSync(file, "utf-8"))
        ? [
            {
              file,
              severity: "error" as const,
              message: "an image has no alt text",
            },
          ]
        : []
    );
}

function optimizedPngSize(file: string): number {
  const directory = mkdtempSync(join(tmpdir(), "kbr-images-"));
  try {
    const output = join(directory, "optimized.png");
    runOxipng(["--out", output, file]);
    return statSync(output).size;
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function runOxipng(args: string[]): void {
  const result = spawnSync("oxipng", [...OXIPNG_ARGS, ...args], {
    encoding: "utf-8",
  });
  if (result.status !== 0) {
    throw new Error(`oxipng failed: ${result.stderr || result.error}`);
  }
}

/**
 * Read the width from a PNG's IHDR chunk, which always starts at byte 16.
 */
function readPngWidth(file: string): number {
  const header = Buffer.alloc(24);
  const descriptor = openSync(file, "r");
  try {
    readSync(descriptor, header, 0, 24, 0);
  } finally {
    closeSync(descriptor);
  }
  return header.readUInt32BE(16);
}

function isPng(file: string): boolean {
  return extname(file).toLowerCase() === ".png";
}

function formatBytes(bytes: number): string {
  return `${Math.round(bytes / 1024)} KB`;
}

main();
