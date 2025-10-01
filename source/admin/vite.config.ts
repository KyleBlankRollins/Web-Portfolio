import { defineConfig } from "vite";
import { resolve } from "path";

/**
 * Vite configuration for Admin UI
 *
 * This runs a separate Vite instance on port 4001 for the admin interface.
 * It's completely isolated from the main blog build.
 */
export default defineConfig({
  root: resolve(__dirname, "ui"),

  server: {
    port: 4001,
    strictPort: true,
    open: false,
  },

  build: {
    outDir: resolve(__dirname, "../../dist-admin"),
    emptyOutDir: true,
  },

  resolve: {
    alias: {
      "@admin": resolve(__dirname),
      "@types": resolve(__dirname, "../types"),
    },
  },
});
