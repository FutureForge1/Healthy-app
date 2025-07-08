<template>
  <div class="sidebar-container" :class="{ 'collapsed': isCollapsed }">
    <!-- 侧边栏头部 -->
    <div class="sidebar-header">
      <div class="logo-section">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="logo-text" v-show="!isCollapsed">
          <h3>健康大数据</h3>
          <span>成都市平台</span>
        </div>
      </div>
      
      <button class="collapse-btn" @click="toggleSidebar">
        <el-icon>
          <component :is="isCollapsed ? 'Expand' : 'Fold'" />
        </el-icon>
      </button>
    </div>

    <!-- 用户信息卡片 -->
    <div class="user-card" v-show="!isCollapsed">
      <div class="user-avatar">
        <el-avatar :size="40" :src="userStore.userInfo?.avatar">
          {{ userStore.userInfo?.username?.charAt(0) }}
        </el-avatar>
        <div class="user-status"></div>
      </div>
      <div class="user-info">
        <div class="user-name">{{ userStore.userInfo?.realName || userStore.userInfo?.username }}</div>
        <div class="user-role">{{ getRoleText(userStore.userInfo?.role) }}</div>
      </div>
    </div>

    <!-- 导航菜单 -->
    <div class="sidebar-menu">
      <el-scrollbar>
        <div class="menu-section">
          <div class="menu-group">
            <!-- 仪表盘 -->
            <div
              class="menu-item"
              :class="{ 'active': isActive('/app/dashboard') }"
              @click="navigateTo('/app/dashboard')"
              v-if="hasPermission(['ADMIN', 'ANALYST', 'AUDITOR', 'RESEARCHER'])"
            >
              <div class="menu-icon">
                <el-icon><Odometer /></el-icon>
              </div>
              <span class="menu-text" v-show="!isCollapsed">仪表盘</span>
              <div class="menu-indicator" v-if="isActive('/app/dashboard')"></div>
            </div>

            <!-- 已删除3D地图相关菜单项 -->



            <!-- 人口信息统计分析 -->
            <div
              class="menu-item"
              :class="{ 'active': isActive('/app/statistics/population') }"
              @click="navigateTo('/app/statistics/population')"
              v-if="hasPermission(['ADMIN', 'ANALYST', 'RESEARCHER'])"
            >
              <div class="menu-icon">
                <el-icon><DataAnalysis /></el-icon>
              </div>
              <span class="menu-text" v-show="!isCollapsed">人口信息统计分析</span>
              <div class="menu-indicator" v-if="isActive('/app/statistics/population')"></div>
            </div>

            <!-- 医疗卫生机构统计分析 -->
            <div
              class="menu-item"
              :class="{ 'active': isActive('/app/statistics/institution') }"
              @click="navigateTo('/app/statistics/institution')"
              v-if="hasPermission(['ADMIN', 'ANALYST', 'RESEARCHER'])"
            >
              <div class="menu-icon">
                <el-icon><Setting /></el-icon>
              </div>
              <span class="menu-text" v-show="!isCollapsed">医疗卫生机构统计分析</span>
              <div class="menu-indicator" v-if="isActive('/app/statistics/institution')"></div>
            </div>

            <!-- 医疗卫生人员统计分析 -->
            <div
              class="menu-item"
              :class="{ 'active': isActive('/app/statistics/personnel') }"
              @click="navigateTo('/app/statistics/personnel')"
              v-if="hasPermission(['ADMIN', 'ANALYST', 'RESEARCHER'])"
            >
              <div class="menu-icon">
                <el-icon><User /></el-icon>
              </div>
              <span class="menu-text" v-show="!isCollapsed">医疗卫生人员统计分析</span>
              <div class="menu-indicator" v-if="isActive('/app/statistics/personnel')"></div>
            </div>

            <!-- 医疗卫生床位统计分析 -->
            <div
              class="menu-item"
              :class="{ 'active': isActive('/app/statistics/bed') }"
              @click="navigateTo('/app/statistics/bed')"
              v-if="hasPermission(['ADMIN', 'ANALYST', 'RESEARCHER'])"
            >
              <div class="menu-icon">
                <el-icon><Document /></el-icon>
              </div>
              <span class="menu-text" v-show="!isCollapsed">医疗卫生床位统计分析</span>
              <div class="menu-indicator" v-if="isActive('/app/statistics/bed')"></div>
            </div>

            <!-- 医疗服务统计分析 -->
            <div
              class="menu-item"
              :class="{ 'active': isActive('/app/statistics/service') }"
              @click="navigateTo('/app/statistics/service')"
              v-if="hasPermission(['ADMIN', 'ANALYST', 'RESEARCHER'])"
            >
              <div class="menu-icon">
                <el-icon><PieChart /></el-icon>
              </div>
              <span class="menu-text" v-show="!isCollapsed">医疗服务统计分析</span>
              <div class="menu-indicator" v-if="isActive('/app/statistics/service')"></div>
            </div>

            <!-- 医疗费用统计分析 -->
            <div
              class="menu-item"
              :class="{ 'active': isActive('/app/statistics/cost') }"
              @click="navigateTo('/app/statistics/cost')"
              v-if="hasPermission(['ADMIN', 'ANALYST', 'RESEARCHER'])"
            >
              <div class="menu-icon">
                <el-icon><FolderOpened /></el-icon>
              </div>
              <span class="menu-text" v-show="!isCollapsed">医疗费用统计分析</span>
              <div class="menu-indicator" v-if="isActive('/app/statistics/cost')"></div>
            </div>

            <!-- 预测分析 - 仅数据分析师可见 -->
            <div
              class="menu-item prediction-menu"
              :class="{ 'active': isActive('/app/analytics/prediction') }"
              @click="navigateTo('/app/analytics/prediction')"
              v-if="hasPermission(['ANALYST'])"
            >
              <div class="menu-icon">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <span class="menu-text" v-show="!isCollapsed">🔮 预测分析</span>
              <div class="menu-indicator" v-if="isActive('/app/analytics/prediction')"></div>
            </div>

            <!-- 3D可视化 -->
            <div
              class="menu-item"
              :class="{ 'active': isActive('/app/mapbox-walking') }"
              @click="navigateTo('/app/mapbox-walking')"
              v-if="hasPermission(['ADMIN', 'ANALYST', 'RESEARCHER'])"
            >
              <div class="menu-icon">
                <el-icon><View /></el-icon>
              </div>
              <span class="menu-text" v-show="!isCollapsed">3D可视化</span>
              <div class="menu-indicator" v-if="isActive('/app/mapbox-walking')"></div>
            </div>
          </div>

          <!-- 日志审计 -->
          <div class="menu-group" v-if="hasPermission(['ADMIN', 'AUDITOR'])">
            <div class="group-title" v-show="!isCollapsed">日志审计</div>
            
            <div 
              class="menu-item" 
              :class="{ 'active': isActive('/app/audit') }"
              @click="navigateTo('/app/audit')"
            >
              <div class="menu-icon">
                <el-icon><Document /></el-icon>
              </div>
              <span class="menu-text" v-show="!isCollapsed">审计系统</span>
              <div class="menu-indicator" v-if="isActive('/app/audit')"></div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <!-- 侧边栏底部 -->
    <div class="sidebar-footer" v-show="!isCollapsed">
      <div class="theme-switcher">
        <div class="theme-option" :class="{ active: currentTheme === 'dark' }" @click="switchTheme('dark')">
          <div class="theme-preview dark-theme"></div>
          <span>深色</span>
        </div>
        <div class="theme-option" :class="{ active: currentTheme === 'light' }" @click="switchTheme('light')">
          <div class="theme-preview light-theme"></div>
          <span>浅色</span>
        </div>
      </div>

      <div class="footer-item" @click="showHelp">
        <el-icon><QuestionFilled /></el-icon>
        <span>帮助中心</span>
      </div>
      <div class="footer-item" @click="showSettings">
        <el-icon><Setting /></el-icon>
        <span>系统设置</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { gsap } from 'gsap'
