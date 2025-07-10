<template>
  <div class="help-center">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <h2>帮助中心</h2>
        <p>为您提供全面的使用指南和技术支持</p>
      </div>
      <div class="header-actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜索帮助内容..."
          style="width: 300px;"
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="help-content">
      <!-- 左侧导航 -->
      <div class="help-sidebar">
        <el-menu
          :default-active="activeSection"
          mode="vertical"
          @select="handleSectionChange"
          class="help-menu"
        >
          <el-menu-item index="quick-start">
            <el-icon><VideoPlay /></el-icon>
            <span>快速开始</span>
          </el-menu-item>
          <el-menu-item index="faq">
            <el-icon><QuestionFilled /></el-icon>
            <span>常见问题</span>
          </el-menu-item>
          <el-menu-item index="user-guide">
            <el-icon><Document /></el-icon>
            <span>使用指南</span>
          </el-menu-item>
          <el-menu-item index="api-docs">
            <el-icon><DataAnalysis /></el-icon>
            <span>API文档</span>
          </el-menu-item>
          <el-menu-item index="contact">
            <el-icon><Service /></el-icon>
            <span>联系支持</span>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 右侧内容 -->
      <div class="help-main">
        <!-- 搜索结果 -->
        <div v-if="searchResults.length > 0" class="content-section">
          <h3>搜索结果 ({{ searchResults.length }})</h3>
          <div class="search-results">
            <div
              v-for="result in searchResults"
              :key="`${result.type}-${result.title}`"
              class="search-result-item"
              @click="goToResult(result)"
            >
              <div class="result-type">{{ getResultTypeText(result.type) }}</div>
              <h4>{{ result.title }}</h4>
              <p>{{ result.content }}</p>
            </div>
          </div>
        </div>

        <!-- 快速开始 -->
        <div v-else-if="activeSection === 'quick-start'" class="content-section">
          <h3>快速开始</h3>
          <div class="quick-start-grid">
            <div class="quick-card" @click="scrollToSection('login')">
              <el-icon class="card-icon"><User /></el-icon>
              <h4>登录注册</h4>
              <p>了解如何创建账户并登录系统</p>
            </div>
            <div class="quick-card" @click="scrollToSection('dashboard')">
              <el-icon class="card-icon"><Monitor /></el-icon>
              <h4>仪表盘概览</h4>
              <p>快速了解系统主要功能和数据概览</p>
            </div>
            <div class="quick-card" @click="scrollToSection('statistics')">
              <el-icon class="card-icon"><TrendCharts /></el-icon>
              <h4>统计分析</h4>
              <p>学习如何使用各种统计分析功能</p>
            </div>
            <div class="quick-card" @click="scrollToSection('visualization')">
              <el-icon class="card-icon"><PieChart /></el-icon>
              <h4>数据可视化</h4>
              <p>掌握图表和可视化工具的使用</p>
            </div>
          </div>
        </div>

        <!-- 常见问题 -->
        <div v-if="activeSection === 'faq'" class="content-section">
          <h3>常见问题</h3>
          <el-collapse v-model="activeFaq" accordion>
            <el-collapse-item
              v-for="faq in faqList"
              :key="faq.id"
              :title="faq.question"
              :name="faq.id"
            >
              <div v-html="faq.answer"></div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <!-- 使用指南 -->
        <div v-if="activeSection === 'user-guide'" class="content-section">
          <h3>使用指南</h3>
          <div class="guide-sections">
            <div class="guide-item" v-for="guide in userGuides" :key="guide.id">
              <div class="guide-header">
                <el-icon :class="guide.icon"></el-icon>
                <h4>{{ guide.title }}</h4>
              </div>
              <p>{{ guide.description }}</p>
              <el-button type="primary" link @click="openGuide(guide)">
                查看详情 <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </div>

        <!-- API文档 -->
        <div v-if="activeSection === 'api-docs'" class="content-section">
          <h3>API文档</h3>
          <div class="api-sections">
            <el-card class="api-card" v-for="api in apiDocs" :key="api.id">
              <template #header>
                <div class="api-header">
                  <span class="api-method" :class="api.method.toLowerCase()">{{ api.method }}</span>
                  <span class="api-path">{{ api.path }}</span>
                </div>
              </template>
              <p>{{ api.description }}</p>
              <el-button type="primary" size="small" @click="viewApiDetail(api)">
                查看详情
              </el-button>
            </el-card>
          </div>
        </div>

        <!-- 联系支持 -->
        <div v-if="activeSection === 'contact'" class="content-section">
          <h3>联系支持</h3>
          <div class="contact-grid">
            <el-card class="contact-card">
              <template #header>
                <div class="contact-header">
                  <el-icon><Message /></el-icon>
                  <span>在线客服</span>
                </div>
              </template>
              <p>工作时间：周一至周五 9:00-18:00</p>
              <el-button type="primary" @click="startChat">开始对话</el-button>
            </el-card>

            <el-card class="contact-card">
              <template #header>
                <div class="contact-header">
                  <el-icon><Phone /></el-icon>
                  <span>电话支持</span>
                </div>
              </template>
              <p>技术支持热线：400-123-4567</p>
              <el-button type="primary" @click="callSupport">拨打电话</el-button>
            </el-card>

            <el-card class="contact-card">
              <template #header>
                <div class="contact-header">
                  <el-icon><ChatDotRound /></el-icon>
                  <span>邮件支持</span>
                </div>
              </template>
              <p>发送邮件至：support@healthdata.com</p>
              <el-button type="primary" @click="sendEmail">发送邮件</el-button>
            </el-card>
          </div>

          <!-- 反馈表单 -->
          <el-card class="feedback-card" style="margin-top: 20px;">
            <template #header>
              <span>意见反馈</span>
            </template>
            <el-form :model="feedbackForm" label-width="80px">
              <el-form-item label="反馈类型">
                <el-select v-model="feedbackForm.type" placeholder="请选择反馈类型">
                  <el-option label="功能建议" value="feature"></el-option>
                  <el-option label="问题报告" value="bug"></el-option>
                  <el-option label="使用咨询" value="question"></el-option>
                  <el-option label="其他" value="other"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="反馈内容">
                <el-input
                  v-model="feedbackForm.content"
                  type="textarea"
                  :rows="4"
                  placeholder="请详细描述您的问题或建议..."
                ></el-input>
              </el-form-item>
              <el-form-item label="联系方式">
                <el-input
                  v-model="feedbackForm.contact"
                  placeholder="请留下您的邮箱或电话（可选）"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitFeedback" :loading="submittingFeedback">
                  提交反馈
                </el-button>
                <el-button @click="resetFeedback">重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  VideoPlay,
  QuestionFilled,
  Document,
  DataAnalysis,
  Service,
  User,
  Monitor,
  TrendCharts,
  PieChart,
  ArrowRight,
  Message,
  Phone,
  ChatDotRound
} from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const searchQuery = ref('')
const activeSection = ref('quick-start')
const activeFaq = ref('')
const submittingFeedback = ref(false)

