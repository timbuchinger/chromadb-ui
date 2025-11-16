<script setup lang="ts">
defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const handleClose = () => {
  emit('close')
}

// Get version from import.meta.env, fallback to package.json version
const version = import.meta.env.VITE_APP_VERSION || '1.0.0'
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-labelledby="about-title" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75" aria-hidden="true" @click="handleClose"></div>

      <div
        class="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 overflow-hidden shadow-xl"
        role="document"
        @keydown.esc="handleClose"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 id="about-title" class="text-lg font-medium text-gray-900 dark:text-gray-100">
            About ChromaDB UI
          </h2>
          <button
            @click="handleClose"
            class="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-primary rounded-md"
            aria-label="Close about dialog"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div class="mt-4 space-y-4">
          <div class="flex items-center justify-center">
            <img src="/icon.png" alt="ChromaDB UI Logo" class="h-20 w-20" />
          </div>
          
          <div class="text-center">
            <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">ChromaDB UI</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Version {{ version }}</p>
          </div>

          <div class="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>A modern web interface for managing ChromaDB collections, documents, and metadata.</p>
          </div>

          <div class="text-center">
            <a
              href="https://github.com/timbuchinger/chromadb-ui"
              target="_blank"
              rel="noopener noreferrer"
              class="text-accent-primary hover:text-accent-secondary text-sm underline"
            >
              View on GitHub
            </a>
          </div>
        </div>

        <div class="mt-6 text-center">
          <button
            @click="handleClose"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
