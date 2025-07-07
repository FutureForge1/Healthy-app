<template>
  <div class="institution-stats">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>医疗卫生机构统计分析</h2>
      <p class="page-description">全面分析医疗卫生机构的分布、等级、规模等关键指标</p>
    </div>
    <div class="filter-section">
      <div class="filter-item">
        <span class="filter-label">概览年份：</span>
        <el-date-picker
          v-model="selectedYear"
          type="year"
          placeholder="选择年份"
          format="YYYY"
          value-format="YYYY"
          @change="handleYearChange"
          style="width: 160px;"
        />
      </div>
    </div>
    <!-- 概览卡片 -->
    <el-row :gutter="24" class="overview-section">
      <el-col :span="6">
        <OverviewCard
          title="三级医院总数"
          :value="overviewData.level3Total"
          :ratio="overviewData.level3TotalRatio"
          theme="primary"
          icon="hospital"
        />
      </el-col>
      <el-col :span="6">
        <OverviewCard
          title="二级医院总数"
          :value="overviewData.level2Total"
          :ratio="overviewData.level2TotalRatio"
          theme="success"
          icon="building"
        />
      </el-col>
      <el-col :span="6">
        <OverviewCard
          title="一级医院总数"
          :value="overviewData.level1Total"
          :ratio="overviewData.level1TotalRatio"
          theme="warning"
          icon="clinic"
        />
      </el-col>
      <el-col :span="6">
        <OverviewCard
          title="医疗机构总数"
          :value="overviewData.totalInstitutions"
          :ratio="overviewData.totalInstitutionsRatio"
          theme="info"
          icon="hospital-group"
        />
      </el-col>
    </el-row>

    <!-- 年份选择器 -->
    <div class="filter-section">
      
      <div class="filter-item">
        <span class="filter-label">趋势年份区间：</span>
        <el-date-picker
          v-model="selectedYearRange"
          type="yearrange"
          range-separator="至"
          start-placeholder="开始年份"
          end-placeholder="结束年份"
          format="YYYY"
          value-format="YYYY"
          @change="handleYearRangeChange"
          style="width: 240px;"
        />
      </div>
    </div>
    <!-- 图表区域 -->
    <el-row :gutter="24" style="margin-top: 24px;">
      <!-- 医院等级分布趋势图 -->
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-header">
            <h4>医院等级分布趋势</h4>
            <div class="chart-info">
              <span class="info-text">按年份展示各等级医院数量变化</span>
            </div>
          </div>
          <LineChart
            :data="levelTrendData"
            :x-axis-data="levelTrendYears"
            :series-names="['三级医院', '二级医院', '一级医院']"
            title=""
            height="400px"
            :smooth="true"
            :show-area="false"
            :show-legend="true"
            :colors="['#3b82f6', '#10b981', '#f59e0b']"
            :y-axis-name="'医院数量(个)'"
            class="chart level-trend-chart"
          />
        </div>
      </el-col>

      <!-- 机构分类分布图 -->
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-header">
            <h4>医疗机构分类分布</h4>
            <div class="chart-info">
              <span class="info-text">各类医疗机构数量分布情况</span>
            </div>
          </div>
          <PieChart
            :data="institutionCategoryData"
            title=""
            height="400px"
            :colors="['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']"
            class="chart category-pie-chart"
          />
        </div>
      </el-col>
    </el-row>

    <!-- 医院效率分析图表 -->
    <el-row :gutter="24" style="margin-top: 24px;">
      <!-- 医生工作量分析 -->
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-header">
            <h4>各级医院医生工作量对比</h4>
            <div class="chart-info">
              <span class="info-text">每医生日均门诊人次</span>
            </div>
          </div>
          <BarChart
            :data="doctorWorkloadData"
            :x-axis-data="hospitalLevels"
            title=""
            height="350px"
            :colors="['#3b82f6']"
            :y-axis-name="'门诊人次/医生'"
            :y-axis-formatter="(value) => value + '人次'"
            class="chart workload-chart"
          />
        </div>
      </el-col>

      <!-- 床位使用效率 -->
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-header">
            <h4>各级医院床位使用效率</h4>
            <div class="chart-info">
              <span class="info-text">每医生管理床日数</span>
            </div>
          </div>
          <BarChart
            :data="bedEfficiencyData"
            :x-axis-data="hospitalLevels"
            title=""
            height="350px"
            :colors="['#10b981']"
            :y-axis-name="'床日数/医生'"
            :y-axis-formatter="(value) => value + '床日'"
            class="chart efficiency-chart"
          />
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import OverviewCard from '@/components/OverviewCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import { getHospitalLevelStats, getHospitalStatistics, getInstitutionStats } from '@/api/hospital'

