import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { PersistenceOptions } from 'pinia-plugin-persistedstate'
import type { User } from '@/types/user'

export const useUserStore = defineStore(
  'user',
  () => {
    // 状态
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)

    // 计算属性
    const isLoggedIn = computed(() => !!token.value)
    const userInfo = computed(() => user.value)

    // 登录
    const login = (userData: User & { token: string }) => {
      user.value = {
        id: userData.id,
        username: userData.username,
        phone: userData.phone,
        email: userData.email,
        avatar: userData.avatar,
      }
      token.value = userData.token
    }

    // 登出
    const logout = () => {
      user.value = null
      token.value = null
    }

    // 更新用户信息
    const updateUser = (userData: Partial<User>) => {
      if (user.value) {
        user.value = { ...user.value, ...userData }
      }
    }

    return {
      user,
      token,
      isLoggedIn,
      userInfo,
      login,
      logout,
      updateUser,
    }
  },
  {
    persist: {
      key: 'user-store',
      storage: localStorage,
      paths: ['user', 'token'],
    } as PersistenceOptions,
  },
)
