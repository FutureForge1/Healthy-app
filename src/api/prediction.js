import request from './request'

/**
 * 预测API服务
 */
export const predictionApi = {
  /**
   * ARIMA预测
   * @param {Object} data 预测请求数据
   * @returns {Promise}
   */
  arima(data) {
    return request({
      url: '/predict/arima',
      method: 'post',
      data
    })
  },

  /**
   * SARIMA预测
   * @param {Object} data 预测请求数据
   * @returns {Promise}
   */
  sarima(data) {
    return request({
      url: '/predict/sarima',
      method: 'post',
      data
    })
  },

  /**
   * NeuralProphet预测
   * @param {Object} data 预测请求数据
   * @returns {Promise}
   */
  neuralProphet(data) {
    return request({
      url: '/predict/neuroprophet',
      method: 'post',
      data
    })
  },

  /**
   * TBATS预测
   * @param {Object} data 预测请求数据
   * @returns {Promise}
   */
  tbats(data) {
    return request({
      url: '/predict/tbats',
      method: 'post',
      data
    })
  },

  /**
   * 通用预测方法
   * @param {string} model 模型类型 (arima|sarima|neuroprophet|tbats)
   * @param {Object} data 预测请求数据
   * @returns {Promise}
   */
  predict(model, data) {
    const modelMethods = {
      arima: this.arima,
      sarima: this.sarima,
      neuroprophet: this.neuralProphet,
      tbats: this.tbats
    }

    const method = modelMethods[model]
    if (!method) {
      return Promise.reject(new Error(`不支持的预测模型: ${model}`))
    }

    return method.call(this, data)
  },

  /**
   * 获取支持的预测字段列表
   * @returns {Promise}
   */
  getSupportedFields() {
    return request({
      url: '/api/predict/fields',
      method: 'get'
    })
  },

  /**
   * 保存预测结果
   * @param {Object} data 预测结果数据
   * @returns {Promise}
   */
  savePrediction(data) {
    return request({
      url: '/predict/save',
      method: 'post',
      data
    })
  },

  /**
   * 获取历史预测记录
   * @param {Object} params 查询参数
   * @returns {Promise}
   */
  getPredictionHistory(params = {}) {
    return request({
      url: '/predict/history',
      method: 'get',
      params
    })
  },

  /**
   * 删除预测记录
   * @param {number} id 预测记录ID
   * @returns {Promise}
   */
  deletePrediction(id) {
    return request({
      url: `/predict/${id}`,
      method: 'delete'
    })
  },

  /**
   * 获取预测详情
   * @param {number} id 预测记录ID
   * @returns {Promise}
   */
  getPredictionDetail(id) {
    return request({
      url: `/predict/${id}`,
      method: 'get'
    })
  },

  /**
   * 导出预测结果
   * @param {number} id 预测记录ID
   * @param {string} format 导出格式 (excel|csv|pdf)
   * @returns {Promise}
   */
  exportPrediction(id, format = 'excel') {
    return request({
      url: `/api/predict/${id}/export`,
      method: 'get',
      params: { format },
      responseType: 'blob'
    })
  }
}

/**
 * 预测请求数据构建器
 */
export class PredictionRequestBuilder {
  constructor() {
    this.data = {
      predictDO: {
        toPredict: '', // 后端期望的字段名是 toPredict
        filters: {}
      },
      parameter: {
        steps: 12
      }
    }
  }

  /**
   * 设置预测字段
   * @param {string} field 字段名
   * @returns {PredictionRequestBuilder}
   */
  setField(field) {
    this.data.predictDO.toPredict = field
    return this
  }

  /**
   * 设置时间范围
   * @param {number} startYear 开始年份
   * @param {number} endYear 结束年份
   * @returns {PredictionRequestBuilder}
   */
  setTimeRange(startYear, endYear) {
    // 设置年份过滤条件
    if (startYear) {
      this.data.predictDO.filters.year = { gte: startYear }
    }
    return this
  }

  /**
   * 设置预测步数
   * @param {number} steps 预测步数
   * @returns {PredictionRequestBuilder}
   */
  setSteps(steps) {
    this.data.parameter.steps = steps
    return this
  }

