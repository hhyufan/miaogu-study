import Mock from 'mockjs'

// 导入JSON数据
import chaptersData from '@/data/chapters.json'
import feedData from '@/data/feed-data.json'
import recentNotesData from '@/data/recent-quiz.json'

// 章节数据类型定义
export interface Topic {
  id: string
  title: string
}

export interface Chapter {
  id: string
  title: string
  topics: Topic[]
}

// 学习动态数据类型定义
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

// 最新题目数据类型定义
export interface RecentNote {
  id: number
  title: string
  time: string
  preview: string
  tags: string[]
}

// 从JSON文件获取数据
const mockChapters: Chapter[] = chaptersData
const mockFeedData: FeedItem[] = feedData
const mockRecentNotes: RecentNote[] = recentNotesData

// 设置Mock接口
Mock.mock('/api/home/chapters', 'get', {
  code: 200,
  message: 'success',
  data: mockChapters
})

Mock.mock('/api/home/feed', 'get', {
  code: 200,
  message: 'success',
  data: mockFeedData
})

Mock.mock('/api/home/recent-notes', 'get', {
  code: 200,
  message: 'success',
  data: mockRecentNotes
})

// 支持分页的feed数据接口
Mock.mock(/\/api\/home\/feed\?page=\d+&size=\d+/, 'get', (options: any) => {
  const url = new URL('http://localhost' + options.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const size = parseInt(url.searchParams.get('size') || '10')

  const start = (page - 1) * size
  const end = start + size
  const paginatedData = mockFeedData.slice(start, end)

  return {
    code: 200,
    message: 'success',
    data: {
      items: paginatedData,
      total: mockFeedData.length,
      page,
      size,
      totalPages: Math.ceil(mockFeedData.length / size)
    }
  }
})

// 支持搜索的章节接口
Mock.mock(/\/api\/home\/chapters\/search\?keyword=.*/, 'get', (options: any) => {
  const url = new URL('http://localhost' + options.url)
  const keyword = url.searchParams.get('keyword') || ''

  const filteredChapters = mockChapters.map(chapter => ({
    ...chapter,
    topics: chapter.topics.filter(topic =>
      topic.title.toLowerCase().includes(keyword.toLowerCase()) ||
      chapter.title.toLowerCase().includes(keyword.toLowerCase())
    )
  })).filter(chapter => chapter.topics.length > 0)

  return {
    code: 200,
    message: 'success',
    data: filteredChapters
  }
})

export { mockChapters, mockFeedData, mockRecentNotes }
