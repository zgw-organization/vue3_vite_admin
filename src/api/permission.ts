import Axios from '@/utils/http';

// 获取权限列表
export const getPermissionList = (params: any) => {
  return Axios.post('/permission/list', params);
};

// 获取树形数据
export const getPermissionTree = () => {
  return Axios.get('/permission/tree');
};

// 删除
export const deletePermission = (params: { ids: number[] }) => {
  return Axios.post('/permission/delete', params);
};

// 根据id获取权限信息
export const getPermissionById = (id: number) => {
  return Axios.get('/permission/getById', { params: { id } });
};

// 新增权限
export const addPermission = (params: any) => {
  return Axios.post('/permission/add', params);
};

// 编辑权限
export const editPermission = (params: any) => {
  return Axios.post('/permission/edit', params);
};
