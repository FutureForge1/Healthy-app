// 聊天机器人API - 连接真实数据库
import { getPopulationOverview } from './population'
import { getBedTotalCount, getBedUtilizationAnalysis } from './bed'
import { getHospitalLevelStats } from './hospital'

// 智能查询处理器
export class ChatbotService {
  
  // 分析用户问题并调用相应的API
  static async processUserQuery(userInput) {
    const query = userInput.toLowerCase()
    
    try {
      // 人口统计相关查询
      if (this.isPopulationQuery(query)) {
        return await this.handlePopulationQuery(query)
      }
      
      // 医院相关查询
      if (this.isHospitalQuery(query)) {
        return await this.handleHospitalQuery(query)
      }
      
      // 床位相关查询
      if (this.isBedQuery(query)) {
        return await this.handleBedQuery(query)
      }
      
      // 数据导出相关查询
      if (this.isExportQuery(query)) {
        return await this.handleExportQuery(query)
      }
      
      // 默认回复
      return this.getDefaultResponse()
      
    } catch (error) {
      console.error('处理用户查询时出错:', error)
      return {
        type: 'error',
        content: '抱歉，查询数据时出现错误，请稍后重试。'
      }
    }
  }
  
  // 判断是否为人口统计查询
  static isPopulationQuery(query) {
    const keywords = ['人口', '统计', '人数', '城镇', '乡村', '男性', '女性', '出生率', '城镇化']
    return keywords.some(keyword => query.includes(keyword))
  }
  
  // 处理人口统计查询
  static async handlePopulationQuery() {
    try {
      // 使用现有的人口统计API
      const data = await getPopulationOverview()

      if (!data || !data.totalPopulation) {
        return {
          type: 'info',
          content: '暂无人口统计数据。'
        }
      }

      return {
        type: 'data',
        content: `📊 成都市人口统计数据（${data.year || '最新'}年）：

• 总人口：${(data.totalPopulation / 10000).toFixed(1)}万人
• 城镇人口：${(data.urbanPopulation / 10000).toFixed(1)}万人
• 乡村人口：${(data.countyPopulation / 10000).toFixed(1)}万人
• 男性人口：${(data.malePopulation / 10000).toFixed(1)}万人
• 女性人口：${(data.femalePopulation / 10000).toFixed(1)}万人
• 常住人口：${(data.residentPopulation / 10000).toFixed(1)}万人
• 城镇化率：${data.urbanizationRate || 0}%

您可以在"人口统计"页面查看详细的趋势分析。`,
        data: data
      }
    } catch (error) {
      console.error('获取人口数据失败:', error)
      return {
        type: 'error',
        content: '获取人口统计数据失败，请检查网络连接。'
      }
    }
  }
  
  // 判断是否为医院查询
  static isHospitalQuery(query) {
    const keywords = ['医院', '医疗', '机构', '三甲', '专科', '社区', '卫生']
    return keywords.some(keyword => query.includes(keyword))
  }
  
  // 处理医院查询
  static async handleHospitalQuery() {
    try {
      // 使用现有的医院等级统计API
      const currentYear = new Date().getFullYear()
      const params = {
        filters: { year: { eq: currentYear } },
        sort: [{ field: 'year', order: 'desc' }],
        pageInfo: { index: 0, size: 10 }
      }

      const response = await getHospitalLevelStats(params)
      const data = response.data?.rows || []

      // 统计不同等级的医院数量
      const level3Count = data.filter(item => item.hospitalLevel?.includes('三级')).length
      const level2Count = data.filter(item => item.hospitalLevel?.includes('二级')).length
      const level1Count = data.filter(item => item.hospitalLevel?.includes('一级')).length
      const totalCount = data.length

      return {
        type: 'data',
        content: `🏥 成都市医疗机构信息（${currentYear}年）：

• 医疗机构总数：${totalCount}家
• 三级医院：${level3Count}家
• 二级医院：${level2Count}家
• 一级医院：${level1Count}家
• 其他医疗机构：${totalCount - level3Count - level2Count - level1Count}家

您可以在"医疗机构统计"页面查看详细信息和分布图。`,
        data: { totalCount, level3Count, level2Count, level1Count }
      }
    } catch (error) {
      console.error('获取医院数据失败:', error)
      return {
        type: 'error',
        content: '获取医疗机构数据失败，请检查网络连接。'
      }
    }
  }
  
