import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: () => import('@/views/Login/index.vue'),
  },
  // {
  //   path: '/',
  //   component: () => import('@/views/Layout/index.vue'),
  //   redirect: '/home',
  //   children: [
  //     {
  //       path: '/home',
  //       component: () => import('@/views/Home/index.vue'),
  //       // beforeEnter: auth, //路由独享守卫
  //       // meta: {
  //       //   title: "管理页", // 页面标题
  //       //   auth: true, //需要登录权限
  //       // },
  //     },
  //     {
  //       path: '/user',
  //       component: () => import('@/views/User/index.vue'),
  //     },
  //     {
  //       path: '/role',
  //       component: () => import('@/views/Role/index.vue'),
  //     },
  //     {
  //       path: '/menu',
  //       component: () => import('@/views/Menu/index.vue'),
  //     },
  //     {
  //       path: '/permission',
  //       component: () => import('@/views/Permission/index.vue'),
  //     },
  //   ],
  // },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/Error/index.vue'),
  },
];

export default routes;
