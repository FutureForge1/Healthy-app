import request from './request'

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
 * @param {string} params.compareType 对比类型（如 hospital_level）
 * @param {string} params.costType 费用类型（如 outpatient/inpatient）
 * @returns {Promise}
 */
export const fetchCostStructureComparison = (params = {}) => {
  return request({
    url: '/statistics/cost/structure-comparison',
    method: 'GET',
    params
  })
} 