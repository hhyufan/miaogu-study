import request from './request'
import type { ApiResponse } from '@/types/api'

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

// 登录接口
export const login = (data: LoginRequest): Promise<ApiResponse> =>
  request({
    url: '/api/auth/login',
    method: 'post',
    data,
  })

// 注册接口
export const register = (data: RegisterRequest): Promise<ApiResponse> =>
  request({
    url: '/api/auth/register',
    method: 'post',
    data,
  })
