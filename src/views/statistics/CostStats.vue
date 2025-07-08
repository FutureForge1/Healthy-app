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
          <div class="card-value">¥{{ overviewData.totalRevenue.toFixed(2) }}万</div>
          <div class="card-label">总费用</div>
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
          <div class="card-value">¥{{ overviewData.outpatientRevenue.toFixed(2) }}万</div>
          <div class="card-label">门诊费用</div>
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
          <div class="card-value">¥{{ overviewData.inpatientRevenue.toFixed(2) }}万</div>
          <div class="card-label">住院费用</div>
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
          <div class="card-label">医药费用占比</div>
          <div class="card-ratio">目标 ≤30%</div>
        </div>
      </div>
    </div>

    <!-- 筛选条件 -->
    <div class="filter-section">
      <el-card>
        <div class="filter-row">
          <div class="filter-item">
            <label>医院等级：</label>
            <el-select v-model="filters.hospitalLevel" placeholder="选择医院等级" @change="loadFilteredData">
              <el-option label="全部" value="" />
              <el-option label="部属" value="部属" />
              <el-option label="省辖市属" value="省辖市属" />
              <el-option label="县辖市属" value="县辖市属" />
              <el-option label="县属" value="县属" />
            </el-select>
          </div>
          <div class="filter-item">
            <label>最低费用：</label>
            <el-input-number
                v-model="filters.totalFee"
                placeholder="最低费用"
                @change="loadFilteredData"
                :min="0"
            />
          </div>
          <div class="filter-actions">
            <el-button type="primary" @click="loadFilteredData">
              <el-icon><Search /></el-icon>
              查询
            </el-button>
            <el-button @click="resetFilters">重置</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 标签页切换 -->
    <div class="tabs-section">
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="门诊费用统计" name="outpatient">
          <!-- 门诊费用表格 -->
          <div class="table-section">
            <el-card>
              <template #header>
                <div class="table-header">
                  <h4>门诊费用统计</h4>
                  <div class="table-actions">
                    <el-button size="small" @click="exportTableData('outpatient')">
                      <el-icon><Download /></el-icon>
                      导出数据
                    </el-button>
                  </div>
                </div>
              </template>

              <el-table
                  :data="outpatientData.tableData"
                  :loading="outpatientData.loading"
                  stripe
                  style="width: 100%"
              >
                <el-table-column prop="hospitalLevel" label="医院级别" width="120" />
                <el-table-column prop="totalFee" label="门诊总费用" width="120" align="right">
                  <template #default="{ row }">
                    ¥{{ (row.totalFee || 0).toFixed(2) }}万
                  </template>
                </el-table-column>
                <el-table-column prop="medicineFee" label="药品费用" width="120" align="right">
                  <template #default="{ row }">
                    ¥{{ (row.medicineFee || 0).toFixed(2) }}万
                  </template>
                </el-table-column>
                <el-table-column prop="examFee" label="检查费用" width="120" align="right">
                  <template #default="{ row }">
                    ¥{{ (row.examFee || 0).toFixed(2) }}万
                  </template>
                </el-table-column>
                <el-table-column prop="treatmentFee" label="治疗费用" width="120" align="right">
                  <template #default="{ row }">
                    ¥{{ (row.treatmentFee || 0).toFixed(2) }}万
                  </template>
                </el-table-column>
                <el-table-column prop="medicineRatio" label="药品费用占比" width="130" align="center">
                  <template #default="{ row }">
                    <el-tag
                        :type="getMedicineRatioTagType(row.medicineRatio)"
                        size="small"
                    >
                      {{ row.medicineRatio || 0 }}%
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="examRatio" label="检查费用占比" width="130" align="center">
                  <template #default="{ row }">
                    {{ row.examRatio || 0 }}%
                  </template>
                </el-table-column>
                <el-table-column prop="treatmentRatio" label="治疗费用占比" width="130" align="center">
                  <template #default="{ row }">
                    {{ row.treatmentRatio || 0 }}%
                  </template>
                </el-table-column>
              </el-table>

              <!-- 分页 -->
              <div class="pagination-wrapper">
                <el-pagination
                    :current-page="outpatientData.pageInfo.index + 1"
                    :page-size="outpatientData.pageInfo.size"
                    :total="outpatientData.pageInfo.total"
                    :page-sizes="[10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next, jumper"
                    @current-change="handleOutpatientPageChange"
                    @size-change="handleOutpatientSizeChange"
                />
              </div>
            </el-card>
          </div>
        </el-tab-pane>

        <el-tab-pane label="住院费用统计" name="inpatient">
          <!-- 住院费用表格 -->
          <div class="table-section">
            <el-card>
              <template #header>
                <div class="table-header">
                  <h4>住院费用统计</h4>
                  <div class="table-actions">
                    <el-button size="small" @click="exportTableData('inpatient')">
                      <el-icon><Download /></el-icon>
                      导出数据
                    </el-button>
                  </div>
                </div>
              </template>

              <el-table
                  :data="inpatientData.tableData"
                  :loading="inpatientData.loading"
                  stripe
                  style="width: 100%"
              >
                <el-table-column prop="hospitalLevel" label="医院级别" width="120" />
                <el-table-column prop="totalFee" label="住院总费用" width="120" align="right">
                  <template #default="{ row }">
                    ¥{{ (row.totalFee || 0).toFixed(2) }}万
                  </template>
                </el-table-column>
                <el-table-column prop="bedFee" label="床位费用" width="120" align="right">
                  <template #default="{ row }">
                    ¥{{ (row.bedFee || 0).toFixed(2) }}万
                  </template>
                </el-table-column>
                <el-table-column prop="medicineFee" label="药品费用" width="120" align="right">
                  <template #default="{ row }">
                    ¥{{ (row.medicineFee || 0).toFixed(2) }}万
                  </template>
                </el-table-column>
                <el-table-column prop="treatmentFee" label="治疗费用" width="120" align="right">
                  <template #default="{ row }">
                    ¥{{ (row.treatmentFee || 0).toFixed(2) }}万
                  </template>
                </el-table-column>
                <el-table-column prop="bedRatio" label="床位费用占比" width="130" align="center">
                  <template #default="{ row }">
                    {{ row.bedRatio || 0 }}%
                  </template>
                </el-table-column>
                <el-table-column prop="medicineRatio" label="药品费用占比" width="130" align="center">
                  <template #default="{ row }">
                    <el-tag
                        :type="getMedicineRatioTagType(row.medicineRatio)"
                        size="small"
                    >
                      {{ row.medicineRatio || 0 }}%
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="treatmentRatio" label="治疗费用占比" width="130" align="center">
                  <template #default="{ row }">
                    {{ row.treatmentRatio || 0 }}%
                  </template>
                </el-table-column>
              </el-table>

              <!-- 分页 -->
              <div class="pagination-wrapper">
                <el-pagination
                    :current-page="inpatientData.pageInfo.index + 1"
                    :page-size="inpatientData.pageInfo.size"
                    :total="inpatientData.pageInfo.total"
                    :page-sizes="[10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next, jumper"
                    @current-change="handleInpatientPageChange"
                    @size-change="handleInpatientSizeChange"
                />
              </div>
            </el-card>
          </div>
        </el-tab-pane>

        <el-tab-pane label="费用结构对比" name="comparison">
          <!-- 费用结构对比分析 -->
          <div class="comparison-section">
            <el-card>
              <template #header>
                <div class="table-header">
                  <h4>费用结构对比分析</h4>
                  <div class="table-actions">
                    <el-button size="small" @click="exportTableData('comparison')">
                      <el-icon><Download /></el-icon>
                      导出数据
                    </el-button>
                  </div>
                </div>
              </template>

              <!-- 对比分析表格 -->
              <el-table
                  :data="comparisonData.comparisonData"
                  :loading="comparisonData.loading"
                  stripe
                  style="width: 100%"
              >
                <el-table-column prop="hospitalLevel" label="医院级别" width="120" />
                <el-table-column prop="totalFee" label="总费用" width="120" align="right">
                  <template #default="{ row }">
                    ¥{{ (row.totalFee || 0).toFixed(2) }}万
                  </template>
                </el-table-column>
                <el-table-column prop="medicineRatio" label="药品费用占比" width="130" align="center">
                  <template #default="{ row }">
                    <el-tag
                        :type="getMedicineRatioTagType(row.medicineRatio)"
                        size="small"
                    >
                      {{ row.medicineRatio || 0 }}%
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="examRatio" label="检查费用占比" width="130" align="center">
                  <template #default="{ row }">
                    {{ row.examRatio || 0 }}%
                  </template>
                </el-table-column>
                <el-table-column prop="treatmentRatio" label="治疗费用占比" width="130" align="center">
                  <template #default="{ row }">
                    {{ row.treatmentRatio || 0 }}%
                  </template>
                </el-table-column>
                <el-table-column prop="ranking" label="费用排名" width="100" align="center">
                  <template #default="{ row }">
                    <el-tag type="primary" size="small">
                      第{{ row.ranking || 0 }}名
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>

              <!-- 分析结果 -->
              <div class="analysis-section" v-if="comparisonData.analysis">
                <el-divider content-position="left">分析结果</el-divider>
                <el-row :gutter="20">
                  <el-col :span="6">
                    <div class="analysis-item">
                      <div class="analysis-label">平均总费用</div>
                      <div class="analysis-value">¥{{ (comparisonData.analysis.averageTotalFee || 0).toFixed(2) }}万</div>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="analysis-item">
                      <div class="analysis-label">药品费用占比区间</div>
                      <div class="analysis-value">{{ comparisonData.analysis.medicineRatioRange || '暂无数据' }}</div>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="analysis-item">
                      <div class="analysis-label">费用最高级别</div>
                      <div class="analysis-value">{{ comparisonData.analysis.highestCostLevel || '暂无数据' }}</div>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="analysis-item">
                      <div class="analysis-label">费用最低级别</div>
                      <div class="analysis-value">{{ comparisonData.analysis.lowestCostLevel || '暂无数据' }}</div>
                    </div>
                  </el-col>
                </el-row>
                <div class="analysis-trend">
                  <div class="analysis-label">费用趋势：</div>
                  <div class="analysis-value">{{ comparisonData.analysis.costTrend || '暂无数据' }}</div>
                </div>
                <div class="analysis-recommendations">
                  <div class="analysis-label">优化建议：</div>
                  <ul>
                    <li v-for="rec in (comparisonData.analysis.recommendations || [])" :key="rec">{{ rec }}</li>
                  </ul>
                </div>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
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
                v-if="structureChartType === 'pie' && structureChartData.length"
                :data="structureChartData"
                title=""
                height="300px"
                :is-donut="true"
                :inner-radius="'40%'"
                :radius="'70%'"
                :show-percentage="true"
                class="chart"
            />
            <BarChart
                v-else-if="structureChartType === 'bar' && structureChartData.length"
                :data="structureChartData.map(item => item.value)"
                :x-axis-data="structureChartData.map(item => item.name)"
                title=""
                height="300px"
                :y-axis-formatter="(value) => `${value}%`"
                class="chart"
            />
          </div>
        </div>

        <!-- 费用趋势分析 -->
        <div class="chart-card">
          <div class="chart-header">
            <h4>不同等级医院门诊费用趋势分析</h4>
          </div>
          <div class="chart-content">
            <LineChart
                :data="outpatientData.tableData.map(item => Number(item.totalFee))"
                :x-axis-data="outpatientData.tableData.map(item => item.hospitalLevel)"
                title=""
                height="300px"
                :smooth="true"
                :show-area="true"
                :area-opacity="0.3"
                :colors="['#5470c6']"
                :y-axis-formatter="(value) => `${value}万`"
                class="chart trend-chart"
            />
          </div>
        </div>
      </div>

      <!-- 费用对比分析图表 -->
      <div class="chart-row" v-if="activeTab.value === 'comparison'">
        <div class="chart-card full-width">
          <div class="chart-header">
            <h4>医院级别费用对比</h4>
            <div class="chart-controls">
              <el-radio-group v-model="comparisonChartType" @change="updateComparisonChart">
                <el-radio-button value="bar">柱状图</el-radio-button>
                <el-radio-button value="stacked">堆叠图</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="chart-content">
            <BarChart
                :data="comparisonChartData"
                :x-axis-data="comparisonXAxisData"
                :height="400"
                :show-legend="true"
                :horizontal="true"
                :color-scheme="['#5470c6', '#91cc75', '#fac858', '#ee6666']"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { fetchOutpatientCostStatistics, fetchInpatientCostStatistics, fetchCostStructureComparison } from '@/api/cost'
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Download, DataAnalysis, Refresh, Search, Money, User, House,
  TrendCharts, ArrowUp, ArrowDown, View
} from '@element-plus/icons-vue'
import { PieChart, BarChart, LineChart } from '@/components/charts'
import {
  convertWanToYuan,
  formatAmount,
  calculateAverageFee,
  calculateAverageRatio
} from '@/utils/cost-utils'
// 所有响应式变量和数据定义在这里
const activeTab = ref('outpatient')
const structureChartType = ref('pie')
const trendPeriod = ref('5年')
const comparisonChartType = ref('bar')

