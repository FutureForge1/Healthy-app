import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

// 公共页面
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

// 主布局
const ModernLayout = () => import('../layouts/ModernLayout.vue')

// 仪表盘
import Dashboard from '../views/Dashboard.vue'

// 系统管理模块 (懒加载)
const SystemManagement = () => import('../views/system/SystemManagement.vue')
const RoleManagement = () => import('../views/system/RoleManagement.vue')
const MenuManagement = () => import('../views/system/MenuManagement.vue')

// 统计分析模块 (懒加载)
const PopulationStats = () => import('../views/statistics/PopulationStats.vue')
const InstitutionStats = () => import('../views/statistics/InstitutionStats.vue')
const PersonnelStats = () => import('../views/statistics/PersonnelStats.vue')
const BedStats = () => import('../views/statistics/BedStats.vue')
const ServiceStats = () => import('../views/statistics/ServiceStats.vue')
const CostStats = () => import('../views/statistics/CostStats.vue')

// 高级分析模块 (懒加载)
const PredictionAnalysis = () => import('../views/analytics/PredictionAnalysis.vue')

// 管理员模块 (懒加载)
const UserManagement = () => import('../views/admin/UserManagement.vue')

// 个人资料模块 (懒加载)
const UserProfile = () => import('../views/profile/UserProfile.vue')

// 帮助中心和设置模块 (懒加载)
const HelpCenter = () => import('../views/help/HelpCenter.vue')
const SystemSettings = () => import('../views/settings/SystemSettings.vue')

// 数据可视化模块 (懒加载)
const ChartManagement = () => import('../views/visualization/ChartManagement.vue')

// 数据管理模块 (懒加载)
const DataManagement = () => import('../views/data/DataManagement.vue')
const ImportExport = () => import('../views/data/ImportExport.vue')
const QualityCheck = () => import('../views/data/QualityCheck.vue')

// 日志审计模块 (懒加载)
const AuditSystem = () => import('../views/audit/AuditSystem.vue')
const OperationLogs = () => import('../views/audit/OperationLogs.vue')

// TARS管理模块 (懒加载)
const TarsManagement = () => import('../views/admin/TarsManagement.vue')
const TarsDemo = () => import('../views/TarsDemo.vue')

// 测试页面 (懒加载)
const PasswordResetTest = () => import('../views/test/PasswordResetTest.vue')

// 3D可视化
const MapboxWalkingDemo = () => import('../views/MapboxWalkingDemo.vue')

// 侧边栏演示
const SidebarDemo = () => import('../views/SidebarDemo.vue')

// Typebot 测试页面
const TypebotTest = () => import('../views/TypebotTest.vue')

