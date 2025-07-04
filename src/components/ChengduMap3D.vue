<template>
  <div class="map-container">
    <div class="map-header">
      <h3>成都市3D地图</h3>
      <p>健康大数据覆盖区域</p>
    </div>
    
    <div
      ref="mapContainer"
      class="map-canvas"
      :class="{ 'loading': isLoading }"
    ></div>
    
    <div v-if="isLoading" class="map-loading">
      <el-icon class="loading-icon"><Loading /></el-icon>
      <span>正在加载3D地图...</span>
    </div>
    
    <div class="map-controls">
      <el-button-group size="small">
        <el-button @click="resetView" :icon="Refresh">重置视角</el-button>
        <el-button @click="toggleAnimation" :icon="VideoPlay">
          {{ isAnimating ? '暂停' : '播放' }}
        </el-button>
      </el-button-group>
    </div>
    
    <div class="map-info">
      <div class="info-item">
        <span class="label">覆盖区域:</span>
        <span class="value">23个区县</span>
      </div>
      <div class="info-item">
        <span class="label">数据点:</span>
        <span class="value">{{ dataPoints }}个</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Loading, Refresh, VideoPlay } from '@element-plus/icons-vue'
import * as THREE from 'three'

const mapContainer = ref(null)
const isLoading = ref(true)
const isAnimating = ref(true)
const dataPoints = ref(1247)

// Three.js 相关变量
let scene, camera, renderer
let mapGroup, animationId
let particleSystem

// 成都市区县数据（包含边界坐标）
const chengduDistricts = [
  {
    name: '锦江区',
    center: [104.0833, 30.6667],
    population: 124,
    boundary: [
      [104.06, 30.65], [104.10, 30.65], [104.10, 30.69], [104.06, 30.69]
    ]
  },
  {
    name: '青羊区',
    center: [104.0625, 30.6733],
    population: 91,
    boundary: [
      [104.04, 30.66], [104.08, 30.66], [104.08, 30.70], [104.04, 30.70]
    ]
  },
  {
    name: '金牛区',
    center: [104.0417, 30.6917],
    population: 127,
    boundary: [
      [104.02, 30.68], [104.06, 30.68], [104.06, 30.72], [104.02, 30.72]
    ]
  },
  {
    name: '武侯区',
    center: [104.0431, 30.6302],
    population: 137,
    boundary: [
      [104.02, 30.61], [104.07, 30.61], [104.07, 30.65], [104.02, 30.65]
    ]
  },
  {
    name: '成华区',
    center: [104.1019, 30.6597],
    population: 131,
    boundary: [
      [104.08, 30.64], [104.12, 30.64], [104.12, 30.68], [104.08, 30.68]
    ]
  },
  {
    name: '龙泉驿区',
    center: [104.2747, 30.5567],
    population: 117,
    boundary: [
      [104.25, 30.53], [104.30, 30.53], [104.30, 30.58], [104.25, 30.58]
    ]
  }
]

// 成都市整体边界（简化）
const chengduBoundary = [
  [103.70, 30.40], [103.80, 30.35], [103.95, 30.35], [104.15, 30.40],
  [104.35, 30.45], [104.40, 30.55], [104.45, 30.70], [104.40, 30.85],
  [104.30, 30.95], [104.10, 30.98], [103.90, 30.95], [103.75, 30.85],
  [103.70, 30.70], [103.68, 30.55], [103.70, 30.40]
]

// 初始化3D场景
const initThreeJS = () => {
  try {
    if (!mapContainer.value) {
      console.error('地图容器未找到')
      return
    }

    console.log('开始初始化3D场景...')
    
    // 创建场景
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0f172a)
    
    // 获取容器尺寸
    const width = mapContainer.value.clientWidth || 800
    const height = mapContainer.value.clientHeight || 400
    
    // 创建相机
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(0, 40, 60)
    
    // 创建渲染器
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true
    })
    renderer.setSize(width, height)
    renderer.setClearColor(0x0f172a, 1.0) // 确保不透明
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    
    // 添加到DOM
    mapContainer.value.appendChild(renderer.domElement)
    
    // 设置光源
    setupLighting()
    
    // 创建地图组
    mapGroup = new THREE.Group()
    scene.add(mapGroup)
    
    // 创建成都地图
    createChengduMap()

    // 立即渲染一帧测试
    renderer.render(scene, camera)
    console.log('首次渲染完成')

    // 开始动画
    animate()

    isLoading.value = false
    console.log('3D场景初始化完成')
    
  } catch (error) {
    console.error('3D场景初始化失败:', error)
    isLoading.value = false
  }
}

