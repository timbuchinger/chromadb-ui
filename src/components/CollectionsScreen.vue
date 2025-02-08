<script setup lang="ts">
const collections = ['notes', 'pdfs', 'images'];

const handleView = () => {
  // Inoperable at this stage
};

const handleDelete = () => {
  // Inoperable at this stage
};
</script>

<template>
  <div class="p-6">
    <h2 class="text-2xl font-semibold mb-6 text-gray-800">Collections</h2>
    <ul class="space-y-4">
      <li v-for="collection in collections" :key="collection"
          class="flex items-center justify-between p-4 bg-white rounded-lg shadow">
        <span class="text-lg text-gray-800">{{ collection }}</span>
        <div class="space-x-2">
          <button
            @click="handleView"
            class="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
            View
          </button>
          <button
            @click="handleDelete"
            class="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50">
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
