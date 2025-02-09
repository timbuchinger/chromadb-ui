<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useChromaStore } from '../stores/chroma'
import DocumentsList from './DocumentsList.vue'

const route = useRoute()
const router = useRouter()
const chromaStore = useChromaStore()

onMounted(async () => {
  try {
    // Make sure we have the collections loaded first
    if (chromaStore.collections.length === 0) {
      await chromaStore.fetchCollections()
    }

    // Now we can fetch the documents using the collection name
    await chromaStore.fetchCollectionDocuments(route.params.name as string)
  } catch (error) {
    console.error('Failed to fetch collection documents:', error)
  }
})

const handleReturnToCollections = () => {
  chromaStore.currentCollection = null
  router.push('/')
}
</script>

<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-[#1F2937] dark:text-[#F9FAFB]">
          Collection: {{ route.params.name }}
        </h1>
        <button
          @click="handleReturnToCollections"
          class="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          ← Back to Collections
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="chromaStore.loading" class="text-center text-gray-500 dark:text-gray-400">
        Loading...
      </div>

      <!-- Error state -->
      <div v-else-if="chromaStore.error" class="text-center text-red-500">
        {{ chromaStore.error }}
      </div>

      <!-- Content -->
      <DocumentsList v-else />
    </div>
  </div>
</template>
