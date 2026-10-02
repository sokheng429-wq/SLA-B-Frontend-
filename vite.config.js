import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Listen on all network addresses (0.0.0.0) so ngrok can connect
    port: 5173,
    strictPort: true, // Fail immediately if 5173 is unavailable, NEVER fallback to 5174 or other ports
    cors: true, // Allow cross-origin requests
    allowedHosts: true, // Allow ngrok domains (*.ngrok-free.app, *.ngrok.io, etc.)
    proxy: {
      '/api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  preview: {
    host: true,
    port: 5173,
    strictPort: true, // Strictly lock preview to port 5173
    cors: true,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
      }
    }
  },
})
