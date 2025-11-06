import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useMockDataStore } from '@/stores/mockData.ts'
import { useNotesStore } from '@/stores/notes.ts'
import noteData from '@/data/note.json'
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
      path: '/profile',
      name: 'profile',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: () => import('../views/NotFoundView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/:username/:noteId?',
      name: 'user-note',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true },
      // 验证用户名与笔记ID的有效性，不符合则跳到 404
      beforeEnter: (to) => {
        const mockStore = useMockDataStore()
        const notesStore = useNotesStore()
        const username = String(to.params.username || '').trim()
        const noteId = String(to.params.noteId || '').trim()

        // 检查用户名是否存在
        const user = mockStore.findUser(username)
        if (!user) {
          return { path: '/404' }
        }

        // 如果包含笔记ID，检查该用户是否拥有该笔记（静态或动态）
        if (noteId) {
          const hasStatic =
            !!(noteData as any)[noteId] && (noteData as any)[noteId].author === username
          const dyn = notesStore.notes[noteId]
          const hasDynamic = !!(dyn && dyn.username === username)
          if (!hasStatic && !hasDynamic) {
            return { path: '/404' }
          }
        }

        return true
      },
    },
    // 显式 404 页面，便于程序化跳转
    {
      path: '/404',
      name: '404',
      component: () => import('../views/NotFoundView.vue'),
      meta: { requiresAuth: false },
    },
    // 未匹配的路由兜底到 404 页面
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { requiresAuth: false },
    },
  ],
})

// 路由守卫
router.beforeEach((to, _, next) => {
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
