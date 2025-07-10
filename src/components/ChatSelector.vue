<template>
  <div class="chat-selector">
    <!-- 主聊天按钮 -->
    <div 
      v-if="!showSelector && !activeChatType" 
      class="main-chat-button" 
      @click="toggleSelector"
      :class="{ 'pulse': showPulse }"
    >
      <el-icon class="chat-icon">
        <ChatDotRound />
      </el-icon>
      <div v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</div>
    </div>

    <!-- 聊天选择器 -->
    <div v-if="showSelector" class="selector-panel">
      <div class="selector-header">
        <h4>选择聊天助手</h4>
        <el-button 
          text 
          @click="closeSelector"
          :icon="Close"
          size="small"
        />
      </div>
      
      <div class="chat-options">
        <div 
          class="chat-option"
          @click="selectChat('typebot')"
        >
          <div class="option-icon typebot">
            <el-icon><ChatLineRound /></el-icon>
          </div>
          <div class="option-info">
            <h5>Typebot助手</h5>
            <p>交互式对话流程</p>
          </div>
          <div class="option-status online"></div>
        </div>

        <div 
          class="chat-option"
          @click="selectChat('tars')"
        >
          <div class="option-icon tars">
            <el-icon><Service /></el-icon>
          </div>
          <div class="option-info">
            <h5>TARS智能助手</h5>
            <p>AI驱动的智能客服</p>
          </div>
          <div class="option-status online"></div>
        </div>
      </div>
    </div>

    <!-- Typebot聊天组件 -->
    <TypebotChat 
      v-if="activeChatType === 'typebot'"
      @close="closeChat"
    />

    <!-- TARS聊天组件 -->
    <TarsChat 
      v-if="activeChatType === 'tars'"
      :convid="tarsConvid"
      :auto-open="true"
      :show-welcome="true"
      @close="closeChat"
    />

    <!-- 切换按钮（当有活跃聊天时） -->
    <div 
      v-if="activeChatType" 
      class="switch-button"
      @click="showSwitchMenu = !showSwitchMenu"
    >
      <el-icon><Switch /></el-icon>
    </div>

    <!-- 切换菜单 -->
    <div v-if="showSwitchMenu" class="switch-menu">
      <div class="menu-item" @click="switchChat('typebot')">
        <el-icon><ChatLineRound /></el-icon>
        <span>Typebot助手</span>
      </div>
      <div class="menu-item" @click="switchChat('tars')">
        <el-icon><Service /></el-icon>
        <span>TARS智能助手</span>
      </div>
      <div class="menu-item" @click="closeAllChats">
        <el-icon><Close /></el-icon>
        <span>关闭聊天</span>
      </div>
    </div>

    <!-- 背景遮罩 -->
    <div 
      v-if="showSelector || showSwitchMenu" 
      class="overlay" 
      @click="closeAll"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  ChatDotRound,
  ChatLineRound,
  Service,
  Close,
  Switch
} from '@element-plus/icons-vue'
import TypebotChat from './TypebotChat.vue'
import TarsChat from './TarsChat.vue'

// 响应式数据
const showSelector = ref(false)
const activeChatType = ref('')
const showSwitchMenu = ref(false)
const unreadCount = ref(0)
const showPulse = ref(true)
const tarsConvid = ref('WbpUav')

// 方法
const toggleSelector = () => {
  showSelector.value = !showSelector.value
  showPulse.value = false
}

const closeSelector = () => {
  showSelector.value = false
}

const selectChat = (type) => {
  activeChatType.value = type
  showSelector.value = false
  
  // 保存用户选择
  localStorage.setItem('preferredChatType', type)
}

const switchChat = (type) => {
  activeChatType.value = type
  showSwitchMenu.value = false
  
  // 保存用户选择
  localStorage.setItem('preferredChatType', type)
}

const closeChat = () => {
  activeChatType.value = ''
  showSwitchMenu.value = false
}

const closeAllChats = () => {
  activeChatType.value = ''
  showSwitchMenu.value = false
  showSelector.value = false
}

const closeAll = () => {
  showSelector.value = false
  showSwitchMenu.value = false
}

// 生命周期
onMounted(() => {
  // 加载用户偏好
  const preferredType = localStorage.getItem('preferredChatType')
  if (preferredType) {
    // 可以选择自动打开用户偏好的聊天类型
    // activeChatType.value = preferredType
  }
  
  // 定期显示脉冲效果
  setInterval(() => {
    if (!activeChatType.value && !showSelector.value && Math.random() > 0.8) {
      showPulse.value = true
      setTimeout(() => {
        showPulse.value = false
      }, 3000)
    }
  }, 30000)
})
</script>

<style scoped>
.chat-selector {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

/* 主聊天按钮 */
.main-chat-button {
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

.main-chat-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
}

.main-chat-button.pulse {
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

/* 选择器面板 */
.selector-panel {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 300px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.selector-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selector-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

/* 聊天选项 */
.chat-options {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.chat-option:hover {
  background: #f8fafc;
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.option-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.option-icon.typebot {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.option-icon.tars {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.option-info {
  flex: 1;
}

.option-info h5 {
  margin: 0 0 4px 0;
  color: #2c3e50;
  font-size: 14px;
  font-weight: 600;
}

.option-info p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
}

.option-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
}

/* 切换按钮 */
.switch-button {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 40px;
  height: 40px;
  background: rgba(102, 126, 234, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;
}

.switch-button:hover {
  background: rgba(102, 126, 234, 1);
  transform: scale(1.1);
}

/* 切换菜单 */
.switch-menu {
  position: absolute;
  bottom: 130px;
  right: 0;
  width: 200px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #2c3e50;
  font-size: 14px;
}

.menu-item:hover {
  background: #f8fafc;
  color: #667eea;
}

.menu-item:not(:last-child) {
  border-bottom: 1px solid #f1f5f9;
}

/* 背景遮罩 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: -1;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .selector-panel {
    width: calc(100vw - 40px);
    right: 20px;
    left: 20px;
  }
  
  .switch-menu {
    width: 180px;
  }
}
</style>
