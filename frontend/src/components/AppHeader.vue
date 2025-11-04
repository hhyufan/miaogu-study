<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'
import { useLanguageStore } from '@/stores/language'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { getChapters } from '@/api/home'
import type { Chapter } from '@/types/home'
import IconPlus from './icons/IconPlus.vue'
import IconSearch from './icons/IconSearch.vue'
import IconQuestionFilled from './icons/IconQuestionFilled.vue'
import IconMoon from './icons/IconMoon.vue'
import IconSunny from './icons/IconSunny.vue'
import IconOperation from './icons/IconOperation.vue'
import IconLanguage from './icons/IconLanguage.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const themeStore = useThemeStore()
const languageStore = useLanguageStore()
const userStore = useUserStore()
const searchQuery = ref('')
const searchInputRef = ref<HTMLInputElement>()

// 章节数据，用于查找笔记标题
const chapters = ref<Chapter[]>([])

// 获取当前用户名
const getCurrentUsername = () => {
  // 从用户存储获取当前用户名
  return userStore.userInfo?.username || 'miaogu'
}

// 获取章节数据
const loadChapters = async () => {
  try {
    // 获取当前路由中的用户名
    const routeUsername = route.params.username as string
    
    // 获取章节数据
    const chaptersData = await import('@/data/chapters.json')
    
    // 根据当前访问的用户获取对应的章节数据
    let targetChapters = []
    
    if (routeUsername) {
      // 如果有路由用户名，优先使用路由中的用户名
      const userChapters = (chaptersData as any).userChapters[routeUsername]
      targetChapters = userChapters || (chaptersData as any).defaultChapters || []
    } else {
      // 如果没有路由用户名，使用当前登录用户的章节数据
      const currentUsername = getCurrentUsername()
      const userChapters = (chaptersData as any).userChapters[currentUsername]
      targetChapters = userChapters || (chaptersData as any).defaultChapters || []
    }
    
    chapters.value = targetChapters
  } catch (error) {
    console.error('加载章节数据失败:', error)
  }
}

// 根据笔记ID查找笔记标题
const getNoteTitle = (noteId: string): string => {
  for (const chapter of chapters.value) {
    const topic = chapter.topics.find(topic => topic.id === noteId)
    if (topic) {
      // 移除.md后缀
      return topic.title.replace('.md', '')
    }
  }
  return noteId // 如果找不到，返回ID本身
}

// 切换主题
const toggleTheme = () => {
  themeStore.toggleTheme()
  ElMessage.success(t(`messages.themeSwitch.${themeStore.isDark ? 'dark' : 'light'}`))
}

// 切换语言
const toggleLanguage = () => {
  languageStore.toggleLanguage()
  const langText = languageStore.currentLanguage === 'zh-CN' ? '中文' : 'English'
  ElMessage.success(t('messages.languageSwitch', { language: langText }))
}

// 切换侧边栏
const toggleSidebar = () => {
  // 触发全局事件，让父组件处理侧边栏切换
  window.dispatchEvent(new CustomEvent('toggle-sidebar'))
}

// 导航到题目页面
const goToQuiz = () => {
  router.push('/quiz')
}

// 导航到个人资料
const goToProfile = () => {
  router.push('/profile')
}

// 搜索功能
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // 这里可以添加搜索逻辑
    ElMessage.info(t('messages.searchInfo', { query: searchQuery.value }))
  }
}

// 键盘快捷键 - 按 / 键聚焦搜索
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === '/') {
    event.preventDefault()
    if (searchInputRef.value) {
      searchInputRef.value.focus()
    }
  }
}

// 监听路由变化，当用户名改变时重新加载章节数据
watch(
  () => route.params.username,
  (newUsername) => {
    if (newUsername) {
      loadChapters()
    }
  }
)

// 添加键盘事件监听
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  loadChapters()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// 面包屑导航数据
const breadcrumbs = computed(() => {
  const matched = route.matched
  return matched.map((item) => {
    let title = t(`breadcrumb.${String(item.name)}`)
    
    // 如果是用户笔记路由
    if (item.name === 'user-note') {
      const username = route.params.username as string
      const noteId = route.params.noteId as string
      
      if (noteId) {
        // 如果有笔记ID，显示用户名和笔记标题
        title = `${username} / ${getNoteTitle(noteId)}`
      } else {
        // 只有用户名
        title = username
      }
    }
    
    return {
      name: item.name as string,
      path: item.path,
      title
    }
  }).filter(breadcrumb => breadcrumb.name !== 'home') // 过滤掉 home 路由，避免重复显示
})

