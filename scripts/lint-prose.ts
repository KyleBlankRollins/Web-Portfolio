#!/usr/bin/env tsx

/**
 * Prose linting script for the Web Portfolio project
 *
 * This script provides intelligent Vale linting with file discovery,
 * git integration, and enhanced reporting capabilities.
 *
 * Features:
 * - Smart file discovery (changed files, specific patterns)
 * - Git integration for changed-only linting
 * - Colorized output with progress indicators
 * - Configurable behavior for different scenarios
 * - Better error handling and reporting
 *
 * Usage:
 *   npm run lint:prose              # Lint all content
 *   npm run lint:prose:changed      # Only changed files
 *   npm run lint:prose:drafts       # Only drafts
 *   tsx scripts/lint-prose.ts --help
 */

import { spawn } from "child_process";
import { existsSync, statSync } from "fs";
import { join, relative } from "path";
import { glob } from "glob";

// ANSI color codes for output formatting
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

interface LintOptions {
  changedOnly?: boolean;
  draftsOnly?: boolean;
  verbose?: boolean;
  format?: "default" | "line" | "json";
  help?: boolean;
}

interface LintResult {
  success: boolean;
  filesLinted: number;
  errors: number;
  warnings: number;
  suggestions: number;
  output: string;
}

const PROJECT_ROOT = process.cwd();
const CONTENT_DIR = join(PROJECT_ROOT, "source/site/content");
const DRAFTS_DIR = join(CONTENT_DIR, "__drafts");

/**
 * Display help information
 */
function showHelp(): void {
  console.log(`
${colors.bright}Prose Linting Script${colors.reset}

${colors.cyan}Usage:${colors.reset}
  tsx scripts/lint-prose.ts [options]

${colors.cyan}Options:${colors.reset}
  --changed-only    Only lint files that have been modified (git status)
  --drafts-only     Only lint files in the __drafts directory
  --verbose         Show detailed output and file processing info
  --format FORMAT   Output format: default, line, json (default: default)
  --help           Show this help message

${colors.cyan}Examples:${colors.reset}
  tsx scripts/lint-prose.ts                    # Lint all content
  tsx scripts/lint-prose.ts --changed-only     # Only changed files
  tsx scripts/lint-prose.ts --drafts-only      # Only drafts
  tsx scripts/lint-prose.ts --verbose          # All files with verbose output

${colors.cyan}NPM Scripts:${colors.reset}
  npm run lint:prose          # Lint all content
  npm run lint:prose:changed  # Only changed files
  npm run lint:prose:drafts   # Only drafts
`);
}

/**
 * Parse command line arguments
 */
function parseArgs(): LintOptions {
  const args = process.argv.slice(2);
  const options: LintOptions = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--changed-only":
        options.changedOnly = true;
        break;
      case "--drafts-only":
        options.draftsOnly = true;
        break;
      case "--verbose":
        options.verbose = true;
        break;
      case "--format":
        options.format = args[++i] as "default" | "line" | "json";
        break;
      case "--help":
      case "-h":
        options.help = true;
        break;
    }
  }

  return options;
}

/**
 * Get list of changed files using git
 */
