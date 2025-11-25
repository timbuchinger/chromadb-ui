import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { focusTrap } from '../focus-trap'

describe('focus-trap directive', () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>
  let container: HTMLDivElement
  let button: HTMLButtonElement

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(document, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
    
    // Create a container with focusable elements
    container = document.createElement('div')
    button = document.createElement('button')
    button.textContent = 'Click me'
    container.appendChild(button)
    document.body.appendChild(container)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    if (container.parentNode) {
      container.parentNode.removeChild(container)
    }
  })

  describe('mounted', () => {
    it('should add focus event listener on mount', () => {
      focusTrap.mounted(container)

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'focus',
        expect.any(Function),
        true
      )
    })

    it('should store focus trap handler on element', () => {
      focusTrap.mounted(container)

      expect(container._focusTrap).toBeDefined()
      expect(container._focusTrap?.handleFocus).toBeInstanceOf(Function)
    })
  })

  describe('unmounted', () => {
    it('should remove focus event listener on unmount', () => {
      focusTrap.mounted(container)
      focusTrap.unmounted(container)

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'focus',
        expect.any(Function),
        true
      )
    })

    it('should delete focus trap handler from element', () => {
      focusTrap.mounted(container)
      focusTrap.unmounted(container)

      expect(container._focusTrap).toBeUndefined()
    })

    it('should handle unmount when not mounted', () => {
      // Should not throw
      expect(() => focusTrap.unmounted(container)).not.toThrow()
    })
  })

  describe('focus handling', () => {
    it('should trap focus inside element', () => {
      const input = document.createElement('input')
      container.appendChild(input)
      
      focusTrap.mounted(container)
      
      // Simulate focus going outside the container
      const outsideElement = document.createElement('button')
      document.body.appendChild(outsideElement)
      
      const focusSpy = vi.spyOn(button, 'focus')
      
      // Create and dispatch a focus event on the outside element
      const focusEvent = new FocusEvent('focus', { 
        bubbles: true,
        relatedTarget: outsideElement 
      })
      Object.defineProperty(focusEvent, 'target', { value: outsideElement })
      
      container._focusTrap?.handleFocus(focusEvent)
      
      expect(focusSpy).toHaveBeenCalled()
      
      document.body.removeChild(outsideElement)
    })

    it('should not redirect focus when focus is inside element', () => {
      focusTrap.mounted(container)
      
      const focusSpy = vi.spyOn(button, 'focus')
      
      // Create focus event with target inside container
      const focusEvent = new FocusEvent('focus', { bubbles: true })
      Object.defineProperty(focusEvent, 'target', { value: button })
      
      container._focusTrap?.handleFocus(focusEvent)
      
      // Should not refocus since already inside
      expect(focusSpy).not.toHaveBeenCalled()
    })
  })
})
