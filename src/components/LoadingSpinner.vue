<template>
  <div class="flex items-center justify-center" :class="containerClasses">
    <div
      class="animate-spin rounded-full border-4 border-surface-secondary-light dark:border-surface-secondary-dark"
      :class="[
        spinnerSize,
        'border-t-accent-primary'
      ]"
      role="status"
    >
      <span class="sr-only">Loading...</span>
    </div>
    <span v-if="text" class="ml-2 text-content-primary-light dark:text-content-primary-dark">
      {{ text }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullscreen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  text: '',
  fullscreen: false,
});

const spinnerSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-4 w-4';
    case 'lg':
      return 'h-12 w-12';
    default:
      return 'h-8 w-8';
  }
});

const containerClasses = computed(() => {
  if (props.fullscreen) {
    return 'fixed inset-0 bg-surface-primary-light/75 dark:bg-surface-primary-dark/75 z-50';
  }
  return '';
});
</script>
