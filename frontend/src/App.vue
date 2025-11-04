<script lang="ts" setup>
import { RouterView, useRoute } from 'vue-router'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import AppHeader from './components/AppHeader.vue'

const route = useRoute()

// 判断是否为Auth页面
const isAuthPage = computed(() => route.name === 'auth')

// 侧边栏状态
const sidebarVisible = ref(false)

// 处理侧边栏切换
const handleSidebarToggle = () => {
  sidebarVisible.value = !sidebarVisible.value
}

// 监听侧边栏切换事件
onMounted(() => {
  window.addEventListener('toggle-sidebar', handleSidebarToggle)
})

onUnmounted(() => {
  window.removeEventListener('toggle-sidebar', handleSidebarToggle)
})
</script>

<template>
  <div id="app">
    <!-- 只在非Auth页面显示header -->
    <AppHeader v-if="!isAuthPage" />

    <div :class="{ 'main-wrapper': true, 'with-header': !isAuthPage }">
      <RouterView />
    </div>
  </div>

</template>

<style scoped>
* {
  box-sizing: border-box;
}
#app{
  width: 100vw;
  height: 100vh;
}
body, html {
  margin: 0;
  padding: 0;
  width: 100%;
}

.main-wrapper {
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.main-wrapper.with-header {
  padding-top: 60px;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
