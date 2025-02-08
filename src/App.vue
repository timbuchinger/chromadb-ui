<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import NavBar from './components/NavBar.vue'
import { useTheme } from './composables/useTheme'

// Initialize theme
useTheme()

const authStore = useAuthStore()
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <NavBar v-if="authStore.isAuthenticated" />
    <router-view />
  </div>
</template>
