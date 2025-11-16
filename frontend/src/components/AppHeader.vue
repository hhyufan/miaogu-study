<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'
import { useLanguageStore } from '@/stores/language'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { findNoteByUserAndTags, getNoteSuggestions, getUserSuggestions } from '@/api/search'
import type { Chapter } from '@/types/home'
import {
  IconLanguage,
  IconMoon,
  IconOperation,
  IconPlus,
  IconQuestionFilled,
  IconSearch,
  IconSunny
} from '@/components/icons'
// 全局注册的图标组件无需导入

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const themeStore = useThemeStore()
const languageStore = useLanguageStore()
const userStore = useUserStore()
const searchTags = ref<string[]>([])
const currentInput = ref('')
const dropdownVisible = ref(false)
type SuggestionItem = {
  label: string
  value: string
  kind: 'user' | 'note'
  username?: string
  noteId?: string
}
const suggestions = ref<SuggestionItem[]>([])
const searchInputRef = ref<any>()
const lastAddedTag = ref<string | null>(null)
// 防止标签规范化导致的递归触发
const isNormalizingTag = ref(false)

// 章节数据，用于查找笔记标题
const chapters = ref<Chapter[]>([])

// 获取当前用户名
const getCurrentUsername = () => {
  // 从用户存储获取当前用户名
  return userStore.userInfo?.username || 'admin'
}

