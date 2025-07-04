# 成都健康大数据应用 - 页面与API端点对应关系

## 📋 概述

本文档详细说明了前端各页面与后端API端点的对应关系，帮助开发者了解每个页面调用的具体API接口。

**前端服务**: `http://localhost:5174`  
**后端服务**: `http://localhost:8080`  
**API代理**: 前端通过Vite代理将 `/api/*` 请求转发到后端

---

## 🔐 认证相关页面

### 登录页面 (`/login`)
**文件**: `src/views/Login.vue`

| 功能 | API端点 | 方法 | 说明 |
|------|---------|------|------|
| 用户登录 | `/api/auth/login` | POST | 用户名密码登录 |
| 人机验证 | `/api/mail/code` | POST | 发送验证码 |
| 验证码校验 | `/api/mail/verify` | POST | 验证邮箱验证码 |

### 注册页面 (`/register`)
**文件**: `src/views/Register.vue`

| 功能 | API端点 | 方法 | 说明 |
|------|---------|------|------|
| 用户注册 | `/api/auth/register` | POST | 新用户注册 |
| 发送验证码 | `/api/mail/code` | POST | 邮箱验证码 |
| 验证邮箱 | `/api/mail/verify` | POST | 验证邮箱有效性 |

---

## 📊 统计分析模块

### 人口统计页面 (`/app/statistics/population`)
**文件**: `src/views/statistics/PopulationStats.vue`

| 功能 | API端点 | 方法 | 参数 | 说明 |
|------|---------|------|------|------|
| 获取人口统计 | `/api/statistics/population` | GET | district, year, ageGroup | 人口分布、年龄结构等 |

### 医疗机构统计页面 (`/app/statistics/institution`)
**文件**: `src/views/statistics/InstitutionStats.vue`

| 功能 | API端点 | 方法 | 参数 | 说明 |
|------|---------|------|------|------|
| 获取机构统计 | `/api/statistics/hospitals` | GET | page, size, district, type, ownership, scale | 医疗机构分布统计 |

---

## 🎯 仪表板页面 (`/app/dashboard`)
**文件**: `src/views/Dashboard.vue`

| 功能 | API端点 | 方法 | 说明 |
|------|---------|------|------|
| 核心指标 | `/api/statistics/core-metrics` | GET | 总体统计指标 |
| 实时数据 | `/api/statistics/realtime` | GET | 实时监控数据 |

---

## 📈 数据可视化模块

### 图表管理页面 (`/app/visualization/charts`)
**文件**: `src/views/visualization/ChartManagement.vue`

| 功能 | API端点 | 方法 | 参数 | 说明 |
|------|---------|------|------|------|
| 获取图表列表 | `/api/visualization/charts` | GET | page, size, category, type, status, keyword | 图表管理 |
| 获取图表数据 | `/api/visualization/charts/{id}/data` | GET | chartId, params | 图表数据 |
| 保存图表 | `/api/visualization/charts` | POST | chartConfig | 创建新图表 |
| 更新图表 | `/api/visualization/charts/{id}` | PUT | chartId, chartConfig | 更新图表 |
| 删除图表 | `/api/visualization/charts/{id}` | DELETE | chartId | 删除图表 |

---

## 🗺️ 3D地图页面 (`/app/map/3d`)
**文件**: `src/views/map/Map3D.vue`

| 功能 | API端点 | 方法 | 参数 | 说明 |
|------|---------|------|------|------|
| 获取医疗设施 | `/api/visualization/map-data` | GET | type: 'health-facilities' | 医疗机构地理分布 |
| 获取区域数据 | `/api/visualization/map-data` | GET | type: 'district-areas' | 行政区域信息 |

---

## 💾 数据管理模块

### 数据管理页面 (`/app/data/management`)
**文件**: `src/views/data/DataManagement.vue`

| 功能 | API端点 | 方法 | 说明 |
|------|---------|------|------|
| 数据质量检查 | `/api/data/quality-check` | POST | 数据质量分析 |
| 数据清洗 | `/api/data/clean` | POST | 数据清洗处理 |
| 获取标签 | `/api/data/tags` | GET | 数据标签管理 |
| 创建标签 | `/api/data/tags` | POST | 新建数据标签 |

### 导入导出页面 (`/app/data/import-export`)
**文件**: `src/views/data/ImportExport.vue`

| 功能 | API端点 | 方法 | 说明 |
|------|---------|------|------|
| 获取任务列表 | `/api/data/import-export-logs` | GET | 导入导出任务记录 |
| 数据导入 | `/api/data/import` | POST | 文件上传导入 |
| 数据导出 | `/api/data/export` | POST | 数据导出任务 |
| 下载文件 | `/api/data/exports/{id}/download` | GET | 下载导出文件 |

### 质量检查页面 (`/app/data/quality`)
**文件**: `src/views/data/QualityCheck.vue`

