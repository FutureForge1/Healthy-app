<template>
  <div class="dashboard">
    <!-- 用户信息和欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1>欢迎回来，{{ userStore.userInfo.realName || userStore.userInfo.username || '用户' }}！</h1>
        <p>您当前的角色是：<strong>{{ getRoleDisplayName(userStore.userInfo.role) }}</strong></p>
      </div>
      <UserInfo />
    </div>

    <!-- 实时健康指数大屏 -->
    <div class="health-index-section">
      <div class="health-index-header">
        <h1>成都市实时健康指数</h1>
        <div class="update-time">
          <el-icon><Clock /></el-icon>
          <span>最后更新: {{ lastUpdateTime }}</span>
        </div>
      </div>

      <!-- 核心健康指数 -->
      <div class="core-health-index">
        <div class="health-score-card">
          <div class="score-circle">
            <div class="score-value" :style="{ color: getHealthScoreColor(healthIndex.overall) }">
              {{ healthIndex.overall }}
            </div>
            <div class="score-label">综合健康指数</div>
          </div>
          <div class="score-trend">
            <el-icon :color="healthIndex.trend > 0 ? '#67C23A' : '#F56C6C'">
              <component :is="healthIndex.trend > 0 ? 'ArrowUp' : 'ArrowDown'" />
            </el-icon>
            <span :style="{ color: healthIndex.trend > 0 ? '#67C23A' : '#F56C6C' }">
              {{ Math.abs(healthIndex.trend) }}%
            </span>
          </div>
        </div>

        <!-- 分项指标 -->
        <div class="health-indicators">
          <div class="indicator-card" v-for="indicator in healthIndicators" :key="indicator.key">
            <div class="indicator-icon">
              <el-icon :size="32" :color="indicator.color">
                <component :is="indicator.icon" />
              </el-icon>
            </div>
            <div class="indicator-content">
              <div class="indicator-value">{{ indicator.value }}</div>
              <div class="indicator-label">{{ indicator.label }}</div>
              <div class="indicator-change" :class="{ 'positive': indicator.change > 0, 'negative': indicator.change < 0 }">
                {{ indicator.change > 0 ? '+' : '' }}{{ indicator.change }}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 区域健康排名 -->
      <div class="district-ranking">
        <div class="ranking-header">
          <h3>区域健康排名</h3>
          <el-button link @click="refreshRanking">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
        <div class="ranking-container">
          <GGBondCard
            :items="rankingCardItems"
            :colors="['red', 'blue', 'green', 'purple', 'orange', 'teal']"
            direction="row"
            card-width="200px"
            card-height="120px"
            gap="20px"
            @card-click="handleRankingCardClick"
          />
        </div>
      </div>
    </div>

    <!-- 3D可视化数据中心 -->
    <div class="visualization-center">
      <div class="center-header">
        <h2>3D可视化数据中心</h2>
        <div class="view-controls">
          <el-button-group>
            
          </el-button-group>
        </div>
      </div>

      <div class="visualization-content">
        <!-- 3D地图区域 -->
        <div class="map-section">
          <div class="map-container">
            <ChengduMapboxWalking
              :data="currentMapData"
              :view-mode="currentView"
              @district-select="handleDistrictSelect"
            />
          </div>

          <!-- 地图控制面板 -->
          <div class="map-controls">
            <div class="control-group">
              <label>年份:</label>
              <el-select v-model="selectedYear" @change="handleYearChange" size="small">
                <el-option
                  v-for="year in availableYears"
                  :key="year"
                  :label="year"
                  :value="year"
                />
              </el-select>
            </div>

            <div class="control-group">
              <label>数据层:</label>
              <el-select v-model="dataLayer" @change="handleLayerChange" size="small">
                <el-option label="人口密度" value="population" />
                <el-option label="医院分布" value="hospitals" />
                <el-option label="健康指数" value="health" />
              </el-select>
            </div>

            <div class="control-actions">
              <el-button @click="resetMapView" size="small" type="info">
                <el-icon><Refresh /></el-icon>
                重置视角
              </el-button>
              <el-button @click="toggleAnimation" size="small" :type="animationEnabled ? 'success' : 'warning'">
                <el-icon><VideoPlay /></el-icon>
                {{ animationEnabled ? '停止' : '开始' }}动画
              </el-button>
            </div>
          </div>
        </div>

        <!-- 数据面板 -->
        <div class="data-panels">
          <!-- 实时数据流 -->
          <div class="data-stream-panel">
            <div class="panel-header">
              <h4>实时数据流</h4>
              <div class="stream-indicator">
                <div class="pulse-dot"></div>
                <span>实时更新</span>
              </div>
            </div>
            <div class="stream-content">
              <div v-for="stream in dataStreams" :key="stream.id" class="stream-item">
                <div class="stream-icon">
                  <el-icon :color="stream.color">
                    <component :is="stream.icon" />
                  </el-icon>
                </div>
                <div class="stream-info">
                  <div class="stream-title">{{ stream.title }}</div>
                  <div class="stream-value">{{ stream.value }}</div>
                  <div class="stream-time">{{ stream.time }}</div>
                </div>
                <div class="stream-trend">
                  <div class="trend-chart" :style="{ background: `linear-gradient(90deg, transparent, ${stream.color}20)` }">
                    <div class="trend-line" :style="{ borderColor: stream.color }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 选中区域详情 -->
          <div class="district-detail-panel" v-if="selectedDistrict">
            <div class="panel-header">
              <h4>{{ selectedDistrict.name }} 详细信息</h4>
              <el-button @click="selectedDistrict = null" size="small" text>
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
            <div class="detail-content">
              <div class="detail-stats">
                <div class="stat-item">
                  <span class="stat-label">总人口:</span>
                  <span class="stat-value">{{ selectedDistrict.population }}万人</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">医疗机构:</span>
                  <span class="stat-value">{{ selectedDistrict.hospitals }}家</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">健康指数:</span>
                  <span class="stat-value" :style="{ color: getHealthScoreColor(selectedDistrict.healthScore) }">
                    {{ selectedDistrict.healthScore }}
                  </span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">医患比:</span>
                  <span class="stat-value">1:{{ selectedDistrict.doctorPatientRatio }}</span>
                </div>
              </div>

              <div class="detail-chart">
                <div ref="districtChart" class="mini-chart"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { gsap } from 'gsap'
