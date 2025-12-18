import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import App from './App.vue'
import { routes } from './router/routes'
import { hydrateAuth, isAuthed } from './state/auth'

import './style.css'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to) => {
  hydrateAuth()
  const requiresAuth = Boolean(to.meta?.requiresAuth)
  if (!requiresAuth) return true
  if (isAuthed.value) return true
  return { path: '/auth', query: { redirect: to.fullPath } }
})

createApp(App).use(router).mount('#app')
