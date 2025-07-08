<template>
  <div class="home-container">
    <!-- Navigation -->
    <Navbar />

    <!-- Hero Section -->
    <section class="hero-section" ref="heroRef">
      <div class="hero-background">
        <div class="floating-particles">
          <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></div>
        </div>
      </div>
      
      <div class="hero-content">
        <div class="hero-text" :class="{ 'animate-in': heroVisible }">
          <h1 class="hero-title">
            <span class="title-line">健康大数据</span>
            <span class="title-line">统计分析平台</span>
          </h1>
          <p class="hero-subtitle">
            基于大数据技术，整合医疗、产业、气象数据，
            <br>构建智能化的健康数据分析决策系统
          </p>
          <div class="hero-buttons">
            <button class="cta-button primary" @click="goToLogin">
              开始使用
              <svg class="button-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M5,13L9,17L7.6,18.42L1.18,12L7.6,5.58L9,7L5,11H21V13H5M21,6V8H11V6H21M21,16V18H11V16H21Z"/>
              </svg>
            </button>
            <button class="cta-button secondary" @click="scrollToDemo">
              观看演示
            </button>
          </div>
        </div>
        
        <div class="hero-visual" :class="{ 'animate-in': heroVisible }">
          <div class="dashboard-preview">
            <div class="preview-header">
              <div class="preview-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
            <div class="preview-content">
              <div class="chart-placeholder">
                <div class="chart-bars">
                  <div v-for="i in 8" :key="i" class="bar" :style="{ height: Math.random() * 80 + 20 + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section" ref="statsRef">
      <div class="container">
        <div class="stats-grid" :class="{ 'animate-in': statsVisible }">
          <div class="stat-card" v-for="(stat, index) in stats" :key="index" :style="{ animationDelay: index * 0.2 + 's' }">
            <div class="stat-icon">{{ stat.icon }}</div>
            <div class="stat-number">{{ animatedStats[stat.key] }}{{ stat.suffix }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section" ref="featuresRef" id="features">
      <div class="container">
        <div class="section-header" :class="{ 'animate-in': featuresVisible }">
          <h2>强大的功能特性</h2>
          <p>为医疗健康行业提供全方位的数据分析解决方案</p>
        </div>
        
        <div class="features-grid">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="feature-card"
            :class="{ 'animate-in': featuresVisible, 'expanded': expandedFeature === index }"
            :style="{ animationDelay: index * 0.15 + 's' }"
            @click="toggleFeature(index)"
          >
            <div class="feature-icon">
              <component :is="feature.icon" />
            </div>
            <div class="feature-content">
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>

              <div class="feature-details" v-if="expandedFeature === index">
                <div class="feature-benefits">
                  <h4>核心优势</h4>
                  <ul>
                    <li v-for="benefit in feature.benefits" :key="benefit">{{ benefit }}</li>
                  </ul>
                </div>

                <div class="feature-tech">
                  <h4>技术特点</h4>
                  <div class="tech-tags">
                    <span v-for="tech in feature.technologies" :key="tech" class="tech-tag">{{ tech }}</span>
                  </div>
                </div>

                <div class="feature-action">
                  <button class="feature-button" @click.stop="goToLogin">
                    了解更多
                    <svg class="button-icon" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="expand-indicator">
                <svg class="expand-icon" :class="{ 'rotated': expandedFeature === index }" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo Section -->
    <section class="demo-section" ref="demoRef" id="demo">
      <div class="container">
        <div class="section-header" :class="{ 'animate-in': demoVisible }">
          <h2>产品演示</h2>
          <p>体验强大的健康大数据分析功能</p>
        </div>

        <div class="demo-tabs" :class="{ 'animate-in': demoVisible }">
          <div class="tab-buttons">
            <button
              v-for="(tab, index) in demoTabs"
              :key="index"
              class="tab-button"
              :class="{ 'active': activeTab === index }"
              @click="switchTab(index)"
            >
              <div class="tab-icon">{{ tab.icon }}</div>
              <span>{{ tab.title }}</span>
            </button>
          </div>

          <div class="tab-content">
            <div v-for="(tab, index) in demoTabs" :key="index" class="tab-panel" :class="{ 'active': activeTab === index }">
              <div class="demo-content">
                <div class="demo-text">
                  <h3>{{ tab.title }}</h3>
                  <p>{{ tab.description }}</p>
                  <ul class="demo-features">
                    <li v-for="feature in tab.features" :key="feature">{{ feature }}</li>
                  </ul>
                  <button class="demo-button" @click="goToLogin">
                    体验功能
                    <svg class="button-icon" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M5,13L9,17L7.6,18.42L1.18,12L7.6,5.58L9,7L5,11H21V13H5M21,6V8H11V6H21M21,16V18H11V16H21Z"/>
                    </svg>
                  </button>
                </div>

                <div class="demo-visual">
                  <div class="demo-dashboard">
                    <div class="dashboard-header">
                      <div class="dashboard-title">{{ tab.title }}</div>
                      <div class="dashboard-status">
                        <span class="status-dot active"></span>
                        <span>实时更新</span>
                      </div>
                    </div>

                    <div class="dashboard-content">
                      <!-- 数据分析图表 -->
                      <div v-if="activeTab === 0" class="chart-container">
                        <div class="chart-header">
                          <h4>患者流量趋势</h4>
                          <div class="chart-controls">
                            <span class="control-item active">日</span>
                            <span class="control-item">周</span>
                            <span class="control-item">月</span>
                          </div>
                        </div>
                        <div class="line-chart-wrapper">
                          <svg viewBox="0 0 400 200" class="animated-chart">
                            <defs>
                              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style="stop-color:#6366f1;stop-opacity:0.3"/>
                                <stop offset="100%" style="stop-color:#6366f1;stop-opacity:0"/>
                              </linearGradient>
                            </defs>
                            <path
                              d="M 20 160 L 60 140 L 100 120 L 140 100 L 180 110 L 220 90 L 260 80 L 300 70 L 340 60 L 380 50"
                              stroke="#6366f1"
                              stroke-width="3"
                              fill="none"
                              class="chart-line"
                            />
                            <path
                              d="M 20 160 L 60 140 L 100 120 L 140 100 L 180 110 L 220 90 L 260 80 L 300 70 L 340 60 L 380 50 L 380 180 L 20 180 Z"
                              fill="url(#chartGradient)"
                              class="chart-area"
                            />
                          </svg>
                        </div>
                      </div>

                      <!-- 医疗机构管理 -->
                      <div v-if="activeTab === 1" class="hospital-grid">
                        <div v-for="hospital in sampleHospitals" :key="hospital.id" class="hospital-card">
                          <div class="hospital-status" :class="hospital.status"></div>
                          <div class="hospital-info">
                            <h4>{{ hospital.name }}</h4>
                            <p>床位使用率: {{ hospital.bedUsage }}%</p>
                            <p>在线医生: {{ hospital.doctors }}人</p>
                          </div>
                        </div>
                      </div>

                      <!-- 实时监控 -->
                      <div v-if="activeTab === 2" class="monitoring-dashboard">
                        <div class="metric-cards">
                          <div v-for="metric in realTimeMetrics" :key="metric.label" class="metric-card">
                            <div class="metric-value">{{ metric.value }}</div>
                            <div class="metric-label">{{ metric.label }}</div>
                            <div class="metric-trend" :class="metric.trend">
                              {{ metric.change }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="about-section" ref="aboutRef" id="about">
      <div class="container">
        <div class="about-content" :class="{ 'animate-in': aboutVisible }">
          <div class="about-text">
            <div class="section-header">
              <h2>关于我们</h2>
              <p>致力于推动健康大数据技术创新与应用</p>
            </div>

            <div class="about-description">
              <p>我们是一家专注于健康大数据分析的科技公司，拥有多年的医疗信息化经验。通过整合医疗、产业、气象等多维度数据，为医疗机构、政府部门和研究机构提供专业的数据分析服务。</p>

              <div class="about-highlights">
                <div class="highlight-item">
                  <div class="highlight-icon">🎯</div>
                  <div class="highlight-content">
                    <h4>专业团队</h4>
                    <p>汇聚医疗信息化、大数据分析、人工智能等领域的专业人才</p>
                  </div>
                </div>

                <div class="highlight-item">
                  <div class="highlight-icon">🚀</div>
                  <div class="highlight-content">
                    <h4>技术创新</h4>
                    <p>采用最新的大数据技术和机器学习算法，确保分析结果的准确性</p>
                  </div>
                </div>

                <div class="highlight-item">
                  <div class="highlight-icon">🤝</div>
                  <div class="highlight-content">
                    <h4>服务承诺</h4>
                    <p>提供7×24小时技术支持，确保系统稳定运行和数据安全</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="about-visual">
            <div class="team-showcase">
              <div class="showcase-header">
                <h3>核心团队</h3>
              </div>
              <div class="team-grid">
                <div v-for="(member, index) in teamMembers" :key="index" class="team-member">
                  <div class="member-avatar">
                    <div class="avatar-placeholder">{{ member.initial }}</div>
                  </div>
                  <div class="member-info">
                    <h4>{{ member.name }}</h4>
                    <p>{{ member.position }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section" ref="ctaRef">
      <div class="container">
        <div class="cta-content" :class="{ 'animate-in': ctaVisible }">
          <h2>准备开始您的数据分析之旅？</h2>
          <p>立即注册，体验强大的健康大数据分析平台</p>
          <div class="cta-buttons">
            <button class="cta-button primary large" @click="goToRegister">
              免费注册
            </button>
            <button class="cta-button secondary large" @click="goToLogin">
              立即登录
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  DataAnalysis,
  UserFilled,
  House,
  Tools,
  Money
} from '@element-plus/icons-vue'
import Navbar from '../components/Navbar.vue'
import { gsap } from 'gsap'

const router = useRouter()

// 引用元素
const heroRef = ref()
const statsRef = ref()
const featuresRef = ref()
const demoRef = ref()
const aboutRef = ref()
const ctaRef = ref()

// GSAP时间线
let heroTimeline = null
let statsTimeline = null
let featuresTimeline = null
let demoTimeline = null
let aboutTimeline = null
let ctaTimeline = null

// 可见性状态 - 直接显示所有内容
const heroVisible = ref(true)
const statsVisible = ref(true)
const featuresVisible = ref(true)
const demoVisible = ref(true)
const aboutVisible = ref(true)
const ctaVisible = ref(true)

// 交互状态
const expandedFeature = ref(null)
const activeTab = ref(0)

// 动画统计数据
const animatedStats = reactive({
  users: 0,
  hospitals: 0,
  data: 0,
  uptime: 0
})

// 统计数据配置
const stats = [
  { key: 'users', icon: '👥', label: '注册用户', suffix: 'M+' },
  { key: 'hospitals', icon: '🏥', label: '合作医院', suffix: '+' },
  { key: 'data', icon: '📊', label: '数据处理量', suffix: 'TB' },
  { key: 'uptime', icon: '⚡', label: '系统可用性', suffix: '%' }
]

// 功能特性
const features = [
  {
    icon: 'DataAnalysis',
    title: '智能数据分析',
    description: '运用机器学习算法，深度挖掘健康数据价值，提供精准的分析结果。',
    benefits: [
      '支持多种数据源整合',
      '实时数据处理能力',
      '智能异常检测',
      '预测性分析模型'
    ],
    technologies: ['机器学习', '深度学习', '数据挖掘', '统计分析']
  },
  {
    icon: 'Hospital',
    title: '医疗机构管理',
    description: '全面管理医疗机构信息，实时监控运营状况，优化资源配置。',
    benefits: [
      '统一机构信息管理',
      '实时运营监控',
      '资源优化配置',
      '绩效评估分析'
    ],
    technologies: ['云计算', '微服务', '实时监控', '数据可视化']
  },
  {
    icon: 'UserFilled',
    title: '人员统计分析',
    description: '详细分析医护人员分布和工作效率，为人力资源决策提供支持。',
    benefits: [
      '人员结构分析',
      '工作效率评估',
      '排班优化建议',
      '培训需求识别'
    ],
    technologies: ['人力资源分析', '工作流分析', '效率评估', '智能排班']
  },
  {
    icon: 'House',
    title: '床位使用分析',
    description: '实时监控床位使用情况，优化床位分配，提高医疗资源利用率。',
    benefits: [
      '实时床位状态监控',
      '使用率趋势分析',
      '智能分配建议',
      '周转效率优化'
    ],
    technologies: ['IoT传感器', '实时数据流', '优化算法', '预测模型']
  },
  {
    icon: 'Tools',
    title: '服务质量评估',
    description: '多维度评估医疗服务质量，持续改进服务水平。',
    benefits: [
      '多维度质量指标',
      '患者满意度分析',
      '服务流程优化',
      '质量改进建议'
    ],
    technologies: ['质量管理', '流程分析', '满意度调研', '持续改进']
  },
  {
    icon: 'Money',
    title: '费用统计分析',
    description: '全面分析医疗费用构成，控制成本，提高经济效益。',
    benefits: [
      '费用结构透明化',
      '成本控制建议',
      '收益分析报告',
      '预算规划支持'
    ],
    technologies: ['财务分析', '成本核算', '预算管理', '收益优化']
  }
]

// 演示标签页数据
const demoTabs = [
  {
    icon: '📊',
    title: '数据分析',
    description: '实时分析医疗健康数据，提供深度洞察和智能建议。',
    features: [
      '多维度数据整合',
      '实时分析处理',
      '智能预测模型',
      '可视化报表'
    ]
  },
  {
    icon: '🏥',
    title: '医疗机构管理',
    description: '全面管理医疗机构运营，优化资源配置和服务质量。',
    features: [
      '机构信息管理',
      '运营状态监控',
      '资源配置优化',
      '绩效评估分析'
    ]
  },
  {
    icon: '📈',
    title: '实时监控',
    description: '24/7实时监控系统状态，确保数据安全和服务稳定。',
    features: [
      '系统状态监控',
      '异常自动告警',
      '性能优化建议',
      '安全防护机制'
    ]
  }
]

// 团队成员数据
const teamMembers = [
  { name: '张博士', position: '技术总监', initial: '张' },
  { name: '李教授', position: '数据科学家', initial: '李' },
  { name: '王工程师', position: '架构师', initial: '王' },
  { name: '陈分析师', position: '业务专家', initial: '陈' }
]

// 示例医院数据
const sampleHospitals = [
  { id: 1, name: '市第一医院', bedUsage: 85, doctors: 24, status: 'normal' },
  { id: 2, name: '中心医院', bedUsage: 92, doctors: 18, status: 'busy' },
  { id: 3, name: '人民医院', bedUsage: 78, doctors: 31, status: 'normal' },
  { id: 4, name: '儿童医院', bedUsage: 95, doctors: 15, status: 'critical' }
]

// 实时监控指标
const realTimeMetrics = [
  { label: '在线用户', value: '1,234', change: '+5.2%', trend: 'up' },
  { label: '数据处理量', value: '2.5TB', change: '+12.8%', trend: 'up' },
  { label: '系统响应时间', value: '0.8s', change: '-15.3%', trend: 'down' },
  { label: '服务可用性', value: '99.9%', change: '+0.1%', trend: 'up' }
]

// 粒子样式生成和动画
const getParticleStyle = (index) => {
  const style = {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
  }

  // 使用GSAP为每个粒子创建动画
  setTimeout(() => {
    const particles = document.querySelectorAll('.particle')
    const particle = particles[index]
    if (particle) {
      gsap.to(particle, {
        y: -100,
        x: Math.random() * 200 - 100,
        rotation: 360,
        duration: Math.random() * 10 + 10,
        repeat: -1,
        ease: "none",
        delay: Math.random() * 5
      })
    }
  }, 500 + index * 100) // 增加延迟确保DOM已渲染

  return style
}

// GSAP数字动画
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

// 元素存在检查函数
const elementExists = (selector) => {
  const element = document.querySelector(selector)
  return element !== null
}

const elementsExist = (selector) => {
  const elements = document.querySelectorAll(selector)
  return elements.length > 0
}

// 初始化GSAP动画
const initGSAPAnimations = () => {
  // Hero Section 动画
  heroTimeline = gsap.timeline({ paused: true })
  heroTimeline
    .from('.hero-text', {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out"
    })
    .from('.title-line', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out"
    }, "-=0.8")
    .from('.hero-subtitle', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4")
    .from('.hero-visual', {
      x: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out"
    }, "-=1.0")
    .from('.hero-buttons .cta-button', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "back.out(1.7)"
    }, "-=0.6")

  // Stats Section 动画
  statsTimeline = gsap.timeline({ paused: true })
  statsTimeline
    .from('.stat-card', {
      y: 80,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      onComplete: () => {
        // 数字计数动画 - 延迟启动以增加戏剧效果
        setTimeout(() => {
          animateNumber(50000, 'users', 2.5)
          animateNumber(120, 'hospitals', 2.0)
          animateNumber(1000000, 'data', 3.0)
          animateNumber(99.9, 'uptime', 2.2)
        }, 300)
      }
    })

  // Features Section 动画 - 直接设置为可见状态
  featuresTimeline = gsap.timeline({ paused: false })
  featuresTimeline
    .set('.section-header', {
      y: 0,
      opacity: 1
    })
    .set('.feature-card', {
      y: 0,
      opacity: 1
    })

  // Demo Section 动画
  demoTimeline = gsap.timeline({ paused: true })

  // 使用更安全的选择器和检查
  if (elementExists('#demo .section-header')) {
    demoTimeline.from('#demo .section-header', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    })
  }

  if (elementsExist('.demo-tabs .tab-button')) {
    demoTimeline.from('.demo-tabs .tab-button', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=0.5")
  }

  if (elementExists('.demo-tabs .tab-content')) {
    demoTimeline.from('.demo-tabs .tab-content', {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.3")
  }

  // About Section 动画
  aboutTimeline = gsap.timeline({ paused: true })

  // 使用更安全的选择器和检查
  if (elementExists('#about .section-header')) {
    aboutTimeline.from('#about .section-header', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    })
  }

  if (elementExists('.about-description')) {
    aboutTimeline.from('.about-description', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.5")
  }

  if (elementsExist('.highlight-item')) {
    aboutTimeline.from('.highlight-item', {
      x: -30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out"
    }, "-=0.3")
  }

  if (elementExists('.about-visual')) {
    aboutTimeline.from('.about-visual', {
      x: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.8")
  }

  // CTA Section 动画
  ctaTimeline = gsap.timeline({ paused: true })
  ctaTimeline
    .from('.cta-content', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    })
    .from('.cta-buttons .cta-button', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "back.out(1.7)"
    }, "-=0.5")
}

// 设置悬停动画
const setupHoverAnimations = () => {
  // 等待DOM渲染完成
  setTimeout(() => {
    // 磁性按钮效果
    document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('mouseenter', () => {
      gsap.to(button, {
        scale: 1.05,
        y: -3,
        duration: 0.3,
        ease: "power2.out"
      })
    })

    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        scale: 1,
        y: 0,
        x: 0,
        duration: 0.3,
        ease: "power2.out"
      })
    })

    // 磁性跟随效果
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      gsap.to(button, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out"
      })
    })
  })

  // 卡片悬停效果
  document.querySelectorAll('.stat-card, .feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -10,
        scale: 1.02,
        duration: 0.4,
        ease: "power2.out"
      })
    })

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      })
    })
  })

  // 导航链接悬停效果
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
      gsap.to(link, {
        color: "#6366f1",
        duration: 0.3,
        ease: "power2.out"
      })
    })

    link.addEventListener('mouseleave', () => {
      gsap.to(link, {
        color: "#64748b",
        duration: 0.3,
        ease: "power2.out"
      })
    })
  })
  }, 100) // 延迟确保DOM已渲染
}

