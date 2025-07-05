<template>
  <div class="data-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2>数据管理</h2>
        <p>数据导入导出、质量检查、清洗和标签管理的统一平台</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="$router.push('/app/data/import-export')">
          <el-icon><Upload /></el-icon>
          导入导出
        </el-button>
        <el-button type="success" @click="$router.push('/app/data/quality-check')">
          <el-icon><Search /></el-icon>
          质量检查
        </el-button>
        <el-button @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 数据概览 -->
    <div class="overview-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card total">
            <div class="stat-icon">
              <el-icon><DataLine /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ formatNumber(overviewData.totalRecords) }}</div>
              <div class="stat-label">总记录数</div>
              <div class="stat-change positive">
                <el-icon><ArrowUp /></el-icon>
                +{{ overviewData.recordGrowth }}%
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card quality">
            <div class="stat-icon">
              <el-icon><CircleCheck /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ overviewData.qualityScore }}</div>
              <div class="stat-label">数据质量评分</div>
              <div class="stat-trend">较上月 +{{ overviewData.qualityImprovement }}分</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card storage">
            <div class="stat-icon">
              <el-icon><FolderOpened /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ formatFileSize(overviewData.storageUsed) }}</div>
              <div class="stat-label">存储使用量</div>
              <div class="stat-trend">剩余 {{ formatFileSize(overviewData.storageRemaining) }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card tasks">
            <div class="stat-icon">
              <el-icon><Operation /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ overviewData.activeTasks }}</div>
              <div class="stat-label">活跃任务数</div>
              <div class="stat-trend">今日完成 {{ overviewData.completedToday }} 个</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 功能模块 -->
    <div class="modules-section">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="module-card import-export">
            <div class="module-header">
              <div class="module-icon">
                <el-icon><Upload /></el-icon>
              </div>
              <div class="module-info">
                <h3>数据导入导出</h3>
                <p>支持多种格式的数据导入导出，包括Excel、CSV、JSON等</p>
              </div>
            </div>
            <div class="module-stats">
              <div class="stat-item">
                <span class="stat-number">{{ moduleStats.importExport.totalTasks }}</span>
                <span class="stat-desc">总任务数</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ moduleStats.importExport.successRate }}%</span>
                <span class="stat-desc">成功率</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ formatFileSize(moduleStats.importExport.dataVolume) }}</span>
                <span class="stat-desc">数据量</span>
              </div>
            </div>
            <div class="module-actions">
              <el-button type="primary" @click="$router.push('/app/data/import-export')">
                进入管理
              </el-button>
              <el-button @click="quickImport">快速导入</el-button>
              <el-button @click="quickExport">快速导出</el-button>
            </div>
          </div>
        </el-col>
        
        <el-col :span="12">
          <div class="module-card quality-check">
            <div class="module-header">
              <div class="module-icon">
                <el-icon><Search /></el-icon>
              </div>
              <div class="module-info">
                <h3>数据质量检查</h3>
                <p>对数据进行完整性、准确性、一致性等多维度质量检查</p>
              </div>
            </div>
            <div class="module-stats">
              <div class="stat-item">
                <span class="stat-number">{{ moduleStats.qualityCheck.lastScore }}</span>
                <span class="stat-desc">最新评分</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ moduleStats.qualityCheck.issuesFound }}</span>
                <span class="stat-desc">发现问题</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ moduleStats.qualityCheck.fixedIssues }}</span>
                <span class="stat-desc">已修复</span>
              </div>
            </div>
            <div class="module-actions">
              <el-button type="success" @click="$router.push('/app/data/quality-check')">
                进入检查
              </el-button>
              <el-button @click="quickCheck">快速检查</el-button>
              <el-button @click="viewReport">查看报告</el-button>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
          <div class="module-card data-cleaning">
            <div class="module-header">
              <div class="module-icon">
                <el-icon><Tools /></el-icon>
              </div>
              <div class="module-info">
                <h3>数据清洗</h3>
                <p>自动化数据清洗，去除重复、填充缺失、标准化格式</p>
              </div>
            </div>
            <div class="module-stats">
              <div class="stat-item">
                <span class="stat-number">{{ moduleStats.dataCleaning.cleanedRecords }}</span>
                <span class="stat-desc">已清洗记录</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ moduleStats.dataCleaning.duplicatesRemoved }}</span>
                <span class="stat-desc">去重数量</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ moduleStats.dataCleaning.missingFilled }}</span>
                <span class="stat-desc">填充缺失</span>
              </div>
            </div>
            <div class="module-actions">
              <el-button type="warning" @click="startCleaning">
                开始清洗
              </el-button>
              <el-button @click="viewCleaningRules">清洗规则</el-button>
              <el-button @click="cleaningHistory">清洗历史</el-button>
            </div>
          </div>
        </el-col>
        
        <el-col :span="12">
          <div class="module-card tag-management">
            <div class="module-header">
              <div class="module-icon">
                <el-icon><PriceTag /></el-icon>
              </div>
              <div class="module-info">
                <h3>标签管理</h3>
                <p>为数据添加标签，便于分类、检索和管理</p>
              </div>
            </div>
            <div class="module-stats">
              <div class="stat-item">
                <span class="stat-number">{{ moduleStats.tagManagement.totalTags }}</span>
                <span class="stat-desc">标签总数</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ moduleStats.tagManagement.taggedRecords }}</span>
                <span class="stat-desc">已标记记录</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ moduleStats.tagManagement.categories }}</span>
                <span class="stat-desc">标签分类</span>
              </div>
            </div>
            <div class="module-actions">
              <el-button type="info" @click="manageTag">
                标签管理
              </el-button>
              <el-button @click="batchTag">批量标记</el-button>
              <el-button @click="tagStatistics">标签统计</el-button>
            </div>
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
              <span class="activity-status" :class="activity.status">
                {{ getStatusText(activity.status) }}
              </span>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>

    <!-- 数据趋势图表 -->
    <div class="charts-section">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h4>数据量趋势</h4>
              <el-select v-model="chartPeriod" size="small" style="width: 120px">
                <el-option label="最近7天" value="7d" />
                <el-option label="最近30天" value="30d" />
                <el-option label="最近90天" value="90d" />
              </el-select>
            </div>
            <!-- 使用新的折线图组件 -->
            <LineChart
              :data="dataVolumeData"
              :x-axis-data="dataVolumeXAxis"
              title=""
              height="300px"
              :smooth="true"
              :show-area="true"
              :area-opacity="0.3"
              :colors="['#5470c6']"
              class="chart"
            />
          </div>
        </el-col>
        
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h4>质量评分趋势</h4>
              <el-select v-model="qualityPeriod" size="small" style="width: 120px">
                <el-option label="最近7天" value="7d" />
                <el-option label="最近30天" value="30d" />
                <el-option label="最近90天" value="90d" />
              </el-select>
            </div>
            <!-- 使用新的折线图组件 -->
            <LineChart
              :data="qualityTrendData"
              :x-axis-data="qualityTrendXAxis"
              title=""
              height="300px"
              :smooth="true"
              :colors="['#91cc75']"
              :y-axis-formatter="(value) => `${value}分`"
              class="chart"
            />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { LineChart } from '@/components/charts'
