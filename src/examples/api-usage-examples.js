/**
 * API使用示例
 * 展示如何使用更新后的统计和数据管理API
 */

import { statisticsApi } from '@/api/statistics'
import { dataApi } from '@/api/data'
import personnelApi from '@/api/personnel'

/**
 * 医疗卫生人员统计示例
 */
export const personnelStatsExamples = {
  // 获取卫生人员分类统计
  async getCategoryStats() {
    const queryParams = {
      filters: {
        year: { eq: 2023 }
      },
      sort: [
        { field: 'year', order: 'desc' }
      ],
      pageInfo: {
        index: 0,
        size: 20
      }
    }
    
    try {
      const response = await personnelApi.getPersonnelCategoryStats(queryParams)
      console.log('人员分类统计:', response.data)
      return response.data
    } catch (error) {
      console.error('获取人员分类统计失败:', error)
    }
  },

  // 获取历年人员总数
  async getTotalCount() {
    const queryParams = {
      filters: {
        year: { gte: 2020, lte: 2023 },
        totalCount: { gte: 10 }
      },
      sort: [
        { field: 'year', order: 'desc' }
      ],
      pageInfo: {
        index: 0,
        size: 20
      }
    }
    
    try {
      const response = await personnelApi.getPersonnelTotalCount(queryParams)
      console.log('历年人员总数:', response.data)
      return response.data
    } catch (error) {
      console.error('获取历年人员总数失败:', error)
    }
  },

  // 获取人员结构分析
  async getStructureAnalysis() {
    try {
      const response = await personnelApi.getPersonnelStructureAnalysis()
      console.log('人员结构分析:', response.data)
      return response.data
    } catch (error) {
      console.error('获取人员结构分析失败:', error)
    }
  }
}

/**
 * 床位统计示例
 */
export const bedStatsExamples = {
  // 获取床位分类统计
  async getCategoryStats() {
    const queryParams = {
      filters: {
        year: { gte: 2020, lte: 2023 }
      },
      sort: [
        { field: 'year', order: 'desc' }
      ],
      pageInfo: {
        index: 0,
        size: 20
      }
    }
    
    try {
      const response = await statisticsApi.getBedCategoryStats(queryParams)
      console.log('床位分类统计:', response.data)
      return response.data
    } catch (error) {
      console.error('获取床位分类统计失败:', error)
    }
  },

  // 获取床位使用率分析
  async getUtilizationAnalysis() {
    const params = {
      year: 2023,
      hospitalType: '综合医院'
    }
    
    try {
      const response = await statisticsApi.getBedUtilizationAnalysis(params)
      console.log('床位使用率分析:', response.data)
      return response.data
    } catch (error) {
      console.error('获取床位使用率分析失败:', error)
    }
  }
}

/**
 * 医疗服务统计示例
 */
export const serviceStatsExamples = {
  // 获取医院服务统计
  async getHospitalServiceStats() {
    const queryParams = {
      filters: {
        typeName: { like: '医院' },
        bedUtilizationRate: { gte: 80 }
      },
      sort: [
        { field: 'bedUtilizationRate', order: 'desc' }
      ],
      pageInfo: {
        index: 0,
        size: 20
      }
    }
    
    try {
      const response = await statisticsApi.getHospitalServiceStats(queryParams)
      console.log('医院服务统计:', response.data)
      return response.data
    } catch (error) {
      console.error('获取医院服务统计失败:', error)
    }
  },

  // 获取服务质量分析
  async getQualityAnalysis() {
    const params = {
      hospitalType: '综合医院',
      analysisType: 'efficiency'
    }
    
    try {
      const response = await statisticsApi.getServiceQualityAnalysis(params)
      console.log('服务质量分析:', response.data)
      return response.data
    } catch (error) {
      console.error('获取服务质量分析失败:', error)
    }
  }
}

/**
 * 医疗费用统计示例
 */
