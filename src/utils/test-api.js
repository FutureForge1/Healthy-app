// 测试 API 功能的工具函数
import { login, register } from '../api/auth'

// 测试注册功能
export const testRegister = async () => {
  const testData = {
    user: {
      username: 'testuser',
      password: 'Test123456',
      email: 'test@example.com',
      phone: '13800138000',
      realName: '测试用户'
    },
    roles: [
      {
        roleName: '访客',
        roleCode: 'VISITOR',
        description: '只读权限'
      }
    ]
  }
  
  try {
    const result = await register(testData)
    console.log('注册测试结果:', result)
    return result
  } catch (error) {
    console.error('注册测试失败:', error)
    return { success: false, error }
  }
}

// 测试登录功能
export const testLogin = async () => {
  const testData = {
    username: 'testuser',
    password: 'Test123456'
  }
  
  try {
    const result = await login(testData)
    console.log('登录测试结果:', result)
    return result
  } catch (error) {
    console.error('登录测试失败:', error)
    return { success: false, error }
  }
}

// 在浏览器控制台中可以调用这些函数进行测试
// 例如: window.testAPI = { testRegister, testLogin }
if (typeof window !== 'undefined') {
  window.testAPI = {
    testRegister,
    testLogin
  }
}
