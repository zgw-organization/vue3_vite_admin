import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import router from './router';
import plugins from './plugins';
// import { mockRequest } from '@/mock';

const app = createApp(App);

const store = createPinia();

// store 持久化
store.use(piniaPluginPersistedstate);

// 引入mock
// if (import.meta.env.MODE === 'development') {
//   mockRequest();
// }

// 注册pinia
app.use(store);

// 注册路由
app.use(router);

// 注册公共插件
app.use(plugins);

app.mount('#app');
