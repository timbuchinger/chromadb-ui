<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useViewStore } from '../stores/view'
import { useChromaStore } from '../stores/chroma'
import DocumentsList from './DocumentsList.vue'

const viewStore = useViewStore()
const chromaStore = useChromaStore()

const showDocuments = computed(() => chromaStore.currentCollection !== null)

// Load collections when component mounts
onMounted(async () => {
  try {
    await chromaStore.fetchCollections()
  } catch (error) {
    console.error('Failed to fetch collections:', error)
  }
})

const viewCollection = async (collection: string) => {
  try {
    await chromaStore.fetchCollectionDocuments(collection)
  } catch (error) {
    console.error('Failed to fetch collection documents:', error)
  }
}

const handleReturnToCollections = () => {
  chromaStore.currentCollection = null
}
</script>

<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-[#1F2937] dark:text-[#F9FAFB]">
          {{ showDocuments ? `Collection: ${chromaStore.currentCollection}` : 'Collections' }}
        </h1>
        <button
          v-if="showDocuments"
          @click="handleReturnToCollections"
          class="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          ← Back to Collections
        </button>
      </div>
      <!-- Loading state -->
      <div v-if="chromaStore.loading" class="mt-6 text-center text-gray-500 dark:text-gray-400">
        Loading...
      </div>

      <!-- Error state -->
      <div v-else-if="chromaStore.error" class="mt-6 text-center text-red-500">
        {{ chromaStore.error }}
      </div>

      <!-- Collections list -->
      <div v-else-if="!showDocuments" :class="[
        'mt-6',
        viewStore.isTableView ? 'divide-y divide-gray-200 dark:divide-gray-700' : 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
      ]">
        <div
          v-for="collection in chromaStore.collections"
          :key="collection.name"
          :class="[
            'flex items-center justify-between',
            viewStore.isTableView
              ? 'py-4 px-6'
              : 'bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-4'
          ]"
        >
            <h2 :class="[
              'font-medium text-[#1F2937] dark:text-[#F9FAFB]',
              viewStore.isTableView ? 'text-base' : 'text-lg'
            ]">
              {{ collection.name }}
          </h2>
          <div class="flex space-x-2">
            <button
              class="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                @click="viewCollection(collection.name)"
            >
              View
            </button>
            <button
              class="px-3 py-1 text-sm bg-red-500 text-white rounded-md opacity-50 cursor-not-allowed"
              disabled
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <div v-else class="mt-6">
        <DocumentsList />
      </div>
    </div>
  </div>
</template>
