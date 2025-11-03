<template>
  <div class="password-strength">
    <div class="strength-bar">
      <div :class="passwordStrength.level" class="strength-fill"></div>
    </div>
    <div :class="passwordStrength.level" class="strength-text">
      {{ passwordStrength.text }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  password: string
}

const props = defineProps<Props>()
const { t } = useI18n()

const passwordStrength = computed(() => {
  const password = props.password

  if (!password) {
    return {
      level: 'none',
      score: 0,
      text: '',
      suggestions: [],
    }
  }

  let score = 0
  const suggestions: string[] = []

  // 长度检查
  if (password.length >= 8) {
    score += 20
  } else {
    suggestions.push(t('auth.passwordStrength.suggestions.length'))
  }

  // 小写字母
  if (/[a-z]/.test(password)) {
    score += 20
  } else {
    suggestions.push(t('auth.passwordStrength.suggestions.lowercase'))
  }

  // 大写字母
  if (/[A-Z]/.test(password)) {
    score += 20
  } else {
    suggestions.push(t('auth.passwordStrength.suggestions.uppercase'))
  }

  // 数字
  if (/\d/.test(password)) {
    score += 20
  } else {
    suggestions.push(t('auth.passwordStrength.suggestions.numbers'))
  }

  // 特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 20
  } else {
    suggestions.push(t('auth.passwordStrength.suggestions.symbols'))
  }

  // 确定强度等级
  let level: string
  let text: string

  if (score === 0) {
    level = 'none'
    text = ''
  } else if (score <= 20) {
    level = 'weak'
    text = t('auth.passwordStrength.weak')
  } else if (score <= 40) {
    level = 'fair'
    text = t('auth.passwordStrength.fair')
  } else if (score <= 80) {
    level = 'medium'
    text = t('auth.passwordStrength.medium')
  } else {
    level = 'strong'
    text = t('auth.passwordStrength.strong')
  }

  return {
    level,
    score,
    text,
    suggestions: suggestions.slice(0, 3), // 最多显示3个建议
  }
})
</script>

<style lang="scss" scoped>
.password-strength {
  margin-top: 8px;
  width: 100%;

  .strength-bar {
    height: 4px;
    width: 100%;
    background: var(--bg-secondary);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 8px;

    .strength-fill {
      height: 100%;
      border-radius: 2px;
      transition: all 0.3s ease;

      &.none {
        width: 0%;
        background: transparent;
      }
      &.weak {
        width: 25%;
        background: var(--error-color);
      }
      &.fair {
        width: 50%;
        background: var(--warning-color);
      }
      &.medium {
        width: 75%;
        background: #409eff;
      }
      &.strong {
        width: 100%;
        background: var(--success-color);
      }
    }
  }

  .strength-text {
    font-size: 12px;
    transition: color 0.3s ease;
    cursor: help;

    &.none {
      color: var(--text-tertiary);
    }
    &.weak {
      color: var(--error-color);
    }
    &.fair {
      color: var(--warning-color);
    }
    &.medium {
      color: #409eff;
    }
    &.strong {
      color: var(--success-color);
    }
  }
}
</style>
