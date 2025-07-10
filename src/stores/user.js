import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, register, getUserInfo } from '../api/auth'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))
  const roles = ref(JSON.parse(localStorage.getItem('roles') || '[]'))

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  const hasRole = computed(() => (role) => roles.value.includes(role))

  // 登录
  const loginAction = async (loginData) => {
    try {
      const response = await login(loginData)

      // 处理不同的响应格式
      let tokenValue = null
      let rolesValue = []
      let userInfoValue = {}

      // 尝试从不同的字段获取token
      if (response.token) {
        tokenValue = response.token
      } else if (response.data && response.data.token) {
        tokenValue = response.data.token
      } else if (response.access_token) {
        tokenValue = response.access_token
      } else if (response.data && response.data.access_token) {
        tokenValue = response.data.access_token
      }

      // 尝试从不同的字段获取角色信息
      if (response.roles) {
        rolesValue = Array.isArray(response.roles) ? response.roles : [response.roles]
      } else if (response.data && response.data.roles) {
        rolesValue = Array.isArray(response.data.roles) ? response.data.roles : [response.data.roles]
      } else if (response.authorities) {
        rolesValue = Array.isArray(response.authorities) ? response.authorities : [response.authorities]
      } else if (response.data && response.data.authorities) {
        rolesValue = Array.isArray(response.data.authorities) ? response.data.authorities : [response.data.authorities]
      }

      // 尝试获取用户信息
      if (response.user) {
        userInfoValue = response.user
      } else if (response.data && response.data.user) {
        userInfoValue = response.data.user
      } else if (response.userInfo) {
        userInfoValue = response.userInfo
      } else if (response.data && response.data.userInfo) {
        userInfoValue = response.data.userInfo
      }

      // 处理角色信息
      let userRole = null

      // 首先尝试从用户信息中获取角色
      if (userInfoValue && userInfoValue.role) {
        userRole = userInfoValue.role
      } else if (userInfoValue && userInfoValue.roles && userInfoValue.roles.length > 0) {
        userRole = userInfoValue.roles[0]
      }

      // 如果用户信息中没有角色，从角色数组中获取
      if (!userRole && rolesValue.length > 0) {
        // 处理角色数组，提取角色名称
        userRole = rolesValue[0]
        if (typeof userRole === 'object' && userRole.roleCode) {
          userRole = userRole.roleCode
        } else if (typeof userRole === 'object' && userRole.roleName) {
          // 根据角色名称映射到角色代码
          const roleNameMap = {
            '系统管理员': 'ADMIN',
            '数据分析师': 'ANALYST',
            '访客用户': 'VISITOR'
          }
          userRole = roleNameMap[userRole.roleName] || 'VISITOR'
        }
      }

      // 确保用户信息包含角色信息
      if (userInfoValue) {
        userInfoValue.role = userRole || 'VISITOR'
      }

      // 检查后端是否返回了错误信息
      if (response.status !== undefined && response.status !== 0) {
        // 后端返回了错误状态
        const errorMessage = response.message || '登录失败'
        console.error('后端返回错误:', response)
        ElMessage.error(errorMessage)
        return { success: false, message: errorMessage }
      }

      if (tokenValue) {
        // 保存 token
        token.value = tokenValue
        localStorage.setItem('token', tokenValue)

        // 保存角色信息
        roles.value = rolesValue
        localStorage.setItem('roles', JSON.stringify(rolesValue))

        // 保存用户信息
        const finalUserInfo = {
          username: userInfoValue.username || loginData.username,
          email: userInfoValue.email || '',
          realName: userInfoValue.realName || '',
          role: userInfoValue.role || (rolesValue.length > 0 ? rolesValue[0] : 'VISITOR'),
          roles: rolesValue,
          ...userInfoValue
        }
        userInfo.value = finalUserInfo
        localStorage.setItem('userInfo', JSON.stringify(finalUserInfo))

        console.log('登录成功，保存的用户信息:', finalUserInfo)
        console.log('保存的角色信息:', rolesValue)
        console.log('用户角色:', finalUserInfo.role)

        ElMessage.success('登录成功')
        return { success: true, data: response }
      } else {
        // 检查是否是成功响应但没有token
        if (response.status === 0 || response.success === true) {
          console.error('登录成功但未找到token字段，完整响应:', response)
          ElMessage.error('登录成功但服务器未返回访问令牌，请联系管理员')
          return { success: false, message: '服务器配置错误：未返回访问令牌' }
        } else {
          // 其他情况，可能是登录失败
          const errorMessage = response.message || '登录失败：未获取到有效令牌'
          console.error('登录失败，完整响应:', response)
          ElMessage.error(errorMessage)
          return { success: false, message: errorMessage }
        }
      }
    } catch (error) {
      console.error('登录错误:', error)
      console.error('错误详情:', error.response)
      const message = error.response?.data?.message || error.message || '登录失败，请检查用户名和密码'
      ElMessage.error(message)
      return { success: false, message }
    }
  }

  // 注册
  const registerAction = async (registerData) => {
    try {
      const response = await register(registerData)
      ElMessage.success('注册成功，请登录')
      return { success: true, data: response }
    } catch (error) {
      console.error('注册错误:', error)
      const message = error.response?.data?.message || '注册失败，请检查输入信息'
      ElMessage.error(message)
      return { success: false, message }
    }
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfo()
      userInfo.value = response
      localStorage.setItem('userInfo', JSON.stringify(response))
      return { success: true, data: response }
    } catch (error) {
      console.error('获取用户信息错误:', error)
      return { success: false, message: '获取用户信息失败' }
    }
  }

  // 退出登录
  const logoutAction = () => {
    token.value = ''
    userInfo.value = {}
    roles.value = []
    
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('roles')
    
    ElMessage.success('已退出登录')
  }

  // 清除用户数据
  const clearUserData = () => {
    token.value = ''
    userInfo.value = {}
    roles.value = []

    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('roles')
  }



  return {
    // 状态
    token,
    userInfo,
    roles,

    // 计算属性
    isLoggedIn,
    hasRole,

    // 方法
    loginAction,
    login: loginAction,
    registerAction,
    register: registerAction,
    getUserInfo: fetchUserInfo,
    logout: logoutAction,
    clearUserData
  }
})
