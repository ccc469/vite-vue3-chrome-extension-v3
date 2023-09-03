import '../../assets/base.scss'
import './index.scss'

import { createApp } from 'vue'

import { createRouter, createWebHashHistory } from 'vue-router'
import routes from '~pages'

import App from './App.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  if (to.path === '/') return '/element-selector'
})

createApp(App).use(router).mount('#app')