const filters = reactive({
  hospitalLevel: '',
  totalFee: null
})

const outpatientData = reactive({
  tableData: [],
  pageInfo: { index: 0, size: 20, total: 0 },
  aggregations: {},
  loading: false
})

const inpatientData = reactive({
  tableData: [],
  pageInfo: { index: 0, size: 20, total: 0 },
  aggregations: {},
  loading: false
})

// 费用结构对比数据
const comparisonData = reactive({
  comparisonData: [],
  analysis: {},
  loading: false
})

// 概览数据
const overviewData = reactive({
  totalRevenue: 0,
  outpatientRevenue: 0,
  inpatientRevenue: 0,
  avgOutpatientCost: 0,
  avgInpatientCost: 0,
  medicineRatio: 0,
  totalRecords: 0,
  revenueGrowth: 6.8,
  outpatientCostGrowth: 4.2,
  inpatientCostGrowth: 5.1,
  recordGrowth: 0
})

// 图表数据
const structureChartData = ref([])
const trendChartData = ref([])
const trendXAxisData = ref([])
const comparisonChartData = ref([])
const comparisonXAxisData = ref([])

//updateStructureChart 函数定义
const updateStructureChart = () => {
  // 如果后端有结构对比数据，优先用后端数据
  if (comparisonData.comparisonData && comparisonData.comparisonData.length > 0) {
    const row = comparisonData.comparisonData[0]
    const medicine = Number(row.medicineRatio ?? row.medicine_ratio ?? 0)
    const exam = Number(row.examRatio ?? row.exam_ratio ?? 0)
    const treatment = Number(row.treatmentRatio ?? row.treatment_ratio ?? 0)
    // 其他 = 100 - 三项之和，最小为0
    let other = 100 - medicine - exam - treatment
    if (other < 0) other = 0
    structureChartData.value = [
      { name: '药品费用', value: medicine },
      { name: '检查费用', value: exam },
      { name: '治疗费用', value: treatment },
      { name: '其他', value: other }
    ]
    if (row.bedRatio !== undefined || row.bed_ratio !== undefined) {
      structureChartData.value.unshift({ name: '床位费用', value: Number(row.bedRatio ?? row.bed_ratio ?? 0) })
    }
    return
  }
  // 如果没有后端数据，始终展示静态示例数据
  structureChartData.value = [
    { name: '药品费用', value: 47.7 },
    { name: '检查费用', value: 32.8 },
    { name: '治疗费用', value: 10.8 },
    { name: '其他', value: 8.7 }
  ]
}

