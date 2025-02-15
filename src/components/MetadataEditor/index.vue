<script setup lang="ts">
import { ref, watch } from 'vue'
import type { MetadataPair } from '../../utils/documentTypes'
import MetadataField from './MetadataField.vue'
import { useDocumentValidation } from '../../composables/useDocumentValidation'

const props = defineProps<{
  modelValue: MetadataPair[]
  error: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', pairs: MetadataPair[]): void
}>()

const showValidation = ref(false)
const validationErrorRef = ref<HTMLDivElement | null>(null)
const { validateMetadata } = useDocumentValidation()

// Watch for error changes to announce them to screen readers
watch(() => props.error, (newError) => {
  if (newError && validationErrorRef.value) {
    validationErrorRef.value.setAttribute('role', 'alert')
  }
})

const addMetadataPair = () => {
  emit('update:modelValue', [
    ...props.modelValue,
    { key: '', value: '', type: 'string' }
  ])
}

const removeMetadataPair = (index: number) => {
  const newPairs = [...props.modelValue]
  newPairs.splice(index, 1)
  emit('update:modelValue', newPairs)
}

const updatePair = (index: number, updatedPair: MetadataPair) => {
  const newPairs = [...props.modelValue]
  newPairs[index] = updatedPair
  emit('update:modelValue', newPairs)
}

const validate = () => {
  showValidation.value = true
  return validateMetadata(props.modelValue)
}

defineExpose({
  validate
})
</script>

<template>
  <div>
    <fieldset class="space-y-4">
      <legend class="sr-only">Document Metadata Fields</legend>
      <div class="flex items-center gap-4 mb-2">
        <div>
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Metadata
            <span v-if="modelValue.length > 0" class="text-xs text-gray-500 dark:text-gray-400">
              (key required, value optional)
            </span>
            <span v-else class="text-xs text-gray-500 dark:text-gray-400">
              (optional)
            </span>
          </h3>
          <p id="metadata-description" class="sr-only">
            Add metadata fields to your document. Each field requires a key name, and values are optional.
            Select the type of data for each field.
          </p>
        </div>
      <div class="flex items-center gap-2 ml-auto">
        <button
          v-if="modelValue.length > 0"
          @click="emit('update:modelValue', [])"
          class="h-8 px-3 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:ring-2 focus:ring-accent-primary focus:outline-none"
          aria-label="Clear all metadata fields"
        >
          Clear All
          <span class="sr-only">metadata fields</span>
        </button>
        <button
          @click="addMetadataPair"
          class="h-8 px-3 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:ring-2 focus:ring-accent-primary focus:outline-none"
          aria-label="Add new metadata field"
          aria-describedby="metadata-description"
        >
          + Add Field
          <span class="sr-only">to document metadata</span>
        </button>
      </div>
    </div>
      <!-- Validation error message -->
      <div
        v-if="error"
        ref="validationErrorRef"
        class="mt-2 text-sm text-red-600"
        role="alert"
        aria-live="polite"
      >
        {{ error }}
      </div>

      <!-- Metadata fields list -->
      <div
        class="space-y-2"
        role="group"
        aria-labelledby="metadata-fields-label"
        aria-describedby="metadata-description"
      >
        <span id="metadata-fields-label" class="sr-only">Metadata fields</span>
        <transition-group name="list">
          <MetadataField
            v-for="(pair, index) in modelValue"
            :key="index"
            :pair="pair"
            :error="error"
            :show-validation="showValidation"
            @update="updatePair(index, $event)"
            @remove="removeMetadataPair(index)"
          />
        </transition-group>
      </div>
    </fieldset>
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
