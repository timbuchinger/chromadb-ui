<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import type { Document } from '../stores/chroma'
import { useChromaStore } from '../stores/chroma'

const chromaStore = useChromaStore()
const props = defineProps<{
  show: boolean
  document: Document | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'delete', id: string): void
}>()

const showDeleteConfirm = ref(false)

const closeModal = () => {
  showDeleteConfirm.value = false
  emit('close')
}

const handleDelete = async () => {
  if (props.document && chromaStore.currentCollection) {
    try {
      await chromaStore.deleteDocument(chromaStore.currentCollection.name, props.document.id)
      emit('delete', props.document.id)
      closeModal()
    } catch (error) {
      console.error('Failed to delete document:', error)
    }
  }
}

const stringifyMetadata = (metadata: Record<string, any>) => {
  return JSON.stringify(metadata, null, 2)
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click="closeModal"
  >
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75"></div>

      <div
        class="relative bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full p-6 overflow-hidden shadow-xl"
        @click.stop
      >
        <!-- Header -->
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
            Document Details
          </h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <span class="sr-only">Close</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div v-if="document" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">ID</label>
            <div class="mt-1 text-gray-900 dark:text-gray-100">{{ document.id }}</div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Metadata</label>
            <pre class="mt-1 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 p-3 rounded-md overflow-x-auto">{{ stringifyMetadata(document.metadata) }}</pre>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Document</label>
            <div class="mt-1 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 p-3 rounded-md whitespace-pre-wrap">
              {{ document.document }}
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-6 flex justify-between">
          <!-- Left side: Delete actions -->
          <div class="flex space-x-3">
            <button
              v-if="!showDeleteConfirm"
              @click="showDeleteConfirm = true"
              class="px-4 py-2 text-sm font-medium text-white bg-accent-error hover:bg-accent-error/90 focus:ring-2 focus:ring-accent-error/20 rounded-md transition-colors duration-200"
            >
              Delete
            </button>
            <template v-if="showDeleteConfirm">
              <button
                @click="handleDelete"
                class="px-4 py-2 text-sm font-medium text-white bg-accent-error hover:bg-accent-error/90 focus:ring-2 focus:ring-accent-error/20 rounded-md transition-colors duration-200"
              >
                Confirm Delete
              </button>
              <button
                @click="showDeleteConfirm = false"
                class="px-4 py-2 text-sm font-medium text-content-primary-light dark:text-content-primary-dark bg-surface-secondary-light hover:bg-surface-secondary-light/90 dark:bg-surface-secondary-dark dark:hover:bg-surface-secondary-dark/90 rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
            </template>
          </div>
          <!-- Right side: Close button -->
          <button
            v-if="!showDeleteConfirm"
            @click="closeModal"
            class="px-4 py-2 text-sm font-medium text-content-primary-light dark:text-content-primary-dark bg-surface-secondary-light hover:bg-surface-secondary-light/90 dark:bg-surface-secondary-dark dark:hover:bg-surface-secondary-dark/90 rounded-md transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
