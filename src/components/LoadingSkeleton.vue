<template>
  <div
    class="animate-pulse bg-surface-secondary-light dark:bg-surface-secondary-dark rounded"
    :class="[heightClass, widthClass]"
    :style="customStyle"
    role="status"
    aria-label="Loading"
  >
    <span class="sr-only">Loading...</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  height?: string | number;
  width?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  height: '1rem',
  width: '100%'
});

const heightClass = computed(() => {
  if (typeof props.height === 'number') {
    return `h-[${props.height}px]`;
  }
  return '';
});

const widthClass = computed(() => {
  if (typeof props.width === 'number') {
    return `w-[${props.width}px]`;
  }
  return 'w-full';
});

const customStyle = computed(() => {
  const style: Record<string, string> = {};

  if (typeof props.height === 'string') {
    style.height = props.height;
  }

  if (typeof props.width === 'string' && props.width !== '100%') {
    style.width = props.width;
  }

  return style;
});
</script>
