<template>
  <div class="register-container">
    <div class="register-wrapper">
      <!-- 左侧信息面板 -->
      <div class="info-panel">
        <div class="brand-section">
          <h1 class="brand-title">成都健康大数据中心</h1>
          <p class="brand-subtitle">创新研究平台</p>
        </div>

        <div class="steps-indicator">
          <div class="step-item" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
            <div class="step-number">1</div>
            <div class="step-info">
              <div class="step-title">人机验证</div>
              <div class="step-desc">验证您是真实用户</div>
            </div>
          </div>

          <div class="step-item" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
            <div class="step-number">2</div>
            <div class="step-info">
              <div class="step-title">基本信息</div>
              <div class="step-desc">填写账户信息</div>
            </div>
          </div>

          <div class="step-item" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
            <div class="step-number">3</div>
            <div class="step-info">
              <div class="step-title">邮箱验证</div>
              <div class="step-desc">验证邮箱地址</div>
            </div>
          </div>

          <div class="step-item" :class="{ active: currentStep >= 4, completed: currentStep > 4 }">
            <div class="step-number">4</div>
            <div class="step-info">
              <div class="step-title">注册完成</div>
              <div class="step-desc">账户创建成功</div>
            </div>
          </div>
        </div>

        <div class="features-list">
          <div class="feature-item">
            <el-icon><Shield /></el-icon>
            <span>安全可靠的数据保护</span>
          </div>
          <div class="feature-item">
            <el-icon><DataAnalysis /></el-icon>
            <span>专业的数据分析工具</span>
          </div>
          <div class="feature-item">
            <el-icon><Connection /></el-icon>
            <span>实时的数据同步</span>
          </div>
        </div>
      </div>

      <!-- 右侧注册表单 -->
      <div class="form-panel">
        <div class="form-container">
          <!-- 步骤1: 人机验证 -->
          <div v-if="currentStep === 1" class="step-content">
            <div class="step-header">
              <h2>人机验证</h2>
              <p>请完成安全验证以继续注册</p>
            </div>

            <div class="turnstile-section">
              <div class="turnstile-info">
                <div class="info-icon">
                  <el-icon><Shield /></el-icon>
                </div>
                <div class="info-text">
                  <h3>安全验证</h3>
                  <p>我们使用Cloudflare Turnstile来保护您的账户安全</p>
                </div>
              </div>

              <div class="turnstile-wrapper">
                <div
                  id="turnstile-widget"
                  class="turnstile-widget"
                  :class="{ 'widget-loading': turnstileLoading }"
                ></div>

                <div v-if="turnstileLoading" class="turnstile-loading">
                  <el-icon class="loading-icon"><Loading /></el-icon>
                  <span>正在加载验证组件...</span>
                </div>

                <div v-if="turnstileError" class="turnstile-error">
                  <el-icon><Warning /></el-icon>
                  <span>验证组件加载失败，请刷新页面重试</span>
                  <el-button text type="primary" @click="initTurnstile">
                    重新加载
                  </el-button>
                </div>
              </div>

              <div class="verification-status">
                <div v-if="turnstileVerified" class="status-success">
                  <el-icon><CircleCheck /></el-icon>
                  <span>验证成功！</span>
                </div>
                <div v-else-if="turnstileToken" class="status-verifying">
                  <el-icon class="rotating"><Loading /></el-icon>
                  <span>正在验证...</span>
                </div>
              </div>

              <div class="turnstile-actions">
                <el-button
                  type="primary"
                  size="large"
                  @click="proceedToNextStep"
                  :disabled="!turnstileVerified"
                  :loading="verifyingCaptcha"
                  class="verify-btn"
                >
                  <span v-if="turnstileVerified">继续注册</span>
                  <span v-else>请先完成验证</span>
                </el-button>
              </div>
            </div>
          </div>

          <!-- 步骤2: 基本信息 -->
          <div v-if="currentStep === 2" class="step-content">
            <div class="step-header">
              <h2>填写基本信息</h2>
              <p>请填写您的账户信息</p>
            </div>

            <!-- 后端状态检查 -->
            <div class="backend-status" v-if="showBackendStatus">
              <el-alert
                :title="backendStatusMessage"
                :type="backendStatusType"
                :closable="false"
                show-icon
              >
                <template #default>
                  <div class="status-details">
                    <p>{{ backendStatusMessage }}</p>
                    <el-button
                      size="small"
                      type="primary"
                      @click="checkBackendStatus"
                      :loading="checkingBackend"
                    >
                      重新检查
                    </el-button>
                  </div>
                </template>
              </el-alert>
            </div>

            <form class="register-form" @submit.prevent="submitBasicInfo">
              <div class="form-group">
                <label>用户名</label>
                <el-input
                  v-model="registerForm.username"
                  placeholder="请输入用户名"
                  size="large"
                  :prefix-icon="User"
                />
                <div v-if="errors.username" class="error-text">{{ errors.username }}</div>
              </div>

              <div class="form-group">
                <label>密码</label>
                <el-input
                  v-model="registerForm.password"
                  type="password"
                  placeholder="请输入密码"
                  size="large"
                  :prefix-icon="Lock"
                  show-password
                />
                <div v-if="errors.password" class="error-text">{{ errors.password }}</div>
              </div>

              <div class="form-group">
                <label>确认密码</label>
                <el-input
                  v-model="registerForm.confirmPassword"
                  type="password"
                  placeholder="请再次输入密码"
                  size="large"
                  :prefix-icon="Lock"
                  show-password
                />
                <div v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</div>
              </div>

              <div class="form-group">
                <label>邮箱地址</label>
                <el-input
                  v-model="registerForm.email"
                  type="email"
                  placeholder="请输入邮箱地址"
                  size="large"
                  :prefix-icon="Message"
                />
                <div v-if="errors.email" class="error-text">{{ errors.email }}</div>
              </div>

              <div class="form-group">
                <label>手机号码</label>
                <el-input
                  v-model="registerForm.phone"
                  placeholder="请输入手机号码"
                  size="large"
                  :prefix-icon="Phone"
                />
                <div v-if="errors.phone" class="error-text">{{ errors.phone }}</div>
              </div>

              <div class="form-group">
                <label>真实姓名</label>
                <el-input
                  v-model="registerForm.realName"
                  placeholder="请输入真实姓名"
                  size="large"
                  :prefix-icon="UserFilled"
                />
                <div v-if="errors.realName" class="error-text">{{ errors.realName }}</div>
              </div>

              <div class="form-group">
                <label>用户角色</label>
                <el-select
                  v-model="registerForm.role"
                  placeholder="请选择用户角色"
                  size="large"
                  style="width: 100%"
                >
                  <el-option label="系统管理员" value="ADMIN" />
                  <el-option label="数据分析师" value="ANALYST" />
                  <el-option label="访客用户" value="VISITOR" />
                </el-select>
                <div v-if="errors.role" class="error-text">{{ errors.role }}</div>
              </div>

              <div class="form-actions">
                <el-button size="large" @click="currentStep = 1">
                  上一步
                </el-button>
                <el-button
                  type="primary"
                  size="large"
                  @click="submitBasicInfo"
                  :loading="submittingBasicInfo"
                >
                  下一步
                </el-button>
              </div>
            </form>
          </div>

          <!-- 步骤3: 邮箱验证 -->
          <div v-if="currentStep === 3" class="step-content">
            <div class="step-header">
              <h2>邮箱验证</h2>
              <p>我们已向 <strong>{{ registerForm.email }}</strong> 发送了验证码</p>
            </div>

            <div class="email-verification">
              <div class="email-info">
                <el-icon class="email-icon"><Message /></el-icon>
                <div class="email-text">
                  <div class="email-title">验证码已发送</div>
                  <div class="email-desc">请查看您的邮箱并输入6位验证码</div>
                </div>
              </div>

              <div class="verification-input">
                <el-input
                  v-model="emailVerificationCode"
                  placeholder="请输入6位验证码"
                  size="large"
                  maxlength="6"
                  @keyup.enter="verifyEmailCode"
                >
                  <template #prefix>
                    <el-icon><Key /></el-icon>
                  </template>
                </el-input>
              </div>

              <div class="verification-actions">
                <div class="resend-section">
                  <span v-if="resendCountdown > 0" class="countdown-text">
                    {{ resendCountdown }}秒后可重新发送
                  </span>
                  <el-button
                    v-else
                    text
                    type="primary"
                    @click="resendEmailCode"
                    :loading="resendingCode"
                  >
                    重新发送验证码
                  </el-button>
                </div>

                <div class="action-buttons">
                  <el-button size="large" @click="currentStep = 2">
                    上一步
                  </el-button>
                  <el-button
                    type="primary"
                    size="large"
                    @click="verifyEmailCode"
                    :loading="verifyingEmail"
                    :disabled="!emailVerificationCode || emailVerificationCode.length !== 6"
                  >
                    验证并注册
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 步骤4: 注册完成 -->
          <div v-if="currentStep === 4" class="step-content">
            <div class="success-content">
              <div class="success-icon">
                <el-icon><CircleCheck /></el-icon>
              </div>

              <div class="success-info">
                <h2>注册成功！</h2>
                <p>恭喜您，账户已创建成功</p>
              </div>

              <div class="account-summary">
                <div class="summary-item">
                  <span class="label">用户名:</span>
                  <span class="value">{{ registerForm.username }}</span>
                </div>
                <div class="summary-item">
                  <span class="label">邮箱:</span>
                  <span class="value">{{ registerForm.email }}</span>
                </div>
                <div class="summary-item">
                  <span class="label">角色:</span>
                  <span class="value">{{ getRoleName(registerForm.role) }}</span>
                </div>
              </div>

              <div class="success-actions">
                <el-button
                  type="primary"
                  size="large"
                  @click="goToLogin"
                  class="login-btn"
                >
                  立即登录
                </el-button>
                <el-button
                  size="large"
                  @click="resetForm"
                >
                  注册新账户
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  User,
  Lock,
  Message,
  Phone,
  UserFilled,
  DataAnalysis,
  Connection,
  Picture,
  Key,
  CircleCheck,
  Loading,
  Warning
} from '@element-plus/icons-vue'
import { useUserStore } from '../stores/user'
import { getCaptcha, sendEmailCode, verifyEmailCode as verifyEmailCodeAPI } from '../api/auth'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// 注册GSAP插件
gsap.registerPlugin(ScrollTrigger)

