<template>
  <div class="system-settings">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <h2>系统设置</h2>
        <p>个性化您的使用体验</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="saveAllSettings" :loading="saving">
          <el-icon><Check /></el-icon>
          保存所有设置
        </el-button>
        <el-button @click="resetAllSettings">
          <el-icon><RefreshLeft /></el-icon>
          重置设置
        </el-button>
      </div>
    </div>

    <!-- 设置内容 -->
    <div class="settings-content">
      <!-- 左侧导航 -->
      <div class="settings-sidebar">
        <el-menu
          :default-active="activeTab"
          mode="vertical"
          @select="handleTabChange"
          class="settings-menu"
        >
          <el-menu-item index="appearance">
            <el-icon><Brush /></el-icon>
            <span>外观设置</span>
          </el-menu-item>
          <el-menu-item index="notifications">
            <el-icon><Bell /></el-icon>
            <span>通知设置</span>
          </el-menu-item>
          <el-menu-item index="privacy">
            <el-icon><Lock /></el-icon>
            <span>隐私安全</span>
          </el-menu-item>
          <el-menu-item index="language">
            <el-icon><ChatLineRound /></el-icon>
            <span>语言地区</span>
          </el-menu-item>
          <el-menu-item index="data">
            <el-icon><FolderOpened /></el-icon>
            <span>数据设置</span>
          </el-menu-item>
          <el-menu-item index="advanced">
            <el-icon><Setting /></el-icon>
            <span>高级设置</span>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 右侧设置面板 -->
      <div class="settings-main">
        <!-- 外观设置 -->
        <div v-if="activeTab === 'appearance'" class="settings-panel">
          <h3>外观设置</h3>

          <!-- 主题设置 -->
          <div class="setting-group">
            <div class="setting-header">
              <h4>主题模式</h4>
              <p>选择您喜欢的界面主题</p>
            </div>
            <div class="theme-options">
              <div
                class="theme-card"
                :class="{ active: settings.theme === 'light' }"
                @click="settings.theme = 'light'"
              >
                <div class="theme-preview light-theme">
                  <div class="preview-header"></div>
                  <div class="preview-content">
                    <div class="preview-sidebar"></div>
                    <div class="preview-main"></div>
                  </div>
                </div>
                <span>浅色主题</span>
              </div>
              <div
                class="theme-card"
                :class="{ active: settings.theme === 'dark' }"
                @click="settings.theme = 'dark'"
              >
                <div class="theme-preview dark-theme">
                  <div class="preview-header"></div>
                  <div class="preview-content">
                    <div class="preview-sidebar"></div>
                    <div class="preview-main"></div>
                  </div>
                </div>
                <span>深色主题</span>
              </div>
              <div
                class="theme-card"
                :class="{ active: settings.theme === 'auto' }"
                @click="settings.theme = 'auto'"
              >
                <div class="theme-preview auto-theme">
                  <div class="preview-header"></div>
                  <div class="preview-content">
                    <div class="preview-sidebar"></div>
                    <div class="preview-main"></div>
                  </div>
                </div>
                <span>跟随系统</span>
              </div>
            </div>
          </div>

          <!-- 颜色设置 -->
          <div class="setting-group">
            <div class="setting-header">
              <h4>主题色彩</h4>
              <p>自定义系统主色调</p>
            </div>
            <div class="color-options">
              <div
                v-for="color in colorOptions"
                :key="color.name"
                class="color-item"
                :class="{ active: settings.primaryColor === color.value }"
                @click="settings.primaryColor = color.value"
              >
                <div class="color-circle" :style="{ backgroundColor: color.value }"></div>
                <span>{{ color.name }}</span>
              </div>
            </div>
          </div>

          <!-- 布局设置 -->
          <div class="setting-group">
            <div class="setting-header">
              <h4>布局设置</h4>
              <p>调整界面布局和显示效果</p>
            </div>
            <div class="layout-settings">
              <!-- 侧边栏宽度已固定，移除调整功能 -->
              <div class="setting-item">
                <div class="setting-label">
                  <span>圆角大小</span>
                  <small>调整界面元素的圆角程度</small>
                </div>
                <el-slider
                  v-model="settings.borderRadius"
                  :min="0"
                  :max="20"
                  :step="2"
                  show-input
                  style="width: 200px;"
                />
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <span>动画效果</span>
                  <small>启用界面过渡动画</small>
                </div>
                <el-switch v-model="settings.animations" />
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <span>紧凑模式</span>
                  <small>减少界面元素间距</small>
                </div>
                <el-switch v-model="settings.compactMode" />
              </div>
            </div>
          </div>
        </div>

        <!-- 通知设置 -->
        <div v-if="activeTab === 'notifications'" class="settings-panel">
          <h3>通知设置</h3>

          <div class="setting-group">
            <div class="setting-header">
              <h4>桌面通知</h4>
              <p>管理系统通知的显示方式</p>
            </div>
            <div class="notification-settings">
              <div class="setting-item">
                <div class="setting-label">
                  <span>启用桌面通知</span>
                  <small>允许系统发送桌面通知</small>
                </div>
                <el-switch v-model="settings.notifications.desktop" />
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <span>声音提醒</span>
                  <small>通知时播放提示音</small>
                </div>
                <el-switch v-model="settings.notifications.sound" />
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <span>数据更新通知</span>
                  <small>数据更新时发送通知</small>
                </div>
                <el-switch v-model="settings.notifications.dataUpdate" />
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <span>系统维护通知</span>
                  <small>系统维护时发送通知</small>
                </div>
                <el-switch v-model="settings.notifications.maintenance" />
              </div>
            </div>
          </div>

          <div class="setting-group">
            <div class="setting-header">
              <h4>邮件通知</h4>
              <p>配置邮件通知偏好</p>
            </div>
            <div class="email-settings">
              <div class="setting-item">
                <div class="setting-label">
                  <span>每日报告</span>
                  <small>每日发送数据摘要报告</small>
                </div>
                <el-switch v-model="settings.email.dailyReport" />
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <span>异常警报</span>
                  <small>数据异常时发送邮件警报</small>
                </div>
                <el-switch v-model="settings.email.alerts" />
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <span>发送时间</span>
                  <small>设置邮件发送的时间</small>
                </div>
                <el-time-picker
                  v-model="settings.email.sendTime"
                  format="HH:mm"
                  placeholder="选择时间"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 隐私安全 -->
        <div v-if="activeTab === 'privacy'" class="settings-panel">
          <h3>隐私安全</h3>

          <div class="setting-group">
            <div class="setting-header">
              <h4>账户安全</h4>
              <p>管理您的账户安全设置</p>
            </div>
            <div class="security-settings">
              <div class="setting-item">
                <div class="setting-label">
                  <span>两步验证</span>
                  <small>为账户添加额外的安全保护</small>
                </div>
                <el-switch v-model="settings.security.twoFactor" />
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <span>自动登出</span>
                  <small>长时间无操作时自动登出</small>
                </div>
                <el-select v-model="settings.security.autoLogout" style="width: 150px;">
                  <el-option label="15分钟" value="15"></el-option>
                  <el-option label="30分钟" value="30"></el-option>
                  <el-option label="1小时" value="60"></el-option>
                  <el-option label="2小时" value="120"></el-option>
                  <el-option label="永不" value="never"></el-option>
                </el-select>
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <span>登录历史</span>
                  <small>查看最近的登录记录</small>
                </div>
                <el-button type="primary" size="small" @click="viewLoginHistory">
                  查看历史
                </el-button>
              </div>
            </div>
          </div>

          <div class="setting-group">
            <div class="setting-header">
              <h4>数据隐私</h4>
              <p>控制数据的收集和使用</p>
            </div>
            <div class="privacy-settings">
              <div class="setting-item">
                <div class="setting-label">
                  <span>使用统计</span>
                  <small>允许收集匿名使用统计</small>
                </div>
                <el-switch v-model="settings.privacy.analytics" />
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <span>错误报告</span>
                  <small>自动发送错误报告帮助改进产品</small>
                </div>
                <el-switch v-model="settings.privacy.errorReporting" />
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <span>数据导出</span>
                  <small>导出您的个人数据</small>
                </div>
                <el-button type="primary" size="small" @click="exportData">
                  导出数据
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 语言地区 -->
        <div v-if="activeTab === 'language'" class="settings-panel">
          <h3>语言地区</h3>

          <div class="setting-group">
            <div class="setting-header">
              <h4>显示语言</h4>
              <p>选择界面显示语言</p>
            </div>
            <div class="language-settings">
              <el-radio-group v-model="settings.language" class="language-options">
                <el-radio value="zh-CN">简体中文</el-radio>
                <el-radio value="zh-TW">繁體中文</el-radio>
                <el-radio value="en-US">English</el-radio>
                <el-radio value="ja-JP">日本語</el-radio>
              </el-radio-group>
            </div>
          </div>

          <div class="setting-group">
            <div class="setting-header">
              <h4>时区设置</h4>
              <p>设置您所在的时区</p>
            </div>
            <div class="timezone-settings">
              <el-select v-model="settings.timezone" placeholder="选择时区" style="width: 300px;">
                <el-option label="北京时间 (UTC+8)" value="Asia/Shanghai"></el-option>
                <el-option label="东京时间 (UTC+9)" value="Asia/Tokyo"></el-option>
                <el-option label="纽约时间 (UTC-5)" value="America/New_York"></el-option>
                <el-option label="伦敦时间 (UTC+0)" value="Europe/London"></el-option>
              </el-select>
            </div>
          </div>

          <div class="setting-group">
            <div class="setting-header">
              <h4>数字格式</h4>
              <p>设置数字和日期的显示格式</p>
            </div>
            <div class="format-settings">
              <div class="setting-item">
                <div class="setting-label">
                  <span>数字分隔符</span>
                  <small>大数字的千位分隔符</small>
                </div>
                <el-select v-model="settings.numberFormat" style="width: 120px;">
                  <el-option label="1,234,567" value="comma"></el-option>
                  <el-option label="1 234 567" value="space"></el-option>
                  <el-option label="1234567" value="none"></el-option>
                </el-select>
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <span>日期格式</span>
                  <small>日期的显示格式</small>
                </div>
                <el-select v-model="settings.dateFormat" style="width: 150px;">
                  <el-option label="YYYY-MM-DD" value="YYYY-MM-DD"></el-option>
                  <el-option label="MM/DD/YYYY" value="MM/DD/YYYY"></el-option>
                  <el-option label="DD/MM/YYYY" value="DD/MM/YYYY"></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>

        <!-- 数据设置 -->
        <div v-if="activeTab === 'data'" class="settings-panel">
          <h3>数据设置</h3>

          <div class="setting-group">
            <div class="setting-header">
              <h4>数据刷新</h4>
              <p>控制数据的自动刷新行为</p>
            </div>
            <div class="data-settings">
              <div class="setting-item">
                <div class="setting-label">
                  <span>自动刷新</span>
                  <small>启用数据自动刷新</small>
                </div>
                <el-switch v-model="settings.data.autoRefresh" />
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <span>刷新间隔</span>
                  <small>设置数据刷新的时间间隔</small>
                </div>
                <el-select v-model="settings.data.refreshInterval" style="width: 120px;">
                  <el-option label="1分钟" value="1"></el-option>
                  <el-option label="5分钟" value="5"></el-option>
                  <el-option label="10分钟" value="10"></el-option>
                  <el-option label="30分钟" value="30"></el-option>
                </el-select>
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <span>缓存大小</span>
                  <small>设置本地数据缓存大小</small>
                </div>
                <el-slider
                  v-model="settings.data.cacheSize"
                  :min="50"
                  :max="500"
                  :step="50"
                  show-input
                  style="width: 200px;"
                />
              </div>
            </div>
          </div>

          <div class="setting-group">
            <div class="setting-header">
              <h4>数据导出</h4>
              <p>配置数据导出的默认设置</p>
            </div>
            <div class="export-settings">
              <div class="setting-item">
                <div class="setting-label">
                  <span>默认格式</span>
                  <small>数据导出的默认文件格式</small>
                </div>
                <el-select v-model="settings.data.exportFormat" style="width: 120px;">
                  <el-option label="Excel" value="xlsx"></el-option>
                  <el-option label="CSV" value="csv"></el-option>
                  <el-option label="JSON" value="json"></el-option>
                  <el-option label="PDF" value="pdf"></el-option>
                </el-select>
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <span>包含图表</span>
                  <small>导出时包含图表图像</small>
                </div>
                <el-switch v-model="settings.data.includeCharts" />
              </div>
            </div>
          </div>
        </div>

        <!-- 高级设置 -->
        <div v-if="activeTab === 'advanced'" class="settings-panel">
          <h3>高级设置</h3>

          <div class="setting-group">
            <div class="setting-header">
              <h4>开发者选项</h4>
              <p>面向开发者的高级功能</p>
            </div>
            <div class="developer-settings">
              <div class="setting-item">
                <div class="setting-label">
                  <span>调试模式</span>
                  <small>启用调试信息显示</small>
                </div>
                <el-switch v-model="settings.advanced.debugMode" />
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <span>API日志</span>
                  <small>记录API请求和响应</small>
                </div>
                <el-switch v-model="settings.advanced.apiLogging" />
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <span>性能监控</span>
                  <small>启用性能监控和分析</small>
                </div>
                <el-switch v-model="settings.advanced.performance" />
              </div>
            </div>
          </div>

          <div class="setting-group">
            <div class="setting-header">
              <h4>实验性功能</h4>
              <p>体验最新的实验性功能</p>
            </div>
            <div class="experimental-settings">
              <div class="setting-item">
                <div class="setting-label">
                  <span>新版图表引擎</span>
                  <small>使用新的图表渲染引擎</small>
                </div>
                <el-switch v-model="settings.experimental.newChartEngine" />
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <span>AI智能分析</span>
                  <small>启用AI驱动的数据分析</small>
                </div>
                <el-switch v-model="settings.experimental.aiAnalysis" />
              </div>
            </div>
          </div>

          <div class="setting-group">
            <div class="setting-header">
              <h4>系统工具</h4>
              <p>系统维护和测试工具</p>
            </div>
            <div class="setting-content">
              <div class="setting-item">
                <div class="setting-label">
                  <span>系统检查</span>
                  <small>检查系统各项功能状态</small>
                </div>
                <el-button type="primary" size="small" @click="performSystemCheck">
                  执行检查
                </el-button>
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <span>测试通知</span>
                  <small>测试桌面通知功能</small>
                </div>
                <el-button type="info" size="small" @click="testNotification">
                  发送测试
                </el-button>
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <span>导出设置</span>
                  <small>导出当前系统设置</small>
                </div>
                <el-button type="success" size="small" @click="exportSettings">
                  导出设置
                </el-button>
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <span>导入设置</span>
                  <small>从文件导入系统设置</small>
                </div>
                <el-button type="primary" size="small" @click="importSettings">
                  导入设置
                </el-button>
              </div>
            </div>
          </div>

          <div class="setting-group danger-zone">
            <div class="setting-header">
              <h4>危险操作</h4>
              <p>这些操作可能会影响您的数据，请谨慎操作</p>
            </div>
            <div class="danger-settings">
              <div class="setting-item">
                <div class="setting-label">
                  <span>清除缓存</span>
                  <small>清除所有本地缓存数据</small>
                </div>
                <el-button type="warning" size="small" @click="clearCache">
                  清除缓存
                </el-button>
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <span>重置所有设置</span>
                  <small>将所有设置恢复为默认值</small>
                </div>
                <el-button type="danger" size="small" @click="resetAllSettings">
                  重置设置
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
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Check,
  RefreshLeft,
  Brush,
  Bell,
  Lock,
  ChatLineRound,
  FolderOpened,
  Setting,
  Download,
  View
} from '@element-plus/icons-vue'

