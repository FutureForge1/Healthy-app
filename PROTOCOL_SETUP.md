# 协议配置指南

## 🚨 解决"此站点的连接不安全"问题

如果您遇到浏览器显示"localhost 使用不受支持的协议"或"此站点的连接不安全"的错误，这是因为浏览器对自签名 HTTPS 证书的安全限制。

## 🔧 解决方案

### 方案 1: 使用 HTTP 模式（推荐）

**最简单的解决方案是使用 HTTP 模式进行开发：**

```bash
# 启动 HTTP 开发服务器
pnpm run dev
```

应用将在 `http://localhost:5174` 启动，无需处理任何证书问题。

### 方案 2: 强制接受 HTTPS 证书

如果您需要使用 HTTPS 模式，请按以下步骤操作：

#### Chrome 浏览器:
1. 访问 `https://localhost:5174`
2. 看到"您的连接不是私密连接"警告
3. 点击"高级"
4. 点击"继续前往 localhost（不安全）"

#### Firefox 浏览器:
1. 访问 `https://localhost:5174`
2. 看到"警告：潜在的安全风险"
3. 点击"高级..."
4. 点击"接受风险并继续"

#### Edge 浏览器:
1. 访问 `https://localhost:5174`
2. 看到"您的连接不是私密连接"
3. 点击"高级"
4. 点击"继续到 localhost（不安全）"

## 📋 启动命令对比

| 命令 | 协议 | 地址 | 用途 |
|------|------|------|------|
| `pnpm run dev` | HTTP | `http://localhost:5174` | 日常开发（推荐） |
| `pnpm run dev:http` | HTTP | `http://localhost:5174` | 显式 HTTP 模式 |
| `pnpm run dev:https` | HTTPS | `https://localhost:5174` | HTTPS 测试模式 |

## 🔍 为什么会出现这个问题？

1. **自签名证书**: 开发环境使用的是自签名 SSL 证书
2. **浏览器安全策略**: 现代浏览器对自签名证书有严格的安全限制
3. **localhost 特殊处理**: 某些浏览器版本对 localhost 的 HTTPS 有特殊限制

## 💡 推荐做法

### 开发环境
- **使用 HTTP 模式**: `pnpm run dev`
- 快速、无证书问题
- 适合日常开发和调试

### 生产环境测试
- **使用 HTTPS 模式**: `pnpm run dev:https`
- 模拟生产环境
- 需要手动接受证书警告

### 生产部署
- 使用有效的 SSL 证书
- 配置正确的域名
- 无需处理证书警告

## 🛠️ 环境配置

### HTTP 模式配置 (.env.development)
```bash
VITE_DEV_SERVER_HTTPS=false
VITE_API_BASE_URL=http://localhost:8080
```

### HTTPS 模式配置 (.env.development.https)
```bash
VITE_DEV_SERVER_HTTPS=true
VITE_API_BASE_URL=https://localhost:8080
```

## ✅ 验证配置

启动应用后，检查控制台输出：

```bash
# HTTP 模式
➜  Local:   http://localhost:5174/

# HTTPS 模式  
➜  Local:   https://localhost:5174/
```

## 🔗 相关文档

- [HTTPS_SETUP.md](./HTTPS_SETUP.md) - 详细的 HTTPS 配置说明
- [README.md](./README.md) - 项目启动指南
- [API_ENDPOINTS.md](./API_ENDPOINTS.md) - API 接口文档
