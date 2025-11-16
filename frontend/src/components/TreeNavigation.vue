<template>
  <div class="tree-navigation">
    <div class="chapter-list">
      <div v-for="chapter in chapters" :key="chapter.id" class="chapter-item">
        <el-button class="chapter-header" text @click="toggleChapter(chapter.id)">
          <IconChevronRight :expanded="isExpanded(chapter.id)" class="chapter-arrow" />
          <span>{{ chapter.title }}</span>
        </el-button>
        <transition name="slide-fade">
          <div v-show="isExpanded(chapter.id)" :id="`topics-${chapter.id}`" class="topic-list">
            <el-button
              v-for="topic in chapter.topics"
              :key="topic.id"
              :type="selectedTopic === topic.id ? 'primary' : 'default'"
              class="topic-item"
              text
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

<script lang="ts" setup>
import { ref } from 'vue'
import { ElButton } from 'element-plus'
import { IconChevronRight, IconDocument } from '@/components/icons'

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

<style lang="scss" scoped>
// 提取公共变量（复用重复值，便于维护）
$chapter-margin-bottom: 8px;
$topic-margin-bottom: 4px;
$hover-transform: translateX(4px);
$transition-base: all 0.2s ease;

.tree-navigation {
  width: 100%;
  height: 100%;
  flex: 1 1 auto; /* 填满左侧栏剩余空间 */
  overflow: auto; /* 将滚动职责交给树状图自身 */
  box-sizing: border-box; /* 确保盒模型计算正确 */

  .chapter-list {
    margin-top: 16px;

    .chapter-item {
      margin-bottom: $chapter-margin-bottom;

      // 章节头部按钮样式
      .chapter-header {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        text-align: left;
        width: 100%;
        padding: 8px 12px !important;
        margin: 0 !important;
        border-radius: 6px !important;
        border: none !important;
        background: transparent !important;
        color: var(--text-primary, #e6edf3) !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        cursor: pointer;
        user-select: none;
        transition: $transition-base;

        // 箭头图标
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

        // 文字样式
        span {
          font-weight: 600;
          color: var(--text-primary, #e6edf3);
          font-size: 14px;
        }

        //  hover 状态
        &:hover {
          background: var(--home-hover-bg, rgba(255, 255, 255, 0.05)) !important;
          border: 1px solid var(--home-hover-border, rgba(255, 255, 255, 0.1)) !important;
        }
      }

      // 主题列表容器
      .topic-list {
        margin-left: 20px;
        margin-top: 4px;
        padding: 0 8px 0 12px; /* 上右下左内边距 */
        border-left: 2px solid var(--border-light, rgba(255, 255, 255, 0.1));
        overflow: hidden;
        display: flex;
        flex-direction: column;
        gap: 0; /* 移除gap，使用margin-bottom控制间距 */
        width: calc(100% - 42px); /* 调整宽度计算 */
        max-width: calc(100% - 42px);
        box-sizing: border-box;

        // 主题项（Element Plus按钮重置）
        .topic-item {
          display: flex !important;
          align-items: center !important;
          justify-content: flex-start !important;
          text-align: left !important;
          gap: 8px !important;
          padding: 6px 12px !important;
          margin: 0 0 $topic-margin-bottom 0 !important;
          border-radius: 4px !important;
          border: none !important;
          background: transparent !important;
          color: var(--text-secondary, #8b949e) !important;
          font-size: 14px !important;
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important; /* 允许收缩 */
          cursor: pointer !important;
          user-select: none !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
          position: relative !important;
          left: 0 !important;
          right: 0 !important;
          transition: $transition-base !important;

          // 主题图标
          .topic-icon {
            font-size: 12px;
            opacity: 0.8;
            flex-shrink: 0; /* 防止图标被压缩 */
          }

          // 主题文字（超出省略）
          span {
            display: block;
            flex: 1;
            min-width: 0; /* 允许flex项目收缩 */
            max-width: calc(100% - 24px); /* 为图标留出空间 */
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          // hover 状态
          &:hover {
            background: var(--home-hover-bg, rgba(255, 255, 255, 0.05)) !important;
            color: var(--text-primary, #e6edf3) !important;
            transform: $hover-transform;
            border: 1px solid var(--home-hover-border, rgba(255, 255, 255, 0.1)) !important;
          }

          // 激活状态（图标高亮）
          &.active {
            .topic-icon {
              opacity: 1;
            }
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .tree-navigation {
    .chapter-list {
      .chapter-item {
        .chapter-header {
          padding: 10px 8px !important;
        }

        .topic-list {
          margin-left: 16px;
          padding-left: 8px;

          .topic-item {
            padding: 8px 10px !important;
          }
        }
      }
    }
  }
}
</style>