// 反馈表单
const feedbackForm = reactive({
  type: '',
  content: '',
  contact: ''
})

// 常见问题数据
const faqList = ref([
  {
    id: '1',
    question: '如何重置密码？',
    answer: '您可以在登录页面点击"忘记密码"链接，输入注册邮箱后系统会发送重置密码的邮件到您的邮箱。'
  },
  {
    id: '2',
    question: '数据更新频率是多少？',
    answer: '系统数据每日凌晨2点自动更新，部分实时数据会每小时更新一次。'
  },
  {
    id: '3',
    question: '如何导出统计报告？',
    answer: '在各个统计页面右上角都有导出按钮，支持导出为Excel、PDF等格式。'
  },
  {
    id: '4',
    question: '系统支持哪些浏览器？',
    answer: '推荐使用Chrome、Firefox、Safari、Edge等现代浏览器的最新版本。'
  },
  {
    id: '5',
    question: '如何申请更高权限？',
    answer: '请联系系统管理员或通过邮件support@healthdata.com申请权限升级。'
  }
])

// 使用指南数据
const userGuides = ref([
  {
    id: '1',
    title: '系统概览',
    description: '了解系统整体架构和主要功能模块',
    icon: 'Monitor'
  },
  {
    id: '2',
    title: '数据统计',
    description: '学习如何使用人口、医疗等统计功能',
    icon: 'TrendCharts'
  },
  {
    id: '3',
    title: '可视化图表',
    description: '掌握各种图表的创建和自定义方法',
    icon: 'PieChart'
  },
  {
    id: '4',
    title: '权限管理',
    description: '了解用户角色和权限设置',
    icon: 'User'
  }
])

