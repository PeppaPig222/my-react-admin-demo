import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 将 App 组件渲染到 id 为 root 的 DOM 节点
// ReactDOM.createRoot(),React 18 的新 API，创建根节点
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
