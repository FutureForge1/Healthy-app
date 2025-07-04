<template>
  <div class="login-container">
    <!-- 背景动画元素 -->
    <div class="background-animation">
      <div class="floating-orb orb-1"></div>
      <div class="floating-orb orb-2"></div>
      <div class="floating-orb orb-3"></div>
    </div>

    <!-- 主要内容 -->
    <div class="main-content">
      <!-- 左侧信息面板 -->
      <div class="info-panel">
        <div class="brand-section">
          <div class="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1 class="brand-title">健康大数据平台</h1>
          <p class="brand-subtitle">统计分析决策系统</p>
        </div>

        <div class="stats-section">
          <div class="stat-item">
            <div class="stat-number">{{ animatedStats.users }}M+</div>
            <div class="stat-label">用户数据</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ animatedStats.hospitals }}+</div>
            <div class="stat-label">医疗机构</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ animatedStats.uptime }}%</div>
            <div class="stat-label">系统可用性</div>
          </div>
        </div>

        <div class="features-section">
          <div class="feature-item">
            <div class="feature-icon">📊</div>
            <div class="feature-text">实时数据分析</div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🏥</div>
            <div class="feature-text">医疗机构管理</div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔒</div>
            <div class="feature-text">数据安全保护</div>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-panel">
        <div class="glass-card">
          <div class="card-header">
            <h2>欢迎回来</h2>
            <p>登录您的健康大数据账户</p>
          </div>

          <form class="login-form" @submit.prevent="handleLogin">
            <div class="input-group">
              <div class="input-wrapper">
                <input
                  v-model="loginForm.username"
                  required
                  class="modern-input"
                  type="text"
                  placeholder=" "
                  id="username"
                >
                <label for="username" class="floating-label">用户名</label>
                <div class="input-border"></div>
              </div>
              <div v-if="usernameError" class="error-message">{{ usernameError }}</div>
            </div>

            <div class="input-group">
              <div class="input-wrapper">
                <input
                  v-model="loginForm.password"
                  required
                  class="modern-input"
                  type="password"
                  placeholder=" "
                  id="password"
                  @keyup.enter="handleLogin"
                >
                <label for="password" class="floating-label">密码</label>
                <div class="input-border"></div>
              </div>
              <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
            </div>

            <div class="form-options">
              <label class="checkbox-wrapper">
                <input type="checkbox" class="checkbox">
                <span class="checkmark"></span>
                记住我
              </label>
              <a href="#" class="forgot-link" @click.prevent="goToRegister">还没有账号？</a>
            </div>

            <button
              class="modern-button"
              type="submit"
              :disabled="loading"
            >
              <span v-if="!loading">登录</span>
              <div v-else class="loading-spinner"></div>
            </button>
          </form>

          <div class="divider">
            <span>或者</span>
          </div>

          <div class="social-login">
            <button class="social-btn google">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button class="social-btn wechat">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55l-.59 1.765 2.042-1.024c.747.141 1.543.212 2.237.212 4.8 0 8.691-3.288 8.691-7.342 0-4.054-3.891-7.503-8.691-7.503zm-2.46 9.544c-.509 0-.919-.411-.919-.918 0-.506.41-.917.919-.917s.919.411.919.917c0 .507-.41.918-.919.918zm4.919 0c-.509 0-.919-.411-.919-.918 0-.506.41-.917.919-.917s.918.411.918.917c0 .507-.409.918-.918.918z"/>
                <path fill="currentColor" d="M23.999 14.6c0-3.26-3.289-5.9-7.332-5.9-4.043 0-7.332 2.64-7.332 5.9 0 3.26 3.289 5.9 7.332 5.9.824 0 1.619-.12 2.332-.334l1.8.902-.5-1.49c1.522-1.121 2.7-2.748 2.7-4.978zm-9.764-1.025c-.424 0-.765-.34-.765-.76 0-.42.341-.76.765-.76s.765.34.765.76c0 .42-.341.76-.765.76zm4.666 0c-.424 0-.765-.34-.765-.76 0-.42.341-.76.765-.76s.765.34.765.76c0 .42-.341.76-.765.76z"/>
              </svg>
              微信
            </button>
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
import { useUserStore } from '../stores/user'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// 注册GSAP插件
gsap.registerPlugin(ScrollTrigger)

const router = useRouter()
const userStore = useUserStore()

// 加载状态
const loading = ref(false)

// 动画统计数据
const animatedStats = reactive({
  users: 0,
  hospitals: 0,
  uptime: 0
})

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 表单验证错误信息
const usernameError = computed(() => {
  if (!loginForm.username) return ''
  if (loginForm.username.length < 3) return '用户名至少3个字符'
  if (loginForm.username.length > 20) return '用户名不能超过20个字符'
  return ''
})

