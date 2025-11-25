import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../../src/stores/auth'

describe('Auth Store', () => {
  beforeEach(() => {
    // Clear localStorage first
    localStorage.clear()
    // Then create a fresh pinia instance
    setActivePinia(createPinia())
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

    it('should load state from localStorage if available', () => {
      const storedState = {
        isAuthenticated: true,
        serverUrl: 'example.com:9000',
        protocol: 'https',
        tenant: 'my_tenant',
        database: 'my_database'
      }
      
      // Clear and set localStorage before creating store
      localStorage.clear()
      localStorage.setItem('auth', JSON.stringify(storedState))
      
      // Create new pinia and store after setting localStorage
      setActivePinia(createPinia())
      const store = useAuthStore()
      
      expect(store.isAuthenticated).toBe(true)
      expect(store.serverUrl).toBe('example.com:9000')
      expect(store.protocol).toBe('https')
      expect(store.tenant).toBe('my_tenant')
      expect(store.database).toBe('my_database')
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
  })
})
