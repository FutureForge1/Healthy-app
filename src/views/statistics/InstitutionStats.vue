<template>
  <div class="institution-stats">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2>医疗机构统计</h2>
        <p>成都市医疗机构分布、类型、规模等统计分析</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="exportData">
          <el-icon><Download /></el-icon>
          导出报告
        </el-button>
        <el-button type="success" @click="showComparison">
          <el-icon><DataAnalysis /></el-icon>
          对比分析
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
        <el-col :span="4">
          <el-select v-model="filters.district" placeholder="选择区域" clearable @change="handleFilterChange">
            <el-option label="全市" value="" />
            <el-option label="锦江区" value="jinjiang" />
            <el-option label="青羊区" value="qingyang" />
            <el-option label="金牛区" value="jinniu" />
            <el-option label="武侯区" value="wuhou" />
            <el-option label="成华区" value="chenghua" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filters.type" placeholder="机构类型" clearable @change="handleFilterChange">
            <el-option label="全部类型" value="" />
            <el-option label="三级医院" value="tertiary" />
            <el-option label="二级医院" value="secondary" />
            <el-option label="一级医院" value="primary" />
            <el-option label="社区卫生服务中心" value="community" />
            <el-option label="诊所" value="clinic" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filters.ownership" placeholder="所有制性质" clearable @change="handleFilterChange">
            <el-option label="全部性质" value="" />
            <el-option label="公立" value="public" />
            <el-option label="民营" value="private" />
            <el-option label="中外合资" value="joint" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filters.scale" placeholder="机构规模" clearable @change="handleFilterChange">
            <el-option label="全部规模" value="" />
            <el-option label="大型(>500床)" value="large" />
            <el-option label="中型(100-500床)" value="medium" />
            <el-option label="小型(<100床)" value="small" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
        </el-col>
        <el-col :span="4">
          <el-button @click="resetFilters">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 统计概览 -->
    <div class="overview-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="overview-card total">
            <div class="card-icon">
              <el-icon><OfficeBuilding /></el-icon>
            </div>
            <div class="card-content">
              <div class="card-value">{{ overviewData.totalInstitutions }}</div>
              <div class="card-label">医疗机构总数</div>
              <div class="card-change positive">
                <el-icon><ArrowUp /></el-icon>
                +{{ overviewData.institutionGrowth }}%
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="overview-card hospitals">
            <div class="card-icon">
              <el-icon><House /></el-icon>
            </div>
            <div class="card-content">
              <div class="card-value">{{ overviewData.hospitals }}</div>
              <div class="card-label">医院数量</div>
              <div class="card-ratio">占比 {{ overviewData.hospitalRatio }}%</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="overview-card community">
            <div class="card-icon">
              <el-icon><School /></el-icon>
            </div>
            <div class="card-content">
              <div class="card-value">{{ overviewData.communityHealthCenters }}</div>
              <div class="card-label">社区卫生服务中心</div>
              <div class="card-ratio">占比 {{ overviewData.communityRatio }}%</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="overview-card clinics">
            <div class="card-icon">
              <el-icon><FirstAidKit /></el-icon>
            </div>
            <div class="card-content">
              <div class="card-value">{{ overviewData.clinics }}</div>
              <div class="card-label">诊所数量</div>
              <div class="card-ratio">占比 {{ overviewData.clinicRatio }}%</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 图表分析 -->
    <div class="charts-section">
      <el-row :gutter="20">
        <!-- 机构类型分布 -->
        <el-col :span="8">
          <div class="chart-card">
            <div class="chart-header">
              <h4>机构类型分布</h4>
            </div>
            <div ref="typeChartRef" class="chart"></div>
          </div>
        </el-col>
        
        <!-- 所有制性质分布 -->
        <el-col :span="8">
          <div class="chart-card">
            <div class="chart-header">
              <h4>所有制性质分布</h4>
            </div>
            <div ref="ownershipChartRef" class="chart"></div>
          </div>
        </el-col>
        
        <!-- 规模分布 -->
        <el-col :span="8">
          <div class="chart-card">
            <div class="chart-header">
              <h4>机构规模分布</h4>
            </div>
            <!-- 使用新的饼图组件 -->
            <PieChart
              :data="scaleChartData"
              title=""
              height="300px"
              :radius="'70%'"
              :show-percentage="true"
              class="chart"
            />
          </div>
        </el-col>
      </el-row>

      <!-- 区域分布地图 -->
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="16">
          <div class="chart-card">
            <div class="chart-header">
              <h4>区域分布热力图</h4>
              <el-radio-group v-model="mapType" @change="updateMapChart">
                <el-radio-button value="density">密度分布</el-radio-button>
                <el-radio-button value="count">数量分布</el-radio-button>
              </el-radio-group>
            </div>
            <div ref="mapChartRef" class="chart map-chart"></div>
          </div>
        </el-col>
        
        <!-- 发展趋势 -->
        <el-col :span="8">
          <div class="chart-card">
            <div class="chart-header">
              <h4>发展趋势</h4>
            </div>
            <div ref="trendChartRef" class="chart"></div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 详细数据表格 -->
    <div class="table-section">
      <div class="table-header">
        <h4>医疗机构详细信息</h4>
        <div class="table-actions">
          <el-button type="primary" size="small" @click="addInstitution">
            <el-icon><Plus /></el-icon>
            新增机构
          </el-button>
          <el-button type="success" size="small" @click="batchImport">
            <el-icon><Upload /></el-icon>
            批量导入
          </el-button>
        </div>
      </div>
      
      <el-table
        v-loading="tableLoading"
        :data="institutionList"
        stripe
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="机构名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="type" label="机构类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.type)">{{ getTypeText(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ownership" label="所有制" width="100">
          <template #default="{ row }">
            <el-tag :type="getOwnershipTagType(row.ownership)">{{ getOwnershipText(row.ownership) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="district" label="所在区域" width="120" />
        <el-table-column prop="beds" label="床位数" width="100" />
        <el-table-column prop="staff" label="职工数" width="100" />
        <el-table-column prop="establishDate" label="成立时间" width="120">
          <template #default="{ row }">
            {{ formatDate(row.establishDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="level" label="等级" width="100">
          <template #default="{ row }">
            <el-rate v-model="row.level" disabled show-score text-color="#ff9900" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="viewDetail(row)">
              详情
            </el-button>
            <el-button type="warning" size="small" @click="editInstitution(row)">
              编辑
            </el-button>
            <el-dropdown @command="handleCommand($event, row)">
              <el-button size="small">
                更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="statistics">统计分析</el-dropdown-item>
                  <el-dropdown-item command="report">生成报告</el-dropdown-item>
                  <el-dropdown-item command="export">导出数据</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-section">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
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
  OfficeBuilding,
  House,
  School,
  FirstAidKit,
  ArrowUp,
  Plus,
  Upload,
  ArrowDown
} from '@element-plus/icons-vue'
import { PieChart, BarChart, LineChart } from '@/components/charts'
import { statisticsApi } from '@/api/statistics'

// 响应式数据
const loading = ref(false)
const tableLoading = ref(false)

// 图表引用（保留其他图表的引用）
const typeChartRef = ref(null)
const ownershipChartRef = ref(null)
const mapChartRef = ref(null)
const trendChartRef = ref(null)

// 图表实例（保留其他图表的实例）
let typeChart = null
let ownershipChart = null
let mapChart = null
let trendChart = null

// 机构规模图表数据
const scaleChartData = ref([
  { name: '大型', value: 45, color: '#5470c6' },
  { name: '中型', value: 128, color: '#91cc75' },
  { name: '小型', value: 267, color: '#fac858' }
])

// 筛选条件
const filters = reactive({
  district: '',
  type: '',
  ownership: '',
  scale: ''
})

// 地图类型
const mapType = ref('density')

// 分页
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 概览数据
const overviewData = reactive({
  totalInstitutions: 1248,
  hospitals: 186,
  communityHealthCenters: 342,
  clinics: 720,
  hospitalRatio: 14.9,
  communityRatio: 27.4,
  clinicRatio: 57.7,
  institutionGrowth: 3.2
})

// 机构列表
const institutionList = ref([])
const selectedInstitutions = ref([])

// 模拟数据
const mockInstitutionList = [
  {
    id: 1,
    name: '四川大学华西医院',
    type: 'tertiary',
    ownership: 'public',
    district: '武侯区',
    beds: 4300,
    staff: 8500,
    establishDate: '1892-01-01',
    level: 5
  },
  {
    id: 2,
    name: '成都市第一人民医院',
    type: 'tertiary',
    ownership: 'public',
    district: '青羊区',
    beds: 1200,
    staff: 2800,
    establishDate: '1942-05-15',
    level: 4
  }
]

// 获取类型标签样式
const getTypeTagType = (type) => {
  const typeMap = {
    'tertiary': 'danger',
    'secondary': 'warning',
    'primary': 'success',
    'community': 'info',
    'clinic': ''
  }
  return typeMap[type] || ''
}

// 获取类型文本
const getTypeText = (type) => {
  const textMap = {
    'tertiary': '三级医院',
    'secondary': '二级医院',
    'primary': '一级医院',
    'community': '社区卫生服务中心',
    'clinic': '诊所'
  }
  return textMap[type] || '未知'
}

// 获取所有制标签样式
const getOwnershipTagType = (ownership) => {
  const ownershipMap = {
    'public': 'success',
    'private': 'warning',
    'joint': 'info'
  }
  return ownershipMap[ownership] || ''
}

// 获取所有制文本
const getOwnershipText = (ownership) => {
  const textMap = {
    'public': '公立',
    'private': '民营',
    'joint': '中外合资'
  }
  return textMap[ownership] || '未知'
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 初始化机构类型图表
const initTypeChart = () => {
  if (!typeChartRef.value) return

  typeChart = echarts.init(typeChartRef.value)

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [{
      name: '机构类型',
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
          fontSize: '16',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 186, name: '医院', itemStyle: { color: '#5470c6' } },
        { value: 342, name: '社区卫生服务中心', itemStyle: { color: '#91cc75' } },
        { value: 720, name: '诊所', itemStyle: { color: '#fac858' } }
      ]
    }]
  }

  typeChart.setOption(option)
}

// 初始化所有制图表
const initOwnershipChart = () => {
  if (!ownershipChartRef.value) return

  ownershipChart = echarts.init(ownershipChartRef.value)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: ['公立', '民营', '中外合资']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: '机构数量',
      type: 'bar',
      data: [
        { value: 756, itemStyle: { color: '#5470c6' } },
        { value: 432, itemStyle: { color: '#91cc75' } },
        { value: 60, itemStyle: { color: '#fac858' } }
      ],
      barWidth: '60%'
    }]
  }

  ownershipChart.setOption(option)
}

