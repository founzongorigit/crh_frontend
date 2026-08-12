import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  define: {
    API_BASE_URL: JSON.stringify(
      process.env.NODE_ENV === 'production'
        ? 'https://api-crh.ajna-ci.site/api'
        : 'http://localhost:8000/api'
    ),
  },
})
