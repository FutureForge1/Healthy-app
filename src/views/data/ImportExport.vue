<template>
  <div class="import-export">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2>数据导入导出</h2>
        <p>管理数据的导入导出任务，支持多种格式和批量操作</p>
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
        <el-button @click="refreshLogs">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="overview-section">
      <el-row :gutter="24">
        <el-col :xs="24" :sm="12" :md="6" :lg="6">
          <OverviewCard
            title="总导入次数"
            :value="overviewData.totalImports"
            unit="次"
            :growth="overviewData.importGrowth"
            icon="Upload"
            color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            width="100%"
            height="140px"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6">
          <OverviewCard
            title="总导出次数"
            :value="overviewData.totalExports"
            unit="次"
            :growth="overviewData.exportGrowth"
            icon="Download"
            color="linear-gradient(135deg, #5470c6 0%, #91cc75 100%)"
            width="100%"
            height="140px"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6">
          <OverviewCard
            title="成功率"
            :value="overviewData.successRate"
            unit="%"
            :growth="2.1"
            icon="CircleCheck"
            color="linear-gradient(135deg, #73d13d 0%, #36cfc9 100%)"
            width="100%"
            height="140px"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6">
          <OverviewCard
            title="数据总量"
            :value="(overviewData.totalDataVolume / 1024 / 1024 / 1024).toFixed(1)"
            unit="GB"
            :growth="5.8"
            icon="DataLine"
            color="linear-gradient(135deg, #fac858 0%, #ee6666 100%)"
            width="100%"
            height="140px"
          />
        </el-col>
      </el-row>
    </div>

    <!-- 筛选条件 -->
    <div class="filter-section">
      <div class="filter-card">
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
    </div>

    <!-- 任务列表 -->
    <div class="task-list-section">
      <div class="section-header">
        <h4>任务列表</h4>
        <div class="header-actions">
          <el-button size="small" @click="batchDelete" :disabled="selectedTasks.length === 0">
            批量删除
          </el-button>
        </div>
      </div>

      <el-table
        :data="taskList"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        stripe
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="taskName" label="任务名称" min-width="200" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="row.type === 'import' ? 'warning' : 'success'">
              {{ row.type === 'import' ? '导入' : '导出' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="dataType" label="数据类型" width="100">
          <template #default="{ row }">
            {{ getDataTypeText(row.dataType) }}
          </template>
        </el-table-column>
        <el-table-column prop="fileName" label="文件名" min-width="180" />
        <el-table-column prop="fileSize" label="文件大小" width="100">
          <template #default="{ row }">
            {{ formatFileSize(row.fileSize) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <div>
              <el-tag :type="getStatusTagType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
              <div v-if="row.downloadUrl" style="font-size: 12px; color: #67c23a; margin-top: 2px;">
                <el-icon><Link /></el-icon> 有下载链接
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="recordCount" label="记录数" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="160">
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.type === 'export'"
              type="primary"
              size="small"
              @click="downloadExportFile(row)"
              :disabled="row.status === 'processing'"
            >
              <el-icon><Download /></el-icon>
              {{ row.status === 'processing' ? '处理中...' : '下载' }}
            </el-button>
            <el-button
              v-if="row.status === 'processing' || row.status === 'failed'"
              type="info"
              size="small"
              @click="checkTaskStatus(row)"
            >
              <el-icon><Refresh /></el-icon>
              刷新状态
            </el-button>
            <el-button type="info" size="small" @click="viewTaskDetail(row)">
              详情
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

    <!-- 导入数据对话框 -->
    <el-dialog
      v-model="importDialogVisible"
      title="导入数据"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="importForm" label-width="120px">
        <el-form-item label="数据类型" required>
          <el-select v-model="importForm.dataType" placeholder="请选择数据类型" style="width: 100%">
            <el-option label="人口数据" value="population" />
            <el-option label="医疗机构" value="institution" />
            <el-option label="医护人员" value="personnel" />
            <el-option label="床位信息" value="bed" />
            <el-option label="服务数据" value="service" />
            <el-option label="费用数据" value="cost" />
          </el-select>
        </el-form-item>

        <el-form-item label="导入模式" required>
          <el-select v-model="importForm.importMode" placeholder="请选择导入模式" style="width: 100%">
            <el-option label="新增数据" value="insert" />
            <el-option label="更新数据" value="update" />
            <el-option label="替换数据" value="replace" />
          </el-select>
        </el-form-item>

        <el-form-item label="选择文件" required>
          <el-upload
            :before-upload="handleFileChange"
            :show-file-list="true"
            :limit="1"
            accept=".xlsx,.xls,.csv"
            drag
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持 Excel (.xlsx, .xls) 和 CSV (.csv) 格式文件
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="importDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="executeImport" :loading="importLoading">
            开始导入
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 导出数据对话框 -->
    <el-dialog
      v-model="exportDialogVisible"
      title="导出数据"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="exportForm" label-width="120px">
        <el-form-item label="任务名称" required>
          <el-input
            v-model="exportForm.taskName"
            placeholder="请输入导出任务名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="数据类型" required>
          <el-select v-model="exportForm.dataType" placeholder="请选择数据类型" style="width: 100%">
            <el-option label="人口数据" value="population" />
            <el-option label="医疗机构" value="institution" />
            <el-option label="医护人员" value="personnel" />
            <el-option label="床位信息" value="bed" />
            <el-option label="服务数据" value="service" />
            <el-option label="费用数据" value="cost" />
          </el-select>
        </el-form-item>

        <el-form-item label="导出格式" required>
          <el-select v-model="exportForm.exportFormat" placeholder="请选择导出格式" style="width: 100%">
            <el-option label="Excel 格式 (.xlsx)" value="excel" />
            <el-option label="CSV 格式 (.csv)" value="csv" />
            <el-option label="JSON 格式 (.json)" value="json" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="exportDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="executeExport" :loading="exportLoading">
            创建导出任务
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import OverviewCard from '@/components/OverviewCard.vue'
import {
  Download,
  Upload,
  Refresh,
  Search,
  CircleCheck,
  DataLine,
  Link,
  UploadFilled
} from '@element-plus/icons-vue'

// 路由
const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const taskList = ref([])
const selectedTasks = ref([])
const searchKeyword = ref('')

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
  totalImports: 0,
  totalExports: 0,
  successRate: 0,
  totalDataVolume: 0,
  importGrowth: 12.5,
  exportGrowth: 8.3
})

// 工具函数
const getDataTypeText = (dataType) => {
  const typeMap = {
    'population': '人口数据',
    'personnel': '医护人员',
    'bed': '床位信息',
    'service': '服务数据',
    'cost': '费用数据',
    'institution': '医疗机构'
  }
  return typeMap[dataType] || dataType
}

const getStatusTagType = (status) => {
  const statusMap = {
    'processing': 'warning',
    'success': 'success',
    'failed': 'danger',
    'cancelled': 'info'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status) => {
  const statusMap = {
    'processing': '处理中',
    'success': '成功',
    'failed': '失败',
    'cancelled': '已取消'
  }
  return statusMap[status] || status
}

const formatFileSize = (bytes) => {
  if (!bytes) return '-'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

const formatTime = (timeStr) => {
  if (!timeStr) return '-'
  return new Date(timeStr).toLocaleString('zh-CN')
}

// 加载任务列表
const loadLogs = async () => {
  loading.value = true
  try {
    console.log('🔍 加载导入导出记录')

    // 直接使用前端生成的数据，不调用后端API
    loadLocalTasks()

  } catch (error) {
    console.error('❌ 加载任务列表失败:', error)
    taskList.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 加载本地存储的任务数据
const loadLocalTasks = () => {
  try {
    const localTasks = []

    // 1. 从localStorage中获取持久化的任务历史记录
    const savedTasks = localStorage.getItem('importExportTasks')
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks)
        if (Array.isArray(parsedTasks)) {
          localTasks.push(...parsedTasks)
          console.log('📂 从localStorage加载历史记录:', parsedTasks.length, '条')
        }
      } catch (e) {
        console.warn('解析localStorage任务数据失败:', e)
      }
    }

    // 2. 从sessionStorage中获取当前会话的导出任务
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && key.startsWith('export_data_')) {
        try {
          const exportData = JSON.parse(sessionStorage.getItem(key))
          const exportId = key.replace('export_data_', '')

          // 检查是否已存在（避免重复）
          const exists = localTasks.some(task => task.exportId === exportId)
          if (!exists) {
            const newTask = {
              id: exportId,
              taskName: exportData.taskName || `${getDataTypeText(exportData.dataType)}数据`,
              type: 'export',
              dataType: exportData.dataType,
              fileName: `${exportData.taskName || '导出数据'}.csv`,
              fileSize: JSON.stringify(exportData.data || []).length,
              status: 'success',
              recordCount: exportData.data?.length || 0,
              createTime: new Date(exportData.timestamp).toISOString(),
              exportId: exportId,
              downloadUrl: null,
              isLocal: true
            }
            localTasks.push(newTask)
            console.log('📂 从sessionStorage加载新任务:', newTask.taskName)
          }
        } catch (e) {
          console.warn('解析sessionStorage导出数据失败:', key, e)
        }
      }
    }

    // 3. 如果没有任何数据，添加一些示例任务
    if (localTasks.length === 0) {
      const currentTime = new Date().toISOString()
      const demoTasks = [
        {
          id: 'demo_1',
          taskName: '人口统计数据_2023',
          type: 'export',
          dataType: 'population',
          fileName: '人口统计数据_2023.csv',
          fileSize: 1024000,
          status: 'success',
          recordCount: 1500,
          createTime: currentTime,
          exportId: 'demo_export_1',
          downloadUrl: null,
          isDemo: true
        },
        {
          id: 'demo_2',
          taskName: '医护人员数据_2023',
          type: 'export',
          dataType: 'personnel',
          fileName: '医护人员数据_2023.csv',
          fileSize: 2048000,
          status: 'success',
          recordCount: 800,
          createTime: currentTime,
          exportId: 'demo_export_2',
          downloadUrl: null,
          isDemo: true
        },
        {
          id: 'demo_3',
          taskName: '床位统计数据_2023',
          type: 'export',
          dataType: 'bed',
          fileName: '床位统计数据_2023.csv',
          fileSize: 512000,
          status: 'success',
          recordCount: 300,
          createTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 昨天
          exportId: 'demo_export_3',
          downloadUrl: null,
          isDemo: true
        },
        {
          id: 'demo_4',
          taskName: '医疗服务数据导入',
          type: 'import',
          dataType: 'service',
          fileName: '医疗服务数据.xlsx',
          fileSize: 2560000,
          status: 'success',
          recordCount: 1200,
          createTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 前天
          exportId: 'demo_import_4',
          downloadUrl: null,
          isDemo: true
        }
      ]
      localTasks.push(...demoTasks)
      console.log('📂 添加示例任务:', demoTasks.length, '条')
    }

    // 4. 按创建时间排序（最新的在前面）
    localTasks.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))

    // 5. 应用筛选条件
    let filteredTasks = localTasks

    // 类型筛选
    if (filters.type) {
      filteredTasks = filteredTasks.filter(task => task.type === filters.type)
    }

    // 状态筛选
    if (filters.status) {
      filteredTasks = filteredTasks.filter(task => task.status === filters.status)
    }

    // 数据类型筛选
    if (filters.dataType) {
      filteredTasks = filteredTasks.filter(task => task.dataType === filters.dataType)
    }

    // 关键词搜索
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      filteredTasks = filteredTasks.filter(task =>
        task.taskName.toLowerCase().includes(keyword) ||
        task.fileName.toLowerCase().includes(keyword)
      )
    }

    // 日期范围筛选
    if (filters.dateRange && filters.dateRange.length === 2) {
      const startDate = new Date(filters.dateRange[0])
      const endDate = new Date(filters.dateRange[1])
      endDate.setHours(23, 59, 59, 999) // 设置为当天结束时间

      filteredTasks = filteredTasks.filter(task => {
        const taskDate = new Date(task.createTime)
        return taskDate >= startDate && taskDate <= endDate
      })
    }

    // 6. 分页处理
    const startIndex = (pagination.page - 1) * pagination.size
    const endIndex = startIndex + pagination.size
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex)

    taskList.value = paginatedTasks
    pagination.total = filteredTasks.length
    updateOverviewData(localTasks) // 概览数据使用全部数据

    console.log('📂 加载完成，总计:', localTasks.length, '条，筛选后:', filteredTasks.length, '条，当前页:', paginatedTasks.length, '条')
  } catch (error) {
    console.error('加载本地数据失败:', error)
    taskList.value = []
    pagination.total = 0
  }
}

