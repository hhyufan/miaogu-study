<template>
  <div class="about-container">
    <div class="about-card">
      <h1 class="page-title">{{ t('about.title') }}</h1>

      <div v-if="userStore.userInfo" class="user-profile">
        <div class="avatar-section">
          <img
            :alt="userStore.userInfo.username"
            :src="userStore.userInfo.avatar || '/hhyufan.jpg'"
            class="user-avatar"
          />
        </div>

        <div class="info-section">
          <div class="info-item">
            <label>{{ t('about.username') }}</label>
            <div class="info-value">{{ userStore.userInfo.username }}</div>
          </div>

          <div class="info-item">
            <label>{{ t('about.email') }}</label>
            <div class="info-value">{{ userStore.userInfo.email }}</div>
          </div>

          <div v-if="userStore.userInfo.phone" class="info-item">
            <label>{{ t('about.phone') }}</label>
            <div class="info-value">{{ userStore.userInfo.phone }}</div>
          </div>

          <div class="info-item">
            <label>{{ t('about.userId') }}</label>
            <div class="info-value">#{{ userStore.userInfo.id }}</div>
          </div>
        </div>

        <div class="actions">
          <el-button size="large" type="danger" @click="handleLogout">
            <IconSwitchButton class="app-icon app-icon--md" />
            {{ t('about.logout') }}
          </el-button>
        </div>
      </div>

      <div v-else class="no-user">
        <p>{{ t('about.noUserInfo') }}</p>
        <router-link class="btn btn-primary" to="/auth">{{ t('about.goToLogin') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
// 全局注册的图标组件无需导入
import { useI18n } from 'vue-i18n'
import { IconSwitchButton } from '@/components/icons'

const userStore = useUserStore()
const router = useRouter()
const { t } = useI18n()

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(t('about.logoutConfirm'), t('common.confirm'), {
      confirmButtonText: t('about.confirm'),
      cancelButtonText: t('about.cancel'),
      type: 'warning',
    })

    userStore.logout()
    ElMessage.success(t('messages.logoutSuccess'))
    await router.push('/auth')
  } catch {
    // 用户取消操作
  }
}
</script>

<style lang="scss" scoped>
// 提取公共变量（颜色、间距、圆角等，便于统一维护）
$bg-gradient: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
$card-bg: white;
$card-radius: 20px;
$shadow-primary: 0 20px 40px rgba(0, 0, 0, 0.1);
$text-primary: #333;
$text-secondary: #666;
$border-light: #e9ecef;
$border-medium: #e0e6ed;
$bg-light: #f8f9fa;
$gap-large: 30px;
$gap-medium: 20px;
$gap-small: 15px;
$gap-xs: 8px;
$padding-large: 40px;
$padding-medium: 30px;
$padding-base: 20px;
$padding-sm: 12px;

.about-container {
  min-height: 100vh;
  background: $bg-gradient;
  padding: $padding-base;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  .about-card {
    background: $card-bg;
    border-radius: $card-radius;
    padding: $padding-large;
    box-shadow: $shadow-primary;
    max-width: 600px;
    width: 100%;
    box-sizing: border-box;

    .page-title {
      text-align: center;
      color: $text-primary;
      margin-bottom: $gap-large;
      font-size: 2.5rem;
      font-weight: 600;
    }

    .user-profile {
      display: flex;
      flex-direction: column;
      gap: $gap-large;

      .avatar-section {
        text-align: center;

        .user-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid $border-medium;
          margin-bottom: 15px;
        }
      }

      .info-section {
        flex: 1;
        display: grid;
        gap: $gap-medium;

        .info-item {
          display: flex;
          flex-direction: column;
          gap: $gap-xs;

          label {
            font-weight: 600;
            color: $text-secondary;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .info-value {
            background: $bg-light;
            padding: $padding-sm 16px;
            border-radius: 8px;
            border: 2px solid $border-light;
            font-size: 1.1rem;
            color: $text-primary;
            box-sizing: border-box;
          }
        }
      }

      .actions {
        display: flex;
        gap: $gap-small;
        justify-content: center;
        flex-wrap: wrap;
      }
    }

    .no-user {
      text-align: center;
      padding: $padding-large $padding-base;

      p {
        color: $text-secondary;
        font-size: 1.2rem;
        margin-bottom: $gap-medium;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .about-container {
    .about-card {
      padding: $padding-medium $padding-base;

      .page-title {
        font-size: 2rem;
      }

      .user-profile {
        .avatar-section {
          .user-avatar {
            width: 100px;
            height: 100px;
          }
        }

        .actions {
          flex-direction: column;
        }
      }
    }
  }
}
</style>
