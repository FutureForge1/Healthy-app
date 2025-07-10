<template>
  <div class="tars-chat-container">
    <!-- 聊天按钮 -->
    <div 
      v-if="!isOpen" 
      class="chat-button" 
      @click="toggleChat"
      :class="{ 'pulse': showPulse }"
    >
      <el-icon class="chat-icon">
        <ChatDotRound />
      </el-icon>
      <div v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</div>
    </div>

    <!-- 聊天窗口 -->
    <div v-if="isOpen" class="chat-window" :class="{ 'minimized': isMinimized }">
      <!-- 聊天头部 -->
      <div class="chat-header">
        <div class="header-info">
          <div class="bot-avatar">
            <el-icon><Service /></el-icon>
          </div>
          <div class="bot-info">
            <h4>天府健康云助手</h4>
            <span class="status">{{ isConnected ? '在线' : '连接中...' }}</span>
          </div>
        </div>
        <div class="header-actions">
          <el-button 
            text 
            @click="toggleMinimize"
            :icon="isMinimized ? ArrowUp : ArrowDown"
            size="small"
          />
          <el-button 
            text 
            @click="closeChat"
            :icon="Close"
            size="small"
          />
        </div>
      </div>

      <!-- 聊天内容区域 -->
      <div v-if="!isMinimized" class="chat-content">
        <!-- TARS iframe -->
        <iframe
          ref="tarsIframe"
          :src="tarsUrl"
          class="tars-iframe"
          frameborder="0"
          @load="onIframeLoad"
        ></iframe>
        
        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading-overlay">
          <el-icon class="loading-icon"><Loading /></el-icon>
          <p>正在连接智能助手...</p>
        </div>
      </div>

      <!-- 快速操作 -->
      <div v-if="!isMinimized" class="quick-actions">
        <el-button 
          v-for="action in quickActions" 
          :key="action.id"
          size="small" 
          text
          @click="sendQuickMessage(action.message)"
        >
          {{ action.label }}
        </el-button>
      </div>
    </div>

    <!-- 背景遮罩 -->
    <div 
      v-if="isOpen && isMobile" 
      class="chat-overlay" 
      @click="closeChat"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ChatDotRound,
  Service,
  ArrowUp,
  ArrowDown,
  Close,
  Loading
} from '@element-plus/icons-vue'

// Props
const props = defineProps({
  convid: {
    type: String,
    default: 'WbpUav' // 您的TARS conversation ID
  },
  position: {
    type: String,
    default: 'bottom-right',
    validator: (value) => ['bottom-right', 'bottom-left', 'top-right', 'top-left'].includes(value)
  },
  autoOpen: {
    type: Boolean,
    default: false
  },
  showWelcome: {
    type: Boolean,
    default: true
  }
})

// 响应式数据
const isOpen = ref(false)
const isMinimized = ref(false)
const isLoading = ref(true)
const isConnected = ref(false)
const unreadCount = ref(0)
const showPulse = ref(true)
const tarsIframe = ref(null)

// 计算属性
const isMobile = computed(() => window.innerWidth <= 768)

const tarsUrl = computed(() => {
  return `https://chatbot.hellotars.com/conv/${props.convid}/`
})

// 快速操作按钮
const quickActions = ref([
  { id: 1, label: '系统介绍', message: '请介绍一下天府健康云平台的主要功能' },
  { id: 2, label: '使用帮助', message: '我需要使用帮助' },
  { id: 3, label: '数据查询', message: '如何查询健康数据？' },
  { id: 4, label: '联系客服', message: '我需要人工客服' }
])

// 方法
const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    unreadCount.value = 0
    showPulse.value = false
  }
}

const closeChat = () => {
  isOpen.value = false
  emit('close')
}

const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value
}

const onIframeLoad = () => {
  isLoading.value = false
  isConnected.value = true
  
  // 发送欢迎消息
  if (props.showWelcome) {
    setTimeout(() => {
      sendWelcomeMessage()
    }, 1000)
  }
}

