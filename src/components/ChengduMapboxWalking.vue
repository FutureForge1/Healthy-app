<template>
  <div class="mapbox-walking-container">
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p>正在加载成都3D地图...</p>
      </div>
    </div>
    
    <div ref="mapContainer" class="map-container"></div>


    <!-- 当前位置信息面板 -->
    <div v-if="currentLocation" class="location-panel">
      <h3>{{ currentLocation.name }}</h3>
      <div class="location-info">
        <div class="info-item">
          <span>总人口:</span>
          <span>{{ currentLocation.totalPopulation }}万人</span>
        </div>
        <div class="info-item">
          <span>出生人口:</span>
          <span>{{ currentLocation.birthPopulation }}人</span>
        </div>
        <div class="info-item">
          <span>死亡人口:</span>
          <span>{{ currentLocation.deathPopulation }}人</span>
        </div>
        <div class="info-item">
          <span>自然增长率:</span>
          <span>{{ currentLocation.growthRate }}‰</span>
        </div>
      </div>
    </div>

    <!-- 调试信息面板 -->
    <div class="debug-panel">
      <div class="debug-title">🐛 调试信息</div>
      <div class="debug-item">
        <span>小人位置:</span>
        <span>{{ characterPosition[0].toFixed(4) }}, {{ characterPosition[1].toFixed(4) }}</span>
      </div>
      <div class="debug-item">
        <span>地图中心:</span>
        <span>{{ mapCenter }}</span>
      </div>
      <div class="debug-item">
        <span>缩放级别:</span>
        <span>{{ mapZoom }}</span>
      </div>
      <div class="debug-item">
        <span>小人状态:</span>
        <span>{{ isWalking ? '行走中' : '静止' }}</span>
      </div>
      <div class="debug-item">
        <span>轨迹点数:</span>
        <span>{{ trailCoordinates.length }}</span>
      </div>
      <div class="debug-controls">
        <button @click="clearTrail" class="trail-button">清除轨迹</button>
      </div>
    </div>
    
    <!-- 小地图 -->
    <div class="minimap">
      <div class="minimap-title">当前位置</div>
      <div class="minimap-content">
        <div 
          v-for="district in data" 
          :key="district.name"
          class="minimap-district"
          :class="{ active: currentLocation?.name === district.name }"
        >
          {{ district.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import mapboxgl from 'mapbox-gl'

// Props
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['district-click'])

// 响应式数据
const mapContainer = ref(null)
const loading = ref(true)
const currentLocation = ref(null)
const mapCenter = ref('104.0648, 30.5728')
const mapZoom = ref(14)

// Mapbox 相关变量
let map = null
let characterMarker = null
let characterElement = null

// 轨迹线相关变量
const trailCoordinates = ref([])
let trailSource = null
let walkingAnimation = null
let isWalking = false

// 键盘控制状态
const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
  space: false
}

// 角色移动参数
const moveSpeed = 0.0005 // 经纬度单位的移动速度
let characterPosition = [104.0648, 30.5728] // 成都市中心坐标
let characterRotation = 0 // 角色朝向

// 您的 Mapbox 配置
const MAPBOX_TOKEN = 'pk.eyJ1Ijoic2tkZ2ZwYm0iLCJhIjoiY21jajRqdjh0MDA4NjJrcHo5NWs3bzBkZyJ9.t48GVCfnJ4Jled4N8s-PWA'
const CUSTOM_STYLE = 'mapbox://styles/skdgfpbm/cmcsozl1t000m01sqfmtbcor5'

