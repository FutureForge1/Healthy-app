<template>
  <div class="overview-card modern-card" :class="cardThemeClass">
    <p class="card-title">
      <template v-if="!loading && value !== null && value !== undefined">
        {{ formatValue(value) }}{{ unit }}
      </template>
      <template v-else-if="!loading">{{ emptyText }}</template>
      <template v-else>--</template>
    </p>
    <p class="small-desc">
      {{ title }}
      <br>
      <template v-if="!loading && showRatio && ratio !== null && ratio !== undefined">
        占比 {{ ratio }}%
      </template>
      <template v-else-if="!loading && showRatio">{{ emptyText }}</template>
      <template v-else-if="loading && showRatio">占比 --%</template>
      <template v-if="subtitle && !showRatio">{{ subtitle }}</template>
    </p>
    <div class="go-corner">
      <div class="go-arrow">
        <el-icon>
          <component :is="icon" />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 卡片数据
  value: {
    type: [Number, String],
    default: null
  },
  // 卡片标题
  title: {
    type: String,
    required: true
  },
  // 副标题（可选）
  subtitle: {
    type: String,
    default: ''
  },
  // 单位
  unit: {
    type: String,
    default: ''
  },
  // 占比
  ratio: {
    type: [Number, String],
    default: null
  },
  // 是否显示占比
  showRatio: {
    type: Boolean,
    default: true
  },
  // 图标组件
  icon: {
    type: [String, Object],
    required: true
  },
  // 主题类型
  theme: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'info'].includes(value)
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  // 无数据时显示的文本
  emptyText: {
    type: String,
    default: '暂无数据'
  }
})

// 计算主题类名
const cardThemeClass = computed(() => `card-${props.theme}`)

// 格式化数值
const formatValue = (val) => {
  if (val === null || val === undefined) return ''
  if (typeof val === 'number') {
    return val.toLocaleString()
  }
  return val
}
</script>

<style scoped>
/* 现代卡片样式 - 医疗健康主题配色 */
.modern-card {
  display: block;
  position: relative;
  min-width: 320px;
  max-width: 380px;
  min-height: 160px;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 2.5em 1.8em;
  margin: 12px;
  text-decoration: none;
  z-index: 0;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  border: 1px solid rgba(148, 163, 184, 0.1);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-card:before {
  content: '';
  position: absolute;
  z-index: -1;
  top: -16px;
  right: -16px;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  height: 32px;
  width: 32px;
  border-radius: 32px;
  transform: scale(1);
  transform-origin: 50% 50%;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08);
}

.modern-card:hover:before {
  transform: scale(32);
}

.modern-card:hover .small-desc {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  color: rgba(255, 255, 255, 0.9);
}

.modern-card:hover .card-title {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  color: #ffffff;
}

.modern-card:hover .go-arrow {
  color: rgba(255, 255, 255, 0.9);
  transform: scale(1.1);
}

.card-title {
  color: #1e293b;
  font-size: 2.2em;
  line-height: 1.2;
  font-weight: 700;
  margin: 0 0 0.6em 0;
  letter-spacing: -0.025em;
}

.small-desc {
  font-size: 1.1em;
  font-weight: 500;
  line-height: 1.6;
  color: #64748b;
  margin: 0;
}

.go-corner {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 3.5em;
  height: 3.5em;
  overflow: hidden;
  top: 0;
  right: 0;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 0 20px 0 45px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-card:hover .go-corner {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  transform: scale(1.05);
}

.go-arrow {
  color: white;
  font-size: 1.4em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 卡片主题配色 */
.card-primary {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-left: 4px solid #0ea5e9;
}

.card-primary:before {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
}

.card-primary .go-corner {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
}

.card-success {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-left: 4px solid #22c55e;
}

.card-success:before {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.card-success .go-corner {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.card-warning {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border-left: 4px solid #f59e0b;
}

.card-warning:before {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.card-warning .go-corner {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.card-info {
  background: linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%);
  border-left: 4px solid #a855f7;
}

.card-info:before {
  background: linear-gradient(135deg, #a855f7, #9333ea);
}

.card-info .go-corner {
  background: linear-gradient(135deg, #a855f7, #9333ea);
}
</style>
