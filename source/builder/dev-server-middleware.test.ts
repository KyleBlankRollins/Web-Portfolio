import { EventEmitter } from "node:events";
import { describe, expect, it, vi } from "vitest";
import { setupFileWatcher } from "./dev-server-middleware.js";

describe("development renderer watcher", () => {
  it.each([
    ["pages", "/source/site/pages/about.html"],
    ["templates", "/source/site/templates/base.html"],
    ["content", "/source/site/content/published/post.md"],
    ["themes", "/source/site/styles/themes/base.css"],
    ["site index", "/source/site/index.html"],
  ])("rebuilds and reloads for %s changes", async (_label, filePath) => {
    const watcher = new EventEmitter();
    const rebuildRenderedSite = vi.fn().mockResolvedValue(undefined);
    const send = vi.fn();

    setupFileWatcher(
      {
        watcher,
        ws: { send },
      } as never,
      rebuildRenderedSite
    );

    watcher.emit("change", filePath);
    await vi.waitFor(() => {
      expect(rebuildRenderedSite).toHaveBeenCalledOnce();
    });

    expect(send).toHaveBeenCalledWith({ type: "full-reload" });
  });

  it("ignores files outside renderer-owned sources", async () => {
    const watcher = new EventEmitter();
    const rebuildRenderedSite = vi.fn().mockResolvedValue(undefined);
    const send = vi.fn();

    setupFileWatcher(
      {
        watcher,
        ws: { send },
      } as never,
      rebuildRenderedSite
    );

    watcher.emit("change", "/source/site/components/button.ts");
    await Promise.resolve();

    expect(rebuildRenderedSite).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });
});
