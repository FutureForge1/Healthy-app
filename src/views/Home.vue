<template>
  <div class="home-container" ref="homeContainer">
    <!-- Navigation -->
    <Navbar />

    <!-- Hero Section -->
    <section class="hero-section" ref="heroRef">
      <div class="hero-background">
        <div class="floating-particles">
          <div v-for="i in 15" :key="i" class="particle" :style="getParticleStyle(i)"></div>
        </div>
        <div class="chengdu-landmarks">
          <div class="landmark landmark-1">🏮</div>
          <div class="landmark landmark-2">🎋</div>
          <div class="landmark landmark-3">🌸</div>
          <div class="landmark landmark-4">🐼</div>
        </div>
      </div>
      
      <div class="hero-content">
        <div class="hero-text" :class="{ 'animate-in': heroVisible }">
          <h1 class="hero-title">
            <span class="title-line">天府健康云</span>
            <span class="title-line">成都大数据分析平台</span>
          </h1>
          <p class="hero-subtitle">
            立足天府之国，基于大数据技术整合蓉城医疗、产业、气象数据，
            <br>构建智慧成都健康数据分析决策系统
          </p>
          <div class="chengdu-elements">
            <div class="panda-icon">🐼</div>
            <div class="location-tag">📍 成都市</div>
            <div class="culture-tag">🏮 天府文化</div>
          </div>
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
      <!-- Background Elements -->
      <div class="demo-background">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
      </div>

      <div class="demo-container">
        <div class="demo-sticky-content">
          <div class="demo-left">
            <!-- Section Header -->
            <div class="demo-header">
              <div class="demo-badge">
                <span class="badge-icon">✨</span>
                产品演示
              </div>
              <h2 class="demo-title">体验强大的健康大数据分析功能</h2>
              <p class="demo-subtitle">探索我们的创新解决方案，让数据驱动您的决策</p>
            </div>

            <!-- Features Description -->
            <div class="demo-description">
              <p class="description-text">
                我们的健康大数据平台集成了多种先进的分析工具和可视化技术，为用户提供全面的数据洞察。
                通过地理信息系统展示成都市各区县的人口分布情况，帮助决策者了解人口密度和区域差异。
                平台支持多年度医院等级分布趋势分析，为医疗资源配置和政策制定提供数据支撑。
              </p>

              <p class="description-text">
                系统提供完善的用户信息管理功能，支持多角色权限控制和个性化设置，确保数据安全和访问控制。
                集成ARIMA、SARIMA、NeuralProphet、TBATS等多种机器学习模型，
                为用户提供专业的数据预测和分析服务，支持灵活的算法选择和参数调优。
              </p>

              <p class="description-text">
                平台采用现代化的界面设计和交互体验，支持实时数据更新和多维度数据展示，
                让复杂的健康数据变得直观易懂，助力科学决策和精准管理。
              </p>
            </div>

            <!-- CTA Buttons -->
            <div class="demo-actions">
              <button class="demo-button primary" @click="goToLogin">
                <span>立即体验</span>
                <div class="button-glow"></div>
                <svg class="button-icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M5,13L9,17L7.6,18.42L1.18,12L7.6,5.58L9,7L5,11H21V13H5M21,6V8H11V6H21M21,16V18H11V16H21Z"/>
                </svg>
              </button>
              <button class="demo-button secondary" @click="goToRegister">
                <span>免费注册</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Right Side - Scrollable Images -->
        <div class="demo-right">
          <div class="demo-images-container">
            <div class="demo-image-item" v-for="(image, index) in demoImages" :key="index">
              <div class="demo-image-wrapper">
                <img :src="image.src" :alt="image.alt" class="demo-image">
                <div class="image-overlay">
                  <div class="overlay-content">
                    <div class="image-title">{{ image.title }}</div>
                    <div class="image-description">{{ image.description }}</div>
                    <button class="view-button">
                      <span>查看详情</span>
                      <svg viewBox="0 0 24 24" class="arrow-icon">
                        <path fill="currentColor" d="M5,13L9,17L7.6,18.42L1.18,12L7.6,5.58L9,7L5,11H21V13H5M21,6V8H11V6H21M21,16V18H11V16H21Z"/>
                      </svg>
                    </button>
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
              <p>我们是一支专注于健康大数据分析的创新团队，致力于通过先进的数据科学技术推动医疗健康行业的数字化转型。团队成员共同为成都市健康大数据平台的建设贡献力量。</p>

              <div class="about-highlights">
                <div class="highlight-item">
                  <div class="highlight-icon">🎯</div>
                  <div class="highlight-content">
                    <h4>核心团队</h4>
                    <p>由靳皓、夏瑜麒、石京民、侯睿组成的专业团队，涵盖项目管理、技术架构、数据分析、前端开发等关键领域</p>
                  </div>
                </div>

                <div class="highlight-item">
                  <div class="highlight-icon">🚀</div>
                  <div class="highlight-content">
                    <h4>技术创新</h4>
                    <p>运用Vue.js、ECharts、机器学习等前沿技术，构建高效、直观的健康数据分析平台</p>
                  </div>
                </div>

                <div class="highlight-item">
                  <div class="highlight-icon">🤝</div>
                  <div class="highlight-content">
                    <h4>协作精神</h4>
                    <p>团队成员紧密协作，发挥各自专业优势，共同打造优质的数据分析解决方案</p>
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

    <!-- 光标探照灯区域 - 蓝色渐变背景版 -->
    <section class="spotlight-section" ref="spotlightRef">
      <div class="spotlight-content">
        <!-- 第一屏：空白区域 -->
        <div class="spotlight-screen screen-1">
          <div class="container">
            <!-- 纯净的光效体验，无文字内容 -->
          </div>
        </div>

        <!-- 第二屏：空白区域 -->
        <div class="spotlight-screen screen-2">
          <div class="container">
            <!-- 纯净的光效体验，无文字内容 -->
          </div>
        </div>

        <!-- 第三屏：空白区域 -->
        <div class="spotlight-screen screen-3">
          <div class="container">
            <!-- 纯净的光效体验，无文字内容 -->
          </div>
        </div>

        <!-- 第四屏：空白区域 -->
        <div class="spotlight-screen screen-4">
          <div class="container">
            <!-- 纯净的光效体验，无文字内容 -->
          </div>
        </div>

        <!-- 第三屏：联系我们 -->
        <div class="spotlight-screen screen-3">
          <div class="contact-section">
            <div class="contact-container">
              <div class="contact-header">
                <div class="contact-brand">
                  <div class="contact-icon">📞</div>
                  <h3 class="contact-title">联系我们</h3>
                </div>
                <p class="contact-subtitle">
                  有任何问题或建议？我们随时为您服务
                </p>
              </div>

              <div class="contact-content">
                <div class="contact-column">
                  <h4 class="column-title">联系方式</h4>
                  <div class="contact-info">
                    <p class="contact-info-item">📧 邮箱：2717120274@qq.com</p>
                    <p class="contact-info-item">📱 电话：18711607090</p>
                  </div>
                </div>

                <div class="contact-column">
                  <h4 class="column-title">办公信息</h4>
                  <div class="contact-info">
                    <p class="contact-info-item">📍 地址：成都市郫都区华迪实训基地</p>
                    <p class="contact-info-item">🕒 服务时间：周一至周五 9:00-18:00</p>
                  </div>
                </div>

                <div class="contact-column">
                  <h4 class="column-title">快速操作</h4>
                  <div class="contact-actions">
                    <button class="contact-btn primary" @click="goToRegister">
                      立即注册
                    </button>
                    <button class="contact-btn secondary" @click="goToLogin">
                      马上登录
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
// import ChengduMapBackground from '../components/ChengduMapBackground.vue'
import { gsap } from 'gsap'

