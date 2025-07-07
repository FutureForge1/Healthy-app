<template>
  <div class="search-container" id="search-poda">
    <div class="glow"></div>
    <div class="dark-border-bg"></div>
    <div class="dark-border-bg"></div>
    <div class="dark-border-bg"></div>
    <div class="white"></div>
    <div class="border"></div>

    <div id="main" class="search-main">
      <input 
        :placeholder="placeholder" 
        type="text" 
        :value="modelValue"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        class="search-input" 
      />
      <div id="input-mask" class="input-mask"></div>
      <div id="blue-mask" class="blue-mask"></div>
      
      <!-- 过滤按钮 -->
      <div class="filter-border" v-if="showFilter"></div>
      <div id="filter-icon" class="filter-icon" v-if="showFilter" @click="handleFilter">
        <svg
          preserveAspectRatio="none"
          height="24"
          width="24"
          viewBox="4.8 4.56 14.832 15.408"
          fill="none"
        >
          <path
            d="M8.16 6.65002H15.83C16.47 6.65002 16.99 7.17002 16.99 7.81002V9.09002C16.99 9.56002 16.7 10.14 16.41 10.43L13.91 12.64C13.56 12.93 13.33 13.51 13.33 13.98V16.48C13.33 16.83 13.1 17.29 12.81 17.47L12 17.98C11.24 18.45 10.2 17.92 10.2 16.99V13.91C10.2 13.5 9.97 12.98 9.73 12.69L7.52 10.36C7.23 10.08 7 9.55002 7 9.20002V7.87002C7 7.17002 7.52 6.65002 8.16 6.65002Z"
            stroke="currentColor"
            stroke-width="1.2"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      
      <!-- 搜索图标 -->
      <div id="search-icon" class="search-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke-linejoin="round"
          stroke-linecap="round"
          height="22"
          fill="none"
        >
          <circle stroke="url(#search-gradient)" r="8" cy="11" cx="11"></circle>
          <line
            stroke="url(#search-line)"
            y2="16.65"
            y1="22"
            x2="16.65"
            x1="22"
          />
          <defs>
            <linearGradient gradientTransform="rotate(50)" id="search-gradient">
              <stop stop-color="#3b82f6" offset="0%"></stop>
              <stop stop-color="#1e40af" offset="100%"></stop>
            </linearGradient>
            <linearGradient id="search-line">
              <stop stop-color="#1e40af" offset="0%"></stop>
              <stop stop-color="#3b82f6" offset="100%"></stop>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '搜索...'
  },
  showFilter: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'medium', // small, medium, large
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'search', 'filter', 'focus', 'blur'])

// Methods
const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
  emit('search', event.target.value)
}

const handleFocus = (event) => {
  emit('focus', event)
}

const handleBlur = (event) => {
  emit('blur', event)
}

const handleFilter = () => {
  emit('filter')
}
</script>

<style scoped>
/* 搜索容器 */
.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* 基础样式 */
.glow,
.border,
.dark-border-bg,
.white {
  max-height: 70px;
  max-width: 320px;
  height: 100%;
  width: 100%;
  position: absolute;
  overflow: hidden;
  z-index: -1;
  border-radius: 12px;
  filter: blur(3px);
}

