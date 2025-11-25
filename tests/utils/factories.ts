/**
 * Test data factories for creating test fixtures
 */

import type { CollectionInfo, Document } from '@/stores/chroma'
import type { Notification, NotificationType } from '@/stores/notifications'

let collectionCounter = 0
let documentCounter = 0
let notificationCounter = 0

/**
 * Creates a test collection
 */
export function createCollection(overrides: Partial<CollectionInfo> = {}): CollectionInfo {
  collectionCounter++
  return {
    id: `test-collection-id-${collectionCounter}`,
    name: `test-collection-${collectionCounter}`,
    ...overrides
  }
}

/**
 * Creates multiple test collections
 */
export function createCollections(count: number, overrides: Partial<CollectionInfo> = {}): CollectionInfo[] {
  return Array.from({ length: count }, () => createCollection(overrides))
}

/**
 * Creates a test document
 */
export function createDocument(overrides: Partial<Document> = {}): Document {
  documentCounter++
  return {
    id: `test-document-id-${documentCounter}`,
    document: `Test document content ${documentCounter}`,
    metadata: {},
    ...overrides
  }
}

/**
 * Creates multiple test documents
 */
export function createDocuments(count: number, overrides: Partial<Document> = {}): Document[] {
  return Array.from({ length: count }, () => createDocument(overrides))
}

/**
 * Creates a test notification
 */
export function createNotification(overrides: Partial<Notification> = {}): Notification {
  notificationCounter++
  return {
    id: `test-notification-${notificationCounter}`,
    type: 'info' as NotificationType,
    message: `Test notification message ${notificationCounter}`,
    timeout: 10000,
    ...overrides
  }
}

/**
 * Creates multiple test notifications
 */
export function createNotifications(count: number, overrides: Partial<Notification> = {}): Notification[] {
  return Array.from({ length: count }, () => createNotification(overrides))
}

/**
 * Reset all counters (useful for test isolation)
 */
export function resetFactoryCounters(): void {
  collectionCounter = 0
  documentCounter = 0
  notificationCounter = 0
}
