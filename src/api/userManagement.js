import request from './request'

/**
 * 用户管理API
 */

/**
 * 获取用户列表（支持分页、搜索、筛选）
 * @param {Object} params 查询参数
 * @param {number} params.page 页码
 * @param {number} params.size 每页数量
 * @param {string} params.search 搜索关键词
 * @param {string} params.role 角色筛选
 * @param {string} params.status 状态筛选
 * @returns {Promise}
 */
export const getUserList = (params) => {
  return request({
    url: '/users',
    method: 'GET',
    params
  })
}

/**
 * 获取单个用户详情
 * @param {string} userId 用户ID
 * @returns {Promise}
 */
export const getUserDetail = (userId) => {
  return request({
    url: `/users/${userId}`,
    method: 'GET'
  })
}

/**
 * 启用/禁用用户
 * @param {string} userId 用户ID
 * @param {Object} data 状态数据
 * @param {string} data.status 状态 active|inactive
 * @returns {Promise}
 */
export const updateUserStatus = (userId, data) => {
  return request({
    url: `/users/${userId}/status`,
    method: 'PUT',
    data
  })
}

/**
 * 获取用户权限
 * @param {string} userId 用户ID
 * @returns {Promise}
 */
export const getUserPermissions = (userId) => {
  return request({
    url: `/users/${userId}/permissions`,
    method: 'GET'
  })
}

/**
 * 更新用户权限
 * @param {string} userId 用户ID
 * @param {Object} data 权限数据
 * @param {Array} data.permissions 权限列表
 * @returns {Promise}
 */
export const updateUserPermissions = (userId, data) => {
  return request({
    url: `/users/${userId}/permissions`,
    method: 'PUT',
    data
  })
}

/**
 * 角色管理API
 */

/**
 * 获取所有角色列表
 * @returns {Promise}
 */
export const getRoleList = () => {
  return request({
    url: '/roles',
    method: 'GET'
  })
}

/**
 * 获取角色详情（包含权限）
 * @param {string} roleId 角色ID
 * @returns {Promise}
 */
export const getRoleDetail = (roleId) => {
  return request({
    url: `/roles/${roleId}`,
    method: 'GET'
  })
}

/**
 * 创建角色
 * @param {Object} data 角色数据
 * @returns {Promise}
 */
export const createRole = (data) => {
  return request({
    url: '/roles',
    method: 'POST',
    data
  })
}

/**
 * 更新角色
 * @param {string} roleId 角色ID
 * @param {Object} data 角色数据
 * @returns {Promise}
 */
export const updateRole = (roleId, data) => {
  return request({
    url: `/roles/${roleId}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除角色
 * @param {string} roleId 角色ID
 * @returns {Promise}
 */
export const deleteRole = (roleId) => {
  return request({
    url: `/roles/${roleId}`,
    method: 'DELETE'
  })
}

/**
 * 权限管理API
 */

/**
 * 获取所有权限列表（树形结构）
 * @returns {Promise}
 */
export const getPermissionTree = () => {
  return request({
    url: '/permissions',
    method: 'GET'
  })
}

/**
 * 获取角色权限
 * @param {string} roleId 角色ID
 * @returns {Promise}
 */
export const getRolePermissions = (roleId) => {
  return request({
    url: `/roles/${roleId}/permissions`,
    method: 'GET'
  })
}

/**
 * 更新角色权限
 * @param {string} roleId 角色ID
 * @param {Object} data 权限数据
 * @returns {Promise}
 */
export const updateRolePermissions = (roleId, data) => {
  return request({
    url: `/roles/${roleId}/permissions`,
    method: 'PUT',
    data
  })
}

/**
 * 批量操作用户
 * @param {Object} data 批量操作数据
 * @param {string} data.action 操作类型
 * @param {Array} data.userIds 用户ID列表
 * @returns {Promise}
 */
export const batchUpdateUsers = (data) => {
  return request({
    url: '/users/batch',
    method: 'POST',
    data
  })
}

/**
 * 重置用户密码
 * @param {string} userId 用户ID
 * @param {Object} data 密码数据
 * @returns {Promise}
 */
export const resetUserPassword = (userId, data) => {
  return request({
    url: `/users/${userId}/reset-password`,
    method: 'POST',
    data
  })
}

/**
 * 创建用户
 * @param {Object} data 用户数据
 * @returns {Promise}
 */
export const createUser = (data) => {
  return request({
    url: '/users',
    method: 'POST',
    data
  })
}

/**
 * 更新用户信息
 * @param {string} userId 用户ID
 * @param {Object} data 用户数据
 * @returns {Promise}
 */
export const updateUser = (userId, data) => {
  return request({
    url: `/users/${userId}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除用户
 * @param {string} userId 用户ID
 * @returns {Promise}
 */
export const deleteUser = (userId) => {
  return request({
    url: `/users/${userId}`,
    method: 'DELETE'
  })
}

// 导出所有API
export const userManagementApi = {
  // 用户管理
  getUserList,
  getUserDetail,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  resetUserPassword,
  batchUpdateUsers,
  
  // 用户权限
  getUserPermissions,
  updateUserPermissions,
  
  // 角色管理
  getRoleList,
  getRoleDetail,
  createRole,
  updateRole,
  deleteRole,
  getRolePermissions,
  updateRolePermissions,
  
  // 权限管理
  getPermissionTree
}

export default userManagementApi
