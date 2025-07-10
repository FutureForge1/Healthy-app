import request from './request'

//这个是专门给仪表盘获取数据的


/**
 * 获取核心指标数据
 * @param {string} timeRange 时间范围: today, week, month, year
 * @returns {Promise}
 */
export const getCoreMetrics = (timeRange = 'today') => {
  return request({
    url: '/statistics/core-metrics',
    method: 'GET',
    params: { timeRange }
  })
}

/**
 * 获取仪表盘统计数据
 * @returns {Promise}
 */
export const getDashboardStats = () => {
  return request({
    url: '/statistics/dashboard/overview',
    method: 'GET'
  })
}

/**
 * 获取仪表盘图表数据
 * @param {string} chartType 图表类型: population, institution, personnel, bed
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export const getDashboardChartData = (chartType, params = {}) => {
  return request({
    url: `/statistics/dashboard/charts/${chartType}`,
    method: 'GET',
    params
  })
}

/**
 * 获取人口统计数据
 * @param {Object} params 查询参数
 * @param {string} params.district 行政区划
 * @param {string} params.year 年份
 * @param {string} params.ageGroup 年龄组
 * @returns {Promise}
 */
export const getPopulationStats = (params = {}) => {
  return request({
    url: '/statistics/population',
    method: 'GET',
    params
  })
}

/**
 * 获取医疗机构统计数据
 * @param {Object} params 查询参数
 * @param {string} params.district 行政区划
 * @param {string} params.level 医院等级
 * @param {string} params.type 医院类型
 * @param {string} params.year 年份
 * @returns {Promise}
 */
export const getHospitalStats = (params = {}) => {
  return request({
    url: '/statistics/hospitals',
    method: 'GET',
    params
  })
}



/**
 * 获取床位分类统计
 * @param {Object} queryParams 查询参数
 * @param {Object} queryParams.filters 过滤条件
 * @param {Array} queryParams.sort 排序条件
 * @param {Object} queryParams.pageInfo 分页信息
 * @returns {Promise}
 */
export const getBedCategoryStats = (queryParams = {}) => {
  return request({
    url: '/statistics/bed/category-stats/query',
    method: 'POST',
    data: queryParams
  })
}

/**
 * 获取历年床位总数
 * @param {Object} queryParams 查询参数
 * @param {Object} queryParams.filters 过滤条件
 * @param {Array} queryParams.sort 排序条件
 * @param {Object} queryParams.pageInfo 分页信息
 * @returns {Promise}
 */
export const getBedTotalCount = (queryParams = {}) => {
  return request({
    url: '/statistics/bed/total-count/query',
    method: 'POST',
    data: queryParams
  })
}

/**
 * 获取床位使用率分析
 * @param {Object} params 查询参数
 * @param {number} params.year 年份
 * @param {string} params.hospitalType 医院类型
 * @returns {Promise}
 */
export const getBedUtilizationAnalysis = (params = {}) => {
  return request({
    url: '/statistics/bed/utilization-analysis',
    method: 'GET',
    params
  })
}

/**
 * 获取床位资源统计数据（兼容旧接口）
 * @param {Object} params 查询参数
 * @param {string} params.district 行政区划
 * @param {string} params.hospitalLevel 医院等级
 * @param {string} params.bedType 床位类型
 * @param {string} params.year 年份
 * @returns {Promise}
 */
export const getBedStats = (params = {}) => {
  return request({
    url: '/statistics/beds',
    method: 'GET',
    params
  })
}

/**
 * 获取医院服务统计
 * @param {Object} queryParams 查询参数
 * @param {Object} queryParams.filters 过滤条件
 * @param {Array} queryParams.sort 排序条件
 * @param {Object} queryParams.pageInfo 分页信息
 * @returns {Promise}
 */
export const getHospitalServiceStats = (queryParams = {}) => {
  return request({
    url: '/statistics/service/hospital-service/query',
    method: 'POST',
    data: queryParams
  })
}

/**
 * 获取医疗服务质量分析
 * @param {Object} params 查询参数
 * @param {string} params.hospitalType 医院类型
 * @param {string} params.analysisType 分析类型
 * @returns {Promise}
 */
export const getServiceQualityAnalysis = (params = {}) => {
  return request({
    url: '/statistics/service/quality-analysis',
    method: 'GET',
    params
  })
}

/**
 * 获取医疗服务统计数据（兼容旧接口）
 * @param {Object} params 查询参数
 * @param {string} params.serviceType 服务类型: outpatient, inpatient, emergency, surgery
 * @param {string} params.timeRange 时间范围: today, week, month, year
 * @param {string} params.district 行政区划
 * @returns {Promise}
 */
export const getServiceStats = (params = {}) => {
  return request({
    url: '/statistics/services',
    method: 'GET',
    params
  })
}
/**
 * 获取门诊费用统计
 * @param {Object} queryParams 查询参数
 * @param {Object} queryParams.filters 过滤条件
 * @param {Array} queryParams.sort 排序条件
 * @param {Object} queryParams.pageInfo 分页信息
 * @returns {Promise}
 */
