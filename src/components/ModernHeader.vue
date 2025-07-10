<template>
  <header class="modern-header">
    <div class="header-container">
      <!-- 左侧区域 -->
      <div class="header-left">
        <!-- 菜单切换按钮 -->
        <button class="menu-toggle-btn" @click="$emit('toggle-sidebar')">
          <el-icon class="menu-icon">
            <Menu />
          </el-icon>
        </button>
        
        <!-- 面包屑导航 -->
        <div class="breadcrumb-wrapper">
          <div class="page-title">{{ currentPageTitle }}</div>
          <div class="breadcrumb-nav">
            <el-breadcrumb separator="/" class="custom-breadcrumb">
              <el-breadcrumb-item>
                <el-icon class="breadcrumb-icon"><House /></el-icon>
                <span @click="navigateTo('/app/dashboard')" class="breadcrumb-link">首页</span>
              </el-breadcrumb-item>
              <el-breadcrumb-item 
                v-for="(item, index) in breadcrumbItems" 
                :key="item.path"
                :class="{ 'is-last': index === breadcrumbItems.length - 1 }"
              >
                <span 
                  v-if="index === breadcrumbItems.length - 1" 
                  class="breadcrumb-current"
                >
                  {{ item.name }}
                </span>
                <span 
                  v-else 
                  @click="navigateTo(item.path)" 
                  class="breadcrumb-link"
                >
                  {{ item.name }}
                </span>
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
      </div>
      
      <!-- 右侧区域 -->
      <div class="header-right">
        <!-- 快捷操作 -->
        <div class="quick-actions">
          <!-- 全局搜索 -->
          <div class="search-container" v-click-outside="hideSearchSuggestions">
            <el-input
              v-model="searchQuery"
              placeholder="搜索页面、功能..."
              class="search-input"
              :prefix-icon="Search"
              size="default"
              clearable
              @keyup.enter="handleSearch"
              @focus="showSearchSuggestions = true"
            >
              <template #suffix>
                <div class="search-shortcut">⌘K</div>
              </template>
            </el-input>
            
            <!-- 搜索建议 -->
            <div v-if="showSearchSuggestions && filteredSuggestions.length" class="search-suggestions">
              <div class="suggestions-header">快速导航</div>
              <div 
                v-for="suggestion in filteredSuggestions" 
                :key="suggestion.path"
                class="suggestion-item"
                @click="navigateToSuggestion(suggestion)"
              >
                <el-icon class="suggestion-icon">
                  <component :is="suggestion.icon" />
                </el-icon>
                <div class="suggestion-content">
                  <div class="suggestion-title">{{ suggestion.title }}</div>
                  <div class="suggestion-desc">{{ suggestion.description }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 通知中心 -->
          <div class="notification-center" v-click-outside="() => showNotifications = false">
            <el-badge :value="notificationCount" :hidden="notificationCount === 0" class="notification-badge">
              <el-button 
                class="action-btn notification-btn" 
                :icon="Bell" 
                circle 
                @click="showNotifications = !showNotifications"
              />
            </el-badge>
            
            <!-- 通知面板 -->
            <div v-if="showNotifications" class="notification-panel">
              <div class="panel-header">
                <span class="panel-title">通知中心</span>
                <el-button text size="small" @click="markAllAsRead">全部已读</el-button>
              </div>
              <div class="notification-list">
                <div 
                  v-for="notification in notifications" 
                  :key="notification.id"
                  class="notification-item"
                  :class="{ 'unread': !notification.read }"
                >
                  <div class="notification-avatar">
                    <el-icon :class="`notification-type-${notification.type}`">
                      <component :is="notification.icon" />
                    </el-icon>
                  </div>
                  <div class="notification-content">
                    <div class="notification-title">{{ notification.title }}</div>
                    <div class="notification-desc">{{ notification.description }}</div>
                    <div class="notification-time">{{ formatTime(notification.time) }}</div>
                  </div>
                </div>
              </div>
              <div class="panel-footer">
                <el-button text size="small" @click="viewAllNotifications">查看全部</el-button>
              </div>
            </div>
          </div>
          
          <!-- 帮助中心 -->
          <el-tooltip content="帮助中心" placement="bottom">
            <el-button 
              class="action-btn help-btn" 
              :icon="QuestionFilled" 
              circle 
              @click="navigateTo('/app/help')"
            />
          </el-tooltip>
          
          <!-- 全屏切换 -->
          <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
            <el-button 
              class="action-btn fullscreen-btn" 
              :icon="FullScreen" 
              circle 
              @click="toggleFullscreen"
            />
          </el-tooltip>
        </div>
        
        <!-- 用户信息区域 -->
        <div class="user-section">
          <el-dropdown @command="handleUserCommand" trigger="click" class="user-dropdown">
            <div class="user-profile">
              <el-avatar 
                :size="36" 
                :src="userStore.userInfo?.avatar"
                class="user-avatar"
              >
                {{ userStore.userInfo?.username?.charAt(0) }}
              </el-avatar>
              <div class="user-info">
                <div class="user-name">{{ userStore.userInfo?.realName || userStore.userInfo?.username }}</div>
                <div class="user-role">{{ getRoleText(userStore.userInfo?.role) }}</div>
              </div>
              <el-icon class="dropdown-arrow">
                <ArrowDown />
              </el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu class="user-dropdown-menu">
                <el-dropdown-item command="profile" class="dropdown-item">
                  <el-icon><User /></el-icon>
                  <span>个人资料</span>
                </el-dropdown-item>
                <el-dropdown-item command="settings" class="dropdown-item">
                  <el-icon><Setting /></el-icon>
                  <span>系统设置</span>
                </el-dropdown-item>
                <el-dropdown-item command="theme" class="dropdown-item">
                  <el-icon><Sunny /></el-icon>
                  <span>主题设置</span>
                </el-dropdown-item>
                <el-dropdown-item divided command="logout" class="dropdown-item logout">
                  <el-icon><SwitchButton /></el-icon>
                  <span>退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import {
  Menu, House, Search, Bell, QuestionFilled, FullScreen,
  User, Setting, Sunny, SwitchButton, ArrowDown,
  DataAnalysis, TrendCharts, Document, Setting as SettingIcon,
  Monitor, UserFilled, Files, Warning
} from '@element-plus/icons-vue'

// 定义 emits
const emit = defineEmits(['toggle-sidebar'])

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const searchQuery = ref('')
const showSearchSuggestions = ref(false)
const showNotifications = ref(false)
const isFullscreen = ref(false)
const notificationCount = ref(3)

// 搜索建议数据
const searchSuggestions = ref([
  { path: '/app/dashboard', title: '仪表盘', description: '查看系统概览和关键指标', icon: 'Monitor' },
  { path: '/app/statistics/population', title: '人口统计', description: '查看人口数据和趋势分析', icon: 'TrendCharts' },
  { path: '/app/statistics/hospital', title: '医疗机构', description: '医院和医疗机构统计信息', icon: 'DataAnalysis' },
  { path: '/app/statistics/personnel', title: '医护人员', description: '医护人员统计和分析', icon: 'UserFilled' },
  { path: '/app/data/import-export', title: '数据管理', description: '数据导入导出和管理', icon: 'Files' },
  { path: '/app/profile', title: '个人资料', description: '查看和编辑个人信息', icon: 'User' }
])

// 通知数据
const notifications = ref([
  {
    id: 1,
    title: '数据更新提醒',
    description: '2024年人口统计数据已更新',
    time: new Date(Date.now() - 1000 * 60 * 30),
    type: 'info',
    icon: 'DataAnalysis',
    read: false
  },
  {
    id: 2,
    title: '系统维护通知',
    description: '系统将于今晚23:00进行维护',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2),
    type: 'warning',
    icon: 'Warning',
    read: false
  },
  {
    id: 3,
    title: '导出任务完成',
    description: '医院统计数据导出已完成',
    time: new Date(Date.now() - 1000 * 60 * 60 * 4),
    type: 'success',
    icon: 'Document',
    read: true
  }
])

