import Axios from '@/utils/http';

// 登录
export const login = (params: { username: string; password: string }) => {
  return Axios.post('/auth/login', params);
};

// 获取用户信息
export const getProfile = () => {
  return Axios.get('/auth/profile');
};
