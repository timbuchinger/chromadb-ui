/**
 * Mock utilities for testing
 */

import { vi } from 'vitest'

/**
 * Creates a mock axios instance
 */
export function createMockAxios() {
  return {
    get: vi.fn().mockResolvedValue({ data: {} }),
    post: vi.fn().mockResolvedValue({ data: {} }),
    put: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: {} }),
    request: vi.fn().mockResolvedValue({ data: {} }),
    create: vi.fn(),
  }
}

/**
 * Creates a mock API client
 */
export function createMockApiClient() {
  return {
    get: vi.fn().mockResolvedValue({ data: {} }),
    post: vi.fn().mockResolvedValue({ data: {} }),
    put: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: {} }),
    request: vi.fn().mockResolvedValue({ data: {} }),
  }
}

/**
 * Creates a mock secure storage
 */
export function createMockSecureStorage() {
  const storage = new Map<string, unknown>()
  
  return {
    getSecureItem: vi.fn().mockImplementation(async <T>(key: string): Promise<T | null> => {
      return (storage.get(key) as T) ?? null
    }),
    setSecureItem: vi.fn().mockImplementation(async <T>(key: string, value: T): Promise<void> => {
      storage.set(key, value)
    }),
    removeSecureItem: vi.fn().mockImplementation((key: string): void => {
      storage.delete(key)
    }),
    clearExpiredItems: vi.fn().mockResolvedValue(undefined),
    _storage: storage, // For test inspection
  }
}

/**
 * Creates mock fetch responses
 */
export function createMockFetch(responses: Record<string, unknown> = {}) {
  return vi.fn().mockImplementation((url: string) => {
    const response = responses[url] ?? {}
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
    })
  })
}

/**
 * Creates a mock router
 */
export function createMockRouter() {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    go: vi.fn(),
    currentRoute: {
      value: {
        path: '/',
        name: 'home',
        params: {},
        query: {},
      },
    },
  }
}

/**
 * Delays execution for a specified time
 * Useful for testing async operations
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