// API文档数据
const apiDocs = ref([
  {
    id: '1',
    method: 'GET',
    path: '/api/population/statistics',
    description: '获取人口统计数据'
  },
  {
    id: '2',
    method: 'POST',
    path: '/api/auth/login',
    description: '用户登录接口'
  },
  {
    id: '3',
    method: 'GET',
    path: '/api/hospital/statistics',
    description: '获取医院统计数据'
  },
  {
    id: '4',
    method: 'PUT',
    path: '/api/user/profile',
    description: '更新用户资料'
  }
])

// 搜索相关
const searchResults = ref([])
const isSearching = ref(false)

// 方法
const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  isSearching.value = true
  try {
    // 模拟搜索延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 在所有内容中搜索
    const allContent = [
      ...faqList.value.map(faq => ({ type: 'faq', title: faq.question, content: faq.answer, section: 'faq' })),
      ...userGuides.value.map(guide => ({ type: 'guide', title: guide.title, content: guide.description, section: 'user-guide' })),
      ...apiDocs.value.map(api => ({ type: 'api', title: `${api.method} ${api.path}`, content: api.description, section: 'api-docs' }))
    ]

    const query = searchQuery.value.toLowerCase()
    searchResults.value = allContent.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query)
    )

    ElMessage.success(`找到 ${searchResults.value.length} 个相关结果`)
  } catch (error) {
    ElMessage.error('搜索失败，请重试')
  } finally {
    isSearching.value = false
  }
}

const handleSectionChange = (section) => {
  activeSection.value = section
  searchResults.value = [] // 清空搜索结果
}

const scrollToSection = (section) => {
  // 根据不同section跳转到对应功能
  const sectionMap = {
    'login': '/login',
    'dashboard': '/app/dashboard',
    'statistics': '/app/statistics',
    'visualization': '/app/visualization'
  }

  if (sectionMap[section]) {
    router.push(sectionMap[section])
  } else {
    ElMessage.info(`正在为您跳转到${section}功能...`)
  }
}

const openGuide = (guide) => {
  // 打开详细指南弹窗
  ElMessageBox.alert(
    getGuideContent(guide.id),
    guide.title,
    {
      confirmButtonText: '我知道了',
      dangerouslyUseHTMLString: true,
      customClass: 'guide-dialog'
    }
  )
}

const getGuideContent = (guideId) => {
  const guides = {
    '1': `
      <div class="guide-content">
        <h4>系统概览</h4>
        <p>健康大数据平台主要包含以下功能模块：</p>
        <ul>
          <li><strong>仪表盘</strong>：查看系统整体数据概览和关键指标</li>
          <li><strong>统计分析</strong>：人口统计、医疗机构、医护人员等数据分析</li>
          <li><strong>数据可视化</strong>：各种图表和可视化工具</li>
          <li><strong>3D地图</strong>：成都市地理信息可视化</li>
          <li><strong>数据管理</strong>：数据导入导出和管理功能</li>
        </ul>
      </div>
    `,
    '2': `
      <div class="guide-content">
        <h4>数据统计功能</h4>
        <p>系统提供多维度的数据统计分析：</p>
        <ul>
          <li><strong>人口统计</strong>：按年份、区域查看人口变化趋势</li>
          <li><strong>医疗机构</strong>：医院分布、床位数量等统计</li>
          <li><strong>医护人员</strong>：医生护士数量和分布情况</li>
          <li><strong>数据筛选</strong>：支持多条件筛选和时间范围选择</li>
        </ul>
      </div>
    `,
    '3': `
      <div class="guide-content">
        <h4>可视化图表</h4>
        <p>系统支持多种图表类型：</p>
        <ul>
          <li><strong>折线图</strong>：展示数据趋势变化</li>
          <li><strong>柱状图</strong>：对比不同类别数据</li>
          <li><strong>饼图</strong>：显示数据占比关系</li>
          <li><strong>地图</strong>：地理位置数据可视化</li>
          <li><strong>自定义</strong>：支持图表样式和配置自定义</li>
        </ul>
      </div>
    `,
    '4': `
      <div class="guide-content">
        <h4>权限管理</h4>
        <p>系统采用基于角色的权限控制：</p>
        <ul>
          <li><strong>管理员</strong>：拥有所有功能权限，可管理用户和系统设置</li>
          <li><strong>分析师</strong>：可使用统计分析和数据可视化功能</li>
          <li><strong>访客</strong>：只能查看基础数据和报告</li>
          <li><strong>权限申请</strong>：可通过系统申请更高级别权限</li>
        </ul>
      </div>
    `
  }
  return guides[guideId] || '暂无详细内容'
}