export const costStatsExamples = {
  // 获取门诊费用统计
  async getOutpatientCostStats() {
    const queryParams = {
      filters: {
        hospitalLevel: { eq: '部属' },
        totalFee: { gte: 100 }
      },
      sort: [
        { field: 'totalFee', order: 'desc' }
      ],
      pageInfo: {
        index: 0,
        size: 20
      }
    }
    
    try {
      const response = await statisticsApi.getOutpatientCostStats(queryParams)
      console.log('门诊费用统计:', response.data)
      return response.data
    } catch (error) {
      console.error('获取门诊费用统计失败:', error)
    }
  },

  // 获取住院费用统计
  async getInpatientCostStats() {
    const queryParams = {
      filters: {
        hospitalLevel: { eq: '部属' },
        totalFee: { gte: 10000 }
      },
      sort: [
        { field: 'totalFee', order: 'desc' }
      ],
      pageInfo: {
        index: 0,
        size: 20
      }
    }
    
    try {
      const response = await statisticsApi.getInpatientCostStats(queryParams)
      console.log('住院费用统计:', response.data)
      return response.data
    } catch (error) {
      console.error('获取住院费用统计失败:', error)
    }
  },

  // 获取费用结构对比分析
  async getStructureComparison() {
    const params = {
      compareType: 'hospital_level',
      costType: 'outpatient'
    }
    
    try {
      const response = await statisticsApi.getCostStructureComparison(params)
      console.log('费用结构对比分析:', response.data)
      return response.data
    } catch (error) {
      console.error('获取费用结构对比分析失败:', error)
    }
  }
}

/**
 * 数据管理示例
 */
export const dataManagementExamples = {
  // 数据导入示例
  async importData(file, dataType = 'population', importMode = 'insert') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('dataType', dataType)
    formData.append('importMode', importMode)
    
    try {
      const response = await dataApi.importData(formData)
      console.log('数据导入结果:', response.data)
      return response.data
    } catch (error) {
      console.error('数据导入失败:', error)
    }
  },

  // 数据导出示例
  async exportData() {
    const params = {
      dataType: 'population',
      exportFormat: 'excel',
      filters: {
        startYear: 2020,
        endYear: 2023,
        regions: [1, 2, 3]
      },
      fields: ['year', 'totalPopulation', 'urbanPopulation']
    }
    
    try {
      const response = await dataApi.exportData(params)
      console.log('数据导出结果:', response.data)
      return response.data
    } catch (error) {
      console.error('数据导出失败:', error)
    }
  },

  // 数据质量检查示例
  async checkDataQuality() {
    const params = {
      dataType: 'population',
      checkRules: [
        'null_check',
        'range_check',
        'consistency_check',
        'duplicate_check'
      ],
      dateRange: {
        startYear: 2020,
        endYear: 2023
      }
    }
    
    try {
      const response = await dataApi.checkDataQuality(params)
      console.log('数据质量检查结果:', response.data)
      return response.data
    } catch (error) {
      console.error('数据质量检查失败:', error)
    }
  },

  // 数据清洗示例
  async cleanData() {
    const params = {
      dataType: 'population',
      cleanRules: [
        {
          rule: 'remove_duplicates',
          parameters: {
            keyFields: ['year', 'regionId']
          }
        },
        {
          rule: 'fill_missing_values',
          parameters: {
            field: 'phone',
            method: 'default',
            defaultValue: '未填写'
          }
        }
      ]
    }
    
    try {
      const response = await dataApi.cleanData(params)
      console.log('数据清洗结果:', response.data)
      return response.data
    } catch (error) {
      console.error('数据清洗失败:', error)
    }
  },

  // 标签管理示例
  async manageDataTags() {
    try {
      // 创建标签
      const newTag = await dataApi.createDataTag({
        tagName: '重要数据',
        tagCode: 'important_data',
        tagType: 'priority',
        color: '#1890ff',
        description: '重要统计数据'
      })
      console.log('创建标签结果:', newTag.data)

      // 为数据添加标签
      const assignResult = await dataApi.assignDataTags({
        dataType: 'population',
        dataIds: [1, 2, 3],
        tagIds: [1, 2]
      })
      console.log('标签分配结果:', assignResult.data)

      // 获取标签列表
      const tags = await dataApi.getDataTags()
      console.log('标签列表:', tags.data)

      return { newTag, assignResult, tags }
    } catch (error) {
      console.error('标签管理操作失败:', error)
    }
  }
}