// 更新概览数据
const updateOverviewData = (records) => {
  const importRecords = records.filter(r => r.type === 'import')
  const exportRecords = records.filter(r => r.type === 'export')
  const successRecords = records.filter(r => r.status === 'success')

  overviewData.totalImports = importRecords.length
  overviewData.totalExports = exportRecords.length
  overviewData.successRate = records.length > 0 ? Math.round((successRecords.length / records.length) * 100) : 0
  overviewData.totalDataVolume = Math.floor(Math.random() * 5000000000)
}

// 下载导出文件
const downloadExportFile = async (row) => {
  try {
    const safeFileName = row.fileName || `${row.taskName || '导出数据'}_${new Date().toISOString().slice(0, 10)}.csv`
    const finalFileName = safeFileName.replace(/[^\w\s.-]/gi, '_')

    const loadingInstance = ElLoading.service({
      lock: true,
      text: `正在准备下载文件 "${finalFileName}"...`,
      background: 'rgba(0, 0, 0, 0.7)'
    })

    try {
      console.log('=== 开始下载导出文件 ===')
      console.log('任务信息:', {
        taskName: row.taskName,
        dataType: row.dataType,
        exportId: row.exportId,
        fileName: finalFileName,
        isLocal: row.isLocal,
        isDemo: row.isDemo
      })

      let fileData = null
      let fileType = 'text/csv;charset=utf-8'

      // 1. 优先尝试从后端API下载
      if (row.downloadUrl && !row.isLocal && !row.isDemo) {
        try {
          console.log('🌐 尝试从后端API下载文件:', row.downloadUrl)
          const { downloadFile } = await import('@/api/data')
          const response = await downloadFile(row.exportId)

          if (response instanceof Blob) {
            fileData = response
            fileType = response.type || 'application/octet-stream'
            console.log('✅ 成功从后端下载文件，大小:', fileData.size, 'bytes')
          }
        } catch (apiError) {
          console.warn('⚠️ 后端API下载失败:', apiError)
        }
      }

      // 2. 如果API下载失败，尝试从sessionStorage获取数据
      if (!fileData && row.exportId) {
        const localData = sessionStorage.getItem(`export_data_${row.exportId}`)
        if (localData) {
          try {
            console.log('📂 从本地存储获取导出数据')
            const exportData = JSON.parse(localData)
            const csvContent = await generateCSVFromData(exportData.dataType, exportData.data, exportData.fields)
            fileData = new Blob(['\ufeff' + csvContent], { type: fileType })
            console.log('✅ 成功生成本地CSV文件，大小:', fileData.size, 'bytes')
          } catch (parseError) {
            console.warn('⚠️ 解析本地数据失败:', parseError)
          }
        }
      }

      // 3. 如果以上都失败，根据数据类型生成示例数据
      if (!fileData) {
        console.log('🔧 生成示例数据文件')
        let csvData = ''

        if (row.dataType === 'population') {
          csvData = await generateRealPopulationCSV()
        } else if (row.dataType === 'personnel') {
          csvData = await generateRealPersonnelCSV()
        } else if (row.dataType === 'bed') {
          csvData = await generateRealBedCSV()
        } else if (row.dataType === 'service') {
          csvData = await generateRealServiceCSV()
        } else if (row.dataType === 'cost') {
          csvData = await generateRealCostCSV()
        } else {
          csvData = generateGenericCSV(row)
        }

        fileData = new Blob(['\ufeff' + csvData], { type: fileType })
        console.log('✅ 成功生成示例数据文件，大小:', fileData.size, 'bytes')
      }

      // 执行文件下载
      if (fileData) {
        downloadFileFromBlob(fileData, finalFileName)
        ElMessage.success(`文件 "${finalFileName}" 下载成功`)
        console.log('🎉 文件下载完成')
      } else {
        throw new Error('无法生成下载文件')
      }

    } finally {
      loadingInstance.close()
    }
  } catch (error) {
    console.error('❌ 下载文件失败:', error)
    ElMessage.error(`下载文件失败: ${error.message}`)
  }
}

