import { GitUtils } from "./git-utils.js";
import { BuildLogger } from "./helpers.js";
import type { KBRBuilderOptions } from "./index.js";

/**
 * Centralized git-aware build pipeline that coordinates all file processing
 * based on actual changes detected in the git repository.
 */
export class GitAwareBuildPipeline {
  private gitAware: boolean;
  private forceAll: boolean;
  private isGitRepo: boolean;

  // Cached change detection results
  private _changedMarkdownFiles?: string[];
  private _changedMarkdownPaths?: string[];
  private _changedHtmlFiles?: string[];
  private _allChangedFiles?: string[];

  constructor(options: KBRBuilderOptions = {}) {
    this.gitAware = options.gitAware ?? false;
    this.forceAll = options.forceAll ?? false;
    this.isGitRepo = GitUtils.isGitRepository();
  }

  /**
   * Get all changed files (cached for efficiency)
   */
  private getAllChangedFiles(): string[] {
    if (this._allChangedFiles === undefined) {
      this._allChangedFiles = this.isGitRepo ? GitUtils.getChangedFiles() : [];
    }
    return this._allChangedFiles;
  }

  /**
   * Determine if markdown processing should run
   */
  shouldProcessMarkdown(): boolean {
    if (!this.gitAware || this.forceAll || !this.isGitRepo) {
      return true; // Process all files in non-git-aware mode
    }

    const changedMarkdown = this.getChangedMarkdownPaths();
    return changedMarkdown.length > 0;
  }

  /**
   * Get changed markdown files that need processing
   */
  getChangedMarkdownFiles(): string[] {
    if (this._changedMarkdownFiles === undefined) {
      if (!this.gitAware || this.forceAll || !this.isGitRepo) {
        this._changedMarkdownFiles = []; // Will be handled by file discovery
      } else {
        this._changedMarkdownFiles = GitUtils.getChangedMarkdownFiles();
      }
    }
    return this._changedMarkdownFiles;
  }

  /**
   * Get changed markdown paths including deleted files.
   */
  getChangedMarkdownPaths(): string[] {
    if (this._changedMarkdownPaths === undefined) {
      if (!this.gitAware || this.forceAll || !this.isGitRepo) {
        this._changedMarkdownPaths = [];
      } else {
        this._changedMarkdownPaths = GitUtils.getChangedMarkdownPaths();
      }
    }

    return this._changedMarkdownPaths;
  }

  /**
   * Get changed HTML files that need processing
   */
  getChangedHtmlFiles(): string[] {
    if (this._changedHtmlFiles === undefined) {
      if (!this.gitAware || this.forceAll || !this.isGitRepo) {
        this._changedHtmlFiles = []; // Will be handled by file discovery
      } else {
        this._changedHtmlFiles = GitUtils.getChangedHtmlFiles();
      }
    }
    return this._changedHtmlFiles;
  }

  /**
   * Determine if blog manifest generation should run
   * Only runs when markdown files have been processed or changed
   */
  shouldGenerateBlogManifest(): boolean {
    if (!this.gitAware || this.forceAll || !this.isGitRepo) {
      return true; // Always generate in non-git-aware mode
    }

    // Check if any markdown files changed
    const changedMarkdown = this.getChangedMarkdownFiles();
    if (changedMarkdown.length > 0) {
      return true;
    }

    // Check if any markdown files were deleted
    const allChangedFiles = this.getAllChangedFiles();
    const deletedMarkdown = allChangedFiles.filter(
      (file) =>
        file.endsWith(".md") &&
        file.startsWith("source/site/content/published/")
    );

    return deletedMarkdown.length > 0;
  }

  /**
   * Log the build strategy being used
   */
  logBuildStrategy(): void {
    if (!this.isGitRepo) {
      BuildLogger.info("📝 Not a git repository: processing all files");
    } else if (!this.gitAware) {
      BuildLogger.info("📝 Standard mode: processing all files");
    } else if (this.forceAll) {
      BuildLogger.info(
        "🔧 Git-aware mode with --force-all: processing all files"
      );
    } else {
      const changedFiles = this.getAllChangedFiles();
      BuildLogger.info(
        `🔧 Git repository detected (branch: ${GitUtils.getCurrentBranch()})`
      );
      BuildLogger.info(`📊 Found ${changedFiles.length} changed files`);

      const changedMarkdown = this.getChangedMarkdownFiles();
      const changedHtml = this.getChangedHtmlFiles();

      if (changedMarkdown.length > 0) {
        BuildLogger.info(
          `📝 Found ${changedMarkdown.length} changed markdown files:`
        );
        changedMarkdown.forEach((file) => BuildLogger.info(`  - ${file}`));
      } else {
        BuildLogger.info("📝 No changed markdown files detected");
      }

      if (changedHtml.length > 0) {
        BuildLogger.info(`🌐 Found ${changedHtml.length} changed HTML files:`);
        changedHtml.forEach((file) => BuildLogger.info(`  - ${file}`));
      } else {
        BuildLogger.info("🌐 No changed HTML files detected");
      }
    }
  }

  /**
   * Whether incremental behavior is active and git metadata is available.
   */
  isIncrementalMode(): boolean {
    return this.gitAware && !this.forceAll && this.isGitRepo;
  }
}
