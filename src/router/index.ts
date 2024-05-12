// import useStore from '@/store';
// import { getToken } from '@/utils/token';
import { createRouter, createWebHashHistory } from 'vue-router';
import routes from './routes';
import useStore from '@/store';
import { getToken } from '@/utils/token';

const router = createRouter({
  history: createWebHashHistory(),
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
      if (!user.routes.length) {
        const routes = await user.getUserInfo();
        const children = routes.map((item: any) => ({
          path: item.router,
          name: item.component, // 自定义路由缓存需要
          component: () => import(`@/views/${item.component}/index.vue`),
        }));
        router.addRoute({
          path: '/',
          name: 'Layout', // 自定义路由缓存需要
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
