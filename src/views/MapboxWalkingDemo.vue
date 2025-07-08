<template>
  <div class="mapbox-walking-demo">
    <!-- 顶部控制栏 -->
    <div class="control-bar">
      <div class="control-group">
        <label>年份选择:</label>
        <el-select v-model="selectedYear" @change="handleYearChange" style="width: 120px;">
          <el-option
            v-for="year in availableYears"
            :key="year"
            :label="year"
            :value="year"
          />
        </el-select>
      </div>
      
      <div class="control-group">
        <label>数据类型:</label>
        <el-select v-model="dataType" @change="handleDataTypeChange" style="width: 150px;">
          <el-option label="人口统计" value="population" />
          <el-option label="医疗机构" value="hospital" />
          <el-option label="经济指标" value="economy" />
        </el-select>
      </div>
      
      <div class="control-group">
        <el-button type="primary" @click="resetCharacterPosition">
          重置小人位置
        </el-button>
        <el-button @click="toggleFullscreen">
          {{ isFullscreen ? '退出全屏' : '全屏模式' }}
        </el-button>
      </div>
    </div>

    <!-- 统计信息卡片 -->
    <div class="stats-summary">
      <div class="stat-card">
        <div class="stat-title">总人口</div>
        <div class="stat-value">{{ totalPopulation }}万人</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">区域数量</div>
        <div class="stat-value">{{ regionData.length }}个</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">平均增长率</div>
        <div class="stat-value">{{ averageGrowthRate }}‰</div>
      </div>
    </div>

    <!-- Mapbox 3D 地图组件 -->
    <ChengduMapboxWalking 
      :data="regionData"
      @district-click="handleDistrictClick"
    />

    <!-- 详细信息对话框 -->
    <el-dialog
      v-model="showDetailDialog"
      :title="selectedDistrict?.name || '区域详情'"
      width="500px"
      :before-close="handleCloseDialog"
    >
      <div v-if="selectedDistrict" class="district-details">
        <div class="detail-section">
          <h4>基本信息</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">区域名称:</span>
              <span class="value">{{ selectedDistrict.name }}</span>
            </div>
            <div class="detail-item">
              <span class="label">总人口:</span>
              <span class="value">{{ selectedDistrict.totalPopulation }}万人</span>
            </div>
            <div class="detail-item">
              <span class="label">人口密度:</span>
              <span class="value">{{ calculatePopulationDensity(selectedDistrict) }}人/km²</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h4>人口变化</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">出生人口:</span>
              <span class="value positive">{{ selectedDistrict.birthPopulation }}人</span>
            </div>
            <div class="detail-item">
              <span class="label">死亡人口:</span>
              <span class="value negative">{{ selectedDistrict.deathPopulation }}人</span>
            </div>
            <div class="detail-item">
              <span class="label">自然增长率:</span>
              <span class="value" :class="selectedDistrict.growthRate >= 0 ? 'positive' : 'negative'">
                {{ selectedDistrict.growthRate }}‰
              </span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h4>历年趋势</h4>
          <div class="trend-chart">
            <div class="trend-item" v-for="year in recentYears" :key="year">
              <span class="year">{{ year }}</span>
              <div class="trend-bar">
                <div 
                  class="trend-fill" 
                  :style="{ width: getTrendWidth(year) + '%' }"
                ></div>
              </div>
              <span class="trend-value">{{ getTrendValue(year) }}万人</span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showDetailDialog = false">关闭</el-button>
          <el-button type="primary" @click="navigateToDistrict">
            小人前往该区域
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import ChengduMapboxWalking from '@/components/ChengduMapboxWalking.vue'
import populationApi from '@/api/population'

// 响应式数据
const selectedYear = ref(2023)
const dataType = ref('population')
const regionData = ref([])
const loading = ref(false)
const showDetailDialog = ref(false)
const selectedDistrict = ref(null)
const isFullscreen = ref(false)

// 可用年份
const availableYears = ref([2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023])
const recentYears = ref([2020, 2021, 2022, 2023])

// 计算属性
const totalPopulation = computed(() => {
  return regionData.value.reduce((sum, item) => sum + (item.totalPopulation || 0), 0).toFixed(1)
})

const averageGrowthRate = computed(() => {
  if (regionData.value.length === 0) return '0.0'
  const total = regionData.value.reduce((sum, item) => sum + (item.growthRate || 0), 0)
  return (total / regionData.value.length).toFixed(1)
})

