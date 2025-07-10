# 🤖 Typebot 设置和数据库集成指南

## 概述

本指南将帮您设置真正的Typebot.io聊天机器人，并将其与您的健康数据库集成，实现智能数据查询功能。

## 🎯 两种实现方案

### 方案一：当前智能API方案（推荐）
✅ **已实现** - 直接连接您的数据库API，提供实时数据查询

### 方案二：Typebot.io平台方案
需要配置Typebot.io平台，通过Webhook连接您的API

## 🚀 方案一：智能API方案（当前实现）

### 功能特性
- ✅ 直接查询真实数据库
- ✅ 实时人口统计数据
- ✅ 医院信息查询
- ✅ 床位使用情况
- ✅ 智能关键词识别
- ✅ 操作指导

### 支持的查询类型

#### 📊 人口统计查询
```
用户问题示例：
• "成都市人口有多少？"
• "城镇人口统计"
• "男女比例如何？"
• "人口增长趋势"

API调用：GET /api/population/statistics
返回：实时人口数据，包括总人口、城乡分布、性别比例等
```

#### 🏥 医疗机构查询
```
用户问题示例：
• "成都有多少家医院？"
• "三甲医院数量"
• "社区卫生服务中心"
• "专科医院分布"

API调用：GET /api/hospital/statistics
返回：医院分级统计、机构类型分布等
```

#### 🛏️ 床位统计查询
```
用户问题示例：
• "床位使用率如何？"
• "还有多少空床？"
• "床位紧张吗？"
• "床位总数"

API调用：GET /api/bed/statistics
返回：床位总数、使用率、可用床位等
```

### 如何扩展查询功能

#### 1. 添加新的查询类型
在 `src/api/chatbot.js` 中添加：

```javascript
// 添加医护人员查询
static isPersonnelQuery(query) {
  const keywords = ['医生', '护士', '医护人员', '医务人员']
  return keywords.some(keyword => query.includes(keyword))
}

static async handlePersonnelQuery(query) {
  try {
    const response = await chatbotAPI.get('/personnel/statistics')
    const data = response.data.data
    
    return {
      type: 'data',
      content: `👨‍⚕️ 成都市医护人员统计：
      
• 执业医师：${data.doctors}人
• 注册护士：${data.nurses}人
• 医技人员：${data.technicians}人
• 管理人员：${data.administrators}人

您可以在"医护人员统计"页面查看详细分布。`,
      data: data
    }
  } catch (error) {
    return {
      type: 'error',
      content: '获取医护人员数据失败，请检查网络连接。'
    }
  }
}
```

#### 2. 在主处理函数中添加调用
```javascript
static async processUserQuery(userInput) {
  const query = userInput.toLowerCase()
  
  try {
    // 添加医护人员查询处理
    if (this.isPersonnelQuery(query)) {
      return await this.handlePersonnelQuery(query)
    }
    
    // ... 其他查询类型
  } catch (error) {
    // 错误处理
  }
}
```

## 🔧 方案二：Typebot.io平台配置

