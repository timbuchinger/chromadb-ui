import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLoadingStore } from '../../../src/stores/loading'

describe('Loading Store', () => {
  beforeEach(() => {
    // Create a fresh pinia instance for each test to ensure isolation
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct default state', () => {
      const store = useLoadingStore()
      
      expect(store.collections).toBe(false)
      expect(store.documents).toBe(false)
      expect(store.authentication).toBe(false)
      expect(store.navigation).toBe(false)
    })
  })

  describe('Actions', () => {
    it('should start loading for a specific key', () => {
      const store = useLoadingStore()
      
      store.startLoading('collections')
      
      expect(store.collections).toBe(true)
      expect(store.documents).toBe(false)
    })

    it('should stop loading for a specific key', () => {
      const store = useLoadingStore()
      
      store.startLoading('documents')
      expect(store.documents).toBe(true)
      
      store.stopLoading('documents')
      expect(store.documents).toBe(false)
    })

    it('should handle multiple loading states independently', () => {
      const store = useLoadingStore()
      
      store.startLoading('collections')
      store.startLoading('authentication')
      
      expect(store.collections).toBe(true)
      expect(store.authentication).toBe(true)
      expect(store.documents).toBe(false)
      
      store.stopLoading('collections')
      
      expect(store.collections).toBe(false)
      expect(store.authentication).toBe(true)
    })

    describe('withLoading', () => {
      it('should wrap async operation with loading state', async () => {
        const store = useLoadingStore()
        const mockOperation = vi.fn().mockResolvedValue('result')
        
        const promise = store.withLoading('collections', mockOperation)
        
        // Should be loading during the operation
        expect(store.collections).toBe(true)
        
        const result = await promise
        
        // Should stop loading after operation completes
        expect(store.collections).toBe(false)
        expect(result).toBe('result')
        expect(mockOperation).toHaveBeenCalledTimes(1)
      })

      it('should stop loading even if operation throws', async () => {
        const store = useLoadingStore()
        const error = new Error('Test error')
        const mockOperation = vi.fn().mockRejectedValue(error)
        
        await expect(store.withLoading('documents', mockOperation)).rejects.toThrow('Test error')
        
        expect(store.documents).toBe(false)
      })

      it('should return the result of the operation', async () => {
        const store = useLoadingStore()
        const expectedResult = { data: 'test' }
        const mockOperation = vi.fn().mockResolvedValue(expectedResult)
        
        const result = await store.withLoading('navigation', mockOperation)
        
        expect(result).toEqual(expectedResult)
      })
    })
  })

  describe('Getters', () => {
    it('should return loading state for a specific key', () => {
      const store = useLoadingStore()
      store.$reset() // Ensure clean state
      
      expect(store.isLoading('collections')).toBe(false)
      
      store.startLoading('collections')
      expect(store.isLoading('collections')).toBe(true)
      
      // Clean up
      store.stopLoading('collections')
    })

    it('should return true when any loading state is active', () => {
      const store = useLoadingStore()
      store.$reset() // Ensure clean state
      
      expect(store.isAnyLoading).toBe(false)
      
      store.startLoading('documents')
      expect(store.isAnyLoading).toBe(true)
      
      store.stopLoading('documents')
      expect(store.isAnyLoading).toBe(false)
    })

    it('should return true when multiple loading states are active', () => {
      const store = useLoadingStore()
      store.$reset() // Ensure clean state
      
      store.startLoading('collections')
      store.startLoading('documents')
      
      expect(store.isAnyLoading).toBe(true)
      
      store.stopLoading('collections')
      expect(store.isAnyLoading).toBe(true)
      
      store.stopLoading('documents')
      expect(store.isAnyLoading).toBe(false)
    })
  })
})
