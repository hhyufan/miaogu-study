import type { App } from 'vue'
// 引入全局图标样式类
import './index.scss'
// 命名导出（SFC 直出），支持组件按需导入
export { default as IconArrowLeftBold } from './IconArrowLeftBold.vue'
export { default as IconChevronRight } from './IconChevronRight.vue'
export { default as IconDocument } from './IconDocument.vue'
export { default as IconGithub } from './IconGithub.vue'
export { default as IconHomeFilled } from './IconHomeFilled.vue'
export { default as IconLanguage } from './IconLanguage.vue'
export { default as IconLogo } from './IconLogo.vue'
export { default as IconMoon } from './IconMoon.vue'
export { default as IconOperation } from './IconOperation.vue'
export { default as IconPlus } from './IconPlus.vue'
export { default as IconQuestionFilled } from './IconQuestionFilled.vue'
export { default as IconSearch } from './IconSearch.vue'
export { default as IconSunny } from './IconSunny.vue'
export { default as IconSwitchButton } from './IconSwitchButton.vue'
export { default as IconUploadFilled } from './IconUploadFilled.vue'
// 通过 Vite 的动态导入，自动注册 src/components/icons 目录下的自定义图标组件
const customIconModules = import.meta.glob('./*.vue', { eager: true }) as Record<string, any>

export default {
  install(app: App) {
    // 注册自定义图标（使用文件名作为组件名，例如 IconPlus）
    Object.entries(customIconModules).forEach(([path, mod]) => {
      const component = mod.default
      if (!component) return
      const filename = path.split('/').pop() || ''
      const name = filename.replace(/\.vue$/i, '')
      app.component(name, component)
    })
  },
}
