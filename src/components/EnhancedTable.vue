<template>
  <div class="enhanced-table-container">
    <div class="table-header" v-if="title">
      <h3 class="table-title">{{ title }}</h3>
      <p class="table-subtitle" v-if="subtitle">{{ subtitle }}</p>
    </div>
    
    <div class="table-wrapper">
      <div 
        v-for="(row, index) in data" 
        :key="index"
        class="table-row-card"
        :class="getRowClass(row, index)"
        @click="$emit('row-click', row, index)"
      >
        <div class="row-indicator" :class="getIndicatorClass(row)">
          <svg
            v-if="showIcon"
            stroke="currentColor"
            viewBox="0 0 24 24"
            fill="none"
            class="row-icon"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke-width="2"
              stroke-linejoin="round"
              stroke-linecap="round"
            ></path>
          </svg>
          <div class="row-number">{{ index + 1 }}</div>
        </div>
        
        <div class="row-content">
          <div class="row-main">
            <div class="row-primary">
              <span class="primary-label">{{ primaryLabel }}</span>
              <span class="primary-value">{{ getPrimaryValue(row) }}</span>
            </div>
            <div class="row-secondary">
              <span class="secondary-value">{{ getSecondaryValue(row) }}</span>
            </div>
          </div>
          
          <div class="row-details">
            <div 
              v-for="column in detailColumns" 
              :key="column.key"
              class="detail-item"
            >
              <span class="detail-label">{{ column.label }}</span>
              <span class="detail-value" :class="getValueClass(row, column)">
                {{ formatValue(row[column.key], column) }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="row-actions" v-if="showActions">
          <div class="trend-indicator" :class="getTrendClass(row)">
            <svg
              v-if="getTrendDirection(row) === 'up'"
              class="trend-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17l9.2-9.2M17 17V7H7"/>
            </svg>
            <svg
              v-else-if="getTrendDirection(row) === 'down'"
              class="trend-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 7l-9.2 9.2M7 7v10h10"/>
            </svg>
            <svg
              v-else
              class="trend-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <div class="table-footer" v-if="showFooter">
      <div class="footer-stats">
        <span class="stat-item">
          <span class="stat-label">总计:</span>
          <span class="stat-value">{{ data.length }} 项</span>
        </span>
        <span class="stat-item" v-if="averageValue">
          <span class="stat-label">平均值:</span>
          <span class="stat-value">{{ averageValue }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  primaryKey: {
    type: String,
    required: true
  },
  primaryLabel: {
    type: String,
    default: '主要信息'
  },
  secondaryKey: {
    type: String,
    default: ''
  },
  detailColumns: {
    type: Array,
    default: () => []
  },
  colorScheme: {
    type: String,
    default: 'blue', // blue, green, yellow, red, purple
    validator: (value) => ['blue', 'green', 'yellow', 'red', 'purple'].includes(value)
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  showActions: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: false
  },
  trendKey: {
    type: String,
    default: 'changePercent'
  }
})

// Emits
const emit = defineEmits(['row-click'])

// Computed
const averageValue = computed(() => {
  if (!props.data.length || !props.secondaryKey) return null
  
  const sum = props.data.reduce((acc, row) => {
    const value = parseFloat(row[props.secondaryKey]) || 0
    return acc + value
  }, 0)
  
  return (sum / props.data.length).toFixed(2)
})

// Methods
const getPrimaryValue = (row) => {
  return row[props.primaryKey] || '-'
}

const getSecondaryValue = (row) => {
  if (!props.secondaryKey) return ''
  return row[props.secondaryKey] || '-'
}

const getRowClass = (row, index) => {
  const baseClass = `row-${props.colorScheme}`
  const isEven = index % 2 === 0
  return [baseClass, isEven ? 'row-even' : 'row-odd']
}

const getIndicatorClass = (row) => {
  return `indicator-${props.colorScheme}`
}

