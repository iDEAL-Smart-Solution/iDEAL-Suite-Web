import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server:{
    host: true,
    port: 3000,
    proxy: {
      // Proxy local /api calls to the remote API to avoid CORS during development.
      // Requests to /api/whatever will be forwarded to the configured target.
      '/api': {
        target: 'https://suite.api.idealsmartsolutions.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})
