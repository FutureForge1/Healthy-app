<template>
  <div class="menu-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2>菜单管理</h2>
        <p>管理系统菜单结构和权限配置</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增菜单
        </el-button>
        <el-button type="success" @click="expandAll">
          <el-icon><Expand /></el-icon>
          展开全部
        </el-button>
        <el-button @click="collapseAll">
          <el-icon><Fold /></el-icon>
          收起全部
        </el-button>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="searchForm.name"
            placeholder="菜单名称"
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
            v-model="searchForm.type"
            placeholder="菜单类型"
            clearable
            @change="handleSearch"
          >
            <el-option label="目录" value="0" />
            <el-option label="菜单" value="1" />
            <el-option label="按钮" value="2" />
          </el-select>
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

    <!-- 菜单树表格 -->
    <div class="table-section">
      <el-table
        ref="menuTableRef"
        v-loading="loading"
        :data="menuList"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        border
        style="width: 100%"
      >
        <el-table-column prop="name" label="菜单名称" min-width="200">
          <template #default="{ row }">
            <div class="menu-name">
              <el-icon v-if="row.icon" :size="16" style="margin-right: 8px;">
                <component :is="row.icon" />
              </el-icon>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getMenuTypeTag(row.type)">
              {{ getMenuTypeText(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由路径" min-width="150" show-overflow-tooltip />
        <el-table-column prop="component" label="组件路径" min-width="150" show-overflow-tooltip />
        <el-table-column prop="permission" label="权限标识" min-width="150" show-overflow-tooltip />
        <el-table-column prop="sort" label="排序" width="80" />
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
            <el-button type="success" size="small" @click="handleAddChild(row)">
              <el-icon><Plus /></el-icon>
              新增
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 菜单表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      @close="handleDialogClose"
    >
      <el-form
        ref="menuFormRef"
        :model="menuForm"
        :rules="menuRules"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单类型" prop="type">
              <el-radio-group v-model="menuForm.type" @change="handleTypeChange">
                <el-radio :label="0">目录</el-radio>
                <el-radio :label="1">菜单</el-radio>
                <el-radio :label="2">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上级菜单" prop="parentId">
              <el-tree-select
                v-model="menuForm.parentId"
                :data="menuTreeOptions"
                :props="{ value: 'id', label: 'name', children: 'children' }"
                placeholder="选择上级菜单"
                check-strictly
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="menuForm.name" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单图标" prop="icon">
              <el-input v-model="menuForm.icon" placeholder="请输入图标名称">
                <template #append>
                  <el-button @click="showIconSelector">选择</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" v-if="menuForm.type !== 2">
          <el-col :span="12">
            <el-form-item label="路由路径" prop="path">
              <el-input v-model="menuForm.path" placeholder="请输入路由路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="menuForm.type === 1">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="权限标识" prop="permission">
              <el-input v-model="menuForm.permission" placeholder="请输入权限标识" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input-number
                v-model="menuForm.sort"
                :min="0"
                :max="999"
                placeholder="排序"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" v-if="menuForm.type === 1">
          <el-col :span="12">
            <el-form-item label="是否缓存">
              <el-switch v-model="menuForm.keepAlive" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否隐藏">
              <el-switch v-model="menuForm.hidden" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="menuForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="menuForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
          确定
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
  Expand,
  Fold
} from '@element-plus/icons-vue'
import { systemApi } from '@/api/system'

// 响应式数据
const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const menuFormRef = ref(null)
const menuTableRef = ref(null)

// 搜索表单
const searchForm = reactive({
  name: '',
  type: '',
  status: ''
})

// 菜单列表
const menuList = ref([])
const menuTreeOptions = ref([])

// 当前操作的菜单
const currentMenu = ref(null)
const isEdit = ref(false)

// 对话框标题
const dialogTitle = computed(() => {
  return isEdit.value ? '编辑菜单' : '新增菜单'
})

// 菜单表单
const menuForm = reactive({
  id: null,
  parentId: null,
  name: '',
  type: 1,
  path: '',
  component: '',
  icon: '',
  permission: '',
  sort: 0,
  status: 1,
  keepAlive: false,
  hidden: false,
  remark: ''
})

// 表单验证规则
const menuRules = {
  name: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
    { min: 2, max: 20, message: '菜单名称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择菜单类型', trigger: 'change' }
  ],
  path: [
    { required: true, message: '请输入路由路径', trigger: 'blur' }
  ],
  component: [
    { required: true, message: '请输入组件路径', trigger: 'blur' }
  ],
  permission: [
    { required: true, message: '请输入权限标识', trigger: 'blur' }
  ]
}

// 获取菜单类型标签
const getMenuTypeTag = (type) => {
  const tagMap = {
    0: 'info',    // 目录
    1: 'success', // 菜单
    2: 'warning'  // 按钮
  }
  return tagMap[type] || 'info'
}

// 获取菜单类型文本
const getMenuTypeText = (type) => {
  const textMap = {
    0: '目录',
    1: '菜单',
    2: '按钮'
  }
  return textMap[type] || '未知'
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

// 获取菜单列表
const getMenuList = async () => {
  try {
    loading.value = true
    const params = {
      ...searchForm
    }
    const response = await systemApi.getMenus(params)
    if (response.code === 200) {
      menuList.value = response.data || []
    }
  } catch (error) {
    ElMessage.error('获取菜单列表失败')
    console.error('获取菜单列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取菜单树选项
const getMenuTreeOptions = async () => {
  try {
    const response = await systemApi.getMenuTree()
    if (response.code === 200) {
      menuTreeOptions.value = [
        { id: null, name: '根目录', children: response.data || [] }
      ]
    }
  } catch (error) {
    console.error('获取菜单树失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  getMenuList()
}

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    name: '',
    type: '',
    status: ''
  })
  getMenuList()
}

// 展开全部
const expandAll = () => {
  menuTableRef.value?.store.states.defaultExpandAll.value = true
  menuTableRef.value?.store.states.expandRows.value = menuList.value
}

// 收起全部
const collapseAll = () => {
  menuTableRef.value?.store.states.defaultExpandAll.value = false
  menuTableRef.value?.store.states.expandRows.value = []
}

// 状态切换
const handleStatusChange = async (row) => {
  try {
    const response = await systemApi.updateMenuStatus(row.id, row.status)
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

// 新增菜单
const handleAdd = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

// 新增子菜单
const handleAddChild = (row) => {
  isEdit.value = false
  resetForm()
  menuForm.parentId = row.id
  dialogVisible.value = true
}

// 编辑菜单
const handleEdit = (row) => {
  isEdit.value = true
  currentMenu.value = row
  Object.assign(menuForm, {
    id: row.id,
    parentId: row.parentId,
    name: row.name,
    type: row.type,
    path: row.path,
    component: row.component,
    icon: row.icon,
    permission: row.permission,
    sort: row.sort,
    status: row.status,
    keepAlive: row.keepAlive || false,
    hidden: row.hidden || false,
    remark: row.remark || ''
  })
  dialogVisible.value = true
}

// 删除菜单
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除菜单 "${row.name}" 吗？删除后子菜单也会被删除！`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const response = await systemApi.deleteMenu(row.id)
    if (response.code === 200) {
      ElMessage.success('删除成功')
      getMenuList()
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

// 菜单类型变化处理
const handleTypeChange = (type) => {
  // 根据类型调整表单验证规则
  if (type === 2) { // 按钮
    menuForm.path = ''
    menuForm.component = ''
  }
}

// 显示图标选择器
const showIconSelector = () => {
  ElMessage.info('图标选择器功能开发中')
}

// 表单提交
const handleSubmit = async () => {
  try {
    const valid = await menuFormRef.value.validate()
    if (!valid) return

    submitLoading.value = true
    let response

    if (isEdit.value) {
      response = await systemApi.updateMenu(menuForm.id, menuForm)
    } else {
      response = await systemApi.createMenu(menuForm)
    }

    if (response.code === 200) {
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      dialogVisible.value = false
      getMenuList()
      getMenuTreeOptions()
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
  Object.assign(menuForm, {
    id: null,
    parentId: null,
    name: '',
    type: 1,
    path: '',
    component: '',
    icon: '',
    permission: '',
    sort: 0,
    status: 1,
    keepAlive: false,
    hidden: false,
    remark: ''
  })
  menuFormRef.value?.clearValidate()
}

// 生命周期
onMounted(() => {
  getMenuList()
  getMenuTreeOptions()
})
</script>

<style scoped>
.menu-management {
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

.header-actions {
  display: flex;
  gap: 8px;
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

/* 菜单名称 */
.menu-name {
  display: flex;
  align-items: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .menu-management {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .header-actions {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
