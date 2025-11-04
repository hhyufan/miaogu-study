// Home 模块相关类型，供 API 与 Mock 共同引用

export interface Topic {
  id: string
  title: string
}

export interface Chapter {
  id: string
  title: string
  topics: Topic[]
}

export interface FeedStat {
  icon: string
  text: string
  type: string
}

export interface FeedItem {
  id: number
  username: string
  action: string
  time: string
  timeValue?: number
  avatar: string
  title: string
  description: string
  tags: string[]
  stats: FeedStat[]
}

export interface RecentNote {
  id: number
  title: string
  time: string
  preview: string
  tags: string[]
}

// 分页类型
export interface PaginationParams {
  page?: number
  size?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  totalPages: number
}

export interface SearchParams {
  keyword: string
}