const router = useRouter()

// 引用元素
const homeContainer = ref()
const heroRef = ref()
const statsRef = ref()
const featuresRef = ref()
const demoRef = ref()
const aboutRef = ref()
const ctaRef = ref()
const spotlightRef = ref()
const mapBackground = ref()

// GSAP时间线
let heroTimeline = null
let statsTimeline = null
let featuresTimeline = null
let demoTimeline = null
let aboutTimeline = null
let ctaTimeline = null

// 可见性状态 - 控制动画触发
const heroVisible = ref(false)
const statsVisible = ref(false)
const featuresVisible = ref(false)
const demoVisible = ref(false)
const aboutVisible = ref(false)
const ctaVisible = ref(false)

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

// 统计数据配置 - 成都本地化
const stats = [
  { key: 'users', icon: '👥', label: '蓉城用户', suffix: 'W+' },
  { key: 'hospitals', icon: '🏥', label: '合作医院', suffix: '+' },
  { key: 'data', icon: '📊', label: '数据处理量', suffix: 'TB' },
  { key: 'uptime', icon: '🐼', label: '熊猫可用性', suffix: '%' }
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

// 产品演示图片数据
const demoImages = [

  {
    src: '/images/demo/屏幕截图 2025-07-10 003028.png',
    alt: '成都市各区县人口分布',
    title: '人口分布地理可视化',
    description: '成都市各区县人口密度分布图，直观展示人口分布情况和区域差异'
  },
  {
    src: '/images/demo/屏幕截图 2025-07-10 003049.png',
    alt: '医院等级分布趋势',
    title: '医院等级趋势分析',
    description: '2020-2023年医院等级分布变化趋势，包含三级、二级、一级医院数量统计'
  },
  {
    src: '/images/demo/屏幕截图 2025-07-10 003224.png',
    alt: '用户个人信息管理',
    title: '用户信息管理系统',
    description: '完善的用户个人信息管理界面，支持头像上传、信息编辑等功能'
  },
  {
    src: '/images/demo/屏幕截图 2025-07-10 003315.png',
    alt: '数据预测分析模型',
    title: '智能数据预测分析',
    description: '基于ARIMA、SARIMA、NeuralProphet、TBATS等模型的数据预测分析系统'
  }
]

// 团队成员数据
const teamMembers = [
  { name: '靳皓', position: '项目负责人', initial: '靳' },
  { name: '夏瑜麒', position: '技术架构师', initial: '夏' },
  { name: '石京民', position: '数据分析师', initial: '石' },
  { name: '侯睿', position: '后端工程师', initial: '侯' }
]

// 成都医院数据
const sampleHospitals = [
  { id: 1, name: '华西医院', bedUsage: 85, doctors: 24, status: 'normal' },
  { id: 2, name: '成都市第一人民医院', bedUsage: 92, doctors: 18, status: 'busy' },
  { id: 3, name: '四川省人民医院', bedUsage: 78, doctors: 31, status: 'normal' },
  { id: 4, name: '成都市妇女儿童中心医院', bedUsage: 95, doctors: 15, status: 'critical' }
]

// 实时监控指标
const realTimeMetrics = [
  { label: '在线用户', value: '1,234', change: '+5.2%', trend: 'up' },
  { label: '数据处理量', value: '2.5TB', change: '+12.8%', trend: 'up' },
  { label: '系统响应时间', value: '0.8s', change: '-15.3%', trend: 'down' },
  { label: '服务可用性', value: '99.9%', change: '+0.1%', trend: 'up' }
]

// 优化的粒子样式生成和动画
const getParticleStyle = (index) => {
  const style = {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
  }

  // 使用GSAP为每个粒子创建优化的动画
  setTimeout(() => {
    const particles = document.querySelectorAll('.particle')
    const particle = particles[index - 1] // Vue的v-for从1开始
    if (particle) {
      // 添加成都特色的粒子内容
      const chengduElements = ['🐼', '🏮', '🎋', '🌸', '☁️']
      particle.textContent = chengduElements[index % chengduElements.length]

      gsap.set(particle, {
        fontSize: Math.random() * 10 + 15 + 'px',
        opacity: 0.7
      })

      gsap.to(particle, {
        y: -150,
        x: Math.random() * 150 - 75,
        rotation: 360,
        opacity: 0.3,
        duration: Math.random() * 15 + 20,
        repeat: -1,
        ease: "none",
        delay: Math.random() * 8,
        yoyo: true
      })
    }
  }, 800 + index * 150) // 增加延迟确保DOM已渲染

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
        // 数字计数动画 - 成都本地化数据
        setTimeout(() => {
          animateNumber(2100, 'users', 2.5)  // 2100万成都人口
          animateNumber(168, 'hospitals', 2.0)  // 成都医院数量
          animateNumber(850, 'data', 3.0)  // 数据处理量TB
          animateNumber(99.8, 'uptime', 2.2)  // 熊猫可用性
        }, 300)
      }
    })

  // Features Section 动画 - 水平划入效果
  featuresTimeline = gsap.timeline({ paused: true })

  // 只在动画播放时设置初始状态
  featuresTimeline
    .set('#features .section-header', { x: -100, opacity: 0 })
    .set('.feature-card:nth-child(odd)', { x: -120, opacity: 0 })
    .set('.feature-card:nth-child(even)', { x: 120, opacity: 0 })
    .to('#features .section-header', {
      x: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out"
    })
    .to('.feature-card:nth-child(odd)', {
      x: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.15,
      ease: "power3.out"
    }, "-=0.6")
    .to('.feature-card:nth-child(even)', {
      x: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.15,
      ease: "power3.out"
    }, "-=1.0")

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

