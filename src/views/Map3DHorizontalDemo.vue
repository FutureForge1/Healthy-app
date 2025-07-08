<template>
  <!-- 横向3D地图组件 - 全屏显示 -->
  <ChengduMap3DHorizontal
    :data="regionData"
    @district-click="handleDistrictClick"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import ChengduMap3DHorizontal from '@/components/ChengduMap3DHorizontal.vue'
import { populationApi } from '@/api/population'

// 响应式数据
const selectedYear = ref(2023)
const regionData = ref([])

// 加载区域数据
const loadRegionData = async () => {
  try {
    console.log(`加载${selectedYear.value}年区域人口数据`)

    const response = await populationApi.getRegionPopulation({
      filters: {
        year: {
          gte: selectedYear.value,
          lte: selectedYear.value
        }
      },
      sort: [{ field: 'totalPopulation', direction: 'desc' }],
      pageInfo: { pageIndex: 1, pageSize: 50 }
    })

    console.log(`${selectedYear.value}年区域人口数据:`, response)

    if (response && response.status === 0 && response.data && response.data.rows) {
      const processedData = response.data.rows.map(item => ({
        name: item.districtName || item.name || '未知区域',
        totalPopulation: item.totalPopulation || 0,
        birthPopulation: item.birthPopulation || 0,
        deathPopulation: item.deathPopulation || 0,
        year: item.year || selectedYear.value
      }))

      regionData.value = processedData
      console.log('处理后的区域数据:', processedData)
    } else {
      console.warn('API返回数据格式异常:', response)
      regionData.value = []
    }
  } catch (error) {
    console.error('加载区域数据失败:', error)
    ElMessage.error('加载区域数据失败，请稍后重试')
    regionData.value = []
  }
}

// 区域点击处理
const handleDistrictClick = (district) => {
  console.log('区域点击:', district)
  ElMessage.success(`当前位置: ${district.name}`)
}

// 组件挂载
onMounted(() => {
  loadRegionData()
})
</script>

<style scoped>
.horizontal-demo-container {
  width: 100%;
  height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.demo-header {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 15px 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.demo-header h2 {
  color: white;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.demo-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.demo-controls .el-select {
  width: 120px;
}

.demo-controls .el-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.demo-controls .el-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.instructions {
  padding: 20px 0;
}

.instruction-section {
  margin-bottom: 25px;
}

.instruction-section h4 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.1rem;
  font-weight: 600;
}

.instruction-section ul {
  margin: 0;
  padding-left: 20px;
}

.instruction-section li {
  margin-bottom: 8px;
  line-height: 1.6;
  color: #555;
}

.instruction-section strong {
  color: #4a90e2;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .demo-header {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
    left: 10px;
    right: 10px;
    transform: none;
  }
  
  .demo-controls {
    flex-direction: column;
    width: 100%;
  }
  
  .demo-controls .el-select {
    width: 100%;
  }
}
</style>
