import { createMemoryHistory, createRouter } from 'vue-router'

import login from './components/forms/login.vue'
import account from './components/Account.vue'
import forgotPass from './components/forms/forgot-password.vue'

const routes = [
  { path: '/account', component: account },
  { path: '/forgot-password', component: forgotPass },
  { path: '/', component: login }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router