// 更新规模图表数据（现在只需要更新响应式数据）
const updateScaleChart = () => {
  // 数据已经在 scaleChartData 中定义，组件会自动响应变化
}

// 初始化地图图表
const initMapChart = () => {
  if (!mapChartRef.value) return

  mapChart = echarts.init(mapChartRef.value)
  updateMapChart()
}

// 更新地图图表
const updateMapChart = () => {
  if (!mapChart) return

  // 这里应该使用真实的成都地图数据
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br/>{c} 个机构'
    },
    visualMap: {
      min: 0,
      max: 200,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'],
      calculable: true,
      inRange: {
        color: ['#e0f3ff', '#006edd']
      }
    },
    series: [{
      name: '医疗机构分布',
      type: 'map',
      map: 'chengdu',
      roam: false,
      data: [
        { name: '锦江区', value: 156 },
        { name: '青羊区', value: 142 },
        { name: '金牛区', value: 138 },
        { name: '武侯区', value: 165 },
        { name: '成华区', value: 134 }
      ]
    }]
  }

  mapChart.setOption(option)
}

// 初始化趋势图表
const initTrendChart = () => {
  if (!trendChartRef.value) return

  trendChart = echarts.init(trendChartRef.value)

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['2019', '2020', '2021', '2022', '2023']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: '机构数量',
      type: 'line',
      data: [1089, 1156, 1203, 1248, 1287],
      smooth: true,
      itemStyle: { color: '#5470c6' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(84, 112, 198, 0.3)' },
          { offset: 1, color: 'rgba(84, 112, 198, 0.1)' }
        ])
      }
    }]
  }

  trendChart.setOption(option)
}