// 优化的滚动触发动画系统
const setupScrollTriggerAnimations = () => {
  // 使用 Intersection Observer 优化性能
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target

        // 根据不同区域触发不同动画
        if (target.classList.contains('stats-section')) {
          playStatsAnimation()
        } else if (target.classList.contains('features-section')) {
          playFeaturesAnimation()
        } else if (target.classList.contains('demo-section')) {
          playDemoAnimation()
        } else if (target.classList.contains('about-section')) {
          playAboutAnimation()
        } else if (target.classList.contains('cta-section')) {
          playCTAAnimation()
        }

        // 动画播放后停止观察
        observer.unobserve(target)
      }
    })
  }, observerOptions)

  // 观察所有需要动画的区域
  const sections = document.querySelectorAll('.stats-section, .features-section, .demo-section, .about-section, .cta-section')
  sections.forEach(section => observer.observe(section))
}

// 各区域动画播放函数
const playStatsAnimation = () => {
  if (statsTimeline && !statsVisible.value) {
    statsVisible.value = true

    // 添加animate-in类来显示stats-grid
    const statsGrid = document.querySelector('.stats-grid')
    if (statsGrid) {
      statsGrid.classList.add('animate-in')
    }

    statsTimeline.play()
  }
}

const playFeaturesAnimation = () => {
  if (featuresTimeline && !featuresVisible.value) {
    featuresVisible.value = true
    featuresTimeline.play()
  }
}

