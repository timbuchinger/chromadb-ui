import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { focusTrap } from './directives/focus-trap'
import './style.css'
import { clearExpiredItems } from './utils/secureStorage'

// Clear expired items from storage on app startup
clearExpiredItems().catch(console.error)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.directive('focus-trap', focusTrap)

app.mount('#app')
