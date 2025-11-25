import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/LoginScreen.vue'),
      meta: { title: 'ChromaDB UI - Login' }
    },
    {
      path: '/',
      name: 'collections',
      component: () => import('../components/CollectionsScreen.vue'),
      meta: {
        requiresAuth: true,
        title: 'ChromaDB UI - Collections'
      }
    },
    {
      path: '/collection/:name',
      name: 'collection',
      component: () => import('../components/CollectionScreen.vue'),
      meta: {
        requiresAuth: true,
        title: 'ChromaDB UI - Collection'
      }
    }
  ]
})

// Flag to track if session restoration has been attempted
let sessionRestored = false

// Navigation guard
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // Attempt to restore session on first navigation
  if (!sessionRestored) {
    sessionRestored = true
    await authStore.restoreSession()
  }

  // Store last route for authenticated users
  if (authStore.isAuthenticated && to.meta.requiresAuth && to.path !== '/login') {
    authStore.setLastRoute(to.fullPath)
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    // Redirect to last route or home if already authenticated
    const lastRoute = authStore.getLastRoute()
    next(lastRoute && lastRoute !== '/login' ? lastRoute : '/')
  } else {
    next()
  }
})

// Update page title after each navigation
router.afterEach((to) => {
  document.title = to.meta.title as string || 'ChromaDB UI'
})

export default router