// ====== 自动刷新结构图表的 watch，必须放在 updateStructureChart 之后 ======
watch(
    [activeTab, () => outpatientData.tableData, () => inpatientData.tableData],
    () => {
      updateStructureChart()
    },
    { immediate: true, deep: true }
)

// 加载门诊费用数据
const loadOutpatientData = async () => {
  outpatientData.loading = true
  try {
    const params = {
      filters: {},
      sort: [{ field: 'totalFee', order: 'desc' }],
      pageInfo: outpatientData.pageInfo
    }
    if (filters.hospitalLevel) {
      params.filters.hospitalLevel = { eq: filters.hospitalLevel }
    }
    if (filters.totalFee) {
      params.filters.totalFee = { gte: filters.totalFee }
    }
    const res = await fetchOutpatientCostStatistics(params)
    if (res.status === 0) {
      outpatientData.tableData = res.data.rows || []
      outpatientData.pageInfo = res.data.pageInfo || { index: 0, size: 20, total: 0 }
      outpatientData.aggregations = res.data.aggregations || {}
      console.log('后端门诊接口原始数据', res.data.rows)
      // 更新门诊费用相关概览数据
      if (res.data.aggregations?.total_stats) {
        const stats = res.data.aggregations.total_stats
        overviewData.outpatientRevenue = stats.sum || 0 // 保持万为单位
        overviewData.totalRecords = stats.count || 0

        // 计算平均门诊费用（转换为元用于显示）
        if (stats.avg) {
          overviewData.avgOutpatientCost = stats.avg * 10000 // 转换为元
        }
      } else if (outpatientData.tableData.length > 0) {
        // 如果没有聚合数据，从表格数据计算
        overviewData.outpatientRevenue = outpatientData.tableData.reduce((sum, item) => sum + (item.totalFee || 0), 0)
        overviewData.avgOutpatientCost = calculateAverageFee(outpatientData.tableData, 'totalFee')
        overviewData.totalRecords = outpatientData.tableData.length
      }

      // 计算总费用 = 门诊费用 + 住院费用
      overviewData.totalRevenue = overviewData.outpatientRevenue + overviewData.inpatientRevenue

      // 更新图表数据
      updateStructureChart()
      updateTrendChart()

      // 根据当前选项卡更新医药费用占比
      updateMedicineRatio()

      console.log('门诊费用数据加载成功:', res.data)
    } else {
      ElMessage.error(res.message || '获取门诊费用数据失败')
      console.error('门诊费用数据加载失败:', res)
    }
  } catch (error) {
    console.error('获取门诊费用数据错误:', error)
    ElMessage.error('网络错误，请稍后重试')
  } finally {
    outpatientData.loading = false
  }
}

