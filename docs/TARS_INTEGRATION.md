# TARS智能助手集成文档

## 概述

本项目已成功集成TARS智能助手，为天府健康云平台提供AI驱动的客服支持。TARS是一个基于Claude AI的对话系统，具备强大的自然语言理解和知识库集成能力。

## 功能特性

### 🤖 智能对话
- 基于Claude 3.5 Sonnet模型
- 支持中文和英文对话
- 上下文理解和记忆
- 专业的健康数据领域知识

### 📚 知识库集成
- 集成健康大数据平台完整知识库
- 支持系统功能介绍和使用指导
- 常见问题自动回答
- 实时数据查询帮助

### 🎨 用户界面
- 现代化聊天界面设计
- 响应式布局，支持移动端
- 可自定义位置和样式
- 脉冲动画和未读消息提醒

### ⚙️ 管理功能
- 实时对话监控
- 用户满意度统计
- 配置管理界面
- 对话记录导出

## 技术架构

### 组件结构
```
src/
├── components/
│   └── TarsChat.vue          # 主聊天组件
├── services/
│   └── tarsService.js        # TARS服务封装
├── views/
│   ├── TarsDemo.vue          # 演示页面
│   └── admin/
│       └── TarsManagement.vue # 管理界面
└── layouts/
    └── ModernLayout.vue      # 布局集成
```

### 核心配置
```javascript
// TARS配置信息
const tarsConfig = {
  convid: 'WbpUav',                    // 对话ID
  baseUrl: 'https://chatbot.hellotars.com',
  apiUrl: 'https://asimov.hellotars.com/api/run-agent',
  displayName: '天府健康云助手',
  welcomeMessage: '您好，欢迎来到天府健康云平台！'
}
```

## 使用指南

### 1. 基础使用

#### 在Vue组件中使用
```vue
<template>
  <TarsChat 
    :convid="'WbpUav'"
    :auto-open="false"
    :show-welcome="true"
    position="bottom-right"
  />
</template>

<script setup>
import TarsChat from '@/components/TarsChat.vue'
</script>
```

#### 服务调用
```javascript
import tarsService from '@/services/tarsService'

// 初始化服务
tarsService.init()

// 发送消息到API
const response = await tarsService.sendMessage('你好')

// 添加消息监听器
const removeListener = tarsService.addMessageListener((message) => {
  console.log('收到消息:', message)
})
```

### 2. 高级配置

#### 自定义快速回复
```javascript
const quickReplies = tarsService.getQuickReplies()
// 返回预设的快速回复选项
```

#### 嵌入代码生成
```javascript
const embedCode = tarsService.getEmbedCode({
  width: '400px',
  height: '600px',
  borderRadius: '12px'
})
```

### 3. 管理功能

#### 访问管理界面
- 路径: `/app/tars-management`
- 权限: 仅管理员可访问
- 功能: 配置管理、统计监控、对话记录

#### 演示页面
- 路径: `/app/tars-demo`
- 权限: 所有登录用户
- 功能: 功能演示、集成指南

## API参考

### TarsService 类

#### 方法列表

| 方法 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| `init()` | - | void | 初始化服务 |
| `getChatbotUrl()` | - | string | 获取聊天机器人URL |
| `sendMessage(query, options)` | query: string, options: object | Promise | 发送消息到API |
| `addMessageListener(callback)` | callback: function | function | 添加消息监听器 |
| `getQuickReplies()` | - | array | 获取快速回复选项 |
| `checkStatus()` | - | Promise<boolean> | 检查服务状态 |
| `destroy()` | - | void | 销毁服务 |

### TarsChat 组件

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `convid` | String | 'WbpUav' | TARS对话ID |
| `position` | String | 'bottom-right' | 显示位置 |
| `autoOpen` | Boolean | false | 是否自动打开 |
| `showWelcome` | Boolean | true | 是否显示欢迎消息 |

#### 事件

| 事件名 | 参数 | 描述 |
|--------|------|------|
| `message-received` | message: object | 收到新消息时触发 |
| `chat-opened` | - | 聊天窗口打开时触发 |
| `chat-closed` | - | 聊天窗口关闭时触发 |

## 部署配置

### 环境变量
```bash
# TARS配置
VITE_TARS_CONVID=WbpUav
VITE_TARS_BASE_URL=https://chatbot.hellotars.com
VITE_TARS_API_URL=https://asimov.hellotars.com/api/run-agent
```

### 页面集成规则
- 首页、登录、注册页面：不显示聊天组件
- 其他所有页面：自动显示聊天组件
- 可通过路由meta配置控制显示

## 故障排除

### 常见问题

#### 1. 聊天组件不显示
- 检查路由配置中的显示规则
- 确认用户已登录
- 检查组件导入是否正确

#### 2. 无法发送消息
- 检查网络连接
- 确认TARS服务状态
- 查看浏览器控制台错误信息

#### 3. iframe加载失败
- 检查CORS设置
- 确认TARS URL可访问
- 检查防火墙设置

### 调试方法

#### 启用调试模式
```javascript
// 在浏览器控制台中执行
localStorage.setItem('tars-debug', 'true')
```

#### 查看服务状态
```javascript
// 检查TARS服务状态
const status = await tarsService.checkStatus()
console.log('TARS服务状态:', status)
```

## 更新日志

### v1.0.0 (2024-01-10)
- ✅ 初始集成TARS智能助手
- ✅ 实现聊天组件和服务封装
- ✅ 添加管理界面和演示页面
- ✅ 集成到主布局中
- ✅ 支持响应式设计

### 计划功能
- 🔄 多语言支持
- 🔄 主题自定义
- 🔄 语音对话功能
- 🔄 文件上传支持
- 🔄 对话历史搜索

## 技术支持

如有问题或建议，请联系：
- 邮箱: 2717120274@qq.com
- 电话: 18711607090

## 许可证

本项目遵循 MIT 许可证。
