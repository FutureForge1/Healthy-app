<template>
  <div class="population-stats">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2>人口信息统计分析</h2>
        <p>成都市人口分布、性别比例、常住人口等统计数据分析</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="exportData">
          <el-icon><Download /></el-icon>
          导出数据
        </el-button>
        <el-button @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
      </div>
    </div>

    <!-- 筛选条件 -->
    <div class="filter-section">
      <div class="modern-filter-card">
        <div class="filter-header">
          <h3>人口数据查询</h3>
          <p class="filter-subtitle">选择年份进行人口数据分析</p>
        </div>

        <div class="filter-content">
          <!-- 左侧：年份选择 -->
          <div class="filter-left">
            <div class="filter-item">
              <label class="filter-label">查询年份</label>
              <el-date-picker
                v-model="selectedYear"
                type="year"
                placeholder="请选择年份"
                format="YYYY"
                value-format="YYYY"
                @change="handleYearChange"
                style="width: 100%"
              />
            </div>

            <div class="filter-item">
              <label class="filter-label">数据类型</label>
              <el-select v-model="selectedDataType" placeholder="请选择数据类型" @change="loadData" style="width: 100%">
                <el-option label="基础人口统计" value="basic" />
                <el-option label="城乡人口分布" value="urban_rural" />
                <el-option label="人口自然变动" value="natural_change" />
                <el-option label="常住人口统计" value="resident" />
              </el-select>
            </div>
          </div>

          <!-- 右侧：操作按钮 -->
          <div class="filter-right">
            <el-button type="primary" @click="loadData" class="action-btn query-btn">
              <el-icon><Search /></el-icon>
              查询数据
            </el-button>
            <el-button @click="resetFilters" class="action-btn reset-btn">
              <el-icon><RefreshLeft /></el-icon>
              重置筛选
            </el-button>
            <el-button @click="exportData" class="action-btn export-btn">
              <el-icon><Download /></el-icon>
              导出数据
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 概览卡片 -->
    <div class="overview-cards" v-loading="loading">
      <!-- 基础人口统计卡片 -->
      <template v-if="selectedDataType === 'basic'">
        <OverviewCard
          :value="totalPopulationDisplay"
          :ratio="totalPopulationRatio"
          title="总人口"
          unit="万人"
          icon="user"
          theme="primary"
        />
        <OverviewCard
          :value="totalHouseholdsDisplay"
          :ratio="householdsRatioDisplay"
          title="总户数"
          unit="万户"
          icon="home"
          theme="success"
        />
        <OverviewCard
          :value="urbanPopulationDisplay"
          :ratio="urbanRatioDisplay"
          title="市区人口"
          unit="万人"
          icon="building"
          theme="warning"
        />
        <OverviewCard
          :value="countyPopulationDisplay"
          :ratio="countyRatioDisplay"
          title="县人口"
          unit="万人"
          icon="location"
          theme="info"
        />
      </template>

      <!-- 城乡人口分布卡片 -->
      <template v-else-if="selectedDataType === 'urban_rural'">
        <OverviewCard
          :value="urbanPopulationDisplay"
          :ratio="urbanRatioDisplay"
          title="城镇人口"
          unit="万人"
          icon="building"
          theme="primary"
        />
        <OverviewCard
          :value="ruralPopulationDisplay"
          :ratio="ruralRatioDisplay"
          title="农村人口"
          unit="万人"
          icon="tree"
          theme="success"
        />
        <OverviewCard
          :value="malePopulationDisplay"
          :ratio="malePopulationRatio"
          title="男性人口"
          unit="万人"
          icon="male"
          theme="warning"
        />
        <OverviewCard
          :value="femalePopulationDisplay"
          :ratio="femalePopulationRatio"
          title="女性人口"
          unit="万人"
          icon="female"
          theme="info"
        />
      </template>

      <!-- 人口自然变动卡片 -->
      <template v-else-if="selectedDataType === 'natural_change'">
        <OverviewCard
          :value="birthsDisplay"
          :ratio="birthRateDisplay"
          title="出生人数"
          unit="人"
          icon="baby"
          theme="primary"
        />
        <OverviewCard
          :value="deathsDisplay"
          :ratio="deathRateDisplay"
          title="死亡人数"
          unit="人"
          icon="cross"
          theme="success"
        />
        <OverviewCard
          :value="naturalIncreaseDisplay"
          :ratio="naturalIncreaseRateDisplay"
          title="自然增长"
          unit="人"
          icon="trending-up"
          theme="warning"
        />
        <OverviewCard
          :value="birthRateDisplay"
          subtitle="出生率"
          title="出生率"
          unit="‰"
          icon="chart"
          theme="info"
        />
      </template>

      <!-- 常住人口统计卡片 -->
      <template v-else-if="selectedDataType === 'resident'">
        <OverviewCard
          :value="residentPopulationDisplay"
          :ratio="residentPopulationRatio"
          title="常住人口"
          unit="万人"
          icon="user"
          theme="primary"
        />
        <OverviewCard
          :value="urbanResidentDisplay"
          :ratio="urbanResidentRatioDisplay"
          title="城镇常住人口"
          unit="万人"
          icon="building"
          theme="success"
        />
        <OverviewCard
          :value="ruralResidentDisplay"
          :ratio="ruralResidentRatioDisplay"
          title="乡村常住人口"
          unit="万人"
          icon="tree"
          theme="warning"
        />
        <OverviewCard
          :value="urbanizationRateDisplay"
          subtitle="城镇化水平"
          title="城镇化率"
          unit="%"
          icon="chart"
          theme="info"
        />
      </template>

      <!-- 默认显示基础统计 -->
      <template v-else>
        <OverviewCard
          :value="totalPopulationDisplay"
          :ratio="totalPopulationRatio"
          title="总人口"
          unit="万人"
          icon="user"
          theme="primary"
        />
        <OverviewCard
          :value="malePopulationDisplay"
          :ratio="malePopulationRatio"
          title="男性人口"
          unit="万人"
          icon="male"
          theme="success"
        />
        <OverviewCard
          :value="femalePopulationDisplay"
          :ratio="femalePopulationRatio"
          title="女性人口"
          unit="万人"
          icon="female"
          theme="warning"
        />
        <OverviewCard
          :value="residentPopulationDisplay"
          :ratio="residentPopulationRatio"
          title="常住人口"
          unit="万人"
          icon="location"
          theme="info"
        />
      </template>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <el-row :gutter="20">
        <!-- 人口结构分布 -->
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h4>人口结构分布</h4>
            </div>
            <PieChart
              :data="populationStructureData"
              title=""
              height="350px"
              :is-donut="true"
              :inner-radius="'40%'"
              :radius="'70%'"
              :show-percentage="true"
              class="chart"
            />
          </div>
        </el-col>

        <!-- 性别比例分布 -->
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h4>性别比例分布</h4>
            </div>
            <PieChart
              :data="genderDistributionData"
              title=""
              height="350px"
              :is-donut="true"
              :inner-radius="'50%'"
              :radius="'70%'"
              class="chart"
            />
          </div>
        </el-col>
      </el-row>

    </div>

    <!-- 成都地图区域 -->
    <ChengduMap
      :data="regionData"
      :loading="loading"
    />

    <!-- 性别比例趋势图 -->
    <div class="chart-card" style="margin-top: 24px;">
      <div class="chart-header">
        <h4>历年性别比例变化趋势</h4>
        <div class="chart-info">
          <span class="info-text">性别比例 = 男性人口 / 女性人口 × 100</span>
        </div>
      </div>
      <LineChart
        :data="genderTrendData"
        :x-axis-data="genderTrendYears"
        :series-names="['男性人口(万人)', '女性人口(万人)', '性别比例']"
        title=""
        height="400px"
        :smooth="true"
        :show-area="false"
        :show-legend="true"
        :dual-y-axis="true"
        :y-axis-name="'人口数量(万人)'"
        :right-y-axis-name="'性别比例（%）'"
        :right-y-axis-series-index="[2]"
        :y-axis-min="550"
        :y-axis-max="820"
        :right-y-axis-min="96"
        :right-y-axis-max="102"
        :colors="['#3b82f6', '#10b981', '#f59e0b']"
        class="chart gender-trend-chart"
      />
    </div>

    <!-- 出生率和城镇化率图表 -->
    <el-row :gutter="24" style="margin-top: 24px;">
      <!-- 出生率柱状图 -->
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-header">
            <h4>历年出生率变化趋势</h4>
            <div class="year-range-selector">
              <span class="range-label">年份区间：</span>
              <el-date-picker
                v-model="birthRateYearRange"
                type="yearrange"
                range-separator="至"
                start-placeholder="开始年份"
                end-placeholder="结束年份"
                format="YYYY"
                value-format="YYYY"
                @change="loadBirthRateData"
                style="width: 200px;"
              />
            </div>
          </div>
          <BarChart
            :data="birthRateData"
            :x-axis-data="birthRateYears"
            title=""
            height="350px"
            :colors="['#3b82f6']"
            :y-axis-name="'出生率(‰)'"
            :y-axis-formatter="(value) => value + '‰'"
            class="chart birth-rate-chart"
          />
        </div>
      </el-col>

      <!-- 城镇化率折线图 -->
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-header">
            <h4>历年城镇化率变化趋势</h4>
            <div class="year-range-selector">
              <span class="range-label">年份区间：</span>
              <el-date-picker
                v-model="urbanizationYearRange"
                type="yearrange"
                range-separator="至"
                start-placeholder="开始年份"
                end-placeholder="结束年份"
                format="YYYY"
                value-format="YYYY"
                @change="loadUrbanizationData"
                style="width: 200px;"
              />
            </div>
          </div>
          <LineChart
            :data="urbanizationData"
            :x-axis-data="urbanizationYears"
            title=""
            height="350px"
            :smooth="true"
            :show-area="true"
            :area-opacity="0.3"
            :colors="['#10b981']"
            :y-axis-name="'城镇化率(%)'"
            :y-axis-min="77"
            :y-axis-max="82"
            :y-axis-formatter="(value) => value + '%'"
            class="chart urbanization-chart"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Refresh, Search, RefreshLeft } from '@element-plus/icons-vue'
