import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'
import { useNotificationStore } from './notifications'
import { useLoadingStore } from './loading'

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

        const response = await axios.get<{ id: string; name: string }[]>(
          `${authStore.getBaseUrl}/api/v1/collections?tenant=${DEFAULT_PARAMS.tenant}&database=${DEFAULT_PARAMS.database}`,
          {
            headers: authStore.getHeaders
          }
        )
        this.collections = response.data
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
        const response = await axios.post<GetResponse>(
          `${authStore.getBaseUrl}/api/v1/collections/${encodeURIComponent(collection.id)}/get`,
          {
            collection_name: name,
            include: ['documents', 'metadatas'] as IncludeEnum[],
            limit: 100,
            tenant: DEFAULT_PARAMS.tenant,
            database: DEFAULT_PARAMS.database
          } as GetEmbedding & { tenant?: string; database?: string },
          {
            headers: authStore.getHeaders
          }
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
        this.collections.push(response.data)
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
        // Use put for ID-specified documents, post for auto-generated IDs
        const method = params.id ? 'put' : 'post';
        await axios.request({
          method: method,
          url: `${authStore.getBaseUrl}/api/v1/collections/${encodeURIComponent(collection.id)}/upsert`,
          data: {
            documents: [params.document],
            metadatas: [params.metadata],
            ids: [params.id || getRandomId()],
            tenant: DEFAULT_PARAMS.tenant,
            database: DEFAULT_PARAMS.database
          },
          headers: authStore.getHeaders
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
        // Delete collection
        await axios.delete(
          `${authStore.getBaseUrl}/api/v1/collections/${collection.id}?tenant=${DEFAULT_PARAMS.tenant}&database=${DEFAULT_PARAMS.database}`,
          {
            headers: authStore.getHeaders
          }
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
