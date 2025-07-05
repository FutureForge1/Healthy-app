//这个是一个通用的图表组件系统
<template>
  <div 
    ref="chartRef" 
    :style="{ width: width, height: height }"
    class="base-chart"
  ></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

// Props定义
const props = defineProps({
  // 图表配置选项
  option: {
    type: Object,
    required: true
  },
  // 图表宽度
  width: {
    type: String,
    default: '100%'
  },
  // 图表高度
  height: {
    type: String,
    default: '400px'
  },
  // 是否自动调整大小
  autoResize: {
    type: Boolean,
    default: true
  },
  // 主题
  theme: {
    type: String,
    default: 'default'
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  // 加载配置
  loadingOption: {
    type: Object,
    default: () => ({
      text: '加载中...',
      color: '#409EFF',
      textColor: '#409EFF',
      maskColor: 'rgba(255, 255, 255, 0.8)',
      zlevel: 0
    })
  }
})

// Emits定义
const emit = defineEmits([
  'chart-ready',
  'chart-click',
  'chart-dblclick',
  'chart-mouseover',
  'chart-mouseout'
])

// 响应式数据
const chartRef = ref(null)
let chartInstance = null
let resizeObserver = null

// 初始化图表
const initChart = async () => {
  if (!chartRef.value) return

  await nextTick()
  
  // 销毁已存在的实例
  if (chartInstance) {
    chartInstance.dispose()
  }

  // 创建新实例
  chartInstance = echarts.init(chartRef.value, props.theme)
  
  // 设置配置选项
  chartInstance.setOption(props.option, true)
  
  // 绑定事件
  bindEvents()
  
  // 设置加载状态
  if (props.loading) {
    chartInstance.showLoading(props.loadingOption)
  }
  
  // 发出图表就绪事件
  emit('chart-ready', chartInstance)
}

// 绑定事件
const bindEvents = () => {
  if (!chartInstance) return

  chartInstance.on('click', (params) => {
    emit('chart-click', params)
  })

  chartInstance.on('dblclick', (params) => {
    emit('chart-dblclick', params)
  })

  chartInstance.on('mouseover', (params) => {
    emit('chart-mouseover', params)
  })

  chartInstance.on('mouseout', (params) => {
    emit('chart-mouseout', params)
  })
}

// 设置自动调整大小
const setupAutoResize = () => {
  if (!props.autoResize || !chartInstance) return

  // 使用ResizeObserver监听容器大小变化
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      chartInstance?.resize()
    })
    resizeObserver.observe(chartRef.value)
  } else {
    // 降级到window resize事件
    window.addEventListener('resize', handleResize)
  }
}

// 处理窗口大小变化
const handleResize = () => {
  chartInstance?.resize()
}

// 更新图表配置
const updateChart = (newOption, notMerge = false) => {
  if (chartInstance) {
    chartInstance.setOption(newOption, notMerge)
  }
}

// 获取图表实例
const getChartInstance = () => {
  return chartInstance
}

// 导出图片
const exportImage = (type = 'png', pixelRatio = 1, backgroundColor = '#fff') => {
  if (chartInstance) {
    return chartInstance.getDataURL({
      type,
      pixelRatio,
      backgroundColor
    })
  }
  return null
}

// 监听配置变化
watch(() => props.option, (newOption) => {
  if (chartInstance && newOption) {
    updateChart(newOption)
  }
}, { deep: true })

// 监听加载状态
watch(() => props.loading, (loading) => {
  if (!chartInstance) return
  
  if (loading) {
    chartInstance.showLoading(props.loadingOption)
  } else {
    chartInstance.hideLoading()
  }
})

// 生命周期
onMounted(() => {
  initChart()
  setupAutoResize()
})

onUnmounted(() => {
  // 清理资源
  if (resizeObserver) {
    resizeObserver.disconnect()
  } else {
    window.removeEventListener('resize', handleResize)
  }
  
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

// 暴露方法给父组件
defineExpose({
  updateChart,
  getChartInstance,
  exportImage,
  resize: () => chartInstance?.resize()
})
</script>

<style scoped>
.base-chart {
  position: relative;
}
</style>
