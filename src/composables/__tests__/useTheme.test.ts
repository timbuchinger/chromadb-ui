import { describe, it, expect, beforeEach } from 'vitest'
import { useTheme } from '../useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear()
    // Remove dark class if present
    document.documentElement.classList.remove('dark')
  })

  it('should initialize with light theme by default', () => {
    const { theme } = useTheme()
    expect(theme.value).toBe('light')
  })

  it('should update theme correctly', () => {
    const { theme, updateTheme } = useTheme()
    
    updateTheme('dark')
    expect(theme.value).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('should cycle between light and dark themes', () => {
    const { theme, cycleTheme } = useTheme()
    
    // Start with light
    expect(theme.value).toBe('light')
    
    // Cycle to dark
    cycleTheme()
    expect(theme.value).toBe('dark')
    
    // Cycle back to light
    cycleTheme()
    expect(theme.value).toBe('light')
  })

  it('should persist theme to localStorage', () => {
    const { updateTheme } = useTheme()
    
    updateTheme('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
    
    updateTheme('light')
    expect(localStorage.getItem('theme')).toBe('light')
  })
})