// 计算属性
const currentPageTitle = computed(() => {
  const pathMap = {
    '/app/dashboard': '仪表盘',
    '/app/statistics/population': '人口统计',
    '/app/statistics/hospital': '医疗机构统计',
    '/app/statistics/personnel': '医护人员统计',
    '/app/statistics/bed': '床位统计',
    '/app/statistics/service': '医疗服务统计',
    '/app/statistics/cost': '医疗费用统计',
    '/app/data/import-export': '数据导入导出',
    '/app/profile': '个人资料'
  }
  return pathMap[route.path] || '健康大数据平台'
})

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

const filteredSuggestions = computed(() => {
  if (!searchQuery.value) return searchSuggestions.value.slice(0, 6)
  
  return searchSuggestions.value.filter(item => 
    item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  ).slice(0, 6)
})

// 方法
const getBreadcrumbName = (segment) => {
  const nameMap = {
    'app': '应用',
    'dashboard': '仪表盘',
    'statistics': '统计分析',
    'population': '人口统计',
    'hospital': '医疗机构',
    'personnel': '医护人员',
    'bed': '床位统计',
    'service': '医疗服务',
    'cost': '医疗费用',
    'data': '数据管理',
    'import-export': '导入导出',
    'profile': '个人资料',
    'system': '系统管理',
    'help': '帮助中心'
  }
  return nameMap[segment] || segment
}

