import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, DashboardOutlined, GithubOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
import { useState, useEffect } from 'react';
import type { MenuProps } from 'antd';
import { Avatar, Tag } from 'antd';
// import logo from '@/assets/logo.png';
const { Header, Sider, Content, Footer} = Layout;

// 定义组件 props 类型
interface AdminLayoutProps { 
    //React.ReactNode 是 React 的类型，表示一个 React 节点，
    // 可以包含任何 React 元素（如 JSX、字符串、数字、布尔值、null、undefined、数组、函数、对象等）
    children: React.ReactNode; // 子组件
}

// 一个“外壳”组件，用来给需要侧边栏、顶部栏的页面提供统一的布局
const AdminLayout: React.FC<AdminLayoutProps> = ({children}) => {
  const navigate = useNavigate(); // 路由跳转钩子
  const location = useLocation(); // 路由位置钩子
  const { currentUser, logout, checkPermission } = useAuthStore(); // 获取用户信息
  const [selectedKey, setSelectedKey] = useState('dashboard'); // 当前选中的菜单项
  // 根据当前路径设置选中的菜单
  useEffect(() => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    setSelectedKey(path);
  }, [location.pathname]);
  // 菜单配置
  const adminMenuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/user',
      icon: <UserOutlined />,
      label: '用户管理',
      access: 'canManageUser', // 需要权限
    },
  ];
  // 用户菜单配置
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
  ];
  return(
    <Layout style={{ minHeight: '100vh' }}>
      {/* ========== 左侧边栏 ========== */}
      <Sider theme='light' width={240}
        style={{backgroundColor: '#fffefe', borderRadius: '12px 12px 0 0'}}
      >
        <div style={{
          height: 200,
          margin: '5px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 0',
          borderBottom: '1px solid #f0f0f0',
          backgroundColor: '#fffefe',
        }}>
          <Avatar
            size={90}
            src={currentUser?.avator}
            icon={<UserOutlined />}
            style={{ marginBottom: 12}}
          />
          <div style={{ fontSize: 16, fontWeight: 'bold', color: '#181818' }}>
            {currentUser?.name || '未登录'}
          </div>
          <Tag color='default'
            style={{ 
              margin: 10,
              cursor: currentUser ? 'default':'pointer',
              transition: 'all 0.3s ease',
            }}
            onClick={() => !currentUser && navigate('/login')}
          >
              {currentUser?.role || '请登录'}
          </Tag>
        </div>
        <Menu
          theme='light'
          mode='inline' // 菜单模式：inline 内联，vertical 垂直，horizontal 水平
          selectedKeys={[selectedKey]} // 当前选中的菜单项
          items={adminMenuItems} // 菜单配置
          onClick={({ key }) => navigate(key)}
          style={{ textAlign: 'left'}}
        />
      </Sider>
      {/* ========== 右侧主体 ========== */}
      <Layout>
        {/* ========== 顶部栏 ========== */}
        <Header style={{
          background: '#fff', // 浅灰色背景
          marginLeft: '16px',
          padding: '5px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '12px 12px 0 0',
        }}>
          <div>
            <GithubOutlined style={{ marginRight: 5 }} />
            <span style={{ fontSize: 14, color: '#999'}}>欢迎使用Yuchen的后台管理系统</span>
          </div>
          <div>
            <LogoutOutlined style={{ marginRight: 5 }} />
            <span style={{ cursor: 'pointer', color: '#999' }} onClick={logout}>退出</span>
          </div>
        </Header>
        {/* ========== 内容区域 ========== */}
        <Content style={{ margin: '10px 0 0 16px', padding: 24, background: '#fff' }}>
          {children}
        </Content>
        <Footer style={{
          textAlign: 'center', // 文本居中
          padding: '12px 0', // 内边距24px 0
          color: '#999',
          background: '#fff',
          marginLeft: '16px',
        }}>
          React Admin Demo © 2026 yuchen
        </Footer>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;