<template>
  <div class="cost-stats">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2>医疗费用统计</h2>
        <p>成都市医疗机构门诊、住院费用结构与趋势分析</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="exportData">
          <el-icon><Download /></el-icon>
          导出报告
        </el-button>
        <el-button type="success" @click="showCostAnalysis">
          <el-icon><DataAnalysis /></el-icon>
          费用分析
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
          <el-icon size="32" color="#409EFF"><Money /></el-icon>
        </div>
        <div class="card-content">
          <div class="card-value">¥{{ (overviewData.totalRevenue / 100000000).toFixed(2) }}亿</div>
          <div class="card-label">医疗总收入</div>
          <div class="card-change" :class="{ positive: overviewData.revenueGrowth > 0 }">
            <el-icon><ArrowUp v-if="overviewData.revenueGrowth > 0" /><ArrowDown v-else /></el-icon>
            {{ Math.abs(overviewData.revenueGrowth) }}%
          </div>
        </div>
      </div>

      <div class="overview-card">
        <div class="card-icon">
          <el-icon size="32" color="#67C23A"><User /></el-icon>
        </div>
        <div class="card-content">
          <div class="card-value">¥{{ overviewData.avgOutpatientCost.toLocaleString() }}</div>
          <div class="card-label">门诊均费</div>
          <div class="card-change" :class="{ positive: overviewData.outpatientCostGrowth > 0 }">
            <el-icon><ArrowUp v-if="overviewData.outpatientCostGrowth > 0" /><ArrowDown v-else /></el-icon>
            {{ Math.abs(overviewData.outpatientCostGrowth) }}%
          </div>
        </div>
      </div>

      <div class="overview-card">
        <div class="card-icon">
          <el-icon size="32" color="#E6A23C"><House /></el-icon>
        </div>
        <div class="card-content">
          <div class="card-value">¥{{ overviewData.avgInpatientCost.toLocaleString() }}</div>
          <div class="card-label">住院均费</div>
          <div class="card-change" :class="{ positive: overviewData.inpatientCostGrowth > 0 }">
            <el-icon><ArrowUp v-if="overviewData.inpatientCostGrowth > 0" /><ArrowDown v-else /></el-icon>
            {{ Math.abs(overviewData.inpatientCostGrowth) }}%
          </div>
        </div>
      </div>

      <div class="overview-card">
        <div class="card-icon">
          <el-icon size="32" color="#F56C6C"><TrendCharts /></el-icon>
        </div>
        <div class="card-content">
          <div class="card-value">{{ overviewData.medicineRatio }}%</div>
          <div class="card-label">药品费用占比</div>
          <div class="card-ratio">目标 ≤30%</div>
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
            <label>费用类型：</label>
            <el-select v-model="filters.costType" placeholder="选择费用类型" @change="loadData">
              <el-option label="全部" value="" />
              <el-option label="门诊费用" value="outpatient" />
              <el-option label="住院费用" value="inpatient" />
              <el-option label="药品费用" value="medicine" />
              <el-option label="检查费用" value="examination" />
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
        <!-- 费用结构分析 -->
        <div class="chart-card">
          <div class="chart-header">
            <h4>费用结构分析</h4>
            <div class="chart-controls">
              <el-radio-group v-model="structureChartType" @change="updateStructureChart">
                <el-radio-button value="pie">饼图</el-radio-button>
                <el-radio-button value="bar">柱状图</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="chart-content">
            <PieChart
              v-if="structureChartType === 'pie'"
              :data="structureChartData"
              height="100%"
              :show-legend="true"
              :donut="true"
            />
            <BarChart
              v-else
              :data="structureChartData"
              height="100%"
              :show-legend="false"
              :color-scheme="['#5470c6', '#91cc75', '#fac858', '#ee6666']"
            />
          </div>
        </div>

        <!-- 费用趋势分析 -->
        <div class="chart-card">
          <div class="chart-header">
            <h4>费用趋势分析</h4>
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
              height="100%"
              :smooth="true"
              :area="true"
              :color-scheme="['#5470c6', '#91cc75', '#fac858']"
            />
          </div>
        </div>
      </div>

      <!-- 费用对比分析 -->
      <div class="chart-row">
        <div class="chart-card full-width">
          <div class="chart-header">
            <h4>费用对比分析</h4>
            <div class="chart-controls">
              <el-button-group>
                <el-button 
                  :type="comparisonType === 'hospital' ? 'primary' : ''"
                  @click="comparisonType = 'hospital'; updateComparisonChart()"
                >
                  医院对比
                </el-button>
                <el-button 
                  :type="comparisonType === 'department' ? 'primary' : ''"
                  @click="comparisonType = 'department'; updateComparisonChart()"
                >
                  科室对比
                </el-button>
                <el-button 
                  :type="comparisonType === 'region' ? 'primary' : ''"
                  @click="comparisonType = 'region'; updateComparisonChart()"
                >
                  区域对比
                </el-button>
              </el-button-group>
            </div>
          </div>
          <div class="chart-content">
            <BarChart
              :data="comparisonChartData"
              height="100%"
              :show-legend="true"
              :horizontal="comparisonType === 'hospital'"
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
          :data="costList" 
          :loading="tableLoading"
          stripe
          style="width: 100%"
        >
          <el-table-column prop="year" label="年份" width="80" />
          <el-table-column prop="hospitalName" label="医疗机构" min-width="200" />
          <el-table-column prop="hospitalLevel" label="医院等级" width="100" />
          <el-table-column prop="totalRevenue" label="总收入(万元)" width="120" align="right">
            <template #default="{ row }">
              {{ (row.totalRevenue / 10000).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="outpatientRevenue" label="门诊收入(万元)" width="130" align="right">
            <template #default="{ row }">
              {{ (row.outpatientRevenue / 10000).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="inpatientRevenue" label="住院收入(万元)" width="130" align="right">
            <template #default="{ row }">
              {{ (row.inpatientRevenue / 10000).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="avgOutpatientCost" label="门诊均费" width="100" align="right">
            <template #default="{ row }">
              ¥{{ row.avgOutpatientCost?.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="avgInpatientCost" label="住院均费" width="100" align="right">
            <template #default="{ row }">
              ¥{{ row.avgInpatientCost?.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="medicineRatio" label="药品占比" width="100" align="center">
            <template #default="{ row }">
              <el-tag 
                :type="getMedicineRatioTagType(row.medicineRatio)"
                size="small"
              >
                {{ row.medicineRatio }}%
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button link size="small" @click="showCostDetail(row)">
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
  Money,
  User,
  House,
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
  costType: '',
  hospitalLevel: ''
})

// 图表类型控制
const structureChartType = ref('pie')
const trendPeriod = ref('5年')
const comparisonType = ref('hospital')

// 概览数据
const overviewData = reactive({
  totalRevenue: 45600000000, // 456亿
  avgOutpatientCost: 285.6,
  avgInpatientCost: 8950.2,
  medicineRatio: 28.5,
  revenueGrowth: 6.8,
  outpatientCostGrowth: 4.2,
  inpatientCostGrowth: 5.1
})

// 图表数据
const structureChartData = ref([
  { name: '药品费用', value: 28.5, color: '#5470c6' },
  { name: '检查费用', value: 22.3, color: '#91cc75' },
  { name: '治疗费用', value: 18.7, color: '#fac858' },
  { name: '材料费用', value: 15.2, color: '#ee6666' },
  { name: '其他费用', value: 15.3, color: '#73c0de' }
])

const trendChartData = ref([])
const trendXAxisData = ref([])
const comparisonChartData = ref([])

// 表格数据
const costList = ref([])

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
        { field: 'totalRevenue', order: 'desc' }
      ],
      pageInfo: {
        index: pagination.page - 1,
        size: pagination.size
      }
    }

    // 添加可选过滤条件
    if (filters.costType) {
      queryParams.filters.costType = { eq: filters.costType }
    }
    if (filters.hospitalLevel) {
      queryParams.filters.hospitalLevel = { eq: filters.hospitalLevel }
    }

    // 根据费用类型调用不同的API
    let response
    if (filters.costType === 'outpatient') {
      response = await statisticsApi.getOutpatientCostStats(queryParams)
    } else if (filters.costType === 'inpatient') {
      response = await statisticsApi.getInpatientCostStats(queryParams)
    } else {
      // 默认获取门诊费用统计
      response = await statisticsApi.getOutpatientCostStats(queryParams)
    }
    
    if (response.code === 200) {
      costList.value = response.data.rows || []
      pagination.total = response.data.pageInfo?.total || 0
      
      // 更新概览数据
      if (response.data.aggregations) {
        updateOverviewData(response.data.aggregations)
      }
    }

    // 加载费用结构对比数据
    await loadCostComparison()

  } catch (error) {
    ElMessage.error('加载数据失败，请检查后端服务是否正常运行')
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
    tableLoading.value = false
  }
}

// 加载费用结构对比数据
const loadCostComparison = async () => {
  try {
    const params = {
      comparisonType: comparisonType.value,
      year: parseInt(filters.year)
    }

    const response = await statisticsApi.getCostStructureComparison(params)
    
    if (response.code === 200) {
      updateComparisonChartData(response.data)
      updateTrendChartData(response.data)
    }
  } catch (error) {
    console.error('加载费用结构对比数据失败:', error)
  }
}

// 更新概览数据
const updateOverviewData = (aggregations) => {
  if (aggregations.total_stats) {
    const stats = aggregations.total_stats
    overviewData.totalRevenue = stats.totalRevenue || 0
    overviewData.avgOutpatientCost = stats.avgOutpatientCost || 0
    overviewData.avgInpatientCost = stats.avgInpatientCost || 0
    overviewData.medicineRatio = stats.medicineRatio || 0
  }
}

// 更新对比图表数据
const updateComparisonChartData = (data) => {
  switch (comparisonType.value) {
    case 'hospital':
      comparisonChartData.value = [
        {
          name: '门诊收入',
          data: data.hospitalComparison?.map(item => ({
            name: item.hospitalName,
            value: item.outpatientRevenue || 0
          })) || []
        },
        {
          name: '住院收入',
          data: data.hospitalComparison?.map(item => ({
            name: item.hospitalName,
            value: item.inpatientRevenue || 0
          })) || []
        }
      ]
      break
    case 'department':
      comparisonChartData.value = [
        {
          name: '科室收入',
          data: data.departmentComparison?.map(item => ({
            name: item.departmentName,
            value: item.totalRevenue || 0
          })) || []
        }
      ]
      break
    case 'region':
      comparisonChartData.value = [
        {
          name: '区域收入',
          data: data.regionComparison?.map(item => ({
            name: item.regionName,
            value: item.totalRevenue || 0
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
        name: '门诊收入',
        data: data.trendData.map(item => item.outpatientRevenue || 0)
      },
      {
        name: '住院收入',
        data: data.trendData.map(item => item.inpatientRevenue || 0)
      },
      {
        name: '药品收入',
        data: data.trendData.map(item => item.medicineRevenue || 0)
      }
    ]
  }
}

// 获取药品占比标签类型
const getMedicineRatioTagType = (ratio) => {
  if (ratio <= 30) return 'success'
  if (ratio <= 35) return 'warning'
  return 'danger'
}

// 更新结构图表
const updateStructureChart = () => {
  // 图表组件会自动重新渲染
}

// 更新趋势图表
const updateTrendChart = () => {
  loadCostComparison()
}

// 更新对比图表
const updateComparisonChart = () => {
  loadCostComparison()
}

// 重置筛选条件
const resetFilters = () => {
  Object.assign(filters, {
    year: '2024',
    costType: '',
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

// 显示费用分析
const showCostAnalysis = () => {
  ElMessage.info('费用分析详情功能开发中')
}

// 显示费用详情
const showCostDetail = (row) => {
  ElMessage.info(`查看${row.hospitalName}费用详情功能开发中`)
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
.cost-stats {
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
  .cost-stats {
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
