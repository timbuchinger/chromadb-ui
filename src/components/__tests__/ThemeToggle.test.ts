import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ThemeToggle from '../ThemeToggle.vue'

describe('ThemeToggle', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Clear any stored theme
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('should render a button', () => {
    const wrapper = mount(ThemeToggle)
    
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('should have correct aria attributes', () => {
    const wrapper = mount(ThemeToggle)
    const button = wrapper.find('button')
    
    expect(button.attributes('role')).toBe('menuitem')
    expect(button.attributes('aria-label')).toContain('Switch to')
    expect(button.attributes('aria-pressed')).toBeDefined()
  })

  it('should show moon icon in light mode', () => {
    const wrapper = mount(ThemeToggle)
    
    // In light mode, should show moon icon (to switch to dark)
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    // Moon icon has specific path
    expect(svg.find('path').attributes('d')).toContain('17.293')
  })

  it('should cycle theme when clicked', async () => {
    const wrapper = mount(ThemeToggle)
    const button = wrapper.find('button')
    
    // Initial state should be light
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    
    // Click to toggle to dark
    await button.trigger('click')
    
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('should update aria-pressed when theme changes', async () => {
    const wrapper = mount(ThemeToggle)
    const button = wrapper.find('button')
    
    // Initially light mode
    expect(button.attributes('aria-pressed')).toBe('false')
    
    // Toggle to dark
    await button.trigger('click')
    
    expect(button.attributes('aria-pressed')).toBe('true')
  })

  it('should have accessible screen reader text', () => {
    const wrapper = mount(ThemeToggle)
    const srText = wrapper.find('.sr-only')
    
    expect(srText.exists()).toBe(true)
    expect(srText.text()).toContain('Currently in')
    expect(srText.text()).toContain('Switch to')
  })

  it('should have focus ring styles', () => {
    const wrapper = mount(ThemeToggle)
    const button = wrapper.find('button')
    
    expect(button.classes()).toContain('focus:ring-2')
    expect(button.classes()).toContain('focus:outline-none')
  })
})