import OverviewCard from '@/components/OverviewCard.vue'
import PieChart from '@/components/charts/PieChart.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import ChengduMap from '@/components/ChengduMap.vue'
import populationApi from '@/api/population'

// 响应式数据
const loading = ref(false)
const selectedYear = ref('2023')
const selectedDataType = ref('basic') // 新增：数据类型选择
const trendPeriod = ref('10')

// 人口数据
const populationData = reactive({
  // 基础人口统计 (population_basic)
  totalPopulation: 0,
  totalHouseholds: 0,
  urbanHouseholds: 0,
  countyHouseholds: 0,
  urbanPopulation: 0,
  countyPopulation: 0,

  // 城乡人口分布 (population_urban_rural)
  ruralPopulation: 0,
  malePopulation: 0,
  femalePopulation: 0,
  genderRatio: 0,

  // 人口自然变动 (population_natural_change)
  births: 0,
  birthRate: 0,
  deaths: 0,
  deathRate: 0,
  naturalIncrease: 0,
  naturalIncreaseRate: 0,

  // 常住人口统计 (population_resident)
  residentPopulation: 0,
  urbanResident: 0,
  ruralResident: 0,
  urbanizationRate: 0,

  // 计算的比例数据
  totalRatio: 0,
  maleRatio: 0,
  femaleRatio: 0,
  residentRatio: 0,
  urbanRatio: 0,
  countyRatio: 0,
  ruralRatio: 0,
  householdsRatio: 0,
  urbanResidentRatio: 0,
  ruralResidentRatio: 0
})