// 光标探照灯测试页面已删除



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 公共路由
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: '首页',
        requiresAuth: false
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: '登录',
        requiresAuth: false
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        title: '注册',
        requiresAuth: false
      }
    },

    // 主应用路由（需要认证）
    {
      path: '/app',
      component: ModernLayout,
      meta: { requiresAuth: true },
      redirect: '/app/dashboard',
      children: [
        // 仪表盘 - 所有角色都可以访问
        {
          path: 'dashboard',
          name: 'dashboard',
          component: Dashboard,
          meta: {
            title: '仪表盘',
            icon: 'dashboard',
            roles: ['ADMIN', 'ANALYST', 'VISITOR']
          }
        },

        // 3D可视化 - 访客、数据分析师、管理员都可以访问
        {
          path: 'mapbox-walking',
          name: 'mapbox-walking',
          component: MapboxWalkingDemo,
          meta: {
            title: '3D可视化',
            icon: 'map',
            roles: ['ADMIN', 'ANALYST', 'VISITOR']
          }
        },

        // 侧边栏演示 - 访客、数据分析师、管理员都可以访问
        {
          path: 'sidebar-demo',
          name: 'sidebar-demo',
          component: SidebarDemo,
          meta: {
            title: '侧边栏演示',
            icon: 'menu',
            roles: ['ADMIN', 'ANALYST', 'VISITOR']
          }
        },

        // Typebot 测试页面 - 所有登录用户都可以访问
        {
          path: 'typebot-test',
          name: 'typebot-test',
          component: TypebotTest,
          meta: {
            title: 'Typebot 测试',
            icon: 'chat-dot-round',
            roles: ['ADMIN', 'ANALYST', 'VISITOR']
          }
        },

        // TARS智能助手演示 - 所有登录用户都可以访问
        {
          path: 'tars-demo',
          name: 'tars-demo',
          component: TarsDemo,
          meta: {
            title: 'TARS智能助手演示',
            icon: 'robot',
            roles: ['ADMIN', 'ANALYST', 'VISITOR']
          }
        },

        // 光标探照灯测试页面已删除



        // 系统管理模块
        {
          path: 'system',
          name: 'system',
          component: SystemManagement,
          meta: {
            title: '系统管理',
            icon: 'setting',
            roles: ['ADMIN']
          },
          children: [
            {
              path: 'users',
              name: 'users',
              component: UserManagement,
              meta: {
                title: '用户管理',
                roles: ['ADMIN']
              }
            },
            {
              path: 'roles',
              name: 'roles',
              component: RoleManagement,
              meta: {
                title: '角色管理',
                roles: ['ADMIN']
              }
            },
            {
              path: 'menus',
              name: 'menus',
              component: MenuManagement,
              meta: {
                title: '菜单管理',
                roles: ['ADMIN']
              }
            }
          ]
        },

        // 统计分析模块 - 访客、数据分析师、管理员都可以访问
        {
          path: 'statistics/population',
          name: 'population-stats',
          component: PopulationStats,
          meta: {
            title: '人口统计',
            icon: 'data-analysis',
            roles: ['ADMIN', 'ANALYST', 'VISITOR']
          }
        },
        {
          path: 'statistics/institution',
          name: 'institution-stats',
          component: InstitutionStats,
          meta: {
            title: '医疗机构统计',
            icon: 'data-analysis',
            roles: ['ADMIN', 'ANALYST', 'VISITOR']
          }
        },
        {
          path: 'statistics/personnel',
          name: 'personnel-stats',
          component: PersonnelStats,
          meta: {
            title: '医护人员统计',
            icon: 'data-analysis',
            roles: ['ADMIN', 'ANALYST', 'VISITOR']
          }
        },
        {
          path: 'statistics/bed',
          name: 'bed-stats',
          component: BedStats,
          meta: {
            title: '床位统计',
            icon: 'data-analysis',
            roles: ['ADMIN', 'ANALYST', 'VISITOR']
          }
        },
        {
          path: 'statistics/service',
          name: 'service-stats',
          component: ServiceStats,
          meta: {
            title: '医疗服务统计',
            icon: 'data-analysis',
            roles: ['ADMIN', 'ANALYST', 'VISITOR']
          }
        },
        {
          path: 'statistics/cost',
          name: 'cost-stats',
          component: CostStats,
          meta: {
            title: '医疗费用统计',
            icon: 'data-analysis',
            roles: ['ADMIN', 'ANALYST', 'VISITOR']
          }
        },

        // 高级分析模块 - 管理员和数据分析师可访问
        {
          path: 'analytics/prediction',
          name: 'prediction-analysis',
          component: PredictionAnalysis,
          meta: {
            title: '预测分析',
            icon: 'trend-charts',
            roles: ['ADMIN', 'ANALYST'], // 管理员和数据分析师可访问
            description: '基于机器学习的时间序列预测分析'
          }
        },

        // 数据可视化模块 - 访客、数据分析师、管理员都可以访问
        {
          path: 'visualization/charts',
          name: 'charts',
          component: ChartManagement,
          meta: {
            title: '图表管理',
            icon: 'chart',
            roles: ['ADMIN', 'ANALYST', 'VISITOR']
          }
        },

        // 数据管理模块 - 仅管理员和数据分析师可访问
        {
          path: 'data',
          name: 'data',
          component: DataManagement,
          meta: {
            title: '数据管理',
            icon: 'database',
            roles: ['ADMIN', 'ANALYST']
          }
        },
        {
          path: 'data/import-export',
          name: 'data-import-export',
          component: ImportExport,
          meta: {
            title: '数据导入导出',
            roles: ['ADMIN', 'ANALYST']
          }
        },
        {
          path: 'data/quality-check',
          name: 'data-quality-check',
          component: QualityCheck,
          meta: {
            title: '数据质量检查',
            roles: ['ADMIN', 'ANALYST']
          }
        },

        // 个人资料 - 所有登录用户都可以访问
        {
          path: 'profile',
          name: 'user-profile',
          component: UserProfile,
          meta: {
            title: '个人资料',
            icon: 'user'
            // 不设置roles，表示所有登录用户都可以访问
          }
        },

        // 帮助中心 - 所有登录用户都可以访问
        {
          path: 'help',
          name: 'help-center',
          component: HelpCenter,
          meta: {
            title: '帮助中心',
            icon: 'question'
            // 不设置roles，表示所有登录用户都可以访问
          }
        },

        // 系统设置 - 所有登录用户都可以访问
        {
          path: 'settings',
          name: 'system-settings',
          component: SystemSettings,
          meta: {
            title: '系统设置',
            icon: 'setting'
            // 不设置roles，表示所有登录用户都可以访问
          }
        },

        // 用户权限管理 - 仅管理员可访问
        {
          path: 'admin/users',
          name: 'user-management',
          component: UserManagement,
          meta: {
            title: '用户权限管理',
            icon: 'user',
            roles: ['ADMIN'] // 仅管理员可访问
          }
        },

        // 日志审计模块 - 仅管理员可访问
        {
          path: 'audit',
          name: 'audit',
          component: AuditSystem,
          meta: {
            title: '日志审计',
            icon: 'audit',
            roles: ['ADMIN'] // 仅管理员可访问
          }
        },
        {
          path: 'audit/operation-logs',
          name: 'operation-logs',
          component: OperationLogs,
          meta: {
            title: '操作日志',
            roles: ['ADMIN'] // 仅管理员可访问
          }
        },

        // TARS智能助手管理 - 仅管理员可访问
        {
          path: 'tars-management',
          name: 'tars-management',
          component: TarsManagement,
          meta: {
            title: 'TARS智能助手管理',
            icon: 'robot',
            roles: ['ADMIN'] // 仅管理员可访问
          }
        }
      ]
    },

    // 404页面
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
      meta: {
        title: '页面未找到',
        requiresAuth: false
      }
    }
  ]
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')

  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 健康大数据平台`
  }

  // 如果已登录用户访问登录或注册页面，重定向到仪表盘
  if (token && (to.path === '/login' || to.path === '/register')) {
    next('/app/dashboard')
    return
  }

  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    if (!token) {
      next('/login')
      return
    }

    // 权限检查
    if (to.meta.roles && to.meta.roles.length > 0) {
      // 获取用户角色信息
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
      const userRole = userInfo.role

      console.log('路由权限检查:', {
        path: to.path,
        requiredRoles: to.meta.roles,
        userInfo: userInfo,
        userRole: userRole
      })

      if (!userRole) {
        console.error('用户角色信息缺失:', userInfo)
        ElMessage.error('用户角色信息缺失，请重新登录')
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        localStorage.removeItem('roles')
        next('/login')
        return
      }

      // 检查用户是否有访问权限
      if (!to.meta.roles.includes(userRole)) {
        console.warn('用户权限不足:', {
          userRole,
          requiredRoles: to.meta.roles,
          path: to.path
        })

        // 避免无限重定向：如果当前就是仪表盘页面，直接显示错误
        if (to.path === '/app/dashboard') {
          ElMessage.error('您没有权限访问仪表盘，请联系管理员')
          next('/login')
          return
        }

        ElMessage.error('您没有权限访问此页面')
        next('/app/dashboard') // 重定向到仪表盘
        return
      }
    }
  }

  next()
})

export default router
