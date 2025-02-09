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
  chromaStore.documents = []
  router.push('/')
}
</script>

<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-10rem)]">
      <!-- Main Content with Transition -->
      <div class="transition-all duration-300">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-4">
            <button
              @click="handleReturnToCollections"
              class="px-3 py-1 text-sm text-accent-primary hover:text-accent-secondary dark:text-accent-primary dark:hover:text-accent-secondary font-medium transition-colors duration-200"
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
        <div v-if="chromaStore.error" class="text-center text-red-500 mb-6">
          {{ chromaStore.error }}
        </div>

        <!-- Content with Loading State -->
        <div class="transition-opacity duration-300" :class="{ 'opacity-50': loadingStore.isLoading('documents') }">
          <DocumentsList />
        </div>
      </div>
    </div>
  </div>
</template>
