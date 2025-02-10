import { ref } from 'vue'
import type { MetadataPair } from '../utils/documentTypes'
import { isValidValue } from '../utils/documentTypes'

export interface ValidationResult {
  isValid: boolean
  error: string
}

export function useDocumentValidation() {
  const documentError = ref('')

  const validateDocument = (content: string): ValidationResult => {
    if (!content) {
      return {
        isValid: false,
        error: 'Document content is required'
      }
    }
    return {
      isValid: true,
      error: ''
    }
  }

  const validateMetadata = (pairs: MetadataPair[]): ValidationResult => {
    // Check for empty keys
    for (const pair of pairs) {
      if (!pair.key.trim()) {
        return {
          isValid: false,
          error: 'All metadata fields require a key'
        }
      }
    }

    // Check for duplicate keys
    const keys = pairs.map(p => p.key.trim())
    const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index)
    if (duplicates.length > 0) {
      return {
        isValid: false,
        error: `Duplicate metadata keys found: ${duplicates.join(', ')}`
      }
    }

    // Validate values using existing type validation
    for (const pair of pairs) {
      const trimmedValue = pair.value.trim()

      // Skip empty values as they're optional
      if (!trimmedValue) {
        continue
      }

      if (!isValidValue(pair)) {
        const typeSpecificError = (() => {
          switch (pair.type) {
            case 'integer':
              return 'must be a whole number'
            case 'float':
              return 'must be a valid decimal number'
            case 'boolean':
              return 'must be exactly "true" or "false"'
            default:
              return 'has an invalid value'
          }
        })()

        return {
          isValid: false,
          error: `Metadata field "${pair.key}" ${typeSpecificError}`
        }
      }
    }

    return {
      isValid: true,
      error: ''
    }
  }

  return {
    documentError,
    validateDocument,
    validateMetadata
  }
}