// 响应式数据
const activeTab = ref('appearance')
const saving = ref(false)

// 颜色选项
const colorOptions = ref([
  { name: '蓝色', value: '#409EFF' },
  { name: '绿色', value: '#67C23A' },
  { name: '橙色', value: '#E6A23C' },
  { name: '红色', value: '#F56C6C' },
  { name: '紫色', value: '#9C27B0' },
  { name: '青色', value: '#00BCD4' }
])

// 设置数据
const settings = reactive({
  // 外观设置
  theme: 'light',
  primaryColor: '#409EFF',
  borderRadius: 8,
  animations: true,
  compactMode: false,

  // 通知设置
  notifications: {
    desktop: true,
    sound: true,
    dataUpdate: true,
    maintenance: true
  },
  email: {
    dailyReport: false,
    alerts: true,
    sendTime: new Date(2024, 0, 1, 9, 0)
  },

  // 安全设置
  security: {
    twoFactor: false,
    autoLogout: '60'
  },
  privacy: {
    analytics: true,
    errorReporting: true
  },

  // 语言地区
  language: 'zh-CN',
  timezone: 'Asia/Shanghai',
  numberFormat: 'comma',
  dateFormat: 'YYYY-MM-DD',

  // 数据设置
  data: {
    autoRefresh: true,
    refreshInterval: '5',
    cacheSize: 100,
    exportFormat: 'xlsx',
    includeCharts: true
  },

  // 高级设置
  advanced: {
    debugMode: false,
    apiLogging: false,
    performance: true
  },
  experimental: {
    newChartEngine: false,
    aiAnalysis: false
  }
})

