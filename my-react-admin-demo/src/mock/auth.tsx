// 模拟登录API
import type { ApiResponse } from './ApiResponse'; // 导入API响应类型
interface User {
    username: string;
    password: string;
    role: string;
    name: string; // 姓名
    avator: string;
    permissions: string[]; // 权限列表
}
// 登录结果类型
interface LoginResult {
    code: number;
    data: {
        token: string;
        user: User;
    } | null; // 登录成功返回用户信息，失败返回null
    msg: string;
}

const users: Record<string, User> = {
    yuchen: {
        username: 'yuchen',
        password: '1399',
        role: 'yuchen',
        name: '管理员',
        avator: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        permissions: ['canManageUser', 'canManageRole', 'canViewChart'],
    },
    user: {
        username: 'user',
        password: '1399',
        role: 'user',
        name: '普通用户',
        avator: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        permissions: ['canViewChart'],
    },
};

// 当前登录的用户
let currentUser: User | null = null;

/**
 * Mock 登录接口
 */
export function mockLogin(username: string, password: string): Promise<LoginResult> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = users[username];

            if (user && user.password === password) {
                currentUser =  user;
                resolve({
                    code: 200,
                    data: {
                        token: `nock-token-${Date.now()}`,
                        user: {
                            username: user.username,
                            name: user.name,
                            password: user.password,
                            role: user.role,
                            avator:user.avator,
                            permissions: user.permissions,
                        },
                    },
                    msg: '登陆成功',
                });
            } else {
                reject({
                    code: 401,
                    data: null,
                    msg: '用户名或密码错误',
                });
            }
        }, 1000); // 模拟网络延迟
            });
        }

/**
 * Mock 获取当前用户信息
 */
export function mockGetCurrentUser(): Promise<ApiResponse<User>> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (currentUser) {
                resolve({
                    code: 200,
                    data: currentUser,
                    msg: '成功',
                });
            } else {
                reject({
                    code: 401,
                    data: null,
                    msg: '未登录',
                });
            }
        }, 500);
    });
}

/**
 * Mock 退出登录
 */
export function mockLogout(): Promise<ApiResponse<null>> {
    return new Promise((resolve) => {
        setTimeout(() => {
            currentUser = null;
            resolve({
                code: 200,
                data: null,
                msg: '退出成功',
            });
        }, 300);
    });
}