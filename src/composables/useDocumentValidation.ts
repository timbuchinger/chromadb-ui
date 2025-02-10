import { ref } from 'vue'
import type { MetadataPair } from '../utils/documentTypes'

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
    for (const pair of pairs) {
      if (!pair.key.trim()) {
        return {
          isValid: false,
          error: 'All metadata fields require a key'
        }
      }

      if (pair.type === 'integer' && isNaN(Number(pair.value))) {
        return {
          isValid: false,
          error: `Metadata field "${pair.key}" must be an integer`
        }
      }

      if (pair.type === 'float' && isNaN(Number(pair.value))) {
        return {
          isValid: false,
          error: `Metadata field "${pair.key}" must be a float`
        }
      }

      if (pair.type === 'boolean' && pair.value !== 'true' && pair.value !== 'false') {
        return {
          isValid: false,
          error: `Metadata field "${pair.key}" must be a boolean (true or false)`
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
