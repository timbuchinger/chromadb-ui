export function collectionsBasePath(tenant: string, database: string) {
  return `/api/v2/tenants/${encodeURIComponent(tenant)}/databases/${encodeURIComponent(database)}/collections`
}

export function collectionPath(tenant: string, database: string, collectionId: string) {
  return `${collectionsBasePath(tenant, database)}/${encodeURIComponent(collectionId)}`
}
