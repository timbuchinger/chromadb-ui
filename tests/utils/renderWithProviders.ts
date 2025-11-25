/**
 * Test utility for rendering Vue components with providers
 * Provides router, Pinia stores, and other necessary context for component testing
 */

import { mount, type MountingOptions, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import { createRouter, createMemoryHistory, type Router, type RouteRecordRaw } from 'vue-router'
import type { Component } from 'vue'

// Default routes for testing
const defaultRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: { template: '<div>Login</div>' }
  },
  {
    path: '/',
    name: 'collections',
    component: { template: '<div>Collections</div>' },
    meta: { requiresAuth: true }
  },
  {
    path: '/collection/:name',
    name: 'collection',
    component: { template: '<div>Collection</div>' },
    meta: { requiresAuth: true }
  }
]

export interface RenderWithProvidersOptions<P extends object = object> {
  /** Props to pass to the component */
  props?: P
  /** Initial route path */
  initialRoute?: string
  /** Custom routes (will be merged with default routes) */
  routes?: RouteRecordRaw[]
  /** Whether to use default routes */
  useDefaultRoutes?: boolean
  /** Initial store state to seed */
  initialStoreState?: {
    auth?: Partial<{
      isAuthenticated: boolean
      serverUrl: string
      protocol: 'http' | 'https'
      tenant: string
      database: string
    }>
  }
  /** Additional mounting options */
  mountingOptions?: Partial<MountingOptions<Component>>
}

export interface RenderResult<T extends Component> {
  wrapper: VueWrapper<InstanceType<T>>
  router: Router
  pinia: Pinia
}

/**
 * Renders a component with Pinia and router providers
 * Useful for integration tests that need full store and routing context
 */
export async function renderWithProviders<T extends Component, P extends object = object>(
  component: T,
  options: RenderWithProvidersOptions<P> = {}
): Promise<RenderResult<T>> {
  const {
    props,
    initialRoute = '/',
    routes = [],
    useDefaultRoutes = true,
    initialStoreState = {},
    mountingOptions = {}
  } = options

  // Create pinia instance
  const pinia = createPinia()
  setActivePinia(pinia)

  // Merge routes
  const allRoutes = useDefaultRoutes ? [...defaultRoutes, ...routes] : routes

  // Create router with memory history for testing
  const router = createRouter({
    history: createMemoryHistory(),
    routes: allRoutes
  })

  // Navigate to initial route
  router.push(initialRoute)
  await router.isReady()

  // Mount the component
  const wrapper = mount(component, {
    props: props as Record<string, unknown>,
    global: {
      plugins: [pinia, router],
      stubs: {
        // Add any global stubs here if needed
      },
      ...mountingOptions.global
    },
    ...mountingOptions
  }) as VueWrapper<InstanceType<T>>

  // Seed store state if provided
  if (initialStoreState.auth) {
    const { useAuthStore } = await import('@/stores/auth')
    const authStore = useAuthStore()
    Object.assign(authStore, initialStoreState.auth)
  }

  return { wrapper, router, pinia }
}

/**
 * Creates a Pinia instance for simple unit tests
 */
export function createTestPinia(): Pinia {
  const pinia = createPinia()
  setActivePinia(pinia)
  return pinia
}

/**
 * Creates a router for testing with optional routes
 */
export function createTestRouter(routes: RouteRecordRaw[] = defaultRoutes): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes
  })
}

/**
 * Waits for Vue to update the DOM
 */
export function flushPromises(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 0))
}
