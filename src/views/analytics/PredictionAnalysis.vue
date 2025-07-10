<template>
  <div class="prediction-analysis">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <h1>数据预测分析</h1>
        <p>基于机器学习的时间序列预测分析系统</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="showNewPredictionDialog = true">
          <el-icon><Plus /></el-icon>
          新建预测
        </el-button>
      </div>
    </div>

    <!-- 预测模型选择卡片 -->
    <div class="model-cards">
      <div 
        v-for="model in predictionModels" 
        :key="model.type"
        class="model-card"
        :class="{ active: selectedModel === model.type }"
        @click="selectModel(model.type)"
      >
        <div class="model-icon">{{ model.icon }}</div>
        <div class="model-info">
          <h3>{{ model.name }}</h3>
          <p>{{ model.description }}</p>
          <div class="model-features">
            <span v-for="feature in model.features" :key="feature" class="feature-tag">
              {{ feature }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 预测配置面板 -->
    <div class="prediction-config" v-if="selectedModel">
      <el-card>
        <template #header>
          <div class="config-header">
            <span>预测配置 - {{ getModelName(selectedModel) }}</span>
            <el-button type="primary" @click="runPrediction" :loading="predicting">
              <el-icon><TrendCharts /></el-icon>
              开始预测
            </el-button>
          </div>
        </template>

        <el-form :model="predictionForm" label-width="120px" class="prediction-form">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="预测字段">
                <el-select v-model="predictionForm.field" placeholder="选择要预测的字段" filterable>
                  <el-option-group
                    v-for="group in fieldGroups"
                    :key="group.label"
                    :label="group.label"
                  >
                    <el-option
                      v-for="field in group.options"
                      :key="field.value"
                      :label="field.label"
                      :value="field.value"
                    />
                  </el-option-group>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预测步数">
                <el-input-number 
                  v-model="predictionForm.steps" 
                  :min="1" 
                  :max="60" 
                  placeholder="预测未来多少期"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="起始年份">
                <el-date-picker
                  v-model="predictionForm.startYear"
                  type="year"
                  placeholder="选择起始年份"
                  format="YYYY"
                  value-format="YYYY"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束年份">
                <el-date-picker
                  v-model="predictionForm.endYear"
                  type="year"
                  placeholder="选择结束年份"
                  format="YYYY"
                  value-format="YYYY"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 模型特定参数 -->
          <div v-if="selectedModel === 'arima'" class="model-params">
            <h4>ARIMA 参数</h4>
            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item label="p (AR阶数)">
                  <el-input-number v-model="predictionForm.params.p" :min="0" :max="10" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="d (差分阶数)">
                  <el-input-number v-model="predictionForm.params.d" :min="0" :max="3" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="q (MA阶数)">
                  <el-input-number v-model="predictionForm.params.q" :min="0" :max="10" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="selectedModel === 'sarima'" class="model-params">
            <h4>SARIMA 参数</h4>
            <el-row :gutter="24">
              <el-col :span="6">
                <el-form-item label="p">
                  <el-input-number v-model="predictionForm.params.p" :min="0" :max="5" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="d">
                  <el-input-number v-model="predictionForm.params.d" :min="0" :max="2" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="q">
                  <el-input-number v-model="predictionForm.params.q" :min="0" :max="5" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="季节周期">
                  <el-input-number v-model="predictionForm.params.seasonalPeriod" :min="2" :max="12" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="selectedModel === 'neuroprophet'" class="model-params">
            <h4>NeuralProphet 参数</h4>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="增长模式">
                  <el-select v-model="predictionForm.params.growth">
                    <el-option label="线性增长" value="linear" />
                    <el-option label="逻辑增长" value="logistic" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="季节性模式">
                  <el-select v-model="predictionForm.params.seasonalityMode">
                    <el-option label="加法模式" value="additive" />
                    <el-option label="乘法模式" value="multiplicative" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="selectedModel === 'tbats'" class="model-params">
            <h4>TBATS 参数</h4>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="Box-Cox变换">
                  <el-switch v-model="predictionForm.params.useBoxCox" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="趋势组件">
                  <el-switch v-model="predictionForm.params.useTrend" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </el-card>
    </div>

    <!-- 预测结果展示 -->
    <div class="prediction-results" v-if="predictionResult">
      <el-card>
        <template #header>
          <div class="result-header">
            <span>预测结果</span>
            <div class="result-actions">
              <el-button @click="exportResults">
                <el-icon><Download /></el-icon>
                导出结果
              </el-button>
              <el-button @click="savePrediction">
                <el-icon><DocumentAdd /></el-icon>
                保存预测
              </el-button>
            </div>
          </div>
        </template>

        <div class="result-content">
          <!-- 预测图表 -->
          <div class="chart-container">
            <div ref="predictionChart" class="prediction-chart"></div>
          </div>

          <!-- 预测数据表格 -->
          <div class="result-table">
            <EnhancedTable
              :data="formattedPredictionData"
              :title="`${getFieldLabel(predictionForm.field)} 预测数据`"
              :subtitle="`基于 ${selectedModel.toUpperCase()} 模型的 ${predictionForm.steps} 期预测结果`"
              primary-key="period"
              primary-label="预测年份"
              secondary-key="predicted"
              :detail-columns="predictionTableColumns"
              :color-scheme="getPredictionColorScheme()"
              :show-footer="true"
              trend-key="changePercent"
              @row-click="handlePredictionRowClick"
            />
          </div>

          <!-- 预测统计信息 -->
          <div class="model-metrics">
            <h4>预测统计信息</h4>
            <div class="secret-cards-container">
              <SecretCard
                title="历史数据"
                subtitle="Historical Data"
                :value="`${predictionResult.series?.length || 0} 个数据点`"
                description="用于训练模型的历史数据量"
                :icon="DataAnalysis"
                theme="blue"
              />
              <SecretCard
                title="预测数据"
                subtitle="Forecast Data"
                :value="`${predictionResult.forecast?.length || 0} 期预测`"
                description="生成的未来预测数据点"
                :icon="Timer"
                theme="green"
              />
              <SecretCard
                title="增长率"
                subtitle="Growth Rate"
                :value="`${getAverageGrowthRate()}%`"
                description="预测期间的平均年化增长率"
                :icon="TrendCharts"
                theme="purple"
              />
              <SecretCard
                title="预测模型"
                subtitle="ML Model"
                :value="selectedModel.toUpperCase()"
                description="使用的机器学习预测算法"
                :icon="Setting"
                theme="orange"
              />
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 历史预测记录 -->
    <div class="prediction-history">
      <EnhancedTable
        :data="predictionHistory"
        title="历史预测记录"
        subtitle="查看和管理之前的预测分析结果"
        primary-key="field"
        primary-label="预测字段"
        secondary-key="model"
        :detail-columns="historyTableColumns"
        color-scheme="purple"
        :show-footer="true"
        trend-key="accuracy"
        @row-click="handleHistoryRowClick"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'
import {
  Plus,
  TrendCharts,
  Download,
  DocumentAdd,
  Bottom,
  DataAnalysis,
  Timer,
  PieChart,
  Setting
} from '@element-plus/icons-vue'
import { predictionApi, PredictionRequestBuilder, PredictionResultProcessor } from '@/api/prediction'
import { Permission } from '@/utils/permission'
import { useUserStore } from '@/stores/user'
import EnhancedTable from '@/components/EnhancedTable.vue'
import SecretCard from '@/components/SecretCard.vue'

// 用户权限检查
const userStore = useUserStore()

// 响应式数据
const selectedModel = ref('')
const predicting = ref(false)
const predictionResult = ref(null)
const predictionHistory = ref([])
const showNewPredictionDialog = ref(false)

// 图表引用
const predictionChart = ref(null)

// 预测模型配置
const predictionModels = ref([
  {
    type: 'arima',
    name: 'ARIMA',
    icon: '📈',
    description: '自回归积分滑动平均模型，适用于平稳时间序列',
    features: ['经典模型', '快速预测', '适合短期']
  },
  {
    type: 'sarima',
    name: 'SARIMA',
    icon: '🔄',
    description: '季节性ARIMA模型，适用于有季节性模式的数据',
    features: ['季节性', '周期模式', '中期预测']
  },
  {
    type: 'neuroprophet',
    name: 'NeuralProphet',
    icon: '🧠',
    description: '基于神经网络的Prophet模型，处理复杂趋势',
    features: ['深度学习', '复杂趋势', '高精度']
  },
  {
    type: 'tbats',
    name: 'TBATS',
    icon: '⚡',
    description: '复杂季节性模型，支持多重季节性',
    features: ['多季节性', 'Box-Cox', '长期预测']
  }
])

// 预测表单数据
const predictionForm = ref({
  field: 'urbanResident', // 默认选择城镇常住人口
  steps: 12,
  startYear: '2010', // 设置更早的起始年份以确保有足够数据
  endYear: '2023',
  params: {
    // ARIMA参数
    p: 2,
    d: 1,
    q: 2,
    // SARIMA参数
    seasonalPeriod: 12,
    // NeuralProphet参数
    growth: 'linear',
    seasonalityMode: 'additive',
    // TBATS参数
    useBoxCox: true,
    useTrend: true
  }
})

// 可预测字段分组 - 使用后端支持的字段名
const fieldGroups = ref([
  {
    label: '人口统计',
    options: [
      { label: '城镇常住人口', value: 'urbanResident' },
      { label: '乡村常住人口', value: 'ruralResident' },
      { label: '总人口', value: 'totalPopulation' },
      { label: '城镇人口', value: 'urbanPopulation' },
      { label: '农村人口', value: 'ruralPopulation' },
      { label: '出生人口', value: 'births' },
      { label: '死亡人口', value: 'deaths' },
      { label: '自然增长率', value: 'naturalGrowthRate' }
    ]
  },
  {
    label: '医疗机构',
    options: [
      { label: '三级医院数量', value: 'level3Total' },
      { label: '二级医院数量', value: 'level2Total' },
      { label: '一级医院数量', value: 'level1Ungraded' },
      { label: '社区卫生服务中心', value: 'communityHealth' },
      { label: '卫生院数量', value: 'healthCenter' }
    ]
  },
  {
    label: '医疗人员',
    options: [
      { label: '执业医师数量', value: 'licensedPhysicians' },
      { label: '注册护士数量', value: 'registeredNurses' },
      { label: '卫生技术人员', value: 'healthTechnicians' },
      { label: '药剂人员', value: 'pharmacists' }
    ]
  },
  {
    label: '医疗床位',
    options: [
      { label: '医院床位数', value: 'hospitalBeds' },
      { label: '社区床位数', value: 'communityBeds' },
      { label: '床位利用率', value: 'bedUtilizationRate' },
      { label: '平均住院天数', value: 'avgLengthOfStay' }
    ]
  }
])

// 预测表格列配置
const predictionTableColumns = computed(() => [
  {
    key: 'predicted',
    label: '预测值',
    type: 'number',
    decimals: 2,
    formatter: (value) => `${formatNumber(value)} ${getFieldUnit(predictionForm.value.field)}`
  },
  {
    key: 'change',
    label: '变化量',
    type: 'trend',
    formatter: (value) => {
      const sign = value >= 0 ? '+' : ''
      return `${sign}${formatNumber(value)}`
    }
  },
  {
    key: 'changePercent',
    label: '变化率',
    type: 'percentage',
    decimals: 2,
    formatter: (value) => {
      const sign = value >= 0 ? '+' : ''
      return `${sign}${value.toFixed(2)}%`
    }
  }
])

// 历史记录表格列配置
const historyTableColumns = computed(() => [
  {
    key: 'id',
    label: 'ID',
    type: 'number'
  },
  {
    key: 'steps',
    label: '预测步数',
    type: 'number',
    formatter: (value) => `${value} 期`
  },
  {
    key: 'accuracy',
    label: '预测精度',
    type: 'percentage',
    decimals: 1,
    formatter: (value) => `${(value * 100).toFixed(1)}%`
  },
  {
    key: 'createTime',
    label: '创建时间',
    formatter: (value) => new Date(value).toLocaleDateString('zh-CN')
  }
])

// 计算属性
const formattedPredictionData = computed(() => {
  if (!predictionResult.value || !predictionResult.value.forecast) {
    return []
  }

  const forecastData = predictionResult.value.forecast
  const historicalData = predictionResult.value.series || []
  const lastHistoricalValue = historicalData[historicalData.length - 1] || 0
  const startYear = parseInt(predictionForm.value.startYear)

  return forecastData.map((value, index) => {
    const year = startYear + historicalData.length + index
    const previousValue = index === 0 ? lastHistoricalValue : forecastData[index - 1]
    const change = value - previousValue
    const changePercent = previousValue !== 0 ? (change / previousValue) * 100 : 0

    return {
      period: year.toString(),
      predicted: value,
      change: change,
      changePercent: changePercent
    }
  })
})

// 方法
const selectModel = (modelType) => {
  selectedModel.value = modelType
  // 重置参数为默认值
  resetModelParams()
}

const resetModelParams = () => {
  predictionForm.value.params = {
    p: 1, d: 1, q: 1,
    seasonalPeriod: 12,
    growth: 'linear',
    seasonalityMode: 'additive',
    useBoxCox: true,
    useTrend: true
  }
}

const getModelName = (modelType) => {
  const model = predictionModels.value.find(m => m.type === modelType)
  return model ? model.name : ''
}

const runPrediction = async () => {
  if (!predictionForm.value.field) {
    ElMessage.warning('请选择要预测的字段')
    return
  }

  predicting.value = true
  try {
    // 使用请求构建器构建预测请求
    const builder = new PredictionRequestBuilder()
      .setField(predictionForm.value.field)
      .setTimeRange(
        parseInt(predictionForm.value.startYear),
        parseInt(predictionForm.value.endYear)
      )
      .setSteps(predictionForm.value.steps)

    // 根据模型类型设置参数
    const params = predictionForm.value.params
    switch (selectedModel.value) {
      case 'arima':
        builder.setArimaParams(params.p, params.d, params.q)
        break
      case 'sarima':
        builder.setSarimaParams(params.p, params.d, params.q, params.seasonalPeriod)
        break
      case 'neuroprophet':
        builder.setNeuralProphetParams(params.growth, params.seasonalityMode)
        break
      case 'tbats':
        builder.setTbatsParams(params.useBoxCox, params.useTrend)
        break
    }

    const predictRequest = builder.build()
    console.log('预测请求:', JSON.stringify(predictRequest, null, 2))

    // 验证请求格式
    if (!predictRequest.predictDO.toPredict) {
      ElMessage.error('请选择要预测的字段')
      return
    }

    // 验证ARIMA参数
    if (selectedModel.value === 'arima') {
      const { p, d, q } = predictRequest.parameter
      if (p + d + q < 3) {
        ElMessage.warning('ARIMA参数 p+d+q 应该大于等于3，以确保有足够的数据进行预测')
      }
    }

    // 调用预测API
    const response = await predictionApi.predict(selectedModel.value, predictRequest)
    console.log('预测响应:', response)

    if (response.status === 0 || response.code === 0) {
      predictionResult.value = response.data

      const forecastCount = response.data.forecast?.length || 0
      const modelName = selectedModel.value.toUpperCase()

      ElMessage.success(`${modelName} 预测完成！生成了 ${forecastCount} 个预测数据点`)

      // 渲染预测图表
      await nextTick()
      renderPredictionChart()
    } else {
      ElMessage.error(response.message || '预测失败')
    }
  } catch (error) {
    console.error('预测错误:', error)

    // 更详细的错误信息
    if (error.response) {
      console.error('错误响应:', error.response.data)
      ElMessage.error(`预测失败: ${error.response.status} - ${error.response.data || '服务器内部错误'}`)
    } else if (error.request) {
      console.error('请求失败:', error.request)
      ElMessage.error('网络请求失败，请检查网络连接')
    } else {
      console.error('其他错误:', error.message)
      ElMessage.error(`预测服务异常: ${error.message}`)
    }
  } finally {
    predicting.value = false
  }
}

const renderPredictionChart = () => {
  if (!predictionChart.value || !predictionResult.value) return

  const chart = echarts.init(predictionChart.value)

  // 从API响应中获取数据
  const historicalData = predictionResult.value.series || []
  const forecastData = predictionResult.value.forecast || []

  console.log('渲染图表数据:', { historicalData, forecastData })

  // 生成X轴标签（年份）
  const startYear = parseInt(predictionForm.value.startYear)
  const historicalYears = historicalData.map((_, index) => (startYear + index).toString())
  const forecastYears = forecastData.map((_, index) => (startYear + historicalData.length + index).toString())
  const allYears = [...historicalYears, ...forecastYears]

  const option = {
    title: {
      text: `${getFieldLabel(predictionForm.value.field)} 预测分析`,
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      },
      formatter: function(params) {
        let result = `<strong>${params[0].axisValue}年</strong><br/>`
        params.forEach(param => {
          if (param.value !== null && param.value !== undefined) {
            result += `${param.marker}${param.seriesName}: ${param.value.toFixed(2)} ${getFieldUnit(predictionForm.value.field)}<br/>`
          }
        })
        return result
      }
    },
    legend: {
      data: ['历史数据', '预测值'],
      top: 40,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: allYears,
      axisLabel: {
        rotate: 45,
        fontSize: 10
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          opacity: 0.3
        }
      }
    },
    yAxis: {
      type: 'value',
      name: getFieldUnit(predictionForm.value.field),
      nameTextStyle: {
        fontSize: 12
      },
      axisLabel: {
        formatter: function(value) {
          return value.toFixed(1)
        }
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          opacity: 0.3
        }
      }
    },
    series: [
      {
        name: '历史数据',
        type: 'line',
        data: [...historicalData, ...Array(forecastData.length).fill(null)],
        itemStyle: {
          color: '#409EFF',
          borderWidth: 2
        },
        lineStyle: {
          width: 3,
          shadowColor: 'rgba(64, 158, 255, 0.3)',
          shadowBlur: 10
        },
        symbol: 'circle',
        symbolSize: 6,
        markPoint: {
          data: [
            {
              name: '历史数据终点',
              coord: [historicalYears.length - 1, historicalData[historicalData.length - 1]],
              itemStyle: {
                color: '#409EFF'
              }
            }
          ]
        }
      },
      {
        name: '预测值',
        type: 'line',
        data: [...Array(historicalData.length).fill(null), ...forecastData],
        itemStyle: {
          color: '#67C23A',
          borderWidth: 2
        },
        lineStyle: {
          width: 3,
          type: 'dashed',
          shadowColor: 'rgba(103, 194, 58, 0.3)',
          shadowBlur: 10
        },
        symbol: 'diamond',
        symbolSize: 8,
        markPoint: {
          data: [
            {
              name: '预测起点',
              coord: [historicalYears.length, forecastData[0]],
              itemStyle: {
                color: '#67C23A'
              }
            }
          ]
        }
      }
    ],
    animation: true,
    animationDuration: 1500,
    animationEasing: 'cubicOut'
  }

  chart.setOption(option)

  // 响应式调整
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

