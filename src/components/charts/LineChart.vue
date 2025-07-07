//折线图
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
  // 系列名称
  seriesNames: {
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
  // 是否平滑曲线
  smooth: {
    type: Boolean,
    default: true
  },
  // 是否显示数据点
  showSymbol: {
    type: Boolean,
    default: true
  },
  // 是否显示面积
  showArea: {
    type: Boolean,
    default: false
  },
  // 面积透明度
  areaOpacity: {
    type: Number,
    default: 0.3
  },
  // 线条宽度
  lineWidth: {
    type: Number,
    default: 2
  },
  // Y轴格式化函数
  yAxisFormatter: {
    type: Function,
    default: (value) => value
  },
  // Y轴名称
  yAxisName: {
    type: String,
    default: ''
  },
  // 右Y轴名称
  rightYAxisName: {
    type: String,
    default: ''
  },
  // 右Y轴格式化函数
  rightYAxisFormatter: {
    type: Function,
    default: (value) => value
  },
  // 是否启用双Y轴
  dualYAxis: {
    type: Boolean,
    default: false
  },
  // 右Y轴系列索引数组
  rightYAxisSeriesIndex: {
    type: Array,
    default: () => []
  },
  // 左Y轴最小值
  yAxisMin: {
    type: [Number, String],
    default: null
  },
  // 左Y轴最大值
  yAxisMax: {
    type: [Number, String],
    default: null
  },
  // 右Y轴最小值
  rightYAxisMin: {
    type: [Number, String],
    default: null
  },
  // 右Y轴最大值
  rightYAxisMax: {
    type: [Number, String],
    default: null
  },
  // 工具提示格式化函数
  tooltipFormatter: {
    type: Function,
    default: null
  },
  // 自定义配置
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
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
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
      boundaryGap: false,
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
    
    yAxis: props.dualYAxis ? [
      {
        type: 'value',
        name: props.yAxisName,
        position: 'left',
        min: props.yAxisMin,
        max: props.yAxisMax,
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
      {
        type: 'value',
        name: props.rightYAxisName,
        position: 'right',
        min: props.rightYAxisMin,
        max: props.rightYAxisMax,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#666',
          formatter: props.rightYAxisFormatter
        },
        splitLine: {
          show: false
        }
      }
    ] : {
      type: 'value',
      name: props.yAxisName,
      min: props.yAxisMin,
      max: props.yAxisMax,
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
      type: 'line',
      data: props.data,
      smooth: props.smooth,
      symbol: props.showSymbol ? 'circle' : 'none',
      symbolSize: 6,
      lineStyle: {
        width: props.lineWidth
      },
      areaStyle: props.showArea ? {
        opacity: props.areaOpacity
      } : undefined,
      emphasis: {
        focus: 'series'
      }
    }]
  }

  // 如果是多系列数据
  return props.data.map((seriesData, index) => ({
    name: props.seriesNames[index] || `系列${index + 1}`,
    type: 'line',
    data: seriesData,
    smooth: props.smooth,
    symbol: props.showSymbol ? 'circle' : 'none',
    symbolSize: 6,
    lineStyle: {
      width: props.lineWidth
    },
    areaStyle: props.showArea ? {
      opacity: props.areaOpacity
    } : undefined,
    emphasis: {
      focus: 'series'
    },
    // 如果启用双Y轴，设置对应的Y轴索引
    yAxisIndex: props.dualYAxis && props.rightYAxisSeriesIndex.includes(index) ? 1 : 0
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
