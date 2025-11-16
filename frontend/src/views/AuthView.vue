<template>
  <div class="auth-container">
    <div class="auth-box">
      <!-- 左侧欢迎区域 -->
      <div class="auth-welcome">
        <div class="welcome-content">
          <div class="logo">
            <IconLogo class="app-icon" style="width: 80px; height: 80px" />
          </div>
          <h1>{{ $t('auth.welcome') }}</h1>
          <p>{{ $t('auth.subtitle') }}</p>

          <!-- 主题和语言切换控件 -->
          <div class="auth-controls">
            <el-button class="control-btn theme-toggle-btn" size="small" text @click="toggleTheme">
              <template #icon>
                <IconSunny v-if="currentTheme === 'light'" class="app-icon app-icon--sm" />
                <IconMoon v-else class="app-icon app-icon--sm" />
              </template>
            </el-button>
            <span class="control-divider">|</span>
            <el-button class="control-btn" size="small" text @click="toggleLanguage">
              {{ currentLanguage === 'zh-CN' ? 'EN' : '中文' }}
            </el-button>
          </div>
        </div>
      </div>

      <!-- 右侧表单区域 -->
      <div class="auth-form-section">
        <!-- 标签切换 -->
        <div
          v-if="activeTab !== 'forgot'"
          :class="{ 'register-active': activeTab === 'register' }"
          class="auth-tabs"
        >
          <div
            :class="{ active: activeTab === 'login' }"
            class="tab-item"
            @click="activeTab = 'login'"
          >
            {{ $t('auth.login') }}
          </div>
          <div
            :class="{ active: activeTab === 'register' }"
            class="tab-item"
            @click="activeTab = 'register'"
          >
            {{ $t('auth.register') }}
          </div>
        </div>

        <!-- 表单容器 -->
        <div class="form-container">
          <!-- 登录表单 -->
          <transition mode="out-in" name="fade">
            <div v-if="activeTab === 'login'" key="login" class="auth-form">
              <el-form
                ref="loginFormRef"
                :model="loginForm"
                :rules="loginRules"
                label-position="top"
                size="large"
                @submit.prevent="handleLogin"
              >
                <el-form-item :label="$t('auth.username')" prop="username">
                  <el-input
                    v-model="loginForm.username"
                    :placeholder="$t('auth.usernamePlaceholder')"
                    :prefix-icon="User"
                  />
                </el-form-item>

                <el-form-item :label="$t('auth.password')" prop="password">
                  <el-input
                    v-model="loginForm.password"
                    :placeholder="$t('auth.passwordPlaceholder')"
                    :prefix-icon="Lock"
                    show-password
                    type="password"
                  />
                </el-form-item>

                <el-form-item>
                  <el-button
                    :loading="loading"
                    native-type="submit"
                    size="large"
                    style="width: 100%"
                    type="primary"
                  >
                    {{ $t('auth.login') }}
                  </el-button>
                </el-form-item>
              </el-form>

              <div class="auth-divider">
                <span>{{ $t('auth.or') }}</span>
              </div>

              <el-button
                class="github-btn"
                size="large"
                style="width: 100%"
                @click="handleGithubAuth"
              >
                <template #icon>
                  <IconGithub class="app-icon app-icon--sm" />
                </template>
                {{ $t('auth.loginWithGithub') }}
              </el-button>

              <div class="auth-footer">
                <el-button class="forgot-link" text type="primary" @click="activeTab = 'forgot'">
                  {{ $t('auth.forgotPassword') }}
                </el-button>
              </div>
            </div>

            <!-- 注册表单 -->
            <div v-else-if="activeTab === 'register'" key="register" class="auth-form">
              <el-form
                ref="registerFormRef"
                :model="registerForm"
                :rules="registerRules"
                label-position="top"
                size="large"
                @submit.prevent="handleRegister"
              >
                <el-form-item :label="$t('auth.username')" prop="username">
                  <el-input
                    v-model="registerForm.username"
                    :placeholder="$t('auth.usernamePlaceholder')"
                    :prefix-icon="User"
                  />
                </el-form-item>

                <el-form-item :label="$t('auth.email')" prop="email">
                  <el-input
                    v-model="registerForm.email"
                    :placeholder="$t('auth.emailPlaceholder')"
                    :prefix-icon="Message"
                  />
                </el-form-item>

                <el-form-item :label="$t('auth.password')" prop="password">
                  <el-input
                    v-model="registerForm.password"
                    :placeholder="$t('auth.passwordPlaceholder')"
                    :prefix-icon="Lock"
                    show-password
                    type="password"
                  />
                  <PasswordStrength :password="registerForm.password" />
                </el-form-item>

                <el-form-item :label="$t('auth.confirmPassword')" prop="confirmPassword">
                  <el-input
                    v-model="registerForm.confirmPassword"
                    :placeholder="$t('auth.confirmPasswordPlaceholder')"
                    :prefix-icon="Lock"
                    show-password
                    type="password"
                  />
                </el-form-item>

                <el-form-item prop="agree">
                  <el-checkbox v-model="registerForm.agree">
                    {{ $t('auth.agreeToTerms') }}
                  </el-checkbox>
                </el-form-item>

                <el-form-item>
                  <el-button
                    :loading="loading"
                    native-type="submit"
                    size="large"
                    style="width: 100%"
                    type="primary"
                  >
                    {{ $t('auth.register') }}
                  </el-button>
                </el-form-item>
              </el-form>
            </div>

            <!-- 忘记密码表单 -->
            <div v-else-if="activeTab === 'forgot'" key="forgot" class="auth-form">
              <el-form
                ref="forgotFormRef"
                :model="forgotForm"
                label-position="top"
                size="large"
                @submit.prevent="handleForgotPassword"
              >
                <el-form-item :label="$t('auth.email')" prop="email">
                  <el-input
                    v-model="forgotForm.email"
                    :placeholder="$t('auth.emailPlaceholder')"
                    :prefix-icon="Message"
                  />
                </el-form-item>

                <el-form-item>
                  <el-button
                    :loading="loading"
                    native-type="submit"
                    size="large"
                    style="width: 100%"
                    type="primary"
                  >
                    {{ $t('auth.sendResetEmail') }}
                  </el-button>
                </el-form-item>
              </el-form>

              <div class="auth-footer">
                <el-button class="back-link" text type="primary" @click="activeTab = 'login'">
                  {{ $t('auth.backToLogin') }}
                </el-button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { Lock, Message, User } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useLanguageStore } from '@/stores/language'
