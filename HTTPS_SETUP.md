# HTTPS 配置说明

## 概述

本应用支持 HTTP 和 HTTPS 两种协议模式，可根据开发需求选择合适的模式。

## 🚨 解决"此站点的连接不安全"问题

如果您遇到浏览器显示"localhost 使用不受支持的协议"或"此站点的连接不安全"的问题，请使用以下解决方案：

### 方案 1: 使用 HTTP 模式（推荐）

```bash
# 启动 HTTP 开发服务器
pnpm run dev
# 或
pnpm run dev:http
```

访问: `http://localhost:5174`

### 方案 2: 解决 HTTPS 证书问题

如果需要使用 HTTPS 模式，请按以下步骤操作：

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

## 配置详情

### 前端配置

#### 开发环境
- **前端服务**: `https://localhost:5174`
- **后端服务**: `https://localhost:8080`
- **自动重定向**: HTTP 请求会自动重定向到 HTTPS

#### 环境变量配置
```bash
# .env.development
VITE_DEV_SERVER_HTTPS=true
VITE_DEV_SERVER_PORT=5174
VITE_API_BASE_URL=https://localhost:8080
```

### Vite 配置

```javascript
// vite.config.js
server: {
  https: true,
  port: 5174,
  proxy: {
    '/api': {
      target: 'https://localhost:8080',
      changeOrigin: true,
      secure: false // 开发环境允许自签名证书
    }
  }
}
```

### 后端要求

后端服务需要配置 HTTPS 支持：

1. **SSL 证书配置**
   - 开发环境可使用自签名证书
   - 生产环境需要有效的 SSL 证书

2. **端口配置**
   - 默认使用 8080 端口
   - 确保后端服务在 `https://localhost:8080` 可访问

## 开发环境设置

### 1. 自签名证书生成（可选）

如果需要自定义证书，可以生成自签名证书：

```bash
# 生成私钥
openssl genrsa -out localhost.key 2048

# 生成证书
openssl req -new -x509 -key localhost.key -out localhost.crt -days 365 -subj "/CN=localhost"
```

### 2. 启动应用

```bash
# 安装依赖
pnpm install

# 启动开发服务器（HTTPS）
pnpm run dev
```

应用将在 `https://localhost:5174` 启动。

### 3. 浏览器证书警告

首次访问时，浏览器可能显示证书警告：
- Chrome: 点击"高级" → "继续前往 localhost（不安全）"
- Firefox: 点击"高级" → "接受风险并继续"
- Safari: 点击"显示详细信息" → "访问此网站"

## 生产环境配置

### 环境变量

```bash
# .env.production
VITE_API_BASE_URL=https://your-production-domain.com
```

### 部署注意事项

1. **SSL 证书**: 确保生产环境有有效的 SSL 证书
2. **域名配置**: 更新 `VITE_API_BASE_URL` 为实际的生产域名
3. **CORS 配置**: 确保后端 CORS 配置允许 HTTPS 请求
4. **安全头**: 配置适当的安全响应头

## 故障排除

### 常见问题

1. **连接被拒绝**
   - 检查后端服务是否在 HTTPS 端口运行
   - 验证防火墙设置

2. **证书错误**
   - 开发环境：在浏览器中接受自签名证书
   - 生产环境：检查 SSL 证书配置

3. **混合内容错误**
   - 确保所有资源都通过 HTTPS 加载
   - 检查第三方服务的 HTTPS 支持

### 调试命令

```bash
# 检查端口占用
netstat -an | grep :5174
netstat -an | grep :8080

# 测试 HTTPS 连接
curl -k https://localhost:8080/api/health

# 查看证书信息
openssl s_client -connect localhost:8080 -servername localhost
```

## 安全考虑

1. **开发环境**
   - 使用自签名证书是安全的
   - 不要在生产环境使用开发证书

2. **生产环境**
   - 使用来自受信任 CA 的证书
   - 定期更新证书
   - 配置 HSTS（HTTP Strict Transport Security）

3. **API 安全**
   - 所有 API 调用都通过 HTTPS
   - JWT token 在 HTTPS 下传输更安全

## 相关文件

- `vite.config.js` - Vite HTTPS 配置
- `.env.development` - 开发环境变量
- `.env.production` - 生产环境变量
- `src/api/request.js` - Axios 配置
- `src/views/Register.vue` - 包含后端连接测试的 HTTPS URL

## 更新日志

- 2024-07-04: 统一配置 HTTPS 协议
- 前端开发服务器启用 HTTPS
- 后端 API 调用更新为 HTTPS
- 添加环境变量配置支持
