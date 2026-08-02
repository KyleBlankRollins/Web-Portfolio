import express, { type Request, type Response } from "express";
import { BacklogParser } from "./backlog-parser.js";
import { BacklogWriter } from "./backlog-writer.js";
import type { ApiResponse, UpdatePostRequest } from "../types/post-metadata.js";

/**
 * Setup API routes for the admin server
 */
export function setupApiRoutes(
  app: express.Application,
  parser: BacklogParser,
  writer: BacklogWriter
) {
  /**
   * GET /api/posts
   * Get all posts from backlog
   */
  app.get("/api/posts", (_req: Request, res: Response) => {
    const posts = parser.parse();
    const response: ApiResponse<typeof posts> = {
      success: true,
      data: posts,
    };
    res.json(response);
  });

  /**
   * PATCH /api/posts/:id
   * Update a post's metadata
   */
  app.patch(
    "/api/posts/:id",
    async (req: Request<{ id: string }>, res: Response) => {
      const { id } = req.params;
      const updates: UpdatePostRequest = req.body;

      // For now, we only support status updates
      if (updates.status) {
        const success = await writer.updatePostStatus(id, updates.status);

        if (success) {
          const response: ApiResponse<{ id: string }> = {
            success: true,
            data: { id },
          };
          res.json(response);
        } else {
          const response: ApiResponse<null> = {
            success: false,
            error: "Failed to update post status",
          };
          res.status(400).json(response);
        }
      } else {
        const response: ApiResponse<null> = {
          success: false,
          error: "No valid updates provided",
        };
        res.status(400).json(response);
      }
    }
  );

  /**
   * POST /api/posts
   * Create a new post
   */
  app.post("/api/posts", async (req: Request, res: Response) => {
    const { title, status = "planned" } = req.body;

    if (!title) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Title is required",
      };
      res.status(400).json(response);
      return;
    }

    const success = await writer.addPost(title, status);

    if (success) {
      const response: ApiResponse<{ title: string }> = {
        success: true,
        data: { title },
      };
      res.status(201).json(response);
    } else {
      const response: ApiResponse<null> = {
        success: false,
        error: "Failed to create post",
      };
      res.status(500).json(response);
    }
  });

  /**
   * DELETE /api/posts/:id
   * Remove a post from backlog
   */
  app.delete(
    "/api/posts/:id",
    async (req: Request<{ id: string }>, res: Response) => {
      const { id } = req.params;
      const success = await writer.removePost(id);

      if (success) {
        const response: ApiResponse<{ id: string }> = {
          success: true,
          data: { id },
        };
        res.json(response);
      } else {
        const response: ApiResponse<null> = {
          success: false,
          error: "Failed to remove post",
        };
        res.status(400).json(response);
      }
    }
  );
}
