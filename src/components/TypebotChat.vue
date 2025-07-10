<template>
  <div class="typebot-chat-container">
    <!-- 聊天气泡按钮 -->
    <div 
      v-if="!isOpen" 
      class="chat-bubble" 
      @click="openChat"
      :class="{ 'pulse': showPulse }"
    >
      <div class="chat-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        </svg>
      </div>
      <div class="chat-tooltip">
        <span>快速开始~</span>
        <div class="tooltip-arrow"></div>
      </div>
    </div>

    <!-- 聊天窗口 -->
    <div 
      v-if="isOpen" 
      class="chat-window"
      :class="{ 'minimized': isMinimized }"
    >
      <div class="chat-header">
        <div class="header-info">
          <div class="avatar">
            <span>🏥</span>
          </div>
          <div class="title-info">
            <h4>天府健康导引师</h4>
            <span class="status">在线 • 成都大数据平台</span>
          </div>
        </div>
        <div class="header-controls">
          <button @click="toggleMinimize" class="control-btn">
            <svg v-if="!isMinimized" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13H5v-2h14v2z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zM12 18.17L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z"/>
            </svg>
          </button>
          <button @click="closeChat" class="control-btn close-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>

      <div v-if="!isMinimized" class="chat-content">
        <!-- Typebot iframe 容器 -->
        <div ref="typebotContainer" class="typebot-container"></div>
        
        <!-- 备用聊天界面（当Typebot不可用时） -->
        <div v-if="showFallback" class="fallback-chat">
          <div class="messages-container" ref="messagesContainer">
            <div 
              v-for="message in messages" 
              :key="message.id"
              class="message"
              :class="{ 'user': message.type === 'user', 'bot': message.type === 'bot' }"
            >
              <div class="message-content">
                <span v-html="message.content"></span>
              </div>
              <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>
          
          <div class="input-container">
            <div class="quick-actions">
              <button 
                v-for="action in quickActions" 
                :key="action.id"
                @click="sendQuickAction(action)"
                class="quick-action-btn"
              >
                {{ action.text }}
              </button>
            </div>
            <div class="input-wrapper">
              <input 
                v-model="userInput"
                @keypress.enter="sendMessage"
                placeholder="输入您的问题..."
                class="message-input"
              />
              <button @click="sendMessage" class="send-btn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { TYPEBOT_CONFIG, getBotResponse, formatTime } from '@/config/typebot.js'
import ChatbotService from '@/api/chatbot.js'

// 定义事件
const emit = defineEmits(['close'])

// 响应式数据
const isOpen = ref(false)
const isMinimized = ref(false)
const showPulse = ref(true)
const showFallback = ref(false)
const userInput = ref('')
const messages = ref([])
const typebotContainer = ref(null)
const messagesContainer = ref(null)

// Typebot 实例
let typebotInstance = null

// 快捷操作
const quickActions = ref(TYPEBOT_CONFIG.QUICK_ACTIONS)

// 初始化消息
const initializeChat = () => {
  messages.value = [
    {
      id: 1,
      type: 'bot',
      content: '您好！我是天府健康数据助手 🏥<br/>我可以帮您：<br/>• 查询成都市健康数据统计<br/>• 了解医疗机构信息<br/>• 指导数据导出操作<br/>• 解答系统使用问题',
      timestamp: new Date()
    }
  ]
}

// 打开聊天
const openChat = async () => {
  isOpen.value = true
  showPulse.value = false

  await nextTick()

  // 现在有有效的 Typebot ID，直接尝试初始化
  console.log('正在初始化 Typebot，ID:', TYPEBOT_CONFIG.TYPEBOT_ID)

  try {
    await initializeTypebot()
    console.log('Typebot 加载成功')
  } catch (error) {
    console.warn('Typebot 初始化失败，使用备用聊天界面:', error)
    showFallback.value = true
    initializeChat()
  }
}

// 关闭聊天
const closeChat = () => {
  isOpen.value = false
  isMinimized.value = false

  // 清理 Typebot 实例
  if (typebotInstance) {
    try {
      if (typebotInstance.close) {
        typebotInstance.close()
      } else if (typebotInstance.iframe) {
        // 如果是iframe，移除它
        typebotInstance.iframe.remove()
      }
    } catch (error) {
      console.warn('清理 Typebot 实例时出错:', error)
    }
    typebotInstance = null
  }

  // 清空容器
  if (typebotContainer.value) {
    typebotContainer.value.innerHTML = ''
  }

  // 重置状态
  showFallback.value = false
  messages.value = []
  userInput.value = ''

  // 触发关闭事件
  emit('close')
}

// 切换最小化
const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value
}

// 使用iframe方式直接嵌入Typebot，无需加载外部脚本

// 初始化 Typebot
const initializeTypebot = async () => {
  if (!typebotContainer.value) return

  try {
    console.log('尝试直接使用iframe方式加载Typebot...')

    // 清空容器
    typebotContainer.value.innerHTML = ''

    // 直接使用iframe方式嵌入Typebot
    const iframe = document.createElement('iframe')
    iframe.src = `https://typebot.co/${TYPEBOT_CONFIG.TYPEBOT_ID}`
    iframe.style.width = '100%'
    iframe.style.height = '100%'
    iframe.style.border = 'none'
    iframe.style.borderRadius = '0'
    iframe.style.backgroundColor = '#ffffff'
    iframe.allow = 'microphone; camera'
    iframe.loading = 'lazy'

    // 添加加载事件监听
    iframe.onload = () => {
      console.log('Typebot iframe 加载成功')
    }

    iframe.onerror = (error) => {
      console.error('Typebot iframe 加载失败:', error)
      throw new Error('Typebot iframe 加载失败')
    }

    typebotContainer.value.appendChild(iframe)
    typebotInstance = { iframe }

    console.log('Typebot 初始化成功，ID:', TYPEBOT_CONFIG.TYPEBOT_ID)
  } catch (error) {
    console.error('Typebot 初始化失败:', error)
    throw error
  }
}

