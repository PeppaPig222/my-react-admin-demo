import type {
  UserInfo,
  UserFormParmas,
  UserQueryParams,
  PaginatedResponse,
  ApiResponse
} from '@/types';

/**
 * Mock 用户管理数据
 */
let users: UserInfo[] = [
  {
    id: 1,
    username: 'yuchen',
    name: '超级管理员',
    email: 'yuchen@example.com',
    role: 'admin',
    status: 'active',
    avatar: 'file:///Users/gaoyuchen/Desktop/666.jpg',
    phone: '13419507880',
    department: '技术部',
    createdAt: '2026-01-01 10:00:00',
    updatedAt: '2026-01-01 10:00:00',
  },
  {
    id: 2,
    username: 'zhangsan',
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'user',
    status: 'active',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    phone: '13800138001',
    department: '产品部',
    createdAt: '2026-01-02 10:00:00',
    updatedAt: '2026-01-02 10:00:00',
  },
  {
    id: 3,
    username: 'lisi',
    name: '李四',
    email: 'lisi@example.com',
    role: 'user',
    status: 'inactive',
    phone: '13800138002',
    department: '运营部',
    createdAt: '2026-01-03 10:00:00',
    updatedAt: '2026-01-03 10:00:00',
  },
];

let nextId = 4;

// mock 获取用户列表
export function mockGetUserList(params:
  UserQueryParams):
  Promise<PaginatedResponse<UserInfo>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { username, name, role, status, current 
          = 1,pageSize = 10 } = params;
        // 筛选逻辑
        let filteredUsers = [...users];
        if (username) {
          filteredUsers = filteredUsers.filter(u => u.
            username.includes(username));
        }
        if (name) {
          filteredUsers = filteredUsers.filter(u => u.
            name.includes(name));
        }
        if (role) {
          filteredUsers = filteredUsers.filter(u => u.
            role === role);
        }
        if (status) {
          filteredUsers = filteredUsers.filter(u => u.
            status === status);
        }
        // 分页逻辑
        const total = filteredUsers.length;
        const start = (current - 1) * pageSize;// 计算起始索引
        const end = start + pageSize;// 计算结束索引
        const list = filteredUsers.slice(start, end); // 截取指定范围的列表数据
        resolve({
          code: 200,
          data: {
            list,
            total,
            current,
            pageSize,
          },
          msg: '成功',
        });
      }, 500);
    });
  }

  // mock 新增用户
  export function mockAddUser(params: UserFormParmas):
  Promise<ApiResponse<UserInfo>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = users.find(u => u.username
        === params.username);
        if (existingUser) {
          reject({
            code: 400,
            data: null,
            msg: '用户名已存在',
          })
          return;
        }
        // 创建新用户
        const newUser: UserInfo = {
          id: nextId++,
          username: params.username,
          name: params.name,
          email: params.email,
          role: params.role,
          status: params.status,
          phone: params.phone,
          department: params.department,
          createdAt: new Date().toLocaleString('zh-CN'),
          updatedAt: new Date().toLocaleString('zh-CN'),
        };
        users.push(newUser);

        resolve({
          code: 200,
          data: newUser,
          msg: '新增成功',
        });
      }, 800);
    });
  }

   // mock 更新用户
  export function mockUpdateUser(id: number, params: Partial<UserFormParmas>):
  Promise<ApiResponse<UserInfo>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = users.findIndex(u => u.id === id);
        if (index === -1) { 
          reject({
            code: 404,
            data: null,
            msg: '用户不存在',
          });
          return;
        }
        // 更新用户
        users[index] = {
          ...users[index],
          ...params,
          updatedAt: new Date().toLocaleString('zh-CN'),
        };
        resolve ({
          code: 200,
          data: users[index],
          msg: '更新成功',
        });
      }, 800);
    });
  }

   // mock 删除用户
  export function mockDeleteUser(id: number):
  Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = users.findIndex(u => u.id === id);
      
        if (index === -1) {
          reject({
            code: 404,
            data: null,
            msg: '用户不存在',
          });
          return;
        }
      // 删除用户
        users.splice(index, 1);
       resolve({
        code: 200,
        data: null,
        msg: '删除成功',
      });
      }, 500);
    });
  }

  /**
 * Mock 获取用户详情
 */
export function mockGetUserDetail(id: number): Promise<ApiResponse<UserInfo>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(u => u.id === id);
      
      if (!user) {
        reject({
          code: 404,
          data: null,
          msg: '用户不存在',
        });
        return;
      }

      resolve({
        code: 200,
        data: user,
        msg: '成功',
      });
    }, 300);
  });
}


        
   