// 筛选条件变化
const handleFilterChange = () => {
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
    type: '',
    ownership: '',
    scale: ''
  })
  loadData()
}

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    tableLoading.value = true

    // 调用真实API获取数据
    const response = await statisticsApi.getInstitutionStats({
      ...filters,
      page: pagination.page,
      size: pagination.size
    })

    if (response.code === 200) {
      institutionList.value = response.data.list || []
      pagination.total = response.data.total || 0
    }

  } catch (error) {
    ElMessage.error('加载数据失败，请检查后端服务是否正常运行')
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
    tableLoading.value = false
  }
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

// 选择处理
const handleSelectionChange = (selection) => {
  selectedInstitutions.value = selection
}

// 导出数据
const exportData = () => {
  ElMessage.success('导出功能开发中')
}

// 显示对比分析
const showComparison = () => {
  ElMessage.info('对比分析功能开发中')
}

// 刷新数据
const refreshData = () => {
  loadData()
}

// 新增机构
const addInstitution = () => {
  ElMessage.info('新增机构功能开发中')
}

// 批量导入
const batchImport = () => {
  ElMessage.info('批量导入功能开发中')
}

// 查看详情
const viewDetail = (row) => {
  ElMessage.info(`查看${row.name}详情功能开发中`)
}

// 编辑机构
const editInstitution = (row) => {
  ElMessage.info(`编辑${row.name}功能开发中`)
}

