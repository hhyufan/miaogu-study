import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 如果路由需要认证且用户未登录
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/auth')
  }
  // 如果用户已登录且访问auth页面，重定向到首页
  else if (to.name === 'auth' && userStore.isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
