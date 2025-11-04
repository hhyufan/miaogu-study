<template>
  <div
    ref="containerRef"
    class="markdown-viewer-container"
    :data-theme="themeStore.currentTheme"
    :style="{
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      paddingTop: isHeaderVisible ? '40px' : '0px',
      paddingRight: '80px',
      zoom: zoomLevel,
      overflow: 'auto'
    }
"
  >
    <div ref="markdownContainerRef">
      <component :is="renderedVnode" />
    </div>

    <!-- Back to top button -->
    <el-button
      v-if="showBackToTop && content"
      type="primary"
      circle
      :icon="Top"
      @click="scrollToTop"
      :style="{
        position: 'fixed',
        bottom: '40px',
        right: '20px',
        zIndex: 1000
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { Top } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import MarkdownIt from 'markdown-it'
import Prism from 'prismjs'
// 按需加载常用语言（Vue 用 markup-templating 增强 HTML 即可）
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-markdown'
// markup-templating 已内置在 prismjs 完整包，无需额外引入
import { useThemeStore } from '@/stores/theme'

/* 迁移自 md_react 的设计变量 */
const FONT_FAMILY = "'Poppins', sans-serif"
const CODE_FONT_FAMILY = "'Fira Code', 'Monaco', 'Consolas', monospace"

const BORDER_RADIUS_LG = '12px'
const BORDER_RADIUS_SM = '4px'
const CODE_BORDER = '1px solid var(--border-color)'

// 动态加载 Prism 主题：One Light / One Dark
import oneLightUrl from 'prism-themes/themes/prism-one-light.css?url'
import oneDarkUrl from 'prism-themes/themes/prism-one-dark.css?url'
interface Props {
  content: string
  fileName?: string
  currentFolder?: string
  onClose?: () => void
  openFile?: (path: string) => void
  isHeaderVisible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fileName: '',
  currentFolder: '',
  isHeaderVisible: true
})

const { t } = useI18n()
const containerRef = ref<HTMLElement>()
const markdownContainerRef = ref<HTMLElement>()
const zoomLevel = ref(1)
const showBackToTop = ref(false)
const themeStore = useThemeStore()
const prismLinkEl = ref<HTMLLinkElement | null>(null)

// Language display mapping
const LANGUAGE_DISPLAY_MAP: Record<string, string> = {
  html: 'HTML',
  xml: 'XML',
  sql: 'SQL',
  css: 'CSS',
  cpp: 'C++',
  sass: 'Sass',
  scss: 'Sass',
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  py: 'Python',
  python: 'Python',
  php: 'PHP',
  md: 'Markdown',
  yml: 'YAML',
  yaml: 'YAML',
  json: 'JSON',
  rb: 'Ruby',
  java: 'Java',
  c: 'C',
  go: 'Go',
  rust: 'Rust',
  kotlin: 'Kotlin',
  swift: 'Swift',
  mermaid: 'Mermaid'
}

// Process markdown content
const processedContent = computed(() => {
  if (!props.content) return ''
  // For now, simple content processing - can add footnote parsing later
  return props.content
})

// Markdown-it instance
const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
  highlight: (str: string, lang: string) => {
    try {
      if (lang && Prism.languages[lang]) {
        return `<pre class="language-${lang}"><code class="language-${lang}">` +
          Prism.highlight(str, Prism.languages[lang] || Prism.languages.markup, lang) +
          '</code></pre>'
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      // ignore
    }
    return `<pre class="language-text"><code>` + str.replace(/[&<>]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[s] as string)) + '</code></pre>'
  }
})

