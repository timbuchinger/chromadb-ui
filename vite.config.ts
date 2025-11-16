import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: './postcss.config.js'
  },
  optimizeDeps: {
    exclude: ['chromadb']
  },
  build: {
    target: 'esnext'
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts']
  }
})
