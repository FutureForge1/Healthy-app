<template>
  <div class="user-profile" v-loading="loading" element-loading-text="加载用户信息中..." element-loading-background="rgba(0, 0, 0, 0.8)">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <h1>个人资料</h1>
        <p>管理您的个人信息和账户设置</p>
      </div>
      <div class="header-actions">
        <el-button v-if="!isEditing" type="primary" @click="startEdit" :disabled="loading">
          <el-icon><Edit /></el-icon>
          编辑资料
        </el-button>
        <div v-else class="edit-actions">
          <el-button @click="cancelEdit" :disabled="saving">取消</el-button>
          <el-button type="primary" @click="saveProfile" :loading="saving">
            <el-icon><Check /></el-icon>
            保存
          </el-button>
        </div>
      </div>
    </div>

    <!-- 个人资料主要内容 -->
    <div class="profile-main">
      <!-- 左侧用户卡片区域 (60%) -->
      <div class="profile-left">
        <UserCard
          :user-info="userInfo"
          @edit-profile="showAvatarUploadDialog"
          @send-email="handleSendEmail"
          @call-phone="handleCallPhone"
          @view-profile="handleViewProfile"
        />

        <!-- 头像上传区域已移除，现在通过UserCard的编辑按钮触发 -->
      </div>

      <!-- 右侧信息表单区域 (60%) -->
      <div class="profile-right">
        <FormCard
          title="个人信息"
          subtitle="管理您的基本信息"
          width="100%"
          height="530px"
          max-width="none"
          padding="24px"
        >
          <el-form
            ref="profileFormRef"
            :model="profileForm"
            :rules="profileRules"
            label-width="100px"
            :disabled="!isEditing"
          >
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="profileForm.username"
                placeholder="请输入用户名"
              >
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="真实姓名" prop="realName">
              <el-input
                v-model="profileForm.realName"
                placeholder="请输入真实姓名"
              >
                <template #prefix>
                  <el-icon><UserFilled /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="邮箱地址" prop="email">
              <el-input
                v-model="profileForm.email"
                placeholder="请输入邮箱地址"
              >
                <template #prefix>
                  <el-icon><Message /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="手机号码" prop="phone">
              <el-input
                v-model="profileForm.phone"
                placeholder="请输入手机号码"
              >
                <template #prefix>
                  <el-icon><Phone /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="用户角色">
              <el-input
                :value="getRoleDisplayName(userInfo.role)"
                disabled
                placeholder="角色不可修改"
              >
                <template #prefix>
                  <el-icon><Medal /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="账户状态">
              <el-tag :type="userInfo.status === 'active' ? 'success' : 'danger'">
                {{ userInfo.status === 'active' ? '正常' : '禁用' }}
              </el-tag>
            </el-form-item>

            <el-form-item label="加入时间">
              <el-input
                :value="formatDate(userInfo.createTime)"
                disabled
                placeholder="注册时间"
              >
                <template #prefix>
                  <el-icon><Calendar /></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
        </FormCard>
      </div>
    </div>

    <!-- 安全设置区域 -->
    <div class="security-section">
      <FormCard
        title="安全设置"
        subtitle="保护您的账户安全"
        width="100%"
        height="auto"
        max-width="none"
        padding="32px"
        animation-speed="4s"
      >
        <div class="security-items">
          <div class="security-item">
            <div class="security-info">
              <div class="security-title">
                <el-icon><Lock /></el-icon>
                修改密码
              </div>
              <div class="security-desc">定期更换密码，保护账户安全</div>
            </div>
            <el-button @click="openChangePasswordDialog">修改</el-button>
          </div>

          <div class="security-item">
            <div class="security-info">
              <div class="security-title">
                <el-icon><Clock /></el-icon>
                最后登录
              </div>
              <div class="security-desc">{{ formatDate(userInfo.lastLoginTime) || '暂无记录' }}</div>
            </div>
          </div>
        </div>
      </FormCard>
    </div>

    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="showChangePassword"
      title="修改密码"
      width="500px"
      @close="resetPasswordForm"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="passwordForm.username"
            placeholder="用户名"
            disabled
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="验证码" prop="verificationCode">
          <div class="verification-input">
            <el-input
              v-model="passwordForm.verificationCode"
              placeholder="请输入验证码"
              maxlength="6"
            >
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
            <el-button
              type="primary"
              @click="sendVerificationCode"
              :loading="sendingCode"
              :disabled="codeCountdown > 0"
              class="send-code-btn"
            >
              {{ codeCountdown > 0 ? `${codeCountdown}s后重发` : '发送验证码' }}
            </el-button>
          </div>
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
            placeholder="请输入新密码"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
            placeholder="请再次输入新密码"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showChangePassword = false">取消</el-button>
          <el-button type="primary" @click="changePassword" :loading="changingPassword">
            确认修改
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 头像上传对话框 -->
    <AvatarUploadDialog
      v-model:visible="showAvatarDialog"
      @upload-success="handleAvatarUploadFromDialog"
      @upload-error="handleAvatarUploadError"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Edit,
  Check,
  UserFilled,
  Camera,
  Calendar,
  User,
  Message,
  Phone,
  Medal,
  Lock,
  Clock,
  InfoFilled
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { ROLE_DISPLAY_NAMES } from '@/utils/permission'
import { updateUserInfo, changePassword as changePasswordAPI, updateAvatar, uploadAvatarFile, getUserByUsername, getUserDetail } from '@/api/user'
import { sendPasswordResetCode, resetPasswordWithCode } from '@/api/auth'
import UserCard from '@/components/UserCard.vue'
import FormCard from '@/components/FormCard.vue'
import AvatarUploadDialog from '@/components/AvatarUploadDialog.vue'

