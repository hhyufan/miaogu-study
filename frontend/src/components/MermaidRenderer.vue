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
      :description="error"
      :show-icon="true"
      :style="{
        backgroundColor: isDarkMode ? '#21262d' : '#fff2f0',
        borderColor: isDarkMode ? '#f85149' : '#ffccc7',
        color: isDarkMode ? '#f85149' : '#ff4d4f',
      }"
      :title="t('mermaid.renderFailed')"
      type="error"
    />
  </div>

  <div
    v-else
    ref="elementRef"
    :class="`mermaid-container ${isDarkMode ? 'dark' : 'light'}`"
    :style="{
      textAlign: 'center',
      padding: '16px',
      backgroundColor: isDarkMode ? '#0d1117' : '#ffffff',
      borderRadius: '8px',
      border: `1px solid ${isDarkMode ? '#30363d' : '#e1e4e8'}`,
    }"
    v-html="svgContent"
  />
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import mermaid from 'mermaid'
import { useI18n } from 'vue-i18n'

interface Props {
  code: string
  isDarkMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isDarkMode: false,
})

const { t } = useI18n()
const elementRef = ref<HTMLElement>()
const loading = ref(true)
const error = ref<string | null>(null)
const svgContent = ref('')

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
    curve: 'basis',
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
    showSequenceNumbers: false,
  },
  gantt: {
    titleTopMargin: 25,
    barHeight: 20,
    fontSize: 11,
    gridLineStartPadding: 35,
    leftPadding: 75,
    topPadding: 50,
    rightPadding: 25,
  },
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
        fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
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

<style lang="scss" scoped>
// Mermaid 渲染器样式
.mermaid-container {
  width: 100%;
  overflow-x: auto;
  margin: 16px 0;
  padding: 1em;

  // 暗模式样式
  &.dark {
    svg {
      background-color: transparent;
    }

    // 节点样式（暗模式）
    .node {
      rect,
      circle,
      ellipse,
      polygon {
        fill: #21262d;
        stroke: #30363d;
        stroke-width: 2px;
      }
    }
  }

  // 滚动条样式（WebKit 内核）
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #30363d;

    &:hover {
      background: #656c76;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .mermaid-container {
    font-size: 12px;
  }
}
</style>
