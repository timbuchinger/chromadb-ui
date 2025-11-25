import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { removeSecureItem } from '../secureStorage'

// Note: setSecureItem and getSecureItem use Web Crypto API which is complex to mock.
// These tests focus on the simpler removeSecureItem function.
// For the crypto-dependent functions, the auth store tests mock secureStorage at module level.

describe('secureStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('removeSecureItem', () => {
    it('should remove item from localStorage', () => {
      localStorage.setItem('toRemove', 'value')
      
      removeSecureItem('toRemove')
      
      expect(localStorage.getItem('toRemove')).toBeNull()
    })

    it('should not throw for non-existent key', () => {
      expect(() => removeSecureItem('nonexistent')).not.toThrow()
    })

    it('should only remove specified key', () => {
      localStorage.setItem('keep', 'value1')
      localStorage.setItem('remove', 'value2')
      
      removeSecureItem('remove')
      
      expect(localStorage.getItem('keep')).toBe('value1')
      expect(localStorage.getItem('remove')).toBeNull()
    })
  })
})