// 完整 tokens -> VNode 渲染器
function tokens2Vnode(tokens: any[]): any[] {
  const vnodes: any[] = []
  let i = 0
  while (i < tokens.length) {
    const t = tokens[i]
    // ---- heading ----
    if (t.type === 'heading_open') {
      const level = Number(t.tag.slice(1))
      const content = tokens[++i].content
      vnodes.push(h('h' + level, {
        style: {
          fontSize: level === 1 ? '2rem' : level === 2 ? '1.5rem' : '1.25rem',
          fontWeight: 'bold',
          margin: '1.2em 0 0.6em',
          lineHeight: 1.2,
          fontFamily: FONT_FAMILY,
          color: isDarkMode.value ? '#f9fafb' : '#111827',
          borderBottom: level === 1 ? `2px solid ${isDarkMode.value ? '#374151' : '#e5e7eb'}` : 'none',
          paddingBottom: level === 1 ? '0.5rem' : '0'
        }
      }, content))
      i++ // skip heading_close
    }
    // ---- paragraph ----
    else if (t.type === 'paragraph_open') {
      const children: any[] = []
      i++ // skip paragraph_open
      while (tokens[i].type !== 'paragraph_close') {
        children.push(...renderInlineTokens(tokens, i))
        i++
      }
      vnodes.push(h('p', {
        style: { lineHeight: 1.8, margin: '1em 0', fontFamily: FONT_FAMILY }
      }, children))
      i++ // skip paragraph_close
    }
    // ---- code fence ----
    else if (t.type === 'fence') {
      const lang = t.info || 'text'
      const displayLang = getDisplayLanguage(lang)
      const highlighted = md.options.highlight!(t.content, lang)
      vnodes.push(
        h('div', { style: { margin: '1.2em 0' } }, [
          h('div', {
            style: {
              position: 'relative',
              borderRadius: BORDER_RADIUS_LG,
              overflow: 'hidden'
            }
          }, [
            h('div', {
              innerHTML: highlighted.replace(/<pre/, `<pre style="border:${CODE_BORDER};border-radius:${BORDER_RADIUS_LG}"`)
            }),
            displayLang !== 'Text' && h('button', {
              class: 'lang-tag',
              onClick: () => handleCopyToClipboard(t.content)
            }, displayLang)
          ])
        ])
      )
      i++ // skip fence
    }
    // ---- bullet list ----
    else if (t.type === 'bullet_list_open') {
      const items: any[] = []
      i++ // skip list_open
      while (tokens[i].type !== 'bullet_list_close') {
        if (tokens[i].type === 'list_item_open') {
          const children: any[] = []
          i++ // skip list_item_open
          while (tokens[i].type !== 'list_item_close') {
            children.push(...renderInlineTokens(tokens, i))
            i++
          }
          items.push(h('li', {
            style: { lineHeight: 1.8, margin: '0.4em 0', fontFamily: FONT_FAMILY }
          }, children))
          i++ // skip list_item_close
        } else i++
      }
      vnodes.push(h('ul', { style: { paddingLeft: '1.5em' } }, items))
      i++ // skip list_close
    }
    // ---- ordered list ----
    else if (t.type === 'ordered_list_open') {
      const items: any[] = []
      i++ // skip ordered_list_open
      while (tokens[i].type !== 'ordered_list_close') {
        if (tokens[i].type === 'list_item_open') {
          const children: any[] = []
          i++ // skip list_item_open
          while (tokens[i].type !== 'list_item_close') {
            children.push(...renderInlineTokens(tokens, i))
            i++
          }
          items.push(h('li', {
            style: { lineHeight: 1.8, margin: '0.4em 0', fontFamily: FONT_FAMILY }
          }, children))
          i++ // skip list_item_close
        } else i++
      }
      vnodes.push(h('ol', { style: { paddingLeft: '1.5em' } }, items))
      i++ // skip ordered_list_close
    }
    // ---- blockquote ----
    else if (t.type === 'blockquote_open') {
      const children: any[] = []
      i++ // skip blockquote_open
      while (tokens[i].type !== 'blockquote_close') {
        if (tokens[i].type === 'paragraph_open') {
          const pChildren: any[] = []
          i++ // skip paragraph_open
          while (tokens[i].type !== 'paragraph_close') {
            pChildren.push(...renderInlineTokens(tokens, i))
            i++
          }
          children.push(h('p', { style: { margin: '0.5em 0' } }, pChildren))
          i++ // skip paragraph_close
        } else i++
      }
      vnodes.push(h('blockquote', {
        style: {
          borderLeft: `4px solid ${isDarkMode.value ? '#4b5563' : '#d1d5db'}`,
          paddingLeft: '1em',
          margin: '1em 0',
          color: isDarkMode.value ? '#9ca3af' : '#6b7280',
          fontFamily: FONT_FAMILY
        }
      }, children))
      i++ // skip blockquote_close
    }
    // ---- table ----
    else if (t.type === 'table_open') {
      const rows: any[] = []
      i++ // skip table_open
      while (tokens[i].type !== 'table_close') {
        if (tokens[i].type === 'thead_open' || tokens[i].type === 'tbody_open') {
          i++ // skip thead/tbody open
          while (!['thead_close', 'tbody_close'].includes(tokens[i].type)) {
            if (tokens[i].type === 'tr_open') {
              const cells: any[] = []
              i++ // skip tr_open
              while (tokens[i].type !== 'tr_close') {
                if (tokens[i].type === 'th_open' || tokens[i].type === 'td_open') {
                  const tag = tokens[i].type === 'th_open' ? 'th' : 'td'
                  const children: any[] = []
                  i++ // skip cell_open
                  while (tokens[i].type !== `${tag}_close`) {
                    children.push(...renderInlineTokens(tokens, i))
                    i++
                  }
                  cells.push(h(tag, {
                    style: {
                      border: `1px solid ${isDarkMode.value ? '#374151' : '#e5e7eb'}`,
                      padding: '6px 8px',
                      fontFamily: FONT_FAMILY
                    }
                  }, children))
                  i++ // skip cell_close
                } else i++
              }
              rows.push(h('tr', {}, cells))
              i++ // skip tr_close
            } else i++
          }
          i++ // skip thead/tbody close
        } else i++
      }
      vnodes.push(h('table', {
        style: {
          width: '100%',
          borderCollapse: 'collapse',
          margin: '1em 0',
          fontFamily: FONT_FAMILY
        }
      }, rows))
      i++ // skip table_close
    }
    // ---- mermaid ----
    else if (t.type === 'fence' && t.info === 'mermaid') {
      // vnodes.push(h(MermaidRenderer, { content: t.content }))
      // TODO：Mermaid未实现
      i++ // skip fence
    }
    // ---- 普通 text（无 block 包裹）----
    else if (t.type === 'text') {
      vnodes.push(h('span', { style: { fontFamily: FONT_FAMILY } }, t.content))
      i++
    }
    // ---- 其他未识别 token 直接跳过 ----
    else i++
  }
  return vnodes
}

