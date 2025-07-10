<template>
  <div class="chengdu-map-background" :style="backgroundStyle">
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { generateChengduMapSVG, svgToDataUrl } from '@/utils/generateChengduMapSVG'

const props = defineProps({
  opacity: {
    type: Number,
    default: 0.3
  },
  gradientOpacity: {
    type: Array,
    default: () => [0.98, 0.95, 0.9, 0.85, 0.8, 0.75, 0.65, 0.5, 0.35, 0.2, 0.05, 0]
  }
})

const mapSvgDataUrl = ref('')
const isLoading = ref(true)

// 生成渐变遮罩
const generateGradientMask = () => {
  const steps = props.gradientOpacity
  const stepSize = 100 / (steps.length - 1)
  
  return steps.map((opacity, index) => {
    const position = index * stepSize
    const color = index < 4 ? '#e0f2fe' : 
                  index < 6 ? '#81d4fa' : 
                  index < 8 ? '#0288d1' : 
                  index < 10 ? '#263238' : '#000000'
    return `rgba(${hexToRgb(color)}, ${opacity}) ${position}%`
  }).join(', ')
}

// 十六进制颜色转RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '224, 242, 254'
}

// 计算背景样式 - 简化版，先确保基本显示
const backgroundStyle = computed(() => {
  // 暂时只使用基础渐变背景，确保不会白屏
  return {
    background: `linear-gradient(to bottom,
      #e0f2fe 0%, #b3e5fc 15%, #81d4fa 25%, #4fc3f7 35%,
      #29b6f6 45%, #0288d1 55%, #0277bd 65%, #01579b 75%,
      #263238 85%, #1a1a1a 95%, #000000 100%
    )`
  }

  // TODO: 后续添加地图功能
  // if (!mapSvgDataUrl.value) {
  //   return basicBackground
  // }
  // return mapBackground
})

// 加载成都地图 - 暂时禁用，确保页面正常显示
const loadChengduMap = async () => {
  try {
    isLoading.value = true
    console.log('🗺️ 成都地图功能暂时禁用，使用基础背景')
    // TODO: 后续启用地图功能
    // const svg = await generateChengduMapSVG()
    // if (svg) {
    //   mapSvgDataUrl.value = svgToDataUrl(svg)
    //   console.log('✅ 成都地图背景加载成功')
    // } else {
    //   console.warn('⚠️ 成都地图生成失败，使用默认背景')
    // }
  } catch (error) {
    console.error('❌ 加载成都地图背景失败:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // 暂时不加载地图，直接设置为完成状态
  isLoading.value = false
  console.log('📱 ChengduMapBackground 组件已挂载，使用基础渐变背景')
  // loadChengduMap()
})

// 暴露方法给父组件
defineExpose({
  reload: loadChengduMap,
  isLoading
})
</script>

<style scoped>
.chengdu-map-background {
  position: relative;
  width: 100%;
  height: 100%;
  transition: background 0.5s ease;
}
</style>