// 处理下拉菜单命令
const handleCommand = (command, row) => {
  switch (command) {
    case 'statistics':
      ElMessage.info(`${row.name}统计分析功能开发中`)
      break
    case 'report':
      ElMessage.info(`生成${row.name}报告功能开发中`)
      break
    case 'export':
      ElMessage.info(`导出${row.name}数据功能开发中`)
      break
  }
}

// 生命周期
onMounted(async () => {
  await nextTick()
  initTypeChart()
  initOwnershipChart()
  updateScaleChart()
  initMapChart()
  initTrendChart()
  loadData()
})
</script>

<style scoped>
.institution-stats {
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

/* 概览区域 */
.overview-section {
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
  transition: all 0.3s ease;
  cursor: pointer;
}

.overview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.total .card-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.hospitals .card-icon { background: linear-gradient(135deg, #5470c6 0%, #91cc75 100%); }
.community .card-icon { background: linear-gradient(135deg, #73d13d 0%, #36cfc9 100%); }
.clinics .card-icon { background: linear-gradient(135deg, #fac858 0%, #ee6666 100%); }

.card-content {
  flex: 1;
}

.card-value {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}

.card-label {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 4px;
}

.card-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.card-change.positive { color: #52c41a; }
.card-change.negative { color: #ff4d4f; }

.card-ratio {
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

.map-chart {
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

.table-actions {
  display: flex;
  gap: 8px;
}

.pagination-section {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .institution-stats {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .overview-card {
    flex-direction: column;
    text-align: center;
  }

  .chart {
    height: 250px;
  }

  .map-chart {
    height: 300px;
  }
}
</style>
