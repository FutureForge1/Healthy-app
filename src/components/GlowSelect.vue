<template>
  <div class="glow-select-wrapper" :class="{ 'is-focused': isFocused, 'is-disabled': disabled }">
    <!-- 发光边框效果 -->
    <div
      :style="glowStyles"
      :class="cn(
        'pointer-events-none absolute inset-0 size-full rounded-[inherit] will-change-[background-position] transition-opacity duration-300',
        isFocused ? 'opacity-100 motion-safe:animate-glow' : 'opacity-60',
        glowClass
      )"
    ></div>
    
    <!-- 下拉框容器 -->
    <div class="select-container">
      <!-- 选择框 -->
      <div 
        class="select-trigger"
        :class="{ 'is-open': isOpen, 'is-disabled': disabled }"
        @click="toggleDropdown"
        @keydown.enter="toggleDropdown"
        @keydown.space.prevent="toggleDropdown"
        @keydown.escape="closeDropdown"
        @keydown.arrow-down.prevent="openDropdown"
        tabindex="0"
        role="combobox"
        :aria-expanded="isOpen"
        :aria-haspopup="true"
        :aria-disabled="disabled"
      >
        <span class="select-value" :class="{ 'is-placeholder': !selectedOption }">
          {{ selectedOption ? selectedOption.label : placeholder }}
        </span>
        <div class="select-arrow" :class="{ 'is-rotated': isOpen }">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      
      <!-- 下拉选项 -->
      <Transition name="dropdown">
        <div v-if="isOpen" class="select-dropdown" :style="dropdownStyles">
          <div class="dropdown-content">
            <div
              v-for="(option, index) in options"
              :key="option.value"
              class="select-option"
              :class="{ 
                'is-selected': option.value === modelValue,
                'is-highlighted': index === highlightedIndex
              }"
              @click="selectOption(option)"
              @mouseenter="highlightedIndex = index"
              role="option"
              :aria-selected="option.value === modelValue"
            >
              <span class="option-label">{{ option.label }}</span>
              <div v-if="option.value === modelValue" class="option-check">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <div v-if="options.length === 0" class="select-empty">
              {{ emptyText }}
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

// 工具函数
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

// Props 定义
const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: false
  },
  emptyText: {
    type: String,
    default: '暂无数据'
  },
  // 发光边框配置
  borderRadius: {
    type: Number,
    default: 8
  },
  glowColor: {
    type: [String, Array],
    default: () => ['#3b82f6', '#8b5cf6', '#06b6d4']
  },
  borderWidth: {
    type: Number,
    default: 2
  },
  duration: {
    type: Number,
    default: 3
  },
  glowClass: {
    type: String,
    default: ''
  }
})

// Emits 定义
const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur'])

// 响应式数据
const isOpen = ref(false)
const isFocused = ref(false)
const highlightedIndex = ref(-1)
const selectRef = ref(null)

// 计算属性
const selectedOption = computed(() => {
  return props.options.find(option => option.value === props.modelValue) || null
})

const glowStyles = computed(() => {
  return {
    '--border-radius': `${props.borderRadius}px`,
    '--border-width': `${props.borderWidth}px`,
    '--duration': `${props.duration}s`,
    backgroundImage: `radial-gradient(transparent,transparent, ${
      Array.isArray(props.glowColor) ? props.glowColor.join(',') : props.glowColor
    },transparent,transparent)`,
    backgroundSize: '300% 300%',
    mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
    WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    padding: 'var(--border-width)',
    borderRadius: 'var(--border-radius)',
  }
})

const dropdownStyles = computed(() => {
  return {
    borderRadius: `${props.borderRadius}px`
  }
})

// 方法
const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    highlightedIndex.value = props.options.findIndex(option => option.value === props.modelValue)
    emit('focus')
    isFocused.value = true
  } else {
    emit('blur')
    isFocused.value = false
  }
}

const openDropdown = () => {
  if (props.disabled) return
  isOpen.value = true
  highlightedIndex.value = props.options.findIndex(option => option.value === props.modelValue)
  emit('focus')
  isFocused.value = true
}

const closeDropdown = () => {
  isOpen.value = false
  highlightedIndex.value = -1
  emit('blur')
  isFocused.value = false
}

const selectOption = (option) => {
  if (props.disabled) return
  emit('update:modelValue', option.value)
  emit('change', option.value, option)
  closeDropdown()
}

// 键盘导航
const handleKeydown = (event) => {
  if (!isOpen.value || props.disabled) return
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, props.options.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
      break
    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0 && highlightedIndex.value < props.options.length) {
        selectOption(props.options[highlightedIndex.value])
      }
      break
    case 'Escape':
      closeDropdown()
      break
  }
}

// 点击外部关闭
const handleClickOutside = (event) => {
  if (selectRef.value && !selectRef.value.contains(event.target)) {
    closeDropdown()
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})

// 监听器
watch(() => props.modelValue, () => {
  if (isOpen.value) {
    highlightedIndex.value = props.options.findIndex(option => option.value === props.modelValue)
  }
})
</script>

<style scoped>
/* 发光动画 */
@keyframes glow {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.motion-safe\:animate-glow {
  animation: glow var(--duration, 3s) ease-in-out infinite;
}

/* 组件样式 */
.glow-select-wrapper {
  position: relative;
  display: inline-block;
  min-width: 200px;
}

.select-container {
  position: relative;
  z-index: 1;
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  user-select: none;
}

.select-trigger:hover:not(.is-disabled) {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
}

.select-trigger.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
  background: rgba(248, 250, 252, 0.8);
}

.select-value {
  flex: 1;
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
}

.select-value.is-placeholder {
  color: #9ca3af;
  font-weight: 400;
}

.select-arrow {
  margin-left: 8px;
  color: #6b7280;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
}

.select-arrow.is-rotated {
  transform: rotate(180deg);
}

/* 下拉框样式 */
.select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 8px;
  box-shadow: 
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  z-index: 1000;
  overflow: hidden;
}

.dropdown-content {
  max-height: 200px;
  overflow-y: auto;
  padding: 4px;
}

.select-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.select-option:hover,
.select-option.is-highlighted {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.select-option.is-selected {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  font-weight: 500;
}

.option-label {
  flex: 1;
}

.option-check {
  margin-left: 8px;
  color: #3b82f6;
  display: flex;
  align-items: center;
}

.select-empty {
  padding: 16px 12px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
}

/* 过渡动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scaleY(0.8) translateY(-10px);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: scaleY(1) translateY(0);
}

/* 滚动条样式 */
.dropdown-content::-webkit-scrollbar {
  width: 4px;
}

.dropdown-content::-webkit-scrollbar-track {
  background: transparent;
}

.dropdown-content::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

.dropdown-content::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.8);
}
</style>
