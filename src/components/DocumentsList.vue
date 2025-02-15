<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChromaStore } from '../stores/chroma'
import { useLoadingStore } from '../stores/loading'
import DocumentModal from './DocumentModal.vue'
import AddDocumentModal from './AddDocumentModal.vue'
import type { Document } from '../stores/chroma'

const chromaStore = useChromaStore()
const loadingStore = useLoadingStore()
const selectedDocument = ref<Document | null>(null)
const showModal = ref(false)
const showAddModal = ref(false)
const currentPage = ref(1)
const itemsPerPage = 20

const paginatedDocuments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return chromaStore.documents.slice(start, end)
})

const totalPages = computed(() =>
  Math.ceil(chromaStore.documents.length / itemsPerPage)
)

const truncateText = (text: string, maxLength: number = 50) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

const stringifyMetadata = (metadata: Record<string, any>) => {
  return JSON.stringify(metadata)
}

const openDocument = (document: Document) => {
  selectedDocument.value = document
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedDocument.value = null
}

const handleDeleteDocument = async (id: string) => {
  if (chromaStore.currentCollection) {
    try {
      await chromaStore.deleteDocument(chromaStore.currentCollection.name, id)
    } catch (error) {
      // Error handled by chromaStore
    }
  }
}
</script>

<template>
  <div>
    <!-- Header with Add Document button -->
    <div class="mb-6">
      <div class="flex justify-between items-center h-[36px]">
        <div class="flex items-center">
          <h2 class="text-xl font-semibold text-content-primary-light dark:text-content-primary-dark">
            Documents
          </h2>
          <span class="ml-2 text-base font-normal text-gray-500 dark:text-gray-400 min-w-[80px]">
            <template v-if="!loadingStore.isLoading('documents')">
              ({{ chromaStore.documents.length }} total)
            </template>
            <template v-else>
              <LoadingSkeleton width="60px" height="20px" class="inline-block ml-1" />
            </template>
          </span>
        </div>
        <button
          @click="showAddModal = true"
          class="px-4 py-2 text-sm bg-accent-primary text-white rounded-md hover:bg-accent-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loadingStore.isLoading('documents')"
        >
          Add Document
        </button>
      </div>
    </div>

    <div v-if="(loadingStore.isLoading('collections') || loadingStore.isLoading('documents')) && chromaStore.currentCollection">
      <div class="overflow-x-auto min-h-[400px] max-h-[calc(100vh-20rem)]">
        <table class="min-w-full divide-y divide-border-primary-light dark:divide-border-primary-dark">
          <thead class="bg-surface-secondary-light dark:bg-surface-secondary-dark sticky top-0 z-10 shadow-sm">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-content-primary-light dark:text-content-primary-dark uppercase tracking-wider w-1/4">
                ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-content-primary-light dark:text-content-primary-dark uppercase tracking-wider w-1/4">
                Metadata
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-content-primary-light dark:text-content-primary-dark uppercase tracking-wider w-1/2">
                Document
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="i in 5" :key="i">
              <td class="px-6 py-4">
                <LoadingSkeleton height="20px" width="150px" />
              </td>
              <td class="px-6 py-4">
                <LoadingSkeleton height="20px" width="180px" />
              </td>
              <td class="px-6 py-4">
                <LoadingSkeleton height="20px" width="300px" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else>
      <div v-if="chromaStore.documents.length === 0" class="flex items-center justify-center h-[400px] text-center text-gray-500 dark:text-gray-400">
        <p>There are no documents in the collection</p>
      </div>

      <div v-else>
        <div class="overflow-x-auto min-h-[400px] max-h-[calc(100vh-20rem)]">
          <table class="min-w-full divide-y divide-border-primary-light dark:divide-border-primary-dark">
            <thead class="bg-surface-secondary-light dark:bg-surface-secondary-dark sticky top-0 z-10 shadow-sm">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-content-primary-light dark:text-content-primary-dark uppercase tracking-wider">
                  ID
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-content-primary-light dark:text-content-primary-dark uppercase tracking-wider">
                  Metadata
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-content-primary-light dark:text-content-primary-dark uppercase tracking-wider">
                  Document
                </th>
              </tr>
            </thead>
            <tbody class="bg-surface-primary-light dark:bg-surface-primary-dark divide-y divide-border-primary-light dark:divide-border-primary-dark">
              <tr v-for="doc in paginatedDocuments"
                  :key="doc.id"
                  @click="openDocument(doc)"
                  class="hover:bg-surface-secondary-light dark:hover:bg-surface-secondary-dark cursor-pointer transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-content-primary-light dark:text-content-primary-dark">
                  {{ doc.id }}
                </td>
                <td class="px-6 py-4 text-sm text-content-primary-light dark:text-content-primary-dark">
                  {{ truncateText(stringifyMetadata(doc.metadata)) }}
                </td>
                <td class="px-6 py-4 text-sm text-content-primary-light dark:text-content-primary-dark">
                  {{ truncateText(doc.document) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination with fixed height -->
        <div v-if="totalPages > 1" class="mt-6 flex justify-center space-x-2 h-[36px] items-center">
          <button :disabled="currentPage === 1" @click="currentPage--" class="px-3 py-1 text-sm bg-surface-secondary-light dark:bg-surface-secondary-dark text-content-primary-light dark:text-content-primary-dark rounded-md disabled:opacity-50 hover:bg-accent-secondary/10 dark:hover:bg-accent-secondary/10 transition-colors duration-200">
            Previous
          </button>
          <span class="px-3 py-1 text-sm text-content-primary-light dark:text-content-primary-dark">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button :disabled="currentPage === totalPages" @click="currentPage++" class="px-3 py-1 text-sm bg-surface-secondary-light dark:bg-surface-secondary-dark text-content-primary-light dark:text-content-primary-dark rounded-md disabled:opacity-50 hover:bg-accent-secondary/10 dark:hover:bg-accent-secondary/10 transition-colors duration-200">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>

  <AddDocumentModal :show="showAddModal" @close="showAddModal = false" @document-added="chromaStore.fetchCollectionDocuments(chromaStore.currentCollection!.name)" />

  <DocumentModal :show="showModal" :document="selectedDocument" @close="closeModal" @delete="handleDeleteDocument" />
</template>