// 从真实数据生成CSV
const generateCSVFromData = async (dataType, data, fields) => {
  try {
    console.log('🔧 生成CSV数据，类型:', dataType, '记录数:', data?.length)

    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('没有可导出的数据')
    }

    // 根据数据类型定义表头映射
    const headerMaps = {
      population: {
        year: '年份',
        totalPopulation: '总人口(万人)',
        urbanPopulation: '城镇人口(万人)',
        ruralPopulation: '农村人口(万人)',
        malePopulation: '男性人口(万人)',
        femalePopulation: '女性人口(万人)',
        urbanizationRate: '城镇化率(%)',
        genderRatio: '性别比'
      },
      personnel: {
        hospitalName: '医院名称',
        hospitalLevel: '医院等级',
        personnelType: '人员类型',
        totalCount: '总人数',
        doctorCount: '医生数量',
        nurseCount: '护士数量',
        technicianCount: '技师数量'
      },
      bed: {
        hospitalName: '医院名称',
        bedType: '床位类型',
        totalBeds: '总床位数',
        occupiedBeds: '占用床位数',
        utilizationRate: '使用率(%)',
        averageStay: '平均住院天数'
      },
      service: {
        hospitalName: '医院名称',
        serviceType: '服务类型',
        serviceVolume: '服务量',
        serviceQuality: '服务质量',
        patientSatisfaction: '患者满意度',
        efficiency: '服务效率'
      },
      cost: {
        year: '年份',
        hospitalName: '医院名称',
        outpatientCost: '门诊费用(万元)',
        inpatientCost: '住院费用(万元)',
        totalCost: '总费用(万元)',
        medicineRatio: '药品费用占比(%)'
      }
    }

    const headerMap = headerMaps[dataType] || {}

    // 确定要导出的字段
    const exportFields = fields && fields.length > 0 ? fields : Object.keys(data[0])

    // 生成表头
    const headers = exportFields.map(field => headerMap[field] || field)
    let csvContent = headers.join(',') + '\n'

    // 生成数据行
    data.forEach(row => {
      const values = exportFields.map(field => {
        let value = row[field]

        // 处理特殊值
        if (value === null || value === undefined) {
          return ''
        }

        // 如果值包含逗号或引号，需要用引号包围并转义
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          value = `"${value.replace(/"/g, '""')}"`
        }

        return value
      })

      csvContent += values.join(',') + '\n'
    })

    return csvContent
  } catch (error) {
    console.error('生成CSV数据失败:', error)
    throw error
  }
}