// 获取章节数据
const loadChapters = async () => {
  try {
    // 获取当前路由中的用户名
    const routeUsername = route.params.username as string

    // 获取章节数据
    const chaptersData = await import('@/data/chapters.json')

    // 根据当前访问的用户获取对应的章节数据
    let targetChapters: any[]

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
    const topic = chapter.topics.find((topic) => topic.id === noteId)
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

// 从标签中解析用户与普通标签
const getUserFromTags = (): string | undefined => {
  const userTag = searchTags.value.find((tag) => tag.startsWith('user:'))
  if (!userTag) return undefined
  const username = userTag.split(':')[1]?.trim()
  return username || undefined
}

const getNoteTags = (): string[] => searchTags.value.filter((tag) => !tag.startsWith('user:'))

// 拉取综合建议（用户 + 笔记）
const fetchSuggestions = async (keyword: string) => {
  try {
    const username = getUserFromTags() || getCurrentUsername()
    const tags = getNoteTags()

    const list: SuggestionItem[] = []

    // 用户建议
    if (keyword) {
      const userRes = await getUserSuggestions({ keyword })
      // 提供直接输入的 user:keyword 作为快速添加项
      list.push({ label: `user: ${keyword}`, value: `user: ${keyword}`, kind: 'user' as const })
      list.push(
        ...userRes.data.map((u) => ({
          label: `user: ${u.username}`,
          value: `user: ${u.username}`,
          kind: 'user' as const,
        })),
      )
    }

    // 笔记建议（基于用户、标签与关键字）
    const noteRes = await getNoteSuggestions({ user: username, tags, keyword })
    list.push(
      ...noteRes.data.map((n) => ({
        label: `${n.username} / ${n.title}`,
        value: `note:${n.noteId}`,
        kind: 'note' as const,
        username: n.username,
        noteId: n.noteId,
      })),
    )

    // 按 value 去重，避免重复键导致渲染警告
    const seen = new Set<string>()
    const deduped: SuggestionItem[] = []
    for (const it of list) {
      if (!seen.has(it.value)) {
        seen.add(it.value)
        deduped.push(it)
      }
    }
    suggestions.value = deduped
    // 输入时保持展开，由选择或清空来决定关闭
    dropdownVisible.value = true
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    suggestions.value = []
    // 输入阶段保持展开，显示空占位
    dropdownVisible.value = true
  }
}

// 标签输入事件
const handleTagInput = async (val: string) => {
  currentInput.value = val
  await fetchSuggestions(val)
}

// 选择建议加入标签
const selectSuggestion = async (item: SuggestionItem) => {
  if (item.kind === 'user') {
    // 如果刚刚通过空格生成了一个标签，选择建议应替换该标签
    if (lastAddedTag.value) {
      const idx = searchTags.value.lastIndexOf(lastAddedTag.value)
      if (idx !== -1) {
        searchTags.value.splice(idx, 1)
      }
      lastAddedTag.value = null
    }

    // 保证只有一个 user: 标签
    searchTags.value = searchTags.value.filter((t) => !t.startsWith('user:'))
    searchTags.value.push(item.value)
    currentInput.value = ''
    // 切换用户后重新拉取相关笔记建议，并在数据就绪后再决定展开
    await fetchSuggestions('')
    dropdownVisible.value = true
  } else if (item.kind === 'note') {
    // 直接跳转到该笔记
    if (item.username && item.noteId) {
      await router.push(`/${item.username}/${item.noteId}`)
    }
    // 路由跳转后隐藏并清空下拉建议
    suggestions.value = []
    dropdownVisible.value = false
    currentInput.value = ''
    // 清空输入框内的标签
    searchTags.value = []
  }
}

const handleRemoveTag = () => {
  if (searchTags.value.length === 0) dropdownVisible.value = false
}

// 执行搜索并路由跳转
const handleTagSearch = async () => {
  const username = getUserFromTags() || getCurrentUsername()
  const tags = getNoteTags()
  try {
    if (!tags.length) {
      await router.push(`/${username}`)
      // 路由跳转后隐藏并清空下拉建议
      suggestions.value = []
      dropdownVisible.value = false
      currentInput.value = ''
      // 清空输入框内的标签
      searchTags.value = []
      return
    }
    const res = await findNoteByUserAndTags({ user: username, tags })
    const result = res.data
    if (result && result.noteId && result.username) {
      await router.push(`/${result.username}/${result.noteId}`)
      // 路由跳转后隐藏并清空下拉建议
      suggestions.value = []
      dropdownVisible.value = false
      currentInput.value = ''
      // 清空输入框内的标签
      searchTags.value = []
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    ElMessage.error('搜索失败，请稍后重试')
  }
}

// 当标签被新增（通过空格分隔）时自动触发搜索
watch(
  () => searchTags.value.slice(),
  async (newTags, oldTags) => {
    if (isNormalizingTag.value) return
    if (newTags.length > (oldTags?.length || 0)) {
      // 记录刚新增的标签，用于选择下拉建议时替换
      const added = newTags[newTags.length - 1]
      lastAddedTag.value = added ?? null

      // 如果新增标签是现有用户名，则自动转为 user:username
      if (added && !added.startsWith('user:')) {
        try {
          const userRes = await getUserSuggestions({ keyword: added })
          const exact = userRes.data.find((u: any) => u.username === added)
          if (exact) {
            isNormalizingTag.value = true
            // 移除刚新增的原始标签
            const idx = searchTags.value.lastIndexOf(added)
            if (idx !== -1) searchTags.value.splice(idx, 1)
            // 保证只有一个 user: 标签
            searchTags.value = searchTags.value.filter((t) => !t.startsWith('user:'))
            const normalized = `user:${added}`
            searchTags.value.push(normalized)
            lastAddedTag.value = normalized
            isNormalizingTag.value = false
            // 切换用户后重新拉取相关笔记建议，并在数据就绪后再决定展开
            await fetchSuggestions('')
            dropdownVisible.value = true
            return
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
          // 忽略建议接口错误，退回默认行为
        }
      }

      // 默认：新增普通标签后展示匹配的笔记建议
      await fetchSuggestions(currentInput.value)
      dropdownVisible.value = suggestions.value.length > 0
    }
  },
)

// 键盘快捷键 - 按 / 键聚焦搜索
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === '/') {
    event.preventDefault()
    searchInputRef.value?.focus?.()
  }
}

// 监听路由变化，当用户名改变时重新加载章节数据
watch(
  () => route.params.username,
  (newUsername) => {
    if (newUsername) {
      loadChapters()
      // 任意路由变化后隐藏并清空下拉建议
      suggestions.value = []
      dropdownVisible.value = false
      currentInput.value = ''
    }
  },
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
  return matched
    .map((item) => {
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
        title,
      }
    })
    .filter((breadcrumb) => breadcrumb.name !== 'home') // 过滤掉 home 路由，避免重复显示
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
        <el-button circle class="menu-btn" @click="toggleSidebar">
          <IconOperation class="app-icon app-icon--md app-icon--hoverable" />
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

      <div class="header-center"></div>

      <div class="header-right">
        <el-dropdown
          v-model:visible="dropdownVisible"
          :hide-on-click="false"
          :teleported="false"
          placement="bottom-start"
          popper-class="app-header-dropdown"
        >
          <el-input-tag
            ref="searchInputRef"
            v-model="searchTags"
            :placeholder="t('common.searchPlaceholder')"
            class="search-input"
            delimiter=" "
            @input="handleTagInput"
            @remove-tag="handleRemoveTag"
            @keyup.enter="handleTagSearch"
          >
            <template #prefix>
              <IconSearch class="app-icon app-icon--sm" />
            </template>
          </el-input-tag>
          <template #dropdown>
            <el-dropdown-menu>
              <template v-if="suggestions.length">
                <el-dropdown-item
                  v-for="item in suggestions"
                  :key="item.kind + ':' + item.value"
                  @click="selectSuggestion(item)"
                >
                  {{ item.label }}
                </el-dropdown-item>
              </template>
              <el-dropdown-item v-else disabled>暂无匹配</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <div class="action-buttons">
          <el-button :title="t('common.new')" circle class="action-btn">
            <IconPlus class="app-icon app-icon--md app-icon--hoverable" />
          </el-button>

          <el-button :title="t('common.quiz')" circle class="action-btn" @click="goToQuiz">
            <IconQuestionFilled class="app-icon app-icon--md app-icon--hoverable" />
          </el-button>

          <el-button
            :title="t('common.toggleLanguage')"
            circle
            class="action-btn"
            @click="toggleLanguage"
          >
            <IconLanguage
              :current-language="languageStore.currentLanguage === 'zh-CN' ? 'zh' : 'en'"
              class="app-icon app-icon--md app-icon--hoverable"
            />
          </el-button>

          <el-button
            :title="t('common.toggleTheme')"
            circle
            class="action-btn"
            @click="toggleTheme"
          >
            <IconSunny v-if="themeStore.isDark" class="app-icon app-icon--md app-icon--hoverable" />
            <IconMoon v-else class="app-icon app-icon--md app-icon--hoverable" />
          </el-button>

          <el-avatar
            :size="40"
            :src="'/hhyufan.jpg'"
            :title="t('common.viewProfile')"
            class="user-avatar"
            @click="goToProfile"
          />
        </div>
      </div>
    </div>
  </el-header>
</template>

<style lang="scss" scoped>
// 提取公共变量（复用重复值，便于维护）
$header-height: 60px;
$transition-base: all 0.2s ease;
$btn-size: 40px;
$border-radius: 6px;
$gap-sm: 4px;
$gap-base: 8px;
$gap-medium: 16px;
$gap-large: 20px;
$padding-base: 16px;

.app-header {
  background-color: var(--header-bg);
  border-bottom: 1px solid var(--border-color);
  padding: 0;
  height: $header-height !important;
  display: flex;
  align-items: center;
  box-shadow: var(--el-box-shadow-light);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-sizing: border-box;

  .header-container {
    width: 100%;
    padding: 0 $padding-base;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }

  // 左侧区域（菜单按钮 + 面包屑）
  .header-left {
    display: flex;
    align-items: center;
    gap: $gap-medium;

    .menu-btn {
      color: var(--icon-color);
      border: 1px solid var(--border-color);
      background-color: transparent;
      transition: $transition-base;
      width: $btn-size;
      height: $btn-size;
      border-radius: $border-radius;
      font-size: 18px;
      font-weight: 600;

      &:hover {
        background-color: var(--bg-secondary);
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
    }

    .breadcrumb-container {
      display: flex;
      align-items: center;

      :deep(.el-breadcrumb__item) {
        color: var(--text-secondary);
      }

      :deep(.el-breadcrumb__inner) {
        color: var(--text-secondary);
        font-weight: normal;
        cursor: pointer;
        transition: color $transition-base;

        &:hover {
          color: var(--primary-color);
        }
      }

      :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
        color: var(--text-primary);
        font-weight: 600;
        cursor: default;
      }

      :deep(.el-breadcrumb__separator) {
        color: var(--text-secondary);
        margin: 0 $gap-base;
      }
    }
  }

  // 中间搜索区域
  .header-center {
    flex: 1;
    max-width: 544px;
    margin: 0 $gap-medium;
  }

  // 右侧区域（搜索框 + 操作按钮 + 头像）
  .header-right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $gap-medium;
    flex: 1;
    max-width: 600px;

    .search-input {
      width: 240px;
      background-color: transparent;
      border-color: var(--input-border);
      color: var(--text-primary);
      transition: $transition-base;

      :deep(.el-input__wrapper) {
        background-color: transparent;
        box-shadow: 0 0 0 1px var(--input-border) inset;
      }

      :deep(.el-input__inner) {
        color: var(--text-primary);

        &::placeholder {
          color: var(--text-secondary);
        }
      }

      &:hover,
      &:focus-within {
        :deep(.el-input__wrapper) {
          box-shadow: 0 0 0 1px var(--primary-color) inset;
        }
      }

      // 标签输入（el-input-tag）主题适配
      :deep(.el-tag) {
        background-color: var(--bg-secondary);
        border: 1px solid var(--border-color);
        color: var(--text-primary);

        .el-tag__close {
          color: var(--text-secondary);

          &:hover {
            color: var(--primary-color);
          }
        }
      }
    }

    .action-buttons {
      display: flex;
      align-items: center;
      gap: $gap-sm; /* 从8px减小到4px */

      .action-btn {
        background-color: transparent;
        border: 1px solid var(--border-color);
        color: var(--icon-color);
        transition: $transition-base;
        width: $btn-size;
        height: $btn-size;
        border-radius: $border-radius;
        font-size: 18px;
        font-weight: 600;

        &:hover {
          background-color: var(--bg-secondary);
          border-color: var(--primary-color);
          color: var(--primary-color);
        }
      }
    }

    .user-avatar {
      cursor: pointer;
      transition: $transition-base;
      border: 1px solid var(--border-color);
      border-radius: 50%;
      margin-left: $gap-large; /* 增加与按钮组的距离 */

      &:hover {
        transform: scale(1.05);
        border-color: var(--primary-color);
        box-shadow: 0 0 0 1px var(--primary-color);
      }
    }
  }

  // Element Plus 按钮全局重置
  :deep(.el-button) {
    background-color: transparent;
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    transition: $transition-base;

    &:hover {
      background-color: var(--bg-secondary);
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
  }

  // 下拉菜单主题适配
  :deep(.el-dropdown__popper .el-dropdown-menu) {
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    box-shadow: var(--el-box-shadow);
  }

  :deep(.el-dropdown__popper .el-dropdown-menu__item) {
    color: var(--text-primary);
  }

  // 下拉菜单项 hover/focus/active 状态
  :deep(
    .el-dropdown__popper .el-dropdown-menu__item:hover,
    .el-dropdown__popper .el-dropdown-menu__item:focus,
    .el-dropdown__popper .el-dropdown-menu__item.is-hover,
    .app-header-dropdown .el-dropdown-menu__item:hover,
    .app-header-dropdown .el-dropdown-menu__item:focus,
    .app-header-dropdown .el-dropdown-menu__item.is-hover,
    .el-dropdown__popper .el-dropdown-menu__item.hover,
    .el-dropdown__popper .el-dropdown-menu__item.selected,
    .el-dropdown__popper .el-dropdown-menu__item.is-active,
    .app-header-dropdown .el-dropdown-menu__item.hover,
    .app-header-dropdown .el-dropdown-menu__item.selected,
    .app-header-dropdown .el-dropdown-menu__item.is-active
  ) {
    background-color: var(--bg-secondary) !important;
    color: var(--primary-color) !important;
  }

  // 下拉箭头主题适配
  :deep(.el-dropdown__popper .el-popper__arrow::before) {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
  }
}

// 响应式设计（≤768px）
@media (max-width: 768px) {
  .app-header {
    .header-center {
      display: none;
    }

    .header-right {
      gap: $gap-base;

      .search-input {
        width: 180px;
      }

      .action-buttons {
        gap: $gap-sm;
      }
    }
  }
}
</style>