import { dataApi } from '@/api/data'
import {
  Upload,
  Search,
  Refresh,
  DataLine,
  CircleCheck,
  FolderOpened,
  Operation,
  Tools,
  PriceTag,
  ArrowUp
} from '@element-plus/icons-vue'
import { visualizationApi } from '@/api/visualization'

// 响应式数据
const loading = ref(false)
const chartPeriod = ref('30d')
const qualityPeriod = ref('30d')

// 图表数据
const dataVolumeData = ref([1200, 1350, 1180, 1420, 1680, 1590, 1750])
const dataVolumeXAxis = ref(['12-01', '12-02', '12-03', '12-04', '12-05', '12-06', '12-07'])
const qualityTrendData = ref([85, 87, 84, 89, 92, 88, 91])
const qualityTrendXAxis = ref(['12-01', '12-02', '12-03', '12-04', '12-05', '12-06', '12-07'])

// 概览数据
const overviewData = reactive({
  totalRecords: 15847392,
  recordGrowth: 12.5,
  qualityScore: 87,
  qualityImprovement: 5.2,
  storageUsed: 2147483648, // 2GB
  storageRemaining: 8589934592, // 8GB
  activeTasks: 8,
  completedToday: 15
})

// 模块统计
const moduleStats = reactive({
  importExport: {
    totalTasks: 1247,
    successRate: 96.8,
    dataVolume: 2147483648 // 2GB
  },
  qualityCheck: {
    lastScore: 87,
    issuesFound: 23,
    fixedIssues: 18
  },
  dataCleaning: {
    cleanedRecords: 125000,
    duplicatesRemoved: 3420,
    missingFilled: 8750
  },
  tagManagement: {
    totalTags: 156,
    taggedRecords: 98500,
    categories: 12
  }
})

