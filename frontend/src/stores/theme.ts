import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<'light' | 'dark'>('light')

  const isDark = computed(() => currentTheme.value === 'dark')

  // 切换主题
  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
    updateBodyClass()
    localStorage.setItem('theme', currentTheme.value)
  }

  // 设置主题
  const setTheme = (theme: 'light' | 'dark') => {
    currentTheme.value = theme
    updateBodyClass()
    localStorage.setItem('theme', theme)
  }

  // 更新body类名和data-theme属性
  const updateBodyClass = () => {
    document.body.className = document.body.className.replace(/theme-\w+/g, '')
    document.body.classList.add(`theme-${currentTheme.value}`)
    // 设置data-theme属性以使用variables.css中的主题变量
    document.documentElement.setAttribute('data-theme', currentTheme.value)
  }

  // 初始化主题
  const initTheme = () => {
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
    setTheme(savedTheme)
  }

  return {
    currentTheme,
    isDark,
    toggleTheme,
    setTheme,
    initTheme,
  }
})
