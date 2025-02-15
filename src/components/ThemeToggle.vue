<!-- ThemeToggle.vue -->
<script setup lang="ts">
import { useTheme } from '../composables/useTheme'

const { theme, cycleTheme } = useTheme()
</script>

<template>
  <button
    class="p-2 rounded-md text-content-primary-light dark:text-content-primary-dark hover:bg-surface-secondary-light dark:hover:bg-surface-secondary-dark transition-colors duration-200 focus:ring-2 focus:ring-accent-primary focus:outline-none"
    @click="cycleTheme"
    :title="`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`"
    role="menuitem"
    :aria-label="`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`"
    :aria-pressed="theme === 'dark'"
  >
    <span class="sr-only">
      Currently in {{ theme }} mode. Switch to {{ theme === 'light' ? 'dark' : 'light' }} mode
    </span>
    <!-- Dark mode icon (moon) -->
    <svg
      v-if="theme === 'light'"
      class="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
        aria-hidden="true"
      ></path>
    </svg>
    <!-- Light mode icon (sun) -->
    <svg
      v-else
      class="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
        fill-rule="evenodd"
        clip-rule="evenodd"
        aria-hidden="true"
      ></path>
    </svg>
  </button>
</template>