import { useUserStore } from '@/stores/user'
import PasswordStrength from '@/components/PasswordStrength.vue'
import type { ApiResponse } from '@/types/api'
import { login, register } from '@/api/auth'
import { IconGithub, IconLogo, IconMoon, IconSunny } from '@/components/icons'

const { t } = useI18n()
const router = useRouter()
const themeStore = useThemeStore()
const languageStore = useLanguageStore()
const userStore = useUserStore()

// 表单引用
const loginFormRef = ref<FormInstance>()
const registerFormRef = ref<FormInstance>()
const forgotFormRef = ref<FormInstance>()

// 加载状态
const loading = ref(false)

// 当前活动标签
const activeTab = ref<'login' | 'register' | 'forgot'>('login')

// 表单数据
const loginForm = ref({
  username: '',
  email: '',
  password: '',
  remember: false,
})

const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agree: false,
})

const forgotForm = ref({
  email: '',
})

// 表单验证规则
const loginRules: FormRules = {
  username: [
    { required: true, message: () => t('auth.usernameRequired'), trigger: 'blur' },
    { min: 3, message: () => t('auth.usernameMinLength'), trigger: 'blur' },
  ],
  email: [
    { required: true, message: () => t('auth.emailRequired'), trigger: 'blur' },
    { type: 'email', message: () => t('auth.emailInvalid'), trigger: 'blur' },
  ],
  password: [
    { required: true, message: () => t('auth.passwordRequired'), trigger: 'blur' },
    { min: 6, message: () => t('auth.passwordMinLength'), trigger: 'blur' },
  ],
}

