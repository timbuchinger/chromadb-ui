import { vi } from 'vitest'

// Mock localStorage
const localStorageMock: Storage = {
  length: 0,
  clear: vi.fn(),
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  key: vi.fn()
}

global.localStorage = localStorageMock
