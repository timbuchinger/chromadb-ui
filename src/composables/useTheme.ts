import { ref, watch } from 'vue'

type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
  const theme = ref<Theme>(
    localStorage.getItem('theme') as Theme || 'system'
  )

  const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)')

  const updateTheme = (newTheme: Theme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)

    if (newTheme === 'dark' || (newTheme === 'system' && systemDarkMode.matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Initialize theme
  updateTheme(theme.value)

  // Watch for system theme changes
  systemDarkMode.addEventListener('change', (e) => {
    if (theme.value === 'system') {
      updateTheme('system')
    }
  })

  const cycleTheme = () => {
    const themeOrder: Theme[] = ['light', 'dark', 'system']
    const currentIndex = themeOrder.indexOf(theme.value)
    const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length]
    updateTheme(nextTheme)
  }

  return {
    theme,
    updateTheme,
    cycleTheme
  }
}
