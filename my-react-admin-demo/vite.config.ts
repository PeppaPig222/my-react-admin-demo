//vite.config.ts 是 Vite 的配置文件，用于配置 Vite 的开发服务器、构建选项等

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// vite 配置
export default defineConfig({
  // 插件配置
  plugins: [react()], // 支持 react 的 jsx 语法
  // 路径别名配置
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }, // @ 代表 src 目录
  },
  server: {
    port: 3000, // 端口号
    open: true, // 启动后自动打开浏览器
    proxy: { // 代理配置（解决跨域问题）
      '/api': {
        target: 'http://localhost:8000', // 后端服务地址
        changeOrigin: true, // 改变请求来源
      },
    }, 
  }, 
})