### 步骤1：创建Typebot账号
1. 访问 [Typebot.io](https://app.typebot.io)
2. 注册账号并登录
3. 创建新的机器人项目

### 步骤2：设计对话流程
```
开始 → 欢迎消息 → 主菜单
                    ├── 人口统计 → Webhook调用 → 显示结果
                    ├── 医院信息 → Webhook调用 → 显示结果
                    ├── 床位查询 → Webhook调用 → 显示结果
                    └── 帮助指南 → 静态回复
```

### 步骤3：配置Webhook
在Typebot中添加Webhook块：

```
URL: https://your-domain.com/api/chatbot/webhook
Method: POST
Headers: 
  Content-Type: application/json
  Authorization: Bearer YOUR_API_TOKEN

Body:
{
  "query": "{{用户输入}}",
  "sessionId": "{{会话ID}}",
  "userId": "{{用户ID}}"
}
```

### 步骤4：创建Webhook处理器
在您的后端添加Webhook处理器：

```javascript
// 后端 Webhook 处理器
app.post('/api/chatbot/webhook', async (req, res) => {
  try {
    const { query, sessionId, userId } = req.body
    
    // 使用ChatbotService处理查询
    const response = await ChatbotService.processUserQuery(query)
    
    res.json({
      messages: [
        {
          type: 'text',
          content: response.content
        }
      ]
    })
  } catch (error) {
    res.status(500).json({
      messages: [
        {
          type: 'text',
          content: '抱歉，处理您的请求时出现错误。'
        }
      ]
    })
  }
})
```

### 步骤5：获取Typebot ID
1. 在Typebot平台发布您的机器人
2. 获取机器人ID
3. 在 `src/config/typebot.js` 中更新：

```javascript
export const TYPEBOT_CONFIG = {
  TYPEBOT_ID: 'your-actual-typebot-id-here',
  // ... 其他配置
}
```

## 🎨 高级功能配置

### 1. 条件分支
根据用户角色显示不同内容：
```
用户输入 → 检查用户角色
            ├── 管理员 → 显示详细数据 + 管理功能
            ├── 分析师 → 显示分析数据
            └── 访客 → 显示基础信息
```

### 2. 数据可视化
在聊天中嵌入图表：
```javascript
return {
  type: 'chart',
  content: '📊 人口趋势图表：',
  chartData: {
    type: 'line',
    data: populationTrendData
  }
}
```

### 3. 快捷操作
添加操作按钮：
```javascript
return {
  type: 'action',
  content: '选择您要查看的数据：',
  actions: [
    { text: '导出Excel', action: 'export_excel' },
    { text: '查看详情', action: 'view_details' },
    { text: '设置提醒', action: 'set_reminder' }
  ]
}
```

## 📊 数据库集成最佳实践

### 1. API性能优化
```javascript
// 使用缓存减少数据库查询
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟
const cache = new Map()

static async getCachedData(key, fetchFunction) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  
  const data = await fetchFunction()
  cache.set(key, { data, timestamp: Date.now() })
  return data
}
```

### 2. 错误处理
```javascript
static async handleDatabaseError(error) {
  if (error.code === 'ECONNREFUSED') {
    return '数据库连接失败，请联系管理员。'
  } else if (error.response?.status === 401) {
    return '身份验证失败，请重新登录。'
  } else {
    return '查询数据时出现错误，请稍后重试。'
  }
}
```

### 3. 权限控制
```javascript
static async checkUserPermission(userId, dataType) {
  const user = await getUserInfo(userId)
  const permissions = {
    'population': ['ADMIN', 'ANALYST', 'VISITOR'],
    'hospital': ['ADMIN', 'ANALYST', 'VISITOR'],
    'sensitive_data': ['ADMIN']
  }
  
  return permissions[dataType]?.includes(user.role)
}
```

## 🔍 测试和调试

### 1. 测试查询
访问 `/app/typebot-test` 页面测试各种查询：
- 人口统计查询
- 医院信息查询
- 床位使用查询
- 导出操作指导

### 2. 调试信息
在浏览器控制台查看：
- API调用日志
- 错误信息
- 响应时间
- 缓存状态

### 3. 性能监控
```javascript
// 添加性能监控
static async processUserQuery(userInput) {
  const startTime = Date.now()
  
  try {
    const result = await this.handleQuery(userInput)
    const duration = Date.now() - startTime
    
    console.log(`查询处理时间: ${duration}ms`)
    return result
  } catch (error) {
    console.error('查询失败:', error)
    throw error
  }
}
```

## 🚀 部署建议

### 1. 生产环境配置
```javascript
// 生产环境使用环境变量
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com/api'
  : 'http://localhost:8080/api'
```

### 2. 监控和日志
- 设置API调用监控
- 记录用户查询日志
- 监控响应时间
- 设置错误告警

### 3. 扩展性考虑
- 支持多语言查询
- 添加语音输入
- 集成更多数据源
- 支持复杂查询组合

---

通过以上配置，您的Typebot聊天机器人将能够：
- 🔍 智能理解用户问题
- 📊 查询真实数据库数据
- 💬 提供准确的实时回复
- 🎯 支持复杂的业务查询
