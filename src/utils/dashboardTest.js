/**
 * Dashboard API 测试工具
 * 用于测试仪表盘数据加载功能
 */

import dashboardAPI from '@/api/dashboard'

/**
 * 测试所有 Dashboard API 接口
 */
export const testDashboardAPIs = async () => {
  console.log('🚀 开始测试 Dashboard API 接口...')
  
  const results = {
    success: [],
    failed: [],
    total: 0
  }

  const tests = [
    {
      name: '仪表盘概览数据',
      api: () => dashboardAPI.getDashboardOverview()
    },
    {
      name: '核心指标数据',
      api: () => dashboardAPI.getCoreMetrics('month')
    },
    {
      name: '人口趋势图表数据',
      api: () => dashboardAPI.getPopulationTrendChart()
    },
    {
      name: '医疗机构分布数据',
      api: () => dashboardAPI.getInstitutionDistributionChart()
    },
    {
      name: '医护人员统计数据',
      api: () => dashboardAPI.getPersonnelStats()
    },
    {
      name: '床位使用率数据',
      api: () => dashboardAPI.getBedUtilizationStats()
    },
    {
      name: '最近活动数据',
      api: () => dashboardAPI.getRecentActivities(5)
    },
    {
      name: '系统通知数据',
      api: () => dashboardAPI.getSystemNotifications(5)
    }
  ]

  results.total = tests.length

  for (const test of tests) {
    try {
      console.log(`📡 测试: ${test.name}`)
      const response = await test.api()
      
      if (response && response.data !== undefined) {
        console.log(`✅ ${test.name} - 成功`)
        console.log('   响应数据:', response.data)
        results.success.push(test.name)
      } else {
        console.log(`❌ ${test.name} - 响应格式异常`)
        console.log('   响应:', response)
        results.failed.push({
          name: test.name,
          error: '响应格式异常'
        })
      }
    } catch (error) {
      console.log(`❌ ${test.name} - 失败`)
      console.log('   错误:', error.message)
      results.failed.push({
        name: test.name,
        error: error.message
      })
    }
  }

  console.log('\n📊 测试结果汇总:')
  console.log(`总计: ${results.total} 个接口`)
  console.log(`成功: ${results.success.length} 个`)
  console.log(`失败: ${results.failed.length} 个`)
  
  if (results.failed.length > 0) {
    console.log('\n❌ 失败的接口:')
    results.failed.forEach(item => {
      console.log(`   - ${item.name}: ${item.error}`)
    })
  }

  return results
}

/**
 * 模拟数据生成器
 * 当后端接口不可用时，生成模拟数据
 */
export const generateMockData = () => {
  return {
    dashboardOverview: {
      totalAnalyses: Math.floor(Math.random() * 1000) + 500,
      totalReports: Math.floor(Math.random() * 500) + 100,
      totalExports: Math.floor(Math.random() * 100) + 20,
      totalInstitutions: Math.floor(Math.random() * 200) + 50,
      totalPersonnel: Math.floor(Math.random() * 5000) + 1000,
      totalBeds: Math.floor(Math.random() * 2000) + 500
    },
    
    populationTrend: {
      years: ['2019', '2020', '2021', '2022', '2023'],
      values: [1420, 1435, 1448, 1456, 1462]
    },
    
    institutionDistribution: [
      { value: 46, name: '三级医院', itemStyle: { color: '#409EFF' } },
      { value: 128, name: '二级医院', itemStyle: { color: '#67C23A' } },
      { value: 573, name: '社区医院', itemStyle: { color: '#E6A23C' } },
      { value: 501, name: '其他机构', itemStyle: { color: '#F56C6C' } }
    ],
    
    recentActivities: [
      {
        id: 1,
        createTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        description: '导出了人口统计报表'
      },
      {
        id: 2,
        createTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        description: '查看了医疗机构分布图'
      },
      {
        id: 3,
        createTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        description: '生成了月度分析报告'
      }
    ],
    
    notifications: [
      {
        id: 1,
        title: '系统维护通知',
        level: 'INFO',
        createTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: false
      },
      {
        id: 2,
        title: '数据导入完成',
        level: 'SUCCESS',
        createTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        isRead: false
      },
      {
        id: 3,
        title: '存储空间不足',
        level: 'WARNING',
        createTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isRead: true
      }
    ]
  }
}

// 在开发环境下自动测试
if (import.meta.env.DEV) {
  // 延迟执行，确保应用初始化完成
  setTimeout(() => {
    console.log('🔧 开发环境 - Dashboard API 测试工具已加载')
    console.log('💡 使用 testDashboardAPIs() 测试所有接口')
    console.log('💡 使用 generateMockData() 生成模拟数据')
    
    // 将测试函数挂载到全局，方便在控制台调用
    window.testDashboardAPIs = testDashboardAPIs
    window.generateMockData = generateMockData
  }, 1000)
}

export default {
  testDashboardAPIs,
  generateMockData
}