const viewApiDetail = (api) => {
  // 显示API详细信息
  const apiDetails = getApiDetails(api.id)
  ElMessageBox.alert(
    apiDetails,
    `API详情 - ${api.method} ${api.path}`,
    {
      confirmButtonText: '关闭',
      dangerouslyUseHTMLString: true,
      customClass: 'api-dialog'
    }
  )
}

const getApiDetails = (apiId) => {
  const details = {
    '1': `
      <div class="api-detail">
        <h4>获取人口统计数据</h4>
        <p><strong>请求方式：</strong>GET</p>
        <p><strong>请求地址：</strong>/api/population/statistics</p>
        <p><strong>请求参数：</strong></p>
        <ul>
          <li>year: 年份 (可选)</li>
          <li>district: 区域 (可选)</li>
          <li>page: 页码 (默认1)</li>
          <li>size: 每页数量 (默认10)</li>
        </ul>
        <p><strong>返回示例：</strong></p>
        <pre>{"code": 200, "data": {"total": 2100, "list": [...]}}</pre>
      </div>
    `,
    '2': `
      <div class="api-detail">
        <h4>用户登录接口</h4>
        <p><strong>请求方式：</strong>POST</p>
        <p><strong>请求地址：</strong>/api/auth/login</p>
        <p><strong>请求参数：</strong></p>
        <ul>
          <li>username: 用户名 (必填)</li>
          <li>password: 密码 (必填)</li>
          <li>captcha: 验证码 (必填)</li>
        </ul>
        <p><strong>返回示例：</strong></p>
        <pre>{"code": 200, "data": {"token": "xxx", "userInfo": {...}}}</pre>
      </div>
    `,
    '3': `
      <div class="api-detail">
        <h4>获取医院统计数据</h4>
        <p><strong>请求方式：</strong>GET</p>
        <p><strong>请求地址：</strong>/api/hospital/statistics</p>
        <p><strong>请求参数：</strong></p>
        <ul>
          <li>type: 医院类型 (可选)</li>
          <li>level: 医院等级 (可选)</li>
          <li>district: 区域 (可选)</li>
        </ul>
        <p><strong>返回示例：</strong></p>
        <pre>{"code": 200, "data": {"hospitals": 168, "beds": 50000}}</pre>
      </div>
    `,
    '4': `
      <div class="api-detail">
        <h4>更新用户资料</h4>
        <p><strong>请求方式：</strong>PUT</p>
        <p><strong>请求地址：</strong>/api/user/profile</p>
        <p><strong>请求参数：</strong></p>
        <ul>
          <li>realName: 真实姓名 (可选)</li>
          <li>email: 邮箱 (可选)</li>
          <li>phone: 电话 (可选)</li>
          <li>avatar: 头像 (可选)</li>
        </ul>
        <p><strong>返回示例：</strong></p>
        <pre>{"code": 200, "message": "更新成功"}</pre>
      </div>
    `
  }
  return details[apiId] || '暂无详细信息'
}

const startChat = () => {
  // 启动在线客服 - 可以集成第三方客服系统
  ElMessage.success('正在为您连接在线客服...')
  // 这里可以集成实际的客服系统，比如环信、网易云信等
  setTimeout(() => {
    ElMessage.info('客服系统正在开发中，请通过邮件或电话联系我们')
  }, 2000)
}

const callSupport = () => {
  // 拨打支持电话
  if (navigator.userAgent.includes('Mobile')) {
    // 移动端直接拨打电话
    window.location.href = 'tel:18711607090'
  } else {
    // 桌面端显示电话号码
    ElMessageBox.alert(
      '技术支持热线：18711607090<br/>服务时间：周一至周五 9:00-18:00',
      '联系电话',
      {
        confirmButtonText: '我知道了',
        dangerouslyUseHTMLString: true
      }
    )
  }
}

