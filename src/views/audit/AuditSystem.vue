<template>
  <div class="audit-system">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2>日志审计系统</h2>
        <p>全面监控系统运行状态，记录用户操作行为，保障系统安全</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="$router.push('/app/audit/operation-logs')">
          <el-icon><Document /></el-icon>
          操作日志
        </el-button>
        <el-button type="warning" @click="generateReport">
          <el-icon><DataAnalysis /></el-icon>
          生成报告
        </el-button>
        <el-button @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 系统状态概览 -->
    <div class="overview-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="status-card system">
            <div class="status-icon">
              <el-icon><Monitor /></el-icon>
            </div>
            <div class="status-content">
              <div class="status-value">{{ systemStatus.status }}</div>
              <div class="status-label">系统状态</div>
              <div class="status-detail">
                运行时间: {{ systemStatus.uptime }}
              </div>
            </div>
            <div class="status-indicator" :class="systemStatus.status.toLowerCase()"></div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="status-card security">
            <div class="status-icon">
              <el-icon><Lock /></el-icon>
            </div>
            <div class="status-content">
              <div class="status-value">{{ securityStatus.level }}</div>
              <div class="status-label">安全等级</div>
              <div class="status-detail">
                威胁数: {{ securityStatus.threats }}
              </div>
            </div>
            <div class="status-indicator" :class="getSecurityClass(securityStatus.level)"></div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="status-card performance">
            <div class="status-icon">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="status-content">
              <div class="status-value">{{ performanceStatus.score }}</div>
              <div class="status-label">性能评分</div>
              <div class="status-detail">
                响应时间: {{ performanceStatus.responseTime }}ms
              </div>
            </div>
            <div class="status-indicator" :class="getPerformanceClass(performanceStatus.score)"></div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="status-card storage">
            <div class="status-icon">
              <el-icon><FolderOpened /></el-icon>
            </div>
            <div class="status-content">
              <div class="status-value">{{ storageStatus.usage }}%</div>
              <div class="status-label">存储使用率</div>
              <div class="status-detail">
                剩余: {{ storageStatus.remaining }}GB
              </div>
            </div>
            <div class="status-indicator" :class="getStorageClass(storageStatus.usage)"></div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 功能模块 -->
    <div class="modules-section">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="module-card operation-logs">
            <div class="module-header">
              <div class="module-icon">
                <el-icon><Document /></el-icon>
              </div>
              <div class="module-info">
                <h3>操作日志</h3>
                <p>记录用户的所有操作行为，支持详细查询和分析</p>
              </div>
            </div>
            <div class="module-stats">
              <div class="stat-row">
                <span class="stat-label">今日日志:</span>
                <span class="stat-value">{{ moduleStats.operationLogs.todayCount }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">总日志数:</span>
                <span class="stat-value">{{ formatNumber(moduleStats.operationLogs.totalCount) }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">异常操作:</span>
                <span class="stat-value error">{{ moduleStats.operationLogs.errorCount }}</span>
              </div>
            </div>
            <div class="module-actions">
              <el-button type="primary" @click="$router.push('/app/audit/operation-logs')">
                查看日志
              </el-button>
              <el-button @click="quickAnalysis">快速分析</el-button>
            </div>
          </div>
        </el-col>
        
        <el-col :span="8">
          <div class="module-card system-monitor">
            <div class="module-header">
              <div class="module-icon">
                <el-icon><Monitor /></el-icon>
              </div>
              <div class="module-info">
                <h3>系统监控</h3>
                <p>实时监控系统资源使用情况和性能指标</p>
              </div>
            </div>
            <div class="module-stats">
              <div class="stat-row">
                <span class="stat-label">CPU使用率:</span>
                <span class="stat-value">{{ moduleStats.systemMonitor.cpuUsage }}%</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">内存使用率:</span>
                <span class="stat-value">{{ moduleStats.systemMonitor.memoryUsage }}%</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">在线用户:</span>
                <span class="stat-value">{{ moduleStats.systemMonitor.onlineUsers }}</span>
              </div>
            </div>
            <div class="module-actions">
              <el-button type="success" @click="viewSystemMonitor">
                系统监控
              </el-button>
              <el-button @click="performanceReport">性能报告</el-button>
            </div>
          </div>
        </el-col>
        
        <el-col :span="8">
          <div class="module-card audit-reports">
            <div class="module-header">
              <div class="module-icon">
                <el-icon><DataAnalysis /></el-icon>
              </div>
              <div class="module-info">
                <h3>审计报告</h3>
                <p>生成各类审计报告，支持定制化分析和导出</p>
              </div>
            </div>
            <div class="module-stats">
              <div class="stat-row">
                <span class="stat-label">本月报告:</span>
                <span class="stat-value">{{ moduleStats.auditReports.monthlyCount }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">待审核:</span>
                <span class="stat-value warning">{{ moduleStats.auditReports.pendingCount }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">已完成:</span>
                <span class="stat-value success">{{ moduleStats.auditReports.completedCount }}</span>
              </div>
            </div>
            <div class="module-actions">
              <el-button type="warning" @click="generateReport">
                生成报告
              </el-button>
              <el-button @click="viewReports">查看报告</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 实时监控图表 -->
    <div class="charts-section">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h4>系统资源使用趋势</h4>
              <el-select v-model="resourcePeriod" size="small" style="width: 120px" @change="updateResourceChart">
                <el-option label="最近1小时" value="1h" />
                <el-option label="最近6小时" value="6h" />
                <el-option label="最近24小时" value="24h" />
              </el-select>
            </div>
            <div ref="resourceChart" class="chart"></div>
          </div>
        </el-col>
        
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h4>用户活动统计</h4>
              <el-select v-model="activityPeriod" size="small" style="width: 120px" @change="updateActivityChart">
                <el-option label="今日" value="today" />
                <el-option label="本周" value="week" />
                <el-option label="本月" value="month" />
              </el-select>
            </div>
            <div ref="activityChart" class="chart"></div>
          </div>
        </el-col>
      </el-row>
      
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h4>安全事件分布</h4>
              <el-button link size="small" @click="viewSecurityDetails">查看详情</el-button>
            </div>
            <div ref="securityChart" class="chart"></div>
          </div>
        </el-col>
        
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h4>操作类型分布</h4>
              <el-button link size="small" @click="viewOperationDetails">查看详情</el-button>
            </div>
            <div ref="operationChart" class="chart"></div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 最近活动 -->
    <div class="activity-section">
      <div class="section-header">
        <h4>最近活动</h4>
        <el-button link @click="viewAllActivities">查看全部</el-button>
      </div>
      
      <el-timeline>
        <el-timeline-item
          v-for="activity in recentActivities"
          :key="activity.id"
          :timestamp="activity.time"
          :type="getActivityType(activity.type)"
        >
          <div class="activity-content">
            <div class="activity-title">{{ activity.title }}</div>
            <div class="activity-desc">{{ activity.description }}</div>
            <div class="activity-meta">
              <span class="activity-user">{{ activity.user }}</span>
              <span class="activity-level" :class="activity.level">
                {{ getLevelText(activity.level) }}
              </span>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>

    <!-- 系统警报 -->
    <div v-if="systemAlerts.length > 0" class="alerts-section">
      <div class="section-header">
        <h4>系统警报</h4>
        <el-button link @click="clearAllAlerts">清除全部</el-button>
      </div>
      
      <div class="alerts-list">
        <el-alert
          v-for="alert in systemAlerts"
          :key="alert.id"
          :title="alert.title"
          :description="alert.description"
          :type="alert.type"
          :closable="true"
          show-icon
          @close="dismissAlert(alert.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import {
  Document,
  DataAnalysis,
  Refresh,
  Monitor,
  Lock,
  TrendCharts,
  FolderOpened
} from '@element-plus/icons-vue'
import { visualizationApi } from '@/api/visualization'
import { auditApi } from '@/api/audit'

// 响应式数据
const loading = ref(false)
const resourcePeriod = ref('6h')
const activityPeriod = ref('today')

// 图表引用
const resourceChart = ref(null)
const activityChart = ref(null)
const securityChart = ref(null)
const operationChart = ref(null)

// 系统状态
const systemStatus = reactive({
  status: '正常',
  uptime: '15天8小时'
})

const securityStatus = reactive({
  level: '低风险',
  threats: 2
})

const performanceStatus = reactive({
  score: 92,
  responseTime: 245
})

const storageStatus = reactive({
  usage: 68,
  remaining: 256
})

// 模块统计
const moduleStats = reactive({
  operationLogs: {
    todayCount: 2847,
    totalCount: 1547892,
    errorCount: 23
  },
  systemMonitor: {
    cpuUsage: 45,
    memoryUsage: 68,
    onlineUsers: 156
  },
  auditReports: {
    monthlyCount: 28,
    pendingCount: 5,
    completedCount: 23
  }
})

// 最近活动
const recentActivities = ref([
  {
    id: 1,
    type: 'security',
    title: '检测到异常登录',
    description: '用户张三从异常IP地址登录系统',
    user: '系统',
    level: 'warning',
    time: '2023-12-01 14:30'
  },
  {
    id: 2,
    type: 'operation',
    title: '批量数据导入',
    description: '用户李四导入15,000条人口数据',
    user: '李四',
    level: 'info',
    time: '2023-12-01 13:15'
  },
  {
    id: 3,
    type: 'system',
    title: '系统性能优化',
    description: '数据库查询性能提升15%',
    user: '系统',
    level: 'success',
    time: '2023-12-01 11:45'
  }
])

// 系统警报
const systemAlerts = ref([
  {
    id: 1,
    title: '存储空间警告',
    description: '系统存储空间使用率已达到68%，建议及时清理',
    type: 'warning'
  },
  {
    id: 2,
    title: '异常登录检测',
    description: '检测到2次来自异常IP的登录尝试',
    type: 'error'
  }
])

// 定时器
let refreshTimer = null

// 格式化数字
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// 获取安全等级样式类
const getSecurityClass = (level) => {
  const levelMap = {
    '低风险': 'success',
    '中风险': 'warning',
    '高风险': 'danger'
  }
  return levelMap[level] || 'info'
}

// 获取性能评分样式类
const getPerformanceClass = (score) => {
  if (score >= 90) return 'success'
  if (score >= 70) return 'warning'
  return 'danger'
}

// 获取存储使用率样式类
const getStorageClass = (usage) => {
  if (usage >= 90) return 'danger'
  if (usage >= 70) return 'warning'
  return 'success'
}

// 获取活动类型
const getActivityType = (type) => {
  const typeMap = {
    'security': 'warning',
    'operation': 'primary',
    'system': 'success'
  }
  return typeMap[type] || 'info'
}

// 获取等级文本
const getLevelText = (level) => {
  const textMap = {
    'info': '信息',
    'warning': '警告',
    'success': '成功',
    'danger': '危险'
  }
  return textMap[level] || '未知'
}

// 初始化图表
const initCharts = () => {
  // 系统资源使用趋势图表
  if (resourceChart.value) {
    const chart1 = echarts.init(resourceChart.value)
    const option1 = {
      tooltip: { trigger: 'axis' },
      legend: { data: ['CPU', '内存', '磁盘'] },
      xAxis: {
        type: 'category',
        data: ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00']
      },
      yAxis: { type: 'value', max: 100 },
      series: [
        {
          name: 'CPU',
          type: 'line',
          data: [45, 48, 52, 49, 45, 47, 50],
          smooth: true,
          itemStyle: { color: '#5470c6' }
        },
        {
          name: '内存',
          type: 'line',
          data: [68, 70, 72, 69, 68, 71, 73],
          smooth: true,
          itemStyle: { color: '#91cc75' }
        },
        {
          name: '磁盘',
          type: 'line',
          data: [25, 26, 28, 27, 25, 26, 29],
          smooth: true,
          itemStyle: { color: '#fac858' }
        }
      ]
    }
    chart1.setOption(option1)
  }

  // 用户活动统计图表
  if (activityChart.value) {
    const chart2 = echarts.init(activityChart.value)
    const option2 = {
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
      },
      yAxis: { type: 'value' },
      series: [{
        type: 'bar',
        data: [12, 8, 45, 120, 85, 35],
        itemStyle: { color: '#73d13d' }
      }]
    }
    chart2.setOption(option2)
  }

  // 安全事件分布图表
  if (securityChart.value) {
    const chart3 = echarts.init(securityChart.value)
    const option3 = {
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: '70%',
        data: [
          { value: 2, name: '异常登录' },
          { value: 1, name: '权限异常' },
          { value: 0, name: '数据泄露' },
          { value: 1, name: '其他' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    }
    chart3.setOption(option3)
  }

  // 操作类型分布图表
  if (operationChart.value) {
    const chart4 = echarts.init(operationChart.value)
    const option4 = {
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 1048, name: '查询' },
          { value: 735, name: '新增' },
          { value: 580, name: '修改' },
          { value: 484, name: '删除' },
          { value: 300, name: '导出' }
        ]
      }]
    }
    chart4.setOption(option4)
  }
}

