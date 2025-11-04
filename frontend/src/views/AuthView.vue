<template>
  <div class="auth-container">
    <div class="auth-box">
      <!-- 左侧欢迎区域 -->
      <div class="auth-welcome">
        <div class="welcome-content">
          <div class="logo">
            <IconLogo />
          </div>
          <h1>{{ $t('auth.welcome') }}</h1>
          <p>{{ $t('auth.subtitle') }}</p>

          <!-- 主题和语言切换控件 -->
          <div class="auth-controls">
            <el-button
              :icon="currentTheme === 'light' ? 'Sunny' : 'Moon'"
              class="control-btn theme-toggle-btn"
              size="small"
              text
              @click="toggleTheme"
            />
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
                  <IconGithub />
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
import { IconLogo, IconGithub } from '@/components/icons'

// 导入样式
import '@/styles/auth.scss'

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
  console.log('GitHub auth clicked')
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
    console.log('Forgot password form:', forgotForm.value)

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
@use '@/styles/auth.scss';
</style>
