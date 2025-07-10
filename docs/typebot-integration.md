# Typebot 聊天机器人集成指南

## 概述

我们已经成功将 Typebot.io 聊天机器人集成到您的健康大数据应用中。这个智能助手可以帮助用户：

- 查询成都市健康数据统计
- 了解医疗机构信息
- 指导数据导出操作
- 解答系统使用问题

## 功能特性

### 🎯 智能对话
- 基于 Typebot.io 的可视化对话流程
- 支持自然语言理解
- 智能回复和引导

### 🎨 美观界面
- 现代化的聊天界面设计
- 符合您应用的设计风格
- 响应式布局，支持移动端

### 🔄 备用机制
- 当 Typebot 服务不可用时，自动切换到本地聊天
- 预设的常见问题回复
- 快捷操作按钮

## 使用方法

### 1. 配置 Typebot ID

在 `src/config/typebot.js` 文件中，将 `TYPEBOT_ID` 替换为您的实际 Typebot ID：

```javascript
export const TYPEBOT_CONFIG = {
  TYPEBOT_ID: 'your-actual-typebot-id-here', // 替换这里
  // ... 其他配置
}
```

### 2. 创建 Typebot 机器人

1. 访问 [Typebot.io](https://app.typebot.io)
2. 注册账号并登录
3. 创建新的机器人
4. 设计对话流程
5. 获取机器人 ID 并更新配置

### 3. 自定义对话内容

您可以在 Typebot 平台上设计专门针对健康数据应用的对话流程：

#### 建议的对话流程：
- **欢迎消息**：介绍助手功能
- **主菜单**：提供功能选项
- **数据查询**：引导用户查询特定数据
- **操作指导**：帮助用户使用系统功能
- **联系支持**：提供技术支持信息

## 集成位置

聊天组件已全局集成到应用中：

- ✅ **全局布局** (`src/layouts/ModernLayout.vue`) - 所有登录后的页面都会显示
- ❌ **首页** - 不显示聊天组件
- ❌ **登录页面** - 不显示聊天组件
- ❌ **注册页面** - 不显示聊天组件

### 显示聊天组件的页面包括：
- 仪表板
- 所有统计分析页面
- 数据管理页面
- 个人资料页面
- 帮助中心
- 系统设置
- 用户管理（管理员）
- 日志审计（管理员）
- 以及所有其他使用 ModernLayout 的页面

### 测试页面
访问 `/app/typebot-test` 可以查看聊天组件的功能演示和使用说明。

## 自定义配置

### 主题配置

在 `src/config/typebot.js` 中修改 `THEME` 配置：

```javascript
THEME: {
  general: {
    font: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    background: {
      type: 'Color',
      content: '#ffffff'
    }
  },
  chat: {
    hostBubbles: {
      backgroundColor: '#f1f5f9', // 机器人消息背景色
      color: '#334155'            // 机器人消息文字色
    },
    guestBubbles: {
      backgroundColor: '#6366f1', // 用户消息背景色
      color: '#ffffff'            // 用户消息文字色
    }
  }
}
```

### 快捷操作

修改 `QUICK_ACTIONS` 配置来自定义快捷操作按钮：

```javascript
QUICK_ACTIONS: [
  { id: 1, text: '查询人口统计', action: 'population' },
  { id: 2, text: '医院信息', action: 'hospitals' },
  // 添加更多快捷操作...
]
```

### 备用回复

在 `FALLBACK_RESPONSES` 中配置本地回复内容：

```javascript
FALLBACK_RESPONSES: {
  population: {
    keywords: ['人口', '统计', '人数'],
    response: '您的自定义回复内容...'
  }
  // 添加更多回复类型...
}
```

## 样式自定义

聊天组件的样式在 `src/components/TypebotChat.vue` 中定义。您可以修改：

- 聊天气泡的颜色和大小
- 聊天窗口的尺寸和位置
- 动画效果
- 响应式布局

## 部署注意事项

### 1. 环境变量
如果需要在不同环境使用不同的 Typebot ID，可以使用环境变量：

```javascript
// 在 .env 文件中
VITE_TYPEBOT_ID=your-production-typebot-id

// 在配置文件中
TYPEBOT_ID: import.meta.env.VITE_TYPEBOT_ID || 'fallback-id'
```

### 2. 网络配置
确保您的服务器可以访问 Typebot.io 的服务：
- `https://typebot.io`
- `https://app.typebot.io`

### 3. CSP 配置
如果使用 Content Security Policy，需要允许 Typebot 域名：

```
script-src 'self' https://typebot.io https://app.typebot.io;
frame-src 'self' https://typebot.io https://app.typebot.io;
```

## 故障排除

### 常见问题

1. **聊天窗口不显示**
   - 检查 Typebot ID 是否正确
   - 确认网络连接正常
   - 查看浏览器控制台错误信息

2. **样式显示异常**
   - 检查 CSS 冲突
   - 确认组件正确导入
   - 验证响应式布局

3. **功能不工作**
   - 检查 JavaScript 错误
   - 确认组件事件绑定
   - 验证 Vue 3 兼容性

### 调试模式

在开发环境中，组件会输出调试信息到控制台。您可以通过以下方式查看：

```javascript
// 在浏览器控制台中
console.log('Typebot 状态:', typebotInstance)
```

## 技术支持

如果您在集成过程中遇到问题，可以：

1. 查看 [Typebot 官方文档](https://docs.typebot.io/)
2. 访问 [Typebot GitHub](https://github.com/baptisteArno/typebot.io)
3. 联系技术支持团队

## 更新日志

- **v1.0.0** - 初始集成完成
  - 基础聊天功能
  - 主题自定义
  - 备用机制
  - 响应式设计
