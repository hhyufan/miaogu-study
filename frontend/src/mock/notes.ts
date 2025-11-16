import Mock from 'mockjs'
import noteData from '@/data/note.json'

// 获取所有笔记
Mock.mock('/api/notes', 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: Object.values(noteData),
  }
})

// 根据用户获取笔记
Mock.mock(/\/api\/notes\/user\/\w+/, 'get', (options: any) => {
  const username = options.url.match(/\/api\/notes\/user\/(\w+)/)[1]
  const userNotes = Object.values(noteData).filter((note: any) => note.author === username)

  return {
    code: 200,
    message: 'success',
    data: userNotes,
  }
})

// 根据标签获取笔记
Mock.mock(/\/api\/notes\/tag\/.+/, 'get', (options: any) => {
  const tag = decodeURIComponent(options.url.match(/\/api\/notes\/tag\/(.+)/)[1])
  const taggedNotes = Object.values(noteData).filter((note: any) => note.tags.includes(tag))

  return {
    code: 200,
    message: 'success',
    data: taggedNotes,
  }
})

// 搜索用户（用于自动完成）
Mock.mock(/\/api\/notes\/search\/users\?query=.*/, 'get', (options: any) => {
  const url = new URL('http://localhost' + options.url)
  const query = url.searchParams.get('query') || ''

  const uniqueAuthors = [
    ...new Set(Object.values(noteData).map((note: any) => (note as { author: string }).author)),
  ]
  const matchingUsers = uniqueAuthors
    .filter((author) => author.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5) // 最多返回5个结果

  return {
    code: 200,
    message: 'success',
    data: matchingUsers,
  }
})

// 搜索标签（用于自动完成）
Mock.mock(/\/api\/notes\/search\/tags\?query=.*/, 'get', (options: any) => {
  const url = new URL('http://localhost' + options.url)
  const query = url.searchParams.get('query') || ''

  const allTags = [...new Set(Object.values(noteData).flatMap((note: any) => note.tags))]
  const matchingTags = allTags
    .filter((tag) => tag.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5) // 最多返回5个结果

  return {
    code: 200,
    message: 'success',
    data: matchingTags,
  }
})

export {}
