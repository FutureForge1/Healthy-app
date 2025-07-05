//主页，就是登录完一进去的那个页面

<template>
  <div class="layout-container">
    <!-- 新的侧边栏 -->
    <Sidebar :collapsed="isCollapsed" @toggle="handleSidebarToggle" />
    
    <!-- 主内容区域 -->
    <div class="main-container" :class="{ 'sidebar-collapsed': isCollapsed }">
      <!-- 顶部导航栏 -->
      <header class="layout-header">
        <div class="header-left">
          <button class="menu-toggle" @click="toggleSidebar">
            <el-icon>
              <Menu />
            </el-icon>
          </button>
          <div class="breadcrumb-section">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/app/dashboard' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-for="item in breadcrumbItems" :key="item.path" :to="{ path: item.path }">
                {{ item.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
        
        <div class="header-right">
          <!-- 搜索框 -->
          <div class="search-box">
            <el-input
              v-model="searchQuery"
              placeholder="搜索功能..."
              :prefix-icon="Search"
              size="default"
              style="width: 240px"
              @keyup.enter="handleSearch"
            />
          </div>
          
          <!-- 通知 -->
          <div class="notification-btn">
            <el-badge :value="notificationCount" :hidden="notificationCount === 0">
              <el-button :icon="Bell" circle />
            </el-badge>
          </div>
          
          <!-- 用户信息 -->
          <el-dropdown @command="handleUserCommand" trigger="click">
            <div class="user-info">
              <el-avatar :size="36" :src="userStore.userInfo?.avatar">
                {{ userStore.userInfo?.username?.charAt(0) }}
              </el-avatar>
              <div class="user-details">
                <span class="username">{{ userStore.userInfo?.realName || userStore.userInfo?.username }}</span>
                <span class="user-role">{{ getRoleText(userStore.userInfo?.role) }}</span>
              </div>
              <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人资料
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  系统设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- 主内容区 -->
      <main class="layout-main">
        <div class="main-content">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import Sidebar from '@/components/Sidebar.vue'
import {
  Menu,
  ArrowDown,
  Search,
  Bell,
  User,
  Setting,
  SwitchButton
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const isCollapsed = ref(false)
const searchQuery = ref('')
const notificationCount = ref(3)

// 计算属性
const breadcrumbItems = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const items = []
  
  for (let i = 1; i < pathSegments.length; i++) {
    const path = '/' + pathSegments.slice(0, i + 1).join('/')
    const name = getBreadcrumbName(pathSegments[i])
    if (name) {
      items.push({ path, name })
    }
  }
  
  return items
})

// 方法
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleSidebarToggle = (collapsed) => {
  isCollapsed.value = collapsed
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    ElMessage.info(`搜索功能开发中: ${searchQuery.value}`)
  }
}

const handleUserCommand = async (command) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人资料功能开发中')
      break
    case 'settings':
      ElMessage.info('系统设置功能开发中')
      break
    case 'logout':
      try {
        await ElMessageBox.confirm(
          '确定要退出登录吗？',
          '退出确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        await userStore.logout()
        ElMessage.success('退出登录成功')
        router.push('/login')
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('退出登录失败')
        }
      }
      break
  }
}

const getBreadcrumbName = (segment) => {
  const nameMap = {
    'app': '应用',
    'dashboard': '仪表盘',
    'map': '3D地图',
    'statistics': '统计分析',
    'population': '人口统计',
    'institution': '医疗机构',
    'personnel': '医护人员',
    'bed': '床位统计',
    'service': '医疗服务',
    'cost': '医疗费用',
    'visualization': '数据可视化',
    'charts': '图表管理',
    'data': '数据管理',
    'import-export': '导入导出',
    'quality-check': '质量检查',
    'system': '系统管理',
    'users': '用户管理',
    'roles': '角色管理',
    'menus': '菜单管理',
    'audit': '日志审计',
    'operation-logs': '操作日志'
  }
  return nameMap[segment]
}

const getRoleText = (role) => {
  const roleMap = {
    'ADMIN': '系统管理员',
    'ANALYST': '数据分析师',
    'AUDITOR': '审计员',
    'RESEARCHER': '研究员',
    'VISITOR': '访客'
  }
  return roleMap[role] || '未知角色'
}
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  background: #f5f7fa;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-container.sidebar-collapsed {
  /* 折叠状态下不需要额外的边距 */
}

/* 顶部导航栏 */
.layout-header {
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e6e8eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  position: relative;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-toggle {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #606266;
  transition: all 0.3s ease;
}

.menu-toggle:hover {
  background: #f5f7fa;
  color: #409eff;
}

.breadcrumb-section {
  font-size: 14px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  position: relative;
}

.notification-btn {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-info:hover {
  background: #f5f7fa;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  line-height: 1.2;
}

.user-role {
  font-size: 12px;
  color: #909399;
  line-height: 1.2;
}

.dropdown-icon {
  color: #909399;
  transition: transform 0.3s ease;
}

.user-info:hover .dropdown-icon {
  transform: rotate(180deg);
}

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