// 确保统计数据在没有动画时也能显示
const ensureStatsVisible = () => {
  const statsSection = document.querySelector('.stats-section')
  if (statsSection) {
    const rect = statsSection.getBoundingClientRect()
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0

    if (isInViewport && !statsVisible.value) {
      console.log('🔧 强制显示统计数据区域')

      // 添加animate-in类来显示stats-grid
      const statsGrid = document.querySelector('.stats-grid')
      if (statsGrid) {
        statsGrid.classList.add('animate-in')
      }

      gsap.set('.stat-card', { y: 0, opacity: 1 })
      statsVisible.value = true

      // 启动数字动画
      setTimeout(() => {
        animateNumber(2100, 'users', 2.5)
        animateNumber(168, 'hospitals', 2.0)
        animateNumber(850, 'data', 3.0)
        animateNumber(99.8, 'uptime', 2.2)
      }, 300)
    }
  }
}

// 确保功能特性在没有动画时也能显示
const ensureFeaturesVisible = () => {
  // 如果动画没有播放且元素在视口中，直接显示
  const featuresSection = document.querySelector('.features-section')
  if (featuresSection) {
    const rect = featuresSection.getBoundingClientRect()
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0

    if (isInViewport && !featuresVisible.value) {
      gsap.set('#features .section-header', { x: 0, opacity: 1 })
      gsap.set('.feature-card', { x: 0, opacity: 1 })
      featuresVisible.value = true
    }
  }
}

const playDemoAnimation = () => {
  if (demoTimeline && !demoVisible.value) {
    demoVisible.value = true
    demoTimeline.play()
  }
}

const playAboutAnimation = () => {
  if (aboutTimeline && !aboutVisible.value) {
    aboutVisible.value = true
    aboutTimeline.play()
  }
}

const playCTAAnimation = () => {
  if (ctaTimeline && !ctaVisible.value) {
    ctaVisible.value = true
    ctaTimeline.play()
  }
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

// Demo滚动效果
const setupDemoScrollEffect = () => {
  const demoRight = document.querySelector('.demo-right')
  const demoImages = document.querySelectorAll('.demo-image-item')

  if (!demoRight || !demoImages.length) return

  // 创建Intersection Observer来监听图片进入视口
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, {
    root: demoRight,
    rootMargin: '0px',
    threshold: 0.3
  })

  // 观察所有图片
  demoImages.forEach(image => {
    imageObserver.observe(image)
  })

  console.log('📸 Demo滚动效果已启用')
}

// 光标探照灯效果
let spotlightCleanup = null

const initCursorSpotlight = () => {
  if (!spotlightRef.value) return

  // 设置CSS变量的初始值
  document.documentElement.style.setProperty('--mouse-x', '50%')
  document.documentElement.style.setProperty('--mouse-y', '50%')

  // 监听鼠标移动事件
  const handleMouseMove = (e) => {
    // 获取鼠标相对于视口的坐标
    const mouseX = e.clientX
    const mouseY = e.clientY

    // 更新CSS变量
    document.documentElement.style.setProperty('--mouse-x', mouseX + 'px')
    document.documentElement.style.setProperty('--mouse-y', mouseY + 'px')
  }

  // 添加事件监听器
  window.addEventListener('mousemove', handleMouseMove)

  // 返回清理函数
  spotlightCleanup = () => {
    window.removeEventListener('mousemove', handleMouseMove)
  }

  console.log('✨ 光标探照灯效果已启用')
}

// 生命周期
onMounted(() => {
  console.log('🎬 启用简化显示系统')

  // 确保所有内容立即可见
  setTimeout(() => {
    // 强制显示所有主要内容
    heroVisible.value = true
    statsVisible.value = true
    featuresVisible.value = true
    demoVisible.value = true
    aboutVisible.value = true
    ctaVisible.value = true

    // 确保CSS类正确应用
    const statsGrid = document.querySelector('.stats-grid')
    if (statsGrid) {
      statsGrid.classList.add('animate-in')
    }

    // 启动统计数据动画
    setTimeout(() => {
      animateNumber(2100, 'users', 2.5)
      animateNumber(168, 'hospitals', 2.0)
      animateNumber(850, 'data', 3.0)
      animateNumber(99.8, 'uptime', 2.2)
    }, 500)

    // 初始化其他功能
    setupHoverAnimations()
    setupDemoScrollEffect()
    initCursorSpotlight()

    console.log('✅ 简化显示系统初始化完成')
  }, 100)
})

