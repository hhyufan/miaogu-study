import request from './request'
import type { Chapter, FeedItem, RecentNote } from '@/mock/home'

// API响应类型定义
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 分页响应类型定义
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  totalPages: number
}

// 分页参数类型定义
export interface PaginationParams {
  page?: number
  size?: number
}

// 搜索参数类型定义
export interface SearchParams {
  keyword: string
}

/**
 * 获取章节数据
 * @returns Promise<Chapter[]>
 */
export const getChapters = (): Promise<Chapter[]> => {
  return request.get('/api/home/chapters').then((res: any) => {
    const apiResponse = res as ApiResponse<Chapter[]>
    return apiResponse.data
  })
}

/**
 * 搜索章节数据
 * @param params 搜索参数
 * @returns Promise<Chapter[]>
 */
export const searchChapters = (params: SearchParams): Promise<Chapter[]> => {
  return request.get('/api/home/chapters/search', { params }).then((res: any) => {
    const apiResponse = res as ApiResponse<Chapter[]>
    return apiResponse.data
  })
}

/**
 * 获取学习动态数据
 * @returns Promise<FeedItem[]>
 */
export const getFeedData = (): Promise<FeedItem[]> => {
  return request.get('/api/home/feed').then((res: any) => {
    const apiResponse = res as ApiResponse<FeedItem[]>
    return apiResponse.data
  })
}

/**
 * 分页获取学习动态数据
 * @param params 分页参数
 * @returns Promise<PaginatedResponse<FeedItem>>
 */
export const getFeedDataPaginated = (params: PaginationParams): Promise<PaginatedResponse<FeedItem>> => {
  return request.get('/api/home/feed', { params }).then((res: any) => {
    const apiResponse = res as ApiResponse<PaginatedResponse<FeedItem>>
    return apiResponse.data
  })
}

/**
 * 获取最新题目数据
 * @returns Promise<RecentNote[]>
 */
export const getRecentNotes = (): Promise<RecentNote[]> => {
  return request.get('/api/home/recent-notes').then((res: any) => {
    const apiResponse = res as ApiResponse<RecentNote[]>
    return apiResponse.data
  })
}

/**
 * 获取特定章节的详细信息
 * @param chapterId 章节ID
 * @returns Promise<Chapter | null>
 */
export const getChapterById = async (chapterId: string): Promise<Chapter | null> => {
  const chapters = await getChapters()
  return chapters.find(chapter => chapter.id === chapterId) || null
}

/**
 * 获取特定主题的详细信息
 * @param topicId 主题ID
 * @returns Promise<{chapter: Chapter, topic: Topic} | null>
 */
export const getTopicById = async (topicId: string): Promise<{chapter: Chapter, topic: any} | null> => {
  const chapters = await getChapters()
  for (const chapter of chapters) {
    const topic = chapter.topics.find(t => t.id === topicId)
    if (topic) {
      return { chapter, topic }
    }
  }
  return null
}

/**
 * 获取用户的学习统计数据
 * @returns Promise<{totalNotes: number, totalChapters: number, recentActivity: number}>
 */
export const getLearningStats = async (): Promise<{totalNotes: number, totalChapters: number, recentActivity: number}> => {
  const [chapters, feedData] = await Promise.all([
    getChapters(),
    getFeedData()
  ])
  
  const totalNotes = chapters.reduce((sum, chapter) => sum + chapter.topics.length, 0)
  const totalChapters = chapters.length
  const recentActivity = feedData.length
  
  return {
    totalNotes,
    totalChapters,
    recentActivity
  }
}

// 导出所有API函数
export default {
  getChapters,
  searchChapters,
  getFeedData,
  getFeedDataPaginated,
  getRecentNotes,
  getChapterById,
  getTopicById,
  getLearningStats
}