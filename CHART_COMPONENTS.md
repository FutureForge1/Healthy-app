# 📊 图表组件使用指南

## 🎯 概述

本项目提供了一套基于ECharts的通用图表组件，包括柱状图、折线图、饼图等，支持高度自定义和响应式设计。

## 🏗️ 组件架构

```
src/components/charts/
├── BaseChart.vue      # 基础图表组件
├── BarChart.vue       # 柱状图组件
├── LineChart.vue      # 折线图组件
├── PieChart.vue       # 饼图组件
└── index.js          # 统一导出文件
```

---

## 🔧 安装和使用

### 1. 全局注册（推荐）

在 `main.js` 中全局注册：

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import { install as installCharts } from '@/components/charts'

const app = createApp(App)

// 全局注册图表组件
installCharts(app)

app.mount('#app')
```

### 2. 按需导入

```javascript
import { BarChart, LineChart, PieChart } from '@/components/charts'
```

---

## 📊 组件详细使用

### 🔹 BarChart - 柱状图

#### 基础用法

```vue
<template>
  <BarChart
    :data="barData"
    :x-axis-data="xAxisData"
    title="销售数据统计"
    height="400px"
  />
</template>

<script setup>
import { BarChart } from '@/components/charts'

const barData = [120, 200, 150, 80, 70, 110, 130]
const xAxisData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
</script>
```

#### 多系列柱状图

```vue
<template>
  <BarChart
    :data="multiSeriesData"
    :x-axis-data="months"
    title="年度对比"
    :show-legend="true"
    :colors="['#5470c6', '#91cc75']"
  />
</template>

<script setup>
const multiSeriesData = [
  [120, 132, 101, 134, 90, 230, 210], // 2023年
  [220, 182, 191, 234, 290, 330, 310]  // 2024年
]
const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
</script>
```

#### Props 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| data | Array | [] | 数据数组 |
| xAxisData | Array | [] | X轴数据 |
| title | String | '' | 图表标题 |
| width | String | '100%' | 图表宽度 |
| height | String | '400px' | 图表高度 |
| colors | Array | 预设颜色 | 颜色配置 |
| barWidth | String | '60%' | 柱子宽度 |
| stack | String | '' | 堆叠标识 |
| showGrid | Boolean | true | 显示网格 |
| showLegend | Boolean | true | 显示图例 |

---

### 📈 LineChart - 折线图

#### 基础用法

```vue
<template>
  <LineChart
    :data="lineData"
    :x-axis-data="timeData"
    title="用户增长趋势"
    :smooth="true"
    :show-area="true"
  />
</template>

<script setup>
const lineData = [820, 932, 901, 934, 1290, 1330, 1320]
const timeData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
</script>
```

#### 多条折线

```vue
<template>
  <LineChart
    :data="multiLineData"
    :x-axis-data="dates"
    title="多指标对比"
    :smooth="true"
    :show-symbol="true"
  />
</template>

<script setup>
const multiLineData = [
  [120, 132, 101, 134, 90, 230, 210], // 访问量
  [220, 182, 191, 234, 290, 330, 310], // 注册量
  [150, 232, 201, 154, 190, 330, 410]  // 活跃量
]
const dates = ['12-01', '12-02', '12-03', '12-04', '12-05', '12-06', '12-07']
</script>
```

#### Props 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| data | Array | [] | 数据数组 |
| xAxisData | Array | [] | X轴数据 |
| smooth | Boolean | true | 平滑曲线 |
| showSymbol | Boolean | true | 显示数据点 |
| showArea | Boolean | false | 显示面积 |
| areaOpacity | Number | 0.3 | 面积透明度 |
| lineWidth | Number | 2 | 线条宽度 |

---

### 🥧 PieChart - 饼图

#### 基础饼图

```vue
<template>
  <PieChart
    :data="pieData"
    title="市场份额分布"
    :show-percentage="true"
  />
</template>

<script setup>
const pieData = [
  { value: 1048, name: '搜索引擎' },
  { value: 735, name: '直接访问' },
  { value: 580, name: '邮件营销' },
  { value: 484, name: '联盟广告' },
  { value: 300, name: '视频广告' }
]
</script>
```

#### 环形图

```vue
<template>
  <PieChart
    :data="donutData"
    title="设备类型分布"
    :is-donut="true"
    :inner-radius="'50%'"
    :radius="'80%'"
  />
</template>

<script setup>
const donutData = [
  { value: 335, name: '移动端' },
  { value: 310, name: 'PC端' },
  { value: 234, name: '平板' },
  { value: 135, name: '其他' }
]
</script>
```

#### Props 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| data | Array | [] | 数据数组 |
| radius | String/Array | '70%' | 饼图半径 |
| center | Array | ['50%', '50%'] | 中心位置 |
| isDonut | Boolean | false | 环形图 |
| innerRadius | String | '40%' | 内半径 |
| showLabel | Boolean | true | 显示标签 |
| showPercentage | Boolean | true | 显示百分比 |
| labelPosition | String | 'outside' | 标签位置 |

---

## 🎨 高级自定义

### 自定义配置

所有组件都支持 `customOption` 属性来覆盖默认配置：

```vue
<template>
  <BarChart
    :data="data"
    :x-axis-data="xData"
    :custom-option="customConfig"
  />
</template>

<script setup>
const customConfig = {
  grid: {
    left: '10%',
    right: '10%'
  },
  xAxis: {
    axisLabel: {
      rotate: 45
    }
  },
  series: [{
    itemStyle: {
      borderRadius: [10, 10, 0, 0]
    }
  }]
}
</script>
```

### 事件处理

```vue
<template>
  <PieChart
    :data="data"
    @chart-ready="onChartReady"
    @chart-click="onChartClick"
  />
</template>

<script setup>
const onChartReady = (chartInstance) => {
  console.log('图表已准备就绪', chartInstance)
}

const onChartClick = (params) => {
  console.log('点击了图表', params)
}
</script>
```

---

## 🔄 实际应用示例

### 替换现有图表代码

**之前的代码：**
```javascript
// 复杂的ECharts初始化代码
const chart = echarts.init(chartRef.value)
const option = {
  // 大量配置代码...
}
chart.setOption(option)
```

**现在的代码：**
```vue
<template>
  <BarChart
    :data="chartData"
    :x-axis-data="categories"
    title="数据统计"
  />
</template>
```

### 在现有页面中使用

例如在 `PopulationStats.vue` 中：

```vue
<template>
  <!-- 年龄结构图表 -->
  <PieChart
    :data="ageDistributionData"
    title="年龄结构分布"
    height="300px"
    :is-donut="true"
  />
  
  <!-- 趋势图表 -->
  <LineChart
    :data="trendData"
    :x-axis-data="yearData"
    title="人口增长趋势"
    :show-area="true"
    height="400px"
  />
</template>
```

---

## ✨ 优势特点

1. **🎯 简化使用** - 一行代码替代几十行ECharts配置
2. **🎨 高度自定义** - 支持所有ECharts配置选项
3. **📱 响应式设计** - 自动适配不同屏幕尺寸
4. **⚡ 性能优化** - 自动资源清理和事件管理
5. **🔧 类型安全** - 完整的TypeScript支持
6. **🎪 动画效果** - 内置优雅的动画效果
7. **🔄 数据驱动** - 响应式数据更新

---

## 🚀 下一步计划

- [ ] 添加更多图表类型（散点图、雷达图、仪表盘等）
- [ ] 支持图表主题切换
- [ ] 添加图表导出功能
- [ ] 集成数据源适配器
- [ ] 添加图表编辑器
