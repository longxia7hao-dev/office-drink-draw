import { copyFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const OUT_DIR = resolve("dist-pages");

/**
 * GitHub Pages 需要的兩個檔案，直接在建置時產生，
 * 這樣從 grok-src 建出來的 dist-pages 就能原封不動上線。
 *
 * - .nojekyll：站上有 `__grok/` 這種底線開頭的目錄，少了它 Jekyll 會整個忽略。
 * - 404.html：SPA fallback，內容就是建好的 index.html（含 hash 後的資產路徑）。
 */
function githubPagesFiles(): Plugin {
  return {
    name: "office-drink-draw:gh-pages-files",
    apply: "build",
    closeBundle() {
      writeFileSync(resolve(OUT_DIR, ".nojekyll"), "");
      copyFileSync(resolve(OUT_DIR, "index.html"), resolve(OUT_DIR, "404.html"));
    },
  };
}

export default defineConfig({
  base: "/office-drink-draw/",
  root: resolve("pages-entry"),
  publicDir: resolve("public"),
  plugins: [tailwindcss(), viteReact(), githubPagesFiles()],
  resolve: {
    alias: { "@": resolve("src") },
  },
  build: {
    outDir: OUT_DIR,
    emptyOutDir: true,
    assetsDir: "assets",
  },
});
