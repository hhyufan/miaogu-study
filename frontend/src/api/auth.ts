import request from './request'

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
  agree: boolean
}

// ApiResponse<T> 已统一在 src/types/api.ts 定义，如需使用请从 '@/types/api' 引入

// 登录接口
export const login = (data: LoginRequest) =>
  request({
    url: '/api/auth/login',
    method: 'post',
    data,
  })

// 注册接口
export const register = (data: RegisterRequest) =>
  request({
    url: '/api/auth/register',
    method: 'post',
    data,
  })

// 获取用户信息接口
export const getUserInfo = () =>
  request({
    url: '/api/auth/userinfo',
    method: 'get',
  })

// 刷新token接口
export const refreshToken = () =>
  request({
    url: '/api/auth/refresh',
    method: 'post',
  })

// 修改密码接口
export const changePassword = (data: { oldPassword: string; newPassword: string }) =>
  request({
    url: '/api/auth/change-password',
    method: 'post',
    data,
  })
