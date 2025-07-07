<template>
  <div class="dashboard">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1>欢迎回来，{{ userStore.userInfo?.realName || userStore.userInfo?.username }}</h1>
        <p>今天是 {{ currentDate }}，祝您工作愉快！</p>
      </div>
      <div class="welcome-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon size="24" color="#409EFF"><DataAnalysis /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">
              <span v-if="loading">--</span>
              <span v-else>{{ dashboardStats.totalAnalyses || 0 }}</span>
            </div>
            <div class="stat-label">数据分析</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon size="24" color="#67C23A"><PieChart /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">
              <span v-if="loading">--</span>
              <span v-else>{{ dashboardStats.totalReports || 0 }}</span>
            </div>
            <div class="stat-label">生成报表</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon size="24" color="#E6A23C"><Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">
              <span v-if="loading">--</span>
              <span v-else>{{ dashboardStats.totalExports || 0 }}</span>
            </div>
            <div class="stat-label">数据导出</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon size="24" color="#F56C6C"><OfficeBuilding /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">
              <span v-if="loading">--</span>
              <span v-else>{{ dashboardStats.totalInstitutions || 0 }}</span>
            </div>
            <div class="stat-label">医疗机构</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="quick-actions">
      <h3>快速操作</h3>
      <div class="action-grid">
        <div class="action-card" @click="navigateTo('/app/statistics/population')">
          <el-icon size="32" color="#409EFF"><User /></el-icon>
          <span>人口统计</span>
        </div>
        <div class="action-card" @click="navigateTo('/app/statistics/institution')">
          <el-icon size="32" color="#67C23A"><OfficeBuilding /></el-icon>
          <span>医疗机构</span>
        </div>
        <div class="action-card" @click="navigateTo('/app/visualization/charts')">
          <el-icon size="32" color="#E6A23C"><PieChart /></el-icon>
          <span>数据可视化</span>
        </div>
        <div class="action-card" @click="navigateTo('/app/map')">
          <el-icon size="32" color="#F56C6C"><MapLocation /></el-icon>
          <span>3D地图</span>
        </div>
        <div class="action-card" @click="navigateTo('/app/data/import-export')">
          <el-icon size="32" color="#909399"><Upload /></el-icon>
          <span>数据导入</span>
        </div>
        <div class="action-card" @click="navigateTo('/app/audit/logs')">
          <el-icon size="32" color="#606266"><Document /></el-icon>
          <span>操作日志</span>
        </div>
      </div>
    </div>

    <!-- 数据概览 -->
    <div class="data-overview">
      <div class="overview-left">
        <!-- 人口统计图表 -->
        <div class="chart-card">
          <div class="chart-header">
            <h4>成都市人口趋势</h4>
            <el-button link size="small" @click="navigateTo('/app/statistics/population')">
              查看详情
            </el-button>
          </div>
          <div ref="populationChart" class="chart"></div>
        </div>

        <!-- 医疗机构分布 -->
        <div class="chart-card">
          <div class="chart-header">
            <h4>医疗机构分布</h4>
            <el-button link size="small" @click="navigateTo('/app/statistics/institution')">
              查看详情
            </el-button>
          </div>
          <div ref="institutionChart" class="chart"></div>
        </div>
      </div>

      <div class="overview-right">
        <!-- 系统通知 -->
        <div class="notification-card">
          <div class="card-header">
            <h4>系统通知</h4>
            <el-badge :value="notifications.length" class="notification-badge">
              <el-icon><Bell /></el-icon>
            </el-badge>
          </div>
          <div class="notification-list">
            <div v-if="loading" class="loading-placeholder">
              <el-skeleton :rows="3" animated />
            </div>
            <div v-else-if="notifications.length === 0" class="empty-placeholder">
              <el-empty description="暂无通知" :image-size="60" />
            </div>
            <div
              v-else
              v-for="notification in notifications"
              :key="notification.id"
              class="notification-item"
              :class="{ 'unread': !notification.read }"
            >
              <div class="notification-icon">
                <el-icon :color="getNotificationColor(notification.type)">
                  <component :is="getNotificationIcon(notification.type)" />
                </el-icon>
              </div>
              <div class="notification-content">
                <div class="notification-title">{{ notification.title }}</div>
                <div class="notification-time">{{ notification.time }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 最近活动 -->
        <div class="activity-card">
          <div class="card-header">
            <h4>最近活动</h4>
            <el-button link size="small">查看全部</el-button>
          </div>
          <div class="activity-list">
            <div v-if="loading" class="loading-placeholder">
              <el-skeleton :rows="4" animated />
            </div>
            <div v-else-if="recentActivities.length === 0" class="empty-placeholder">
              <el-empty description="暂无活动记录" :image-size="60" />
            </div>
            <div
              v-else
              v-for="activity in recentActivities"
              :key="activity.id"
              class="activity-item"
            >
              <div class="activity-time">{{ activity.time }}</div>
              <div class="activity-content">{{ activity.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { gsap } from 'gsap'
import * as echarts from 'echarts'
import { ElMessage, ElLoading } from 'element-plus'
import dashboardAPI from '@/api/dashboard'
import {
  User,
  DataAnalysis,
  PieChart,
  Document,
  OfficeBuilding,
  MapLocation,
  Upload,
  Bell,
  InfoFilled,
  WarningFilled,
  SuccessFilled
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 图表引用
const populationChart = ref(null)
const institutionChart = ref(null)

// 当前日期
const currentDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
})

// Dashboard统计数据 - 从后端获取
const dashboardStats = ref({
  totalAnalyses: 0,
  totalReports: 0,
  totalExports: 0,
  totalInstitutions: 0,
  totalPersonnel: 0,
  totalBeds: 0
})

// 通知数据 - 从后端获取
const notifications = ref([])

// 最近活动 - 从后端获取
const recentActivities = ref([])

// 加载状态
const loading = ref(false)

// 图表数据
const chartData = ref({
  populationTrend: null,
  institutionDistribution: null
})

// 导航方法
const navigateTo = (path) => {
  router.push(path)
}

// 加载仪表盘数据
const loadDashboardData = async () => {
  try {
    loading.value = true

    // 并行加载所有数据
    const [
      overviewData,
      coreMetrics,
      populationTrend,
      institutionDistribution,
      recentActivitiesData,
      notificationsData
    ] = await Promise.allSettled([
      dashboardAPI.getDashboardOverview(),
      dashboardAPI.getCoreMetrics('month'),
      dashboardAPI.getPopulationTrendChart(),
      dashboardAPI.getInstitutionDistributionChart(),
      dashboardAPI.getRecentActivities(5),
      dashboardAPI.getSystemNotifications(5)
    ])

    // 处理概览数据
    if (overviewData.status === 'fulfilled' && overviewData.value?.data) {
      const data = overviewData.value.data
      dashboardStats.value = {
        totalAnalyses: data.totalAnalyses || 0,
        totalReports: data.totalReports || 0,
        totalExports: data.totalExports || 0,
        totalInstitutions: data.totalInstitutions || 0,
        totalPersonnel: data.totalPersonnel || 0,
        totalBeds: data.totalBeds || 0
      }
    }

    // 处理核心指标数据
    if (coreMetrics.status === 'fulfilled' && coreMetrics.value?.data) {
      const metrics = coreMetrics.value.data
      // 更新统计数据
      Object.assign(dashboardStats.value, metrics)
    }

    // 处理人口趋势数据
    if (populationTrend.status === 'fulfilled' && populationTrend.value?.data) {
      chartData.value.populationTrend = populationTrend.value.data
    }

    // 处理医疗机构分布数据
    if (institutionDistribution.status === 'fulfilled' && institutionDistribution.value?.data) {
      chartData.value.institutionDistribution = institutionDistribution.value.data
    }

    // 处理最近活动数据
    if (recentActivitiesData.status === 'fulfilled' && recentActivitiesData.value?.data) {
      recentActivities.value = recentActivitiesData.value.data.map(item => ({
        id: item.id,
        time: formatTime(item.createTime),
        content: item.description || item.operationDesc
      }))
    }

    // 处理通知数据
    if (notificationsData.status === 'fulfilled' && notificationsData.value?.data) {
      notifications.value = notificationsData.value.data.map(item => ({
        id: item.id,
        type: getNotificationType(item.level),
        title: item.title,
        time: formatTime(item.createTime),
        read: item.isRead
      }))
    }

  } catch (error) {
    console.error('加载仪表盘数据失败:', error)
    ElMessage.error('加载数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 格式化时间
const formatTime = (timestamp) => {
  if (!timestamp) return ''

  const now = new Date()
  const time = new Date(timestamp)
  const diff = now - time

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return time.toLocaleDateString('zh-CN')
  }
}

// 获取通知类型
const getNotificationType = (level) => {
  const typeMap = {
    'INFO': 'info',
    'SUCCESS': 'success',
    'WARNING': 'warning',
    'ERROR': 'error'
  }
  return typeMap[level] || 'info'
}



// 获取通知图标
const getNotificationIcon = (type) => {
  const icons = {
    info: 'InfoFilled',
    success: 'SuccessFilled',
    warning: 'WarningFilled',
    error: 'WarningFilled'
  }
  return icons[type] || 'InfoFilled'
}

// 获取通知颜色
const getNotificationColor = (type) => {
  const colors = {
    info: '#409EFF',
    success: '#67C23A',
    warning: '#E6A23C',
    error: '#F56C6C'
  }
  return colors[type] || '#409EFF'
}

// 初始化人口趋势图表
const initPopulationChart = () => {
  if (!populationChart.value) return

  const chart = echarts.init(populationChart.value)

  // 使用真实数据或默认数据
  const data = chartData.value.populationTrend || {
    years: ['2019', '2020', '2021', '2022', '2023'],
    values: [1420, 1435, 1448, 1456, 1462]
  }

  const option = {
    title: {
      text: '近5年人口增长趋势',
      textStyle: {
        fontSize: 14,
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        return `${params[0].name}<br/>人口: ${params[0].value}万人`
      }
    },
    xAxis: {
      type: 'category',
      data: data.years || data.categories || ['2019', '2020', '2021', '2022', '2023']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}万'
      }
    },
    series: [{
      data: data.values || data.data || [1420, 1435, 1448, 1456, 1462],
      type: 'line',
      smooth: true,
      itemStyle: {
        color: '#409EFF'
      },
      lineStyle: {
        width: 3
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(64, 158, 255, 0.3)'
          }, {
            offset: 1, color: 'rgba(64, 158, 255, 0.1)'
          }]
        }
      }
    }]
  }
  chart.setOption(option)

  // 响应式
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 初始化医疗机构分布图表
const initInstitutionChart = () => {
  if (!institutionChart.value) return

  const chart = echarts.init(institutionChart.value)

  // 使用真实数据或默认数据
  const data = chartData.value.institutionDistribution || [
    { value: 46, name: '三级医院', itemStyle: { color: '#409EFF' } },
    { value: 128, name: '二级医院', itemStyle: { color: '#67C23A' } },
    { value: 573, name: '社区医院', itemStyle: { color: '#E6A23C' } },
    { value: 501, name: '其他机构', itemStyle: { color: '#F56C6C' } }
  ]

  // 处理后端数据格式
  const chartDataFormatted = Array.isArray(data) ? data :
    (data.categories ? data.categories.map((item, index) => ({
      value: item.count || item.value,
      name: item.name || item.category,
      itemStyle: {
        color: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#9C27B0'][index % 5]
      }
    })) : [
      { value: 46, name: '三级医院', itemStyle: { color: '#409EFF' } },
      { value: 128, name: '二级医院', itemStyle: { color: '#67C23A' } },
      { value: 573, name: '社区医院', itemStyle: { color: '#E6A23C' } },
      { value: 501, name: '其他机构', itemStyle: { color: '#F56C6C' } }
    ])

  const option = {
    title: {
      text: '医疗机构类型分布',
      textStyle: {
        fontSize: 14,
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}家 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: chartDataFormatted.map(item => item.name)
    },
    series: [{
      name: '医疗机构',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
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
      data: chartDataFormatted
    }]
  }
  chart.setOption(option)

  // 响应式
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 初始化动画
const initAnimations = () => {
  // 设置初始状态
  gsap.set('.dashboard', { opacity: 0 })
  gsap.set('.welcome-section', { y: -50, opacity: 0 })
  gsap.set('.quick-actions', { y: 30, opacity: 0 })
  gsap.set('.data-overview', { y: 50, opacity: 0 })
  gsap.set('.action-card', { scale: 0.8, opacity: 0 })
  gsap.set('.stat-card', { x: -30, opacity: 0 })

  // 创建动画时间线
  const tl = gsap.timeline()

  tl.to('.dashboard', {
    opacity: 1,
    duration: 0.3,
    ease: "power2.out"
  })
  .to('.welcome-section', {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power3.out"
  }, "-=0.2")
  .to('.stat-card', {
    x: 0,
    opacity: 1,
    duration: 0.6,
    stagger: 0.1,
    ease: "back.out(1.7)"
  }, "-=0.4")
  .to('.quick-actions', {
    y: 0,
    opacity: 1,
    duration: 0.6,
    ease: "power3.out"
  }, "-=0.3")
  .to('.action-card', {
    scale: 1,
    opacity: 1,
    duration: 0.5,
    stagger: 0.1,
    ease: "back.out(1.7)"
  }, "-=0.2")
  .to('.data-overview', {
    y: 0,
    opacity: 1,
    duration: 0.6,
    ease: "power3.out"
  }, "-=0.3")
}

// 设置交互动画
const setupInteractions = () => {
  // 快速操作卡片悬停效果
  setTimeout(() => {
    document.querySelectorAll('.action-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -8,
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out"
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        })
      })
    })

    // 统计卡片悬停效果
    document.querySelectorAll('.stat-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out"
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        })
      })
    })
  }, 1000)
}