// 加载住院费用数据
const loadInpatientData = async () => {
  inpatientData.loading = true
  try {
    const params = {
      filters: {},
      sort: [{ field: 'totalFee', order: 'desc' }],
      pageInfo: inpatientData.pageInfo
    }
    if (filters.hospitalLevel) {
      params.filters.hospitalLevel = { eq: filters.hospitalLevel }
    }
    if (filters.totalFee) {
      params.filters.totalFee = { gte: filters.totalFee }
    }
    const res = await fetchInpatientCostStatistics(params)
    if (res.status === 0) {
      inpatientData.tableData = res.data.rows || []
      inpatientData.pageInfo = res.data.pageInfo || { index: 0, size: 20, total: 0 }
      inpatientData.aggregations = res.data.aggregations || {}
      console.log('后端住院接口原始数据', res.data.rows)
      // 更新住院费用相关概览数据
      if (res.data.aggregations?.total_stats) {
        const stats = res.data.aggregations.total_stats
        overviewData.inpatientRevenue = stats.sum || 0 // 保持万为单位
        overviewData.totalRecords = stats.count || 0

        // 计算平均住院费用（转换为元用于显示）
        if (stats.avg) {
          overviewData.avgInpatientCost = stats.avg * 10000 // 转换为元
        }
      } else if (inpatientData.tableData.length > 0) {
        // 如果没有聚合数据，从表格数据计算
        overviewData.inpatientRevenue = inpatientData.tableData.reduce((sum, item) => sum + (item.totalFee || 0), 0)
        overviewData.avgInpatientCost = calculateAverageFee(inpatientData.tableData, 'totalFee')
        overviewData.totalRecords = inpatientData.tableData.length
      }

      // 计算总费用 = 门诊费用 + 住院费用
      overviewData.totalRevenue = overviewData.outpatientRevenue + overviewData.inpatientRevenue

      // 更新图表数据
      updateStructureChart()
      updateTrendChart()

      // 根据当前选项卡更新医药费用占比
      updateMedicineRatio()

      console.log('住院费用数据加载成功:', res.data)
    } else {
      ElMessage.error(res.message || '获取住院费用数据失败')
      console.error('住院费用数据加载失败:', res)
    }
  } catch (error) {
    console.error('获取住院费用数据错误:', error)
    ElMessage.error('网络错误，请稍后重试')
  } finally {
    inpatientData.loading = false
  }
}

