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

// Navigation guard
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

// Update page title after each navigation
router.afterEach((to) => {
  document.title = to.meta.title as string || 'ChromaDB UI'
})

export default router
