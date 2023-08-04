import Axios from '@/utils/http';

// 登录
export const userLogin = (params: { username: string; password: string }) => {
  return Axios.post('/login', params);
};

// 获取用户信息
export const getUserInfo = () => {
  return Axios.get('/userinfo');
};
