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
        <div class="flex items-center">
          <img src="/icon.png" alt="App Logo" class="h-8 w-8 mr-4" />
          <div class="flex items-center space-x-4">
            <button
              class="text-content-primary-light dark:text-content-primary-dark hover:text-accent-primary font-medium"
              @click="router.push('/')"
            >
              Collections
            </button>
          </div>
        </div>

        <!-- Right side -->
        <div class="flex items-center space-x-4">
          <ThemeToggle />
          <button
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
