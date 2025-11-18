/**
 * 全局类型定义
 */

// 用户信息类型
export interface User {
    username:string;
    name:string;
    role:'admin' | 'user';
    avator?:string; //？：该属性可有可无（可选属性）
    permissions?:string[]; // 权限列表
}

// 登录参数类型
export interface LoginParams {
    username:string;
    password:string;
}

// 登录表单组件props类型
export interface LoginFormProps {
    onLogin: (params:LoginParams) => Promise<void>; // 登录回调函数
    loading?:boolean; // 加载状态
}
// 登录响应类型
export interface LoginResult {
    code: number;
    data: {
        token:string;
        user:User;
    };
    msg:string;
}

//API 响应类型
export interface ApiResponse<T = any> {
    code: number;
    data: T;
    msg: string;
}

// 菜单项类型
export interface MenuItem {
    key: string;//菜单项的唯一标识
    icon?:React.ReactNode; //icon 属性是可选的，类型为 React.ReactNode
    label: string;//菜单项的标签
    access?:string; //访问权限
}

// 用户信息类型
export interface UserInfo {
    username:string;
    name:string;
    role:'admin' | 'user';
    avator?:string;
    permissions?:string[];
}