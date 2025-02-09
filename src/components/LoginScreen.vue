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
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Connect to ChromaDB
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <!-- Server URL -->
          <div class="flex">
            <select
              v-model="protocol"
              class="relative block w-1/4 rounded-l-md border-0 bg-transparent py-1.5 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            >
              <option value="http">http://</option>
              <option value="https">https://</option>
            </select>
            <input
              v-model="serverUrl"
              type="text"
              required
              class="relative block w-3/4 rounded-r-md border-0 py-1.5 px-3 text-gray-900 dark:text-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
              class="form-radio text-blue-600"
            />
            <span class="ml-2 text-gray-900 dark:text-white">Token</span>
          </label>
          <label class="inline-flex items-center">
            <input
              type="radio"
              v-model="authType"
              value="basic"
              class="form-radio text-blue-600"
            />
            <span class="ml-2 text-gray-900 dark:text-white">Basic Auth</span>
          </label>
          <label class="inline-flex items-center">
            <input
              type="radio"
              v-model="authType"
              value="none"
              class="form-radio text-blue-600"
            />
            <span class="ml-2 text-gray-900 dark:text-white">No Auth</span>
          </label>
        </div>

        <!-- Token Auth Fields -->
        <div v-if="authType === 'token'" class="mt-4 rounded-md shadow-sm -space-y-px">
          <div>
            <input
              v-model="token"
              type="password"
              required
              class="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
              class="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="Username"
            />
          </div>
          <div>
            <input
              v-model="password"
              type="password"
              required
              class="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
              class="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="Tenant"
            />
          </div>
          <div>
            <input
              v-model="database"
              type="text"
              required
              class="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="Database"
            />
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
          >
            <span v-if="loading">Connecting...</span>
            <span v-else>Connect</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
