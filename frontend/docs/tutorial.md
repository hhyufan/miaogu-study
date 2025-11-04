# 项目开发规范与教程

>**项目规范事项** ：
>1. 页面放到views目录，组件放到components目录，图标以svg矢量图的形式放到components/icons目录
>2. 使用mock.js模拟后端数据响应，写好mock响应和axios api数据请求，数据存放到src目录下的data。
>3. 使用TypeScript作为前端语言，请按照Ts规范声明好类型,类型统一管理在src的types目录下。
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

// 与现有 request 拦截器保持一致：返回值为后端的 data 字段
import type { ApiResponse } from '@/types/api'

export const getReport = (): Promise<ReportItem[]> =>
  request.get('/api/report').then((res: any) => {
    const api = res as ApiResponse<ReportItem[]>
    return api.data
  })
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

**c. 注册 mock**  在 `src/main.ts` 追加：
```ts
// 导入其它 mock 后，按同样方式加入
import './mock/report'
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
  reportList.value = res
})
</script>

<style scoped>
.report-container {
  padding: 24px;
  background: var(--page-bg);
  color: var(--text-primary);
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
3. 事件命名：使用语义化事件名，模板中采用 kebab-case（如 `@tab-change`）；v-model 使用约定事件名 `update:modelValue`。
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
4. 图标颜色请继承 `currentColor`，尺寸统一 `width/height: 1em`；如需可选尺寸，可提供 `size` prop 并同步到 `width/height`。

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

如需持久化，请为 store 添加 `persist` 选项（项目已启用 `pinia-plugin-persistedstate`）：
```ts
export const useReportStore = defineStore(
  'report',
  () => { /* ... */ },
  {
    persist: { key: 'report-store', storage: localStorage }
  }
)
```

### 10.ESLint 与代码风格建议

- 尽量避免 `any`：优先显式类型或 `unknown` + 类型守卫（当前项目已关闭强制限制，可在必要场景使用）。
- 避免使用 `@ts-ignore`：补全类型或添加声明文件。
- 清理调试日志：开发中可使用 `console.info`/`console.error`，提交前移除多余 `console.log`；用户提示使用 `ElMessage`。
- 不使用 `var`，统一使用 `const` / `let`。
- 保持格式化一致性：遵循 Prettier，组件文件末尾保留空行。


按本教程执行即可保持项目结构一致、类型安全、主题/国际化完备，且零 ESLint 警告。