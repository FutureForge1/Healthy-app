//饼状图
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
  // 数据 - 格式: [{ name: 'A', value: 100 }, { name: 'B', value: 200 }]
  data: {
    type: Array,
    required: true,
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
    default: () => ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
  },
  // 是否显示图例
  showLegend: {
    type: Boolean,
    default: true
  },
  // 饼图半径 - 可以是字符串或数组
  radius: {
    type: [String, Array],
    default: '70%'
  },
  // 饼图中心位置
  center: {
    type: Array,
    default: () => ['50%', '50%']
  },
  // 是否显示标签
  showLabel: {
    type: Boolean,
    default: true
  },
  // 是否显示标签线
  showLabelLine: {
    type: Boolean,
    default: true
  },
  // 标签位置
  labelPosition: {
    type: String,
    default: 'outside', // outside, inside, center
    validator: (value) => ['outside', 'inside', 'center'].includes(value)
  },
  // 是否显示百分比
  showPercentage: {
    type: Boolean,
    default: true
  },
  // 是否环形图
  isDonut: {
    type: Boolean,
    default: false
  },
  // 环形图内半径（仅当isDonut为true时有效）
  innerRadius: {
    type: String,
    default: '40%'
  },
  // 起始角度
  startAngle: {
    type: Number,
    default: 90
  },
  // 是否顺时针
  clockwise: {
    type: Boolean,
    default: true
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
      top: 20,
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
      }
    } : undefined,
    
    tooltip: {
      trigger: 'item',
      formatter: props.tooltipFormatter || ((params) => {
        const percentage = props.showPercentage ? ` (${params.percent}%)` : ''
        return `${params.marker}${params.name}: ${params.value}${percentage}`
      })
    },
    
    legend: props.showLegend ? {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 20,
      bottom: 20,
      data: props.data.map(item => item.name),
      textStyle: {
        color: '#666'
      }
    } : undefined,
    
    color: props.colors,
    
    series: [{
      type: 'pie',
      radius: props.isDonut ? [props.innerRadius, props.radius] : props.radius,
      center: props.center,
      data: props.data,
      startAngle: props.startAngle,
      clockwise: props.clockwise,
      
      label: {
        show: props.showLabel,
        position: props.labelPosition,
        formatter: (params) => {
          if (props.labelPosition === 'center') {
            return `{name|${params.name}}\n{value|${params.value}}`
          }
          const percentage = props.showPercentage ? `\n${params.percent}%` : ''
          return `${params.name}${percentage}`
        },
        rich: {
          name: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#333'
          },
          value: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#666'
          }
        }
      },
      
      labelLine: {
        show: props.showLabelLine && props.labelPosition === 'outside',
        length: 15,
        length2: 10,
        smooth: true
      },
      
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 2
      },
      
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        },
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: (idx) => Math.random() * 200
    }]
  }

  // 合并自定义配置
  return mergeOptions(baseOption, props.customOption)
})

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
