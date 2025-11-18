// 登陆组件

import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import type { LoginParams, LoginFormProps } from "@/types";
import "./LoginForm.css";

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading = false}) => {
  const [formData, setFormData] = useState<LoginParams>({
    username: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false); // 是否显示密码

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

  return (
    <div className="login-container">
      <div className="login-card">
        {/* 卡片头部 */}
        <div className="login-header">
          <h1>welcome back!</h1>
          <p>Please enter your details.</p>
        </div>
        {/* 登陆表单 */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* 用户名输入框 */}
          <div className="input-group">
            <div className="input-icon">
              <FaEnvelope />
            </div>
            <input
              type="text"
              name="username"
              placeholder="请输入yuchen 或 user"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={ loading } // 禁用输入框，当loading为true时，输入框不可用
            />
          </div>
          {/* 密码输入框 */}
          <div className="input-group">
            <div className="input-icon">
              <FaLock />
            </div>
            <input
              type="password"
              name="password"
              placeholder="请输入1399"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={ loading } // 禁用输入框，当loading为true时，输入框不可用
            />
            <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            disabled={ loading } // 禁用按钮，当loading为true时，按钮不可用
            >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          
          {/* 选项行 */}
          <div className="form-options">
            <label className="remember-me">
                <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                disabled={ loading } // 禁用复选框，当loading为true时，复选框不可用
                />
                <span> Remember me</span>
            </label>
            <a href="/forgot-password" className="forgot-password">Forgot your password?</a>
          </div>
          {/* 提交按钮 */}
          <button
          type="submit"
          className="login-button"
          disabled={ loading } // 禁用按钮，当loading为true时，按钮不可用
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
        {/* 注册提示 */}
        <div className="register-tip">
          Don't have an account? <a href="/signup">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
