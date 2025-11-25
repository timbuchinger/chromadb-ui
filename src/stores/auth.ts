import { defineStore } from 'pinia'
import { getApiClient } from '../utils/api'
import { clearSettings } from '../utils/cookies'

interface AuthState {
  isAuthenticated: boolean
  serverUrl: string
  protocol: 'http' | 'https'
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
      tenant: 'default_tenant',
      database: 'default_database'
    };

    return storedState ? JSON.parse(storedState) : initialState;
  },

  actions: {
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
