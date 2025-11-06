import Mock from 'mockjs'
import { useMockDataStore } from '@/stores/mockData'

// 获取mock数据store实例
const getMockStore = () => {
  return useMockDataStore()
}

// 登录接口
Mock.mock('/api/auth/login', 'post', (options: { body: string }) => {
  const { username, password } = JSON.parse(options.body)

  // 获取mock数据store
  const mockStore = getMockStore()

  // 验证用户
  const user = mockStore.validateUser(username, password)

  if (user) {
    const token = Mock.Random.string('upper', 32)
    return {
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          email: user.email,
          avatar: user.avatar,
        },
      },
    }
  } else {
    return {
      code: 401,
      message: '用户名或密码错误',
      data: null,
    }
  }
})

// 注册接口
Mock.mock('/api/auth/register', 'post', (options: { body: string }) => {
  const { username, email, password } = JSON.parse(options.body)

  // 获取mock数据store
  const mockStore = getMockStore()

  // 检查用户是否已存在
  const existUser = mockStore.userExists(username, '', email)

  if (existUser) {
    return {
      code: 400,
      message: '用户名或邮箱已存在',
      data: null,
    }
  }

  // 创建新用户
  const newUser = mockStore.addUser({
    username,
    phone: '',
    email,
    password,
  })

  // 生成token
  const token = `token_${newUser.id}_${Date.now()}`

  return {
    code: 200,
    message: '注册成功',
    data: {
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        phone: newUser.phone,
        email: newUser.email,
        avatar: newUser.avatar,
      },
    },
  }
})

// 获取用户信息接口
Mock.mock('/api/auth/userinfo', 'get', (options: { headers?: { Authorization?: string } }) => {
  // 从请求头获取token（实际项目中会验证token）
  const token = options.headers?.Authorization?.replace('Bearer ', '')

  if (!token) {
    return {
      code: 401,
      message: '未授权',
      data: null,
    }
  }

  // 获取mock数据store
  const mockStore = getMockStore()
  const users = mockStore.getUsers()

  // 模拟返回用户信息
  return {
    code: 200,
    message: '获取成功',
    data: {
      user: users[0], // 简化处理，返回第一个用户
    },
  }
})

// 刷新token接口
Mock.mock('/api/auth/refresh', 'post', () => {
  const newToken = Mock.Random.string('upper', 32)
  return {
    code: 200,
    message: '刷新成功',
    data: {
      token: newToken,
    },
  }
})

// 修改密码接口
// eslint-disable-next-line @typescript-eslint/no-unused-vars
Mock.mock('/api/auth/change-password', 'post', (_/*options*/: { body: string }) => {
  // const { oldPassword, newPassword } = JSON.parse(options.body)

  // 简化处理，直接返回成功
  return {
    code: 200,
    message: '密码修改成功',
    data: null,
  }
})

export {}
