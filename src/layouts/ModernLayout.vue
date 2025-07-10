//主页，就是登录完一进去的那个页面

<template>
  <div class="layout-container">
    <!-- 新的侧边栏 -->
    <Sidebar :collapsed="isCollapsed" @toggle="handleSidebarToggle" />
    
    <!-- 主内容区域 -->
    <div class="main-container" :class="{ 'sidebar-collapsed': isCollapsed }">
      <!-- 现代化顶部导航栏 -->
      <ModernHeader @toggle-sidebar="toggleSidebar" />

      <!-- 主内容区 -->
      <main class="layout-main">
        <div class="main-content">
          <router-view />
        </div>
      </main>
    </div>

    <!-- 聊天机器人选择器 -->
    <ChatSelector
      v-if="shouldShowChat"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import Sidebar from '@/components/Sidebar.vue'
import ModernHeader from '@/components/ModernHeader.vue'
import ChatSelector from '@/components/ChatSelector.vue'
import tarsService from '@/services/tarsService'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const isCollapsed = ref(false)

// TARS聊天相关
const tarsConvid = ref('WbpUav') // 您的TARS conversation ID
const shouldShowChat = computed(() => {
  // 在除了首页、登录、注册页面之外的所有页面显示聊天
  const excludePages = ['/', '/login', '/register']
  return !excludePages.includes(route.path)
})

// 方法
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleSidebarToggle = (collapsed) => {
  isCollapsed.value = collapsed
}

// 搜索和用户命令处理已移至 ModernHeader 组件

// 面包屑和角色处理已移至 ModernHeader 组件

// 生命周期
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  // 初始化TARS服务
  tarsService.init()
  console.log('TARS智能助手已启用')
})

onUnmounted(() => {
  // 清理TARS服务
  tarsService.destroy()
})
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  background: #f5f7fa;
  overflow: hidden; /* 防止整体滚动 */
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 0; /* 允许内容区域收缩 */
  overflow: hidden; /* 防止内容溢出 */
}

.main-container.sidebar-collapsed {
  /* 折叠状态下不需要额外的边距 */
}

/* 旧的头部样式已移除，现在使用 ModernHeader 组件 */

/* 主内容区 */
.layout-main {
  flex: 1;
  overflow: auto;
  background: #f5f7fa;
}

.main-content {
  padding: 24px;
  min-height: calc(100vh - 64px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-container {
    /* 移动端不需要左边距 */
  }

  .main-container.sidebar-collapsed {
    /* 移动端折叠状态不需要左边距 */
  }
  
  .breadcrumb-section {
    display: none;
  }
  
  .search-box {
    display: none;
  }
  
  .user-details {
    display: none;
  }
}

/* Element Plus 样式覆盖 */
:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: #409eff;
  font-weight: 500;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-badge__content) {
  background: #f56c6c;
  border: none;
}
</style>