// 初始化地图
const initMap = async () => {
  try {
    mapboxgl.accessToken = MAPBOX_TOKEN
    
    // 创建地图
    map = new mapboxgl.Map({
      container: mapContainer.value,
      style: CUSTOM_STYLE, // 使用您的自定义样式
      center: [104.0648, 30.5728], // 成都市中心
      zoom: 15,
      pitch: 45, // 3D视角倾斜度
      bearing: 0,
      antialias: true
    })
    
    // 添加导航控件
    map.addControl(new mapboxgl.NavigationControl())
    
    // 地图加载完成后的处理
    map.on('load', () => {
      // 添加3D建筑物
      add3DBuildings()

      // 添加轨迹线图层
      addTrailLayer()

      // 创建小人角色
      createCharacter()

      // 加载成都区域数据
      loadChengduDistricts()

      // 设置键盘事件监听
      setupKeyboardControls()
      
      // 开始游戏循环
      startGameLoop()
      
      loading.value = false
      ElMessage.success('成都3D地图加载完成！使用WASD控制小人移动')
    })
    
    // 地图点击事件 - 小人走向点击位置
    map.on('click', (e) => {
      if (!isWalking) {
        moveCharacterTo([e.lngLat.lng, e.lngLat.lat])
      }
    })

    // 地图移动事件 - 更新调试信息
    map.on('move', () => {
      const center = map.getCenter()
      mapCenter.value = `${center.lng.toFixed(4)}, ${center.lat.toFixed(4)}`
      mapZoom.value = map.getZoom().toFixed(1)
    })
    
  } catch (error) {
    console.error('初始化地图失败:', error)
    ElMessage.error('地图加载失败')
    loading.value = false
  }
}

// 添加3D建筑物
const add3DBuildings = () => {
  // 检查地图样式是否支持 composite 数据源
  try {
    const sources = map.getStyle().sources
    if (sources && sources.composite) {
      // 如果有 composite 数据源，添加3D建筑物
      if (!map.getLayer('3d-buildings')) {
        map.addLayer({
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 10,
          'paint': {
            'fill-extrusion-color': [
              'interpolate',
              ['linear'],
              ['get', 'height'],
              0, '#74b9ff',
              50, '#0984e3',
              100, '#6c5ce7'
            ],
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              10, 0,
              10.05, ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              10, 0,
              10.05, ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.8
          }
        })
        console.log('3D建筑物图层添加成功')
      }
    } else {
      console.log('当前地图样式不支持3D建筑物，跳过添加')
    }
  } catch (error) {
    console.warn('添加3D建筑物失败:', error)
  }
}

// 添加轨迹线图层
const addTrailLayer = () => {
  try {
    // 添加轨迹线数据源
    map.addSource('trail', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: []
        }
      }
    })

    // 添加轨迹线图层
    map.addLayer({
      id: 'trail-line',
      type: 'line',
      source: 'trail',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#ff0000',
        'line-width': 4,
        'line-opacity': 0.8
      }
    })

    // 添加轨迹线发光效果
    map.addLayer({
      id: 'trail-glow',
      type: 'line',
      source: 'trail',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#ff0000',
        'line-width': 8,
        'line-opacity': 0.3,
        'line-blur': 2
      }
    }, 'trail-line')

    trailSource = map.getSource('trail')
    console.log('轨迹线图层添加成功')
  } catch (error) {
    console.warn('添加轨迹线图层失败:', error)
  }
}

// 更新轨迹线
const updateTrail = (position) => {
  if (!trailSource) return

  // 添加新位置到轨迹
  trailCoordinates.value.push([...position])

  // 限制轨迹点数量，避免性能问题
  if (trailCoordinates.value.length > 1000) {
    trailCoordinates.value = trailCoordinates.value.slice(-800)
  }

  // 更新轨迹线数据
  trailSource.setData({
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: trailCoordinates.value
    }
  })
}

// 清除轨迹线
const clearTrail = () => {
  trailCoordinates.value = []
  if (trailSource) {
    trailSource.setData({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: []
      }
    })
  }
  ElMessage.success('轨迹已清除')
}