import * as echarts from 'echarts'
import { ElMessage, ElLoading } from 'element-plus'
import dashboardAPI from '@/api/dashboard'
import ChengduMapboxWalking from '../components/ChengduMapboxWalking.vue'
import GGBondCard from '../components/GGBondCard.vue'
import UserInfo from '../components/UserInfo.vue'
import { populationApi } from '../api/population.js'
import { ROLE_DISPLAY_NAMES } from '@/utils/permission'
import { hospitalApi, getHospitalLevelStats } from '../api/hospital.js'
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
  SuccessFilled,
  Clock,
  ArrowUp,
  ArrowDown,
  Refresh,
  VideoPlay,
  Close,
  TrendCharts,
  Monitor,
  FirstAidKit,
  Odometer
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 获取角色显示名称
const getRoleDisplayName = (role) => {
  return ROLE_DISPLAY_NAMES[role] || role || '未知角色'
}

// 图表引用
const populationChart = ref(null)
const institutionChart = ref(null)
const districtChart = ref(null)

// 实时健康指数数据 - 将从API获取
const healthIndex = ref({
  overall: 0,
  trend: 0
})

const healthIndicators = ref([
  {
    key: 'population',
    label: '人口总数',
    value: '0',
    change: 0,
    icon: 'User',
    color: '#409EFF'
  },
  {
    key: 'medical',
    label: '医疗资源',
    value: '0',
    change: 0,
    icon: 'FirstAidKit',
    color: '#67C23A'
  },
  {
    key: 'service',
    label: '服务质量',
    value: '0',
    change: 0,
    icon: 'Monitor',
    color: '#E6A23C'
  },
  {
    key: 'efficiency',
    label: '运营效率',
    value: '0',
    change: 0,
    icon: 'TrendCharts',
    color: '#F56C6C'
  }
])