// 区域数据
const regionData = ref([])

// 性别比例数据
const genderTrendData = ref([])
const genderTrendYears = ref([])

// 出生率数据
const birthRateData = ref([])
const birthRateYears = ref([])
const birthRateYearRange = ref(['2019', '2023']) // 默认年份区间

// 城镇化率数据
const urbanizationData = ref([])
const urbanizationYears = ref([])
const urbanizationYearRange = ref(['2019', '2023']) // 默认年份区间

// 图表数据
const populationStructureData = ref([])
const genderDistributionData = ref([])
const populationTrendData = ref([])
const trendYears = ref([])

// 计算属性 - 概览卡片显示数据
const totalPopulationDisplay = computed(() =>
  populationData.totalPopulation !== null && populationData.totalPopulation !== undefined ? populationData.totalPopulation : null
)
const totalPopulationRatio = computed(() => {
  const ratio = populationData.totalRatio
  if (ratio && ratio !== '暂无数据') {
    return typeof ratio === 'string' ? ratio.replace('%', '') : ratio
  }
  return null
})

const malePopulationDisplay = computed(() =>
  populationData.malePopulation !== null && populationData.malePopulation !== undefined ? populationData.malePopulation : null
)
const malePopulationRatio = computed(() => {
  const ratio = populationData.maleRatio
  if (ratio && ratio !== '暂无数据') {
    return typeof ratio === 'string' ? ratio.replace('%', '') : ratio
  }
  return null
})

