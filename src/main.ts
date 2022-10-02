import { createApp } from 'vue'
import App from './App.vue'

// Include Tailwind Stylings
import '@/assets/styles/tailwind.css'

const app = createApp(App)

// Import router and routes
import { routes } from '@/router/routes'
import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({ history: createWebHistory(), routes })

// Router beforeEach
import routeBeforeEach from '@/router/routeBeforeEach'
router.beforeEach(routeBeforeEach)

app.use(router)

// Click Outside Directive
import vClickOutside from 'click-outside-vue3'
app.use(vClickOutside)

import BodyScrollLock from '@/plugins/BodyScrollLock'
app.use(BodyScrollLock)

app.mount('#app')