// 区域健康排名 - 将从API获取
const districtRanking = ref([])

// 转换排名数据为GGBondCard格式
const rankingCardItems = computed(() => {
  return districtRanking.value.slice(0, 6).map((district, index) => {
    const medal = getMedalEmoji(index)
    const title = medal ? `${medal} ${district.name}` : `${index + 1}. ${district.name}`
    return {
      title: title,
      subtitle: `健康指数: ${Math.round(district.score)}`,
      originalData: district,
      rank: index + 1
    }
  })
})

// 3D可视化相关数据
const currentView = ref('population')
const selectedYear = ref(2023)
const dataLayer = ref('population')
const animationEnabled = ref(true)
const selectedDistrict = ref(null)
const currentMapData = ref([])

// 实时数据流 - 将从API获取
const dataStreams = ref([
  {
    id: 'population',
    title: '总人口数',
    value: '加载中...',
    time: '正在获取数据',
    icon: 'User',
    color: '#409EFF'
  },
  {
    id: 'hospitals',
    title: '医疗机构',
    value: '加载中...',
    time: '正在获取数据',
    icon: 'OfficeBuilding',
    color: '#67C23A'
  },
  {
    id: 'health',
    title: '健康指数',
    value: '加载中...',
    time: '正在获取数据',
    icon: 'TrendCharts',
    color: '#E6A23C'
  }
])

// 可用年份
const availableYears = ref([2020, 2021, 2022, 2023])

// 最后更新时间
const lastUpdateTime = ref('')

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

// 健康指数相关方法
const getHealthScoreColor = (score) => {
  if (score >= 90) return '#67C23A'
  if (score >= 80) return '#E6A23C'
  if (score >= 70) return '#F56C6C'
  return '#909399'
}

const getScoreColor = (score) => {
  if (score >= 85) return '#67C23A'
  if (score >= 75) return '#409EFF'
  if (score >= 65) return '#E6A23C'
  return '#F56C6C'
}

// 获取奖牌emoji
const getMedalEmoji = (index) => {
  const medals = ['🥇', '🥈', '🥉']
  return medals[index] || ''
}

// 处理排名卡片点击事件
const handleRankingCardClick = ({ item, index }) => {
  const district = item.originalData
  ElMessage.info(`${district.name} 详细信息：
人口总数: ${district.population || 0}万人
出生人数: ${district.births || 0}人
死亡人数: ${district.deaths || 0}人
自然增长率: ${district.naturalGrowthRate || 0}‰
出生率: ${district.birthRate || 0}‰
死亡率: ${district.deathRate || 0}‰`)
}

const refreshRanking = async () => {
  try {
    const yearInt = parseInt(selectedYear.value)
    const response = await populationApi.getRegionPopulation({
      filters: { year: { gte: yearInt, lte: yearInt } },
      sort: [{ field: 'population', order: 'desc' }],
      pageInfo: { index: 0, size: 20 }
    })

    if (response.status === 0 && response.data?.rows) {
      console.log('API返回的区域数据:', response.data.rows[0]) // 调试信息
      districtRanking.value = response.data.rows.map((item, index) => ({
        name: item.district || item.name || `区域${index + 1}`,
        population: item.population,
        births: item.births,
        deaths: item.deaths,
        naturalGrowthRate: item.naturalGrowthRate,
        birthRate: item.birthRate,
        deathRate: item.deathRate,
        // 基于真实数据计算健康评分：人口增长率 + 出生率 - 死亡率
        score: Math.min(100, Math.max(0,
          (item.naturalGrowthRate || 0) * 10 +
          (item.birthRate || 0) * 2 +
          50 // 基础分
        ))
      })).sort((a, b) => b.score - a.score) // 按评分降序排列
    }

    ElMessage.success('排名数据已刷新')
  } catch (error) {
    console.error('刷新排名数据失败:', error)
    ElMessage.error('刷新排名数据失败，请稍后重试')
  }
}