const passwordError = computed(() => {
  if (!loginForm.password) return ''
  if (loginForm.password.length < 6) return '密码至少6个字符'
  if (loginForm.password.length > 20) return '密码不能超过20个字符'
  return ''
})

// GSAP时间线
let pageTimeline = null

// GSAP数字动画函数
const animateNumber = (target, key, duration = 2) => {
  gsap.to(animatedStats, {
    [key]: target,
    duration: duration,
    ease: "power2.out",
    onUpdate: () => {
      animatedStats[key] = Math.floor(animatedStats[key])
    }
  })
}

// 初始化页面动画
const initPageAnimations = () => {
  // 设置初始状态
  gsap.set('.login-container', { opacity: 0 })
  gsap.set('.info-panel', { x: -100, opacity: 0 })
  gsap.set('.login-panel', { x: 100, opacity: 0 })
  gsap.set('.floating-orb', { scale: 0, rotation: 0 })

  // 创建主时间线
  pageTimeline = gsap.timeline()

  // 页面淡入
  pageTimeline
    .to('.login-container', {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    })
    // 背景球体动画
    .to('.floating-orb', {
      scale: 1,
      duration: 1.5,
      stagger: 0.3,
      ease: "elastic.out(1, 0.5)"
    }, "-=0.3")
    // 左侧面板滑入
    .to('.info-panel', {
      x: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out"
    }, "-=1.0")
    // 右侧登录面板滑入
    .to('.login-panel', {
      x: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out"
    }, "-=0.8")
    // 品牌元素动画
    .from('.brand-icon', {
      scale: 0,
      rotation: 180,
      duration: 0.8,
      ease: "back.out(1.7)"
    }, "-=1.0")
    .from('.brand-title', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.6")
    .from('.brand-subtitle', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    }, "-=0.4")
    // 统计数据动画
    .from('.stat-item', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
      onComplete: () => {
        // 数字计数动画
        animateNumber(2.5, 'users', 2)
        animateNumber(120, 'hospitals', 2.5)
        animateNumber(99.9, 'uptime', 2.2)
      }
    }, "-=0.5")
    // 功能特性动画
    .from('.feature-item', {
      x: -30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: "power3.out"
    }, "-=0.8")
    // 登录表单动画
    .from('.login-header', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=1.0")
    .from('.form-group', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=0.6")
    .from('.login-button', {
      y: 20,
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      ease: "back.out(1.7)"
    }, "-=0.4")
    .from('.register-link', {
      y: 15,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    }, "-=0.3")
}

// 设置交互动画
const setupInteractiveAnimations = () => {
  // 登录按钮悬停效果
  const loginButton = document.querySelector('.login-button')
  if (loginButton) {
    loginButton.addEventListener('mouseenter', () => {
      gsap.to(loginButton, {
        scale: 1.05,
        y: -2,
        duration: 0.3,
        ease: "power2.out"
      })
    })

    loginButton.addEventListener('mouseleave', () => {
      gsap.to(loginButton, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      })
    })
  }

  // 输入框聚焦动画
  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', () => {
      gsap.to(input.parentElement, {
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out"
      })
    })

    input.addEventListener('blur', () => {
      gsap.to(input.parentElement, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      })
    })
  })

  // 统计卡片悬停效果
  document.querySelectorAll('.stat-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      gsap.to(item, {
        y: -5,
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      })
    })

    item.addEventListener('mouseleave', () => {
      gsap.to(item, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      })
    })
  })

  // 功能特性悬停效果
  document.querySelectorAll('.feature-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      gsap.to(item.querySelector('.feature-icon'), {
        scale: 1.2,
        rotation: 10,
        duration: 0.3,
        ease: "power2.out"
      })
    })

    item.addEventListener('mouseleave', () => {
      gsap.to(item.querySelector('.feature-icon'), {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out"
      })
    })
  })
}

// 背景球体持续动画
const setupBackgroundAnimations = () => {
  // 球体浮动动画
  gsap.to('.orb-1', {
    y: -20,
    x: 10,
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  })

  gsap.to('.orb-2', {
    y: 15,
    x: -15,
    duration: 5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: 1
  })

  gsap.to('.orb-3', {
    y: -10,
    x: 20,
    duration: 6,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: 2
  })
}

