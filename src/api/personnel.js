import request from './request'
// 对应的是4.医护人员统计相关API：

/**
 * 对应4.1.1的获取卫生人员分类统计
 * POST /api/statistics/personnel/category-stats/query
 * @param {Object} queryParams 查询参数
 * @param {Object} queryParams.filters 过滤条件，支持 eq, notEq, gt, gte, lt, lte, in, notIn, like, notLike
 * @param {Array} queryParams.sort 排序条件，格式：[{ field: "year", order: "desc" }]
 * @param {Object} queryParams.pageInfo 分页信息，格式：{ index: 0, size: 20 }
 * @returns {Promise}
 */
export const getPersonnelCategoryStats = (queryParams = {}) => {
  return request({
    url: '/statistics/personnel/category-stats/query',
    method: 'POST',
    data: queryParams
  })
}

/**
 * 对应4.1.2 获取历年卫生人员总数
 * POST /api/statistics/personnel/total-count/query
 * @param {Object} queryParams 查询参数
 * @param {Object} queryParams.filters 过滤条件，支持 eq, notEq, gt, gte, lt, lte, in, notIn, like, notLike
 * @param {Array} queryParams.sort 排序条件，格式：[{ field: "year", order: "desc" }]
 * @param {Object} queryParams.pageInfo 分页信息，格式：{ index: 0, size: 20 }
 * @returns {Promise}
 */
export const getPersonnelTotalCount = (queryParams = {}) => {
  return request({
    url: '/statistics/personnel/total-count/query',
    method: 'POST',
    data: queryParams
  })
}

//  4.2 人员结构分析 

/**
 * 4.2.1 人员结构分析
 * GET /api/statistics/personnel/structure-analysis
 * @returns {Promise}
 */
export const getPersonnelStructureAnalysis = () => {
  return request({
    url: '/statistics/personnel/structure-analysis',
    method: 'GET'
  })
}

// 用这个便捷的方法，就是为了其他地方的使用

/**
 * 获取指定年份的人员分类统计
 * @param {number} year 年份
 * @param {number} pageSize 每页条数，默认20
 * @returns {Promise}
 */
export const getPersonnelCategoryStatsByYear = (year, pageSize = 20) => {
  return getPersonnelCategoryStats({
    filters: {
      year: { eq: year }
    },
    sort: [
      { field: "year", order: "desc" }
    ],
    pageInfo: {
      index: 0,
      size: pageSize
    }
  })
}

/**
 * 获取指定年份范围的人员总数统计
 * @param {number} startYear 开始年份
 * @param {number} endYear 结束年份
 * @param {number} pageSize 每页条数，默认20
 * @returns {Promise}
 */
export const getPersonnelTotalCountByYearRange = (startYear, endYear, pageSize = 20) => {
  return getPersonnelTotalCount({
    filters: {
      year: { gte: startYear, lte: endYear }
    },
    sort: [
      { field: "year", order: "desc" }
    ],
    pageInfo: {
      index: 0,
      size: pageSize
    }
  })
}

/**
 * 获取最近5年的人员总数统计
 * @param {number} years 年数，默认5年
 * @returns {Promise}
 */
export const getRecentPersonnelTotalCount = (years = 5) => {
  const currentYear = new Date().getFullYear()
  const startYear = currentYear - years + 1
  
  return getPersonnelTotalCountByYearRange(startYear, currentYear)
}

/**
 * 获取人员统计概览数据（用于仪表盘）
 * @returns {Promise}
 */
export const getPersonnelOverview = async () => {
  try {
    // 并行获取结构分析和最近年份的总数统计
    const [structureData, totalCountData] = await Promise.all([
      getPersonnelStructureAnalysis(),
      getRecentPersonnelTotalCount(1)
    ])

    return {
      structure: structureData,
      totalCount: totalCountData
    }
  } catch (error) {
    console.error('获取人员统计概览数据失败:', error)
    throw error
  }
}

// 导出所有方法
export default {
  // 基础统计
  getPersonnelCategoryStats,
  getPersonnelTotalCount,
  
  // 结构分析
  getPersonnelStructureAnalysis,
  // 便捷方法
  getPersonnelCategoryStatsByYear,
  getPersonnelTotalCountByYearRange,
  getRecentPersonnelTotalCount,
  getPersonnelOverview,

}
