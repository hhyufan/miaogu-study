import request from './request'
import type {
  Chapter,
  FeedItem,
  RecentNote,
  PaginationParams,
  PaginatedResponse,
  SearchParams,
  Topic,
} from '@/types/home'
import type { ApiResponse } from '@/types/api'

/**
 * 获取章节数据
 * @returns Promise<Chapter[]>
 */
export const getChapters = async (): Promise<Chapter[]> => {
  const res = (await request({ url: '/api/home/chapters', method: 'get' })) as ApiResponse<Chapter[]>
  return res.data
}

/**
 * 搜索章节数据
 * @param params 搜索参数
 * @returns Promise<Chapter[]>
 */
export const searchChapters = async (params: SearchParams): Promise<Chapter[]> => {
  const res = (await request({ url: '/api/home/chapters/search', method: 'get', params })) as ApiResponse<Chapter[]>
  return res.data
}

/**
 * 获取学习动态数据
 * @returns Promise<FeedItem[]>
 */
export const getFeedData = async (): Promise<FeedItem[]> => {
  const res = (await request({ url: '/api/home/feed', method: 'get' })) as ApiResponse<FeedItem[]>
  return res.data
}

/**
 * 分页获取学习动态数据
 * @param params 分页参数
 * @returns Promise<PaginatedResponse<FeedItem>>
 */
export const getFeedDataPaginated = async (
  params: PaginationParams,
): Promise<PaginatedResponse<FeedItem>> => {
  const res = (await request({ url: '/api/home/feed', method: 'get', params })) as ApiResponse<PaginatedResponse<FeedItem>>
  return res.data
}

/**
 * 获取最新题目数据
 * @returns Promise<RecentNote[]>
 */
export const getRecentNotes = async (): Promise<RecentNote[]> => {
  const res = (await request({ url: '/api/home/recent-notes', method: 'get' })) as ApiResponse<RecentNote[]>
  return res.data
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
export const getTopicById = async (
  topicId: string,
): Promise<{ chapter: Chapter; topic: Topic } | null> => {
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