// 渲染行内令牌（text、code_inline、strong、em、link、image 等）
function renderInlineTokens(tokens: any[], idx: number): any[] {
  const res: any[] = []
  const inline = tokens[idx].children || []
  for (let j = 0; j < inline.length; j++) {
    const it = inline[j]
    if (it.type === 'text') res.push(it.content)
    else if (it.type === 'code_inline') {
      res.push(h('code', {
        style: {
          background: isDarkMode.value ? '#1f2937' : '#f3f4f6',
          color: isDarkMode.value ? '#e5e7eb' : '#374151',
          padding: '2px 4px',
          borderRadius: BORDER_RADIUS_SM,
          fontFamily: CODE_FONT_FAMILY
        }
      }, it.content))
    } else if (it.type === 'strong_open') {
      const txt: string[] = []
      j++
      while (inline[j].type !== 'strong_close') {
        txt.push(inline[j].type === 'text' ? inline[j].content : '')
        j++
      }
      res.push(h('strong', {}, txt.join('')))
    } else if (it.type === 'em_open') {
      const txt: string[] = []
      j++
      while (inline[j].type !== 'em_close') {
        txt.push(inline[j].type === 'text' ? inline[j].content : '')
        j++
      }
      res.push(h('em', {}, txt.join('')))
    } else if (it.type === 'link_open') {
      const href = it.attrGet('href') || '#'
      const txt: string[] = []
      j++
      while (inline[j].type !== 'link_close') {
        txt.push(inline[j].type === 'text' ? inline[j].content : '')
        j++
      }
      res.push(h('a', {
        href,
        onClick: (e: Event) => handleLinkClick(href, e),
        style: { color: isDarkMode.value ? '#60a5fa' : '#2563eb', textDecoration: 'underline' }
      }, txt.join('')))
    } else if (it.type === 'image') {
      const src = it.attrGet('src') || ''
      const alt = it.attrGet('alt') || ''
      res.push(h('img', {
        src,
        alt,
        style: { maxWidth: '100%', borderRadius: BORDER_RADIUS_SM }
      }))
    }
  }
  return res
}

