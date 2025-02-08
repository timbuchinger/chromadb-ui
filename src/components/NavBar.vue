<!-- NavBar.vue -->
<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue'
</script>

<template>
  <nav class="bg-[#F3F4F6] dark:bg-[#1F2937] border-b border-[#E5E7EB] dark:border-[#374151]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Left side -->
        <div class="flex items-center">
          <button class="text-[#1F2937] dark:text-[#F9FAFB] hover:text-[#2563EB] dark:hover:text-[#3B82F6] font-medium">
            Collections
          </button>
        </div>

        <!-- Right side -->
        <div class="flex items-center space-x-4">
          <ThemeToggle />
          <button class="text-[#1F2937] dark:text-[#F9FAFB] hover:text-[#8B5CF6] dark:hover:text-[#A78BFA] font-medium">
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