// 设置光源
const setupLighting = () => {
  // 环境光
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
  scene.add(ambientLight)
  
  // 主方向光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
  directionalLight.position.set(50, 100, 50)
  directionalLight.castShadow = true
  scene.add(directionalLight)
  
  // 点光源
  const pointLight = new THREE.PointLight(0x00ff88, 0.8, 200)
  pointLight.position.set(0, 30, 0)
  scene.add(pointLight)
}

// 创建成都地图
const createChengduMap = () => {
  // 创建成都市整体轮廓
  createCityBoundary()

  // 创建区县边界
  createDistrictBoundaries()

  // 创建区县数据可视化
  createDistrictData()

  // 创建数据连接网络
  createDataNetwork()

  // 创建粒子系统
  createParticles()
}

// 创建成都市整体轮廓
const createCityBoundary = () => {
  // 将地理坐标转换为3D坐标
  const points = chengduBoundary.map(coord => {
    const x = (coord[0] - 104.0) * 200 // 经度转换
    const z = (coord[1] - 30.6) * 200  // 纬度转换
    return new THREE.Vector2(x, z)
  })

  // 创建城市轮廓形状
  const shape = new THREE.Shape(points)

  // 挤出几何体创建3D城市轮廓
  const extrudeSettings = {
    depth: 2,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 2,
    bevelSize: 0.5,
    bevelThickness: 0.5
  }

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
  const material = new THREE.MeshLambertMaterial({
    color: 0x4a5568,
    transparent: true,
    opacity: 0.8
  })

  const cityBoundary = new THREE.Mesh(geometry, material)
  cityBoundary.rotation.x = -Math.PI / 2
  cityBoundary.position.y = 0.1
  cityBoundary.receiveShadow = true
  mapGroup.add(cityBoundary)
}

// 创建区县边界
const createDistrictBoundaries = () => {
  chengduDistricts.forEach((district, index) => {
    // 将区县边界坐标转换为3D坐标
    const points = district.boundary.map(coord => {
      const x = (coord[0] - 104.0) * 200
      const z = (coord[1] - 30.6) * 200
      return new THREE.Vector2(x, z)
    })

    // 创建区县形状
    const shape = new THREE.Shape(points)

    // 挤出几何体
    const extrudeSettings = {
      depth: 1,
      bevelEnabled: false
    }

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)

    // 区县颜色（健康数据主题）
    const hue = 0.25 + (index * 0.05) % 0.3
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color().setHSL(hue, 0.7, 0.6),
      transparent: true,
      opacity: 0.9
    })

    const districtMesh = new THREE.Mesh(geometry, material)
    districtMesh.rotation.x = -Math.PI / 2
    districtMesh.position.y = 2.2
    districtMesh.userData = {
      district: district.name,
      population: district.population
    }

    mapGroup.add(districtMesh)

    // 添加区县标签
    createDistrictLabel(district)
  })
}

// 创建区县标签
const createDistrictLabel = (district) => {
  const x = (district.center[0] - 104.0) * 200
  const z = (district.center[1] - 30.6) * 200

  // 创建文字纹理
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  canvas.width = 256
  canvas.height = 64

  // 绘制背景
  context.fillStyle = 'rgba(15, 23, 42, 0.9)'
  context.roundRect(0, 0, canvas.width, canvas.height, 8)
  context.fill()

  // 绘制边框
  context.strokeStyle = '#00ff88'
  context.lineWidth = 2
  context.roundRect(0, 0, canvas.width, canvas.height, 8)
  context.stroke()

  // 绘制文字
  context.fillStyle = '#ffffff'
  context.font = 'bold 20px "Microsoft YaHei", Arial'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(district.name, canvas.width / 2, canvas.height / 2)

  const texture = new THREE.CanvasTexture(canvas)
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true
  })

  const sprite = new THREE.Sprite(material)
  sprite.position.set(x, 8, z)
  sprite.scale.set(15, 4, 1)
  mapGroup.add(sprite)
}

