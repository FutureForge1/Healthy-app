<template>
  <nav class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="nav-container">
      <div class="nav-brand" @click="goHome">
        <div class="brand-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="brand-text">健康大数据平台</span>
      </div>
      
      <div class="nav-menu" :class="{ 'active': menuOpen }">
        <a href="#features" class="nav-link" @click="scrollToSection('features')">功能特性</a>
        <a href="#demo" class="nav-link" @click="scrollToSection('demo')">产品演示</a>
        <a href="#about" class="nav-link" @click="scrollToSection('about')">关于我们</a>
      </div>
      
      <div class="nav-actions">
        <!-- 未登录状态显示登录注册按钮 -->
        <template v-if="!userStore.isLoggedIn">
          <button class="nav-button secondary" @click="goToLogin">登录</button>
          <button class="nav-button primary" @click="goToRegister">注册</button>
        </template>

        <!-- 已登录状态显示用户信息和退出按钮 -->
        <template v-else>
          <div class="user-info">
            <span class="username">{{ userStore.userInfo.username }}</span>
            <div class="user-dropdown">
              <button class="nav-button secondary dropdown-toggle" @click="toggleUserMenu">
                <svg class="user-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>

              <div class="dropdown-menu" :class="{ 'active': userMenuOpen }">
                <a href="#" class="dropdown-item" @click.prevent="goToDashboard">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  仪表板
                </a>
                <a href="#" class="dropdown-item" @click.prevent="handleLogout">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="16,17 21,12 16,7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  退出登录
                </a>
              </div>
            </div>
          </div>
        </template>

        <button class="mobile-menu-toggle" @click="toggleMenu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const isScrolled = ref(false)
const menuOpen = ref(false)
const userMenuOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
  // 触发菜单动画
  setTimeout(() => {
    if (menuOpen.value) {
      gsap.to('.nav-menu', {
        opacity: 1,
        y: 0,
        visibility: 'visible',
        duration: 0.3,
        ease: "power2.out"
      })
    } else {
      gsap.to('.nav-menu', {
        opacity: 0,
        y: -20,
        visibility: 'hidden',
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }, 0)
}

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
  menuOpen.value = false
}

const goHome = () => {
  router.push('/')
}

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}

const goToDashboard = () => {
  router.push('/app/dashboard')
  userMenuOpen.value = false
}

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const handleLogout = () => {
  userStore.logout()
  userMenuOpen.value = false
  router.push('/')
}

// 初始化Navbar - 确保可见性
const initNavbarAnimations = () => {
  // 立即确保所有元素可见，不使用动画
  const navbar = document.querySelector('.navbar')
  if (navbar) {
    navbar.style.opacity = '1'
    navbar.style.visibility = 'visible'
    navbar.style.transform = 'translateY(0)'
  }

  const brand = document.querySelector('.nav-brand')
  if (brand) {
    brand.style.opacity = '1'
    brand.style.transform = 'scale(1) rotate(0deg)'
  }

  const navLinks = document.querySelectorAll('.nav-link')
  navLinks.forEach(link => {
    link.style.opacity = '1'
    link.style.transform = 'translateY(0)'
  })

  const navButtons = document.querySelectorAll('.nav-button')
  navButtons.forEach(button => {
    button.style.opacity = '1'
    button.style.transform = 'scale(1)'
  })
}

// 设置导航栏交互动画
const setupNavbarInteractions = () => {
  // 品牌logo悬停效果
  const brand = document.querySelector('.nav-brand')
  if (brand) {
    brand.addEventListener('mouseenter', () => {
      const brandIcon = document.querySelector('.brand-icon')
      if (brandIcon) {
        gsap.to(brandIcon, {
          rotation: 360,
          duration: 0.6,
          ease: "power2.out"
        })
      }
    })
  }

  // 导航链接悬停效果
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
      gsap.to(link, {
        y: -2,
        duration: 0.3,
        ease: "power2.out"
      })
    })

    link.addEventListener('mouseleave', () => {
      gsap.to(link, {
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      })
    })
  })

  // 按钮悬停效果
  document.querySelectorAll('.nav-button').forEach(button => {
    button.addEventListener('mouseenter', () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      })
    })

    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      })
    })
  })
}

// 点击外部关闭菜单
const handleClickOutside = (event) => {
  if (!event.target) return

  const userDropdown = document.querySelector('.user-dropdown')
  if (userDropdown && !userDropdown.contains(event.target)) {
    userMenuOpen.value = false
  }

  const mobileMenu = document.querySelector('.nav-menu')
  const mobileToggle = document.querySelector('.mobile-menu-toggle')
  if (mobileMenu && mobileToggle &&
      !mobileMenu.contains(event.target) &&
      !mobileToggle.contains(event.target)) {
    menuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)

  // 立即初始化导航栏
  initNavbarAnimations()

  // 延迟设置交互动画
  setTimeout(() => {
    setupNavbarInteractions()
  }, 200)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  transition: background 0.3s ease, border-color 0.3s ease;
  opacity: 1 !important; /* 强制确保导航栏可见 */
  visibility: visible !important;
  transform: translateY(0) !important;
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-brand:hover {
  transform: scale(1.05);
}

.brand-icon {
  width: 32px;
  height: 32px;
  color: #6366f1;
}

.brand-icon svg {
  width: 100%;
  height: 100%;
}

.brand-text {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  color: #64748b;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #6366f1;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #6366f1, #a855f7);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-button {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  text-decoration: none;
}

.nav-button.primary {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
}

.nav-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}

.nav-button.secondary {
  background: transparent;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.nav-button.secondary:hover {
  background: #f8fafc;
  color: #1e293b;
  border-color: #cbd5e1;
}

/* 用户信息样式 */
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.username {
  color: #1e293b;
  font-weight: 500;
  font-size: 14px;
}

.user-dropdown {
  position: relative;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dropdown-toggle:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.user-icon,
.dropdown-arrow {
  width: 16px;
  height: 16px;
  color: #64748b;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  min-width: 180px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1000;
}

.dropdown-menu.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  color: #64748b;
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 4px;
}

.dropdown-item:hover {
  background: #f8fafc;
  color: #1e293b;
}

.dropdown-item svg {
  width: 16px;
  height: 16px;
}

.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.mobile-menu-toggle span {
  width: 24px;
  height: 2px;
  background: #64748b;
  transition: all 0.3s ease;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 20px;
  }
  
  .nav-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    border: 1px solid #e2e8f0;
    flex-direction: column;
    padding: 20px;
    gap: 20px;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .user-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 0;
    border-top: 1px solid #e2e8f0;
    margin-top: 12px;
  }

  .username {
    font-size: 16px;
  }

  .dropdown-menu {
    position: static;
    opacity: 1;
    visibility: visible;
    transform: none;
    box-shadow: none;
    border: none;
    background: transparent;
    margin-top: 8px;
  }

  .dropdown-toggle {
    display: none;
  }
  
  .nav-menu.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .mobile-menu-toggle {
    display: flex;
  }
  
  .brand-text {
    display: none;
  }
}
</style>
