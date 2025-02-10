import { onMounted, onUnmounted } from 'vue'

interface ShortcutConfig {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  description: string
  action: () => void
}

interface ShortcutOptions {
  preventDefault?: boolean
}

export function useKeyboardShortcuts(
  shortcuts: ShortcutConfig[],
  options: ShortcutOptions = { preventDefault: true }
) {
  const handleKeydown = (event: KeyboardEvent) => {
    for (const shortcut of shortcuts) {
      if (
        event.key.toLowerCase() === shortcut.key.toLowerCase() &&
        !!shortcut.ctrl === event.ctrlKey &&
        !!shortcut.shift === event.shiftKey &&
        !!shortcut.alt === event.altKey
      ) {
        if (options.preventDefault) {
          event.preventDefault()
        }
        shortcut.action()
        return
      }
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  // Generate help text for the shortcuts
  const getShortcutHelp = () => {
    return shortcuts.map(shortcut => {
      const keys = []
      if (shortcut.ctrl) keys.push('Ctrl')
      if (shortcut.shift) keys.push('Shift')
      if (shortcut.alt) keys.push('Alt')
      keys.push(shortcut.key.toUpperCase())

      return {
        keys: keys.join(' + '),
        description: shortcut.description
      }
    })
  }

  return {
    getShortcutHelp
  }
}