// 创建小人角色
const createCharacter = () => {
  // 创建小人DOM元素
  characterElement = document.createElement('div')
  characterElement.className = 'character-marker'
  characterElement.style.cssText = `
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 80px;
    cursor: pointer;
    transition: transform 0.3s ease;
    filter: drop-shadow(0 0 15px rgba(255, 0, 0, 0.8));
  `

  characterElement.innerHTML = `
    <div class="running-character">
      🏃‍♂️
    </div>
  `

  // 重置小人位置到地图中心
  characterPosition = [104.0648, 30.5728]

  // 创建Mapbox标记
  characterMarker = new mapboxgl.Marker(characterElement, {
    anchor: 'bottom'
  })
    .setLngLat(characterPosition)
    .addTo(map)

  console.log('小人角色创建完成，位置:', characterPosition)
  console.log('小人元素:', characterElement)
  console.log('小人标记:', characterMarker)

  // 强制显示小人元素
  characterElement.style.display = 'flex'
  characterElement.style.visibility = 'visible'
  characterElement.style.opacity = '1'

  // 确保小人可见 - 移动地图到小人位置
  setTimeout(() => {
    map.flyTo({
      center: characterPosition,
      zoom: 16,
      duration: 1000
    })

    // 添加测试轨迹点
    updateTrail(characterPosition)
  }, 1000)
}

// 加载成都区域数据
const loadChengduDistricts = async () => {
  try {
    // 获取成都地理数据
    const response = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/510100_full.json')
    const geoData = await response.json()
    
    // 为每个区域添加人口数据
    if (props.data && props.data.length > 0) {
      console.log('3D地图接收到的数据:', props.data[0]) // 调试信息

      geoData.features.forEach(feature => {
        const districtData = props.data.find(d => {
          const featureName = feature.properties?.name
          const dataName = d?.name || d?.district

          if (!featureName || !dataName) return false

          return featureName.includes(dataName) || dataName.includes(featureName)
        })
        if (districtData) {
          console.log(`匹配成功: ${feature.properties?.name} -> ${districtData.name}`, districtData)
          feature.properties = { ...feature.properties, ...districtData }
        } else {
          console.log(`未找到匹配数据: ${feature.properties?.name}`)
        }
      })
    } else {
      console.log('3D地图未接收到数据或数据为空')
    }
    
    // 添加成都区域数据源
    map.addSource('chengdu-districts', {
      type: 'geojson',
      data: geoData
    })
    
    // 添加区域填充图层（根据人口数据着色）
    map.addLayer({
      id: 'chengdu-fill',
      type: 'fill',
      source: 'chengdu-districts',
      paint: {
        'fill-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          '#ff6b6b',
          [
            'case',
            ['!=', ['get', 'totalPopulation'], null],
            [
              'interpolate',
              ['linear'],
              ['to-number', ['get', 'totalPopulation']],
              0, '#74b9ff',
              50, '#0984e3',
              100, '#6c5ce7',
              200, '#a29bfe'
            ],
            '#e0e0e0'  // 默认颜色，当没有数据时
          ]
        ],
        'fill-opacity': 0.6
      }
    })
    
    // 添加区域边界图层
    map.addLayer({
      id: 'chengdu-border',
      type: 'line',
      source: 'chengdu-districts',
      paint: {
        'line-color': '#2d3436',
        'line-width': 2
      }
    })
    
    // 区域悬停和点击效果
    setupDistrictInteractions()
    
    console.log('成都区域数据加载完成')
    
  } catch (error) {
    console.error('加载区域数据失败:', error)
  }
}