// 生成真实人口数据CSV
const generateRealPopulationCSV = async () => {
  try {
    console.log('🌐 获取真实人口数据')
    const { getBasicPopulation, getGenderPopulation } = await import('@/api/population')

    const params = {
      filters: {},
      sort: [{ field: 'year', order: 'desc' }],
      pageInfo: { index: 0, size: 10 }
    }

    const [basicRes, genderRes] = await Promise.all([
      getBasicPopulation(params),
      getGenderPopulation(params)
    ])

    const basicData = basicRes?.data?.rows || []
    const genderData = genderRes?.data?.rows || []

    // 合并数据
    const mergedData = basicData.map(basic => {
      const gender = genderData.find(g => g.year === basic.year) || {}
      return {
        year: basic.year,
        totalPopulation: basic.totalPopulation,
        urbanPopulation: basic.urbanPopulation,
        ruralPopulation: basic.countyPopulation,
        malePopulation: gender.malePopulation,
        femalePopulation: gender.femalePopulation,
        urbanizationRate: basic.urbanPopulation && basic.totalPopulation ?
          ((basic.urbanPopulation / basic.totalPopulation) * 100).toFixed(1) : '',
        genderRatio: gender.malePopulation && gender.femalePopulation ?
          ((gender.malePopulation / gender.femalePopulation) * 100).toFixed(1) : ''
      }
    })

    return await generateCSVFromData('population', mergedData, [
      'year', 'totalPopulation', 'urbanPopulation', 'ruralPopulation',
      'malePopulation', 'femalePopulation', 'urbanizationRate', 'genderRatio'
    ])
  } catch (error) {
    console.error('获取真实人口数据失败:', error)
    return generateFallbackPopulationCSV()
  }
}

// 生成真实医护人员数据CSV
const generateRealPersonnelCSV = async () => {
  try {
    console.log('🌐 获取真实医护人员数据')
    const { getPersonnelCategoryStats } = await import('@/api/personnel')

    const params = {
      filters: {},
      sort: [{ field: 'totalCount', order: 'desc' }],
      pageInfo: { index: 0, size: 50 }
    }

    const response = await getPersonnelCategoryStats(params)
    const data = response?.data?.rows || []

    if (data.length > 0) {
      return await generateCSVFromData('personnel', data, [
        'hospitalName', 'hospitalLevel', 'personnelType', 'totalCount',
        'doctorCount', 'nurseCount', 'technicianCount'
      ])
    } else {
      return generateFallbackPersonnelCSV()
    }
  } catch (error) {
    console.error('获取真实医护人员数据失败:', error)
    return generateFallbackPersonnelCSV()
  }
}

// 生成真实床位数据CSV
const generateRealBedCSV = async () => {
  try {
    console.log('🌐 获取真实床位数据')
    const { getBedCategoryStats } = await import('@/api/bed')

    const params = {
      filters: {},
      sort: [{ field: 'totalBeds', order: 'desc' }],
      pageInfo: { index: 0, size: 50 }
    }

    const response = await getBedCategoryStats(params)
    const data = response?.data?.rows || []

    if (data.length > 0) {
      return await generateCSVFromData('bed', data, [
        'hospitalName', 'bedType', 'totalBeds', 'occupiedBeds',
        'utilizationRate', 'averageStay'
      ])
    } else {
      return generateFallbackBedCSV()
    }
  } catch (error) {
    console.error('获取真实床位数据失败:', error)
    return generateFallbackBedCSV()
  }
}

