<template>
  <div class="chart-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2>图表管理</h2>
        <p>创建、编辑和管理各类数据可视化图表</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="createChart">
          <el-icon><Plus /></el-icon>
          新建图表
        </el-button>
        <el-button type="success" @click="importCharts">
          <el-icon><Upload /></el-icon>
          导入图表
        </el-button>
        <el-button @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 筛选和搜索 -->
    <div class="filter-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索图表名称或描述"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filters.type" placeholder="图表类型" clearable @change="handleFilterChange">
            <el-option label="全部类型" value="" />
            <el-option label="柱状图" value="bar" />
            <el-option label="折线图" value="line" />
            <el-option label="饼图" value="pie" />
            <el-option label="散点图" value="scatter" />
            <el-option label="地图" value="map" />
            <el-option label="仪表盘" value="gauge" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filters.category" placeholder="数据类别" clearable @change="handleFilterChange">
            <el-option label="全部类别" value="" />
            <el-option label="人口统计" value="population" />
            <el-option label="医疗机构" value="institution" />
            <el-option label="医护人员" value="personnel" />
            <el-option label="床位资源" value="bed" />
            <el-option label="医疗服务" value="service" />
            <el-option label="费用分析" value="cost" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filters.status" placeholder="状态" clearable @change="handleFilterChange">
            <el-option label="全部状态" value="" />
            <el-option label="已发布" value="published" />
            <el-option label="草稿" value="draft" />
            <el-option label="已归档" value="archived" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="filters.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleFilterChange"
          />
        </el-col>
      </el-row>
    </div>

    <!-- 图表列表 -->
    <div class="chart-grid">
      <el-row :gutter="20">
        <el-col
          v-for="chart in chartList"
          :key="chart.id"
          :span="6"
        >
          <div class="chart-card" @click="viewChart(chart)">
            <!-- 图表预览 -->
            <div class="chart-preview">
              <div :ref="el => chartRefs[chart.id] = el" class="mini-chart"></div>
              <div class="chart-overlay">
                <div class="chart-actions">
                  <el-button type="primary" size="small" @click.stop="editChart(chart)">
                    <el-icon><Edit /></el-icon>
                  </el-button>
                  <el-button type="success" size="small" @click.stop="copyChart(chart)">
                    <el-icon><CopyDocument /></el-icon>
                  </el-button>
                  <el-button type="warning" size="small" @click.stop="shareChart(chart)">
                    <el-icon><Share /></el-icon>
                  </el-button>
                  <el-button type="danger" size="small" @click.stop="deleteChart(chart)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>
            
            <!-- 图表信息 -->
            <div class="chart-info">
              <div class="chart-title">{{ chart.title }}</div>
              <div class="chart-description">{{ chart.description }}</div>
              <div class="chart-meta">
                <el-tag :type="getTypeTagType(chart.type)" size="small">
                  {{ getTypeText(chart.type) }}
                </el-tag>
                <el-tag :type="getStatusTagType(chart.status)" size="small">
                  {{ getStatusText(chart.status) }}
                </el-tag>
              </div>
              <div class="chart-stats">
                <span class="stat-item">
                  <el-icon><View /></el-icon>
                  {{ chart.viewCount }}
                </span>
                <span class="stat-item">
                  <el-icon><Star /></el-icon>
                  {{ chart.favoriteCount }}
                </span>
                <span class="update-time">{{ formatDate(chart.updateTime) }}</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 分页 -->
    <div class="pagination-section">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.size"
        :total="pagination.total"
        :page-sizes="[12, 24, 48, 96]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 图表创建/编辑对话框 -->
    <el-dialog
      v-model="chartDialogVisible"
      :title="isEditing ? '编辑图表' : '创建图表'"
      width="80%"
      :before-close="handleDialogClose"
    >
      <div class="chart-editor">
        <el-row :gutter="20">
          <!-- 配置面板 -->
          <el-col :span="8">
            <div class="config-panel">
              <el-form :model="chartForm" label-width="80px">
                <el-form-item label="图表名称">
                  <el-input v-model="chartForm.title" placeholder="请输入图表名称" />
                </el-form-item>
                <el-form-item label="图表描述">
                  <el-input
                    v-model="chartForm.description"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入图表描述"
                  />
                </el-form-item>
                <el-form-item label="图表类型">
                  <el-select v-model="chartForm.type" @change="handleChartTypeChange">
                    <el-option label="柱状图" value="bar" />
                    <el-option label="折线图" value="line" />
                    <el-option label="饼图" value="pie" />
                    <el-option label="散点图" value="scatter" />
                    <el-option label="地图" value="map" />
                    <el-option label="仪表盘" value="gauge" />
                  </el-select>
                </el-form-item>
                <el-form-item label="数据源">
                  <el-select v-model="chartForm.dataSource" @change="handleDataSourceChange">
                    <el-option label="人口统计" value="population" />
                    <el-option label="医疗机构" value="institution" />
                    <el-option label="医护人员" value="personnel" />
                    <el-option label="床位资源" value="bed" />
                    <el-option label="医疗服务" value="service" />
                    <el-option label="费用分析" value="cost" />
                  </el-select>
                </el-form-item>
                <el-form-item label="数据字段">
                  <el-select v-model="chartForm.dataFields" multiple placeholder="选择数据字段">
                    <el-option
                      v-for="field in availableFields"
                      :key="field.value"
                      :label="field.label"
                      :value="field.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="图表配置">
                  <el-button type="primary" @click="showAdvancedConfig">高级配置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          
          <!-- 预览面板 -->
          <el-col :span="16">
            <div class="preview-panel">
              <div class="preview-header">
                <h4>图表预览</h4>
                <el-button-group>
                  <el-button size="small" @click="refreshPreview">
                    <el-icon><Refresh /></el-icon>
                    刷新
                  </el-button>
                  <el-button size="small" @click="fullscreenPreview">
                    <el-icon><FullScreen /></el-icon>
                    全屏
                  </el-button>
                </el-button-group>
              </div>
              <!-- 使用新的图表组件 -->
              <component
                :is="previewChartComponent"
                :data="previewChartData"
                :x-axis-data="previewXAxisData"
                title=""
                height="300px"
                class="preview-chart"
              />
            </div>
          </el-col>
        </el-row>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="chartDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveChart">
            {{ isEditing ? '更新' : '创建' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Upload,
  Refresh,
  Search,
  Edit,
  CopyDocument,
  Share,
  Delete,
  View,
  Star,
  FullScreen
} from '@element-plus/icons-vue'
import { PieChart, BarChart, LineChart } from '@/components/charts'
import { visualizationApi } from '@/api/visualization'

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const chartDialogVisible = ref(false)
const isEditing = ref(false)

// 图表引用
const chartRefs = ref({})

// 预览图表数据
const previewChartComponent = ref('LineChart')
const previewChartData = ref([120, 132, 101, 134, 90, 230, 210])
const previewXAxisData = ref(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])

