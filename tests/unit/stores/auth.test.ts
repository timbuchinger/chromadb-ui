import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../../src/stores/auth'
import * as secureStorage from '../../../src/utils/secureStorage'

describe('Auth Store', () => {
  beforeEach(() => {
    // Clear localStorage first
    localStorage.clear()
    // Then create a fresh pinia instance
    setActivePinia(createPinia())
    // Reset mocks
    vi.restoreAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct default state', () => {
      const store = useAuthStore()
      expect(store.isAuthenticated).toBe(false)
      expect(store.serverUrl).toBe('localhost:8000')
      expect(store.protocol).toBe('http')
      expect(store.tenant).toBe('default_tenant')
      expect(store.database).toBe('default_database')
    })
  })

  describe('Session Restoration', () => {
    it('should restore session from secure storage when restoreSession is called', async () => {
      const storedState = {
        isAuthenticated: true,
        serverUrl: 'example.com:9000',
        protocol: 'https' as const,
        tenant: 'my_tenant',
        database: 'my_database'
      }

      // Mock getSecureItem to return stored state
      vi.spyOn(secureStorage, 'getSecureItem').mockResolvedValue(storedState)

      const store = useAuthStore()

      // State should be default initially
      expect(store.isAuthenticated).toBe(false)

      // Restore session
      const result = await store.restoreSession()

      expect(result).toBe(true)
      expect(store.isAuthenticated).toBe(true)
      expect(store.serverUrl).toBe('example.com:9000')
      expect(store.protocol).toBe('https')
      expect(store.tenant).toBe('my_tenant')
      expect(store.database).toBe('my_database')
    })

    it('should return false when no stored session exists', async () => {
      vi.spyOn(secureStorage, 'getSecureItem').mockResolvedValue(null)

      const store = useAuthStore()
      const result = await store.restoreSession()

      expect(result).toBe(false)
      expect(store.isAuthenticated).toBe(false)
    })

    it('should return false when restoreSession throws an error', async () => {
      vi.spyOn(secureStorage, 'getSecureItem').mockRejectedValue(new Error('Storage error'))

      // Suppress expected error logging for this test so CI logs stay clean
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const store = useAuthStore()
      const result = await store.restoreSession()

      expect(result).toBe(false)

      // Verify we logged the failure and then restore the original
      expect(errorSpy).toHaveBeenCalled()
      errorSpy.mockRestore()
    })
  })

  describe('Last Route', () => {
    it('should set and get last route', () => {
      const store = useAuthStore()

      store.setLastRoute('/collections/test')

      expect(store.lastRoute).toBe('/collections/test')
      expect(store.getLastRoute()).toBe('/collections/test')
      expect(localStorage.getItem('lastRoute')).toBe('/collections/test')
    })

    it('should get last route from localStorage if not in state', () => {
      localStorage.setItem('lastRoute', '/stored/route')

      const store = useAuthStore()

      expect(store.getLastRoute()).toBe('/stored/route')
    })
  })

  describe('Logout Action', () => {
    it('should reset authentication state', () => {
      const store = useAuthStore()

      // Set some state
      store.isAuthenticated = true
      store.serverUrl = 'test.com'

      // Logout
      store.logout()

      expect(store.isAuthenticated).toBe(false)
    })

    it('should remove auth from localStorage', () => {
      localStorage.setItem('auth', 'test')

      const store = useAuthStore()
      store.logout()

      expect(localStorage.getItem('auth')).toBeNull()
    })
  })

  describe('Getters', () => {
    it('should return correct auth status', () => {
      const store = useAuthStore()

      expect(store.getAuthStatus).toBe(false)

      store.isAuthenticated = true
      expect(store.getAuthStatus).toBe(true)
    })

    it('should return correct base URL', () => {
      const store = useAuthStore()

      // In development the store returns a relative base (empty string)
      // because the Vite dev server proxies `/api` to the backend.
      expect(store.getBaseUrl).toBe('')

      store.protocol = 'https'
      store.serverUrl = 'example.com:9000'
      // In development the store still returns a relative base (empty string)
      // because the Vite dev server proxies `/api` to the backend.
      expect(store.getBaseUrl).toBe('')
    })

    it('should return correct tenant', () => {
      const store = useAuthStore()

      expect(store.getTenant).toBe('default_tenant')

      store.tenant = 'my_tenant'
      expect(store.getTenant).toBe('my_tenant')
    })

    it('should return correct database', () => {
      const store = useAuthStore()

      expect(store.getDatabase).toBe('default_database')

      store.database = 'my_database'
      expect(store.getDatabase).toBe('my_database')
    })

    it('should return correct headers', () => {
      const store = useAuthStore()

      expect(store.getHeaders).toEqual({
        'Content-Type': 'application/json'
      })
    })
  })
})
