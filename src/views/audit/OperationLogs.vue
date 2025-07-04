<template>
  <div class="operation-logs">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2>操作日志</h2>
        <p>记录系统中所有用户操作行为，支持详细查询和审计分析</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="exportLogs">
          <el-icon><Download /></el-icon>
          导出日志
        </el-button>
        <el-button type="warning" @click="showAnalysisDialog">
          <el-icon><TrendCharts /></el-icon>
          行为分析
        </el-button>
        <el-button @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="overview-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card total">
            <div class="stat-icon">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ formatNumber(overviewData.totalLogs) }}</div>
              <div class="stat-label">总日志数</div>
              <div class="stat-change positive">
                <el-icon><ArrowUp /></el-icon>
                今日新增 {{ overviewData.todayLogs }}
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card users">
            <div class="stat-icon">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ overviewData.activeUsers }}</div>
              <div class="stat-label">活跃用户数</div>
              <div class="stat-trend">在线用户 {{ overviewData.onlineUsers }} 人</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card operations">
            <div class="stat-icon">
              <el-icon><Operation /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ overviewData.operationTypes }}</div>
              <div class="stat-label">操作类型数</div>
              <div class="stat-trend">高频操作 {{ overviewData.topOperation }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card security">
            <div class="stat-icon">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ overviewData.securityEvents }}</div>
              <div class="stat-label">安全事件</div>
              <div class="stat-trend">风险等级 {{ overviewData.riskLevel }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 筛选条件 -->
    <div class="filter-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索用户名、操作内容或IP地址"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filters.operationType" placeholder="操作类型" clearable @change="handleFilterChange">
            <el-option label="全部类型" value="" />
            <el-option label="登录" value="login" />
            <el-option label="登出" value="logout" />
            <el-option label="查询" value="query" />
            <el-option label="新增" value="create" />
            <el-option label="修改" value="update" />
            <el-option label="删除" value="delete" />
            <el-option label="导入" value="import" />
            <el-option label="导出" value="export" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filters.module" placeholder="功能模块" clearable @change="handleFilterChange">
            <el-option label="全部模块" value="" />
            <el-option label="用户管理" value="user" />
            <el-option label="角色管理" value="role" />
            <el-option label="数据统计" value="statistics" />
            <el-option label="数据可视化" value="visualization" />
            <el-option label="数据管理" value="data" />
            <el-option label="系统设置" value="system" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filters.result" placeholder="操作结果" clearable @change="handleFilterChange">
            <el-option label="全部结果" value="" />
            <el-option label="成功" value="success" />
            <el-option label="失败" value="failed" />
            <el-option label="异常" value="error" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="filters.dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="handleFilterChange"
          />
        </el-col>
      </el-row>
    </div>

    <!-- 日志列表 -->
    <div class="logs-section">
      <div class="section-header">
        <h4>操作日志列表</h4>
        <div class="header-actions">
          <el-button type="danger" size="small" :disabled="selectedLogs.length === 0" @click="batchDelete">
            <el-icon><Delete /></el-icon>
            批量删除
          </el-button>
          <el-button type="info" size="small" @click="showLogChart">
            <el-icon><DataAnalysis /></el-icon>
            统计图表
          </el-button>
        </div>
      </div>

      <el-table
        v-loading="tableLoading"
        :data="logsList"
        stripe
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="operationTime" label="操作时间" width="160" sortable>
          <template #default="{ row }">
            {{ formatDateTime(row.operationTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="120" show-overflow-tooltip />
        <el-table-column prop="realName" label="真实姓名" width="120" show-overflow-tooltip />
        <el-table-column prop="operationType" label="操作类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getOperationTypeTag(row.operationType)">
              {{ getOperationTypeText(row.operationType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="module" label="功能模块" width="120">
          <template #default="{ row }">
            {{ getModuleText(row.module) }}
          </template>
        </el-table-column>
        <el-table-column prop="operationContent" label="操作内容" min-width="200" show-overflow-tooltip />
        <el-table-column prop="ipAddress" label="IP地址" width="140" />
        <el-table-column prop="userAgent" label="浏览器" width="120" show-overflow-tooltip>
          <template #default="{ row }">
            {{ getBrowserInfo(row.userAgent) }}
          </template>
        </el-table-column>
        <el-table-column prop="result" label="操作结果" width="100">
          <template #default="{ row }">
            <el-tag :type="getResultTag(row.result)">
              {{ getResultText(row.result) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="耗时(ms)" width="100" sortable>
          <template #default="{ row }">
            <span :class="getDurationClass(row.duration)">
              {{ row.duration }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="viewLogDetail(row)">
              详情
            </el-button>
            <el-button type="danger" size="small" @click="deleteLog(row)">
              删除
            </el-button>
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

    <!-- 日志详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="操作日志详情"
      width="800px"
    >
      <div v-if="currentLog" class="log-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="操作时间">
            {{ formatDateTime(currentLog.operationTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="用户信息">
            {{ currentLog.realName }} ({{ currentLog.username }})
          </el-descriptions-item>
          <el-descriptions-item label="操作类型">
            <el-tag :type="getOperationTypeTag(currentLog.operationType)">
              {{ getOperationTypeText(currentLog.operationType) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="功能模块">
            {{ getModuleText(currentLog.module) }}
          </el-descriptions-item>
          <el-descriptions-item label="操作内容" :span="2">
            {{ currentLog.operationContent }}
          </el-descriptions-item>
          <el-descriptions-item label="请求URL" :span="2">
            {{ currentLog.requestUrl }}
          </el-descriptions-item>
          <el-descriptions-item label="请求方法">
            <el-tag size="small">{{ currentLog.requestMethod }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="操作结果">
            <el-tag :type="getResultTag(currentLog.result)">
              {{ getResultText(currentLog.result) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="IP地址">
            {{ currentLog.ipAddress }}
          </el-descriptions-item>
          <el-descriptions-item label="地理位置">
            {{ currentLog.location || '未知' }}
          </el-descriptions-item>
          <el-descriptions-item label="浏览器信息" :span="2">
            {{ currentLog.userAgent }}
          </el-descriptions-item>
          <el-descriptions-item label="耗时">
            <span :class="getDurationClass(currentLog.duration)">
              {{ currentLog.duration }}ms
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="响应状态">
            <el-tag :type="currentLog.responseStatus >= 400 ? 'danger' : 'success'">
              {{ currentLog.responseStatus }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <div v-if="currentLog.requestParams" class="detail-section">
          <h5>请求参数</h5>
          <el-input
            v-model="currentLog.requestParams"
            type="textarea"
            :rows="4"
            readonly
          />
        </div>

        <div v-if="currentLog.responseData" class="detail-section">
          <h5>响应数据</h5>
          <el-input
            v-model="currentLog.responseData"
            type="textarea"
            :rows="4"
            readonly
          />
        </div>

        <div v-if="currentLog.errorMessage" class="detail-section">
          <h5>错误信息</h5>
          <el-alert
            :title="currentLog.errorMessage"
            type="error"
            :closable="false"
            show-icon
          />
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="exportSingleLog">导出此日志</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 行为分析对话框 -->
    <el-dialog
      v-model="analysisDialogVisible"
      title="用户行为分析"
      width="1000px"
    >
      <div class="analysis-content">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="chart-container">
              <h5>操作类型分布</h5>
              <div ref="operationTypeChart" class="chart"></div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="chart-container">
              <h5>操作时间分布</h5>
              <div ref="operationTimeChart" class="chart"></div>
            </div>
          </el-col>
        </el-row>
        
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="12">
            <div class="chart-container">
              <h5>用户活跃度</h5>
              <div ref="userActivityChart" class="chart"></div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="chart-container">
              <h5>模块使用情况</h5>
              <div ref="moduleUsageChart" class="chart"></div>
            </div>
          </el-col>
        </el-row>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="analysisDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="exportAnalysisReport">导出分析报告</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'
import {
  Download,
  TrendCharts,
  Refresh,
  Document,
  User,
  Operation,
  Warning,
  Search,
  Delete,
  DataAnalysis,
  ArrowUp
} from '@element-plus/icons-vue'
import { visualizationApi } from '@/api/visualization'
import { auditApi } from '@/api/audit'

// 响应式数据
const tableLoading = ref(false)
const searchKeyword = ref('')
const detailDialogVisible = ref(false)
const analysisDialogVisible = ref(false)
const currentLog = ref(null)

// 图表引用
const operationTypeChart = ref(null)
const operationTimeChart = ref(null)
const userActivityChart = ref(null)
const moduleUsageChart = ref(null)

// 筛选条件
const filters = reactive({
  operationType: '',
  module: '',
  result: '',
  dateRange: null
})

// 分页
const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
})

// 概览数据
const overviewData = reactive({
  totalLogs: 1547892,
  todayLogs: 2847,
  activeUsers: 156,
  onlineUsers: 23,
  operationTypes: 15,
  topOperation: '数据查询',
  securityEvents: 3,
  riskLevel: '低'
})

// 日志列表
const logsList = ref([])
const selectedLogs = ref([])

// 模拟日志数据
const mockLogsList = [
  {
    id: 1,
    operationTime: '2023-12-01 14:30:25',
    username: 'zhangsan',
    realName: '张三',
    operationType: 'query',
    module: 'statistics',
    operationContent: '查询人口统计数据',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    result: 'success',
    duration: 245,
    requestUrl: '/api/statistics/population',
    requestMethod: 'GET',
    responseStatus: 200,
    location: '四川省成都市',
    requestParams: '{"district":"锦江区","year":"2023"}',
    responseData: '{"code":0,"message":"success","data":[...]}',
    errorMessage: null
  },
  {
    id: 2,
    operationTime: '2023-12-01 14:28:15',
    username: 'lisi',
    realName: '李四',
    operationType: 'create',
    module: 'user',
    operationContent: '新增用户账号',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    result: 'success',
    duration: 1250,
    requestUrl: '/api/system/users',
    requestMethod: 'POST',
    responseStatus: 201,
    location: '四川省成都市',
    requestParams: '{"username":"newuser","email":"newuser@example.com"}',
    responseData: '{"code":0,"message":"用户创建成功","data":{"id":123}}',
    errorMessage: null
  }
]

// 格式化数字
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// 格式化日期时间
const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

// 获取操作类型标签
const getOperationTypeTag = (type) => {
  const typeMap = {
    'login': 'success',
    'logout': 'info',
    'query': 'primary',
    'create': 'success',
    'update': 'warning',
    'delete': 'danger',
    'import': 'info',
    'export': 'warning'
  }
  return typeMap[type] || ''
}

// 获取操作类型文本
const getOperationTypeText = (type) => {
  const textMap = {
    'login': '登录',
    'logout': '登出',
    'query': '查询',
    'create': '新增',
    'update': '修改',
    'delete': '删除',
    'import': '导入',
    'export': '导出'
  }
  return textMap[type] || '未知'
}

// 获取模块文本
const getModuleText = (module) => {
  const textMap = {
    'user': '用户管理',
    'role': '角色管理',
    'statistics': '数据统计',
    'visualization': '数据可视化',
    'data': '数据管理',
    'system': '系统设置'
  }
  return textMap[module] || '未知'
}

// 获取结果标签
const getResultTag = (result) => {
  const resultMap = {
    'success': 'success',
    'failed': 'warning',
    'error': 'danger'
  }
  return resultMap[result] || ''
}

// 获取结果文本
const getResultText = (result) => {
  const textMap = {
    'success': '成功',
    'failed': '失败',
    'error': '异常'
  }
  return textMap[result] || '未知'
}

// 获取耗时样式类
const getDurationClass = (duration) => {
  if (duration > 3000) return 'duration-slow'
  if (duration > 1000) return 'duration-medium'
  return 'duration-fast'
}

// 获取浏览器信息
const getBrowserInfo = (userAgent) => {
  if (!userAgent) return '未知'
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  return '其他'
}

// 初始化图表
const initAnalysisCharts = () => {
  // 操作类型分布图表
  if (operationTypeChart.value) {
    const chart1 = echarts.init(operationTypeChart.value)
    const option1 = {
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: '70%',
        data: [
          { value: 1048, name: '查询' },
          { value: 735, name: '新增' },
          { value: 580, name: '修改' },
          { value: 484, name: '删除' },
          { value: 300, name: '导出' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    }
    chart1.setOption(option1)
  }

  // 操作时间分布图表
  if (operationTimeChart.value) {
    const chart2 = echarts.init(operationTimeChart.value)
    const option2 = {
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
      },
      yAxis: { type: 'value' },
      series: [{
        type: 'line',
        data: [12, 8, 45, 120, 85, 35],
        smooth: true,
        itemStyle: { color: '#5470c6' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(84, 112, 198, 0.3)' },
              { offset: 1, color: 'rgba(84, 112, 198, 0.1)' }
            ]
          }
        }
      }]
    }
    chart2.setOption(option2)
  }

  // 用户活跃度图表
  if (userActivityChart.value) {
    const chart3 = echarts.init(userActivityChart.value)
    const option3 = {
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['张三', '李四', '王五', '赵六', '钱七']
      },
      yAxis: { type: 'value' },
      series: [{
        type: 'bar',
        data: [320, 280, 250, 180, 150],
        itemStyle: { color: '#91cc75' }
      }]
    }
    chart3.setOption(option3)
  }

  // 模块使用情况图表
  if (moduleUsageChart.value) {
    const chart4 = echarts.init(moduleUsageChart.value)
    const option4 = {
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 1048, name: '数据统计' },
          { value: 735, name: '用户管理' },
          { value: 580, name: '数据管理' },
          { value: 484, name: '可视化' },
          { value: 300, name: '系统设置' }
        ]
      }]
    }
    chart4.setOption(option4)
  }
}

// 搜索处理
const handleSearch = () => {
  pagination.page = 1
  loadLogsList()
}

// 筛选变化处理
const handleFilterChange = () => {
  pagination.page = 1
  loadLogsList()
}

// 选择变化处理
const handleSelectionChange = (selection) => {
  selectedLogs.value = selection
}

// 分页大小变化
const handleSizeChange = (size) => {
  pagination.size = size
  loadLogsList()
}

// 当前页变化
const handleCurrentChange = (page) => {
  pagination.page = page
  loadLogsList()
}

// 查看日志详情
const viewLogDetail = (log) => {
  currentLog.value = log
  detailDialogVisible.value = true
}

// 删除日志
const deleteLog = async (log) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 ${log.realName} 在 ${formatDateTime(log.operationTime)} 的操作日志吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 调用API删除
    await visualizationApi.deleteOperationLog(log.id)

    ElMessage.success('删除成功')
    loadLogsList()

  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('删除日志失败:', error)
    }
  }
}

// 批量删除
const batchDelete = async () => {
  if (selectedLogs.value.length === 0) {
    ElMessage.warning('请选择要删除的日志')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedLogs.value.length} 条日志吗？`,
      '批量删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const ids = selectedLogs.value.map(log => log.id)
    await visualizationApi.batchDeleteOperationLogs(ids)

    ElMessage.success('批量删除成功')
    selectedLogs.value = []
    loadLogsList()

  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
      console.error('批量删除日志失败:', error)
    }
  }
}

// 导出日志
const exportLogs = () => {
  ElMessage.success('正在导出日志文件...')
}

// 导出单条日志
const exportSingleLog = () => {
  ElMessage.success('正在导出日志详情...')
}

// 显示分析对话框
const showAnalysisDialog = () => {
  analysisDialogVisible.value = true
  nextTick(() => {
    initAnalysisCharts()
  })
}

// 显示日志图表
const showLogChart = () => {
  showAnalysisDialog()
}

// 导出分析报告
const exportAnalysisReport = () => {
  ElMessage.success('正在导出分析报告...')
}

// 刷新数据
const refreshData = () => {
  loadLogsList()
}

// 加载日志列表
const loadLogsList = async () => {
  try {
    tableLoading.value = true

    // 调用真实API获取操作日志数据
    const response = await auditApi.getOperationLogs({
      page: pagination.page,
      size: pagination.size,
      ...searchForm
    })

    if (response.code === 200) {
      logsList.value = response.data.list || []
      pagination.total = response.data.total || 0
    }

  } catch (error) {
    ElMessage.error('加载日志列表失败，请检查后端服务是否正常运行')
    console.error('加载日志列表失败:', error)
  } finally {
    tableLoading.value = false
  }
}

// 生命周期
onMounted(() => {
  loadLogsList()
})
</script>

<style scoped>
.operation-logs {
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

/* 概览区域 */
.overview-section {
  margin-bottom: 20px;
}

.stat-card {
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

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.total .stat-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.users .stat-icon { background: linear-gradient(135deg, #73d13d 0%, #36cfc9 100%); }
.operations .stat-icon { background: linear-gradient(135deg, #fac858 0%, #ee6666 100%); }
.security .stat-icon { background: linear-gradient(135deg, #ff7875 0%, #ff4d4f 100%); }

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 4px;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #52c41a;
}

.stat-trend {
  font-size: 12px;
  color: #8c8c8c;
}

/* 筛选区域 */
.filter-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 日志区域 */
.logs-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

/* 分页区域 */
.pagination-section {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 耗时样式 */
.duration-fast {
  color: #52c41a;
  font-weight: 500;
}

.duration-medium {
  color: #faad14;
  font-weight: 500;
}

.duration-slow {
  color: #ff4d4f;
  font-weight: 500;
}

/* 日志详情 */
.log-detail {
  max-height: 600px;
  overflow-y: auto;
}

.detail-section {
  margin-top: 20px;
}

.detail-section h5 {
  margin: 0 0 12px 0;
  color: #2c3e50;
  font-size: 14px;
  font-weight: 600;
}

/* 分析内容 */
.analysis-content {
  max-height: 600px;
  overflow-y: auto;
}

.chart-container {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.chart-container h5 {
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 14px;
  font-weight: 600;
}

.chart {
  width: 100%;
  height: 250px;
}

/* 对话框样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .operation-logs {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
  }

  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .filter-section .el-row {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
