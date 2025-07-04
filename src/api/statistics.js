import request from './request'

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
 * 获取医护人员统计数据
 * @param {Object} params 查询参数
 * @param {string} params.district 行政区划
 * @param {string} params.profession 职业类型
 * @param {string} params.level 职称等级
 * @param {string} params.year 年份
 * @returns {Promise}
 */
export const getStaffStats = (params = {}) => {
  return request({
    url: '/statistics/staff',
    method: 'GET',
    params
  })
}

/**
 * 获取床位资源统计数据
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
 * 获取医疗服务统计数据
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
 * 获取医疗费用统计数据
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

  // 人口统计
  getPopulationStats,

  // 医疗机构统计
  getHospitalStats,
  getInstitutionStats: getHospitalStats, // 别名

  // 医护人员统计
  getPersonnelStats: getStaffStats,

  // 床位统计
  getBedStats,

  // 服务统计
  getServiceStats,

  // 费用统计
  getCostStats,

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
