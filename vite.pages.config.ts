import { resolve } from "node:path";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/office-drink-draw/",
  root: resolve("pages-entry"),
  publicDir: resolve("public"),
  plugins: [tailwindcss(), viteReact()],
  resolve: {
    alias: { "@": resolve("src") },
  },
  build: {
    outDir: resolve("dist-pages"),
    emptyOutDir: true,
    assetsDir: "assets",
  },
});
