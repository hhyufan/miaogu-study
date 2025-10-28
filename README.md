# miaogu-study

这是一个前端项目，基于 Vue 3 框架开发，支持 TypeScript、国际化（i18n）、Mock 数据服务以及主题切换功能。

## 项目特性
- 使用 Vue 3 + TypeScript + Vite 构建
- 支持国际化（中英文）
- 集成 Pinia 状态管理
- 支持主题切换（暗黑/明亮模式）
- 使用 Vue Router 实现路由管理
- 集成 Mock 数据服务，便于开发测试
- 支持单元测试（Vitest）和端到端测试（Playwright）

## 推荐开发环境
- IDE: VS Code
- 浏览器: 最新版 Chrome/Firefox/Edge

## 项目结构概览
- `src/main.ts`：项目入口文件
- `src/router/index.ts`：路由配置
- `src/stores/`：Pinia 存储模块（计数器、用户信息、主题、语言等）
- `src/components/`：Vue 组件
- `src/views/`：页面视图组件
- `src/api/`：网络请求封装
- `src/mock/`：Mock 数据服务
- `src/i18n/`：国际化支持
- `src/assets/`：静态资源文件
- `public/`：公共资源（如图片、图标等）

## 安装与运行

### 安装依赖
```bash
npm install
```

### 开发模式（带热重载）
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 启动本地服务器运行生产版本
```bash
npm run preview
```

## 测试

### 单元测试
```bash
npm run test:unit
```

### 端到端测试
```bash
npm run test:e2e
```

#### 常用测试命令
- 运行所有端到端测试：
  ```bash
  npm run test:e2e
  ```
- 仅运行 Chromium 浏览器测试：
  ```bash
  npm run test:e2e:chromium
  ```
- 运行特定文件的测试：
  ```bash
  npm run test:e2e -- -g "文件名"
  ```
- 调试模式运行测试：
  ```bash
  npm run test:e2e:debug
  ```

### 代码检查与格式化
```bash
npm run lint
```

## 其他工具
- Prettier：代码格式化配置
- ESLint：代码规范检查
- Vitest：单元测试框架
- Playwright：端到端测试框架

## 许可证
本项目使用 MIT 许可证。详情请参见 [LICENSE](LICENSE) 文件。