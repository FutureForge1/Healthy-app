<template>
  <div class="role-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2>角色管理</h2>
        <p>管理系统角色和权限配置</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增角色
        </el-button>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="searchForm.name"
            placeholder="角色名称"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="searchForm.status"
            placeholder="状态"
            clearable
            @change="handleSearch"
          >
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 角色表格 -->
    <div class="table-section">
      <el-table
        v-loading="loading"
        :data="roleList"
        stripe
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" min-width="120">
          <template #default="{ row }">
            <el-tag :type="getRoleTagType(row.name)">{{ row.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="角色编码" min-width="120" />
        <el-table-column prop="description" label="角色描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="warning" size="small" @click="handlePermission(row)">
              <el-icon><Key /></el-icon>
              权限
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-section">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 批量操作 -->
    <div v-if="selectedRoles.length > 0" class="batch-actions">
      <el-alert
        :title="`已选择 ${selectedRoles.length} 个角色`"
        type="info"
        show-icon
        :closable="false"
      />
      <div class="batch-buttons">
        <el-button type="danger" @click="handleBatchDelete">
          <el-icon><Delete /></el-icon>
          批量删除
        </el-button>
        <el-button type="warning" @click="handleBatchStatus(1)">
          <el-icon><Check /></el-icon>
          批量启用
        </el-button>
        <el-button type="info" @click="handleBatchStatus(0)">
          <el-icon><Close /></el-icon>
          批量禁用
        </el-button>
      </div>
    </div>

    <!-- 角色表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        :rules="roleRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="roleForm.code" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="roleForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="roleForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 权限配置对话框 -->
    <el-dialog
      v-model="permissionDialogVisible"
      title="权限配置"
      width="800px"
      @close="handlePermissionDialogClose"
    >
      <div class="permission-content">
        <div class="permission-header">
          <h4>为角色 "{{ currentRole?.name }}" 配置权限</h4>
        </div>
        <el-tree
          ref="permissionTreeRef"
          :data="permissionTree"
          :props="treeProps"
          show-checkbox
          node-key="id"
          :default-checked-keys="checkedPermissions"
          @check="handlePermissionCheck"
        />
      </div>
      <template #footer>
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePermissionSubmit" :loading="permissionLoading">
          保存权限
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Search,
  Refresh,
  Edit,
  Delete,
  Key,
  Check,
  Close
} from '@element-plus/icons-vue'
import { systemApi } from '@/api/system'

// 响应式数据
const loading = ref(false)
const submitLoading = ref(false)
const permissionLoading = ref(false)
const dialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const roleFormRef = ref(null)
const permissionTreeRef = ref(null)

// 搜索表单
const searchForm = reactive({
  name: '',
  status: ''
})

// 分页
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 角色列表
const roleList = ref([])
const selectedRoles = ref([])

// 当前操作的角色
const currentRole = ref(null)
const isEdit = ref(false)

// 对话框标题
const dialogTitle = computed(() => {
  return isEdit.value ? '编辑角色' : '新增角色'
})

// 角色表单
const roleForm = reactive({
  id: null,
  name: '',
  code: '',
  description: '',
  status: 1
})

// 表单验证规则
const roleRules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '角色名称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入角色编码', trigger: 'blur' },
    { pattern: /^[A-Z_]+$/, message: '角色编码只能包含大写字母和下划线', trigger: 'blur' }
  ],
  description: [
    { max: 200, message: '描述不能超过200个字符', trigger: 'blur' }
  ]
}

// 权限树数据
const permissionTree = ref([])
const checkedPermissions = ref([])
const treeProps = {
  children: 'children',
  label: 'name'
}

// 获取角色标签类型
const getRoleTagType = (roleName) => {
  const typeMap = {
    'ADMIN': 'danger',
    'ANALYST': 'primary',
    'AUDITOR': 'warning',
    'RESEARCHER': 'success'
  }
  return typeMap[roleName] || 'info'
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

// 获取角色列表
const getRoleList = async () => {
  try {
    loading.value = true
    const params = {
      page: pagination.page,
      size: pagination.size,
      ...searchForm
    }
    const response = await systemApi.getRoles(params)
    if (response.code === 200) {
      roleList.value = response.data.records || []
      pagination.total = response.data.total || 0
    }
  } catch (error) {
    ElMessage.error('获取角色列表失败')
    console.error('获取角色列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  getRoleList()
}

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    name: '',
    status: ''
  })
  pagination.page = 1
  getRoleList()
}

// 分页处理
const handleSizeChange = (size) => {
  pagination.size = size
  pagination.page = 1
  getRoleList()
}

const handleCurrentChange = (page) => {
  pagination.page = page
  getRoleList()
}

// 选择处理
const handleSelectionChange = (selection) => {
  selectedRoles.value = selection
}

// 状态切换
const handleStatusChange = async (row) => {
  try {
    const response = await systemApi.updateRoleStatus(row.id, row.status)
    if (response.code === 200) {
      ElMessage.success('状态更新成功')
    } else {
      // 恢复原状态
      row.status = row.status === 1 ? 0 : 1
      ElMessage.error(response.message || '状态更新失败')
    }
  } catch (error) {
    // 恢复原状态
    row.status = row.status === 1 ? 0 : 1
    ElMessage.error('状态更新失败')
    console.error('状态更新失败:', error)
  }
}

// 新增角色
const handleAdd = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

