<template>
  <div class="system-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>系统管理</h2>
      <p>管理系统用户、角色权限和菜单配置</p>
    </div>

    <!-- 功能卡片网格 -->
    <div class="feature-grid">
      <!-- 用户管理卡片 -->
      <div class="feature-card" @click="navigateTo('/app/system/users')">
        <div class="card-icon">
          <el-icon size="48" color="#409EFF">
            <User />
          </el-icon>
        </div>
        <div class="card-content">
          <h3>用户管理</h3>
          <p>管理系统用户账户、状态和基本信息</p>
          <div class="card-stats">
            <div class="stat-item">
              <span class="stat-value">{{ systemStats.totalUsers }}</span>
              <span class="stat-label">总用户数</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ systemStats.activeUsers }}</span>
              <span class="stat-label">活跃用户</span>
            </div>
          </div>
        </div>
        <div class="card-action">
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>

      <!-- 角色管理卡片 -->
      <div class="feature-card" @click="navigateTo('/app/system/roles')">
        <div class="card-icon">
          <el-icon size="48" color="#67C23A">
            <UserFilled />
          </el-icon>
        </div>
        <div class="card-content">
          <h3>角色管理</h3>
          <p>配置系统角色和权限分配</p>
          <div class="card-stats">
            <div class="stat-item">
              <span class="stat-value">{{ systemStats.totalRoles }}</span>
              <span class="stat-label">系统角色</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ systemStats.totalPermissions }}</span>
              <span class="stat-label">权限数量</span>
            </div>
          </div>
        </div>
        <div class="card-action">
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>

      <!-- 菜单管理卡片 -->
      <div class="feature-card" @click="navigateTo('/app/system/menus')">
        <div class="card-icon">
          <el-icon size="48" color="#E6A23C">
            <Menu />
          </el-icon>
        </div>
        <div class="card-content">
          <h3>菜单管理</h3>
          <p>配置系统菜单结构和导航</p>
          <div class="card-stats">
            <div class="stat-item">
              <span class="stat-value">{{ systemStats.totalMenus }}</span>
              <span class="stat-label">菜单项</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ systemStats.menuLevels }}</span>
              <span class="stat-label">菜单层级</span>
            </div>
          </div>
        </div>
        <div class="card-action">
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>
    </div>

    <!-- 系统概览 -->
    <div class="system-overview">
      <div class="overview-header">
        <h3>系统概览</h3>
        <el-button type="primary" size="small" @click="refreshStats">
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
      </div>

      <div class="overview-content">
        <!-- 用户统计图表 -->
        <div class="chart-container">
          <h4>用户角色分布</h4>
          <div ref="userRoleChart" class="chart"></div>
        </div>

        <!-- 最近活动 -->
        <div class="recent-activity">
          <h4>最近活动</h4>
          <div class="activity-list">
            <div 
              v-for="activity in recentActivities" 
              :key="activity.id"
              class="activity-item"
            >
              <div class="activity-icon">
                <el-icon :color="getActivityIconColor(activity.type)">
                  <component :is="getActivityIcon(activity.type)" />
                </el-icon>
              </div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 子路由出口 -->
    <router-view v-if="$route.path !== '/app/system'" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  User,
  UserFilled,
  Menu,
  ArrowRight,
  Refresh,
  Plus,
  Edit,
  Delete
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { userAPI, roleAPI, menuAPI } from '@/api/system'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const userRoleChart = ref()

// 系统统计数据
const systemStats = reactive({
  totalUsers: 0,
  activeUsers: 0,
  totalRoles: 4,
  totalPermissions: 0,
  totalMenus: 0,
  menuLevels: 3
})

// 最近活动数据
const recentActivities = ref([
  {
    id: 1,
    type: 'user_create',
    title: '新增用户：张三',
    time: '2024-06-27 10:30:00'
  },
  {
    id: 2,
    type: 'role_update',
    title: '更新角色权限：分析师',
    time: '2024-06-27 09:15:00'
  },
  {
    id: 3,
    type: 'menu_create',
    title: '新增菜单：数据导出',
    time: '2024-06-27 08:45:00'
  },
  {
    id: 4,
    type: 'user_delete',
    title: '删除用户：李四',
    time: '2024-06-26 16:20:00'
  }
])

