<script setup lang="ts">
import { ref } from 'vue'
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

const { validateMetadata } = useDocumentValidation()

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
    <div class="flex items-center gap-4 mb-2">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Metadata
        <span v-if="modelValue.length > 0" class="text-xs text-gray-500 dark:text-gray-400">
          (key required, value optional)
        </span>
        <span v-else class="text-xs text-gray-500 dark:text-gray-400">
          (optional)
        </span>
      </label>
      <div class="flex items-center gap-2 ml-auto">
        <button
          v-if="modelValue.length > 0"
          @click="emit('update:modelValue', [])"
          class="h-8 px-3 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Clear All
        </button>
        <button
          @click="addMetadataPair"
          class="h-8 px-3 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          + Add Field
        </button>
      </div>
    </div>
    <div class="space-y-2">
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