// 创建区县数据可视化
const createDistrictData = () => {
  chengduDistricts.forEach((district, index) => {
    const x = (district.center[0] - 104.0) * 200
    const z = (district.center[1] - 30.6) * 200
    const height = district.population / 10

    // 创建数据柱
    const geometry = new THREE.CylinderGeometry(3, 4, height, 12)
    const hue = 0.25 + (index * 0.05) % 0.3
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color().setHSL(hue, 0.8, 0.7),
      transparent: true,
      opacity: 0.9,
      emissive: new THREE.Color().setHSL(hue, 0.5, 0.1)
    })

    const dataColumn = new THREE.Mesh(geometry, material)
    dataColumn.position.set(x, height / 2 + 3, z)
    dataColumn.userData = {
      district: district.name,
      population: district.population,
      originalY: height / 2 + 3,
      originalHeight: height
    }

    mapGroup.add(dataColumn)
  })
}

// 创建数据网络连接
const createDataNetwork = () => {
  // 创建中心数据节点
  const centralGeometry = new THREE.SphereGeometry(4, 32, 32)
  const centralMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ff88,
    transparent: true,
    opacity: 0.9,
    emissive: 0x004422
  })

  const centralNode = new THREE.Mesh(centralGeometry, centralMaterial)
  centralNode.position.set(0, 25, 0)
  centralNode.userData = { type: 'centralNode' }
  mapGroup.add(centralNode)

  // 创建区县到中心的连接线
  chengduDistricts.forEach((district, index) => {
    const x = (district.center[0] - 104.0) * 200
    const z = (district.center[1] - 30.6) * 200
    const height = district.population / 10

    // 创建连接线
    const points = []
    points.push(new THREE.Vector3(x, height / 2 + 3, z))
    points.push(new THREE.Vector3(x, height + 10, z))
    points.push(new THREE.Vector3(0, 25, 0))

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.6
    })

    const line = new THREE.Line(geometry, material)
    line.userData = { type: 'dataConnection', index }
    mapGroup.add(line)
  })

  // 创建数据流动效果
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2
    const radius = 12

    const ringGeometry = new THREE.TorusGeometry(2, 0.5, 8, 16)
    const ringMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color().setHSL(0.3 + i * 0.05, 0.8, 0.6),
      transparent: true,
      opacity: 0.8
    })

    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.position.set(
      Math.cos(angle) * radius,
      25 + Math.sin(i) * 3,
      Math.sin(angle) * radius
    )
    ring.userData = { type: 'dataRing', index: i }
    mapGroup.add(ring)
  }
}

// 创建简化粒子系统
const createParticles = () => {
  // 数据流粒子
  const particleCount = 300
  const positions = []
  const colors = []

  for (let i = 0; i < particleCount; i++) {
    // 在成都地图范围内分布
    positions.push(
      (Math.random() - 0.5) * 160,
      Math.random() * 40 + 5,
      (Math.random() - 0.5) * 120
    )

    // 健康数据主题色彩
    const hue = 0.25 + Math.random() * 0.3
    const color = new THREE.Color().setHSL(hue, 0.8, 0.6)
    colors.push(color.r, color.g, color.b)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  })

  particleSystem = new THREE.Points(geometry, material)
  scene.add(particleSystem)
}