const femalePopulationDisplay = computed(() =>
  populationData.femalePopulation !== null && populationData.femalePopulation !== undefined ? populationData.femalePopulation : null
)
const femalePopulationRatio = computed(() => {
  const ratio = populationData.femaleRatio
  if (ratio && ratio !== '暂无数据') {
    return typeof ratio === 'string' ? ratio.replace('%', '') : ratio
  }
  return null
})

const residentPopulationDisplay = computed(() =>
  populationData.residentPopulation !== null && populationData.residentPopulation !== undefined ? populationData.residentPopulation : null
)
const residentPopulationRatio = computed(() => {
  const ratio = populationData.residentRatio
  if (ratio && ratio !== '暂无数据') {
    return typeof ratio === 'string' ? ratio.replace('%', '') : ratio
  }
  return null
})

// 新增计算属性
const totalHouseholdsDisplay = computed(() =>
  populationData.totalHouseholds !== null && populationData.totalHouseholds !== undefined ? populationData.totalHouseholds : null
)
const householdsRatioDisplay = computed(() => {
  const ratio = populationData.householdsRatio
  if (ratio && ratio !== '暂无数据') {
    return typeof ratio === 'string' ? ratio.replace('%', '') : ratio
  }
  return null
})

const urbanPopulationDisplay = computed(() =>
  populationData.urbanPopulation !== null && populationData.urbanPopulation !== undefined ? populationData.urbanPopulation : null
)
const urbanRatioDisplay = computed(() => {
  const ratio = populationData.urbanRatio
  if (ratio && ratio !== '暂无数据') {
    return typeof ratio === 'string' ? ratio.replace('%', '') : ratio
  }
  return null
})

const countyPopulationDisplay = computed(() =>
  populationData.countyPopulation !== null && populationData.countyPopulation !== undefined ? populationData.countyPopulation : null
)
const countyRatioDisplay = computed(() => {
  const ratio = populationData.countyRatio
  if (ratio && ratio !== '暂无数据') {
    return typeof ratio === 'string' ? ratio.replace('%', '') : ratio
  }
  return null
})

const ruralPopulationDisplay = computed(() =>
  populationData.ruralPopulation !== null && populationData.ruralPopulation !== undefined ? populationData.ruralPopulation : null
)
const ruralRatioDisplay = computed(() => {
  const ratio = populationData.ruralRatio
  if (ratio && ratio !== '暂无数据') {
    return typeof ratio === 'string' ? ratio.replace('%', '') : ratio
  }
  return null
})

const birthsDisplay = computed(() =>
  populationData.births !== null && populationData.births !== undefined ? populationData.births : null
)
const birthRateDisplay = computed(() =>
  populationData.birthRate !== null && populationData.birthRate !== undefined ? populationData.birthRate : null
)