| 功能 | API端点 | 方法 | 说明 |
|------|---------|------|------|
| 质量检查 | `/api/data/quality-check` | POST | 数据质量分析 |
| 获取检查报告 | `/api/data/quality-reports` | GET | 质量检查历史 |

---

## 🔍 审计系统模块

### 审计系统页面 (`/app/audit/system`)
**文件**: `src/views/audit/AuditSystem.vue`

| 功能 | API端点 | 方法 | 说明 |
|------|---------|------|------|
| 系统监控 | `/api/audit/system-monitoring` | GET | 系统状态监控 |
| 审计报告 | `/api/audit/reports` | GET | 审计报告列表 |
| 生成报告 | `/api/audit/reports` | POST | 创建审计报告 |

### 操作日志页面 (`/app/audit/logs`)
**文件**: `src/views/audit/OperationLogs.vue`

| 功能 | API端点 | 方法 | 参数 | 说明 |
|------|---------|------|------|------|
| 获取操作日志 | `/api/audit/operation-logs` | GET | page, size, username, operationType, module, result, timeRange | 用户操作记录 |
| 导出日志 | `/api/audit/operation-logs/export` | POST | 导出日志文件 |

---

## 🏥 医疗数据统计API (完整后端API列表)

### 人口统计模块 (`/api/statistics/population/*`)
- `/api/statistics/population` - 基础人口统计
- `/api/statistics/population/basic` - 基础统计数据
- `/api/statistics/population/resident` - 常住人口统计
- `/api/statistics/population/natural-change` - 人口自然变动
- `/api/statistics/population/urban-rural` - 城乡分布
- `/api/statistics/population/district` - 各区县统计
- `/api/statistics/population/trend` - 趋势分析

### 医疗机构模块 (`/api/statistics/institution/*`)
- `/api/statistics/institution/basic` - 基础机构统计
- `/api/statistics/institution/category` - 机构分类统计
- `/api/statistics/institution/distribution` - 地区分布
- `/api/statistics/institution/capacity` - 服务能力分析
- `/api/statistics/institution/trend` - 发展趋势

### 医护人员模块 (`/api/statistics/personnel/*`)
- `/api/statistics/personnel/category` - 人员分类统计
- `/api/statistics/personnel/total` - 人员总数统计
- `/api/statistics/personnel/structure` - 人员结构分析
- `/api/statistics/personnel/trend` - 发展趋势
- `/api/statistics/personnel/regional` - 地区分布

### 床位资源模块 (`/api/statistics/bed/*`)
- `/api/statistics/bed/category` - 床位分类统计
- `/api/statistics/bed/total` - 床位总数统计
- `/api/statistics/bed/utilization` - 使用率分析
- `/api/statistics/bed/trend` - 发展趋势
- `/api/statistics/bed/regional` - 地区分布

### 医疗服务模块 (`/api/statistics/service/*`)
- `/api/statistics/service/hospital` - 医院服务量
- `/api/statistics/service/quality` - 服务质量分析
- `/api/statistics/service/trend` - 发展趋势
- `/api/statistics/service/regional` - 地区对比

### 医疗费用模块 (`/api/statistics/cost/*`)
- `/api/statistics/cost/analysis` - 费用分析
- `/api/statistics/cost/trend` - 费用趋势
- `/api/statistics/cost/comparison` - 费用对比
- `/api/statistics/cost/structure` - 费用结构

---

## 🔧 系统管理API

### 用户管理 (`/api/system/users/*`)
- `/api/system/users` - 用户CRUD操作
- `/api/system/users/{id}` - 用户详情
- `/api/system/users/{id}/roles` - 用户角色管理

### 角色管理 (`/api/system/roles/*`)
- `/api/system/roles` - 角色CRUD操作
- `/api/system/roles/{id}/permissions` - 角色权限管理

### 菜单管理 (`/api/system/menus/*`)
- `/api/system/menus` - 菜单CRUD操作
- `/api/system/menus/tree` - 菜单树结构

---

## 📝 注意事项

1. **认证要求**: 除了登录、注册和首页外，所有API都需要JWT token认证
2. **角色权限**: 不同角色(ADMIN, ANALYST, AUDITOR, RESEARCHER)有不同的API访问权限
3. **错误处理**: 所有API调用都有统一的错误处理，失败时显示明确错误信息
4. **数据格式**: 后端API统一返回格式 `{code, message, data, timestamp}`
5. **分页支持**: 列表类API支持分页参数 `page` 和 `size`
6. **筛选功能**: 大部分查询API支持多种筛选条件

---

## 🚀 开发建议

1. **API测试**: 建议使用Postman或类似工具测试后端API
2. **错误监控**: 关注浏览器控制台的API错误信息
3. **性能优化**: 大数据量查询时注意分页和筛选
4. **缓存策略**: 考虑对静态数据进行适当缓存