const navigateTo = (path) => {
  router.push(path)
  showSearchSuggestions.value = false
}

const navigateToSuggestion = (suggestion) => {
  navigateTo(suggestion.path)
  searchQuery.value = ''
}

const hideSearchSuggestions = () => {
  setTimeout(() => {
    showSearchSuggestions.value = false
  }, 200)
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // 实现搜索逻辑
    ElMessage.info(`搜索: ${searchQuery.value}`)
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
  notificationCount.value = 0
  ElMessage.success('所有通知已标记为已读')
}

const viewAllNotifications = () => {
  showNotifications.value = false
  ElMessage.info('跳转到通知中心')
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

const handleUserCommand = (command) => {
  switch (command) {
    case 'profile':
      navigateTo('/app/profile')
      break
    case 'settings':
      navigateTo('/app/settings')
      break
    case 'theme':
      ElMessage.info('主题设置功能开发中')
      break
    case 'logout':
      userStore.logout()
      router.push('/login')
      break
  }
}

const getRoleText = (role) => {
  const roleMap = {
    'ADMIN': '系统管理员',
    'ANALYST': '数据分析师',
    'VISITOR': '访客用户'
  }
  return roleMap[role] || '未知角色'
}

const formatTime = (time) => {
  const now = new Date()
  const diff = now - time
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  return `${days}天前`
}

// 监听全屏状态变化
document.addEventListener('fullscreenchange', () => {
  isFullscreen.value = !!document.fullscreenElement
})

// 键盘快捷键
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    showSearchSuggestions.value = true
    document.querySelector('.search-input input')?.focus()
  }
})
</script>

<style scoped>
/* 现代化头部样式 */
.modern-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 90px;
  padding: 0 32px;
  max-width: 100%;
  min-width: 1200px;
}

/* 左侧区域 */
.header-left {
  display: flex;
  align-items: center;
  gap: 32px;
  flex: 1;
  min-width: 0;
  max-width: 60%;
}

.menu-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: none;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #64748b;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.menu-toggle-btn:hover {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  border-color: #3b82f6;
}

.menu-icon {
  font-size: 20px;
  transition: transform 0.3s ease;
}

.menu-toggle-btn:hover .menu-icon {
  transform: rotate(180deg);
}

