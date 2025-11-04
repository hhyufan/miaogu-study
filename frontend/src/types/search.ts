export interface UserSuggestion {
  username: string
}

export interface NoteSearchRequest {
  user?: string
  tags: string[]
}

export interface NoteSearchResult {
  username: string
  noteId: string
}

export interface NoteSuggestionRequest {
  user?: string
  tags?: string[]
  keyword?: string
}

export interface NoteSuggestion {
  username: string
  noteId: string
  title: string
}