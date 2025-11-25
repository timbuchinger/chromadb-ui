import { defineStore } from 'pinia'
import { getSecureItem, setSecureItem } from '../utils/secureStorage'
import { getApiClient } from '../utils/api'
import { clearSettings } from '../utils/cookies'

interface AuthState {
  isAuthenticated: boolean
  serverUrl: string
  protocol: 'http' | 'https'
  tenant: string
  database: string
  lastRoute?: string
}

const localStorageKey = 'auth'
const lastRouteKey = 'lastRoute';

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
    const { protocol, serverUrl } = parseEnvHost();
    const initialState: AuthState = {
      isAuthenticated: false,
      serverUrl,
      protocol,
      tenant: 'default_tenant',
      database: 'default_database'
    }

    return initialState
  },

  actions: {
    async restoreSession(): Promise<boolean> {
      try {
        const storedState = await getSecureItem<AuthState>(localStorageKey)
        if (storedState) {
          // Restore state
          this.isAuthenticated = storedState.isAuthenticated
          this.serverUrl = storedState.serverUrl
          this.protocol = storedState.protocol
          this.tenant = storedState.tenant
          this.database = storedState.database
          this.lastRoute = storedState.lastRoute
          return true
        }
        return false
      } catch (error) {
        console.error('Failed to restore session:', error)
        return false
      }
    },

    setLastRoute(route: string) {
      this.lastRoute = route
      // Also persist to localStorage directly for quick access
      localStorage.setItem(lastRouteKey, route)
    },

    getLastRoute(): string | null {
      return this.lastRoute || localStorage.getItem(lastRouteKey)
    },

    async login(formData: {
      serverUrl: string
      protocol: 'http' | 'https'
      tenant?: string
      database?: string
    }) {
      try {
        // Update store with form data
        this.serverUrl = formData.serverUrl
        this.protocol = formData.protocol

        this.tenant = formData.tenant || 'default_tenant'
        this.database = formData.database || 'default_database'

        // Create API client and test connection by fetching heartbeat
        const baseURL = `${this.protocol}://${this.serverUrl}`
        const apiClient = getApiClient(baseURL, {})
        await apiClient.get('/api/v1/heartbeat')

        this.isAuthenticated = true

        // Save state to encrypted localStorage
        await setSecureItem(localStorageKey, this.$state)

        return true
      } catch (error) {
        this.isAuthenticated = false
        throw error
      }
    },

    logout() {
      this.isAuthenticated = false

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
      return {
        'Content-Type': 'application/json'
      }
    }
  }
})
