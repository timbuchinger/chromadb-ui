import { defineStore } from 'pinia';

export interface LoadingState {
  collections: boolean;
  documents: boolean;
  authentication: boolean;
  navigation: boolean;
}

export const useLoadingStore = defineStore('loading', {
  state: (): LoadingState => ({
    collections: false,
    documents: false,
    authentication: false,
    navigation: false,
  }),

  actions: {
    startLoading(key: keyof LoadingState) {
      this[key] = true;
    },

    stopLoading(key: keyof LoadingState) {
      this[key] = false;
    },

    // Helper for async operations
    async withLoading<T>(key: keyof LoadingState, operation: () => Promise<T>): Promise<T> {
      try {
        this.startLoading(key);
        return await operation();
      } finally {
        this.stopLoading(key);
      }
    },
  },

  getters: {
    isLoading: (state) => (key: keyof LoadingState): boolean => state[key],

    // Check if any loading state is active
    isAnyLoading: (state): boolean =>
      Object.values(state).some(loading => loading),
  },
});