const router = useRouter()
const userStore = useUserStore()

// 当前步骤
const currentStep = ref(1)

// Turnstile验证相关
const turnstileLoading = ref(true)
const turnstileError = ref(false)
const turnstileToken = ref('')
const turnstileVerified = ref(false)
const verifyingCaptcha = ref(false)

// Cloudflare Turnstile配置
const TURNSTILE_SITE_KEY = '0x4AAAAAABizYCjBu4_tDqsB'

// 注册表单数据
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  phone: '',
  realName: '',
  role: ''
})

// 邮箱验证相关
const emailVerificationCode = ref('')
const resendCountdown = ref(0)
const resendingCode = ref(false)
const verifyingEmail = ref(false)

// 加载状态
const submittingBasicInfo = ref(false)

// 后端状态检查
const showBackendStatus = ref(false)
const backendStatusMessage = ref('')
const backendStatusType = ref('info')
const checkingBackend = ref(false)

// 表单验证错误
const errors = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  phone: '',
  realName: '',
  role: ''
})
// 获取角色名称
const getRoleName = (roleCode) => {
  const roleMap = {
    'ADMIN': '系统管理员',
    'ANALYST': '数据分析师',
    'VISITOR': '访客用户'
  }
  return roleMap[roleCode] || roleCode
}