// 加载费用结构对比数据
const loadComparisonData = async () => {
  comparisonData.loading = true
  try {
    const params = {
      compareType: 'hospital_level',
      costType: activeTab.value === 'inpatient' ? 'inpatient' : 'outpatient'
    }

    const res = await fetchCostStructureComparison(params)

    if (res.status === 0) {
      comparisonData.comparisonData = res.data.comparisonData || []
      comparisonData.analysis = res.data.analysis || {}

      // 更新对比图表
      updateComparisonChart()

      console.log('费用结构对比数据加载成功:', res.data)
    } else {
      ElMessage.error(res.message || '获取费用结构对比数据失败')
      console.error('费用结构对比数据加载失败:', res)
    }
  } catch (error) {
    console.error('获取费用结构对比数据错误:', error)
    ElMessage.error('网络错误，请稍后重试')
  } finally {
    comparisonData.loading = false
  }
}

// 标签页切换处理
const handleTabChange = (tab) => {
  activeTab.value = tab
  if (tab === 'outpatient') {
    loadOutpatientData()
  } else if (tab === 'inpatient') {
    loadInpatientData()
  } else if (tab === 'comparison') {
    loadComparisonData()
  }

  // 根据当前选项卡更新医药费用占比
  updateMedicineRatio()
}

