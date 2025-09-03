// frontend/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // rutas relativas para que el CSS/JS funcionen en subcarpetas o detrás de proxy
  base: './',
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      // opcional: proxy a backend en dev
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
