<script setup lang="ts">
import type { MetadataPair } from '../../utils/documentTypes'
import { getTypeDescription, getTypePlaceholder, isValidValue } from '../../utils/documentTypes'

const props = defineProps<{
  pair: MetadataPair
  error: string
  showValidation: boolean
}>()

const emit = defineEmits<{
  (e: 'update', pair: MetadataPair): void
  (e: 'remove'): void
}>()

const updateField = (field: keyof MetadataPair, value: string) => {
  emit('update', {
    ...props.pair,
    [field]: value
  })
}
</script>

<template>
  <div class="grid grid-cols-[1fr,auto,1fr,auto] gap-2 items-start group">
    <!-- Key Input -->
    <div class="relative w-full">
      <input
        :value="pair.key"
        @input="updateField('key', ($event.target as HTMLInputElement).value)"
        type="text"
        class="w-full h-10 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm pl-3 pr-8"
        :class="{
          'border-red-500 dark:border-red-500': error && !pair.key.trim() && showValidation,
          'border-green-500 dark:border-green-500': pair.key.trim()
        }"
        placeholder="Key*"
      />
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <!-- Success Icon -->
        <svg v-if="pair.key.trim()" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <!-- Error Icon -->
        <svg v-if="error && !pair.key.trim() && showValidation" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </div>
      <div v-if="error && !pair.key.trim() && showValidation" class="absolute -bottom-5 left-0 text-sm font-medium text-red-500 flex items-center">
        <svg class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        Key is required
      </div>
    </div>

    <!-- Type Select -->
    <select
      :value="pair.type"
      @change="updateField('type', ($event.target as HTMLSelectElement).value)"
      class="h-10 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm px-3"
      :title="getTypeDescription(pair.type)"
    >
      <option value="string">String</option>
      <option value="integer">Integer</option>
      <option value="float">Float</option>
      <option value="boolean">Boolean</option>
    </select>

    <!-- Value Input -->
    <div class="relative">
      <select
        v-if="pair.type === 'boolean'"
        :value="pair.value"
        @change="updateField('value', ($event.target as HTMLSelectElement).value)"
        class="w-full h-10 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm px-3"
      >
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
      <div v-else class="relative">
        <input
          :value="pair.value"
          @input="updateField('value', ($event.target as HTMLInputElement).value)"
          type="text"
          class="w-full h-10 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm pl-3 pr-8"
          :class="{
            'border-red-500 dark:border-red-500': error && pair.key.includes(pair.key) && showValidation,
            'border-green-500 dark:border-green-500': isValidValue(pair)
          }"
          :placeholder="getTypePlaceholder(pair.type)"
        />
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <!-- Success Icon -->
          <svg v-if="isValidValue(pair)" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <!-- Error Icon -->
          <svg v-if="error && pair.key.includes(pair.key) && showValidation" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
      <div v-if="error && pair.key.includes(pair.key) && showValidation" class="absolute -bottom-5 left-0 text-sm font-medium text-red-500 flex items-center">
        <svg class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        {{ error }}
      </div>
    </div>

    <!-- Remove Button -->
    <button
      @click="emit('remove')"
      class="h-10 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
      title="Remove field"
    >
      <span class="sr-only">Remove field</span>
      ×
    </button>
  </div>
</template>
