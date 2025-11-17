// request 是一个基于 Axios 封装的 HTTP 请求工具
// Axios 是一个基于 Promise 的 HTTP 库，用于浏览器和 Node.js 中发送 HTTP 请求
// 用于向真实后端服务器发送 API 请求，并处理请求和响应
// 主要功能包括：
// 1. 统一管理请求配置（baseURL、timeout）
// 2. 请求拦截器：自动添加 token 到请求头
// 3. 响应拦截器：统一处理响应数据和错误
// 4. 错误处理：自动处理 401、403、404、500 等 HTTP 错误

import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
//AxiosError错误类型，InternalAxiosRequestConfig请求配置类型（请求头、请求体等请求规则）
import { message } from 'antd'; // 引入antd 的 message 弹窗组件

/**
 * 创建 Axios 实例（信使）
 * baseURL: 所有请求的基础 URL
 * timeout: 请求超时时间
 */
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 引入环境变量中地址，如果VITE_API_BASE_URL不存在，则使用/api
  timeout: 10000, // 10 秒超时
});

// ========== 请求拦截器 ==========
// 在请求发送前执行
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token');
    
    // 如果 token 存在，添加到请求头
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========== 响应拦截器 ==========
// 在收到响应后执行
request.interceptors.response.use(
  (response) => {
    const { code, msg } = response.data;
    
    // 根据后端约定的响应格式处理
    if (code === 200 || response.status === 200) {
      return response.data; // 返回数据
    }
    
    message.error(msg || '请求失败');
    return Promise.reject(new Error(msg || '请求失败'));
  },
  (error: AxiosError) => {
    // ========== 处理 HTTP 错误 ==========
    if (error.response) {
      const { status } = error.response;
      
      switch (status) {
        case 401:
          message.error('未授权，请重新登录');
          localStorage.removeItem('token'); // 删除token
          window.location.href = '/login'; // 重定向到登录页
          break;
        case 403:
          message.error('拒绝访问');
          break;
        case 404:
          message.error('请求地址不存在');
          break;
        case 500:
          message.error('服务器错误');
          break;
        default:
          message.error((error.response.data as { msg?: string })?.msg || '请求失败');
      }
    } else {
      message.error('网络错误，请检查网络连接');
    }
    
    return Promise.reject(error);
  }
);

export default request;