// 处理面包屑点击
const handleBreadcrumbClick = (breadcrumb: { name: string; path: string }) => {
  if (breadcrumb.path && breadcrumb.path !== route.path) {
    router.push(breadcrumb.path)
  }
}
</script>

<template>
  <el-header class="app-header">
    <div class="header-container">
      <div class="header-left">
        <el-button
          class="menu-btn"
          @click="toggleSidebar"
          circle
        >
          <IconOperation />
        </el-button>
        <div class="breadcrumb-container">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item
              v-for="(item, index) in breadcrumbs"
              :key="item.name"
              :to="index < breadcrumbs.length - 1 ? item.path : undefined"
              @click="index < breadcrumbs.length - 1 && handleBreadcrumbClick(item)"
            >
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>

      <div class="header-center">
      </div>

      <div class="header-right">
        <el-input
            v-model="searchQuery"
            :placeholder="t('common.searchPlaceholder')"
            class="search-input"
            ref="searchInputRef"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <IconSearch />
            </template>
          </el-input>

        <div class="action-buttons">
          <el-button
            circle
            :title="t('common.new')"
            class="action-btn"
          >
            <IconPlus />
          </el-button>

          <el-button
            circle
            :title="t('common.quiz')"
            @click="goToQuiz"
            class="action-btn"
          >
            <IconQuestionFilled />
          </el-button>

          <el-button
            circle
            :title="t('common.toggleLanguage')"
            @click="toggleLanguage"
            class="action-btn"
          >
            <IconLanguage :current-language="languageStore.currentLanguage === 'zh-CN' ? 'zh' : 'en'" />
          </el-button>

          <el-button
            circle
            :title="t('common.toggleTheme')"
            @click="toggleTheme"
            class="action-btn"
          >
            <IconSunny v-if="themeStore.isDark" />
            <IconMoon v-else />
          </el-button>

          <el-avatar
            :src="'/hhyufan.jpg'"
            :size="40"
            class="user-avatar"
            @click="goToProfile"
            :title="t('common.viewProfile')"
          />
        </div>
      </div>
    </div>
  </el-header>
</template>

<style scoped>
.app-header {
  background-color: var(--header-bg);
  border-bottom: 1px solid var(--border-color);
  padding: 0;
  height: 60px !important;
  display: flex;
  align-items: center;
  box-shadow: var(--el-box-shadow-light);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-container {
  width: 100%;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-btn {
  color: var(--icon-color);
  border: 1px solid var(--border-color);
  background-color: transparent;
  transition: all 0.2s ease;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 600;
}

.menu-btn:hover {
  background-color: var(--bg-secondary);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.current-location {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.breadcrumb-container {
  display: flex;
  align-items: center;
}

.breadcrumb-container :deep(.el-breadcrumb__item) {
  color: var(--text-secondary);
}

.breadcrumb-container :deep(.el-breadcrumb__inner) {
  color: var(--text-secondary);
  font-weight: normal;
  cursor: pointer;
  transition: color 0.2s ease;
}

.breadcrumb-container :deep(.el-breadcrumb__inner:hover) {
  color: var(--primary-color);
}

.breadcrumb-container :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: var(--text-primary);
  font-weight: 600;
  cursor: default;
}

.breadcrumb-container :deep(.el-breadcrumb__separator) {
  color: var(--text-secondary);
  margin: 0 8px;
}

.header-center {
  flex: 1;
  max-width: 544px;
  margin: 0 16px;
}

.header-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex: 1;
  max-width: 600px;
}

.search-input {
  width: 240px;
  background-color: transparent;
  border-color: var(--input-border);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.search-input :deep(.el-input__wrapper) {
  background-color: transparent;
  box-shadow: 0 0 0 1px var(--input-border) inset;
}

.search-input :deep(.el-input__inner) {
  color: var(--text-primary);
}

.search-input :deep(.el-input__inner)::placeholder {
  color: var(--text-secondary);
}

.search-input:hover :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--primary-color) inset;
}

.search-input:focus-within :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--primary-color) inset;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 4px; /* 从8px减小到4px */
}

.action-btn {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--icon-color);
  transition: all 0.2s ease;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 600;
}

.action-btn:hover {
  background-color: var(--bg-secondary);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

:deep(.el-button) {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

:deep(.el-button:hover) {
  background-color: var(--bg-secondary);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.user-avatar {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  margin-left: 20px; /* 增加与按钮组的距离 */
}

.user-avatar:hover {
  transform: scale(1.05);
  border-color: var(--primary-color);
  box-shadow: 0 0 0 1px var(--primary-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-center {
    display: none;
  }

  .search-input {
    width: 180px;
  }

  .header-right {
    gap: 8px;
  }

  .action-buttons {
    gap: 4px;
  }
}
</style>
