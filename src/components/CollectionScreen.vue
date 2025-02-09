<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useChromaStore } from '../stores/chroma'
import { useLoadingStore } from '../stores/loading'
import DocumentsList from './DocumentsList.vue'
import LoadingSkeleton from './LoadingSkeleton.vue'

const route = useRoute()
const router = useRouter()
const chromaStore = useChromaStore()
const loadingStore = useLoadingStore()

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
      <!-- Back button and title (always visible) -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center space-x-4">
          <button
            @click="handleReturnToCollections"
            class="px-3 py-1 text-sm text-accent-primary hover:text-accent-secondary dark:text-accent-primary dark:hover:text-accent-secondary font-medium"
          >
            ← Back to Collections
          </button>
          <h1 class="text-2xl font-semibold text-[#1F2937] dark:text-[#F9FAFB]">
            <template v-if="!loadingStore.isLoading('collections') && !loadingStore.isLoading('documents')">
              Collection: {{ route.params.name }}
            </template>
            <template v-else>
              <LoadingSkeleton width="200px" height="32px" />
            </template>
          </h1>
        </div>
      </div>

      <!-- Error state -->
      <div v-if="chromaStore.error" class="text-center text-red-500">
        {{ chromaStore.error }}
      </div>

      <!-- Content -->
      <DocumentsList />
    </div>
  </div>
</template>
