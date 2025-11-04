<template>
  <!-- 主要内容区域 -->
  <main class="main-container">
    <!-- 左侧边栏 - 我的笔记 -->
    <aside class="left-sidebar">
      <div class="sidebar-header">
        <h2>{{ t('home.myNotes') }}</h2>
        <el-button type="primary" class="new-btn">
          <el-icon><Plus /></el-icon>
          {{ t('home.newNote') }}
        </el-button>
      </div>

      <div class="search-section">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" :placeholder="t('home.searchNotes')" v-model="searchQuery">
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
      <div class="content-header" v-show="!showMarkdown">
        <h2>{{ t('home.learningActivity') }}</h2>
        <el-button-group class="filter-buttons">
          <el-button
                  :type="activeFilter === 'all' ? 'primary' : 'default'"
                  @click="setFilter('all')">{{ t('home.filters.all') }}</el-button>
          <el-button
                  :type="activeFilter === 'latest' ? 'primary' : 'default'"
                  @click="setFilter('latest')">{{ t('home.filters.latest') }}</el-button>
          <el-button
                  :type="activeFilter === 'notes' ? 'primary' : 'default'"
                  @click="setFilter('notes')">{{ t('home.filters.notes') }}</el-button>
        </el-button-group>
      </div>

      <!-- Markdown 主体内容 -->
      <div v-if="showMarkdown" class="markdown-content-container">
        <MarkdownViewer
          :content="selectedNoteContent"
          :file-name="selectedFileName"
          :is-header-visible="false"
        />
      </div>

      <div class="feed" v-show="!showMarkdown" v-loading="loading">
        <div v-if="!loading && filteredFeed.length === 0" class="empty-state">
          <p>{{ t('home.noData') }}</p>
        </div>
        <div class="feed-list">
          <div class="feed-item" v-for="item in filteredFeed" :key="item.id">
            <div class="feed-header-info">
              <img :src="item.avatar" alt="用户头像" class="user-avatar">
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
                  <el-tag v-for="tag in item.tags" :key="tag" size="small" type="primary">{{ tag }}</el-tag>
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
    <aside class="right-sidebar" v-show="!showMarkdown">
      <div class="sidebar-header">
        <h2>{{ t('home.latestQuestions') }}</h2>
      </div>
      <div class="notes-list">
        <div class="note-item" v-for="note in recentNotes" :key="note.id">
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useI18n } from 'vue-i18n'
import { ElButton, ElButtonGroup, ElIcon, ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import TreeNavigation from './TreeNavigation.vue'
import { getChapters, getFeedData, getRecentNotes } from '@/api/home'
import { getNoteContent } from '@/api/notes'
import MarkdownViewer from '@/components/MarkdownViewer.vue'
import type { Chapter, FeedItem, RecentNote } from '@/types/home'

// 使用主题store和i18n
useThemeStore()
const { t } = useI18n()

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

// 加载数据的方法
const loadData = async () => {
  loading.value = true
  try {
    const [chaptersData, feedDataResult, recentNotesData] = await Promise.all([
      getChapters(),
      getFeedData(),
      getRecentNotes()
    ])

    chapters.value = chaptersData
    feedData.value = feedDataResult
    recentNotes.value = recentNotesData
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error(t('messages.error.loadDataFailed') || '加载数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})

// 计算属性：过滤后的动态
const filteredFeed = computed(() => {
  // 这里可以根据activeFilter进行过滤
  return feedData.value
})

// 方法：处理主题选择
const handleTopicSelect = (topic: { id: string; title: string }) => {
  selectedTopic.value = topic.id
  console.log('选择主题:', topic)
  // 加载并显示 Markdown
  loadMarkdown(topic.id, topic.title)
}

// 方法：处理章节展开折叠
const handleChapterToggle = (chapterId: string, isExpanded: boolean) => {
  console.log('章节切换:', chapterId, isExpanded ? '展开' : '折叠')
}

// 方法：显示笔记详情（保留兼容性）
// const showNoteDetail = (noteId: string) => {
//   selectedTopic.value = noteId
//   console.log('显示笔记详情:', noteId)
//   // 这里可以实现笔记详情显示逻辑
// }

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

// 加载 Markdown 内容
const loadMarkdown = async (topicId: string, title: string) => {
  try {
    loading.value = true
    const content = await getNoteContent(topicId)
    selectedNoteContent.value = content
    selectedFileName.value = title
    showMarkdown.value = true
  } catch (error: any) {
    console.error('加载Markdown失败:', error)
    let errorMessage = error?.message || t('messages.error.loadNoteFailed') || '加载笔记失败'
    // 处理 note_not_found 错误
    if (errorMessage.startsWith('note_not_found:')) {
      const topicId = errorMessage.split(':')[1]
      errorMessage = t('messages.error.noteNotFound', { topicId }) || `未找到笔记文件映射：${topicId}`
    }
    ElMessage.error(errorMessage)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 主要内容区域 */
.main-container {
  width: 100%;
  height: calc(100vh - 60px);
  margin: 0;
  padding: 24px 0 24px 0;
  display: flex;
  background-color: var(--home-main-bg);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
  line-height: 1.5;
  box-sizing: border-box;
  overflow: hidden !important;
}

/* 左侧边栏 */
.left-sidebar {
  width: 296px;
  flex-shrink: 0;
  margin-left: 16px;
  margin-right: 24px;
  background-color: transparent;
  height: 100%;
  overflow: hidden; /* 不滚动，由树状图自身滚动 */
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.sidebar-header h2 {
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 8px;
}

/* 浅色模式 - 淡蓝色底线 */
:root .sidebar-header h2 {
  border-bottom: 2px solid rgba(88, 166, 255, 0.3);
}

/* 深色模式 - 紫色底线 */
[data-theme="dark"] .sidebar-header h2 {
  border-bottom: 2px solid rgba(124, 58, 237, 0.3);
}

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
}

.new-btn .el-icon {
  margin-right: 6px;
}

.new-btn:hover {
  background-color: #2ea043;
}

/* 搜索框样式 */
.search-section {
  margin-bottom: 16px;
}

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
}

.search-box:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(31, 111, 235, 0.3);
}

.search-box i {
  color: var(--text-tertiary);
  font-size: 14px;
  flex-shrink: 0;
}

.search-box input {
  flex: 1;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
}

.search-box input::placeholder {
  color: var(--text-tertiary);
}

/* 中间内容区域 */
.main-content {
  flex: 1;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden; /* 不作为滚动容器 */
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.content-header h2 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.filter-buttons {
  display: flex;
  gap: 8px;
}

.filter-buttons .el-button {
  padding: 6px 16px !important;
  font-size: 14px !important;
  border-radius: 6px !important;
  min-width: auto !important;
  height: auto !important;
  line-height: 1.4 !important;
}

.filter-buttons .el-button--default {
  background: none !important;
  border: 1px solid var(--border-color) !important;
  color: var(--text-primary) !important;
}

.filter-buttons .el-button--default:hover {
  background-color: var(--bg-secondary) !important;
  border-color: var(--home-link-color) !important;
}

.filter-buttons .el-button--primary {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  color: white !important;
}

.markdown-content-container {
  flex: 1;
  overflow: auto; /* 在这里滚动 */
}

/* Feed 区域 */
.feed {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  overflow: hidden; /* 不滚动，由内部列表滚动 */
}

.feed-list {
  flex: 1;
  overflow: auto; /* 列表滚动 */
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
}

.feed-item:last-child {
  margin-bottom: 0;
}

.feed-item:hover {
  border-color: var(--border-color);
}

/* Feed 头部信息样式 - 黑色背景 */
.feed-header-info {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px 8px 16px;
  background-color: var(--home-feed-header-bg);
  border-bottom: 1px solid var(--border-light);
}

.feed-header-info .user-avatar {
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
}

.user-details .first-line {
  display: flex;
  align-items: center;
  margin-bottom: 2px;
}

.user-details .username {
  color: var(--text-primary);
  font-weight: 600;
  margin-right: 6px;
}

.user-details .action {
  color: var(--text-tertiary);
}

.user-details .time {
  color: var(--text-tertiary);
  font-size: 12px;
}

/* Feed 内容样式 - 灰色背景的包含矩形 */
.feed-content {
  margin: 12px 16px 16px 16px;
  padding: 16px;
  background-color: var(--home-feed-content-bg);
  border-radius: 8px;
}

.content-title {
  margin-bottom: 8px;
}

.content-title h4 {
  color: var(--home-link-color);
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  cursor: pointer;
}

.content-title h4:hover {
  text-decoration: underline;
}

.content-description {
  margin-top: 0;
}

.content-description p {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

/* 标签样式 */
.content-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

/* 自定义 el-tag 样式 - 统一样式 */
.content-tags .el-tag {
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 12px;
  border: none;
  white-space: nowrap;
  transition: background-color 0.2s;
}

.content-tags .el-tag:hover {
  cursor: pointer;
}

/* 浅色模式 - 淡蓝色半透明背景，蓝色文字 */
:root .content-tags .el-tag--primary {
  background: rgba(88, 166, 255, 0.1);
  color: #58a6ff;
  border: 1px solid rgba(88, 166, 255, 0.2);
}

:root .content-tags .el-tag--primary:hover {
  background: rgba(88, 166, 255, 0.15);
}

/* 深色模式 - 紫色半透明背景，紫色文字 */
[data-theme="dark"] .content-tags .el-tag--primary {
  background: rgba(124, 58, 237, 0.2);
  color: #7c3aed;
}

[data-theme="dark"] .content-tags .el-tag--primary:hover {
  background: rgba(124, 58, 237, 0.3);
}

.note-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

/* 右侧边栏 note-tag 样式 - 统一样式 */
.note-tags .el-tag {
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 12px;
  border: none;
  white-space: nowrap;
  transition: background-color 0.2s;
}

.note-tags .el-tag:hover {
  cursor: pointer;
}

/* 浅色模式 - 淡蓝色半透明背景，蓝色文字 */
:root .note-tags .el-tag--info {
  background: rgba(88, 166, 255, 0.1);
  color: #58a6ff;
  border: 1px solid rgba(88, 166, 255, 0.2);
}

:root .note-tags .el-tag--info:hover {
  background: rgba(88, 166, 255, 0.15);
}

/* 深色模式 - 紫色半透明背景，紫色文字 */
[data-theme="dark"] .note-tags .el-tag--info {
  background: rgba(124, 58, 237, 0.2);
  color: #7c3aed;
}

[data-theme="dark"] .note-tags .el-tag--info:hover {
  background: rgba(124, 58, 237, 0.3);
}

.feed-stats {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--border-light);
}

.feed-stats span {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 右侧边栏 */
.right-sidebar {
  width: 296px;
  flex-shrink: 0;
  margin-left: 24px;
  margin-right: 16px;
  background-color: transparent;
  height: 100%;
  overflow: hidden; /* 不滚动，由列表滚动 */
  display: flex;
  flex-direction: column;
}

.right-sidebar .sidebar-header h2 {
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 8px;
}

/* 浅色模式 - 淡蓝色底线 */
:root .right-sidebar .sidebar-header h2 {
  border-bottom: 2px solid rgba(88, 166, 255, 0.3);
}

/* 深色模式 - 紫色底线 */
[data-theme="dark"] .right-sidebar .sidebar-header h2 {
  border-bottom: 2px solid rgba(124, 58, 237, 0.3);
}

.notes-list {
  padding: 0;
  flex: 1;
  overflow: auto; /* 右侧仅列表滚动 */
}

.note-item {
  background: var(--home-hover-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.note-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--home-hover-border);
  transform: translateY(-2px);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
}

.note-header h4 {
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

.note-preview {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.4;
  margin-bottom: 8px;
}

.note-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

/* 响应式适配 */
@media (max-width: 1200px) {
  .main-container {
    flex-direction: column;
  }

  .left-sidebar,
  .right-sidebar {
    width: 100%;
    margin: 0;
    margin-bottom: 16px;
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
    padding: 8px 12px 6px 12px;
  }

  .feed-content {
    margin: 8px 12px 12px 12px;
    padding: 12px;
  }
}
</style>
