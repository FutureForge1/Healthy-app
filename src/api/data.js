import request from './request'

/**
 * 数据导入导出模块
 */

/**
 * 数据导入
 * @param {FormData} formData 包含文件和参数的FormData对象
 * @param {File} formData.file 要导入的文件
 * @param {string} formData.dataType 数据类型: population, institution, personnel, bed, service, cost
 * @param {string} formData.importMode 导入模式: insert, update, replace
 * @returns {Promise}
 */
export const importData = (formData) => {
  return request({
    url: '/data/import',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 数据导出
 * @param {Object} params 导出参数
 * @param {string} params.dataType 数据类型
 * @param {string} params.exportFormat 导出格式: csv, excel, json
 * @param {Object} params.filters 过滤条件
 * @param {Array} params.fields 导出字段
 * @returns {Promise}
 */
export const exportData = (params) => {
  return request({
    url: '/data/export',
    method: 'POST',
    data: params,
    timeout: 60000 // 导出可能需要较长时间
  })
}

/**
 * 文件下载
 * @param {string} exportId 导出任务ID
 * @returns {Promise}
 */
export const downloadFile = (exportId) => {
  return request({
    url: `/data/download/${exportId}`,
    method: 'GET',
    responseType: 'blob', // 重要：设置响应类型为blob用于文件下载
    timeout: 60000
  })
}

/**
 * 获取导出任务状态
 * @param {string} exportId 导出任务ID
 * @returns {Promise}
 */
export const getExportStatus = (exportId) => {
  return request({
    url: `/data/export/status/${exportId}`,
    method: 'GET'
  })
}

/**
 * 取消导出任务
 * @param {string} exportId 导出任务ID
 * @returns {Promise}
 */
export const cancelExport = (exportId) => {
  return request({
    url: `/data/export/cancel/${exportId}`,
    method: 'POST'
  })
}

/**
 * 获取支持的数据类型
 * @returns {Promise}
 */
export const getSupportedDataTypes = () => {
  return request({
    url: '/data/types',
    method: 'GET'
  })
}

/**
 * 获取数据字段信息
 * @param {string} dataType 数据类型
 * @returns {Promise}
 */
export const getDataFields = (dataType) => {
  return request({
    url: `/data/fields/${dataType}`,
    method: 'GET'
  })
}

/**
 * 验证导入文件
 * @param {FormData} formData 包含文件的FormData对象
 * @returns {Promise}
 */
export const validateImportFile = (formData) => {
  return request({
    url: '/data/import/validate',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 获取导入模板
 * @param {string} dataType 数据类型
 * @param {string} format 文件格式
 * @returns {Promise}
 */
export const downloadTemplate = (dataType, format) => {
  return request({
    url: `/data/template/${dataType}`,
    method: 'GET',
    params: { format },
    responseType: 'blob'
  })
}

/**
 * 获取导入预览数据
 * @param {FormData} formData 包含文件的FormData对象
 * @returns {Promise}
 */
export const getImportPreview = (formData) => {
  return request({
    url: '/data/import/preview',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 重新执行导入
 * @param {string} logId 日志ID
 * @returns {Promise}
 */
export const retryImport = (logId) => {
  return request({
    url: `/data/import/retry/${logId}`,
    method: 'POST'
  })
}

/**
 * 批量删除日志
 * @param {Array} logIds 日志ID列表
 * @returns {Promise}
 */
export const deleteImportExportLogs = (logIds) => {
  return request({
    url: '/data/import-export-logs/batch-delete',
    method: 'DELETE',
    data: { logIds }
  })
}

/**
 * 获取导入导出记录
 * @param {Object} params 查询参数
 * @param {number} params.page 页码
 * @param {number} params.size 每页大小
 * @param {string} params.operation 操作类型: import, export
 * @param {string} params.status 状态: success, failed, processing
 * @returns {Promise}
 */
export const getImportExportLogs = (params = {}) => {
  return request({
    url: '/data/import-export-logs',
    method: 'GET',
    params
  })
}

/**
 * 数据清洗与预处理模块
 */

/**
 * 数据质量检查
 * @param {Object} params 检查参数
 * @param {string} params.dataType 数据类型
 * @param {Array} params.checkRules 检查规则
 * @param {Object} params.dateRange 日期范围
 * @returns {Promise}
 */
export const checkDataQuality = (params) => {
  return request({
    url: '/data/quality-check',
    method: 'POST',
    data: params
  })
}

/**
 * 执行数据清洗
 * @param {Object} params 清洗参数
 * @param {string} params.dataType 数据类型
 * @param {Array} params.cleanRules 清洗规则
 * @returns {Promise}
 */
export const cleanData = (params) => {
  return request({
    url: '/data/clean',
    method: 'POST',
    data: params
  })
}

/**
 * 数据标签管理模块
 */

/**
 * 获取数据标签列表
 * @returns {Promise}
 */
export const getDataTags = () => {
  return request({
    url: '/data/tags',
    method: 'GET'
  })
}

/**
 * 创建数据标签
 * @param {Object} tagData 标签数据
 * @param {string} tagData.tagName 标签名称
 * @param {string} tagData.tagCode 标签代码
 * @param {string} tagData.tagType 标签类型
 * @param {string} tagData.color 标签颜色
 * @param {string} tagData.description 标签描述
 * @returns {Promise}
 */
export const createDataTag = (tagData) => {
  return request({
    url: '/data/tags',
    method: 'POST',
    data: tagData
  })
}

/**
 * 为数据添加标签
 * @param {Object} params 标签分配参数
 * @param {string} params.dataType 数据类型
 * @param {Array} params.dataIds 数据ID列表
 * @param {Array} params.tagIds 标签ID列表
 * @returns {Promise}
 */
export const assignDataTags = (params) => {
  return request({
    url: '/data/tags/assign',
    method: 'POST',
    data: params
  })
}

/**
 * 更新数据标签
 * @param {number} tagId 标签ID
 * @param {Object} tagData 更新的标签数据
 * @returns {Promise}
 */
export const updateDataTag = (tagId, tagData) => {
  return request({
    url: `/data/tags/${tagId}`,
    method: 'PUT',
    data: tagData
  })
}

/**
 * 删除数据标签
 * @param {number} tagId 标签ID
 * @returns {Promise}
 */
export const deleteDataTag = (tagId) => {
  return request({
    url: `/data/tags/${tagId}`,
    method: 'DELETE'
  })
}

/**
 * 移除数据标签关联
 * @param {Object} params 移除参数
 * @param {string} params.dataType 数据类型
 * @param {Array} params.dataIds 数据ID列表
 * @param {Array} params.tagIds 标签ID列表
 * @returns {Promise}
 */
export const removeDataTags = (params) => {
  return request({
    url: '/data/tags/remove',
    method: 'POST',
    data: params
  })
}

/**
 * 获取数据的标签
 * @param {string} dataType 数据类型
 * @param {number} dataId 数据ID
 * @returns {Promise}
 */
export const getDataTagsByDataId = (dataType, dataId) => {
  return request({
    url: '/data/tags/by-data',
    method: 'GET',
    params: { dataType, dataId }
  })
}

/**
 * 根据标签获取数据
 * @param {Object} params 查询参数
 * @param {Array} params.tagIds 标签ID列表
 * @param {string} params.dataType 数据类型
 * @param {number} params.page 页码
 * @param {number} params.size 每页大小
 * @returns {Promise}
 */
export const getDataByTags = (params) => {
  return request({
    url: '/data/by-tags',
    method: 'GET',
    params
  })
}

// 数据导出相关常量
export const EXPORT_FORMATS = {
  EXCEL: 'excel',
  CSV: 'csv',
  JSON: 'json',
  PDF: 'pdf'
}

export const DATA_TYPES = {
  POPULATION: 'population',
  HOSPITAL: 'hospital',
  PERSONNEL: 'personnel',
  BED: 'bed',
  SERVICE: 'service',
  COST: 'cost'
}

export const IMPORT_MODES = {
  APPEND: 'append',
  REPLACE: 'replace',
  UPDATE: 'update'
}

export const OPERATION_STATUS = {
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
}

// 文件下载辅助函数
export const downloadFileFromBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// 格式化文件大小
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 验证文件类型
export const validateFileType = (file, allowedTypes) => {
  const fileExtension = file.name.split('.').pop().toLowerCase()
  return allowedTypes.includes(fileExtension)
}

// 验证文件大小
export const validateFileSize = (file, maxSizeMB) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

// 统一导出数据管理API
export const dataApi = {
  // 数据导入导出
  importData,
  exportData,
  downloadFile,
  getImportExportLogs,
  getExportStatus,
  cancelExport,
  getSupportedDataTypes,
  getDataFields,
  validateImportFile,
  downloadTemplate,
  getImportPreview,
  retryImport,
  deleteImportExportLogs,

  // 数据清洗
  checkDataQuality,
  cleanData,

  // 数据标签管理
  getDataTags,
  createDataTag,
  updateDataTag,
  deleteDataTag,
  assignDataTags,
  removeDataTags,
  getDataTagsByDataId,
  getDataByTags,

  // 辅助函数
  downloadFileFromBlob,
  formatFileSize,
  validateFileType,
  validateFileSize
}