// 响应式数据
const loading = ref(false)
const selectedYear = ref('2023') // 概览卡片使用的单独年份
const selectedYearRange = ref(['2020', '2023']) // 趋势图使用的年份区间

// 概览数据
const overviewData = reactive({
  level3Total: null,
  level3TotalRatio: null,
  level2Total: null,
  level2TotalRatio: null,
  level1Total: null,
  level1TotalRatio: null,
  totalInstitutions: null,
  totalInstitutionsRatio: null
})

// 图表数据
const levelTrendData = ref([])
const levelTrendYears = ref([])
const institutionCategoryData = ref([])
const doctorWorkloadData = ref([])
const bedEfficiencyData = ref([])
const hospitalLevels = ref([])

// 加载概览数据
const loadOverviewData = async () => {
  try {
    const queryYear = selectedYear.value || '2023'
    const yearInt = parseInt(queryYear)

    // 查询特定年份的数据
    const params = {
      filters: {
        year: {
          gte: yearInt,
          lte: yearInt
        }
      },
      sort: [{ field: 'year', order: 'desc' }],
      pageInfo: { index: 0, size: 10 }
    }

    console.log(`发送${queryYear}年医院等级请求参数:`, params)
    const response = await getHospitalLevelStats(params)
    console.log(`加载${queryYear}年医院等级统计数据:`, response)

    if (response.status === 0 && response.data?.rows) {
      // 从所有返回的数据中找到匹配的年份
      const targetYear = parseInt(queryYear)
      const data = response.data.rows.find(row => row.year === targetYear) || {}
      console.log(`${queryYear}年医院等级原始数据:`, data)

      if (data && Object.keys(data).length > 0) {
        // 计算概览数据
        overviewData.level3Total = data.level3Total || null
        overviewData.level2Total = data.level2Total || null
        overviewData.level1Total = data.level1Ungraded || null
        overviewData.totalInstitutions = (data.level3Total || 0) + (data.level2Total || 0) + (data.level1Ungraded || 0) || null

        // 计算比例（这里可以根据需要计算同比增长等）
        overviewData.level3TotalRatio = null
        overviewData.level2TotalRatio = null
        overviewData.level1TotalRatio = null
        overviewData.totalInstitutionsRatio = null

        console.log(`${queryYear}年概览数据更新完成:`, {
          level3Total: overviewData.level3Total,
          level2Total: overviewData.level2Total,
          level1Total: overviewData.level1Total,
          totalInstitutions: overviewData.totalInstitutions
        })
      } else {
        console.warn(`${queryYear}年没有找到医院等级数据`)
      }
    } else {
      console.error(`${queryYear}年医院等级数据请求失败:`, response)
    }
  } catch (error) {
    console.error('加载概览数据失败:', error)
  }
}

// 加载医院等级趋势数据
const loadLevelTrendData = async () => {
  try {
    if (!selectedYearRange.value || selectedYearRange.value.length !== 2) {
      console.warn('年份区间未正确设置')
      return
    }

    const [startYear, endYear] = selectedYearRange.value
    const params = {
      filters: {
        year: {
          gte: parseInt(startYear),
          lte: parseInt(endYear)
        }
      },
      sort: [{ field: 'year', order: 'asc' }],
      pageInfo: { index: 0, size: 20 }
    }

    const response = await getHospitalLevelStats(params)
    console.log('医院等级趋势数据:', response)

    const data = response.data?.rows || []

    if (data.length > 0) {
      levelTrendYears.value = data.map(item => item.year.toString())
      levelTrendData.value = [
        data.map(item => item.level3Total || 0),  // 三级医院
        data.map(item => item.level2Total || 0),  // 二级医院
        data.map(item => item.level1Ungraded || 0)  // 一级医院
      ]
    }
  } catch (error) {
    console.error('加载医院等级趋势数据失败:', error)
  }
}