// 加载区域数据
const loadRegionData = async () => {
  try {
    loading.value = true
    console.log(`加载${selectedYear.value}年区域数据...`)
    
    const response = await populationApi.getRegionPopulation({
      filters: {
        year: { eq: selectedYear.value }
      },
      sort: [{ field: 'population', order: 'desc' }],
      pageInfo: { index: 0, size: 50 }
    })
    
    console.log('API响应:', response)
    
    if (response && response.status === 0 && response.data && response.data.rows) {
      regionData.value = response.data.rows.map(item => ({
        name: item.name || '未知区域',
        totalPopulation: item.population || 0,
        birthPopulation: item.birthPopulation || 0,
        deathPopulation: item.deathPopulation || 0,
        growthRate: item.growthRate || 0,
        year: item.year || selectedYear.value
      }))
      
      console.log('处理后的区域数据:', regionData.value)
      ElMessage.success(`成功加载${regionData.value.length}个区域的数据`)
    } else {
      console.warn('API返回数据格式异常:', response)
      ElMessage.warning('暂无数据')
      regionData.value = []
    }
    
  } catch (error) {
    console.error('加载区域数据失败:', error)
    ElMessage.error('加载数据失败')
    regionData.value = []
  } finally {
    loading.value = false
  }
}

// 年份变化处理
const handleYearChange = () => {
  console.log('年份变化:', selectedYear.value)
  loadRegionData()
}

// 数据类型变化处理
const handleDataTypeChange = () => {
  console.log('数据类型变化:', dataType.value)
  // 这里可以根据不同数据类型加载不同的数据
  loadRegionData()
}

// 区域点击处理
const handleDistrictClick = (district) => {
  console.log('区域点击:', district)
  selectedDistrict.value = district
  showDetailDialog.value = true
}

// 关闭对话框
const handleCloseDialog = () => {
  showDetailDialog.value = false
  selectedDistrict.value = null
}

// 重置小人位置
const resetCharacterPosition = () => {
  ElMessage.info('小人位置已重置到成都市中心')
  // 这里可以通过事件或ref调用子组件的重置方法
}

// 切换全屏
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

// 计算人口密度（模拟数据）
const calculatePopulationDensity = (district) => {
  // 这里使用模拟的面积数据，实际应该从API获取
  const mockArea = Math.random() * 500 + 100 // 100-600 km²
  return Math.round((district.totalPopulation * 10000) / mockArea)
}

// 获取趋势宽度（用于图表显示）
const getTrendWidth = (year) => {
  // 模拟历年数据变化
  const baseValue = selectedDistrict.value?.totalPopulation || 100
  const variation = (year - 2020) * 2 + Math.random() * 10
  return Math.min(100, Math.max(10, (baseValue + variation) / baseValue * 50))
}

// 获取趋势值
const getTrendValue = (year) => {
  const baseValue = selectedDistrict.value?.totalPopulation || 100
  const variation = (year - 2020) * 0.5 + (Math.random() - 0.5) * 2
  return (baseValue + variation).toFixed(1)
}

// 导航到区域
const navigateToDistrict = () => {
  ElMessage.success(`小人正在前往${selectedDistrict.value?.name}`)
  showDetailDialog.value = false
}

// 全屏状态监听
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

// 组件挂载
onMounted(() => {
  loadRegionData()
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

// 组件卸载
onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<style scoped>
.mapbox-walking-demo {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #f5f7fa;
}

/* 控制栏 */
.control-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 30px;
  z-index: 200;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-group label {
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

/* 统计信息卡片 */
.stats-summary {
  position: absolute;
  top: 80px;
  left: 20px;
  display: flex;
  gap: 15px;
  z-index: 150;
}

.stat-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 15px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  min-width: 120px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.stat-title {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
  font-weight: 500;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
}

/* 对话框样式 */
.district-details {
  padding: 10px 0;
}

.detail-section {
  margin-bottom: 25px;
}

.detail-section h4 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 2px solid #3498db;
  padding-bottom: 5px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #3498db;
}

.detail-item .label {
  font-weight: 500;
  color: #555;
}

.detail-item .value {
  font-weight: 600;
  color: #2c3e50;
}

.detail-item .value.positive {
  color: #27ae60;
}

.detail-item .value.negative {
  color: #e74c3c;
}

/* 趋势图表 */
.trend-chart {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.trend-item {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.trend-item:last-child {
  margin-bottom: 0;
}

.trend-item .year {
  font-weight: 600;
  color: #555;
  min-width: 40px;
}

.trend-bar {
  flex: 1;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.trend-fill {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #2980b9);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.trend-value {
  font-weight: 600;
  color: #2c3e50;
  min-width: 60px;
  text-align: right;
}

/* 对话框底部 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .control-bar {
    flex-direction: column;
    height: auto;
    padding: 15px;
    gap: 15px;
  }

  .stats-summary {
    top: 120px;
    flex-direction: column;
    width: calc(100% - 40px);
  }

  .stat-card {
    min-width: auto;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .trend-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .trend-bar {
    width: 100%;
  }
}

/* 全屏模式样式 */
:fullscreen .mapbox-walking-demo {
  background: #000;
}

:fullscreen .control-bar {
  background: rgba(0, 0, 0, 0.8);
  color: white;
}

:fullscreen .stat-card {
  background: rgba(0, 0, 0, 0.8);
  color: white;
}

:fullscreen .stat-value {
  color: #4CAF50;
}

/* 加载状态 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* 动画效果 */
.stat-card,
.control-group,
.detail-item {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