/* 面包屑区域 */
.breadcrumb-wrapper {
  flex: 1;
  min-width: 0;
  padding: 0 20px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 197, 253, 0.05) 100%);
  border-radius: 16px;
  padding: 16px 24px;
  border: 1px solid rgba(59, 130, 246, 0.1);
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 6px;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.breadcrumb-nav {
  opacity: 0.9;
}

.custom-breadcrumb {
  font-size: 14px;
  font-weight: 500;
}

.breadcrumb-icon {
  font-size: 16px;
  margin-right: 6px;
  color: #3b82f6;
}

.breadcrumb-link {
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 500;
}

.breadcrumb-link:hover {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  transform: translateY(-1px);
}

.breadcrumb-current {
  color: #3b82f6;
  font-weight: 600;
  background: rgba(59, 130, 246, 0.15);
  padding: 4px 12px;
  border-radius: 8px;
}

/* 右侧区域 */
.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
  min-width: 40%;
  justify-content: flex-end;
}

.quick-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 搜索容器 */
.search-container {
  position: relative;
}

.search-input {
  width: 320px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-input:focus-within {
  width: 380px;
  transform: translateY(-1px);
}

.search-shortcut {
  padding: 4px 8px;
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  border-radius: 6px;
  font-size: 11px;
  color: #64748b;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-weight: 600;
  border: 1px solid #cbd5e1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 搜索建议 */
.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  margin-top: 8px;
  z-index: 1001;
  overflow: hidden;
}

.suggestions-header {
  padding: 12px 16px 8px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.suggestion-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f1f5f9;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background: #f8fafc;
  transform: translateX(4px);
}

.suggestion-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  margin-right: 12px;
}

.suggestion-content {
  flex: 1;
}

.suggestion-title {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 2px;
}

.suggestion-desc {
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
}

/* 通知中心 */
.notification-center {
  position: relative;
}

.notification-badge :deep(.el-badge__content) {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  border: 2px solid white;
  font-size: 10px;
  min-width: 18px;
  height: 18px;
  line-height: 14px;
}

.action-btn {
  width: 44px;
  height: 44px;
  border: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  color: #64748b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  font-size: 18px;
}

.action-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.25);
}

.action-btn:active {
  transform: translateY(0) scale(0.98);
}

/* 通知面板 */
.notification-panel {
  position: absolute;
  top: 100%;
  right: 0;
  width: 360px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  margin-top: 8px;
  z-index: 1001;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s ease;
  position: relative;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background: #f8fafc;
}

.notification-item.unread {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%);
}

.notification-item.unread::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #3b82f6;
}

.notification-avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 16px;
}

.notification-type-info {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.notification-type-warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.notification-type-success {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 4px;
  line-height: 1.4;
}

.notification-desc {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 6px;
  line-height: 1.4;
}

.notification-time {
  font-size: 11px;
  color: #94a3b8;
}

.panel-footer {
  padding: 12px 20px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  text-align: center;
}

/* 用户区域 */
.user-section {
  margin-left: 16px;
  padding-left: 24px;
  border-left: 2px solid #e2e8f0;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  min-width: 200px;
}

.user-profile:hover {
  background: linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%);
  border-color: #3b82f6;
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(59, 130, 246, 0.25);
}

.user-avatar {
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 42px;
  height: 42px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
}

.user-name {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
  margin-bottom: 2px;
}

.user-role {
  font-size: 12px;
  color: #64748b;
  line-height: 1.2;
  font-weight: 500;
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
}

.dropdown-arrow {
  color: #94a3b8;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 16px;
}

.user-profile:hover .dropdown-arrow {
  transform: rotate(180deg) scale(1.2);
  color: #3b82f6;
}

/* 下拉菜单样式 */
:deep(.user-dropdown-menu) {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 8px;
  min-width: 200px;
}

:deep(.dropdown-item) {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 14px;
}

:deep(.dropdown-item:hover) {
  background: #f8fafc;
  color: #3b82f6;
}

:deep(.dropdown-item.logout) {
  color: #ef4444;
}