// 生命周期钩子
onMounted(async () => {
  // 检查登录状态
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }

  // 等待DOM渲染完成
  await nextTick()

  // 加载仪表盘数据
  await loadDashboardData()

  // 初始化动画
  setTimeout(() => {
    initAnimations()
  }, 100)

  // 初始化图表（在数据加载完成后）
  setTimeout(() => {
    initPopulationChart()
    initInstitutionChart()
  }, 800)

  // 设置交互动画
  setTimeout(() => {
    setupInteractions()
  }, 1200)
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f4fd 100%);
  padding: 24px;
}

/* 欢迎区域 */
.welcome-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

.welcome-content h1 {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.welcome-content p {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

.welcome-stats {
  display: flex;
  gap: 24px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 140px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-4px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.8;
}

/* 快速操作 */
.quick-actions {
  margin-bottom: 32px;
}

.quick-actions h3 {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 20px 0;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.action-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
  border-color: #409EFF;
}

.action-card span {
  display: block;
  margin-top: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
}

/* 数据概览 */
.data-overview {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.overview-left {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.overview-right {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 图表卡片 */
.chart-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.chart {
  height: 300px;
  width: 100%;
}

/* 通知卡片 */
.notification-card, .activity-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.notification-badge {
  cursor: pointer;
}

.notification-list, .activity-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background: #f8fafc;
  border-radius: 8px;
  padding: 12px;
  margin: 0 -12px;
}

.notification-item.unread {
  background: rgba(64, 158, 255, 0.05);
}

.notification-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 4px;
}

.notification-time {
  font-size: 12px;
  color: #64748b;
}

.activity-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-time {
  font-size: 12px;
  color: #64748b;
  min-width: 60px;
  flex-shrink: 0;
}

.activity-content {
  font-size: 14px;
  color: #2c3e50;
  flex: 1;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .data-overview {
    grid-template-columns: 1fr;
  }

  .welcome-section {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }

  .welcome-stats {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }

  .welcome-section {
    padding: 24px;
  }

  .welcome-content h1 {
    font-size: 24px;
  }

  .welcome-stats {
    flex-direction: column;
    gap: 16px;
  }

  .action-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 16px;
  }

  .action-card {
    padding: 20px;
  }

  .stat-card {
    min-width: auto;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .welcome-content h1 {
    font-size: 20px;
  }

  .welcome-content p {
    font-size: 14px;
  }

  .action-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart {
    height: 250px;
  }
}

/* 加载和空状态样式 */
.loading-placeholder {
  padding: 16px;
}

.empty-placeholder {
  padding: 20px;
  text-align: center;
}

.empty-placeholder .el-empty {
  padding: 0;
}

/* 滚动条样式 */
.notification-list::-webkit-scrollbar,
.activity-list::-webkit-scrollbar {
  width: 4px;
}

.notification-list::-webkit-scrollbar-track,
.activity-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.notification-list::-webkit-scrollbar-thumb,
.activity-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.notification-list::-webkit-scrollbar-thumb:hover,
.activity-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 动画效果 */
.action-card,
.stat-card,
.chart-card,
.notification-card,
.activity-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 加载状态 */
.dashboard {
  opacity: 0;
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .dashboard {
    background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
  }

  .welcome-section {
    background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  }

  .action-card,
  .chart-card,
  .notification-card,
  .activity-card {
    background: #2d3748;
    border-color: #4a5568;
  }

  .quick-actions h3,
  .chart-header h4,
  .card-header h4 {
    color: #e2e8f0;
  }

  .action-card span,
  .notification-title,
  .activity-content {
    color: #e2e8f0;
  }

  .notification-time,
  .activity-time {
    color: #a0aec0;
  }
}
</style>
