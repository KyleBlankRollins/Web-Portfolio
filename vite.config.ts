import { defineConfig } from "vite";
import { kbrBuilder } from "./source/builder/index";

export default defineConfig({
  root: "source/site",
  publicDir: "../../public",
  base: "./", // Use relative paths for assets
  build: {
    outDir: "../../dist",
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true,
    watch: {
      // Ensure Vite watches the pages directory for changes
      ignored: ["!**/pages/**"],
    },
  },
  css: {
    devSourcemap: true,
  },
  plugins: [
    kbrBuilder({
      gitAware: process.env.GIT_AWARE === "true",
      forceAll: process.env.FORCE_ALL === "true",
    }),
  ],
});
