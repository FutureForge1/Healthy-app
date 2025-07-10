<template>
  <div class="tars-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2>TARS智能助手管理</h2>
        <p>管理和配置AI聊天机器人</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="testConnection">
          <el-icon><Connection /></el-icon>
          测试连接
        </el-button>
        <el-button type="success" @click="refreshStats">
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon">
            <el-icon><ChatDotRound /></el-icon>
          </div>
          <div class="stat-info">
            <h3>{{ stats.totalConversations }}</h3>
            <p>总对话数</p>
          </div>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-info">
            <h3>{{ stats.activeUsers }}</h3>
            <p>活跃用户</p>
          </div>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon">
            <el-icon><Clock /></el-icon>
          </div>
          <div class="stat-info">
            <h3>{{ stats.avgResponseTime }}ms</h3>
            <p>平均响应时间</p>
          </div>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="stat-info">
            <h3>{{ stats.satisfactionRate }}%</h3>
            <p>满意度</p>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-grid">
      <!-- 配置面板 -->
      <el-card class="config-panel">
        <template #header>
          <div class="card-header">
            <span>机器人配置</span>
            <el-button type="primary" size="small" @click="saveConfig">保存配置</el-button>
          </div>
        </template>
        
        <el-form :model="config" label-width="120px">
          <el-form-item label="对话ID">
            <el-input v-model="config.convid" placeholder="TARS对话ID" />
          </el-form-item>
          
          <el-form-item label="显示名称">
            <el-input v-model="config.displayName" placeholder="机器人显示名称" />
          </el-form-item>
          
          <el-form-item label="欢迎消息">
            <el-input 
              v-model="config.welcomeMessage" 
              type="textarea" 
              :rows="3"
              placeholder="用户首次打开聊天时的欢迎消息"
            />
          </el-form-item>
          
          <el-form-item label="自动打开">
            <el-switch v-model="config.autoOpen" />
          </el-form-item>
          
          <el-form-item label="显示位置">
            <el-select v-model="config.position" placeholder="选择显示位置">
              <el-option label="右下角" value="bottom-right" />
              <el-option label="左下角" value="bottom-left" />
              <el-option label="右上角" value="top-right" />
              <el-option label="左上角" value="top-left" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="启用页面">
            <el-checkbox-group v-model="config.enabledPages">
              <el-checkbox label="dashboard">仪表盘</el-checkbox>
              <el-checkbox label="statistics">统计分析</el-checkbox>
              <el-checkbox label="visualization">数据可视化</el-checkbox>
              <el-checkbox label="map3d">3D地图</el-checkbox>
              <el-checkbox label="settings">系统设置</el-checkbox>
              <el-checkbox label="help">帮助中心</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 实时监控 -->
      <el-card class="monitor-panel">
        <template #header>
          <div class="card-header">
            <span>实时监控</span>
            <el-badge :value="onlineUsers" class="online-badge">
              <el-icon><View /></el-icon>
            </el-badge>
          </div>
        </template>
        
        <div class="monitor-content">
          <div class="status-indicator">
            <div class="status-dot" :class="{ 'online': isOnline }"></div>
            <span>{{ isOnline ? '服务正常' : '服务异常' }}</span>
          </div>
          
          <div class="metrics">
            <div class="metric-item">
              <span class="metric-label">当前在线用户</span>
              <span class="metric-value">{{ onlineUsers }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">今日对话数</span>
              <span class="metric-value">{{ todayConversations }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">系统负载</span>
              <span class="metric-value">{{ systemLoad }}%</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 对话记录 -->
    <el-card class="conversation-logs">
      <template #header>
        <div class="card-header">
          <span>最近对话记录</span>
          <el-button type="primary" size="small" @click="exportLogs">导出记录</el-button>
        </div>
      </template>
      
      <el-table :data="conversationLogs" style="width: 100%">
        <el-table-column prop="timestamp" label="时间" width="180">
          <template #default="scope">
            {{ formatTime(scope.row.timestamp) }}
          </template>
        </el-table-column>
        <el-table-column prop="userId" label="用户ID" width="120" />
        <el-table-column prop="message" label="用户消息" />
        <el-table-column prop="response" label="AI回复" />
        <el-table-column prop="satisfaction" label="满意度" width="100">
          <template #default="scope">
            <el-rate 
              v-model="scope.row.satisfaction" 
              disabled 
              size="small"
              :max="5"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewConversation(scope.row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalLogs"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 测试对话弹窗 -->
    <el-dialog v-model="showTestDialog" title="测试TARS机器人" width="600px">
      <div class="test-chat-container">
        <iframe
          :src="testChatUrl"
          class="test-iframe"
          frameborder="0"
        ></iframe>
      </div>
      <template #footer>
        <el-button @click="showTestDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Connection,
  Refresh,
  ChatDotRound,
  User,
  Clock,
  TrendCharts,
  View
} from '@element-plus/icons-vue'
import tarsService from '@/services/tarsService'

// 响应式数据
const stats = reactive({
  totalConversations: 1247,
  activeUsers: 89,
  avgResponseTime: 850,
  satisfactionRate: 94.2
})

const config = reactive({
  convid: 'WbpUav',
  displayName: '天府健康云助手',
  welcomeMessage: '您好，欢迎来到天府健康云平台！我是您的专属健康问答助手，有什么可以帮助您的吗？',
  autoOpen: false,
  position: 'bottom-right',
  enabledPages: ['dashboard', 'statistics', 'visualization', 'help']
})

const isOnline = ref(true)
const onlineUsers = ref(12)
const todayConversations = ref(156)
const systemLoad = ref(23)
const showTestDialog = ref(false)

// 对话记录
const conversationLogs = ref([
  {
    id: 1,
    timestamp: new Date('2024-01-10 14:30:00'),
    userId: 'user001',
    message: '如何查看人口统计数据？',
    response: '您可以在统计分析页面查看详细的人口统计数据...',
    satisfaction: 5
  },
  {
    id: 2,
    timestamp: new Date('2024-01-10 14:25:00'),
    userId: 'user002',
    message: '系统支持哪些数据导出格式？',
    response: '系统支持Excel、PDF、CSV等多种格式导出...',
    satisfaction: 4
  }
])

const currentPage = ref(1)
const pageSize = ref(10)
const totalLogs = ref(156)

// 计算属性
const testChatUrl = computed(() => {
  return tarsService.getChatbotUrl()
})

// 方法
const testConnection = async () => {
  try {
    ElMessage.info('正在测试连接...')
    const isConnected = await tarsService.checkStatus()
    
    if (isConnected) {
      ElMessage.success('TARS服务连接正常')
      showTestDialog.value = true
    } else {
      ElMessage.error('TARS服务连接失败')
    }
  } catch (error) {
    ElMessage.error('连接测试失败')
  }
}

const refreshStats = async () => {
  try {
    ElMessage.info('正在刷新数据...')
    
    // 模拟数据刷新
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    stats.totalConversations = Math.floor(Math.random() * 2000) + 1000
    stats.activeUsers = Math.floor(Math.random() * 100) + 50
    stats.avgResponseTime = Math.floor(Math.random() * 500) + 500
    stats.satisfactionRate = (Math.random() * 10 + 90).toFixed(1)
    
    ElMessage.success('数据已刷新')
  } catch (error) {
    ElMessage.error('刷新失败')
  }
}

const saveConfig = async () => {
  try {
    ElMessage.info('正在保存配置...')
    
    // 模拟保存配置
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 保存到本地存储
    localStorage.setItem('tarsConfig', JSON.stringify(config))
    
    ElMessage.success('配置已保存')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

const exportLogs = () => {
  try {
    const data = conversationLogs.value.map(log => ({
      时间: formatTime(log.timestamp),
      用户ID: log.userId,
      用户消息: log.message,
      AI回复: log.response,
      满意度: log.satisfaction
    }))
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(data[0]).join(",") + "\n"
      + data.map(row => Object.values(row).join(",")).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `tars-logs-${new Date().toISOString().split('T')[0]}.csv`)
    link.click()
    
    ElMessage.success('对话记录已导出')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

const viewConversation = (conversation) => {
  ElMessageBox.alert(
    `<div>
      <p><strong>用户消息：</strong>${conversation.message}</p>
      <p><strong>AI回复：</strong>${conversation.response}</p>
      <p><strong>时间：</strong>${formatTime(conversation.timestamp)}</p>
      <p><strong>满意度：</strong>${conversation.satisfaction}/5</p>
    </div>`,
    '对话详情',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '关闭'
    }
  )
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString('zh-CN')
}

const handleSizeChange = (val) => {
  pageSize.value = val
  // 重新加载数据
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  // 重新加载数据
}

// 生命周期
onMounted(() => {
  // 加载保存的配置
  const savedConfig = localStorage.getItem('tarsConfig')
  if (savedConfig) {
    Object.assign(config, JSON.parse(savedConfig))
  }
  
  // 模拟实时数据更新
  setInterval(() => {
    onlineUsers.value = Math.floor(Math.random() * 20) + 5
    systemLoad.value = Math.floor(Math.random() * 30) + 10
  }, 5000)
})
</script>

<style scoped>
.tars-management {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h2 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
}

.header-content p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.stat-info h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
}

.stat-info p {
  margin: 4px 0 0 0;
  color: #64748b;
  font-size: 14px;
}

/* 内容网格 */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

/* 监控面板 */
.monitor-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ef4444;
  animation: pulse 2s infinite;
}

.status-dot.online {
  background: #10b981;
}

.metrics {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.metric-label {
  color: #64748b;
  font-size: 14px;
}

.metric-value {
  font-weight: 600;
  color: #2c3e50;
}

/* 对话记录 */
.conversation-logs {
  margin-bottom: 20px;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 测试对话 */
.test-chat-container {
  height: 500px;
}

.test-iframe {
  width: 100%;
  height: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
