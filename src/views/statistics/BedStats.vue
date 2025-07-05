<template>
  <div class="bed-stats">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2>床位统计</h2>
        <p>成都市医疗机构床位分布、使用率、类型等统计分析</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="exportData">
          <el-icon><Download /></el-icon>
          导出报告
        </el-button>
        <el-button type="success" @click="showUtilizationAnalysis">
          <el-icon><DataAnalysis /></el-icon>
          使用率分析
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
          <el-icon size="32" color="#409EFF"><House /></el-icon>
        </div>
        <div class="card-content">
          <div class="card-value">{{ overviewData.totalBeds.toLocaleString() }}</div>
          <div class="card-label">床位总数</div>
          <div class="card-change" :class="{ positive: overviewData.bedGrowth > 0 }">
            <el-icon><ArrowUp v-if="overviewData.bedGrowth > 0" /><ArrowDown v-else /></el-icon>
            {{ Math.abs(overviewData.bedGrowth) }}%
          </div>
        </div>
      </div>

      <div class="overview-card">
        <div class="card-icon">
          <el-icon size="32" color="#67C23A"><FirstAidKit /></el-icon>
        </div>
        <div class="card-content">
          <div class="card-value">{{ overviewData.actualBeds.toLocaleString() }}</div>
          <div class="card-label">实际开放床位</div>
          <div class="card-ratio">占比 {{ overviewData.actualRatio }}%</div>
        </div>
      </div>

      <div class="overview-card">
        <div class="card-icon">
          <el-icon size="32" color="#E6A23C"><TrendCharts /></el-icon>
        </div>
        <div class="card-content">
          <div class="card-value">{{ overviewData.utilizationRate }}%</div>
          <div class="card-label">平均使用率</div>
          <div class="card-change" :class="{ positive: overviewData.utilizationChange > 0 }">
            <el-icon><ArrowUp v-if="overviewData.utilizationChange > 0" /><ArrowDown v-else /></el-icon>
            {{ Math.abs(overviewData.utilizationChange) }}%
          </div>
        </div>
      </div>

      <div class="overview-card">
        <div class="card-icon">
          <el-icon size="32" color="#F56C6C"><Timer /></el-icon>
        </div>
        <div class="card-content">
          <div class="card-value">{{ overviewData.turnoverRate }}</div>
          <div class="card-label">床位周转率</div>
          <div class="card-ratio">次/年</div>
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
            <label>床位类型：</label>
            <el-select v-model="filters.bedType" placeholder="选择床位类型" @change="loadData">
              <el-option label="全部" value="" />
              <el-option label="普通床位" value="general" />
              <el-option label="ICU床位" value="icu" />
              <el-option label="急诊床位" value="emergency" />
              <el-option label="手术床位" value="surgery" />
            </el-select>
          </div>
          <div class="filter-item">
            <label>医院等级：</label>
            <el-select v-model="filters.hospitalLevel" placeholder="选择医院等级" @change="loadData">
              <el-option label="全部" value="" />
              <el-option label="三级甲等" value="3A" />
              <el-option label="三级乙等" value="3B" />
              <el-option label="二级甲等" value="2A" />
              <el-option label="二级乙等" value="2B" />
              <el-option label="一级" value="1" />
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
        <!-- 床位分类统计 -->
        <div class="chart-card">
          <div class="chart-header">
            <h4>床位分类统计</h4>
            <div class="chart-controls">
              <el-radio-group v-model="categoryChartType" @change="updateCategoryChart">
                <el-radio-button value="pie">饼图</el-radio-button>
                <el-radio-button value="bar">柱状图</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="chart-content">
            <PieChart 
              v-if="categoryChartType === 'pie'"
              :data="categoryChartData"
              :height="300"
              :show-legend="true"
              :donut="true"
            />
            <BarChart 
              v-else
              :data="categoryChartData"
              :height="300"
              :show-legend="false"
              :color-scheme="['#5470c6', '#91cc75', '#fac858', '#ee6666']"
            />
          </div>
        </div>

        <!-- 历年床位总数趋势 -->
        <div class="chart-card">
          <div class="chart-header">
            <h4>历年床位总数趋势</h4>
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

      <!-- 床位使用率分析 -->
      <div class="chart-row">
        <div class="chart-card full-width">
          <div class="chart-header">
            <h4>床位使用率分析</h4>
            <div class="chart-controls">
              <el-button-group>
                <el-button 
                  :type="utilizationAnalysisType === 'monthly' ? 'primary' : ''"
                  @click="utilizationAnalysisType = 'monthly'; updateUtilizationChart()"
                >
                  月度分析
                </el-button>
                <el-button 
                  :type="utilizationAnalysisType === 'quarterly' ? 'primary' : ''"
                  @click="utilizationAnalysisType = 'quarterly'; updateUtilizationChart()"
                >
                  季度分析
                </el-button>
                <el-button 
                  :type="utilizationAnalysisType === 'comparison' ? 'primary' : ''"
                  @click="utilizationAnalysisType = 'comparison'; updateUtilizationChart()"
                >
                  医院对比
                </el-button>
              </el-button-group>
            </div>
          </div>
          <div class="chart-content">
            <BarChart 
              :data="utilizationChartData"
              :height="400"
              :show-legend="true"
              :horizontal="utilizationAnalysisType === 'comparison'"
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
          :data="bedList" 
          :loading="tableLoading"
          stripe
          style="width: 100%"
        >
          <el-table-column prop="year" label="年份" width="80" />
          <el-table-column prop="hospitalName" label="医疗机构" min-width="200" />
          <el-table-column prop="hospitalLevel" label="医院等级" width="100" />
          <el-table-column prop="totalBeds" label="编制床位" width="100" align="right">
            <template #default="{ row }">
              {{ row.totalBeds?.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="actualBeds" label="实际开放" width="100" align="right">
            <template #default="{ row }">
              {{ row.actualBeds?.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="utilizationRate" label="使用率" width="100" align="center">
            <template #default="{ row }">
              <el-tag 
                :type="getUtilizationTagType(row.utilizationRate)"
                size="small"
              >
                {{ row.utilizationRate }}%
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="turnoverRate" label="周转率" width="100" align="center">
            <template #default="{ row }">
              {{ row.turnoverRate }}
            </template>
          </el-table-column>
          <el-table-column prop="averageStay" label="平均住院日" width="120" align="center">
            <template #default="{ row }">
              {{ row.averageStay }}天
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button link size="small" @click="showBedDetail(row)">
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
  House,
  FirstAidKit,
  TrendCharts,
  Timer,
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
  bedType: '',
  hospitalLevel: ''
})

// 图表类型控制
const categoryChartType = ref('pie')
const trendPeriod = ref('5年')
const utilizationAnalysisType = ref('monthly')

// 概览数据
const overviewData = reactive({
  totalBeds: 89650,
  actualBeds: 82340,
  actualRatio: 91.8,
  utilizationRate: 87.5,
  utilizationChange: 2.3,
  turnoverRate: 28.6,
  bedGrowth: 4.2
})

// 图表数据
const categoryChartData = ref([
  { name: '普通床位', value: 65420, color: '#5470c6' },
  { name: 'ICU床位', value: 8950, color: '#91cc75' },
  { name: '急诊床位', value: 5680, color: '#fac858' },
  { name: '手术床位', value: 9600, color: '#ee6666' }
])

const trendChartData = ref([])
const trendXAxisData = ref([])
const utilizationChartData = ref([])

// 表格数据
const bedList = ref([])

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
        { field: 'totalBeds', order: 'desc' }
      ],
      pageInfo: {
        index: pagination.page - 1,
        size: pagination.size
      }
    }

    // 添加可选过滤条件
    if (filters.bedType) {
      queryParams.filters.bedType = { eq: filters.bedType }
    }
    if (filters.hospitalLevel) {
      queryParams.filters.hospitalLevel = { eq: filters.hospitalLevel }
    }

    // 调用新的床位分类统计API
    const response = await statisticsApi.getBedCategoryStats(queryParams)
    
    if (response.code === 200) {
      bedList.value = response.data.rows || []
      pagination.total = response.data.pageInfo?.total || 0
      
      // 更新概览数据
      if (response.data.aggregations) {
        updateOverviewData(response.data.aggregations)
      }
    }

    // 加载趋势数据
    await loadTrendData()
    
    // 加载使用率分析数据
    await loadUtilizationAnalysis()

  } catch (error) {
    ElMessage.error('加载数据失败，请检查后端服务是否正常运行')
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
    tableLoading.value = false
  }
}

