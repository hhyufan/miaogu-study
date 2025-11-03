<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'
import { useLanguageStore } from '@/stores/language'
import { ElMessage } from 'element-plus'
import IconPlus from './icons/IconPlus.vue'
import IconSearch from './icons/IconSearch.vue'
import IconQuestionFilled from './icons/IconQuestionFilled.vue'
import IconMoon from './icons/IconMoon.vue'
import IconSunny from './icons/IconSunny.vue'
import IconOperation from './icons/IconOperation.vue'
import IconLanguage from './icons/IconLanguage.vue'

const router = useRouter()
const { t } = useI18n()
const themeStore = useThemeStore()
const languageStore = useLanguageStore()
const searchQuery = ref('')
const searchInputRef = ref<HTMLInputElement>()

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

// 添加键盘事件监听
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
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
        <div class="logo">
          <span class="current-location">Home</span>
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
            title="新建"
            class="action-btn"
          >
            <IconPlus />
          </el-button>

          <el-button
            circle
            title="题目"
            @click="goToQuiz"
            class="action-btn"
          >
            <IconQuestionFilled />
          </el-button>

          <el-button
            circle
            title="切换语言"
            @click="toggleLanguage"
            class="action-btn"
          >
            <IconLanguage :current-language="languageStore.currentLanguage === 'zh-CN' ? 'zh' : 'en'" />
          </el-button>

          <el-button
            circle
            title="切换主题"
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
            title="查看个人资料"
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

@media (max-width: 480px) {
  .search-input {
    width: 120px;
  }

  :deep(.el-button.is-circle) {
    padding: 6px;
  }

  :deep(.el-avatar) {
    width: 32px;
    height: 32px;
  }
}
</style>