const registerRules: FormRules = {
  username: [
    { required: true, message: () => t('auth.usernameRequired'), trigger: 'blur' },
    { min: 3, max: 20, message: () => t('auth.usernameLength'), trigger: 'blur' },
  ],
  email: [
    { required: true, message: () => t('auth.emailRequired'), trigger: 'blur' },
    { type: 'email', message: () => t('auth.emailInvalid'), trigger: 'blur' },
  ],
  password: [
    { required: true, message: () => t('auth.passwordRequired'), trigger: 'blur' },
    { min: 6, message: () => t('auth.passwordLength'), trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: () => t('auth.confirmPasswordRequired'), trigger: 'blur' },
    {
      validator: (_: any, value: any, callback: any) => {
        if (value !== registerForm.value.password) {
          callback(new Error(t('auth.passwordMismatch')))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  agree: [
    {
      validator: (_: any, value: any, callback: any) => {
        if (!value) {
          callback(new Error(t('auth.mustAgreeToTerms')))
        } else {
          callback()
        }
      },
      trigger: 'change',
    },
  ],
}

// 计算属性
const currentTheme = computed(() => themeStore.currentTheme)
const currentLanguage = computed(() => languageStore.currentLanguage)

// 方法
const toggleTheme = () => {
  themeStore.toggleTheme()
}

const toggleLanguage = () => {
  languageStore.toggleLanguage()
}

const switchTab = (tab: 'login' | 'register' | 'forgot') => {
  activeTab.value = tab
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    const valid = await loginFormRef.value.validate()
    if (!valid) return

    loading.value = true

    // 调用登录API
    const axiosResponse = await login({
      username: loginForm.value.username || loginForm.value.email,
      password: loginForm.value.password,
    })
    const response = axiosResponse as unknown as ApiResponse<{ user: any; token: string }>

    if (response.code === 200) {
      // 登录成功，保存用户信息到store
      userStore.login({
        ...response.data.user,
        token: response.data.token,
      })

      ElMessage.success(t('auth.loginSuccess'))

      // 跳转到首页
      await router.push('/')
    } else {
      ElMessage.error(response.message || t('auth.loginFailed'))
    }
  } catch (error) {
    console.error('Login error:', error)
    ElMessage.error(t('auth.loginFailed'))
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  if (!registerFormRef.value) return

  try {
    const valid = await registerFormRef.value.validate()
    if (!valid) return

    if (!registerForm.value.agree) {
      ElMessage.warning(t('auth.mustAgreeToTerms'))
      return
    }

    loading.value = true

    // 调用注册API
    const axiosResponse = await register({
      username: registerForm.value.username,
      email: registerForm.value.email,
      password: registerForm.value.password,
      confirmPassword: registerForm.value.confirmPassword,
      agree: registerForm.value.agree,
    })
    const response = axiosResponse as unknown as ApiResponse

    if (response.code === 200) {
      ElMessage.success(t('auth.registerSuccess'))

      // 注册成功后自动登录并跳转到首页
      if (response.data && response.data.user && response.data.token) {
        userStore.login({
          ...response.data.user,
          token: response.data.token,
        })
        await router.push('/')
      } else {
        // 如果没有返回用户信息，切换到登录页面
        switchTab('login')
      }

      // 清空注册表单
      registerForm.value = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agree: false,
      }
    } else {
      ElMessage.error(response.message || t('auth.registerFailed'))
    }
  } catch (error) {
    console.error('Register error:', error)
    ElMessage.error(t('auth.registerFailed'))
  } finally {
    loading.value = false
  }
}

const handleGithubAuth = () => {
  ElMessage.info(t('auth.githubAuthNotImplemented'))
  // 这里应该处理 GitHub OAuth 登录
}

const handleForgotPassword = async () => {
  if (!forgotFormRef.value) return

  try {
    const valid = await forgotFormRef.value.validate()
    if (!valid) return

    loading.value = true

    // 模拟发送重置邮件请求
    await new Promise((resolve) => setTimeout(resolve, 1000))

    ElMessage.success(t('auth.resetEmailSent'))

    // 这里应该处理实际的密码重置逻辑

    // 发送成功后切换到登录页面
    switchTab('login')
  } catch (error) {
    console.error('Forgot password error:', error)
    ElMessage.error(t('auth.resetEmailFailed'))
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  // 初始化主题和语言
  themeStore.initTheme()
  languageStore.initLanguage()
})
</script>

<style lang="scss" scoped>
/* 认证页面样式 */
.auth-container {
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--page-bg) 0%, var(--bg-secondary) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  top: 0;
  left: 0;
  position: relative;
}

/* 主题和语言切换控件 */
.auth-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  justify-content: center;

  .control-btn {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    padding: 8px 12px;
    cursor: pointer;
    transition: color 0.2s ease;
    font-size: 14px;

    &:hover {
      background-color: transparent !important;
      color: var(--primary-color);
    }

    &.theme-toggle-btn {
      padding: 8px;
      min-width: 36px;
    }
  }

  .control-divider {
    color: var(--text-secondary);
    font-size: 14px;
    margin: 0 4px;
  }

  @media (max-width: 768px) {
    gap: 8px;
    margin-top: 15px;

    .control-btn {
      padding: 6px 10px;
      font-size: 13px;

      &.theme-toggle-btn {
        padding: 6px;
        min-width: 32px;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.auth-box {
  background: var(--card-bg);
  border-radius: 20px;
  box-shadow: var(--el-box-shadow);
  width: 100%;
  max-width: 1000px;
  min-height: 600px;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-light);
  display: flex;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    max-width: 400px;
    min-height: auto;
    margin: 20px;
  }
}

/* 左侧欢迎区域 */
.auth-welcome {
  flex: 1;
  background: var(--card-bg);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  position: relative;
  overflow: hidden;
  border-right: 1px solid var(--border-color);

  .welcome-content {
    text-align: center;
    position: relative;
    z-index: 2;
    max-width: 400px;
  }

  .logo {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    background: var(--el-color-primary-light-9);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(20px);
    border: 1px solid var(--border-color);
    box-shadow: var(--el-box-shadow-light);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: var(--el-box-shadow);
    }

    svg {
      color: var(--el-color-primary);
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
  }

  h1 {
    font-size: 36px;
    font-weight: 700;
    margin: 0 0 16px 0;
    color: var(--text-primary);
  }

  p {
    font-size: 16px;
    margin: 0 0 40px 0;
    line-height: 1.6;
    color: var(--text-secondary);
  }

  .welcome-icons {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-top: 50px;

    .icon-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      opacity: 0.9;
      transition: all 0.4s ease;
      cursor: pointer;

      &:hover {
        opacity: 1;
        transform: translateY(-4px);
      }

      span {
        font-size: 13px;
        font-weight: 600;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        letter-spacing: 0.5px;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 40px 20px;
    min-height: 350px;

    .logo {
      width: 70px;
      height: 70px;
    }

    h1 {
      font-size: 28px;
    }

    p {
      font-size: 14px;
      margin-bottom: 30px;
    }

    .welcome-icons {
      gap: 24px;
      margin-top: 30px;

      .icon-item {

        span {
          font-size: 11px;
        }
      }
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-20px) rotate(1deg);
  }
  66% {
    transform: translateY(-10px) rotate(-1deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.2;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 右侧表单区域 */
.auth-form-section {
  flex: 1;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 40px 30px;
  }
}

/* 标签页切换 */
.auth-tabs {
  position: relative;
  display: flex;
  margin-bottom: 32px;
  border-bottom: 2px solid var(--border-light);

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 50%;
    height: 2px;
    background: var(--primary-color);
    transition: transform 0.3s ease;
    transform: translateX(0);
  }

  &.register-active::after {
    transform: translateX(100%);
  }

  .tab-item {
    flex: 1;
    padding: 16px 20px;
    text-align: center;
    cursor: pointer;
    font-weight: 500;
    color: var(--text-secondary);
    transition: all 0.3s ease;
    position: relative;
    background: transparent;
    border: none;

    &.active {
      color: var(--primary-color);
    }

    &:hover:not(.active) {
      color: var(--primary-hover);
    }
  }
}

/* 表单容器 */
.form-container {
  position: relative;
  overflow: auto;

  .form-content {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    &.slide-enter-active,
    &.slide-leave-active {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &.slide-enter-from {
      opacity: 0;
      transform: translateX(30px);
    }

    &.slide-leave-to {
      opacity: 0;
      transform: translateX(-30px);
    }
  }
}

/* 表单样式 */
.auth-form {
  .form-item {
    margin-bottom: 20px;

    .el-form-item__label {
      color: var(--text-primary);
      font-weight: 500;
    }

    .el-input {
      .el-input__wrapper {
        background-color: var(--input-bg);
        border: 1px solid var(--input-border);
        border-radius: 8px;
        padding: 12px 16px;
        transition: all 0.3s ease;

        &:hover {
          border-color: var(--primary-hover);
        }

        &.is-focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
        }
      }

      .el-input__inner {
        color: var(--text-primary);
        font-size: 14px;

        &::placeholder {
          color: var(--text-tertiary);
        }
      }
    }

    .el-checkbox {
      .el-checkbox__label {
        color: var(--text-secondary);
        font-size: 14px;
      }

      .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: var(--primary-color);
        border-color: var(--primary-color);
      }
    }
  }

  .submit-button {
    width: 100%;
    height: 44px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    margin-top: 8px;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
    border: none;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(64, 158, 255, 0.4);
    }

    &:active {
      transform: translateY(0);
    }

    &.is-loading {
      opacity: 0.8;
    }
  }
}

/* 密码强度组件样式 */
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
        width: 0;
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

  .strength-tips {
    font-size: 12px;
    color: var(--text-tertiary);
    margin-top: 4px;
    line-height: 1.4;
  }
}

/* 分隔线 */
.divider {
  position: relative;
  text-align: center;
  margin: 24px 0;
  color: var(--text-tertiary);
  font-size: 14px;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--border-light);
  }

  span {
    background: var(--card-bg);
    padding: 0 16px;
    position: relative;
    z-index: 1;
  }
}

