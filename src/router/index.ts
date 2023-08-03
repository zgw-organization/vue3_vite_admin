import useStore from '@/store';
import { getToken } from '@/utils/token';
import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 滚动行为
  scrollBehavior: (_to, _from, savePosition) => {
    if (savePosition) {
      return savePosition;
    } else {
      return { top: 0 };
    }
  },
});

const whileList = ['/login', '/register'];

// 前置守卫
router.beforeEach(async (to, _from, next) => {
  const { user } = useStore();
  if (getToken()) {
    if (to.path == '/login') {
      next({ path: '/home' });
    } else {
      if (user.router.length) {
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