// 加载趋势数据
const loadTrendData = async () => {
  try {
    const years = getTrendYears()
    const queryParams = {
      filters: {
        year: { in: years }
      },
      sort: [{ field: 'year', order: 'asc' }],
      pageInfo: { index: 0, size: 100 }
    }

    const response = await statisticsApi.getBedTotalCount(queryParams)
    
    if (response.code === 200 && response.data.aggregations?.year_histogram) {
      const histogramData = response.data.aggregations.year_histogram
      trendXAxisData.value = histogramData.map(item => item.key.toString())
      trendChartData.value = [
        {
          name: '编制床位',
          data: histogramData.map(item => item.totalBeds || 0)
        },
        {
          name: '实际开放',
          data: histogramData.map(item => item.actualBeds || 0)
        },
        {
          name: '使用床位',
          data: histogramData.map(item => item.usedBeds || 0)
        }
      ]
    }
  } catch (error) {
    console.error('加载趋势数据失败:', error)
  }
}

// 加载使用率分析数据
const loadUtilizationAnalysis = async () => {
  try {
    const params = {
      year: parseInt(filters.year),
      hospitalType: filters.hospitalLevel || '全部'
    }

    const response = await statisticsApi.getBedUtilizationAnalysis(params)
    
    if (response.code === 200) {
      updateUtilizationChartData(response.data)
    }
  } catch (error) {
    console.error('加载使用率分析数据失败:', error)
  }
}

