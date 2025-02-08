import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export interface Collection {
  name: string
}

export interface Document {
  id: string
  metadata: Record<string, any>
  document: string
}

interface GetResponse {
  ids: string[]
  documents: string[]
  metadatas: Record<string, any>[]
}

export const useChromaStore = defineStore('chroma', {
  state: () => ({
    collections: [] as Collection[],
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
        const response = await axios.get<string[]>(
          `${authStore.getBaseUrl}/api/v1/list_collections`,
          { headers: authStore.getHeaders }
        )
        this.collections = response.data.map(name => ({ name }))
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch collections'
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
          `${authStore.getBaseUrl}/api/v1/collections/${name}/get`,
          { include: ['documents', 'metadatas'] },
          { headers: authStore.getHeaders }
        )

        // Transform the response into Document objects
        const { ids, documents, metadatas } = response.data
        this.documents = ids.map((id, index) => ({
          id,
          document: documents[index],
          metadata: metadatas[index] || {}
        }))
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch documents'
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
          `${authStore.getBaseUrl}/api/v1/collections/${collectionName}/delete`,
          { ids: [documentId] },
          { headers: authStore.getHeaders }
        )

        // Remove the document from the local state
        this.documents = this.documents.filter(doc => doc.id !== documentId)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete document'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
