import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PersistenceOptions } from 'pinia-plugin-persistedstate'

export interface DynamicNote {
  id: string
  name: string
  filename?: string
  content: string
  createTime: string
  group: string
  tags?: string[]
  username: string
}

export const useNotesStore = defineStore(
  'notes',
  () => {
    const notes = ref<Record<string, DynamicNote>>({})
    // 每个用户的分组列表
    const userGroups = ref<Record<string, string[]>>({})

    const ensureUserGroup = (username: string, groupName: string) => {
      const key = username || 'default'
      const name = groupName?.trim()
      if (!name) return
      const groups = userGroups.value[key] || []
      if (!groups.includes(name)) {
        userGroups.value[key] = [...groups, name]
      }
    }

    const addNote = (payload: {
      id?: string
      name: string
      content: string
      filename?: string
      group: string
      tags?: string[]
      username: string
    }) => {
      const generatedId = payload.id?.trim() || `note_custom_${Date.now()}`
      const item: DynamicNote = {
        id: generatedId,
        name: payload.name.trim(),
        filename: payload.filename,
        content: payload.content,
        createTime: new Date().toISOString(),
        group: payload.group?.trim() || '未分组',
        tags: payload.tags || [],
        username: payload.username,
      }
      notes.value[generatedId] = item
      // 确保分组被记录
      ensureUserGroup(payload.username, item.group)
      return generatedId
    }

    const removeNote = (id: string) => {
      delete notes.value[id]
    }

    const getNoteContentById = (id: string) => {
      return notes.value[id]?.content || null
    }

    const listNotes = () => Object.values(notes.value)

    const listNotesByUser = (username: string) =>
      Object.values(notes.value).filter((n) => n.username === username)

    const addGroup = (username: string, groupName: string) => {
      ensureUserGroup(username, groupName)
    }

    const listGroups = (username: string) => {
      const key = username || 'default'
      const explicit = userGroups.value[key] || []
      const fromNotes = listNotesByUser(username)
        .map((n) => n.group?.trim())
        .filter((g) => !!g) as string[]
      const set = new Set<string>([...explicit, ...fromNotes])
      return Array.from(set)
    }

    const listTags = (username: string) => {
      const fromNotes = listNotesByUser(username)
        .flatMap((n) => n.tags || [])
        .filter((t) => !!t)
      return Array.from(new Set(fromNotes))
    }

    return {
      notes,
      userGroups,
      addNote,
      removeNote,
      getNoteContentById,
      listNotes,
      listNotesByUser,
      addGroup,
      listGroups,
      listTags,
    }
  },
  {
    persist: {
      key: 'notes-store',
      storage: localStorage,
      paths: ['notes', 'userGroups'],
    } as PersistenceOptions,
  },
)
