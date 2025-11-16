import request from './request'
import notesIndex from '@/data/notes-index.json'

export const getNoteContent = async (topicId: string): Promise<string> => {
  const filename = (notesIndex as Record<string, string>)[topicId]
  if (!filename) {
    throw new Error(`note_not_found:${topicId}`)
  }
  const url = `/notes/${filename}`
  // 通过静态资源读取 Markdown 文本
  const res = await request.get(url, { responseType: 'text' })
  // axios 响应拦截器已返回 data，这里即为文本内容
  return res as unknown as string
}