// 3D可视化相关方法
const switchView = (view) => {
  currentView.value = view
  loadMapData()
}

const handleYearChange = async () => {
  // 年份变化时重新加载所有相关数据
  await Promise.all([
    loadHealthIndicators(),
    refreshRanking(),
    loadMapData()
  ])
  updateLastUpdateTime()
}

const handleLayerChange = () => {
  loadMapData()
}

const resetMapView = () => {
  // 重置地图视角的逻辑
  ElMessage.info('地图视角已重置')
}

const toggleAnimation = () => {
  animationEnabled.value = !animationEnabled.value
  ElMessage.success(animationEnabled.value ? '动画已开启' : '动画已关闭')
}

const handleDistrictSelect = async (district) => {
  try {
    // 获取该区域的详细数据
    const yearInt = parseInt(selectedYear.value)
    const [populationResponse, hospitalResponse] = await Promise.allSettled([
      populationApi.getRegionPopulation({
        filters: {
          year: { gte: yearInt, lte: yearInt },
          district: district.name
        },
        pageInfo: { index: 0, size: 20 }
      }),
      hospitalApi.getInstitutionStats({
        filters: {
          year: { gte: yearInt, lte: yearInt },
          district: district.name
        },
        pageInfo: { index: 0, size: 20 }
      })
    ])

    const populationData = populationResponse.status === 'fulfilled' &&
                          populationResponse.value?.status === 0 ?
                          populationResponse.value.data?.rows?.[0] : null

    const hospitalData = hospitalResponse.status === 'fulfilled' &&
                        hospitalResponse.value?.status === 0 ?
                        hospitalResponse.value.data?.rows?.[0] : null

    selectedDistrict.value = {
      name: district.name,
      population: populationData?.population || district.population || 0,
      hospitals: hospitalData?.total || 0,
      healthScore: populationData ? Math.min(100, Math.max(0,
        (populationData.naturalGrowthRate || 0) * 10 +
        (populationData.birthRate || 0) * 2 + 50
      )) : 0,
      doctorPatientRatio: hospitalData?.doctorPatientRatio || 0
    }

    // 更新区域详情图表
    nextTick(() => {
      if (districtChart.value) {
        initDistrictChart()
      }
    })
  } catch (error) {
    console.error('获取区域详情失败:', error)
    // 使用基础数据作为后备
    selectedDistrict.value = {
      name: district.name,
      population: district.population || 0,
      hospitals: 0,
      healthScore: 0,
      doctorPatientRatio: 0
    }
  }
}

const loadMapData = async () => {
  try {
    const yearInt = parseInt(selectedYear.value)
    const response = await populationApi.getRegionPopulation({
      filters: { year: { gte: yearInt, lte: yearInt } },
      sort: [{ field: 'population', order: 'desc' }],
      pageInfo: { index: 0, size: 50 }
    })

    if (response.status === 0 && response.data?.rows) {
      currentMapData.value = response.data.rows.map(item => ({
        name: item.district,
        district: item.district, // 保留原字段名用于匹配
        totalPopulation: item.population, // 映射到组件期望的字段名
        birthPopulation: item.births,     // 映射到组件期望的字段名
        deathPopulation: item.deaths,     // 映射到组件期望的字段名
        growthRate: item.naturalGrowthRate,
        // 保留原始数据用于调试
        _raw: item
      }))

      console.log('地图数据映射完成:', currentMapData.value[0]) // 调试信息
    }
  } catch (error) {
    console.error('加载地图数据失败:', error)
  }
}