// 初始化Turnstile
const initTurnstile = () => {
  turnstileLoading.value = true
  turnstileError.value = false
  turnstileToken.value = ''
  turnstileVerified.value = false

  // 确保Turnstile脚本已加载
  if (typeof window.turnstile === 'undefined') {
    // 如果Turnstile还未加载，等待一段时间后重试
    setTimeout(() => {
      if (typeof window.turnstile !== 'undefined') {
        renderTurnstile()
      } else {
        turnstileError.value = true
        turnstileLoading.value = false
        ElMessage.error('验证组件加载失败，请刷新页面重试')
      }
    }, 2000)
  } else {
    renderTurnstile()
  }
}

// 渲染Turnstile组件
const renderTurnstile = () => {
  try {
    // 清除之前的组件
    const container = document.getElementById('turnstile-widget')
    if (container) {
      container.innerHTML = ''
    }

    // 渲染新的Turnstile组件
    window.turnstile.render('#turnstile-widget', {
      sitekey: TURNSTILE_SITE_KEY,
      callback: onTurnstileSuccess,
      'error-callback': onTurnstileError,
      'expired-callback': onTurnstileExpired,
      theme: 'light',
      size: 'normal'
    })

    turnstileLoading.value = false
  } catch (error) {
    console.error('Turnstile渲染失败:', error)
    turnstileError.value = true
    turnstileLoading.value = false
    ElMessage.error('验证组件初始化失败')
  }
}

