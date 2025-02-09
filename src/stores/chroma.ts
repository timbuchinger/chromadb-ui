import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export interface CollectionInfo {
  name: string
  id: string
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
  collection_name?: string
  ids?: string[]
  where?: Record<string, any>
  where_document?: Record<string, any>
  sort?: string
  limit?: number
  offset?: number
  include?: IncludeEnum[]
  tenant?: string
  database?: string
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
    currentCollection: null as CollectionInfo | null,
    documents: [] as Document[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    getCollectionByName: (state) => (name: string) => {
      return state.collections.find(c => c.name === name)
    }
  },

  actions: {
    async fetchCollections() {
      const authStore = useAuthStore()
      this.loading = true
      this.error = null

      try {
        const response = await axios.get<{ id: string; name: string }[]>(
          `${authStore.getBaseUrl}/api/v1/collections?tenant=${DEFAULT_PARAMS.tenant}&database=${DEFAULT_PARAMS.database}`,
          {
            headers: authStore.getHeaders
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

      const collection = this.getCollectionByName(name)
      if (!collection) {
        this.error = 'Collection not found'
        throw new Error('Collection not found')
      }

      this.currentCollection = collection

      try {
        const response = await axios.post<GetResponse>(
          `${authStore.getBaseUrl}/api/v1/collections/${encodeURIComponent(collection.id)}/get`,
          {
            collection_name: name,
            include: ['documents', 'metadatas'] as IncludeEnum[],
            // where: { $and: [] }, // Use $and operator with empty condition array to match all documents
            limit: 100,
            tenant: DEFAULT_PARAMS.tenant,
            database: DEFAULT_PARAMS.database
          } as GetEmbedding & { tenant?: string; database?: string },
          {
            headers: authStore.getHeaders
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
        if (axios.isAxiosError(error)) {
          console.error('Full error response:', error.response?.data)
          this.error = error.response?.data?.message ||
            `API Error ${error.response?.status}: ${error.response?.data ? JSON.stringify(error.response.data) : error.message}`
        } else if (error instanceof Error) {
          this.error = error.message
        } else {
          this.error = 'Failed to fetch documents'
        }
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteDocument(collectionName: string, documentId: string) {
      const authStore = useAuthStore()
      this.loading = true
      this.error = null

      const collection = this.getCollectionByName(collectionName)
      if (!collection) {
        this.error = 'Collection not found'
        throw new Error('Collection not found')
      }

      try {
        await axios.post(
          `${authStore.getBaseUrl}/api/v1/collections/${encodeURIComponent(collection.id)}/delete`,
          {
            ids: [documentId],
            tenant: DEFAULT_PARAMS.tenant,
            database: DEFAULT_PARAMS.database
          } as DeleteEmbedding & { tenant?: string; database?: string },
          {
            headers: authStore.getHeaders
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
    },

    async createCollection(name: string) {
      const authStore = useAuthStore()
      this.loading = true
      this.error = null

      try {
        const response = await axios.post<{ id: string; name: string }>(
          `${authStore.getBaseUrl}/api/v1/collections`,
          {
            name,
            tenant: DEFAULT_PARAMS.tenant,
            database: DEFAULT_PARAMS.database
          },
          {
            headers: authStore.getHeaders
          }
        )
        // Add the new collection to local state
        this.collections.push(response.data)
      } catch (error) {
        this.error = error instanceof Error
          ? error.message
          : axios.isAxiosError(error)
            ? error.response?.data?.message || 'Failed to create collection'
            : 'Failed to create collection'
        throw error
      } finally {
        this.loading = false
      }
    },

    async addDocument(collectionName: string, params: { id?: string; document: string; metadata: Record<string, any> }) {
      const authStore = useAuthStore()
      this.loading = true
      this.error = null

      const collection = this.getCollectionByName(collectionName)
      if (!collection) {
        this.error = 'Collection not found'
        throw new Error('Collection not found')
      }

      try {
        // Use put for ID-specified documents, post for auto-generated IDs
        const method = params.id ? 'put' : 'post'
        await axios.request({
          method,
          url: `${authStore.getBaseUrl}/api/v1/collections/${encodeURIComponent(collection.id)}/upsert`,
          data: {
            documents: [params.document],
            metadatas: [params.metadata],
            ids: params.id ? [params.id] : undefined,
            tenant: DEFAULT_PARAMS.tenant,
            database: DEFAULT_PARAMS.database
          },
          headers: authStore.getHeaders
        })

        // Refresh documents list
        await this.fetchCollectionDocuments(collectionName)
      } catch (error) {
        this.error = error instanceof Error
          ? error.message
          : axios.isAxiosError(error)
            ? error.response?.data?.message || 'Failed to add document'
            : 'Failed to add document'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteCollection(name: string) {
      const authStore = useAuthStore()
      this.loading = true
      this.error = null

      const collection = this.getCollectionByName(name)
      if (!collection) {
        this.error = 'Collection not found'
        throw new Error('Collection not found')
      }

      try {
        await axios.delete(
          `${authStore.getBaseUrl}/api/v1/collections/${encodeURIComponent(collection.id)}?tenant=${DEFAULT_PARAMS.tenant}&database=${DEFAULT_PARAMS.database}`,
          {
            headers: authStore.getHeaders
          }
        )
        // Remove the collection from local state
        this.collections = this.collections.filter(col => col.name !== name)
        if (this.currentCollection?.name === name) {
          this.currentCollection = null
          this.documents = []
        }
      } catch (error) {
        this.error = error instanceof Error
          ? error.message
          : axios.isAxiosError(error) && error.response?.status === 404
            ? 'Collection not found'
            : 'Failed to delete collection'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
