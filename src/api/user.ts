import Axios from '@/utils/http';

// 获取用户列表
export const getUserList = (params: any) => {
  return Axios.post('/user/list', params);
};

// 根据id获取用户信息
export const getUserById = (id: string) => {
  return Axios.get('/user/getById', { params: { id } });
};

// 删除用户
export const deleteUser = (params: { ids: string[] }) => {
  return Axios.post('/user/delete', params);
};

// 新增用户
export const addUser = (params: any) => {
  return Axios.post('/user/add', params);
};

// 编辑用户
export const editUser = (params: any) => {
  return Axios.post('/user/edit', params);
};