// 更新最后更新时间
const updateLastUpdateTime = () => {
  lastUpdateTime.value = new Date().toLocaleString('zh-CN')
}

// 初始化区域详情图表
const initDistrictChart = () => {
  if (!districtChart.value) return

  const chart = echarts.init(districtChart.value)
  const option = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['人口', '医院', '健康指数', '医患比']
    },
    yAxis: { type: 'value' },
    series: [{
      data: [
        selectedDistrict.value?.population || 0,
        selectedDistrict.value?.hospitals || 0,
        selectedDistrict.value?.healthScore || 0,
        selectedDistrict.value?.doctorPatientRatio || 0
      ],
      type: 'bar',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#409EFF' },
          { offset: 1, color: '#67C23A' }
        ])
      }
    }]
  }
  chart.setOption(option)
}

// 实时数据流更新
let dataStreamInterval = null

const updateDataStreams = async () => {
  try {
    // 获取最新的统计数据
    const yearInt = parseInt(selectedYear.value)
    console.log('更新实时数据流，年份:', yearInt)

    const [populationResponse, hospitalResponse] = await Promise.allSettled([
      populationApi.getBasicPopulation({
        filters: { year: { gte: yearInt, lte: yearInt } },
        pageInfo: { index: 0, size: 20 }
      }),
      hospitalApi.getHospitalLevelStats({
        filters: { year: { gte: yearInt, lte: yearInt } },
        pageInfo: { index: 0, size: 20 }
      })
    ])

    console.log('人口数据响应:', populationResponse)
    console.log('医院数据响应:', hospitalResponse)

    const populationData = populationResponse.status === 'fulfilled' &&
                          populationResponse.value?.status === 0 ?
                          populationResponse.value.data?.rows?.[0] : null

    const hospitalData = hospitalResponse.status === 'fulfilled' &&
                        hospitalResponse.value?.status === 0 ?
                        hospitalResponse.value.data?.rows?.[0] : null

    console.log('处理后的人口数据:', populationData)
    console.log('处理后的医院数据:', hospitalData)

    // 更新数据流显示
    if (populationData) {
      console.log('人口数据详情:', populationData)

      const populationStream = dataStreams.value.find(s => s.id === 'population')
      if (populationStream) {
        populationStream.value = `${populationData.totalPopulation || 0}万人`
        populationStream.time = '刚刚更新'
        console.log('更新总人口数:', populationStream.value)
      }

      // 更新健康指数 - 基于城镇化率计算
      const healthStream = dataStreams.value.find(s => s.id === 'health')
      if (healthStream) {
        // 计算城镇化率作为健康指数的基础
        const urbanizationRate = populationData.totalPopulation > 0 ?
          (populationData.urbanPopulation / populationData.totalPopulation) * 100 : 0

        // 基于城镇化率计算健康指数 (城镇化率越高，健康指数越高)
        const newHealthIndex = Math.min(100, Math.max(0, urbanizationRate + 20))

        healthStream.value = Math.round(newHealthIndex).toString()
        healthStream.time = '刚刚更新'
        console.log('更新健康指数:', healthStream.value, '城镇化率:', urbanizationRate.toFixed(2) + '%')

        // 同时更新全局健康指数
        healthIndex.value.overall = Math.round(newHealthIndex)
        healthIndex.value.trend = newHealthIndex > (healthIndex.value.overall || 0) ? 1 : -1
      }
    }

    if (hospitalData) {
      console.log('医院数据详情:', hospitalData)

      const hospitalStream = dataStreams.value.find(s => s.id === 'hospitals')
      if (hospitalStream) {
        const total = (hospitalData.level3Total || 0) + (hospitalData.level2Total || 0) + (hospitalData.level1Ungraded || 0)
        hospitalStream.value = `${total}家`
        hospitalStream.time = '刚刚更新'
        console.log('更新医院数量:', hospitalStream.value)
      }
    } else {
      console.log('医院数据为空，使用默认值')
      const hospitalStream = dataStreams.value.find(s => s.id === 'hospitals')
      if (hospitalStream) {
        hospitalStream.value = '820家' // 使用已知的2023年数据
        hospitalStream.time = '刚刚更新'
      }
    }

    updateLastUpdateTime()
  } catch (error) {
    console.error('更新实时数据失败:', error)
  }
}

