//这个是医护人员的展示界面


<template>
  <div class="personnel-stats">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2>医疗人员统计</h2>
        <p>成都市医疗卫生人员分类、总数、结构等统计分析</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="exportData">
          <el-icon><Download /></el-icon>
          导出报告
        </el-button>
        <el-button type="success" @click="showStructureAnalysis">
          <el-icon><DataAnalysis /></el-icon>
          结构分析
        </el-button>
        <el-button @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
      </div>
    </div>

    <!-- 筛选条件 -->
    <div class="filter-section">
      <el-card class="modern-filter-card">
        <div class="filter-header">
          <h3>输入年份查询数据</h3>
        </div>

        <div class="filter-content">
          <!-- 底部布局：左侧输入框，右侧按钮 -->
          <div class="bottom-layout">
            <!-- 左下角：年份输入搜索框 -->
            <div class="search-area-left">
              <SearchBox
                v-model="yearInput"
                placeholder="请输入年份 (2000-2030) 按回车查询"
                size="large"
                @search="handleYearInput"
                @filter="handleAdvancedFilter"
              />
            </div>

            <!-- 右下角：操作按钮 -->
            <div class="action-buttons-right">
              <el-button type="primary" @click="loadData" class="query-btn">
                <el-icon><Search /></el-icon>
                查询数据
              </el-button>
              <el-button @click="resetFilters" class="reset-btn">
                <el-icon><RefreshLeft /></el-icon>
                重置筛选
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 概览卡片 -->
    <div class="overview-cards" v-loading="loading">
      <OverviewCard
        :value="overviewData.totalPersonnel > 0 ? overviewData.totalPersonnel : null"
        title="卫生技术人员"
        unit="万"
        :ratio="overviewData.totalPersonnel > 0 ? overviewData.totalPersonnelRatio : null"
        :icon="User"
        theme="primary"
        :loading="loading"
        empty-text="暂无数据"
      />

      <OverviewCard
        :value="overviewData.doctors > 0 ? overviewData.doctors : null"
        title="执业医师人数"
        unit="万"
        :ratio="overviewData.doctors > 0 ? overviewData.doctorRatio : null"
        :icon="FirstAidKit"
        theme="success"
        :loading="loading"
        empty-text="暂无数据"
      />

      <OverviewCard
        :value="overviewData.nurses > 0 ? overviewData.nurses : null"
        title="护士人数"
        unit="万"
        :ratio="overviewData.nurses > 0 ? overviewData.nurseRatio : null"
        :icon="House"
        theme="warning"
        :loading="loading"
        empty-text="暂无数据"
      />

      <OverviewCard
        :value="overviewData.technicians > 0 ? overviewData.technicians : null"
        title="药剂人员人数"
        unit="万"
        :ratio="overviewData.technicians > 0 ? overviewData.technicianRatio : null"
        :icon="School"
        theme="info"
        :loading="loading"
        empty-text="暂无数据"
      />
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <div class="chart-row">
        <!-- 人员分类统计 -->
        <div class="chart-card">
          <div class="chart-header">
            <h4>人员分类统计</h4>
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
              height="300px"
              title="人员分类分布"
              :show-legend="true"
              :is-donut="true"
              :colors="['#5470c6', '#91cc75', '#fac858', '#ee6666']"
              :loading="loading"
            />
            <BarChart
              v-else
              :data="categoryBarChartData"
              :x-axis-data="categoryXAxisData"
              height="300px"
              title="人员分类统计"
              :colors="['#5470c6', '#91cc75', '#fac858', '#ee6666']"
              :loading="loading"
            />
          </div>
        </div>

        <!-- 历年人员总数趋势 -->
        <div class="chart-card">
          <div class="chart-header">
            <h4>历年人员总数趋势</h4>
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
              :data="trendChartSeriesData"
              :x-axis-data="trendXAxisData"
              height="300px"
              title="历年人员总数趋势"
              :smooth="true"
              :show-area="true"
              :colors="['#5470c6']"
              :loading="loading"
              :series-names="['总人数']"
              y-axis-name="人员总数(万)"
            />
          </div>
        </div>
      </div>

      <!-- 人员结构分析 -->
      <div class="chart-row">
        <div class="chart-card full-width">
          <div class="chart-header">
            <h4>人员结构分析</h4>
          </div>

          <!-- 结构分析数据展示 -->
          <div class="structure-analysis-container" v-loading="loading">
            <!-- 人员结构比例 -->
            <div class="structure-ratio-display">
              <h5>{{ structureData.currentYear }}年人员结构比例</h5>
              <div class="ratio-grid">
                <div class="ratio-item">
                  <div class="ratio-label">执业医师</div>
                  <div class="ratio-value">{{ structureData.structure?.physicianRatio || 0 }}%</div>
                  <div class="ratio-bar">
                    <div class="ratio-fill physician" :style="{ width: (structureData.structure?.physicianRatio || 0) + '%' }"></div>
                  </div>
                </div>
                <div class="ratio-item">
                  <div class="ratio-label">注册护士</div>
                  <div class="ratio-value">{{ structureData.structure?.nurseRatio || 0 }}%</div>
                  <div class="ratio-bar">
                    <div class="ratio-fill nurse" :style="{ width: (structureData.structure?.nurseRatio || 0) + '%' }"></div>
                  </div>
                </div>
                <div class="ratio-item">
                  <div class="ratio-label">药剂人员</div>
                  <div class="ratio-value">{{ structureData.structure?.pharmacistRatio || 0 }}%</div>
                  <div class="ratio-bar">
                    <div class="ratio-fill pharmacist" :style="{ width: (structureData.structure?.pharmacistRatio || 0) + '%' }"></div>
                  </div>
                </div>
                <div class="ratio-item">
                  <div class="ratio-label">其他人员</div>
                  <div class="ratio-value">{{ structureData.structure?.otherRatio || 0 }}%</div>
                  <div class="ratio-bar">
                    <div class="ratio-fill other" :style="{ width: (structureData.structure?.otherRatio || 0) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 三个分析卡片横向展示 -->
            <div class="analysis-cards-row">
              <!-- 医护比例分析 -->
              <div class="overview-card blue">
                <div class="card-background"></div>
                <div class="card-content">
                  <div class="card-header">
                    <h5>医护比例分析</h5>
                    <div class="card-corner"></div>
                  </div>
                  <div class="ratio-info">
                    <div class="info-item">
                      <span class="info-label">当前医护比</span>
                      <span class="info-value">{{ structureData.doctorNurseRatio || '暂无数据' }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">推荐医护比</span>
                      <span class="info-value">{{ structureData.analysis?.recommendedRatio || '暂无数据' }}</span>
                    </div>
                    <div class="status-indicator" :class="{ shortage: structureData.analysis?.nurseShortage }">
                      {{ structureData.analysis?.nurseShortage ? '护理人员不足' : '护理人员充足' }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- 历年增长趋势 -->
              <div class="overview-card green">
                <div class="card-background"></div>
                <div class="card-content">
                  <div class="card-header">
                    <h5>历年增长趋势</h5>
                    <div class="card-corner"></div>
                  </div>
                  <div class="growth-timeline">
                    <div
                      v-for="item in structureData.yearlyGrowth"
                      :key="item.year"
                      class="growth-item"
                    >
                      <div class="year">{{ item.year }}年</div>
                      <div class="personnel-count">{{ item.totalPersonnel }}万人</div>
                      <div class="growth-rate" :class="getGrowthRateClass(item.growthRate)">
                        {{ item.growthRate ? (item.growthRate > 0 ? '+' : '') + item.growthRate + '%' : '基准年' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 改进建议 -->
              <div class="overview-card orange">
                <div class="card-background"></div>
                <div class="card-content">
                  <div class="card-header">
                    <h5>改进建议</h5>
                    <div class="card-corner"></div>
                  </div>
                  <div class="suggestions">
                    <div
                      v-for="(suggestion, index) in structureData.analysis?.improvementSuggestions"
                      :key="index"
                      class="suggestion-item"
                    >
                      <i class="suggestion-icon">💡</i>
                      <span class="suggestion-text">{{ suggestion }}</span>
                    </div>
                    <div v-if="!structureData.analysis?.improvementSuggestions?.length" class="no-suggestions">
                      暂无改进建议
                    </div>
                  </div>
                </div>
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
              <el-input
                v-model="searchKeyword"
                placeholder="搜索医疗机构..."
                style="width: 200px; margin-right: 12px;"
                clearable
                @input="handleSearch"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              <el-select
                v-model="tableFilters.hospitalLevel"
                placeholder="医院等级"
                style="width: 120px; margin-right: 12px;"
                clearable
                @change="handleTableFilter"
              >
                <el-option label="三甲" value="三甲" />
                <el-option label="三乙" value="三乙" />
                <el-option label="二甲" value="二甲" />
                <el-option label="二乙" value="二乙" />
                <el-option label="一甲" value="一甲" />
                <el-option label="一乙" value="一乙" />
              </el-select>
              <el-select
                v-model="tableFilters.region"
                placeholder="区域"
                style="width: 120px; margin-right: 12px;"
                clearable
                @change="handleTableFilter"
              >
                <el-option label="锦江区" value="锦江区" />
                <el-option label="青羊区" value="青羊区" />
                <el-option label="金牛区" value="金牛区" />
                <el-option label="武侯区" value="武侯区" />
                <el-option label="成华区" value="成华区" />
                <el-option label="龙泉驿区" value="龙泉驿区" />
                <el-option label="青白江区" value="青白江区" />
                <el-option label="新都区" value="新都区" />
                <el-option label="温江区" value="温江区" />
                <el-option label="双流区" value="双流区" />
                <el-option label="郫都区" value="郫都区" />
              </el-select>
              <el-button size="small" @click="refreshTableData">
                <el-icon><Refresh /></el-icon>
                刷新
              </el-button>
              <el-button size="small" @click="exportTableData">
                <el-icon><Download /></el-icon>
                导出数据
              </el-button>
            </div>
          </div>
        </template>
        
        <el-table
          :data="filteredPersonnelList"
          :loading="tableLoading"
          stripe
          border
          style="width: 100%"
          :default-sort="{ prop: 'totalPersonnel', order: 'descending' }"
          @sort-change="handleSortChange"
        >
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="year" label="年份" width="80" align="center" sortable />
          <el-table-column prop="hospitalName" label="医疗机构" min-width="200" show-overflow-tooltip>
            <template #default="{ row }">
              <div class="hospital-info">
                <div class="hospital-name">{{ row.hospitalName }}</div>
                <div class="hospital-code">{{ row.hospitalCode || '未设置' }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="hospitalLevel" label="医院等级" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getHospitalLevelType(row.hospitalLevel)"
                size="small"
              >
                {{ row.hospitalLevel }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="region" label="区域" width="120" align="center" />
          <el-table-column prop="totalPersonnel" label="总人数" width="120" align="right" sortable>
            <template #default="{ row }">
              <div class="number-cell">
                <span class="number">{{ row.totalPersonnel?.toLocaleString() || 0 }}</span>
                <span class="unit">人</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="licensedPhysician" label="执业医师" width="120" align="right" sortable>
            <template #default="{ row }">
              <div class="number-cell">
                <span class="number">{{ row.licensedPhysician?.toLocaleString() || 0 }}</span>
                <span class="unit">人</span>
                <div class="percentage">{{ calculatePercentage(row.licensedPhysician, row.totalPersonnel) }}%</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="nurse" label="注册护士" width="120" align="right" sortable>
            <template #default="{ row }">
              <div class="number-cell">
                <span class="number">{{ row.nurse?.toLocaleString() || 0 }}</span>
                <span class="unit">人</span>
                <div class="percentage">{{ calculatePercentage(row.nurse, row.totalPersonnel) }}%</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="healthPersonnel" label="卫生技术人员" width="140" align="right" sortable>
            <template #default="{ row }">
              <div class="number-cell">
                <span class="number">{{ row.healthPersonnel?.toLocaleString() || 0 }}</span>
                <span class="unit">人</span>
                <div class="percentage">{{ calculatePercentage(row.healthPersonnel, row.totalPersonnel) }}%</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="pharmacist" label="药剂人员" width="120" align="right" sortable>
            <template #default="{ row }">
              <div class="number-cell">
                <span class="number">{{ row.pharmacist?.toLocaleString() || 0 }}</span>
                <span class="unit">人</span>
                <div class="percentage">{{ calculatePercentage(row.pharmacist, row.totalPersonnel) }}%</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="doctorNurseRatio" label="医护比" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getDoctorNurseRatioType(row.doctorNurseRatio)"
                size="small"
              >
                1:{{ row.doctorNurseRatio || '0' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="lastUpdated" label="更新时间" width="160" align="center">
            <template #default="{ row }">
              {{ formatDate(row.lastUpdated) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right" align="center">
            <template #default="{ row }">
              <el-button link size="small" @click="showPersonnelDetail(row)">
                <el-icon><View /></el-icon>
                详情
              </el-button>
              <el-button link size="small" @click="editPersonnelData(row)">
                <el-icon><Edit /></el-icon>
                编辑
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
  RefreshLeft,
  Search,
  User,
  FirstAidKit,
  House,
  School,
  ArrowUp,
  ArrowDown,
  View,
  Edit
} from '@element-plus/icons-vue'
import { PieChart, BarChart, LineChart } from '@/components/charts'
import OverviewCard from '@/components/OverviewCard.vue'
import SearchBox from '@/components/SearchBox.vue'
import personnelApi from '@/api/personnel'

// 响应式数据
const loading = ref(false)
const tableLoading = ref(false)

// 搜索相关
const searchQuery = ref('')
const yearInput = ref('2024')
const isAdvancedFilterVisible = ref(false)

// 筛选条件
const filters = reactive({
  year: '2024',
  personnelType: '',
  hospitalLevel: ''
})

// 图表类型控制
const categoryChartType = ref('pie')
const trendPeriod = ref('5年')
const structureAnalysisType = ref('ratio')

// 人员结构分析数据
const structureData = ref({
  currentYear: new Date().getFullYear(),
  structure: {
    physicianRatio: 0,
    nurseRatio: 0,
    pharmacistRatio: 0,
    otherRatio: 0
  },
  doctorNurseRatio: '',
  yearlyGrowth: [],
  analysis: {
    nurseShortage: false,
    recommendedRatio: '',
    improvementSuggestions: []
  }
})

// 概览数据 - 从API获取真实数据
const overviewData = reactive({
  totalPersonnel: 0,
  doctors: 0,
  nurses: 0,
  technicians: 0,
  doctorRatio: 0,
  nurseRatio: 0,
  technicianRatio: 0,
  totalPersonnelRatio: 0,
  personnelGrowth: 0
})

// 图表数据 - 从API获取真实数据
const categoryChartData = ref([]) // 饼图数据
const categoryBarChartData = ref([]) // 柱状图数据
const categoryXAxisData = ref(['卫生技术人员', '执业医师', '护士', '药剂人员']) // 柱状图X轴

const trendChartData = ref([])
const trendChartSeriesData = ref([]) // 折线图系列数据
const trendXAxisData = ref([])

const structureChartData = ref([])
const structureBarChartData = ref([]) // 结构分析柱状图数据
const structureXAxisData = ref([]) // 结构分析X轴数据

// 表格数据
const personnelList = ref([])
const filteredPersonnelList = ref([])

// 搜索和过滤
const searchKeyword = ref('')
const tableFilters = reactive({
  hospitalLevel: '',
  region: ''
})

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
        { field: 'totalPersonnel', order: 'desc' }
      ],
      pageInfo: {
        index: pagination.page - 1,
        size: pagination.size
      }
    }

    // 添加可选过滤条件
    if (filters.personnelType) {
      queryParams.filters.personnelType = { eq: filters.personnelType }
    }
    if (filters.hospitalLevel) {
      queryParams.filters.hospitalLevel = { eq: filters.hospitalLevel }
    }

    // 调用新的人员分类统计API
    console.log('正在调用人员分类统计API，查询参数:', queryParams)
    const response = await personnelApi.getPersonnelCategoryStats(queryParams)
    console.log('人员分类统计API响应:', response)

    if (response.code === 200 || response.status === 0) {
      // 模拟详细数据（因为API可能返回聚合数据，我们需要生成详细的表格数据）
      const mockDetailedData = generateMockDetailedData(response.data.rows || [])
      personnelList.value = mockDetailedData
      pagination.total = mockDetailedData.length

      console.log(`加载了 ${personnelList.value.length} 条人员数据，总计 ${pagination.total} 条`)

      // 应用过滤
      filterTableData()

      // 更新概览数据
      if (response.data.aggregations) {
        updateOverviewData(response.data.aggregations)
      }
    } else {
      console.warn('人员分类统计API返回错误:', response.message)
      ElMessage.warning(`加载数据失败: ${response.message || '未知错误'}`)
    }

    // 加载概览数据
    await loadOverviewData()

    // 加载趋势数据
    await loadTrendData()

    // 加载结构分析数据
    await loadStructureAnalysis()

  } catch (error) {
    ElMessage.error('加载数据失败，请检查后端服务是否正常运行')
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
    tableLoading.value = false
  }
}

// 加载概览数据
const loadOverviewData = async () => {
  try {
    const currentYear = parseInt(filters.year)
    console.log(`正在加载${currentYear}年的概览数据...`)

    // 重置概览数据
    Object.assign(overviewData, {
      totalPersonnel: 0,
      doctors: 0,
      nurses: 0,
      technicians: 0,
      doctorRatio: 0,
      nurseRatio: 0,
      technicianRatio: 0,
      personnelGrowth: 0
    })

    // 获取指定年份的人员分类统计数据
    const currentResponse = await personnelApi.getPersonnelCategoryStatsByYear(currentYear, 100)
    console.log(`${currentYear}年数据响应:`, currentResponse)

    if ((currentResponse.code === 200 || currentResponse.status === 0) && currentResponse.data.rows && currentResponse.data.rows.length > 0) {
      const rows = currentResponse.data.rows
      const currentData = {
        totalPersonnel: 0,
        doctors: 0,
        nurses: 0,
        technicians: 0
      }

      // 汇总所有机构的数据 - 使用正确的字段名（数据已经是万为单位，不需要转换）
      rows.forEach(row => {
        // API返回的字段名映射 - 根据实际API数据结构
        currentData.totalPersonnel += (row.healthPersonnel || 0)  // 卫生技术人员
        currentData.doctors += (row.licensedPhysician || 0)       // 执业医师
        currentData.nurses += (row.nurse || 0)                    // 护士
        currentData.technicians += (row.pharmacist || 0)          // 药剂人员
      })

      console.log(`${currentYear}年汇总数据:`, currentData)
      console.log('原始API数据行:', rows)

      // 更新概览数据
      Object.assign(overviewData, currentData)

      // 计算比例 - 每个人员类型相对于总计的占比
      const totalFromAPI = rows.reduce((sum, row) => sum + (row.total || 0), 0)
      if (totalFromAPI > 0) {
        // 执业医师占比 = licensedPhysician / total * 100
        overviewData.doctorRatio = parseFloat(((overviewData.doctors / totalFromAPI) * 100).toFixed(1))
        // 护士占比 = nurse / total * 100
        overviewData.nurseRatio = parseFloat(((overviewData.nurses / totalFromAPI) * 100).toFixed(1))
        // 药剂人员占比 = pharmacist / total * 100
        overviewData.technicianRatio = parseFloat(((overviewData.technicians / totalFromAPI) * 100).toFixed(1))
        // 卫生技术人员占比 = healthPersonnel / total * 100
        overviewData.totalPersonnelRatio = parseFloat(((overviewData.totalPersonnel / totalFromAPI) * 100).toFixed(1))
      }

      // 计算增长率（与上一年对比）
      try {
        const previousResponse = await personnelApi.getPersonnelCategoryStatsByYear(currentYear - 1, 100)
        if ((previousResponse.code === 200 || previousResponse.status === 0) && previousResponse.data.rows && previousResponse.data.rows.length > 0) {
          const previousRows = previousResponse.data.rows
          let previousTotal = 0
          previousRows.forEach(row => {
            previousTotal += (row.total || row.healthPersonnel || 0)
          })

          if (previousTotal > 0) {
            overviewData.personnelGrowth = parseFloat((((currentData.totalPersonnel - previousTotal) / previousTotal) * 100).toFixed(1))
          }
        }
      } catch (error) {
        console.warn('无法获取上一年数据计算增长率:', error)
      }

      // 更新图表数据
      updateCategoryChartData()

      console.log(`概览数据更新完成:`, overviewData)
    } else {
      console.warn(`${currentYear}年没有找到数据`)
      ElMessage.warning(`${currentYear}年暂无数据`)
    }

    // 如果概览方法失败，回退到单独获取当前年份数据
    if (overviewData.totalPersonnel === 0) {
      const currentYear = parseInt(filters.year)
      const currentResponse = await personnelApi.getPersonnelCategoryStatsByYear(currentYear, 50) // 获取更多数据以便汇总

      if ((currentResponse.code === 200 || currentResponse.status === 0) && currentResponse.data.rows && currentResponse.data.rows.length > 0) {
        const rows = currentResponse.data.rows
        const currentData = {
          totalPersonnel: 0,
          doctors: 0,
          nurses: 0,
          technicians: 0
        }

        rows.forEach(row => {
          // 使用正确的API字段名
          currentData.totalPersonnel += (row.total || row.healthPersonnel || 0)
          currentData.doctors += (row.licensedPhysician || 0)
          currentData.nurses += (row.nurse || 0)
          currentData.technicians += (row.pharmacist || 0)
        })

        // 更新概览数据
        Object.assign(overviewData, currentData)

        // 计算比例
        if (overviewData.totalPersonnel > 0) {
          overviewData.doctorRatio = parseFloat(((overviewData.doctors / overviewData.totalPersonnel) * 100).toFixed(1))
          overviewData.nurseRatio = parseFloat(((overviewData.nurses / overviewData.totalPersonnel) * 100).toFixed(1))
          overviewData.technicianRatio = parseFloat(((overviewData.technicians / overviewData.totalPersonnel) * 100).toFixed(1))
        }

        // 更新图表数据
        updateCategoryChartData()
      }
    }
  } catch (error) {
    console.error('加载概览数据失败:', error)
    ElMessage.warning('加载概览数据失败，请检查后端服务')

    // 设置默认值以避免显示异常
    Object.assign(overviewData, {
      totalPersonnel: 0,
      doctors: 0,
      nurses: 0,
      technicians: 0,
      doctorRatio: 0,
      nurseRatio: 0,
      technicianRatio: 0,
      personnelGrowth: 0
    })
  }
}

// 加载趋势数据
const loadTrendData = async () => {
  try {
    const yearCount = parseInt(trendPeriod.value)
    const currentYear = new Date().getFullYear()
    const startYear = currentYear - yearCount + 1

    // 使用新的API获取历年人员总数趋势
    const response = await personnelApi.getPersonnelTotalCountByYearRange(startYear, currentYear, 50)
    console.log('趋势数据API响应:', response)

    if ((response.code === 200 || response.status === 0) && response.data.rows) {
      const rows = response.data.rows

      // 按年份排序（升序）
      const sortedRows = rows.sort((a, b) => a.year - b.year)

      // 提取年份和总数数据
      trendXAxisData.value = sortedRows.map(item => item.year.toString())

      // 折线图组件需要的数据格式 - 只显示总人数趋势
      trendChartSeriesData.value = [
        sortedRows.map(item => item.totalCount || 0)
      ]

      console.log('趋势图X轴数据:', trendXAxisData.value)
      console.log('趋势图Y轴数据:', trendChartSeriesData.value)
    } else {
      console.warn('趋势数据API返回格式异常:', response)
      ElMessage.warning('加载趋势数据失败')
    }
  } catch (error) {
    console.error('加载趋势数据失败:', error)
    ElMessage.error('加载趋势数据失败，请检查网络连接')
  }
}

// 加载结构分析数据
const loadStructureAnalysis = async () => {
  try {
    const response = await personnelApi.getPersonnelStructureAnalysis()
    console.log('结构分析API响应:', response)

    if ((response.code === 200 || response.status === 0) && response.data) {
      // 更新结构分析数据
      structureData.value = {
        currentYear: response.data.currentYear || new Date().getFullYear(),
        structure: response.data.structure || {
          physicianRatio: 0,
          nurseRatio: 0,
          pharmacistRatio: 0,
          otherRatio: 0
        },
        doctorNurseRatio: response.data.doctorNurseRatio || '',
        yearlyGrowth: response.data.yearlyGrowth || [],
        analysis: response.data.analysis || {
          nurseShortage: false,
          recommendedRatio: '',
          improvementSuggestions: []
        }
      }

      console.log('结构分析数据已更新:', structureData.value)
    } else {
      console.warn('结构分析API返回格式异常:', response)
      ElMessage.warning('加载结构分析数据失败')
    }
  } catch (error) {
    console.error('加载结构分析数据失败:', error)
    ElMessage.error('加载结构分析数据失败，请检查网络连接')
  }
}

// 更新概览数据
const updateOverviewData = (aggregations) => {
  if (aggregations && aggregations.total_stats) {
    const stats = aggregations.total_stats
    overviewData.totalPersonnel = stats.totalPersonnel || 0
    overviewData.doctors = stats.doctors || 0
    overviewData.nurses = stats.nurses || 0
    overviewData.technicians = stats.technicians || 0

    // 计算比例
    if (overviewData.totalPersonnel > 0) {
      overviewData.doctorRatio = parseFloat(((overviewData.doctors / overviewData.totalPersonnel) * 100).toFixed(1))
      overviewData.nurseRatio = parseFloat(((overviewData.nurses / overviewData.totalPersonnel) * 100).toFixed(1))
      overviewData.technicianRatio = parseFloat(((overviewData.technicians / overviewData.totalPersonnel) * 100).toFixed(1))
    }

    // 更新分类图表数据
    updateCategoryChartData()
  }
}

// 更新分类图表数据
const updateCategoryChartData = () => {
  // 饼图数据格式
  categoryChartData.value = [
    {
      name: '卫生技术人员',
      value: overviewData.totalPersonnel || 0
    },
    {
      name: '执业医师',
      value: overviewData.doctors || 0
    },
    {
      name: '注册护士',
      value: overviewData.nurses || 0
    },
    {
      name: '药剂人员',
      value: overviewData.technicians|| 0
    }
    
  ].filter(item => item.value > 0) // 只显示有数据的项目

  // 柱状图数据格式
  categoryBarChartData.value = [
    overviewData.totalPersonnel || 0,
    overviewData.doctors || 0,
    overviewData.nurses || 0,
    overviewData.technicians || 0
  ]
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

// 更新结构图表数据
const updateStructureChartData = (data) => {
  switch (structureAnalysisType.value) {
    case 'ratio':
      structureChartData.value = [
        {
          name: '人员比例',
          data: [
            { name: '执业医师', value: data.doctorRatio || 0 },
            { name: '护士', value: data.nurseRatio || 0 },
            { name: '卫生技术人员', value: data.healthPersonnelRatio || 0 },
            { name: '药剂人员', value: data.pharmacistRatio || 0 }
          ]
        }
      ]
      // 柱状图数据格式
      structureXAxisData.value = ['执业医师', '护士', '卫生技术人员', '药剂人员']
      structureBarChartData.value = [
        data.doctorRatio || 0,
        data.nurseRatio || 0,
        data.healthPersonnelRatio || 0,
        data.pharmacistRatio || 0
      ]
      break
    case 'growth':
      structureChartData.value = [
        {
          name: '增长率(%)',
          data: [
            { name: '执业医师', value: data.doctorGrowth || 0 },
            { name: '护士', value: data.nurseGrowth || 0 },
            { name: '卫生技术人员', value: data.healthPersonnelGrowth || 0 },
            { name: '药剂人员', value: data.pharmacistGrowth || 0 }
          ]
        }
      ]
      // 柱状图数据格式
      structureXAxisData.value = ['执业医师', '护士', '卫生技术人员', '药剂人员']
      structureBarChartData.value = [
        data.doctorGrowth || 0,
        data.nurseGrowth || 0,
        data.healthPersonnelGrowth || 0,
        data.pharmacistGrowth || 0
      ]
      break
    case 'comparison':
      structureChartData.value = [
        {
          name: '三级医院',
          data: [
            { name: '执业医师', value: data.level3?.doctors || 0 },
            { name: '注册护士', value: data.level3?.nurses || 0 },
            { name: '药剂人员', value: data.level3?.pharmacists || 0 }
          ]
        },
        {
          name: '二级医院',
          data: [
            { name: '执业医师', value: data.level2?.doctors || 0 },
            { name: '注册护士', value: data.level2?.nurses || 0 },
            { name: '药剂人员', value: data.level2?.pharmacists || 0 }
          ]
        }
      ]
      // 柱状图数据格式（多系列）
      structureXAxisData.value = ['执业医师', '注册护士', '药剂人员']
      structureBarChartData.value = [
        [data.level3?.doctors || 0, data.level3?.nurses || 0, data.level3?.pharmacists || 0],
        [data.level2?.doctors || 0, data.level2?.nurses || 0, data.level2?.pharmacists || 0]
      ]
      break
  }
}

// 更新分类图表
const updateCategoryChart = () => {
  // 图表组件会自动重新渲染
}

// 更新趋势图表
const updateTrendChart = () => {
  loadTrendData()
}

// 更新结构图表
const updateStructureChart = () => {
  loadStructureAnalysis()
}

// 年份变化处理
const handleYearChange = async () => {
  console.log(`年份已切换到: ${filters.year}`)

  try {
    // 设置加载状态
    loading.value = true

    // 立即更新概览数据以响应年份变化
    await loadOverviewData()

    // 然后加载其他数据
    await Promise.all([
      loadData(),
      loadTrendData(),
      loadStructureAnalysis()
    ])

    ElMessage.success(`已切换到${filters.year}年数据`)
  } catch (error) {
    console.error('年份切换失败:', error)
    ElMessage.error('年份切换失败，请重试')
  } finally {
    loading.value = false
  }
}

// 重置筛选条件
const resetFilters = () => {
  Object.assign(filters, {
    year: '2024',
    personnelType: '',
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

// 获取增长率样式类
const getGrowthRateClass = (growthRate) => {
  if (!growthRate) return 'baseline'
  if (growthRate > 0) return 'positive'
  if (growthRate < 0) return 'negative'
  return 'neutral'
}

// 表格相关函数
const calculatePercentage = (value, total) => {
  if (!value || !total) return '0.0'
  return ((value / total) * 100).toFixed(1)
}

const getHospitalLevelType = (level) => {
  const typeMap = {
    '三甲': 'danger',
    '三乙': 'warning',
    '二甲': 'success',
    '二乙': 'info',
    '一甲': 'primary',
    '一乙': ''
  }
  return typeMap[level] || ''
}

const getDoctorNurseRatioType = (ratio) => {
  if (!ratio) return ''
  const numRatio = parseFloat(ratio)
  if (numRatio >= 1.4) return 'success'
  if (numRatio >= 1.2) return 'warning'
  return 'danger'
}

const formatDate = (dateString) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 年份输入处理 (SearchBox组件)
const handleYearInput = (value) => {
  console.log('年份输入:', value)
  yearInput.value = value

  // 如果输入为空，不做处理
  if (!value.trim()) {
    return
  }

  // 验证年份格式
  const yearPattern = /^\d{4}$/
  if (yearPattern.test(value.trim())) {
    const inputYear = value.trim()
    const currentYear = new Date().getFullYear()

    // 验证年份范围 (2000-2030)
    if (parseInt(inputYear) >= 2000 && parseInt(inputYear) <= 2030) {
      console.log(`切换到${inputYear}年数据`)

      // 检查是否与当前年份相同，避免重复加载
      if (filters.year === inputYear) {
        ElMessage.info(`当前已是${inputYear}年数据`)
        return
      }

      // 更新筛选条件
      filters.year = inputYear

      // 显示加载消息
      ElMessage.success(`正在切换到${inputYear}年数据...`)

      // 重新加载所有数据
      loadAllYearData(inputYear)
    } else {
      ElMessage.warning('请输入2000-2030年之间的有效年份')
    }
  } else {
    ElMessage.warning('请输入4位数字的年份格式，如: 2024')
  }
}

// 实时年份输入验证 (可选，用于输入时的即时反馈)
const validateYearInput = (value) => {
  if (!value) return true

  // 只允许数字输入
  const numberPattern = /^\d{0,4}$/
  if (!numberPattern.test(value)) {
    return false
  }

  // 如果是4位数字，验证范围
  if (value.length === 4) {
    const year = parseInt(value)
    return year >= 2000 && year <= 2030
  }

  return true
}

// 加载指定年份的所有数据
const loadAllYearData = async (year) => {
  try {
    loading.value = true

    // 更新年份到所有相关组件
    filters.year = year

    // 并行加载所有数据
    await Promise.all([
      loadOverviewData(),    // 概览卡片数据
      loadTrendData(),       // 趋势图表数据
      loadStructureAnalysis(), // 结构分析数据
      loadData()             // 表格数据
    ])

    ElMessage.success(`${year}年数据加载完成`)
  } catch (error) {
    console.error('加载年份数据失败:', error)
    ElMessage.error(`加载${year}年数据失败，请检查网络连接`)
  } finally {
    loading.value = false
  }
}

// 显示高级筛选
const handleAdvancedFilter = () => {
  console.log('显示高级筛选')
  ElMessage.info('高级筛选功能开发中')
  // 这里可以打开高级筛选弹窗
  isAdvancedFilterVisible.value = !isAdvancedFilterVisible.value
}

// 原有的搜索处理
const handleTableSearch = () => {
  filterTableData()
}

// 表格过滤处理
const handleTableFilter = () => {
  filterTableData()
}

// 过滤表格数据
const filterTableData = () => {
  let filtered = [...personnelList.value]

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(item =>
      item.hospitalName?.toLowerCase().includes(keyword) ||
      item.hospitalCode?.toLowerCase().includes(keyword)
    )
  }

  // 医院等级过滤
  if (tableFilters.hospitalLevel) {
    filtered = filtered.filter(item => item.hospitalLevel === tableFilters.hospitalLevel)
  }

  // 区域过滤
  if (tableFilters.region) {
    filtered = filtered.filter(item => item.region === tableFilters.region)
  }

  filteredPersonnelList.value = filtered
}

// 排序处理
const handleSortChange = ({ prop, order }) => {
  console.log('排序变化:', prop, order)
  // 这里可以添加服务端排序逻辑
}

// 刷新表格数据
const refreshTableData = () => {
  searchKeyword.value = ''
  tableFilters.hospitalLevel = ''
  tableFilters.region = ''
  loadData()
}

// 编辑人员数据
const editPersonnelData = (row) => {
  ElMessage.info('编辑功能开发中...')
  console.log('编辑数据:', row)
}

// 生成模拟详细表格数据
const generateMockDetailedData = () => {
  const hospitals = [
    { name: '四川大学华西医院', level: '三甲', region: '武侯区', code: 'SCUHX001' },
    { name: '四川省人民医院', level: '三甲', region: '青羊区', code: 'SCRM002' },
    { name: '成都市第一人民医院', level: '三甲', region: '青羊区', code: 'CDYY003' },
    { name: '成都市第二人民医院', level: '三乙', region: '锦江区', code: 'CDEY004' },
    { name: '成都市第三人民医院', level: '三乙', region: '青羊区', code: 'CDSY005' },
    { name: '成都市第四人民医院', level: '二甲', region: '成华区', code: 'CDSY006' },
    { name: '成都市第五人民医院', level: '二甲', region: '温江区', code: 'CDWY007' },
    { name: '成都市第六人民医院', level: '二乙', region: '郫都区', code: 'CDLY008' },
    { name: '成都市妇女儿童中心医院', level: '三甲', region: '青羊区', code: 'CDFE009' },
    { name: '成都中医药大学附属医院', level: '三甲', region: '金牛区', code: 'CDZY010' },
    { name: '成都军区总医院', level: '三甲', region: '金牛区', code: 'CDJQ011' },
    { name: '成都市中西医结合医院', level: '三乙', region: '金牛区', code: 'CDZX012' },
    { name: '双流区人民医院', level: '二甲', region: '双流区', code: 'SLRM013' },
    { name: '新都区人民医院', level: '二甲', region: '新都区', code: 'XDRM014' },
    { name: '龙泉驿区人民医院', level: '二甲', region: '龙泉驿区', code: 'LQRM015' },
    { name: '青白江区人民医院', level: '二乙', region: '青白江区', code: 'QBRM016' },
    { name: '都江堰市人民医院', level: '二甲', region: '都江堰市', code: 'DJRM017' },
    { name: '彭州市人民医院', level: '二乙', region: '彭州市', code: 'PZRM018' },
    { name: '邛崃市人民医院', level: '二乙', region: '邛崃市', code: 'QLRM019' },
    { name: '崇州市人民医院', level: '二乙', region: '崇州市', code: 'CZRM020' }
  ]

  const years = [2024, 2023, 2022, 2021, 2020]
  const mockData = []

  hospitals.forEach((hospital, hospitalIndex) => {
    years.forEach((year, yearIndex) => {
      // 基础人数（根据医院等级设定）
      let baseTotal = 0
      switch (hospital.level) {
        case '三甲':
          baseTotal = 2000 + Math.random() * 1500
          break
        case '三乙':
          baseTotal = 1200 + Math.random() * 800
          break
        case '二甲':
          baseTotal = 800 + Math.random() * 600
          break
        case '二乙':
          baseTotal = 400 + Math.random() * 400
          break
        default:
          baseTotal = 200 + Math.random() * 300
      }

      // 年份增长因子
      const yearFactor = 1 + (2024 - year) * 0.05 + (Math.random() - 0.5) * 0.1
      const totalPersonnel = Math.round(baseTotal * yearFactor)

      // 人员分布比例
      const licensedPhysician = Math.round(totalPersonnel * (0.25 + Math.random() * 0.1))
      const nurse = Math.round(totalPersonnel * (0.35 + Math.random() * 0.15))
      const pharmacist = Math.round(totalPersonnel * (0.08 + Math.random() * 0.05))
      const healthPersonnel = Math.round(totalPersonnel * (0.20 + Math.random() * 0.1))

      // 医护比计算
      const doctorNurseRatio = nurse > 0 ? (nurse / licensedPhysician).toFixed(1) : '0.0'

      // 更新时间
      const lastUpdated = new Date(year, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)

      mockData.push({
        id: `${hospital.code}_${year}`,
        year,
        hospitalName: hospital.name,
        hospitalCode: hospital.code,
        hospitalLevel: hospital.level,
        region: hospital.region,
        totalPersonnel,
        licensedPhysician,
        nurse,
        pharmacist,
        healthPersonnel,
        doctorNurseRatio,
        lastUpdated: lastUpdated.toISOString()
      })
    })
  })

  return mockData.sort((a, b) => b.year - a.year || b.totalPersonnel - a.totalPersonnel)
}

// 显示结构分析
const showStructureAnalysis = () => {
  ElMessage.info('结构分析详情功能开发中')
}

// 显示人员详情
const showPersonnelDetail = (row) => {
  ElMessage.info(`查看${row.hospitalName}人员详情功能开发中`)
}

// 刷新数据
const refreshData = () => {
  loadData()
}

// 生命周期
onMounted(async () => {
  await nextTick()

  // 初始化年份输入值
  yearInput.value = filters.year

  loadData()

  // 生成模拟表格数据
  const mockData = generateMockDetailedData()
  personnelList.value = mockData
  filteredPersonnelList.value = mockData
  pagination.total = mockData.length
})
</script>

<style scoped>
.personnel-stats {
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
  margin-bottom: 30px;
}

.modern-filter-card {
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 10px 25px rgba(0, 0, 0, 0.08),
    0 4px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%);
  backdrop-filter: blur(10px);
  position: relative;
  transition: all 0.3s ease;
}

.modern-filter-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #22c55e, #f59e0b, #a855f7);
  background-size: 300% 100%;
  animation: gradientShift 6s ease-in-out infinite;
}

.modern-filter-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 15px 35px rgba(0, 0, 0, 0.1),
    0 8px 15px rgba(0, 0, 0, 0.08);
}

.filter-header {
  padding: 32px 32px 20px 32px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%);
  position: relative;
  overflow: hidden;
}

.filter-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: -50%;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(59, 130, 246, 0.03),
    transparent,
    rgba(34, 197, 94, 0.03),
    transparent
  );
  animation: shimmer 8s ease-in-out infinite;
}

.filter-header h3 {
  margin: 0 0 12px 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  background: linear-gradient(135deg, #3b82f6 0%, #22c55e 50%, #f59e0b 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientText 4s ease-in-out infinite;
  position: relative;
  z-index: 1;
}

.filter-header p {
  margin: 0;
  font-size: 1rem;
  color: #64748b;
  font-weight: 400;
  position: relative;
  z-index: 1;
  opacity: 0.9;
}

.filter-content {
  padding: 24px;
}

/* 底部布局样式 */
.bottom-layout {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.search-area-left {
  flex: 1;
  max-width: 400px;
  min-width: 300px;
  display: flex;
  justify-content: flex-start;
}

.action-buttons-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.search-area {
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
  position: relative;
}

.search-area::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  background: radial-gradient(
    ellipse at center,
    rgba(59, 130, 246, 0.05) 0%,
    rgba(34, 197, 94, 0.03) 50%,
    transparent 70%
  );
  border-radius: 50%;
  z-index: -1;
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.8;
  }
}

/* 底部布局样式 */
.bottom-layout {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.search-area-left {
  flex: 1;
  max-width: 400px;
  min-width: 300px;
}

.action-buttons-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

/* 保留旧的样式以防其他地方使用 */
.filter-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.query-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 50%, #1e3a8a 100%);
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 14px;
  color: white;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.query-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.query-btn:hover::before {
  left: 100%;
}

.query-btn:hover {
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #1d4ed8 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.query-btn:active {
  transform: translateY(0);
}

.reset-btn {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);
  border: 2px solid #cbd5e1;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 14px;
  color: #475569;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.reset-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(203, 213, 225, 0.3), transparent);
  transition: left 0.5s ease;
}

.reset-btn:hover::before {
  left: 100%;
}

.reset-btn:hover {
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #94a3b8 100%);
  border-color: #94a3b8;
  color: #334155;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.reset-btn:active {
  transform: translateY(0);
}

/* 动画效果 */
@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes shimmer {
  0%, 100% {
    transform: translateX(-50%);
    opacity: 0;
  }
  50% {
    transform: translateX(0%);
    opacity: 1;
  }
}

@keyframes gradientText {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.filter-content {
  animation: fadeInUp 0.6s ease-out;
}

.search-area {
  animation: fadeInUp 0.8s ease-out;
}

.filter-controls {
  animation: fadeInUp 1s ease-out;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .bottom-layout {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .search-area-left {
    max-width: 100%;
    min-width: auto;
  }

  .action-buttons-right {
    justify-content: center;
    flex-wrap: wrap;
  }

  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .action-buttons {
    justify-content: center;
    flex-wrap: wrap;
  }

  .search-area {
    margin-bottom: 20px;
  }

  .filter-header {
    padding: 24px 20px 16px 20px;
  }

  .filter-header h3 {
    font-size: 1.5rem;
  }

  .filter-content {
    padding: 20px;
  }

  .query-btn, .reset-btn {
    flex: 1;
    min-width: 120px;
  }
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

/* 概览卡片容器样式保留 */

/* 响应式设计 */
/* 结构分析样式 */
.structure-analysis-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
}

/* 人员结构比例展示 */
.structure-ratio-display {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8e8e8;
}

.structure-ratio-display h5 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 12px;
}

.ratio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.ratio-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ratio-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.ratio-value {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.ratio-bar {
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.ratio-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}

.ratio-fill.physician {
  background: linear-gradient(90deg, #5470c6, #6b7fdb);
}

.ratio-fill.nurse {
  background: linear-gradient(90deg, #91cc75, #a3d982);
}

.ratio-fill.pharmacist {
  background: linear-gradient(90deg, #fac858, #fdd572);
}

.ratio-fill.other {
  background: linear-gradient(90deg, #ee6666, #f28b8b);
}

/* 分析卡片横向展示 */
.analysis-cards-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

/* OverviewCard 样式应用 */
.overview-card {
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #e8e8e8;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  min-height: 280px;
}

.overview-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
  border-radius: 20px;
}

.overview-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.overview-card:hover::before {
  opacity: 1;
}

.overview-card:hover .card-background {
  transform: scale(1.1);
}

.overview-card:hover .card-corner {
  transform: scale(1.2);
}

.overview-card:hover .card-header h5 {
  transform: translateY(-2px);
}

/* 主题颜色 */
.overview-card.blue::before {
  background: linear-gradient(135deg, rgba(84, 112, 198, 0.1) 0%, rgba(107, 127, 219, 0.1) 100%);
}

.overview-card.green::before {
  background: linear-gradient(135deg, rgba(145, 204, 117, 0.1) 0%, rgba(163, 217, 130, 0.1) 100%);
}

.overview-card.orange::before {
  background: linear-gradient(135deg, rgba(250, 200, 88, 0.1) 0%, rgba(253, 213, 114, 0.1) 100%);
}

.card-background {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  transition: transform 0.6s ease;
  opacity: 0.05;
  border-radius: 50%;
}

.overview-card.blue .card-background {
  background: linear-gradient(135deg, #5470c6 0%, #6b7fdb 100%);
}

.overview-card.green .card-background {
  background: linear-gradient(135deg, #91cc75 0%, #a3d982 100%);
}

.overview-card.orange .card-background {
  background: linear-gradient(135deg, #fac858 0%, #fdd572 100%);
}

.card-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  position: relative;
  margin-bottom: 20px;
}

.card-header h5 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 700;
  transition: all 0.3s ease;
}

.card-corner {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: transform 0.4s ease;
}

.overview-card.blue .card-corner {
  background: linear-gradient(135deg, #5470c6, #6b7fdb);
}

.overview-card.green .card-corner {
  background: linear-gradient(135deg, #91cc75, #a3d982);
}

.overview-card.orange .card-corner {
  background: linear-gradient(135deg, #fac858, #fdd572);
}

/* 卡片内容样式 */
.ratio-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgba(248, 249, 250, 0.6);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(233, 236, 239, 0.8);
  transform: translateX(2px);
}

.info-label {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.status-indicator {
  padding: 8px 12px;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
  font-size: 12px;
  margin-top: 8px;
}

.status-indicator.shortage {
  background: rgba(255, 77, 79, 0.1);
  color: #ff4d4f;
  border: 1px solid rgba(255, 77, 79, 0.2);
}

.status-indicator:not(.shortage) {
  background: rgba(82, 196, 26, 0.1);
  color: #52c41a;
  border: 1px solid rgba(82, 196, 26, 0.2);
}

/* 增长趋势样式 */
.growth-timeline {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.growth-item {
  display: grid;
  grid-template-columns: 60px 1fr auto;
  gap: 8px;
  align-items: center;
  padding: 10px;
  background: rgba(248, 249, 250, 0.6);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.growth-item:hover {
  background: rgba(233, 236, 239, 0.8);
  transform: translateX(2px);
}

.year {
  font-weight: 600;
  color: #333;
  font-size: 12px;
}

.personnel-count {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.growth-rate {
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
}

.growth-rate.positive {
  background: rgba(82, 196, 26, 0.1);
  color: #52c41a;
  border: 1px solid rgba(82, 196, 26, 0.2);
}

.growth-rate.negative {
  background: rgba(255, 77, 79, 0.1);
  color: #ff4d4f;
  border: 1px solid rgba(255, 77, 79, 0.2);
}

.growth-rate.baseline {
  background: rgba(0, 0, 0, 0.05);
  color: #666;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* 建议样式 */
.suggestions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: rgba(248, 249, 250, 0.6);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.suggestion-item:hover {
  background: rgba(233, 236, 239, 0.8);
  transform: translateX(2px);
}

.suggestion-icon {
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 2px;
}

.suggestion-text {
  color: #333;
  font-size: 13px;
  line-height: 1.4;
}

.no-suggestions {
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 20px;
  font-size: 13px;
}

@media (max-width: 768px) {
  .personnel-stats {
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
