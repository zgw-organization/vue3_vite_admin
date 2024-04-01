import Axios from '@/utils/http';

// 获取用户列表
export const getUserList = (params: any) => {
  return Axios.post('/user/list', params);
};
