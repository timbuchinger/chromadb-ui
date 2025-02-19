<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const serverUrl = ref('localhost:8000')
const protocol = ref<'http' | 'https'>('http')
const authType = ref<'token' | 'basic' | 'none'>('token')
const token = ref('')
const username = ref('')
const password = ref('')
const tenant = ref('default_tenant')
const database = ref('default_database')
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  if (loading.value) return
  error.value = ''
  loading.value = true

  try {
    // Validate required fields
    if (authType.value === 'token' && !token.value) {
      throw new Error('Token is required')
    }
    if (authType.value === 'basic' && (!username.value || !password.value)) {
      throw new Error('Username and password are required')
    }

    // Test connection with ChromaDB
    const response = await fetch(`${protocol.value}://${serverUrl.value}/api/v1/collections`, {
      headers: {
        ...(authType.value === 'token' ? { 'Authorization': `Bearer ${token.value}` } : {}),
        ...(authType.value === 'basic' ? { 'Authorization': `Basic ${btoa(`${username.value}:${password.value}`)}` } : {})
      }
    })

    if (!response.ok) {
      throw new Error('Authentication failed. Please check your credentials.')
    }

    // Store authentication details if successful
    await authStore.login({
      serverUrl: serverUrl.value,
      protocol: protocol.value,
      authType: authType.value,
      token: token.value,
      username: username.value,
      password: password.value,
      tenant: tenant.value,
      database: database.value
    })

    router.push('/')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Authentication failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-surface-primary-light dark:bg-surface-primary-dark">
    <div class="flex items-center justify-center px-4 h-[calc(100vh-4rem)]">
      <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-content-primary-light dark:text-content-primary-dark">
          Connect to ChromaDB
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <!-- Server URL -->
          <div class="flex">
            <select
              v-model="protocol"
              class="relative block w-1/4 rounded-l-md border-0 bg-transparent py-1.5 text-content-primary-light dark:text-content-primary-dark ring-1 ring-inset ring-border-primary-light dark:ring-border-primary-dark placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-accent-primary sm:text-sm sm:leading-6 dark:[&>option]:bg-surface-secondary-dark"
            >
              <option value="http">http://</option>
              <option value="https">https://</option>
            </select>
            <input
              v-model="serverUrl"
              type="text"
              required
              class="relative block w-3/4 rounded-r-md border-0 py-1.5 px-3 text-content-primary-light dark:text-content-primary-dark dark:bg-surface-secondary-dark ring-1 ring-inset ring-border-primary-light dark:ring-border-primary-dark placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-accent-primary sm:text-sm sm:leading-6"
              placeholder="<http://localhost:8000>"
            />
          </div>
        </div>

        <!-- Auth Type Selection -->
        <div class="flex justify-center space-x-4">
          <label class="inline-flex items-center">
            <input
              type="radio"
              v-model="authType"
              value="token"
              class="form-radio text-accent-primary"
            />
            <span class="ml-2 text-content-primary-light dark:text-content-primary-dark">Token</span>
          </label>
          <label class="inline-flex items-center">
            <input
              type="radio"
              v-model="authType"
              value="basic"
              class="form-radio text-accent-primary"
            />
            <span class="ml-2 text-content-primary-light dark:text-content-primary-dark">Basic</span>
          </label>
          <label class="inline-flex items-center">
            <input
              type="radio"
              v-model="authType"
              value="none"
              class="form-radio text-accent-primary"
            />
            <span class="ml-2 text-content-primary-light dark:text-content-primary-dark">No Auth</span>
          </label>
        </div>

        <!-- Token Auth Fields -->
        <div v-if="authType === 'token'" class="mt-4 rounded-md shadow-sm -space-y-px">
          <div>
            <input
              v-model="token"
              type="password"
              required
              class="relative block w-full rounded-md border-0 py-1.5 px-3 text-content-primary-light dark:text-content-primary-dark dark:bg-surface-secondary-dark ring-1 ring-inset ring-border-primary-light dark:ring-border-primary-dark placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-accent-primary sm:text-sm sm:leading-6"
              placeholder="API Token"
            />
          </div>
        </div>

        <!-- Basic Auth Fields -->
        <div v-else-if="authType === 'basic'" class="mt-4 space-y-2">
          <div>
            <input
              v-model="username"
              type="text"
              required
              class="relative block w-full rounded-md border-0 py-1.5 px-3 text-content-primary-light dark:text-content-primary-dark dark:bg-surface-secondary-dark ring-1 ring-inset ring-border-primary-light dark:ring-border-primary-dark placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-accent-primary sm:text-sm sm:leading-6"
              placeholder="Username"
            />
          </div>
          <div>
            <input
              v-model="password"
              type="password"
              required
              class="relative block w-full rounded-md border-0 py-1.5 px-3 text-content-primary-light dark:text-content-primary-dark dark:bg-surface-secondary-dark ring-1 ring-inset ring-border-primary-light dark:ring-border-primary-dark placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-accent-primary sm:text-sm sm:leading-6"
              placeholder="Password"
            />
          </div>
        </div>

        <!-- Tenant and Database -->
        <div class="space-y-2 mb-4">
          <div>
            <input
              v-model="tenant"
              type="text"
              required
              class="relative block w-full rounded-md border-0 py-1.5 px-3 text-content-primary-light dark:text-content-primary-dark dark:bg-surface-secondary-dark ring-1 ring-inset ring-border-primary-light dark:ring-border-primary-dark placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-accent-primary sm:text-sm sm:leading-6"
              placeholder="Tenant"
            />
          </div>
          <div>
            <input
              v-model="database"
              type="text"
              required
              class="relative block w-full rounded-md border-0 py-1.5 px-3 text-content-primary-light dark:text-content-primary-dark dark:bg-surface-secondary-dark ring-1 ring-inset ring-border-primary-light dark:ring-border-primary-dark placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-accent-primary sm:text-sm sm:leading-6"
              placeholder="Database"
            />
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="text-accent-error text-sm text-center" data-test="error-message">
          {{ error }}
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative flex w-full justify-center rounded-md bg-accent-primary px-3 py-2 text-sm font-semibold text-white hover:bg-accent-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary disabled:opacity-50"
          >
            <span v-if="loading">Connecting...</span>
            <span v-else>Connect</span>
          </button>
        </div>
      </form>
      </div>
    </div>
  </div>
</template>
