import { getProfile } from '@/api';
import { defineStore } from 'pinia';

type User = {
  username: string;
  password: string;
};

const userStore = defineStore('user', {
  state: () => ({
    menu: [],
    routes: [],
    permission: [],
    info: <User>{},
    tabs: [
      {
        title: '首页',
        path: '/home',
        name: 'Home',
      },
    ],
    currentTabsValue: '首页',
  }),
  getters: {},
  actions: {
    // 获取用户信息
    async getUserInfo() {
      const res = await getProfile();
      const { routes, menu, permission, ...other } = res.data;
      this.info = other;
      this.menu = menu;
      this.permission = permission;
      this.routes = routes;
      return routes;
    },
  },
  // 持久化
  persist: {
    key: 'user',
    storage: window.sessionStorage,
    paths: ['tabs', 'currentTabsValue'],
  },
});

export default userStore;
