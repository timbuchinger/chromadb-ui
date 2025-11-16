import { defineStore } from 'pinia'
import { getApiClient } from '../utils/api'
import { clearSettings } from '../utils/cookies'

interface AuthState {
  isAuthenticated: boolean
  serverUrl: string
  protocol: 'http' | 'https'
  authType: 'token' | 'basic' | 'none'
  token: string
  username: string
  password: string
  tenant: string
  database: string
}

const localStorageKey = 'auth';

/**
 * Parse VITE_CHROMADB_HOST from environment
 * Expected format: http://localhost:8000 or https://example.com:8000
 */
function parseEnvHost(): { protocol: 'http' | 'https'; serverUrl: string } {
  const envHost = import.meta.env.VITE_CHROMADB_HOST || 'http://localhost:8000'
  const url = new URL(envHost)
  return {
    protocol: url.protocol.replace(':', '') as 'http' | 'https',
    serverUrl: url.host
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    const storedState = localStorage.getItem(localStorageKey);
    const { protocol, serverUrl } = parseEnvHost();
    const initialState: AuthState = {
      isAuthenticated: false,
      serverUrl,
      protocol,
      authType: 'token',
      token: '',
      username: '',
      password: '',
      tenant: 'default_tenant',
      database: 'default_database'
    };

    return storedState ? JSON.parse(storedState) : initialState;
  },

  actions: {
    async login(formData: {
      serverUrl: string
      protocol: 'http' | 'https'
      authType: 'token' | 'basic' | 'none'
      token?: string
      username?: string
      password?: string
      tenant?: string
      database?: string
    }) {
      try {
        // Update store with form data
        this.serverUrl = formData.serverUrl
        this.protocol = formData.protocol
        this.authType = formData.authType

        this.tenant = formData.tenant || 'default_tenant'
        this.database = formData.database || 'default_database'

        if (formData.authType === 'token') {
          this.token = formData.token || ''
          this.username = ''
          this.password = ''
        } else if (formData.authType === 'basic') {
          this.username = formData.username || ''
          this.password = formData.password || ''
          this.token = ''
        } else {
          this.token = ''
          this.username = ''
          this.password = ''
        }

        // Create headers for auth
        const headers: Record<string, string> = {}

        if (this.authType === 'token') {
          headers['Authorization'] = `Bearer ${this.token}`
        } else if (this.authType === 'basic') {
          const auth = btoa(`${this.username}:${this.password}`)
          headers['Authorization'] = `Basic ${auth}`
        }

        // Create API client and test connection by fetching heartbeat
        const baseURL = `${this.protocol}://${this.serverUrl}`
        const apiClient = getApiClient(baseURL, headers)
        await apiClient.get('/api/v1/heartbeat')

        this.isAuthenticated = true

        // Save state to localStorage
        localStorage.setItem(localStorageKey, JSON.stringify(this.$state));

        return true
      } catch (error) {
        this.isAuthenticated = false
        throw error
      }
    },

    logout() {
      this.isAuthenticated = false
      this.token = ''
      this.username = ''
      this.password = ''

      // Remove state from localStorage
      localStorage.removeItem(localStorageKey);
      
      // Clear settings cookie
      clearSettings();
    }
  },

  getters: {
    getAuthStatus: (state) => state.isAuthenticated,
    getBaseUrl: (state) => `${state.protocol}://${state.serverUrl}`,
    getTenant: (state) => state.tenant,
    getDatabase: (state) => state.database,
    getHeaders(): Record<string, string> {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }

      if (this.authType === 'token') {
        headers['Authorization'] = `Bearer ${this.token}`
      } else if (this.authType === 'basic') {
        const auth = btoa(`${this.username}:${this.password}`)
        headers['Authorization'] = `Basic ${auth}`
      }

      return headers
    }
  }
})
