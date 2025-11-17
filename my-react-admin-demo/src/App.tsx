import './App.css'
import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import routes from './router/routes';

// 路由组件
const AppRoutes=()=>{
  const element = useRoutes(routes);
  return element;
}

//根组件
function App () {
  return (
    <>
      <ConfigProvider locale={zhCN}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ConfigProvider>
    </>
  )
}

export default App