const deathsDisplay = computed(() =>
  populationData.deaths !== null && populationData.deaths !== undefined ? populationData.deaths : null
)
const deathRateDisplay = computed(() =>
  populationData.deathRate !== null && populationData.deathRate !== undefined ? populationData.deathRate : null
)

const naturalIncreaseDisplay = computed(() =>
  populationData.naturalIncrease !== null && populationData.naturalIncrease !== undefined ? populationData.naturalIncrease : null
)
const naturalIncreaseRateDisplay = computed(() =>
  populationData.naturalIncreaseRate !== null && populationData.naturalIncreaseRate !== undefined ? populationData.naturalIncreaseRate : null
)

const urbanResidentDisplay = computed(() =>
  populationData.urbanResident !== null && populationData.urbanResident !== undefined ? populationData.urbanResident : null
)
const urbanResidentRatioDisplay = computed(() => {
  const ratio = populationData.urbanResidentRatio
  if (ratio && ratio !== '暂无数据') {
    return typeof ratio === 'string' ? ratio.replace('%', '') : ratio
  }
  return null
})

const ruralResidentDisplay = computed(() =>
  populationData.ruralResident !== null && populationData.ruralResident !== undefined ? populationData.ruralResident : null
)
const ruralResidentRatioDisplay = computed(() => {
  const ratio = populationData.ruralResidentRatio
  if (ratio && ratio !== '暂无数据') {
    return typeof ratio === 'string' ? ratio.replace('%', '') : ratio
  }
  return null
})

const urbanizationRateDisplay = computed(() =>
  populationData.urbanizationRate !== null && populationData.urbanizationRate !== undefined ? populationData.urbanizationRate : null
)

// 年份变化处理
const handleYearChange = () => {
  loadData()
}

// 加载数据
const loadData = async () => {
  try {
    loading.value = true

    const year = selectedYear.value
    const requestParams = {
      filters: { year: { eq: parseInt(year) } },
      sort: [{ field: 'year', order: 'desc' }],
      pageInfo: { index: 0, size: 1 }
    }

    console.log('加载数据类型:', selectedDataType.value, '年份:', year)

    // 根据选择的数据类型调用不同的API
    switch (selectedDataType.value) {
      case 'basic':
        await loadBasicPopulationData(requestParams)
        break
      case 'urban_rural':
        await loadUrbanRuralData(requestParams)
        break
      case 'natural_change':
        await loadNaturalChangeData(requestParams)
        break
      case 'resident':
        await loadResidentData(requestParams)
        break
      default:
        await loadBasicPopulationData(requestParams)
    }

    ElMessage.success('数据加载成功')
  } catch (error) {
    console.error('加载人口数据失败:', error)
    ElMessage.error('数据加载失败，请检查网络连接')
    resetPopulationData()
  } finally {
    loading.value = false
  }
}

// 加载基础人口统计数据
const loadBasicPopulationData = async (requestParams) => {
  const response = await populationApi.getBasicPopulation(requestParams)
  console.log('基础人口数据响应:', response)

  const data = response.data?.rows?.[0] || {}
  console.log('提取的数据:', data)

  // 更新基础人口数据（使用正确的驼峰命名字段）
  Object.assign(populationData, {
    totalPopulation: data.totalPopulation || 0,
    totalHouseholds: data.totalHouseholds || 0,
    urbanHouseholds: data.urbanHouseholds || 0,
    countyHouseholds: data.countyHouseholds || 0,
    urbanPopulation: data.urbanPopulation || 0,
    countyPopulation: data.countyPopulation || 0,

    // 计算比例
    totalRatio: '100%',
    householdsRatio: '100%',
    urbanRatio: calculateRatio(data.urbanPopulation, data.totalPopulation),
    countyRatio: calculateRatio(data.countyPopulation, data.totalPopulation)
  })

  // 更新图表数据 - 基础人口分布（市区vs县）
  populationStructureData.value = [
    { name: '市区人口', value: data.urbanPopulation || 0, color: '#3b82f6' },
    { name: '县人口', value: data.countyPopulation || 0, color: '#10b981' }
  ]
}

