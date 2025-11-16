<template>
  <svg
    :class="['chevron-icon', { 'expanded': expanded }]"
    viewBox="0 0 24 24"

    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"
      fill="currentColor"
    />
  </svg>
</template>

<script lang="ts" setup>
interface Props {
  expanded?: boolean
}

withDefaults(defineProps<Props>(), {
  expanded: false
})
</script>

<style scoped>
.chevron-icon {
  display: inline-block;
  vertical-align: middle;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.chevron-icon.expanded {
  transform: rotate(90deg);
}
</style>