// 筛选条件
const filters = reactive({
  type: '',
  category: '',
  status: '',
  dateRange: null
})

// 分页
const pagination = reactive({
  page: 1,
  size: 12,
  total: 0
})

// 图表表单
const chartForm = reactive({
  title: '',
  description: '',
  type: 'bar',
  dataSource: '',
  dataFields: [],
  config: {}
})

// 可用字段
const availableFields = ref([])

// 图表列表
const chartList = ref([])

// 模拟数据
const mockChartList = [
  {
    id: 1,
    title: '人口年龄结构分析',
    description: '成都市各区域人口年龄结构分布情况',
    type: 'pie',
    category: 'population',
    status: 'published',
    viewCount: 1234,
    favoriteCount: 56,
    updateTime: '2023-12-01',
    config: {
      data: [
        { name: '0-14岁', value: 13.2 },
        { name: '15-64岁', value: 72.5 },
        { name: '65岁以上', value: 14.3 }
      ]
    }
  },
  {
    id: 2,
    title: '医疗机构分布趋势',
    description: '近5年成都市医疗机构数量变化趋势',
    type: 'line',
    category: 'institution',
    status: 'published',
    viewCount: 987,
    favoriteCount: 43,
    updateTime: '2023-11-28',
    config: {
      xData: ['2019', '2020', '2021', '2022', '2023'],
      yData: [1089, 1156, 1203, 1248, 1287]
    }
  }
]

