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

    <!-- 筛选条件 -->
    <div class="filter-section">
      <el-card>
        <div class="filter-row">
          <div class="filter-item">
            <label>概览年份：</label>
            <el-date-picker
              v-model="selectedYear"
              type="year"
              placeholder="选择年份"
              format="YYYY"
              value-format="YYYY"
              @change="handleYearChange"
              style="width: 160px;"
            />
          
          </div>
          <div class="filter-actions">
            <el-button type="primary" @click="loadData">
              <el-icon><Search /> </el-icon>
              查询
            </el-button>
            <el-button @click="resetFilters">重置</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 概览卡片 - 不同类型医院床位 -->
    <div class="overview-cards">
      <OverviewCard
        :value="overviewData.hospitalBeds ? `${overviewData.hospitalBeds}万张` : null"
        :ratio="overviewData.hospitalRatio ? `占比 ${overviewData.hospitalRatio}%` : null"
        title="医院床位"
        icon="House"
        theme="primary"
      />
      <OverviewCard
        :value="overviewData.communityBeds ? `${overviewData.communityBeds}万张` : null"
        :ratio="overviewData.communityRatio ? `占比 ${overviewData.communityRatio}%` : null"
        title="社区卫生服务中心"
        icon="FirstAidKit"
        theme="success"
      />
      <OverviewCard
        :value="overviewData.healthCenterBeds ? `${overviewData.healthCenterBeds}万张` : null"
        :ratio="overviewData.healthCenterRatio ? `占比 ${overviewData.healthCenterRatio}%` : null"
        title="卫生院床位"
        icon="Hospital"
        theme="warning"
      />
      <OverviewCard
        :value="overviewData.totalBeds ? `${overviewData.totalBeds}万张` : null"
        :ratio="overviewData.yearGrowth ? `年增长 ${overviewData.yearGrowth}%` : null"
        title="床位总数"
        icon="DataLine"
        theme="info"
      />
    </div>


    <!-- 图表区域 -->
    <div class="charts-section">
      <!-- 历年床位总数趋势 -->
      <div class="chart-row">
        <div class="chart-card full-width">
          <div class="chart-header">
            <h4>历年床位总数趋势</h4>
            <div class="chart-controls">
              <span class="filter-label">趋势年份区间：</span>
              <el-date-picker
                v-model="selectedYearRange"
                type="yearrange"
                :range-separator="'至'"
                :start-placeholder="'开始年份'"
                :end-placeholder="'结束年份'"
                format="YYYY"
                value-format="YYYY"
                @change="handleYearRangeChange"
                style="width: 240px;"
              />
            </div>
          </div>
          <div class="chart-content">
            <!-- 调试信息 -->
            <div v-if="trendChartData.length === 0" style="text-align: center; padding: 50px; color: #999;">
              暂无趋势数据
            </div>
            <LineChart
              v-else
              :data="trendChartData"
              :x-axis-data="trendXAxisData"
              height="100%"
              :smooth="true"
              :area="false"
              :color-scheme="['#5470c6']"
              :y-axis-min="15"
              :y-axis-max="20"
              y-axis-name="床位数（万张）"
            />
          </div>
        </div>
      </div>

      <!-- 床位使用率分析卡片 -->
      <div class="chart-row">
        <div class="analysis-section">
          <div class="section-header">
            <h4>床位使用率分析</h4>
            <div class="analysis-controls">
              <span class="filter-label">分析年份：</span>
              <el-date-picker
                v-model="analysisYear"
                type="year"
                placeholder="选择年份"
                format="YYYY"
                value-format="YYYY"
                @change="handleAnalysisYearChange"
                style="width: 160px;"
              />
              <span class="filter-label">医院类型：</span>
              <el-select v-model="selectedHospitalType" @change="handleHospitalTypeChange" style="width: 160px;">
                <el-option label="全部" value="" />
                <el-option label="综合医院" value="综合医院" />
                <el-option label="专科医院" value="专科医院" />
                <el-option label="中医医院" value="中医医院" />
                <el-option label="民族医院" value="民族医院" />
              </el-select>
            </div>
          </div>

          <!-- 使用率分析卡片 -->
          <div class="analysis-cards">
            <div class="analysis-card" v-for="item in utilizationAnalysisData" :key="item.hospitalType">
              <div class="analysis-card-header">
                <h5>{{ item.hospitalType }}</h5>
                <div class="utilization-rate" :class="getUtilizationClass(item.bedUtilizationRate)">
                  {{ item.bedUtilizationRate }}%
                </div>
              </div>
              <div class="analysis-card-content">
                <div class="analysis-item">
                  <span class="label">总床位数：</span>
                  <span class="value">{{ item.totalBeds }}万张</span>
                </div>
                <div class="analysis-item">
                  <span class="label">占用床位：</span>
                  <span class="value">{{ item.occupiedBeds }}万张</span>
                </div>
                <div class="analysis-item">
                  <span class="label">平均住院日：</span>
                  <span class="value">{{ item.avgLengthOfStay }}天</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 分析结果摘要 -->
          <div class="analysis-summary" v-if="analysisResult">
            <div class="summary-card">
              <h5>分析摘要</h5>
              <div class="summary-content">
                <div class="summary-item">
                  <span class="label">平均使用率：</span>
                  <span class="value highlight">{{ analysisResult.averageUtilization }}%</span>
                </div>
                <div class="summary-item">
                  <span class="label">最高使用率：</span>
                  <span class="value">{{ analysisResult.highestUtilization }}</span>
                </div>
                <div class="summary-item">
                  <span class="label">最低使用率：</span>
                  <span class="value">{{ analysisResult.lowestUtilization }}</span>
                </div>
              </div>
              <div class="recommendations" v-if="analysisResult.recommendations">
                <h6>优化建议：</h6>
                <ul>
                  <li v-for="rec in analysisResult.recommendations" :key="rec">{{ rec }}</li>
                </ul>
              </div>
            </div>
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
  View,
  DataLine
} from '@element-plus/icons-vue'
import { PieChart, BarChart, LineChart } from '@/components/charts'
import OverviewCard from '@/components/OverviewCard.vue'
import { getBedCategoryStats, getBedTotalCount, getBedUtilizationAnalysis } from '@/api/bed'

