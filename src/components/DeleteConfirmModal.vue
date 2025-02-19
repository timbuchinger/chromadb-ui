<script setup lang="ts">
import { useChromaStore } from '../stores/chroma'
import { useLoadingStore } from '../stores/loading'
import LoadingSpinner from './LoadingSpinner.vue'

const props = defineProps<{
  show: boolean
  collectionName: string
}>()

const emit = defineEmits<{
  close: []
  deleted: [collection: string]
}>()

const chromaStore = useChromaStore()
const loadingStore = useLoadingStore()

const handleDelete = async () => {
  try {
    await chromaStore.deleteCollection(props.collectionName)
    await chromaStore.fetchCollections() // Explicitly refresh collections
    emit('deleted', props.collectionName)
  } catch (error) {
    // Error handled by chromaStore
  } finally {
    emit('close')
  }
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75"></div>

      <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 overflow-hidden shadow-xl">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Delete Collection
        </h3>

        <p class="text-gray-600 dark:text-gray-400">
          Are you sure you want to delete the collection "{{ collectionName }}"?
        </p>

        <div class="mt-4 flex justify-end space-x-3">
          <button
            @click="emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
          >
            Cancel
          </button>
          <button
            @click="handleDelete"
            :disabled="loadingStore.isLoading('collections')"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
            data-test="confirm-delete-button"
          >
            <LoadingSpinner v-if="loadingStore.isLoading('collections')" size="sm" class="mr-2" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
