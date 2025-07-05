# API接口更新说明

## 概述

根据最新的后端接口文档，我们已经更新了前端API调用层，新增了多个模块的详细接口，并保持了向后兼容性。

## 更新内容

### 1. 医疗卫生人员统计分析模块

#### 新增接口：

- **`getPersonnelCategoryStats(queryParams)`** - 获取卫生人员分类统计
  - 接口地址：`POST /api/statistics/personnel/category-stats/query`
  - 支持复杂查询条件、排序和分页

- **`getPersonnelTotalCount(queryParams)`** - 获取历年卫生人员总数
  - 接口地址：`POST /api/statistics/personnel/total-count/query`
  - 支持年份范围查询和统计聚合

- **`getPersonnelStructureAnalysis()`** - 获取人员结构分析
  - 接口地址：`GET /api/statistics/personnel/structure-analysis`
  - 提供医护比例、增长率等分析数据

#### 查询参数格式：
```javascript
{
  "filters": {
    "year": { "eq": 2023 },
    "totalCount": { "gte": 10 }
  },
  "sort": [
    { "field": "year", "order": "desc" }
  ],
  "pageInfo": {
    "index": 0,
    "size": 20
  }
}
```

### 2. 医疗卫生床位统计分析模块

#### 新增接口：

- **`getBedCategoryStats(queryParams)`** - 获取床位分类统计
  - 接口地址：`POST /api/statistics/bed/category-stats/query`
  - 按医院类型分类统计床位数据

- **`getBedTotalCount(queryParams)`** - 获取历年床位总数
  - 接口地址：`POST /api/statistics/bed/total-count/query`
  - 历年床位总数趋势分析

- **`getBedUtilizationAnalysis(params)`** - 获取床位使用率分析
  - 接口地址：`GET /api/statistics/bed/utilization-analysis`
  - 床位使用效率和周转率分析

### 3. 医疗服务统计分析模块

#### 新增接口：

- **`getHospitalServiceStats(queryParams)`** - 获取医院服务统计
  - 接口地址：`POST /api/statistics/service/hospital-service/query`
  - 门诊、急诊、转诊等服务量统计

- **`getServiceQualityAnalysis(params)`** - 获取医疗服务质量分析
  - 接口地址：`GET /api/statistics/service/quality-analysis`
  - 服务效率和质量指标分析

### 4. 医疗费用统计分析模块

#### 新增接口：

- **`getOutpatientCostStats(queryParams)`** - 获取门诊费用统计
  - 接口地址：`POST /api/statistics/cost/outpatient/query`
  - 门诊费用结构和比例分析

- **`getInpatientCostStats(queryParams)`** - 获取住院费用统计
  - 接口地址：`POST /api/statistics/cost/inpatient/query`
  - 住院费用详细统计

- **`getCostStructureComparison(params)`** - 获取费用结构对比分析
  - 接口地址：`GET /api/statistics/cost/structure-comparison`
  - 不同医院等级费用对比

### 5. 数据管理模块（全新）

#### 数据导入导出：

- **`importData(formData)`** - 数据导入
  - 接口地址：`POST /api/data/import`
  - 支持Excel、CSV等格式导入

- **`exportData(params)`** - 数据导出
  - 接口地址：`POST /api/data/export`
  - 支持多种格式导出

- **`getImportExportLogs(params)`** - 获取导入导出记录
  - 接口地址：`GET /api/data/import-export-logs`
  - 操作历史记录查询

#### 数据清洗与预处理：

- **`checkDataQuality(params)`** - 数据质量检查
  - 接口地址：`POST /api/data/quality-check`
  - 空值、重复、一致性检查

- **`cleanData(params)`** - 执行数据清洗
  - 接口地址：`POST /api/data/clean`
  - 去重、填充缺失值等操作

#### 数据标签管理：

- **`getDataTags()`** - 获取数据标签列表
- **`createDataTag(tagData)`** - 创建数据标签
- **`assignDataTags(params)`** - 为数据添加标签
- **`updateDataTag(tagId, tagData)`** - 更新数据标签
- **`deleteDataTag(tagId)`** - 删除数据标签

## 使用方式

### 1. 导入API
```javascript
import { statisticsApi } from '@/api/statistics'
import { dataApi } from '@/api/data'
import personnelApi from '@/api/personnel'  // 医护人员专用API
```

### 2. 调用示例
```javascript
// 获取人员分类统计（使用新的专用API）
const personnelStats = await personnelApi.getPersonnelCategoryStats({
  filters: { year: { eq: 2023 } },
  sort: [{ field: 'year', order: 'desc' }],
  pageInfo: { index: 0, size: 20 }
})

// 数据导入
const formData = new FormData()
formData.append('file', file)
formData.append('dataType', 'population')
formData.append('importMode', 'insert')
const importResult = await dataApi.importData(formData)
```

## 向后兼容性

所有原有的API接口都保持不变，新增的接口作为补充。原有代码无需修改即可继续使用。

## 响应数据格式

### 统计查询接口响应格式：
```javascript
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "rows": [...], // 原始数据
    "pageInfo": {...}, // 分页信息
    "aggregations": {
      "year_histogram": [...],
      "total_stats": {...},
      "total_buckets": [...]
    }
  }
}
```

### 数据管理接口响应格式：
```javascript
{
  "code": 200,
  "message": "操作成功",
  "data": {
    // 具体操作结果数据
  }
}
```

## 文件结构

- `src/api/statistics.js` - 统计分析API（已更新）
- `src/api/data.js` - 数据管理API（新增）
- `src/examples/api-usage-examples.js` - 使用示例（新增）

## 注意事项

1. 新接口使用POST方法进行复杂查询，支持更灵活的过滤条件
2. 查询参数中的字段名使用驼峰命名法（camelCase）
3. 过滤条件支持多种操作符：eq, notEq, gt, gte, lt, lte, in, notIn, like, notLike
4. 数据导入需要使用FormData格式
5. 所有接口都包含完整的错误处理机制

## 下一步

建议在相关页面中逐步迁移到新的API接口，以获得更好的性能和更丰富的功能。可以参考 `src/examples/api-usage-examples.js` 中的示例代码。
