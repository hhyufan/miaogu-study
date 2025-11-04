<template>
  <div class="markdown-demo">
    <h1>Vue Markdown Viewer Demo</h1>
    
    <div class="demo-controls">
      <el-button @click="toggleContent" type="primary">
        {{ showSampleContent ? 'Show Simple Content' : 'Show Sample Content' }}
      </el-button>
      <el-button @click="toggleDarkMode" type="info">
        {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
      </el-button>
    </div>

    <div class="demo-container" :class="{ dark: isDarkMode }">
      <MarkdownViewer 
        :content="currentContent" 
        :is-header-visible="true"
        file-name="demo.md"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MarkdownViewer from './MarkdownViewer.vue'

const isDarkMode = ref(false)
const showSampleContent = ref(true)

const sampleContent = `# Vue Markdown Viewer Demo

This is a **Vue 3** implementation of the Markdown viewer that was originally built with React.

## Features

- ✅ **Syntax highlighting** with Prism.js
- ✅ **Mermaid diagrams** support
- ✅ **Dark/Light theme** support
- ✅ **Code block language labels**
- ✅ **Copy code functionality**
- ✅ **Zoom with Ctrl+Scroll**
- ✅ **Back to top button**
- ✅ **Table support**
- ✅ **Image support**

## Code Example

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('Vue');
\`\`\`

## Mermaid Diagram Example

\`\`\`mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> E[Fix Issues]
    E --> B
    C --> F[Deploy]
\`\`\`

## Table Example

| Feature | React Version | Vue Version |
|---------|---------------|-------------|
| Syntax Highlighting | ✅ | ✅ |
| Mermaid Diagrams | ✅ | ✅ |
| Theme Support | ✅ | ✅ |
| Code Copy | ✅ | ✅ |

## Blockquote Example

> This is a blockquote showing how the Vue version handles different markdown elements.
> The styling is preserved from the original React implementation.

## Inline Code

You can use \`inline code\` within paragraphs, and it will be styled appropriately.

## Lists

### Unordered List
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

### Ordered List
1. First step
2. Second step
3. Third step

---

*Converted from React to Vue 3 while maintaining the same design and functionality.*`

const simpleContent = `# Simple Markdown Example

This is a basic markdown example to show the Vue component working.

\`\`\`python
print("Hello from Vue!")
\`\`\`

**Bold text** and *italic text* work great!
`

const currentContent = computed(() => {
  return showSampleContent.value ? sampleContent : simpleContent
})

const toggleContent = () => {
  showSampleContent.value = !showSampleContent.value
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  
  // Toggle dark class on document element
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
</script>

<style scoped>
.markdown-demo {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-controls {
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
}

.demo-container {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  min-height: 600px;
}

.demo-container.dark {
  background: #1f2937;
  border-color: #374151;
  color: #d1d5db;
}

h1 {
  margin-bottom: 2rem;
  color: #1f2937;
}

.dark h1 {
  color: #f9fafb;
}
</style>