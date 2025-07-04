<template>
  <div class="population-stats">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2>人口统计分析</h2>
        <p>成都市人口分布、年龄结构、性别比例等统计数据</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="exportData">
          <el-icon><Download /></el-icon>
          导出数据
        </el-button>
        <el-button @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
      </div>
    </div>

    <!-- 筛选条件 -->
    <div class="filter-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-select v-model="filters.district" placeholder="选择区域" clearable @change="handleFilterChange">
            <el-option label="全市" value="" />
            <el-option label="锦江区" value="jinjiang" />
            <el-option label="青羊区" value="qingyang" />
            <el-option label="金牛区" value="jinniu" />
            <el-option label="武侯区" value="wuhou" />
            <el-option label="成华区" value="chenghua" />
            <el-option label="龙泉驿区" value="longquanyi" />
            <el-option label="青白江区" value="qingbaijiang" />
            <el-option label="新都区" value="xindu" />
            <el-option label="温江区" value="wenjiang" />
            <el-option label="双流区" value="shuangliu" />
            <el-option label="郫都区" value="pidu" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="filters.year"
            type="year"
            placeholder="选择年份"
            @change="handleFilterChange"
          />
        </el-col>
        <el-col :span="6">
          <el-select v-model="filters.ageGroup" placeholder="年龄组" clearable @change="handleFilterChange">
            <el-option label="全年龄段" value="" />
            <el-option label="0-14岁" value="0-14" />
            <el-option label="15-64岁" value="15-64" />
            <el-option label="65岁以上" value="65+" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="resetFilters">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 统计概览卡片 -->
    <div class="overview-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card total-population">
            <div class="stat-icon">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ formatNumber(overviewData.totalPopulation) }}</div>
              <div class="stat-label">总人口</div>
              <div class="stat-change" :class="overviewData.populationChange >= 0 ? 'positive' : 'negative'">
                <el-icon><ArrowUp v-if="overviewData.populationChange >= 0" /><ArrowDown v-else /></el-icon>
                {{ Math.abs(overviewData.populationChange) }}%
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card male-population">
            <div class="stat-icon">
              <el-icon><Male /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ formatNumber(overviewData.malePopulation) }}</div>
              <div class="stat-label">男性人口</div>
              <div class="stat-ratio">占比 {{ overviewData.maleRatio }}%</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card female-population">
            <div class="stat-icon">
              <el-icon><Female /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ formatNumber(overviewData.femalePopulation) }}</div>
              <div class="stat-label">女性人口</div>
              <div class="stat-ratio">占比 {{ overviewData.femaleRatio }}%</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card density">
            <div class="stat-icon">
              <el-icon><Location /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ overviewData.populationDensity }}</div>
              <div class="stat-label">人口密度</div>
              <div class="stat-unit">人/平方公里</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <el-row :gutter="20">
        <!-- 年龄结构分布 -->
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h4>年龄结构分布</h4>
              <el-button-group>
                <el-button size="small" :type="ageChartType === 'pie' ? 'primary' : ''" @click="ageChartType = 'pie'">饼图</el-button>
                <el-button size="small" :type="ageChartType === 'bar' ? 'primary' : ''" @click="ageChartType = 'bar'">柱图</el-button>
              </el-button-group>
            </div>
            <div ref="ageChartRef" class="chart"></div>
          </div>
        </el-col>
        
        <!-- 性别比例 -->
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h4>性别比例分布</h4>
            </div>
            <div ref="genderChartRef" class="chart"></div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px;">
        <!-- 人口趋势 -->
        <el-col :span="24">
          <div class="chart-card">
            <div class="chart-header">
              <h4>人口变化趋势</h4>
              <el-radio-group v-model="trendPeriod" @change="updateTrendChart">
                <el-radio-button label="5年">近5年</el-radio-button>
                <el-radio-button label="10年">近10年</el-radio-button>
                <el-radio-button label="20年">近20年</el-radio-button>
              </el-radio-group>
            </div>
            <div ref="trendChartRef" class="chart trend-chart"></div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 区域分布表格 -->
    <div class="table-section">
      <div class="table-header">
        <h4>各区域人口分布详情</h4>
        <el-button type="primary" size="small" @click="showDistrictDetail">
          <el-icon><View /></el-icon>
          查看详情
        </el-button>
      </div>
      <el-table
        v-loading="tableLoading"
        :data="districtData"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column prop="district" label="区域" width="120" />
        <el-table-column prop="totalPopulation" label="总人口" width="120">
          <template #default="{ row }">
            {{ formatNumber(row.totalPopulation) }}
          </template>
        </el-table-column>
        <el-table-column prop="malePopulation" label="男性人口" width="120">
          <template #default="{ row }">
            {{ formatNumber(row.malePopulation) }}
          </template>
        </el-table-column>
        <el-table-column prop="femalePopulation" label="女性人口" width="120">
          <template #default="{ row }">
            {{ formatNumber(row.femalePopulation) }}
          </template>
        </el-table-column>
        <el-table-column prop="density" label="人口密度" width="120">
          <template #default="{ row }">
            {{ row.density }} 人/km²
          </template>
        </el-table-column>
        <el-table-column prop="ageGroup0_14" label="0-14岁" width="100">
          <template #default="{ row }">
            {{ row.ageGroup0_14 }}%
          </template>
        </el-table-column>
        <el-table-column prop="ageGroup15_64" label="15-64岁" width="100">
          <template #default="{ row }">
            {{ row.ageGroup15_64 }}%
          </template>
        </el-table-column>
        <el-table-column prop="ageGroup65Plus" label="65岁以上" width="100">
          <template #default="{ row }">
            {{ row.ageGroup65Plus }}%
          </template>
        </el-table-column>
        <el-table-column prop="growthRate" label="增长率" width="100">
          <template #default="{ row }">
            <span :class="row.growthRate >= 0 ? 'positive' : 'negative'">
              {{ row.growthRate >= 0 ? '+' : '' }}{{ row.growthRate }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="viewDistrictDetail(row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Download,
  Refresh,
  Search,
  User,
  Male,
  Female,
  Location,
  ArrowUp,
  ArrowDown,
  View
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { statisticsApi } from '@/api/statistics'

// 响应式数据
const loading = ref(false)
const tableLoading = ref(false)

// 图表引用
const ageChartRef = ref(null)
const genderChartRef = ref(null)
const trendChartRef = ref(null)

// 图表实例
let ageChart = null
let genderChart = null
let trendChart = null

// 筛选条件
const filters = reactive({
  district: '',
  year: 2024, // 使用2024年作为默认年份
  ageGroup: ''
})

// 图表类型
const ageChartType = ref('pie')
const trendPeriod = ref('5年')

// 概览数据
const overviewData = reactive({
  totalPopulation: 21192000,
  malePopulation: 10756000,
  femalePopulation: 10436000,
  maleRatio: 50.8,
  femaleRatio: 49.2,
  populationDensity: 1453,
  populationChange: 2.1
})

// 区域数据
const districtData = ref([
  {
    district: '锦江区',
    totalPopulation: 1240000,
    malePopulation: 630000,
    femalePopulation: 610000,
    density: 18500,
    ageGroup0_14: 12.5,
    ageGroup15_64: 72.8,
    ageGroup65Plus: 14.7,
    growthRate: 1.8
  },
  {
    district: '青羊区',
    totalPopulation: 980000,
    malePopulation: 495000,
    femalePopulation: 485000,
    density: 14200,
    ageGroup0_14: 13.2,
    ageGroup15_64: 71.5,
    ageGroup65Plus: 15.3,
    growthRate: 1.5
  },
  {
    district: '金牛区',
    totalPopulation: 1350000,
    malePopulation: 685000,
    femalePopulation: 665000,
    density: 12800,
    ageGroup0_14: 14.1,
    ageGroup15_64: 73.2,
    ageGroup65Plus: 12.7,
    growthRate: 2.3
  }
  // 更多区域数据...
])

// 格式化数字
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toLocaleString()
}

