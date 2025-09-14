import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allows access via LAN/public IP (not just localhost)
    port: 5173, // Or whatever you want

    // Proxy API requests to backend during development
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // your backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
