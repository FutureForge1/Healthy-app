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
      <el-card>
        <div class="filter-row">
          <div class="filter-item">
            <label>年份：</label>
            <el-select v-model="filters.year" placeholder="选择年份" @change="handleYearChange">
              <el-option label="2025年" value="2025" />
              <el-option label="2024年" value="2024" />
              <el-option label="2023年" value="2023" />
              <el-option label="2022年" value="2022" />
              <el-option label="2021年" value="2021" />
              <el-option label="2020年" value="2020" />
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

    <!-- 概览卡片 -->
    <div class="overview-cards" v-loading="loading">
      <OverviewCard
        :value="overviewData.totalPersonnel > 0 ? overviewData.totalPersonnel : null"
        title="卫生技术人员"
        unit="万"
        :ratio="overviewData.totalPersonnel > 0 ? 100 : null"
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

      <!-- 人员结构分析 -->
      <div class="chart-row">
        <div class="chart-card full-width">
          <div class="chart-header">
            <h4>人员结构分析</h4>
            <div class="chart-controls">
              <el-button-group>
                <el-button 
                  :type="structureAnalysisType === 'ratio' ? 'primary' : ''"
                  @click="structureAnalysisType = 'ratio'; updateStructureChart()"
                >
                  比例分析
                </el-button>
                <el-button 
                  :type="structureAnalysisType === 'growth' ? 'primary' : ''"
                  @click="structureAnalysisType = 'growth'; updateStructureChart()"
                >
                  增长分析
                </el-button>
                <el-button 
                  :type="structureAnalysisType === 'comparison' ? 'primary' : ''"
                  @click="structureAnalysisType = 'comparison'; updateStructureChart()"
                >
                  对比分析
                </el-button>
              </el-button-group>
            </div>
          </div>
          <div class="chart-content">
            <BarChart 
              :data="structureChartData"
              :height="400"
              :show-legend="true"
              :horizontal="structureAnalysisType === 'comparison'"
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
          :data="personnelList" 
          :loading="tableLoading"
          stripe
          style="width: 100%"
        >
          <el-table-column prop="year" label="年份" width="80" />
          <el-table-column prop="hospitalName" label="医疗机构" min-width="200" />
          <el-table-column prop="hospitalLevel" label="医院等级" width="100" />
          <el-table-column prop="totalPersonnel" label="总人数" width="100" align="right">
            <template #default="{ row }">
              {{ row.totalPersonnel?.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="doctors" label="执业医师" width="100" align="right">
            <template #default="{ row }">
              {{ row.doctors?.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="nurses" label="注册护士" width="100" align="right">
            <template #default="{ row }">
              {{ row.nurses?.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="technicians" label="医技人员" width="100" align="right">
            <template #default="{ row }">
              {{ row.technicians?.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="management" label="管理人员" width="100" align="right">
            <template #default="{ row }">
              {{ row.management?.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="doctorNurseRatio" label="医护比" width="100" align="center">
            <template #default="{ row }">
              1:{{ row.doctorNurseRatio }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button link size="small" @click="showPersonnelDetail(row)">
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
  FirstAidKit,
  House,
  School,
  ArrowUp,
  ArrowDown,
  View
} from '@element-plus/icons-vue'
import { PieChart, BarChart, LineChart } from '@/components/charts'
import personnelApi from '@/api/personnel'
import OverviewCard from '@/components/OverviewCard.vue'

// 响应式数据
const loading = ref(false)
const tableLoading = ref(false)

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

// 概览数据 - 从API获取真实数据
const overviewData = reactive({
  totalPersonnel: 0,
  doctors: 0,
  nurses: 0,
  technicians: 0,
  doctorRatio: 0,
  nurseRatio: 0,
  technicianRatio: 0,
  personnelGrowth: 0
})

// 图表数据 - 从API获取真实数据
const categoryChartData = ref([])

const trendChartData = ref([])
const trendXAxisData = ref([])
const structureChartData = ref([])

// 表格数据
const personnelList = ref([])

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
      personnelList.value = response.data.rows || []
      pagination.total = response.data.pageInfo?.total || 0

      console.log(`加载了 ${personnelList.value.length} 条人员数据，总计 ${pagination.total} 条`)

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
        // API返回的字段名映射
        currentData.totalPersonnel += (row.total || row.healthPersonnel || 0)
        currentData.doctors += (row.licensedPhysician || 0)
        currentData.nurses += (row.nurse || 0)
        currentData.technicians += (row.pharmacist || 0)
      })

      console.log(`${currentYear}年汇总数据:`, currentData)
      console.log('原始API数据行:', rows)

      // 更新概览数据
      Object.assign(overviewData, currentData)

      // 计算比例
      if (overviewData.totalPersonnel > 0) {
        overviewData.doctorRatio = parseFloat(((overviewData.doctors / overviewData.totalPersonnel) * 100).toFixed(1))
        overviewData.nurseRatio = parseFloat(((overviewData.nurses / overviewData.totalPersonnel) * 100).toFixed(1))
        overviewData.technicianRatio = parseFloat(((overviewData.technicians / overviewData.totalPersonnel) * 100).toFixed(1))
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
    // 使用便捷方法获取最近几年的人员总数统计
    const yearCount = parseInt(trendPeriod.value)
    const response = await personnelApi.getRecentPersonnelTotalCount(yearCount)
    
    if ((response.code === 200 || response.status === 0) && response.data.aggregations?.year_histogram) {
      const histogramData = response.data.aggregations.year_histogram
      trendXAxisData.value = histogramData.map(item => item.key.toString())
      trendChartData.value = [
        {
          name: '总人数',
          data: histogramData.map(item => item.totalPersonnel || 0)
        },
        {
          name: '执业医师',
          data: histogramData.map(item => item.doctors || 0)
        },
        {
          name: '注册护士',
          data: histogramData.map(item => item.nurses || 0)
        }
      ]
    }
  } catch (error) {
    console.error('加载趋势数据失败:', error)
  }
}

// 加载结构分析数据
const loadStructureAnalysis = async () => {
  try {
    const response = await personnelApi.getPersonnelStructureAnalysis()
    
    if (response.code === 200 || response.status === 0) {
      updateStructureChartData(response.data)
    }
  } catch (error) {
    console.error('加载结构分析数据失败:', error)
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
  categoryChartData.value = [
    {
      name: '执业医师',
      value: overviewData.doctors,
      color: '#5470c6'
    },
    {
      name: '注册护士',
      value: overviewData.nurses,
      color: '#91cc75'
    },
    {
      name: '医技人员',
      value: overviewData.technicians,
      color: '#fac858'
    }
  ].filter(item => item.value > 0) // 只显示有数据的项目
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
            { name: '注册护士', value: data.nurseRatio || 0 },
            { name: '医技人员', value: data.technicianRatio || 0 },
            { name: '管理人员', value: data.managementRatio || 0 }
          ]
        }
      ]
      break
    case 'growth':
      structureChartData.value = [
        {
          name: '增长率(%)',
          data: [
            { name: '执业医师', value: data.doctorGrowth || 0 },
            { name: '注册护士', value: data.nurseGrowth || 0 },
            { name: '医技人员', value: data.technicianGrowth || 0 },
            { name: '管理人员', value: data.managementGrowth || 0 }
          ]
        }
      ]
      break
    case 'comparison':
      structureChartData.value = [
        {
          name: '三级医院',
          data: [
            { name: '执业医师', value: data.level3?.doctors || 0 },
            { name: '注册护士', value: data.level3?.nurses || 0 },
            { name: '医技人员', value: data.level3?.technicians || 0 }
          ]
        },
        {
          name: '二级医院',
          data: [
            { name: '执业医师', value: data.level2?.doctors || 0 },
            { name: '注册护士', value: data.level2?.nurses || 0 },
            { name: '医技人员', value: data.level2?.technicians || 0 }
          ]
        }
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
  loadData()
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

/* 概览卡片容器样式保留 */

/* 响应式设计 */
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
