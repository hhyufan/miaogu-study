import request from './request'
import type {
  Chapter,
  FeedItem,
  PaginatedResponse,
  PaginationParams,
  RecentNote,
  SearchParams,
  Topic
} from '@/types/home'
import type { ApiResponse } from '@/types/api'

/**
 * 获取章节数据
 * @returns Promise<ApiResponse<Chapter[]>>
 */
export const getChapters = async (): Promise<ApiResponse<Chapter[]>> =>
  request({
    url: '/api/home/chapters',
    method: 'get',
  })

/**
 * 搜索章节数据
 * @param params 搜索参数
 * @returns Promise<ApiResponse<Chapter[]>>
 */
export const searchChapters = async (params: SearchParams): Promise<ApiResponse<Chapter[]>> =>
  request({
    url: '/api/home/chapters/search',
    method: 'get',
    params,
  })

/**
 * 获取学习动态数据
 * @returns Promise<ApiResponse<FeedItem[]>>
 */
export const getFeedData = async (): Promise<ApiResponse<FeedItem[]>> =>
  request({
    url: '/api/home/feed',
    method: 'get',
  })

/**
 * 分页获取学习动态数据
 * @param params 分页参数
 * @returns Promise<ApiResponse<PaginatedResponse<FeedItem>>>
 */
export const getFeedDataPaginated = async (
  params: PaginationParams,
): Promise<ApiResponse<PaginatedResponse<FeedItem>>> =>
  request({
    url: '/api/home/feed',
    method: 'get',
    params,
  })

/**
 * 获取最新题目数据
 * @returns Promise<ApiResponse<RecentNote[]>>
 */
export const getRecentNotes = async (): Promise<ApiResponse<RecentNote[]>> =>
  request({
    url: '/api/home/recent-notes',
    method: 'get',
  })

/**
 * 获取特定章节的详细信息
 * @param chapterId 章节ID
 * @returns Promise<Chapter | null>
 */
export const getChapterById = async (chapterId: string): Promise<Chapter | null> => {
  const chaptersRes = await getChapters()
  const chapters = chaptersRes.data
  return chapters.find((chapter) => chapter.id === chapterId) || null
}

/**
 * 获取特定主题的详细信息
 * @param topicId 主题ID
 * @returns Promise<{chapter: Chapter, topic: Topic} | null>
 */
export const getTopicById = async (
  topicId: string,
): Promise<{ chapter: Chapter; topic: Topic } | null> => {
  const chaptersRes = await getChapters()
  for (const chapter of chaptersRes.data) {
    const topic = chapter.topics.find((t) => t.id === topicId)
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
export const getLearningStats = async (): Promise<{
  totalNotes: number
  totalChapters: number
  recentActivity: number
}> => {
  const [chaptersRes, feedRes] = await Promise.all([getChapters(), getFeedData()])

  const chapters = chaptersRes.data
  const feedData = feedRes.data

  const totalNotes = chapters.reduce((sum, chapter) => sum + chapter.topics.length, 0)
  const totalChapters = chapters.length
  const recentActivity = feedData.length

  return {
    totalNotes,
    totalChapters,
    recentActivity,
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
  getLearningStats,
}