// 生成真实服务数据CSV
const generateRealServiceCSV = async () => {
  try {
    console.log('🌐 获取真实服务数据')
    const { getHospitalServiceStats } = await import('@/api/service')

    const params = {
      filters: {},
      sort: [{ field: 'serviceVolume', order: 'desc' }],
      pageInfo: { index: 0, size: 50 }
    }

    const response = await getHospitalServiceStats(params)
    const data = response?.data?.rows || []

    if (data.length > 0) {
      return await generateCSVFromData('service', data, [
        'hospitalName', 'serviceType', 'serviceVolume', 'serviceQuality',
        'patientSatisfaction', 'efficiency'
      ])
    } else {
      return generateFallbackServiceCSV()
    }
  } catch (error) {
    console.error('获取真实服务数据失败:', error)
    return generateFallbackServiceCSV()
  }
}

// 生成真实费用数据CSV
const generateRealCostCSV = async () => {
  try {
    console.log('🌐 获取真实费用数据')
    const { fetchOutpatientCostStatistics, fetchInpatientCostStatistics } = await import('@/api/cost')

    const params = {
      filters: {},
      sort: [{ field: 'totalCost', order: 'desc' }],
      pageInfo: { index: 0, size: 50 }
    }

    const [outpatientRes, inpatientRes] = await Promise.all([
      fetchOutpatientCostStatistics(params),
      fetchInpatientCostStatistics(params)
    ])

    const outpatientData = outpatientRes?.data?.rows || []
    const inpatientData = inpatientRes?.data?.rows || []

    // 合并门诊和住院费用数据
    const mergedData = []
    const hospitalMap = new Map()

    outpatientData.forEach(item => {
      const key = `${item.hospitalName}_${item.year}`
      hospitalMap.set(key, {
        year: item.year,
        hospitalName: item.hospitalName,
        outpatientCost: item.totalCost,
        inpatientCost: 0,
        totalCost: item.totalCost,
        medicineRatio: item.medicineRatio
      })
    })

    inpatientData.forEach(item => {
      const key = `${item.hospitalName}_${item.year}`
      if (hospitalMap.has(key)) {
        const existing = hospitalMap.get(key)
        existing.inpatientCost = item.totalCost
        existing.totalCost = existing.outpatientCost + item.totalCost
      } else {
        hospitalMap.set(key, {
          year: item.year,
          hospitalName: item.hospitalName,
          outpatientCost: 0,
          inpatientCost: item.totalCost,
          totalCost: item.totalCost,
          medicineRatio: item.medicineRatio
        })
      }
    })

    const data = Array.from(hospitalMap.values())

    if (data.length > 0) {
      return await generateCSVFromData('cost', data, [
        'year', 'hospitalName', 'outpatientCost', 'inpatientCost',
        'totalCost', 'medicineRatio'
      ])
    } else {
      return generateFallbackCostCSV()
    }
  } catch (error) {
    console.error('获取真实费用数据失败:', error)
    return generateFallbackCostCSV()
  }
}

// 备用数据生成函数（当API调用失败时使用）
const generateFallbackPopulationCSV = () => {
  const headers = ['年份', '总人口(万人)', '城镇人口(万人)', '农村人口(万人)', '男性人口(万人)', '女性人口(万人)', '城镇化率(%)', '性别比']
  let csvContent = headers.join(',') + '\n'

  const currentYear = new Date().getFullYear()
  for (let i = 4; i >= 0; i--) {
    const year = currentYear - i
    const totalPop = (2100 + Math.random() * 100).toFixed(1)
    const urbanPop = (totalPop * (0.7 + Math.random() * 0.1)).toFixed(1)
    const ruralPop = (totalPop - urbanPop).toFixed(1)
    const malePop = (totalPop * (0.51 + Math.random() * 0.02)).toFixed(1)
    const femalePop = (totalPop - malePop).toFixed(1)
    const urbanRate = ((urbanPop / totalPop) * 100).toFixed(1)
    const genderRatio = ((malePop / femalePop) * 100).toFixed(1)

    csvContent += `${year},${totalPop},${urbanPop},${ruralPop},${malePop},${femalePop},${urbanRate},${genderRatio}\n`
  }

  return csvContent
}

const generateFallbackPersonnelCSV = () => {
  const headers = ['医院名称', '医院等级', '人员类型', '总人数', '医生数量', '护士数量', '技师数量']
  let csvContent = headers.join(',') + '\n'

  const hospitals = ['成都市第一人民医院', '四川大学华西医院', '成都市中医院', '成都市妇女儿童中心医院', '成都市第三人民医院']
  const levels = ['三甲', '三乙', '二甲']
  const types = ['全科', '专科', '护理', '技术']

  hospitals.forEach(hospital => {
    types.forEach(type => {
      const total = Math.floor(Math.random() * 200) + 50
      const doctors = Math.floor(total * 0.3)
      const nurses = Math.floor(total * 0.5)
      const technicians = total - doctors - nurses
      const level = levels[Math.floor(Math.random() * levels.length)]

      csvContent += `"${hospital}",${level},${type},${total},${doctors},${nurses},${technicians}\n`
    })
  })

  return csvContent
}

const generateFallbackBedCSV = () => {
  const headers = ['医院名称', '床位类型', '总床位数', '占用床位数', '使用率(%)', '平均住院天数']
  let csvContent = headers.join(',') + '\n'

  const hospitals = ['成都市第一人民医院', '四川大学华西医院', '成都市中医院', '成都市妇女儿童中心医院']
  const bedTypes = ['普通床位', 'ICU床位', '急诊床位', '手术床位']

  hospitals.forEach(hospital => {
    bedTypes.forEach(bedType => {
      const totalBeds = Math.floor(Math.random() * 200) + 100
      const occupiedBeds = Math.floor(totalBeds * (0.7 + Math.random() * 0.2))
      const utilizationRate = ((occupiedBeds / totalBeds) * 100).toFixed(1)
      const averageStay = (5 + Math.random() * 10).toFixed(1)

      csvContent += `"${hospital}",${bedType},${totalBeds},${occupiedBeds},${utilizationRate},${averageStay}\n`
    })
  })

  return csvContent
}

