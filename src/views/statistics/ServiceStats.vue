<template>
  <div class="service-stats">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2>医疗服务统计</h2>
        <p>成都市医疗机构服务量、质量、效率等统计分析</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="exportData">
          <el-icon><Download /></el-icon>
          导出报告
        </el-button>
        <el-button type="success" @click="showQualityAnalysis">
          <el-icon><DataAnalysis /></el-icon>
          质量分析
        </el-button>
        <el-button @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
      </div>
    </div>
    <!-- 筛选条件 -->
    <div class="filter-section">
      <div class="modern-filter-card">
        <div class="filter-header">
          <h3>医疗服务数据查询</h3>
          <p class="filter-subtitle">选择医疗机构类型进行数据分析</p>
        </div>

        <div class="filter-content">
          <!-- 左侧：下拉选择 -->
          <div class="filter-left">
            <div class="filter-item">
              <GlowSelect
                v-model="selectedInstitutionType"
                :options="institutionTypeOptions"
                placeholder="请选择医疗机构类型"
                :glow-color="['#10b981', '#3b82f6', '#06b6d4']"
                :border-radius="10"
                :border-width="2"
                :duration="4"
                @change="handleInstitutionTypeChange"
              />
            </div>
          </div>

          <!-- 右侧：操作按钮 -->
          <div class="filter-right">
            <el-button type="primary" @click="loadData" class="action-btn query-btn">
              <el-icon><Search /></el-icon>
              查询数据
            </el-button>
            <el-button @click="resetFilters" class="action-btn reset-btn">
              <el-icon><RefreshLeft /></el-icon>
              重置筛选
            </el-button>
            <el-button @click="exportData" class="action-btn export-btn">
              <el-icon><Download /></el-icon>
              导出数据
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 概览卡片 -->
    <div class="overview-cards" v-loading="loading">
      <OverviewCard
        :value="overviewData.totalOutpatient || null"
        title="门诊人次"
        unit="万"
        :ratio="overviewData.outpatientRatio || null"
        :icon="User"
        theme="primary"
        :loading="loading"
        empty-text="暂无数据"
      />

      <OverviewCard
        :value="overviewData.totalEmergency || null"
        title="急诊人次"
        unit="万"
        :ratio="overviewData.emergencyRatio || null"
        :icon="FirstAidKit"
        theme="success"
        :loading="loading"
        empty-text="暂无数据"
      />

      <OverviewCard
        :value="overviewData.bedUtilizationRate || null"
        title="床位利用率"
        unit="%"
        :ratio="overviewData.bedUtilizationRate ? 100 : null"
        :icon="House"
        theme="warning"
        :loading="loading"
        empty-text="暂无数据"
      />

      <OverviewCard
        :value="overviewData.totalReferrals || null"
        title="转诊人次"
        unit="万"
        :ratio="overviewData.referralRatio || null"
        :icon="TrendCharts"
        theme="info"
        :loading="loading"
        empty-text="暂无数据"
      />
    </div>


    <!-- 图表区域 -->
    <div class="charts-section">
      <div class="chart-row">
        <!-- 服务量统计 -->
        <div class="chart-card">
          <div class="chart-header">
            <h4>服务量统计</h4>
            <div class="chart-controls">
              <el-radio-group v-model="serviceChartType" @change="updateServiceChart">
                <el-radio-button label="pie">饼图</el-radio-button>
                <el-radio-button label="bar">柱状图</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="chart-content">
            <PieChart
              v-if="serviceChartType === 'pie'"
              :data="serviceChartData"
              height="100%"
              :show-legend="true"
              :donut="true"
            />
            <BarChart
              v-else
              :data="serviceChartData"
              height="100%"
              :show-legend="false"
              :color-scheme="['#5470c6', '#91cc75', '#fac858', '#ee6666']"
            />
          </div>
        </div>

        <!-- 服务趋势分析 -->
        <div class="chart-card">
          <div class="chart-header">
            <h4>服务趋势分析</h4>
            <div class="chart-controls">
              <el-select v-model="trendPeriod" @change="updateTrendChart">
                <el-option label="近3年" value="3年" />
                <el-option label="近5年" value="5年" />
                <el-option label="近10年" value="10年" />
              </el-select>
            </div>
          </div>
          <div class="chart-content">
            <LineChart
              :data="trendChartData"
              :x-axis-data="trendXAxisData"
              :series-names="['门诊人次(万)', '急诊人次(万)', '床位利用率(%)']"
              height="100%"
              :smooth="true"
              :show-area="true"
              :colors="['#5470c6', '#91cc75', '#fac858']"
              :y-axis-formatter="(value) => value"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 服务质量分析 -->
    <div class="quality-analysis-section" v-loading="loading">
      <el-card>
        <template #header>
          <div class="section-header">
            <h4>服务质量分析</h4>
            <div class="analysis-controls">
              <el-select v-model="qualityAnalysisType" @change="loadQualityAnalysis" size="small">
                <el-option label="效率分析" value="efficiency" />
                <el-option label="满意度分析" value="satisfaction" />
                <el-option label="质量指标" value="quality" />
              </el-select>
            </div>
          </div>
        </template>

        <div class="quality-cards">
          <OverviewCard
            :value="qualityData.serviceMetrics.averageBedUtilization > 0 ? qualityData.serviceMetrics.averageBedUtilization : null"
            title="平均床位利用率"
            unit="%"
            :ratio="qualityData.serviceMetrics.averageBedUtilization > 0 ? 100 : null"
            :icon="House"
            theme="primary"
            :loading="loading"
            empty-text="暂无数据"
          />

          <OverviewCard
            :value="qualityData.serviceMetrics.averageStayLength > 0 ? qualityData.serviceMetrics.averageStayLength : null"
            title="平均住院天数"
            unit="天"
            :ratio="qualityData.serviceMetrics.averageStayLength > 0 ? Math.round((qualityData.serviceMetrics.averageStayLength / 10) * 100) : null"
            :icon="TrendCharts"
            theme="success"
            :loading="loading"
            empty-text="暂无数据"
          />

          <OverviewCard
            :value="qualityData.serviceMetrics.referralRate > 0 ? qualityData.serviceMetrics.referralRate : null"
            title="转诊率"
            unit="%"
            :ratio="qualityData.serviceMetrics.referralRate > 0 ? 100 : null"
            :icon="FirstAidKit"
            theme="warning"
            :loading="loading"
            empty-text="暂无数据"
          />

          <OverviewCard
            :value="qualityData.serviceMetrics.transferRate > 0 ? qualityData.serviceMetrics.transferRate : null"
            title="转院率"
            unit="%"
            :ratio="qualityData.serviceMetrics.transferRate > 0 ? 100 : null"
            :icon="User"
            theme="info"
            :loading="loading"
            empty-text="暂无数据"
          />
        </div>

        <!-- 质量指标展示 -->
        <div class="quality-indicators" style="margin-top: 20px;">
          <div class="indicator-row">
            <div class="indicator-item">
              <span class="indicator-label">服务效率:</span>
              <span class="indicator-value" :class="getEfficiencyClass(qualityData.qualityIndicators.serviceEfficiency)">
                {{ qualityData.qualityIndicators.serviceEfficiency }}
              </span>
            </div>
            <div class="indicator-item">
              <span class="indicator-label">资源利用率:</span>
              <span class="indicator-value" :class="getUtilizationClass(qualityData.qualityIndicators.resourceUtilization)">
                {{ qualityData.qualityIndicators.resourceUtilization }}
              </span>
            </div>
            <div class="indicator-item">
              <span class="indicator-label">患者流量:</span>
              <span class="indicator-value" :class="getFlowClass(qualityData.qualityIndicators.patientFlow)">
                {{ qualityData.qualityIndicators.patientFlow }}
              </span>
            </div>
          </div>
        </div>

        <!-- 改进建议 -->
        <div class="recommendations" v-if="qualityData.recommendations.length > 0" style="margin-top: 20px;">
          <h5>改进建议</h5>
          <ul class="recommendation-list">
            <li v-for="(recommendation, index) in qualityData.recommendations" :key="index">
              {{ recommendation }}
            </li>
          </ul>
        </div>
      </el-card>
    </div>

    <!-- 数据表格 -->
    <div class="table-section">
      <el-card>
        <template #header>
          <div class="table-header">
            <h4>详细数据</h4>
            <div class="table-actions">
              <el-button size="small" @click="exportTableData">
                <el-icon><Download /></el-icon>
                导出数据
              </el-button>
            </div>
          </div>
        </template>
        
        <el-table
          :data="serviceList"
          :loading="tableLoading"
          stripe
          style="width: 100%"
        >
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="typeName" label="医院类型" width="120" />
          <el-table-column prop="outpatientVisits" label="门诊人次" width="140" align="right">
            <template #default="{ row }">
              {{ row.outpatientVisits?.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="emergencyVisits" label="急诊人次" width="140" align="right">
            <template #default="{ row }">
              {{ row.emergencyVisits?.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="referrals" label="转诊人次" width="120" align="right">
            <template #default="{ row }">
              {{ row.referrals?.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="transferOut" label="转院人次" width="120" align="right">
            <template #default="{ row }">
              {{ row.transferOut?.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="bedUtilizationRate" label="床位利用率" width="120" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getBedUtilizationTagType(row.bedUtilizationRate)"
                size="small"
              >
                {{ row.bedUtilizationRate }}%
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="avgLengthOfStay" label="平均住院日" width="120" align="center">
            <template #default="{ row }">
              {{ row.avgLengthOfStay }} 天
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button link size="small" @click="showServiceDetail(row)">
                <el-icon><View /></el-icon>
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.size"
            :page-sizes="[10, 20, 50, 100]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  Download,
  DataAnalysis,
  Refresh,
  Search,
  RefreshLeft,
  User,
  House,
  FirstAidKit,
  TrendCharts,
  ArrowUp,
  ArrowDown,
  View
} from '@element-plus/icons-vue'
import { PieChart, BarChart, LineChart } from '@/components/charts'
import OverviewCard from '@/components/OverviewCard.vue'
import SearchBox from '@/components/SearchBox.vue'
import GlowSelect from '@/components/GlowSelect.vue'
import {
  getHospitalServiceStats,
  getServiceQualityAnalysis,
  getBedUtilizationStats
} from '@/api/service'

// 路由
const router = useRouter()

// 响应式数据
const loading = ref(false)
const tableLoading = ref(false)

// 当前年份
const currentYear = ref(new Date().getFullYear())

// 医疗机构类型选择
const selectedInstitutionType = ref(null)

// 医疗机构类型选项
const institutionTypeOptions = [
  { label: '综合医院', value: 'general' },
  { label: '中医医院', value: 'tcm' },
  { label: '中西医结合医院', value: 'integrated' },
  { label: '民族医院', value: 'ethnic' },
  { label: '专科医院', value: 'specialist' },
  { label: '口腔医院', value: 'dental' },
  { label: '眼科医院', value: 'ophthalmology' },
  { label: '耳鼻喉医院', value: 'ent' },
  { label: '肿瘤医院', value: 'oncology' },
  { label: '心血管病医院', value: 'cardiovascular' },
  { label: '妇产(科)医院', value: 'obstetrics' },
  { label: '儿童医院', value: 'pediatric' },
  { label: '精神病医院', value: 'psychiatric' },
  { label: '传染病医院', value: 'infectious' },
  { label: '皮肤病医院', value: 'dermatology' },
  { label: '职业病医院', value: 'occupational' },
  { label: '骨科医院', value: 'orthopedic' },
  { label: '康复医院', value: 'rehabilitation' },
  { label: '美容医院', value: 'cosmetic' },
  { label: '其他专科医院', value: 'other_specialist' },
  { label: '护理院', value: 'nursing' }
]

// 筛选条件
const filters = reactive({
  year: new Date().getFullYear(),
  serviceType: '',
  hospitalType: '',
  institutionType: ''
})

// 图表类型控制
const serviceChartType = ref('pie')
const trendPeriod = ref('5年')
const qualityAnalysisType = ref('efficiency')

// 概览数据
const overviewData = reactive({
  totalOutpatient: 0,
  totalEmergency: 0,
  totalReferrals: 0,
  bedUtilizationRate: 0,
  avgLengthOfStay: 0,
  outpatientRatio: 0,
  emergencyRatio: 0,
  referralRatio: 0
})

// 质量分析数据
const qualityData = reactive({
  serviceMetrics: {
    totalOutpatientVisits: 0,
    totalEmergencyVisits: 0,
    averageBedUtilization: 0,
    averageStayLength: 0,
    referralRate: 0,
    transferRate: 0
  },
  qualityIndicators: {
    serviceEfficiency: '中',
    resourceUtilization: '良好',
    patientFlow: '良好'
  },
  comparison: [],
  recommendations: []
})

// 图表数据
const serviceChartData = ref([])

const trendChartData = ref([])
const trendXAxisData = ref([])
const qualityChartData = ref([])

// 表格数据
const serviceList = ref([])

// 分页
const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
})

// 加载概览数据
const loadOverviewData = async () => {
  try {
    loading.value = true

    // 按照API文档构建正确的查询参数
    const queryParams = {
      filters: {
        // 如果有机构类型筛选，添加到filters中
        ...(filters.institutionType && { typeName: { like: filters.institutionType } })
      },
      sort: [
        { field: "bedUtilizationRate", order: "desc" }
      ],
      pageInfo: {
        index: 0,
        size: 20
      }
    }

    console.log('发送API请求到 /api/statistics/service/hospital-service/query:', queryParams)

    // 使用直接fetch调用API（避免认证问题）
    const directResponse = await fetch('/api/statistics/service/hospital-service/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(queryParams)
    })

    const response = await directResponse.json()
    console.log('API响应:', response)

    if (directResponse.ok && response.status === 0 && response.data) {
      const { rows, aggregations } = response.data

      if (rows && rows.length > 0) {
        // 计算概览数据 (数据需要转换为万为单位)
        const totalOutpatient = rows.reduce((sum, item) => sum + (item.outpatientVisits || 0), 0) / 10000
        const totalEmergency = rows.reduce((sum, item) => sum + (item.emergencyVisits || 0), 0) / 10000
        const totalReferrals = rows.reduce((sum, item) => sum + (item.referrals || 0), 0) / 10000
        const avgBedUtilization = aggregations?.bedUtilizationRateStats?.avg ||
                                  rows.reduce((sum, item) => sum + (item.bedUtilizationRate || 0), 0) / rows.length
        const avgStayLength = rows.reduce((sum, item) => sum + (item.avgLengthOfStay || 0), 0) / rows.length

        // 更新概览数据
        overviewData.totalOutpatient = Math.round(totalOutpatient * 100) / 100
        overviewData.totalEmergency = Math.round(totalEmergency * 100) / 100
        overviewData.totalReferrals = Math.round(totalReferrals * 100) / 100
        overviewData.bedUtilizationRate = Math.round(avgBedUtilization * 100) / 100
        overviewData.avgLengthOfStay = Math.round(avgStayLength * 100) / 100

        // 计算占比
        const totalVisits = totalOutpatient + totalEmergency
        overviewData.outpatientRatio = totalVisits > 0 ? Math.round((totalOutpatient / totalVisits) * 100 * 100) / 100 : 0
        overviewData.emergencyRatio = totalVisits > 0 ? Math.round((totalEmergency / totalVisits) * 100 * 100) / 100 : 0
        overviewData.referralRatio = totalVisits > 0 ? Math.round((totalReferrals / totalVisits) * 100 * 100) / 100 : 0

        // 不在这里更新图表数据，图表数据应该独立加载所有医院类型

        console.log('概览数据更新成功:', overviewData)
        console.log('门诊人次值:', overviewData.totalOutpatient, '类型:', typeof overviewData.totalOutpatient)
        console.log('急诊人次值:', overviewData.totalEmergency, '类型:', typeof overviewData.totalEmergency)
      } else {
        // 没有数据时重置概览数据
        Object.keys(overviewData).forEach(key => {
          overviewData[key] = 0
        })
      }
    }
  } catch (error) {
    console.error('加载概览数据失败:', error)
    console.error('错误详情:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      requestData: error.config?.data
    })

    // 如果是500错误，说明后端API有问题
    if (error.response?.status === 500) {
      console.log('API返回500错误，后端服务异常')
      ElMessage.error('后端API服务异常，请检查服务器状态')
    }

    ElMessage.error(`加载概览数据失败: ${error.message}`)
  } finally {
    loading.value = false
  }
}

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    tableLoading.value = true

    // 构建查询参数
    const queryParams = {
      filters: {},
      sort: [
        { field: 'bedUtilizationRate', order: 'desc' }
      ],
      pageInfo: {
        index: pagination.page - 1,
        size: pagination.size
      }
    }

    // 添加年份过滤条件
    if (filters.year) {
      queryParams.filters.year = { eq: parseInt(filters.year) }
    }

    // 添加医疗机构类型过滤条件
    if (filters.institutionType) {
      queryParams.filters.typeName = { eq: filters.institutionType }
    }

    const response = await getHospitalServiceStats(queryParams)

    if ((response.status === 0 || response.code === 200) && response.data) {
      serviceList.value = response.data.rows || []
      pagination.total = response.data.pageInfo?.total || 0
    }

    // 加载质量分析数据
    await loadQualityAnalysis()

    // 独立加载所有医院类型数据用于饼状图（不受筛选影响）
    loadAllHospitalTypesData()

  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
    tableLoading.value = false
  }
}

// 加载质量分析数据
const loadQualityAnalysis = async () => {
  try {
    const params = {
      hospitalType: filters.institutionType || '综合医院',
      analysisType: qualityAnalysisType.value
    }

    console.log('发送质量分析API请求到 /api/statistics/service/quality-analysis:', params)

    // 使用直接fetch调用API（避免认证问题）
    const directResponse = await fetch(`/api/statistics/service/quality-analysis?${new URLSearchParams(params)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await directResponse.json()
    console.log('质量分析API响应:', response)

    if (directResponse.ok && response.status === 0 && response.data) {
      updateQualityData(response.data)
      updateQualityChartData(response.data)
    }
  } catch (error) {
    console.error('加载质量分析数据失败:', error)
    console.error('质量分析错误详情:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    })

    // 如果是500错误，说明后端API有问题
    if (error.response?.status === 500) {
      console.log('质量分析API返回500错误，后端服务异常')
      ElMessage.error('质量分析API服务异常，请检查服务器状态')
    }

    ElMessage.error(`加载质量分析数据失败: ${error.message}`)
  }
}

// 更新质量数据
const updateQualityData = (data) => {
  // 更新服务指标
  if (data.serviceMetrics) {
    Object.assign(qualityData.serviceMetrics, data.serviceMetrics)
  }

  // 更新质量指标
  if (data.qualityIndicators) {
    Object.assign(qualityData.qualityIndicators, data.qualityIndicators)
  }

  // 更新对比分析
  if (data.comparison) {
    qualityData.comparison = data.comparison
  }

  // 更新建议
  if (data.recommendations) {
    qualityData.recommendations = data.recommendations
  }
}

// 加载所有医院类型的数据用于饼状图（不受筛选影响）
const loadAllHospitalTypesData = async () => {
  try {
    console.log('加载所有医院类型数据用于饼状图')

    // 构建查询所有医院类型的参数（不添加类型筛选）
    const queryParams = {
      filters: {}, // 不添加任何筛选条件
      sort: [
        { field: "bedUtilizationRate", order: "desc" }
      ],
      pageInfo: {
        index: 0,
        size: 100 // 增加数量以获取更多医院类型
      }
    }

    const directResponse = await fetch('/api/statistics/service/hospital-service/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(queryParams)
    })

    const response = await directResponse.json()
    console.log('所有医院类型数据响应:', response)

    if (directResponse.ok && response.status === 0 && response.data && response.data.rows) {
      updateServiceChartData(response.data.rows)
    }
  } catch (error) {
    console.error('加载所有医院类型数据失败:', error)
  }
}

// 更新服务图表数据
const updateServiceChartData = (rows) => {
  if (rows && rows.length > 0) {
    // 按医院类型统计服务数据
    const typeStats = {}

    rows.forEach(item => {
      const typeName = item.typeName || '其他'
      if (!typeStats[typeName]) {
        typeStats[typeName] = {
          outpatientVisits: 0,
          emergencyVisits: 0,
          count: 0
        }
      }
      typeStats[typeName].outpatientVisits += item.outpatientVisits || 0
      typeStats[typeName].emergencyVisits += item.emergencyVisits || 0
      typeStats[typeName].count += 1
    })

    // 转换为图表数据格式
    serviceChartData.value = Object.entries(typeStats).map(([name, data], index) => ({
      name,
      value: Math.round((data.outpatientVisits + data.emergencyVisits) / 10000),
      color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'][index % 5]
    }))

    console.log('饼状图数据更新成功:', serviceChartData.value)
  }
}

// 加载趋势数据
const loadTrendData = async () => {
  try {
    const currentYear = new Date().getFullYear()
    const years = []
    const outpatientData = []
    const emergencyData = []
    const bedUtilizationData = []

    // 根据选择的时间周期确定年份范围
    let yearCount = 5 // 默认5年
    switch (trendPeriod.value) {
      case '3年':
        yearCount = 3
        break
      case '5年':
        yearCount = 5
        break
      case '10年':
        yearCount = 10
        break
    }

    // 获取指定年份范围的数据
    for (let i = yearCount - 1; i >= 0; i--) {
      const year = currentYear - i
      years.push(year.toString())

      try {
        // 调用API获取该年度的数据
        const yearParams = {
          filters: {
            year: { eq: year }
          },
          sort: [{ field: 'bedUtilizationRate', order: 'desc' }],
          pageInfo: { index: 0, size: 100 }
        }

        const response = await getHospitalServiceStats(yearParams)

        if ((response.status === 0 || response.code === 200) && response.data?.rows) {
          const rows = response.data.rows
          const totalOutpatient = rows.reduce((sum, item) => sum + (item.outpatientVisits || 0), 0)
          const totalEmergency = rows.reduce((sum, item) => sum + (item.emergencyVisits || 0), 0)
          const avgBedUtilization = rows.reduce((sum, item) => sum + (item.bedUtilizationRate || 0), 0) / rows.length

          outpatientData.push(Math.round(totalOutpatient / 10000 * 100) / 100)
          emergencyData.push(Math.round(totalEmergency / 10000 * 100) / 100)
          bedUtilizationData.push(Math.round(avgBedUtilization * 100) / 100)
        } else {
          // 如果没有数据，添加0值
          outpatientData.push(0)
          emergencyData.push(0)
          bedUtilizationData.push(0)
        }
      } catch (error) {
        console.error(`获取${year}年数据失败:`, error)
        // 如果API调用失败，添加0值
        outpatientData.push(0)
        emergencyData.push(0)
        bedUtilizationData.push(0)
      }
    }

    trendXAxisData.value = years
    trendChartData.value = [outpatientData, emergencyData, bedUtilizationData]
  } catch (error) {
    console.error('加载趋势数据失败:', error)
  }
}

// 更新质量图表数据
const updateQualityChartData = (data) => {
  switch (qualityAnalysisType.value) {
    case 'efficiency':
      qualityChartData.value = [
        {
          name: '平均等待时间(分钟)',
          data: data.efficiencyData?.map(item => ({
            name: item.hospitalName,
            value: item.waitingTime || 0
          })) || []
        }
      ]
      break
    case 'satisfaction':
      qualityChartData.value = [
        {
          name: '满意度(%)',
          data: data.satisfactionData?.map(item => ({
            name: item.hospitalName,
            value: item.satisfactionRate || 0
          })) || []
        }
      ]
      break
    case 'comparison':
      qualityChartData.value = [
        {
          name: '三级医院',
          data: data.comparisonData?.level3?.map(item => ({
            name: item.serviceName,
            value: item.serviceVolume || 0
          })) || []
        },
        {
          name: '二级医院',
          data: data.comparisonData?.level2?.map(item => ({
            name: item.serviceName,
            value: item.serviceVolume || 0
          })) || []
        }
      ]
      break
  }
}

// 获取满意度标签类型
const getSatisfactionTagType = (rate) => {
  if (rate >= 95) return 'success'
  if (rate >= 90) return ''
  if (rate >= 85) return 'warning'
  return 'danger'
}

// 更新服务图表
const updateServiceChart = () => {
  // 图表组件会自动重新渲染
}

// 更新趋势图表
const updateTrendChart = () => {
  loadTrendData()
}

// 更新质量图表
const updateQualityChart = () => {
  loadQualityAnalysis()
}

// 获取效率等级样式类
const getEfficiencyClass = (efficiency) => {
  switch (efficiency) {
    case '高': return 'efficiency-high'
    case '中': return 'efficiency-medium'
    case '低': return 'efficiency-low'
    default: return 'efficiency-medium'
  }
}

// 获取利用率等级样式类
const getUtilizationClass = (utilization) => {
  switch (utilization) {
    case '优秀': return 'utilization-excellent'
    case '良好': return 'utilization-good'
    case '一般': return 'utilization-average'
    default: return 'utilization-good'
  }
}

// 获取流量等级样式类
const getFlowClass = (flow) => {
  switch (flow) {
    case '良好': return 'flow-good'
    case '一般': return 'flow-average'
    default: return 'flow-good'
  }
}



// 重置筛选条件
const resetFilters = () => {
  selectedInstitutionType.value = null
  currentYear.value = new Date().getFullYear()
  Object.assign(filters, {
    year: new Date().getFullYear(),
    serviceType: '',
    hospitalType: '',
    institutionType: ''
  })
  loadOverviewData()
  loadData()
  ElMessage.success('筛选条件已重置')
}

// 分页处理
const handleSizeChange = (size) => {
  pagination.size = size
  pagination.page = 1
  loadData()
}

const handleCurrentChange = (page) => {
  pagination.page = page
  loadData()
}

// 导出数据 - 创建导出任务并跳转到导入导出页面
const exportData = async () => {
  const { createExportTaskAndNavigate } = await import('@/utils/exportHelper')
  await createExportTaskAndNavigate({
    dataType: 'service',
    exportFormat: 'excel',
    filters: {
      startYear: currentYear.value - 2,
      endYear: currentYear.value
    },
    fields: ['year', 'hospitalName', 'serviceType', 'serviceVolume', 'serviceQuality', 'patientSatisfaction'],
    taskName: `医疗服务统计数据_${currentYear.value}`
  }, router)
}

// 导出表格数据 - 创建导出任务并跳转到导入导出页面
const exportTableData = async () => {
  const { createExportTaskAndNavigate } = await import('@/utils/exportHelper')
  await createExportTaskAndNavigate({
    dataType: 'service',
    exportFormat: 'excel',
    filters: {
      year: filters.year,
      serviceType: filters.serviceType,
      hospitalType: filters.hospitalType
    },
    fields: ['hospitalName', 'serviceType', 'serviceVolume', 'serviceQuality', 'patientSatisfaction', 'efficiency'],
    taskName: `医疗服务详细数据_${filters.year}`
  }, router)
}

// 显示质量分析
const showQualityAnalysis = () => {
  ElMessage.info('质量分析详情功能开发中')
}

// 获取床位利用率标签类型
const getBedUtilizationTagType = (rate) => {
  if (rate >= 90) return 'success'
  if (rate >= 80) return 'warning'
  if (rate >= 60) return 'info'
  return 'danger'
}

// 显示服务详情
const showServiceDetail = (row) => {
  ElMessage.info(`查看${row.typeName}服务详情功能开发中`)
}

// 处理医疗机构类型变化
const handleInstitutionTypeChange = (value, option) => {
  console.log('医疗机构类型变化:', value, option)
  // 使用中文标签而不是英文值
  filters.institutionType = option ? option.label : null
  console.log('设置的机构类型:', filters.institutionType)
  // 自动加载数据
  loadData()
  loadOverviewData()
}
// 刷新数据
const refreshData = () => {
  loadData()
}

// 生命周期
onMounted(async () => {
  await nextTick()
  loadOverviewData()
  loadData()
  // 独立加载所有医院类型数据用于饼状图
  loadAllHospitalTypesData()
})
</script>

<style scoped>
.service-stats {
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
  color: #1f2937;
  font-size: 24px;
  font-weight: 600;
}

.header-content p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 概览卡片 */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.overview-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-content {
  flex: 1;
}

.card-value {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.card-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.card-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #ef4444;
}

.card-change.positive {
  color: #10b981;
}

.card-ratio {
  font-size: 12px;
  color: #6b7280;
}

/* 筛选区域 */
.filter-section {
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-item label {
  font-size: 14px;
  color: #374151;
  white-space: nowrap;
}

.filter-actions {
  margin-left: auto;
  display: flex;
  gap: 12px;
}

/* 图表区域 */
.charts-section {
  margin-bottom: 20px;
}

.chart-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.chart-card.full-width {
  grid-column: 1 / -1;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h4 {
  margin: 0;
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
}

.chart-controls {
  display: flex;
  gap: 12px;
}

.chart-content {
  height: 300px;
}

/* 表格区域 */
.table-section {
  margin-bottom: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header h4 {
  margin: 0;
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
}

.table-actions {
  display: flex;
  gap: 12px;
}

/* 筛选区域样式 */
.modern-filter-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
  padding: 24px;
}

.filter-header h3 {
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.filter-subtitle {
  color: #64748b;
  font-size: 14px;
  margin: 0 0 24px 0;
  font-weight: 400;
}

/* 新的筛选内容布局 */
.filter-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
}

/* 左侧下拉选择区域 */
.filter-left {
  flex: 0 0 auto;
  min-width: 280px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

/* 右侧操作按钮区域 */
.filter-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.action-btn {
  height: 40px;
  padding: 0 16px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

/* 查询按钮样式 */
.query-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  color: white;
}

.query-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* 重置按钮样式 */
.reset-btn {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  border: none;
  color: white;
}

.reset-btn:hover {
  background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
}

/* 导出按钮样式 */
.export-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  color: white;
}

.export-btn:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-content {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .filter-left {
    min-width: auto;
    width: 100%;
  }

  .filter-right {
    justify-content: center;
    flex-wrap: wrap;
  }

  .action-btn {
    flex: 1;
    min-width: 100px;
  }
}

.bottom-layout {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.search-area-left {
  flex: 1;
  max-width: 400px;
}

.action-buttons-right {
  display: flex;
  gap: 12px;
}

.query-btn {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.query-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.reset-btn {
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.export-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
  color: white;
  transition: all 0.3s ease;
}

.export-btn:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* 质量分析区域样式 */
.quality-analysis-section {
  margin-bottom: 24px;
}

.quality-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h4 {
  margin: 0;
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
}

.analysis-controls {
  display: flex;
  gap: 12px;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 质量指标样式 */
.quality-indicators {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.indicator-row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.indicator-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 200px;
}

.indicator-label {
  font-weight: 500;
  color: #64748b;
  font-size: 14px;
}

.indicator-value {
  font-weight: 600;
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 20px;
  background: #f1f5f9;
}

/* 效率等级样式 */
.efficiency-high {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.efficiency-medium {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.efficiency-low {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

/* 利用率等级样式 */
.utilization-excellent {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.utilization-good {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.utilization-average {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  color: white;
}

/* 流量等级样式 */
.flow-good {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
}

.flow-average {
  background: linear-gradient(135deg, #84cc16, #65a30d);
  color: white;
}

/* 建议列表样式 */
.recommendations {
  background: #fefce8;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #fde047;
}

.recommendations h5 {
  margin: 0 0 12px 0;
  color: #92400e;
  font-size: 16px;
  font-weight: 600;
}

.recommendation-list {
  margin: 0;
  padding-left: 20px;
  color: #92400e;
}

.recommendation-list li {
  margin-bottom: 8px;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .service-stats {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .overview-cards {
    grid-template-columns: 1fr;
  }

  .filter-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .filter-actions {
    flex-direction: column;
    gap: 8px;
  }

  .filter-actions .el-button {
    width: 100%;
  }
  
  .chart-row {
    grid-template-columns: 1fr;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-actions {
    margin-left: 0;
    justify-content: center;
  }
}
</style>
