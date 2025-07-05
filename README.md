# 健康大数据应用平台

基于 Vue 3 + Vite + Element Plus 的健康大数据统计分析决策系统前端应用。

## 功能特性

- ✅ **现代化首页**: 滚动触发动画，类似 Adaline.ai 的设计风格
- ✅ **用户注册功能**: 完整的注册流程和表单验证
- ✅ **用户登录功能**: 现代化的登录界面设计
- ✅ **JWT 令牌认证**: 安全的用户认证机制
- ✅ **角色权限管理**: 统计分析师、访客等角色控制
- ✅ **路由守卫**: 页面访问权限控制
- ✅ **响应式设计**: 完美适配各种设备
- ✅ **滚动动画**: 滚动触发的视差动画效果
- ✅ **统一的 API 请求处理**: 标准化的接口调用

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **UI 组件库**: Element Plus
- **状态管理**: Pinia
- **路由管理**: Vue Router 4
- **HTTP 客户端**: Axios
- **图标**: Element Plus Icons

## 项目结构

```
src/
├── api/                 # API 接口
│   ├── auth.js         # 认证相关接口
│   └── request.js      # Axios 配置
├── assets/             # 静态资源
├── components/         # 公共组件
│   └── Navbar.vue      # 导航栏组件
├── router/             # 路由配置
│   └── index.js
├── stores/             # Pinia 状态管理
│   └── user.js         # 用户状态
├── utils/              # 工具函数
├── views/              # 页面组件
│   ├── Home.vue        # 首页（滚动动画）
│   ├── Login.vue       # 登录页面
│   ├── Register.vue    # 注册页面
│   └── Dashboard.vue   # 仪表板
├── App.vue             # 根组件
└── main.js             # 应用入口
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
# 启动 HTTP 开发服务器（推荐，避免证书问题）
pnpm run dev

# 或者显式启动 HTTP 模式
pnpm run dev:http

# 启动 HTTPS 模式（需要处理证书警告）
pnpm run dev:https
```

**默认模式**: 应用将在 `http://localhost:5174` 启动（如果端口被占用会自动选择其他端口）。

**HTTPS 模式**: 如果使用 `dev:https`，应用将在 `https://localhost:5174` 启动。首次访问时，浏览器可能显示证书警告，这是正常的，因为开发环境使用自签名证书。请点击"继续访问"或"接受风险"。

### 构建生产版本

```bash
pnpm run build
```

### 预览生产版本

```bash
# 预览构建结果（HTTPS）
pnpm run preview:https
```

## HTTPS 配置

本应用统一使用 HTTPS 协议以确保数据传输安全。

### 开发环境
- **前端服务**: `http://localhost:5174` (默认) 或 `https://localhost:5174` (HTTPS模式)
- **后端服务**: `http://localhost:8080` (默认) 或 `https://localhost:8080` (HTTPS模式)
- **协议选择**: 支持 HTTP 和 HTTPS 两种模式

### 环境变量配置

项目支持通过环境变量配置 HTTPS 设置：

```bash
# .env.development (HTTP 模式)
VITE_DEV_SERVER_HTTPS=false
VITE_DEV_SERVER_PORT=5174
VITE_API_BASE_URL=http://localhost:8080
VITE_TURNSTILE_SITE_KEY=your-turnstile-key

# .env.development.https (HTTPS 模式)
VITE_DEV_SERVER_HTTPS=true
VITE_DEV_SERVER_PORT=5174
VITE_API_BASE_URL=https://localhost:8080
VITE_TURNSTILE_SITE_KEY=your-turnstile-key
```

### 协议选择

**HTTP 模式（推荐用于开发）**:
- 无需处理证书问题
- 快速启动和调试
- 适合本地开发环境

**HTTPS 模式（用于生产环境测试）**:
- 模拟生产环境
- 需要处理自签名证书警告
- 首次访问时：
  1. 浏览器会显示"不安全"警告
  2. 点击"高级"或"详细信息"
  3. 选择"继续访问"或"接受风险"

详细配置说明请参考 [HTTPS_SETUP.md](./HTTPS_SETUP.md)

## API 接口说明

### 1. 用户注册

- **URL**: `/api/auth/register?captcha=mirtable233`
- **方法**: POST
- **说明**: 输入 captcha 为 `mirtable233` 直接跳过人机验证，方便调试

**请求参数**:
```json
{
  "user": {
    "username": "zack",
    "password": "P@sswOrd",
    "email": "zack@demo.cn",
    "phone": "18180010001",
    "realName": "zack Duck"
  },
  "roles": [
    {
      "roleName": "统计分析师",
      "roleCode": "ANALYST",
      "description": "负责数据分析"
    },
    {
      "roleName": "访客",
      "roleCode": "VISITOR",
      "description": "只读权限"
    }
  ]
}
```

### 2. 用户登录

- **URL**: `/api/auth/login`
- **方法**: POST

**请求参数**:
```json
{
  "username": "string",
  "password": "string"
}
```

**响应参数**:
```json
{
  "token": "string",      // JWT令牌(里面放username和id)
  "roles": ["user"],      // 角色列表
  "expiresIn": 3600       // 过期时间(秒)
}
```

## 使用说明

1. **注册账号**: 访问注册页面，填写用户信息和选择角色
2. **登录系统**: 使用注册的用户名和密码登录
3. **访问仪表板**: 登录成功后自动跳转到系统仪表板

## 界面预览

### 🎨 Adaline.ai 风格的现代化设计
- **深色主题界面**: 采用深色渐变背景，专业现代
- **玻璃态效果**: 毛玻璃卡片设计，半透明背景
- **动态统计数据**: 数字计数器动画，展示平台实力
- **浮动动画元素**: 背景浮动光球，增加视觉层次
- **现代化表单**: 浮动标签输入框，流畅交互体验
- **社交登录集成**: Google、微信等第三方登录选项

### 设计亮点
- 🌌 **深空渐变背景**: 深蓝到紫色的渐变，营造科技感
- 💎 **玻璃态卡片**: 半透明毛玻璃效果，现代时尚
- ⚡ **动画交互**: 按钮悬停、输入框聚焦等流畅动画
- 📊 **数据可视化**: 动态统计数字，展示平台规模
- 🎯 **响应式设计**: 完美适配桌面和移动设备
- 🔮 **浮动元素**: 背景动态光球，增加视觉吸引力

### 技术特色
- ✨ 纯 CSS 实现所有动画效果
- 🎯 Vue 3 Composition API
- 📱 完全响应式布局
- 🔒 实时表单验证
- 🚀 零依赖动画库

## 系统模块

- 人口信息统计分析
- 医疗卫生机构统计分析
- 医疗卫生人员统计分析
- 医疗卫生床位统计分析
- 医疗服务统计分析
- 医疗费用统计分析

*注：目前各功能模块正在开发中*

## 开发说明

- 项目使用 Vue 3 Composition API
- 状态管理使用 Pinia
- UI 组件基于 Element Plus
- 支持响应式设计，适配移动端
- 包含完整的用户认证流程
- 实现了路由守卫和权限控制

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Compile and Minify for Production

```sh
pnpm build
```
