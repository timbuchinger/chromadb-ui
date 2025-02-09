<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChromaStore } from '../stores/chroma'
import { useLoadingStore } from '../stores/loading'
import DocumentModal from './DocumentModal.vue'
import AddDocumentModal from './AddDocumentModal.vue'
import LoadingSpinner from './LoadingSpinner.vue'
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
      console.error('Failed to delete document:', error)
    }
  }
}
</script>

<template>
  <div>
    <!-- Header with Add Document button -->
    <div class="mb-6 space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-[#1F2937] dark:text-[#F9FAFB]">
          Documents
          <span class="ml-2 text-base font-normal text-gray-500">
            <template v-if="!loadingStore.isLoading('documents')">
              ({{ chromaStore.documents.length }} total)
            </template>
            <template v-else>
              <LoadingSkeleton width="40px" height="20px" class="inline-block ml-1" />
            </template>
          </span>
        </h2>
        <button
          @click="showAddModal = true"
          class="px-4 py-2 text-sm bg-accent-primary text-white rounded-md hover:bg-accent-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loadingStore.isLoading('documents')"
        >
          Add Document
        </button>
      </div>
    </div>

    <!-- Error state -->
    <div v-if="chromaStore.error" class="text-center text-red-500 py-4">
      {{ chromaStore.error }}
    </div>

    <!-- Loading state -->
    <div v-else-if="loadingStore.isLoading('collections') || loadingStore.isLoading('documents')">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-[#E5E7EB] dark:divide-[#374151]">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/4">
                ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/4">
                Metadata
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/2">
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

    <!-- Documents list -->
    <div v-else>
        <!-- Empty state -->
        <div v-if="chromaStore.documents.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-8">
        There are no documents in the collection
      </div>

      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-[#E5E7EB] dark:divide-[#374151]">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Metadata
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Document
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="doc in paginatedDocuments"
                :key="doc.id"
                @click="openDocument(doc)"
                class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {{ doc.id }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                  {{ truncateText(stringifyMetadata(doc.metadata)) }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                  {{ truncateText(doc.document) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-6 flex justify-center space-x-2">
          <button
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span class="px-3 py-1 text-sm">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            :disabled="currentPage === totalPages"
            @click="currentPage++"
            class="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>

  <AddDocumentModal
    :show="showAddModal"
    @close="showAddModal = false"
    @document-added="chromaStore.fetchCollectionDocuments(chromaStore.currentCollection!.name)"
  />

  <DocumentModal
    :show="showModal"
    :document="selectedDocument"
    @close="closeModal"
    @delete="handleDeleteDocument"
  />
</template>
