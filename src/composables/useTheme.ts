import { ref } from 'vue'

type Theme = 'light' | 'dark'

export function useTheme() {
  const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
  const initialTheme: Theme = localStorage.getItem('theme') as Theme ||
    (systemDarkMode.matches ? 'dark' : 'light')

  const theme = ref<Theme>(initialTheme)

  const updateTheme = (newTheme: Theme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Initialize theme
  updateTheme(theme.value)

  const cycleTheme = () => {
    updateTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  return {
    theme,
    updateTheme,
    cycleTheme
  }
}
