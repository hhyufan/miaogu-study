<template>
  <div class="welcome-container">
    <div class="welcome-card">
      <h1 class="welcome-title">欢迎回来！</h1>
      <div v-if="userStore.userInfo" class="user-info">
        <div class="avatar-section">
          <img
            :alt="userStore.userInfo.username"
            :src="userStore.userInfo.avatar || '/hhyufan.jpg'"
            class="user-avatar"
          />
        </div>
        <div class="info-section">
          <h2>{{ userStore.userInfo.username }}</h2>
          <p class="user-email">{{ userStore.userInfo.email }}</p>
          <p v-if="userStore.userInfo.phone" class="user-phone">{{ userStore.userInfo.phone }}</p>
        </div>
      </div>

      <div class="actions">
        <el-button size="large" type="success" @click="$router.push('/')">
          <el-icon><House /></el-icon>
          进入首页
        </el-button>
        <el-button size="large" type="info" @click="$router.push('/about')">
          <el-icon><User /></el-icon>
          查看个人信息
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { House, User } from '@element-plus/icons-vue'

const userStore = useUserStore()
const router = useRouter()
</script>

<style scoped>
.welcome-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.welcome-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.welcome-title {
  color: #333;
  margin-bottom: 30px;
  font-size: 2.5rem;
  font-weight: 600;
}

.user-info {
  margin-bottom: 30px;
}

.avatar-section {
  margin-bottom: 20px;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e0e6ed;
}

.info-section h2 {
  color: #333;
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.user-email,
.user-phone {
  color: #666;
  margin: 5px 0;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .welcome-card {
    padding: 30px 20px;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .actions {
    flex-direction: column;
  }
}
</style>