// 发送消息（智能聊天）
const sendMessage = async () => {
  if (!userInput.value.trim()) return

  const userMessage = {
    id: Date.now(),
    type: 'user',
    content: userInput.value,
    timestamp: new Date()
  }

  messages.value.push(userMessage)
  const userQuery = userInput.value
  userInput.value = ''
  scrollToBottom()

  // 显示"正在思考"消息
  const thinkingMessage = {
    id: Date.now() + 1,
    type: 'bot',
    content: '🤔 正在查询数据，请稍候...',
    timestamp: new Date(),
    isThinking: true
  }
  messages.value.push(thinkingMessage)
  scrollToBottom()

  try {
    // 使用智能API处理查询
    const response = await ChatbotService.processUserQuery(userQuery)

    // 移除"正在思考"消息
    const thinkingIndex = messages.value.findIndex(msg => msg.isThinking)
    if (thinkingIndex !== -1) {
      messages.value.splice(thinkingIndex, 1)
    }

    // 添加智能回复
    messages.value.push({
      id: Date.now() + 2,
      type: 'bot',
      content: response.content,
      timestamp: new Date(),
      responseType: response.type,
      data: response.data
    })

  } catch (error) {
    console.error('智能查询失败，使用备用回复:', error)

    // 移除"正在思考"消息
    const thinkingIndex = messages.value.findIndex(msg => msg.isThinking)
    if (thinkingIndex !== -1) {
      messages.value.splice(thinkingIndex, 1)
    }

    // 使用备用回复
    const fallbackResponse = getBotResponse(userQuery)
    messages.value.push({
      id: Date.now() + 2,
      type: 'bot',
      content: fallbackResponse,
      timestamp: new Date(),
      responseType: 'fallback'
    })
  }

  scrollToBottom()
}

// 发送快捷操作
const sendQuickAction = (action) => {
  userInput.value = action.text
  sendMessage()
}

// 使用配置文件中的函数
// getBotResponse 和 formatTime 已从配置文件导入

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 生命周期
onMounted(() => {
  // 延迟显示脉冲动画
  setTimeout(() => {
    showPulse.value = true
  }, 3000)
})

onUnmounted(() => {
  if (typebotInstance) {
    try {
      typebotInstance.close()
    } catch (error) {
      console.warn('清理 Typebot 实例时出错:', error)
    }
  }
})
</script>

<style scoped>
.typebot-chat-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* 聊天气泡按钮 */
.chat-bubble {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
  transition: all 0.3s ease;
  position: relative;
}

.chat-bubble:hover {
  transform: scale(1.15);
  box-shadow: 0 15px 40px rgba(99, 102, 241, 0.7);
}

.chat-bubble.pulse {
  animation: pulse-ring 2s infinite;
}

@keyframes pulse-ring {
  0% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(99, 102, 241, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
  }
}

.chat-icon {
  width: 32px;
  height: 32px;
  color: white;
}

.chat-tooltip {
  position: absolute;
  right: 70px;
  top: 50%;
  transform: translateY(-50%);
  background: #1e293b;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.chat-bubble:hover .chat-tooltip {
  opacity: 1;
  visibility: visible;
}

.tooltip-arrow {
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid #1e293b;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
}

/* 聊天窗口 */
.chat-window {
  width: 420px;
  height: 650px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.chat-window.minimized {
  height: 70px;
}

/* 聊天头部 */
.chat-header {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.title-info h4 {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
}

.status {
  font-size: 12px;
  opacity: 0.9;
}

.header-controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.control-btn svg {
  width: 18px;
  height: 18px;
}

/* 聊天内容 */
.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.typebot-container {
  flex: 1;
  width: 100%;
  height: 100%;
}

/* 备用聊天界面 */
.fallback-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.message {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.message.user {
  align-items: flex-end;
}

.message.bot {
  align-items: flex-start;
}

.message-content {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;
}

.message.user .message-content {
  background: #6366f1;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.bot .message-content {
  background: #f1f5f9;
  color: #334155;
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 4px;
  padding: 0 4px;
}

/* 输入区域 */
.input-container {
  border-top: 1px solid #e2e8f0;
  padding: 16px 20px;
  background: #f8fafc;
}

.quick-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.quick-action-btn {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 12px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-action-btn:hover {
  border-color: #6366f1;
  color: #6366f1;
  background: #f1f5f9;
}

.input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
}

.message-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.send-btn {
  width: 40px;
  height: 40px;
  background: #6366f1;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.send-btn:hover {
  background: #5856eb;
  transform: scale(1.05);
}

.send-btn svg {
  width: 18px;
  height: 18px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .chat-window {
    width: calc(100vw - 30px);
    height: calc(100vh - 30px);
    bottom: 15px;
    right: 15px;
  }

  .chat-bubble {
    width: 65px;
    height: 65px;
    bottom: 15px;
    right: 15px;
  }

  .chat-icon {
    width: 30px;
    height: 30px;
  }

  .chat-tooltip {
    display: none;
  }
}

/* 滚动条样式 */
.messages-container::-webkit-scrollbar {
  width: 4px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
