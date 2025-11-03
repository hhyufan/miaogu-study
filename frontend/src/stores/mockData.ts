import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PersistenceOptions } from 'pinia-plugin-persistedstate'

// 导入用户数据
import usersData from '@/data/users.json'

export interface MockUser {
  id: number
  username: string
  phone: string
  email: string
  password: string
  avatar: string
  createTime: string
}

export const useMockDataStore = defineStore(
  'mockData',
  () => {
    // 用户数据状态 - 从JSON文件初始化
    const users = ref<MockUser[]>(usersData)

    // 获取所有用户
    const getUsers = () => {
      return users.value
    }

    // 添加新用户
    const addUser = (userData: Omit<MockUser, 'id' | 'avatar' | 'createTime'>): MockUser => {
      const newUser: MockUser = {
        id: Math.max(...users.value.map((u) => u.id), 0) + 1,
        ...userData,
        avatar: '/favicon.ico',
        createTime:
          new Date().toISOString().split('T')[0] || new Date().toISOString().substring(0, 10),
      }
      users.value.push(newUser)
      return newUser
    }

    // 根据用户名、手机号或邮箱查找用户
    const findUser = (identifier: string): MockUser | undefined =>
      users.value.find(
        (u) => u.username === identifier || u.phone === identifier || u.email === identifier,
      )

    // 验证用户登录
    const validateUser = (username: string, password: string): MockUser | undefined =>
      users.value.find(
        (u) =>
          (u.username === username || u.phone === username || u.email === username) &&
          u.password === password,
      )

    // 检查用户是否已存在
    const userExists = (username: string, phone: string, email: string): MockUser | undefined =>
      users.value.find((u) => u.username === username || u.phone === phone || u.email === email)

    return {
      users,
      getUsers,
      addUser,
      findUser,
      validateUser,
      userExists,
    }
  },
  {
    persist: {
      key: 'mock-data-store',
      storage: localStorage,
      pick: ['users'],
    } as PersistenceOptions,
  },
)
