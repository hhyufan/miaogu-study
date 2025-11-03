<template>
  <component :is="currentIcon" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import IconChinese from './IconChinese.vue'
import IconEnglish from './IconEnglish.vue'

interface Props {
  currentLanguage?: 'zh' | 'en'
}

const props = withDefaults(defineProps<Props>(), {
  currentLanguage: 'zh'
})

// 根据当前语言显示对应的图标
const currentIcon = computed(() => {
  return props.currentLanguage === 'zh' ? IconChinese : IconEnglish
})
</script>