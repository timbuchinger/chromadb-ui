import axios, { type AxiosInstance } from 'axios'

let apiClient: AxiosInstance | null = null

/**
 * Creates or returns the shared Axios instance configured with base URL and auth headers
 * @param baseUrl The base URL for the ChromaDB API
 * @param headers Optional headers to include in requests
 * @returns Configured Axios instance
 */
export function getApiClient(baseUrl: string, headers?: Record<string, string>): AxiosInstance {
  // Create a new instance with current base URL and headers
  apiClient = axios.create({
    // If baseUrl is falsy (e.g. '' in dev) don't set baseURL so axios will use relative URLs
    baseURL: baseUrl || undefined,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  })

  return apiClient
}

/**
 * Gets the current API client instance
 * Throws an error if no client has been configured
 */
export function getCurrentApiClient(): AxiosInstance {
  if (!apiClient) {
    throw new Error('API client not initialized. Call getApiClient first.')
  }
  return apiClient
}
