<template>
  <div class="typebot-test-page">
    <div class="container">
      <h1>Typebot 聊天机器人测试页面</h1>
      
      <div class="test-content">
        <div class="info-card">
          <h2>🤖 聊天助手功能</h2>
          <p>右下角的聊天气泡是我们集成的智能助手，它可以帮助您：</p>
          <ul>
            <li>📊 查询成都市健康数据统计</li>
            <li>🏥 了解医疗机构信息</li>
            <li>🛏️ 查看床位使用情况</li>
            <li>📥 指导数据导出操作</li>
            <li>📖 解答系统使用问题</li>
          </ul>
        </div>

        <div class="demo-card">
          <h2>💬 试试这些问题</h2>
          <div class="demo-questions">
            <div class="question-item" @click="copyToClipboard('成都市人口统计')">
              <span>成都市人口统计</span>
              <el-icon><CopyDocument /></el-icon>
            </div>
            <div class="question-item" @click="copyToClipboard('医院信息查询')">
              <span>医院信息查询</span>
              <el-icon><CopyDocument /></el-icon>
            </div>
            <div class="question-item" @click="copyToClipboard('床位使用情况')">
              <span>床位使用情况</span>
              <el-icon><CopyDocument /></el-icon>
            </div>
            <div class="question-item" @click="copyToClipboard('如何导出数据')">
              <span>如何导出数据</span>
              <el-icon><CopyDocument /></el-icon>
            </div>
            <div class="question-item" @click="copyToClipboard('系统使用帮助')">
              <span>系统使用帮助</span>
              <el-icon><CopyDocument /></el-icon>
            </div>
          </div>
        </div>

        <div class="config-card">
          <h2>⚙️ 配置状态</h2>
          <p>✅ 已配置真实的 Typebot ID：<code>user-onboarding-vhaezio</code></p>
          <p>🔗 Typebot URL：<a href="https://typebot.co/user-onboarding-vhaezio" target="_blank">https://typebot.co/user-onboarding-vhaezio</a></p>
          <p>现在聊天窗口将使用iframe方式加载您的真实 Typebot！</p>

          <div class="status-info">
            <h3>当前配置：</h3>
            <ul>
              <li>✅ Typebot ID 已设置</li>
              <li>✅ 使用 typebot.co 域名</li>
              <li>✅ 使用iframe嵌入模式</li>
              <li>✅ 备用聊天界面作为后备</li>
            </ul>
          </div>

          <div class="test-iframe">
            <h3>🧪 Typebot 预览测试：</h3>
            <iframe
              :src="`https://typebot.co/user-onboarding-vhaezio`"
              style="width: 100%; height: 400px; border: 1px solid #e2e8f0; border-radius: 8px;"
              @load="onIframeLoad"
              @error="onIframeError"
            ></iframe>
          </div>
        </div>

        <div class="features-card">
          <h2>✨ 功能特性</h2>
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon">🎯</div>
              <h3>智能对话</h3>
              <p>基于关键词识别，提供准确的回复</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🎨</div>
              <h3>美观界面</h3>
              <p>现代化设计，符合应用整体风格</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📱</div>
              <h3>响应式</h3>
              <p>支持桌面和移动设备</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🔄</div>
              <h3>备用机制</h3>
              <p>服务不可用时自动切换到本地聊天</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { CopyDocument } from '@element-plus/icons-vue'

// 复制文本到剪贴板
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success(`已复制: ${text}`)
  } catch (err) {
    // 备用方法
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    ElMessage.success(`已复制: ${text}`)
  }
}
</script>

<style scoped>
.typebot-test-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 40px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #1e293b;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 40px;
}

.test-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.info-card,
.demo-card,
.config-card,
.features-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.info-card h2,
.demo-card h2,
.config-card h2,
.features-card h2 {
  color: #1e293b;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
}

.info-card ul {
  list-style: none;
  padding: 0;
}

.info-card li {
  padding: 8px 0;
  color: #64748b;
  font-size: 16px;
}

.demo-questions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.question-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.question-item:hover {
  background: #6366f1;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.config-card p {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 16px;
}

.config-card ol {
  color: #64748b;
  line-height: 1.6;
}

.config-card code {
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'SF Mono', 'Monaco', monospace;
  color: #6366f1;
}

.config-card a {
  color: #6366f1;
  text-decoration: none;
}

.config-card a:hover {
  text-decoration: underline;
}

.status-info {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
}

.status-info h3 {
  color: #1e293b;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.status-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.status-info li {
  padding: 4px 0;
  color: #059669;
  font-size: 14px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.feature-item {
  text-align: center;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.feature-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.feature-item h3 {
  color: #1e293b;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.feature-item p {
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .test-content {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  h1 {
    font-size: 24px;
  }
}
</style>