// 方法
const handleTabChange = (tab) => {
  activeTab.value = tab
}

const saveAllSettings = async () => {
  saving.value = true
  try {
    // 模拟保存设置到服务器
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 保存到本地存储
    localStorage.setItem('userSettings', JSON.stringify(settings))

    ElMessage.success('设置保存成功')
  } catch (error) {
    ElMessage.error('保存设置失败')
  } finally {
    saving.value = false
  }
}

const resetAllSettings = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要重置所有设置吗？此操作不可撤销。',
      '重置设置',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 重置设置为默认值
    Object.assign(settings, {
      theme: 'light',
      primaryColor: '#409EFF',
      borderRadius: 8,
      animations: true,
      compactMode: false,
      notifications: {
        desktop: true,
        sound: true,
        dataUpdate: true,
        maintenance: true
      },
      email: {
        dailyReport: false,
        alerts: true,
        sendTime: new Date(2024, 0, 1, 9, 0)
      },
      security: {
        twoFactor: false,
        autoLogout: '60'
      },
      privacy: {
        analytics: true,
        errorReporting: true
      },
      language: 'zh-CN',
      timezone: 'Asia/Shanghai',
      numberFormat: 'comma',
      dateFormat: 'YYYY-MM-DD',
      data: {
        autoRefresh: true,
        refreshInterval: '5',
        cacheSize: 100,
        exportFormat: 'xlsx',
        includeCharts: true
      },
      advanced: {
        debugMode: false,
        apiLogging: false,
        performance: true
      },
      experimental: {
        newChartEngine: false,
        aiAnalysis: false
      }
    })

    ElMessage.success('设置已重置为默认值')
  } catch {
    // 用户取消操作
  }
}

