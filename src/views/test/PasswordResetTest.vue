<template>
  <div class="password-reset-test">
    <div class="test-container">
      <h2>密码重置功能测试</h2>
      
      <el-card class="test-card">
        <template #header>
          <span>API测试</span>
        </template>
        
        <el-form :model="testForm" label-width="120px">
          <el-form-item label="用户名">
            <el-input v-model="testForm.username" placeholder="请输入用户名" />
          </el-form-item>
          
          <el-form-item label="验证码">
            <div class="verification-input">
              <el-input v-model="testForm.verificationCode" placeholder="请输入验证码" />
              <el-button 
                type="primary" 
                @click="sendCode"
                :loading="sendingCode"
                :disabled="countdown > 0"
              >
                {{ countdown > 0 ? `${countdown}s后重发` : '发送验证码' }}
              </el-button>
            </div>
          </el-form-item>
          
          <el-form-item label="新密码">
            <el-input 
              v-model="testForm.newPassword" 
              type="password" 
              show-password
              placeholder="请输入新密码" 
            />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="resetPassword" :loading="resetting">
              重置密码
            </el-button>
            <el-button @click="clearForm">清空</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      
      <el-card class="result-card">
        <template #header>
          <span>测试结果</span>
        </template>
        
        <div class="result-content">
          <h4>API信息:</h4>
          <p><strong>发送验证码:</strong> POST /api/auth/reset-password/send-code</p>
          <p><strong>重置密码:</strong> POST /api/auth/reset-password/verify</p>
          
          <h4>请求参数:</h4>
          <pre>{{ JSON.stringify(testForm, null, 2) }}</pre>
          
          <h4>响应结果:</h4>
          <pre v-if="lastResponse">{{ JSON.stringify(lastResponse, null, 2) }}</pre>
          <p v-else class="no-result">暂无响应结果</p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { sendPasswordResetCode, resetPasswordWithCode } from '@/api/auth'

// 响应式数据
const sendingCode = ref(false)
const resetting = ref(false)
const countdown = ref(0)
const lastResponse = ref(null)

const testForm = reactive({
  username: 'admin_cd',
  verificationCode: '',
  newPassword: '666'
})

// 发送验证码
const sendCode = async () => {
  if (!testForm.username) {
    ElMessage.warning('请输入用户名')
    return
  }

  try {
    sendingCode.value = true
    lastResponse.value = null
    
    console.log('发送验证码请求:', { username: testForm.username })
    
    const response = await sendPasswordResetCode(testForm.username)
    
    console.log('发送验证码响应:', response)
    lastResponse.value = response
    
    ElMessage.success('验证码发送成功')
    
    // 开始倒计时
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
    
  } catch (error) {
    console.error('发送验证码失败:', error)
    lastResponse.value = {
      error: true,
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data
    }
    ElMessage.error('发送验证码失败: ' + (error.response?.data?.message || error.message))
  } finally {
    sendingCode.value = false
  }
}

// 重置密码
const resetPassword = async () => {
  if (!testForm.username || !testForm.verificationCode || !testForm.newPassword) {
    ElMessage.warning('请填写完整信息')
    return
  }

  try {
    resetting.value = true
    lastResponse.value = null
    
    const requestData = {
      username: testForm.username,
      newPassword: testForm.newPassword,
      verificationCode: testForm.verificationCode
    }
    
    console.log('重置密码请求:', requestData)
    
    const response = await resetPasswordWithCode(requestData)
    
    console.log('重置密码响应:', response)
    lastResponse.value = response
    
    ElMessage.success('密码重置成功: ' + (response.data || response.message))
    
  } catch (error) {
    console.error('重置密码失败:', error)
    lastResponse.value = {
      error: true,
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data
    }
    ElMessage.error('重置密码失败: ' + (error.response?.data?.message || error.message))
  } finally {
    resetting.value = false
  }
}

// 清空表单
const clearForm = () => {
  testForm.username = ''
  testForm.verificationCode = ''
  testForm.newPassword = ''
  lastResponse.value = null
  countdown.value = 0
}
</script>

<style scoped>
.password-reset-test {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

.test-container {
  max-width: 800px;
  margin: 0 auto;
}

.test-container h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #2c3e50;
}

.test-card,
.result-card {
  margin-bottom: 20px;
}

.verification-input {
  display: flex;
  gap: 12px;
  align-items: center;
}

.verification-input .el-input {
  flex: 1;
}

.result-content h4 {
  margin: 16px 0 8px 0;
  color: #2c3e50;
}

.result-content p {
  margin: 4px 0;
  color: #64748b;
}

.result-content pre {
  background: #f8fafc;
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  overflow-x: auto;
  border: 1px solid #e2e8f0;
}

.no-result {
  color: #94a3b8;
  font-style: italic;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .password-reset-test {
    padding: 16px;
  }
  
  .verification-input {
    flex-direction: column;
    align-items: stretch;
  }
  
  .verification-input .el-button {
    margin-top: 8px;
  }
}
</style>