// 更新资源图表
const updateResourceChart = () => {
  // 根据选择的时间段更新图表数据
  initCharts()
}

// 更新活动图表
const updateActivityChart = () => {
  // 根据选择的时间段更新图表数据
  initCharts()
}

// 快速分析
const quickAnalysis = () => {
  ElMessage.info('正在进行快速分析...')
}

// 查看系统监控
const viewSystemMonitor = () => {
  ElMessage.info('系统监控功能')
}

// 性能报告
const performanceReport = () => {
  ElMessage.info('生成性能报告')
}

// 生成报告
const generateReport = () => {
  ElMessage.info('正在生成审计报告...')
}

// 查看报告
const viewReports = () => {
  ElMessage.info('查看审计报告')
}

// 查看安全详情
const viewSecurityDetails = () => {
  ElMessage.info('查看安全事件详情')
}

// 查看操作详情
const viewOperationDetails = () => {
  ElMessage.info('查看操作详情')
}

// 查看全部活动
const viewAllActivities = () => {
  ElMessage.info('查看全部活动')
}

// 清除全部警报
const clearAllAlerts = () => {
  systemAlerts.value = []
  ElMessage.success('已清除全部警报')
}

// 关闭警报
const dismissAlert = (alertId) => {
  const index = systemAlerts.value.findIndex(alert => alert.id === alertId)
  if (index > -1) {
    systemAlerts.value.splice(index, 1)
  }
}

