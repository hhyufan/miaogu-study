<template>
  <div
    v-if="loading"
    :class="`mermaid-container ${isDarkMode ? 'dark' : 'light'}`"
    style="padding: 16px"
  >
    <div :class="`skeleton-wrapper ${isDarkMode ? 'dark' : 'light'}`">
      <el-skeleton :rows="4" animated />
    </div>
  </div>

  <div v-else-if="error" class="mermaid-container">
    <el-alert
      :title="t('mermaid.renderFailed')"
      :description="error"
      type="error"
      :show-icon="true"
      :style="{
        backgroundColor: isDarkMode ? '#21262d' : '#fff2f0',
        borderColor: isDarkMode ? '#f85149' : '#ffccc7',
        color: isDarkMode ? '#f85149' : '#ff4d4f'
      }"
    />
  </div>

  <div
    v-else
    :class="`mermaid-container ${isDarkMode ? 'dark' : 'light'}`"
    ref="elementRef"
    v-html="svgContent"
    :style="{
      textAlign: 'center',
      padding: '16px',
      backgroundColor: isDarkMode ? '#0d1117' : '#ffffff',
      borderRadius: '8px',
      border: `1px solid ${isDarkMode ? '#30363d' : '#e1e4e8'}`
    }"
  />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import mermaid from 'mermaid'
import { useI18n } from 'vue-i18n'

interface Props {
  code: string
  isDarkMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isDarkMode: false
})

const { t } = useI18n()
const elementRef = ref<HTMLElement>()
const loading = ref(true)
const error = ref<string | null>(null)
const svgContent = ref('')

/* 暴露常量给模板 v-bind */
const GLASS_LIGHT = {
  bg: 'rgba(255, 255, 255, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.2)'
}
const GLASS_DARK = {
  bg: 'rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.1)'
}
const CARD_SHADOW_LIGHT = '0 8px 32px rgba(0, 0, 0, 0.1)'
const CARD_SHADOW_DARK  = '0 8px 32px rgba(0, 0, 0, 0.3)'
const BORDER_RADIUS_LG = '12px'
const BORDER_RADIUS_SM = '4px'

// Initialize mermaid configuration
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
  fontSize: 14,
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis'
  },
  sequence: {
    diagramMarginX: 50,
    diagramMarginY: 10,
    actorMargin: 50,
    width: 150,
    height: 65,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
    mirrorActors: true,
    bottomMarginAdj: 1,
    useMaxWidth: true,
    rightAngles: false,
    showSequenceNumbers: false
  },
  gantt: {
    titleTopMargin: 25,
    barHeight: 20,
    fontSize: 11,
    gridLineStartPadding: 35,
    leftPadding: 75,
    topPadding: 50,
    rightPadding: 25
  }
})

const renderMermaid = async () => {
  if (!props.code) return

  loading.value = true
  error.value = null

  // Add delay to prevent immediate rendering
  setTimeout(async () => {
    try {
      // Update theme based on dark mode
      mermaid.initialize({
        theme: props.isDarkMode ? 'dark' : 'default',
        startOnLoad: false,
        securityLevel: 'loose',
        fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace'
      })

      const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
      const { svg } = await mermaid.render(id, props.code)
      svgContent.value = svg
      loading.value = false
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to render Mermaid diagram'
      loading.value = false
    }
  }, 500)
}

// Watch for changes in code or dark mode
watch([() => props.code, () => props.isDarkMode], () => {
  renderMermaid()
})

onMounted(() => {
  renderMermaid()
})
</script>

<style scoped>
/* Mermaid 渲染器样式 */
.mermaid-container {
  width: 100%;
  overflow-x: auto;
  margin: 16px 0;
  /* 毛玻璃背景效果 - 亮色主题 */
  background: v-bind('GLASS_LIGHT.bg') !important;
  border: v-bind('GLASS_LIGHT.border') !important;
  box-shadow: v-bind('CARD_SHADOW_LIGHT') !important;
  border-radius: v-bind('BORDER_RADIUS_LG') !important;
  padding: 1em;
}

/* 暗黑主题下的样式调整 */
.mermaid-container.dark {
  background: v-bind('GLASS_DARK.bg') !important;
  border: v-bind('GLASS_DARK.border') !important;
  box-shadow: v-bind('CARD_SHADOW_DARK') !important;
}

.mermaid-container.dark svg {
  background-color: transparent;
}

/* 节点样式 */
.mermaid-container.dark .node rect,
.mermaid-container.dark .node circle,
.mermaid-container.dark .node ellipse,
.mermaid-container.dark .node polygon {
  fill: #21262d;
  stroke: #30363d;
  stroke-width: 2px;
}

/* 节点文本 */
.mermaid-container.dark .node .label,
.mermaid-container.dark .nodeLabel {
  color: #c9d1d9;
  fill: #c9d1d9;
}

/* 关系线 */
.mermaid-container.dark .edgePath .path {
  stroke: #58a6ff;
  stroke-width: 2px;
}

/* 关系标签 */
.mermaid-container.dark .edgeLabel {
  background-color: #0d1117;
  color: #c9d1d9;
  fill: #c9d1d9;
}

/* 流程图特定样式 */
.mermaid-container.dark .flowchart-link {
  stroke: #58a6ff;
}

/* 序列图特定样式 */
.mermaid-container.dark .actor {
  fill: #21262d;
  stroke: #30363d;
}

.mermaid-container.dark .actor-line {
  stroke: #30363d;
}

.mermaid-container.dark .messageLine0,
.mermaid-container.dark .messageLine1 {
  stroke: #58a6ff;
}

.mermaid-container.dark .messageText {
  fill: #c9d1d9;
}

/* 甘特图特定样式 */
.mermaid-container.dark .section0,
.mermaid-container.dark .section1,
.mermaid-container.dark .section2,
.mermaid-container.dark .section3 {
  fill: #21262d;
}

.mermaid-container.dark .task0,
.mermaid-container.dark .task1,
.mermaid-container.dark .task2,
.mermaid-container.dark .task3 {
  fill: #58a6ff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mermaid-container {
    font-size: 12px;
  }
}

/* 滚动条样式 */
.mermaid-container::-webkit-scrollbar {
  height: 8px;
}

.mermaid-container::-webkit-scrollbar-track {
  background: transparent;
}

.mermaid-container::-webkit-scrollbar-thumb {
  background: #30363d;
  border-radius: v-bind('BORDER_RADIUS_SM') !important;
}

.mermaid-container.dark::-webkit-scrollbar-thumb {
  background: #484f58;
}

.mermaid-container::-webkit-scrollbar-thumb:hover {
  background: #656c76;
}
</style>