// Turnstile验证成功回调
const onTurnstileSuccess = (token) => {
  console.log('Turnstile验证成功:', token)
  turnstileToken.value = token
  turnstileVerified.value = true
  ElMessage.success('验证成功！')
}

// Turnstile验证错误回调
const onTurnstileError = (error) => {
  console.error('Turnstile验证错误:', error)
  turnstileToken.value = ''
  turnstileVerified.value = false
  ElMessage.error('验证失败，请重试')
}

// Turnstile验证过期回调
const onTurnstileExpired = () => {
  console.log('Turnstile验证已过期')
  turnstileToken.value = ''
  turnstileVerified.value = false
  ElMessage.warning('验证已过期，请重新验证')
}

// 进入下一步
const proceedToNextStep = () => {
  if (!turnstileVerified.value) {
    ElMessage.error('请先完成人机验证')
    return
  }

  verifyingCaptcha.value = true

  // 模拟验证过程
  setTimeout(() => {
    verifyingCaptcha.value = false
    currentStep.value = 2
    ElMessage.success('验证通过，请填写注册信息')

    // 进入第二步时检查后端状态
    setTimeout(() => {
      checkBackendStatus()
    }, 1000)
  }, 500)
}

// 验证基本信息表单
const validateBasicInfo = () => {
  // 清空之前的错误
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  let isValid = true

  // 用户名验证
  if (!registerForm.username) {
    errors.username = '请输入用户名'
    isValid = false
  } else if (registerForm.username.length < 3) {
    errors.username = '用户名至少3个字符'
    isValid = false
  } else if (registerForm.username.length > 20) {
    errors.username = '用户名不能超过20个字符'
    isValid = false
  }

  // 密码验证
  if (!registerForm.password) {
    errors.password = '请输入密码'
    isValid = false
  } else if (registerForm.password.length < 6) {
    errors.password = '密码至少6个字符'
    isValid = false
  }

  // 确认密码验证
  if (!registerForm.confirmPassword) {
    errors.confirmPassword = '请确认密码'
    isValid = false
  } else if (registerForm.confirmPassword !== registerForm.password) {
    errors.confirmPassword = '两次输入的密码不一致'
    isValid = false
  }

  // 邮箱验证
  if (!registerForm.email) {
    errors.email = '请输入邮箱地址'
    isValid = false
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(registerForm.email)) {
      errors.email = '请输入正确的邮箱格式'
      isValid = false
    }
  }

  // 手机号验证
  if (!registerForm.phone) {
    errors.phone = '请输入手机号码'
    isValid = false
  } else {
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(registerForm.phone)) {
      errors.phone = '请输入正确的手机号格式'
      isValid = false
    }
  }

  // 真实姓名验证
  if (!registerForm.realName) {
    errors.realName = '请输入真实姓名'
    isValid = false
  } else if (registerForm.realName.length < 2) {
    errors.realName = '姓名至少2个字符'
    isValid = false
  }

  // 角色验证
  if (!registerForm.role) {
    errors.role = '请选择用户角色'
    isValid = false
  }

  return isValid
}

