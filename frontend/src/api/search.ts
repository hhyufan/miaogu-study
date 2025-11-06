import request from './request'
import type { ApiResponse } from '@/types/api'
import type {
  NoteSearchRequest,
  NoteSearchResult,
  NoteSuggestion,
  NoteSuggestionRequest,
  UserSuggestion,
} from '@/types/search'

export const getUserSuggestions = (params: {
  keyword: string
}): Promise<ApiResponse<UserSuggestion[]>> =>
  request({
    url: '/api/search/users',
    method: 'get',
    params,
  })

export const findNoteByUserAndTags = (
  data: NoteSearchRequest,
): Promise<ApiResponse<NoteSearchResult | null>> =>
  request({
    url: '/api/search/notes',
    method: 'post',
    data,
  })

export const getNoteSuggestions = (
  params: NoteSuggestionRequest,
): Promise<ApiResponse<NoteSuggestion[]>> =>
  request({
    url: '/api/search/note_suggestions',
    method: 'get',
    params,
  })

export default {
  getUserSuggestions,
  findNoteByUserAndTags,
  getNoteSuggestions,
}
