<template>
  <div v-if="visible" class="loading-overlay">
    <div class="loading-container">
      <!-- 欢迎文字 -->
      <div class="welcome-text" :class="{ 'show': showText }">
        欢迎回来！
      </div>
      
      <!-- 加载动画 -->
      <div class="loader" :class="{ 'show': showLoader }">
        <div class="cell d-0"></div>
        <div class="cell d-1"></div>
        <div class="cell d-2"></div>
        <div class="cell d-1"></div>
        <div class="cell d-2"></div>
        <div class="cell d-2"></div>
        <div class="cell d-3"></div>
        <div class="cell d-3"></div>
        <div class="cell d-4"></div>
      </div>
      
      <!-- 加载进度文字 -->
      <div class="loading-text" :class="{ 'show': showLoadingText }">
        {{ loadingText }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['complete'])

// 响应式数据
const showText = ref(false)
const showLoader = ref(false)
const showLoadingText = ref(false)
const loadingText = ref('正在加载仪表盘...')

// 加载文字序列
const loadingTexts = [
  '正在加载仪表盘...',
  '正在获取用户数据...',
  '正在初始化界面...',
  '即将完成...'
]

let textIndex = 0

// 开始加载动画
const startAnimation = async () => {
  if (!props.visible) return
  
  // 延迟显示欢迎文字
  setTimeout(() => {
    showText.value = true
  }, 300)
  
  // 延迟显示加载器
  setTimeout(() => {
    showLoader.value = true
  }, 800)
  
  // 延迟显示加载文字
  setTimeout(() => {
    showLoadingText.value = true
    startTextRotation()
  }, 1200)
  
  // 总动画时长约4秒
  setTimeout(() => {
    emit('complete')
  }, 4000)
}

// 文字轮换
const startTextRotation = () => {
  const interval = setInterval(() => {
    textIndex++
    if (textIndex < loadingTexts.length) {
      loadingText.value = loadingTexts[textIndex]
    } else {
      clearInterval(interval)
    }
  }, 800)
}

// 监听visible变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    // 重置状态
    showText.value = false
    showLoader.value = false
    showLoadingText.value = false
    textIndex = 0
    loadingText.value = loadingTexts[0]
    
    nextTick(() => {
      startAnimation()
    })
  }
})
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.5s ease-out;

  /* 模糊雨滴背景 - 柔和健康主题色彩 */
  --c: rgba(16, 185, 129, 0.2); /* 更柔和的健康绿色 */
  --c2: rgba(59, 130, 246, 0.15); /* 更柔和的数据蓝色 */
  --c3: rgba(139, 92, 246, 0.15); /* 更柔和的科技紫色 */
  --c4: rgba(6, 182, 212, 0.18); /* 更柔和的清新青色 */
  background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%);
  background-image:
    radial-gradient(6px 120px at 50px 200px, var(--c), #0000),
    radial-gradient(4px 100px at 250px 180px, var(--c2), #0000),
    radial-gradient(5px 90px at 150px 120px, var(--c3), #0000),
    radial-gradient(6px 110px at 100px 250px, var(--c4), #0000),
    radial-gradient(4px 80px at 200px 100px, var(--c), #0000),
    radial-gradient(5px 100px at 80px 150px, var(--c2), #0000),
    radial-gradient(4px 90px at 180px 220px, var(--c3), #0000),
    radial-gradient(6px 100px at 120px 180px, var(--c4), #0000),
    radial-gradient(4px 85px at 220px 160px, var(--c), #0000),
    radial-gradient(5px 95px at 160px 240px, var(--c2), #0000);
  background-size:
    300px 200px, 300px 180px, 300px 120px,
    300px 250px, 300px 100px, 300px 150px,
    300px 220px, 300px 180px, 300px 160px,
    300px 240px;
  animation: fadeIn 0.5s ease-out, rainAnimation 120s linear infinite;
  filter: blur(1px);
}

.loading-overlay::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  backdrop-filter: blur(1.5em) brightness(1.8);
  background: rgba(30, 41, 59, 0.1);
  background-image: radial-gradient(
    circle at 50% 50%,
    rgba(255, 255, 255, 0.02) 0,
    rgba(255, 255, 255, 0.02) 4px,
    rgba(30, 41, 59, 0.15) 4px
  );
  background-size: 16px 16px;
  pointer-events: none;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  position: relative;
  z-index: 10;
}

.welcome-text {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  text-align: center;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
}

.welcome-text.show {
  opacity: 1;
  transform: translateY(0);
}

.loader {
  --cell-size: 52px;
  --cell-spacing: 1px;
  --cells: 3;
  --total-size: calc(var(--cells) * (var(--cell-size) + 2 * var(--cell-spacing)));
  display: flex;
  flex-wrap: wrap;
  width: var(--total-size);
  height: var(--total-size);
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.6s ease-out;
}

.loader.show {
  opacity: 1;
  transform: scale(1);
}

.cell {
  flex: 0 0 var(--cell-size);
  margin: var(--cell-spacing);
  background-color: transparent;
  box-sizing: border-box;
  border-radius: 8px;
  animation: 1.5s ripple ease infinite;
}

.cell.d-1 {
  animation-delay: 100ms;
}

.cell.d-2 {
  animation-delay: 200ms;
}

.cell.d-3 {
  animation-delay: 300ms;
}

.cell.d-4 {
  animation-delay: 400ms;
}

.cell:nth-child(1) {
  --cell-color: #00FF87;
}

.cell:nth-child(2) {
  --cell-color: #0CFD95;
}

.cell:nth-child(3) {
  --cell-color: #17FBA2;
}

.cell:nth-child(4) {
  --cell-color: #23F9B2;
}

.cell:nth-child(5) {
  --cell-color: #30F7C3;
}

.cell:nth-child(6) {
  --cell-color: #3DF5D4;
}

.cell:nth-child(7) {
  --cell-color: #45F4DE;
}

.cell:nth-child(8) {
  --cell-color: #53F1F0;
}

.cell:nth-child(9) {
  --cell-color: #60EFFF;
}

.loading-text {
  font-size: 1.2rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease-out;
  min-height: 1.5rem;
}

.loading-text.show {
  opacity: 1;
  transform: translateY(0);
}

/* 动画关键帧 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes rainAnimation {
  0% {
    background-position:
      50px 0px, 250px 0px, 150px 0px,
      100px 0px, 200px 0px, 80px 0px,
      180px 0px, 120px 0px, 220px 0px,
      160px 0px;
  }

  to {
    background-position:
      50px 2000px, 250px 1800px, 150px 1200px,
      100px 2500px, 200px 1000px, 80px 1500px,
      180px 2200px, 120px 1800px, 220px 1600px,
      160px 2400px;
  }
}

@keyframes ripple {
  0% {
    background-color: transparent;
    box-shadow: 0 0 0 rgba(255, 255, 255, 0);
  }

  30% {
    background-color: var(--cell-color);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  }

  60% {
    background-color: transparent;
    box-shadow: 0 0 0 rgba(255, 255, 255, 0);
  }

  100% {
    background-color: transparent;
    box-shadow: 0 0 0 rgba(255, 255, 255, 0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .welcome-text {
    font-size: 2rem;
    letter-spacing: 1px;
  }
  
  .loader {
    --cell-size: 40px;
  }
  
  .loading-text {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .welcome-text {
    font-size: 1.5rem;
  }
  
  .loader {
    --cell-size: 32px;
  }
  
  .loading-container {
    gap: 30px;
    padding: 20px;
  }
}
</style>
