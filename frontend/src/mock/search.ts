import Mock from 'mockjs'
import { useMockDataStore } from '@/stores/mockData'
import noteData from '@/data/note.json'

// 获取用户建议：根据关键字模糊匹配用户名
Mock.mock(/\/api\/search\/users\?keyword=.*/, 'get', (options: any) => {
  const url = new URL('http://localhost' + options.url)
  const keyword = (url.searchParams.get('keyword') || '').toLowerCase()

  const store = useMockDataStore()
  const allUsers = store.getUsers()
  const matched = allUsers
    .filter((u) => u.username.toLowerCase().includes(keyword))
    .map((u) => ({ username: u.username }))

  return {
    code: 200,
    message: 'success',
    data: matched,
  }
})

// 根据 user 和 tags 查找唯一笔记 ID
Mock.mock('/api/search/notes', 'post', (options: { body: string }) => {
  const body = JSON.parse(options.body || '{}') as { user?: string; tags?: string[] }
  const user = (body.user || 'admin').toLowerCase()
  const tags = Array.isArray(body.tags) ? body.tags.map((t) => String(t).toLowerCase()) : []

  const notes = Object.values(noteData as Record<string, any>)

  const byUser = notes.filter((n) => String(n.author || '').toLowerCase() === user)
  const byTags = tags.length
    ? byUser.filter((n) => Array.isArray(n.tags) && tags.every((t) => n.tags.map((x: string) => x.toLowerCase()).includes(t)))
    : byUser

  if (byTags.length === 1) {
    return {
      code: 200,
      message: 'success',
      data: {
        username: user,
        noteId: byTags[0].id,
      },
    }
  }

  // 未找到或不唯一
  return {
    code: 404,
    message: byTags.length === 0 ? 'not_found' : 'not_unique',
    data: null,
  }
})

export default Mock

// 笔记建议：根据 user、tags、keyword 返回匹配的笔记列表
Mock.mock(/\/api\/search\/note_suggestions.*/, 'get', (options: any) => {
  const url = new URL('http://localhost' + options.url)
  const user = (url.searchParams.get('user') || '').toLowerCase()
  const keyword = (url.searchParams.get('keyword') || '').toLowerCase()
  // 支持 tags=tag1&tags=tag2 或 tags=tag1,tag2 两种形式
  let tags = url.searchParams.getAll('tags')
  if (tags.length === 0) {
    const tagStr = url.searchParams.get('tags') || ''
    tags = tagStr ? tagStr.split(',') : []
  }
  tags = tags.map((t) => t.toLowerCase()).filter(Boolean)

  const notes = Object.values(noteData as Record<string, any>)

  // 过滤作者
  const byUser = user ? notes.filter((n) => String(n.author || '').toLowerCase() === user) : notes
  // 过滤标签
  const byTags = tags.length
    ? byUser.filter((n) => Array.isArray(n.tags) && tags.every((t) => n.tags.map((x: string) => x.toLowerCase()).includes(t)))
    : byUser
  // 过滤关键字（标题或描述或标签）
  const byKeyword = keyword
    ? byTags.filter((n) => {
        const title = String(n.title || '').toLowerCase()
        const desc = String(n.description || '').toLowerCase()
        const tagStr = Array.isArray(n.tags) ? n.tags.join(',').toLowerCase() : ''
        const idStr = String(n.id || '').toLowerCase()
        return title.includes(keyword) || desc.includes(keyword) || tagStr.includes(keyword) || idStr.includes(keyword)
      })
    : byTags

  const suggestions = byKeyword.slice(0, 10).map((n) => ({
    username: String(n.author || ''),
    noteId: String(n.id || ''),
    title: String(n.title || '').replace('.md', ''),
  }))

  return {
    code: 200,
    message: 'success',
    data: suggestions,
  }
})