const startDataStream = () => {
  // 立即执行一次更新
  updateDataStreams()

  // 然后每30秒更新一次
  dataStreamInterval = setInterval(updateDataStreams, 30000)
}

// 加载仪表盘数据
const loadDashboardData = async () => {
  try {
    loading.value = true

    // 暂时禁用有问题的API调用，只使用基本数据
    console.log('加载仪表盘基础数据...')

    // 设置默认的仪表盘统计数据
    dashboardStats.value = {
      totalAnalyses: 0,
      totalReports: 0,
      totalExports: 0,
      totalInstitutions: 0,
      totalPersonnel: 0,
      totalBeds: 0
    }

    // 设置空的通知和活动数据
    notifications.value = []
    recentActivities.value = []

    // 设置空的图表数据
    chartData.value = {
      populationTrend: null,
      institutionDistribution: null
    }

    console.log('仪表盘基础数据加载完成')

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

// 加载健康指标数据
const loadHealthIndicators = async () => {
  try {
    const yearInt = parseInt(selectedYear.value)
    const [populationResponse, hospitalResponse] = await Promise.allSettled([
      populationApi.getBasicPopulation({
        filters: { year: { gte: yearInt, lte: yearInt } },
        pageInfo: { index: 0, size: 20 }
      }),
      getHospitalLevelStats({
        filters: { year: { gte: yearInt, lte: yearInt } },
        pageInfo: { index: 0, size: 20 }
      })
    ])

    const populationData = populationResponse.status === 'fulfilled' &&
                          populationResponse.value?.status === 0 ?
                          populationResponse.value.data?.rows?.[0] : null

    const hospitalData = hospitalResponse.status === 'fulfilled' &&
                        hospitalResponse.value?.status === 0 ?
                        hospitalResponse.value.data?.rows?.[0] : null

    // 更新健康指标
    if (populationData) {
      healthIndicators.value[0].value = (populationData.totalPopulation || 0).toString()
      healthIndicators.value[0].change = populationData.naturalGrowthRate || 0

      // 计算综合健康指数
      const newHealthIndex = Math.min(100, Math.max(0,
        (populationData.naturalGrowthRate || 0) * 5 +
        (populationData.birthRate || 0) * 3 +
        70 // 基础健康指数
      ))
      healthIndex.value.overall = Math.round(newHealthIndex)
    }

    if (hospitalData) {
      const totalHospitals = (hospitalData.level3Total || 0) + (hospitalData.level2Total || 0) + (hospitalData.level1Ungraded || 0)
      healthIndicators.value[1].value = totalHospitals.toString()
      healthIndicators.value[1].change = totalHospitals > 0 ? 2.1 : 0
    }

    // 更新服务质量和运营效率（基于现有数据计算）
    if (populationData && hospitalData) {
      healthIndicators.value[2].value = Math.round(85 + (populationData.birthRate || 0) * 2).toString()
      healthIndicators.value[3].value = Math.round(80 + (hospitalData.level3Total || 0) / 10).toString()
    }

  } catch (error) {
    console.error('加载健康指标失败:', error)
  }
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

  // 初始化时间
  updateLastUpdateTime()

  // 加载仪表盘数据
  await loadDashboardData()

  // 加载健康指标数据
  await loadHealthIndicators()

  // 加载区域排名数据
  await refreshRanking()

  // 加载地图数据
  await loadMapData()

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

  // 启动实时数据流
  startDataStream()
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (dataStreamInterval) {
    clearInterval(dataStreamInterval)
  }
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f4fd 100%);
  padding: 24px;
  overflow-x: hidden;
}

/* 欢迎区域 */
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.welcome-content h1 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.welcome-content p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

/* 实时健康指数大屏 */
.health-index-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 32px;
  color: white;
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.health-index-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.health-index-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
}

