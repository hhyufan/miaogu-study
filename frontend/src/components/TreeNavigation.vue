<template>
  <div class="tree-navigation">
    <div class="chapter-list">
      <div class="chapter-item" v-for="chapter in chapters" :key="chapter.id">
        <el-button class="chapter-header" text @click="toggleChapter(chapter.id)">
          <IconChevronRight class="chapter-arrow" :expanded="isExpanded(chapter.id)" />
          <span>{{ chapter.title }}</span>
        </el-button>
        <transition name="slide-fade">
          <div class="topic-list" v-show="isExpanded(chapter.id)" :id="`topics-${chapter.id}`">
            <el-button
              class="topic-item"
              text
              v-for="topic in chapter.topics"
              :key="topic.id"
              :type="selectedTopic === topic.id ? 'primary' : 'default'"
              @click="selectTopic(topic)"
            >
              <IconDocument class="app-icon app-icon--sm topic-icon" />
              <span>{{ topic.title }}</span>
            </el-button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElButton } from 'element-plus'
import {IconDocument, IconChevronRight} from '@/components/icons'
// 定义接口
interface Topic {
  id: string
  title: string
}

interface Chapter {
  id: string
  title: string
  topics: Topic[]
}

// Props
interface Props {
  chapters: Chapter[]
  defaultExpanded?: string[]
  selectedTopic?: string
}

const props = withDefaults(defineProps<Props>(), {
  chapters: () => [],
  defaultExpanded: () => [],
  selectedTopic: '',
})

// Emits
interface Emits {
  (e: 'topic-select', topic: Topic): void
  (e: 'chapter-toggle', chapterId: string, isExpanded: boolean): void
}

const emit = defineEmits<Emits>()

// 展开的章节
const expandedChapters = ref<string[]>([...props.defaultExpanded])

// 计算属性：检查章节是否展开
const isExpanded = (chapterId: string) => {
  return expandedChapters.value.includes(chapterId)
}

// 方法：切换章节展开状态
const toggleChapter = (chapterId: string) => {
  const index = expandedChapters.value.indexOf(chapterId)
  const wasExpanded = index > -1

  if (wasExpanded) {
    expandedChapters.value.splice(index, 1)
  } else {
    expandedChapters.value.push(chapterId)
  }

  emit('chapter-toggle', chapterId, !wasExpanded)
}

// 方法：选择主题
const selectTopic = (topic: Topic) => {
  emit('topic-select', topic)
}
</script>

<style scoped>
.tree-navigation {
  width: 100%;
  height: 100%;
  flex: 1 1 auto; /* 填满左侧栏剩余空间 */
  overflow: auto; /* 将滚动职责交给树状图自身 */
  box-sizing: border-box; /* 确保盒模型计算正确 */
}

.chapter-list {
  margin-top: 16px;
}

.chapter-item {
  margin-bottom: 8px;
}

.chapter-header {
  display: flex;
  align-items: center;
  padding: 8px 12px !important;
  border-radius: 6px !important;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent !important;
  border: none !important;
  user-select: none;
  width: 100%;
  justify-content: flex-start;
  text-align: left;
  color: var(--text-primary, #e6edf3) !important;
  font-weight: 600 !important;
  font-size: 14px !important;
}

.chapter-header:hover {
  background: var(--home-hover-bg, rgba(255, 255, 255, 0.05)) !important;
  border: 1px solid var(--home-hover-border, rgba(255, 255, 255, 0.1)) !important;
}

.chapter-arrow {
  margin-right: 8px;
  color: var(--home-accent-color, #58a6ff);
  font-size: 14px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chapter-header span {
  font-weight: 600;
  color: var(--text-primary, #e6edf3);
  font-size: 14px;
}

.topic-list {
  margin-left: 20px;
  margin-top: 4px;
  border-left: 2px solid var(--border-light, rgba(255, 255, 255, 0.1));
  padding-left: 12px;
  padding-right: 8px; /* 添加右侧内边距 */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: calc(100% - 42px); /* 调整宽度计算，考虑左右边距和内边距 */
  max-width: calc(100% - 42px); /* 确保最大宽度限制 */
  box-sizing: border-box; /* 确保盒模型计算正确 */
  gap: 0; /* 移除gap，使用margin-bottom控制间距 */
}

.topic-item {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  padding: 6px 12px !important;
  margin: 0 0 4px 0 !important; /* 统一margin设置 */
  border-radius: 4px !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  color: var(--text-secondary, #8b949e) !important;
  font-size: 14px !important;
  background: transparent !important;
  border: none !important;
  user-select: none !important;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important; /* 允许收缩 */
  justify-content: flex-start !important;
  text-align: left !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
  position: relative !important; /* 确保定位一致 */
  left: 0 !important; /* 重置任何可能的偏移 */
  right: 0 !important;
}

/* Element Plus按钮重置样式 */

.topic-item:hover {
  background: var(--home-hover-bg, rgba(255, 255, 255, 0.05)) !important;
  color: var(--text-primary, #e6edf3) !important;
  transform: translateX(4px);
  border: 1px solid var(--home-hover-border, rgba(255, 255, 255, 0.1)) !important;
}

.topic-icon {
  font-size: 12px;
  opacity: 0.8;
  flex-shrink: 0; /* 防止图标被压缩 */
}

.topic-item span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0; /* 允许flex项目收缩到比内容更小 */
  max-width: calc(100% - 24px); /* 为图标留出空间 */
  display: block; /* 确保span表现为块级元素 */
}

.topic-item.active .topic-icon {
  opacity: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chapter-header {
    padding: 10px 8px;
  }

  .topic-item {
    padding: 8px 10px;
  }

  .topic-list {
    margin-left: 16px;
    padding-left: 8px;
  }
}
</style>
