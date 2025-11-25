import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.{test,spec}.ts', 'tests/**/*.{test,spec}.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,vue}'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.config.*',
        '**/cypress/**',
        'src/vite-env.d.ts',
        'src/main.ts'
      ]
      // Coverage thresholds - increase incrementally as coverage improves
      // Current coverage: ~28% overall (composables/directives at 100%)
      // Enable once coverage target is closer to being met:
      // thresholds: {
      //   statements: 50,
      //   lines: 50,
      //   functions: 50,
      //   branches: 40
      // }
    }
  }
})
