<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  show: boolean
  shortcuts: Array<{ keys: string; description: string }>
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const handleClose = () => {
  emit('close')
}

const sortedShortcuts = computed(() => {
  return [...props.shortcuts].sort((a, b) => a.description.localeCompare(b.description))
})
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-labelledby="shortcut-help-title" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75" aria-hidden="true" @click="handleClose"></div>

      <div
        class="relative bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 overflow-hidden shadow-xl"
        role="document"
        @keydown.esc="handleClose"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 id="shortcut-help-title" class="text-lg font-medium text-gray-900 dark:text-gray-100">
            Keyboard Shortcuts
          </h2>
          <button
            @click="handleClose"
            class="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-primary rounded-md"
            aria-label="Close keyboard shortcuts dialog"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div class="mt-2 space-y-4">
          <div v-for="(shortcut, index) in sortedShortcuts" :key="index" class="flex justify-between items-center py-2">
            <span class="text-gray-700 dark:text-gray-300">{{ shortcut.description }}</span>
            <kbd class="px-2 py-1 text-sm font-semibold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
              {{ shortcut.keys }}
            </kbd>
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
