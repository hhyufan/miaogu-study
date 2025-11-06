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

<style scoped>
.about-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.about-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
}

.page-title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2.5rem;
  font-weight: 600;
}

.user-profile {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.avatar-section {
  text-align: center;
}

.user-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e0e6ed;
  margin-bottom: 15px;
}

.info-section {
  flex: 1;
  display: grid;
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item label {
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.info-value {
  background: #f8f9fa;
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  font-size: 1.1rem;
  color: #333;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.no-user {
  text-align: center;
  padding: 40px 20px;
}

.no-user p {
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .about-card {
    padding: 30px 20px;
  }

  .page-title {
    font-size: 2rem;
  }

  .user-avatar {
    width: 100px;
    height: 100px;
  }

  .actions {
    flex-direction: column;
  }
}
</style>