const getValueClass = (row, column) => {
  if (column.type === 'trend') {
    const value = parseFloat(row[column.key]) || 0
    return value >= 0 ? 'value-positive' : 'value-negative'
  }
  return ''
}

const getTrendClass = (row) => {
  const value = parseFloat(row[props.trendKey]) || 0
  if (value > 0) return 'trend-up'
  if (value < 0) return 'trend-down'
  return 'trend-neutral'
}

const getTrendDirection = (row) => {
  const value = parseFloat(row[props.trendKey]) || 0
  if (value > 0) return 'up'
  if (value < 0) return 'down'
  return 'neutral'
}

const formatValue = (value, column) => {
  if (value === null || value === undefined) return '-'
  
  if (column.type === 'number') {
    return parseFloat(value).toFixed(column.decimals || 2)
  }
  
  if (column.type === 'percentage') {
    return `${parseFloat(value).toFixed(column.decimals || 2)}%`
  }
  
  if (column.type === 'currency') {
    return `¥${parseFloat(value).toFixed(2)}`
  }
  
  if (column.formatter) {
    return column.formatter(value)
  }
  
  return value
}
</script>

<style scoped>
.enhanced-table-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  padding: 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #e9ecef;
}

.table-title {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
}

.table-subtitle {
  margin: 0;
  font-size: 14px;
  color: #6c757d;
}

.table-wrapper {
  padding: 16px;
  max-height: 600px;
  overflow-y: auto;
}

.table-row-card {
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.table-row-card:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.table-row-card:last-child {
  margin-bottom: 0;
}

/* Color Schemes */
.row-blue {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-left: 4px solid #2196f3;
}

.row-blue:hover {
  background: linear-gradient(135deg, #bbdefb 0%, #90caf9 100%);
}

.row-green {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  border-left: 4px solid #4caf50;
}

.row-green:hover {
  background: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%);
}

.row-yellow {
  background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
  border-left: 4px solid #ff9800;
}

.row-yellow:hover {
  background: linear-gradient(135deg, #ffecb3 0%, #ffe082 100%);
}

.row-red {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  border-left: 4px solid #f44336;
}

.row-red:hover {
  background: linear-gradient(135deg, #ffcdd2 0%, #ef9a9a 100%);
}

.row-purple {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  border-left: 4px solid #9c27b0;
}

.row-purple:hover {
  background: linear-gradient(135deg, #e1bee7 0%, #ce93d8 100%);
}

.row-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  margin-right: 16px;
  position: relative;
}

.indicator-blue { background: #2196f3; color: white; }
.indicator-green { background: #4caf50; color: white; }
.indicator-yellow { background: #ff9800; color: white; }
.indicator-red { background: #f44336; color: white; }
.indicator-purple { background: #9c27b0; color: white; }

.row-icon {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 4px;
  right: 4px;
}

.row-number {
  font-weight: 600;
  font-size: 16px;
}

.row-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.row-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.row-primary {
  display: flex;
  flex-direction: column;
}

.primary-label {
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.primary-value {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-top: 2px;
}

.secondary-value {
  font-size: 14px;
  color: #495057;
  font-weight: 500;
}

.row-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 11px;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.value-positive {
  color: #28a745;
}

.value-negative {
  color: #dc3545;
}

.row-actions {
  display: flex;
  align-items: center;
  margin-left: 16px;
}

.trend-indicator {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trend-up {
  background: #d4edda;
  color: #28a745;
}

.trend-down {
  background: #f8d7da;
  color: #dc3545;
}

.trend-neutral {
  background: #e2e3e5;
  color: #6c757d;
}

.trend-icon {
  width: 16px;
  height: 16px;
}

.table-footer {
  padding: 16px 24px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.footer-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-label {
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .table-row-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .row-main {
    width: 100%;
  }
  
  .row-details {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .row-actions {
    margin-left: 0;
    align-self: flex-end;
  }
}

/* 滚动条样式 */
.table-wrapper::-webkit-scrollbar {
  width: 6px;
}

.table-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.table-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
