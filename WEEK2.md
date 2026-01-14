# React Admin Demo 小白完全手册 - 第二周

> 用户管理系统：掌握 CRUD 核心操作  
> 学习 ProTable、Modal、Form 等实战技能

## 📋 目录

- [本周学习目标](#-本周学习目标)
- [环境检查](#-环境检查)
- [第一阶段：准备工作](#-第一阶段准备工作)
- [第二阶段：创建用户列表页面](#-第二阶段创建用户列表页面)
- [第三阶段：实现新增用户功能](#-第三阶段实现新增用户功能)
- [第四阶段：实现编辑用户功能](#-第四阶段实现编辑用户功能)
- [第五阶段：实现删除用户功能](#-第五阶段实现删除用户功能)
- [第六阶段：实现搜索和筛选](#️-第六阶段实现搜索和筛选)
- [第七阶段：运行和测试](#-第七阶段运行和测试)
- [核心概念详解](#-核心概念详解)
- [常见问题排查](#-常见问题排查)
- [下一步学习](#-下一步学习)
- [附录：完整代码清单](#-附录完整代码清单)

---

## 🎯 本周学习目标

本周我们将实现一个**完整的用户管理系统**，这是后台管理系统最核心的功能。

### 你将学会

✅ 使用 ProTable 展示数据列表  
✅ 实现增删改查（CRUD）完整流程  
✅ 使用 Modal 弹窗和 Form 表单  
✅ 掌握表单验证技巧  
✅ 实现搜索和筛选功能  
✅ 处理异步数据交互  
✅ TypeScript 在表单中的应用

### 功能预览

```
用户管理页面
├── 顶部搜索栏（用户名、角色筛选）
├── 工具栏（新增用户按钮）
├── 数据表格
│   ├── 列：头像、用户名、姓名、角色、邮箱、状态、操作
│   └── 操作：编辑、删除
├── 分页器
└── 新增/编辑弹窗
    └── 表单（用户名、姓名、邮箱、角色、状态）
```

---

## 🛠️ 环境检查

在开始之前，确保你已经完成第一周的学习：

```bash
# 1. 检查项目是否正常运行
npm run dev

# 2. 确认可以登录
# 访问 http://localhost:3000/login
# 使用账号：admin / ant.design

# 3. 确认依赖已安装
npm list @ant-design/pro-components
```

如果第一周的项目有问题，请先回顾第一周文档。

---

## 🚀 第一阶段：准备工作

### 步骤 1：创建类型定义

> **💡 为什么先定义类型？**  
> TypeScript 的最佳实践：先定义数据结构，再写业务逻辑。这样编辑器能提供智能提示。

修改 `src/types/index.ts`，添加用户管理相关类型：

```typescript
/**
 * 全局类型定义
 */

// ========== 已有的类型（第一周） ==========
export interface User {
  username: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
  permissions?: string[];
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  code: number;
  data: {
    token: string;
    user: User;
  };
  msg: string;
}

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}

export interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  label: string;
  access?: string;
}

// ========== 新增：用户管理类型（第二周） ==========

/**
 * 用户详细信息（用于列表和详情）
 */
export interface UserInfo {
  id: number;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive';
  avatar?: string;
  phone?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 用户表单参数（新增/编辑）
 */
export interface UserFormParams {
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive';
  phone?: string;
  department?: string;
  password?: string; // 新增时必填，编辑时选填
}

/**
 * 用户查询参数
 */
export interface UserQueryParams {
  username?: string;
  name?: string;
  role?: 'admin' | 'user' | 'guest';
  status?: 'active' | 'inactive';
  current?: number;  // 当前页码
  pageSize?: number; // 每页条数
}

/**
 * 分页响应数据
 */
export interface PaginatedResponse<T> {
  code: number;
  data: {
    list: T[];
    total: number;
    current: number;
    pageSize: number;
  };
  msg: string;
}
```

**类型说明**：

| 类型 | 用途 | 说明 |
|------|------|------|
| `UserInfo` | 用户完整信息 | 包含 id、时间戳等字段 |
| `UserFormParams` | 表单提交参数 | 用于新增/编辑用户 |
| `UserQueryParams` | 查询参数 | 用于搜索和筛选 |
| `PaginatedResponse<T>` | 分页响应 | 通用分页数据结构 |

---

### 步骤 2：创建 Mock 数据

创建 `src/mock/user.ts`：

```bash
cd src/mock
touch user.ts
```

输入以下内容：

```typescript
import type { UserInfo, UserFormParams, UserQueryParams, PaginatedResponse, ApiResponse } from '@/types';

/**
 * Mock 用户管理数据
 */

// 模拟用户数据库
let users: UserInfo[] = [
  {
    id: 1,
    username: 'admin',
    name: '超级管理员',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    avatar: 'file:///Users/gaoyuchen/Desktop/666.jpg',
    phone: '13800138000',
    department: '技术部',
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00',
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
    createdAt: '2024-01-02 10:00:00',
    updatedAt: '2024-01-02 10:00:00',
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
    createdAt: '2024-01-03 10:00:00',
    updatedAt: '2024-01-03 10:00:00',
  },
];

// 自增 ID
let nextId = 4;

/**
 * Mock 获取用户列表（分页、搜索、筛选）
 */
export function mockGetUserList(params: UserQueryParams): Promise<PaginatedResponse<UserInfo>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { username, name, role, status, current = 1, pageSize = 10 } = params;

      // 筛选逻辑
      let filteredUsers = [...users];

      if (username) {
        filteredUsers = filteredUsers.filter(u => u.username.includes(username));
      }

      if (name) {
        filteredUsers = filteredUsers.filter(u => u.name.includes(name));
      }

      if (role) {
        filteredUsers = filteredUsers.filter(u => u.role === role);
      }

      if (status) {
        filteredUsers = filteredUsers.filter(u => u.status === status);
      }

      // 分页逻辑
      const total = filteredUsers.length;
      const start = (current - 1) * pageSize;
      const end = start + pageSize;
      const list = filteredUsers.slice(start, end);

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

/**
 * Mock 新增用户
 */
export function mockAddUser(params: UserFormParams): Promise<ApiResponse<UserInfo>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 检查用户名是否已存在
      const existingUser = users.find(u => u.username === params.username);
      if (existingUser) {
        reject({
          code: 400,
          data: null,
          msg: '用户名已存在',
        });
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

/**
 * Mock 更新用户
 */
export function mockUpdateUser(id: number, params: Partial<UserFormParams>): Promise<ApiResponse<UserInfo>> {
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

      resolve({
        code: 200,
        data: users[index],
        msg: '更新成功',
      });
    }, 800);
  });
}

/**
 * Mock 删除用户
 */
export function mockDeleteUser(id: number): Promise<ApiResponse> {
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
```

---

### 步骤 3：创建 API 服务

创建 `src/services/user.ts`：

```typescript
import request from '@/utils/request';
import {
  mockGetUserList,
  mockAddUser,
  mockUpdateUser,
  mockDeleteUser,
  mockGetUserDetail,
} from '@/mock/user';
import type {
  UserInfo,
  UserFormParams,
  UserQueryParams,
  PaginatedResponse,
  ApiResponse,
} from '@/types';

// 是否使用 Mock 数据
const USE_MOCK = true;

/**
 * 获取用户列表
 */
export function getUserList(params: UserQueryParams): Promise<PaginatedResponse<UserInfo>> {
  if (USE_MOCK) {
    return mockGetUserList(params);
  }
  return request({
    url: '/api/users',
    method: 'GET',
    params,
  });
}

/**
 * 新增用户
 */
export function addUser(data: UserFormParams): Promise<ApiResponse<UserInfo>> {
  if (USE_MOCK) {
    return mockAddUser(data);
  }
  return request({
    url: '/api/users',
    method: 'POST',
    data,
  });
}

/**
 * 更新用户
 */
export function updateUser(id: number, data: Partial<UserFormParams>): Promise<ApiResponse<UserInfo>> {
  if (USE_MOCK) {
    return mockUpdateUser(id, data);
  }
  return request({
    url: `/api/users/${id}`,
    method: 'PUT',
    data,
  });
}

/**
 * 删除用户
 */
export function deleteUser(id: number): Promise<ApiResponse> {
  if (USE_MOCK) {
    return mockDeleteUser(id);
  }
  return request({
    url: `/api/users/${id}`,
    method: 'DELETE',
  });
}

/**
 * 获取用户详情
 */
export function getUserDetail(id: number): Promise<ApiResponse<UserInfo>> {
  if (USE_MOCK) {
    return mockGetUserDetail(id);
  }
  return request({
    url: `/api/users/${id}`,
    method: 'GET',
  });
}
```

---

## 📋 第二阶段：创建用户列表页面

### 步骤 1：创建用户列表组件

创建 `src/pages/UserList/index.tsx`：

```bash
mkdir src/pages/UserList
touch src/pages/UserList/index.tsx
```

输入以下内容：

```typescript
import React, { useRef, useState } from 'react';
import { Button, message, Space, Tag, Avatar, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { getUserList, deleteUser } from '@/services/user';
import type { UserInfo } from '@/types';
import UserModal from './UserModal';

/**
 * 用户管理页面
 */
const UserList: React.FC = () => {
  // ProTable 的引用，用于刷新表格
  const actionRef = useRef<ActionType>();
  
  // 控制新增/编辑弹窗
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserInfo | undefined>();

  // ========== 表格列配置 ==========
  const columns: ProColumns<UserInfo>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
      search: false, // 不在搜索栏显示
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      width: 80,
      search: false,
      render: (_, record) => (
        <Avatar src={record.avatar} icon={<UserOutlined />} />
      ),
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 120,
      // 搜索配置
      fieldProps: {
        placeholder: '请输入用户名',
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
      fieldProps: {
        placeholder: '请输入姓名',
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 200,
      search: false,
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 100,
      // 下拉选择筛选
      valueType: 'select',
      valueEnum: {
        admin: { text: '管理员', status: 'Error' },
        user: { text: '普通用户', status: 'Success' },
        guest: { text: '访客', status: 'Default' },
      },
      render: (_, record) => {
        const roleMap = {
          admin: { text: '管理员', color: 'red' },
          user: { text: '普通用户', color: 'blue' },
          guest: { text: '访客', color: 'default' },
        };
        const role = roleMap[record.role];
        return <Tag color={role.color}>{role.text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        active: { text: '启用', status: 'Success' },
        inactive: { text: '禁用', status: 'Error' },
      },
      render: (_, record) => (
        <Tag color={record.status === 'active' ? 'green' : 'red'}>
          {record.status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '部门',
      dataIndex: 'department',
      width: 120,
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 180,
      search: false,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      search: false,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这个用户吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ========== 事件处理 ==========

  // 新增用户
  const handleAdd = () => {
    setCurrentUser(undefined);
    setModalVisible(true);
  };

  // 编辑用户
  const handleEdit = (record: UserInfo) => {
    setCurrentUser(record);
    setModalVisible(true);
  };

  // 删除用户
  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      message.success('删除成功');
      // 刷新表格
      actionRef.current?.reload();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 弹窗提交成功回调
  const handleModalSuccess = () => {
    setModalVisible(false);
    // 刷新表格
    actionRef.current?.reload();
  };

  return (
    <div>
      <ProTable<UserInfo>
        columns={columns}
        actionRef={actionRef}
        // 请求数据的方法
        request={async (params) => {
          const response = await getUserList({
            username: params.username,
            name: params.name,
            role: params.role as any,
            status: params.status as any,
            current: params.current,
            pageSize: params.pageSize,
          });
          
          return {
            data: response.data.list,
            total: response.data.total,
            success: true,
          };
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        dateFormatter="string"
        headerTitle="用户列表"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={handleAdd}
          >
            新增用户
          </Button>,
        ]}
      />

      {/* 新增/编辑弹窗 */}
      <UserModal
        visible={modalVisible}
        currentUser={currentUser}
        onCancel={() => setModalVisible(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default UserList;
```

**代码解释**：

1. **`ProTable`**  
   Ant Design Pro 的高级表格组件，内置搜索、分页、刷新等功能

2. **`actionRef`**  
   表格引用，用于手动刷新：`actionRef.current?.reload()`

3. **`request`**  
   异步请求数据的方法，返回 `{ data, total, success }`

4. **`valueEnum`**  
   枚举类型，自动生成下拉选择筛选

5. **`Popconfirm`**  
   删除前的二次确认

---

## 📝 第三阶段：实现新增用户功能

### 步骤 1：创建用户表单弹窗组件

创建 `src/pages/UserList/UserModal.tsx`：

```typescript
import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { addUser, updateUser } from '@/services/user';
import type { UserInfo, UserFormParams } from '@/types';

interface UserModalProps {
  visible: boolean;
  currentUser?: UserInfo;
  onCancel: () => void;
  onSuccess: () => void;
}

/**
 * 用户新增/编辑弹窗
 */
const UserModal: React.FC<UserModalProps> = ({
  visible,
  currentUser,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm<UserFormParams>();
  const isEdit = !!currentUser;

  // ========== 初始化表单数据 ==========
  useEffect(() => {
    if (visible) {
      if (currentUser) {
        // 编辑：回显数据
        form.setFieldsValue({
          username: currentUser.username,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
          status: currentUser.status,
          phone: currentUser.phone,
          department: currentUser.department,
        });
      } else {
        // 新增：重置表单
        form.resetFields();
      }
    }
  }, [visible, currentUser, form]);

  // ========== 提交表单 ==========
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (isEdit) {
        // 编辑
        await updateUser(currentUser.id, values);
        message.success('编辑成功');
      } else {
        // 新增
        await addUser(values);
        message.success('新增成功');
      }
      
      onSuccess();
    } catch (error: any) {
      if (error.errorFields) {
        // 表单验证错误
        message.error('请检查表单填写');
      } else {
        message.error(error.msg || '操作失败');
      }
    }
  };

  return (
    <Modal
      title={isEdit ? '编辑用户' : '新增用户'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        autoComplete="off"
      >
        {/* 用户名 */}
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            { required: true, message: '请输入用户名' },
            { min: 3, max: 20, message: '用户名长度为 3-20 个字符' },
            { pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母、数字、下划线' },
          ]}
        >
          <Input placeholder="请输入用户名" disabled={isEdit} />
        </Form.Item>

        {/* 姓名 */}
        <Form.Item
          label="姓名"
          name="name"
          rules={[
            { required: true, message: '请输入姓名' },
            { max: 50, message: '姓名不超过 50 个字符' },
          ]}
        >
          <Input placeholder="请输入姓名" />
        </Form.Item>

        {/* 邮箱 */}
        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '邮箱格式不正确' },
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>

        {/* 密码（新增时必填） */}
        {!isEdit && (
          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, max: 20, message: '密码长度为 6-20 个字符' },
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        )}

        {/* 角色 */}
        <Form.Item
          label="角色"
          name="role"
          rules={[{ required: true, message: '请选择角色' }]}
        >
          <Select placeholder="请选择角色">
            <Select.Option value="admin">管理员</Select.Option>
            <Select.Option value="user">普通用户</Select.Option>
            <Select.Option value="guest">访客</Select.Option>
          </Select>
        </Form.Item>

        {/* 状态 */}
        <Form.Item
          label="状态"
          name="status"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select placeholder="请选择状态">
            <Select.Option value="active">启用</Select.Option>
            <Select.Option value="inactive">禁用</Select.Option>
          </Select>
        </Form.Item>

        {/* 手机号（选填） */}
        <Form.Item
          label="手机号"
          name="phone"
          rules={[
            { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
          ]}
        >
          <Input placeholder="请输入手机号" />
        </Form.Item>

        {/* 部门（选填） */}
        <Form.Item
          label="部门"
          name="department"
        >
          <Input placeholder="请输入部门" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
```

**代码解释**：

1. **`Form.useForm()`**  
   创建表单实例，用于手动控制表单

2. **`form.setFieldsValue()`**  
   回显数据到表单

3. **`form.validateFields()`**  
   验证并获取表单数据

4. **`rules`**  
   表单验证规则，支持必填、长度、正则等

5. **`destroyOnClose`**  
   关闭弹窗时销毁内容，防止数据残留

---

## 🔄 第四阶段：实现编辑用户功能

编辑功能已在上一步的 `UserModal` 组件中实现，关键点：

### 区分新增和编辑

```typescript
const isEdit = !!currentUser;

// 编辑时禁用用户名
<Input disabled={isEdit} />

// 新增时显示密码字段
{!isEdit && (
  <Form.Item name="password">
    <Input.Password />
  </Form.Item>
)}
```

### 数据回显

```typescript
useEffect(() => {
  if (visible && currentUser) {
    form.setFieldsValue({
      username: currentUser.username,
      name: currentUser.name,
      // ... 其他字段
    });
  }
}, [visible, currentUser]);
```

---

## 🗑️ 第五阶段：实现删除用户功能

删除功能已在列表页面实现，使用 `Popconfirm` 二次确认：

```typescript
<Popconfirm
  title="确认删除"
  description="确定要删除这个用户吗？"
  onConfirm={() => handleDelete(record.id)}
  okText="确定"
  cancelText="取消"
>
  <Button type="link" danger>删除</Button>
</Popconfirm>

const handleDelete = async (id: number) => {
  try {
    await deleteUser(id);
    message.success('删除成功');
    actionRef.current?.reload(); // 刷新表格
  } catch (error) {
    message.error('删除失败');
  }
};
```

---

## 🔍️ 第六阶段：实现搜索和筛选

ProTable 内置搜索功能，只需配置列：

### 文本搜索

```typescript
{
  title: '用户名',
  dataIndex: 'username',
  fieldProps: {
    placeholder: '请输入用户名',
  },
}
```

### 下拉筛选

```typescript
{
  title: '角色',
  dataIndex: 'role',
  valueType: 'select',
  valueEnum: {
    admin: { text: '管理员' },
    user: { text: '普通用户' },
    guest: { text: '访客' },
  },
}
```

### 隐藏搜索

```typescript
{
  title: '邮箱',
  dataIndex: 'email',
  search: false, // 不在搜索栏显示
}
```

---

## 🎯 第七阶段：运行和测试

### 步骤 1：添加路由

修改 `src/router/routes.tsx`，添加用户管理路由：

```typescript
import React, { lazy, Suspense } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { Spin } from 'antd';
import BasicLayout from '@/components/Layout/BasicLayout';
import UserLayout from '@/components/Layout/UserLayout';
import AuthRoute from './AuthRoute';

const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const UserList = lazy(() => import('@/pages/UserList')); // 新增

const PageLoading: React.FC = () => (
  <div style={{ textAlign: 'center', paddingTop: '200px' }}>
    <Spin size="large" tip="加载中..." />
  </div>
);

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: (
      <UserLayout>
        <Suspense fallback={<PageLoading />}>
          <Login />
        </Suspense>
      </UserLayout>
    ),
  },
  {
    path: '/',
    element: <BasicLayout />,
    children: [
      {
        path: 'dashboard',
        element: (
          <AuthRoute>
            <Suspense fallback={<PageLoading />}>
              <Dashboard />
            </Suspense>
          </AuthRoute>
        ),
      },
      // 新增：用户管理路由
      {
        path: 'user',
        element: (
          <AuthRoute access="canManageUser">
            <Suspense fallback={<PageLoading />}>
              <UserList />
            </Suspense>
          </AuthRoute>
        ),
      },
    ],
  },
];

export default routes;
```

### 步骤 2：启动项目测试

```bash
npm run dev
```

### 测试清单

- [ ] 使用 admin 账号登录
- [ ] 点击左侧菜单"用户管理"
- [ ] 查看用户列表是否正常显示
- [ ] 测试搜索功能（用户名、角色筛选）
- [ ] 点击"新增用户"，填写表单提交
- [ ] 验证表单验证规则是否生效
- [ ] 编辑用户，确认数据回显
- [ ] 删除用户，确认二次确认弹窗
- [ ] 测试分页功能
- [ ] 使用 user 账号登录，确认无权限访问

---

## 📚 核心概念详解

### 1. ProTable 核心特性

```typescript
<ProTable
  columns={columns}        // 列配置
  actionRef={actionRef}    // 表格引用
  request={getData}        // 数据请求方法
  rowKey="id"             // 行唯一标识
  search={{               // 搜索配置
    labelWidth: 'auto',
  }}
  pagination={{           // 分页配置
    defaultPageSize: 10,
  }}
  toolBarRender={() => [  // 工具栏按钮
    <Button>新增</Button>
  ]}
/>
```

### 2. Form 表单验证规则

| 规则 | 说明 | 示例 |
|------|------|------|
| `required` | 必填 | `{ required: true, message: '请输入' }` |
| `type` | 类型验证 | `{ type: 'email' }` |
| `min/max` | 长度限制 | `{ min: 3, max: 20 }` |
| `pattern` | 正则验证 | `{ pattern: /^1[3-9]\d{9}$/ }` |
| `validator` | 自定义验证 | `{ validator: (_, value) => {...} }` |

### 3. TypeScript 在表单中的应用

```typescript
// 定义表单类型
interface UserFormParams {
  username: string;
  email: string;
}

// 使用泛型
const [form] = Form.useForm<UserFormParams>();

// 类型安全的表单值
const values = await form.validateFields();
// values 的类型为 UserFormParams
```

### 4. CRUD 完整流程

```
┌─────────────────────────────────────────┐
│          用户点击"新增用户"              │
└─────────────────┬───────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│   打开 Modal，显示空表单                │
└─────────────────┬───────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│   用户填写表单，点击"确定"              │
└─────────────────┬───────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│   表单验证（前端）                      │
└─────────────────┬───────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│   调用 API（addUser）                   │
└─────────────────┬───────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│   后端验证并保存（Mock 模拟）          │
└─────────────────┬───────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│   返回成功，关闭 Modal                  │
└─────────────────┬───────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│   刷新列表（actionRef.current.reload） │
└─────────────────────────────────────────┘
```

---

## 🐛 常见问题排查

### 问题 1：ProTable 不显示数据

**可能原因**：
- `request` 返回的数据格式不对
- `rowKey` 未设置

**解决方法**：
```typescript
// 正确的返回格式
request={async (params) => {
  const res = await getUserList(params);
  return {
    data: res.data.list,    // 必须是 data
    total: res.data.total,  // 必须是 total
    success: true,          // 必须是 success
  };
}}
rowKey="id"  // 必须设置
```

### 问题 2：表单验证不生效

**可能原因**：
- `Form.Item` 没有设置 `name`
- 使用了 `validateFields` 但没有 `await`

**解决方法**：
```typescript
// 错误
<Form.Item label="用户名">
  <Input />
</Form.Item>

// 正确
<Form.Item label="用户名" name="username" rules={[...]}>
  <Input />
</Form.Item>

// 错误
const values = form.validateFields(); // ❌

// 正确
const values = await form.validateFields(); // ✅
```

### 问题 3：编辑时数据不回显

**可能原因**：
- `useEffect` 依赖项不正确
- 表单字段名与数据字段名不一致

**解决方法**：
```typescript
useEffect(() => {
  if (visible && currentUser) {
    form.setFieldsValue({
      username: currentUser.username, // 字段名必须对应
      // ...
    });
  }
}, [visible, currentUser, form]); // 依赖项要完整
```

### 问题 4：删除后列表不刷新

**解决方法**：
```typescript
const handleDelete = async (id: number) => {
  await deleteUser(id);
  message.success('删除成功');
  actionRef.current?.reload(); // 别忘了刷新
};
```

---

## 🎓 下一步学习

恭喜你完成第二周的学习！现在你已经掌握了：

✅ ProTable 高级表格的使用  
✅ 完整的 CRUD 操作流程  
✅ Form 表单和验证  
✅ Modal 弹窗交互  
✅ TypeScript 在实战中的应用

### 第三周学习计划：角色权限系统

1. **角色管理**：创建角色列表页面
2. **权限配置**：为角色分配权限（树形选择）
3. **动态菜单**：根据权限动态生成菜单
4. **按钮权限**：根据权限控制按钮显示
5. **数据权限**：不同角色看到不同数据

### 提升练习

1. **批量操作**：实现批量删除用户
2. **导入导出**：Excel 导入导出用户
3. **头像上传**：集成图片上传功能
4. **高级搜索**：日期范围筛选
5. **操作日志**：记录用户操作历史

---

## 📦 附录：完整代码清单

### 本周创建的文件

```
src/
├── types/
│   └── index.ts                    # 更新：添加用户管理类型
├── pages/
│   └── UserList/
│       ├── index.tsx              # 新增：用户列表页面
│       └── UserModal.tsx          # 新增：用户表单弹窗
├── services/
│   └── user.ts                    # 新增：用户 API
├── mock/
│   └── user.ts                    # 新增：用户 Mock 数据
└── router/
    └── routes.tsx                 # 更新：添加用户管理路由
```

### 依赖检查

确保以下依赖已安装：
```json
{
  "@ant-design/pro-components": "^2.6.43",
  "@ant-design/icons": "^5.2.6",
  "antd": "^5.12.0"
}
```

---

## 💡 学习检查清单

- [ ] 理解 ProTable 的工作原理
- [ ] 掌握 Form 表单的使用和验证
- [ ] 理解 Modal 弹窗的状态管理
- [ ] 掌握 CRUD 完整流程
- [ ] 理解分页和搜索的实现
- [ ] 掌握 TypeScript 类型定义
- [ ] 能够独立实现一个列表页面
- [ ] 能够独立实现表单的增删改查

---

**第二周学习完成！🎉**

下一周我们将学习更高级的权限系统，让你的后台管理系统更加完善！

有任何问题，欢迎提 Issue 或查阅官方文档：
- ProTable: https://procomponents.ant.design/components/table
- Form: https://ant.design/components/form-cn
- Modal: https://ant.design/components/modal-cn

