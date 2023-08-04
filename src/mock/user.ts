export default [
  // 登陆接口
  {
    url: '/api/user/login',
    type: 'post',
    response: () => {
      return {
        code: 0,
        message: '操作成功',
        data: {
          token: '1123456576',
        },
      };
    },
  },
  // 用户信息
  {
    url: '/api/user/info',
    type: 'get',
    response: () => {
      return {
        code: 0,
        message: '操作成功',
        data: {
          userInfo: {
            username: 'admin',
          },
          router: [
            {
              path: '/home',
              component: 'Home',
            },
            {
              path: '/user',
              component: 'User',
            },
            {
              path: '/role',
              component: 'Role',
            },
            {
              path: '/menu',
              component: 'Menu',
            },
            {
              path: '/permission',
              component: 'Permission',
            },
          ],
        },
      };
    },
  },
];