// 更新医药费用占比
const updateMedicineRatio = () => {
  if (activeTab.value === 'outpatient' && outpatientData.tableData.length > 0) {
    overviewData.medicineRatio = calculateAverageRatio(outpatientData.tableData, 'medicineRatio').toFixed(1)
  } else if (activeTab.value === 'inpatient' && inpatientData.tableData.length > 0) {
    overviewData.medicineRatio = calculateAverageRatio(inpatientData.tableData, 'medicineRatio').toFixed(1)
  }
}


// 门诊费用分页
const handleOutpatientPageChange = (page) => {
  outpatientData.pageInfo.index = page - 1
  loadOutpatientData()
}

const handleOutpatientSizeChange = (size) => {
  outpatientData.pageInfo.size = size
  outpatientData.pageInfo.index = 0
  loadOutpatientData()
}

// 住院费用分页
const handleInpatientPageChange = (page) => {
  inpatientData.pageInfo.index = page - 1
  loadInpatientData()
}

const handleInpatientSizeChange = (size) => {
  inpatientData.pageInfo.size = size
  inpatientData.pageInfo.index = 0
  loadInpatientData()
}


// 通用数据加载方法
const loadData = () => {
  if (activeTab.value === 'outpatient') {
    loadOutpatientData()
  } else if (activeTab.value === 'inpatient') {
    loadInpatientData()
  } else if (activeTab.value === 'comparison') {
    loadComparisonData()
  }
}

// 筛选数据加载方法 - 同时更新门诊和住院数据
const loadFilteredData = async () => {
  // 同时加载门诊和住院数据，确保总费用计算正确
  await Promise.all([
    loadOutpatientData(),
    loadInpatientData()
  ])
}

// 重置筛选条件
const resetFilters = () => {
  Object.assign(filters, {
    hospitalLevel: '',
    totalFee: null
  })
  loadFilteredData()
}

// 刷新数据
const refreshData = () => {
  loadFilteredData()
}

