import request from './request'

// 医疗卫生机构统计API模块

/**
 * 获取医院等级统计数据
 * POST /api/hospital/levelstats
 * @param {Object} params 查询参数
 * @param {Array} params.columns 可选，查出几个字段的区间统计
 * @param {number} params.step 自定义每个区间长度
 * @param {Object} params.filters 过滤条件
 * @param {Array} params.sort 排序条件
 * @param {Object} params.pageInfo 分页信息
 * @returns {Promise}
 */
export const getHospitalLevelStats = (params = {}) => {
  return request({
    url: '/hospital/levelstats',
    method: 'post',
    data: {
      columns: params.columns || [],
      step: params.step || 2,
      filters: params.filters || {},
      sort: params.sort || [{ field: 'year', order: 'asc' }],
      pageInfo: params.pageInfo || { index: 0, size: 20 }
    }
  })
}

/**
 * 获取医院统计数据
 * POST /api/hospital/statistics
 * @param {Object} params 查询参数
 * @param {Array} params.columns 可选，查出几个字段的区间统计
 * @param {number} params.step 自定义每个区间长度
 * @param {Object} params.filters 过滤条件
 * @param {Array} params.sort 排序条件
 * @param {Object} params.pageInfo 分页信息
 * @returns {Promise}
 */
export const getHospitalStatistics = (params = {}) => {
  return request({
    url: '/hospital/statistics',
    method: 'post',
    data: {
      columns: params.columns || [],
      step: params.step || 2,
      filters: params.filters || {},
      sort: params.sort || [{ field: 'visitsPerDoctor', order: 'asc' }],
      pageInfo: params.pageInfo || { index: 0, size: 20 }
    }
  })
}

/**
 * 获取医疗机构分类统计数据
 * POST /api/hospital/institutionstats
 * @param {Object} params 查询参数
 * @param {Array} params.columns 可选，查出几个字段的区间统计
 * @param {number} params.step 自定义每个区间长度
 * @param {Object} params.filters 过滤条件
 * @param {Array} params.sort 排序条件
 * @param {Object} params.pageInfo 分页信息
 * @returns {Promise}
 */
export const getInstitutionStats = (params = {}) => {
  return request({
    url: '/hospital/institutionstats',
    method: 'post',
    data: {
      columns: params.columns || [],
      step: params.step || 2,
      filters: params.filters || {},
      sort: params.sort || [{ field: 'year', order: 'asc' }],
      pageInfo: params.pageInfo || { index: 0, size: 20 }
    }
  })
}

// 导出医院API对象
export const hospitalApi = {
  getHospitalLevelStats,
  getHospitalStatistics,
  getInstitutionStats
}

// 默认导出
export default hospitalApi
