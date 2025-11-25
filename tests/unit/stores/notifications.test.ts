import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotificationStore } from '../../../src/stores/notifications'

describe('Notifications Store', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Initial State', () => {
    it('should have empty notifications array', () => {
      const store = useNotificationStore()
      
      expect(store.notifications).toEqual([])
    })
  })

  describe('Actions', () => {
    describe('add', () => {
      it('should add a notification with correct properties', () => {
        const store = useNotificationStore()
        
        store.add('success', 'Test message')
        
        expect(store.notifications).toHaveLength(1)
        expect(store.notifications[0]).toMatchObject({
          type: 'success',
          message: 'Test message',
          timeout: 10000
        })
        expect(store.notifications[0].id).toBeDefined()
      })

      it('should add notification with custom timeout', () => {
        const store = useNotificationStore()
        
        store.add('info', 'Custom timeout message', 5000)
        
        expect(store.notifications[0].timeout).toBe(5000)
      })

      it('should auto-remove notification after timeout', () => {
        const store = useNotificationStore()
        
        store.add('warning', 'Auto remove message', 3000)
        
        expect(store.notifications).toHaveLength(1)
        
        vi.advanceTimersByTime(3000)
        
        expect(store.notifications).toHaveLength(0)
      })

      it('should not auto-remove notification when timeout is 0', () => {
        const store = useNotificationStore()
        
        store.add('error', 'Persistent message', 0)
        
        expect(store.notifications).toHaveLength(1)
        
        vi.advanceTimersByTime(60000)
        
        expect(store.notifications).toHaveLength(1)
      })

      it('should add multiple notifications', () => {
        const store = useNotificationStore()
        
        store.add('success', 'First message')
        store.add('error', 'Second message')
        store.add('info', 'Third message')
        
        expect(store.notifications).toHaveLength(3)
        expect(store.notifications[0].message).toBe('First message')
        expect(store.notifications[1].message).toBe('Second message')
        expect(store.notifications[2].message).toBe('Third message')
      })
    })

    describe('remove', () => {
      it('should remove notification by id', () => {
        const store = useNotificationStore()
        
        store.add('success', 'Message to remove', 0)
        const idToRemove = store.notifications[0].id
        
        store.remove(idToRemove)
        
        expect(store.notifications).toHaveLength(0)
      })

      it('should not throw when removing non-existent notification', () => {
        const store = useNotificationStore()
        
        expect(() => store.remove('non-existent-id')).not.toThrow()
      })

      it('should only remove the specified notification', () => {
        const store = useNotificationStore()
        
        store.add('success', 'Keep this', 0)
        store.add('error', 'Remove this', 0)
        store.add('info', 'Keep this too', 0)
        
        const idToRemove = store.notifications[1].id
        
        store.remove(idToRemove)
        
        expect(store.notifications).toHaveLength(2)
        expect(store.notifications[0].message).toBe('Keep this')
        expect(store.notifications[1].message).toBe('Keep this too')
      })
    })

    describe('convenience methods', () => {
      it('success() should add a success notification', () => {
        const store = useNotificationStore()
        
        store.success('Success message')
        
        expect(store.notifications[0].type).toBe('success')
        expect(store.notifications[0].message).toBe('Success message')
      })

      it('error() should add an error notification', () => {
        const store = useNotificationStore()
        
        store.error('Error message')
        
        expect(store.notifications[0].type).toBe('error')
        expect(store.notifications[0].message).toBe('Error message')
      })

      it('warning() should add a warning notification', () => {
        const store = useNotificationStore()
        
        store.warning('Warning message')
        
        expect(store.notifications[0].type).toBe('warning')
        expect(store.notifications[0].message).toBe('Warning message')
      })

      it('info() should add an info notification', () => {
        const store = useNotificationStore()
        
        store.info('Info message')
        
        expect(store.notifications[0].type).toBe('info')
        expect(store.notifications[0].message).toBe('Info message')
      })

      it('convenience methods should accept custom timeout', () => {
        const store = useNotificationStore()
        
        store.success('Quick message', 2000)
        
        expect(store.notifications).toHaveLength(1)
        
        vi.advanceTimersByTime(2000)
        
        expect(store.notifications).toHaveLength(0)
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid add/remove operations', () => {
      const store = useNotificationStore()
      
      for (let i = 0; i < 10; i++) {
        store.add('info', `Message ${i}`)
      }
      
      expect(store.notifications).toHaveLength(10)
      
      const ids = store.notifications.map(n => n.id)
      ids.forEach(id => store.remove(id))
      
      expect(store.notifications).toHaveLength(0)
    })

    it('should handle interleaved timeouts correctly', () => {
      const store = useNotificationStore()
      
      store.add('info', 'First', 1000)
      store.add('info', 'Second', 2000)
      store.add('info', 'Third', 3000)
      
      expect(store.notifications).toHaveLength(3)
      
      vi.advanceTimersByTime(1000)
      expect(store.notifications).toHaveLength(2)
      
      vi.advanceTimersByTime(1000)
      expect(store.notifications).toHaveLength(1)
      
      vi.advanceTimersByTime(1000)
      expect(store.notifications).toHaveLength(0)
    })
  })
})
