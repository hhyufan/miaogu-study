import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import i18n from '@/i18n'

export const useLanguageStore = defineStore('language', () => {
  // 状态
  const language = ref<string>('zh-CN')

  // 计算属性
  const currentLanguage = computed(() => language.value)

  // 动作
  const setLanguage = (lang: string) => {
    language.value = lang
    localStorage.setItem('language', lang)
    // 同步更新i18n实例的locale
    if (i18n.global) {
      i18n.global.locale.value = lang as any
    }
  }

  const toggleLanguage = () => {
    const newLang = language.value === 'zh-CN' ? 'en-US' : 'zh-CN'
    setLanguage(newLang)
  }

  const initLanguage = () => {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) {
      language.value = savedLanguage
      // 同步更新i18n实例的locale
      if (i18n.global) {
        i18n.global.locale.value = savedLanguage as any
      }
    }
  }

  return {
    language,
    currentLanguage,
    setLanguage,
    toggleLanguage,
    initLanguage,
  }
})