// Store
const userStore = useUserStore()

// 响应式数据
const isEditing = ref(false)
const saving = ref(false)
const showChangePassword = ref(false)
const changingPassword = ref(false)
const uploadingAvatar = ref(false)
const loading = ref(false)
const sendingCode = ref(false)
const codeCountdown = ref(0)
const previewUrls = ref(new Set()) // 存储需要清理的预览URL
const showAvatarDialog = ref(false) // 控制头像上传对话框显示

// 表单引用
const profileFormRef = ref(null)
const passwordFormRef = ref(null)

// 用户信息
const userInfo = computed(() => userStore.userInfo)

// 个人资料表单
const profileForm = reactive({
  id: '',
  username: '',
  realName: '',
  email: '',
  phone: '',
  avatar: ''
})

// 密码修改表单
const passwordForm = reactive({
  username: '',
  verificationCode: '',
  newPassword: '',
  confirmPassword: ''
})

// 表单验证规则
const profileRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '真实姓名长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

const passwordRules = {
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' }
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度为6位', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 方法
const getRoleDisplayName = (role) => {
  return ROLE_DISPLAY_NAMES[role] || role || '未知角色'
}

const getRoleTagType = (role) => {
  const typeMap = {
    'ADMIN': 'danger',
    'ANALYST': 'warning',
    'VISITOR': 'info'
  }
  return typeMap[role] || 'info'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '暂无记录'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

const initProfileForm = () => {
  console.log('初始化表单，当前用户信息:', userInfo.value)

  // 验证头像URL的有效性
  let avatarUrl = userInfo.value.avatar || ''
  if (avatarUrl && avatarUrl.startsWith('file://')) {
    console.warn('检测到无效的本地文件URL，清空头像:', avatarUrl)
    avatarUrl = ''
  }

  Object.assign(profileForm, {
    id: userInfo.value.id || '',
    username: userInfo.value.username || '',
    realName: userInfo.value.realName || '',
    email: userInfo.value.email || '',
    phone: userInfo.value.phone || '',
    avatar: avatarUrl
  })
  console.log('表单初始化完成:', profileForm)
}

const startEdit = () => {
  console.log('开始编辑模式')
  isEditing.value = true
  initProfileForm()
}

const cancelEdit = () => {
  console.log('取消编辑模式')
  isEditing.value = false
  initProfileForm()
}

const saveProfile = async () => {
  if (!profileFormRef.value) return

  try {
    await profileFormRef.value.validate()
    saving.value = true

    // 准备更新数据，按照API规范格式
    const updateData = {
      id: profileForm.id,
      username: profileForm.username,
      realName: profileForm.realName,
      email: profileForm.email,
      phone: profileForm.phone
    }

    console.log('准备更新的数据:', updateData)

    // 调用更新API
    const response = await updateUserInfo(updateData)
    console.log('更新响应:', response)

    // 更新本地用户信息
    const updatedUserInfo = {
      ...userInfo.value,
      ...updateData,
      // 保持其他字段不变
      avatar: profileForm.avatar
    }

    console.log('保存成功，更新本地用户信息:', updatedUserInfo)

    // 更新store和localStorage
    userStore.userInfo = updatedUserInfo
    localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo))

    ElMessage.success('个人资料更新成功')
    isEditing.value = false

    // 重新获取用户信息以确保数据同步（可选，因为我们已经有最新数据）
    // await refreshUserInfo()
  } catch (error) {
    console.error('更新个人资料失败:', error)
    const message = error.response?.data?.message || error.message || '更新失败，请稍后重试'
    ElMessage.error(message)
  } finally {
    saving.value = false
  }
}