const getFieldLabel = (field) => {
  for (const group of fieldGroups.value) {
    const option = group.options.find(opt => opt.value === field)
    if (option) return option.label
  }
  return field
}

const getFieldUnit = (field) => {
  if (field.includes('Population') || field.includes('population')) return '万人'
  if (field.includes('Rate') || field.includes('rate')) return '‰'
  if (field.includes('Beds') || field.includes('beds')) return '万张'
  if (field.includes('Total') || field.includes('total')) return '家'
  return ''
}

const formatNumber = (value) => {
  if (typeof value !== 'number') return value
  return value.toFixed(2)
}

const getAccuracyType = (accuracy) => {
  if (accuracy >= 0.9) return 'success'
  if (accuracy >= 0.8) return 'warning'
  return 'danger'
}

const getAverageGrowthRate = () => {
  if (!predictionResult.value || !predictionResult.value.forecast || predictionResult.value.forecast.length === 0) {
    return '0.00'
  }

  const forecast = predictionResult.value.forecast
  const series = predictionResult.value.series || []
  const lastHistoricalValue = series[series.length - 1] || 0

  if (lastHistoricalValue === 0) return '0.00'

  // 计算从历史数据最后一个值到预测数据最后一个值的年化增长率
  const finalValue = forecast[forecast.length - 1]
  const years = forecast.length
  const growthRate = Math.pow(finalValue / lastHistoricalValue, 1 / years) - 1

  return (growthRate * 100).toFixed(2)
}

