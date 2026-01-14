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

// ========== 新增：用户管理类型 ==========
/**
 * 用户详细信息（用于列表和详情）
 */
export interface UserInfo {
    id: number;
    username: string;
    name: string;
    email?: string;
    phone?: string;
    role: 'admin' | 'user' | 'guest'; // 角色：管理员、用户、访客
    status: 'active' | 'inactive'; // 状态：活跃、不活跃
    avator?: string; // 头像
    permissions?: string[]; // 权限列表
    department?: string; // 部门
    createdAt: string; // 创建时间
    updatedAt: string; // 更新时间
}

// 用户表单参数（新增/编辑）
export interface UserFormParams {
    username: string;
    name: string;
    email?: string;
    phone?: string;
    role: 'admin' | 'user' | 'guest';
    status: 'active' | 'inactive';
    avator?: string;
    department?: string; // 部门
    password?: string; // 新增时必填，编辑时选填
}

// 用户查询参数
export interface UserQueryParams {
    username?: string;
    name?: string;
    role?: 'admin ' | 'user' | 'guset';
    status?: 'active' | 'inactive';
    current?: number; // 当前页码
    pageSize?: number; // 每页条数
}
// 分页响应数据
export interface PaginatedResponse<T> { // 泛型T用于表示列表数据类型 
    code: number;
    data: {
        list: T[]; // 列表数据
        total: number;
        current: number;
        pageSize: number;
    };
    msg: string;
}

