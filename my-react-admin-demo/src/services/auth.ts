// 用户登录、登出、获取当前用户信息API
//前端登录模块的接口封装层，主要作用是 根据开关（USE_MOCK）决定使用模拟数据还是真实后端接口，从而实现 前后端分离开发 或 快速原型开发。
// （开发阶段使用模拟数据，生产阶段使用真实后端接口）


import request from '@/utils/request'; // 导入请求工具
import { mockLogin, mockGetCurrentUser, mockLogout } from '@/mock/auth'; // 导入模拟登录API
import type { LoginParams, LoginResult, ApiResponse, User } from '@/interface'; // 导入登录参数类型

// 判断是否使用模拟数据
const USE_MOCK = true; // 改为 false 则使用真实后端接口

export function login(data) {
    if (USE_MOCK) {
        return mockLogin(data.username, data.password);
    }
    return request({ // 使用真实后端接口
        url: '/api/login', // 登录接口
        method: 'POST', 
        data,
    });
}

export function getCurrentUser() { // 获取当前用户信息
    if (USE_MOCK) {
        return mockGetCurrentUser();
    }
    return request({ // 使用真实后端接口
        url: '/api/currentUser', // 获取当前用户信息接口
        method: 'GET',
    });
}

export function logout() {
    if (USE_MOCK) {
        return mockLogout();
    }
    return request({ // 使用真实后端接口
        url: '/api/logout', // 退出登录接口
        method: 'POST',
    });
}