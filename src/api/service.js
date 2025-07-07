import request from './request'

//医疗服务统计API模块

// 医院服务统计查询
export const getHospitalServiceStats = (params = {}) => {
  const defaultParams = {
    filters: {},
    sort: [
      { field: "bedUtilizationRate", order: "desc" }
    ],
    pageInfo: {
      index: 0,
      size: 20
    }
  }
  
  return request({
    url: '/statistics/service/hospital-service/query',
    method: 'POST',
    data: { ...defaultParams, ...params }
  })
}

// 服务质量分析
export const getServiceQualityAnalysis = (params = {}) => {
  const defaultParams = {
    hospitalType: "综合医院",
    analysisType: "efficiency"
  }
  
  return request({
    url: '/statistics/service/quality-analysis',
    method: 'GET',
    params: { ...defaultParams, ...params }
  })
}

// 获取床位利用率统计
export const getBedUtilizationStats = (params = {}) => {
  return request({
    url: '/statistics/bed/utilization-analysis',
    method: 'GET',
    params
  })
}
