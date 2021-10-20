import { createApp } from 'vue'
import App from './App.vue'

// Include Tailwind Stylings
import '@/assets/styles/tailwind.css'

const app = createApp(App)

// Import router and routes
import { routes } from './routes.js'
import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({ history: createWebHistory(), routes })

// Router beforeEach
import routeBeforeEach from '@/utils/routeBeforeEach'
router.beforeEach(routeBeforeEach)

app.use(router)

// Masonry grid
import masonry from 'vue-next-masonry'
app.use(masonry)

// Click Outside Directive
import vClickOutside from 'click-outside-vue3'
app.use(vClickOutside)

import BodyScrollLock from '@/plugins/bodyScrollLock'
app.use(BodyScrollLock)

app.mount('#app')