const renderedVnode = computed(() => {
  const tokens = md.parse(processedContent.value, {})
  return h('div', {}, tokens2Vnode(tokens))
})

// Vue 语言后备映射：若未加载 vue 语法，则回退到 HTML(markup)
if (!Prism.languages.vue && Prism.languages.markup) {
  Prism.languages.vue = Prism.languages.markup
}
// Get display language name
const getDisplayLanguage = (langKey: string = '') => {
  const lowerLang = langKey.toLowerCase()

  if (LANGUAGE_DISPLAY_MAP[lowerLang]) {
    return LANGUAGE_DISPLAY_MAP[lowerLang]
  }

  // Handle versioned languages like python3, cpp17
  const versionMatch = lowerLang.match(/^(\D+)(\d+)$/)
  if (versionMatch) {
    return `${(versionMatch[1] || '').charAt(0).toUpperCase()}${(versionMatch[1] || '').slice(1)} ${versionMatch[2] || ''}`
  }

  return langKey.charAt(0).toUpperCase() + langKey.slice(1)
}

// Copy to clipboard
const handleCopyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success(t('messages.success.copiedToClipboard') || 'Copied to clipboard')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    ElMessage.error(t('messages.error.copyFailed') || 'Copy failed')
  }
}

// Handle link clicks
const handleLinkClick = async (href: string, event: Event) => {
  event.preventDefault()
  event.stopPropagation()

  if (href && href.startsWith('#')) {
    // Handle anchor links
    const targetId = href.substring(1)
    const targetElement = containerRef.value?.querySelector('#' + targetId)
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  } else if (href && props.openFile) {
    // Handle file links - simplified version
    console.log('Opening file:', href)
  }
}

// Highlight code blocks
const highlightCode = () => {
  if (markdownContainerRef.value) {
    Prism.highlightAllUnder(markdownContainerRef.value)
  }
}

// Add language labels to code blocks
const addLanguageLabels = () => {
  if (!markdownContainerRef.value) return

  // Remove existing labels
  const existingLabels = markdownContainerRef.value.querySelectorAll('.lang-tag')
  existingLabels.forEach(label => label.remove())

  // Add new labels
  const codeBlocks = markdownContainerRef.value.querySelectorAll('pre code')
  codeBlocks.forEach((code) => {
    const pre = code.closest('pre')
    if (!pre) return

    // Extract language from class
    const langClass = [...code.classList].find((c) => c.startsWith('language-'))
    const rawLang = langClass ? langClass.split('-')[1] || '' : ''
    const displayLang = getDisplayLanguage(rawLang)

    if (displayLang && displayLang !== 'Text') {
      // Create language tag
      const tag = document.createElement('button')
      tag.className = 'lang-tag'
      tag.textContent = displayLang

      // Add click event to copy code
      tag.addEventListener('click', () => {
        handleCopyToClipboard(code.textContent || '')
      })

      // Style the pre element
      pre.style.position = 'relative'
      pre.appendChild(tag)
    }
  })
}

// Process markdown after rendering
const processMarkdown = () => {
  nextTick(() => {
    highlightCode()
    addLanguageLabels()
  })
}

