import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import HomeView from '@/views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login',
      name: 'Login',
      component: LoginView,
      meta: { requiresAuth: false, guestOnly: true }
    },
    { path: '/dashboard',
      name: 'Dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    { path: '/',
      name: 'Home',
      component: HomeView,
      meta: { requiresAuth: false }
    },
  ],
})

let sessionChecked = false

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  if (!sessionChecked) {
    await authStore.fetchSession()
    sessionChecked = true
  }
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'Login' }
  }
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'Dashboard' }
  }
})

export default router
