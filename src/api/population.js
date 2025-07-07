import request from './request'

/**
 * 人口统计API服务
 * 基于后端提供的6个人口统计API接口
 */

// 基础人口查询 - POST /population/basic
// 字段: year, totalHouseholds, urbanHouseholds, countyHouseholds, totalPopulation, urbanPopulation, countyPopulation
export const getBasicPopulation = (params = {}) => {
  return request({
    url: '/population/basic',
    method: 'post',
    data: {
      columns: params.columns || [],
      step: params.step || 50,
      filters: params.filters || {},
      sort: params.sort || [{ field: 'year', order: 'desc' }],
      pageInfo: params.pageInfo || { index: 0, size: 20 }
    }
  })
}

// 人口变化查询 - POST /population/change
// 字段: year, births, birthRate, deaths, deathRate, naturalIncrease, naturalIncreaseRate
export const getPopulationChange = (params = {}) => {
  return request({
    url: '/population/change',
    method: 'post',
    data: {
      columns: params.columns || [],
      step: params.step || 2,
      filters: params.filters || {},
      sort: params.sort || [{ field: 'year', order: 'desc' }],
      pageInfo: params.pageInfo || { index: 0, size: 20 }
    }
  })
}

// 城乡人口查询 - POST /population/defacto
// 字段: year, ruralPopulation, urbanPopulation
export const getDefactoPopulation = (params = {}) => {
  return request({
    url: '/population/defacto',
    method: 'post',
    data: {
      columns: params.columns || [],
      step: params.step || 50,
      filters: params.filters || {},
      sort: params.sort || [{ field: 'year', order: 'desc' }],
      pageInfo: params.pageInfo || { index: 0, size: 20 }
    }
  })
}

// 性别人口查询 - POST /population/gender
// 字段: year, malePopulation, femalePopulation, genderRatio
export const getGenderPopulation = (params = {}) => {
  return request({
    url: '/population/gender',
    method: 'post',
    data: {
      columns: params.columns || [],
      step: params.step || 1,
      filters: params.filters || {},
      sort: params.sort || [{ field: 'year', order: 'desc' }],
      pageInfo: params.pageInfo || { index: 0, size: 20 }
    }
  })
}

// 常住人口查询 - POST /population/resident
// 字段: year, residentPopulation, urbanResident, ruralResident, urbanizationRate
export const getResidentPopulation = (params = {}) => {
  return request({
    url: '/population/resident',
    method: 'post',
    data: {
      columns: params.columns || [],
      step: params.step || 2,
      filters: params.filters || {},
      sort: params.sort || [{ field: 'year', order: 'desc' }],
      pageInfo: params.pageInfo || { index: 0, size: 20 }
    }
  })
}

// 地区人口查询 - POST /population/region
// 字段: name, level, year, population, birthPopulation, deathPopulation, birthRate, deathRate, growthRate
export const getRegionPopulation = (params = {}) => {
  return request({
    url: '/population/region',
    method: 'post',
    data: {
      columns: params.columns || [],
      step: params.step || 2,
      filters: params.filters || {},
      sort: params.sort || [{ field: 'year', order: 'desc' }],
      pageInfo: params.pageInfo || { index: 0, size: 20 }
    }
  })
}

/**
 * 便捷方法：获取人口统计数据（用于页面显示）
 * 整合多个API的数据，返回标准格式
 */
export const getPopulationStats = async (params = {}) => {
  try {
    const year = params.year || new Date().getFullYear()
    const filters = { year: { eq: parseInt(year) } }
    const requestParams = {
      filters,
      pageInfo: { index: 0, size: 1 }
    }

    // 并行请求多个API获取数据
    const [basicRes, genderRes, residentRes, defactoRes] = await Promise.all([
      getBasicPopulation(requestParams),
      getGenderPopulation(requestParams),
      getResidentPopulation(requestParams),
      getDefactoPopulation(requestParams)
    ])

    // 提取数据 - 根据后端返回格式调整
    const basicData = basicRes.rows?.[0] || {}
    const genderData = genderRes.rows?.[0] || {}
    const residentData = residentRes.rows?.[0] || {}
    const defactoData = defactoRes.rows?.[0] || {}

    // 计算人口数据（转换为万人单位）
    const totalPopulation = basicData.totalPopulation ? (basicData.totalPopulation / 10000).toFixed(1) : 0
    const malePopulation = genderData.malePopulation ? (genderData.malePopulation / 10000).toFixed(1) : 0
    const femalePopulation = genderData.femalePopulation ? (genderData.femalePopulation / 10000).toFixed(1) : 0
    const residentPopulation = residentData.residentPopulation ? (residentData.residentPopulation / 10000).toFixed(1) : 0

    // 计算比例
    const calculateRatio = (value, total) => {
      const numValue = parseFloat(value) || 0
      const numTotal = parseFloat(total) || 0
      return numTotal > 0 ? ((numValue / numTotal) * 100).toFixed(1) : 0
    }

    return {
      code: 200,
      message: '获取成功',
      data: {
        overview: {
          totalPopulation,
          malePopulation,
          femalePopulation,
          residentPopulation,
          totalRatio: 100, // 总人口占比为100%
          maleRatio: calculateRatio(malePopulation, totalPopulation),
          femaleRatio: calculateRatio(femalePopulation, totalPopulation),
          residentRatio: calculateRatio(residentPopulation, totalPopulation)
        },
        structure: {
          // 使用城乡人口数据作为结构分析
          urban: defactoData.urbanPopulation || 0,
          rural: defactoData.ruralPopulation || 0
        },
        gender: {
          male: parseFloat(malePopulation) || 0,
          female: parseFloat(femalePopulation) || 0
        },
        year: parseInt(year)
      }
    }
  } catch (error) {
    console.error('获取人口统计数据失败:', error)
    return {
      code: 500,
      message: '获取数据失败',
      data: null
    }
  }
}

