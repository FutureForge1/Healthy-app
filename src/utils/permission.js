/**
 * 权限检查工具
 */

import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

/**
 * 检查用户是否有指定角色权限
 * @param {string|Array} roles 需要的角色，可以是字符串或数组
 * @returns {boolean} 是否有权限
 */
export function hasRole(roles) {
  const userStore = useUserStore()
  const userRole = userStore.userInfo?.role

  if (!userRole) {
    return false
  }

  if (typeof roles === 'string') {
    return userRole === roles
  }

  if (Array.isArray(roles)) {
    return roles.includes(userRole)
  }

  return false
}

/**
 * 检查用户是否有访问指定路由的权限
 * @param {Object} route 路由对象
 * @returns {boolean} 是否有权限
 */
export function hasRoutePermission(route) {
  if (!route.meta || !route.meta.roles) {
    return true // 没有角色限制的路由默认允许访问
  }

  return hasRole(route.meta.roles)
}

/**
 * 权限检查装饰器，用于组件方法
 * @param {string|Array} roles 需要的角色
 * @param {string} message 无权限时的提示消息
 */
export function requireRole(roles, message = '您没有权限执行此操作') {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value

    descriptor.value = function(...args) {
      if (!hasRole(roles)) {
        ElMessage.error(message)
        return Promise.reject(new Error(message))
      }
      return originalMethod.apply(this, args)
    }

    return descriptor
  }
}

/**
 * 数据分析师权限检查
 * @returns {boolean} 是否是数据分析师
 */
export function isAnalyst() {
  return hasRole('ANALYST')
}

/**
 * 管理员权限检查
 * @returns {boolean} 是否是管理员
 */
export function isAdmin() {
  return hasRole('ADMIN')
}

/**
 * 访客权限检查
 * @returns {boolean} 是否是访客
 */
export function isVisitor() {
  return hasRole('VISITOR')
}

/**
 * 检查是否有高级权限（管理员或数据分析师）
 * @returns {boolean} 是否有高级权限
 */
export function hasAdvancedPermission() {
  return hasRole(['ADMIN', 'ANALYST'])
}

/**
 * 检查是否有数据访问权限
 * @returns {boolean} 是否有数据访问权限
 */
export function hasDataAccess() {
  return hasRole(['ADMIN', 'ANALYST'])
}

/**
 * 检查是否可以查看日志管理
 * @returns {boolean} 是否可以查看日志管理
 */
export function canViewLogs() {
  return hasRole('ADMIN')
}

/**
 * 检查是否可以查看预测分析
 * @returns {boolean} 是否可以查看预测分析
 */
export function canViewPrediction() {
  return hasRole(['ADMIN', 'ANALYST'])
}

/**
 * 权限级别枚举
 */
export const PERMISSION_LEVELS = {
  VISITOR: 1,      // 访客 - 可以查看统计分析，不能查看日志管理和预测分析
  ANALYST: 2,      // 数据分析师 - 可以查看所有功能除了日志管理
  ADMIN: 3         // 管理员 - 拥有所有权限
}

/**
 * 获取用户权限级别
 * @returns {number} 权限级别
 */
export function getUserPermissionLevel() {
  const userStore = useUserStore()
  const userRole = userStore.userInfo?.role

  return PERMISSION_LEVELS[userRole] || PERMISSION_LEVELS.VISITOR
}

/**
 * 检查是否有足够的权限级别
 * @param {number} requiredLevel 需要的权限级别
 * @returns {boolean} 是否有足够权限
 */
export function hasPermissionLevel(requiredLevel) {
  return getUserPermissionLevel() >= requiredLevel
}

/**
 * 角色显示名称映射
 */
export const ROLE_DISPLAY_NAMES = {
  ADMIN: '系统管理员',
  ANALYST: '数据分析师',
  VISITOR: '访客用户'
}

/**
 * 可注册的角色列表（管理员不能注册）
 */
export const REGISTERABLE_ROLES = [
  { value: 'ANALYST', label: '数据分析师', description: '可以查看所有统计分析和预测功能' },
  { value: 'VISITOR', label: '访客用户', description: '可以查看基础统计分析功能' }
]

/**
 * 获取角色显示名称
 * @param {string} role 角色代码
 * @returns {string} 角色显示名称
 */
export function getRoleDisplayName(role) {
  return ROLE_DISPLAY_NAMES[role] || role
}

/**
 * 权限检查组合函数
 */
export const Permission = {
  hasRole,
  hasRoutePermission,
  isAnalyst,
  isAdmin,
  isVisitor,
  hasAdvancedPermission,
  hasDataAccess,
  canViewLogs,
  canViewPrediction,
  getUserPermissionLevel,
  hasPermissionLevel,
  getRoleDisplayName
}

export default Permission
