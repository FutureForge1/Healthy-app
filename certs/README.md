# 证书文件说明

## 📋 需要的证书文件

请将以下证书文件放置在此目录中：

1. **client.crt** - 客户端证书
2. **client.key** - 客户端私钥
3. **ca.crt** - CA 根证书

## 📥 获取证书文件

请联系后端开发者获取这些证书文件，或者如果您有生成权限，可以使用 OpenSSL 生成。

## 🔒 安全提醒

- 不要将私钥文件提交到版本控制系统
- 确保文件权限设置正确
- 定期更新证书文件

## 📝 文件格式

证书文件应该是 PEM 格式，内容类似：

```
-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKoK/OvD...
-----END CERTIFICATE-----
```

私钥文件格式：

```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEF...
-----END PRIVATE KEY-----
```
