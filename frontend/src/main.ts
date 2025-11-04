import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import i18n from './i18n'

import App from './App.vue'
import router from './router'

// 导入stores
import { useLanguageStore } from './stores/language'
import { useThemeStore } from './stores/theme'

// 导入全局样式
import './styles/variables.css'

// 导入mock数据
import './mock/auth'
import './mock/home'
import './mock/search'

const app = createApp(App)

// 注册所有Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(i18n)

// 初始化stores
const languageStore = useLanguageStore()
const themeStore = useThemeStore()
languageStore.initLanguage()
themeStore.initTheme()

app.mount('#app')
