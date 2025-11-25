/**
 * Cookie management utilities for storing non-sensitive user settings
 */

export interface SavedSettings {
  serverUrl?: string
  protocol?: 'http' | 'https'
  tenant?: string
  database?: string
}

const SETTINGS_COOKIE_NAME = 'chromadb_settings'
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 1 year in seconds

/**
 * Save user settings to a cookie (excludes sensitive data like passwords/tokens)
 */
export function saveSettings(settings: SavedSettings): void {
  const cookieValue = encodeURIComponent(JSON.stringify(settings))
  document.cookie = `${SETTINGS_COOKIE_NAME}=${cookieValue}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Strict`
}

/**
 * Load saved settings from cookie
 */
export function loadSettings(): SavedSettings | null {
  const cookies = document.cookie.split(';')
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    
    if (name === SETTINGS_COOKIE_NAME && value) {
      try {
        return JSON.parse(decodeURIComponent(value))
      } catch (error) {
        console.error('Failed to parse settings cookie:', error)
        return null
      }
    }
  }
  
  return null
}

/**
 * Clear saved settings cookie
 */
export function clearSettings(): void {
  document.cookie = `${SETTINGS_COOKIE_NAME}=; max-age=0; path=/`
}