// 直接设置所有元素为可见状态
const playAllAnimations = () => {
  // 强制显示所有元素
  gsap.set('.section-header', { opacity: 1, y: 0 })
  gsap.set('.feature-card', { opacity: 1, y: 0 })
  gsap.set('.stat-card', { opacity: 1, y: 0 })
  gsap.set('.demo-content', { opacity: 1, y: 0 })
  gsap.set('.about-content', { opacity: 1, y: 0 })
  gsap.set('.cta-content', { opacity: 1, y: 0 })

  console.log('🎬 所有元素已强制设置为可见状态')
}

// 滚动监听（保留用于其他功能）
const handleScroll = () => {
  // 可以在这里添加其他滚动相关的逻辑
}

// 导航方法
const goToLogin = () => router.push('/login')
const goToRegister = () => router.push('/register')
const scrollToDemo = () => {
  document.getElementById('demo').scrollIntoView({ behavior: 'smooth' })
}

// 功能特性交互
const toggleFeature = (index) => {
  expandedFeature.value = expandedFeature.value === index ? null : index
}

// 演示标签页切换
const switchTab = (index) => {
  activeTab.value = index
}

// 页面加载动画
const pageLoadAnimation = () => {
  const container = document.querySelector('.home-container')
  if (container) {
    // 确保容器可见
    gsap.set(container, { opacity: 1 })

    // 立即显示Hero内容
    heroVisible.value = true

    // 播放Hero动画
    setTimeout(() => {
      if (heroTimeline) heroTimeline.play()
    }, 100)
  }
}