import {
  Odometer,
  MapLocation,
  DataAnalysis,
  PieChart,
  FolderOpened,
  Setting,
  Document,
  ArrowRight,
  Expand,
  Fold,
  QuestionFilled,
  Menu,
  Position,
  TrendCharts,
  User
} from '@element-plus/icons-vue'

// Props
const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['toggle'])

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const isCollapsed = computed({
  get: () => props.collapsed,
  set: (value) => emit('toggle', value)
})

const expandedMenus = ref(['analytics', 'visualization'])
const currentTheme = ref('dark')

// 方法
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value

  // 添加切换动画
  nextTick(() => {
    const sidebar = document.querySelector('.sidebar-container')
    if (sidebar) {
      gsap.to(sidebar, {
        duration: 0.3,
        ease: "power2.out"
      })
    }
  })
}

const toggleSubmenu = (menuKey) => {
  if (isCollapsed.value) return

  const index = expandedMenus.value.indexOf(menuKey)
  const submenu = document.querySelector(`.submenu[data-menu="${menuKey}"]`)

  if (index > -1) {
    // 收起子菜单
    expandedMenus.value.splice(index, 1)
    if (submenu) {
      gsap.to(submenu, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.out"
      })
    }
  } else {
    // 展开子菜单
    expandedMenus.value.push(menuKey)
    if (submenu) {
      gsap.set(submenu, { height: 'auto' })
      const height = submenu.offsetHeight
      gsap.fromTo(submenu,
        { height: 0, opacity: 0 },
        { height: height, opacity: 1, duration: 0.3, ease: "power2.out" }
      )
    }
  }
}

