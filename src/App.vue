<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from './components/NavBar.vue'
import NotificationList from './components/NotificationList.vue'
import ShortcutHelpModal from './components/ShortcutHelpModal.vue'
import { useTheme } from './composables/useTheme'
import { useKeyboardShortcuts } from './composables/useKeyboardShortcuts'

// Initialize theme
const { cycleTheme } = useTheme()

const router = useRouter()
const showShortcutHelp = ref(false)

// Global keyboard shortcuts
const { getShortcutHelp } = useKeyboardShortcuts([
  {
    key: '?',
    shift: true,
    description: 'Show keyboard shortcuts',
    action: () => showShortcutHelp.value = true
  },
  {
    key: 'h',
    description: 'Go to collections list',
    action: () => router.push('/')
  },
  {
    key: 'm',
    description: 'Toggle dark mode',
    action: () => cycleTheme()
  },
  {
    key: 'Escape',
    description: 'Close dialog or cancel action',
    action: () => {
      if (showShortcutHelp.value) {
        showShortcutHelp.value = false
      }
    }
  }
])
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <NotificationList role="status" aria-live="polite" />
    <NavBar />
    <main
      id="main-content"
      class="min-h-[calc(100vh-4rem)]"
      role="main"
      aria-label="Main content"
    >
      <router-view />
    </main>

    <!-- Keyboard Shortcuts Help Modal -->
    <ShortcutHelpModal
      :show="showShortcutHelp"
      :shortcuts="getShortcutHelp()"
      @close="showShortcutHelp = false"
    />
  </div>
</template>
