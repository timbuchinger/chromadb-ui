import { describe, it, expect } from 'vitest'
import {
  getTypeDescription,
  getTypePlaceholder,
  isValidValue,
  parseMetadataValue,
  type MetadataPair
} from '../../../src/utils/documentTypes'

describe('documentTypes utils', () => {
  describe('getTypeDescription', () => {
    it('should return correct description for string type', () => {
      expect(getTypeDescription('string')).toBe('Text value (e.g., "hello")')
    })

    it('should return correct description for integer type', () => {
      expect(getTypeDescription('integer')).toBe('Whole number (e.g., 42)')
    })

    it('should return correct description for float type', () => {
      expect(getTypeDescription('float')).toBe('Decimal number (e.g., 3.14)')
    })

    it('should return correct description for boolean type', () => {
      expect(getTypeDescription('boolean')).toBe('True or false value')
    })
  })

  describe('getTypePlaceholder', () => {
    it('should return correct placeholder for string type', () => {
      expect(getTypePlaceholder('string')).toBe('Enter text value')
    })

    it('should return correct placeholder for integer type', () => {
      expect(getTypePlaceholder('integer')).toBe('Enter whole number')
    })

    it('should return correct placeholder for float type', () => {
      expect(getTypePlaceholder('float')).toBe('Enter decimal number')
    })

    it('should return correct placeholder for boolean type', () => {
      expect(getTypePlaceholder('boolean')).toBe('Select true or false')
    })
  })

  describe('isValidValue', () => {
    it('should return false for empty value', () => {
      const pair: MetadataPair = { key: 'test', value: '', type: 'string' }
      expect(isValidValue(pair)).toBe(false)
    })

    it('should return true for valid string', () => {
      const pair: MetadataPair = { key: 'test', value: 'hello', type: 'string' }
      expect(isValidValue(pair)).toBe(true)
    })

    it('should return true for valid integer', () => {
      const pair: MetadataPair = { key: 'test', value: '42', type: 'integer' }
      expect(isValidValue(pair)).toBe(true)
    })

    it('should return false for invalid integer', () => {
      const pair: MetadataPair = { key: 'test', value: '3.14', type: 'integer' }
      expect(isValidValue(pair)).toBe(false)
    })

    it('should return true for valid float', () => {
      const pair: MetadataPair = { key: 'test', value: '3.14', type: 'float' }
      expect(isValidValue(pair)).toBe(true)
    })

    it('should return false for invalid float', () => {
      const pair: MetadataPair = { key: 'test', value: 'abc', type: 'float' }
      expect(isValidValue(pair)).toBe(false)
    })

    it('should return true for valid boolean true', () => {
      const pair: MetadataPair = { key: 'test', value: 'true', type: 'boolean' }
      expect(isValidValue(pair)).toBe(true)
    })

    it('should return true for valid boolean false', () => {
      const pair: MetadataPair = { key: 'test', value: 'false', type: 'boolean' }
      expect(isValidValue(pair)).toBe(true)
    })

    it('should return false for invalid boolean', () => {
      const pair: MetadataPair = { key: 'test', value: 'yes', type: 'boolean' }
      expect(isValidValue(pair)).toBe(false)
    })
  })

  describe('parseMetadataValue', () => {
    it('should parse integer correctly', () => {
      const pair: MetadataPair = { key: 'test', value: '42', type: 'integer' }
      expect(parseMetadataValue(pair)).toBe(42)
    })

    it('should parse float correctly', () => {
      const pair: MetadataPair = { key: 'test', value: '3.14', type: 'float' }
      expect(parseMetadataValue(pair)).toBe(3.14)
    })

    it('should parse boolean true correctly', () => {
      const pair: MetadataPair = { key: 'test', value: 'true', type: 'boolean' }
      expect(parseMetadataValue(pair)).toBe(true)
    })

    it('should parse boolean false correctly', () => {
      const pair: MetadataPair = { key: 'test', value: 'false', type: 'boolean' }
      expect(parseMetadataValue(pair)).toBe(false)
    })

    it('should return string as-is', () => {
      const pair: MetadataPair = { key: 'test', value: 'hello', type: 'string' }
      expect(parseMetadataValue(pair)).toBe('hello')
    })
  })
})
