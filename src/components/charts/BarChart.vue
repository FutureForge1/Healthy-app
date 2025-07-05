//柱状图

<template>
  <BaseChart
    :option="chartOption"
    :width="width"
    :height="height"
    :loading="loading"
    :theme="theme"
    @chart-ready="handleChartReady"
    @chart-click="handleChartClick"
  />
</template>

<script setup>
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'

// Props定义
const props = defineProps({
  // 数据
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  // X轴数据
  xAxisData: {
    type: Array,
    default: () => []
  },
  // 图表标题
  title: {
    type: String,
    default: ''
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
  // 颜色配置
  colors: {
    type: Array,
    default: () => ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de']
  },
  // 是否显示网格
  showGrid: {
    type: Boolean,
    default: true
  },
  // 是否显示图例
  showLegend: {
    type: Boolean,
    default: true
  },
  // 柱子宽度
  barWidth: {
    type: String,
    default: '60%'
  },
  // 是否堆叠
  stack: {
    type: String,
    default: ''
  },
  // Y轴格式化函数
  yAxisFormatter: {
    type: Function,
    default: (value) => value
  },
  // 工具提示格式化函数
  tooltipFormatter: {
    type: Function,
    default: null
  },
  // 自定义配置（会与默认配置合并）
  customOption: {
    type: Object,
    default: () => ({})
  }
})

// Emits定义
const emit = defineEmits(['chart-ready', 'chart-click'])

// 计算图表配置
const chartOption = computed(() => {
  const baseOption = {
    title: props.title ? {
      text: props.title,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
      }
    } : undefined,
    
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: props.tooltipFormatter || undefined
    },
    
    legend: props.showLegend ? {
      top: props.title ? 40 : 10,
      data: Array.isArray(props.data[0]) ? 
        props.data.map((_, index) => `系列${index + 1}`) : 
        undefined
    } : undefined,
    
    grid: props.showGrid ? {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: props.title ? (props.showLegend ? 80 : 50) : (props.showLegend ? 40 : 20),
      containLabel: true
    } : undefined,
    
    xAxis: {
      type: 'category',
      data: props.xAxisData,
      axisLine: {
        lineStyle: {
          color: '#e0e6ed'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#666'
      }
    },
    
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#666',
        formatter: props.yAxisFormatter
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed'
        }
      }
    },
    
    color: props.colors,
    
    series: generateSeries()
  }

  // 合并自定义配置
  return mergeOptions(baseOption, props.customOption)
})

// 生成系列数据
const generateSeries = () => {
  if (!props.data || props.data.length === 0) {
    return []
  }

  // 如果是简单数组
  if (!Array.isArray(props.data[0])) {
    return [{
      type: 'bar',
      data: props.data,
      barWidth: props.barWidth,
      stack: props.stack,
      itemStyle: {
        borderRadius: [4, 4, 0, 0]
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
      }
    }]
  }

  // 如果是多系列数据
  return props.data.map((seriesData, index) => ({
    name: `系列${index + 1}`,
    type: 'bar',
    data: seriesData,
    barWidth: props.barWidth,
    stack: props.stack,
    itemStyle: {
      borderRadius: [4, 4, 0, 0]
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.3)'
      }
    }
  }))
}

// 深度合并配置对象
const mergeOptions = (target, source) => {
  const result = { ...target }
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = mergeOptions(result[key] || {}, source[key])
    } else {
      result[key] = source[key]
    }
  }
  
  return result
}

// 事件处理
const handleChartReady = (chartInstance) => {
  emit('chart-ready', chartInstance)
}

const handleChartClick = (params) => {
  emit('chart-click', params)
}
</script>
