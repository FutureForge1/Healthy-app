<template>
  <div class="sidebar-demo">
    <div class="demo-header">
      <h1>现代化侧边栏设计</h1>
      <p>这是一个现代化的侧边栏设计演示，具有以下特性：</p>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">
          <el-icon><Expand /></el-icon>
        </div>
        <h3>可折叠设计</h3>
        <p>支持侧边栏展开和收起，节省屏幕空间</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">
          <el-icon><Star /></el-icon>
        </div>
        <h3>精美动画</h3>
        <p>使用 GSAP 实现流畅的动画效果</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">
          <el-icon><User /></el-icon>
        </div>
        <h3>用户信息卡片</h3>
        <p>显示用户头像、姓名和角色信息</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">
          <el-icon><Menu /></el-icon>
        </div>
        <h3>多级菜单</h3>
        <p>支持多级菜单展开和收起</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">
          <el-icon><Setting /></el-icon>
        </div>
        <h3>主题切换</h3>
        <p>支持深色和浅色主题切换</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">
          <el-icon><Monitor /></el-icon>
        </div>
        <h3>响应式设计</h3>
        <p>适配不同屏幕尺寸，移动端友好</p>
      </div>
    </div>

    <div class="demo-section">
      <h2>设计特点</h2>
      <div class="design-points">
        <div class="point">
          <h4>🎨 现代化视觉</h4>
          <p>采用渐变背景、毛玻璃效果和精美的阴影</p>
        </div>
        <div class="point">
          <h4>⚡ 流畅交互</h4>
          <p>GSAP 动画库提供丝滑的交互体验</p>
        </div>
        <div class="point">
          <h4>🔧 高度可定制</h4>
          <p>支持主题切换、图标自定义等功能</p>
        </div>
        <div class="point">
          <h4>📱 响应式布局</h4>
          <p>完美适配桌面端和移动端设备</p>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>技术栈</h2>
      <div class="tech-stack">
        <div class="tech-item">
          <span class="tech-name">Vue 3</span>
          <span class="tech-desc">组合式 API</span>
        </div>
        <div class="tech-item">
          <span class="tech-name">Element Plus</span>
          <span class="tech-desc">UI 组件库</span>
        </div>
        <div class="tech-item">
          <span class="tech-name">GSAP</span>
          <span class="tech-desc">动画库</span>
        </div>
        <div class="tech-item">
          <span class="tech-name">CSS3</span>
          <span class="tech-desc">现代样式</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import {
  Expand,
  Star,
  User,
  Menu,
  Setting,
  Monitor
} from '@element-plus/icons-vue'

onMounted(() => {
  // 页面加载动画
  gsap.fromTo('.demo-header', 
    { y: -50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
  )
  
  gsap.fromTo('.feature-card', 
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.3, ease: "power2.out" }
  )
  
  gsap.fromTo('.demo-section', 
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, stagger: 0.2, delay: 0.8, ease: "power2.out" }
  )
})
</script>

<style scoped>
.sidebar-demo {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 60px;
}

.demo-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 16px;
}

.demo-header p {
  font-size: 1.1rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 60px;
}

.feature-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.feature-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  font-size: 24px;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}

.feature-card p {
  color: #64748b;
  line-height: 1.6;
}

.demo-section {
  margin-bottom: 60px;
}

.demo-section h2 {
  font-size: 2rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 32px;
  text-align: center;
}

.design-points {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.point {
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  border-left: 4px solid #3b82f6;
}

.point h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.point p {
  color: #64748b;
  line-height: 1.6;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.tech-item {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 120px;
}

.tech-name {
  font-weight: 600;
  font-size: 1rem;
}

.tech-desc {
  font-size: 0.875rem;
  opacity: 0.9;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar-demo {
    padding: 20px;
  }
  
  .demo-header h1 {
    font-size: 2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .design-points {
    grid-template-columns: 1fr;
  }
}
</style>
