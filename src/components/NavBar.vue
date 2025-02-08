<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useViewStore } from '../stores/view'
import ThemeToggle from './ThemeToggle.vue'

const router = useRouter()
const authStore = useAuthStore()
const viewStore = useViewStore()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Left side -->
        <div class="flex items-center">
          <div class="flex items-center space-x-4">
            <button
              class="text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
              @click="viewStore.toggleView"
            >
              {{ viewStore.isTableView ? 'Table View' : 'Card View' }}
            </button>
          </div>
        </div>

        <!-- Right side -->
        <div class="flex items-center space-x-4">
          <ThemeToggle />
          <button
            @click="handleLogout"
            class="text-gray-800 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
