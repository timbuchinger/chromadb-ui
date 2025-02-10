<script setup lang="ts">
import { ref } from 'vue'
import { useChromaStore } from '../stores/chroma'
import { useLoadingStore } from '../stores/loading'
import { useNotificationStore } from '../stores/notifications'
import LoadingSpinner from './LoadingSpinner.vue'
import { useDocumentValidation } from '../composables/useDocumentValidation'
import MetadataEditor from './MetadataEditor/index.vue'
import type { MetadataPair } from '../utils/documentTypes'
import { parseMetadataValue } from '../utils/documentTypes'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'documentAdded'): void
}>()

const chromaStore = useChromaStore()
const loadingStore = useLoadingStore()
const notificationStore = useNotificationStore()
const { documentError, validateDocument, validateMetadata } = useDocumentValidation()

const newDocumentId = ref('')
const newDocumentContent = ref('')
const metadataPairs = ref<MetadataPair[]>([])
const metadataEditorRef = ref<{ validate: () => { isValid: boolean; error: string } } | null>(null)

const handleCreateDocument = async () => {
  // Reset error state
  documentError.value = '';

  // Validate document content
  const documentValidation = validateDocument(newDocumentContent.value);
  if (!documentValidation.isValid) {
    documentError.value = documentValidation.error;
    return;
  }

  // Validate metadata if any exists
  if (metadataPairs.value.length > 0 && metadataEditorRef.value) {
    const metadataValidation = metadataEditorRef.value.validate();
    if (!metadataValidation.isValid) {
      documentError.value = metadataValidation.error;
      return;
    }
  }

  if (chromaStore.currentCollection) {
    try {
      const metadata = metadataPairs.value.reduce((acc, pair) => {
        if (pair.key.trim()) {
          acc[pair.key.trim()] = parseMetadataValue(pair);
        }
        return acc;
      }, {} as Record<string, any>);

      await chromaStore.addDocument(chromaStore.currentCollection.name, {
        id: newDocumentId.value || undefined,
        document: newDocumentContent.value,
        metadata
      });
      handleClose();
      emit('documentAdded');
    } catch (error: any) {
      console.error('Failed to add document:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add document';
      notificationStore.error(errorMessage);
    }
  }
}

const handleClose = () => {
  newDocumentId.value = ''
  newDocumentContent.value = ''
  metadataPairs.value = []
  documentError.value = ''
  emit('close')
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
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

          <!-- Metadata Editor -->
          <MetadataEditor
            ref="metadataEditorRef"
            v-model="metadataPairs"
            :error="documentError"
          />

          <!-- Buttons -->
          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="handleClose"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
            >
              Cancel
            </button>
            <button
              @click="handleCreateDocument"
              class="px-4 py-2 text-sm font-medium text-white bg-accent-primary hover:bg-accent-secondary rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="loadingStore.isLoading('documents')"
            >
              <LoadingSpinner v-if="loadingStore.isLoading('documents')" size="sm" class="mr-2" />
              Add Document
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