onUnmounted(() => {
  // 清理GSAP动画
  if (heroTimeline) heroTimeline.kill()
  if (statsTimeline) statsTimeline.kill()
  if (featuresTimeline) featuresTimeline.kill()
  if (demoTimeline) demoTimeline.kill()
  if (aboutTimeline) aboutTimeline.kill()
  if (ctaTimeline) ctaTimeline.kill()

  // 清理光标探照灯事件监听器
  if (spotlightCleanup) {
    spotlightCleanup()
  }

  console.log('🧹 GSAP动画和光标探照灯已清理')
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
  padding-top: 60px; /* 为固定导航栏留出空间 */
  background: #f8fafc;
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

/* 成都地标元素 */
.chengdu-landmarks {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.landmark {
  position: absolute;
  font-size: 24px;
  opacity: 0.6;
  animation: landmarkFloat 6s ease-in-out infinite;
}

.landmark-1 {
  top: 20%;
  left: 15%;
  animation-delay: 0s;
}

.landmark-2 {
  top: 60%;
  left: 85%;
  animation-delay: 1.5s;
}

.landmark-3 {
  top: 80%;
  left: 20%;
  animation-delay: 3s;
}

.landmark-4 {
  top: 30%;
  left: 80%;
  animation-delay: 4.5s;
}

@keyframes landmarkFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
    opacity: 0.8;
  }
}

/* 成都地标元素 */
.chengdu-landmarks {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.landmark {
  position: absolute;
  font-size: 24px;
  opacity: 0.6;
  animation: landmarkFloat 8s ease-in-out infinite;
}

.landmark-1 {
  top: 20%;
  left: 15%;
  animation-delay: 0s;
}

.landmark-2 {
  top: 60%;
  left: 80%;
  animation-delay: 2s;
}

.landmark-3 {
  top: 30%;
  right: 20%;
  animation-delay: 4s;
}

.landmark-4 {
  bottom: 40%;
  left: 10%;
  animation-delay: 6s;
}

@keyframes landmarkFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.6;
  }
  25% {
    transform: translateY(-20px) rotate(5deg);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-10px) rotate(-3deg);
    opacity: 0.7;
  }
  75% {
    transform: translateY(-15px) rotate(2deg);
    opacity: 0.9;
  }
}

.particle {
  position: absolute;
  width: auto;
  height: auto;
  font-size: 16px;
  opacity: 0.7;
  pointer-events: none;
  user-select: none;
  text-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
  transition: all 0.3s ease;
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
  gap: 60px;
  position: relative;
  z-index: 1;
  width: 100%;
  box-sizing: border-box;
}

.hero-text {
  flex: 1;
  min-width: 10;
  opacity: 1; /* 确保默认可见 */
  transform: translateY(0); /* 确保默认位置正确 */
}

/* GSAP will handle animations */

.hero-title {
  font-size: 64px;
  font-weight: 800;
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
  margin: 0 0 20px 0;
}

/* 成都元素样式 */
.chengdu-elements {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.panda-icon {
  font-size: 32px;
  animation: pandaBounce 2s ease-in-out infinite;
}

.location-tag,
.culture-tag {
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  transition: all 0.3s ease;
}

.location-tag:hover,
.culture-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

@keyframes pandaBounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
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
  opacity: 1; /* 确保默认可见 */
  transform: translateX(0); /* 确保默认位置正确 */
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
  padding: 60px 0;
  background: #f8fafc;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  opacity: 1; /* 确保默认可见 */
  transform: translateY(0); /* 确保默认位置正确 */
}

