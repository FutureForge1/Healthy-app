<template>
  <div class="layout-container">
    <!-- 顶部导航栏 -->
    <el-header class="layout-header">
      <div class="header-left">
        <el-icon class="menu-toggle" @click="toggleSidebar">
          <Menu />
        </el-icon>
        <h1 class="app-title">健康大数据平台</h1>
      </div>
      
      <div class="header-right">
        <!-- 用户信息 -->
        <el-dropdown @command="handleUserCommand">
          <div class="user-info">
            <el-avatar :size="32" :src="userStore.userInfo?.avatar">
              {{ userStore.userInfo?.username?.charAt(0) }}
            </el-avatar>
            <span class="username">{{ userStore.userInfo?.username }}</span>
            <el-icon><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人资料</el-dropdown-item>
              <el-dropdown-item command="settings">系统设置</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-container class="layout-body">
      <!-- 侧边栏 -->
      <el-aside :width="sidebarWidth" class="layout-sidebar">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapsed"
          :unique-opened="true"
          router
          class="sidebar-menu"
        >
          <!-- 仪表盘 -->
          <el-menu-item index="/app/dashboard" v-if="hasPermission(['ADMIN', 'ANALYST', 'AUDITOR', 'RESEARCHER'])">
            <el-icon><Odometer /></el-icon>
            <template #title>仪表盘</template>
          </el-menu-item>

          <!-- 3D地图 -->
          <el-menu-item index="/app/map" v-if="hasPermission(['ADMIN', 'ANALYST', 'RESEARCHER'])">
            <el-icon><MapLocation /></el-icon>
            <template #title>成都3D地图</template>
          </el-menu-item>

          <!-- 统计分析 -->
          <el-sub-menu index="statistics" v-if="hasPermission(['ADMIN', 'ANALYST', 'RESEARCHER'])">
            <template #title>
              <el-icon><DataAnalysis /></el-icon>
              <span>统计分析</span>
            </template>
            <el-menu-item index="/app/statistics/population">人口统计</el-menu-item>
            <el-menu-item index="/app/statistics/institution">医疗机构统计</el-menu-item>
          </el-sub-menu>

          <!-- 数据可视化 -->
          <el-menu-item index="/app/visualization/charts" v-if="hasPermission(['ADMIN', 'ANALYST', 'RESEARCHER'])">
            <el-icon><PieChart /></el-icon>
            <template #title>图表管理</template>
          </el-menu-item>

          <!-- 数据管理 -->
          <el-sub-menu index="data" v-if="hasPermission(['ADMIN', 'ANALYST'])">
            <template #title>
              <el-icon><FolderOpened /></el-icon>
              <span>数据管理</span>
            </template>
            <el-menu-item index="/app/data">数据管理</el-menu-item>
            <el-menu-item index="/app/data/import-export">数据导入导出</el-menu-item>
            <el-menu-item index="/app/data/quality-check">数据质量检查</el-menu-item>
          </el-sub-menu>

          <!-- 系统管理 -->
          <el-sub-menu index="system" v-if="hasPermission(['ADMIN'])">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系统管理</span>
            </template>
            <el-menu-item index="/app/system/users">用户管理</el-menu-item>
            <el-menu-item index="/app/system/roles">角色管理</el-menu-item>
            <el-menu-item index="/app/system/menus">菜单管理</el-menu-item>
          </el-sub-menu>

          <!-- 日志审计 -->
          <el-sub-menu index="audit" v-if="hasPermission(['ADMIN', 'AUDITOR'])">
            <template #title>
              <el-icon><Document /></el-icon>
              <span>日志审计</span>
            </template>
            <el-menu-item index="/app/audit">审计系统</el-menu-item>
            <el-menu-item index="/app/audit/operation-logs">操作日志</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-main class="layout-main">
        <div class="main-content">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Menu,
  ArrowDown,
  Odometer,
  MapLocation,
  DataAnalysis,
  PieChart,
  FolderOpened,
  Setting,
  Document
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 侧边栏状态
const isCollapsed = ref(false)
const sidebarWidth = computed(() => isCollapsed.value ? '64px' : '240px')

// 当前激活的菜单
const activeMenu = computed(() => route.path)

// 切换侧边栏
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

// 权限检查
const hasPermission = (roles) => {
  const userRole = userStore.userInfo?.role
  return roles.includes(userRole)
}

// 用户操作处理
const handleUserCommand = async (command) => {
  switch (command) {
    case 'profile':
      // 跳转到个人资料页面
      break
    case 'settings':
      // 跳转到系统设置页面
      break
    case 'logout':
      try {
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await userStore.logout()
        ElMessage.success('退出登录成功')
        router.push('/login')
      } catch (error) {
        // 用户取消操作
      }
      break
  }
}

// 监听路由变化，更新页面标题
watch(
  () => route.meta.title,
  (title) => {
    if (title) {
      document.title = `${title} - 健康大数据平台`
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.layout-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-toggle {
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.menu-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.app-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.username {
  font-size: 14px;
  font-weight: 500;
}

.layout-body {
  flex: 1;
  overflow: hidden;
}

.layout-sidebar {
  background: #fff;
  border-right: 1px solid #e6e6e6;
  transition: width 0.3s;
  overflow: hidden;
}

.sidebar-menu {
  border: none;
  height: 100%;
}

.layout-main {
  background: #f5f7fa;
  padding: 0;
  overflow: auto;
}

.main-content {
  padding: 20px;
  min-height: calc(100vh - 60px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-title {
    display: none;
  }
  
  .username {
    display: none;
  }
}
</style>