// 动画循环
let frameCount = 0
const animate = () => {
  if (!isAnimating.value || !renderer || !scene || !camera) return

  animationId = requestAnimationFrame(animate)
  frameCount++

  const time = frameCount * 0.01

  // 地图组缓慢旋转
  if (mapGroup) {
    mapGroup.rotation.y += 0.002

    // 遍历地图组中的所有对象
    mapGroup.children.forEach(child => {
      // 数据柱动画
      if (child.userData && child.userData.district) {
        // 轻微浮动
        child.position.y = child.userData.originalY + Math.sin(time + child.userData.originalHeight) * 0.8

        // 轻微旋转
        child.rotation.y += 0.01
      }

      // 数据环旋转
      if (child.userData && child.userData.type === 'dataRing') {
        const index = child.userData.index
        child.rotation.x += 0.02 + index * 0.005
        child.rotation.z += 0.01
        child.position.y = 25 + Math.sin(time * 0.5 + index) * 2
      }

      // 中心数据节点脉动
      if (child.userData && child.userData.type === 'centralNode') {
        const scale = 1 + Math.sin(time * 2) * 0.15
        child.scale.set(scale, scale, scale)
        child.rotation.y += 0.02
      }

      // 数据连接线闪烁
      if (child.userData && child.userData.type === 'dataConnection') {
        const index = child.userData.index
        child.material.opacity = 0.4 + Math.sin(time * 2 + index) * 0.3
      }
    })
  }

  // 粒子系统动画
  if (particleSystem) {
    particleSystem.rotation.y += 0.001

    // 粒子上下浮动
    const positions = particleSystem.geometry.attributes.position.array
    for (let i = 1; i < positions.length; i += 3) {
      positions[i] += Math.sin(time * 0.5 + i * 0.01) * 0.03
    }
    particleSystem.geometry.attributes.position.needsUpdate = true
  }

  // 相机轨道运动
  const cameraTime = frameCount * 0.003
  const radius = 100
  camera.position.x = Math.cos(cameraTime) * radius
  camera.position.z = Math.sin(cameraTime) * radius
  camera.position.y = 60 + Math.sin(cameraTime * 0.3) * 20
  camera.lookAt(0, 15, 0)

  renderer.render(scene, camera)
}

// 重置视角
const resetView = () => {
  camera.position.set(0, 40, 60)
  camera.lookAt(0, 0, 0)
}

// 切换动画
const toggleAnimation = () => {
  isAnimating.value = !isAnimating.value
  if (isAnimating.value) {
    animate()
  }
}

// 处理窗口大小变化
const handleResize = () => {
  if (!mapContainer.value || !camera || !renderer) return
  
  const width = mapContainer.value.clientWidth
  const height = mapContainer.value.clientHeight
  
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

// 组件挂载
onMounted(async () => {
  try {
    await nextTick()

    setTimeout(() => {
      if (mapContainer.value) {
        initThreeJS()
      } else {
        console.error('地图容器未找到')
        isLoading.value = false
      }
    }, 200)

    window.addEventListener('resize', handleResize)

  } catch (error) {
    console.error('组件挂载失败:', error)
    isLoading.value = false
  }
})

// 组件卸载
onUnmounted(() => {
  console.log('ChengduMap3D 组件卸载')
  
  try {
    isAnimating.value = false
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    
    if (renderer) {
      renderer.dispose()
      if (mapContainer.value && renderer.domElement) {
        mapContainer.value.removeChild(renderer.domElement)
      }
    }
    
    if (scene) {
      scene.clear()
    }
    
    window.removeEventListener('resize', handleResize)
    
  } catch (error) {
    console.error('组件卸载错误:', error)
  }
})
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  border-radius: 0;
  overflow: hidden;
}

.map-header {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  color: white;
}

.map-header h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
}

.map-header p {
  margin: 0;
  font-size: 12px;
  opacity: 0.8;
}

.map-canvas {
  width: 100%;
  height: 100%;
  min-height: 400px;
  transition: opacity 0.3s ease;
  display: block;
}

.map-canvas.loading {
  opacity: 0.3;
}

.map-canvas canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.map-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: white;
  font-size: 14px;
}

.loading-icon {
  font-size: 24px;
  animation: spin 1s linear infinite;
}

.map-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}

.map-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 12px;
}

.info-item .label {
  opacity: 0.8;
}

.info-item .value {
  font-weight: 600;
  color: #00ff88;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
