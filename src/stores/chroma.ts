import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export interface CollectionInfo {
  name: string
  id?: string
}

interface DatabaseParams {
  tenant?: string
  database?: string
}

const DEFAULT_PARAMS: DatabaseParams = {
  tenant: 'default_tenant',
  database: 'default_database'
}

export interface Document {
  id: string
  metadata: Record<string, any>
  document: string
}

type IncludeEnum = 'documents' | 'embeddings' | 'metadatas' | 'distances' | 'uris' | 'data'

interface GetEmbedding {
  ids?: string[]
  where?: Record<string, any>
  where_document?: Record<string, any>
  sort?: string
  limit?: number
  offset?: number
  include?: IncludeEnum[]
}

interface GetResponse {
  ids: string[]
  documents: string[]
  metadatas: Record<string, any>[]
  embeddings?: number[][]
  distances?: number[]
  error?: string
}

interface DeleteEmbedding {
  ids?: string[]
  where?: Record<string, any>
  where_document?: Record<string, any>
}

export const useChromaStore = defineStore('chroma', {
  state: () => ({
    collections: [] as CollectionInfo[],
    currentCollection: null as string | null,
    documents: [] as Document[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchCollections() {
      const authStore = useAuthStore()
      this.loading = true
      this.error = null

      try {
        const response = await axios.get<{ name: string }[]>(
          `${authStore.getBaseUrl}/api/v1/collections`,
          {
            headers: authStore.getHeaders,
            params: DEFAULT_PARAMS
          }
        )
        this.collections = response.data
      } catch (error) {
        this.error = error instanceof Error
          ? error.message
          : axios.isAxiosError(error) && error.response?.status === 404
            ? 'Collection not found'
            : 'Failed to fetch collections'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCollectionDocuments(name: string) {
      const authStore = useAuthStore()
      this.loading = true
      this.error = null
      this.currentCollection = name

      try {
        const response = await axios.post<GetResponse>(
          `${authStore.getBaseUrl}/api/v1/collections/${encodeURIComponent(name)}/get`,
          {
            include: ['documents', 'metadatas'] as IncludeEnum[],
            limit: 100
          } as GetEmbedding,
          {
            headers: authStore.getHeaders,
            params: DEFAULT_PARAMS
          }
        )

        // Transform the response into Document objects
        const { ids, documents, metadatas } = response.data
        this.documents = ids.map((id, index) => ({
          id,
          document: documents[index] || '',
          metadata: metadatas[index] || {}
        }))
      } catch (error) {
        this.error = error instanceof Error
          ? error.message
          : axios.isAxiosError(error) && error.response?.status === 404
            ? 'Collection not found'
            : 'Failed to fetch documents'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteDocument(collectionName: string, documentId: string) {
      const authStore = useAuthStore()
      this.loading = true
      this.error = null

      try {
        await axios.post(
          `${authStore.getBaseUrl}/api/v1/collections/${encodeURIComponent(collectionName)}/delete`,
          { ids: [documentId] } as DeleteEmbedding,
          {
            headers: authStore.getHeaders,
            params: DEFAULT_PARAMS
          }
        )

        // Remove the document from the local state
        this.documents = this.documents.filter(doc => doc.id !== documentId)
      } catch (error) {
        this.error = error instanceof Error
          ? error.message
          : axios.isAxiosError(error) && error.response?.status === 404
            ? 'Document or collection not found'
            : 'Failed to delete document'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
