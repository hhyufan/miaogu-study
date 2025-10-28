import axios from 'axios'

// 创建 Axios 实例
const request = axios.create({
  baseURL: '',
  timeout: 5000, // 超时时间
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 可以在这里添加token等认证信息
    const token = localStorage.getItem('user-store')
    if (token) {
      try {
        const userStore = JSON.parse(token)
        if (userStore.token) {
          config.headers.Authorization = `Bearer ${userStore.token}`
        }
      } catch (error) {
        console.error('解析token失败:', error)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('请求失败：', error.message)
    return Promise.reject(error)
  },
)

export default request