// 加载城乡人口分布数据
const loadUrbanRuralData = async (requestParams) => {
  // 并行调用城乡分布和性别分布API
  const [defactoResponse, genderResponse] = await Promise.all([
    populationApi.getDefactoPopulation(requestParams),
    populationApi.getGenderPopulation(requestParams)
  ])

  console.log('城乡人口数据:', defactoResponse)
  console.log('性别人口数据:', genderResponse)

  const defactoData = defactoResponse.data?.rows?.[0] || {}
  const genderData = genderResponse.data?.rows?.[0] || {}

  console.log('城乡数据字段:', Object.keys(defactoData))
  console.log('城乡数据内容:', defactoData)
  console.log('性别数据字段:', Object.keys(genderData))
  console.log('性别数据内容:', genderData)

  // 更新城乡人口数据（使用驼峰命名）
  Object.assign(populationData, {
    urbanPopulation: defactoData.urbanPopulation || 0,
    ruralPopulation: defactoData.ruralPopulation || 0,
    malePopulation: genderData.malePopulation || 0,
    femalePopulation: genderData.femalePopulation || 0,
    genderRatio: genderData.genderRatio || 0,

    // 计算比例
    urbanRatio: calculateRatio(defactoData.urbanPopulation, (defactoData.urbanPopulation || 0) + (defactoData.ruralPopulation || 0)),
    ruralRatio: calculateRatio(defactoData.ruralPopulation, (defactoData.urbanPopulation || 0) + (defactoData.ruralPopulation || 0)),
    maleRatio: calculateRatio(genderData.malePopulation, (genderData.malePopulation || 0) + (genderData.femalePopulation || 0)),
    femaleRatio: calculateRatio(genderData.femalePopulation, (genderData.malePopulation || 0) + (genderData.femalePopulation || 0))
  })

  // 更新图表数据
  updateChartData({
    structure: {
      urban: defactoData.urbanPopulation || 0,
      rural: defactoData.ruralPopulation || 0
    },
    gender: {
      male: genderData.malePopulation || 0,
      female: genderData.femalePopulation || 0
    }
  })
}

// 加载人口自然变动数据
const loadNaturalChangeData = async (requestParams) => {
  const response = await populationApi.getPopulationChange(requestParams)
  console.log('人口自然变动数据:', response)

  const data = response.data?.rows?.[0] || {}

  // 更新人口自然变动数据
  Object.assign(populationData, {
    births: data.births || 0,
    birthRate: data.birthRate || 0,
    deaths: data.deaths || 0,
    deathRate: data.deathRate || 0,
    naturalIncrease: data.naturalIncrease || 0,
    naturalIncreaseRate: data.naturalIncreaseRate || 0
  })

  // 更新图表数据
  updateChartData({
    naturalChange: {
      births: data.births || 0,
      deaths: data.deaths || 0,
      naturalIncrease: data.naturalIncrease || 0
    }
  })
}

// 加载常住人口统计数据
const loadResidentData = async (requestParams) => {
  const response = await populationApi.getResidentPopulation(requestParams)
  console.log('常住人口数据:', response)

  const data = response.data?.rows?.[0] || {}

  // 更新常住人口数据
  Object.assign(populationData, {
    residentPopulation: data.residentPopulation || 0,
    urbanResident: data.urbanResident || 0,
    ruralResident: data.ruralResident || 0,
    urbanizationRate: data.urbanizationRate || 0,

    // 计算比例
    residentRatio: '100%',
    urbanResidentRatio: calculateRatio(data.urbanResident, data.residentPopulation),
    ruralResidentRatio: calculateRatio(data.ruralResident, data.residentPopulation)
  })

  // 更新图表数据
  updateChartData({
    resident: {
      urban: data.urbanResident || 0,
      rural: data.ruralResident || 0
    }
  })
}

