# OverviewCard 概览卡片组件

一个现代化、可复用的概览卡片组件，专为医疗健康数据展示设计。

## 特性

- 🎨 **四种主题配色**：primary、success、warning、info
- 📊 **灵活数据展示**：支持数值、单位、占比显示
- 🎭 **精美动画效果**：悬停动画、背景扩散效果
- 🔧 **高度可定制**：图标、主题、文本都可自定义
- 📱 **响应式设计**：适配不同屏幕尺寸

## 基本用法

```vue
<template>
  <div class="overview-cards">
    <OverviewCard
      :value="23.21"
      title="卫生技术人员总数"
      unit="万"
      :ratio="100"
      :icon="User"
      theme="primary"
      :loading="false"
    />
  </div>
</template>

<script setup>
import { User } from '@element-plus/icons-vue'
import OverviewCard from '@/components/OverviewCard.vue'
</script>
```

## Props 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | Number/String | null | 卡片显示的主要数值 |
| title | String | - | 卡片标题（必填） |
| subtitle | String | '' | 副标题（可选） |
| unit | String | '' | 数值单位，如 "万"、"人"、"%" |
| ratio | Number/String | null | 占比数值 |
| showRatio | Boolean | true | 是否显示占比 |
| icon | String/Object | - | 图标组件（必填） |
| theme | String | 'primary' | 主题类型：primary/success/warning/info |
| loading | Boolean | false | 加载状态 |
| emptyText | String | '暂无数据' | 无数据时显示的文本 |

## 主题配色

### Primary（蓝色）- 主要数据
```vue
<OverviewCard theme="primary" />
```
- 适用于：总数、主要指标
- 配色：清新蓝色渐变

### Success（绿色）- 积极数据
```vue
<OverviewCard theme="success" />
```
- 适用于：医师、健康指标
- 配色：健康绿色渐变

### Warning（橙色）- 关注数据
```vue
<OverviewCard theme="warning" />
```
- 适用于：护士、服务指标
- 配色：温暖橙色渐变

### Info（紫色）- 信息数据
```vue
<OverviewCard theme="info" />
```
- 适用于：技术人员、专业指标
- 配色：优雅紫色渐变

## 使用场景示例

### 1. 医疗人员统计
```vue
<OverviewCard
  :value="overviewData.doctors"
  title="执业医师人数"
  unit="万"
  :ratio="overviewData.doctorRatio"
  :icon="FirstAidKit"
  theme="success"
  :loading="loading"
/>
```

### 2. 医疗机构统计
```vue
<OverviewCard
  :value="institutionData.total"
  title="医疗机构总数"
  unit="家"
  :ratio="100"
  :icon="Hospital"
  theme="primary"
  :loading="loading"
/>
```

### 3. 床位统计
```vue
<OverviewCard
  :value="bedData.available"
  title="可用床位"
  unit="张"
  :ratio="bedData.availableRatio"
  :icon="Bed"
  theme="warning"
  :loading="loading"
/>
```

### 4. 不显示占比的卡片
```vue
<OverviewCard
  :value="costData.total"
  title="医疗费用总额"
  subtitle="本年度累计"
  unit="万元"
  :show-ratio="false"
  :icon="Money"
  theme="info"
  :loading="loading"
/>
```

## 样式定制

组件使用CSS变量，可以通过覆盖样式进行定制：

```css
.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

/* 自定义卡片间距 */
.overview-card {
  margin: 0; /* 覆盖默认margin */
}
```

## 最佳实践

1. **一致性**：在同一页面使用相同的单位和格式
2. **主题选择**：根据数据类型选择合适的主题色
3. **图标选择**：使用与数据内容相关的图标
4. **加载状态**：在数据加载时显示loading状态
5. **响应式**：使用grid布局确保在不同屏幕下的良好展示

## 注意事项

- 确保传入的图标组件已正确导入
- value为0、null或undefined时会显示emptyText（"暂无数据"）
- 占比也遵循相同逻辑：无数据时显示"暂无数据"而不是百分比
- 组件内部会自动格式化数字（添加千分位分隔符）
- 主题类型必须是预定义的四种之一
- 卡片尺寸已优化：最小宽度320px，最大宽度380px，更大更美观
