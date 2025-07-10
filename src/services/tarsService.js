/**
 * TARS聊天机器人服务
 * 管理与TARS AI助手的交互
 */

class TarsService {
  constructor() {
    this.convid = 'WbpUav' // 您的TARS conversation ID
    this.baseUrl = 'https://chatbot.hellotars.com'
    this.apiUrl = 'https://asimov.hellotars.com/api/run-agent'
    this.isInitialized = false
    this.listeners = new Set()
  }

  /**
   * 初始化TARS服务
   */
  init() {
    if (this.isInitialized) return

    // 监听来自TARS iframe的消息
    window.addEventListener('message', this.handleMessage.bind(this))
    this.isInitialized = true
    
    console.log('TARS服务已初始化')
  }

  /**
   * 获取聊天机器人URL
   */
  getChatbotUrl() {
    return `${this.baseUrl}/conv/${this.convid}/`
  }

  /**
   * 获取嵌入式iframe代码
   */
  getEmbedCode(options = {}) {
    const {
      width = '400px',
      height = '620px',
      borderRadius = '5px'
    } = options

    return `<iframe 
      src="${this.getChatbotUrl()}" 
      style="width: ${width}; height: ${height}; box-shadow: 0 20px 80px rgba(0,0,0,.6); border-radius: ${borderRadius}; overflow: hidden; border: none;"
      frameborder="0">
    </iframe>`
  }

  /**
   * 直接调用TARS API
   */
  async sendMessage(query, options = {}) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          convid: this.convid,
          ...options
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('TARS API调用失败:', error)
      throw error
    }
  }

  /**
   * 处理来自iframe的消息
   */
  handleMessage(event) {
    // 验证消息来源
    if (!event.origin.includes('hellotars.com')) {
      return
    }

    try {
      const messageData = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
      
      // 通知所有监听器
      this.listeners.forEach(listener => {
        try {
          listener(messageData)
        } catch (error) {
          console.error('消息监听器错误:', error)
        }
      })
    } catch (error) {
      console.warn('处理TARS消息失败:', error)
    }
  }

  /**
   * 添加消息监听器
   */
  addMessageListener(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  /**
   * 向iframe发送消息
   */
  sendToIframe(iframe, message) {
    if (!iframe || !iframe.contentWindow) {
      console.warn('iframe不可用')
      return false
    }

    try {
      iframe.contentWindow.postMessage(message, this.baseUrl)
      return true
    } catch (error) {
      console.error('发送消息到iframe失败:', error)
      return false
    }
  }

  /**
   * 获取预设的快速回复
   */
  getQuickReplies() {
    return [
      {
        id: 'intro',
        label: '系统介绍',
        message: '请介绍一下天府健康云平台的主要功能和特色'
      },
      {
        id: 'help',
        label: '使用帮助',
        message: '我是新用户，需要了解如何使用这个平台'
      },
      {
        id: 'data_query',
        label: '数据查询',
        message: '如何查询和分析健康数据？'
      },
      {
        id: 'statistics',
        label: '统计功能',
        message: '统计分析功能怎么使用？'
      },
      {
        id: 'visualization',
        label: '数据可视化',
        message: '如何创建和自定义图表？'
      },
      {
        id: 'map_3d',
        label: '3D地图',
        message: '3D地图功能如何使用？'
      },
      {
        id: 'export',
        label: '数据导出',
        message: '如何导出数据和报告？'
      },
      {
        id: 'account',
        label: '账户管理',
        message: '如何管理我的账户和个人信息？'
      },
      {
        id: 'contact',
        label: '联系客服',
        message: '我需要人工客服帮助'
      }
    ]
  }

  /**
   * 获取常见问题
   */
  getFAQ() {
    return [
      {
        question: '如何重置密码？',
        answer: '您可以在登录页面点击"忘记密码"，然后按照提示操作。'
      },
      {
        question: '数据多久更新一次？',
        answer: '系统数据每日凌晨2点自动更新，部分实时数据每小时更新。'
      },
      {
        question: '支持哪些数据格式导出？',
        answer: '支持Excel、PDF、CSV等多种格式导出。'
      },
      {
        question: '如何申请更高权限？',
        answer: '请联系系统管理员或发送邮件到support@healthdata.com申请。'
      }
    ]
  }

  /**
   * 检查服务状态
   */
  async checkStatus() {
    try {
      const response = await fetch(this.getChatbotUrl(), {
        method: 'HEAD',
        mode: 'no-cors'
      })
      return true
    } catch (error) {
      console.error('TARS服务状态检查失败:', error)
      return false
    }
  }

  /**
   * 销毁服务
   */
  destroy() {
    if (this.isInitialized) {
      window.removeEventListener('message', this.handleMessage.bind(this))
      this.listeners.clear()
      this.isInitialized = false
    }
  }
}

// 创建单例实例
const tarsService = new TarsService()

export default tarsService

// 导出类以便测试
export { TarsService }

/**
 * 使用示例：
 * 
 * import tarsService from '@/services/tarsService'
 * 
 * // 初始化服务
 * tarsService.init()
 * 
 * // 获取聊天机器人URL
 * const chatUrl = tarsService.getChatbotUrl()
 * 
 * // 发送消息到API
 * const response = await tarsService.sendMessage('你好')
 * 
 * // 添加消息监听器
 * const removeListener = tarsService.addMessageListener((message) => {
 *   console.log('收到消息:', message)
 * })
 * 
 * // 获取快速回复
 * const quickReplies = tarsService.getQuickReplies()
 */
