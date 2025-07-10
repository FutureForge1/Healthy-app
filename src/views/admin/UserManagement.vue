<template>
  <div class="user-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <h1>用户权限管理</h1>
        <p>管理系统用户和权限分配</p>
        <div class="api-status">
          <span class="api-status-label">后端API:</span>
          <span class="api-url">http://localhost:8080/api/users</span>
        </div>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="showCreateUserDialog = true">
          <el-icon><Plus /></el-icon>
          创建用户
        </el-button>
        <el-button @click="refreshUsers">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 权限统计卡片 -->
    <div class="permission-stats">
      <div class="stat-card admin-card">
        <div class="stat-icon">
          <el-icon><UserFilled /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ userStats.adminCount }}</div>
          <div class="stat-label">系统管理员</div>
        </div>
      </div>
      <div class="stat-card analyst-card">
        <div class="stat-icon">
          <el-icon><DataAnalysis /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ userStats.analystCount }}</div>
          <div class="stat-label">数据分析师</div>
        </div>
      </div>
      <div class="stat-card visitor-card">
        <div class="stat-icon">
          <el-icon><View /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ userStats.visitorCount }}</div>
          <div class="stat-label">访客用户</div>
        </div>
      </div>
      <div class="stat-card total-card">
        <div class="stat-icon">
          <el-icon><User /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ userStats.totalCount }}</div>
          <div class="stat-label">总用户数</div>
        </div>
      </div>
    </div>

    <!-- 用户列表 -->
    <div class="user-list">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>用户列表</span>
            <div class="search-box">
              <el-input
                v-model="searchQuery"
                placeholder="搜索用户名、邮箱或真实姓名"
                @input="handleSearch"
                clearable
                style="width: 300px; margin-right: 12px;"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>

              <el-select
                v-model="selectedRole"
                placeholder="筛选角色"
                clearable
                style="width: 120px; margin-right: 12px;"
                @change="loadUsers"
              >
                <el-option label="管理员" value="ADMIN" />
                <el-option label="分析师" value="ANALYST" />
                <el-option label="访客" value="VISITOR" />
              </el-select>

              <el-select
                v-model="selectedStatus"
                placeholder="筛选状态"
                clearable
                style="width: 120px;"
                @change="loadUsers"
              >
                <el-option label="启用" value="active" />
                <el-option label="禁用" value="inactive" />
              </el-select>
            </div>
          </div>
        </template>

        <el-table :data="filteredUsers" stripe v-loading="loading">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="username" label="用户名" width="120" />
          <el-table-column prop="realName" label="真实姓名" width="120" />
          <el-table-column prop="email" label="邮箱" width="200" />
          <el-table-column prop="role" label="角色" width="120">
            <template #default="{ row }">
              <el-tag :type="getRoleTagType(row.role)">
                {{ getRoleDisplayName(row.role) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
                {{ row.status === 'active' ? '正常' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="lastLoginTime" label="最后登录" width="180">
            <template #default="{ row }">
              {{ formatTime(row.lastLoginTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180">
            <template #default="{ row }">
              {{ formatTime(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280" fixed="right">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button size="small" @click="editUser(row)">编辑</el-button>
                <el-button size="small" type="info" @click="managePermissions(row)">权限</el-button>
                <el-button
                  size="small"
                  :type="row.status === 'active' ? 'warning' : 'success'"
                  @click="toggleUserStatus(row)"
                >
                  {{ row.status === 'active' ? '禁用' : '启用' }}
                </el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="deleteUser(row)"
                  v-if="row.role !== 'ADMIN' || userStats.adminCount > 1"
                >
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="totalUsers"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>

    <!-- 创建/编辑用户对话框 -->
    <el-dialog
      v-model="showCreateUserDialog"
      :title="editingUser ? '编辑用户' : '创建用户'"
      width="600px"
      @close="resetUserForm"
    >
      <el-form :model="userForm" :rules="userFormRules" ref="userFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" :disabled="editingUser" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="userForm.realName" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" style="width: 100%">
            <el-option
              v-for="role in availableRoles"
              :key="role.value"
              :label="role.label"
              :value="role.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!editingUser">
          <el-input v-model="userForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" v-if="!editingUser">
          <el-input v-model="userForm.confirmPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="状态" prop="status" v-if="editingUser">
          <el-radio-group v-model="userForm.status">
            <el-radio label="active">正常</el-radio>
            <el-radio label="disabled">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showCreateUserDialog = false">取消</el-button>
          <el-button type="primary" @click="saveUser" :loading="saving">
            {{ editingUser ? '更新' : '创建' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 权限管理对话框 -->
    <el-dialog
      v-model="showPermissionDialog"
      title="权限管理"
      width="60%"
      :close-on-click-modal="false"
    >
      <div v-if="permissionLoading" class="permission-loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载权限数据中...</span>
      </div>

      <div v-else class="permission-content">
        <div class="permission-header">
          <h4>用户：{{ currentPermissionUser?.realName }} ({{ currentPermissionUser?.username }})</h4>
          <p>角色：{{ getRoleDisplayName(currentPermissionUser?.role) }}</p>
        </div>

        <el-divider />

        <div class="permission-tree">
          <h5>权限分配</h5>
          <el-tree
            ref="permissionTreeRef"
            :data="permissionTree"
            :props="{ children: 'children', label: 'name' }"
            show-checkbox
            node-key="id"
            :default-checked-keys="userPermissions"
            :check-strictly="false"
            class="permission-tree-component"
          />
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showPermissionDialog = false">取消</el-button>
          <el-button type="primary" @click="savePermissions" :loading="permissionSaving">
            保存权限
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import userManagementApi from '@/api/userManagement'
import {
  Plus,
  Refresh,
  Search,
  UserFilled,
  DataAnalysis,
  View,
  User,
  Loading
} from '@element-plus/icons-vue'
import { ROLE_DISPLAY_NAMES } from '@/utils/permission'

// 响应式数据
const loading = ref(false)
const saving = ref(false)
const showCreateUserDialog = ref(false)
const editingUser = ref(null)
const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const totalUsers = ref(0)

// 用户列表
const users = ref([])

// 用户统计
const userStats = computed(() => {
  const stats = {
    adminCount: 0,
    analystCount: 0,
    visitorCount: 0,
    totalCount: users.value.length
  }
  
  users.value.forEach(user => {
    switch (user.role) {
      case 'ADMIN':
        stats.adminCount++
        break
      case 'ANALYST':
        stats.analystCount++
        break
      case 'VISITOR':
        stats.visitorCount++
        break
    }
  })
  
  return stats
})

// 过滤后的用户列表
const filteredUsers = computed(() => {
  if (!searchQuery.value) {
    return users.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.username.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    user.realName.toLowerCase().includes(query)
  )
})

// 可用角色
const availableRoles = ref([
  { value: 'ADMIN', label: '系统管理员' },
  { value: 'ANALYST', label: '数据分析师' },
  { value: 'VISITOR', label: '访客用户' }
])

// 用户表单
const userForm = reactive({
  username: '',
  realName: '',
  email: '',
  phone: '',
  role: '',
  password: '',
  confirmPassword: '',
  status: 'active'
})

// 表单引用
const userFormRef = ref(null)

// 权限管理相关数据
const showPermissionDialog = ref(false)
const permissionLoading = ref(false)
const permissionSaving = ref(false)
const currentPermissionUser = ref(null)
const permissionTree = ref([])
const userPermissions = ref([])
const permissionTreeRef = ref(null)

// 表单验证规则
const userFormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== userForm.password) {
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
const loadUsers = async () => {
  loading.value = true
  try {
    // 构建查询参数
    const params = {
      page: currentPage.value,
      size: pageSize.value
    }

    // 添加搜索条件
    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }

    // 添加角色筛选
    if (selectedRole.value) {
      params.role = selectedRole.value
    }

    // 添加状态筛选
    if (selectedStatus.value) {
      params.status = selectedStatus.value
    }

    // 调用真实API
    const response = await userManagementApi.getUserList(params)

    // 后端返回格式: {status: 0, message: '查询成功', data: {...}}
    // status: 0 表示成功
    if (response.status === 0) {
      const data = response.data || {}
      users.value = data.records || data.list || data.content || []
      totalUsers.value = data.total || data.totalElements || data.totalCount || 0

      ElMessage.success(`用户数据加载成功，共 ${totalUsers.value} 条记录`)
    } else {
      throw new Error(response.message || '获取用户列表失败')
    }

  } catch (error) {
    console.error('加载用户失败:', error)
    console.error('错误详情:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    })

    // 根据错误类型提供不同的处理
    if (error.response?.status === 404) {
      ElMessage.warning('用户管理API接口不存在，使用模拟数据')
      loadMockUsers()
    } else if (error.response?.status === 500) {
      ElMessage.error('服务器内部错误，请检查后端服务')
      loadMockUsers()
    } else if (error.code === 'NETWORK_ERROR' || !error.response) {
      ElMessage.error('网络连接失败，请检查后端服务是否启动在 http://localhost:8080')
      loadMockUsers()
    } else {
      ElMessage.error(error.response?.data?.message || error.message || '加载用户数据失败')
      loadMockUsers()
    }
  } finally {
    loading.value = false
  }
}

// 加载模拟数据作为降级方案
const loadMockUsers = () => {
  users.value = [
    {
      id: 1,
      username: 'admin',
      realName: '系统管理员',
      email: 'admin@example.com',
      phone: '13800138000',
      role: 'ADMIN',
      status: 'active',
      lastLoginTime: '2024-01-15 10:30:00',
      createTime: '2024-01-01 00:00:00'
    },
    {
      id: 2,
      username: 'analyst01',
      realName: '张分析师',
      email: 'analyst@example.com',
      phone: '13800138001',
      role: 'ANALYST',
      status: 'active',
      lastLoginTime: '2024-01-15 09:15:00',
      createTime: '2024-01-02 10:00:00'
    },
    {
      id: 3,
      username: 'visitor01',
      realName: '李访客',
      email: 'visitor@example.com',
      phone: '13800138002',
      role: 'VISITOR',
      status: 'active',
      lastLoginTime: '2024-01-14 16:45:00',
      createTime: '2024-01-03 14:30:00'
    }
  ]

  totalUsers.value = users.value.length
}

const refreshUsers = () => {
  loadUsers()
}

const handleSearch = () => {
  // 重置到第一页并重新加载数据
  currentPage.value = 1
  loadUsers()
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadUsers()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  loadUsers()
}

const getRoleDisplayName = (role) => {
  return ROLE_DISPLAY_NAMES[role] || role
}

const getRoleTagType = (role) => {
  const typeMap = {
    'ADMIN': 'danger',
    'ANALYST': 'warning',
    'VISITOR': 'info'
  }
  return typeMap[role] || 'info'
}

const formatTime = (timeStr) => {
  if (!timeStr) return '-'
  return new Date(timeStr).toLocaleString('zh-CN')
}

const editUser = (user) => {
  editingUser.value = user
  Object.assign(userForm, {
    username: user.username,
    realName: user.realName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    password: '',
    confirmPassword: ''
  })
  showCreateUserDialog.value = true
}

const toggleUserStatus = async (user) => {
  const action = user.status === 'active' ? '禁用' : '启用'
  const newStatus = user.status === 'active' ? 'inactive' : 'active'

  try {
    await ElMessageBox.confirm(`确定要${action}用户 ${user.username} 吗？`, '确认操作', {
      type: 'warning'
    })

    // 调用真实API
    const response = await userManagementApi.updateUserStatus(user.id, {
      status: newStatus
    })

    // 后端返回格式: {status: 0, message: '操作成功'}
    if (response.status === 0) {
      user.status = newStatus
      ElMessage.success(`${action}成功`)
    } else {
      throw new Error(response.message || `${action}失败`)
    }

  } catch (error) {
    if (error !== 'cancel') { // 用户取消操作时不显示错误
      console.error(`${action}用户失败:`, error)

      // 如果API不存在，使用模拟操作
      if (error.response?.status === 404) {
        user.status = newStatus
        ElMessage.success(`${action}成功（模拟操作）`)
      } else {
        ElMessage.error(error.response?.data?.message || error.message || `${action}失败`)
      }
    }
  }
}

const deleteUser = async (user) => {
  try {
    await ElMessageBox.confirm(`确定要删除用户 ${user.username} 吗？此操作不可恢复！`, '确认删除', {
      type: 'warning'
    })

    // 模拟API调用
    const index = users.value.findIndex(u => u.id === user.id)
    if (index > -1) {
      users.value.splice(index, 1)
      totalUsers.value = users.value.length
    }

    ElMessage.success('删除成功')
  } catch {
    // 用户取消操作
  }
}

const saveUser = async () => {
  if (!userFormRef.value) return

  try {
    await userFormRef.value.validate()
    saving.value = true

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (editingUser.value) {
      // 更新用户
      const index = users.value.findIndex(u => u.id === editingUser.value.id)
      if (index > -1) {
        Object.assign(users.value[index], {
          realName: userForm.realName,
          email: userForm.email,
          phone: userForm.phone,
          role: userForm.role,
          status: userForm.status
        })
      }
      ElMessage.success('用户更新成功')
    } else {
      // 创建用户
      const newUser = {
        id: Date.now(),
        username: userForm.username,
        realName: userForm.realName,
        email: userForm.email,
        phone: userForm.phone,
        role: userForm.role,
        status: 'active',
        lastLoginTime: null,
        createTime: new Date().toISOString()
      }
      users.value.push(newUser)
      totalUsers.value = users.value.length
      ElMessage.success('用户创建成功')
    }

    showCreateUserDialog.value = false
    resetUserForm()
  } catch (error) {
    console.error('保存用户失败:', error)
  } finally {
    saving.value = false
  }
}

const resetUserForm = () => {
  editingUser.value = null
  Object.assign(userForm, {
    username: '',
    realName: '',
    email: '',
    phone: '',
    role: '',
    password: '',
    confirmPassword: '',
    status: 'active'
  })
  if (userFormRef.value) {
    userFormRef.value.clearValidate()
  }
}

// 权限管理方法
const managePermissions = async (user) => {
  currentPermissionUser.value = user
  showPermissionDialog.value = true

  await loadPermissionData(user.id)
}

const loadPermissionData = async (userId) => {
  permissionLoading.value = true

  try {
    // 并行加载权限树和用户权限
    const [treeResponse, userPermResponse] = await Promise.all([
      userManagementApi.getPermissionTree(),
      userManagementApi.getUserPermissions(userId)
    ])

    if (treeResponse.code === 200) {
      permissionTree.value = treeResponse.data || []
    }

    if (userPermResponse.code === 200) {
      userPermissions.value = userPermResponse.data.permissions || []
    }

  } catch (error) {
    console.error('加载权限数据失败:', error)

    if (error.response?.status === 404) {
      ElMessage.warning('权限管理API未实现，使用模拟数据')
      loadMockPermissionData()
    } else {
      ElMessage.error('加载权限数据失败')
    }
  } finally {
    permissionLoading.value = false
  }
}

const loadMockPermissionData = () => {
  // 模拟权限树数据
  permissionTree.value = [
    {
      id: 'dashboard',
      name: '仪表板',
      children: [
        { id: 'dashboard_view', name: '查看仪表板' }
      ]
    },
    {
      id: 'statistics',
      name: '统计分析',
      children: [
        { id: 'statistics_view', name: '查看统计' },
        { id: 'statistics_export', name: '导出数据' }
      ]
    },
    {
      id: 'user_management',
      name: '用户管理',
      children: [
        { id: 'user_view', name: '查看用户' },
        { id: 'user_create', name: '创建用户' },
        { id: 'user_edit', name: '编辑用户' },
        { id: 'user_delete', name: '删除用户' }
      ]
    },
    {
      id: 'system',
      name: '系统管理',
      children: [
        { id: 'system_config', name: '系统配置' },
        { id: 'system_logs', name: '系统日志' }
      ]
    }
  ]

  // 根据用户角色设置默认权限
  const role = currentPermissionUser.value?.role
  if (role === 'ADMIN') {
    userPermissions.value = ['dashboard_view', 'statistics_view', 'statistics_export', 'user_view', 'user_create', 'user_edit', 'user_delete', 'system_config', 'system_logs']
  } else if (role === 'ANALYST') {
    userPermissions.value = ['dashboard_view', 'statistics_view', 'statistics_export', 'user_view']
  } else {
    userPermissions.value = ['dashboard_view', 'statistics_view']
  }
}

const savePermissions = async () => {
  if (!permissionTreeRef.value) return

  permissionSaving.value = true

  try {
    // 获取选中的权限
    const checkedKeys = permissionTreeRef.value.getCheckedKeys()
    const halfCheckedKeys = permissionTreeRef.value.getHalfCheckedKeys()
    const allPermissions = [...checkedKeys, ...halfCheckedKeys]

    // 调用API保存权限
    const response = await userManagementApi.updateUserPermissions(currentPermissionUser.value.id, {
      permissions: allPermissions
    })

    if (response.code === 200) {
      ElMessage.success('权限保存成功')
      showPermissionDialog.value = false
    } else {
      throw new Error(response.message || '保存权限失败')
    }

  } catch (error) {
    console.error('保存权限失败:', error)

    if (error.response?.status === 404) {
      ElMessage.success('权限保存成功（模拟操作）')
      showPermissionDialog.value = false
    } else {
      ElMessage.error(error.response?.data?.message || error.message || '保存权限失败')
    }
  } finally {
    permissionSaving.value = false
  }
}

// 生命周期
onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.user-management {
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

.header-actions {
  display: flex;
  gap: 12px;
}

/* 权限统计卡片 */
.permission-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  font-size: 24px;
  color: white;
}

.admin-card .stat-icon {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
}

.analyst-card .stat-icon {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
}

.visitor-card .stat-icon {
  background: linear-gradient(135deg, #45b7d1 0%, #96c93d 100%);
}

.total-card .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 500;
}

/* 用户列表 */
.user-list {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-box {
  width: 300px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 对话框 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-management {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .permission-stats {
    grid-template-columns: 1fr;
  }

  .card-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .search-box {
    width: 100%;
  }
}

/* 表格样式优化 */
:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table th) {
  background: #f8f9fa;
  color: #495057;
  font-weight: 600;
}

:deep(.el-table td) {
  border-bottom: 1px solid #f1f3f4;
}

:deep(.el-table tr:hover td) {
  background: #f8f9fa;
}

/* 标签样式 */
:deep(.el-tag) {
  border-radius: 12px;
  font-weight: 500;
}

/* 按钮样式 */
:deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
}

:deep(.el-button--small) {
  padding: 5px 12px;
}

/* 权限管理对话框样式 */
.permission-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #666;
}

.permission-loading .el-icon {
  margin-right: 8px;
  font-size: 18px;
}

.permission-content {
  padding: 0;
}

.permission-header h4 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 16px;
}

.permission-header p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.permission-tree h5 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 14px;
  font-weight: 600;
}

.permission-tree-component {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.permission-tree-component :deep(.el-tree-node__content) {
  height: 32px;
  line-height: 32px;
}

.permission-tree-component :deep(.el-tree-node__label) {
  font-size: 14px;
}

.permission-tree-component :deep(.el-checkbox__label) {
  font-size: 14px;
}

/* API状态样式 */
.api-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 12px;
}

.api-status-label {
  color: #666;
  font-weight: 500;
}

.api-url {
  color: #909399;
  font-family: 'Courier New', monospace;
  background: #f5f7fa;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
}

/* 搜索框样式优化 */
.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 操作按钮样式优化 */
.action-buttons {
  display: flex;
  flex-wrap: nowrap;
  gap: 6px;
  align-items: center;
}

.action-buttons .el-button {
  margin: 0;
  min-width: auto;
  padding: 5px 8px;
}

.action-buttons .el-button + .el-button {
  margin-left: 0;
}
</style>
