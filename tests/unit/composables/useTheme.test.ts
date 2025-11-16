import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTheme } from '../../../src/composables/useTheme'

describe('useTheme composable', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear()
    vi.clearAllMocks()
    
    // Reset document classes
    document.documentElement.classList.remove('dark')
    
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }))
    })
  })

  it('should initialize with light theme by default', () => {
    const { theme } = useTheme()
    expect(theme.value).toBe('light')
  })

  it('should initialize with dark theme when system prefers dark mode', () => {
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))

    const { theme } = useTheme()
    expect(theme.value).toBe('dark')
  })

  it('should load theme from localStorage', () => {
    localStorage.setItem('theme', 'dark')
    vi.mocked(localStorage.getItem).mockReturnValue('dark')

    const { theme } = useTheme()
    expect(theme.value).toBe('dark')
  })

  it('should update theme and localStorage', () => {
    const { theme, updateTheme } = useTheme()
    
    updateTheme('dark')
    
    expect(theme.value).toBe('dark')
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('should remove dark class when switching to light theme', () => {
    const { updateTheme } = useTheme()
    
    // Set to dark first
    updateTheme('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    
    // Switch to light
    updateTheme('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('should cycle between light and dark themes', () => {
    // Start fresh with no stored theme
    localStorage.clear()
    vi.mocked(localStorage.getItem).mockReturnValue(null)
    
    const { theme, cycleTheme } = useTheme()
    
    // After initialization, should be light by default
    expect(theme.value).toBe('light')
    
    cycleTheme()
    expect(theme.value).toBe('dark')
    
    cycleTheme()
    expect(theme.value).toBe('light')
  })
})
