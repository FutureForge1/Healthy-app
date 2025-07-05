<template>
  <div class="import-export">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2>数据导入导出</h2>
        <p>支持多种格式的数据导入导出，包括Excel、CSV、JSON等</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="showImportDialog">
          <el-icon><Upload /></el-icon>
          导入数据
        </el-button>
        <el-button type="success" @click="showExportDialog">
          <el-icon><Download /></el-icon>
          导出数据
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
          <div class="stat-card import">
            <div class="stat-icon">
              <el-icon><Upload /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ overviewData.totalImports }}</div>
              <div class="stat-label">总导入次数</div>
              <div class="stat-change positive">
                <el-icon><ArrowUp /></el-icon>
                +{{ overviewData.importGrowth }}%
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card export">
            <div class="stat-icon">
              <el-icon><Download /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ overviewData.totalExports }}</div>
              <div class="stat-label">总导出次数</div>
              <div class="stat-change positive">
                <el-icon><ArrowUp /></el-icon>
                +{{ overviewData.exportGrowth }}%
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card success">
            <div class="stat-icon">
              <el-icon><CircleCheck /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ overviewData.successRate }}%</div>
              <div class="stat-label">成功率</div>
              <div class="stat-trend">较上月 +2.3%</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card volume">
            <div class="stat-icon">
              <el-icon><DataLine /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ formatFileSize(overviewData.totalDataVolume) }}</div>
              <div class="stat-label">数据总量</div>
              <div class="stat-trend">本月新增 {{ formatFileSize(overviewData.monthlyIncrease) }}</div>
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
            placeholder="搜索任务名称或文件名"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filters.type" placeholder="操作类型" clearable @change="handleFilterChange">
            <el-option label="全部类型" value="" />
            <el-option label="导入" value="import" />
            <el-option label="导出" value="export" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filters.status" placeholder="状态" clearable @change="handleFilterChange">
            <el-option label="全部状态" value="" />
            <el-option label="进行中" value="processing" />
            <el-option label="成功" value="success" />
            <el-option label="失败" value="failed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filters.dataType" placeholder="数据类型" clearable @change="handleFilterChange">
            <el-option label="全部类型" value="" />
            <el-option label="人口数据" value="population" />
            <el-option label="医疗机构" value="institution" />
            <el-option label="医护人员" value="personnel" />
            <el-option label="床位信息" value="bed" />
            <el-option label="服务数据" value="service" />
            <el-option label="费用数据" value="cost" />
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

    <!-- 任务列表 -->
    <div class="task-list-section">
      <div class="section-header">
        <h4>导入导出任务</h4>
        <div class="header-actions">
          <el-button type="danger" size="small" :disabled="selectedTasks.length === 0" @click="batchDelete">
            <el-icon><Delete /></el-icon>
            批量删除
          </el-button>
          <el-button type="warning" size="small" :disabled="selectedTasks.length === 0" @click="batchCancel">
            <el-icon><Close /></el-icon>
            批量取消
          </el-button>
        </div>
      </div>

      <el-table
        v-loading="tableLoading"
        :data="taskList"
        stripe
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="taskName" label="任务名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="type" label="操作类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'import' ? 'primary' : 'success'">
              {{ row.type === 'import' ? '导入' : '导出' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="dataType" label="数据类型" width="120">
          <template #default="{ row }">
            {{ getDataTypeText(row.dataType) }}
          </template>
        </el-table-column>
        <el-table-column prop="fileName" label="文件名" min-width="180" show-overflow-tooltip />
        <el-table-column prop="fileSize" label="文件大小" width="100">
          <template #default="{ row }">
            {{ formatFileSize(row.fileSize) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="progress" label="进度" width="120">
          <template #default="{ row }">
            <el-progress
              :percentage="row.progress"
              :status="row.status === 'failed' ? 'exception' : row.status === 'success' ? 'success' : ''"
              :stroke-width="6"
            />
          </template>
        </el-table-column>
        <el-table-column prop="recordCount" label="记录数" width="100">
          <template #default="{ row }">
            {{ row.recordCount ? row.recordCount.toLocaleString() : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="耗时" width="100">
          <template #default="{ row }">
            {{ formatDuration(row.duration) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'success' && row.type === 'export'"
              type="primary"
              size="small"
              @click="downloadFile(row)"
            >
              下载
            </el-button>
            <el-button
              v-if="row.status === 'processing'"
              type="warning"
              size="small"
              @click="cancelTask(row)"
            >
              取消
            </el-button>
            <el-button type="info" size="small" @click="viewTaskDetail(row)">
              详情
            </el-button>
            <el-button
              v-if="row.status === 'failed'"
              type="danger"
              size="small"
              @click="retryTask(row)"
            >
              重试
            </el-button>
            <el-button type="danger" size="small" @click="deleteTask(row)">
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

    <!-- 导入对话框 -->
    <el-dialog
      v-model="importDialogVisible"
      title="数据导入"
      width="600px"
      :before-close="handleImportDialogClose"
    >
      <el-form :model="importForm" label-width="100px">
        <el-form-item label="数据类型">
          <el-select v-model="importForm.dataType" placeholder="请选择数据类型">
            <el-option label="人口数据" value="population" />
            <el-option label="医疗机构" value="institution" />
            <el-option label="医护人员" value="personnel" />
            <el-option label="床位信息" value="bed" />
            <el-option label="服务数据" value="service" />
            <el-option label="费用数据" value="cost" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务名称">
          <el-input v-model="importForm.taskName" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="文件上传">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :on-change="handleFileChange"
            :before-upload="beforeUpload"
            :limit="1"
            accept=".xlsx,.xls,.csv,.json"
            drag
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持 Excel(.xlsx/.xls)、CSV(.csv)、JSON(.json) 格式，文件大小不超过 100MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="导入选项">
          <el-checkbox v-model="importForm.skipFirstRow" :true-value="true" :false-value="false">跳过第一行（标题行）</el-checkbox>
          <el-checkbox v-model="importForm.validateData" :true-value="true" :false-value="false">数据验证</el-checkbox>
          <el-checkbox v-model="importForm.overwriteExisting" :true-value="true" :false-value="false">覆盖已存在数据</el-checkbox>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="importDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="startImport" :loading="importing">
            开始导入
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 导出对话框 -->
    <el-dialog
      v-model="exportDialogVisible"
      title="数据导出"
      width="600px"
      :before-close="handleExportDialogClose"
    >
      <el-form :model="exportForm" label-width="100px">
        <el-form-item label="数据类型">
          <el-select v-model="exportForm.dataType" placeholder="请选择数据类型">
            <el-option label="人口数据" value="population" />
            <el-option label="医疗机构" value="institution" />
            <el-option label="医护人员" value="personnel" />
            <el-option label="床位信息" value="bed" />
            <el-option label="服务数据" value="service" />
            <el-option label="费用数据" value="cost" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务名称">
          <el-input v-model="exportForm.taskName" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="导出格式">
          <el-radio-group v-model="exportForm.format">
            <el-radio value="xlsx">Excel (.xlsx)</el-radio>
            <el-radio value="csv">CSV (.csv)</el-radio>
            <el-radio value="json">JSON (.json)</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="exportForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="筛选条件">
          <el-input
            v-model="exportForm.filters"
            type="textarea"
            :rows="3"
            placeholder="请输入筛选条件（JSON格式）"
          />
        </el-form-item>
        <el-form-item label="导出选项">
          <el-checkbox v-model="exportForm.includeHeaders" :true-value="true" :false-value="false">包含标题行</el-checkbox>
          <el-checkbox v-model="exportForm.compressFile" :true-value="true" :false-value="false">压缩文件</el-checkbox>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="exportDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="startExport" :loading="exporting">
            开始导出
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Upload,
  Download,
  Refresh,
  Search,
  ArrowUp,
  CircleCheck,
  DataLine,
  Delete,
  Close,
  UploadFilled
} from '@element-plus/icons-vue'
import { visualizationApi } from '@/api/visualization'

// 响应式数据
const tableLoading = ref(false)
const importing = ref(false)
const exporting = ref(false)
const searchKeyword = ref('')
const importDialogVisible = ref(false)
const exportDialogVisible = ref(false)

// 上传引用
const uploadRef = ref(null)

// 筛选条件
const filters = reactive({
  type: '',
  status: '',
  dataType: '',
  dateRange: null
})

// 分页
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 概览数据
const overviewData = reactive({
  totalImports: 1247,
  totalExports: 856,
  importGrowth: 12.5,
  exportGrowth: 8.3,
  successRate: 96.8,
  totalDataVolume: 2147483648, // 2GB
  monthlyIncrease: 134217728 // 128MB
})

// 任务列表
const taskList = ref([])
const selectedTasks = ref([])

// 导入表单
const importForm = reactive({
  dataType: '',
  taskName: '',
  file: null,
  skipFirstRow: true,
  validateData: true,
  overwriteExisting: false
})

// 导出表单
const exportForm = reactive({
  dataType: '',
  taskName: '',
  format: 'xlsx',
  dateRange: null,
  filters: '',
  includeHeaders: true,
  compressFile: false
})

// 模拟任务数据
const mockTaskList = [
  {
    id: 1,
    taskName: '人口数据导入-2023年12月',
    type: 'import',
    dataType: 'population',
    fileName: 'population_2023_12.xlsx',
    fileSize: 5242880, // 5MB
    status: 'success',
    progress: 100,
    recordCount: 15000,
    createTime: '2023-12-01 10:30:00',
    duration: 120000 // 2分钟
  },
  {
    id: 2,
    taskName: '医疗机构数据导出',
    type: 'export',
    dataType: 'institution',
    fileName: 'institutions_export.xlsx',
    fileSize: 2097152, // 2MB
    status: 'processing',
    progress: 65,
    recordCount: 1248,
    createTime: '2023-12-01 14:15:00',
    duration: 45000 // 45秒
  }
]

// 获取数据类型文本
const getDataTypeText = (dataType) => {
  const textMap = {
    'population': '人口数据',
    'institution': '医疗机构',
    'personnel': '医护人员',
    'bed': '床位信息',
    'service': '服务数据',
    'cost': '费用数据'
  }
  return textMap[dataType] || '未知'
}

// 获取状态标签样式
const getStatusTagType = (status) => {
  const statusMap = {
    'processing': 'warning',
    'success': 'success',
    'failed': 'danger',
    'cancelled': 'info'
  }
  return statusMap[status] || ''
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    'processing': '进行中',
    'success': '成功',
    'failed': '失败',
    'cancelled': '已取消'
  }
  return textMap[status] || '未知'
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 格式化日期时间
const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

// 格式化持续时间
const formatDuration = (milliseconds) => {
  if (!milliseconds) return '-'
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}小时${minutes % 60}分钟`
  } else if (minutes > 0) {
    return `${minutes}分钟${seconds % 60}秒`
  } else {
    return `${seconds}秒`
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

// 选择处理
const handleSelectionChange = (selection) => {
  selectedTasks.value = selection
}

// 加载数据
const loadData = async () => {
  try {
    tableLoading.value = true

    // 调用真实API获取导入导出任务列表
    const response = await visualizationApi.getImportExportLogs({
      page: pagination.page,
      size: pagination.size,
      ...searchForm
    })

    if (response.code === 200) {
      taskList.value = response.data.list || []
      pagination.total = response.data.total || 0
    }

  } catch (error) {
    ElMessage.error('加载数据失败，请检查后端服务是否正常运行')
    console.error('加载数据失败:', error)
  } finally {
    tableLoading.value = false
  }
}

// 显示导入对话框
const showImportDialog = () => {
  Object.assign(importForm, {
    dataType: '',
    taskName: '',
    file: null,
    skipFirstRow: true,
    validateData: true,
    overwriteExisting: false
  })
  importDialogVisible.value = true
}

// 显示导出对话框
const showExportDialog = () => {
  Object.assign(exportForm, {
    dataType: '',
    taskName: '',
    format: 'xlsx',
    dateRange: null,
    filters: '',
    includeHeaders: true,
    compressFile: false
  })
  exportDialogVisible.value = true
}

// 文件变化处理
const handleFileChange = (file) => {
  importForm.file = file.raw
}

// 上传前检查
const beforeUpload = (file) => {
  const isValidType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      'application/vnd.ms-excel',
                      'text/csv',
                      'application/json'].includes(file.type)
  const isLt100M = file.size / 1024 / 1024 < 100

  if (!isValidType) {
    ElMessage.error('只支持 Excel、CSV、JSON 格式的文件!')
    return false
  }
  if (!isLt100M) {
    ElMessage.error('文件大小不能超过 100MB!')
    return false
  }
  return true
}

// 开始导入
const startImport = async () => {
  if (!importForm.dataType) {
    ElMessage.warning('请选择数据类型')
    return
  }
  if (!importForm.taskName) {
    ElMessage.warning('请输入任务名称')
    return
  }
  if (!importForm.file) {
    ElMessage.warning('请选择要导入的文件')
    return
  }

  try {
    importing.value = true

    const formData = new FormData()
    formData.append('file', importForm.file)
    formData.append('dataType', importForm.dataType)
    formData.append('taskName', importForm.taskName)
    formData.append('skipFirstRow', importForm.skipFirstRow)
    formData.append('validateData', importForm.validateData)
    formData.append('overwriteExisting', importForm.overwriteExisting)

    // 调用API
    await visualizationApi.importData(formData)

    ElMessage.success('导入任务已创建，正在后台处理')
    importDialogVisible.value = false
    loadData()

  } catch (error) {
    ElMessage.error('创建导入任务失败')
    console.error('导入失败:', error)
  } finally {
    importing.value = false
  }
}

// 开始导出
const startExport = async () => {
  if (!exportForm.dataType) {
    ElMessage.warning('请选择数据类型')
    return
  }
  if (!exportForm.taskName) {
    ElMessage.warning('请输入任务名称')
    return
  }

  try {
    exporting.value = true

    const exportData = {
      dataType: exportForm.dataType,
      taskName: exportForm.taskName,
      format: exportForm.format,
      dateRange: exportForm.dateRange,
      filters: exportForm.filters ? JSON.parse(exportForm.filters) : {},
      includeHeaders: exportForm.includeHeaders,
      compressFile: exportForm.compressFile
    }

    // 调用API
    await visualizationApi.exportData(exportData)

    ElMessage.success('导出任务已创建，完成后可在任务列表中下载')
    exportDialogVisible.value = false
    loadData()

  } catch (error) {
    ElMessage.error('创建导出任务失败')
    console.error('导出失败:', error)
  } finally {
    exporting.value = false
  }
}

// 下载文件
const downloadFile = (row) => {
  ElMessage.success(`开始下载文件: ${row.fileName}`)
  // 实际实现中应该调用下载API
}

// 取消任务
const cancelTask = (row) => {
  ElMessageBox.confirm(
    `确定要取消任务 "${row.taskName}" 吗？`,
    '确认取消',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('任务已取消')
    loadData()
  }).catch(() => {
    ElMessage.info('已取消操作')
  })
}

// 查看任务详情
const viewTaskDetail = (row) => {
  ElMessage.info(`查看任务详情: ${row.taskName}`)
}

// 重试任务
const retryTask = (row) => {
  ElMessageBox.confirm(
    `确定要重试任务 "${row.taskName}" 吗？`,
    '确认重试',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('任务已重新开始')
    loadData()
  }).catch(() => {
    ElMessage.info('已取消重试')
  })
}

// 删除任务
const deleteTask = (row) => {
  ElMessageBox.confirm(
    `确定要删除任务 "${row.taskName}" 吗？此操作不可恢复。`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('任务已删除')
    loadData()
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 批量删除
const batchDelete = () => {
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedTasks.value.length} 个任务吗？此操作不可恢复。`,
    '确认批量删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success(`已删除 ${selectedTasks.value.length} 个任务`)
    selectedTasks.value = []
    loadData()
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 批量取消
const batchCancel = () => {
  const processingTasks = selectedTasks.value.filter(task => task.status === 'processing')
  if (processingTasks.length === 0) {
    ElMessage.warning('没有可取消的任务')
    return
  }

  ElMessageBox.confirm(
    `确定要取消选中的 ${processingTasks.length} 个进行中的任务吗？`,
    '确认批量取消',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success(`已取消 ${processingTasks.length} 个任务`)
    selectedTasks.value = []
    loadData()
  }).catch(() => {
    ElMessage.info('已取消操作')
  })
}

// 刷新数据
const refreshData = () => {
  loadData()
}

// 对话框关闭处理
const handleImportDialogClose = (done) => {
  if (importing.value) {
    ElMessage.warning('导入正在进行中，请稍候')
    return
  }
  done()
}

const handleExportDialogClose = (done) => {
  if (exporting.value) {
    ElMessage.warning('导出正在进行中，请稍候')
    return
  }
  done()
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.import-export {
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

.import .stat-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.export .stat-icon { background: linear-gradient(135deg, #5470c6 0%, #91cc75 100%); }
.success .stat-icon { background: linear-gradient(135deg, #73d13d 0%, #36cfc9 100%); }
.volume .stat-icon { background: linear-gradient(135deg, #fac858 0%, #ee6666 100%); }

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
}

.stat-change.positive { color: #52c41a; }
.stat-change.negative { color: #ff4d4f; }

.stat-trend {
  font-size: 12px;
  color: #8c8c8c;
}

/* 筛选区域 */
.filter-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 任务列表区域 */
.task-list-section {
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

.pagination-section {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 对话框样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 上传区域样式 */
:deep(.el-upload-dragger) {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  width: 100%;
  height: 180px;
  text-align: center;
  background: #fafafa;
  transition: all 0.3s ease;
}

:deep(.el-upload-dragger:hover) {
  border-color: #409eff;
  background: #f0f9ff;
}

:deep(.el-icon--upload) {
  font-size: 48px;
  color: #c0c4cc;
  margin-bottom: 16px;
}

:deep(.el-upload__text) {
  color: #606266;
  font-size: 14px;
}

:deep(.el-upload__text em) {
  color: #409eff;
  font-style: normal;
}

:deep(.el-upload__tip) {
  color: #909399;
  font-size: 12px;
  margin-top: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .import-export {
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
}
</style>