const viewLoginHistory = () => {
  // 显示登录历史弹窗
  const loginHistory = [
    { time: '2024-01-10 09:30:15', ip: '192.168.1.100', location: '成都市', device: 'Chrome 浏览器', status: '成功' },
    { time: '2024-01-09 14:22:33', ip: '192.168.1.100', location: '成都市', device: 'Chrome 浏览器', status: '成功' },
    { time: '2024-01-08 08:45:12', ip: '10.0.0.50', location: '北京市', device: 'Firefox 浏览器', status: '失败' },
    { time: '2024-01-07 16:18:45', ip: '192.168.1.100', location: '成都市', device: 'Chrome 浏览器', status: '成功' },
    { time: '2024-01-06 11:33:28', ip: '192.168.1.100', location: '成都市', device: 'Safari 浏览器', status: '成功' }
  ]

  const historyHtml = `
    <div class="login-history">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f5f7fa;">
            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">登录时间</th>
            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">IP地址</th>
            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">位置</th>
            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">设备</th>
            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">状态</th>
          </tr>
        </thead>
        <tbody>
          ${loginHistory.map(record => `
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #f1f5f9;">${record.time}</td>
              <td style="padding: 12px; border-bottom: 1px solid #f1f5f9;">${record.ip}</td>
              <td style="padding: 12px; border-bottom: 1px solid #f1f5f9;">${record.location}</td>
              <td style="padding: 12px; border-bottom: 1px solid #f1f5f9;">${record.device}</td>
              <td style="padding: 12px; border-bottom: 1px solid #f1f5f9;">
                <span style="color: ${record.status === '成功' ? '#10b981' : '#ef4444'};">
                  ${record.status}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `

  ElMessageBox.alert(historyHtml, '登录历史记录', {
    confirmButtonText: '关闭',
    dangerouslyUseHTMLString: true,
    customClass: 'login-history-dialog'
  })
}

const exportData = async () => {
  try {
    ElMessage.info('正在准备导出数据...')

    // 模拟数据导出过程
    await new Promise(resolve => setTimeout(resolve, 2000))

    const exportData = {
      timestamp: new Date().toISOString(),
      userSettings: settings,
      systemInfo: {
        version: '1.0.0',
        buildDate: '2024-01-10',
        environment: 'production'
      },
      statistics: {
        totalUsers: 2100,
        totalHospitals: 168,
        dataPoints: 850000
      }
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `system-data-export-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)

    ElMessage.success('数据导出完成')
  } catch (error) {
    ElMessage.error('数据导出失败')
  }
}

