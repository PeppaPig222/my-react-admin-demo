import React, { useState } from 'react';
// 引入 react-router-dom 中的 useNavigate 钩子,等价于 <Link to="xxx">
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons'; // 引入图标
import useAuthStore from '@/store/useAuthStore'; // 引入Zustand 状态管理钩子,认证全局状态
import type {LoginParams} from '@/types';

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
                message.error(result.error || '登录失败');
            };
        } catch (error) {
            message.error('登录失败，请重试');
        } finally {
            setLoading(false); // 加载状态结束
        }
    };
    return (
        <Card title='用户登陆' // 卡片标题
        style={{width:400}} // 卡片宽度
        bordered={false} // 无边框
        >
            <Form
              onFinish={handleSubmit} // 表单提交时触发 handleSubmit 函数
              autoComplete='off' // 自动完成属性关闭
              size='large' // 大尺寸
            >

              {/* 用户名输入框 */}
              <Form.Item
                name='username'
                rules={[{required:true,message:'请输入用户名'}]}
              >
                <Input
                  prefix={<UserOutlined />} // 前缀图标
                  placeholder='用户名：yuchen'
                />
              </Form.Item>

              {/* 密码输入框 */}
              <Form.Item
              name='password'
              rules={[{required:true,message:'请输入密码!'}]}>
                <Input.Password
                 prefix={<LockOutlined />} // 前缀图标
                 placeholder='密码：1399'
                 />
              </Form.Item>

              {/* 提交按钮 */}
              <Form.Item>
                <Button
                type='primary'
                htmlType='submit' //让按钮变成 原生 submit 按钮，点击后会触发表单的 onFinish 事件
                block // 让按钮占据整个宽度
                loading={loading}
                >
                登录
                </Button>
              </Form.Item>
            </Form>

            {/* 测试账号提示 */}
            <div style={{color:'#999',fontSize:12,marginTop:16}}>
                <p>测试账号：</p>
                <p>管理员: yuchen / 1399</p>
                <p>普通用户: user / 1399</p>
            </div>          
        </Card>
    );
};

export default Login;