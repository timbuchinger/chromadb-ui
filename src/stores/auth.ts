import { defineStore } from 'pinia'
import axios from 'axios'

interface AuthState {
  isAuthenticated: boolean
  serverUrl: string
  protocol: 'http' | 'https'
  authType: 'token' | 'basic'
  token: string
  username: string
  password: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    serverUrl: 'localhost:8000',
    protocol: 'http',
    authType: 'token',
    token: '',
    username: '',
    password: ''
  }),

  actions: {
    async login(formData: {
      serverUrl: string
      protocol: 'http' | 'https'
      authType: 'token' | 'basic'
      token?: string
      username?: string
      password?: string
    }) {
      try {
        // Update store with form data
        this.serverUrl = formData.serverUrl
        this.protocol = formData.protocol
        this.authType = formData.authType

        if (formData.authType === 'token') {
          this.token = formData.token || ''
        } else {
          this.username = formData.username || ''
          this.password = formData.password || ''
        }

        // Create axios instance with auth headers
        const baseURL = `${this.protocol}://${this.serverUrl}`
        const headers: Record<string, string> = {}

        if (this.authType === 'token') {
          headers['Authorization'] = `Bearer ${this.token}`
        } else {
          const auth = btoa(`${this.username}:${this.password}`)
          headers['Authorization'] = `Basic ${auth}`
        }

        // Test connection by fetching heartbeat
        await axios.get(`${baseURL}/api/v1/heartbeat`, { headers })

        this.isAuthenticated = true
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
    }
  },

  getters: {
    getAuthStatus: (state) => state.isAuthenticated,
    getBaseUrl: (state) => `${state.protocol}://${state.serverUrl}`,
    getHeaders(): Record<string, string> {
      const headers: Record<string, string> = {}

      if (this.authType === 'token') {
        headers['Authorization'] = `Bearer ${this.token}`
      } else {
        const auth = btoa(`${this.username}:${this.password}`)
        headers['Authorization'] = `Basic ${auth}`
      }

      return headers
    }
  }
})
