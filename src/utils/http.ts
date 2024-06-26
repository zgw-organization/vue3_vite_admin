import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getToken } from './token';

class Http {
  instance: AxiosInstance;
  baseConfig: AxiosRequestConfig = {
    baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1`,
    withCredentials: true,
    timeout: 5000,
  };
  constructor() {
    // 初始化示例
    this.instance = axios.create(Object.assign(this.baseConfig));
    // 添加请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = getToken();
        if (token) {
          config!.headers!['Authorization'] = token;
        }
        return config;
      },
      (err: any) => {
        return Promise.reject(err);
      },
    );
    // 添加响应拦截器
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        const data = res.data;
        // 未授权，请重新登录(401)
        if (data.code === 401) {
          window.location.href = '/login';
        }
        return data;
      },
      (err: any) => {
        return Promise.reject(err);
      },
    );
  }

  get(url: string, config?: AxiosRequestConfig): Promise<any> {
    return this.instance.get(url, config);
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    return this.instance.post(url, data, config);
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    return this.instance.post(url, data, config);
  }

  delete(url: string, config?: AxiosRequestConfig): Promise<any> {
    return this.instance.delete(url, config);
  }
}

const Axios = new Http();
export default Axios;
