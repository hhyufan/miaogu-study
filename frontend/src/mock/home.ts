import Mock from 'mockjs'

// 导入JSON数据
import chaptersData from '@/data/chapters.json'
import feedData from '@/data/feed-data.json'
import recentNotesData from '@/data/recent-quiz.json'
import type { Chapter, FeedItem, RecentNote } from '@/types/home'

// 类型已统一到 src/types/home.ts

// 从JSON文件获取数据
const mockChapters: Chapter[] = chaptersData as Chapter[]
const mockFeedData: FeedItem[] = feedData as FeedItem[]
const mockRecentNotes: RecentNote[] = recentNotesData as RecentNote[]

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