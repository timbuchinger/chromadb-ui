import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingSpinner from '../LoadingSpinner.vue'

describe('LoadingSpinner', () => {
  describe('Size Variants', () => {
    it('should render small size correctly', () => {
      const wrapper = mount(LoadingSpinner, {
        props: { size: 'sm' }
      })
      
      const spinner = wrapper.find('[role="status"]')
      expect(spinner.classes()).toContain('h-4')
      expect(spinner.classes()).toContain('w-4')
    })

    it('should render medium size by default', () => {
      const wrapper = mount(LoadingSpinner)
      
      const spinner = wrapper.find('[role="status"]')
      expect(spinner.classes()).toContain('h-8')
      expect(spinner.classes()).toContain('w-8')
    })

    it('should render large size correctly', () => {
      const wrapper = mount(LoadingSpinner, {
        props: { size: 'lg' }
      })
      
      const spinner = wrapper.find('[role="status"]')
      expect(spinner.classes()).toContain('h-12')
      expect(spinner.classes()).toContain('w-12')
    })
  })

  describe('Text Display', () => {
    it('should not show text when not provided', () => {
      const wrapper = mount(LoadingSpinner)
      
      // Only sr-only text should be present
      const texts = wrapper.findAll('span')
      expect(texts.length).toBe(1)
      expect(texts[0].classes()).toContain('sr-only')
    })

    it('should show text when provided', () => {
      const wrapper = mount(LoadingSpinner, {
        props: { text: 'Loading data...' }
      })
      
      expect(wrapper.text()).toContain('Loading data...')
    })
  })

  describe('Fullscreen Mode', () => {
    it('should not apply fullscreen styles by default', () => {
      const wrapper = mount(LoadingSpinner)
      
      expect(wrapper.find('.fixed').exists()).toBe(false)
    })

    it('should apply fullscreen styles when enabled', () => {
      const wrapper = mount(LoadingSpinner, {
        props: { fullscreen: true }
      })
      
      const container = wrapper.find('div')
      expect(container.classes()).toContain('fixed')
      expect(container.classes()).toContain('inset-0')
      expect(container.classes()).toContain('z-50')
    })
  })

  describe('Accessibility', () => {
    it('should have status role', () => {
      const wrapper = mount(LoadingSpinner)
      
      const spinner = wrapper.find('[role="status"]')
      expect(spinner.exists()).toBe(true)
    })

    it('should have screen reader text', () => {
      const wrapper = mount(LoadingSpinner)
      
      const srText = wrapper.find('.sr-only')
      expect(srText.exists()).toBe(true)
      expect(srText.text()).toBe('Loading...')
    })
  })

  describe('Animation', () => {
    it('should have animate-spin class', () => {
      const wrapper = mount(LoadingSpinner)
      
      const spinner = wrapper.find('[role="status"]')
      expect(spinner.classes()).toContain('animate-spin')
    })
  })
})
