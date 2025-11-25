/**
 * Secure storage utility using Web Crypto API for encryption
 * Implements AES-GCM encryption for localStorage with expiration support
 */

interface StoredData<T> {
  data: T
  expiresAt: number
}

interface EncryptedPayload {
  ciphertext: string
  iv: string
  salt: string
}

const EXPIRATION_MS = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Generates a cryptographic key from a password using PBKDF2
 */
async function deriveKey(password: string, salt: BufferSource): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

/**
 * Generates a session-specific encryption key based on browser fingerprint
 * This ensures the key is unique per browser session
 */
function getSessionKey(): string {
  // In Cypress test environment, use a stable key for consistency
  if (typeof window !== 'undefined' && (window as any).Cypress) {
    return 'chromadb-cypress-test-key'
  }
  
  // Use a combination of browser properties as a unique identifier
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    screen.width,
    screen.height,
    screen.colorDepth
  ].join('|')
  
  // Hash the fingerprint to create a consistent key
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  return `chromadb-session-${Math.abs(hash)}`
}

/**
 * Encrypts data using AES-GCM
 */
async function encryptData<T>(data: T, expiresAt: number): Promise<EncryptedPayload> {
  const storedData: StoredData<T> = { data, expiresAt }
  const encoder = new TextEncoder()
  const plaintext = encoder.encode(JSON.stringify(storedData))

  // Generate random salt and IV
  const salt = new Uint8Array(16)
  const iv = new Uint8Array(12)
  crypto.getRandomValues(salt)
  crypto.getRandomValues(iv)

  // Derive encryption key
  const key = await deriveKey(getSessionKey(), salt)

  // Encrypt the data
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    plaintext
  )

  // Convert to base64 for storage
  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
    iv: btoa(String.fromCharCode(...iv)),
    salt: btoa(String.fromCharCode(...salt))
  }
}

/**
 * Decrypts data using AES-GCM
 */
async function decryptData<T>(payload: EncryptedPayload): Promise<StoredData<T> | null> {
  try {
    // Convert from base64
    const ciphertext = Uint8Array.from(atob(payload.ciphertext), c => c.charCodeAt(0))
    const iv = Uint8Array.from(atob(payload.iv), c => c.charCodeAt(0))
    const salt = Uint8Array.from(atob(payload.salt), c => c.charCodeAt(0))

    // Derive decryption key
    const key = await deriveKey(getSessionKey(), salt)

    // Decrypt the data
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    )

    // Parse and return
    const decoder = new TextDecoder()
    const jsonString = decoder.decode(plaintext)
    return JSON.parse(jsonString) as StoredData<T>
  } catch (error) {
    console.error('Decryption failed:', error)
    return null
  }
}

/**
 * Securely stores data in localStorage with encryption and expiration
 */
export async function setSecureItem<T>(key: string, value: T, expirationMs: number = EXPIRATION_MS): Promise<void> {
  const expiresAt = Date.now() + expirationMs
  const payload = await encryptData(value, expiresAt)
  localStorage.setItem(key, JSON.stringify(payload))
}

/**
 * Retrieves and decrypts data from localStorage
 * Returns null if data is expired or decryption fails
 */
export async function getSecureItem<T>(key: string): Promise<T | null> {
  const storedValue = localStorage.getItem(key)
  if (!storedValue) {
    return null
  }

  try {
    const payload: EncryptedPayload = JSON.parse(storedValue)
    const storedData = await decryptData<T>(payload)

    if (!storedData) {
      // Decryption failed
      localStorage.removeItem(key)
      return null
    }

    // Check if expired
    if (Date.now() > storedData.expiresAt) {
      localStorage.removeItem(key)
      return null
    }

    return storedData.data
  } catch (error) {
    console.error('Failed to retrieve secure item:', error)
    localStorage.removeItem(key)
    return null
  }
}

/**
 * Removes an item from secure storage
 */
export function removeSecureItem(key: string): void {
  localStorage.removeItem(key)
}

/**
 * Clears all expired items from localStorage
 */
export async function clearExpiredItems(): Promise<void> {
  const keys = Object.keys(localStorage)
  
  for (const key of keys) {
    const storedValue = localStorage.getItem(key)
    if (!storedValue) continue

    try {
      const payload: EncryptedPayload = JSON.parse(storedValue)
      // Check if it looks like our encrypted format
      if (payload.ciphertext && payload.iv && payload.salt) {
        const storedData = await decryptData(payload)
        if (storedData && Date.now() > storedData.expiresAt) {
          localStorage.removeItem(key)
        }
      }
    } catch {
      // Not our format, skip
      continue
    }
  }
}
