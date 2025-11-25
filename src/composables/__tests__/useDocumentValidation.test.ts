import { describe, it, expect } from 'vitest'
import { useDocumentValidation } from '../useDocumentValidation'
import type { MetadataPair } from '../../utils/documentTypes'

describe('useDocumentValidation', () => {
  describe('validateDocument', () => {
    it('should return invalid when content is empty', () => {
      const { validateDocument } = useDocumentValidation()
      
      const result = validateDocument('')
      
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Document content is required')
    })

    it('should return valid when content is provided', () => {
      const { validateDocument } = useDocumentValidation()
      
      const result = validateDocument('Some document content')
      
      expect(result.isValid).toBe(true)
      expect(result.error).toBe('')
    })

    it('should return valid for whitespace-only content', () => {
      const { validateDocument } = useDocumentValidation()
      
      // Note: The current implementation doesn't trim, so whitespace is valid
      const result = validateDocument('   ')
      
      expect(result.isValid).toBe(true)
    })
  })

  describe('validateMetadata', () => {
    it('should return valid for empty pairs array', () => {
      const { validateMetadata } = useDocumentValidation()
      
      const result = validateMetadata([])
      
      expect(result.isValid).toBe(true)
      expect(result.error).toBe('')
    })

    it('should return invalid when a key is empty', () => {
      const { validateMetadata } = useDocumentValidation()
      const pairs: MetadataPair[] = [
        { key: 'valid', value: 'value', type: 'string' },
        { key: '', value: 'value', type: 'string' }
      ]
      
      const result = validateMetadata(pairs)
      
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('All metadata fields require a key')
    })

    it('should return invalid when a key is only whitespace', () => {
      const { validateMetadata } = useDocumentValidation()
      const pairs: MetadataPair[] = [
        { key: '   ', value: 'value', type: 'string' }
      ]
      
      const result = validateMetadata(pairs)
      
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('All metadata fields require a key')
    })

    it('should return invalid when duplicate keys exist', () => {
      const { validateMetadata } = useDocumentValidation()
      const pairs: MetadataPair[] = [
        { key: 'name', value: 'value1', type: 'string' },
        { key: 'name', value: 'value2', type: 'string' }
      ]
      
      const result = validateMetadata(pairs)
      
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Duplicate metadata keys found')
      expect(result.error).toContain('name')
    })

    it('should skip validation for empty values', () => {
      const { validateMetadata } = useDocumentValidation()
      const pairs: MetadataPair[] = [
        { key: 'optional', value: '', type: 'integer' }
      ]
      
      const result = validateMetadata(pairs)
      
      expect(result.isValid).toBe(true)
    })

    it('should return invalid for invalid integer value', () => {
      const { validateMetadata } = useDocumentValidation()
      const pairs: MetadataPair[] = [
        { key: 'count', value: '3.14', type: 'integer' }
      ]
      
      const result = validateMetadata(pairs)
      
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Metadata field "count" must be a whole number')
    })

    it('should return invalid for invalid float value', () => {
      const { validateMetadata } = useDocumentValidation()
      const pairs: MetadataPair[] = [
        { key: 'price', value: 'abc', type: 'float' }
      ]
      
      const result = validateMetadata(pairs)
      
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Metadata field "price" must be a valid decimal number')
    })

    it('should return invalid for invalid boolean value', () => {
      const { validateMetadata } = useDocumentValidation()
      const pairs: MetadataPair[] = [
        { key: 'active', value: 'yes', type: 'boolean' }
      ]
      
      const result = validateMetadata(pairs)
      
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Metadata field "active" must be exactly "true" or "false"')
    })

    it('should return valid for valid metadata', () => {
      const { validateMetadata } = useDocumentValidation()
      const pairs: MetadataPair[] = [
        { key: 'name', value: 'Test', type: 'string' },
        { key: 'count', value: '42', type: 'integer' },
        { key: 'price', value: '3.14', type: 'float' },
        { key: 'active', value: 'true', type: 'boolean' }
      ]
      
      const result = validateMetadata(pairs)
      
      expect(result.isValid).toBe(true)
      expect(result.error).toBe('')
    })

    it('should handle whitespace in values correctly', () => {
      const { validateMetadata } = useDocumentValidation()
      const pairs: MetadataPair[] = [
        { key: 'count', value: '  ', type: 'integer' }
      ]
      
      // Empty after trim should be skipped
      const result = validateMetadata(pairs)
      
      expect(result.isValid).toBe(true)
    })
  })

  describe('documentError ref', () => {
    it('should initialize documentError as empty string', () => {
      const { documentError } = useDocumentValidation()
      
      expect(documentError.value).toBe('')
    })
  })
})