// 加载机构分类数据
const loadInstitutionCategoryData = async () => {
  try {
    const queryYear = selectedYear.value || '2023'
    const yearInt = parseInt(queryYear)

    // 查询特定年份的数据
    const params = {
      filters: {
        year: {
          gte: yearInt,
          lte: yearInt
        }
      },
      sort: [{ field: 'year', order: 'desc' }],
      pageInfo: { index: 0, size: 10 }
    }

    console.log(`发送${queryYear}年机构分类请求参数:`, params)
    const response = await getInstitutionStats(params)
    console.log(`加载${queryYear}年机构分类数据:`, response)

    if (response.status === 0 && response.data?.rows) {
      // 从所有返回的数据中找到匹配的年份
      const targetYear = parseInt(queryYear)
      const data = response.data.rows.find(row => row.year === targetYear) || {}
      console.log(`${queryYear}年机构分类原始数据:`, data)

      if (data && Object.keys(data).length > 0 && data.year === targetYear) {
        institutionCategoryData.value = [
          { name: '医院', value: data.hospital || 0 },
          { name: '社区卫生服务中心', value: data.communityHealth || 0 },
          { name: '卫生院', value: data.healthCenter || 0 },
          { name: '疾控中心', value: data.cdc || 0 },
          { name: '妇幼保健院', value: data.mch || 0 }
        ]
        console.log(`${queryYear}年机构分类数据更新完成:`, institutionCategoryData.value)
        console.log(`${queryYear}年饼状图数据详情:`, {
          医院: data.hospital,
          社区卫生服务中心: data.communityHealth,
          卫生院: data.healthCenter,
          疾控中心: data.cdc,
          妇幼保健院: data.mch,
          总计: data.total
        })

        // 显示年份变化的提示
        if (queryYear !== '2023') {
          console.log(`🔄 数据已切换到${queryYear}年，注意观察饼状图的变化！`)
          console.log(`📊 ${queryYear}年 vs 2023年对比:`, {
            医院变化: `${data.hospital} (${queryYear}) vs 799 (2023)`,
            卫生院变化: `${data.healthCenter} (${queryYear}) vs 147 (2023)`
          })
        }
      } else {
        console.warn(`${queryYear}年没有找到机构分类数据`)
        // 设置空数据
        institutionCategoryData.value = [
          { name: '医院', value: 0 },
          { name: '社区卫生服务中心', value: 0 },
          { name: '卫生院', value: 0 },
          { name: '疾控中心', value: 0 },
          { name: '妇幼保健院', value: 0 }
        ]
      }
    } else {
      console.error(`${queryYear}年机构分类数据请求失败:`, response)
    }
  } catch (error) {
    console.error('加载机构分类数据失败:', error)
  }
}

// 加载医生工作量数据
const loadDoctorWorkloadData = async () => {
  try {
    const params = {
      filters: {},
      sort: [{ field: 'visitsPerDoctor', order: 'asc' }],
      pageInfo: { index: 0, size: 20 }
    }

    const response = await getHospitalStatistics(params)
    console.log('医生工作量数据:', response)

    const data = response.data?.rows || []

    if (data.length > 0) {
      hospitalLevels.value = data.map(item => item.hospitalLevel || '')
      doctorWorkloadData.value = data.map(item => item.visitsPerDoctor || 0)
      bedEfficiencyData.value = data.map(item => item.bedDaysPerDoctor || 0)
    }
  } catch (error) {
    console.error('加载医生工作量数据失败:', error)
  }
}

// 单独年份变化处理（用于概览卡片）
const handleYearChange = async () => {
  if (!selectedYear.value) return

  loading.value = true
  try {
    console.log(`切换到${selectedYear.value}年数据`)
    await Promise.all([
      loadOverviewData(),
      loadInstitutionCategoryData()
    ])
    ElMessage.success(`已切换到${selectedYear.value}年数据`)
  } catch (error) {
    ElMessage.error('数据加载失败')
    console.error('年份切换失败:', error)
  } finally {
    loading.value = false
  }
}

// 年份区间变化处理（用于趋势图）
const handleYearRangeChange = () => {
  loadLevelTrendData()
}

// 生命周期
onMounted(() => {
  loadAllData()
})

// 加载所有数据
const loadAllData = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadOverviewData(),
      loadLevelTrendData(),
      loadInstitutionCategoryData(),
      loadDoctorWorkloadData()
    ])
  } finally {
    loading.value = false
  }
}
</script>


<style scoped>
.institution-stats {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 32px;
  text-align: center;
}

.page-header h2 {
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.page-description {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.overview-section {
  margin-bottom: 32px;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
  padding: 16px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  color: #374151;
  white-space: nowrap;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.chart-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.chart-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-text {
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
}

.chart {
  width: 100%;
}
</style>

