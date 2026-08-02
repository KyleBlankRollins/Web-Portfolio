import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import path from "path";
import { BacklogParser } from "./backlog-parser.js";
import { BacklogWriter } from "./backlog-writer.js";
import { setupApiRoutes } from "./api-routes.js";

const ADMIN_PORT = 4000;
const ADMIN_UI_PORT = 4001;

// Path to backlog file
const BACKLOG_PATH = path.join(
  process.cwd(),
  "source",
  "site",
  "content",
  "__drafts",
  "backlog.md"
);

/**
 * Start the admin server
 *
 * This server provides REST API endpoints for managing blog post metadata
 * stored in backlog.md. It runs independently of the main blog build process.
 */
export function startAdminServer() {
  console.log("🔧 Starting Admin Server...");

  const app = express();
  const parser = new BacklogParser(BACKLOG_PATH);
  const writer = new BacklogWriter(BACKLOG_PATH);

  // Middleware
  app.use(
    cors({
      origin: `http://localhost:${ADMIN_UI_PORT}`,
      credentials: true,
    })
  );
  app.use(express.json());

  // Logging middleware
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  // Setup API routes
  setupApiRoutes(app, parser, writer);

  // Health check endpoint
  app.get("/health", (_req: Request, res: Response) => {
    const backlogExists = parser.exists();
    res.json({
      status: "ok",
      backlogExists,
      backlogPath: BACKLOG_PATH,
    });
  });

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: "Route not found",
    });
  });

  // Start server
  app.listen(ADMIN_PORT, () => {
    console.log(`✅ Admin server running on http://localhost:${ADMIN_PORT}`);
    console.log(`📁 Backlog path: ${BACKLOG_PATH}`);
    console.log(`🌐 Admin UI should run on http://localhost:${ADMIN_UI_PORT}`);
    console.log("");
    console.log("Available endpoints:");
    console.log(`  GET    /health`);
    console.log(`  GET    /api/posts`);
    console.log(`  POST   /api/posts`);
    console.log(`  PATCH  /api/posts/:id`);
    console.log(`  DELETE /api/posts/:id`);
  });
}

// Only start if running this file directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startAdminServer();
}
