// Vitest setup file for unit tests
// happy-dom provides localStorage, so we don't need to mock it

import { vi, beforeEach } from 'vitest'

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
})

// Mock window.matchMedia for theme tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock crypto.subtle for secure storage tests
if (!globalThis.crypto?.subtle) {
  const mockSubtle = {
    importKey: vi.fn().mockResolvedValue({}),
    deriveKey: vi.fn().mockResolvedValue({}),
    encrypt: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
    decrypt: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
  }
  
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      subtle: mockSubtle,
      getRandomValues: (arr: Uint8Array) => {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 256)
        }
        return arr
      }
    }
  })
}