// 刷新数据
const refreshData = () => {
  loadData()
}

// 加载数据
const loadData = async () => {
  try {
    loading.value = true

    // 调用真实API获取审计系统数据
    const response = await auditApi.getSystemMonitoring()

    if (response.code === 200) {
      // 更新系统监控数据
      Object.assign(systemStatus, response.data.systemStatus || {})
      Object.assign(performanceStatus, response.data.performanceStatus || {})
      Object.assign(storageStatus, response.data.storageStatus || {})
      Object.assign(moduleStats, response.data.moduleStats || {})
    }

  } catch (error) {
    ElMessage.error('加载数据失败，请检查后端服务是否正常运行')
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 启动定时刷新
const startAutoRefresh = () => {
  refreshTimer = setInterval(() => {
    loadData()
  }, 30000) // 30秒刷新一次
}

// 停止定时刷新
const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

// 生命周期
onMounted(() => {
  loadData()
  nextTick(() => {
    initCharts()
  })
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped>
.audit-system {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h2 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
}

.header-content p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 概览区域 */
.overview-section {
  margin-bottom: 20px;
}

.status-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.status-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.status-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.system .status-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.security .status-icon { background: linear-gradient(135deg, #73d13d 0%, #36cfc9 100%); }
.performance .status-icon { background: linear-gradient(135deg, #fac858 0%, #ee6666 100%); }
.storage .status-icon { background: linear-gradient(135deg, #5470c6 0%, #91cc75 100%); }

.status-content {
  flex: 1;
}

.status-value {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}

.status-label {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 4px;
}

.status-detail {
  font-size: 12px;
  color: #8c8c8c;
}

.status-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-indicator.正常,
.status-indicator.success { background: #52c41a; }
.status-indicator.warning { background: #faad14; }
.status-indicator.danger { background: #ff4d4f; }
.status-indicator.info { background: #1890ff; }

/* 模块区域 */
.modules-section {
  margin-bottom: 20px;
}

.module-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
}

.module-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.module-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.module-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.operation-logs .module-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.system-monitor .module-icon { background: linear-gradient(135deg, #73d13d 0%, #36cfc9 100%); }
.audit-reports .module-icon { background: linear-gradient(135deg, #fac858 0%, #ee6666 100%); }

.module-info h3 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
}

.module-info p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
}

.module-stats {
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.stat-row:last-child {
  margin-bottom: 0;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.stat-value.success { color: #52c41a; }
.stat-value.warning { color: #faad14; }
.stat-value.error { color: #ff4d4f; }

.module-actions {
  display: flex;
  gap: 8px;
}

/* 图表区域 */
.charts-section {
  margin-bottom: 20px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

.chart {
  width: 100%;
  height: 300px;
}

/* 活动区域 */
.activity-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

.activity-content {
  padding-left: 16px;
}

.activity-title {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.activity-desc {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
}

.activity-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
}

.activity-user {
  color: #8c8c8c;
}

.activity-level {
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.activity-level.info {
  background: #e6f7ff;
  color: #1890ff;
}

.activity-level.warning {
  background: #fffbe6;
  color: #faad14;
}

.activity-level.success {
  background: #f6ffed;
  color: #52c41a;
}

.activity-level.danger {
  background: #fff2f0;
  color: #ff4d4f;
}

/* 警报区域 */
.alerts-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .audit-system {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .status-card {
    flex-direction: column;
    text-align: center;
  }

  .module-header {
    flex-direction: column;
    text-align: center;
  }

  .module-actions {
    flex-direction: column;
  }

  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