const clearCache = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清除所有缓存吗？这将清除本地存储的数据，但会保留用户设置。',
      '清除缓存',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 保存重要数据
    const userSettings = localStorage.getItem('userSettings')
    const userToken = localStorage.getItem('userToken')
    const userInfo = localStorage.getItem('userInfo')

    // 清除缓存
    localStorage.clear()
    sessionStorage.clear()

    // 恢复重要数据
    if (userSettings) localStorage.setItem('userSettings', userSettings)
    if (userToken) localStorage.setItem('userToken', userToken)
    if (userInfo) localStorage.setItem('userInfo', userInfo)

    ElMessage.success('缓存已清除，用户数据已保留')
  } catch {
    // 用户取消操作
  }
}

// 新增功能方法
const saveSettings = async () => {
  try {
    ElMessage.info('正在保存设置...')

    // 模拟保存到服务器
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 保存到本地存储
    localStorage.setItem('userSettings', JSON.stringify(settings))

    // 应用设置
    applySettings()

    ElMessage.success('设置已保存并应用')
  } catch (error) {
    ElMessage.error('保存设置失败')
  }
}

const applySettings = () => {
  // 应用主题
  document.documentElement.setAttribute('data-theme', settings.theme)

  // 应用主色调
  document.documentElement.style.setProperty('--el-color-primary', settings.primaryColor)

  // 应用语言设置
  if (settings.language !== 'zh-CN') {
    ElMessage.info(`语言设置已更改为${settings.language}，刷新页面后生效`)
  }

  // 应用其他设置...
}

