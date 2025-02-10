<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { focusTrap } from '../directives/focus-trap'
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

const modalRef = ref<HTMLElement | null>(null)
const initialFocusRef = ref<HTMLTextAreaElement | null>(null)

// Focus trap handling
const handleTabKey = (e: KeyboardEvent) => {
  if (!modalRef.value || !props.show) return

  const focusableElements = modalRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const firstFocusable = focusableElements[0] as HTMLElement
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement

  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === firstFocusable) {
      e.preventDefault()
      lastFocusable.focus()
    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
      e.preventDefault()
      firstFocusable.focus()
    }
  }
}

// Escape key handling
const handleEscapeKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.show) {
    handleClose()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleTabKey)
  document.addEventListener('keydown', handleEscapeKey)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleTabKey)
  document.removeEventListener('keydown', handleEscapeKey)
})

// Focus management when modal shows/hides
watch(() => props.show, (newVal) => {
  if (newVal) {
    focusFirstElement()
  } else {
    restoreFocus()
  }
})

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

// Focus management
const previousActiveElement = ref<HTMLElement | null>(null)

const focusFirstElement = () => {
  if (props.show) {
    previousActiveElement.value = document.activeElement as HTMLElement
    setTimeout(() => {
      initialFocusRef.value?.focus()
    })
  }
}

const restoreFocus = () => {
  if (previousActiveElement.value) {
    previousActiveElement.value.focus()
    previousActiveElement.value = null
  }
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-labelledby="modal-title" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75" aria-hidden="true"></div>

      <div
        ref="modalRef"
        class="relative bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full p-6 overflow-hidden shadow-xl"
        role="document"
        @keydown.esc="handleClose"
        v-focus-trap
      >
        <h3 id="modal-title" class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Add Document
        </h3>

        <div class="space-y-4">
          <!-- ID Field (Optional) -->
          <div>
            <label
              for="document-id"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              ID (Optional)
            </label>
            <input
              id="document-id"
              v-model="newDocumentId"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm px-3 py-2"
              placeholder="Leave empty to generate UUID"
              aria-describedby="id-description"
            />
            <span id="id-description" class="sr-only">Leave this field empty to automatically generate a UUID</span>
          </div>

          <!-- Content Field (Required) -->
          <div>
            <label
              for="document-content"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Content*
              <span class="sr-only">(required)</span>
            </label>
            <textarea
              id="document-content"
              ref="initialFocusRef"
              v-model="newDocumentContent"
              rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm px-3 py-2"
              placeholder="Enter document content"
              @input="documentError = ''"
              aria-required="true"
              :aria-invalid="!!documentError"
              :aria-describedby="documentError ? 'content-error' : undefined"
            ></textarea>
            <p
              v-if="documentError"
              id="content-error"
              class="mt-1 text-sm text-red-600"
              role="alert"
            >{{ documentError }}</p>
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
              <span class="sr-only">and close modal</span>
            </button>
            <button
              @click="handleCreateDocument"
              class="px-4 py-2 text-sm font-medium text-white bg-accent-primary hover:bg-accent-secondary rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="loadingStore.isLoading('documents')"
            >
              <LoadingSpinner v-if="loadingStore.isLoading('documents')" size="sm" class="mr-2" />
              Add Document
              <span v-if="loadingStore.isLoading('documents')" class="sr-only">Loading...</span>
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
