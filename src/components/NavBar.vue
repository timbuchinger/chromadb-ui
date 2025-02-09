<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import ThemeToggle from './ThemeToggle.vue'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="bg-surface-secondary-light dark:bg-surface-secondary-dark border-b border-border-primary-light dark:border-border-primary-dark">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Left side -->
        <div class="flex items-center space-x-6">
          <div class="flex items-center">
            <img src="/icon.png" alt="App Logo" class="h-8 w-8" />
            <span class="ml-2 font-semibold text-lg text-content-primary-light dark:text-content-primary-dark">ChromaDB UI</span>
          </div>
          <div class="flex items-center space-x-4">
            <button
              v-if="authStore.isAuthenticated"
              class="text-content-primary-light dark:text-content-primary-dark hover:text-accent-secondary transition-colors duration-200 font-medium"
              @click="router.push('/')"
            >
              Collections
            </button>
          </div>
        </div>

        <!-- Right side -->
        <div class="flex items-center space-x-4">
          <a
            href="https://github.com/timbuchinger/chromadb-ui"
            target="_blank"
            rel="noopener noreferrer"
            class="text-content-primary-light dark:text-content-primary-dark hover:text-accent-secondary transition-colors duration-200"
          >
            <svg viewBox="0 0 24 24" class="h-6 w-6" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
          <ThemeToggle />
          <button
            v-if="authStore.isAuthenticated"
            @click="handleLogout"
            class="text-content-primary-light dark:text-content-primary-dark hover:text-accent-secondary font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