  /**
   * 设置过滤条件
   * @param {Object} filters 过滤条件
   * @returns {PredictionRequestBuilder}
   */
  setFilters(filters) {
    this.data.predictDO.filters = { ...this.data.predictDO.filters, ...filters }
    return this
  }

  /**
   * 设置ARIMA参数
   * @param {number} p AR阶数
   * @param {number} d 差分阶数
   * @param {number} q MA阶数
   * @returns {PredictionRequestBuilder}
   */
  setArimaParams(p, d, q) {
    this.data.parameter = {
      ...this.data.parameter,
      p, d, q
    }
    return this
  }

  /**
   * 设置SARIMA参数
   * @param {number} p AR阶数
   * @param {number} d 差分阶数
   * @param {number} q MA阶数
   * @param {number} seasonalPeriod 季节周期
   * @returns {PredictionRequestBuilder}
   */
  setSarimaParams(p, d, q, seasonalPeriod) {
    this.data.parameter = {
      ...this.data.parameter,
      p, d, q, seasonalPeriod
    }
    return this
  }

  /**
   * 设置NeuralProphet参数
   * @param {string} growth 增长模式 (linear|logistic)
   * @param {string} seasonalityMode 季节性模式 (additive|multiplicative)
   * @returns {PredictionRequestBuilder}
   */
  setNeuralProphetParams(growth = 'linear', seasonalityMode = 'additive') {
    this.data.parameter = {
      ...this.data.parameter,
      growth, seasonalityMode
    }
    return this
  }

  /**
   * 设置TBATS参数
   * @param {boolean} useBoxCox 是否使用Box-Cox变换
   * @param {boolean} useTrend 是否使用趋势组件
   * @returns {PredictionRequestBuilder}
   */
  setTbatsParams(useBoxCox = true, useTrend = true) {
    this.data.parameter = {
      ...this.data.parameter,
      useBoxCox, useTrend
    }
    return this
  }

  /**
   * 构建请求数据
   * @returns {Object}
   */
  build() {
    return { ...this.data }
  }
}

/**
 * 预测结果处理器
 */
export class PredictionResultProcessor {
  constructor(result) {
    this.result = result
  }

  /**
   * 获取预测值数组
   * @returns {Array}
   */
  getPredictions() {
    return this.result.predictions || []
  }

  /**
   * 获取历史数据
   * @returns {Array}
   */
  getHistoricalData() {
    return this.result.historical || []
  }

  /**
   * 获取模型评估指标
   * @returns {Object}
   */
  getMetrics() {
    return this.result.metrics || {}
  }

  /**
   * 获取预测精度
   * @returns {number}
   */
  getAccuracy() {
    return this.result.metrics?.accuracy || 0
  }

  /**
   * 判断预测质量
   * @returns {string} excellent|good|fair|poor
   */
  getQualityLevel() {
    const accuracy = this.getAccuracy()
    if (accuracy >= 0.95) return 'excellent'
    if (accuracy >= 0.85) return 'good'
    if (accuracy >= 0.75) return 'fair'
    return 'poor'
  }

  /**
   * 格式化预测数据用于图表显示
   * @returns {Object}
   */
  formatForChart() {
    const historical = this.getHistoricalData()
    const predictions = this.getPredictions()

    return {
      categories: [...historical.map(h => h.period), ...predictions.map(p => p.period)],
      series: [
        {
          name: '历史数据',
          data: historical.map(h => h.value),
          type: 'line'
        },
        {
          name: '预测值',
          data: Array(historical.length).fill(null).concat(predictions.map(p => p.predicted)),
          type: 'line'
        },
        {
          name: '置信区间上限',
          data: Array(historical.length).fill(null).concat(predictions.map(p => p.upperBound)),
          type: 'line'
        },
        {
          name: '置信区间下限',
          data: Array(historical.length).fill(null).concat(predictions.map(p => p.lowerBound)),
          type: 'line'
        }
      ]
    }
  }
}

export default predictionApi
