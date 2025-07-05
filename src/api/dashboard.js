import request from './request'

/**
 * Dashboard API - 仪表盘数据接口
 */

/**
 * 获取仪表盘概览统计数据
 * @returns {Promise}
 */
export const getDashboardOverview = () => {
  return request({
    url: '/statistics/dashboard/overview',
    method: 'GET'
  })
}

/**
 * 获取核心指标数据
 * @param {string} timeRange 时间范围: today, week, month, year
 * @returns {Promise}
 */
export const getCoreMetrics = (timeRange = 'month') => {
  return request({
    url: '/statistics/core-metrics',
    method: 'GET',
    params: { timeRange }
  })
}

/**
 * 获取人口趋势图表数据
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export const getPopulationTrendChart = (params = {}) => {
  return request({
    url: '/statistics/population/trend',
    method: 'GET',
    params: {
      startYear: 2020,
      endYear: 2024,
      ...params
    }
  })
}

/**
 * 获取医疗机构分布图表数据
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export const getInstitutionDistributionChart = (params = {}) => {
  return request({
    url: '/statistics/institution/category',
    method: 'GET',
    params
  })
}

/**
 * 获取医护人员统计数据
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export const getPersonnelStats = (params = {}) => {
  return request({
    url: '/statistics/personnel/category',
    method: 'GET',
    params
  })
}

/**
 * 获取床位使用率数据
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export const getBedUtilizationStats = (params = {}) => {
  return request({
    url: '/statistics/bed/utilization',
    method: 'GET',
    params
  })
}

/**
 * 获取最近活动数据
 * @param {number} limit 限制数量
 * @returns {Promise}
 */
export const getRecentActivities = (limit = 10) => {
  return request({
    url: '/audit/operation-logs/recent',
    method: 'GET',
    params: { limit }
  })
}

/**
 * 获取系统通知数据
 * @param {number} limit 限制数量
 * @returns {Promise}
 */
export const getSystemNotifications = (limit = 5) => {
  return request({
    url: '/system/notifications',
    method: 'GET',
    params: { limit, unreadOnly: false }
  })
}

/**
 * 获取数据质量报告
 * @returns {Promise}
 */
export const getDataQualityReport = () => {
  return request({
    url: '/data/quality-report',
    method: 'GET'
  })
}

/**
 * 获取实时数据监控
 * @returns {Promise}
 */
export const getRealTimeMonitoring = () => {
  return request({
    url: '/statistics/real-time/monitoring',
    method: 'GET'
  })
}

// 统一导出
export const dashboardAPI = {
  getDashboardOverview,
  getCoreMetrics,
  getPopulationTrendChart,
  getInstitutionDistributionChart,
  getPersonnelStats,
  getBedUtilizationStats,
  getRecentActivities,
  getSystemNotifications,
  getDataQualityReport,
  getRealTimeMonitoring
}

export default dashboardAPI