const exportSettings = () => {
  try {
    const exportData = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      settings: settings
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `settings-backup-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)

    ElMessage.success('设置已导出')
  } catch (error) {
    ElMessage.error('导出设置失败')
  }
}

const importSettings = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result)

          if (importedData.settings) {
            Object.assign(settings, importedData.settings)
            applySettings()
            localStorage.setItem('userSettings', JSON.stringify(settings))
            ElMessage.success('设置已导入并应用')
          } else {
            ElMessage.error('导入失败，文件格式不正确')
          }
        } catch (error) {
          ElMessage.error('导入失败，文件格式不正确')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

const testNotification = () => {
  if (settings.notifications.push) {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('测试通知', {
          body: '这是一条测试通知消息',
          icon: '/favicon.ico'
        })
        ElMessage.success('测试通知已发送')
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('测试通知', {
              body: '这是一条测试通知消息',
              icon: '/favicon.ico'
            })
            ElMessage.success('测试通知已发送')
          } else {
            ElMessage.warning('通知权限被拒绝')
          }
        })
      } else {
        ElMessage.warning('通知权限被拒绝，请在浏览器设置中启用')
      }
    } else {
      ElMessage.warning('您的浏览器不支持桌面通知')
    }
  } else {
    ElMessage.info('请先启用推送通知')
  }
}

const performSystemCheck = async () => {
  try {
    ElMessage.info('正在执行系统检查...')

    const checks = [
      { name: '网络连接', status: 'checking' },
      { name: '数据库连接', status: 'checking' },
      { name: '缓存状态', status: 'checking' },
      { name: '权限验证', status: 'checking' },
      { name: '系统资源', status: 'checking' }
    ]

    // 模拟检查过程
    for (let i = 0; i < checks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500))
      checks[i].status = Math.random() > 0.1 ? 'success' : 'error'
    }

    const successCount = checks.filter(c => c.status === 'success').length
    const errorCount = checks.filter(c => c.status === 'error').length

    const resultHtml = `
      <div class="system-check-result">
        <h4>系统检查结果</h4>
        <ul style="list-style: none; padding: 0;">
          ${checks.map(check => `
            <li style="padding: 8px 0; display: flex; align-items: center; gap: 8px;">
              <span style="color: ${check.status === 'success' ? '#10b981' : '#ef4444'};">
                ${check.status === 'success' ? '✓' : '✗'}
              </span>
              <span>${check.name}</span>
              <span style="margin-left: auto; color: ${check.status === 'success' ? '#10b981' : '#ef4444'};">
                ${check.status === 'success' ? '正常' : '异常'}
              </span>
            </li>
          `).join('')}
        </ul>
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
          <p><strong>检查完成：</strong> ${successCount} 项正常，${errorCount} 项异常</p>
        </div>
      </div>
    `

    ElMessageBox.alert(resultHtml, '系统检查', {
      confirmButtonText: '关闭',
      dangerouslyUseHTMLString: true,
      customClass: 'system-check-dialog'
    })
  } catch (error) {
    ElMessage.error('系统检查失败')
  }
}

// 监听主题变化
watch(() => settings.theme, (newTheme) => {
  // 应用主题变化
  document.documentElement.setAttribute('data-theme', newTheme)
})

// 监听主色调变化
watch(() => settings.primaryColor, (newColor) => {
  // 应用主色调变化
  document.documentElement.style.setProperty('--el-color-primary', newColor)
})

// 生命周期
onMounted(() => {
  // 从本地存储加载设置
  const savedSettings = localStorage.getItem('userSettings')
  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings)
      Object.assign(settings, parsed)
    } catch (error) {
      console.error('加载设置失败:', error)
    }
  }

  // 应用当前设置
  document.documentElement.setAttribute('data-theme', settings.theme)
  document.documentElement.style.setProperty('--el-color-primary', settings.primaryColor)
})
</script>

<style scoped>
.system-settings {
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

.header-actions {
  display: flex;
  gap: 12px;
}

/* 设置内容 */
.settings-content {
  display: flex;
  gap: 20px;
  height: calc(100vh - 200px);
}

/* 左侧导航 */
.settings-sidebar {
  width: 250px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.settings-menu {
  border: none;
}

.settings-menu .el-menu-item {
  height: 50px;
  line-height: 50px;
  margin: 4px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.settings-menu .el-menu-item:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.settings-menu .el-menu-item.is-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* 右侧设置面板 */
.settings-main {
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 24px;
  overflow-y: auto;
}

.settings-panel h3 {
  margin: 0 0 24px 0;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 12px;
}

/* 设置组 */
.setting-group {
  margin-bottom: 32px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #fafbfc;
}

.setting-group.danger-zone {
  border-color: #fecaca;
  background: #fef2f2;
}

.setting-header {
  margin-bottom: 20px;
}

.setting-header h4 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

.setting-header p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

/* 设置项 */
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #e2e8f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  flex: 1;
}

.setting-label span {
  display: block;
  color: #2c3e50;
  font-weight: 500;
  margin-bottom: 4px;
}

.setting-label small {
  color: #64748b;
  font-size: 12px;
}

/* 主题选择 */
.theme-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.theme-card {
  text-align: center;
  cursor: pointer;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.theme-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.theme-card.active {
  border-color: #667eea;
  background: #f0f4ff;
}

.theme-preview {
  width: 80px;
  height: 50px;
  border-radius: 6px;
  margin: 0 auto 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.light-theme {
  background: #ffffff;
}

.light-theme .preview-header {
  height: 12px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.light-theme .preview-content {
  display: flex;
  height: 37px;
}

.light-theme .preview-sidebar {
  width: 20px;
  background: #f1f5f9;
  border-right: 1px solid #e2e8f0;
}

.light-theme .preview-main {
  flex: 1;
  background: #ffffff;
}

.dark-theme {
  background: #1a202c;
}

.dark-theme .preview-header {
  height: 12px;
  background: #2d3748;
  border-bottom: 1px solid #4a5568;
}

.dark-theme .preview-content {
  display: flex;
  height: 37px;
}

.dark-theme .preview-sidebar {
  width: 20px;
  background: #2d3748;
  border-right: 1px solid #4a5568;
}

.dark-theme .preview-main {
  flex: 1;
  background: #1a202c;
}

.auto-theme {
  background: linear-gradient(45deg, #ffffff 50%, #1a202c 50%);
}

.auto-theme .preview-header {
  height: 12px;
  background: linear-gradient(45deg, #f8fafc 50%, #2d3748 50%);
}

.auto-theme .preview-content {
  display: flex;
  height: 37px;
}

.auto-theme .preview-sidebar {
  width: 20px;
  background: linear-gradient(45deg, #f1f5f9 50%, #2d3748 50%);
}

.auto-theme .preview-main {
  flex: 1;
  background: linear-gradient(45deg, #ffffff 50%, #1a202c 50%);
}

/* 颜色选择 */
.color-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
}

.color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.color-item:hover {
  border-color: #667eea;
}

.color-item.active {
  border-color: #667eea;
  background: #f0f4ff;
}

.color-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-bottom: 8px;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.color-item span {
  font-size: 12px;
  color: #64748b;
}

/* 布局设置 */
.layout-settings,
.notification-settings,
.email-settings,
.security-settings,
.privacy-settings,
.data-settings,
.export-settings,
.developer-settings,
.experimental-settings,
.danger-settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 语言选项 */
.language-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.language-options .el-radio {
  margin-right: 0;
  margin-bottom: 8px;
}

/* 时区设置 */
.timezone-settings,
.format-settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .settings-content {
    flex-direction: column;
    height: auto;
  }

  .settings-sidebar {
    width: 100%;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .theme-options {
    grid-template-columns: 1fr;
  }

  .color-options {
    grid-template-columns: repeat(3, 1fr);
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .footer-actions {
    flex-direction: column;
    align-items: center;
  }

  .footer-actions .el-button {
    width: 100%;
    max-width: 300px;
  }
}

/* 底部操作栏 */
.settings-footer {
  background: white;
  border-top: 1px solid #e2e8f0;
  padding: 20px 24px;
  margin-top: 20px;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
}

.footer-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.footer-actions .el-button {
  min-width: 120px;
}

/* 弹窗样式 */
:deep(.login-history-dialog) {
  width: 800px;
  max-width: 90vw;
}

:deep(.system-check-dialog) {
  width: 600px;
  max-width: 90vw;
}
</style>