// 生命周期
onMounted(() => {
  console.log('🚫 GSAP动画已禁用，所有内容直接显示')

  // 确保所有元素可见
  setTimeout(() => {
    const elements = document.querySelectorAll('.section-header, .feature-card, .stat-card, .features-grid')
    elements.forEach(el => {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
      el.style.visibility = 'visible'
    })
    console.log('✅ 强制设置', elements.length, '个元素为可见状态')
  }, 100)

  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)

  // 清理GSAP动画
  if (heroTimeline) heroTimeline.kill()
  if (statsTimeline) statsTimeline.kill()
  if (featuresTimeline) featuresTimeline.kill()
  if (demoTimeline) demoTimeline.kill()
  if (ctaTimeline) ctaTimeline.kill()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.home-container {
  width: 100%;
  min-height: 100vh;
  overflow-x: auto;
  /* 确保GSAP动画流畅 */
  will-change: opacity;
  opacity: 1; /* 确保容器可见 */
}

/* Hero Section */
.hero-section {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  padding-top: 80px; /* 为固定导航栏留出空间 */
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
  width: 100%;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(99, 102, 241, 0.3);
  border-radius: 50%;
  animation: float-particle 15s infinite linear;
}

@keyframes float-particle {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 80px;
  position: relative;
  z-index: 1;
  width: 100%;
  box-sizing: border-box;
}

.hero-text {
  flex: 1;
  min-width: 0;
}

/* GSAP will handle animations */

.hero-title {
  font-size: 64px;
  font-weight: 700;
  line-height: 1.1;
  margin: 0 0 24px 0;
  color: #1e293b;
}

.title-line {
  display: block;
  background: linear-gradient(135deg, #1e293b 0%, #6366f1 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 20px;
  line-height: 1.6;
  color: #64748b;
  margin: 0 0 40px 0;
}

.hero-buttons {
  display: flex;
  gap: 20px;
}

.cta-button {
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  text-decoration: none;
  /* GPU加速和GSAP优化 */
  transform: translateZ(0);
  will-change: transform, scale;
  backface-visibility: hidden;
}

.cta-button.primary {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
}

.cta-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
}

.cta-button.secondary {
  background: white;
  color: #64748b;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.cta-button.secondary:hover {
  background: #f8fafc;
  color: #1e293b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cta-button.large {
  padding: 20px 40px;
  font-size: 18px;
}

.button-icon {
  width: 20px;
  height: 20px;
}

.hero-visual {
  flex: 1;
  min-width: 0;
}

/* GSAP will handle animations */

.dashboard-preview {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.preview-header {
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.preview-dots {
  display: flex;
  gap: 8px;
}

.preview-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #cbd5e1;
}

.preview-dots span:first-child {
  background: #ff5f57;
}

.preview-dots span:nth-child(2) {
  background: #ffbd2e;
}

.preview-dots span:nth-child(3) {
  background: #28ca42;
}

.preview-content {
  padding: 40px;
  height: 300px;
}

.chart-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: end;
  justify-content: center;
}

.chart-bars {
  display: flex;
  gap: 12px;
  align-items: end;
  height: 200px;
}

.bar {
  width: 20px;
  background: linear-gradient(to top, #6366f1, #a855f7);
  border-radius: 4px 4px 0 0;
  animation: bar-grow 2s ease-out;
  animation-delay: calc(var(--i) * 0.1s);
}

@keyframes bar-grow {
  from {
    height: 0;
  }
  to {
    height: var(--height);
  }
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

/* Stats Section */
.stats-section {
  padding: 120px 0;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s ease-out;
}

.stat-card {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.stat-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.15);
  border-color: #6366f1;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.stat-number {
  font-size: 48px;
  font-weight: 700;
  color: #6366f1;
  margin-bottom: 8px;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
}

.stat-label {
  font-size: 16px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Features Section */
.features-section {
  padding: 120px 0;
  background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
  opacity: 1 !important;
  transform: translateY(0) !important;
  transition: none !important;
}

/* GSAP handles animations */

.section-header h2 {
  font-size: 48px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.section-header p {
  font-size: 20px;
  color: #64748b;
  margin: 0;
}

.features-grid {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  opacity: 1 !important;
  transform: translateY(0) !important;
}

.feature-card {
  padding: 40px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  opacity: 1 !important; /* 强制显示 */
  transform: translateY(0) !important; /* 强制显示 */
}

.feature-card.expanded {
  transform: scale(1.02);
  box-shadow: 0 25px 50px rgba(99, 102, 241, 0.2);
  border-color: #6366f1;
  z-index: 10;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.15);
  border-color: #6366f1;
}

.feature-content {
  position: relative;
}

.feature-details {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #e2e8f0;
  text-align: left;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-benefits h4,
.feature-tech h4 {
  color: #1e293b;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
}

.feature-benefits ul {
  list-style: none;
  padding: 0;
  margin: 0 0 25px 0;
}

.feature-benefits li {
  padding: 8px 0;
  color: #64748b;
  position: relative;
  padding-left: 20px;
}

.feature-benefits li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #10b981;
  font-weight: bold;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 25px;
}

.tech-tag {
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.feature-button {
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.feature-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
}

.expand-indicator {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 24px;
  height: 24px;
}

.expand-icon {
  width: 100%;
  height: 100%;
  color: #94a3b8;
  transition: transform 0.3s ease;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

/* 3D地图卡片样式 */
.map-card {
  grid-column: span 2;
  padding: 0;
  cursor: default;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: none;
  overflow: hidden;
  min-height: 600px;
  display: flex;
  flex-direction: column;
}

.map-card:hover {
  transform: none;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

.map-card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.map-icon {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.map-card-title h3 {
  color: white;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.map-card-title p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 0;
}

.map-card-content {
  flex: 1;
  padding: 0;
  position: relative;
  min-height: 400px;
}

.map-card-stats {
  display: flex;
  justify-content: space-around;
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.stat-item {
  text-align: center;
  color: white;
}

.stat-number {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.feature-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px auto;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
}

.feature-card h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.feature-card p {
  font-size: 16px;
  line-height: 1.6;
  color: #64748b;
  margin: 0;
}

/* Demo Section */
.demo-section {
  padding: 120px 0;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.demo-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s ease-out;
}

/* GSAP handles animations */

.demo-text h2 {
  font-size: 48px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 24px 0;
}

.demo-text p {
  font-size: 20px;
  line-height: 1.6;
  color: #64748b;
  margin: 0 0 32px 0;
}

.demo-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.demo-features li {
  padding: 12px 0;
  color: #475569;
  font-size: 18px;
  position: relative;
  padding-left: 32px;
}

.demo-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #6366f1;
  font-weight: bold;
}

.demo-visual {
  position: relative;
}

.demo-chart {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 30px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 20px;
}

.chart-content {
  height: 200px;
  position: relative;
}

.line-chart {
  width: 100%;
  height: 100%;
}

.chart-path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw-line 3s ease-out forwards;
}

@keyframes draw-line {
  to {
    stroke-dashoffset: 0;
  }
}

/* Demo Tabs Styles */
.demo-tabs {
  margin-top: 60px;
}

.tab-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 60px;
}

.tab-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 32px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
}

.tab-button:hover {
  border-color: #6366f1;
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.15);
}

.tab-button.active {
  border-color: #6366f1;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(99, 102, 241, 0.3);
}

.tab-icon {
  font-size: 32px;
}

.tab-button span {
  font-weight: 600;
  font-size: 16px;
}

.tab-content {
  position: relative;
}

.tab-panel {
  display: none;
  animation: fadeInUp 0.5s ease-out;
}

.tab-panel.active {
  display: block;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.demo-dashboard {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: linear-gradient(135deg, #1e293b, #334155);
  color: white;
}

.dashboard-title {
  font-size: 20px;
  font-weight: 600;
}

.dashboard-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
}

.status-dot.active {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.dashboard-content {
  padding: 32px;
}

.chart-container {
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.chart-header h4 {
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
}

.chart-controls {
  display: flex;
  gap: 8px;
}

.control-item {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  border: 1px solid #e2e8f0;
}

.control-item:hover {
  border-color: #6366f1;
}

.control-item.active {
  background: #6366f1;
  color: white;
  border-color: #6366f1;
}

.line-chart-wrapper {
  height: 200px;
}

.animated-chart {
  width: 100%;
  height: 100%;
}

.chart-line {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawLine 3s ease-out forwards;
}

.chart-area {
  opacity: 0;
  animation: fadeInArea 2s ease-out 1s forwards;
}

@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes fadeInArea {
  to {
    opacity: 1;
  }
}

.hospital-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.hospital-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #e2e8f0;
  transition: all 0.3s ease;
}

.hospital-card:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.hospital-card .hospital-status.normal {
  border-left-color: #10b981;
}

.hospital-card .hospital-status.busy {
  border-left-color: #f59e0b;
}

.hospital-card .hospital-status.critical {
  border-left-color: #ef4444;
}

.hospital-status {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #10b981;
  flex-shrink: 0;
}

.hospital-status.busy {
  background: #f59e0b;
}

.hospital-status.critical {
  background: #ef4444;
  animation: pulse 2s infinite;
}

.hospital-info h4 {
  color: #1e293b;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.hospital-info p {
  color: #64748b;
  font-size: 14px;
  margin: 4px 0;
}

.monitoring-dashboard .metric-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.metric-card {
  text-align: center;
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.metric-value {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.metric-label {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 8px;
}

.metric-trend {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  display: inline-block;
}

.metric-trend.up {
  background: #dcfce7;
  color: #16a34a;
}

.metric-trend.down {
  background: #fef2f2;
  color: #dc2626;
}

.demo-button {
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  margin-top: 24px;
}

.demo-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
}

/* About Section */
.about-section {
  padding: 120px 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: flex-start;
}

.about-description {
  margin-top: 30px;
}

.about-description > p {
  font-size: 18px;
  line-height: 1.8;
  color: #64748b;
  margin-bottom: 40px;
}

.about-highlights {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.highlight-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.highlight-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.highlight-content h4 {
  color: #1e293b;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.highlight-content p {
  color: #64748b;
  line-height: 1.6;
}

.team-showcase {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.showcase-header h3 {
  color: #1e293b;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 30px;
  text-align: center;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.team-member {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  border-radius: 12px;
  background: #f8fafc;
  transition: all 0.3s ease;
}

.team-member:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.member-avatar {
  margin-bottom: 16px;
}

.avatar-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
}

.member-info h4 {
  color: #1e293b;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.member-info p {
  color: #64748b;
  font-size: 14px;
}

/* CTA Section */
.cta-section {
  padding: 120px 0;
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
}

.cta-content {
  text-align: center;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
}

/* GSAP handles animations */

.cta-content h2 {
  font-size: 48px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.cta-content p {
  font-size: 20px;
  color: #64748b;
  margin: 0 0 40px 0;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-content {
    flex-direction: column;
    gap: 60px;
    text-align: center;
  }

  .hero-title {
    font-size: 48px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .map-card {
    grid-column: span 2;
    min-height: 500px;
  }

  .demo-content {
    grid-template-columns: 1fr;
    gap: 60px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 20px;
  }

  .hero-title {
    font-size: 36px;
  }

  .hero-subtitle {
    font-size: 18px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .map-card {
    grid-column: span 1;
    min-height: 400px;
  }

  .map-card-stats {
    flex-direction: column;
    gap: 16px;
  }

  .section-header h2 {
    font-size: 36px;
  }

  .demo-text h2 {
    font-size: 36px;
  }

  .cta-content h2 {
    font-size: 36px;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>
