import Mock from 'mockjs'

// 导入JSON数据
import chaptersData from '@/data/chapters.json'
import feedData from '@/data/feed-data.json'
import recentNotesData from '@/data/recent-quiz.json'

// 设置Mock接口 - 根据用户返回不同的章节数据
Mock.mock('/api/home/chapters', 'get', (options: any) => {
  // 从请求中获取用户名参数（如果有）
  const url = new URL('http://localhost' + options.url)
  const username = url.searchParams.get('username') || 'admin' // 默认为admin用户

  // 根据用户名返回对应的章节数据
  const userChapters =
    (chaptersData as any).userChapters[username] || (chaptersData as any).defaultChapters

  return {
    code: 200,
    message: 'success',
    data: userChapters,
  }
})

Mock.mock('/api/home/feed', 'get', {
  code: 200,
  message: 'success',
  data: feedData,
})

Mock.mock('/api/home/recent-notes', 'get', {
  code: 200,
  message: 'success',
  data: recentNotesData,
})

// 支持分页的feed数据接口
Mock.mock(/\/api\/home\/feed\?page=\d+&size=\d+/, 'get', (options: any) => {
  const url = new URL('http://localhost' + options.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const size = parseInt(url.searchParams.get('size') || '10')

  const start = (page - 1) * size
  const end = start + size
  const paginatedData = feedData.slice(start, end)

  return {
    code: 200,
    message: 'success',
    data: {
      items: paginatedData,
      total: feedData.length,
      page,
      size,
      totalPages: Math.ceil(feedData.length / size),
    },
  }
})

// 支持搜索的章节接口
Mock.mock(/\/api\/home\/chapters\/search\?keyword=.*/, 'get', (options: any) => {
  const url = new URL('http://localhost' + options.url)
  const keyword = url.searchParams.get('keyword') || ''

  const allChapters = (chaptersData as any).defaultChapters || []
  const filteredChapters = allChapters
    .map((chapter: any) => ({
      ...chapter,
      topics: chapter.topics.filter(
        (topic: any) =>
          topic.title.toLowerCase().includes(keyword.toLowerCase()) ||
          chapter.title.toLowerCase().includes(keyword.toLowerCase()),
      ),
    }))
    .filter((chapter: any) => chapter.topics.length > 0)

  return {
    code: 200,
    message: 'success',
    data: filteredChapters,
  }
})

export { chaptersData, feedData, recentNotesData }