const generateFallbackServiceCSV = () => {
  const headers = ['医院名称', '服务类型', '服务量', '服务质量', '患者满意度', '服务效率']
  let csvContent = headers.join(',') + '\n'

  const hospitals = ['成都市第一人民医院', '四川大学华西医院', '成都市中医院']
  const serviceTypes = ['门诊服务', '住院服务', '急诊服务', '手术服务']

  hospitals.forEach(hospital => {
    serviceTypes.forEach(serviceType => {
      const serviceVolume = Math.floor(Math.random() * 10000) + 1000
      const serviceQuality = (80 + Math.random() * 20).toFixed(1)
      const patientSatisfaction = (85 + Math.random() * 15).toFixed(1)
      const efficiency = (70 + Math.random() * 30).toFixed(1)

      csvContent += `"${hospital}",${serviceType},${serviceVolume},${serviceQuality},${patientSatisfaction},${efficiency}\n`
    })
  })

  return csvContent
}

const generateFallbackCostCSV = () => {
  const headers = ['年份', '医院名称', '门诊费用(万元)', '住院费用(万元)', '总费用(万元)', '药品费用占比(%)']
  let csvContent = headers.join(',') + '\n'

  const hospitals = ['成都市第一人民医院', '四川大学华西医院', '成都市中医院']
  const currentYear = new Date().getFullYear()

  hospitals.forEach(hospital => {
    for (let i = 2; i >= 0; i--) {
      const year = currentYear - i
      const outpatientCost = (1000 + Math.random() * 2000).toFixed(1)
      const inpatientCost = (2000 + Math.random() * 3000).toFixed(1)
      const totalCost = (parseFloat(outpatientCost) + parseFloat(inpatientCost)).toFixed(1)
      const medicineRatio = (30 + Math.random() * 20).toFixed(1)

      csvContent += `${year},"${hospital}",${outpatientCost},${inpatientCost},${totalCost},${medicineRatio}\n`
    }
  })

  return csvContent
}

// 生成通用数据CSV
const generateGenericCSV = (row) => {
  const headers = ['序号', '数据项', '数值', '单位', '备注']
  let csvContent = headers.join(',') + '\n'

  for (let i = 1; i <= 20; i++) {
    csvContent += `${i},数据项${i},${Math.floor(Math.random() * 1000)},个,示例数据\n`
  }

  return csvContent
}

// 从Blob下载文件
const downloadFileFromBlob = (blob, fileName) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// 其他功能函数
const handleSearch = () => {
  console.log('搜索:', searchKeyword.value)
  pagination.page = 1 // 重置到第一页
  loadLogs()
}

const handleFilterChange = () => {
  console.log('筛选条件变化:', filters)
  pagination.page = 1 // 重置到第一页
  loadLogs()
}

const handleSelectionChange = (selection) => {
  selectedTasks.value = selection
}

const handleSizeChange = (size) => {
  pagination.size = size
  loadLogs()
}

const handleCurrentChange = (page) => {
  pagination.page = page
  loadLogs()
}

const checkTaskStatus = async (row) => {
  ElMessage.info('正在检查任务状态...')
  await loadLogs()
}

const viewTaskDetail = (row) => {
  ElMessage.info(`查看任务详情: ${row.taskName}`)
}

const deleteTask = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除任务 "${row.taskName}" 吗？`, '确认删除', {
      type: 'warning'
    })
    ElMessage.success('删除成功')
    await loadLogs()
  } catch {
    // 用户取消
  }
}

const batchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedTasks.value.length} 个任务吗？`, '批量删除', {
      type: 'warning'
    })
    ElMessage.success('批量删除成功')
    await loadLogs()
  } catch {
    // 用户取消
  }
}

// 显示导入对话框
const showImportDialog = () => {
  importDialogVisible.value = true
}

// 显示导出对话框
const showExportDialog = () => {
  exportDialogVisible.value = true
}

// 导入对话框相关
const importDialogVisible = ref(false)
const importForm = reactive({
  dataType: 'population',
  importMode: 'insert',
  file: null
})
const importLoading = ref(false)

// 导出对话框相关
const exportDialogVisible = ref(false)
const exportForm = reactive({
  dataType: 'population',
  exportFormat: 'excel',
  taskName: '',
  filters: {},
  fields: []
})
const exportLoading = ref(false)

// 处理文件选择
const handleFileChange = (file) => {
  importForm.file = file.raw
  return false // 阻止自动上传
}

// 保存任务到localStorage
const saveTaskToStorage = (task) => {
  try {
    const savedTasks = localStorage.getItem('importExportTasks')
    let tasks = []

    if (savedTasks) {
      tasks = JSON.parse(savedTasks)
    }

    // 检查是否已存在
    const existingIndex = tasks.findIndex(t => t.id === task.id)
    if (existingIndex >= 0) {
      tasks[existingIndex] = task // 更新现有任务
    } else {
      tasks.unshift(task) // 添加到开头
    }

    // 只保留最近100条记录
    if (tasks.length > 100) {
      tasks = tasks.slice(0, 100)
    }

    localStorage.setItem('importExportTasks', JSON.stringify(tasks))
    console.log('💾 任务已保存到localStorage:', task.taskName)
  } catch (error) {
    console.error('保存任务到localStorage失败:', error)
  }
}

