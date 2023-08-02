import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from './router';
import plugins from './plugins';
// import Loading from './plugins/Loading';
// import { getStorage, setStorage } from "@/utils/token";

const app = createApp(App);

// 注册pinia并实现持久化
// type Options = { key?: string };
// const piniaPlugin = (options: Options) => {
//   return (context: PiniaPluginContext) => {
//     const {store} = context;
//     const id = `${options.key}-${store.$id}`;
//     const data = getStorage(id);
//     store.$subscribe(() => {
//       setStorage(id, toRaw(store.$state));
//     });
//     return {
//       ...data
//     }
//   };
// };
const store = createPinia();
// store.use(
//   piniaPlugin({
//     key: "Pinia",
//   })
// );

// 注册pinia
app.use(store);

// 注册路由
app.use(router);

// 注册element
app.use(ElementPlus);

// 注册自定义插件
// app.use(Loading);

// 注册公共插件
app.use(plugins);

app.mount('#app');
