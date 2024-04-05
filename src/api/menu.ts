import Axios from '@/utils/http';

// 获取菜单列表
export const getMenuList = (params: any) => {
  return Axios.post('/menu/list', params);
};

// 获取树形数据
export const getMenuTree = () => {
  return Axios.get('/menu/tree');
};

// 删除
export const deleteMenu = (params: { ids: number[] }) => {
  return Axios.post('/menu/delete', params);
};

// 根据id获取菜单信息
export const getMenuById = (id: number) => {
  return Axios.get('/menu/getById', { params: { id } });
};

// 新增菜单
export const addMenu = (params: any) => {
  return Axios.post('/menu/add', params);
};

// 编辑菜单
export const editMenu = (params: any) => {
  return Axios.post('/menu/edit', params);
};
