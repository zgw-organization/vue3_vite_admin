import Axios from '@/utils/http';

// 获取菜单列表
export const getMenuList = () => {
  return Axios.get('/menu/list');
};
