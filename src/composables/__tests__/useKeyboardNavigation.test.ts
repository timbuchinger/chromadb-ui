import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useKeyboardNavigation } from '../useKeyboardNavigation'

describe('useKeyboardNavigation', () => {
  let getElementById: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    getElementById = vi.spyOn(document, 'getElementById')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize currentIndex as -1', () => {
      const items = ['a', 'b', 'c']
      const { currentIndex } = useKeyboardNavigation(items)
      
      expect(currentIndex.value).toBe(-1)
    })
  })

  describe('Arrow Down/Right Navigation', () => {
    it('should increment currentIndex on ArrowDown', () => {
      const items = ['a', 'b', 'c']
      const { currentIndex, handleKeyDown } = useKeyboardNavigation(items)
      const onSelect = vi.fn()
      const mockElement = { focus: vi.fn() }
      getElementById.mockReturnValue(mockElement as any)
      
      currentIndex.value = 0
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      Object.defineProperty(event, 'preventDefault', { value: vi.fn() })
      
      handleKeyDown(event, onSelect)
      
      expect(currentIndex.value).toBe(1)
      expect(event.preventDefault).toHaveBeenCalled()
    })

    it('should increment currentIndex on ArrowRight', () => {
      const items = ['a', 'b', 'c']
      const { currentIndex, handleKeyDown } = useKeyboardNavigation(items)
      const onSelect = vi.fn()
      const mockElement = { focus: vi.fn() }
      getElementById.mockReturnValue(mockElement as any)
      
      currentIndex.value = 0
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
      Object.defineProperty(event, 'preventDefault', { value: vi.fn() })
      
      handleKeyDown(event, onSelect)
      
      expect(currentIndex.value).toBe(1)
    })

    it('should not exceed last index on ArrowDown', () => {
      const items = ['a', 'b', 'c']
      const { currentIndex, handleKeyDown } = useKeyboardNavigation(items)
      const onSelect = vi.fn()
      
      currentIndex.value = 2 // Last index
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      Object.defineProperty(event, 'preventDefault', { value: vi.fn() })
      
      handleKeyDown(event, onSelect)
      
      expect(currentIndex.value).toBe(2) // Should stay at last index
    })
  })

  describe('Arrow Up/Left Navigation', () => {
    it('should decrement currentIndex on ArrowUp', () => {
      const items = ['a', 'b', 'c']
      const { currentIndex, handleKeyDown } = useKeyboardNavigation(items)
      const onSelect = vi.fn()
      const mockElement = { focus: vi.fn() }
      getElementById.mockReturnValue(mockElement as any)
      
      currentIndex.value = 2
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' })
      Object.defineProperty(event, 'preventDefault', { value: vi.fn() })
      
      handleKeyDown(event, onSelect)
      
      expect(currentIndex.value).toBe(1)
      expect(event.preventDefault).toHaveBeenCalled()
    })

    it('should decrement currentIndex on ArrowLeft', () => {
      const items = ['a', 'b', 'c']
      const { currentIndex, handleKeyDown } = useKeyboardNavigation(items)
      const onSelect = vi.fn()
      const mockElement = { focus: vi.fn() }
      getElementById.mockReturnValue(mockElement as any)
      
      currentIndex.value = 2
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
      Object.defineProperty(event, 'preventDefault', { value: vi.fn() })
      
      handleKeyDown(event, onSelect)
      
      expect(currentIndex.value).toBe(1)
    })

    it('should not go below 0 on ArrowUp', () => {
      const items = ['a', 'b', 'c']
      const { currentIndex, handleKeyDown } = useKeyboardNavigation(items)
      const onSelect = vi.fn()
      
      currentIndex.value = 0
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' })
      Object.defineProperty(event, 'preventDefault', { value: vi.fn() })
      
      handleKeyDown(event, onSelect)
      
      expect(currentIndex.value).toBe(0)
    })
  })

  describe('Home Key Navigation', () => {
    it('should set currentIndex to 0 on Home', () => {
      const items = ['a', 'b', 'c']
      const { currentIndex, handleKeyDown } = useKeyboardNavigation(items)
      const onSelect = vi.fn()
      const mockElement = { focus: vi.fn() }
      getElementById.mockReturnValue(mockElement as any)
      
      currentIndex.value = 2
      const event = new KeyboardEvent('keydown', { key: 'Home' })
      Object.defineProperty(event, 'preventDefault', { value: vi.fn() })
      
      handleKeyDown(event, onSelect)
      
      expect(currentIndex.value).toBe(0)
      expect(event.preventDefault).toHaveBeenCalled()
    })

    it('should do nothing on Home with empty items', () => {
      const items: string[] = []
      const { currentIndex, handleKeyDown } = useKeyboardNavigation(items)
      const onSelect = vi.fn()
      
      const event = new KeyboardEvent('keydown', { key: 'Home' })
      Object.defineProperty(event, 'preventDefault', { value: vi.fn() })
      
      handleKeyDown(event, onSelect)
      
      expect(currentIndex.value).toBe(-1)
    })
  })

  describe('End Key Navigation', () => {
    it('should set currentIndex to last index on End', () => {
      const items = ['a', 'b', 'c']
      const { currentIndex, handleKeyDown } = useKeyboardNavigation(items)
      const onSelect = vi.fn()
      const mockElement = { focus: vi.fn() }
      getElementById.mockReturnValue(mockElement as any)
      
      currentIndex.value = 0
      const event = new KeyboardEvent('keydown', { key: 'End' })
      Object.defineProperty(event, 'preventDefault', { value: vi.fn() })
      
      handleKeyDown(event, onSelect)
      
      expect(currentIndex.value).toBe(2)
      expect(event.preventDefault).toHaveBeenCalled()
    })

    it('should do nothing on End with empty items', () => {
      const items: string[] = []
      const { currentIndex, handleKeyDown } = useKeyboardNavigation(items)
      const onSelect = vi.fn()
      
      const event = new KeyboardEvent('keydown', { key: 'End' })
      Object.defineProperty(event, 'preventDefault', { value: vi.fn() })
      
      handleKeyDown(event, onSelect)
      
      expect(currentIndex.value).toBe(-1)
    })
  })

  describe('Enter Key Selection', () => {
    it('should call onSelect with current item on Enter', () => {
      const items = ['a', 'b', 'c']
      const { currentIndex, handleKeyDown } = useKeyboardNavigation(items)
      const onSelect = vi.fn()
      
      currentIndex.value = 1
      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      Object.defineProperty(event, 'preventDefault', { value: vi.fn() })
      
      handleKeyDown(event, onSelect)
      
      expect(onSelect).toHaveBeenCalledWith('b')
      expect(event.preventDefault).toHaveBeenCalled()
    })

    it('should not call onSelect when currentIndex is -1', () => {
      const items = ['a', 'b', 'c']
      const { currentIndex, handleKeyDown } = useKeyboardNavigation(items)
      const onSelect = vi.fn()
      
      currentIndex.value = -1
      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      Object.defineProperty(event, 'preventDefault', { value: vi.fn() })
      
      handleKeyDown(event, onSelect)
      
      expect(onSelect).not.toHaveBeenCalled()
    })

    it('should not call onSelect when currentIndex exceeds items length', () => {
      const items = ['a', 'b', 'c']
      const { currentIndex, handleKeyDown } = useKeyboardNavigation(items)
      const onSelect = vi.fn()
      
      currentIndex.value = 10
      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      Object.defineProperty(event, 'preventDefault', { value: vi.fn() })
      
      handleKeyDown(event, onSelect)
      
      expect(onSelect).not.toHaveBeenCalled()
    })
  })

  describe('Space Key Selection', () => {
    it('should call onSelect with current item on Space', () => {
      const items = ['a', 'b', 'c']
      const { currentIndex, handleKeyDown } = useKeyboardNavigation(items)
      const onSelect = vi.fn()
      
      currentIndex.value = 2
      const event = new KeyboardEvent('keydown', { key: ' ' })
      Object.defineProperty(event, 'preventDefault', { value: vi.fn() })
      
      handleKeyDown(event, onSelect)
      
      expect(onSelect).toHaveBeenCalledWith('c')
    })
  })

  describe('Focus Management', () => {
    it('should focus the element after navigation', () => {
      const items = ['a', 'b', 'c']
      const { currentIndex, handleKeyDown } = useKeyboardNavigation(items)
      const onSelect = vi.fn()
      const mockElement = { focus: vi.fn() }
      getElementById.mockReturnValue(mockElement as any)
      
      currentIndex.value = 0
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      Object.defineProperty(event, 'preventDefault', { value: vi.fn() })
      
      handleKeyDown(event, onSelect)
      
      expect(getElementById).toHaveBeenCalledWith('collection-1')
      expect(mockElement.focus).toHaveBeenCalled()
    })

    it('should handle missing element gracefully', () => {
      const items = ['a', 'b', 'c']
      const { currentIndex, handleKeyDown } = useKeyboardNavigation(items)
      const onSelect = vi.fn()
      getElementById.mockReturnValue(null)
      
      currentIndex.value = 0
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      Object.defineProperty(event, 'preventDefault', { value: vi.fn() })
      
      // Should not throw
      expect(() => handleKeyDown(event, onSelect)).not.toThrow()
    })
  })

  describe('Unhandled Keys', () => {
    it('should not change state for unhandled keys', () => {
      const items = ['a', 'b', 'c']
      const { currentIndex, handleKeyDown } = useKeyboardNavigation(items)
      const onSelect = vi.fn()
      
      currentIndex.value = 1
      const event = new KeyboardEvent('keydown', { key: 'x' })
      
      handleKeyDown(event, onSelect)
      
      expect(currentIndex.value).toBe(1)
      expect(onSelect).not.toHaveBeenCalled()
    })
  })
})
