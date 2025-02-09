<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import NavBar from './components/NavBar.vue'
import NotificationList from './components/NotificationList.vue'
import { useTheme } from './composables/useTheme'

// Initialize theme
useTheme()

const authStore = useAuthStore()
</script>

<template>
  <NotificationList />
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <NavBar />
    <router-view />
  </div>
</template>
