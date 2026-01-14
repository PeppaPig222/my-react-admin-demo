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
} from '@/interface';

// 是否使用 Mock 数据
const USE_MOCK = true;

/**
 * 获取用户列表
 */
export function getUserList(params: UserQueryParams): 
Promise<PaginatedResponse<UserInfo>> {
  if (USE_MOCK) {
    return mockGetUserList(params);
  }
  return request({
    url: '/api/users',
    method: 'GET',
    params,
  })
}

// 新增用户
export function addUser(data: UserFormParams):
Promise<ApiResponse<UserInfo>> {
  if (USE_MOCK) {
    return mockAddUser(data);
  }
  return request({
    url: '/api/users',
    method: 'POST',
    data,
  })
}

// 更新用户
export function updateUser(id: number, data: Partial<UserFormParams>):
Promise<ApiResponse<UserInfo>> {
  if (USE_MOCK) {
    return mockUpdateUser(id, data);
  }
  return request({
    url: `/api/users/${id}`,
    method: 'PUT',
    data,
  })
}

// 删除用户
export function deleteUser(id: number):
Promise<ApiResponse> {
  if (USE_MOCK) {
    return mockDeleteUser(id);
  }
  return request({
    url: `/api/users/${id}`,
    method: 'DELETE',
  })
}

// 获取用户详情
export function getUserDetail(id: number):
Promise<ApiResponse<UserInfo>> {
  if (USE_MOCK) {
    return mockGetUserDetail(id);
  }
  return request({
    url: `/api/users/${id}`,
    method: 'GET',
  })
}