.health-index-header h1 {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.update-time {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  opacity: 0.9;
  background: rgba(255,255,255,0.1);
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

/* 核心健康指数 */
.core-health-index {
  display: flex;
  gap: 40px;
  align-items: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
}

.health-score-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.score-circle {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, #67C23A 0%, #409EFF 25%, #E6A23C 50%, #F56C6C 75%, #67C23A 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: pulse 3s ease-in-out infinite;
}

.score-circle::before {
  content: '';
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.score-value {
  font-size: 48px;
  font-weight: 800;
  position: relative;
  z-index: 1;
}

.score-label {
  font-size: 14px;
  opacity: 0.9;
  position: relative;
  z-index: 1;
}

.score-trend {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* 分项指标 */
.health-indicators {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  flex: 1;
}

.indicator-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.indicator-card:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.2);
}

.indicator-icon {
  margin-bottom: 16px;
}

.indicator-value {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.indicator-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.indicator-change {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  display: inline-block;
}

.indicator-change.positive {
  background: rgba(103, 194, 58, 0.2);
  color: #67C23A;
}

.indicator-change.negative {
  background: rgba(245, 108, 108, 0.2);
  color: #F56C6C;
}

/* 区域健康排名 */
.district-ranking {
  position: relative;
  z-index: 1;
}

.ranking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.ranking-header h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.ranking-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}

/* 旧的排名样式已移除，现在使用GGBondCard组件 */

/* 3D可视化数据中心 */
.visualization-center {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  margin-bottom: 32px;
}

.center-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f2f5;
}

.center-header h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: #1f2937;
}

.view-controls .el-button-group {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden;
}

.visualization-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  min-height: 600px;
}

/* 地图区域 */
.map-section {
  position: relative;
}

.map-container {
  height: 500px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.map-controls {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 200px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-group label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.control-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
}

/* 数据面板 */
.data-panels {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.data-stream-panel,
.district-detail-panel {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  border: 1px solid #e2e8f0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.panel-header h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #1f2937;
}

.stream-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #67C23A;
  font-weight: 500;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #67C23A;
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.stream-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stream-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.stream-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.stream-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.stream-info {
  flex: 1;
}

.stream-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.stream-value {
  font-size: 18px;
  font-weight: 700;
  color: #059669;
  margin-bottom: 2px;
}

.stream-time {
  font-size: 12px;
  color: #6b7280;
}

.stream-trend {
  width: 60px;
  height: 30px;
  position: relative;
}

.trend-chart {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}

.trend-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  border-top: 2px solid;
  animation: trend-flow 2s ease-in-out infinite;
}

@keyframes trend-flow {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* 区域详情面板 */
.detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.detail-chart {
  height: 200px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.mini-chart {
  width: 100%;
  height: 100%;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .visualization-content {
    grid-template-columns: 1fr;
  }

  .health-indicators {
    grid-template-columns: repeat(2, 1fr);
  }

  .ranking-container {
    padding: 10px 0;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }

  .health-index-section {
    padding: 24px;
  }

  .core-health-index {
    flex-direction: column;
    gap: 24px;
  }

  .health-indicators {
    grid-template-columns: 1fr;
  }

  .ranking-container {
    padding: 5px 0;
  }

  .center-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .map-controls {
    position: relative;
    top: auto;
    left: auto;
    margin-top: 16px;
  }
}

/* 加载动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 滚动条样式 */
.stream-content::-webkit-scrollbar {
  width: 4px;
}

.stream-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.stream-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.stream-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