// 最近活动
const recentActivities = ref([
  {
    id: 1,
    type: 'import',
    title: '人口数据导入完成',
    description: '成功导入15,000条人口数据记录',
    user: '张三',
    status: 'success',
    time: '2023-12-01 14:30'
  },
  {
    id: 2,
    type: 'quality',
    title: '数据质量检查',
    description: '医疗机构数据质量检查发现8个问题',
    user: '李四',
    status: 'warning',
    time: '2023-12-01 13:15'
  },
  {
    id: 3,
    type: 'cleaning',
    title: '数据清洗任务',
    description: '清洗人员数据，去除342条重复记录',
    user: '王五',
    status: 'success',
    time: '2023-12-01 11:45'
  },
  {
    id: 4,
    type: 'export',
    title: '数据导出',
    description: '导出床位统计数据到Excel文件',
    user: '赵六',
    status: 'processing',
    time: '2023-12-01 10:20'
  }
])

// 格式化数字
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 获取活动类型
const getActivityType = (type) => {
  const typeMap = {
    'import': 'primary',
    'export': 'success',
    'quality': 'warning',
    'cleaning': 'info'
  }
  return typeMap[type] || ''
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    'success': '成功',
    'warning': '警告',
    'processing': '进行中',
    'failed': '失败'
  }
  return textMap[status] || '未知'
}

// 更新图表数据
const updateCharts = () => {
  // 根据周期更新数据量趋势
  const days = chartPeriod.value === '7d' ? 7 : chartPeriod.value === '30d' ? 30 : 90
  const newXAxis = []
  const newData = []

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    newXAxis.push(`${date.getMonth() + 1}-${date.getDate()}`)
    newData.push(Math.floor(1000 + Math.random() * 1000))
  }

  dataVolumeXAxis.value = newXAxis
  dataVolumeData.value = newData


  // 根据周期更新质量趋势数据
  const qualityDays = qualityPeriod.value === '7d' ? 7 : qualityPeriod.value === '30d' ? 30 : 90
  const newQualityXAxis = []
  const newQualityData = []

  for (let i = qualityDays - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    newQualityXAxis.push(`${date.getMonth() + 1}-${date.getDate()}`)
    newQualityData.push(Math.floor(80 + Math.random() * 15))
  }

  qualityTrendXAxis.value = newQualityXAxis
  qualityTrendData.value = newQualityData
}

// 快速导入
const quickImport = async () => {
  try {
    // 创建一个隐藏的文件输入元素
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.xlsx,.xls,.csv,.json'
    input.onchange = async (event) => {
      const file = event.target.files[0]
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('dataType', 'health_data')

        try {
          const response = await dataApi.importData(formData)
          if (response.code === 200) {
            ElMessage.success('数据导入成功')
            loadOverviewData()
          } else {
            ElMessage.error(response.message || '导入失败')
          }
        } catch (error) {
          ElMessage.error('导入失败，请检查文件格式')
        }
      }
    }
    input.click()
  } catch (error) {
    ElMessage.error('快速导入功能异常')
  }
}

// 快速导出
const quickExport = async () => {
  try {
    const params = {
      dataType: 'health_data',
      format: 'xlsx',
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
      }
    }

    const response = await dataApi.exportData(params)
    if (response.code === 200) {
      // 创建下载链接
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.download = `health_data_export_${new Date().toISOString().split('T')[0]}.xlsx`
      link.click()
      window.URL.revokeObjectURL(url)
      ElMessage.success('数据导出成功')
    } else {
      ElMessage.error(response.message || '导出失败')
    }
  } catch (error) {
    ElMessage.error('导出失败，请稍后重试')
  }
}

