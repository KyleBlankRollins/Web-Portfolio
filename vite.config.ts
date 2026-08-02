import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import { kbrBuilder } from "./source/builder/index.ts";

export default defineConfig({
  root: "source/site",
  publicDir: "../../public",
  base: "./", // Use relative paths for assets
  build: {
    outDir: "../../dist",
    emptyOutDir: process.env.GIT_AWARE !== "true",
    // Additional performance optimizations
    target: "es2022",
    cssMinify: true,
    sourcemap: false, // Disable source maps in production for smaller files
    rollupOptions: {
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
