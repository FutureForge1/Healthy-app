import request from './request'

// 用户管理API
export const userAPI = {
  // 获取用户列表
  getUsers(params) {
    return request.get('/api/system/users', { params })
  },

  // 获取用户详情
  getUserById(id) {
    return request.get(`/api/system/users/${id}`)
  },

  // 创建用户
  createUser(data) {
    return request.post('/api/system/users', data)
  },

  // 更新用户
  updateUser(id, data) {
    return request.put(`/api/system/users/${id}`, data)
  },

  // 删除用户
  deleteUser(id) {
    return request.delete(`/api/system/users/${id}`)
  },

  // 批量删除用户
  batchDeleteUsers(ids) {
    return request.delete('/api/system/users/batch', { data: { ids } })
  },

  // 重置用户密码
  resetPassword(id, data) {
    return request.put(`/api/system/users/${id}/password`, data)
  },

  // 启用/禁用用户
  toggleUserStatus(id, status) {
    return request.put(`/api/system/users/${id}/status`, { status })
  }
}

// 角色管理API
export const roleAPI = {
  // 获取角色列表
  getRoles(params) {
    return request.get('/api/system/roles', { params })
  },

  // 获取角色详情
  getRoleById(id) {
    return request.get(`/api/system/roles/${id}`)
  },

  // 创建角色
  createRole(data) {
    return request.post('/api/system/roles', data)
  },

  // 更新角色
  updateRole(id, data) {
    return request.put(`/api/system/roles/${id}`, data)
  },

  // 删除角色
  deleteRole(id) {
    return request.delete(`/api/system/roles/${id}`)
  },

  // 获取角色权限
  getRolePermissions(id) {
    return request.get(`/api/system/roles/${id}/permissions`)
  },

  // 分配角色权限
  assignRolePermissions(id, permissions) {
    return request.put(`/api/system/roles/${id}/permissions`, { permissions })
  }
}

// 菜单管理API
export const menuAPI = {
  // 获取菜单列表
  getMenus(params) {
    return request.get('/api/system/menus', { params })
  },

  // 获取菜单详情
  getMenuById(id) {
    return request.get(`/api/system/menus/${id}`)
  },

  // 创建菜单
  createMenu(data) {
    return request.post('/api/system/menus', data)
  },

  // 更新菜单
  updateMenu(id, data) {
    return request.put(`/api/system/menus/${id}`, data)
  },

  // 删除菜单
  deleteMenu(id) {
    return request.delete(`/api/system/menus/${id}`)
  },

  // 获取菜单树
  getMenuTree() {
    return request.get('/api/system/menus/tree')
  },

  // 获取用户菜单
  getUserMenus() {
    return request.get('/api/system/menus/user')
  }
}

// 权限管理API
export const permissionAPI = {
  // 获取权限列表
  getPermissions(params) {
    return request.get('/api/system/permissions', { params })
  },

  // 获取权限详情
  getPermissionById(id) {
    return request.get(`/api/system/permissions/${id}`)
  },

  // 创建权限
  createPermission(data) {
    return request.post('/api/system/permissions', data)
  },

  // 更新权限
  updatePermission(id, data) {
    return request.put(`/api/system/permissions/${id}`, data)
  },

  // 删除权限
  deletePermission(id) {
    return request.delete(`/api/system/permissions/${id}`)
  }
}

// 统一导出系统API
export const systemApi = {
  // 用户管理
  ...userAPI,

  // 角色管理
  getRoles: roleAPI.getRoles,
  getRoleById: roleAPI.getRoleById,
  createRole: roleAPI.createRole,
  updateRole: roleAPI.updateRole,
  deleteRole: roleAPI.deleteRole,
  getRolePermissions: roleAPI.getRolePermissions,
  updateRolePermissions: roleAPI.assignRolePermissions,
  updateRoleStatus: (id, status) => request.put(`/api/system/roles/${id}/status`, { status }),
  batchDeleteRoles: (ids) => request.delete('/api/system/roles/batch', { data: { ids } }),
  batchUpdateRoleStatus: (ids, status) => request.put('/api/system/roles/batch/status', { ids, status }),

  // 菜单管理
  getMenus: menuAPI.getMenus,
  getMenuById: menuAPI.getMenuById,
  createMenu: menuAPI.createMenu,
  updateMenu: menuAPI.updateMenu,
  deleteMenu: menuAPI.deleteMenu,
  getMenuTree: menuAPI.getMenuTree,
  getUserMenus: menuAPI.getUserMenus,
  updateMenuStatus: (id, status) => request.put(`/api/system/menus/${id}/status`, { status }),

  // 权限管理
  getPermissions: permissionAPI.getPermissions,
  getPermissionById: permissionAPI.getPermissionById,
  createPermission: permissionAPI.createPermission,
  updatePermission: permissionAPI.updatePermission,
  deletePermission: permissionAPI.deletePermission,
  getPermissionTree: () => request.get('/api/system/permissions/tree')
}
