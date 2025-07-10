<template>
  <div class="tars-demo">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2>TARS智能助手演示</h2>
        <p>体验AI驱动的智能客服系统</p>
      </div>
    </div>

    <!-- 功能介绍 -->
    <div class="intro-section">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="feature-card">
            <div class="feature-icon">
              <el-icon><Service /></el-icon>
            </div>
            <h3>智能对话</h3>
            <p>基于Claude AI的智能对话系统，能够理解复杂问题并提供准确回答</p>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="feature-card">
            <div class="feature-icon">
              <el-icon><DataAnalysis /></el-icon>
            </div>
            <h3>知识库集成</h3>
            <p>集成了健康大数据平台的完整知识库，提供专业的健康数据咨询</p>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="feature-card">
            <div class="feature-icon">
              <el-icon><Service /></el-icon>
            </div>
            <h3>24/7服务</h3>
            <p>全天候在线服务，随时为用户提供帮助和支持</p>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 演示区域 -->
    <div class="demo-section">
      <el-row :gutter="20">
        <!-- 左侧：聊天演示 -->
        <el-col :span="16">
          <el-card class="chat-demo-card">
            <template #header>
              <div class="card-header">
                <span>实时聊天演示</span>
                <el-button type="primary" size="small" @click="openFullChat">
                  <el-icon><FullScreen /></el-icon>
                  全屏体验
                </el-button>
              </div>
            </template>
            
            <div class="chat-container">
              <iframe
                :src="chatUrl"
                class="chat-iframe"
                frameborder="0"
              ></iframe>
            </div>
          </el-card>
        </el-col>

        <!-- 右侧：快速操作 -->
        <el-col :span="8">
          <el-card class="quick-actions-card">
            <template #header>
              <span>快速体验</span>
            </template>
            
            <div class="quick-actions">
              <h4>常见问题示例</h4>
              <div class="action-buttons">
                <el-button 
                  v-for="example in examples" 
                  :key="example.id"
                  type="primary" 
                  plain 
                  size="small"
                  @click="sendExample(example.message)"
                  class="example-btn"
                >
                  {{ example.label }}
                </el-button>
              </div>

              <el-divider />

              <h4>系统信息</h4>
              <div class="system-info">
                <div class="info-item">
                  <span class="label">AI模型:</span>
                  <span class="value">Claude 3.5 Sonnet</span>
                </div>
                <div class="info-item">
                  <span class="label">响应时间:</span>
                  <span class="value">< 2秒</span>
                </div>
                <div class="info-item">
                  <span class="label">支持语言:</span>
                  <span class="value">中文/英文</span>
                </div>
                <div class="info-item">
                  <span class="label">知识库:</span>
                  <span class="value">健康大数据专业知识</span>
                </div>
              </div>

              <el-divider />

              <h4>集成选项</h4>
              <div class="integration-options">
                <el-button type="success" @click="showEmbedCode">
                  <el-icon><Code /></el-icon>
                  获取嵌入代码
                </el-button>
                <el-button type="info" @click="showApiDocs">
                  <el-icon><Document /></el-icon>
                  API文档
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 技术特性 -->
    <div class="tech-features">
      <el-card>
        <template #header>
          <span>技术特性</span>
        </template>
        
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="tech-item">
              <el-icon class="tech-icon"><Lightning /></el-icon>
              <h4>高性能</h4>
              <p>毫秒级响应，支持高并发访问</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="tech-item">
              <el-icon class="tech-icon"><Lock /></el-icon>
              <h4>安全可靠</h4>
              <p>企业级安全保障，数据加密传输</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="tech-item">
              <el-icon class="tech-icon"><Setting /></el-icon>
              <h4>易于集成</h4>
              <p>简单的API接口，快速集成到现有系统</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="tech-item">
              <el-icon class="tech-icon"><TrendCharts /></el-icon>
              <h4>智能分析</h4>
              <p>对话数据分析，持续优化用户体验</p>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 嵌入代码弹窗 -->
    <el-dialog v-model="showEmbedDialog" title="嵌入代码" width="600px">
      <div class="embed-code-content">
        <h4>HTML嵌入代码</h4>
        <el-input
          v-model="embedCode"
          type="textarea"
          :rows="6"
          readonly
          class="code-input"
        />
        <div class="code-actions">
          <el-button type="primary" @click="copyEmbedCode">
            <el-icon><CopyDocument /></el-icon>
            复制代码
          </el-button>
          <el-button @click="downloadEmbedCode">
            <el-icon><Download /></el-icon>
            下载文件
          </el-button>
        </div>
      </div>
      <template #footer>
        <el-button @click="showEmbedDialog = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 全屏聊天弹窗 -->
    <el-dialog v-model="showFullChatDialog" title="TARS智能助手" width="80%" top="5vh">
      <div class="fullscreen-chat">
        <iframe
          :src="chatUrl"
          class="fullscreen-iframe"
          frameborder="0"
        ></iframe>
      </div>
      <template #footer>
        <el-button @click="showFullChatDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Service,
  DataAnalysis,
  FullScreen,
  Code,
  Document,
  Lightning,
  Lock,
  Setting,
  TrendCharts,
  CopyDocument,
  Download
} from '@element-plus/icons-vue'
import tarsService from '@/services/tarsService'

