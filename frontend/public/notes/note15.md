# Composition API 详解

Vue 3 推荐使用 Composition API 来组织逻辑。

## 基本用法

```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const double = computed(() => count.value * 2)
</script>
```

## 优势

- 更好的逻辑复用
- 更清晰的类型支持
- 更易于组织复杂组件

> 本笔记用于演示 Vue 版 Markdown Viewer 的效果。