/* GitHub 登录按钮 */
.github-button {
  width: 100%;
  height: 44px;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-primary);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  margin-bottom: 24px;

  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

/* 底部链接 */
.auth-footer {
  text-align: center;
  margin-top: 24px;

  .footer-link {
    color: var(--primary-color);
    text-decoration: none;
    font-size: 14px;
    transition: all 0.3s ease;

    &:hover {
      color: var(--primary-hover);
      text-decoration: underline;
    }
  }

  .footer-text {
    color: var(--text-secondary);
    font-size: 14px;
    margin: 0 8px;
  }
}

/* Element Plus 组件样式覆盖 */
.el-message {
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.el-notification {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .auth-container {
    padding: 10px;
  }

  .auth-box {
    padding: 24px 20px;
  }

  .auth-header {
    margin-bottom: 24px;

    .logo {
      width: 56px;
      height: 56px;
      font-size: 24px;
    }

    .title {
      font-size: 24px;
    }
  }

  .auth-tabs {
    margin-bottom: 24px;

    .tab-item {
      padding: 10px 12px;
      font-size: 14px;
    }
  }

  .auth-form {
    .form-item {
      margin-bottom: 16px;
    }

    .submit-button {
      height: 40px;
      font-size: 14px;
    }
  }

  .github-button {
    height: 40px;
    font-size: 14px;
  }
}

/* 分割线样式 */
.auth-divider {
  position: relative;
  text-align: center;
  margin: 24px 0;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border-color) 20%, var(--border-color) 80%, transparent);
    transform: translateY(-50%);
  }

  span {
    display: inline-block;
    padding: 0 16px;
    background: var(--card-bg);
    color: var(--text-tertiary);
    font-size: 14px;
    font-weight: 500;
    position: relative;
    z-index: 1;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: calc(100% + 8px);
      height: calc(100% + 4px);
      background: var(--card-bg);
      border-radius: 12px;
      z-index: -1;
      opacity: 0.9;
    }
  }

  &:hover span {
    color: var(--text-secondary);
    transform: scale(1.05);
    transition: all 0.3s ease;
  }
}

/* 动画效果 */
@keyframes Rise {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-box {
  animation: Rise 0.6s ease-out;
}

/* 加载状态 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  z-index: 100;

  [data-theme="dark"] & {
    background: rgba(31, 31, 31, 0.8);
  }
}
</style>
