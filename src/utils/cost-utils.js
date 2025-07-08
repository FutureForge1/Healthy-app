// 费用数据处理工具函数

/**
 * 将万为单位的金额转换为元
 * @param {number} wanAmount 万为单位的金额
 * @returns {number} 元为单位的金额
 */
export const convertWanToYuan = (wanAmount) => {
  return (wanAmount || 0) * 10000
}

/**
 * 格式化金额显示（保持万为单位）
 * @param {number} wanAmount 万为单位的金额
 * @returns {string} 格式化后的金额字符串
 */
export const formatAmount = (wanAmount) => {
  const amount = wanAmount || 0
  return `¥${amount.toFixed(2)}万`
}

/**
 * 计算平均费用（处理万为单位的数据）
 * @param {Array} dataList 数据列表
 * @param {string} feeField 费用字段名
 * @returns {number} 平均费用（元）
 */
export const calculateAverageFee = (dataList, feeField = 'totalFee') => {
  if (!dataList || dataList.length === 0) return 0
  
  const totalFee = dataList.reduce((sum, item) => {
    return sum + convertWanToYuan(item[feeField])
  }, 0)
  
  return totalFee / dataList.length
}

/**
 * 计算平均占比
 * @param {Array} dataList 数据列表
 * @param {string} ratioField 占比字段名
 * @returns {number} 平均占比
 */
export const calculateAverageRatio = (dataList, ratioField) => {
  if (!dataList || dataList.length === 0) return 0
  
  const totalRatio = dataList.reduce((sum, item) => {
    return sum + (item[ratioField] || 0)
  }, 0)
  
  return totalRatio / dataList.length
}

/**
 * 处理费用统计数据的单位转换
 * @param {Object} data 原始数据
 * @returns {Object} 处理后的数据
 */
export const processCostData = (data) => {
  if (!data) return data
  
  // 处理费用字段（万转元）
  const feeFields = ['totalFee', 'medicineFee', 'examFee', 'treatmentFee', 'bedFee']
  const processedData = { ...data }
  
  feeFields.forEach(field => {
    if (processedData[field] !== undefined) {
      processedData[field] = convertWanToYuan(processedData[field])
    }
  })
  
  return processedData
} 