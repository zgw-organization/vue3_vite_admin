import Axios from '@/utils/http';
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
  }),
  getters: {},
  actions: {
    // 获取用户信息
    async getUserInfo() {
      const res = await Axios.get('userinfo');
      const { userInfo, menu, permission, router } = res.data;
      this.info = userInfo;
      this.menu = menu;
      this.permission = permission;
      this.router = router;
      return router;
    },
  },
});

export default userStore;
