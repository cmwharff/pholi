import { createMemoryHistory, createRouter } from 'vue-router'

import login from './components/forms/login.vue'
import account from './components/Account.vue'
import forgotPass from './components/forms/forgot-password.vue'
import signUp from './components/forms/sign-up.vue'
import updatePass from './components/forms/update-password.vue'
import { supabase } from '@/lib/supabaseClient'

const routes = [
  {
    path: '/login',
    component: login,
    meta: { guestOnly: true },
    name: 'auth'
  },
  {
    path: '/sign-up',
    component: signUp,
    meta: { guestOnly: true }
  },
  {
    path: '/forgot-password',
    component: forgotPass,
    meta: { guestOnly: true }
  },
  {
    path: '/update-password',
    component: updatePass
  },
  {
    path: '/account',
    component: account,
    meta: { requiresAuth: true },
    name: 'account'
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

router.beforeEach(async (to) => {
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (to.meta.guestOnly === true && session) {
    return { name: 'account' }
  }

  if (to.meta.requiresAuth === true && !session) {
    return { name: 'auth' }
  }
})

export default router