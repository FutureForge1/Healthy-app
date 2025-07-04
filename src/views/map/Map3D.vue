<template>
  <div class="map3d-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2>成都市健康数据3D地图</h2>
        <p>基于地理信息的健康大数据可视化展示平台</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="showDataPanel">
          <el-icon><DataLine /></el-icon>
          数据面板
        </el-button>
        <el-button type="success" @click="showLayerControl">
          <el-icon><Operation /></el-icon>
          图层控制
        </el-button>
        <el-button @click="refreshMapData">
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
      </div>
    </div>

    <!-- 地图容器 -->
    <div class="map-section">
      <div class="map-wrapper">
        <!-- 3D地图组件 -->
        <ChengduMap3D 
          ref="map3dRef"
          :data-points="mapData.dataPoints"
          :health-facilities="mapData.healthFacilities"
          :population-density="mapData.populationDensity"
          @facility-click="handleFacilityClick"
          @area-click="handleAreaClick"
        />
        
        <!-- 地图图例 -->
        <div class="map-legend">
          <h4>图例说明</h4>
          <div class="legend-items">
            <div class="legend-item">
              <div class="legend-color hospital"></div>
              <span>医院 ({{ mapData.hospitals }})</span>
            </div>
            <div class="legend-item">
              <div class="legend-color clinic"></div>
              <span>诊所 ({{ mapData.clinics }})</span>
            </div>
            <div class="legend-item">
              <div class="legend-color pharmacy"></div>
              <span>药店 ({{ mapData.pharmacies }})</span>
            </div>
            <div class="legend-item">
              <div class="legend-color density-high"></div>
              <span>高密度人口区</span>
            </div>
            <div class="legend-item">
              <div class="legend-color density-medium"></div>
              <span>中密度人口区</span>
            </div>
            <div class="legend-item">
              <div class="legend-color density-low"></div>
              <span>低密度人口区</span>
            </div>
          </div>
        </div>

        <!-- 地图工具栏 -->
        <div class="map-toolbar">
          <div class="toolbar-section">
            <h5>视图控制</h5>
            <el-button-group size="small">
              <el-button @click="setView('overview')">全景</el-button>
              <el-button @click="setView('center')">市中心</el-button>
              <el-button @click="setView('districts')">区县</el-button>
            </el-button-group>
          </div>
          
          <div class="toolbar-section">
            <h5>数据类型</h5>
            <el-checkbox-group v-model="activeDataTypes" @change="updateMapData">
              <el-checkbox label="population">人口分布</el-checkbox>
              <el-checkbox label="medical">医疗机构</el-checkbox>
              <el-checkbox label="health">健康指标</el-checkbox>
              <el-checkbox label="emergency">应急设施</el-checkbox>
            </el-checkbox-group>
          </div>
          
          <div class="toolbar-section">
            <h5>时间范围</h5>
            <el-select v-model="timeRange" @change="updateMapData" size="small">
              <el-option label="实时数据" value="realtime" />
              <el-option label="最近7天" value="7d" />
              <el-option label="最近30天" value="30d" />
              <el-option label="最近90天" value="90d" />
            </el-select>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据统计面板 -->
    <div class="stats-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ formatNumber(mapStats.totalPopulation) }}</div>
              <div class="stat-label">总人口数</div>
              <div class="stat-trend positive">
                <el-icon><ArrowUp /></el-icon>
                +{{ mapStats.populationGrowth }}%
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon">
              <el-icon><House /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ mapStats.totalFacilities }}</div>
              <div class="stat-label">医疗机构</div>
              <div class="stat-trend">
                覆盖率 {{ mapStats.coverageRate }}%
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon">
              <el-icon><Monitor /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ mapStats.healthIndex }}</div>
              <div class="stat-label">健康指数</div>
              <div class="stat-trend positive">
                较上月 +{{ mapStats.healthImprovement }}
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ mapStats.emergencyEvents }}</div>
              <div class="stat-label">应急事件</div>
              <div class="stat-trend">
                风险等级 {{ mapStats.riskLevel }}
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 区域详情对话框 -->
    <el-dialog
      v-model="areaDialogVisible"
      :title="selectedArea?.name || '区域详情'"
      width="800px"
    >
      <div v-if="selectedArea" class="area-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="区域名称">
            {{ selectedArea.name }}
          </el-descriptions-item>
          <el-descriptions-item label="区域代码">
            {{ selectedArea.code }}
          </el-descriptions-item>
          <el-descriptions-item label="人口数量">
            {{ formatNumber(selectedArea.population) }}
          </el-descriptions-item>
          <el-descriptions-item label="面积">
            {{ selectedArea.area }} km²
          </el-descriptions-item>
          <el-descriptions-item label="人口密度">
            {{ selectedArea.density }} 人/km²
          </el-descriptions-item>
          <el-descriptions-item label="医疗机构数">
            {{ selectedArea.facilities }}
          </el-descriptions-item>
          <el-descriptions-item label="健康指数">
            <el-tag :type="getHealthIndexTag(selectedArea.healthIndex)">
              {{ selectedArea.healthIndex }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="风险等级">
            <el-tag :type="getRiskLevelTag(selectedArea.riskLevel)">
              {{ selectedArea.riskLevel }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <div class="detail-charts">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="chart-container">
                <h5>人口年龄分布</h5>
                <div ref="ageDistributionChart" class="chart"></div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="chart-container">
                <h5>医疗资源分布</h5>
                <div ref="medicalResourceChart" class="chart"></div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="areaDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="viewAreaReport">查看详细报告</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 医疗机构详情对话框 -->
    <el-dialog
      v-model="facilityDialogVisible"
      :title="selectedFacility?.name || '医疗机构详情'"
      width="600px"
    >
      <div v-if="selectedFacility" class="facility-detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="机构名称">
            {{ selectedFacility.name }}
          </el-descriptions-item>
          <el-descriptions-item label="机构类型">
            <el-tag :type="getFacilityTypeTag(selectedFacility.type)">
              {{ getFacilityTypeText(selectedFacility.type) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="地址">
            {{ selectedFacility.address }}
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">
            {{ selectedFacility.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="床位数">
            {{ selectedFacility.beds || '无' }}
          </el-descriptions-item>
          <el-descriptions-item label="医护人员">
            {{ selectedFacility.staff || '无' }}
          </el-descriptions-item>
          <el-descriptions-item label="服务范围">
            {{ selectedFacility.serviceArea }}
          </el-descriptions-item>
          <el-descriptions-item label="运营状态">
            <el-tag :type="selectedFacility.status === '正常' ? 'success' : 'warning'">
              {{ selectedFacility.status }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="facilityDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="viewFacilityDetail">查看详情</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 数据面板抽屉 -->
    <el-drawer
      v-model="dataPanelVisible"
      title="数据面板"
      direction="rtl"
      size="400px"
    >
      <div class="data-panel">
        <div class="panel-section">
          <h4>实时数据</h4>
          <div class="data-list">
            <div class="data-item">
              <span class="data-label">在线监测点:</span>
              <span class="data-value">{{ realtimeData.monitoringPoints }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">数据更新时间:</span>
              <span class="data-value">{{ realtimeData.lastUpdate }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">数据完整性:</span>
              <span class="data-value">{{ realtimeData.completeness }}%</span>
            </div>
          </div>
        </div>

        <div class="panel-section">
          <h4>数据源</h4>
          <div class="data-sources">
            <div v-for="source in dataSources" :key="source.id" class="source-item">
              <div class="source-info">
                <span class="source-name">{{ source.name }}</span>
                <el-tag :type="source.status === 'active' ? 'success' : 'danger'" size="small">
                  {{ source.status === 'active' ? '正常' : '异常' }}
                </el-tag>
              </div>
              <div class="source-stats">
                <span>{{ source.recordCount }} 条记录</span>
              </div>
            </div>
          </div>
        </div>

        <div class="panel-section">
          <h4>快速操作</h4>
          <div class="quick-actions">
            <el-button type="primary" size="small" @click="exportMapData">
              导出地图数据
            </el-button>
            <el-button type="success" size="small" @click="generateMapReport">
              生成地图报告
            </el-button>
            <el-button type="warning" size="small" @click="refreshAllData">
              刷新全部数据
            </el-button>
          </div>
        </div>
      </div>
    </el-drawer>

    <!-- 图层控制抽屉 -->
    <el-drawer
      v-model="layerControlVisible"
      title="图层控制"
      direction="ltr"
      size="300px"
    >
      <div class="layer-control">
        <div class="layer-group">
          <h4>基础图层</h4>
          <div class="layer-items">
            <div v-for="layer in baseLayers" :key="layer.id" class="layer-item">
              <el-switch
                v-model="layer.visible"
                @change="toggleLayer(layer)"
              />
              <span class="layer-name">{{ layer.name }}</span>
              <el-slider
                v-model="layer.opacity"
                :min="0"
                :max="100"
                size="small"
                @change="updateLayerOpacity(layer)"
              />
            </div>
          </div>
        </div>

        <div class="layer-group">
          <h4>数据图层</h4>
          <div class="layer-items">
            <div v-for="layer in dataLayers" :key="layer.id" class="layer-item">
              <el-switch
                v-model="layer.visible"
                @change="toggleLayer(layer)"
              />
              <span class="layer-name">{{ layer.name }}</span>
              <el-slider
                v-model="layer.opacity"
                :min="0"
                :max="100"
                size="small"
                @change="updateLayerOpacity(layer)"
              />
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import {
  DataLine,
  Operation,
  Refresh,
  User,
  House,
  Monitor,
  Warning,
  ArrowUp
} from '@element-plus/icons-vue'
import ChengduMap3D from '@/components/ChengduMap3D.vue'
import { visualizationApi } from '@/api/visualization'

// 响应式数据
const loading = ref(false)
const dataPanelVisible = ref(false)
const layerControlVisible = ref(false)
const areaDialogVisible = ref(false)
const facilityDialogVisible = ref(false)
const selectedArea = ref(null)
const selectedFacility = ref(null)
const activeDataTypes = ref(['population', 'medical'])
const timeRange = ref('realtime')

// 图表引用
const map3dRef = ref(null)
const ageDistributionChart = ref(null)
const medicalResourceChart = ref(null)

// 地图数据
const mapData = reactive({
  dataPoints: 1247,
  healthFacilities: [],
  populationDensity: [],
  hospitals: 156,
  clinics: 892,
  pharmacies: 1543
})

// 地图统计
const mapStats = reactive({
  totalPopulation: 21400000,
  populationGrowth: 2.3,
  totalFacilities: 2591,
  coverageRate: 95.8,
  healthIndex: 87.5,
  healthImprovement: 3.2,
  emergencyEvents: 5,
  riskLevel: '低'
})

// 实时数据
const realtimeData = reactive({
  monitoringPoints: 1247,
  lastUpdate: '2023-12-01 17:30:25',
  completeness: 98.5
})

// 数据源
const dataSources = ref([
  {
    id: 1,
    name: '人口统计数据',
    status: 'active',
    recordCount: 21400000
  },
  {
    id: 2,
    name: '医疗机构数据',
    status: 'active',
    recordCount: 2591
  },
  {
    id: 3,
    name: '健康指标数据',
    status: 'active',
    recordCount: 156780
  },
  {
    id: 4,
    name: '应急设施数据',
    status: 'active',
    recordCount: 892
  }
])

// 基础图层
const baseLayers = ref([
  {
    id: 'terrain',
    name: '地形图层',
    visible: true,
    opacity: 100
  },
  {
    id: 'buildings',
    name: '建筑图层',
    visible: true,
    opacity: 80
  },
  {
    id: 'roads',
    name: '道路图层',
    visible: true,
    opacity: 60
  }
])

// 数据图层
const dataLayers = ref([
  {
    id: 'population',
    name: '人口密度',
    visible: true,
    opacity: 70
  },
  {
    id: 'medical',
    name: '医疗机构',
    visible: true,
    opacity: 90
  },
  {
    id: 'health',
    name: '健康指标',
    visible: false,
    opacity: 60
  },
  {
    id: 'emergency',
    name: '应急设施',
    visible: false,
    opacity: 80
  }
])

// 格式化数字
const formatNumber = (num) => {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(1) + '千万'
  } else if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// 获取健康指数标签
const getHealthIndexTag = (index) => {
  if (index >= 90) return 'success'
  if (index >= 70) return 'warning'
  return 'danger'
}

// 获取风险等级标签
const getRiskLevelTag = (level) => {
  const levelMap = {
    '低': 'success',
    '中': 'warning',
    '高': 'danger'
  }
  return levelMap[level] || 'info'
}

// 获取机构类型标签
const getFacilityTypeTag = (type) => {
  const typeMap = {
    'hospital': 'danger',
    'clinic': 'warning',
    'pharmacy': 'success'
  }
  return typeMap[type] || 'info'
}

// 获取机构类型文本
const getFacilityTypeText = (type) => {
  const textMap = {
    'hospital': '医院',
    'clinic': '诊所',
    'pharmacy': '药店'
  }
  return textMap[type] || '未知'
}

// 设置视图
const setView = (viewType) => {
  if (map3dRef.value) {
    map3dRef.value.setView(viewType)
  }
  ElMessage.success(`已切换到${viewType}视图`)
}

// 更新地图数据
const updateMapData = () => {
  loadMapData()
}

// 处理医疗机构点击
const handleFacilityClick = (facility) => {
  selectedFacility.value = facility
  facilityDialogVisible.value = true
}

// 处理区域点击
const handleAreaClick = (area) => {
  selectedArea.value = area
  areaDialogVisible.value = true

  // 初始化区域详情图表
  nextTick(() => {
    initAreaCharts()
  })
}

// 初始化区域详情图表
const initAreaCharts = () => {
  // 人口年龄分布图表
  if (ageDistributionChart.value) {
    const chart1 = echarts.init(ageDistributionChart.value)
    const option1 = {
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: '70%',
        data: [
          { value: 25, name: '0-18岁' },
          { value: 45, name: '19-35岁' },
          { value: 20, name: '36-60岁' },
          { value: 10, name: '60岁以上' }
        ]
      }]
    }
    chart1.setOption(option1)
  }

  // 医疗资源分布图表
  if (medicalResourceChart.value) {
    const chart2 = echarts.init(medicalResourceChart.value)
    const option2 = {
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['医院', '诊所', '药店', '急救站']
      },
      yAxis: { type: 'value' },
      series: [{
        type: 'bar',
        data: [12, 45, 78, 8],
        itemStyle: { color: '#5470c6' }
      }]
    }
    chart2.setOption(option2)
  }
}

// 显示数据面板
const showDataPanel = () => {
  dataPanelVisible.value = true
}

// 显示图层控制
const showLayerControl = () => {
  layerControlVisible.value = true
}

// 切换图层
const toggleLayer = (layer) => {
  if (map3dRef.value) {
    map3dRef.value.toggleLayer(layer.id, layer.visible)
  }
}

// 更新图层透明度
const updateLayerOpacity = (layer) => {
  if (map3dRef.value) {
    map3dRef.value.updateLayerOpacity(layer.id, layer.opacity / 100)
  }
}

// 查看区域报告
const viewAreaReport = () => {
  ElMessage.info('正在生成区域详细报告...')
  areaDialogVisible.value = false
}

// 查看机构详情
const viewFacilityDetail = () => {
  ElMessage.info('正在跳转到机构详情页面...')
  facilityDialogVisible.value = false
}

// 导出地图数据
const exportMapData = () => {
  ElMessage.success('正在导出地图数据...')
}

// 生成地图报告
const generateMapReport = () => {
  ElMessage.success('正在生成地图报告...')
}

// 刷新全部数据
const refreshAllData = () => {
  loadMapData()
  ElMessage.success('数据刷新完成')
}

// 刷新地图数据
const refreshMapData = () => {
  loadMapData()
}

// 加载地图数据
const loadMapData = async () => {
  try {
    loading.value = true

    // 调用真实API获取地图数据
    const [facilitiesResponse, areasResponse] = await Promise.all([
      visualizationApi.getMapData({ type: 'health-facilities' }),
      visualizationApi.getMapData({ type: 'district-areas' })
    ])

    if (facilitiesResponse.code === 200) {
      mapData.healthFacilities = facilitiesResponse.data.facilities || []
    }

    if (areasResponse.code === 200 && areasResponse.data.areas?.length > 0) {
      selectedArea.value = areasResponse.data.areas[0] // 默认选择第一个区域
    }

  } catch (error) {
    ElMessage.error('加载地图数据失败，请检查后端服务是否正常运行')
    console.error('加载地图数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  loadMapData()
})
</script>

<style scoped>
.map3d-page {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h2 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
}

.header-content p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 地图区域 */
.map-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.map-wrapper {
  position: relative;
  height: 600px;
}

/* 地图图例 */
.map-legend {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 200px;
}

.map-legend h4 {
  margin: 0 0 12px 0;
  color: #2c3e50;
  font-size: 14px;
  font-weight: 600;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-color.hospital { background: #ff4d4f; }
.legend-color.clinic { background: #faad14; }
.legend-color.pharmacy { background: #52c41a; }
.legend-color.density-high { background: #722ed1; }
.legend-color.density-medium { background: #1890ff; }
.legend-color.density-low { background: #13c2c2; }

/* 地图工具栏 */
.map-toolbar {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 250px;
}

.toolbar-section {
  margin-bottom: 16px;
}

.toolbar-section:last-child {
  margin-bottom: 0;
}

.toolbar-section h5 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 12px;
  font-weight: 600;
}

/* 统计区域 */
.stats-section {
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 4px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #8c8c8c;
}

.stat-trend.positive {
  color: #52c41a;
}

/* 区域详情 */
.area-detail {
  max-height: 600px;
  overflow-y: auto;
}

.detail-charts {
  margin-top: 20px;
}

.chart-container {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.chart-container h5 {
  margin: 0 0 12px 0;
  color: #2c3e50;
  font-size: 14px;
  font-weight: 600;
}

.chart {
  width: 100%;
  height: 200px;
}

/* 机构详情 */
.facility-detail {
  max-height: 400px;
  overflow-y: auto;
}

/* 数据面板 */
.data-panel {
  padding: 16px;
}

.panel-section {
  margin-bottom: 24px;
}

.panel-section h4 {
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

.data-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.data-label {
  font-size: 14px;
  color: #64748b;
}

.data-value {
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
}

.data-sources {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.source-item {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.source-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.source-name {
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
}

.source-stats {
  font-size: 12px;
  color: #8c8c8c;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 图层控制 */
.layer-control {
  padding: 16px;
}

.layer-group {
  margin-bottom: 24px;
}

.layer-group h4 {
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

.layer-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.layer-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.layer-name {
  flex: 1;
  font-size: 14px;
  color: #2c3e50;
}

/* 对话框样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .map3d-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .map-wrapper {
    height: 400px;
  }

  .map-legend,
  .map-toolbar {
    position: relative;
    top: auto;
    left: auto;
    right: auto;
    margin-bottom: 16px;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>
