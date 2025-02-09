import { defineStore } from 'pinia'
import axios from 'axios'

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

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    const storedState = localStorage.getItem(localStorageKey);
    const initialState: AuthState = {
      isAuthenticated: false,
      serverUrl: 'localhost:8000',
      protocol: 'http',
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

        // Create axios instance with auth headers
        const baseURL = `${this.protocol}://${this.serverUrl}`
        const headers: Record<string, string> = {}

        if (this.authType === 'token') {
          headers['Authorization'] = `Bearer ${this.token}`
        } else if (this.authType === 'basic') {
          const auth = btoa(`${this.username}:${this.password}`)
          headers['Authorization'] = `Basic ${auth}`
        }

        // Test connection by fetching heartbeat
        await axios.get(`${baseURL}/api/v1/heartbeat`, { headers })

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
    }
  },

  getters: {
    getAuthStatus: (state) => state.isAuthenticated,
    getBaseUrl: (state) => `${state.protocol}://${state.serverUrl}`,
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
