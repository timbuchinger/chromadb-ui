<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useChromaStore } from '../stores/chroma'
import { useLoadingStore } from '../stores/loading'
import { useRouter } from 'vue-router'
import AddCollectionModal from './AddCollectionModal.vue'
import DeleteConfirmModal from './DeleteConfirmModal.vue'
import LoadingSpinner from './LoadingSpinner.vue'

const router = useRouter()
const chromaStore = useChromaStore()
const loadingStore = useLoadingStore()
const currentPage = ref(1)
const itemsPerPage = 20
const showAddModal = ref(false)
const showDeleteConfirm = ref(false)
const collectionToDelete = ref('')

const totalPages = computed(() =>
  Math.ceil(chromaStore.collections.length / itemsPerPage)
)

const paginatedCollections = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return chromaStore.collections.slice(start, end)
})

// Fetch collections when component mounts
onMounted(async () => {
  try {
    await chromaStore.fetchCollections()
  } catch (error) {
    console.error('Failed to fetch collections:', error)
  }
})

const viewCollection = (collection: string) => {
  router.push(`/collection/${collection}`)
}
</script>

<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-[#1F2937] dark:text-[#F9FAFB]">
          Collections
        </h1>
      </div>
      <!-- Loading state -->
      <div v-if="loadingStore.isLoading('collections')" class="mt-6 flex justify-center">
        <LoadingSpinner size="lg" text="Loading collections..." />
      </div>

      <!-- Error state -->
      <div v-else-if="chromaStore.error" class="mt-6 text-center text-red-500">
        {{ chromaStore.error }}
      </div>

      <!-- Empty state -->
      <div v-else-if="chromaStore.collections.length === 0" class="mt-6 text-center text-gray-500 dark:text-gray-400">
        There are no collections.
      </div>

      <!-- Add Collection Button -->
      <button
        @click="showAddModal = true"
        class="mt-4 px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="loadingStore.isLoading('collections')"
      >
        <LoadingSpinner v-if="loadingStore.isLoading('collections')" size="sm" class="mr-2" />
        Add Collection
      </button>

      <!-- Collections list -->
      <div v-if="chromaStore.collections.length > 0" class="mt-6 divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="collection in paginatedCollections"
          :key="collection.name"
          class="flex items-center justify-between py-4 px-6"
        >
          <button
            @click="viewCollection(collection.name)"
            class="font-medium text-[#1F2937] dark:text-[#F9FAFB] text-base hover:text-blue-500 dark:hover:text-blue-400 text-left"
          >
            {{ collection.name }}
          </button>
          <div class="flex space-x-2">
            <button
              class="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
              @click="viewCollection(collection.name)"
            >
              View
            </button>
            <button
              class="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="loadingStore.isLoading('collections')"
              @click="() => {
                collectionToDelete = collection.name;
                showDeleteConfirm = true;
              }"
            >
              Delete
            </button>
          </div>
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

      <!-- Add Collection Modal -->
      <AddCollectionModal
        :show="showAddModal"
        @close="showAddModal = false"
        @created="showAddModal = false"
      />

      <!-- Delete Confirmation Modal -->
      <DeleteConfirmModal
        :show="showDeleteConfirm"
        :collection-name="collectionToDelete"
        @close="showDeleteConfirm = false"
        @deleted="() => {
          showDeleteConfirm = false;
          collectionToDelete = '';
        }"
      />
    </div>
  </div>
</template>