// 将文件转换为base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// 原来的上传方法已移除，现在使用对话框处理

const changePassword = async () => {
  if (!passwordFormRef.value) return

  try {
    await passwordFormRef.value.validate()
    changingPassword.value = true

    // 调用密码重置API
    const response = await resetPasswordWithCode({
      username: passwordForm.username,
      newPassword: passwordForm.newPassword,
      verificationCode: passwordForm.verificationCode
    })

    console.log('密码重置响应:', response)
    ElMessage.success(response.data || '密码修改成功')
    showChangePassword.value = false
    resetPasswordForm()
  } catch (error) {
    console.error('修改密码失败:', error)
    const message = error.response?.data?.message || error.message || '修改密码失败，请稍后重试'
    ElMessage.error(message)
  } finally {
    changingPassword.value = false
  }
}

const resetPasswordForm = () => {
  Object.assign(passwordForm, {
    username: userInfo.value.username || '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  })
  if (passwordFormRef.value) {
    passwordFormRef.value.clearValidate()
  }
  // 重置验证码倒计时
  codeCountdown.value = 0
}

// 发送验证码
const sendVerificationCode = async () => {
  if (!passwordForm.username) {
    ElMessage.warning('用户名不能为空')
    return
  }

  try {
    sendingCode.value = true

    await sendPasswordResetCode(passwordForm.username)

    ElMessage.success('验证码已发送，请查收')

    // 开始倒计时
    codeCountdown.value = 60
    const timer = setInterval(() => {
      codeCountdown.value--
      if (codeCountdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)

  } catch (error) {
    console.error('发送验证码失败:', error)
    const message = error.response?.data?.message || error.message || '发送验证码失败，请稍后重试'
    ElMessage.error(message)
  } finally {
    sendingCode.value = false
  }
}

// 打开修改密码对话框
const openChangePasswordDialog = () => {
  // 初始化表单数据
  passwordForm.username = userInfo.value.username || ''
  passwordForm.verificationCode = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''

  // 重置验证码倒计时
  codeCountdown.value = 0

  // 显示对话框
  showChangePassword.value = true
}

// 刷新用户信息
const refreshUserInfo = async () => {
  loading.value = true
  try {
    console.log('开始刷新用户信息...')

    // 如果有用户名，使用用户名查询API
    let response = null
    if (userInfo.value.username) {
      try {
        response = await getUserByUsername(userInfo.value.username)
        console.log('通过用户名获取用户信息响应:', response)
      } catch (error) {
        console.warn('通过用户名获取用户信息失败，尝试使用通用API:', error)
        // 如果用户名查询失败，尝试使用通用API
        response = await getUserDetail()
        console.log('通过通用API获取用户信息响应:', response)
      }
    } else {
      response = await getUserDetail()
      console.log('获取用户信息响应:', response)
    }

    // 处理不同的响应格式
    let userData = null
    if (response.data) {
      userData = response.data
    } else {
      userData = response
    }

    if (userData) {
      console.log('解析的用户数据:', userData)
      // 更新用户信息，保持现有字段不被覆盖
      const updatedUserInfo = {
        ...userInfo.value,
        ...userData,
        // 确保关键字段存在
        id: userData.id || userInfo.value.id,
        username: userData.username || userInfo.value.username,
        realName: userData.realName || userInfo.value.realName,
        email: userData.email || userInfo.value.email,
        phone: userData.phone || userInfo.value.phone,
        avatar: userData.avatar || userInfo.value.avatar,
        role: userData.role || userInfo.value.role
      }

      console.log('更新后的用户信息:', updatedUserInfo)
      userStore.userInfo = updatedUserInfo
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo))

      // 重新初始化表单
      initProfileForm()
    } else {
      console.warn('未获取到有效的用户数据')
      // 如果没有获取到数据，至少初始化表单
      initProfileForm()
    }
  } catch (error) {
    console.error('刷新用户信息失败:', error)
    // 即使失败也要初始化表单，使用现有的用户信息
    initProfileForm()
    // 不显示错误消息，静默失败
  } finally {
    loading.value = false
  }
}

// UserCard 事件处理
const handleSendEmail = () => {
  if (userInfo.value.email) {
    window.open(`mailto:${userInfo.value.email}`)
  }
}

const handleCallPhone = () => {
  if (userInfo.value.phone) {
    window.open(`tel:${userInfo.value.phone}`)
  }
}

const handleViewProfile = () => {
  // 可以添加查看详细资料的逻辑
  console.log('查看用户详细资料')
}

// 获取有效的头像URL
const getValidAvatarUrl = () => {
  // 优先使用表单中的头像
  if (profileForm.avatar) {
    return profileForm.avatar
  }

  // 其次使用用户信息中的头像
  if (userInfo.value.avatar) {
    return userInfo.value.avatar
  }

  // 最后返回空，让el-avatar显示默认图标
  return ''
}

// 头像加载错误处理
const handleAvatarError = (event) => {
  console.warn('头像加载失败:', event)
  console.warn('当前头像URL:', profileForm.avatar)

  // 如果是blob URL失败，尝试使用用户原始头像
  if (profileForm.avatar && profileForm.avatar.startsWith('blob:')) {
    console.log('Blob URL失败，尝试使用原始头像')
    profileForm.avatar = userInfo.value.avatar || ''
  } else {
    // 其他情况清空头像，让组件显示默认图标
    console.log('头像URL无效，清空头像')
    profileForm.avatar = ''
  }
}

// 显示头像上传对话框
const showAvatarUploadDialog = () => {
  console.log('点击了更换头像按钮，准备显示对话框')
  showAvatarDialog.value = true
  console.log('showAvatarDialog.value 已设置为:', showAvatarDialog.value)
}

// 处理从对话框上传的头像
const handleAvatarUploadFromDialog = async (file) => {
  uploadingAvatar.value = true

  try {
    console.log('从对话框接收到文件:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    })

    // 转换文件为base64
    const base64Data = await fileToBase64(file)
    console.log('文件转换为base64完成，长度:', base64Data.length)

    // 调用API更新头像
    const response = await updateAvatar(userInfo.value.username, base64Data)
    console.log('头像更新响应:', response)

    // 处理响应
    if (response && (response.code === 200 || response.status === 200 || response.data)) {
      // 更新表单和用户信息中的头像
      profileForm.avatar = base64Data

      const updatedUserInfo = { ...userInfo.value, avatar: base64Data }
      userStore.userInfo = updatedUserInfo
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo))

      console.log('头像更新成功，已更新用户信息:', updatedUserInfo)
      ElMessage.success('头像更新成功')
    } else {
      console.warn('头像更新响应格式异常:', response)
      ElMessage.success('头像已更新（本地预览）')
    }
  } catch (error) {
    console.error('头像上传失败:', error)
    handleAvatarUploadError(error)
  } finally {
    uploadingAvatar.value = false
  }
}

// 处理头像上传错误
const handleAvatarUploadError = (error) => {
  console.error('头像上传错误:', error)

  let message = '头像上传失败，请稍后重试'
  if (error.response?.status === 500) {
    message = '服务器内部错误，请检查后端服务是否正常运行'
  } else if (error.response?.status === 404) {
    message = 'API端点不存在，请检查后端路由配置'
  } else if (error.response?.status === 413) {
    message = '文件太大，请选择小于2MB的图片'
  } else if (error.response?.data?.message) {
    message = error.response.data.message
  }

  ElMessage.error(message)
}

// 清理所有预览URL
const cleanupPreviewUrls = () => {
  previewUrls.value.forEach(url => {
    URL.revokeObjectURL(url)
  })
  previewUrls.value.clear()
}

// 生命周期
onMounted(async () => {
  console.log('UserProfile组件挂载，当前用户信息:', userInfo.value)

  // 如果已有用户信息，先初始化表单
  if (userInfo.value && Object.keys(userInfo.value).length > 0) {
    initProfileForm()
  }

  // 刷新用户信息以确保数据是最新的
  await refreshUserInfo()
})

onUnmounted(() => {
  console.log('UserProfile组件卸载，清理预览URL')
  cleanupPreviewUrls()
})
</script>

<style scoped>
.user-profile {
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

/* 页面标题 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-content p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.edit-actions {
  display: flex;
  gap: 12px;
}

/* 个人资料主要内容 */
.profile-main {
  display: flex;
  gap: 0; /* 完全移除间隙 */
  align-items: flex-start;
  margin-bottom: 32px;
}

.profile-left {
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 0 0 40%; /* 固定60%宽度 */
  max-width: 40%;
  align-items: stretch; /* 让子元素拉伸填满宽度 */
}

.profile-right {
  flex: 0 0 60%; /* 固定40%宽度 */
  max-width: 60%;
  min-width: 0;
}

/* FormCard组件已包含所有必要样式 */

/* 头像上传区域 */
.avatar-upload-section {
  width: 100%; /* 改为100%宽度，与UserCard保持一致 */
}

.avatar-upload-section .el-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.avatar-upload-section .el-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.upload-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #2c3e50;
}

.avatar-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.preview-text {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: #666;
}

.upload-tip {
  margin-top: 12px;
  text-align: left;
  background: #f0f9ff;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.upload-tip p {
  margin: 4px 0;
  font-size: 12px;
  color: #1e40af;
  display: flex;
  align-items: center;
  gap: 6px;
}

.upload-tip .el-icon {
  font-size: 14px;
}

/* 表单样式 */
.profile-right .el-form-item {
  margin-bottom: 24px;
}

/* 安全设置区域 */
.security-section {
  width: 100%;
}

/* 安全设置项样式 */

.security-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.security-item:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.security-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.security-desc {
  font-size: 14px;
  color: #7f8c8d;
}

/* 对话框 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .profile-main {
    flex-direction: column;
    align-items: center;
  }

  .profile-left {
    flex: none;
    max-width: none;
    width: 100%;
    align-items: center;
  }

  .profile-right {
    flex: none;
    max-width: none;
    width: 100%;
    max-width: 600px;
  }
}

@media (max-width: 768px) {
  .user-profile {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .profile-card {
    padding: 24px;
  }

  .security-item {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .avatar-upload-section {
    width: 100%; /* 移动端也保持100%宽度 */
  }

  .verification-input {
    flex-direction: column;
    align-items: stretch;
  }

  .send-code-btn {
    margin-top: 8px;
    min-width: auto;
  }
}

/* 验证码输入框样式 */
.verification-input {
  display: flex;
  gap: 12px;
  align-items: center;
}

.verification-input .el-input {
  flex: 1;
}

.send-code-btn {
  white-space: nowrap;
  min-width: 120px;
}

/* 对话框样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 表单样式优化 */
:deep(.el-form-item__label) {
  font-weight: 600;
  color: #2c3e50;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
}

:deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
}

:deep(.el-avatar) {
  transition: all 0.3s ease;
}

:deep(.el-avatar:hover) {
  transform: scale(1.05);
}
</style>
