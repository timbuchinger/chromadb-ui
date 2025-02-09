<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChromaStore } from '../stores/chroma'
import DocumentModal from './DocumentModal.vue'
import type { Document } from '../stores/chroma'

const chromaStore = useChromaStore()
const selectedDocument = ref<Document | null>(null)
const showModal = ref(false)
const showAddModal = ref(false)
const newDocumentId = ref('')
const newDocumentContent = ref('')
const metadataPairs = ref([{ key: '', value: '' }])
const currentPage = ref(1)
const itemsPerPage = 20
const documentError = ref('')

const paginatedDocuments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return chromaStore.documents.slice(start, end)
})

const totalPages = computed(() =>
  Math.ceil(chromaStore.documents.length / itemsPerPage)
)

const addMetadataPair = () => {
  metadataPairs.value.push({ key: '', value: '' })
}

const removeMetadataPair = (index: number) => {
  metadataPairs.value.splice(index, 1)
}

const handleCreateDocument = async () => {
  if (!newDocumentContent.value) {
    documentError.value = 'Document content is required'
    return
  }

  if (chromaStore.currentCollection) {
    try {
      const metadata = metadataPairs.value.reduce((acc, pair) => {
        if (pair.key && pair.value) {
          acc[pair.key] = pair.value
        }
        return acc
      }, {} as Record<string, string>)

      await chromaStore.addDocument(chromaStore.currentCollection.name, {
        id: newDocumentId.value || undefined,
        document: newDocumentContent.value,
        metadata
      })
      showAddModal.value = false
      newDocumentId.value = ''
      newDocumentContent.value = ''
      metadataPairs.value = [{ key: '', value: '' }]
      documentError.value = ''
    } catch (error) {
      console.error('Failed to add document:', error)
    }
  }
}

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
    <!-- Loading state -->
    <div v-if="chromaStore.loading" class="text-center text-gray-500 dark:text-gray-400 py-4">
      Loading...
    </div>

    <!-- Error state -->
    <div v-else-if="chromaStore.error" class="text-center text-red-500 py-4">
      {{ chromaStore.error }}
    </div>

    <!-- Documents list -->
    <div v-else>
      <div class="mb-6 space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-[#1F2937] dark:text-[#F9FAFB]">
            Documents
            <span class="ml-2 text-base font-normal text-gray-500">
              ({{ chromaStore.documents.length }} total)
            </span>
          </h2>
          <button
            @click="showAddModal = true"
            class="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Document
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="chromaStore.documents.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-4">
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
        <div v-if="totalPages > 1" class="mt-4 flex justify-center space-x-2">
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

  <!-- Add Document Modal -->
  <div v-if="showAddModal" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75"></div>

      <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full p-6 overflow-hidden shadow-xl">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Add Document
        </h3>

        <div class="space-y-4">
          <!-- ID Field (Optional) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              ID (Optional)
            </label>
            <input
              v-model="newDocumentId"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm px-3 py-2"
              placeholder="Leave empty to generate UUID"
            />
          </div>

          <!-- Content Field (Required) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Content*
            </label>
            <textarea
              v-model="newDocumentContent"
              rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm px-3 py-2"
              placeholder="Enter document content"
              @input="documentError = ''"
            ></textarea>
            <p v-if="documentError" class="mt-1 text-sm text-red-600">{{ documentError }}</p>
          </div>

          <!-- Metadata Fields -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Metadata (Optional)
              </label>
              <button
                @click="addMetadataPair"
                class="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                + Add Field
              </button>
            </div>
            <div class="space-y-2">
              <div
                v-for="(pair, index) in metadataPairs"
                :key="index"
                class="flex gap-2 items-start"
              >
                <input
                  v-model="pair.key"
                  type="text"
                  class="flex-1 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm px-3 py-2"
                  placeholder="Key"
                />
                <input
                  v-model="pair.value"
                  type="text"
                  class="flex-1 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm px-3 py-2"
                  placeholder="Value"
                />
                <button
                  v-if="index > 0"
                  @click="removeMetadataPair(index)"
                  class="p-2 text-red-600 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="showAddModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
            >
              Cancel
            </button>
            <button
              @click="handleCreateDocument"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Add Document
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <DocumentModal
    :show="showModal"
    :document="selectedDocument"
    @close="closeModal"
    @delete="handleDeleteDocument"
  />
</template>
