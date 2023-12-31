import { getUserInfo } from '@/api';
import { defineStore } from 'pinia';

type User = {
  username: string;
  password: string;
};

const userStore = defineStore('user', {
  state: () => ({
    menu: [],
    router: [],
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
      const res = await getUserInfo();
      const { userInfo, menu, permission, router } = res.data;
      this.info = userInfo;
      this.menu = menu;
      this.permission = permission;
      this.router = router;
      return router;
    },
  },
  // 持久化
  persist: {
    key: 'user',
    storage: window.sessionStorage,
    paths: ['info', 'permission', 'menu', 'tabs', 'currentTabsValue'],
  },
});

export default userStore;
