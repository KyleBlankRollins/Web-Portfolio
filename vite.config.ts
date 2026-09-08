import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import { kbrBuilder } from "./source/builder/index.ts";

function bundleIconData() {
  const iconDirectory = resolve(process.cwd(), "public/assets/icons");

  return {
    name: "kbr-bundle-icon-data",
    transform(_code: string, id: string) {
      if (!id.endsWith("/source/site/components/icon/icon-data.ts")) {
        return;
      }

      const icons = Object.fromEntries(
        readdirSync(iconDirectory)
          .filter((filename) => filename.endsWith(".svg"))
          .map((filename) => [
            filename.replace(/\.svg$/, ""),
            readFileSync(resolve(iconDirectory, filename), "utf-8"),
          ])
      );

      return `export const ICONS = ${JSON.stringify(icons)};`;
    },
  };
}

export default defineConfig({
  root: "source/site",
  publicDir: "../../public",
  base: "/",
  build: {
    outDir: "../../dist",
    emptyOutDir: process.env.GIT_AWARE !== "true",
    // Additional performance optimizations
    target: "es2022",
    cssMinify: true,
    sourcemap: false, // Disable source maps in production for smaller files
    rollupOptions: {
      input: "main.ts",
      output: {
        codeSplitting: {
          groups: [{ name: "lit", test: /node_modules[\\/]lit/ }],
        },
        // Optimize chunk file names for caching
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
    manifest: true,
    // Enable compression
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500, // Warn for chunks > 500KB
  },
  server: {
    port: 3000,
    watch: {
      // Ensure Vite watches the pages directory for changes
      ignored: ["!**/pages/**"],
    },
  },
  css: {
    devSourcemap: true,
    // CSS code splitting and optimization
    modules: false, // Disable CSS modules if not needed
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["lit"],
    exclude: [], // Add any deps you want to skip pre-bundling
  },
  plugins: [
    bundleIconData(),
    kbrBuilder({
      gitAware: process.env.GIT_AWARE === "true",
      forceAll: process.env.FORCE_ALL === "true",
    }),
    // Bundle analyzer (only when ANALYZE=true)
    ...(process.env.ANALYZE
      ? [
          visualizer({
            filename: "dist/bundle-analysis.html",
            open: true,
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),
  ],
});