const getPredictionColorScheme = () => {
  const schemes = {
    arima: 'blue',
    sarima: 'green',
    neuroprophet: 'purple',
    tbats: 'yellow'
  }
  return schemes[selectedModel.value] || 'blue'
}

const handlePredictionRowClick = (row, index) => {
  console.log('点击预测数据行:', row, index)
  // 可以在这里添加行点击处理逻辑，比如显示详细信息
}

const handleHistoryRowClick = (row, index) => {
  console.log('点击历史记录行:', row, index)
  // 加载历史预测记录的详细信息
  viewPrediction(row)
}

const exportResults = async () => {
  if (!predictionResult.value) {
    ElMessage.warning('没有可导出的预测结果')
    return
  }

  try {
    // 这里可以实现导出功能
    ElMessage.success('导出功能开发中...')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

const savePrediction = async () => {
  if (!predictionResult.value) {
    ElMessage.warning('没有可保存的预测结果')
    return
  }

  try {
    const saveData = {
      model: selectedModel.value,
      field: predictionForm.value.field,
      steps: predictionForm.value.steps,
      parameters: predictionForm.value.params,
      result: predictionResult.value
    }

    await predictionApi.savePrediction(saveData)
    ElMessage.success('预测结果已保存')

    // 重新加载历史记录
    loadPredictionHistory()
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  }
}

const viewPrediction = async (prediction) => {
  try {
    const response = await predictionApi.getPredictionDetail(prediction.id)
    if (response.status === 0) {
      predictionResult.value = response.data.result
      selectedModel.value = response.data.model

      // 渲染图表
      await nextTick()
      renderPredictionChart()

      ElMessage.success('预测记录已加载')
    }
  } catch (error) {
    console.error('加载预测记录失败:', error)
    ElMessage.error('加载失败')
  }
}

const deletePrediction = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个预测记录吗？', '确认删除', {
      type: 'warning'
    })

    await predictionApi.deletePrediction(id)
    ElMessage.success('删除成功')

    // 重新加载历史记录
    loadPredictionHistory()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 生命周期