// 响应式数据
const showEmbedDialog = ref(false)
const showFullChatDialog = ref(false)

// 计算属性
const chatUrl = computed(() => {
  return tarsService.getChatbotUrl()
})

const embedCode = computed(() => {
  return tarsService.getEmbedCode({
    width: '400px',
    height: '600px',
    borderRadius: '12px'
  })
})

// 示例问题
const examples = ref([
  { id: 1, label: '系统介绍', message: '请介绍一下天府健康云平台的主要功能' },
  { id: 2, label: '数据查询', message: '如何查询人口统计数据？' },
  { id: 3, label: '图表制作', message: '怎样创建数据可视化图表？' },
  { id: 4, label: '权限申请', message: '如何申请更高级别的系统权限？' },
  { id: 5, label: '技术支持', message: '遇到技术问题应该如何寻求帮助？' }
])

// 方法
const sendExample = (message) => {
  ElMessage.info(`正在发送示例问题: ${message}`)
  // 这里可以通过postMessage向iframe发送消息
  // 但由于跨域限制，实际效果可能有限
}

const openFullChat = () => {
  showFullChatDialog.value = true
}

const showEmbedCode = () => {
  showEmbedDialog.value = true
}

const showApiDocs = () => {
  // 跳转到API文档页面
  window.open('https://help.hellotars.com/', '_blank')
}

const copyEmbedCode = async () => {
  try {
    await navigator.clipboard.writeText(embedCode.value)
    ElMessage.success('嵌入代码已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败，请手动复制')
  }
}

const downloadEmbedCode = () => {
  const blob = new Blob([embedCode.value], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'tars-embed.html'
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('嵌入代码文件已下载')
}
</script>

<style scoped>
.tars-demo {
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
  text-align: center;
}

.header-content h2 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 28px;
  font-weight: 600;
}

.header-content p {
  margin: 0;
  color: #64748b;
  font-size: 16px;
}

/* 功能介绍 */
.intro-section {
  margin-bottom: 30px;
}

.feature-card {
  text-align: center;
  transition: all 0.3s ease;
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: white;
  font-size: 24px;
}

.feature-card h3 {
  margin: 0 0 12px 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
}

.feature-card p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

/* 演示区域 */
.demo-section {
  margin-bottom: 30px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.chat-container {
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
}

.chat-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* 快速操作 */
.quick-actions h4 {
  margin: 0 0 12px 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.example-btn {
  justify-content: flex-start;
  text-align: left;
}

.system-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.label {
  color: #64748b;
  font-size: 14px;
}

.value {
  color: #2c3e50;
  font-weight: 500;
  font-size: 14px;
}

.integration-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 技术特性 */
.tech-features {
  margin-bottom: 30px;
}

.tech-item {
  text-align: center;
  padding: 20px;
}

.tech-icon {
  font-size: 32px;
  color: #667eea;
  margin-bottom: 12px;
}

.tech-item h4 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

.tech-item p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
}

/* 嵌入代码弹窗 */
.embed-code-content h4 {
  margin: 0 0 12px 0;
  color: #2c3e50;
}

.code-input {
  margin-bottom: 16px;
}

.code-actions {
  display: flex;
  gap: 12px;
}

/* 全屏聊天 */
.fullscreen-chat {
  height: 70vh;
}

.fullscreen-iframe {
  width: 100%;
  height: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .demo-section .el-col {
    margin-bottom: 20px;
  }
  
  .chat-container {
    height: 400px;
  }
  
  .tech-features .el-row .el-col {
    margin-bottom: 20px;
  }
}
</style>
