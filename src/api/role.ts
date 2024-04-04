import Axios from '@/utils/http';

// 获取角色列表
export const getRoleList = (params: any) => {
  return Axios.post('/role/list', params);
};

// 角色下拉菜单
export const getRoleSelect = () => {
  return Axios.get('/role/select');
};

// 删除角色
export const deleteRole = (params: { ids: number[] }) => {
  return Axios.post('/role/delete', params);
};

// 根据id获取角色信息
export const getRoleById = (id: number) => {
  return Axios.get('/role/getById', { params: { id } });
};

// 新增角色
export const addRole = (params: any) => {
  return Axios.post('/role/add', params);
};

// 编辑角色
export const editRole = (params: any) => {
  return Axios.post('/role/edit', params);
};