onMounted(() => {
  // 权限检查 - 管理员和数据分析师都可以访问
  if (!Permission.isAnalyst() && !Permission.isAdmin()) {
    ElMessage.error('您没有权限访问预测分析功能，该功能仅限管理员和数据分析师使用')
    // 可以选择重定向到其他页面
    // router.push('/app/dashboard')
    return
  }

  // 加载历史预测记录
  loadPredictionHistory()
})

const loadPredictionHistory = async () => {
  try {
    const response = await predictionApi.getPredictionHistory()
    if (response.status === 0) {
      predictionHistory.value = response.data || []
    } else {
      // 如果API不可用，使用模拟数据
      predictionHistory.value = [
        {
          id: 1,
          model: 'ARIMA',
          field: '总人口',
          steps: 12,
          accuracy: 0.92,
          createTime: '2024-01-15 10:30:00'
        },
        {
          id: 2,
          model: 'SARIMA',
          field: '床位利用率',
          steps: 24,
          accuracy: 0.87,
          createTime: '2024-01-14 14:20:00'
        }
      ]
    }
  } catch (error) {
    console.error('加载历史记录失败:', error)
    // 使用模拟数据作为备用
    predictionHistory.value = [
      {
        id: 1,
        model: 'ARIMA',
        field: '总人口',
        steps: 12,
        accuracy: 0.92,
        createTime: '2024-01-15 10:30:00'
      },
      {
        id: 2,
        model: 'SARIMA',
        field: '床位利用率',
        steps: 24,
        accuracy: 0.87,
        createTime: '2024-01-14 14:20:00'
      }
    ]
  }
}
</script>