.stat-card {
  text-align: center;
  padding: 30px 20px;
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
  padding: 60px 0;
  background: #f8fafc;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
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
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.feature-card {
  padding: 30px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  opacity: 1; /* 默认可见 */
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
  min-height: 100vh;
  background: #f8fafc;
  position: relative;
  overflow: hidden;
}

.demo-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  display: none; /* 隐藏装饰性背景 */
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
  animation: float 6s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, #6366f1, #a855f7);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #3b82f6, #1d4ed8);
  top: 60%;
  right: 20%;
  animation-delay: 2s;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(45deg, #8b5cf6, #7c3aed);
  bottom: 20%;
  left: 60%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
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

.demo-container {
  display: flex;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.demo-sticky-content {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 50%;
  display: flex;
  align-items: center;
}

.demo-left {
  padding: 60px 50px;
  max-width: 800px;
  margin-left: 50px; 
  padding-left: 150px
}

/* Demo Header */
.demo-header {
  margin-bottom: 40px;
}

.demo-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  border: none;
  border-radius: 50px;
  padding: 12px 24px;
  color: white;
  font-weight: 500;
  margin-bottom: 24px;
  animation: fadeInUp 0.8s ease-out;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.badge-icon {
  font-size: 16px;
}

.demo-title {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b 0%, #6366f1 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 24px 0;
  line-height: 1.2;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.demo-subtitle {
  font-size: 18px;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

/* Features Description */
.demo-description {
  margin-bottom: 40px;
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.description-text {
  font-size: 16px;
  line-height: 1.8;
  color: #475569;
  margin-bottom: 18px;
  text-align: justify;
  letter-spacing: 0.5px;
}



/* Demo Actions */
.demo-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.demo-button {
  padding: 16px 32px;
  border-radius: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  border: none;
  font-size: 16px;
  position: relative;
  overflow: hidden;
}

.demo-button.primary {
  background: linear-gradient(135deg, #ff6b6b, #feca57);
  color: white;
}

.demo-button.secondary {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.demo-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.button-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.demo-button:hover .button-glow {
  opacity: 1;
}

.button-icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

/* Right Side - Images */
.demo-right {
  width: 50%;
  overflow-y: auto;
  height: 100vh;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.demo-images-container {
  padding: 80px 60px;
}

.demo-image-item {
  margin-bottom: 60px;
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s ease-out;
}

.demo-image-item.visible {
  opacity: 1;
  transform: translateY(0);
}

.demo-image-wrapper {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  transition: all 0.4s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.demo-image-wrapper:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.3);
}

.demo-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
  border-radius: 24px;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  color: white;
  padding: 40px 30px 30px;
  transform: translateY(100%);
  transition: transform 0.4s ease;
}

.demo-image-wrapper:hover .image-overlay {
  transform: translateY(0);
}

.overlay-content {
  position: relative;
  z-index: 2;
}

.image-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
  color: white;
}

.image-description {
  font-size: 16px;
  line-height: 1.5;
  opacity: 0.9;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.8);
}

.view-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #ff6b6b, #feca57);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 107, 107, 0.4);
}

.arrow-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}



/* About Section */
.about-section {
  padding: 60px 0;
  background: #f8fafc;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: flex-start;
}

.about-description {
  margin-top: 30px;
}

.about-description > p {
  font-size: 18px;
  line-height: 1.8;
  color: #64748b;
  margin-bottom: 30px;
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
  padding: 30px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.showcase-header h3 {
  color: #1e293b;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
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
  padding: 80px 0;
  background: #f8fafc;
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

  .demo-container {
    flex-direction: column;
  }

  .demo-sticky-content {
    position: static;
    width: 100%;
    height: auto;
  }

  .demo-left {
    padding: 50px 30px;
  }

  .demo-title {
    font-size: 36px;
  }

  .demo-subtitle {
    font-size: 16px;
  }

  .feature-card-inner {
    flex-direction: column;
    text-align: center;
  }

  .feature-icon-wrapper {
    align-self: center;
    margin-bottom: 16px;
  }

  .demo-right {
    width: 100%;
    height: auto;
    overflow-y: visible;
    background: transparent;
  }

  .demo-images-container {
    padding: 40px;
  }

  .demo-image {
    height: 300px;
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

  .demo-title {
    font-size: 28px;
  }

  .demo-subtitle {
    font-size: 14px;
  }

  .demo-left {
    padding: 30px 20px;
  }

  .demo-features-list {
    gap: 20px;
  }

  .feature-card-inner {
    padding: 20px;
    flex-direction: column;
    text-align: center;
  }

  .feature-icon-wrapper {
    align-self: center;
    margin-bottom: 16px;
  }

  .feature-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .icon-glow {
    width: 50px;
    height: 50px;
  }

  .feature-title {
    font-size: 18px;
  }

  .feature-description {
    font-size: 13px;
  }

  .feature-points li {
    font-size: 11px;
  }

  .demo-actions {
    flex-direction: column;
  }

  .demo-button {
    padding: 14px 24px;
    font-size: 14px;
  }

  .demo-images-container {
    padding: 20px;
  }

  .demo-image {
    height: 250px;
  }

  .image-overlay {
    padding: 20px 20px 20px;
  }

  .image-title {
    font-size: 18px;
  }

  .image-description {
    font-size: 14px;
  }

  .cta-content h2 {
    font-size: 36px;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
}

/* 光标探照灯效果 - CSS变量定义 */
:root {
  --mouse-x: 50%;
  --mouse-y: 50%;
}

/* 光标探照灯区域 - 蓝色渐变背景版 */
.spotlight-section {
  position: relative;
  min-height: 300vh; /* 缩短到3倍视口高度 */
  overflow: hidden;

  /* 主题色到黑色的渐变背景 */
  background: linear-gradient(
    to bottom,
    #f8fafc 0%,    /* 顶部主题浅色 */
    #e2e8f0 20%,   /* 主题中浅色 */
    #cbd5e1 35%,   /* 主题中色 */
    #94a3b8 50%,   /* 主题深色 */
    #64748b 65%,   /* 深灰色 */
    #475569 80%,   /* 更深灰色 */
    #334155 90%,   /* 深灰蓝色 */
    #1e293b 95%,   /* 非常深的灰蓝色 */
    #000000 100%   /* 纯黑色 */
  );
}

/* 上层光效 (Effect Layer) - 动态跟随鼠标的径向渐变 */
.spotlight-section::before {
  content: '';
  position: fixed; /* 改为fixed，让光效始终跟随鼠标 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;

  /* 关键：径向渐变，中心点由CSS变量控制 */
  background: radial-gradient(
    circle 400px at var(--mouse-x) var(--mouse-y),
    rgba(255, 255, 255, 0.25) 0%,     /* 使用白色光效与蓝色背景形成对比 */
    rgba(224, 242, 254, 0.15) 40%,    /* 浅蓝色光晕 */
    rgba(224, 242, 254, 0.05) 70%,    /* 更淡的边缘 */
    transparent 80%                    /* 完全透明 */
  );

  /* ✨ 关键的融合模式 - 让光效自然融合而不是覆盖 ✨ */
  mix-blend-mode: soft-light;
  pointer-events: none; /* 确保不阻挡鼠标事件 */
}

/* 第二层核心光效 - 更亮的中心区域 */
.spotlight-section::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;

  /* 更小更亮的核心光效 - 使用蓝白色调 */
  background: radial-gradient(
    circle 150px at var(--mouse-x) var(--mouse-y),
    rgba(255, 255, 255, 0.3) 0%,      /* 明亮的白色核心 */
    rgba(129, 212, 250, 0.15) 50%,    /* 中等蓝色中间层 */
    transparent 80%                    /* 柔和边缘 */
  );

  /* 使用screen模式增强亮度效果 */
  mix-blend-mode: screen;
  pointer-events: none;
}

/* 删除了旧的 .spotlight-background 样式，现在直接在 .spotlight-section 上实现效果 */

.spotlight-content {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
}

/* 每个屏幕的基础样式 */
.spotlight-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  position: relative;
}

/* 第一屏 - 主标题 */
.screen-1 {
  padding-top: 120px;
}

/* 滚动提示 */
.scroll-hint {
  margin-top: 60px;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
}

.scroll-arrow {
  font-size: 24px;
  margin-top: 10px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* 移除了不需要的文字样式，保持纯净的光效体验 */

/* 移除了功能特性相关样式 */

/* 移除了数据价值相关样式 */

/* 愿景内容 */
.vision-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  margin-top: 60px;
}

.vision-text h4 {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin-bottom: 20px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.vision-text p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.vision-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.vision-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.vision-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.2);
}

.vision-icon {
  font-size: 20px;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
}

/* 最终行动区域 */
.final-message {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin: 40px 0 60px;
  line-height: 1.6;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.final-actions {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.spotlight-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 36px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  min-width: 180px;
  justify-content: center;
}

.spotlight-btn.primary {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #1f2937;
  box-shadow: 0 10px 30px rgba(251, 191, 36, 0.4);
}

.spotlight-btn.primary:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 20px 50px rgba(251, 191, 36, 0.6);
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.spotlight-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.spotlight-btn.secondary:hover {
  transform: translateY(-5px) scale(1.05);
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 20px 50px rgba(255, 255, 255, 0.2);
}

.btn-icon {
  font-size: 18px;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
}

/* 联系我们区域 - 无卡片样式 */
.contact-section {
  width: 100%;
  padding: 80px 0 60px;
  position: relative;
}

.contact-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 1;
}

.contact-header {
  text-align: center;
  margin-bottom: 60px;
}

.contact-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

.contact-icon {
  font-size: 32px;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
}

.contact-title {
  font-size: 48px;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.contact-subtitle {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  line-height: 1.6;
}

.contact-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 60px;
  align-items: start;
}

.contact-column {
  text-align: center;
}

.column-title {
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin-bottom: 24px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 12px;
}

.contact-info {
  margin-bottom: 24px;
}

.contact-info-item {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 12px;
  line-height: 1.5;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
}

.contact-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.contact-btn {
  padding: 16px 32px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
  justify-content: center;
}

.contact-btn.primary {
  background: rgba(255, 255, 255, 0.9);
  color: #1e293b;
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
}

.contact-btn.primary:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 15px 40px rgba(255, 255, 255, 0.3);
  background: white;
}

.contact-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.contact-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

/* 旧的联系我们样式已删除 */

.contact-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 1;
}

.contact-header {
  text-align: center;
  margin-bottom: 60px;
}

.contact-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
}

