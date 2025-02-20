<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <transition-group name="notification" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'rounded-md p-4 shadow-lg transform transition-all duration-300 max-w-[min(calc(100vw-2rem),380px)] backdrop-blur-sm',
          {
            'bg-status-success-bg-light dark:bg-status-success-bg-dark text-status-success-text-light dark:text-status-success-text-dark': notification.type === 'success',
            'bg-status-error-bg-light dark:bg-status-error-bg-dark text-status-error-text-light dark:text-status-error-text-dark': notification.type === 'error',
            'bg-status-warning-bg-light dark:bg-status-warning-bg-dark text-status-warning-text-light dark:text-status-warning-text-dark': notification.type === 'warning',
            'bg-status-info-bg-light dark:bg-status-info-bg-dark text-status-info-text-light dark:text-status-info-text-dark': notification.type === 'info'
          }
        ]"
        @click="removeNotification(notification.id)"
      >
        <div class="flex justify-between items-center">
          <div class="flex">
            <div class="flex-shrink-0">
              <!-- Success Icon -->
              <svg v-if="notification.type === 'success'" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <!-- Error Icon -->
              <svg v-if="notification.type === 'error'" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <!-- Warning Icon -->
              <svg v-if="notification.type === 'warning'" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <!-- Info Icon -->
              <svg v-if="notification.type === 'info'" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3 flex-grow min-w-0">
              <p class="text-sm break-words pr-4 leading-5">{{ notification.message }}</p>
            </div>
          </div>
          <button
            @click.stop="removeNotification(notification.id)"
            class="opacity-70 hover:opacity-100 p-2 -mr-2 flex-shrink-0 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200 ml-2"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '../stores/notifications'

const store = useNotificationStore()
const { notifications } = storeToRefs(store)
const removeNotification = store.remove
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
