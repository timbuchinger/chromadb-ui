<script setup lang="ts">
import { ref } from 'vue'
import { useChromaStore } from '../stores/chroma'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
  created: [collection: string]
}>()

const chromaStore = useChromaStore()
const newCollectionName = ref('')
const nameError = ref('')

const handleCreate = async () => {
  if (!/^[a-z0-9-_]+$/.test(newCollectionName.value)) {
    nameError.value = 'Only lowercase letters, numbers, dashes and underscores allowed'
    return
  }

  try {
    await chromaStore.createCollection(newCollectionName.value)
    emit('created', newCollectionName.value)
    newCollectionName.value = ''
    nameError.value = ''
  } catch (error: any) {
    if (error?.message?.includes('already exists')) {
      nameError.value = 'Collection name already exists'
    } else {
      console.error('Failed to create collection:', error)
    }
  }
}

const handleClose = () => {
  newCollectionName.value = ''
  nameError.value = ''
  emit('close')
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75"></div>

      <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 overflow-hidden shadow-xl">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Add Collection
        </h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Collection Name
            </label>
            <input
              v-model="newCollectionName"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm px-3 py-2"
              placeholder="Enter collection name"
              @input="nameError = ''"
            />
            <p v-if="nameError" class="mt-1 text-sm text-red-600">{{ nameError }}</p>
            <p class="mt-1 text-sm text-gray-500">
              Only lowercase letters, numbers, dashes and underscores allowed
            </p>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              @click="handleClose"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
            >
              Cancel
            </button>
            <button
              @click="handleCreate"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