// 更新概览数据
const updateOverviewData = (aggregations) => {
  if (aggregations.total_stats) {
    const stats = aggregations.total_stats
    overviewData.totalBeds = stats.totalBeds || 0
    overviewData.actualBeds = stats.actualBeds || 0
    overviewData.utilizationRate = stats.utilizationRate || 0
    overviewData.turnoverRate = stats.turnoverRate || 0
    
    // 计算比例
    if (overviewData.totalBeds > 0) {
      overviewData.actualRatio = ((overviewData.actualBeds / overviewData.totalBeds) * 100).toFixed(1)
    }
  }
}

// 获取趋势年份
const getTrendYears = () => {
  const currentYear = parseInt(filters.year)
  const yearCount = parseInt(trendPeriod.value)
  const years = []
  for (let i = yearCount - 1; i >= 0; i--) {
    years.push(currentYear - i)
  }
  return years
}

// 更新使用率图表数据
const updateUtilizationChartData = (data) => {
  switch (utilizationAnalysisType.value) {
    case 'monthly':
      utilizationChartData.value = [
        {
          name: '使用率(%)',
          data: data.monthlyData?.map(item => ({
            name: `${item.month}月`,
            value: item.utilizationRate || 0
          })) || []
        }
      ]
      break
    case 'quarterly':
      utilizationChartData.value = [
        {
          name: '使用率(%)',
          data: data.quarterlyData?.map(item => ({
            name: `Q${item.quarter}`,
            value: item.utilizationRate || 0
          })) || []
        }
      ]
      break
    case 'comparison':
      utilizationChartData.value = [
        {
          name: '三级医院',
          data: data.hospitalComparison?.level3?.map(item => ({
            name: item.hospitalName,
            value: item.utilizationRate || 0
          })) || []
        },
        {
          name: '二级医院',
          data: data.hospitalComparison?.level2?.map(item => ({
            name: item.hospitalName,
            value: item.utilizationRate || 0
          })) || []
        }
      ]
      break
  }
}

// 获取使用率标签类型
const getUtilizationTagType = (rate) => {
  if (rate >= 90) return 'danger'
  if (rate >= 80) return 'warning'
  if (rate >= 70) return 'success'
  return 'info'
}

// 更新分类图表
const updateCategoryChart = () => {
  // 图表组件会自动重新渲染
}

// 更新趋势图表
const updateTrendChart = () => {
  loadTrendData()
}

// 更新使用率图表
const updateUtilizationChart = () => {
  loadUtilizationAnalysis()
}

// 重置筛选条件
const resetFilters = () => {
  Object.assign(filters, {
    year: '2024',
    bedType: '',
    hospitalLevel: ''
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

// 显示使用率分析
const showUtilizationAnalysis = () => {
  ElMessage.info('使用率分析详情功能开发中')
}

// 显示床位详情
const showBedDetail = (row) => {
  ElMessage.info(`查看${row.hospitalName}床位详情功能开发中`)
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
.bed-stats {
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
  .bed-stats {
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
