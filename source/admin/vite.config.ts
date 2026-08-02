import { defineConfig } from "vite";
import { resolve } from "node:path";

/**
 * Vite configuration for Admin UI
 *
 * This runs a separate Vite instance on port 4001 for the admin interface.
 * It's completely isolated from the main blog build.
 */
export default defineConfig({
  root: resolve(import.meta.dirname, "ui"),

  server: {
    port: 4001,
    strictPort: true,
    open: false,
  },

  build: {
    outDir: resolve(import.meta.dirname, "../../dist-admin"),
    emptyOutDir: true,
  },

  resolve: {
    alias: {
      "@admin": resolve(import.meta.dirname),
      "@types": resolve(import.meta.dirname, "../types"),
    },
  },
});