// 检查后端状态
const checkBackendStatus = async () => {
  checkingBackend.value = true
  showBackendStatus.value = true

  try {
    // 尝试访问后端健康检查接口
    const response = await fetch('http://localhost:8080/api/mail/code', {
      method: 'OPTIONS'
    })

    if (response.ok) {
      backendStatusMessage.value = '后端服务连接正常'
      backendStatusType.value = 'success'
    } else {
      backendStatusMessage.value = `后端服务响应异常 (状态码: ${response.status})`
      backendStatusType.value = 'warning'
    }
  } catch (error) {
    console.error('后端连接失败:', error)
    backendStatusMessage.value = '无法连接到后端服务 (http://localhost:8080)，请确保后端服务器正在运行'
    backendStatusType.value = 'error'
  } finally {
    checkingBackend.value = false
  }
}

// 测试后端连接
const testBackendConnection = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/mail/code', {
      method: 'OPTIONS'
    })
    console.log('后端连接测试:', response.status)
    return response.ok
  } catch (error) {
    console.error('后端连接失败:', error)
    return false
  }
}

// 提交基本信息
const submitBasicInfo = async () => {
  if (!validateBasicInfo()) {
    return
  }

  // 先测试后端连接
  const isBackendAvailable = await testBackendConnection()
  if (!isBackendAvailable) {
    ElMessage.error('无法连接到后端服务，请确保后端服务器正在运行在 http://localhost:8080')
    return
  }

  try {
    submittingBasicInfo.value = true

    // 构建发送邮件验证码的数据
    const emailData = {
      user: {
        username: registerForm.username,
        email: registerForm.email
      },
      role: {
        roleName: getRoleName(registerForm.role)
      }
    }

    // 调试信息
    console.log('发送邮件验证码请求:', {
      url: '/api/mail/code',
      method: 'POST',
      data: emailData
    })

    // 发送邮件验证码
    const response = await sendEmailCode(emailData)

    console.log('邮件验证码响应:', response)

    if (response.status === 0) {
      ElMessage.success('验证码已发送到您的邮箱')
      currentStep.value = 3
      startResendCountdown()
    } else {
      ElMessage.error(response.message || '发送验证码失败')
    }
  } catch (error) {
    console.error('发送验证码失败:', error)

    // 详细的错误处理
    if (error.response) {
      // 服务器返回了错误状态码
      const status = error.response.status
      const data = error.response.data

      console.error('服务器错误:', {
        status,
        data,
        url: error.config?.url
      })

      if (status === 500) {
        ElMessage.error(`服务器内部错误: ${data.message || '请检查后端服务是否正常运行'}`)
      } else if (status === 404) {
        ElMessage.error('API接口不存在，请检查后端服务')
      } else if (status === 400) {
        ElMessage.error(`请求参数错误: ${data.message || '请检查数据格式'}`)
      } else {
        ElMessage.error(`请求失败 (${status}): ${data.message || error.message}`)
      }
    } else if (error.request) {
      // 请求发出但没有收到响应
      console.error('网络错误:', error.request)
      ElMessage.error('网络连接失败，请检查后端服务是否启动')
    } else {
      // 其他错误
      console.error('未知错误:', error.message)
      ElMessage.error(`发送验证码失败: ${error.message}`)
    }
  } finally {
    submittingBasicInfo.value = false
  }
}