// 加载区域人口分布数据
const loadRegionData = async (requestParams) => {
  // 获取区域人口分布数据
  const regionParams = {
    filters: { year: { eq: parseInt(selectedYear.value) } },
    sort: [{ field: 'population', order: 'desc' }],
    pageInfo: { index: 0, size: 20 }
  }

  const response = await populationApi.getRegionPopulation(regionParams)
  console.log('区域人口数据:', response)

  const regions = response.data?.rows || []

  // 更新regionData供地图组件使用
  regionData.value = regions

  // 计算总人口
  const totalRegionPopulation = regions.reduce((sum, region) => sum + (region.population || 0), 0)

  // 更新区域数据
  Object.assign(populationData, {
    totalPopulation: (totalRegionPopulation / 100).toFixed(1), // 转换为万人单位
    totalRatio: '100%'
  })

  // 更新图表数据
  updateChartData({
    regions: regions.map(region => ({
      name: region.name || '未知区域',
      value: region.population || 0,
      level: region.level || 'unknown'
    }))
  })
}

// 加载性别比例趋势数据
const loadGenderTrendData = async () => {
  try {
    const genderParams = {
      filters: { year: { gte: 2009 } }, // 从2009年开始
      sort: [{ field: 'year', order: 'asc' }],
      pageInfo: { index: 0, size: 20 }
    }

    const response = await populationApi.getGenderPopulation(genderParams)
    console.log('性别趋势数据:', response)

    const genderData = response.data?.rows || []

    if (genderData.length > 0) {
      // 提取年份
      genderTrendYears.value = genderData.map(item => item.year.toString())

      // 准备图表数据 - LineChart组件期望的格式是数组的数组
      genderTrendData.value = [
        genderData.map(item => item.malePopulation || 0),    // 男性人口数据
        genderData.map(item => item.femalePopulation || 0),  // 女性人口数据
        genderData.map(item => item.genderRatio || 0)        // 性别比例数据
      ]
    }
  } catch (error) {
    console.error('加载性别趋势数据失败:', error)
  }
}

// 加载出生率数据
const loadBirthRateData = async () => {
  try {
    if (!birthRateYearRange.value || birthRateYearRange.value.length !== 2) {
      console.warn('出生率年份区间未正确设置')
      return
    }

    const [startYear, endYear] = birthRateYearRange.value
    const changeParams = {
      filters: {
        year: {
          gte: parseInt(startYear),
          lte: parseInt(endYear)
        }
      },
      sort: [{ field: 'year', order: 'asc' }],
      pageInfo: { index: 0, size: 20 }
    }

    const response = await populationApi.getPopulationChange(changeParams)
    console.log('出生率数据:', response)

    const changeData = response.data?.rows || []

    if (changeData.length > 0) {
      // 提取年份和出生率数据
      birthRateYears.value = changeData.map(item => item.year.toString())
      birthRateData.value = changeData.map(item => item.birthRate || 0)
    }
  } catch (error) {
    console.error('加载出生率数据失败:', error)
  }
}

// 加载城镇化率数据
const loadUrbanizationData = async () => {
  try {
    if (!urbanizationYearRange.value || urbanizationYearRange.value.length !== 2) {
      console.warn('城镇化率年份区间未正确设置')
      return
    }

    const [startYear, endYear] = urbanizationYearRange.value
    const residentParams = {
      filters: {
        year: {
          gte: parseInt(startYear),
          lte: parseInt(endYear)
        }
      },
      sort: [{ field: 'year', order: 'asc' }],
      pageInfo: { index: 0, size: 20 }
    }

    const response = await populationApi.getResidentPopulation(residentParams)
    console.log('城镇化率数据:', response)

    const residentData = response.data?.rows || []

    if (residentData.length > 0) {
      // 提取年份和城镇化率数据
      urbanizationYears.value = residentData.map(item => item.year.toString())
      urbanizationData.value = residentData.map(item => item.urbanizationRate || 0)
    }
  } catch (error) {
    console.error('加载城镇化率数据失败:', error)
  }
}

// 计算比例的辅助函数
const calculateRatio = (value, total) => {
  const numValue = parseFloat(value) || 0
  const numTotal = parseFloat(total) || 0
  return numTotal > 0 ? `${((numValue / numTotal) * 100).toFixed(1)}%` : '暂无数据'
}