// 初始化年龄结构图表
const initAgeChart = () => {
  if (!ageChartRef.value) return

  ageChart = echarts.init(ageChartRef.value)
  updateAgeChart()
}

// 更新年龄结构图表
const updateAgeChart = () => {
  if (!ageChart) return

  const ageData = [
    { name: '0-14岁', value: 13.2, color: '#5470c6' },
    { name: '15-64岁', value: 72.5, color: '#91cc75' },
    { name: '65岁以上', value: 14.3, color: '#fac858' }
  ]

  let option

  if (ageChartType.value === 'pie') {
    option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}% ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [{
        name: '年龄结构',
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
        data: ageData.map(item => ({
          ...item,
          itemStyle: { color: item.color }
        }))
      }]
    }
  } else {
    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: ageData.map(item => item.name)
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [{
        name: '占比',
        type: 'bar',
        data: ageData.map(item => ({
          value: item.value,
          itemStyle: { color: item.color }
        })),
        barWidth: '60%'
      }]
    }
  }

  ageChart.setOption(option)
}

// 初始化性别比例图表
const initGenderChart = () => {
  if (!genderChartRef.value) return

  genderChart = echarts.init(genderChartRef.value)

  const option = {
    tooltip: {
      trigger: 'item'
    },
    series: [{
      name: '性别比例',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        position: 'outside',
        formatter: '{b}: {c}%'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '16',
          fontWeight: 'bold'
        }
      },
      data: [
        {
          value: overviewData.maleRatio,
          name: '男性',
          itemStyle: { color: '#5470c6' }
        },
        {
          value: overviewData.femaleRatio,
          name: '女性',
          itemStyle: { color: '#ee6666' }
        }
      ]
    }]
  }

  genderChart.setOption(option)
}