.contact-icon {
  font-size: 36px;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
}

.contact-title {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.5);
}

.contact-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  line-height: 1.6;
}

.contact-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 60px;
  align-items: start;
}

.contact-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.column-title {
  font-size: 20px;
  font-weight: 600;
  color: white;
  margin: 0 0 20px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.contact-item:hover {
  transform: translateX(8px);
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-item-icon {
  font-size: 20px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
  border-radius: 10px;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.contact-item-content {
  flex: 1;
}

.contact-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
  font-weight: 500;
}

.contact-value {
  font-size: 16px;
  color: white;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.contact-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}

.contact-btn {
  display: flex;
  align-items: center;
  gap: 10px; /* 增加图标和文字间距 */
  padding: 16px 32px; /* 增加按钮大小 */
  border: none;
  border-radius: 50px;
  font-size: 16px; /* 增加字体大小 */
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  min-width: 160px; /* 增加最小宽度 */
  justify-content: center;
}

.contact-btn.primary {
  background: linear-gradient(135deg, #ffffff, #e0f2fe);
  color: #0277bd;
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
}

.contact-btn.primary:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 15px 40px rgba(255, 255, 255, 0.3);
  background: linear-gradient(135deg, #f8fafc, #e0f2fe);
}

.contact-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.contact-btn.secondary:hover {
  transform: translateY(-3px) scale(1.05);
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 15px 40px rgba(255, 255, 255, 0.2);
}

/* 快速入口 */

.quick-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.quick-btn:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3));
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
}

