<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <div class="error-message">页面未找到</div>
      <div class="error-description">
        抱歉，您访问的页面不存在或已被移除
      </div>
      <div class="actions">
        <el-button type="primary" @click="goHome">
          返回首页
        </el-button>
        <el-button @click="goBack">
          返回上页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.not-found-content {
  text-align: center;
  padding: 40px;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  margin-bottom: 20px;
  opacity: 0.8;
}

.error-message {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 16px;
}

.error-description {
  font-size: 16px;
  margin-bottom: 40px;
  opacity: 0.9;
}

.actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}
</style>