// 编辑角色
const handleEdit = (row) => {
  isEdit.value = true
  currentRole.value = row
  Object.assign(roleForm, {
    id: row.id,
    name: row.name,
    code: row.code,
    description: row.description,
    status: row.status
  })
  dialogVisible.value = true
}

// 删除角色
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除角色 "${row.name}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const response = await systemApi.deleteRole(row.id)
    if (response.code === 200) {
      ElMessage.success('删除成功')
      getRoleList()
    } else {
      ElMessage.error(response.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('删除失败:', error)
    }
  }
}

// 权限配置
const handlePermission = async (row) => {
  currentRole.value = row
  await getPermissionTree()
  await getRolePermissions(row.id)
  permissionDialogVisible.value = true
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRoles.value.length === 0) {
    ElMessage.warning('请选择要删除的角色')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRoles.value.length} 个角色吗？`,
      '批量删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const ids = selectedRoles.value.map(role => role.id)
    const response = await systemApi.batchDeleteRoles(ids)
    if (response.code === 200) {
      ElMessage.success('批量删除成功')
      selectedRoles.value = []
      getRoleList()
    } else {
      ElMessage.error(response.message || '批量删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
      console.error('批量删除失败:', error)
    }
  }
}

// 批量状态更新
const handleBatchStatus = async (status) => {
  if (selectedRoles.value.length === 0) {
    ElMessage.warning('请选择要操作的角色')
    return
  }

  try {
    const statusText = status === 1 ? '启用' : '禁用'
    await ElMessageBox.confirm(
      `确定要${statusText}选中的 ${selectedRoles.value.length} 个角色吗？`,
      `批量${statusText}确认`,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const ids = selectedRoles.value.map(role => role.id)
    const response = await systemApi.batchUpdateRoleStatus(ids, status)
    if (response.code === 200) {
      ElMessage.success(`批量${statusText}成功`)
      selectedRoles.value = []
      getRoleList()
    } else {
      ElMessage.error(response.message || `批量${statusText}失败`)
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`批量${statusText}失败`)
      console.error(`批量${statusText}失败:`, error)
    }
  }
}

// 表单提交
const handleSubmit = async () => {
  try {
    const valid = await roleFormRef.value.validate()
    if (!valid) return

    submitLoading.value = true
    let response

    if (isEdit.value) {
      response = await systemApi.updateRole(roleForm.id, roleForm)
    } else {
      response = await systemApi.createRole(roleForm)
    }

    if (response.code === 200) {
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      dialogVisible.value = false
      getRoleList()
    } else {
      ElMessage.error(response.message || '操作失败')
    }
  } catch (error) {
    ElMessage.error('操作失败')
    console.error('表单提交失败:', error)
  } finally {
    submitLoading.value = false
  }
}

// 对话框关闭
const handleDialogClose = () => {
  resetForm()
}

// 重置表单
const resetForm = () => {
  Object.assign(roleForm, {
    id: null,
    name: '',
    code: '',
    description: '',
    status: 1
  })
  roleFormRef.value?.clearValidate()
}

// 获取权限树
const getPermissionTree = async () => {
  try {
    const response = await systemApi.getPermissionTree()
    if (response.code === 200) {
      permissionTree.value = response.data || []
    }
  } catch (error) {
    ElMessage.error('获取权限树失败')
    console.error('获取权限树失败:', error)
  }
}

// 获取角色权限
const getRolePermissions = async (roleId) => {
  try {
    const response = await systemApi.getRolePermissions(roleId)
    if (response.code === 200) {
      checkedPermissions.value = response.data || []
    }
  } catch (error) {
    ElMessage.error('获取角色权限失败')
    console.error('获取角色权限失败:', error)
  }
}

// 权限选择处理
const handlePermissionCheck = (data, checked) => {
  // 权限选择逻辑处理
}

// 权限提交
const handlePermissionSubmit = async () => {
  try {
    permissionLoading.value = true
    const checkedKeys = permissionTreeRef.value.getCheckedKeys()
    const halfCheckedKeys = permissionTreeRef.value.getHalfCheckedKeys()
    const allKeys = [...checkedKeys, ...halfCheckedKeys]

    const response = await systemApi.updateRolePermissions(currentRole.value.id, allKeys)
    if (response.code === 200) {
      ElMessage.success('权限配置成功')
      permissionDialogVisible.value = false
    } else {
      ElMessage.error(response.message || '权限配置失败')
    }
  } catch (error) {
    ElMessage.error('权限配置失败')
    console.error('权限配置失败:', error)
  } finally {
    permissionLoading.value = false
  }
}

// 权限对话框关闭
const handlePermissionDialogClose = () => {
  currentRole.value = null
  checkedPermissions.value = []
}

// 生命周期
onMounted(() => {
  getRoleList()
})
</script>

<style scoped>
.role-management {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h2 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 600;
}

.header-content p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

/* 搜索区域 */
.search-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* 表格区域 */
.table-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* 分页 */
.pagination-section {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 批量操作 */
.batch-actions {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 8px;
  padding: 16px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 1000;
}

.batch-buttons {
  display: flex;
  gap: 8px;
}

/* 权限配置 */
.permission-content {
  max-height: 400px;
  overflow-y: auto;
}

.permission-header {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.permission-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .role-management {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .batch-actions {
    flex-direction: column;
    gap: 12px;
  }

  .batch-buttons {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