async function getChangedFiles(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const gitArgs = [
      "diff",
      "--name-only",
      "HEAD",
      "--diff-filter=ACM",
    ];

    const git = spawn("git", gitArgs, { cwd: PROJECT_ROOT });
    let output = "";
    let error = "";

    git.stdout.on("data", (data) => {
      output += data.toString();
    });

    git.stderr.on("data", (data) => {
      error += data.toString();
    });

    git.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Git command failed: ${error}`));
        return;
      }

      const files = output
        .split("\n")
        .filter((line) => line.trim())
        .filter(
          (file) =>
            file.startsWith("source/site/content/") &&
            file.endsWith(".md")
        )
        .map((file) => join(PROJECT_ROOT, file))
        .filter((file) => existsSync(file));

      resolve(files);
    });
  });
}

/**
 * Discover markdown files to lint based on options
 */
async function discoverFiles(
  options: LintOptions
): Promise<string[]> {
  let files: string[] = [];

  if (options.changedOnly) {
    // Only files that have been modified
    files = await getChangedFiles();
  } else if (options.draftsOnly) {
    // Only files in the drafts directory
    const pattern = join(DRAFTS_DIR, "**/*.md");
    files = await glob(pattern);
  } else {
    // All markdown files in content directory
    const pattern = join(CONTENT_DIR, "**/*.md");
    files = await glob(pattern);
  }

  // Filter out files that don't exist or are not regular files
  files = files.filter((file) => {
    try {
      return existsSync(file) && statSync(file).isFile();
    } catch {
      return false;
    }
  });

  return files;
}

/**
 * Run Vale on the specified files
 */
async function runVale(
  files: string[],
  options: LintOptions
): Promise<LintResult> {
  if (files.length === 0) {
    return {
      success: true,
      filesLinted: 0,
      errors: 0,
      warnings: 0,
      suggestions: 0,
      output: "No files to lint.",
    };
  }

  return new Promise((resolve) => {
    const valeArgs = ["--no-exit"];

    // Add format option
    if (options.format === "line") {
      valeArgs.push("--output=line");
    } else if (options.format === "json") {
      valeArgs.push("--output=JSON");
    }

    // Add files to lint
    valeArgs.push(...files);

    if (options.verbose) {
      console.log(
        `${colors.gray}Running: vale ${valeArgs.join(" ")}${
          colors.reset
        }`
      );
    }

    const vale = spawn("vale", valeArgs, { cwd: PROJECT_ROOT });
    let output = "";
    let error = "";

    vale.stdout.on("data", (data) => {
      output += data.toString();
    });

    vale.stderr.on("data", (data) => {
      error += data.toString();
    });

    vale.on("close", (code) => {
      // Parse Vale output to extract statistics
      const result: LintResult = {
        success: code === 0,
        filesLinted: files.length,
        errors: 0,
        warnings: 0,
        suggestions: 0,
        output: output + error,
      };

      // Extract statistics from Vale output
      const statsMatch = result.output.match(
        /✖ (\d+) errors?, (\d+) warnings? and (\d+) suggestions?/
      );
      if (statsMatch) {
        result.errors = parseInt(statsMatch[1], 10);
        result.warnings = parseInt(statsMatch[2], 10);
        result.suggestions = parseInt(statsMatch[3], 10);
      }

      resolve(result);
    });
  });
}

/**
 * Format and display the linting results
 */
function displayResults(
  files: string[],
  result: LintResult,
  options: LintOptions
): void {
  if (options.format === "json") {
    console.log(
      JSON.stringify(
        {
          filesLinted: result.filesLinted,
          errors: result.errors,
          warnings: result.warnings,
          suggestions: result.suggestions,
          success: result.success,
          files: files.map((f) => relative(PROJECT_ROOT, f)),
        },
        null,
        2
      )
    );
    return;
  }

  // Show the Vale output
  if (result.output && result.output.trim()) {
    console.log(result.output);
  }

  // Show summary
  console.log();
  if (result.filesLinted === 0) {
    console.log(`${colors.yellow}No files to lint.${colors.reset}`);
    return;
  }

  const filesText = result.filesLinted === 1 ? "file" : "files";
  console.log(
    `${colors.cyan}Linted ${result.filesLinted} ${filesText}${colors.reset}`
  );

  if (options.verbose) {
    console.log(`${colors.gray}Files processed:${colors.reset}`);
    files.forEach((file) => {
      console.log(
        `  ${colors.gray}${relative(PROJECT_ROOT, file)}${
          colors.reset
        }`
      );
    });
    console.log();
  }

  // Show statistics with colors
  if (
    result.errors > 0 ||
    result.warnings > 0 ||
    result.suggestions > 0
  ) {
    const parts = [];
    if (result.errors > 0) {
      parts.push(
        `${colors.red}${result.errors} error${
          result.errors !== 1 ? "s" : ""
        }${colors.reset}`
      );
    }
    if (result.warnings > 0) {
      parts.push(
        `${colors.yellow}${result.warnings} warning${
          result.warnings !== 1 ? "s" : ""
        }${colors.reset}`
      );
    }
    if (result.suggestions > 0) {
      parts.push(
        `${colors.blue}${result.suggestions} suggestion${
          result.suggestions !== 1 ? "s" : ""
        }${colors.reset}`
      );
    }

    console.log(`Found: ${parts.join(", ")}`);
  } else {
    console.log(
      `${colors.green}✅ All prose looks good!${colors.reset}`
    );
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    return;
  }

  try {
    if (options.verbose) {
      console.log(
        `${colors.cyan}🔍 Discovering files to lint...${colors.reset}`
      );
    }

    const files = await discoverFiles(options);

    if (options.verbose) {
      console.log(
        `${colors.cyan}📝 Running Vale linting...${colors.reset}`
      );
    }

    const result = await runVale(files, options);

    displayResults(files, result, options);

    // Exit with appropriate code
    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error(
      `${colors.red}Error: ${
        error instanceof Error ? error.message : error
      }${colors.reset}`
    );
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as lintProse };