.quick-icon {
  font-size: 16px;
}

/* 通用标题样式 */
.section-title {
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ffffff, #81d4fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(129, 212, 250, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .spotlight-section {
    min-height: 250vh;
  }

  .spotlight-title {
    font-size: 36px;
  }

  .section-title {
    font-size: 28px;
  }

  .spotlight-subtitle {
    font-size: 18px;
    margin-bottom: 40px;
  }

  .spotlight-features {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .feature-item {
    padding: 20px;
  }

  .feature-icon {
    font-size: 32px;
  }

  .value-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .value-number {
    font-size: 36px;
  }

  .vision-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .vision-features {
    grid-template-columns: 1fr;
  }

  .contact-container {
    padding: 0 20px;
  }

  .contact-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .contact-title {
    font-size: 36px;
  }

  .contact-subtitle {
    font-size: 18px;
  }

  .contact-container {
    padding: 0 20px;
  }

  .contact-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .contact-header {
    margin-bottom: 40px;
  }

  .contact-title {
    font-size: 24px;
  }

  .contact-actions {
    flex-direction: column;
  }

  .quick-access-buttons {
    flex-direction: column;
    align-items: center;
  }

  .quick-btn {
    width: 200px;
  }
}

@media (max-width: 480px) {
  .spotlight-section {
    min-height: 200vh;
  }

  .spotlight-screen {
    padding: 60px 0;
  }

  .spotlight-title {
    font-size: 28px;
  }

  .section-title {
    font-size: 24px;
  }

  .spotlight-subtitle {
    font-size: 16px;
  }

  .feature-item {
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }

  .feature-content h4 {
    font-size: 18px;
  }

  .feature-content p {
    font-size: 13px;
  }

  .value-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .value-item {
    padding: 30px 15px;
  }

  .value-number {
    font-size: 32px;
  }

  .vision-text h4 {
    font-size: 22px;
  }

  .vision-text p {
    font-size: 14px;
  }

  .spotlight-btn {
    padding: 15px 30px;
    font-size: 14px;
    min-width: 160px;
  }

  .contact-container {
    padding: 0 16px;
  }

  .contact-title {
    font-size: 28px;
  }

  .contact-subtitle {
    font-size: 16px;
  }

  .contact-info-item {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .contact-btn {
    padding: 14px 28px;
    font-size: 14px;
    min-width: 140px;
  }

  .contact-content {
    gap: 30px;
  }

  .contact-icon {
    font-size: 28px;
  }

  .contact-title {
    font-size: 20px;
  }

  .contact-subtitle {
    font-size: 14px;
  }

  .contact-item {
    padding: 15px;
  }

  .contact-item-icon {
    font-size: 20px;
    width: 36px;
    height: 36px;
  }

  .contact-value {
    font-size: 14px;
  }

  .contact-btn {
    padding: 12px 24px;
    font-size: 13px;
    min-width: 120px;
  }

  .quick-access-title {
    font-size: 18px;
  }

  .quick-btn {
    padding: 16px;
    min-width: 80px;
  }

  .quick-icon {
    font-size: 20px;
  }
}
</style>