<style scoped>
.prediction-analysis {
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

/* 页面标题 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-content p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

/* 模型选择卡片 */
.model-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.model-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.model-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.model-card.active {
  border-color: #409EFF;
  background: linear-gradient(135deg, #409EFF10 0%, #409EFF20 100%);
}

.model-icon {
  font-size: 48px;
  margin-right: 20px;
}

.model-info h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.model-info p {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.model-features {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.feature-tag {
  padding: 4px 8px;
  background: #f0f2f5;
  border-radius: 12px;
  font-size: 12px;
  color: #666;
}

/* 预测配置 */
.prediction-config {
  margin-bottom: 24px;
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.prediction-form {
  margin-top: 20px;
}

.model-params {
  margin-top: 24px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #409EFF;
}

.model-params h4 {
  margin: 0 0 16px 0;
  color: #409EFF;
  font-weight: 600;
}

/* 预测结果 */
.prediction-results {
  margin-bottom: 24px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-actions {
  display: flex;
  gap: 12px;
}

.result-content {
  margin-top: 20px;
}

.chart-container {
  margin-bottom: 24px;
}

.prediction-chart {
  width: 100%;
  height: 400px;
}

.result-table {
  margin-bottom: 24px;
}

.text-success {
  color: #67C23A;
  font-weight: 600;
}

.text-danger {
  color: #F56C6C;
  font-weight: 600;
}

/* 预测统计信息 */
.model-metrics h4 {
  margin: 0 0 24px 0;
  color: #333;
  font-weight: 600;
  text-align: center;
  font-size: 24px;
}

.secret-cards-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  padding: 20px 0;
}

/* 原有的metric-card样式保留，以防其他地方使用 */
.metric-card {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.metric-value {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.metric-label {
  font-size: 14px;
  opacity: 0.9;
}

/* 历史预测记录 */
.prediction-history {
  margin-bottom: 24px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .prediction-analysis {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .model-cards {
    grid-template-columns: 1fr;
  }

  .model-card {
    flex-direction: column;
    text-align: center;
  }

  .model-icon {
    margin-right: 0;
    margin-bottom: 16px;
  }

  .secret-cards-container {
    gap: 16px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .secret-cards-container {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
}

/* 动画效果 */
.model-card {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 加载状态 */
.el-button.is-loading {
  position: relative;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
