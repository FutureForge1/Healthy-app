<template>
  <div class="map-3d-demo">
    <!-- 第一人称行走3D地图 - 全屏显示 -->
    <ChengduMap3DWalking
      :data="regionData"
      @district-click="onDistrictClick"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import ChengduMap3DWalking from '@/components/ChengduMap3DWalking.vue'
import * as populationApi from '@/api/population'

// 响应式数据
const selectedYear = ref(2023)
const regionData = ref([])

// 加载区域数据
const loadRegionData = async () => {
  try {
    // 使用和人口统计页面相同的API调用方式
    const regionParams = {
      filters: { year: { eq: parseInt(selectedYear.value) } },
      sort: [{ field: 'population', order: 'desc' }],
      pageInfo: { index: 0, size: 20 }
    }

    const response = await populationApi.getRegionPopulation(regionParams)
    console.log(`${selectedYear.value}年区域人口数据:`, response)

    if (response.status === 0 && response.data?.rows) {
      const regions = response.data.rows || []

      regionData.value = regions.map(item => ({
        name: item.name || item.district || '未知区域',
        district: item.name || item.district || '未知区域',
        totalPopulation: item.population ? (item.population / 100).toFixed(1) : 0, // 转换为万人
        birthPopulation: item.birthPopulation || 0,
        deathPopulation: item.deathPopulation || 0,
        growthRate: item.growthRate || 0,
        year: item.year || selectedYear.value
      }))

      console.log(`处理后的区域数据:`, regionData.value)
      ElMessage.success(`已加载${selectedYear.value}年区域数据，共${regions.length}个区县`)
    } else {
      console.warn('区域数据API返回格式异常:', response)
      regionData.value = []
      ElMessage.warning('暂无区域数据')
    }
  } catch (error) {
    console.error('加载区域数据失败:', error)
    ElMessage.error('区域数据加载失败')
    regionData.value = []
  }
}

// 区县点击事件
const onDistrictClick = (districtData) => {
  console.log('区县点击:', districtData)
  ElMessage.success(`点击了 ${districtData.name}`)
}

// 生命周期
onMounted(() => {
  loadRegionData()
})
</script>

<style scoped>
.map-3d-demo {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* 简化样式，只保留全屏显示 */
</style>
