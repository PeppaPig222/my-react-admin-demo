import React, { useRef, useState } from 'react';
import { Button, message, Space, Tag, Avatar, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { getUserList, deleteUser } from '@/services/user';
import type { UserInfo } from '@/interface';
// import UserModal from './UserModal';

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
      valueType: 'select',
      valueEnum: {
        yuchen: { text: '超级管理员', status: 'Error' },
        admin: { text: '管理员', status: 'Error' },
        user: { text: '普通用户', status: 'Success' },
        guest: { text: '访客', status: 'Default' },
      },
      render: (_, record) => {
        const roleMap = {
          yuchen: { text: '超级管理员', color: 'pink' },
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
        active: { text: '启用', status: '1' },
        inactive: { text: '禁用', status: '0' },
      },
      render: (_, record) => (
        <Tag color={record.status === '0' ? 'green' : 'red'}>
          {record.status === '0' ? '启用' : '禁用'}
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
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确认删除" description="确定要删除这个用户吗？" onConfirm={() => handleDelete(record.id)} okText="确定" cancelText="取消">
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
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
  }


}


export default UserList;