import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add this css block to prevent Vite from searching for external PostCSS config files
  css: {
    postcss: {}
  },
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'https://virtualvaani.vgipl.com:8000',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
