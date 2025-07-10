// Typebot 配置文件
export const TYPEBOT_CONFIG = {
  // 您的Typebot ID
  TYPEBOT_ID: 'user-onboarding-vhaezio',
  
  // Typebot 主题配置
  THEME: {
    general: {
      font: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      background: {
        type: 'Color',
        content: '#ffffff'
      }
    },
    chat: {
      container: {
        backgroundColor: '#ffffff',
        border: 'none',
        borderRadius: '0px',
        boxShadow: 'none'
      },
      hostBubbles: {
        backgroundColor: '#f1f5f9',
        color: '#334155'
      },
      guestBubbles: {
        backgroundColor: '#6366f1',
        color: '#ffffff'
      },
      inputs: {
        backgroundColor: '#ffffff',
        color: '#1e293b',
        placeholderColor: '#94a3b8'
      },
      buttons: {
        backgroundColor: '#6366f1',
        color: '#ffffff'
      }
    }
  },
  
  // 聊天窗口配置
  CHAT_WINDOW: {
    width: 420,
    height: 650,
    position: {
      bottom: 20,
      right: 20
    }
  },
  
  // 备用聊天配置
  FALLBACK_RESPONSES: {
    population: {
      keywords: ['人口', '统计', '人数'],
      response: '📊 成都市人口统计数据：<br/>• 总人口：2100万人<br/>• 城镇人口：1680万人<br/>• 乡村人口：420万人<br/>您可以在"人口统计"页面查看详细数据和趋势分析。'
    },
    hospital: {
      keywords: ['医院', '医疗', '机构'],
      response: '🏥 成都市医疗机构信息：<br/>• 三甲医院：168家<br/>• 社区卫生服务中心：245家<br/>• 专科医院：89家<br/>您可以在"医疗机构"页面查看详细信息。'
    },
    beds: {
      keywords: ['床位', '病床'],
      response: '🛏️ 床位使用情况：<br/>• 总床位数：12.5万张<br/>• 使用率：85.2%<br/>• 可用床位：1.85万张<br/>您可以在"床位统计"页面查看实时数据。'
    },
    export: {
      keywords: ['导出', '下载', '数据'],
      response: '📥 数据导出帮助：<br/>1. 选择要导出的数据类型<br/>2. 设置筛选条件<br/>3. 选择导出格式（Excel/CSV）<br/>4. 点击"导出数据"按钮<br/>5. 在"导入导出"页面下载文件'
    },
    guide: {
      keywords: ['使用', '帮助', '指南'],
      response: '📖 系统使用指南：<br/>• 登录后可访问所有功能模块<br/>• 左侧菜单包含各类统计分析<br/>• 支持数据筛选和导出<br/>• 如需技术支持，请联系管理员'
    },
    default: {
      keywords: [],
      response: '🤖 感谢您的咨询！我可以帮您：<br/>• 查询人口、医院、床位等统计数据<br/>• 指导数据导出操作<br/>• 解答系统使用问题<br/>请告诉我您需要什么帮助？'
    }
  },
  
  // 快捷操作配置
  QUICK_ACTIONS: [
    { id: 1, text: '查询人口统计', action: 'population' },
    { id: 2, text: '医院信息', action: 'hospitals' },
    { id: 3, text: '床位使用情况', action: 'beds' },
    { id: 4, text: '数据导出帮助', action: 'export' },
    { id: 5, text: '系统使用指南', action: 'guide' }
  ]
}

// 获取机器人回复的函数
export const getBotResponse = (input) => {
  const lowerInput = input.toLowerCase()
  
  // 遍历所有响应类型，找到匹配的关键词
  for (const [key, config] of Object.entries(TYPEBOT_CONFIG.FALLBACK_RESPONSES)) {
    if (key === 'default') continue
    
    const hasKeyword = config.keywords.some(keyword => 
      lowerInput.includes(keyword)
    )
    
    if (hasKeyword) {
      return config.response
    }
  }
  
  // 如果没有匹配的关键词，返回默认回复
  return TYPEBOT_CONFIG.FALLBACK_RESPONSES.default.response
}

// 格式化时间的工具函数
export const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