// Scroll to top
const scrollToTop = () => {
  if (containerRef.value) {
    containerRef.value.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Handle scroll
const handleScroll = () => {
  if (containerRef.value) {
    const scrollTop = containerRef.value.scrollTop
    showBackToTop.value = scrollTop > 300
  }
}

// Handle wheel for zoom
const handleWheel = (e: WheelEvent) => {
  if (e.ctrlKey) {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    const newZoom = zoomLevel.value + delta
    zoomLevel.value = Math.max(0.5, Math.min(3, newZoom))
  }
}

// Handle keyboard shortcuts
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === '/' && props.onClose) {
    event.preventDefault()
    props.onClose()
  }
}

// Computed property for dark mode
const isDarkMode = computed(() => themeStore.isDark)

// 根据主题动态注入 Prism 代码高亮样式（One Dark / One Light）
const applyPrismTheme = (theme: 'light' | 'dark') => {
  const href = theme === 'dark' ? oneDarkUrl : oneLightUrl
  if (!prismLinkEl.value) {
    const linkEl = document.createElement('link')
    linkEl.id = 'prism-theme-link'
    linkEl.rel = 'stylesheet'
    document.head.appendChild(linkEl)
    prismLinkEl.value = linkEl
  }
  if (prismLinkEl.value) {
    prismLinkEl.value.href = href
  }
}

// Watch for content changes
watch(() => props.content, () => {
  processMarkdown()
})

// Lifecycle hooks
onMounted(() => {
  processMarkdown()
  // 初始注入正确的代码高亮主题
  applyPrismTheme(themeStore.currentTheme)

  // Add event listeners
  if (containerRef.value) {
    containerRef.value.addEventListener('wheel', handleWheel, { passive: false })
    containerRef.value.addEventListener('scroll', handleScroll, { passive: true })
  }

  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  // Remove event listeners
  if (containerRef.value) {
    containerRef.value.removeEventListener('wheel', handleWheel)
    containerRef.value.removeEventListener('scroll', handleScroll)
  }

  document.removeEventListener('keydown', handleKeyDown)
  // 清理注入的样式
  if (prismLinkEl.value) {
    prismLinkEl.value.remove()
    prismLinkEl.value = null
  }
})

// 监听主题变化，动态切换代码高亮主题
watch(() => themeStore.currentTheme, (theme) => {
  applyPrismTheme(theme)
  // 主题切换后重新高亮，以确保样式刷新
  nextTick(() => {
    highlightCode()
  })
})
</script>

<style scoped>
.markdown-viewer-container {
  font-family: 'Poppins', sans-serif;
}

/* Language tag 样式：与 HomeViewer 的 tag 风格一致 */
:deep(.lang-tag) {
  position: absolute;
  top: 8px;
  right: 8px;
  border: 1px solid rgba(88, 166, 255, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  z-index: 10;
  /* 浅色模式：淡蓝底、蓝色文字 */
  background: rgba(88, 166, 255, 0.1) !important;
  color: #58a6ff !important;
}

/* 语言标签不随主题变化，统一淡蓝色 */

:deep(.lang-tag:hover) {
  filter: brightness(1.05);
}

/* 让 Prism 主题控制背景与前景色，这里仅保留结构与排版 */
:deep(pre) {
  position: relative;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1rem 0;
  font-family: 'JetBrains Mono', 'Fira Code', 'Fira Mono', Consolas, Menlo, Courier, monospace;
}

:deep(code) {
  font-family: 'JetBrains Mono', 'Fira Code', 'Fira Mono', Consolas, Menlo, Courier, monospace;
}

:deep(pre code) {
  background: none;
  padding: 0;
  border-radius: 0;
  color: inherit;
  font-size: inherit;
}

/* Dark mode 下的非块级内联 code 轻微适配，避免与 Prism 冲突 */
:deep([data-theme="dark"] .markdown-viewer-container) {
  color: #d1d5db;
}

:deep([data-theme="dark"] code:not(pre code)) {
  background: #1f2937;
  color: #9ca3af;
}
</style>