const sendEmail = () => {
  // 发送邮件
  const subject = encodeURIComponent('健康大数据平台技术支持')
  const body = encodeURIComponent('请在此描述您遇到的问题...')
  window.open(`mailto:2717120274@qq.com?subject=${subject}&body=${body}`)
}

const getResultTypeText = (type) => {
  const typeMap = {
    'faq': '常见问题',
    'guide': '使用指南',
    'api': 'API文档'
  }
  return typeMap[type] || '其他'
}

const goToResult = (result) => {
  // 跳转到对应的内容区域
  activeSection.value = result.section
  searchResults.value = [] // 清空搜索结果
  searchQuery.value = '' // 清空搜索框

  // 如果是FAQ，展开对应的问题
  if (result.type === 'faq') {
    const faq = faqList.value.find(f => f.question === result.title)
    if (faq) {
      activeFaq.value = faq.id
    }
  }
}

const submitFeedback = async () => {
  if (!feedbackForm.content.trim()) {
    ElMessage.warning('请填写反馈内容')
    return
  }

  submittingFeedback.value = true
  try {
    // 模拟提交反馈
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('反馈提交成功，我们会尽快处理')
    resetFeedback()
  } catch (error) {
    ElMessage.error('提交失败，请稍后重试')
  } finally {
    submittingFeedback.value = false
  }
}

const resetFeedback = () => {
  Object.assign(feedbackForm, {
    type: '',
    content: '',
    contact: ''
  })
}

onMounted(() => {
  // 页面加载完成后的初始化
})
</script>

<style scoped>
.help-center {
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

/* 主要内容区域 */
.help-content {
  display: flex;
  gap: 20px;
  height: calc(100vh - 200px);
}

/* 左侧导航 */
.help-sidebar {
  width: 250px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.help-menu {
  border: none;
}

.help-menu .el-menu-item {
  height: 50px;
  line-height: 50px;
  margin: 4px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.help-menu .el-menu-item:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.help-menu .el-menu-item.is-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* 右侧内容 */
.help-main {
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 24px;
  overflow-y: auto;
}

.content-section h3 {
  margin: 0 0 24px 0;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 12px;
}

/* 快速开始网格 */
.quick-start-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.quick-card {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.quick-card .card-icon {
  font-size: 32px;
  margin-bottom: 16px;
  color: #667eea;
}

.quick-card:hover .card-icon {
  color: white;
}

.quick-card h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.quick-card p {
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
}

/* 使用指南 */
.guide-sections {
  display: grid;
  gap: 16px;
}

.guide-item {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.guide-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.guide-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.guide-header .el-icon {
  font-size: 20px;
  color: #667eea;
}

.guide-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

/* API文档 */
.api-sections {
  display: grid;
  gap: 16px;
}

.api-card {
  transition: all 0.3s ease;
}

.api-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.api-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.api-method {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.api-method.get {
  background: #10b981;
  color: white;
}

.api-method.post {
  background: #3b82f6;
  color: white;
}

.api-method.put {
  background: #f59e0b;
  color: white;
}

.api-method.delete {
  background: #ef4444;
  color: white;
}

.api-path {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  color: #64748b;
}

/* 联系支持 */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.contact-card {
  transition: all 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.contact-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.contact-header .el-icon {
  color: #667eea;
}

.feedback-card {
  margin-top: 20px;
}

/* 搜索结果样式 */
.search-results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-result-item {
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-result-item:hover {
  border-color: #6366f1;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}

.result-type {
  display: inline-block;
  padding: 4px 12px;
  background: #f1f5f9;
  color: #475569;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
}

.search-result-item h4 {
  margin: 0 0 8px 0;
  color: #1e293b;
  font-size: 16px;
  font-weight: 600;
}

.search-result-item p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
}

/* API详情和指南弹窗样式 */
:deep(.guide-dialog) {
  width: 600px;
}

:deep(.api-dialog) {
  width: 700px;
}

:deep(.guide-content ul),
:deep(.api-detail ul) {
  margin: 16px 0;
  padding-left: 20px;
}

:deep(.guide-content li),
:deep(.api-detail li) {
  margin-bottom: 8px;
  line-height: 1.6;
}

:deep(.api-detail pre) {
  background: #f8fafc;
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  overflow-x: auto;
  margin: 12px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .help-content {
    flex-direction: column;
    height: auto;
  }

  .help-sidebar {
    width: 100%;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .quick-start-grid {
    grid-template-columns: 1fr;
  }

  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