const navigateTo = (path) => {
  // 添加点击动画
  const activeItem = document.querySelector('.menu-item.active')
  if (activeItem) {
    gsap.to(activeItem, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.out"
    })
  }

  router.push(path)
}

const isActive = (path) => {
  return route.path === path
}

const isActiveGroup = (prefix) => {
  return route.path.startsWith(prefix)
}

const hasPermission = (roles) => {
  const userRole = userStore.userInfo?.role
  console.log('检查权限:', { userRole, requiredRoles: roles, userInfo: userStore.userInfo })

  // 临时：如果用户已登录，就允许访问所有菜单
  if (userStore.isLoggedIn) {
    return true
  }

  return roles.includes(userRole)
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

const switchTheme = (theme) => {
  currentTheme.value = theme
  // 这里可以添加主题切换逻辑
  console.log('切换主题:', theme)
}

const showHelp = () => {
  console.log('显示帮助')
}

const showSettings = () => {
  console.log('显示设置')
}

// 初始化动画
const initSidebarAnimations = () => {
  // Logo 动画
  gsap.fromTo('.logo-icon',
    { scale: 0, rotation: -180 },
    { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" }
  )

  // 用户卡片动画
  gsap.fromTo('.user-card',
    { y: -20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, delay: 0.2, ease: "power2.out" }
  )

  // 菜单项动画
  gsap.fromTo('.menu-item',
    { x: -30, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.4, stagger: 0.1, delay: 0.3, ease: "power2.out" }
  )

  // 底部动画
  gsap.fromTo('.sidebar-footer',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, delay: 0.8, ease: "power2.out" }
  )
}

// 设置悬停动画
const setupHoverAnimations = () => {
  // 菜单项悬停效果
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      if (!item.classList.contains('active')) {
        gsap.to(item, {
          x: 8,
          duration: 0.3,
          ease: "power2.out"
        })
      }
    })

    item.addEventListener('mouseleave', () => {
      if (!item.classList.contains('active')) {
        gsap.to(item, {
          x: 0,
          duration: 0.3,
          ease: "power2.out"
        })
      }
    })
  })

  // Logo 悬停效果
  const logoIcon = document.querySelector('.logo-icon')
  if (logoIcon) {
    logoIcon.addEventListener('mouseenter', () => {
      gsap.to(logoIcon, {
        rotation: 360,
        duration: 0.6,
        ease: "power2.out"
      })
    })
  }
}

