<script setup lang="ts">
import { ref } from 'vue'
import DocumentModal from './DocumentModal.vue'

interface Document {
  id: string
  metadata: Record<string, any>
  document: string
}

// Example documents for static display
const documents = ref<Document[]>([
  {
    id: 'doc1',
    metadata: { source: 'example.txt', author: 'John Doe', date: '2025-02-08' },
    document: 'This is a sample document with some content that will need to be truncated when displayed in the table view.'
  },
  {
    id: 'doc2',
    metadata: { source: 'sample.pdf', author: 'Jane Smith', date: '2025-02-07' },
    document: 'Another example document with different content that demonstrates the truncation functionality.'
  }
])

const selectedDocument = ref<Document | null>(null)
const showModal = ref(false)

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

const handleDeleteDocument = (id: string) => {
  // In the future, this will make an API call to delete the document
  documents.value = documents.value.filter(doc => doc.id !== id)
}
</script>

<template>
  <div>
    <div class="mb-4 flex justify-between items-center">
      <h2 class="text-lg font-medium text-[#1F2937] dark:text-[#F9FAFB]">
        Documents ({{ documents.length }})
      </h2>
    </div>

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
            v-for="doc in documents"
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
  </div>

  <DocumentModal
    :show="showModal"
    :document="selectedDocument"
    @close="closeModal"
    @delete="handleDeleteDocument"
  />
</template>