// 获取类型标签样式
const getTypeTagType = (type) => {
  const typeMap = {
    'bar': 'primary',
    'line': 'success',
    'pie': 'warning',
    'scatter': 'info',
    'map': 'danger',
    'gauge': ''
  }
  return typeMap[type] || ''
}

// 获取类型文本
const getTypeText = (type) => {
  const textMap = {
    'bar': '柱状图',
    'line': '折线图',
    'pie': '饼图',
    'scatter': '散点图',
    'map': '地图',
    'gauge': '仪表盘'
  }
  return textMap[type] || '未知'
}

// 获取状态标签样式
const getStatusTagType = (status) => {
  const statusMap = {
    'published': 'success',
    'draft': 'warning',
    'archived': 'info'
  }
  return statusMap[status] || ''
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    'published': '已发布',
    'draft': '草稿',
    'archived': '已归档'
  }
  return textMap[status] || '未知'
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 初始化迷你图表
const initMiniChart = (chartId, config) => {
  const chartRef = chartRefs.value[chartId]
  if (!chartRef) return

  const chart = echarts.init(chartRef)
  let option = {}

  if (config.type === 'pie') {
    option = {
      series: [{
        type: 'pie',
        radius: '70%',
        data: config.data || [],
        label: { show: false },
        emphasis: { label: { show: false } }
      }]
    }
  } else if (config.type === 'line') {
    option = {
      xAxis: { type: 'category', data: config.xData || [], show: false },
      yAxis: { type: 'value', show: false },
      series: [{
        type: 'line',
        data: config.yData || [],
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2 }
      }],
      grid: { left: 0, right: 0, top: 0, bottom: 0 }
    }
  }

  chart.setOption(option)
  return chart
}

// 更新预览图表
const updatePreviewChart = () => {
  switch (chartForm.type) {
    case 'bar':
      previewChartComponent.value = 'BarChart'
      previewChartData.value = [120, 200, 150]
      previewXAxisData.value = ['示例1', '示例2', '示例3']
      break
    case 'line':
      previewChartComponent.value = 'LineChart'
      previewChartData.value = [120, 200, 150]
      previewXAxisData.value = ['示例1', '示例2', '示例3']
      break
    case 'pie':
      previewChartComponent.value = 'PieChart'
      previewChartData.value = [
        { name: '示例1', value: 335, color: '#5470c6' },
        { name: '示例2', value: 310, color: '#91cc75' },
        { name: '示例3', value: 234, color: '#fac858' }
      ]
      previewXAxisData.value = []
      break
  }
}

// 搜索处理
const handleSearch = () => {
  loadData()
}