/**
 * 便捷方法：获取人口概览数据
 * 整合多个API的数据，用于概览卡片显示
 */
export const getPopulationOverview = async (year = null) => {
  try {
    const filters = year ? { year: { eq: year } } : {}
    const params = {
      filters,
      pageInfo: { index: 0, size: 1 }
    }

    // 并行请求多个API获取概览数据
    const [basicRes, genderRes, residentRes, changeRes] = await Promise.all([
      getBasicPopulation(params),
      getGenderPopulation(params),
      getResidentPopulation(params),
      getPopulationChange(params)
    ])

    // 提取最新数据
    const basicData = basicRes.data?.rows?.[0] || {}
    const genderData = genderRes.data?.rows?.[0] || {}
    const residentData = residentRes.data?.rows?.[0] || {}
    const changeData = changeRes.data?.rows?.[0] || {}

    return {
      // 总人口
      totalPopulation: basicData.totalPopulation || 0,
      urbanPopulation: basicData.urbanPopulation || 0,
      countyPopulation: basicData.countyPopulation || 0,

      // 性别人口
      malePopulation: genderData.malePopulation || 0,
      femalePopulation: genderData.femalePopulation || 0,
      genderRatio: genderData.genderRatio || 0,

      // 常住人口
      residentPopulation: residentData.residentPopulation || 0,
      urbanResident: residentData.urbanResident || 0,
      ruralResident: residentData.ruralResident || 0,
      urbanizationRate: residentData.urbanizationRate || 0,

      // 人口变化
      births: changeData.births || 0,
      deaths: changeData.deaths || 0,
      birthRate: changeData.birthRate || 0,
      deathRate: changeData.deathRate || 0,
      naturalIncrease: changeData.naturalIncrease || 0,
      naturalIncreaseRate: changeData.naturalIncreaseRate || 0,

      // 年份
      year: basicData.year || genderData.year || residentData.year || changeData.year
    }
  } catch (error) {
    console.error('获取人口概览数据失败:', error)
    throw error
  }
}

/**
 * 便捷方法：获取人口趋势数据
 * 用于绘制趋势图表
 */
export const getPopulationTrend = async (params = {}) => {
  try {
    const period = parseInt(params.period) || 10
    const currentYear = new Date().getFullYear()
    const startYear = currentYear - period + 1

    const requestParams = {
      filters: {
        year: { gte: startYear, lte: currentYear }
      },
      sort: [{ field: 'year', order: 'asc' }],
      pageInfo: { index: 0, size: period }
    }

    // 获取基础人口数据
    const basicRes = await getBasicPopulation(requestParams)
    const basicData = basicRes.rows || []

    // 处理数据，转换为万人单位
    const trendData = basicData.map(item => ({
      year: item.year,
      totalPopulation: item.totalPopulation ? (item.totalPopulation / 10000).toFixed(1) : 0,
      urbanPopulation: item.urbanPopulation ? (item.urbanPopulation / 10000).toFixed(1) : 0,
      countyPopulation: item.countyPopulation ? (item.countyPopulation / 10000).toFixed(1) : 0
    }))

    // 提取年份和数值数组
    const years = trendData.map(item => item.year)
    const values = trendData.map(item => parseFloat(item.totalPopulation))

    return {
      code: 200,
      message: '获取成功',
      data: {
        years,
        values,
        details: trendData
      }
    }
  } catch (error) {
    console.error('获取人口趋势数据失败:', error)
    return {
      code: 500,
      message: '获取数据失败',
      data: null
    }
  }
}

/**
 * 便捷方法：获取地区人口分布数据
 * 用于绘制地区分布图表
 */
export const getRegionDistribution = async (year = null) => {
  try {
    const filters = year ? { year: { eq: year } } : {}
    const params = {
      filters,
      sort: [{ field: 'population', order: 'desc' }],
      pageInfo: { index: 0, size: 50 }
    }

    const response = await getRegionPopulation(params)
    return response.data?.rows || []
  } catch (error) {
    console.error('获取地区人口分布数据失败:', error)
    throw error
  }
}

// 导出人口API对象
export const populationApi = {
  getBasicPopulation,
  getPopulationChange,
  getDefactoPopulation,
  getGenderPopulation,
  getResidentPopulation,
  getRegionPopulation,
  getPopulationStats,
  getPopulationOverview,
  getPopulationTrend,
  getRegionDistribution
}

// 默认导出
export default populationApi
