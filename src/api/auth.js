import request from './request'

/**
 * 获取验证码
 * @returns {Promise} 验证码图片URL
 */
export const getCaptcha = () => {
  return request({
    url: '/auth/captcha',
    method: 'GET'
  })
}

/**
 * 用户注册
 * @param {Object} data 注册数据
 * @param {string} data.user.username 用户名
 * @param {string} data.user.password 密码
 * @param {string} data.user.email 邮箱
 * @param {string} data.user.phone 手机号
 * @param {string} data.user.realName 真实姓名
 * @param {Array} data.roles 角色数组
 * @param {string} captcha 验证码
 * @returns {Promise}
 */
export const register = (data, captcha = 'mirtable233') => {
  return request({
    url: `/auth/register?captcha=${captcha}`,
    method: 'POST',
    data
  })
}

/**
 * 用户登录
 * @param {Object} data 登录数据
 * @param {string} data.username 用户名
 * @param {string} data.password 密码
 * @returns {Promise}
 */
export const login = (data) => {
  return request({
    url: '/auth/login',
    method: 'POST',
    data
  })
}

/**
 * 获取用户信息
 * @returns {Promise}
 */
export const getUserInfo = () => {
  return request({
    url: '/user/info',
    method: 'GET'
  })
}

/**
 * 退出登录
 * @returns {Promise}
 */
export const logout = () => {
  return request({
    url: '/auth/logout',
    method: 'POST'
  })
}

/**
 * 发送邮件验证码
 * @param {Object} data 邮件数据
 * @param {string} data.user.username 用户名
 * @param {string} data.user.email 邮箱地址
 * @param {Object} data.role 角色信息
 * @returns {Promise}
 */
export const sendEmailCode = (data) => {
  return request({
    url: '/mail/code',
    method: 'POST',
    data
  })
}

/**
 * 验证邮件验证码
 * @param {string} email 邮箱地址
 * @param {string} code 验证码
 * @returns {Promise}
 */
export const verifyEmailCode = (email, code) => {
  return request({
    url: `/mail/verify?email=${email}&code=${code}`,
    method: 'POST'
  })
}
