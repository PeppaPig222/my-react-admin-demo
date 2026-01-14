// 登陆组件

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import type { LoginParams, LoginFormProps } from "@/interface";
import "./LoginForm.css";

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading = false }) => {
  const [formData, setFormData] = useState<LoginParams>({
    username: "",
    password: "",
    remember: false,
  });
  // 添加注册表单数据
  const [signupData, setSignupData] = useState<LoginParams>({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // 是否显示密码
  // 用这个state控制登陆/注册切换，false=登陆，true=注册
  const [isSignup, setIsSignup] = useState(false);
  // 登陆表单处理函数
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // 表单提交处理函数
    e.preventDefault(); // 阻止表单默认提交行为
    onLogin(formData); // 调用登录回调函数
  };

  // 注册表单处理函数
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignupSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`注册成功! 用户名：${signUpData.name}`);
  };
  return (
    <div className="login-container">
      {/* 主容器： 添加动态class */}
      <div className={`main ${isSignup ? "is-txr" : ""}`}>
        {/* 左侧：登陆表单容器 */}
        <div className="container a-container">
          <form onSubmit={handleSubmit} className="login-form">
            <h1 className="form-title">登录账号</h1>
            {/* 用户名输入框 */}
            <input
              type="text" // 输入类型为文本
              name="username" //
              placeholder="请输入用户名或邮箱"
              className="form-input"
              value={formData.username} // 绑定用户名
              onChange={handleChange} // 绑定用户名输入事件
              required
              disabled={loading} // 禁用输入框，当loading为true时，输入框不可用
            />
            {/* 密码输入框 */}
            <div className="password-input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="请输入密码"
                className="form-input" // 绑定密码输入框
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading} // 禁用输入框，当loading为true时，输入框不可用
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading} // 禁用按钮，当loading为true时，按钮不可用
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <a href="/forgot-password" className="forgot-password">
              忘记密码？
            </a>
            {/* 登陆按钮 */}
            <button
              type="submit"
              className="form-button"
              disabled={loading} // 禁用按钮，当loading为true时，按钮不可用
            >
              {loading ? "Loading..." : "登陆"}
            </button>
          </form>
        </div>
        {/* 右侧：注册表单容器 */}
        <div className="container b-container">
          <form onSubmit={handleSignupSubmit} className="login-form">
            <h2 className="form-title">创建账号</h2>
            {/* 用户名输入框 */}
            <input
              type="text"
              name="name"
              placeholder="请输入用户名"
              className="form-input" // 绑定用户名输入框
              value={signupData.name}
              onChange={handleSignupChange}
              required
              disabled={loading} // 禁用输入框，当loading为true时，输入框不可用
            />
            {/* 邮箱输入框 */}
            <input
              type="email"
              name="email"
              placeholder="请输入邮箱"
              className="form-input" // 绑定邮箱输入框
              value={signupData.email}
              onChange={handleSignupChange}
              required
              disabled={loading} // 禁用输入框，当loading为true时，输入框不可用
            />
            {/* 密码输入框 */}
            <input
              type="password"
              name="password"
              placeholder="请输入密码"
              className="form-input" // 绑定密码输入框
              value={signupData.password}
              onChange={handleSignupChange}
              required
            />
            {/* 注册按钮 */}
            <button
              type="submit"
              className="form-button"
              disabled={loading} // 禁用按钮，当loading为true时，按钮不可用
            >
              注册
            </button>
          </form>
        </div>
        {/* 切换面板 - 覆盖层*/}
        <div className="switch" id="switch">
          <div className="switch-circle"></div>
          <div className="switch-circle1"></div>
          {/* 左侧内容：注册模式时显示 */}
          <div className="switch-container left">
            <h2 className="switch-title">欢迎回来！</h2>
            <p className="switch-description">请输入您的登录信息</p>
            <button
              type="button"
              className="switch-button"
              onClick={() => setIsSignup(false)} // 切换到登陆模式
            >
              登陆
            </button>
          </div>
          {/* 右侧内容：登陆模式时显示 */}
          <div className="switch-container right">
            <h2 className="switch-title">欢迎加入！</h2>
            <p className="switch-description">请输入您的注册信息</p>
            <button
              type="button"
              className="switch-button"
              onClick={() => setIsSignup(true)} // 切换到注册模式
            >
              注册
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