// 设置区域交互
const setupDistrictInteractions = () => {
  let hoveredDistrictId = null

  // 鼠标悬停效果
  map.on('mousemove', 'chengdu-fill', (e) => {
    if (e.features.length > 0) {
      const feature = e.features[0]

      // 清除之前的悬停状态
      if (hoveredDistrictId !== null) {
        try {
          map.setFeatureState(
            { source: 'chengdu-districts', id: hoveredDistrictId },
            { hover: false }
          )
        } catch (error) {
          // 忽略错误，继续执行
        }
      }

      // 设置新的悬停状态
      hoveredDistrictId = feature.id || feature.properties?.name || Math.random()
      try {
        map.setFeatureState(
          { source: 'chengdu-districts', id: hoveredDistrictId },
          { hover: true }
        )
      } catch (error) {
        // 如果设置失败，直接改变鼠标样式
        console.log('悬停效果设置失败，使用备用方案')
      }

      // 更改鼠标样式
      map.getCanvas().style.cursor = 'pointer'
    }
  })

  map.on('mouseleave', 'chengdu-fill', () => {
    if (hoveredDistrictId !== null) {
      try {
        map.setFeatureState(
          { source: 'chengdu-districts', id: hoveredDistrictId },
          { hover: false }
        )
      } catch (error) {
        // 忽略错误
      }
    }
    hoveredDistrictId = null
    map.getCanvas().style.cursor = ''
  })

  // 点击区域事件
  map.on('click', 'chengdu-fill', (e) => {
    if (e.features.length > 0) {
      const feature = e.features[0]
      const districtData = feature.properties

      // 更新当前位置信息
      console.log('点击区域数据:', districtData) // 调试信息
      currentLocation.value = {
        name: districtData.name || '未知区域',
        totalPopulation: districtData.totalPopulation || 0,
        birthPopulation: districtData.birthPopulation || 0,
        deathPopulation: districtData.deathPopulation || 0,
        growthRate: districtData.growthRate || 0
      }
      console.log('更新后的位置信息:', currentLocation.value) // 调试信息

      // 触发事件
      emit('district-click', currentLocation.value)

      // 小人走向该区域中心（简化版本）
      const bounds = new mapboxgl.LngLatBounds()
      if (feature.geometry.type === 'Polygon') {
        feature.geometry.coordinates[0].forEach(coord => {
          bounds.extend(coord)
        })
        const center = bounds.getCenter()
        moveCharacterTo([center.lng, center.lat])
      }
    }
  })
}

// 设置键盘控制
const setupKeyboardControls = () => {
  // 键盘按下事件
  const handleKeyDown = (e) => {
    switch (e.code) {
      case 'KeyW':
        keys.w = true
        break
      case 'KeyA':
        keys.a = true
        break
      case 'KeyS':
        keys.s = true
        break
      case 'KeyD':
        keys.d = true
        break
      case 'Space':
        keys.space = true
        e.preventDefault()
        break
    }
  }

  // 键盘释放事件
  const handleKeyUp = (e) => {
    switch (e.code) {
      case 'KeyW':
        keys.w = false
        break
      case 'KeyA':
        keys.a = false
        break
      case 'KeyS':
        keys.s = false
        break
      case 'KeyD':
        keys.d = false
        break
      case 'Space':
        keys.space = false
        break
    }
  }

  // 添加事件监听器
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)

  // 存储清理函数
  window.removeKeyboardListeners = () => {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
  }
}

// 开始游戏循环
const startGameLoop = () => {
  const gameLoop = () => {
    updateCharacterMovement()
    checkCurrentDistrict()
    requestAnimationFrame(gameLoop)
  }
  gameLoop()
}

// 更新角色移动
const updateCharacterMovement = () => {
  if (!characterMarker || isWalking) return

  let moved = false
  const newPosition = [...characterPosition]

  // 根据键盘输入更新位置
  if (keys.w) {
    newPosition[1] += moveSpeed // 向北
    moved = true
  }
  if (keys.s) {
    newPosition[1] -= moveSpeed // 向南
    moved = true
  }
  if (keys.a) {
    newPosition[0] -= moveSpeed // 向西
    moved = true
  }
  if (keys.d) {
    newPosition[0] += moveSpeed // 向东
    moved = true
  }

  if (moved) {
    characterPosition = newPosition
    characterMarker.setLngLat(characterPosition)

    // 更新轨迹线
    updateTrail(characterPosition)

    // 添加行走动画和移动效果
    addWalkingAnimation()
    if (characterElement) {
      characterElement.classList.add('moving')
    }

    // 相机跟随
    map.easeTo({
      center: characterPosition,
      duration: 100
    })
  } else {
    // 停止行走动画和移动效果
    removeWalkingAnimation()
    if (characterElement) {
      characterElement.classList.remove('moving')
    }
  }
}

