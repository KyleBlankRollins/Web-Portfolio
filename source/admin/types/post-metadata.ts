/**
 * Admin Post Metadata Types
 *
 * These types define the data model for blog posts in the admin system.
 * Posts are stored in backlog.md and managed through the admin UI.
 */

export type PostStatus =
  | "planned"
  | "researching"
  | "outlining"
  | "writing"
  | "editing"
  | "published"
  | "discarded";

export type PostPriority = "low" | "medium" | "high";

export interface PostMetadata {
  /** Unique identifier (slug-based) */
  id: string;

  /** Post title */
  title: string;

  /** Current status in content lifecycle */
  status: PostStatus;

  /** Optional priority level */
  priority?: PostPriority;

  /** Date post was created */
  created?: string;

  /** Date post was last updated */
  updated?: string;

  /** Date post was published (only if status is 'published') */
  published?: string;

  /** Date post was discarded (only if status is 'discarded') */
  discarded_date?: string;

  /** Reason post was discarded (only if status is 'discarded') */
  discard_reason?: string;

  /** Tags for categorization */
  tags?: string[];

  /** Additional notes or context */
  notes?: string;

  /** Progress log entries */
  progress?: ProgressEntry[];
}

export interface ProgressEntry {
  /** Date of progress entry */
  date: string;

  /** Progress note */
  note: string;
}

/**
 * Response from API endpoints
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Request to update a post
 */
export interface UpdatePostRequest {
  status?: PostStatus;
  priority?: PostPriority;
  notes?: string;
  tags?: string[];
  discard_reason?: string;
}