// 快速检查
const quickCheck = async () => {
  try {
    const params = {
      dataType: 'health_data',
      checkType: 'comprehensive'
    }

    const response = await dataApi.checkDataQuality(params)
    if (response.code === 200) {
      ElMessage.success(`质量检查完成，评分：${response.data.score}`)
      loadOverviewData()
    } else {
      ElMessage.error(response.message || '质量检查失败')
    }
  } catch (error) {
    ElMessage.error('质量检查失败，请稍后重试')
  }
}

// 查看报告
const viewReport = async () => {
  try {
    const response = await dataApi.getQualityReport()
    if (response.code === 200) {
      // 这里可以打开一个详细的报告页面或弹窗
      ElMessage.success('报告加载成功')
    } else {
      ElMessage.error(response.message || '获取报告失败')
    }
  } catch (error) {
    ElMessage.error('获取报告失败，请稍后重试')
  }
}

// 开始清洗
const startCleaning = async () => {
  try {
    const params = {
      dataType: 'health_data',
      cleaningRules: ['remove_duplicates', 'fill_missing', 'standardize_format']
    }

    const response = await dataApi.cleanData(params)
    if (response.code === 200) {
      ElMessage.success('数据清洗任务已启动')
      loadOverviewData()
    } else {
      ElMessage.error(response.message || '启动清洗任务失败')
    }
  } catch (error) {
    ElMessage.error('启动清洗任务失败，请稍后重试')
  }
}

// 查看清洗规则
const viewCleaningRules = async () => {
  try {
    const response = await dataApi.getCleaningRules()
    if (response.code === 200) {
      ElMessage.success('清洗规则加载成功')
    } else {
      ElMessage.error(response.message || '获取清洗规则失败')
    }
  } catch (error) {
    ElMessage.error('获取清洗规则失败，请稍后重试')
  }
}

// 清洗历史
const cleaningHistory = async () => {
  try {
    const response = await dataApi.getCleaningHistory()
    if (response.code === 200) {
      ElMessage.success('清洗历史加载成功')
    } else {
      ElMessage.error(response.message || '获取清洗历史失败')
    }
  } catch (error) {
    ElMessage.error('获取清洗历史失败，请稍后重试')
  }
}

// 标签管理
const manageTag = async () => {
  try {
    const response = await dataApi.getDataTags()
    if (response.code === 200) {
      ElMessage.success('标签数据加载成功')
    } else {
      ElMessage.error(response.message || '获取标签数据失败')
    }
  } catch (error) {
    ElMessage.error('获取标签数据失败，请稍后重试')
  }
}

// 批量标记
const batchTag = async () => {
  try {
    const params = {
      dataIds: [], // 这里应该是选中的数据ID数组
      tags: ['health_data', 'verified']
    }

    const response = await dataApi.batchTagData(params)
    if (response.code === 200) {
      ElMessage.success('批量标记成功')
      loadOverviewData()
    } else {
      ElMessage.error(response.message || '批量标记失败')
    }
  } catch (error) {
    ElMessage.error('批量标记失败，请稍后重试')
  }
}

// 标签统计
const tagStatistics = async () => {
  try {
    const response = await dataApi.getTagStatistics()
    if (response.code === 200) {
      ElMessage.success('标签统计加载成功')
    } else {
      ElMessage.error(response.message || '获取标签统计失败')
    }
  } catch (error) {
    ElMessage.error('获取标签统计失败，请稍后重试')
  }
}

