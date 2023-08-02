import useStore from '@/stores';
import { getToken } from '@/utils/token';
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: () => import('@/views/Login/index.vue'),
  },
  // {
  //   path: "/",
  //   component: () => import("@/views/Layout/index.vue"),
  //   children: [
  //     {
  //       path: "/home",
  //       component: () => import("@/views/Home/index.vue"),
  //     },
  //     {
  //       path: "/user",
  //       component: () => import("@/views/User/index.vue"),
  //     },
  //     {
  //       path: "/role",
  //       component: () => import("@/views/Role/index.vue"),
  //     },
  //     {
  //       path: "/menu",
  //       component: () => import("@/views/Menu/index.vue"),
  //     },
  //     {
  //       path: "/permission",
  //       component: () => import("@/views/Permission/index.vue"),
  //     },
  //   ],
  // },
  {
    path: '/:catchAll(.*)',
    component: () => import('@/views/Error/index.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // 滚动行为
  scrollBehavior: (to, from, savePosition) => {
    if (savePosition) {
      return savePosition;
    } else {
      return { top: 0 };
    }
  },
  routes,
});

const whileList = ['/login', '/register'];

// 前置守卫
router.beforeEach(async (to, from, next) => {
  const { user } = useStore();
  if (getToken()) {
    if (to.path == '/login') {
      next({ path: '/home' });
    } else {
      if (user.router.length == 0) {
        const routers = await user.getUserInfo();
        const children = routers.map((item: any) => ({
          path: item.router,
          component: () => import(`@/views/${item.component}/index.vue`),
        }));
        router.addRoute({
          path: '/',
          component: () => import('@/views/Layout/index.vue'),
          children,
        });
        next({ ...to, replace: true });
      } else {
        next();
      }
    }
  } else {
    if (whileList.includes(to.path)) {
      next();
    } else {
      next({ path: '/login' });
    }
  }
});

export default router;