/* 搜索输入框 */
.search-input {
  background-color: #ffffff;
  border: none;
  width: 307px;
  height: 56px;
  border-radius: 10px;
  color: #1e293b;
  padding-inline: 55px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.search-input:focus {
  outline: none;
  color: #0f172a;
}

/* 输入遮罩效果 */
.search-main:focus-within > .input-mask {
  display: none;
}

.input-mask {
  pointer-events: none;
  width: 100px;
  height: 20px;
  position: absolute;
  background: linear-gradient(90deg, transparent, #ffffff);
  top: 18px;
  left: 70px;
}

/* 蓝色遮罩 */
.blue-mask {
  pointer-events: none;
  width: 30px;
  height: 20px;
  position: absolute;
  background: #3b82f6;
  top: 10px;
  left: 5px;
  filter: blur(20px);
  opacity: 0.6;
  transition: all 2s;
}

.search-container:hover > .search-main > .blue-mask {
  opacity: 0;
}

/* 白色背景层 */
.white {
  max-height: 63px;
  max-width: 313px;
  border-radius: 10px;
  filter: blur(2px);
  background: #ffffff;
}

.white::before {
  content: "";
  z-index: -2;
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(83deg);
  position: absolute;
  width: 600px;
  height: 600px;
  background-repeat: no-repeat;
  background-position: 0 0;
  filter: brightness(1.2);
  background-image: conic-gradient(
    rgba(0, 0, 0, 0) 0%,
    #3b82f6,
    rgba(0, 0, 0, 0) 8%,
    rgba(0, 0, 0, 0) 50%,
    #22c55e,
    rgba(0, 0, 0, 0) 58%
  );
  transition: all 2s;
}

/* 边框层 */
.border {
  max-height: 59px;
  max-width: 309px;
  border-radius: 11px;
  filter: blur(0.5px);
}

.border::before {
  content: "";
  z-index: -2;
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(70deg);
  position: absolute;
  width: 600px;
  height: 600px;
  filter: brightness(1.1);
  background-repeat: no-repeat;
  background-position: 0 0;
  background-image: conic-gradient(
    #f8fafc,
    #3b82f6 5%,
    #f8fafc 14%,
    #f8fafc 50%,
    #22c55e 60%,
    #f8fafc 64%
  );
  transition: all 2s;
}

/* 深色边框背景 */
.dark-border-bg {
  max-height: 65px;
  max-width: 318px;
}

.dark-border-bg::before {
  content: "";
  z-index: -2;
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(82deg);
  position: absolute;
  width: 600px;
  height: 600px;
  background-repeat: no-repeat;
  background-position: 0 0;
  background-image: conic-gradient(
    rgba(0, 0, 0, 0),
    #1e40af,
    rgba(0, 0, 0, 0) 10%,
    rgba(0, 0, 0, 0) 50%,
    #16a34a,
    rgba(0, 0, 0, 0) 60%
  );
  transition: all 2s;
}

/* 悬停动画 */
.search-container:hover > .dark-border-bg::before {
  transform: translate(-50%, -50%) rotate(-98deg);
}

.search-container:hover > .glow::before {
  transform: translate(-50%, -50%) rotate(-120deg);
}

.search-container:hover > .white::before {
  transform: translate(-50%, -50%) rotate(-97deg);
}

.search-container:hover > .border::before {
  transform: translate(-50%, -50%) rotate(-110deg);
}

/* 聚焦动画 */
.search-container:focus-within > .dark-border-bg::before {
  transform: translate(-50%, -50%) rotate(442deg);
  transition: all 4s;
}

.search-container:focus-within > .glow::before {
  transform: translate(-50%, -50%) rotate(420deg);
  transition: all 4s;
}

.search-container:focus-within > .white::before {
  transform: translate(-50%, -50%) rotate(443deg);
  transition: all 4s;
}

.search-container:focus-within > .border::before {
  transform: translate(-50%, -50%) rotate(430deg);
  transition: all 4s;
}

/* 发光效果 */
.glow {
  overflow: hidden;
  filter: blur(30px);
  opacity: 0.3;
  max-height: 130px;
  max-width: 360px;
}

.glow:before {
  content: "";
  z-index: -2;
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(60deg);
  position: absolute;
  width: 999px;
  height: 999px;
  background-repeat: no-repeat;
  background-position: 0 0;
  background-image: conic-gradient(
    #f8fafc,
    #3b82f6 5%,
    #f8fafc 38%,
    #f8fafc 50%,
    #22c55e 60%,
    #f8fafc 87%
  );
  transition: all 2s;
}

/* 过滤按钮 */
.filter-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  max-height: 40px;
  max-width: 38px;
  height: 100%;
  width: 100%;
  isolation: isolate;
  overflow: hidden;
  border-radius: 10px;
  background: linear-gradient(180deg, #f1f5f9, #e2e8f0, #cbd5e1);
  border: 1px solid #e2e8f0;
  cursor: pointer;
  color: #64748b;
  transition: all 0.3s ease;
}

.filter-icon:hover {
  background: linear-gradient(180deg, #e2e8f0, #cbd5e1, #94a3b8);
  color: #475569;
  transform: scale(1.05);
}

.filter-border {
  height: 42px;
  width: 40px;
  position: absolute;
  overflow: hidden;
  top: 7px;
  right: 7px;
  border-radius: 10px;
}

.filter-border::before {
  content: "";
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(90deg);
  position: absolute;
  width: 600px;
  height: 600px;
  background-repeat: no-repeat;
  background-position: 0 0;
  filter: brightness(1.2);
  background-image: conic-gradient(
    rgba(0, 0, 0, 0),
    #cbd5e1,
    rgba(0, 0, 0, 0) 50%,
    rgba(0, 0, 0, 0) 50%,
    #cbd5e1,
    rgba(0, 0, 0, 0) 100%
  );
  animation: rotate 4s linear infinite;
}

/* 搜索图标 */
.search-icon {
  position: absolute;
  left: 18px;
  top: 17px;
  z-index: 2;
}

/* 主容器 */
.search-main {
  position: relative;
}

/* 旋转动画 */
@keyframes rotate {
  100% {
    transform: translate(-50%, -50%) rotate(450deg);
  }
}

/* 尺寸变体 */
.search-container.small .search-input {
  width: 250px;
  height: 44px;
  font-size: 14px;
  padding-inline: 45px;
}

.search-container.small .glow,
.search-container.small .border,
.search-container.small .dark-border-bg,
.search-container.small .white {
  max-height: 56px;
  max-width: 264px;
}

.search-container.large .search-input {
  width: 380px;
  height: 64px;
  font-size: 18px;
  padding-inline: 65px;
}

.search-container.large .glow,
.search-container.large .border,
.search-container.large .dark-border-bg,
.search-container.large .white {
  max-height: 78px;
  max-width: 394px;
}
</style>
