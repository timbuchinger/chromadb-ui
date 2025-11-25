import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { useKeyboardShortcuts } from '../useKeyboardShortcuts'

describe('useKeyboardShortcuts', () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(document, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // Helper to create a test component that uses the composable
  function createTestComponent(shortcuts: Parameters<typeof useKeyboardShortcuts>[0], options?: Parameters<typeof useKeyboardShortcuts>[1]) {
    return defineComponent({
      setup() {
        const result = useKeyboardShortcuts(shortcuts, options)
        return { result }
      },
      render() {
        return h('div')
      }
    })
  }

  describe('Event Listener Registration', () => {
    it('should add keydown listener on mount', () => {
      const mockAction = vi.fn()
      const shortcuts = [{ key: 'h', description: 'Home', action: mockAction }]
      const TestComponent = createTestComponent(shortcuts)

      mount(TestComponent)

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    })

    it('should remove keydown listener on unmount', () => {
      const mockAction = vi.fn()
      const shortcuts = [{ key: 'h', description: 'Home', action: mockAction }]
      const TestComponent = createTestComponent(shortcuts)

      const wrapper = mount(TestComponent)
      wrapper.unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    })
  })

  describe('Shortcut Matching', () => {
    it('should trigger action when matching key is pressed', () => {
      const mockAction = vi.fn()
      const shortcuts = [{ key: 'h', description: 'Home', action: mockAction }]
      const TestComponent = createTestComponent(shortcuts)

      mount(TestComponent)

      const event = new KeyboardEvent('keydown', { key: 'h' })
      document.dispatchEvent(event)

      expect(mockAction).toHaveBeenCalled()
    })

    it('should be case-insensitive for key matching', () => {
      const mockAction = vi.fn()
      const shortcuts = [{ key: 'H', description: 'Home', action: mockAction }]
      const TestComponent = createTestComponent(shortcuts)

      mount(TestComponent)

      const event = new KeyboardEvent('keydown', { key: 'h' })
      document.dispatchEvent(event)

      expect(mockAction).toHaveBeenCalled()
    })

    it('should not trigger action when key does not match', () => {
      const mockAction = vi.fn()
      const shortcuts = [{ key: 'h', description: 'Home', action: mockAction }]
      const TestComponent = createTestComponent(shortcuts)

      mount(TestComponent)

      const event = new KeyboardEvent('keydown', { key: 'x' })
      document.dispatchEvent(event)

      expect(mockAction).not.toHaveBeenCalled()
    })

    it('should match ctrl modifier', () => {
      const mockAction = vi.fn()
      const shortcuts = [{ key: 's', ctrl: true, description: 'Save', action: mockAction }]
      const TestComponent = createTestComponent(shortcuts)

      mount(TestComponent)

      // Without ctrl - should not trigger
      let event = new KeyboardEvent('keydown', { key: 's' })
      document.dispatchEvent(event)
      expect(mockAction).not.toHaveBeenCalled()

      // With ctrl - should trigger
      event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true })
      document.dispatchEvent(event)
      expect(mockAction).toHaveBeenCalled()
    })

    it('should match shift modifier', () => {
      const mockAction = vi.fn()
      const shortcuts = [{ key: '?', shift: true, description: 'Help', action: mockAction }]
      const TestComponent = createTestComponent(shortcuts)

      mount(TestComponent)

      const event = new KeyboardEvent('keydown', { key: '?', shiftKey: true })
      document.dispatchEvent(event)

      expect(mockAction).toHaveBeenCalled()
    })

    it('should match alt modifier', () => {
      const mockAction = vi.fn()
      const shortcuts = [{ key: 'n', alt: true, description: 'New', action: mockAction }]
      const TestComponent = createTestComponent(shortcuts)

      mount(TestComponent)

      const event = new KeyboardEvent('keydown', { key: 'n', altKey: true })
      document.dispatchEvent(event)

      expect(mockAction).toHaveBeenCalled()
    })

    it('should match multiple modifiers', () => {
      const mockAction = vi.fn()
      const shortcuts = [{ 
        key: 's', 
        ctrl: true, 
        shift: true, 
        description: 'Save As', 
        action: mockAction 
      }]
      const TestComponent = createTestComponent(shortcuts)

      mount(TestComponent)

      const event = new KeyboardEvent('keydown', { 
        key: 's', 
        ctrlKey: true, 
        shiftKey: true 
      })
      document.dispatchEvent(event)

      expect(mockAction).toHaveBeenCalled()
    })
  })

  describe('Input Field Handling', () => {
    it('should ignore shortcuts when target is INPUT', () => {
      const mockAction = vi.fn()
      const shortcuts = [{ key: 'h', description: 'Home', action: mockAction }]
      const TestComponent = createTestComponent(shortcuts)

      mount(TestComponent)

      const input = document.createElement('input')
      document.body.appendChild(input)
      
      const event = new KeyboardEvent('keydown', { key: 'h' })
      Object.defineProperty(event, 'target', { value: input })
      document.dispatchEvent(event)

      expect(mockAction).not.toHaveBeenCalled()
      
      document.body.removeChild(input)
    })

    it('should ignore shortcuts when target is TEXTAREA', () => {
      const mockAction = vi.fn()
      const shortcuts = [{ key: 'h', description: 'Home', action: mockAction }]
      const TestComponent = createTestComponent(shortcuts)

      mount(TestComponent)

      const textarea = document.createElement('textarea')
      document.body.appendChild(textarea)
      
      const event = new KeyboardEvent('keydown', { key: 'h' })
      Object.defineProperty(event, 'target', { value: textarea })
      document.dispatchEvent(event)

      expect(mockAction).not.toHaveBeenCalled()
      
      document.body.removeChild(textarea)
    })
  })

  describe('preventDefault Option', () => {
    it('should call preventDefault by default', () => {
      const mockAction = vi.fn()
      const shortcuts = [{ key: 'z', description: 'Unique key', action: mockAction }]
      const TestComponent = createTestComponent(shortcuts)

      const wrapper = mount(TestComponent)

      const event = new KeyboardEvent('keydown', { key: 'z' })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
      document.dispatchEvent(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
      
      wrapper.unmount()
    })

    it('should not call preventDefault when option is false', () => {
      const mockAction = vi.fn()
      const shortcuts = [{ key: 'y', description: 'Another unique key', action: mockAction }]
      const TestComponent = createTestComponent(shortcuts, { preventDefault: false })

      const wrapper = mount(TestComponent)

      const event = new KeyboardEvent('keydown', { key: 'y' })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
      document.dispatchEvent(event)

      expect(preventDefaultSpy).not.toHaveBeenCalled()
      expect(mockAction).toHaveBeenCalled()
      
      wrapper.unmount()
    })
  })

  describe('getShortcutHelp', () => {
    it('should return formatted help for single key shortcut', () => {
      const shortcuts = [{ key: 'h', description: 'Go home', action: vi.fn() }]
      const TestComponent = createTestComponent(shortcuts)

      const wrapper = mount(TestComponent)
      const help = (wrapper.vm as any).result.getShortcutHelp()

      expect(help).toEqual([
        { keys: 'H', description: 'Go home' }
      ])
    })

    it('should return formatted help for shortcut with modifiers', () => {
      const shortcuts = [
        { key: 's', ctrl: true, description: 'Save', action: vi.fn() },
        { key: '?', shift: true, description: 'Help', action: vi.fn() },
        { key: 'n', alt: true, description: 'New', action: vi.fn() }
      ]
      const TestComponent = createTestComponent(shortcuts)

      const wrapper = mount(TestComponent)
      const help = (wrapper.vm as any).result.getShortcutHelp()

      expect(help).toEqual([
        { keys: 'Ctrl + S', description: 'Save' },
        { keys: 'Shift + ?', description: 'Help' },
        { keys: 'Alt + N', description: 'New' }
      ])
    })

    it('should return formatted help for shortcut with multiple modifiers', () => {
      const shortcuts = [
        { key: 's', ctrl: true, shift: true, alt: true, description: 'Super Save', action: vi.fn() }
      ]
      const TestComponent = createTestComponent(shortcuts)

      const wrapper = mount(TestComponent)
      const help = (wrapper.vm as any).result.getShortcutHelp()

      expect(help).toEqual([
        { keys: 'Ctrl + Shift + Alt + S', description: 'Super Save' }
      ])
    })
  })
})
