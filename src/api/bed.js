import request from './request'

// 医疗卫生床位统计API模块

/**
 * 获取床位分类统计数据
 * POST /api/statistics/bed/category-stats/query
 * @param {Object} params 查询参数
 * @param {Object} params.filters 过滤条件
 * @param {Array} params.sort 排序条件
 * @param {Object} params.pageInfo 分页信息
 * @returns {Promise}
 */
export const getBedCategoryStats = (params = {}) => {
  return request({
    url: '/statistics/bed/category-stats/query',
    method: 'post',
    data: {
      filters: params.filters || {},
      sort: params.sort || [{ field: 'year', order: 'desc' }],
      pageInfo: params.pageInfo || { index: 0, size: 20 }
    }
  })
}

/**
 * 获取历年床位总数统计数据
 * POST /api/statistics/bed/total-count/query
 * @param {Object} params 查询参数
 * @param {Object} params.filters 过滤条件
 * @param {Array} params.sort 排序条件
 * @param {Object} params.pageInfo 分页信息
 * @returns {Promise}
 */
export const getBedTotalCount = (params = {}) => {
  return request({
    url: '/statistics/bed/total-count/query',
    method: 'post',
    data: {
      filters: params.filters || {},
      sort: params.sort || [{ field: 'year', order: 'desc' }],
      pageInfo: params.pageInfo || { index: 0, size: 20 }
    }
  })
}

/**
 * 获取床位使用率分析数据
 * GET /api/statistics/bed/utilization-analysis
 * @param {Object} params 查询参数
 * @param {number} params.year 年份
 * @param {string} params.hospitalType 医院类型
 * @returns {Promise}
 */
export const getBedUtilizationAnalysis = (params = {}) => {
  return request({
    url: '/statistics/bed/utilization-analysis',
    method: 'get',
    params: {
      year: params.year || new Date().getFullYear(),
      hospitalType: params.hospitalType || ''
    }
  })
}

// 导出床位API对象
export const bedApi = {
  getBedCategoryStats,
  getBedTotalCount,
  getBedUtilizationAnalysis
}

// 默认导出
export default bedApi
