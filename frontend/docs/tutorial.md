# 项目开发规范与教程

>**项目规范事项** ：
>1. 页面放到views目录，组件放到components目录，图标以svg矢量图的形式放到components/icons目录
>2. 使用mock.js模拟后端数据响应，写好mock响应和axios api数据请求，数据存放到src目录下的data。
>3. 使用TypeScript作为前端语言，请按照Ts规范声明好类型
>4. 需要持久化的状态数据请使用pinia进行读写。
>5. 涉及到文字硬编码，请使用i18n方法并定义好json中英配置。
>6. 颜色相关样式请使用styles目录中的variables.css的css变量，做好主题适配
>7. 尽可能规避eslint警告

### 1. 准备数据

**a. 静态数据**  
在 `src/data/report.json` 写入：
```json
[
  { "id": 1, "title": "Week 1", "score": 92 },
  { "id": 2, "title": "Week 2", "score": 88 }
]
```

**b. 类型声明**  
在 `src/types/report.ts` 写入：
```typescript
export interface ReportItem {
  id: number
  title: string
  score: number
}
```

### 2. 编写 API 与 Mock

**a. API 封装**  `src/api/report.ts`
```typescript
import request from './request'
import type { ReportItem } from '@/types/report'

export const getReport = () =>
  request.get<ReportItem[]>('/api/report')
```

**b. Mock 拦截**  `src/mock/report.ts`
```typescript
import Mock from 'mockjs'
import reportData from '@/data/report.json'

Mock.mock('/api/report', 'get', () => ({
  code: 200,
  message: 'ok',
  data: reportData
}))
```

**c. 注册 mock**  在 `src/mock/index.ts` 追加：
```typescript
import './report'
```

### 3. 创建页面组件

`src/views/ReportView.vue`
```vue
<template>
  <div class="report-container">
    <h1>{{ $t('report.title') }}</h1>
    <div v-for="r in reportList" :key="r.id" class="card">
      <span>{{ r.title }}</span>
      <el-tag :type="r.score >= 90 ? 'success' : 'warning'">
        {{ r.score }}
      </el-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getReport } from '@/api/report'
import type { ReportItem } from '@/types/report'

const reportList = ref<ReportItem[]>([])

onMounted(async () => {
  const res = await getReport()
  reportList.value = res.data
})
</script>

<style scoped>
.report-container {
  padding: 24px;
  background: var(--color-background);
  color: var(--color-text);
}
</style>
```

### 4. 配置路由

在 `src/router/index.ts` 追加：
```typescript
{
  path: '/report',
  name: 'report',
  component: () => import('@/views/ReportView.vue'),
  meta: { requiresAuth: true }
}
```

### 5. 国际化

`src/locales/zh-CN.json`
```json
{
  "report": {
    "title": "学习报告"
  }
}
```

`src/locales/en-US.json`
```json
{
  "report": {
    "title": "Study Report"
  }
}
```

### 6. 主题变量（可选）

如需新增色值，在 `src/styles/variables.css` 追加：
```css
:root {
  --color-report-primary: #409eff;
}
```

并在深色主题下覆盖：
```css
[data-theme="dark"] {
  --color-report-primary: #79bbff;
}
```

### 7. 组件开发细则

1. 文件名：PascalCase，与组件名一致，如 `IconArrowLeft.vue`。
2. props 必须显式声明类型：
   ```typescript
   defineProps<{
     size?: 'small' | 'medium' | 'large'
   }>()
   ```
3. 事件名使用 camelCase，如 `update:modelValue`。
4. 样式作用域：统一使用 `<style scoped>`，避免全局污染。
5. 颜色/字号统一引用 CSS 变量，禁止硬编码色值。

### 8.图标规范

1. 仅使用 SVG 矢量图，放在 `src/components/icons`。
2. 命名：`Icon<语义名>.vue`，如 `IconPlus.vue`。
3. 模板结构示例：
   ```vue
   <template>
     <svg viewBox="0 0 24 24" fill="currentColor" v-bind="$attrs">
       <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
     </svg>
   </template>
   ```
4. 支持 `size` prop（默认 1em）与当前文字颜色继承。

### 9.Pinia 状态模板

`src/stores/report.ts`
```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ReportItem } from '@/types/report'

export const useReportStore = defineStore('report', () => {
  const list = ref<ReportItem[]>([])

  function setList(data: ReportItem[]) {
    list.value = data
  }

  return { list, setList }
})
```

页面内使用：
```typescript
import { useReportStore } from '@/stores/report'
const reportStore = useReportStore()
reportStore.setList(res.data)
```

### 10.ESLint 规避清单

1. 禁用 `any`：使用显式类型或 `unknown` + 类型守卫。
2. 禁用 `@ts-ignore`：优先补全类型声明。
3. 禁止使用 `console.log`：使用封装后的日志工具（如 `useLogger()`）。
4. 禁止使用 `var`，统一 `const` / `let`。
5. 组件文件末尾保留一行空行（prettier 自动处理）。


按本教程执行即可保持项目结构一致、类型安全、主题/国际化完备，且零 ESLint 警告。