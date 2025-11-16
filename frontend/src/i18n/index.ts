import { createI18n } from 'vue-i18n'
import zhCN from '../locales/zh-CN.json'
import enUS from '../locales/en-US.json'

// 获取浏览器语言
const getBrowserLanguage = (): string => {
  const language = navigator.language || (navigator as any).userLanguage
  if (language.includes('zh')) {
    return 'zh-CN'
  }
  return 'en-US'
}

// 从localStorage获取语言设置，如果没有则使用浏览器语言
const getStoredLanguage = (): string => {
  return localStorage.getItem('language') || getBrowserLanguage()
}

const i18n = createI18n({
  legacy: false, // 使用 Composition API
  locale: getStoredLanguage(),
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
})

export default i18n
