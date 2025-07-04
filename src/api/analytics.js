import request from './request'

// 人口统计API
export const populationAPI = {
  // 基础人口统计
  getBasicStats(params) {
    return request.get('/api/statistics/population/basic', { params })
  },

  // 常住人口统计
  getResidentStats(params) {
    return request.get('/api/statistics/population/resident', { params })
  },

  // 人口自然变动统计
  getNaturalChangeStats(params) {
    return request.get('/api/statistics/population/natural-change', { params })
  },

  // 城乡人口分布
  getUrbanRuralStats(params) {
    return request.get('/api/statistics/population/urban-rural', { params })
  },

  // 各区县人口统计
  getDistrictStats(params) {
    return request.get('/api/statistics/population/district', { params })
  },

  // 人口趋势分析
  getTrendAnalysis(params) {
    return request.get('/api/statistics/population/trend', { params })
  },

  // 人口预测
  getPopulationForecast(params) {
    return request.get('/api/statistics/population/forecast', { params })
  }
}

// 医疗机构统计API
export const institutionAPI = {
  // 机构分类统计
  getCategoryStats(params) {
    return request.get('/api/statistics/institution/category', { params })
  },

  // 医院等级统计
  getLevelStats(params) {
    return request.get('/api/statistics/institution/level', { params })
  },

  // 机构发展趋势
  getTrendAnalysis(params) {
    return request.get('/api/statistics/institution/trend', { params })
  },

  // 机构地区分布
  getRegionalDistribution(params) {
    return request.get('/api/statistics/institution/regional', { params })
  },

  // 机构详细信息
  getInstitutionDetails(params) {
    return request.get('/api/statistics/institution/details', { params })
  }
}

// 医疗人员统计API
export const personnelAPI = {
  // 人员分类统计
  getCategoryStats(params) {
    return request.get('/api/statistics/personnel/category', { params })
  },

  // 人员总数统计
  getTotalCount(params) {
    return request.get('/api/statistics/personnel/total', { params })
  },

  // 人员结构分析
  getStructureAnalysis(params) {
    return request.get('/api/statistics/personnel/structure', { params })
  },

  // 人员发展趋势
  getTrendAnalysis(params) {
    return request.get('/api/statistics/personnel/trend', { params })
  },

  // 人员地区分布
  getRegionalDistribution(params) {
    return request.get('/api/statistics/personnel/regional', { params })
  }
}

// 床位统计API
export const bedAPI = {
  // 床位分类统计
  getCategoryStats(params) {
    return request.get('/api/statistics/bed/category', { params })
  },

  // 床位总数统计
  getTotalCount(params) {
    return request.get('/api/statistics/bed/total', { params })
  },

  // 床位使用率分析
  getUtilizationAnalysis(params) {
    return request.get('/api/statistics/bed/utilization', { params })
  },

  // 床位发展趋势
  getTrendAnalysis(params) {
    return request.get('/api/statistics/bed/trend', { params })
  },

  // 床位地区分布
  getRegionalDistribution(params) {
    return request.get('/api/statistics/bed/regional', { params })
  }
}

// 医疗服务统计API
export const serviceAPI = {
  // 医院服务量统计
  getHospitalServiceStats(params) {
    return request.get('/api/statistics/service/hospital', { params })
  },

  // 服务质量分析
  getQualityAnalysis(params) {
    return request.get('/api/statistics/service/quality', { params })
  },

  // 服务发展趋势
  getTrendAnalysis(params) {
    return request.get('/api/statistics/service/trend', { params })
  },

  // 服务地区对比
  getRegionalComparison(params) {
    return request.get('/api/statistics/service/regional', { params })
  }
}

// 医疗费用统计API
export const costAPI = {
  // 门诊费用统计
  getOutpatientCostStats(params) {
    return request.get('/api/statistics/cost/outpatient', { params })
  },

  // 住院费用统计
  getInpatientCostStats(params) {
    return request.get('/api/statistics/cost/inpatient', { params })
  },

  // 费用结构对比
  getStructureComparison(params) {
    return request.get('/api/statistics/cost/structure', { params })
  },

  // 费用发展趋势
  getTrendAnalysis(params) {
    return request.get('/api/statistics/cost/trend', { params })
  },

  // 费用地区对比
  getRegionalComparison(params) {
    return request.get('/api/statistics/cost/regional', { params })
  }
}

// 高级统计分析API
export const advancedAnalyticsAPI = {
  // 描述性统计
  getDescriptiveStats(data) {
    return request.post('/api/analytics/descriptive-stats', data)
  },

  // 分组统计
  getGroupStats(data) {
    return request.post('/api/analytics/group-stats', data)
  },

  // 相关性分析
  getCorrelationAnalysis(data) {
    return request.post('/api/analytics/correlation', data)
  },

  // 趋势分析
  getTrendAnalysis(data) {
    return request.post('/api/analytics/trend-analysis', data)
  },

  // 对比分析
  getComparisonAnalysis(data) {
    return request.post('/api/analytics/comparison', data)
  }
}
