import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import { clearExpiredItems } from './utils/secureStorage'

// Clear expired items from storage on app startup
clearExpiredItems().catch(console.error)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
