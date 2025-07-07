<template>
  <div class="chengdu-map-container">
    <div class="map-header">
      <h3>成都市各区县人口分布</h3>
      <div class="map-controls">
        <el-select v-model="selectedMetric" @change="updateMapData" placeholder="选择指标">
          <el-option label="总人口" value="population" />
          <el-option label="出生人口" value="birthPopulation" />
          <el-option label="死亡人口" value="deathPopulation" />
          <el-option label="出生率" value="birthRate" />
          <el-option label="死亡率" value="deathRate" />
          <el-option label="增长率" value="growthRate" />
        </el-select>
      </div>
    </div>

    <div class="map-content">
      <!-- 地图区域 -->
      <div class="map-chart" ref="mapChart" v-loading="mapLoading"></div>

      <!-- 数据详情面板 -->
      <div class="data-panel" v-if="selectedDistrict">
        <div class="panel-header">
          <h4>{{ selectedDistrict.name }}</h4>
          <span class="district-level">{{ getDistrictLevelText(selectedDistrict.level) }}</span>
        </div>
        <div class="panel-content">
          <div class="data-item">
            <span class="label">总人口:</span>
            <span class="value">{{ formatNumber(selectedDistrict.population) }}万人</span>
          </div>
          <div class="data-item">
            <span class="label">出生人口:</span>
            <span class="value">{{ formatNumber(selectedDistrict.birthPopulation) }}人</span>
          </div>
          <div class="data-item">
            <span class="label">死亡人口:</span>
            <span class="value">{{ formatNumber(selectedDistrict.deathPopulation) }}人</span>
          </div>
          <div class="data-item">
            <span class="label">出生率:</span>
            <span class="value">{{ selectedDistrict.birthRate }}‰</span>
          </div>
          <div class="data-item">
            <span class="label">死亡率:</span>
            <span class="value">{{ selectedDistrict.deathRate }}‰</span>
          </div>
          <div class="data-item">
            <span class="label">增长率:</span>
            <span class="value">{{ selectedDistrict.growthRate }}‰</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 图例 -->
    <div class="map-legend">
      <div class="legend-title">{{ getMetricLabel(selectedMetric) }}</div>
      <div class="legend-items">
        <div v-for="(item, index) in legendData" :key="index" class="legend-item">
          <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
          <span class="legend-text">{{ item.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const mapChart = ref(null)
const chartInstance = ref(null)
const selectedMetric = ref('population')
const selectedDistrict = ref(null)
const legendData = ref([])
const mapLoading = ref(false)
const chengduGeoData = ref(null)

// 加载成都地图数据
const loadChengduGeoData = async () => {
  try {
    mapLoading.value = true
    const response = await axios.get('https://geo.datav.aliyun.com/areas_v3/bound/510100_full.json')
    chengduGeoData.value = response.data

    // 注册成都地图
    echarts.registerMap('chengdu', chengduGeoData.value)

    return true
  } catch (error) {
    console.error('加载成都地图数据失败:', error)
    return false
  } finally {
    mapLoading.value = false
  }
}

// 获取指标标签
const getMetricLabel = (metric) => {
  const labels = {
    population: '总人口(万人)',
    birthPopulation: '出生人口(人)',
    deathPopulation: '死亡人口(人)',
    birthRate: '出生率(‰)',
    deathRate: '死亡率(‰)',
    growthRate: '增长率(‰)'
  }
  return labels[metric] || metric
}

// 获取区县级别文本
const getDistrictLevelText = (level) => {
  const levelTexts = {
    district: '区',
    county: '市/县'
  }
  return levelTexts[level] || level
}

// 格式化数字
const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  return num.toLocaleString()
}

// 生成颜色渐变
const getColorByValue = (value, min, max, metric) => {
  if (max === min) return '#3b82f6'

  const ratio = (value - min) / (max - min)

  // 根据指标类型选择颜色方案
  let colorScheme
  if (metric === 'deathPopulation' || metric === 'deathRate') {
    colorScheme = ['#fef2f2', '#fecaca', '#f87171', '#dc2626', '#991b1b'] // 红色系
  } else if (metric === 'birthPopulation' || metric === 'birthRate') {
    colorScheme = ['#f0fdf4', '#bbf7d0', '#4ade80', '#16a34a', '#15803d'] // 绿色系
  } else {
    colorScheme = ['#eff6ff', '#93c5fd', '#3b82f6', '#1d4ed8', '#1e3a8a'] // 蓝色系
  }

  const colorIndex = Math.floor(ratio * (colorScheme.length - 1))
  return colorScheme[colorIndex] || colorScheme[0]
}

// 更新图例数据
const updateLegend = (min, max, metric) => {
  if (max === min) {
    legendData.value = [{ color: '#3b82f6', text: `${min.toFixed(1)}` }]
    return
  }

  const step = (max - min) / 4
  const colorScheme = metric === 'deathPopulation' || metric === 'deathRate'
    ? ['#fef2f2', '#fecaca', '#f87171', '#dc2626', '#991b1b']
    : metric === 'birthPopulation' || metric === 'birthRate'
    ? ['#f0fdf4', '#bbf7d0', '#4ade80', '#16a34a', '#15803d']
    : ['#eff6ff', '#93c5fd', '#3b82f6', '#1d4ed8', '#1e3a8a']

  legendData.value = [
    { color: colorScheme[0], text: `${min.toFixed(1)}` },
    { color: colorScheme[1], text: `${(min + step).toFixed(1)}` },
    { color: colorScheme[2], text: `${(min + step * 2).toFixed(1)}` },
    { color: colorScheme[3], text: `${(min + step * 3).toFixed(1)}` },
    { color: colorScheme[4], text: `${max.toFixed(1)}` }
  ]
}

// 更新地图数据
const updateMapData = () => {
  if (!chartInstance.value || !props.data.length || !chengduGeoData.value) return

  // 准备地图数据
  const mapData = props.data.map(item => {
    const value = item[selectedMetric.value] || 0
    return {
      name: item.name,
      value: value,
      data: item
    }
  })

  // 计算数值范围
  const values = mapData.map(item => item.value)
  const min = Math.min(...values)
  const max = Math.max(...values)

  // 更新图例
  updateLegend(min, max, selectedMetric.value)

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const data = mapData.find(item => item.name === params.name)?.data
        if (data) {
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 4px;">${data.name}</div>
              <div>总人口: ${formatNumber(data.population)}万人</div>
              <div>出生人口: ${formatNumber(data.birthPopulation)}人</div>
              <div>死亡人口: ${formatNumber(data.deathPopulation)}人</div>
              <div>出生率: ${data.birthRate}‰</div>
              <div>死亡率: ${data.deathRate}‰</div>
              <div>增长率: ${data.growthRate}‰</div>
            </div>
          `
        }
        return params.name
      }
    },
    visualMap: {
      min: min,
      max: max,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'],
      calculable: true,
      inRange: {
        color: selectedMetric.value === 'deathPopulation' || selectedMetric.value === 'deathRate'
          ? ['#fef2f2', '#991b1b']
          : selectedMetric.value === 'birthPopulation' || selectedMetric.value === 'birthRate'
          ? ['#f0fdf4', '#15803d']
          : ['#eff6ff', '#1e3a8a']
      }
    },
    series: [{
      name: getMetricLabel(selectedMetric.value),
      type: 'map',
      map: 'chengdu',
      roam: true,
      data: mapData,
      emphasis: {
        itemStyle: {
          areaColor: '#ffd700',
          borderWidth: 2,
          borderColor: '#333'
        }
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 1
      }
    }]
  }

  chartInstance.value.setOption(option, true)
}

// 初始化地图
const initChart = async () => {
  if (!mapChart.value) return

  // 先加载地图数据
  const success = await loadChengduGeoData()
  if (!success) {
    console.error('地图数据加载失败')
    return
  }

  chartInstance.value = echarts.init(mapChart.value)

  // 点击事件
  chartInstance.value.on('click', (params) => {
    const data = props.data.find(item => item.name === params.name)
    if (data) {
      selectedDistrict.value = data
    }
  })

  // 初始化地图
  updateMapData()
}

// 监听数据变化
watch(() => props.data, () => {
  if (chartInstance.value && chengduGeoData.value) {
    nextTick(() => {
      updateMapData()
    })
  }
}, { deep: true })

// 监听指标变化
watch(selectedMetric, () => {
  if (chartInstance.value && chengduGeoData.value) {
    updateMapData()
  }
})

onMounted(() => {
  nextTick(() => {
    initChart()
  })
})
</script>

<style scoped>
.chengdu-map-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-top: 24px;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.map-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
}

.map-content {
  display: flex;
  gap: 20px;
}

.map-chart {
  flex: 1;
  height: 500px;
  min-width: 0;
}

.data-panel {
  width: 280px;
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e2e8f0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.panel-header h4 {
  margin: 0;
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
}

.district-level {
  background: #3b82f6;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.data-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.data-item .label {
  color: #6b7280;
  font-size: 14px;
}

.data-item .value {
  color: #1f2937;
  font-weight: 500;
  font-size: 14px;
}

.map-legend {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.legend-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  font-size: 14px;
}

.legend-items {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-text {
  font-size: 12px;
  color: #6b7280;
}
</style>
