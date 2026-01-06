import React, { useState } from 'react';
import { message } from 'antd';
// 引入 react-router-dom 中的 useNavigate 钩子,等价于 <Link to="xxx">
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore'; // 引入Zustand 状态管理钩子,认证全局状态
import type {LoginParams} from '@/types';
import LoginForm from '@/components/LoginForm/LoginForm';

/**
 * 登录页面
 */ // 定义一个登录页面组件
const Login :React.FC = () => {
    const navigate = useNavigate(); // 路由跳转钩子
    const { login } = useAuthStore(); // 从 Zustand store 获取 login 方法
    const [loading, setLoading] = useState(false); // 加载状态

    // 表单提交处理
    const handleSubmit = async (values: LoginParams) => {
        setLoading(true);
        try {
            // 调用 login 方法
            const result = await login(values);
            if (result.success) {
                message.success('登录成功！');
                navigate('/dashboard'); // 跳转到仪表盘页面
            } else {
                alert(result.error || '登录失败');
            };
        } catch (error) {
            alert('登录失败，请重试');
        } finally {
            setLoading(false); // 加载状态结束
        }
    };

    return (
      <div className='login-page'>
        <LoginForm onLogin={handleSubmit} loading={loading} />
      </div>
    );  
};

export default Login;