// 响应式数据
const loading = ref(false)
const tableLoading = ref(false)

// 年份选择
const selectedYear = ref('2023')
const selectedYearRange = ref(['2020', '2023'])
const analysisYear = ref('2023')
const selectedHospitalType = ref('')

// 筛选条件
const filters = reactive({
  year: '2023',
  bedType: '',
  hospitalLevel: ''
})

// 图表类型控制
const categoryChartType = ref('pie')
const trendPeriod = ref('5年')
const utilizationAnalysisType = ref('monthly')

// 概览数据 - 不同类型医院床位
const overviewData = reactive({
  hospitalBeds: null,
  hospitalRatio: null,
  communityBeds: null,
  communityRatio: null,
  healthCenterBeds: null,
  healthCenterRatio: null,
  totalBeds: null,
  yearGrowth: null
})

// 图表数据
const trendChartData = ref([])
const trendXAxisData = ref([])

// 使用率分析数据
const utilizationAnalysisData = ref([])
const analysisResult = ref(null)

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
    const queryYear = selectedYear.value || '2023'
    const yearInt = parseInt(queryYear)

    const queryParams = {
      filters: {
        year: {
          gte: yearInt,
          lte: yearInt
        }
      },
      sort: [
        { field: 'year', order: 'desc' }
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
    const response = await getBedCategoryStats(queryParams)
    console.log('床位分类统计API响应:', response)
    console.log('查询参数:', queryParams)

    // 检查响应状态 - 后端使用 status: 0 表示成功
    if (response.status === 0 || response.code === 200) {
      bedList.value = response.data.rows || []
      pagination.total = response.data.pageInfo?.total || 0

      // 更新概览数据 - 使用床位分类统计数据
      updateOverviewData(response.data.rows)

      console.log('床位分类数据:', response.data.rows)
      console.log('概览数据更新后:', overviewData)
    } else {
      console.error('API返回错误:', response)
      ElMessage.error(`API错误: ${response.message || '未知错误'}`)
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
    const startYear = parseInt(selectedYearRange.value[0])
    const endYear = parseInt(selectedYearRange.value[1])

    const queryParams = {
      filters: {
        year: {
          gte: startYear,
          lte: endYear
        }
      },
      sort: [{ field: 'year', order: 'asc' }],
      pageInfo: { index: 0, size: 100 }
    }

    // 直接使用床位分类API获取趋势数据，因为它包含total字段
    const response = await getBedCategoryStats(queryParams)
    console.log('使用床位分类API获取趋势数据:', response)

    if ((response.status === 0 || response.code === 200) && response.data.rows) {
      const rowsData = response.data.rows
      const sortedData = rowsData.sort((a, b) => a.year - b.year)

      trendXAxisData.value = sortedData.map(item => item.year.toString())
      // LineChart组件期望简单数组格式，不是对象数组
      trendChartData.value = sortedData.map(item => item.total || 0)

      console.log('趋势图表数据:', {
        xAxis: trendXAxisData.value,
        data: trendChartData.value,
        rawData: sortedData
      })
      console.log('修复后的trendChartData.value:', trendChartData.value)
      console.log('修复后的trendXAxisData.value:', trendXAxisData.value)
    } else {
      console.error('床位分类API返回错误:', response)
      ElMessage.error('无法加载趋势数据')
    }
  } catch (error) {
    console.error('加载趋势数据失败:', error)
  }
}

// 加载使用率分析数据
const loadUtilizationAnalysis = async () => {
  try {
    const params = {
      year: parseInt(analysisYear.value),
      hospitalType: selectedHospitalType.value || ''
    }

    const response = await getBedUtilizationAnalysis(params)
    console.log('床位使用率分析API响应:', response)

    // 检查响应状态 - 后端使用 status: 0 表示成功
    if (response.status === 0 || response.code === 200) {
      utilizationAnalysisData.value = response.data.utilizationData || []
      analysisResult.value = response.data.analysis || null

      console.log('使用率分析数据:', {
        utilizationData: utilizationAnalysisData.value,
        analysis: analysisResult.value
      })
    } else {
      console.error('使用率分析API返回错误:', response)
      ElMessage.error(`使用率分析API错误: ${response.message || '未知错误'}`)
      utilizationAnalysisData.value = []
      analysisResult.value = null
    }
  } catch (error) {
    console.error('加载使用率分析数据失败:', error)
    utilizationAnalysisData.value = []
    analysisResult.value = null
  }
}

// 更新概览数据 - 不同类型医院床位
const updateOverviewData = (rows) => {
  if (rows && rows.length > 0) {
    // 找到选中年份的数据
    const targetYear = parseInt(selectedYear.value)
    const yearData = rows.find(row => row.year === targetYear) || rows[0]

    if (yearData) {
      overviewData.hospitalBeds = (yearData.hospital || 0).toFixed(2)
      overviewData.communityBeds = (yearData.communityHealth || 0).toFixed(2)
      overviewData.healthCenterBeds = (yearData.healthCenter || 0).toFixed(2)
      overviewData.totalBeds = (yearData.total || 0).toFixed(2)

      // 计算占比
      const total = yearData.total || 1
      overviewData.hospitalRatio = ((yearData.hospital || 0) / total * 100).toFixed(1)
      overviewData.communityRatio = ((yearData.communityHealth || 0) / total * 100).toFixed(1)
      overviewData.healthCenterRatio = ((yearData.healthCenter || 0) / total * 100).toFixed(1)

      // 计算年增长率（如果有多年数据）
      if (rows.length > 1) {
        const sortedRows = rows.sort((a, b) => a.year - b.year)
        const currentIndex = sortedRows.findIndex(row => row.year === targetYear)
        if (currentIndex > 0) {
          const prevData = sortedRows[currentIndex - 1]
          const growth = ((yearData.total - prevData.total) / prevData.total * 100).toFixed(1)
          overviewData.yearGrowth = growth
        }
      }

      console.log(`${targetYear}年概览数据:`, {
        医院床位: overviewData.hospitalBeds,
        社区卫生服务中心: overviewData.communityBeds,
        卫生院: overviewData.healthCenterBeds,
        总计: overviewData.totalBeds
      })
    }
  }
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
  selectedYear.value = '2023'
  selectedYearRange.value = ['2020', '2023']
  analysisYear.value = '2023'
  selectedHospitalType.value = ''
  Object.assign(filters, {
    year: '2023',
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

// 年份变化处理
const handleYearChange = async () => {
  if (!selectedYear.value) return

  loading.value = true
  try {
    console.log(`切换到${selectedYear.value}年床位数据`)
    await loadData()
    ElMessage.success(`已切换到${selectedYear.value}年数据`)
  } catch (error) {
    ElMessage.error('数据加载失败')
    console.error('年份切换失败:', error)
  } finally {
    loading.value = false
  }
}

// 年份区间变化处理
const handleYearRangeChange = async () => {
  if (!selectedYearRange.value || selectedYearRange.value.length !== 2) return

  try {
    console.log(`切换趋势年份区间: ${selectedYearRange.value[0]} - ${selectedYearRange.value[1]}`)
    await loadTrendData()
    ElMessage.success(`已更新趋势数据`)
  } catch (error) {
    ElMessage.error('趋势数据加载失败')
    console.error('年份区间切换失败:', error)
  }
}

// 分析年份变化处理
const handleAnalysisYearChange = async () => {
  if (!analysisYear.value) return

  try {
    console.log(`切换分析年份: ${analysisYear.value}`)
    await loadUtilizationAnalysis()
    ElMessage.success(`已切换到${analysisYear.value}年分析数据`)
  } catch (error) {
    ElMessage.error('分析数据加载失败')
    console.error('分析年份切换失败:', error)
  }
}

// 医院类型变化处理
const handleHospitalTypeChange = async () => {
  try {
    console.log(`切换医院类型: ${selectedHospitalType.value || '全部'}`)
    await loadUtilizationAnalysis()
    ElMessage.success(`已更新医院类型筛选`)
  } catch (error) {
    ElMessage.error('数据筛选失败')
    console.error('医院类型切换失败:', error)
  }
}

// 获取使用率等级样式
const getUtilizationClass = (rate) => {
  if (rate >= 90) return 'high'
  if (rate >= 75) return 'medium'
  return 'low'
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
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

.filter-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

/* 使用率分析区域 */
.analysis-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
}

.section-header h4 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.analysis-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 分析卡片 */
.analysis-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.analysis-card {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.analysis-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.analysis-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.analysis-card-header h5 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.utilization-rate {
  font-size: 24px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
}

.utilization-rate.high {
  background: linear-gradient(135deg, #10b981, #059669);
}

.utilization-rate.medium {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.utilization-rate.low {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.analysis-card-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.analysis-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.analysis-item .label {
  font-size: 14px;
  color: #6b7280;
}

.analysis-item .value {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

/* 分析摘要 */
.analysis-summary {
  margin-top: 24px;
}

.summary-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 24px;
}

.summary-card h5 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
}

.summary-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-item .label {
  font-size: 14px;
  opacity: 0.9;
}

.summary-item .value {
  font-size: 18px;
  font-weight: 600;
}

.summary-item .value.highlight {
  font-size: 24px;
  color: #fbbf24;
}

.recommendations h6 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
}

.recommendations ul {
  margin: 0;
  padding-left: 20px;
}

.recommendations li {
  margin-bottom: 8px;
  font-size: 14px;
  opacity: 0.9;
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