:deep(.dropdown-item.logout:hover) {
  background: #fef2f2;
  color: #dc2626;
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .header-container {
    min-width: auto;
    padding: 0 24px;
  }

  .search-input {
    width: 280px;
  }

  .search-input:focus-within {
    width: 320px;
  }

  .user-profile {
    min-width: 180px;
  }
}

@media (max-width: 1024px) {
  .header-container {
    height: 64px;
    padding: 0 20px;
  }

  .header-left {
    gap: 24px;
    max-width: 50%;
  }

  .breadcrumb-wrapper {
    padding: 12px 20px;
  }

  .page-title {
    font-size: 20px;
  }

  .search-input {
    width: 240px;
  }

  .search-input:focus-within {
    width: 280px;
  }

  .quick-actions {
    gap: 12px;
    padding: 6px 12px;
  }

  .action-btn {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  .user-profile {
    min-width: 160px;
    padding: 10px 16px;
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
    height: 60px;
  }

  .header-left {
    gap: 16px;
    max-width: 40%;
  }

  .breadcrumb-nav {
    display: none;
  }

  .page-title {
    font-size: 18px;
  }

  .search-container {
    display: none;
  }

  .user-info {
    display: none;
  }

  .quick-actions {
    gap: 8px;
    padding: 4px 8px;
  }

  .action-btn {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }

  .user-profile {
    min-width: auto;
    padding: 8px 12px;
  }

  .user-section {
    margin-left: 12px;
    padding-left: 16px;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0 12px;
  }

  .header-left {
    gap: 12px;
  }

  .breadcrumb-wrapper {
    padding: 8px 12px;
  }

  .page-title {
    font-size: 16px;
  }

  .menu-toggle-btn {
    width: 40px;
    height: 40px;
  }

  .quick-actions {
    gap: 6px;
  }

  .action-btn {
    width: 32px;
    height: 32px;
  }
}

/* 动画效果 */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-suggestions,
.notification-panel {
  animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Element Plus 样式覆盖 */
:deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid #e2e8f0;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  height: 44px;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
  border-color: #3b82f6;
  transform: translateY(-1px);
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2), 0 8px 25px rgba(59, 130, 246, 0.15);
  border-color: #3b82f6;
  background: linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%);
}

:deep(.el-input__inner) {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  height: 40px;
}

:deep(.el-input__inner::placeholder) {
  color: #94a3b8;
  font-weight: 400;
}

:deep(.el-input__prefix) {
  color: #64748b;
  font-size: 16px;
}

:deep(.el-input__suffix) {
  color: #64748b;
}

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: #3b82f6;
  font-weight: 600;
}

:deep(.el-breadcrumb__separator) {
  color: #cbd5e1;
  margin: 0 10px;
  font-weight: 600;
}

:deep(.el-breadcrumb__inner) {
  font-weight: 500;
  transition: all 0.2s ease;
}

:deep(.el-breadcrumb__inner:hover) {
  color: #3b82f6;
}

/* 下拉菜单美化 */
:deep(.el-dropdown-menu) {
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  padding: 12px;
  min-width: 220px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

:deep(.el-dropdown-menu__item) {
  border-radius: 10px;
  padding: 12px 16px;
  margin: 4px 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
}

:deep(.el-dropdown-menu__item:hover) {
  background: linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%);
  color: #3b82f6;
  transform: translateX(4px);
}

:deep(.el-dropdown-menu__item.is-divided) {
  border-top: 2px solid #f1f5f9;
  margin-top: 8px;
  padding-top: 16px;
}

/* 徽章样式 */
:deep(.el-badge__content) {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: 2px solid white;
  font-size: 10px;
  min-width: 20px;
  height: 20px;
  line-height: 16px;
  border-radius: 10px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

/* 按钮样式覆盖 */
:deep(.el-button.is-circle) {
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.el-button.is-circle:hover) {
  transform: translateY(-2px) scale(1.05);
}

/* 头像样式 */
:deep(.el-avatar) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

:deep(.el-avatar:hover) {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}
</style>
