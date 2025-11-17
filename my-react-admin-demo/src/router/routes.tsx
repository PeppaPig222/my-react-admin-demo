import React, { lazy, Suspense } from "react"; // 引入React 的 lazy 和 Suspense 组件
import { Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom"; //RouteObject 是 TypeScript 类型，需要使用 type 导入
import { Spin } from "antd"; // 引入antd 的 Spin 组件
import BasicLayout from "@/components/Layout/BasicLayout"; // 引入用户布局组件

// ========== 懒加载页面组件 ==========
const Login = lazy(() => import("@/pages/Login")); // 懒加载登录页面组件
const Dashboard = lazy(() => import("@/pages/Dashboard"));

//pageLoading 变量（此处不能为组件）
//Fast Refresh (Vite 的热更新机制) 有一个规则：
// 如果文件中定义了 React 组件（大写开头的函数），该文件只能导出组件，不能混合导出其他内容（如配置对象、常量等）。
const pageLoading = (
  <div style={{ textAlign: "center", paddingTop: "200px" }}>
    <Spin size="large" tip="加载中..." />
  </div>
);

// 路由配置
const routes: RouteObject[] = [
  // 根路径重定向到登陆页
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  // 登陆页（使用BasicLayout）
  {
    path: "/login",
    element: (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}>
        <Suspense fallback={pageLoading}>
        {/* 懒加载时显示的 loading 组件 */}
        <Login />
      </Suspense>
      </div>
    ),
  },
  //仪表盘页面
  {
    path: "/dashboard",
    element: (
      <BasicLayout>
        <Suspense fallback={pageLoading}>
          {/* 懒加载时显示的 loading 组件 */}
          <Dashboard />
        </Suspense>
      </BasicLayout>
    ),
  },
];
export default routes;