const sendWelcomeMessage = () => {
  try {
    // 通过postMessage与TARS iframe通信
    if (tarsIframe.value && tarsIframe.value.contentWindow) {
      tarsIframe.value.contentWindow.postMessage({
        type: 'TARS_START_CONVERSATION',
        data: {
          message: '开始对话'
        }
      }, '*')
    }
  } catch (error) {
    console.warn('无法发送欢迎消息:', error)
  }
}

const sendQuickMessage = (message) => {
  try {
    if (tarsIframe.value && tarsIframe.value.contentWindow) {
      tarsIframe.value.contentWindow.postMessage({
        type: 'TARS_SEND_MESSAGE',
        data: {
          message: message
        }
      }, '*')
    }
  } catch (error) {
    console.warn('无法发送快速消息:', error)
    ElMessage.warning('发送消息失败，请直接在聊天框中输入')
  }
}

// 监听来自TARS的消息
const handleTarsMessage = (event) => {
  if (event.origin !== 'https://chatbot.hellotars.com') {
    return
  }

  try {
    const { type, data } = event.data
    
    switch (type) {
      case 'TARS_MESSAGE_RECEIVED':
        // 处理收到的消息
        if (!isOpen.value) {
          unreadCount.value++
          showPulse.value = true
        }
        break
      case 'TARS_CONVERSATION_STARTED':
        isConnected.value = true
        break
      case 'TARS_ERROR':
        ElMessage.error('聊天服务暂时不可用')
        isConnected.value = false
        break
    }
  } catch (error) {
    console.warn('处理TARS消息失败:', error)
  }
}

// 生命周期
onMounted(() => {
  // 监听来自iframe的消息
  window.addEventListener('message', handleTarsMessage)
  
  // 自动打开
  if (props.autoOpen) {
    setTimeout(() => {
      toggleChat()
    }, 2000)
  }
  
  // 定期显示脉冲效果
  setInterval(() => {
    if (!isOpen.value && Math.random() > 0.7) {
      showPulse.value = true
      setTimeout(() => {
        showPulse.value = false
      }, 3000)
    }
  }, 30000)
})

onUnmounted(() => {
  window.removeEventListener('message', handleTarsMessage)
})

// 定义事件
const emit = defineEmits(['close'])

// 暴露方法给父组件
defineExpose({
  openChat: () => { isOpen.value = true },
  closeChat: () => { isOpen.value = false },
  sendMessage: sendQuickMessage
})
</script>

<style scoped>
.tars-chat-container {
  position: fixed;
  z-index: 9999;
}

/* 根据position属性定位 */
.tars-chat-container {
  bottom: 20px;
  right: 20px;
}

/* 聊天按钮 */
.chat-button {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  position: relative;
}

.chat-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
}

.chat-button.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  }
  50% {
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.8), 0 0 0 10px rgba(102, 126, 234, 0.1);
  }
  100% {
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  }
}

.chat-icon {
  font-size: 24px;
  color: white;
}

.unread-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

/* 聊天窗口 */
.chat-window {
  width: 380px;
  height: 600px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: absolute;
  bottom: 80px;
  right: 0;
  transition: all 0.3s ease;
}

.chat-window.minimized {
  height: 60px;
}

/* 聊天头部 */
.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bot-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bot-info h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.status {
  font-size: 12px;
  opacity: 0.8;
}

.header-actions {
  display: flex;
  gap: 8px;
}

/* 聊天内容 */
.chat-content {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.tars-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.loading-icon {
  font-size: 32px;
  color: #667eea;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 快速操作 */
.quick-actions {
  padding: 12px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-actions .el-button {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  background: #f8fafc;
  color: #64748b;
}

.quick-actions .el-button:hover {
  background: #667eea;
  color: white;
}

/* 背景遮罩 */
.chat-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .chat-window {
    width: calc(100vw - 40px);
    height: calc(100vh - 100px);
    bottom: 80px;
    right: 20px;
    left: 20px;
  }
  
  .chat-button {
    width: 56px;
    height: 56px;
  }
  
  .chat-icon {
    font-size: 20px;
  }
}
</style>
