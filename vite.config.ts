import { defineConfig } from 'vite'

// GitHub Pages: https://longxia7hao-dev.github.io/office-drink-draw/
export default defineConfig({
  base: process.env.VITE_BASE || '/office-drink-draw/',
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
})
