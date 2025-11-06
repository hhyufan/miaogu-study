// 用户相关的统一类型，供 store、API、Mock 等共同引用

export interface User {
  id: number
  username: string
  password?: string
  phone?: string
  email: string
  avatar?: string
  createTime?: string
}

export interface UserState {
  user: User | null
  token: string | null
}
