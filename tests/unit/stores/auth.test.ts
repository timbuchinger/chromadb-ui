import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../../src/stores/auth'

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

describe('Auth Store', () => {
  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia())
    // Clear localStorage mock
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('Initial State', () => {
    it('should have correct default state', () => {
      const store = useAuthStore()
      expect(store.isAuthenticated).toBe(false)
      expect(store.serverUrl).toBe('localhost:8000')
      expect(store.protocol).toBe('http')
      expect(store.authType).toBe('token')
      expect(store.token).toBe('')
      expect(store.username).toBe('')
      expect(store.password).toBe('')
      expect(store.tenant).toBe('default_tenant')
      expect(store.database).toBe('default_database')
    })

    it('should load state from localStorage if available', () => {
      const storedState = {
        isAuthenticated: true,
        serverUrl: 'example.com:9000',
        protocol: 'https',
        authType: 'basic',
        token: 'test-token',
        username: 'admin',
        password: 'password',
        tenant: 'my_tenant',
        database: 'my_database'
      }
      localStorage.setItem('auth', JSON.stringify(storedState))
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(storedState))

      const store = useAuthStore()
      expect(store.isAuthenticated).toBe(true)
      expect(store.serverUrl).toBe('example.com:9000')
      expect(store.protocol).toBe('https')
      expect(store.authType).toBe('basic')
    })
  })

  describe('Login Action', () => {
    it('should update store state with form data', async () => {
      const store = useAuthStore()
      const formData = {
        serverUrl: 'test.com:8080',
        protocol: 'https' as const,
        authType: 'token' as const,
        token: 'my-token',
        tenant: 'test_tenant',
        database: 'test_database'
      }

      // Mock successful API call
      const axios = await import('axios')
      vi.mocked(axios.default.get).mockResolvedValue({ data: [] })

      await store.login(formData)

      expect(store.serverUrl).toBe('test.com:8080')
      expect(store.protocol).toBe('https')
      expect(store.authType).toBe('token')
      expect(store.token).toBe('my-token')
      expect(store.tenant).toBe('test_tenant')
      expect(store.database).toBe('test_database')
    })
  })

  describe('Logout Action', () => {
    it('should reset authentication state', () => {
      const store = useAuthStore()
      
      // Set some state
      store.isAuthenticated = true
      store.serverUrl = 'test.com'
      store.token = 'test-token'

      // Logout
      store.logout()

      expect(store.isAuthenticated).toBe(false)
      expect(store.token).toBe('')
      expect(store.username).toBe('')
      expect(store.password).toBe('')
    })
  })
})
