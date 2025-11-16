<template>
  <div class="notfound-container">
    <!-- 顶部装饰元素 -->
    <div class="nf-top-decor">
      <div class="nf-deco nf-deco-left"></div>
      <div class="nf-deco nf-deco-right"></div>
    </div>

    <!-- 404 主内容区 -->
    <div class="nf-content">
      <!-- 404 数字动画 -->
      <div class="nf-404-wrap">
        <span class="nf-404"> 404 </span>
      </div>

      <!-- 标题 -->
      <h1 class="nf-title">页面不见了</h1>

      <!-- 描述文本 -->
      <p class="nf-desc">
        抱歉，你访问的页面不存在、已被移除或URL有误。<br class="nf-break" />
        让我们带你回到安全地带吧～
      </p>

      <!-- 操作按钮组 -->
      <div class="nf-actions">
        <button class="btn-primary" @click="goToHome">
          <IconHomeFilled class="app-icon app-icon--md" />
          <span>返回首页</span>
        </button>
        <button class="btn-secondary" @click="goBack">
          <IconArrowLeftBold class="app-icon app-icon--md" />
          <span>返回上一页</span>
        </button>
      </div>
    </div>

    <!-- 浮动装饰元素 -->
    <div class="nf-float-left">
      <div class="nf-dot nf-dot-left"></div>
    </div>
    <div class="nf-float-right">
      <div class="nf-dot nf-dot-right"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { IconArrowLeftBold, IconHomeFilled } from '@/components/icons'

const router = useRouter()

// 返回首页
const goToHome = () => {
  router.push('/')
}

// 返回上一页
const goBack = () => {
  window.history.back()
}

// 页面加载时的动画效果
const initAnimation = () => {
  const elements = document.querySelectorAll('.nf-title, .nf-desc, .nf-actions')
  elements.forEach((el, index) => {
    ;(el as HTMLElement).style.opacity = '0'
    ;(el as HTMLElement).style.transform = 'translateY(20px)'
    ;(el as HTMLElement).style.transition = 'opacity 0.5s ease, transform 0.5s ease'

    setTimeout(
      () => {
        ;(el as HTMLElement).style.opacity = '1'
        ;(el as HTMLElement).style.transform = 'translateY(0)'
      },
      300 + index * 150,
    )
  })
}

// 组件挂载时初始化动画
onMounted(() => {
  initAnimation()
})
</script>

<style lang="scss" scoped>
/* 根容器：渐变背景与居中布局（使用主题变量） */
.notfound-container {
  position: relative;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-image: linear-gradient(135deg, var(--page-bg) 0%, var(--bg-secondary) 100%);
  @media (min-width: 640px) {
    // sm:p-6
    padding: 24px;
  }
  @media (min-width: 768px) {
    // md:p-8
    padding: 32px;
  }
}

.nf-top-decor {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
}

/* 内容容器，替换 relative z-10 text-center max-w-2xl w-full */
.nf-content {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 42rem; // tailwind max-w-2xl
  width: 100%;
}

/* 404 包裹，替换 mb-6 */
.nf-404-wrap {
  margin-bottom: 24px;
}

/* 404 数字的渐变文字效果（主题色） */
.nf-404 {
  font-size: clamp(8rem, 15vw, 15rem);
  background-image: linear-gradient(90deg, var(--home-link-color), var(--home-accent-color));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block; // inline-block
  font-weight: 800; // font-extrabold
  transition: transform 0.7s ease; // transition-transform duration-700
}
.nf-404:hover {
  transform: scale(1.05);
} // hover:scale-105

.nf-title {
  color: var(--text-primary);
  font-size: clamp(2rem, 5vw, 2.5rem); // text-[clamp(...)]
  font-weight: 700; // font-bold
  margin-bottom: 16px; // mb-4
  letter-spacing: -0.025em; // tracking-tight
}
.nf-desc {
  color: var(--text-secondary);
  font-size: 1.125rem; // text-lg
  line-height: 1.625; // leading-relaxed
  margin-bottom: 40px; // mb-10
  @media (min-width: 640px) {
    // sm:text-xl
    font-size: 1.25rem;
  }
}

/* 仅在 sm 及以上显示换行（替换 hidden sm:block） */
.nf-break {
  display: none;
}
@media (min-width: 640px) {
  .nf-break {
    display: block;
  }
}

/* 顶部装饰元素（替换 Tailwind 工具类为常规 CSS） */
.nf-deco {
  position: absolute;
  border-radius: 9999px;
  filter: blur(48px);
}
.nf-deco-left {
  top: -2.5rem; /* 对应 -top-10 */
  left: -2.5rem; /* 对应 -left-10 */
  width: 10rem; /* 对应 w-40 */
  height: 10rem; /* 对应 h-40 */
  background: var(--home-accent-color);
  opacity: 0.2; /* 对应 /20 */
}
.nf-deco-right {
  top: -5rem; /* 对应 -top-20 */
  right: 2.5rem; /* 对应 right-10 */
  width: 15rem; /* 对应 w-60 */
  height: 15rem; /* 对应 h-60 */
  background: var(--home-link-color);
  opacity: 0.2; /* 对应 /20 */
}

/* 操作按钮 */
.nf-actions {
  display: flex;
  flex-direction: column; // flex-col
  gap: 16px; // gap-4
  align-items: center; // items-center
  justify-content: center; // justify-center
  @media (min-width: 640px) {
    // sm:flex-row
    flex-direction: row;
  }
}
.btn-primary {
  padding: 12px 24px;
  border-radius: 999px;
  background-image: linear-gradient(90deg, var(--home-link-color), var(--home-accent-color));
  color: #fff;
  border: none;
  box-shadow: 0 6px 16px var(--shadow-color);
  transition:
    transform 0.2s ease,
    filter 0.2s ease;
  display: flex; // flex
  align-items: center; // items-center
  gap: 8px; // gap-2
}
.btn-primary:hover {
  transform: translateY(-2px);
  filter: brightness(1.06);
}
.btn-secondary {
  padding: 12px 24px;
  border-radius: 999px;
  background: var(--card-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 12px var(--shadow-color);
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
  display: flex; // flex
  align-items: center; // items-center
  gap: 8px; // gap-2
}
.btn-secondary:hover {
  transform: translateY(-2px);
}

/* 底部浮动装饰，替换 absolute/hidden/md/lg/block 等工具类 */
.nf-float-left,
.nf-float-right {
  position: absolute;
  display: none; // hidden
}
.nf-float-left {
  bottom: 5rem; // bottom-20
  left: 2.5rem; // left-10
  @media (min-width: 768px) {
    // md:block
    display: block;
  }
}
.nf-float-right {
  top: 10rem; // top-40
  right: 2.5rem; // right-10
  @media (min-width: 1024px) {
    // lg:block
    display: block;
  }
}
.nf-dot {
  border-radius: 9999px;
  filter: blur(24px); // blur-xl
  animation: pulse 4s ease-in-out infinite; // animate-pulse
}
.nf-dot-left {
  width: 4rem; // w-16
  height: 4rem; // h-16
  background: var(--home-link-color);
  opacity: 0.1; // /10
}
.nf-dot-right {
  width: 5rem; // w-20
  height: 5rem; // h-20
  background: var(--home-accent-color);
  opacity: 0.1; // /10
  animation-duration: 6s; // 对应 style="animation-duration: 6s;"
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
  100% {
    transform: scale(1);
  }
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(107, 114, 128, 0.5);
}

/* 深色模式过渡 */
.dark {
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}
</style>
