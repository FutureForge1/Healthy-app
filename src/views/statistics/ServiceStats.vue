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

    <!-- 概览卡片 -->
    <div class="overview-cards">
      <div class="overview-card">
        <div class="card-icon">
          <el-icon size="32" color="#409EFF"><User /></el-icon>
        </div>
        <div class="card-content">
          <div class="card-value">{{ overviewData.totalOutpatient.toLocaleString() }}</div>
          <div class="card-label">门诊人次</div>
          <div class="card-change" :class="{ positive: overviewData.outpatientGrowth > 0 }">
            <el-icon><ArrowUp v-if="overviewData.outpatientGrowth > 0" /><ArrowDown v-else /></el-icon>
            {{ Math.abs(overviewData.outpatientGrowth) }}%
          </div>
        </div>
      </div>

      <div class="overview-card">
        <div class="card-icon">
          <el-icon size="32" color="#67C23A"><House /></el-icon>
        </div>
        <div class="card-content">
          <div class="card-value">{{ overviewData.totalInpatient.toLocaleString() }}</div>
          <div class="card-label">住院人次</div>
          <div class="card-change" :class="{ positive: overviewData.inpatientGrowth > 0 }">
            <el-icon><ArrowUp v-if="overviewData.inpatientGrowth > 0" /><ArrowDown v-else /></el-icon>
            {{ Math.abs(overviewData.inpatientGrowth) }}%
          </div>
        </div>
      </div>

      <div class="overview-card">
        <div class="card-icon">
          <el-icon size="32" color="#E6A23C"><FirstAidKit /></el-icon>
        </div>
        <div class="card-content">
          <div class="card-value">{{ overviewData.totalEmergency.toLocaleString() }}</div>
          <div class="card-label">急诊人次</div>
          <div class="card-ratio">占比 {{ overviewData.emergencyRatio }}%</div>
        </div>
      </div>

      <div class="overview-card">
        <div class="card-icon">
          <el-icon size="32" color="#F56C6C"><TrendCharts /></el-icon>
        </div>
        <div class="card-content">
          <div class="card-value">{{ overviewData.satisfactionRate }}%</div>
          <div class="card-label">满意度</div>
          <div class="card-change" :class="{ positive: overviewData.satisfactionChange > 0 }">
            <el-icon><ArrowUp v-if="overviewData.satisfactionChange > 0" /><ArrowDown v-else /></el-icon>
            {{ Math.abs(overviewData.satisfactionChange) }}%
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选条件 -->
    <div class="filter-section">
      <el-card>
        <div class="filter-row">
          <div class="filter-item">
            <label>年份：</label>
            <el-select v-model="filters.year" placeholder="选择年份" @change="loadData">
              <el-option label="2024年" value="2024" />
              <el-option label="2023年" value="2023" />
              <el-option label="2022年" value="2022" />
              <el-option label="2021年" value="2021" />
              <el-option label="2020年" value="2020" />
            </el-select>
          </div>
          <div class="filter-item">
            <label>服务类型：</label>
            <el-select v-model="filters.serviceType" placeholder="选择服务类型" @change="loadData">
              <el-option label="全部" value="" />
              <el-option label="门诊服务" value="outpatient" />
              <el-option label="住院服务" value="inpatient" />
              <el-option label="急诊服务" value="emergency" />
              <el-option label="手术服务" value="surgery" />
            </el-select>
          </div>
          <div class="filter-item">
            <label>医院类型：</label>
            <el-select v-model="filters.hospitalType" placeholder="选择医院类型" @change="loadData">
              <el-option label="全部" value="" />
              <el-option label="综合医院" value="general" />
              <el-option label="专科医院" value="specialist" />
              <el-option label="中医医院" value="tcm" />
              <el-option label="社区卫生" value="community" />
            </el-select>
          </div>
          <div class="filter-actions">
            <el-button type="primary" @click="loadData">
              <el-icon><Search /></el-icon>
              查询
            </el-button>
            <el-button @click="resetFilters">重置</el-button>
          </div>
        </div>
      </el-card>
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
              :height="300"
              :show-legend="true"
              :donut="true"
            />
            <BarChart 
              v-else
              :data="serviceChartData"
              :height="300"
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
              :height="300"
              :smooth="true"
              :area="true"
              :color-scheme="['#5470c6', '#91cc75', '#fac858']"
            />
          </div>
        </div>
      </div>

      <!-- 服务质量分析 -->
      <div class="chart-row">
        <div class="chart-card full-width">
          <div class="chart-header">
            <h4>服务质量分析</h4>
            <div class="chart-controls">
              <el-button-group>
                <el-button 
                  :type="qualityAnalysisType === 'efficiency' ? 'primary' : ''"
                  @click="qualityAnalysisType = 'efficiency'; updateQualityChart()"
                >
                  效率分析
                </el-button>
                <el-button 
                  :type="qualityAnalysisType === 'satisfaction' ? 'primary' : ''"
                  @click="qualityAnalysisType = 'satisfaction'; updateQualityChart()"
                >
                  满意度分析
                </el-button>
                <el-button 
                  :type="qualityAnalysisType === 'comparison' ? 'primary' : ''"
                  @click="qualityAnalysisType = 'comparison'; updateQualityChart()"
                >
                  医院对比
                </el-button>
              </el-button-group>
            </div>
          </div>
          <div class="chart-content">
            <BarChart 
              :data="qualityChartData"
              :height="400"
              :show-legend="true"
              :horizontal="qualityAnalysisType === 'comparison'"
              :color-scheme="['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de']"
            />
          </div>
        </div>
      </div>
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
          <el-table-column prop="year" label="年份" width="80" />
          <el-table-column prop="hospitalName" label="医疗机构" min-width="200" />
          <el-table-column prop="hospitalType" label="医院类型" width="100" />
          <el-table-column prop="outpatientVisits" label="门诊人次" width="120" align="right">
            <template #default="{ row }">
              {{ row.outpatientVisits?.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="inpatientVisits" label="住院人次" width="120" align="right">
            <template #default="{ row }">
              {{ row.inpatientVisits?.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="emergencyVisits" label="急诊人次" width="120" align="right">
            <template #default="{ row }">
              {{ row.emergencyVisits?.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="surgeryCount" label="手术台次" width="100" align="right">
            <template #default="{ row }">
              {{ row.surgeryCount?.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="satisfactionRate" label="满意度" width="100" align="center">
            <template #default="{ row }">
              <el-tag 
                :type="getSatisfactionTagType(row.satisfactionRate)"
                size="small"
              >
                {{ row.satisfactionRate }}%
              </el-tag>
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
import {
  Download,
  DataAnalysis,
  Refresh,
  Search,
  User,
  House,
  FirstAidKit,
  TrendCharts,
  ArrowUp,
  ArrowDown,
  View
} from '@element-plus/icons-vue'
import { PieChart, BarChart, LineChart } from '@/components/charts'
import { statisticsApi } from '@/api/statistics'

// 响应式数据
const loading = ref(false)
const tableLoading = ref(false)

// 筛选条件
const filters = reactive({
  year: '2024',
  serviceType: '',
  hospitalType: ''
})

// 图表类型控制
const serviceChartType = ref('pie')
const trendPeriod = ref('5年')
const qualityAnalysisType = ref('efficiency')

// 概览数据
const overviewData = reactive({
  totalOutpatient: 12560000,
  totalInpatient: 890000,
  totalEmergency: 1250000,
  emergencyRatio: 8.9,
  satisfactionRate: 92.5,
  outpatientGrowth: 5.2,
  inpatientGrowth: 3.8,
  satisfactionChange: 1.5
})

// 图表数据
const serviceChartData = ref([
  { name: '门诊服务', value: 12560000, color: '#5470c6' },
  { name: '住院服务', value: 890000, color: '#91cc75' },
  { name: '急诊服务', value: 1250000, color: '#fac858' },
  { name: '手术服务', value: 156000, color: '#ee6666' }
])

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

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    tableLoading.value = true

    // 构建查询参数
    const queryParams = {
      filters: {
        year: { eq: parseInt(filters.year) }
      },
      sort: [
        { field: 'year', order: 'desc' },
        { field: 'outpatientVisits', order: 'desc' }
      ],
      pageInfo: {
        index: pagination.page - 1,
        size: pagination.size
      }
    }

    // 添加可选过滤条件
    if (filters.serviceType) {
      queryParams.filters.serviceType = { eq: filters.serviceType }
    }
    if (filters.hospitalType) {
      queryParams.filters.typeName = { like: filters.hospitalType }
    }

    // 调用新的医院服务统计API
    const response = await statisticsApi.getHospitalServiceStats(queryParams)
    
    if (response.code === 200) {
      serviceList.value = response.data.rows || []
      pagination.total = response.data.pageInfo?.total || 0
      
      // 更新概览数据
      if (response.data.aggregations) {
        updateOverviewData(response.data.aggregations)
      }
    }

    // 加载质量分析数据
    await loadQualityAnalysis()

  } catch (error) {
    ElMessage.error('加载数据失败，请检查后端服务是否正常运行')
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
    tableLoading.value = false
  }
}

// 加载质量分析数据
const loadQualityAnalysis = async () => {
  try {
    const params = {
      hospitalType: filters.hospitalType || '综合医院',
      analysisType: qualityAnalysisType.value
    }

    const response = await statisticsApi.getServiceQualityAnalysis(params)
    
    if (response.code === 200) {
      updateQualityChartData(response.data)
      updateTrendChartData(response.data)
    }
  } catch (error) {
    console.error('加载质量分析数据失败:', error)
  }
}

// 更新概览数据
const updateOverviewData = (aggregations) => {
  if (aggregations.total_stats) {
    const stats = aggregations.total_stats
    overviewData.totalOutpatient = stats.totalOutpatient || 0
    overviewData.totalInpatient = stats.totalInpatient || 0
    overviewData.totalEmergency = stats.totalEmergency || 0
    overviewData.satisfactionRate = stats.satisfactionRate || 0
    
    // 计算比例
    const totalVisits = overviewData.totalOutpatient + overviewData.totalInpatient + overviewData.totalEmergency
    if (totalVisits > 0) {
      overviewData.emergencyRatio = ((overviewData.totalEmergency / totalVisits) * 100).toFixed(1)
    }
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

// 更新趋势图表数据
const updateTrendChartData = (data) => {
  if (data.trendData) {
    trendXAxisData.value = data.trendData.map(item => item.year.toString())
    trendChartData.value = [
      {
        name: '门诊人次',
        data: data.trendData.map(item => item.outpatientVisits || 0)
      },
      {
        name: '住院人次',
        data: data.trendData.map(item => item.inpatientVisits || 0)
      },
      {
        name: '急诊人次',
        data: data.trendData.map(item => item.emergencyVisits || 0)
      }
    ]
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
  loadQualityAnalysis()
}

// 更新质量图表
const updateQualityChart = () => {
  loadQualityAnalysis()
}

// 重置筛选条件
const resetFilters = () => {
  Object.assign(filters, {
    year: '2024',
    serviceType: '',
    hospitalType: ''
  })
  loadData()
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

// 导出数据
const exportData = () => {
  ElMessage.success('导出功能开发中')
}

// 导出表格数据
const exportTableData = () => {
  ElMessage.success('导出表格数据功能开发中')
}

// 显示质量分析
const showQualityAnalysis = () => {
  ElMessage.info('质量分析详情功能开发中')
}

// 显示服务详情
const showServiceDetail = (row) => {
  ElMessage.info(`查看${row.hospitalName}服务详情功能开发中`)
}

// 刷新数据
const refreshData = () => {
  loadData()
}

// 生命周期
onMounted(async () => {
  await nextTick()
  loadData()
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

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
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