// 开始重发倒计时
const startResendCountdown = () => {
  resendCountdown.value = 60
  const timer = setInterval(() => {
    resendCountdown.value--
    if (resendCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 重新发送邮件验证码
const resendEmailCode = async () => {
  try {
    resendingCode.value = true

    const emailData = {
      user: {
        username: registerForm.username,
        email: registerForm.email
      },
      role: {
        roleName: getRoleName(registerForm.role)
      }
    }

    const response = await sendEmailCode(emailData)

    if (response.status === 0) {
      ElMessage.success('验证码已重新发送')
      startResendCountdown()
    } else {
      ElMessage.error(response.message || '发送验证码失败')
    }
  } catch (error) {
    console.error('重新发送验证码失败:', error)
    ElMessage.error('发送验证码失败，请重试')
  } finally {
    resendingCode.value = false
  }
}

// 验证邮件验证码
const verifyEmailCode = async () => {
  if (!emailVerificationCode.value || emailVerificationCode.value.length !== 6) {
    ElMessage.error('请输入6位验证码')
    return
  }

  try {
    verifyingEmail.value = true

    // 验证邮件验证码
    const response = await verifyEmailCodeAPI(registerForm.email, emailVerificationCode.value)

    if (response.status === 0) {
      ElMessage.success('验证成功，正在创建账户...')

      // 验证成功后进行注册
      await performRegistration()
    } else {
      ElMessage.error(response.message || '验证码错误')
    }
  } catch (error) {
    console.error('验证邮件验证码失败:', error)

    // 详细的错误处理
    if (error.response) {
      const status = error.response.status
      const data = error.response.data

      console.error('验证码验证错误:', {
        status,
        data,
        email: registerForm.email,
        code: emailVerificationCode.value
      })

      if (status === 500) {
        ElMessage.error(`服务器错误: ${data.message || '请稍后重试'}`)
      } else if (status === 400) {
        ElMessage.error(`验证失败: ${data.message || '验证码错误或已过期'}`)
      } else {
        ElMessage.error(`验证失败 (${status}): ${data.message || error.message}`)
      }
    } else if (error.request) {
      ElMessage.error('网络连接失败，请检查网络连接')
    } else {
      ElMessage.error(`验证失败: ${error.message}`)
    }
  } finally {
    verifyingEmail.value = false
  }
}

// 执行注册
const performRegistration = async () => {
  try {
    // 构建注册数据
    const registerData = {
      user: {
        username: registerForm.username,
        password: registerForm.password,
        email: registerForm.email,
        phone: registerForm.phone,
        realName: registerForm.realName
      },
      roles: [{
        roleName: getRoleName(registerForm.role),
        roleCode: registerForm.role
      }]
    }

    const result = await userStore.registerAction(registerData)

    if (result.success) {
      currentStep.value = 4
      ElMessage.success('注册成功！')
    } else {
      ElMessage.error(result.message || '注册失败')
    }
  } catch (error) {
    console.error('注册失败:', error)
    ElMessage.error('注册失败，请重试')
  }
}

// 跳转到登录页面
const goToLogin = () => {
  router.push('/login')
}

// 重置表单
const resetForm = () => {
  currentStep.value = 1
  captchaCode.value = ''
  emailVerificationCode.value = ''
  Object.keys(registerForm).forEach(key => {
    registerForm[key] = ''
  })
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  loadCaptcha()
}

// GSAP时间线
let pageTimeline = null

// 初始化页面动画
const initPageAnimations = () => {
  // 设置初始状态
  gsap.set('.register-container', { opacity: 0 })
  gsap.set('.info-panel', { x: -100, opacity: 0 })
  gsap.set('.form-panel', { x: 100, opacity: 0 })
  gsap.set('.step-item', { y: 30, opacity: 0 })
  gsap.set('.feature-item', { x: -20, opacity: 0 })

  // 创建主时间线
  pageTimeline = gsap.timeline()

  // 页面动画序列
  pageTimeline
    .to('.register-container', {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    })
    .to('.info-panel', {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.3")
    .to('.form-panel', {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.6")
    .to('.step-item', {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=0.4")
    .to('.feature-item', {
      x: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=0.3")
}

// 组件挂载时启动动画
onMounted(() => {
  // 初始化页面动画
  initPageAnimations()

  // 初始化Turnstile
  initTurnstile()
})

// 组件卸载时清理动画
onUnmounted(() => {
  if (pageTimeline) {
    pageTimeline.kill()
  }
})
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-wrapper {
  display: flex;
  max-width: 1200px;
  width: 100%;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-height: 700px;
}

/* 左侧信息面板 */
.info-panel {
  flex: 1;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
}

.brand-section {
  text-align: center;
  margin-bottom: 40px;
}

.brand-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: #ecf0f1;
}

.brand-subtitle {
  font-size: 16px;
  color: #bdc3c7;
  margin: 0;
}

/* 步骤指示器 */
.steps-indicator {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin: 40px 0;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 16px;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.step-item.active {
  opacity: 1;
}

.step-item.completed {
  opacity: 0.8;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
}

.step-item.active .step-number {
  background: #3498db;
  color: white;
}

.step-item.completed .step-number {
  background: #27ae60;
  color: white;
}

.step-info {
  flex: 1;
}

.step-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.step-desc {
  font-size: 14px;
  color: #bdc3c7;
}

/* 功能特性列表 */
.features-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #ecf0f1;
}

.feature-item .el-icon {
  font-size: 18px;
  color: #3498db;
}

/* 右侧表单面板 */
.form-panel {
  flex: 1;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-container {
  width: 100%;
  max-width: 400px;
}

.step-content {
  width: 100%;
}

.step-header {
  text-align: center;
  margin-bottom: 30px;
}

.step-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.step-header p {
  color: #7f8c8d;
  margin: 0;
  font-size: 14px;
}

/* Turnstile验证部分 */
.turnstile-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.turnstile-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border-left: 4px solid #3498db;
}

.info-icon {
  font-size: 32px;
  color: #3498db;
}

.info-text h3 {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 4px 0;
}

.info-text p {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
}

.turnstile-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-height: 120px;
  position: relative;
}

.turnstile-widget {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 65px;
  width: 100%;
}

.widget-loading {
  opacity: 0.5;
}

.turnstile-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #7f8c8d;
  font-size: 14px;
}

.loading-icon {
  font-size: 24px;
  animation: spin 1s linear infinite;
}

.turnstile-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #e74c3c;
  font-size: 14px;
  text-align: center;
  padding: 20px;
  background: #fdf2f2;
  border-radius: 8px;
  border: 1px solid #fecaca;
}

.verification-status {
  display: flex;
  justify-content: center;
  min-height: 32px;
}

.status-success {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #27ae60;
  font-size: 14px;
  font-weight: 500;
}

.status-verifying {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #3498db;
  font-size: 14px;
}

.rotating {
  animation: spin 1s linear infinite;
}

.turnstile-actions {
  display: flex;
  justify-content: center;
}

.verify-btn {
  width: 100%;
  height: 48px;
  transition: all 0.3s ease;
}

.verify-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 后端状态检查 */
.backend-status {
  margin-bottom: 20px;
}

.status-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-details p {
  margin: 0;
  font-size: 14px;
}

/* 注册表单 */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
}

.error-text {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.form-actions .el-button {
  flex: 1;
  height: 48px;
}

/* 邮箱验证 */
.email-verification {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.email-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #3498db;
}

.email-icon {
  font-size: 24px;
  color: #3498db;
}

.email-text {
  flex: 1;
}

.email-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.email-desc {
  font-size: 14px;
  color: #7f8c8d;
}

.verification-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.resend-section {
  text-align: center;
}

.countdown-text {
  font-size: 14px;
  color: #7f8c8d;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-buttons .el-button {
  flex: 1;
  height: 48px;
}

/* 注册成功 */
.success-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.success-icon {
  display: flex;
  justify-content: center;
}

.success-icon .el-icon {
  font-size: 80px;
  color: #27ae60;
}

.success-info h2 {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.success-info p {
  color: #7f8c8d;
  margin: 0;
}

.account-summary {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-item .label {
  font-size: 14px;
  color: #7f8c8d;
}

.summary-item .value {
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
}

.success-actions {
  display: flex;
  gap: 12px;
}

.success-actions .el-button {
  flex: 1;
  height: 48px;
}

.login-btn {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  border: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .register-wrapper {
    flex-direction: column;
    max-width: 500px;
    margin: 10px;
  }

  .info-panel {
    padding: 30px 20px;
  }

  .brand-title {
    font-size: 24px;
  }

  .steps-indicator {
    flex-direction: row;
    gap: 20px;
    margin: 20px 0;
    overflow-x: auto;
  }

  .step-item {
    flex-direction: column;
    text-align: center;
    min-width: 80px;
  }

  .step-number {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  .step-title {
    font-size: 12px;
  }

  .step-desc {
    font-size: 10px;
  }

  .features-list {
    display: none;
  }

  .form-panel {
    padding: 30px 20px;
  }

  .form-actions,
  .action-buttons,
  .success-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .register-container {
    padding: 10px;
  }

  .captcha-image,
  .captcha-placeholder {
    width: 160px;
    height: 64px;
  }

  .step-header h2 {
    font-size: 20px;
  }
}
</style>
