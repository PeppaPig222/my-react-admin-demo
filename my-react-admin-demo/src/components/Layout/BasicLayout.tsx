import React from 'react';
// 定义一个用户布局组件,负责页面整体结构,无侧边栏、无导航栏，只有内容区域
//定义组件 props 类型
interface BasicLayoutProps {
    children: React.ReactNode;
}
//一个“外壳”组件，用来给登录页、注册页这类“不需要侧边栏、顶部栏”的页面提供统一的布局
const BasicLayout: React.FC<BasicLayoutProps> = ({children}) => {
    return (
        <div style={{
            display: 'flex',    
            flexDirection: 'column', // 垂直布局
            minHeight: '100vh', // 最小高度为视口高度（整个屏幕）
            background: '#f1f4f6', // 浅灰色背景
        }}>
            {/* 内容区域 */}
            <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center', 
                alignItems: 'center', 
            }}>
                {children}
            </div>
            {/* 页脚 */}
            <footer style={{
                textAlign: 'center', // 文本居中
                padding: '24px 0', // 内边距24px 0
                color: '#999',
            }}>
                默认登陆名：yuchen/admin/user<br />
                默认密码：1399<br />
                <br />
                React Admin Demo © 2026 yuchen
            </footer>
        </div>
    )
}

export default BasicLayout;