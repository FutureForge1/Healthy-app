import { createRouter, createWebHistory } from 'vue-router'

// 公共页面
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

// 主布局
const Layout = () => import('../layouts/Layout.vue')

// 仪表盘
import Dashboard from '../views/Dashboard.vue'

// 系统管理模块 (懒加载)
const SystemManagement = () => import('../views/system/SystemManagement.vue')
const UserManagement = () => import('../views/system/UserManagement.vue')
const RoleManagement = () => import('../views/system/RoleManagement.vue')
const MenuManagement = () => import('../views/system/MenuManagement.vue')

// 统计分析模块 (懒加载)
const PopulationStats = () => import('../views/statistics/PopulationStats.vue')
const InstitutionStats = () => import('../views/statistics/InstitutionStats.vue')

// 数据可视化模块 (懒加载)
const ChartManagement = () => import('../views/visualization/ChartManagement.vue')

// 数据管理模块 (懒加载)
const DataManagement = () => import('../views/data/DataManagement.vue')
const ImportExport = () => import('../views/data/ImportExport.vue')
const QualityCheck = () => import('../views/data/QualityCheck.vue')

// 日志审计模块 (懒加载)
const AuditSystem = () => import('../views/audit/AuditSystem.vue')
const OperationLogs = () => import('../views/audit/OperationLogs.vue')

// 3D地图
const Map3D = () => import('../views/map/Map3D.vue')

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
      component: Layout,
      meta: { requiresAuth: true },
      redirect: '/app/dashboard',
      children: [
        // 仪表盘
        {
          path: 'dashboard',
          name: 'dashboard',
          component: Dashboard,
          meta: {
            title: '仪表盘',
            icon: 'dashboard',
            roles: ['ADMIN', 'ANALYST', 'AUDITOR', 'RESEARCHER']
          }
        },

        // 3D地图
        {
          path: 'map',
          name: 'map3d',
          component: Map3D,
          meta: {
            title: '成都3D地图',
            icon: 'map',
            roles: ['ADMIN', 'ANALYST', 'RESEARCHER']
          }
        },

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

        // 统计分析模块
        {
          path: 'statistics/population',
          name: 'population-stats',
          component: PopulationStats,
          meta: {
            title: '人口统计',
            icon: 'data-analysis',
            roles: ['ADMIN', 'ANALYST', 'RESEARCHER']
          }
        },
        {
          path: 'statistics/institution',
          name: 'institution-stats',
          component: InstitutionStats,
          meta: {
            title: '医疗机构统计',
            icon: 'data-analysis',
            roles: ['ADMIN', 'ANALYST', 'RESEARCHER']
          }
        },

        // 数据可视化模块
        {
          path: 'visualization/charts',
          name: 'charts',
          component: ChartManagement,
          meta: {
            title: '图表管理',
            icon: 'chart',
            roles: ['ADMIN', 'ANALYST', 'RESEARCHER']
          }
        },

        // 数据管理模块
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

        // 日志审计模块
        {
          path: 'audit',
          name: 'audit',
          component: AuditSystem,
          meta: {
            title: '日志审计',
            icon: 'audit',
            roles: ['ADMIN', 'AUDITOR']
          }
        },
        {
          path: 'audit/operation-logs',
          name: 'operation-logs',
          component: OperationLogs,
          meta: {
            title: '操作日志',
            roles: ['ADMIN', 'AUDITOR']
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
router.beforeEach((to, from, next) => {
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

    // 简化权限检查 - 如果有token就允许访问
    // 具体的用户信息获取在组件内部处理
  }

  next()
})

export default router