// 表单验证
const validateForm = () => {
  if (!loginForm.username) {
    ElMessage.error('请输入用户名')
    return false
  }
  if (!loginForm.password) {
    ElMessage.error('请输入密码')
    return false
  }
  if (usernameError.value) {
    ElMessage.error(usernameError.value)
    return false
  }
  if (passwordError.value) {
    ElMessage.error(passwordError.value)
    return false
  }
  return true
}

// 处理登录
const handleLogin = async () => {
  if (!validateForm()) return

  try {
    loading.value = true

    const result = await userStore.loginAction(loginForm)

    if (result.success) {
      // 登录成功，跳转到仪表板
      router.push('/app/dashboard')
    }
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}

// 跳转到注册页面
const goToRegister = () => {
  router.push('/register')
}

// 组件挂载时启动动画
onMounted(() => {
  // 初始化页面动画
  initPageAnimations()

  // 设置背景动画
  setTimeout(() => {
    setupBackgroundAnimations()
  }, 1000)

  // 设置交互动画
  setTimeout(() => {
    setupInteractiveAnimations()
  }, 1500)
})

// 组件卸载时清理动画
onUnmounted(() => {
  if (pageTimeline) {
    pageTimeline.kill()
  }
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped>
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  overflow: hidden;
}

.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-orb {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
  backdrop-filter: blur(1px);
  animation: float 6s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 200px;
  height: 200px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.orb-3 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  left: 60%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(120deg); }
  66% { transform: translateY(10px) rotate(240deg); }
}

.main-content {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}

.info-panel {
  flex: 1;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
}

.brand-section {
  margin-bottom: 60px;
}

.brand-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 24px;
  color: #6366f1;
}

.brand-icon svg {
  width: 100%;
  height: 100%;
}

.brand-title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 12px 0;
  background: linear-gradient(135deg, #ffffff 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.stats-section {
  display: flex;
  gap: 40px;
  margin-bottom: 60px;
}

.stat-item {
  text-align: left;
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  color: #6366f1;
  margin-bottom: 8px;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.features-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
}

.feature-icon {
  font-size: 24px;
  width: 40px;
  text-align: center;
}

.feature-text {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
}

.login-panel {
  flex: 0 0 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.glass-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.card-header {
  text-align: center;
  margin-bottom: 32px;
}

.card-header h2 {
  font-size: 28px;
  font-weight: 600;
  color: white;
  margin: 0 0 8px 0;
}

.card-header p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-wrapper {
  position: relative;
}

.modern-input {
  width: 100%;
  padding: 16px 16px 16px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.modern-input:focus {
  outline: none;
  border-color: #6366f1;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.modern-input::placeholder {
  color: transparent;
}

.floating-label {
  position: absolute;
  left: 16px;
  top: 16px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  transition: all 0.3s ease;
  pointer-events: none;
  background: transparent;
}

.modern-input:focus + .floating-label,
.modern-input:not(:placeholder-shown) + .floating-label {
  top: -8px;
  left: 12px;
  font-size: 12px;
  color: #6366f1;
  background: rgba(15, 15, 35, 0.8);
  padding: 0 8px;
  border-radius: 4px;
}

.input-border {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #6366f1, #a855f7);
  transition: width 0.3s ease;
}

.modern-input:focus ~ .input-border {
  width: 100%;
}

.error-message {
  color: #ef4444;
  font-size: 14px;
  margin-left: 4px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  cursor: pointer;
}

.checkbox {
  width: 16px;
  height: 16px;
  accent-color: #6366f1;
}

.forgot-link {
  color: #6366f1;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #a855f7;
}

.modern-button {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
}

.modern-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

.modern-button:active:not(:disabled) {
  transform: translateY(0);
}

.modern-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.divider {
  text-align: center;
  margin: 24px 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.divider span {
  background: rgba(15, 15, 35, 1);
  padding: 0 16px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  position: relative;
}

.social-login {
  display: flex;
  gap: 12px;
}

.social-btn {
  flex: 1;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.social-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.social-btn svg {
  width: 18px;
  height: 18px;
}

.social-btn.google:hover {
  border-color: #4285f4;
  color: #4285f4;
}

.social-btn.wechat:hover {
  border-color: #07c160;
  color: #07c160;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }

  .info-panel {
    flex: none;
    padding: 40px 20px 20px 20px;
    text-align: center;
  }

  .brand-title {
    font-size: 36px;
  }

  .stats-section {
    justify-content: center;
    gap: 30px;
  }

  .features-section {
    display: none;
  }

  .login-panel {
    flex: none;
    padding: 20px;
  }

  .glass-card {
    padding: 30px 20px;
  }
}

@media (max-width: 768px) {
  .stats-section {
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }

  .social-login {
    flex-direction: column;
  }
}
</style>
