import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/Error/index.vue'),
  },
];

export default routes;