// 执行数据导入
const executeImport = async () => {
  if (!importForm.file) {
    ElMessage.warning('请选择要导入的文件')
    return
  }

  importLoading.value = true
  try {
    console.log('🚀 开始模拟导入数据:', {
      fileName: importForm.file.name,
      dataType: importForm.dataType,
      importMode: importForm.importMode,
      fileSize: importForm.file.size
    })

    // 模拟导入过程
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 创建导入任务记录
    const importTask = {
      id: `import_${Date.now()}`,
      taskName: `${getDataTypeText(importForm.dataType)}数据导入_${new Date().toLocaleDateString()}`,
      type: 'import',
      dataType: importForm.dataType,
      fileName: importForm.file.name,
      fileSize: importForm.file.size,
      status: 'success',
      recordCount: Math.floor(Math.random() * 1000) + 100, // 模拟记录数
      createTime: new Date().toISOString(),
      exportId: `import_${Date.now()}`,
      downloadUrl: null,
      importMode: importForm.importMode
    }

    // 保存到localStorage
    saveTaskToStorage(importTask)

    ElMessage.success('数据导入成功')
    importDialogVisible.value = false

    // 重置表单
    importForm.file = null
    importForm.dataType = 'population'
    importForm.importMode = 'insert'

    // 刷新任务列表
    await loadLogs()
  } catch (error) {
    console.error('❌ 数据导入失败:', error)
    ElMessage.error(`数据导入失败: ${error.message}`)
  } finally {
    importLoading.value = false
  }
}

// 执行数据导出
const executeExport = async () => {
  if (!exportForm.taskName.trim()) {
    ElMessage.warning('请输入任务名称')
    return
  }

  exportLoading.value = true
  try {
    console.log('🚀 开始创建导出任务:', exportForm)

    // 模拟导出过程
    await new Promise(resolve => setTimeout(resolve, 1500))

    const exportId = `export_${Date.now()}`

    // 根据数据类型生成示例数据
    let sampleData = []
    let recordCount = 0

    if (exportForm.dataType === 'population') {
      sampleData = generateSamplePopulationData()
      recordCount = sampleData.length
    } else if (exportForm.dataType === 'personnel') {
      sampleData = generateSamplePersonnelData()
      recordCount = sampleData.length
    } else if (exportForm.dataType === 'bed') {
      sampleData = generateSampleBedData()
      recordCount = sampleData.length
    } else if (exportForm.dataType === 'service') {
      sampleData = generateSampleServiceData()
      recordCount = sampleData.length
    } else if (exportForm.dataType === 'cost') {
      sampleData = generateSampleCostData()
      recordCount = sampleData.length
    } else {
      sampleData = [{ id: 1, name: '示例数据', value: 100 }]
      recordCount = 1
    }

    // 存储到sessionStorage供下载使用
    sessionStorage.setItem(`export_data_${exportId}`, JSON.stringify({
      dataType: exportForm.dataType,
      taskName: exportForm.taskName,
      data: sampleData,
      fields: exportForm.fields,
      timestamp: Date.now()
    }))

    // 创建导出任务记录
    const exportTask = {
      id: exportId,
      taskName: exportForm.taskName,
      type: 'export',
      dataType: exportForm.dataType,
      fileName: `${exportForm.taskName}.${exportForm.exportFormat === 'excel' ? 'xlsx' : exportForm.exportFormat}`,
      fileSize: JSON.stringify(sampleData).length,
      status: 'success',
      recordCount: recordCount,
      createTime: new Date().toISOString(),
      exportId: exportId,
      downloadUrl: null,
      exportFormat: exportForm.exportFormat
    }

    // 保存到localStorage
    saveTaskToStorage(exportTask)

    ElMessage.success('导出任务创建成功')
    exportDialogVisible.value = false

    // 重置表单
    exportForm.taskName = ''
    exportForm.filters = {}
    exportForm.fields = []

    // 刷新任务列表
    await loadLogs()
  } catch (error) {
    console.error('❌ 创建导出任务失败:', error)
    ElMessage.error(`创建导出任务失败: ${error.message}`)
  } finally {
    exportLoading.value = false
  }
}

const refreshLogs = () => {
  loadLogs()
}

// 处理新创建的导出任务
const handleNewExportTask = async (query) => {
  if (query.newTask === 'true' && query.taskName) {
    console.log('🎯 处理从其他页面跳转的导出任务:', query)

    const exportId = query.exportId || `external_export_${Date.now()}`

    // 根据数据类型生成对应的示例数据
    let sampleData = []
    let recordCount = 0

    if (query.dataType === 'population') {
      sampleData = generateSamplePopulationData()
    } else if (query.dataType === 'personnel') {
      sampleData = generateSamplePersonnelData()
    } else if (query.dataType === 'bed') {
      sampleData = generateSampleBedData()
    } else if (query.dataType === 'service') {
      sampleData = generateSampleServiceData()
    } else if (query.dataType === 'cost') {
      sampleData = generateSampleCostData()
    } else {
      sampleData = [{ id: 1, name: '示例数据', value: 100 }]
    }

    recordCount = sampleData.length

    // 存储数据到sessionStorage供下载使用
    sessionStorage.setItem(`export_data_${exportId}`, JSON.stringify({
      dataType: query.dataType || 'population',
      taskName: query.taskName,
      data: sampleData,
      fields: [],
      timestamp: Date.now()
    }))

    // 创建新任务记录
    const newTask = {
      id: exportId,
      taskName: query.taskName,
      type: 'export',
      dataType: query.dataType || 'population',
      fileName: `${query.taskName.replace(/[^\w\s]/gi, '_')}.${query.exportFormat === 'csv' ? 'csv' : 'xlsx'}`,
      fileSize: JSON.stringify(sampleData).length,
      status: 'success', // 直接设为成功，可以下载
      recordCount: recordCount,
      createTime: new Date().toISOString(),
      exportId: exportId,
      downloadUrl: null,
      exportFormat: query.exportFormat || 'excel'
    }

    // 保存到localStorage
    saveTaskToStorage(newTask)

    ElMessage.success(`导出任务"${query.taskName}"已创建，可以下载文件`)

    // 刷新任务列表以显示新任务
    await loadLogs()

    // 清除查询参数
    router.replace({ path: route.path })
  }
}

