import request from './request'

// 图表生成API
export const chartAPI = {
  // 生成柱状图数据
  generateBarChart(data) {
    return request.post('/api/visualization/bar-chart', data)
  },

  // 生成折线图数据
  generateLineChart(data) {
    return request.post('/api/visualization/line-chart', data)
  },

  // 生成饼图数据
  generatePieChart(data) {
    return request.post('/api/visualization/pie-chart', data)
  },

  // 生成图表配置
  generateChartConfig(data) {
    return request.post('/api/visualization/charts-configuration', data)
  },

  // 获取图表数据
  getChartData(chartId, params) {
    return request.get(`/api/visualization/charts/${chartId}/data`, { params })
  },

  // 获取图表列表
  getCharts(params) {
    return request.get('/api/visualization/charts', { params })
  },

  // 保存图表
  saveChart(data) {
    return request.post('/api/visualization/charts', data)
  },

  // 更新图表
  updateChart(id, data) {
    return request.put(`/api/visualization/charts/${id}`, data)
  },

  // 删除图表
  deleteChart(id) {
    return request.delete(`/api/visualization/charts/${id}`)
  }
}

// 交互式报表API
export const reportAPI = {
  // 获取交互式报表数据
  getInteractiveReport(data) {
    return request.post('/api/visualization/interactive-report', data)
  },

  // 数据下钻
  drillDown(data) {
    return request.post('/api/visualization/drill-down', data)
  },

  // 生成统计报表
  generateReport(data) {
    return request.post('/api/visualization/reports/generate', data)
  },

  // 获取报表列表
  getReports(params) {
    return request.get('/api/visualization/reports', { params })
  },

  // 下载报表
  downloadReport(reportId) {
    return request.get(`/api/visualization/reports/${reportId}/download`, {
      responseType: 'blob'
    })
  }
}

// 仪表盘API
export const dashboardAPI = {
  // 创建仪表盘
  createDashboard(data) {
    return request.post('/api/visualization/dashboard', data)
  },

  // 获取仪表盘列表
  getDashboards(params) {
    return request.get('/api/visualization/dashboards', { params })
  },

  // 获取仪表盘详情
  getDashboardById(id) {
    return request.get(`/api/visualization/dashboards/${id}`)
  },

  // 更新仪表盘
  updateDashboard(id, data) {
    return request.put(`/api/visualization/dashboards/${id}`, data)
  },

  // 删除仪表盘
  deleteDashboard(id) {
    return request.delete(`/api/visualization/dashboards/${id}`)
  },

  // 获取仪表盘组件数据
  getWidgetData(widgetId, params) {
    return request.get(`/api/visualization/widget/${widgetId}/data`, { params })
  }
}

// 数据管理API
export const dataAPI = {
  // 数据导入
  importData(formData) {
    return request.post('/api/data/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 数据导出
  exportData(data) {
    return request.post('/api/data/export', data)
  },

  // 获取导入导出记录
  getImportExportLogs(params) {
    return request.get('/api/data/import-export-logs', { params })
  },

  // 数据质量检查
  checkDataQuality(data) {
    return request.post('/api/data/quality-check', data)
  },

  // 执行数据清洗
  cleanData(data) {
    return request.post('/api/data/clean', data)
  },

  // 获取数据标签列表
  getTags(params) {
    return request.get('/api/data/tags', { params })
  },

  // 创建数据标签
  createTag(data) {
    return request.post('/api/data/tags', data)
  },

  // 为数据添加标签
  assignTags(data) {
    return request.post('/api/data/tags/assign', data)
  },

  // 下载导出文件
  downloadExport(exportId) {
    return request.get(`/api/data/download/${exportId}`, {
      responseType: 'blob'
    })
  }
}

// 审计系统API
export const auditAPI = {
  // 获取操作日志列表
  getOperationLogs(params) {
    return request.get('/api/audit/logs', { params })
  },

  // 获取操作日志详情
  getOperationLogById(id) {
    return request.get(`/api/audit/logs/${id}`)
  },

  // 导出操作日志
  exportOperationLogs(data) {
    return request.post('/api/audit/logs/export', data)
  },

  // 获取系统状态
  getSystemStatus() {
    return request.get('/api/audit/system/status')
  },

  // 获取系统性能指标
  getSystemMetrics(params) {
    return request.get('/api/audit/system/metrics', { params })
  },

  // 获取异常事件
  getSystemExceptions(params) {
    return request.get('/api/audit/system/exceptions', { params })
  },

  // 生成审计报表
  generateAuditReport(data) {
    return request.post('/api/audit/reports/generate', data)
  },

  // 获取审计统计
  getAuditStatistics(params) {
    return request.get('/api/audit/statistics', { params })
  },

  // 获取地图数据
  getMapData(params) {
    return request.get('/api/visualization/map-data', { params })
  }
}

// 统一导出可视化API
export const visualizationApi = {
  // 图表管理
  getCharts: chartAPI.getCharts,
  getChartData: chartAPI.getChartData,
  saveChart: chartAPI.saveChart,
  updateChart: chartAPI.updateChart,
  deleteChart: chartAPI.deleteChart,
  generateBarChart: chartAPI.generateBarChart,
  generateLineChart: chartAPI.generateLineChart,
  generatePieChart: chartAPI.generatePieChart,
  generateChartConfig: chartAPI.generateChartConfig,

  // 仪表盘管理
  getDashboards: dashboardAPI.getDashboards,
  getDashboardById: dashboardAPI.getDashboardById,
  createDashboard: dashboardAPI.createDashboard,
  updateDashboard: dashboardAPI.updateDashboard,
  deleteDashboard: dashboardAPI.deleteDashboard,
  getWidgetData: dashboardAPI.getWidgetData,

  // 报表管理
  getReports: reportAPI.getReports,
  generateReport: reportAPI.generateReport,
  getInteractiveReport: reportAPI.getInteractiveReport,
  drillDown: reportAPI.drillDown,
  downloadReport: reportAPI.downloadReport,

  // 数据管理
  importData: dataAPI.importData,
  exportData: dataAPI.exportData,
  getImportExportLogs: dataAPI.getImportExportLogs,
  checkDataQuality: dataAPI.checkDataQuality,
  cleanData: dataAPI.cleanData,
  getTags: dataAPI.getTags,
  createTag: dataAPI.createTag,
  assignTags: dataAPI.assignTags,
  downloadExport: dataAPI.downloadExport,

  // 审计系统
  getOperationLogs: auditAPI.getOperationLogs,
  getOperationLogById: auditAPI.getOperationLogById,
  exportOperationLogs: auditAPI.exportOperationLogs,
  getSystemStatus: auditAPI.getSystemStatus,
  getSystemMetrics: auditAPI.getSystemMetrics,
  getSystemExceptions: auditAPI.getSystemExceptions,
  generateAuditReport: auditAPI.generateAuditReport,
  getAuditStatistics: auditAPI.getAuditStatistics,

  // 地图数据
  getMapData: auditAPI.getMapData
}
