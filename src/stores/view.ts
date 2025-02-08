import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useViewStore = defineStore('view', () => {
  const isTableView = ref(false)

  function toggleView() {
    isTableView.value = !isTableView.value
  }

  return {
    isTableView,
    toggleView
  }
})