// 初始化趋势图表
const initTrendChart = () => {
  if (!trendChartRef.value) return

  trendChart = echarts.init(trendChartRef.value)
  updateTrendChart()
}

// 更新趋势图表
const updateTrendChart = () => {
  if (!trendChart) return

  // 模拟趋势数据
  const years = []
  const totalData = []
  const maleData = []
  const femaleData = []

  const currentYear = new Date().getFullYear()
  const yearCount = trendPeriod.value === '5年' ? 5 : trendPeriod.value === '10年' ? 10 : 20

  for (let i = yearCount - 1; i >= 0; i--) {
    years.push(currentYear - i)
    totalData.push(Math.floor(20000000 + Math.random() * 2000000))
    maleData.push(Math.floor(10000000 + Math.random() * 1000000))
    femaleData.push(Math.floor(10000000 + Math.random() * 1000000))
  }

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['总人口', '男性', '女性']
    },
    xAxis: {
      type: 'category',
      data: years
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function(value) {
          return (value / 10000).toFixed(0) + '万'
        }
      }
    },
    series: [
      {
        name: '总人口',
        type: 'line',
        data: totalData,
        smooth: true,
        itemStyle: { color: '#5470c6' }
      },
      {
        name: '男性',
        type: 'line',
        data: maleData,
        smooth: true,
        itemStyle: { color: '#91cc75' }
      },
      {
        name: '女性',
        type: 'line',
        data: femaleData,
        smooth: true,
        itemStyle: { color: '#ee6666' }
      }
    ]
  }

  trendChart.setOption(option)
}

// 筛选条件变化
const handleFilterChange = () => {
  // 根据筛选条件更新数据
  loadData()
}

// 搜索
const handleSearch = () => {
  loadData()
}

// 重置筛选条件
const resetFilters = () => {
  Object.assign(filters, {
    district: '',
    year: 2024, // 使用2024年作为默认年份
    ageGroup: ''
  })
  loadData()
}

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    tableLoading.value = true

    // 调用真实API获取数据
    const response = await statisticsApi.getPopulationStats(filters)
    if (response.code === 200) {
      // 更新数据
      Object.assign(overviewData, response.data.overview)
      districtData.value = response.data.districts || []

      // 更新图表
      await nextTick()
      updateAgeChart()
      updateTrendChart()
    }
  } catch (error) {
    ElMessage.error('加载数据失败，请检查后端服务是否正常运行')
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
    tableLoading.value = false
  }
}

// 导出数据
const exportData = () => {
  ElMessage.success('导出功能开发中')
}

// 刷新数据
const refreshData = () => {
  loadData()
}

// 查看区域详情
const showDistrictDetail = () => {
  ElMessage.info('区域详情功能开发中')
}

// 查看单个区域详情
const viewDistrictDetail = (row) => {
  ElMessage.info(`查看${row.district}详情功能开发中`)
}

// 监听图表类型变化
watch(ageChartType, () => {
  updateAgeChart()
})

// 生命周期
onMounted(async () => {
  await nextTick()
  initAgeChart()
  initGenderChart()
  initTrendChart()
  loadData()
})
</script>

<style scoped>
.population-stats {
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

/* 筛选区域 */
.filter-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 概览卡片 */
.overview-cards {
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

.total-population .stat-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.male-population .stat-icon { background: linear-gradient(135deg, #5470c6 0%, #91cc75 100%); }
.female-population .stat-icon { background: linear-gradient(135deg, #ee6666 0%, #fac858 100%); }
.density .stat-icon { background: linear-gradient(135deg, #73d13d 0%, #36cfc9 100%); }

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
}

.stat-change.positive { color: #52c41a; }
.stat-change.negative { color: #ff4d4f; }

.stat-ratio, .stat-unit {
  font-size: 12px;
  color: #8c8c8c;
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
  height: 300px;
  width: 100%;
}

.trend-chart {
  height: 400px;
}

/* 表格区域 */
.table-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

.positive { color: #52c41a; }
.negative { color: #ff4d4f; }

/* 响应式设计 */
@media (max-width: 768px) {
  .population-stats {
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

  .chart {
    height: 250px;
  }

  .trend-chart {
    height: 300px;
  }
}
</style>
