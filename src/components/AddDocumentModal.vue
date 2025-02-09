<script setup lang="ts">
import { ref } from 'vue'
import { useChromaStore } from '../stores/chroma'
import { useLoadingStore } from '../stores/loading'
import { useNotificationStore } from '../stores/notifications'
import LoadingSpinner from './LoadingSpinner.vue'

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
const newDocumentId = ref('')
const newDocumentContent = ref('')
const metadataPairs = ref<Array<{ key: string; value: string }>>([])
const documentError = ref('')

const addMetadataPair = () => {
  metadataPairs.value.push({ key: '', value: '' })
}

const removeMetadataPair = (index: number) => {
  metadataPairs.value.splice(index, 1)
}

const handleCreateDocument = async () => {
  // Reset error states
  documentError.value = '';

  // Validate document content
  if (!newDocumentContent.value) {
    documentError.value = 'Document content is required';
    return; // Stop if document content is invalid
  }

  // Validate metadata pairs and set individual errors
  let hasMetadataErrors = false;
  metadataPairs.value.forEach((pair, index) => {
    if (!pair.key.trim()) {
      documentError.value = 'All metadata fields require a key';
      hasMetadataErrors = true;
    }
  });

  if (hasMetadataErrors) {
    return; // Stop if metadata is invalid
  }

  if (chromaStore.currentCollection) {
    try {
      const metadata = metadataPairs.value.reduce((acc, pair) => {
        if (pair.key.trim()) {
          acc[pair.key.trim()] = pair.value.trim()
        }
        return acc
      }, {} as Record<string, string>);

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

          <!-- Metadata Fields -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Metadata
                <span v-if="metadataPairs.length > 0" class="text-xs text-gray-500 dark:text-gray-400">
                  (key required, value optional)
                </span>
                <span v-else class="text-xs text-gray-500 dark:text-gray-400">
                  (optional)
                </span>
              </label>
              <button
                @click="addMetadataPair"
                class="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                + Add Field
              </button>
              <button
                v-if="metadataPairs.length > 0"
                @click="metadataPairs = []"
                class="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Clear All
              </button>
            </div>
            <div class="space-y-2">
              <div
                v-for="(pair, index) in metadataPairs"
                :key="index"
                class="flex gap-2 items-start"
              >
                <div class="flex-1">
                  <input
                    v-model="pair.key"
                    type="text"
                    class="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm px-3 py-2"
                    :class="{'border-red-500 dark:border-red-500': documentError && !pair.key.trim()}"
                    placeholder="Key*"
                  />
                </div>
                <input
                  v-model="pair.value"
                  type="text"
                  class="flex-1 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm px-3 py-2"
                  placeholder="Value"
                />
                <button
                  v-if="true"
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
