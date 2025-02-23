<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useKeyboardNavigation } from '../composables/useKeyboardNavigation'
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
const listRef = ref<HTMLDivElement | null>(null)
const announcementText = ref('')

const totalPages = computed(() =>
  Math.ceil(chromaStore.collections.length / itemsPerPage)
)

const paginatedCollections = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return chromaStore.collections
    .slice(start, end)
    .sort((a, b) => a.name.localeCompare(b.name))
})

const { currentIndex, handleKeyDown } = useKeyboardNavigation(paginatedCollections.value)

// Reset current index when page changes
watch(currentPage, () => {
  currentIndex.value = -1
})

// Update announcement for screen readers
watch(chromaStore.collections, (newCollections) => {
  if (loadingStore.isLoading('collections')) {
    announcementText.value = 'Loading collections...'
  } else if (newCollections.length === 0) {
    announcementText.value = 'No collections available.'
  } else {
    announcementText.value = `${newCollections.length} collections loaded.`
  }
}, { immediate: true })

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
  <div class="py-6" data-test="collections-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-10rem)]">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-[#1F2937] dark:text-[#F9FAFB]" tabindex="-1">
          Collections
        </h1>
        <!-- Add Collection Button (always visible) -->
        <button
          @click="showAddModal = true"
          class="px-4 py-2 text-sm bg-accent-primary text-white rounded-md hover:bg-accent-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          data-test="add-collection-button"
          :disabled="loadingStore.isLoading('collections')"
        >
          <LoadingSpinner v-if="loadingStore.isLoading('collections')" size="sm" class="mr-2" />
          Add Collection
        </button>
      </div>

      <!-- Content Container with Transition -->
      <div class="mt-6 transition-all duration-300 min-h-[400px]">
        <!-- Loading state -->
        <div v-if="loadingStore.isLoading('collections')" class="space-y-4">
          <!-- Skeleton rows -->
          <div v-for="i in itemsPerPage" :key="i" class="flex items-center justify-between h-16 py-4 px-6 border-b border-gray-200 dark:border-gray-700 animate-pulse bg-surface-secondary-light/20 dark:bg-surface-secondary-dark/20 rounded-md">
            <div class="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div class="flex space-x-2">
              <div class="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>

        <!-- Error state -->
        <div v-else-if="chromaStore.error" class="mt-6 text-center text-red-500">
          {{ chromaStore.error }}
        </div>

        <!-- Empty state -->
        <div v-else-if="chromaStore.collections.length === 0" class="mt-6 text-center text-gray-500 dark:text-gray-400">
          There are no collections.
        </div>

        <!-- Collections list -->
        <template v-else>
          <!-- Live region for announcements -->
          <div
            role="status"
            aria-live="polite"
            class="sr-only"
          >{{ announcementText }}</div>

          <div
            ref="listRef"
            class="divide-y divide-gray-200 dark:divide-gray-700"
            role="listbox"
            aria-label="Collections"
            data-test="collections-list"
            @keydown="(e) => handleKeyDown(e, (item) => viewCollection(item.name))"
          >
            <div
              v-for="(collection, index) in paginatedCollections"
              :key="collection.name"
              class="flex items-center justify-between h-16 py-4 px-6 transition-colors duration-200 hover:bg-surface-secondary-light/10 dark:hover:bg-surface-secondary-dark/10 rounded-md"
              data-test="collection-row"
            >
              <button
                :id="`collection-${index}`"
                @click="viewCollection(collection.name)"
                class="font-medium text-[#1F2937] dark:text-[#F9FAFB] text-base hover:text-accent-primary dark:hover:text-accent-primary text-left transition-colors duration-200"
                role="option"
                :aria-selected="currentIndex === index"
                :tabindex="currentIndex === index ? 0 : -1"
              >
                {{ collection.name }}
              </button>
              <div class="flex space-x-2">
                <button
                  class="px-3 py-1 text-sm bg-accent-primary text-white rounded-md hover:bg-accent-secondary transition-colors duration-200"
                  @click="viewCollection(collection.name)"
                >
                  View
                </button>
                <button
                  class="px-3 py-1 text-sm bg-accent-error text-white rounded-md hover:bg-accent-error/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  data-test="collection-delete-button"
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
          </div>

          <!-- Pagination -->
          <div
            v-if="totalPages > 1"
            class="mt-6 flex justify-center space-x-2"
            role="navigation"
            aria-label="Pagination"
          >
            <button
              :disabled="currentPage === 1"
              @click="currentPage--"
              class="px-3 py-1 text-sm bg-accent-primary text-white rounded-md hover:bg-accent-secondary disabled:opacity-50 transition-colors duration-200"
            >
              <span class="sr-only">Go to</span>
              Previous
              <span class="sr-only">page</span>
            </button>
            <span class="px-3 py-1 text-sm" aria-current="page">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              :disabled="currentPage === totalPages"
              @click="currentPage++"
              class="px-3 py-1 text-sm bg-accent-primary text-white rounded-md hover:bg-accent-secondary disabled:opacity-50 transition-colors duration-200"
            >
              <span class="sr-only">Go to</span>
              Next
              <span class="sr-only">page</span>
            </button>
          </div>
        </template>
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
