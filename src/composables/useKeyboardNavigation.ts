import { ref } from 'vue'

export function useKeyboardNavigation<T>(items: T[]) {
  const currentIndex = ref(-1)

  const handleKeyDown = (event: KeyboardEvent, onSelect: (item: T) => void) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault()
        if (currentIndex.value < items.length - 1) {
          currentIndex.value++
          focusItem()
        }
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault()
        if (currentIndex.value > 0) {
          currentIndex.value--
          focusItem()
        }
        break
      case 'Home':
        event.preventDefault()
        if (items.length > 0) {
          currentIndex.value = 0
          focusItem()
        }
        break
      case 'End':
        event.preventDefault()
        if (items.length > 0) {
          currentIndex.value = items.length - 1
          focusItem()
        }
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (currentIndex.value >= 0 && currentIndex.value < items.length) {
          onSelect(items[currentIndex.value])
        }
        break
    }
  }

  const focusItem = () => {
    const element = document.getElementById(`collection-${currentIndex.value}`)
    element?.focus()
  }

  return {
    currentIndex,
    handleKeyDown
  }
}
