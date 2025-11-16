import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { focusTrap } from './directives/focus-trap'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.directive('focus-trap', focusTrap)

app.mount('#app')
