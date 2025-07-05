# 双向认证 HTTPS 配置指南

## 🔐 概述

您的后端使用双向认证 HTTPS（Mutual TLS），需要客户端证书来建立安全连接。

## 📋 当前配置

- **后端服务**: `https://localhost:8080`
- **认证类型**: 双向认证（客户端证书 + 服务器证书）
- **证书目录**: `./certs/`

## 🗂️ 所需证书文件

请将以下证书文件放入 `certs/` 目录：

```
certs/
├── client.crt    # 客户端证书
├── client.key    # 客户端私钥
└── ca.crt        # CA 根证书
```

## 📥 获取证书文件

### 方法 1: 从后端开发者获取
请联系后端开发者获取：
- 客户端证书文件
- 对应的私钥文件
- CA 根证书文件

### 方法 2: 如果您有证书生成权限
如果您可以生成证书，请使用以下命令：

```bash
# 生成客户端私钥
openssl genrsa -out certs/client.key 2048

# 生成客户端证书请求
openssl req -new -key certs/client.key -out certs/client.csr

# 使用 CA 签署客户端证书（需要 CA 私钥）
openssl x509 -req -in certs/client.csr -CA certs/ca.crt -CAkey certs/ca.key -CAcreateserial -out certs/client.crt -days 365
```

## ⚙️ 配置详情

### 环境变量配置
```bash
# .env.development
VITE_API_BASE_URL=https://localhost:8443
VITE_CLIENT_CERT_PATH=./certs
VITE_DEV_SERVER_HTTPS=true
```

### Vite 代理配置
```javascript
proxy: {
  '/api': {
    target: 'https://localhost:8443',
    agent: new https.Agent({
      cert: fs.readFileSync('./certs/client.crt'),
      key: fs.readFileSync('./certs/client.key'),
      ca: fs.readFileSync('./certs/ca.crt'),
      rejectUnauthorized: false
    })
  }
}
```

## 🚀 启动应用

1. **确保证书文件就位**:
   ```bash
   ls certs/
   # 应该看到: client.crt  client.key  ca.crt
   ```

2. **启动开发服务器**:
   ```bash
   pnpm run dev
   ```

3. **访问应用**:
   - 前端: `https://localhost:5174`
   - 后端: `https://localhost:8443`

## 🔍 故障排除

### 问题 1: 证书文件未找到
```
Error: ENOENT: no such file or directory, open './certs/client.crt'
```

**解决方案**:
- 确保证书文件存在于 `certs/` 目录
- 检查文件名是否正确
- 确保文件权限可读

### 问题 2: 证书格式错误
```
Error: error:0909006C:PEM routines:get_name:no start line
```

**解决方案**:
- 确保证书文件是 PEM 格式
- 检查文件内容是否完整
- 确保文件编码为 UTF-8

### 问题 3: 私钥密码保护
如果私钥有密码保护，更新配置：

```javascript
// vite.config.js
agent: new https.Agent({
  cert: fs.readFileSync('./certs/client.crt'),
  key: fs.readFileSync('./certs/client.key'),
  passphrase: 'your_key_password', // 添加密码
  ca: fs.readFileSync('./certs/ca.crt'),
  rejectUnauthorized: false
})
```

## 🔒 安全注意事项

1. **证书文件安全**:
   - 不要将私钥文件提交到版本控制
   - 设置适当的文件权限
   - 定期更新证书

2. **开发环境配置**:
   - `rejectUnauthorized: false` 仅用于开发环境
   - 生产环境应该启用完整的证书验证

3. **证书管理**:
   - 记录证书过期时间
   - 建立证书更新流程
   - 备份重要证书文件

## 📞 需要帮助？

如果遇到问题，请提供：
1. 错误信息的完整日志
2. 证书文件列表 (`ls certs/`)
3. 后端服务状态
4. 浏览器控制台错误信息
