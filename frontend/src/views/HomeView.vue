<template>
  <!-- 主要内容区域 -->
  <main class="main-container">
    <!-- 左侧边栏 - 我的笔记 -->
    <aside class="left-sidebar">
      <div class="sidebar-header">
        <h2>{{ sidebarTitle }}</h2>
        <el-button class="new-btn" type="primary" @click="startNewNote">
          <IconPlus class="app-icon app-icon--sm app-icon--white app-icon--mr" />
          {{ t('home.newNote') }}
        </el-button>
      </div>

      <div class="search-section">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input v-model="searchQuery" :placeholder="t('home.searchNotes')" type="text" />
        </div>
      </div>

      <!-- 树状图导航 -->
      <TreeNavigation
        :chapters="chapters"
        :default-expanded="expandedChapters"
        :selected-topic="selectedTopic"
        @topic-select="handleTopicSelect"
        @chapter-toggle="handleChapterToggle"
      />
    </aside>

    <!-- 中间内容区域 -->
    <section class="main-content">
      <!-- 动态内容 -->
      <div v-show="!showMarkdown && !showNewNote" class="content-header">
        <h2>{{ t('home.learningActivity') }}</h2>
        <el-button-group class="filter-buttons">
          <el-button
            :type="activeFilter === 'all' ? 'primary' : 'default'"
            @click="setFilter('all')"
            >{{ t('home.filters.all') }}</el-button
          >
          <el-button
            :type="activeFilter === 'latest' ? 'primary' : 'default'"
            @click="setFilter('latest')"
            >{{ t('home.filters.latest') }}</el-button
          >
          <el-button
            :type="activeFilter === 'notes' ? 'primary' : 'default'"
            @click="setFilter('notes')"
            >{{ t('home.filters.notes') }}</el-button
          >
        </el-button-group>
      </div>

      <!-- Markdown 主体内容 -->
      <div v-if="showMarkdown" class="markdown-content-container">
        <MarkdownViewer :content="selectedNoteContent" :file-name="selectedFileName" />
      </div>

      <!-- 新建笔记主区域（替换学习动态） -->
      <div v-if="!showMarkdown && showNewNote" class="markdown-content-container">
        <NewNoteViewer @note-created="handleNoteCreated" />
      </div>

      <div v-show="!showMarkdown && !showNewNote" v-loading="loading" class="feed">
        <div v-if="!loading && filteredFeed.length === 0" class="empty-state">
          <p>{{ t('home.noData') }}</p>
        </div>
        <div class="feed-list">
          <div v-for="item in filteredFeed" :key="item.id" class="feed-item">
            <div class="feed-header-info">
              <img :src="item.avatar" alt="用户头像" class="user-avatar" />
              <div class="user-details">
                <div class="first-line">
                  <span class="username">{{ item.username }}</span>
                  <span class="action">{{ t(`home.actions.${item.action}`) }}</span>
                </div>
                <span class="time">{{ getTimeText(item) }}</span>
              </div>
            </div>
            <div class="feed-content">
              <div class="content-title">
                <h4>{{ item.title }}</h4>
              </div>
              <div class="content-description">
                <p>{{ item.description }}</p>
                <div class="content-tags">
                  <el-tag v-for="tag in item.tags" :key="tag" size="small" type="primary">{{
                    tag
                  }}</el-tag>
                </div>
                <div class="feed-stats">
                  <span v-for="stat in item.stats" :key="stat.icon">
                    <i :class="stat.icon"></i> {{ getStatText(stat) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 右侧边栏 -->
    <aside v-show="!showMarkdown && !showNewNote" class="right-sidebar">
      <div class="sidebar-header">
        <h2>{{ t('home.latestQuestions') }}</h2>
      </div>
      <div class="notes-list">
        <div v-for="note in recentNotes" :key="note.id" class="note-item">
          <div class="note-header">
            <h4>{{ note.title }}</h4>
            <span class="note-time">{{ note.time }}</span>
          </div>
          <p class="note-preview">{{ note.preview }}</p>
          <div class="note-tags">
            <el-tag v-for="tag in note.tags" :key="tag" size="small" type="info">{{ tag }}</el-tag>
          </div>
        </div>
      </div>
    </aside>
  </main>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useMockDataStore } from '@/stores/mockData.ts'
import { ElButton, ElButtonGroup, ElMessage } from 'element-plus'
import TreeNavigation from '@/components/TreeNavigation.vue'
import { getFeedData, getRecentNotes } from '@/api/home'
import { getNoteContent } from '@/api/notes'
import noteData from '@/data/note.json'
import MarkdownViewer from '@/components/MarkdownViewer.vue'
import NewNoteViewer from '@/components/NewNoteViewer.vue'
import { useNotesStore } from '@/stores/notes.ts'
import type { Chapter, FeedItem, RecentNote } from '@/types/home'
// 导入章节数据
import chaptersData from '@/data/chapters.json'
import { IconPlus } from '@/components/icons'
// 使用主题store和i18n
useThemeStore()
const { t } = useI18n()
const userStore = useUserStore()
const mockDataStore = useMockDataStore()
const notesStore = useNotesStore()

// 使用路由
const router = useRouter()
const route = useRoute()

// 获取当前用户名
const getCurrentUsername = () => {
  // 从用户存储获取当前用户名
  return userStore.userInfo?.username || 'miaogu'
}

// 计算属性：左侧栏标题
const sidebarTitle = computed(() => {
  const routeUsername = route.params.username as string
  const currentUsername = getCurrentUsername()

  // 如果没有路由参数中的用户名，显示当前用户的笔记
  if (!routeUsername) {
    return t('home.myNotes')
  }

  // 如果访问的是当前用户的笔记
  if (routeUsername === currentUsername) {
    return t('home.myNotes')
  }

  // 访问其他用户的笔记
  return t('home.userNotes', { username: routeUsername })
})

// 验证用户名是否有效（使用本地 mock 数据）
const isValidUsername = (username: string): boolean => {
  return !!mockDataStore.findUser(username)
}

// 获取用户拥有的笔记列表
const getUserNotes = (username: string): string[] => {
  const userNotes: string[] = []
  for (const [noteId, noteInfo] of Object.entries(noteData)) {
    if (noteInfo.author === username) {
      userNotes.push(noteId)
    }
  }
  return userNotes
}

// 检查用户是否拥有指定笔记（包含动态笔记）
const userHasNote = (username: string, noteId: string): boolean => {
  const hasStatic = getUserNotes(username).includes(noteId)
  const dyn = notesStore.notes[noteId]
  const hasDynamic = !!(dyn && dyn.username === username)
  return hasStatic || hasDynamic
}

// 搜索查询
const searchQuery = ref('')

// 展开的章节
const expandedChapters = ref<string[]>([])

// 选中的主题
const selectedTopic = ref<string>('')

// Markdown 显示与内容
const showMarkdown = ref(false)
const selectedNoteContent = ref('')
const selectedFileName = ref('')
// 新建笔记视图开关
const showNewNote = ref(false)

// 当前激活的过滤器
const activeFilter = ref('all')

// 加载状态
const loading = ref(false)

// 章节数据
const chapters = ref<Chapter[]>([])

// 学习动态数据
const feedData = ref<FeedItem[]>([])

// 最新题目数据
const recentNotes = ref<RecentNote[]>([])

// 根据用户动态生成章节结构（与持久化分组一致地合并）
const generateUserChapters = (username: string) => {
  const userChapters = (chaptersData as any).userChapters[username]
  const staticChapters: Chapter[] = userChapters || (chaptersData as any).defaultChapters || []

  // 1) 先将预设分组写入持久化分组列表，确保初始状态一致
  staticChapters.forEach((c) => {
    notesStore.addGroup(username, String(c.title || '').trim())
  })

  const titleKey = (s: string) =>
    String(s || '')
      .trim()
      .toLowerCase()
  const slugify = (s: string) =>
    s
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')

  // 2) 构建静态分组映射，便于向已有分组追加动态笔记
  const byTitle: Record<string, Chapter> = {}
  staticChapters.forEach((c) => {
    byTitle[titleKey(c.title)] = {
      id: c.id,
      title: c.title,
      topics: Array.isArray(c.topics) ? [...c.topics] : [],
    }
  })

  // 3) 遍历动态笔记，如果分组已存在于静态分组，则追加到该分组；否则记录为新增分组
  const dynamicNotes = notesStore.listNotesByUser(username)
  const newGroups: Record<string, Chapter> = {}
  dynamicNotes.forEach((n: { id: string; group?: string; filename?: string; name?: string }) => {
    const g = (n.group || '未分组').trim()
    const key = titleKey(g)
    const tTitle = n.filename ? n.filename : n.name

    if (byTitle[key]) {
      byTitle[key].topics.push({ id: n.id, title: tTitle || '' })
    } else {
      if (!newGroups[key]) {
        newGroups[key] = { id: `dyn_${slugify(g)}`, title: g, topics: [] }
      }
      newGroups[key].topics.push({ id: n.id, title: tTitle || '' })
    }
    // 确保持久化分组也包含该分组名称
    notesStore.addGroup(username, g)
  })

  // 4) 合并结果：保持预设分组的原顺序，再追加新增的动态分组

  return [...Object.values(byTitle), ...Object.values(newGroups)]
}

// 从章节数据中查找笔记标题
const getNoteTitleFromChapters = (noteId: string): string => {
  for (const chapter of chapters.value) {
    const topic = chapter.topics.find((topic) => topic.id === noteId)
    if (topic) {
      return topic.title.replace('.md', '')
    }
  }
  return noteId
}

// 加载 Markdown 内容
const loadMarkdown = async (topicId: string, title: string) => {
  try {
    loading.value = true
    // 进入阅读模式时关闭新建视图
    showNewNote.value = false

    // 先尝试读取动态笔记
    const notesStore = useNotesStore()
    const dynamic = notesStore.getNoteContentById(topicId)
    if (dynamic) {
      selectedNoteContent.value = dynamic
      selectedFileName.value = title
      showMarkdown.value = true
      return
    }

    // 回退到静态资源
    selectedNoteContent.value = await getNoteContent(topicId)
    selectedFileName.value = title
    showMarkdown.value = true
  } catch (error: any) {
    console.error('加载Markdown失败:', error)
    let errorMessage = error?.message || t('messages.error.loadNoteFailed') || '加载笔记失败'
    // 处理 note_not_found 错误
    if (errorMessage.startsWith('note_not_found:')) {
      const topicId = errorMessage.split(':')[1]
      errorMessage =
        t('messages.error.noteNotFound', { topicId }) || `未找到笔记文件映射：${topicId}`
    }
    ElMessage.error(errorMessage)

    // 如果笔记加载失败，回退到上一个路由
    router.back()
    showMarkdown.value = false
    selectedTopic.value = ''
  } finally {
    loading.value = false
  }
}

// 开始新建笔记，替换 Learning Activity 主区域
const startNewNote = () => {
  showMarkdown.value = false
  showNewNote.value = true
}

// 错误消息防抖控制
let lastErrorMessage = ''
let errorMessageTimeout: number | null = null

// 显示错误消息（带防抖）
const showErrorMessage = (message: string) => {
  // 如果和上次消息相同，且在短时间内，则不重复显示
  if (message === lastErrorMessage && errorMessageTimeout) {
    return
  }

  lastErrorMessage = message
  ElMessage.error(message)

  // 设置防抖时间（2秒）
  if (errorMessageTimeout) {
    clearTimeout(errorMessageTimeout)
  }
  errorMessageTimeout = window.setTimeout(() => {
    lastErrorMessage = ''
    errorMessageTimeout = null
  }, 2000)
}

// 处理路由中的笔记参数
const handleRouteNote = () => {
  const noteId = route.params.noteId as string
  const username = route.params.username as string

  // 检查用户名是否存在
  if (username) {
    // 验证用户名是否有效
    if (!isValidUsername(username)) {
      showErrorMessage(t('messages.error.userNotFound', { username }))
      // 跳转到 404 页面
      router.replace('/404')
      return
    }

    // 始终根据当前路由用户名生成章节结构，避免同步不及时
    chapters.value = generateUserChapters(username)

    if (noteId) {
      // 如果有笔记ID，先检查用户是否拥有这个笔记
      if (!userHasNote(username, noteId)) {
        showErrorMessage(t('messages.error.noteNotInUser', { username, noteId }))
        // 跳转到 404 页面
        router.replace('/404')
        return
      }

      // 用户拥有这个笔记，加载对应笔记
      selectedTopic.value = noteId
      // 查找对应的标题
      const noteTitle = getNoteTitleFromChapters(noteId)
      if (noteTitle) {
        loadMarkdown(noteId, noteTitle)
      } else {
        showErrorMessage(t('messages.error.noteNotExist', { noteId }))
        // 跳转到 404 页面
        router.replace('/404')
      }
    } else {
      // 只有用户名，没有笔记ID，显示用户的主页内容
      showMarkdown.value = false
      selectedTopic.value = ''
    }
  }
}

// 加载数据的方法
const loadData = async () => {
  loading.value = true
  try {
    const [feedResp, recentNotesResp] = await Promise.all([getFeedData(), getRecentNotes()])

    // 使用路由参数中的用户名，如果没有则使用当前登录用户
    const routeUsername = route.params.username as string
    const targetUsername = routeUsername || getCurrentUsername()
    chapters.value = generateUserChapters(targetUsername)

    feedData.value = feedResp.data
    recentNotes.value = recentNotesResp.data
  } catch (error) {
    console.error('加载数据失败:', error)
    showErrorMessage(t('messages.error.loadDataFailed') || '加载数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 监听路由变化
watch(
  () => route.params,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_) => {
    handleRouteNote()
  },
  { immediate: true },
)

// 组件挂载时加载数据
onMounted(() => {
  loadData()
  // 处理直接访问笔记路由的情况
  handleRouteNote()
})

// 计算属性：过滤后的动态
const filteredFeed = computed(() => {
  // 这里可以根据activeFilter进行过滤
  return feedData.value
})

// 方法：处理主题选择
const handleTopicSelect = (topic: { id: string; title: string }) => {
  selectedTopic.value = topic.id

  // 使用路由参数中的用户名，如果没有则使用当前登录用户
  const routeUsername = route.params.username as string
  const username = routeUsername || getCurrentUsername()
  // 更新URL到新的路由格式：/用户名/笔记ID
  router.push(`/${username}/${topic.id}`)
  // 加载并显示 Markdown
  loadMarkdown(topic.id, topic.title)
}

// 新建后刷新章节树
const handleNoteCreated = (payload: { id: string; username: string; group: string }) => {
  const routeUsername = route.params.username as string
  const targetUsername = payload?.username || routeUsername || getCurrentUsername()
  chapters.value = generateUserChapters(targetUsername)
}

// 方法：处理章节展开折叠
const handleChapterToggle = () => {}
// 方法：设置过滤器
const setFilter = (filter: string) => {
  activeFilter.value = filter
}

// 方法：获取时间文本
const getTimeText = (item: any) => {
  if (item.time === 'yesterday') {
    return t('home.timeAgo.yesterday')
  } else if (item.time === 'daysAgo' && item.timeValue) {
    return `${item.timeValue} ${t('home.timeAgo.daysAgo')}`
  }
  return item.time
}

// 方法：获取统计文本
const getStatText = (stat: any) => {
  if (stat.type) {
    return `${stat.text} ${t(`home.stats.${stat.type}`)}`
  }
  return stat.text
}
</script>

<style lang="scss" scoped>
// 全局样式重置
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

// 主要内容区域
.main-container {
  width: 100%;
  height: calc(100vh - 60px);
  margin: 0;
  padding: 24px 0 0 0;
  display: flex;
  background-color: var(--home-main-bg);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
  line-height: 1.5;
  box-sizing: border-box;
  overflow: hidden !important;
}

// 左侧边栏
.left-sidebar {
  width: 296px;
  flex-shrink: 0;
  margin-left: 16px;
  margin-right: 24px;
  background-color: transparent;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  // 侧边栏头部
  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    h2 {
      color: var(--text-primary);
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
      padding-bottom: 8px;
    }
  }

  // 新建按钮
  .new-btn {
    background-color: #238636;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 4px 8px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background-color 0.2s;

    &:hover {
      background-color: #2ea043;
    }
  }

  // 搜索框区域
  .search-section {
    margin-bottom: 16px;

    .search-box {
      position: relative;
      display: flex;
      align-items: center;
      background-color: var(--home-main-bg);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 0 12px;
      gap: 8px;
      height: 32px;

      &:focus-within {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(31, 111, 235, 0.3);
      }

      i {
        color: var(--text-tertiary);
        font-size: 14px;
        flex-shrink: 0;
      }

      input {
        flex: 1;
        background: none;
        border: none;
        color: var(--text-primary);
        font-size: 14px;
        outline: none;

        &::placeholder {
          color: var(--text-tertiary);
        }
      }
    }
  }
}

// 侧边栏标题底线样式（浅色/深色模式）
:root {
  .left-sidebar .sidebar-header h2,
  .right-sidebar .sidebar-header h2 {
    border-bottom: 2px solid rgba(88, 166, 255, 0.3);
  }
}

[data-theme='dark'] {
  .left-sidebar .sidebar-header h2,
  .right-sidebar .sidebar-header h2 {
    border-bottom: 2px solid rgba(124, 58, 237, 0.3);
  }
}

// 中间内容区域
.main-content {
  flex: 1;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  // 内容头部
  .content-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    h2 {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .filter-buttons {
      display: flex;
      gap: 8px;

      .el-button {
        padding: 6px 16px !important;
        font-size: 14px !important;
        border-radius: 6px !important;
        min-width: auto !important;
        height: auto !important;
        line-height: 1.4 !important;
      }

      .el-button--default {
        background: none !important;
        border: 1px solid var(--border-color) !important;
        color: var(--text-primary) !important;

        &:hover {
          background-color: var(--bg-secondary) !important;
          border-color: var(--home-link-color) !important;
        }
      }

      .el-button--primary {
        background-color: var(--primary-color) !important;
        border-color: var(--primary-color) !important;
        color: white !important;
      }
    }
  }

  // Markdown内容容器
  .markdown-content-container {
    flex: 1;
    overflow: auto;
  }

  // Feed区域
  .feed {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 1;
    overflow: hidden;

    .feed-list {
      flex: 1;
      overflow: auto;
    }

    .feed-item {
      display: block;
      width: 100%;
      padding: 0;
      background-color: var(--home-feed-bg);
      border: 1px solid var(--border-light);
      border-radius: 8px;
      margin-bottom: 24px;
      transition: border-color 0.2s;
      overflow: hidden;

      &:last-child {
        margin-bottom: 0;
      }

      &:hover {
        border-color: var(--border-color);
      }

      // Feed头部信息
      .feed-header-info {
        display: flex;
        align-items: flex-start;
        padding: 12px 16px 8px 16px;
        background-color: var(--home-feed-header-bg);
        border-bottom: 1px solid var(--border-light);

        .user-avatar {
          display: block;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          margin-right: 8px;
          flex-shrink: 0;
          object-fit: cover;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          font-size: 13px;
          line-height: 1.2;
          color: var(--text-tertiary);

          .first-line {
            display: flex;
            align-items: center;
            margin-bottom: 2px;
          }

          .username {
            color: var(--text-primary);
            font-weight: 600;
            margin-right: 6px;
          }

          .action {
            color: var(--text-tertiary);
          }

          .time {
            color: var(--text-tertiary);
            font-size: 12px;
          }
        }
      }

      // Feed内容
      .feed-content {
        margin: 12px 16px 16px 16px;
        padding: 16px;
        background-color: var(--home-feed-content-bg);
        border-radius: 8px;

        .content-title {
          margin-bottom: 8px;

          h4 {
            color: var(--home-link-color);
            font-size: 16px;
            font-weight: 600;
            margin: 0;
            cursor: pointer;

            &:hover {
              text-decoration: underline;
            }
          }
        }

        .content-description {
          margin-top: 0;

          p {
            color: var(--text-secondary);
            font-size: 14px;
            line-height: 1.5;
            margin: 0 0 12px 0;
          }
        }

        // 内容标签
        .content-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 12px;

          .el-tag {
            padding: 2px 8px;
            font-size: 11px;
            font-weight: 500;
            border-radius: 12px;
            border: none;
            white-space: nowrap;
            transition: background-color 0.2s;

            &:hover {
              cursor: pointer;
            }
          }
        }

        // Feed统计信息
        .feed-stats {
          display: flex;
          gap: 16px;
          font-size: 12px;
          color: var(--text-tertiary);
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid var(--border-light);

          span {
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }
      }
    }
  }
}

// 内容标签样式（浅色/深色模式）
:root .content-tags .el-tag--primary {
  background: rgba(88, 166, 255, 0.1);
  color: #58a6ff;
  border: 1px solid rgba(88, 166, 255, 0.2);

  &:hover {
    background: rgba(88, 166, 255, 0.15);
  }
}

[data-theme='dark'] .content-tags .el-tag--primary {
  background: rgba(124, 58, 237, 0.2);
  color: #7c3aed;

  &:hover {
    background: rgba(124, 58, 237, 0.3);
  }
}

// 右侧边栏
.right-sidebar {
  width: 296px;
  flex-shrink: 0;
  margin-left: 24px;
  margin-right: 16px;
  background-color: transparent;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    h2 {
      color: var(--text-primary);
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
      padding-bottom: 8px;
    }
  }

  // 笔记列表
  .notes-list {
    padding: 8px 0 0 0;
    flex: 1;
    overflow: auto;

    .note-item {
      background: var(--home-hover-bg);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 12px;
      transition: all 0.2s ease;
      cursor: pointer;

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: var(--home-hover-border);
        transform: translateY(-2px);
      }

      .note-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 6px;

        h4 {
          color: var(--text-primary);
          font-weight: 600;
          font-size: 14px;
          margin: 0;
          flex: 1;
          line-height: 1.3;
        }

        .note-time {
          color: var(--text-secondary);
          font-size: 12px;
          white-space: nowrap;
          margin-left: 8px;
        }
      }

      .note-preview {
        color: var(--text-secondary);
        font-size: 13px;
        line-height: 1.4;
        margin-bottom: 8px;
      }

      // 笔记标签
      .note-tags {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;

        .el-tag {
          padding: 2px 8px;
          font-size: 11px;
          font-weight: 500;
          border-radius: 12px;
          border: none;
          white-space: nowrap;
          transition: background-color 0.2s;

          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }
}

// 笔记标签样式（浅色/深色模式）
:root .note-tags .el-tag--info {
  background: rgba(88, 166, 255, 0.1);
  color: #58a6ff;
  border: 1px solid rgba(88, 166, 255, 0.2);

  &:hover {
    background: rgba(88, 166, 255, 0.15);
  }
}

[data-theme='dark'] .note-tags .el-tag--info {
  background: rgba(124, 58, 237, 0.2);
  color: #7c3aed;

  &:hover {
    background: rgba(124, 58, 237, 0.3);
  }
}

// 空状态样式
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);

  p {
    font-size: 14px;
    margin: 0;
  }
}

// 响应式适配
@media (max-width: 1200px) {
  .main-container {
    flex-direction: column;
  }

  .left-sidebar,
  .right-sidebar {
    width: 100%;
    margin: 0 0 16px;
    display: none;
  }
}

@media (max-width: 768px) {
  .main-container {
    padding: 16px 12px;
  }

  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .feed-item {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .feed-header-info {
    padding: 8px 12px 6px 12px !important;
  }

  .feed-content {
    margin: 8px 12px 12px 12px !important;
    padding: 12px !important;
  }
}
</style>