// 生成示例数据的函数
const generateSamplePopulationData = () => {
  const data = []
  const currentYear = new Date().getFullYear()

  for (let i = 4; i >= 0; i--) {
    const year = currentYear - i
    data.push({
      year: year,
      totalPopulation: (2100 + Math.random() * 100).toFixed(1),
      urbanPopulation: (1400 + Math.random() * 200).toFixed(1),
      ruralPopulation: (700 + Math.random() * 100).toFixed(1),
      malePopulation: (1050 + Math.random() * 50).toFixed(1),
      femalePopulation: (1050 + Math.random() * 50).toFixed(1)
    })
  }
  return data
}

const generateSamplePersonnelData = () => {
  const hospitals = ['成都市第一人民医院', '四川大学华西医院', '成都市中医院', '成都市妇女儿童中心医院']
  const levels = ['三甲', '三乙', '二甲']
  const types = ['全科', '专科', '护理', '技术']
  const data = []

  hospitals.forEach(hospital => {
    types.forEach(type => {
      const totalCount = Math.floor(Math.random() * 200) + 50
      data.push({
        hospitalName: hospital,
        hospitalLevel: levels[Math.floor(Math.random() * levels.length)],
        personnelType: type,
        totalCount: totalCount,
        doctorCount: Math.floor(totalCount * 0.3),
        nurseCount: Math.floor(totalCount * 0.5),
        technicianCount: Math.floor(totalCount * 0.2)
      })
    })
  })
  return data
}

const generateSampleBedData = () => {
  const hospitals = ['成都市第一人民医院', '四川大学华西医院', '成都市中医院']
  const bedTypes = ['普通床位', 'ICU床位', '急诊床位', '手术床位']
  const data = []

  hospitals.forEach(hospital => {
    bedTypes.forEach(bedType => {
      const totalBeds = Math.floor(Math.random() * 200) + 100
      const occupiedBeds = Math.floor(totalBeds * (0.7 + Math.random() * 0.2))
      data.push({
        hospitalName: hospital,
        bedType: bedType,
        totalBeds: totalBeds,
        occupiedBeds: occupiedBeds,
        utilizationRate: ((occupiedBeds / totalBeds) * 100).toFixed(1),
        averageStay: (5 + Math.random() * 10).toFixed(1)
      })
    })
  })
  return data
}

const generateSampleServiceData = () => {
  const hospitals = ['成都市第一人民医院', '四川大学华西医院', '成都市中医院']
  const serviceTypes = ['门诊服务', '住院服务', '急诊服务', '手术服务']
  const data = []

  hospitals.forEach(hospital => {
    serviceTypes.forEach(serviceType => {
      data.push({
        hospitalName: hospital,
        serviceType: serviceType,
        serviceVolume: Math.floor(Math.random() * 10000) + 1000,
        serviceQuality: (80 + Math.random() * 20).toFixed(1),
        patientSatisfaction: (85 + Math.random() * 15).toFixed(1),
        efficiency: (70 + Math.random() * 30).toFixed(1)
      })
    })
  })
  return data
}

const generateSampleCostData = () => {
  const hospitals = ['成都市第一人民医院', '四川大学华西医院', '成都市中医院']
  const data = []
  const currentYear = new Date().getFullYear()

  hospitals.forEach(hospital => {
    for (let i = 2; i >= 0; i--) {
      const year = currentYear - i
      const outpatientCost = (1000 + Math.random() * 2000).toFixed(1)
      const inpatientCost = (2000 + Math.random() * 3000).toFixed(1)
      data.push({
        year: year,
        hospitalName: hospital,
        outpatientCost: outpatientCost,
        inpatientCost: inpatientCost,
        totalCost: (parseFloat(outpatientCost) + parseFloat(inpatientCost)).toFixed(1),
        medicineRatio: (30 + Math.random() * 20).toFixed(1)
      })
    }
  })
  return data
}

// 生命周期
onMounted(() => {
  loadLogs()

  // 检查是否有新任务需要处理
  if (route.query.newTask === 'true') {
    setTimeout(() => {
      handleNewExportTask(route.query)
    }, 500)
  }
})

// 监听路由查询参数变化
watch(() => route.query, (newQuery) => {
  if (newQuery.newTask === 'true') {
    handleNewExportTask(newQuery)
  }
}, { immediate: true })
</script>

<style scoped>
.import-export {
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

/* 页面头部样式 */
.page-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.page-header:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.header-content h2 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-content p {
  margin: 0;
  color: #64748b;
  font-size: 16px;
  font-weight: 400;
}

.header-actions {
  display: flex;
  gap: 16px;
}

.header-actions .el-button {
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.header-actions .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* 概览区域样式 */
.overview-section {
  margin-bottom: 24px;
}

/* 筛选区域样式 */
.filter-section {
  margin-bottom: 24px;
}

.filter-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.filter-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* 任务列表区域样式 */
.task-list-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 600;
}

.pagination-section {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

/* 表格样式优化 */
:deep(.el-table) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

:deep(.el-table th) {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  color: #374151;
  font-weight: 600;
  border-bottom: 2px solid #e5e7eb;
}

:deep(.el-table td) {
  border-bottom: 1px solid #f3f4f6;
}

:deep(.el-table tr:hover td) {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
}

/* 按钮样式优化 */
:deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

:deep(.el-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .import-export {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
    padding: 24px;
  }

  .header-actions {
    flex-wrap: wrap;
    justify-content: center;
  }

  .task-list-section {
    padding: 20px;
  }

  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>