export const fetchOutpatientCostStatistics = (queryParams = {}) => {
  return request({
    url: '/statistics/cost/outpatient/query',
    method: 'POST',
    data: queryParams
  })
}

/**
 * 获取住院费用统计
 * @param {Object} queryParams 查询参数
 * @param {Object} queryParams.filters 过滤条件
 * @param {Array} queryParams.sort 排序条件
 * @param {Object} queryParams.pageInfo 分页信息
 * @returns {Promise}
 */
export const fetchInpatientCostStatistics = (queryParams = {}) => {
  return request({
    url: '/statistics/cost/inpatient/query',
    method: 'POST',
    data: queryParams
  })
}

/**
 * 获取费用结构对比分析
 * @param {Object} params 查询参数
 * @param {string} params.compareType 对比类型
 * @param {string} params.costType 费用类型
 * @returns {Promise}
 */
export const fetchCostStructureComparison = (params = {}) => {
  return request({
    url: '/statistics/cost/structure-comparison',
    method: 'GET',
    params
  })
}

/**
 * 获取医疗费用统计数据（兼容旧接口）
 * @param {Object} params 查询参数
 * @param {string} params.costType 费用类型: total, outpatient, inpatient, drug
 * @param {string} params.timeRange 时间范围: today, week, month, year
 * @param {string} params.district 行政区划
 * @returns {Promise}
 */
export const getCostStats = (params = {}) => {
  return request({
    url: '/statistics/costs',
    method: 'GET',
    params
  })
}


/**
 * 获取区域分布数据
 * @param {string} dataType 数据类型: hospitals, population, staff, beds
 * @param {string} year 年份
 * @returns {Promise}
 */
export const getDistrictDistribution = (dataType, year = '2023') => {
  return request({
    url: '/statistics/district-distribution',
    method: 'GET',
    params: { dataType, year }
  })
}

/**
 * 获取趋势分析数据
 * @param {Object} params 查询参数
 * @param {string} params.metric 指标类型
 * @param {string} params.timeRange 时间范围
 * @param {string} params.granularity 粒度: day, week, month, year
 * @returns {Promise}
 */
export const getTrendAnalysis = (params = {}) => {
  return request({
    url: '/statistics/trends',
    method: 'GET',
    params
  })
}

/**
 * 获取对比分析数据
 * @param {Object} params 查询参数
 * @param {Array} params.metrics 对比指标
 * @param {Array} params.periods 对比时期
 * @param {string} params.district 行政区划
 * @returns {Promise}
 */
export const getComparisonAnalysis = (params = {}) => {
  return request({
    url: '/statistics/comparison',
    method: 'GET',
    params
  })
}

/**
 * 获取预测分析数据
 * @param {Object} params 查询参数
 * @param {string} params.metric 预测指标
 * @param {string} params.model 预测模型
 * @param {number} params.periods 预测期数
 * @returns {Promise}
 */
export const getPredictionAnalysis = (params = {}) => {
  return request({
    url: '/statistics/prediction',
    method: 'GET',
    params
  })
}

/**
 * 获取实时数据
 * @returns {Promise}
 */
export const getRealTimeData = () => {
  return request({
    url: '/statistics/realtime',
    method: 'GET'
  })
}

/**
 * 导出统计报告
 * @param {Object} params 导出参数
 * @param {string} params.reportType 报告类型
 * @param {string} params.format 格式: excel, pdf
 * @param {Object} params.filters 筛选条件
 * @returns {Promise}
 */
export const exportReport = (params = {}) => {
  return request({
    url: '/statistics/export',
    method: 'POST',
    data: params,
    responseType: 'blob'
  })
}

// 统一导出统计API
export const statisticsApi = {
  // 核心指标
  getCoreMetrics,

  // 仪表盘专用接口
  getDashboardStats,
  getDashboardChartData,

  // 人口统计
  getPopulationStats,

  // 医疗机构统计
  getHospitalStats,
  getInstitutionStats: getHospitalStats, // 别名

  //这个改了一下：现在医护人员统计已移至 src/api/personnel.js

  // 床位统计 - 新接口
  getBedCategoryStats,
  getBedTotalCount,
  getBedUtilizationAnalysis,
  getBedStats, // 兼容旧接口

  // 服务统计 - 新接口
  getHospitalServiceStats,
  getServiceQualityAnalysis,
  getServiceStats, // 兼容旧接口

  // 费用统计 - 新接口
  getOutpatientCostStats: fetchOutpatientCostStatistics,
  getInpatientCostStats: fetchInpatientCostStatistics,
  getCostStructureComparison: fetchCostStructureComparison,
  getCostStats, // 兼容旧接口

  // 趋势分析
  getTrendAnalysis,

  // 对比分析
  getComparisonAnalysis,

  // 预测分析
  getPredictionAnalysis,

  // 实时数据
  getRealTimeData,

  // 导出报告
  exportReport
}