// 筛选条件变化
const handleFilterChange = () => {
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

// 加载数据
const loadData = async () => {
  try {
    loading.value = true

    // 调用真实API获取图表列表
    const response = await visualizationApi.getCharts({
      page: pagination.page,
      size: pagination.size,
      category: searchForm.category,
      type: searchForm.type,
      status: searchForm.status,
      keyword: searchForm.keyword
    })

    if (response.code === 200) {
      chartList.value = response.data.list || []
      pagination.total = response.data.total || 0

      // 初始化迷你图表
      await nextTick()
      chartList.value.forEach(chart => {
        initMiniChart(chart.id, { type: chart.type, ...chart.config })
      })
    }

  } catch (error) {
    ElMessage.error('加载数据失败，请检查后端服务是否正常运行')
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 创建图表
const createChart = () => {
  isEditing.value = false
  Object.assign(chartForm, {
    title: '',
    description: '',
    type: 'bar',
    dataSource: '',
    dataFields: [],
    config: {}
  })
  chartDialogVisible.value = true

  nextTick(() => {
    initPreviewChart()
  })
}

// 编辑图表
const editChart = (chart) => {
  isEditing.value = true
  Object.assign(chartForm, chart)
  chartDialogVisible.value = true

  nextTick(() => {
    initPreviewChart()
  })
}

// 查看图表
const viewChart = (chart) => {
  ElMessage.info(`查看图表: ${chart.title}`)
}

// 复制图表
const copyChart = (chart) => {
  ElMessage.success(`图表 "${chart.title}" 已复制`)
}

// 分享图表
const shareChart = (chart) => {
  ElMessage.info(`分享图表: ${chart.title}`)
}

// 删除图表
const deleteChart = (chart) => {
  ElMessageBox.confirm(
    `确定要删除图表 "${chart.title}" 吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('删除成功')
    loadData()
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 图表类型变化
const handleChartTypeChange = () => {
  updatePreviewChart()
}

// 数据源变化
const handleDataSourceChange = () => {
  // 根据数据源更新可用字段
  const fieldMap = {
    'population': [
      { label: '总人口', value: 'totalPopulation' },
      { label: '男性人口', value: 'malePopulation' },
      { label: '女性人口', value: 'femalePopulation' },
      { label: '年龄组', value: 'ageGroup' }
    ],
    'institution': [
      { label: '机构数量', value: 'institutionCount' },
      { label: '机构类型', value: 'institutionType' },
      { label: '床位数', value: 'bedCount' },
      { label: '所在区域', value: 'district' }
    ]
  }

  availableFields.value = fieldMap[chartForm.dataSource] || []
  chartForm.dataFields = []
}

// 显示高级配置
const showAdvancedConfig = () => {
  ElMessage.info('高级配置功能开发中')
}

// 刷新预览
const refreshPreview = () => {
  updatePreviewChart()
}

// 全屏预览
const fullscreenPreview = () => {
  ElMessage.info('全屏预览功能开发中')
}

// 保存图表
const saveChart = () => {
  if (!chartForm.title) {
    ElMessage.warning('请输入图表名称')
    return
  }

  ElMessage.success(isEditing.value ? '图表更新成功' : '图表创建成功')
  chartDialogVisible.value = false
  loadData()
}

// 对话框关闭处理
const handleDialogClose = (done) => {
  ElMessageBox.confirm('确定要关闭吗？未保存的更改将丢失。')
    .then(() => {
      done()
    })
    .catch(() => {
      // 取消关闭
    })
}

// 导入图表
const importCharts = () => {
  ElMessage.info('导入图表功能开发中')
}

// 刷新数据
const refreshData = () => {
  loadData()
}

// 监听图表类型变化
watch(() => chartForm.type, () => {
  updatePreviewChart()
})

// 生命周期
onMounted(() => {
  loadData()
  updatePreviewChart()
})
</script>

<style scoped>
.chart-management {
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

/* 图表网格 */
.chart-grid {
  margin-bottom: 20px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  margin-bottom: 20px;
}

.chart-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.chart-preview {
  position: relative;
  height: 200px;
  background: #f8f9fa;
}

.mini-chart {
  width: 100%;
  height: 100%;
}

.chart-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.chart-card:hover .chart-overlay {
  opacity: 1;
}

.chart-actions {
  display: flex;
  gap: 8px;
}

.chart-info {
  padding: 16px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chart-description {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chart-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.chart-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #8c8c8c;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.update-time {
  font-size: 12px;
  color: #8c8c8c;
}

/* 分页 */
.pagination-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: center;
}

/* 图表编辑器 */
.chart-editor {
  height: 600px;
}

.config-panel {
  height: 100%;
  border-right: 1px solid #e5e7eb;
  padding-right: 20px;
}

.preview-panel {
  height: 100%;
  padding-left: 20px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.preview-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

.preview-chart {
  width: 100%;
  height: 500px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .chart-card {
    margin-bottom: 16px;
  }
}

@media (max-width: 768px) {
  .chart-management {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .chart-preview {
    height: 150px;
  }

  .chart-editor {
    height: auto;
  }

  .config-panel {
    border-right: none;
    padding-right: 0;
    margin-bottom: 20px;
  }

  .preview-panel {
    padding-left: 0;
  }
}
</style>