// 加载概览数据
const loadOverviewData = async () => {
  try {
    // 获取数据概览统计
    const overviewResponse = await dataApi.getDataOverview()
    if (overviewResponse.code === 200) {
      const data = overviewResponse.data
      overviewData.totalRecords = data.totalRecords || 0
      overviewData.qualityScore = data.qualityScore || 0
      overviewData.storageUsed = data.storageUsed || 0
      overviewData.storageRemaining = data.storageRemaining || 0
      overviewData.activeTasks = data.activeTasks || 0
      overviewData.completedToday = data.completedToday || 0
      overviewData.recordGrowth = data.recordGrowth || 0
      overviewData.qualityImprovement = data.qualityImprovement || 0
    }

    // 获取模块统计数据
    const moduleResponse = await dataApi.getModuleStatistics()
    if (moduleResponse.code === 200) {
      const data = moduleResponse.data

      // 更新导入导出统计
      if (data.importExport) {
        moduleStats.importExport.totalTasks = data.importExport.totalTasks || 0
        moduleStats.importExport.successRate = data.importExport.successRate || 0
        moduleStats.importExport.dataVolume = data.importExport.dataVolume || 0
      }

      // 更新质量检查统计
      if (data.qualityCheck) {
        moduleStats.qualityCheck.lastScore = data.qualityCheck.lastScore || 0
        moduleStats.qualityCheck.issuesFound = data.qualityCheck.issuesFound || 0
        moduleStats.qualityCheck.fixedIssues = data.qualityCheck.fixedIssues || 0
      }

      // 更新数据清洗统计
      if (data.dataCleaning) {
        moduleStats.dataCleaning.cleanedRecords = data.dataCleaning.cleanedRecords || 0
        moduleStats.dataCleaning.duplicatesRemoved = data.dataCleaning.duplicatesRemoved || 0
        moduleStats.dataCleaning.missingFilled = data.dataCleaning.missingFilled || 0
      }

      // 更新标签管理统计
      if (data.tagManagement) {
        moduleStats.tagManagement.totalTags = data.tagManagement.totalTags || 0
        moduleStats.tagManagement.taggedRecords = data.tagManagement.taggedRecords || 0
        moduleStats.tagManagement.categories = data.tagManagement.categories || 0
      }
    }

    // 获取最近活动
    const activityResponse = await dataApi.getRecentActivities()
    if (activityResponse.code === 200) {
      recentActivities.value = activityResponse.data || []
    }
  } catch (error) {
    console.error('加载概览数据失败:', error)
    ElMessage.error('加载数据失败，请检查后端服务是否正常运行')
  }
}

// 查看全部活动
const viewAllActivities = () => {
  ElMessage.info('查看全部活动功能')
}

// 刷新数据
const refreshData = async () => {
  await loadOverviewData()
  updateCharts()
  ElMessage.success('数据已刷新')
}
  loadData()
}

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    await loadOverviewData()
  } catch (error) {
    ElMessage.error('加载数据失败')
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 监听图表周期变化
watch([chartPeriod, qualityPeriod], () => {
  updateCharts()
})

// 生命周期
onMounted(async () => {
  await nextTick()
  loadData()
  updateCharts()
})
</script>

<style scoped>
.data-management {
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

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.total .stat-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.quality .stat-icon { background: linear-gradient(135deg, #73d13d 0%, #36cfc9 100%); }
.storage .stat-icon { background: linear-gradient(135deg, #fac858 0%, #ee6666 100%); }
.tasks .stat-icon { background: linear-gradient(135deg, #5470c6 0%, #91cc75 100%); }

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 4px;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #52c41a;
}

.stat-trend {
  font-size: 12px;
  color: #8c8c8c;
}

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

.import-export .module-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.quality-check .module-icon { background: linear-gradient(135deg, #73d13d 0%, #36cfc9 100%); }
.data-cleaning .module-icon { background: linear-gradient(135deg, #fac858 0%, #ee6666 100%); }
.tag-management .module-icon { background: linear-gradient(135deg, #5470c6 0%, #91cc75 100%); }

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
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.stat-desc {
  font-size: 12px;
  color: #8c8c8c;
}

.module-actions {
  display: flex;
  gap: 8px;
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

.activity-status {
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.activity-status.success {
  background: #f6ffed;
  color: #52c41a;
}

.activity-status.warning {
  background: #fffbe6;
  color: #faad14;
}

.activity-status.processing {
  background: #e6f7ff;
  color: #1890ff;
}

.activity-status.failed {
  background: #fff2f0;
  color: #ff4d4f;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .data-management {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
  }

  .module-header {
    flex-direction: column;
    text-align: center;
  }

  .module-stats {
    flex-direction: column;
    gap: 12px;
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
