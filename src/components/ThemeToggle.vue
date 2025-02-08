<!-- ThemeToggle.vue -->
<script setup lang="ts">
import { ComputerDesktopIcon, MoonIcon, SunIcon } from '@heroicons/vue/24/outline'
import { useTheme } from '../composables/useTheme'

const { theme, cycleTheme } = useTheme()
</script>

<template>
  <button
    class="p-2 rounded-full text-[#1F2937] dark:text-[#F9FAFB] hover:bg-[#F3F4F6] dark:hover:bg-[#1F2937] transition-colors"
    @click="cycleTheme"
    :title="`Current theme: ${theme}`"
  >
    <SunIcon v-if="theme === 'light'" class="w-5 h-5" />
    <MoonIcon v-else-if="theme === 'dark'" class="w-5 h-5" />
    <ComputerDesktopIcon v-else class="w-5 h-5" />
  </button>
</template>
