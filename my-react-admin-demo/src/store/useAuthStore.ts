import { create } from "zustand"; // 引入Zustand 创建 store 函数
//“把 store 里的状态自动同步到本地存储（localStorage / sessionStorage / IndexedDB…），页面刷新后自动恢复，不写一行额外逻辑。”
import { persist } from "zustand/middleware"; // 引入持久化中间件
import { login as loginApi, logout as logoutApi, getCurrentUser} from '@/services/auth'; 
import type { LoginParams, User } from '@/interface';// 引入登录、登出、获取当前用户API

/**
 * 用户登陆状态的管理中心
 * 记住登陆状态，管理用户信息，提供登陆，登出，获取用户信息，权限检查等功能
 */
//定义状态接口
interface AuthState {
    currentUser: User | null;
    token: string | null;
    loginLoading: boolean;
    userLoading: boolean;
    login: (credentials: LoginParams) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    fetchUserInfo: () => Promise<User | null>;
    checkPermission: (permission: string) => boolean;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // ========== 状态定义 ==========
            currentUser: null, // 当前登录用户信息（姓名、权限）
            token: null, // 登录 token（类似门禁卡）
            loginLoading: false, // 登录按钮是否在加载中（防止重复点击）
            userLoading: false, // 用户信息是否在加载中
            //========== 登录方法 ==========
            login:async(credentials: LoginParams) => {
                set({loginLoading:true});
                try {
                    // 调用登录API
                    const { data } = await loginApi(credentials); 
                    // 更新状态
                    set({
                        token: data.token,
                        currentUser: data.user, // 用户信息
                        loginLoading: false, // 加载状态结束
                    });
                    return {success:true};
                } catch (error) {
                    set({loginLoading:false}); 
                    return {success:false, error:error.message || '登录失败'};
                }
            },
            //========== 登出方法 ==========
            logout: async () => {
                await logoutApi().catch(() => {}); // 调用登出API，即使失败也继续执行后续代码
                useAuthStore.persist.clearStorage(); // 清除持久化数据
                set({token:null, currentUser:null, loginLoading:false, userLoading:false}); // 重置状态
            },
            //========== 获取用户信息 ==========
            fetchUserInfo: async () => {
                set({userLoading:true});
                try {
                    const { data } = await getCurrentUser();
                    set({currentUser: data, userLoading: false});
                    return data;
                } catch (error) {
                    set({userLoading:false});
                    return null;
                }
            },
            //========== 权限检查 ==========
            checkPermission: (permission: string) => {
                const user = get().currentUser;
                if (!user) return false;
                return user.role === 'yuchen' || (user.permissions?.includes(permission) ?? false);
            },
        }),
        {
            name: 'auth-storage', //在localStorage中存储的键名
            partialize: (state) => ({
                token: state.token, // 只持久化 token 和 currentUser
                currentUser: state.currentUser,
            })
        }
    )
);
// 自动恢复机制，刷新后自动补充用户信息

const {token,fetchUserInfo} = useAuthStore.getState();
if (token && !useAuthStore.getState().currentUser) {
    fetchUserInfo().catch(() => {}); //有token没用户信息，自动获取用户信息
}

export default useAuthStore;