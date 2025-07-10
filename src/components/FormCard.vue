<template>
  <div class="form-card-container">
    <div class="form-card-wrapper">
      <!-- 渐变边框动画 -->
      <div class="gradient-border"></div>
      
      <!-- 表单内容区域 -->
      <div class="form-content">
        <!-- 标题区域 -->
        <div class="form-header">
          <h2 class="form-title">{{ title }}</h2>
          <p v-if="subtitle" class="form-subtitle">{{ subtitle }}</p>
        </div>
        
        <!-- 表单内容插槽 -->
        <div class="form-body">
          <slot></slot>
        </div>
        
        <!-- 操作按钮区域 -->
        <div v-if="$slots.actions" class="form-actions">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: 'auto'
  },
  maxWidth: {
    type: String,
    default: '600px'
  },
  padding: {
    type: String,
    default: '32px'
  },
  borderRadius: {
    type: String,
    default: '16px'
  },
  animationSpeed: {
    type: String,
    default: '3s'
  }
})
</script>

<style scoped>
.form-card-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0; /* 移除padding */
}

.form-card-wrapper {
  position: relative;
  width: v-bind(width);
  max-width: v-bind(maxWidth);
}

/* 渐变边框动画 */
.gradient-border {
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: calc(v-bind(borderRadius) + 4px);
  background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c, #4facfe, #00f2fe);
  background-size: 400% 400%;
  animation: gradientShift v-bind(animationSpeed) ease infinite;
  z-index: 1;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 表单内容区域 */
.form-content {
  position: relative;
  background: white;
  border-radius: v-bind(borderRadius);
  padding: v-bind(padding);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  z-index: 2;
  transform: translateZ(0);
  transition: all 0.3s ease;
  height: v-bind(height);
}

.form-content:hover {
  transform: translateY(-2px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

/* 标题区域 */
.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-subtitle {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0;
  opacity: 0.8;
}

/* 表单主体 */
.form-body {
  margin-bottom: 24px;
}

/* 操作按钮区域 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #f1f3f4;
}

/* 深度样式 - 优化表单元素 */
:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

:deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

:deep(.el-input__inner) {
  font-size: 14px;
  color: #2c3e50;
}

:deep(.el-input__inner::placeholder) {
  color: #bdc3c7;
}

:deep(.el-button) {
  border-radius: 12px;
  font-weight: 600;
  padding: 12px 24px;
  transition: all 0.3s ease;
  border: none;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

:deep(.el-tag) {
  border-radius: 8px;
  font-weight: 500;
  padding: 4px 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-content {
    padding: 24px;
  }
  
  .form-title {
    font-size: 24px;
  }
  
  .form-subtitle {
    font-size: 14px;
  }
  
  .form-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .form-card-container {
    padding: 10px 0;
  }
  
  .form-content {
    padding: 20px;
  }
  
  .form-header {
    margin-bottom: 24px;
  }
  
  .form-title {
    font-size: 20px;
  }
}

/* 加载动画 */
.form-content.loading {
  pointer-events: none;
  opacity: 0.7;
}

.form-content.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid #667eea;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
