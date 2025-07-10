import request from './request'

/**
 * 更新用户信息
 * @param {Object} userData - 用户数据
 * @param {number} userData.id - 用户ID
 * @param {string} userData.username - 用户名
 * @param {string} userData.email - 邮箱
 * @param {string} userData.phone - 手机号
 * @param {string} userData.avatar - 头像URL
 * @param {string} userData.realName - 真实姓名（可选）
 * @returns {Promise} API响应
 */
export const updateUserInfo = (userData) => {
  return request({
    url: '/auth/user/update',
    method: 'PUT',
    data: userData
  })
}

/**
 * 修改密码
 * @param {Object} passwordData - 密码数据
 * @param {string} passwordData.currentPassword - 当前密码
 * @param {string} passwordData.newPassword - 新密码
 * @returns {Promise} API响应
 */
export const changePassword = (passwordData) => {
  return request({
    url: '/auth/user/change-password',
    method: 'PUT',
    data: passwordData
  })
}

/**
 * 更新头像
 * @param {string} username - 用户名
 * @param {string} avatarUrl - 头像URL
 * @returns {Promise} API响应
 */
export const updateAvatar = (username, avatarUrl) => {
  console.log('updateAvatar API调用:', {
    username,
    avatarUrl
  })

  const data = {
    username,
    avatar: avatarUrl
  }

  console.log('请求数据:', data)

  return request({
    url: '/auth/avatar',
    method: 'PUT',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 上传头像文件（如果需要先上传文件获取URL）
 * @param {File} file - 头像文件
 * @returns {Promise} API响应
 */
export const uploadAvatarFile = (file) => {
  console.log('uploadAvatarFile API调用:', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type
  })

  const formData = new FormData()
  formData.append('avatar', file)

  return request({
    url: '/api/upload/avatar',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 根据用户名获取用户详细信息
 * @param {string} username - 用户名
 * @returns {Promise} API响应
 */
export const getUserByUsername = (username) => {
  return request({
    url: `/auth/user/${username}`,
    method: 'GET'
  })
}

/**
 * 获取当前用户详细信息
 * @returns {Promise} API响应
 */
export const getUserDetail = () => {
  return request({
    url: '/auth/user/detail',
    method: 'GET'
  })
}

/**
 * 验证当前密码
 * @param {string} password - 当前密码
 * @returns {Promise} API响应
 */
export const verifyCurrentPassword = (password) => {
  return request({
    url: '/api/auth/user/verify-password',
    method: 'POST',
    data: { password }
  })
}
