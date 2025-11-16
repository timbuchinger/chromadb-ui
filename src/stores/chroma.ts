import { defineStore } from 'pinia'
import { getApiClient } from '../utils/api'
import { useAuthStore } from './auth'
import { useNotificationStore } from './notifications'
import { useLoadingStore } from './loading'

export interface CollectionInfo {
  name: string
  id: string
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
      const loadingStore = useLoadingStore()
      this.error = null

      return loadingStore.withLoading('collections', async () => {
        const apiClient = getApiClient(authStore.getBaseUrl, authStore.getHeaders)
        const response = await apiClient.get<{ id: string; name: string }[]>(
          `/api/v1/collections?tenant=${authStore.getTenant}&database=${authStore.getDatabase}`
        )
        // Sort collections alphabetically by name
        this.collections = response.data.sort((a, b) => a.name.localeCompare(b.name))
      })
    },

    async fetchCollectionDocuments(name: string) {
      const authStore = useAuthStore()
      const notificationStore = useNotificationStore()
      const loadingStore = useLoadingStore()
      this.error = null

      const collection = this.getCollectionByName(name)
      if (!collection) {
        this.error = 'Collection not found'
        notificationStore.error(this.error || 'Collection not found')
        return
      }

      this.currentCollection = collection

      return loadingStore.withLoading('documents', async () => {
        const apiClient = getApiClient(authStore.getBaseUrl, authStore.getHeaders)
        const response = await apiClient.post<GetResponse>(
          `/api/v1/collections/${encodeURIComponent(collection.id)}/get`,
          {
            collection_name: name,
            include: ['documents', 'metadatas'] as IncludeEnum[],
            limit: 100,
            tenant: authStore.getTenant,
            database: authStore.getDatabase
          } as GetEmbedding & { tenant?: string; database?: string }
        )

        const { ids, documents, metadatas } = response.data
        this.documents = ids.map((id, index) => ({
          id,
          document: documents[index] || '',
          metadata: metadatas[index] || {}
        }))
      })
    },

    async deleteDocument(collectionName: string, documentId: string) {
      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();
      const loadingStore = useLoadingStore();
      this.error = null;

      const collection = this.getCollectionByName(collectionName);
      if (!collection) {
        this.error = 'Collection not found';
        notificationStore.error(this.error || 'Collection not found');
        return;
      }

      const loadingResult = loadingStore.withLoading('documents', async () => {
        if (!collection) {
          return;
        }
        const apiClient = getApiClient(authStore.getBaseUrl, authStore.getHeaders)
        await apiClient.post(
          `/api/v1/collections/${encodeURIComponent(collection.id)}/delete`,
          {
            ids: [documentId],
            tenant: authStore.getTenant,
            database: authStore.getDatabase
          } as DeleteEmbedding & { tenant?: string; database?: string }
        );

        this.documents = this.documents.filter(doc => doc.id !== documentId);
      });
      return loadingResult;
    },

    async createCollection(name: string) {
      const authStore = useAuthStore()
      const notificationStore = useNotificationStore()
      const loadingStore = useLoadingStore()
      this.error = null

      return loadingStore.withLoading('collections', async () => {
        const apiClient = getApiClient(authStore.getBaseUrl, authStore.getHeaders)
        const response = await apiClient.post<{ id: string; name: string }>(
          `/api/v1/collections`,
          {
            name,
            tenant: authStore.getTenant,
            database: authStore.getDatabase
          }
        )
        this.collections.push(response.data)
        // Sort collections alphabetically by name after adding
        this.collections.sort((a, b) => a.name.localeCompare(b.name))
        notificationStore.success('Collection created successfully')
      })
    },

    async addDocument(collectionName: string, params: { id?: string; document: string; metadata: Record<string, any> }) {
      const crypto = window.crypto
      const getRandomId = () => crypto.randomUUID()
      const authStore = useAuthStore()
      const notificationStore = useNotificationStore()
      const loadingStore = useLoadingStore()
      this.error = null

      const collection = this.getCollectionByName(collectionName)
      if (!collection) {
        this.error = 'Collection not found';
        notificationStore.error(this.error || 'Collection not found');
        return;
      }

      return loadingStore.withLoading('documents', async () => {
        const apiClient = getApiClient(authStore.getBaseUrl, authStore.getHeaders)
        // Use put for ID-specified documents, post for auto-generated IDs
        const method = params.id ? 'put' : 'post';
        await apiClient.request({
          method: method,
          url: `/api/v1/collections/${encodeURIComponent(collection.id)}/upsert`,
          data: {
            documents: [params.document],
            metadatas: [params.metadata],
            ids: [params.id || getRandomId()],
            tenant: authStore.getTenant,
            database: authStore.getDatabase
          }
        });

        await this.fetchCollectionDocuments(collectionName);
        notificationStore.success('Document added successfully');
      });
    },

    async deleteCollection(name: string) {
      const authStore = useAuthStore()
      const notificationStore = useNotificationStore()
      const loadingStore = useLoadingStore()
      this.error = null

      const collection = this.getCollectionByName(name)
      if (!collection) {
        this.error = 'Collection not found';
        notificationStore.error(this.error || 'Collection not found');
        return;
      }

      const loadingResult = loadingStore.withLoading('collections', async () => {
        if (!collection) {
          return;
        }
        const apiClient = getApiClient(authStore.getBaseUrl, authStore.getHeaders)
        // Delete collection
        await apiClient.delete(
          `/api/v1/collections/${encodeURIComponent(collection.name)}`
        );

        // Reset current collection if it was deleted
        if (this.currentCollection?.name === name) {
          this.currentCollection = null;
          this.documents = [];
        }

        // Refresh collections list
        await this.fetchCollections();
        notificationStore.success('Collection deleted successfully');
      });
      return loadingResult;
    }
  }
})