  // 判断是否为床位查询
  static isBedQuery(query) {
    const keywords = ['床位', '病床', '使用率', '空床', '占用']
    return keywords.some(keyword => query.includes(keyword))
  }
  
  // 处理床位查询
  static async handleBedQuery() {
    try {
      // 使用现有的床位统计API
      const currentYear = new Date().getFullYear()
      const params = {
        filters: { year: { eq: currentYear } },
        sort: [{ field: 'year', order: 'desc' }],
        pageInfo: { index: 0, size: 10 }
      }

      // 获取床位总数统计
      const totalResponse = await getBedTotalCount(params)
      const utilizationResponse = await getBedUtilizationAnalysis({ year: currentYear })

      const totalData = totalResponse.data?.rows?.[0] || {}
      const utilizationData = utilizationResponse.data || {}

      const totalBeds = totalData.totalBeds || 0
      const utilizationRate = utilizationData.averageUtilization || 0
      const occupiedBeds = Math.round(totalBeds * utilizationRate / 100)
      const availableBeds = totalBeds - occupiedBeds

      return {
        type: 'data',
        content: `🛏️ 成都市床位使用情况（${currentYear}年）：

• 总床位数：${(totalBeds / 10000).toFixed(2)}万张
• 已使用床位：${(occupiedBeds / 10000).toFixed(2)}万张
• 可用床位：${(availableBeds / 10000).toFixed(2)}万张
• 床位使用率：${utilizationRate.toFixed(1)}%

${utilizationRate > 90 ? '⚠️ 床位使用率较高，建议关注' : '✅ 床位使用情况正常'}

您可以在"床位统计"页面查看实时数据和趋势分析。`,
        data: { totalBeds, occupiedBeds, availableBeds, utilizationRate }
      }
    } catch (error) {
      console.error('获取床位数据失败:', error)
      return {
        type: 'error',
        content: '获取床位统计数据失败，请检查网络连接。'
      }
    }
  }
  
  // 判断是否为导出查询
  static isExportQuery(query) {
    const keywords = ['导出', '下载', '数据', '报表', 'excel', 'csv']
    return keywords.some(keyword => query.includes(keyword))
  }
  
  // 处理导出查询
  static async handleExportQuery() {
    return {
      type: 'guide',
      content: `📥 数据导出操作指南：

**步骤1：选择数据类型**
• 人口统计数据
• 医疗机构数据
• 床位统计数据
• 医护人员数据

**步骤2：设置筛选条件**
• 选择年份范围
• 选择地区范围
• 设置其他筛选条件

**步骤3：选择导出格式**
• Excel格式（.xlsx）
• CSV格式（.csv）

**步骤4：执行导出**
• 点击"导出数据"按钮
• 系统会跳转到"导入导出"页面
• 等待文件生成完成
• 点击下载链接获取文件

需要我帮您导航到特定的统计页面吗？`
    }
  }
  
  // 默认回复
  static getDefaultResponse() {
    return {
      type: 'default',
      content: `🤖 您好！我是天府健康数据助手，我可以帮您：

**📊 数据查询**
• 查询成都市人口统计数据
• 了解医疗机构分布情况
• 查看床位使用状况
• 获取医护人员信息

**📥 操作指导**
• 数据导出操作指南
• 系统功能使用帮助
• 页面导航指引

**💡 使用提示**
您可以直接问我：
• "成都市人口有多少？"
• "医院床位使用率如何？"
• "怎么导出数据？"

请告诉我您需要什么帮助？`
    }
  }
}

export default ChatbotService