// 导航到指定页面
const navigateTo = (path) => {
  router.push(path)
}

// 获取活动图标
const getActivityIcon = (type) => {
  const iconMap = {
    'user_create': Plus,
    'user_update': Edit,
    'user_delete': Delete,
    'role_update': Edit,
    'menu_create': Plus
  }
  return iconMap[type] || Edit
}

// 获取活动图标颜色
const getActivityIconColor = (type) => {
  const colorMap = {
    'user_create': '#67C23A',
    'user_update': '#409EFF',
    'user_delete': '#F56C6C',
    'role_update': '#E6A23C',
    'menu_create': '#67C23A'
  }
  return colorMap[type] || '#909399'
}

// 获取系统统计数据
const fetchSystemStats = async () => {
  loading.value = true
  try {
    // 获取用户统计
    const userResponse = await userAPI.getUsers({ page: 1, size: 1 })
    if (userResponse.code === 200) {
      systemStats.totalUsers = userResponse.data.total || 0
      // 这里可以添加获取活跃用户数的逻辑
      systemStats.activeUsers = Math.floor(systemStats.totalUsers * 0.8) // 示例数据
    }

    // 获取角色统计
    const roleResponse = await roleAPI.getRoles({ page: 1, size: 1 })
    if (roleResponse.code === 200) {
      systemStats.totalRoles = roleResponse.data.total || 4
    }

    // 获取菜单统计
    const menuResponse = await menuAPI.getMenus({ page: 1, size: 1 })
    if (menuResponse.code === 200) {
      systemStats.totalMenus = menuResponse.data.total || 0
    }

  } catch (error) {
    console.error('获取系统统计数据失败:', error)
    ElMessage.error('获取系统统计数据失败')
  } finally {
    loading.value = false
  }
}

// 初始化用户角色分布图表
const initUserRoleChart = () => {
  if (!userRoleChart.value) return

  const chart = echarts.init(userRoleChart.value)
  
  const option = {
    title: {
      text: '用户角色分布',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [
      {
        name: '用户角色',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 12, name: '管理员', itemStyle: { color: '#F56C6C' } },
          { value: 35, name: '分析师', itemStyle: { color: '#409EFF' } },
          { value: 18, name: '审计员', itemStyle: { color: '#E6A23C' } },
          { value: 28, name: '研究员', itemStyle: { color: '#67C23A' } }
        ]
      }
    ]
  }

  chart.setOption(option)

  // 响应式调整
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 刷新统计数据
const refreshStats = async () => {
  await fetchSystemStats()
  ElMessage.success('数据已刷新')
}

// 组件挂载时初始化
onMounted(async () => {
  await fetchSystemStats()
  await nextTick()
  initUserRoleChart()
})
</script>

<style scoped>
.system-management {
  padding: 20px;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
}

.page-header p {
  margin: 0;
  color: #6b7280;
  font-size: 16px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 20px;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #d1d5db;
}

.card-icon {
  flex-shrink: 0;
}

.card-content {
  flex: 1;
}

.card-content h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.card-content p {
  margin: 0 0 16px 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
}

.card-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.card-action {
  flex-shrink: 0;
  color: #9ca3af;
  transition: color 0.3s ease;
}

.feature-card:hover .card-action {
  color: #6b7280;
}

.system-overview {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.overview-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.overview-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.chart-container {
  min-height: 300px;
}

.chart-container h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 500;
  color: #374151;
}

.chart {
  width: 100%;
  height: 250px;
}

.recent-activity h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 500;
  color: #374151;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.activity-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 2px;
}

.activity-time {
  font-size: 12px;
  color: #6b7280;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .overview-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .feature-card {
    flex-direction: column;
    text-align: center;
  }
  
  .card-stats {
    justify-content: center;
  }
}
</style>