// 添加行走动画
const addWalkingAnimation = () => {
  if (characterElement) {
    characterElement.classList.add('walking')
  }
}

// 移除行走动画
const removeWalkingAnimation = () => {
  if (characterElement) {
    characterElement.classList.remove('walking')
  }
}

// 移动小人到指定位置
const moveCharacterTo = (targetPosition) => {
  if (isWalking) return

  isWalking = true
  const startPosition = [...characterPosition]
  const distance = Math.sqrt(
    Math.pow(targetPosition[0] - startPosition[0], 2) +
    Math.pow(targetPosition[1] - startPosition[1], 2)
  )

  const duration = Math.max(1000, distance * 100000) // 根据距离计算动画时间
  const steps = Math.max(30, Math.floor(duration / 50)) // 计算步数

  let currentStep = 0

  const animate = () => {
    if (currentStep >= steps) {
      isWalking = false
      removeWalkingAnimation()
      // 移除移动动画类
      if (characterElement) {
        characterElement.classList.remove('moving')
      }
      return
    }

    const progress = currentStep / steps
    // 使用缓动函数让移动更自然
    const easeProgress = 1 - Math.pow(1 - progress, 2)

    const currentPosition = [
      startPosition[0] + (targetPosition[0] - startPosition[0]) * easeProgress,
      startPosition[1] + (targetPosition[1] - startPosition[1]) * easeProgress
    ]

    characterPosition = currentPosition
    characterMarker.setLngLat(characterPosition)

    // 更新轨迹线
    updateTrail(characterPosition)

    addWalkingAnimation()

    // 添加移动动画类
    if (characterElement) {
      characterElement.classList.add('moving')
    }

    // 相机跟随
    map.easeTo({
      center: characterPosition,
      duration: 50
    })

    currentStep++
    setTimeout(animate, 40) // 稍微快一点
  }

  animate()
}

// 检测当前所在区域
const checkCurrentDistrict = () => {
  if (!map || !map.isStyleLoaded()) return

  try {
    // 检查数据源是否存在
    const source = map.getSource('chengdu-districts')
    if (!source) return

    // 查询当前位置的区域
    const features = map.querySourceFeatures('chengdu-districts', {
      filter: ['==', '$type', 'Polygon']
    })

    // 简单的点在多边形内检测（这里可以用更精确的算法）
    for (const feature of features) {
      if (feature.properties && feature.properties.name) {
        // 更新当前位置信息（简化版本）
        if (!currentLocation.value || currentLocation.value.name !== feature.properties.name) {
          console.log('移动到新区域:', feature.properties.name, feature.properties) // 调试信息
          currentLocation.value = {
            name: feature.properties.name || '未知区域',
            totalPopulation: feature.properties.totalPopulation || 0,
            birthPopulation: feature.properties.birthPopulation || 0,
            deathPopulation: feature.properties.deathPopulation || 0,
            growthRate: feature.properties.growthRate || 0
          }
          console.log('移动后的位置信息:', currentLocation.value) // 调试信息
          break
        }
      }
    }
  } catch (error) {
    // 忽略错误，避免控制台报错
  }
}

// 组件挂载
onMounted(() => {
  initMap()
})

// 组件卸载
onUnmounted(() => {
  if (walkingAnimation) {
    cancelAnimationFrame(walkingAnimation)
  }
  if (window.removeKeyboardListeners) {
    window.removeKeyboardListeners()
  }
  if (map) {
    map.remove()
  }
})

// 监听数据变化
watch(() => props.data, (newData) => {
  if (newData && newData.length > 0 && map && map.getSource('chengdu-districts')) {
    loadChengduDistricts()
  }
}, { deep: true })
</script>

