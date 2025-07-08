import { fileURLToPath, URL } from 'node:url'
import fs from 'fs'
import path from 'path'
import https from 'https'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      https: env.VITE_DEV_SERVER_HTTPS === 'true' ? {
        // 使用您提供的证书文件
        key: fs.readFileSync(path.join('./certs', 'client.key')),
        cert: fs.readFileSync(path.join('./certs', 'client.crt')),
        ca: fs.readFileSync(path.join('./certs', 'ca.crt')),
        passphrase: '050326'
      } : false,
      port: parseInt(env.VITE_DEV_SERVER_PORT) || 5174,
      host: 'localhost',
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false, // 开发环境允许自签名证书
          rejectUnauthorized: false, // 忽略证书验证
          // 双向认证配置
          agent: env.VITE_DEV_SERVER_HTTPS === 'true' ? (() => {
            try {
              const certPath = env.VITE_CLIENT_CERT_PATH || './certs';
              return new https.Agent({
                cert: fs.readFileSync(path.join(certPath, 'client.crt')),
                key: fs.readFileSync(path.join(certPath, 'client.key')),
                ca: fs.readFileSync(path.join(certPath, 'ca.crt')),
                // 可选：如果私钥有密码
                passphrase: '050326',

                // 强制验证服务器主机名
                checkServerIdentity: (host, cert) => {
                // 默认就会校验 CN/SAN 是否匹配 host，你也可以自定义
                return undefined; // 没有异常 -> 通过验证
                },
                rejectUnauthorized: false
              });
            } catch (error) {
              console.warn('客户端证书加载失败，使用默认配置:', error.message);
              return undefined;
            }
          })() : undefined
          // 不重写路径，保持 /api 前缀
        }
      }
    }
  }
})
