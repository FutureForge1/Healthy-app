<template>
  <div class="card" :data-theme="theme">
    <!-- 图标/图像区域 -->
    <div class="img">
      <component 
        v-if="icon" 
        :is="icon" 
        class="icon-component"
      />
      <svg 
        v-else
        class="default-icon" 
        xmlns="http://www.w3.org/2000/svg" 
        xml:space="preserve" 
        width="100%" 
        height="100%" 
        version="1.1" 
        shape-rendering="geometricPrecision" 
        text-rendering="geometricPrecision" 
        image-rendering="optimizeQuality" 
        fill-rule="evenodd" 
        clip-rule="evenodd" 
        viewBox="0 0 784.37 1277.39"
      >
        <g id="Layer_x0020_1">
          <metadata id="CorelCorpID_0Corel-Layer"></metadata>
          <g id="_1421394342400">
            <g>
              <polygon fill="#343434" fill-rule="nonzero" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54"></polygon>
              <polygon fill="#8C8C8C" fill-rule="nonzero" points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33"></polygon>
              <polygon fill="#3C3C3B" fill-rule="nonzero" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89"></polygon>
              <polygon fill="#8C8C8C" fill-rule="nonzero" points="392.07,1277.38 392.07,956.52 -0,724.89"></polygon>
              <polygon fill="#141414" fill-rule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33"></polygon>
              <polygon fill="#393939" fill-rule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33"></polygon>
            </g>
          </g>
        </g>
      </svg>
    </div>
    
    <!-- 文本内容区域 -->
    <div class="textBox">
      <p class="text head">{{ title }}</p>
      <span class="subtitle">{{ subtitle }}</span>
      <p class="text price">{{ value }}</p>
      <span class="description" v-if="description">{{ description }}</span>
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
  value: {
    type: [String, Number],
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: [String, Object],
    default: null
  },
  theme: {
    type: String,
    default: 'dark',
    validator: (value) => ['dark', 'blue', 'green', 'purple', 'orange'].includes(value)
  }
})
</script>

<style scoped>
.card {
  width: 195px;
  height: 285px;
  background: var(--card-bg);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  transition: 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  
  /* 主题变量 */
  --card-bg: #313131;
  --card-hover-bg: #404040;
}

/* 主题样式 */
.card[data-theme="dark"] {
  --card-bg: #313131;
  --card-hover-bg: #404040;
}

.card[data-theme="blue"] {
  --card-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --card-hover-bg: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

.card[data-theme="green"] {
  --card-bg: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  --card-hover-bg: linear-gradient(135deg, #3d8bfe 0%, #00d9fe 100%);
}

.card[data-theme="purple"] {
  --card-bg: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  --card-hover-bg: linear-gradient(135deg, #96e6e2 0%, #fcc5d8 100%);
  color: #333;
}

.card[data-theme="orange"] {
  --card-bg: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  --card-hover-bg: linear-gradient(135deg, #ffe4c4 0%, #fa9f85 100%);
  color: #333;
}

.img {
  height: 30%;
  position: absolute;
  transition: 0.2s ease-in-out;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60%;
}

.icon-component {
  width: 100%;
  height: 100%;
  color: currentColor;
}

.default-icon {
  width: 100%;
  height: 100%;
}

.textBox {
  opacity: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  transition: 0.2s ease-in-out;
  z-index: 2;
  text-align: center;
  padding: 20px;
}

.textBox > .text {
  font-weight: bold;
  margin: 0;
}

.textBox > .head {
  font-size: 20px;
  line-height: 1.2;
}

.textBox > .price {
  font-size: 17px;
  line-height: 1.2;
}

.textBox > .subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.textBox > .description {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  line-height: 1.3;
}

/* 紫色和橙色主题的文字颜色调整 */
.card[data-theme="purple"] .textBox > .subtitle,
.card[data-theme="orange"] .textBox > .subtitle {
  color: rgba(51, 51, 51, 0.7);
}

.card[data-theme="purple"] .textBox > .description,
.card[data-theme="orange"] .textBox > .description {
  color: rgba(51, 51, 51, 0.6);
}

.card:hover > .textBox {
  opacity: 1;
}

.card:hover > .img {
  height: 65%;
  filter: blur(7px);
  animation: anim 3s infinite;
}

@keyframes anim {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px);
  }

  100% {
    transform: translateY(0);
  }
}

.card:hover {
  transform: scale(1.04) rotate(-1deg);
  background: var(--card-hover-bg);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card {
    width: 160px;
    height: 240px;
  }
  
  .textBox > .head {
    font-size: 16px;
  }
  
  .textBox > .price {
    font-size: 14px;
  }
  
  .textBox {
    gap: 10px;
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .card {
    width: 140px;
    height: 200px;
  }
  
  .textBox > .head {
    font-size: 14px;
  }
  
  .textBox > .price {
    font-size: 12px;
  }
  
  .textBox > .subtitle {
    font-size: 10px;
  }
  
  .textBox > .description {
    font-size: 9px;
  }
}

/* 添加一些额外的视觉效果 */
.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.card:hover::before {
  opacity: 1;
  animation: shine 1.5s ease-in-out;
}

@keyframes shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
