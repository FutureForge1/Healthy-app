<template>
  <div class="quality-check">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2>数据质量检查</h2>
        <p>对数据进行完整性、准确性、一致性等多维度质量检查</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="startQualityCheck">
          <el-icon><Search /></el-icon>
          开始检查
        </el-button>
        <el-button type="success" @click="showCleanDialog">
          <el-icon><Tools /></el-icon>
          数据清洗
        </el-button>
        <el-button @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 质量概览 -->
    <div class="overview-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="quality-card overall">
            <div class="card-header">
              <h4>整体质量评分</h4>
              <el-icon><DataAnalysis /></el-icon>
            </div>
            <div class="score-display">
              <div class="score">{{ qualityOverview.overallScore }}</div>
              <div class="score-label">分</div>
            </div>
            <div class="score-trend">
              <span :class="qualityOverview.trend > 0 ? 'positive' : 'negative'">
                <el-icon v-if="qualityOverview.trend > 0"><ArrowUp /></el-icon>
                <el-icon v-else><ArrowDown /></el-icon>
                {{ Math.abs(qualityOverview.trend) }}%
              </span>
              较上次检查
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="quality-card completeness">
            <div class="card-header">
              <h4>完整性</h4>
              <el-icon><DataLine /></el-icon>
            </div>
            <div class="metric-display">
              <el-progress
                type="circle"
                :percentage="qualityOverview.completeness"
                :width="80"
                :stroke-width="8"
                :color="getProgressColor(qualityOverview.completeness)"
              />
              <div class="metric-details">
                <div class="metric-value">{{ qualityOverview.completeness }}%</div>
                <div class="metric-desc">缺失率: {{ 100 - qualityOverview.completeness }}%</div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="quality-card accuracy">
            <div class="card-header">
              <h4>准确性</h4>
              <el-icon><CircleCheck /></el-icon>
            </div>
            <div class="metric-display">
              <el-progress
                type="circle"
                :percentage="qualityOverview.accuracy"
                :width="80"
                :stroke-width="8"
                :color="getProgressColor(qualityOverview.accuracy)"
              />
              <div class="metric-details">
                <div class="metric-value">{{ qualityOverview.accuracy }}%</div>
                <div class="metric-desc">错误率: {{ 100 - qualityOverview.accuracy }}%</div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="quality-card consistency">
            <div class="card-header">
              <h4>一致性</h4>
              <el-icon><Connection /></el-icon>
            </div>
            <div class="metric-display">
              <el-progress
                type="circle"
                :percentage="qualityOverview.consistency"
                :width="80"
                :stroke-width="8"
                :color="getProgressColor(qualityOverview.consistency)"
              />
              <div class="metric-details">
                <div class="metric-value">{{ qualityOverview.consistency }}%</div>
                <div class="metric-desc">冲突率: {{ 100 - qualityOverview.consistency }}%</div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 检查配置 -->
    <div class="config-section">
      <div class="section-header">
        <h4>检查配置</h4>
      </div>
      <el-form :model="checkConfig" label-width="120px" inline>
        <el-form-item label="数据源">
          <el-select v-model="checkConfig.dataSource" placeholder="选择数据源" style="width: 200px">
            <el-option label="人口数据" value="population" />
            <el-option label="医疗机构" value="institution" />
            <el-option label="医护人员" value="personnel" />
            <el-option label="床位信息" value="bed" />
            <el-option label="服务数据" value="service" />
            <el-option label="费用数据" value="cost" />
          </el-select>
        </el-form-item>
        <el-form-item label="检查类型">
          <el-checkbox-group v-model="checkConfig.checkTypes">
            <el-checkbox value="completeness">完整性检查</el-checkbox>
            <el-checkbox value="accuracy">准确性检查</el-checkbox>
            <el-checkbox value="consistency">一致性检查</el-checkbox>
            <el-checkbox value="validity">有效性检查</el-checkbox>
            <el-checkbox value="uniqueness">唯一性检查</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="checkConfig.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 300px"
          />
        </el-form-item>
      </el-form>
    </div>

    <!-- 检查结果 -->
    <div class="results-section">
      <div class="section-header">
        <h4>检查结果</h4>
        <div class="header-actions">
          <el-button type="primary" size="small" @click="exportResults">
            <el-icon><Download /></el-icon>
            导出报告
          </el-button>
        </div>
      </div>

      <el-tabs v-model="activeTab" type="card">
        <!-- 问题汇总 -->
        <el-tab-pane label="问题汇总" name="summary">
          <div class="summary-content">
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="chart-container">
                  <h5>问题分布</h5>
                  <!-- 使用新的饼图组件 -->
                  <PieChart
                    :data="problemDistributionData"
                    title=""
                    height="300px"
                    :radius="'70%'"
                    :show-percentage="true"
                    class="chart"
                  />
                </div>
              </el-col>
              <el-col :span="12">
                <div class="chart-container">
                  <h5>严重程度分布</h5>
                  <!-- 使用新的柱状图组件 -->
                  <BarChart
                    :data="severityData"
                    :x-axis-data="severityXAxis"
                    title=""
                    height="300px"
                    :colors="['#ee6666', '#fac858', '#91cc75']"
                    class="chart"
                  />
                </div>
              </el-col>
            </el-row>
            
            <div class="problem-list">
              <h5>主要问题列表</h5>
              <el-table :data="problemList" stripe border>
                <el-table-column prop="type" label="问题类型" width="120">
                  <template #default="{ row }">
                    <el-tag :type="getProblemTypeTag(row.type)">
                      {{ getProblemTypeText(row.type) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="description" label="问题描述" min-width="200" />
                <el-table-column prop="severity" label="严重程度" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getSeverityTag(row.severity)">
                      {{ getSeverityText(row.severity) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="affectedRecords" label="影响记录数" width="120">
                  <template #default="{ row }">
                    {{ row.affectedRecords.toLocaleString() }}
                  </template>
                </el-table-column>
                <el-table-column prop="suggestion" label="建议处理方式" min-width="180" />
                <el-table-column label="操作" width="120">
                  <template #default="{ row }">
                    <el-button type="primary" size="small" @click="viewProblemDetail(row)">
                      查看详情
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>

        <!-- 详细报告 -->
        <el-tab-pane label="详细报告" name="detail">
          <div class="detail-content">
            <el-collapse v-model="activeCollapse">
              <el-collapse-item title="完整性检查结果" name="completeness">
                <div class="check-result">
                  <div class="result-summary">
                    <el-statistic title="完整性评分" :value="detailResults.completeness.score" suffix="分" />
                    <el-statistic title="缺失字段数" :value="detailResults.completeness.missingFields" suffix="个" />
                    <el-statistic title="缺失记录数" :value="detailResults.completeness.missingRecords" suffix="条" />
                  </div>
                  <el-table :data="detailResults.completeness.details" size="small">
                    <el-table-column prop="field" label="字段名" />
                    <el-table-column prop="missingCount" label="缺失数量" />
                    <el-table-column prop="missingRate" label="缺失率">
                      <template #default="{ row }">
                        {{ row.missingRate }}%
                      </template>
                    </el-table-column>
                    <el-table-column prop="impact" label="影响程度">
                      <template #default="{ row }">
                        <el-tag :type="getImpactTag(row.impact)">
                          {{ row.impact }}
                        </el-tag>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-collapse-item>

              <el-collapse-item title="准确性检查结果" name="accuracy">
                <div class="check-result">
                  <div class="result-summary">
                    <el-statistic title="准确性评分" :value="detailResults.accuracy.score" suffix="分" />
                    <el-statistic title="错误记录数" :value="detailResults.accuracy.errorRecords" suffix="条" />
                    <el-statistic title="错误类型数" :value="detailResults.accuracy.errorTypes" suffix="种" />
                  </div>
                  <el-table :data="detailResults.accuracy.details" size="small">
                    <el-table-column prop="errorType" label="错误类型" />
                    <el-table-column prop="errorCount" label="错误数量" />
                    <el-table-column prop="errorRate" label="错误率">
                      <template #default="{ row }">
                        {{ row.errorRate }}%
                      </template>
                    </el-table-column>
                    <el-table-column prop="examples" label="示例" min-width="200" />
                  </el-table>
                </div>
              </el-collapse-item>

              <el-collapse-item title="一致性检查结果" name="consistency">
                <div class="check-result">
                  <div class="result-summary">
                    <el-statistic title="一致性评分" :value="detailResults.consistency.score" suffix="分" />
                    <el-statistic title="冲突记录数" :value="detailResults.consistency.conflictRecords" suffix="条" />
                    <el-statistic title="冲突规则数" :value="detailResults.consistency.conflictRules" suffix="个" />
                  </div>
                  <el-table :data="detailResults.consistency.details" size="small">
                    <el-table-column prop="rule" label="一致性规则" />
                    <el-table-column prop="conflictCount" label="冲突数量" />
                    <el-table-column prop="conflictRate" label="冲突率">
                      <template #default="{ row }">
                        {{ row.conflictRate }}%
                      </template>
                    </el-table-column>
                    <el-table-column prop="description" label="冲突描述" min-width="200" />
                  </el-table>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>

        <!-- 历史记录 -->
        <el-tab-pane label="历史记录" name="history">
          <div class="history-content">
            <el-table :data="historyList" stripe border>
              <el-table-column prop="checkTime" label="检查时间" width="160">
                <template #default="{ row }">
                  {{ formatDateTime(row.checkTime) }}
                </template>
              </el-table-column>
              <el-table-column prop="dataSource" label="数据源" width="120">
                <template #default="{ row }">
                  {{ getDataSourceText(row.dataSource) }}
                </template>
              </el-table-column>
              <el-table-column prop="overallScore" label="整体评分" width="100">
                <template #default="{ row }">
                  <span :class="getScoreClass(row.overallScore)">
                    {{ row.overallScore }}分
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="problemCount" label="问题数量" width="100" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="getStatusTag(row.status)">
                    {{ getStatusText(row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="operator" label="操作人" width="120" />
              <el-table-column label="操作" width="160">
                <template #default="{ row }">
                  <el-button type="primary" size="small" @click="viewHistoryDetail(row)">
                    查看详情
                  </el-button>
                  <el-button type="success" size="small" @click="downloadReport(row)">
                    下载报告
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 数据清洗对话框 -->
    <el-dialog
      v-model="cleanDialogVisible"
      title="数据清洗"
      width="800px"
      :before-close="handleCleanDialogClose"
    >
      <el-form :model="cleanConfig" label-width="120px">
        <el-form-item label="清洗规则">
          <el-checkbox-group v-model="cleanConfig.rules">
            <el-checkbox value="removeDuplicates">去除重复数据</el-checkbox>
            <el-checkbox value="fillMissing">填充缺失值</el-checkbox>
            <el-checkbox value="standardizeFormat">标准化格式</el-checkbox>
            <el-checkbox value="validateRange">范围验证</el-checkbox>
            <el-checkbox value="correctTypos">纠正拼写错误</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="缺失值处理">
          <el-radio-group v-model="cleanConfig.missingValueStrategy">
            <el-radio value="delete">删除记录</el-radio>
            <el-radio value="mean">均值填充</el-radio>
            <el-radio value="median">中位数填充</el-radio>
            <el-radio value="mode">众数填充</el-radio>
            <el-radio value="custom">自定义值</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="cleanConfig.missingValueStrategy === 'custom'" label="自定义值">
          <el-input v-model="cleanConfig.customValue" placeholder="请输入自定义填充值" />
        </el-form-item>
        <el-form-item label="备份原数据">
          <el-switch v-model="cleanConfig.backupOriginal" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cleanDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="startDataCleaning" :loading="cleaning">
            开始清洗
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { PieChart, BarChart } from '@/components/charts'
import {
  Search,
  Tools,
  Refresh,
  DataAnalysis,
  DataLine,
  CircleCheck,
  Connection,
  ArrowUp,
  ArrowDown,
  Download
} from '@element-plus/icons-vue'
import { visualizationApi } from '@/api/visualization'

// 响应式数据
const loading = ref(false)
const cleaning = ref(false)
const cleanDialogVisible = ref(false)
const activeTab = ref('summary')
const activeCollapse = ref(['completeness', 'accuracy', 'consistency'])

// 图表数据
const problemDistributionData = ref([
  { name: '缺失值', value: 1250, color: '#5470c6' },
  { name: '格式错误', value: 856, color: '#91cc75' },
  { name: '重复数据', value: 432, color: '#fac858' },
  { name: '范围错误', value: 392, color: '#ee6666' },
  { name: '逻辑错误', value: 278, color: '#73c0de' }
])

const severityData = ref([432, 1248, 1592])
const severityXAxis = ref(['低', '中', '高'])

// 检查配置
const checkConfig = reactive({
  dataSource: 'population',
  checkTypes: ['completeness', 'accuracy', 'consistency'],
  dateRange: null
})

// 清洗配置
const cleanConfig = reactive({
  rules: ['removeDuplicates', 'fillMissing'],
  missingValueStrategy: 'mean',
  customValue: '',
  backupOriginal: true
})

// 质量概览数据
const qualityOverview = reactive({
  overallScore: 87,
  trend: 5.2,
  completeness: 92,
  accuracy: 89,
  consistency: 85
})

// 问题列表
const problemList = ref([
  {
    type: 'missing',
    description: '人口数据中年龄字段存在大量缺失值',
    severity: 'high',
    affectedRecords: 1250,
    suggestion: '使用统计方法填充或删除缺失记录'
  },
  {
    type: 'format',
    description: '电话号码格式不统一',
    severity: 'medium',
    affectedRecords: 856,
    suggestion: '标准化电话号码格式'
  },
  {
    type: 'duplicate',
    description: '发现重复的身份证号记录',
    severity: 'high',
    affectedRecords: 342,
    suggestion: '去除重复记录或合并相关信息'
  }
])

// 详细结果
const detailResults = reactive({
  completeness: {
    score: 92,
    missingFields: 5,
    missingRecords: 1250,
    details: [
      { field: '年龄', missingCount: 1250, missingRate: 8.3, impact: '高' },
      { field: '联系电话', missingCount: 856, missingRate: 5.7, impact: '中' },
      { field: '邮箱地址', missingCount: 432, missingRate: 2.9, impact: '低' }
    ]
  },
  accuracy: {
    score: 89,
    errorRecords: 1680,
    errorTypes: 8,
    details: [
      { errorType: '格式错误', errorCount: 856, errorRate: 5.7, examples: '电话号码格式不正确' },
      { errorType: '范围错误', errorCount: 432, errorRate: 2.9, examples: '年龄超出合理范围' },
      { errorType: '类型错误', errorCount: 392, errorRate: 2.6, examples: '数字字段包含文本' }
    ]
  },
  consistency: {
    score: 85,
    conflictRecords: 2250,
    conflictRules: 6,
    details: [
      { rule: '年龄与出生日期一致性', conflictCount: 856, conflictRate: 5.7, description: '年龄与出生日期计算不符' },
      { rule: '地址与区域编码一致性', conflictCount: 432, conflictRate: 2.9, description: '地址与区域编码不匹配' }
    ]
  }
})

// 历史记录
const historyList = ref([
  {
    id: 1,
    checkTime: '2023-12-01 10:30:00',
    dataSource: 'population',
    overallScore: 87,
    problemCount: 15,
    status: 'completed',
    operator: '张三'
  },
  {
    id: 2,
    checkTime: '2023-11-28 14:15:00',
    dataSource: 'institution',
    overallScore: 92,
    problemCount: 8,
    status: 'completed',
    operator: '李四'
  }
])

// 获取进度条颜色
const getProgressColor = (percentage) => {
  if (percentage >= 90) return '#67c23a'
  if (percentage >= 70) return '#e6a23c'
  return '#f56c6c'
}

// 获取问题类型标签
const getProblemTypeTag = (type) => {
  const typeMap = {
    'missing': 'warning',
    'format': 'info',
    'duplicate': 'danger',
    'range': 'warning',
    'consistency': 'danger'
  }
  return typeMap[type] || ''
}

// 获取问题类型文本
const getProblemTypeText = (type) => {
  const textMap = {
    'missing': '缺失值',
    'format': '格式错误',
    'duplicate': '重复数据',
    'range': '范围错误',
    'consistency': '一致性错误'
  }
  return textMap[type] || '未知'
}

// 获取严重程度标签
const getSeverityTag = (severity) => {
  const severityMap = {
    'low': 'success',
    'medium': 'warning',
    'high': 'danger'
  }
  return severityMap[severity] || ''
}

// 获取严重程度文本
const getSeverityText = (severity) => {
  const textMap = {
    'low': '低',
    'medium': '中',
    'high': '高'
  }
  return textMap[severity] || '未知'
}

// 获取影响程度标签
const getImpactTag = (impact) => {
  const impactMap = {
    '低': 'success',
    '中': 'warning',
    '高': 'danger'
  }
  return impactMap[impact] || ''
}

// 获取数据源文本
const getDataSourceText = (dataSource) => {
  const textMap = {
    'population': '人口数据',
    'institution': '医疗机构',
    'personnel': '医护人员',
    'bed': '床位信息',
    'service': '服务数据',
    'cost': '费用数据'
  }
  return textMap[dataSource] || '未知'
}

// 获取评分样式类
const getScoreClass = (score) => {
  if (score >= 90) return 'score-excellent'
  if (score >= 70) return 'score-good'
  return 'score-poor'
}

// 获取状态标签
const getStatusTag = (status) => {
  const statusMap = {
    'completed': 'success',
    'running': 'warning',
    'failed': 'danger'
  }
  return statusMap[status] || ''
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    'completed': '已完成',
    'running': '进行中',
    'failed': '失败'
  }
  return textMap[status] || '未知'
}

// 格式化日期时间
const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

// 更新图表数据（现在只需要更新响应式数据）
const updateCharts = () => {
  // 数据已经在响应式变量中定义，组件会自动响应变化
}

// 开始质量检查
const startQualityCheck = async () => {
  if (!checkConfig.dataSource) {
    ElMessage.warning('请选择数据源')
    return
  }
  if (checkConfig.checkTypes.length === 0) {
    ElMessage.warning('请选择至少一种检查类型')
    return
  }

  try {
    loading.value = true

    // 调用API
    await visualizationApi.checkDataQuality({
      dataSource: checkConfig.dataSource,
      checkTypes: checkConfig.checkTypes,
      dateRange: checkConfig.dateRange
    })

    ElMessage.success('质量检查已开始，请稍候查看结果')

    // 刷新数据
    await loadData()

    // 重新初始化图表
    await nextTick()
    initCharts()

  } catch (error) {
    ElMessage.error('质量检查失败')
    console.error('质量检查失败:', error)
  } finally {
    loading.value = false
  }
}

// 显示清洗对话框
const showCleanDialog = () => {
  Object.assign(cleanConfig, {
    rules: ['removeDuplicates', 'fillMissing'],
    missingValueStrategy: 'mean',
    customValue: '',
    backupOriginal: true
  })
  cleanDialogVisible.value = true
}

// 开始数据清洗
const startDataCleaning = async () => {
  if (cleanConfig.rules.length === 0) {
    ElMessage.warning('请选择至少一种清洗规则')
    return
  }

  try {
    cleaning.value = true

    // 调用API
    await visualizationApi.cleanData({
      dataSource: checkConfig.dataSource,
      rules: cleanConfig.rules,
      missingValueStrategy: cleanConfig.missingValueStrategy,
      customValue: cleanConfig.customValue,
      backupOriginal: cleanConfig.backupOriginal
    })

    ElMessage.success('数据清洗已开始，请稍候查看结果')
    cleanDialogVisible.value = false

    // 刷新数据
    await loadData()

  } catch (error) {
    ElMessage.error('数据清洗失败')
    console.error('数据清洗失败:', error)
  } finally {
    cleaning.value = false
  }
}

// 查看问题详情
const viewProblemDetail = (problem) => {
  ElMessage.info(`查看问题详情: ${problem.description}`)
}

// 导出结果
const exportResults = () => {
  ElMessage.success('正在导出质量检查报告...')
}

// 查看历史详情
const viewHistoryDetail = (record) => {
  ElMessage.info(`查看历史记录详情: ${record.checkTime}`)
}

// 下载报告
const downloadReport = (record) => {
  ElMessage.success(`开始下载报告: ${record.checkTime}`)
}

// 刷新数据
const refreshData = () => {
  loadData()
}

// 加载数据
const loadData = async () => {
  try {
    loading.value = true

    // 模拟API调用
    // 这里可以调用实际的API获取数据

  } catch (error) {
    ElMessage.error('加载数据失败')
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 对话框关闭处理
const handleCleanDialogClose = (done) => {
  if (cleaning.value) {
    ElMessage.warning('数据清洗正在进行中，请稍候')
    return
  }
  done()
}

// 生命周期
onMounted(() => {
  loadData()
  updateCharts()
})
</script>

<style scoped>
.quality-check {
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

.quality-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.quality-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

.card-header .el-icon {
  font-size: 20px;
  color: #64748b;
}

.score-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 12px;
}

.score {
  font-size: 48px;
  font-weight: 700;
  color: #2c3e50;
}

.score-label {
  font-size: 16px;
  color: #64748b;
  margin-left: 4px;
}

.score-trend {
  text-align: center;
  font-size: 12px;
  color: #64748b;
}

.score-trend .positive {
  color: #52c41a;
}

.score-trend .negative {
  color: #ff4d4f;
}

.metric-display {
  display: flex;
  align-items: center;
  gap: 16px;
}

.metric-details {
  flex: 1;
}

.metric-value {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.metric-desc {
  font-size: 12px;
  color: #8c8c8c;
}

/* 配置区域 */
.config-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
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

/* 结果区域 */
.results-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.summary-content {
  padding: 20px 0;
}

.chart-container {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.chart-container h5 {
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 14px;
  font-weight: 600;
}

.chart {
  width: 100%;
  height: 300px;
}

.problem-list {
  margin-top: 20px;
}

.problem-list h5 {
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 14px;
  font-weight: 600;
}

.detail-content {
  padding: 20px 0;
}

.check-result {
  padding: 16px 0;
}

.result-summary {
  display: flex;
  gap: 40px;
  margin-bottom: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.history-content {
  padding: 20px 0;
}

/* 评分样式 */
.score-excellent {
  color: #52c41a;
  font-weight: 600;
}

.score-good {
  color: #faad14;
  font-weight: 600;
}

.score-poor {
  color: #ff4d4f;
  font-weight: 600;
}

/* 对话框样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .quality-check {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .quality-card {
    margin-bottom: 16px;
  }

  .metric-display {
    flex-direction: column;
    text-align: center;
  }

  .result-summary {
    flex-direction: column;
    gap: 20px;
  }

  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