// 重置人口数据
const resetPopulationData = () => {
  Object.keys(populationData).forEach(key => {
    if (typeof populationData[key] === 'number') {
      populationData[key] = 0
    } else {
      populationData[key] = '暂无数据'
    }
  })
}

// 更新图表数据
const updateChartData = (data) => {
  // 人口结构分布（城乡分布）
  if (data.structure) {
    populationStructureData.value = [
      { name: '城镇人口', value: data.structure.urban || 0, color: '#3b82f6' },
      { name: '农村人口', value: data.structure.rural || 0, color: '#10b981' }
    ]
  }

  // 性别分布
  if (data.gender) {
    genderDistributionData.value = [
      { name: '男性', value: data.gender.male || 0, color: '#3b82f6' },
      { name: '女性', value: data.gender.female || 0, color: '#ec4899' }
    ]
  }
}

// 加载趋势数据
const loadTrendData = async () => {
  try {
    const period = parseInt(trendPeriod.value) || 10
    const currentYear = new Date().getFullYear()
    const startYear = currentYear - period + 1

    const requestParams = {
      filters: {
        year: { gte: startYear, lte: currentYear }
      },
      sort: [{ field: 'year', order: 'asc' }],
      pageInfo: { index: 0, size: period }
    }

    // 调用后端基础人口API获取趋势数据
    const response = await populationApi.getBasicPopulation(requestParams)

    console.log('趋势数据后端返回:', response)

    if (response.rows && response.rows.length > 0) {
      // 处理后端返回的真实数据
      const trendData = response.data?.rows?.map(item => ({
        year: item.year,
        totalPopulation: item.totalPopulation || 0  // 数据库中已经是万人单位
      })) || []

      trendYears.value = trendData.map(item => item.year)
      populationTrendData.value = trendData.map(item => parseFloat(item.totalPopulation))

      console.log('处理后的趋势数据:', { years: trendYears.value, values: populationTrendData.value })
    } else {
      // 重置趋势数据
      trendYears.value = []
      populationTrendData.value = []
    }
  } catch (error) {
    console.error('加载趋势数据失败:', error)
    // 重置趋势数据
    trendYears.value = []
    populationTrendData.value = []
  }
}

// 重置筛选
const resetFilters = () => {
  selectedYear.value = new Date().getFullYear().toString()
  loadData()
}

// 导出数据
const exportData = () => {
  ElMessage.info('导出功能开发中')
}

// 刷新数据
const refreshData = () => {
  loadData()
}

// 生命周期
onMounted(() => {
  loadData()
  loadTrendData()
  loadRegionData() // 加载区域数据供地图使用
  loadGenderTrendData() // 加载性别趋势数据
  loadBirthRateData() // 加载出生率数据
  loadUrbanizationData() // 加载城镇化率数据
})
</script>

<style scoped>
.population-stats {
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100vh;
}

/* 页面头部样式 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.header-content h2 {
  color: #1e293b;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.header-content p {
  color: #64748b;
  font-size: 14px;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 筛选区域样式 */
.modern-filter-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
  padding: 24px;
}

.filter-header h3 {
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.filter-subtitle {
  color: #64748b;
  font-size: 14px;
  margin: 0 0 24px 0;
  font-weight: 400;
}

.filter-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
}

.filter-left {
  flex: 0 0 auto;
  min-width: 280px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.filter-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.action-btn {
  height: 40px;
  padding: 0 16px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

/* 按钮样式 */
.query-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  color: white;
}

.query-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.reset-btn {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  border: none;
  color: white;
}

.reset-btn:hover {
  background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
}

.export-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  color: white;
}

.export-btn:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* 概览卡片样式 */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

/* 图表区域样式 */
.charts-section {
  margin-bottom: 24px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 24px;
  height: 100%;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.chart-header h4 {
  color: #1e293b;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.chart {
  width: 100%;
}

.trend-chart {
  height: 400px;
}

.gender-trend-chart {
  height: 400px;
}

.chart-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.info-text {
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
}

.birth-rate-chart,
.urbanization-chart {
  height: 350px;
}

.year-range-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}
</style>