// 生命周期
onMounted(() => {
  nextTick(() => {
    initSidebarAnimations()
    setTimeout(() => {
      setupHoverAnimations()
    }, 1000)
  })
})
</script>

<style scoped>
.sidebar-container {
  width: 350px;
  height: 100vh;
  background: linear-gradient(180deg, #1e293b 0%, #334155 50%, #475569 100%);
  color: #ffffff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-container.collapsed {
  width: 100px;
}

/* 侧边栏头部 */
.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
}

.logo-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
  border-radius: 12px;
}

.logo-icon svg {
  width: 24px;
  height: 24px;
}

.logo-text h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
}

.logo-text span {
  font-size: 12px;
  opacity: 0.8;
  line-height: 1;
}

.collapse-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 用户信息卡片 */
.user-card {
  margin: 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.user-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  border-radius: 16px;
  pointer-events: none;
}

.user-avatar {
  position: relative;
}

.user-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #52c41a;
  border: 2px solid #1a1d29;
  border-radius: 50%;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 12px;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 导航菜单 */
.sidebar-menu {
  flex: 1;
  padding: 0 20px;
  overflow: hidden;
}

.menu-section {
  padding: 20px 0;
}

.menu-group {
  margin-bottom: 32px;
}

.group-title {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
  padding-left: 4px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 4px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.menu-item.active {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
}

.menu-item.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
  border-radius: 12px;
  pointer-events: none;
}

.menu-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.menu-text {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.menu-indicator {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background: #ffffff;
  border-radius: 2px 0 0 2px;
}

.submenu-arrow {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.submenu-parent.expanded .submenu-arrow {
  transform: rotate(90deg);
}

.submenu {
  margin-left: 32px;
  margin-top: 8px;
  border-left: 2px solid rgba(255, 255, 255, 0.1);
  padding-left: 16px;
}

.submenu-item {
  padding: 8px 12px;
  margin-bottom: 2px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.8);
}

.submenu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.submenu-item.active {
  background: rgba(102, 126, 234, 0.3);
  color: #ffffff;
}

/* 侧边栏底部 */
.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.theme-switcher {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.theme-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.theme-option.active {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.theme-preview {
  width: 20px;
  height: 12px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark-theme {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
}

.light-theme {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  margin-bottom: 4px;
}

.footer-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

/* 收起状态下的样式调整 */
.sidebar-container.collapsed .menu-item {
  justify-content: center;
  padding: 12px;
}

.sidebar-container.collapsed .menu-icon {
  margin-right: 0;
}

.sidebar-container.collapsed .submenu-parent {
  position: relative;
}

.sidebar-container.collapsed .submenu-parent:hover::after {
  content: attr(data-title);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: #2c3e50;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  margin-left: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 预测分析菜单特殊样式 */
.prediction-menu {
  position: relative;
  background: linear-gradient(135deg, rgba(103, 58, 183, 0.1) 0%, rgba(63, 81, 181, 0.1) 100%);
  border-left: 3px solid #673ab7;
  margin: 8px 0;
}

.prediction-menu:hover {
  background: linear-gradient(135deg, rgba(103, 58, 183, 0.2) 0%, rgba(63, 81, 181, 0.2) 100%);
  transform: translateX(4px);
}

.prediction-menu.active {
  background: linear-gradient(135deg, #673ab7 0%, #3f51b5 100%);
  color: white;
}

.prediction-menu .menu-icon {
  color: #673ab7;
}

.prediction-menu.active .menu-icon {
  color: white;
}

/* 滚动条样式 */
:deep(.el-scrollbar__bar) {
  opacity: 0.3;
}

:deep(.el-scrollbar__thumb) {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

:deep(.el-scrollbar__thumb:hover) {
  background: rgba(255, 255, 255, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar-container {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    transform: translateX(-100%);
  }
  
  .sidebar-container.mobile-open {
    transform: translateX(0);
  }
}
</style>
