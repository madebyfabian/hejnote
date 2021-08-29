import { createApp } from 'vue'
import App from './App.vue'

// Include Tailwind Stylings
import '@/assets/styles/tailwind.css'

const app = createApp(App)

// Import router and routes
import { routes } from './routes.js'
import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({ history: createWebHistory(), routes })
app.use(router)

// Focus-Trap
import { FocusTrap } from 'focus-trap-vue'
app.component('FocusTrap', FocusTrap)

// Masonry grid
import masonry from 'vue-next-masonry'
app.use(masonry)

app.mount('#app')