<style scoped>
/* Mapbox GL CSS 导入 */
@import 'mapbox-gl/dist/mapbox-gl.css';

.mapbox-walking-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.map-container {
  width: 100%;
  height: 100%;
}

/* 加载动画 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  text-align: center;
  color: white;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 控制说明 */
.control-instructions {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  z-index: 100;
  min-width: 200px;
}

.instruction-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #4CAF50;
}

.instruction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.key {
  background: #333;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  color: #4CAF50;
}

/* 位置信息面板 */
.location-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  z-index: 100;
  min-width: 250px;
}

.location-panel h3 {
  margin: 0 0 15px 0;
  color: #4CAF50;
  font-size: 18px;
}

.location-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.info-item span:first-child {
  color: #ccc;
}

.info-item span:last-child {
  color: white;
  font-weight: bold;
}

/* 小地图 */
.minimap {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  z-index: 100;
  max-width: 200px;
  max-height: 300px;
  overflow-y: auto;
}

.minimap-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #4CAF50;
}

.minimap-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.minimap-district {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.minimap-district.active {
  background: #4CAF50;
  color: white;
  transform: scale(1.05);
}

/* 调试面板 */
.debug-panel {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  z-index: 100;
  min-width: 200px;
  font-family: monospace;
}

.debug-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #4CAF50;
}

.debug-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 12px;
}

.debug-item span:first-child {
  color: #ccc;
}

.debug-item span:last-child {
  color: #4CAF50;
  font-weight: bold;
}

.debug-controls {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.trail-button {
  background: linear-gradient(135deg, #ff4757, #ff3838);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
}

.trail-button:hover {
  background: linear-gradient(135deg, #ff3838, #ff2f2f);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 71, 87, 0.4);
}
</style>

<!-- 小人角色样式 -->
<style>
.character-marker {
  width: 120px !important;
  height: 120px !important;
  cursor: pointer;
  z-index: 10000 !important;
  position: absolute !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* 跑动角色样式 */
.running-character {
  font-size: 80px;
  animation: runningBounce 0.6s infinite ease-in-out;
  transition: transform 0.3s ease;
  filter: drop-shadow(0 0 15px rgba(255, 0, 0, 0.8));
}

/* 跑动弹跳动画 */
@keyframes runningBounce {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  25% {
    transform: translateY(-8px) scale(1.05) rotate(-2deg);
  }
  50% {
    transform: translateY(-4px) scale(1.1) rotate(0deg);
  }
  75% {
    transform: translateY(-8px) scale(1.05) rotate(2deg);
  }
}

/* 移动时的加速动画 */
.character-marker.moving .running-character {
  animation: runningFast 0.3s infinite ease-in-out;
}

@keyframes runningFast {
  0%, 100% {
    transform: translateY(0) scale(1) rotate(0deg);
  }
  25% {
    transform: translateY(-12px) scale(1.15) rotate(-5deg);
  }
  50% {
    transform: translateY(-6px) scale(1.2) rotate(0deg);
  }
  75% {
    transform: translateY(-12px) scale(1.15) rotate(5deg);
  }
}

/* 这些样式已经不需要了，因为我们简化了小人设计 */

@keyframes characterBounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.3;
  }
  100% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.8;
  }
}

/* 行走动画 - 简化版本 */
.character-marker.walking .character-emoji {
  animation: walkingEmoji 0.5s infinite ease-in-out;
}

.character-marker.walking .character-pulse {
  animation: walkingPulse 0.5s infinite ease-in-out;
}

@keyframes walkingEmoji {
  0%, 100% {
    transform: translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateY(-5px) rotate(5deg);
  }
}

@keyframes walkingPulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(0.9);
    border-color: #4CAF50;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    border-color: #FF9800;
  }
}



/* 小人出现动画 */
.character-marker {
  animation: characterAppear 1s ease-out;
}

@keyframes characterAppear {
  0% {
    opacity: 0;
    transform: scale(0.5) translateY(-20px);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1) translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0px);
  }
}
</style>
