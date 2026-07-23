import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    // Three.js ships as its own lazy-loaded chunk (behind the loader), so it
    // legitimately exceeds the default 500 kB advisory.
    chunkSizeWarningLimit: 700,
  },
})
