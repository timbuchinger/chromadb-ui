<script setup lang="ts">
import { ref, computed } from 'vue'
import { useViewStore } from '../stores/view'
import DocumentsList from './DocumentsList.vue'

const collections = ref(['notes', 'pdfs', 'images'])
const selectedCollection = ref<string | null>(null)
const viewStore = useViewStore()

const showDocuments = computed(() => selectedCollection.value !== null)

const viewCollection = (collection: string) => {
  selectedCollection.value = collection
}

const handleReturnToCollections = () => {
  selectedCollection.value = null
}
</script>

<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-[#1F2937] dark:text-[#F9FAFB]">
          {{ showDocuments ? `Collection: ${selectedCollection}` : 'Collections' }}
        </h1>
        <button
          v-if="showDocuments"
          @click="handleReturnToCollections"
          class="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          ← Back to Collections
        </button>
      </div>
      <div v-if="!showDocuments" :class="[
        'mt-6',
        viewStore.isTableView ? 'divide-y divide-gray-200 dark:divide-gray-700' : 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
      ]">
        <div
          v-for="collection in collections"
          :key="collection"
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
            {{ collection }}
          </h2>
          <div class="flex space-x-2">
            <button
              class="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
              @click="viewCollection(collection)"
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