// 更新趋势图表
const updateTrendChart = () => {
  const currentData = activeTab.value === 'outpatient' ? outpatientData : inpatientData

  if (currentData.aggregations?.year_histogram && currentData.aggregations.year_histogram.length > 0) {
    // 使用年份作为X轴
    trendXAxisData.value = currentData.aggregations.year_histogram.map(item => item.key.toString())
    if (activeTab.value === 'outpatient') {
      trendChartData.value = [
        {
          name: '门诊总费用',
          data: currentData.aggregations.year_histogram.map(item => item.avgTotalFee || item.count || 0)
        },
        {
          name: '药品费用',
          data: currentData.aggregations.year_histogram.map(item => item.avgMedicineFee || 0)
        },
        {
          name: '检查费用',
          data: currentData.aggregations.year_histogram.map(item => item.avgExamFee || 0)
        }
      ]
    } else if (activeTab.value === 'inpatient') {
      trendChartData.value = [
        {
          name: '住院总费用',
          data: currentData.aggregations.year_histogram.map(item => item.avgTotalFee || item.count || 0)
        },
        {
          name: '床位费用',
          data: currentData.aggregations.year_histogram.map(item => item.avgBedFee || 0)
        },
        {
          name: '药品费用',
          data: currentData.aggregations.year_histogram.map(item => item.avgMedicineFee || 0)
        }
      ]
    }
  } else if (activeTab.value === 'outpatient' && outpatientData.tableData.length > 0) {
    // 没有聚合数据时，直接用rows
    trendXAxisData.value = outpatientData.tableData.map(item => item.hospitalLevel)
    trendChartData.value = [
      {
        name: '门诊总费用',
        data: outpatientData.tableData.map(item => item.totalFee)
      }
    ]
  } else if (activeTab.value === 'inpatient' && inpatientData.tableData.length > 0) {
    trendXAxisData.value = inpatientData.tableData.map(item => item.hospitalLevel)
    trendChartData.value = [
      {
        name: '住院总费用',
        data: inpatientData.tableData.map(item => item.totalFee)
      }
    ]
  } else {
    trendXAxisData.value = []
    trendChartData.value = []
  }
}

// 更新对比图表
const updateComparisonChart = () => {
  if (activeTab.value === 'comparison' && comparisonData.comparisonData.length > 0) {
    // 设置X轴数据（医院级别）
    comparisonXAxisData.value = comparisonData.comparisonData.map(item => item.hospitalLevel)

    if (comparisonChartType.value === 'bar') {
      // 柱状图：显示总费用对比
      comparisonChartData.value = [
        {
          name: '总费用',
          data: comparisonData.comparisonData.map(item => item.totalFee || 0)
        }
      ]
    } else if (comparisonChartType.value === 'stacked') {
      // 堆叠图：显示费用结构对比
      comparisonChartData.value = [
        {
          name: '药品费用占比',
          data: comparisonData.comparisonData.map(item => item.medicineRatio || 0)
        },
        {
          name: '检查费用占比',
          data: comparisonData.comparisonData.map(item => item.examRatio || 0)
        },
        {
          name: '治疗费用占比',
          data: comparisonData.comparisonData.map(item => item.treatmentRatio || 0)
        }
      ]
    }
  } else {
    comparisonXAxisData.value = []
    comparisonChartData.value = []
  }
}

// 获取药品占比标签类型
const getMedicineRatioTagType = (ratio) => {
  if (ratio <= 30) return 'success'
  if (ratio <= 35) return 'warning'
  return 'danger'
}

// 导出相关方法
const exportData = () => {
  ElMessage.success('导出功能开发中')
}

const exportTableData = (type) => {
  ElMessage.success(`导出${type}数据功能开发中`)
}

const showCostAnalysis = () => {
  ElMessage.info('费用分析详情功能开发中')
}

// ========== 生命周期 ==========
onMounted(async () => {
  await nextTick()
  // 同时加载门诊和住院数据，确保总费用计算正确
  await Promise.all([
    loadOutpatientData(),
    loadInpatientData()
  ])
  loadComparisonData()
})

// 调试输出门诊费用折线图数据
watch(
  () => outpatientData.tableData,
  (newVal) => {
    console.log('门诊tableData:', newVal)
    console.log('门诊总费用数组:', newVal.map(item => item.totalFee))
    console.log('医院等级数组:', newVal.map(item => item.hospitalLevel))
  },
  { immediate: true, deep: true }
)
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
.analysis-section {
  margin-top: 20px;
}

.analysis-item {
  text-align: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.analysis-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.analysis-value {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.analysis-trend {
  margin-top: 20px;
  padding: 16px;
  background: #f0f9ff;
  border-radius: 8px;
}

.analysis-recommendations {
  margin-top: 20px;
}

.analysis-recommendations ul {
  margin: 8px 0;
  padding-left: 20px;
}

.analysis-recommendations li {
  margin: 4px 0;
  color: #374151;
}

/* 标签页样式 */
.tabs-section {
  margin-bottom: 20px;
}
</style>