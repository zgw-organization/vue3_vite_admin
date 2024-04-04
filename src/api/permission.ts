import Axios from '@/utils/http';

// 获取权限列表
export const getPermissionList = () => {
  return Axios.get('/permission/list');
};
