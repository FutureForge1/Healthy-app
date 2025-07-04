import request from './request'

/**
 * 获取操作日志列表
 * @param {Object} params 查询参数
 * @param {number} params.page 页码
 * @param {number} params.size 每页大小
 * @param {string} params.username 用户名
 * @param {string} params.operationType 操作类型
 * @param {string} params.module 模块
 * @param {string} params.result 操作结果
 * @param {Array} params.timeRange 时间范围
 * @returns {Promise}
 */
export const getOperationLogs = (params = {}) => {
  return request({
    url: '/audit/operation-logs',
    method: 'GET',
    params
  })
}

/**
 * 获取系统监控数据
 * @returns {Promise}
 */
export const getSystemMonitoring = () => {
  return request({
    url: '/audit/system-monitoring',
    method: 'GET'
  })
}

/**
 * 获取审计报告列表
 * @param {Object} params 查询参数
 * @param {number} params.page 页码
 * @param {number} params.size 每页大小
 * @param {string} params.reportType 报告类型
 * @param {string} params.status 状态
 * @returns {Promise}
 */
export const getAuditReports = (params = {}) => {
  return request({
    url: '/audit/reports',
    method: 'GET',
    params
  })
}

/**
 * 生成审计报告
 * @param {Object} data 报告配置
 * @param {string} data.reportType 报告类型
 * @param {string} data.title 报告标题
 * @param {Array} data.timeRange 时间范围
 * @param {Array} data.modules 包含的模块
 * @returns {Promise}
 */
export const generateAuditReport = (data) => {
  return request({
    url: '/audit/reports',
    method: 'POST',
    data
  })
}

/**
 * 下载审计报告
 * @param {number} reportId 报告ID
 * @returns {Promise}
 */
export const downloadAuditReport = (reportId) => {
  return request({
    url: `/audit/reports/${reportId}/download`,
    method: 'GET',
    responseType: 'blob'
  })
}

/**
 * 获取安全事件列表
 * @param {Object} params 查询参数
 * @param {number} params.page 页码
 * @param {number} params.size 每页大小
 * @param {string} params.eventType 事件类型
 * @param {string} params.severity 严重程度
 * @returns {Promise}
 */
export const getSecurityEvents = (params = {}) => {
  return request({
    url: '/audit/security-events',
    method: 'GET',
    params
  })
}

/**
 * 处理安全事件
 * @param {number} eventId 事件ID
 * @param {Object} data 处理信息
 * @param {string} data.action 处理动作
 * @param {string} data.comment 处理备注
 * @returns {Promise}
 */
export const handleSecurityEvent = (eventId, data) => {
  return request({
    url: `/audit/security-events/${eventId}/handle`,
    method: 'POST',
    data
  })
}

/**
 * 获取合规检查结果
 * @param {Object} params 查询参数
 * @param {string} params.checkType 检查类型
 * @param {Array} params.timeRange 时间范围
 * @returns {Promise}
 */
export const getComplianceChecks = (params = {}) => {
  return request({
    url: '/audit/compliance-checks',
    method: 'GET',
    params
  })
}

/**
 * 执行合规检查
 * @param {Object} data 检查配置
 * @param {string} data.checkType 检查类型
 * @param {Array} data.modules 检查模块
 * @returns {Promise}
 */
export const executeComplianceCheck = (data) => {
  return request({
    url: '/audit/compliance-checks',
    method: 'POST',
    data
  })
}

/**
 * 获取风险评估结果
 * @param {Object} params 查询参数
 * @param {string} params.assessmentType 评估类型
 * @param {Array} params.timeRange 时间范围
 * @returns {Promise}
 */
export const getRiskAssessments = (params = {}) => {
  return request({
    url: '/audit/risk-assessments',
    method: 'GET',
    params
  })
}

/**
 * 创建风险评估
 * @param {Object} data 评估配置
 * @param {string} data.title 评估标题
 * @param {string} data.assessmentType 评估类型
 * @param {Array} data.scope 评估范围
 * @returns {Promise}
 */
export const createRiskAssessment = (data) => {
  return request({
    url: '/audit/risk-assessments',
    method: 'POST',
    data
  })
}

// 统一导出审计API
export const auditApi = {
  // 操作日志
  getOperationLogs,
  
  // 系统监控
  getSystemMonitoring,
  
  // 审计报告
  getAuditReports,
  generateAuditReport,
  downloadAuditReport,
  
  // 安全事件
  getSecurityEvents,
  handleSecurityEvent,
  
  // 合规检查
  getComplianceChecks,
  executeComplianceCheck,
  
  // 风险评估
  getRiskAssessments,
  createRiskAssessment
}
