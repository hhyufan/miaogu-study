<template>
  <div class="about-container">
    <div class="about-card">
      <h1 class="page-title">个人信息</h1>

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
            <label>用户名</label>
            <div class="info-value">{{ userStore.userInfo.username }}</div>
          </div>

          <div class="info-item">
            <label>邮箱</label>
            <div class="info-value">{{ userStore.userInfo.email }}</div>
          </div>

          <div v-if="userStore.userInfo.phone" class="info-item">
            <label>手机号</label>
            <div class="info-value">{{ userStore.userInfo.phone }}</div>
          </div>

          <div class="info-item">
            <label>用户ID</label>
            <div class="info-value">#{{ userStore.userInfo.id }}</div>
          </div>
        </div>

        <div class="actions">
          <el-button size="large" type="danger" @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>
            退出登录
          </el-button>
        </div>
      </div>

      <div v-else class="no-user">
        <p>未找到用户信息</p>
        <router-link class="btn btn-primary" to="/auth">去登录</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { SwitchButton } from '@element-plus/icons-vue'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    userStore.logout()
    ElMessage.success('已退出登录')
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
