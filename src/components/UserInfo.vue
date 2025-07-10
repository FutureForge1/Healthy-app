<template>
  <div class="user-info-card">
    <div class="user-avatar">
      <el-icon><UserFilled /></el-icon>
    </div>
    <div class="user-details">
      <div class="user-name">{{ userInfo.realName || userInfo.username || '未知用户' }}</div>
      <div class="user-role">
        <el-tag :type="getRoleTagType(userInfo.role)" size="small">
          {{ getRoleDisplayName(userInfo.role) }}
        </el-tag>
      </div>
      <div class="user-email" v-if="userInfo.email">{{ userInfo.email }}</div>
    </div>
    <div class="user-actions">
      <el-dropdown @command="handleCommand">
        <el-button type="text" class="action-btn">
          <el-icon><Setting /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人资料</el-dropdown-item>
            <el-dropdown-item command="settings">设置</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UserFilled, Setting } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { ROLE_DISPLAY_NAMES } from '@/utils/permission'

const router = useRouter()
const userStore = useUserStore()

// 计算属性
const userInfo = computed(() => userStore.userInfo)

// 方法
const getRoleDisplayName = (role) => {
  return ROLE_DISPLAY_NAMES[role] || role || '未知角色'
}

const getRoleTagType = (role) => {
  const typeMap = {
    'ADMIN': 'danger',
    'ANALYST': 'warning',
    'VISITOR': 'info'
  }
  return typeMap[role] || 'info'
}

const handleCommand = async (command) => {
  switch (command) {
    case 'profile':
      router.push('/app/profile')
      break
    case 'settings':
      ElMessage.info('设置功能开发中...')
      break
    case 'logout':
      try {
        await ElMessageBox.confirm('确定要退出登录吗？', '确认退出', {
          type: 'warning'
        })
        userStore.logout()
        router.push('/login')
      } catch {
        // 用户取消操作
      }
      break
  }
}
</script>

<style scoped>
.user-info-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.user-info-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  margin-bottom: 2px;
}

.user-email {
  font-size: 12px;
  color: #7f8c8d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-actions {
  display: flex;
  align-items: center;
}

.action-btn {
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #f8f9fa;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-info-card {
    padding: 8px 12px;
    gap: 8px;
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
  
  .user-name {
    font-size: 13px;
  }
  
  .user-email {
    font-size: 11px;
  }
}
</style>
