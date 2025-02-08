<script setup lang="ts">
import { onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import CollectionsScreen from './components/CollectionsScreen.vue'
import { useTheme } from './composables/useTheme'

// Initialize theme
useTheme()
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-[#111827]">
    <NavBar />
    <main class="p-4">
      <CollectionsScreen />
    </main>
  </div>
</template>
