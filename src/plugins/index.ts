import auth from '@/directives/auth';
import move from '@/directives/move';
import { type App } from 'vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
// import mitt from 'mitt';

const directives: Record<string, any> = {
  auth,
  move,
};

export default {
  install(app: App) {
    // 全局注册指令
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key]);
    });

    /// 全局注册element-plus icon
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }

    // const Mit = mitt();
    // type Filter = {
    //   format<T>(val: T): string
    // };
    // declare module 'vue' {
    //   //vue不能使用时用@vue/runtime-core
    //   export interface ComponentCustomProperties {
    //     // $Bus: type Mit,
    //     // $Dev: string;
    //     // $Filters: Filter,
    //   }
    // }
    // app.config.globalProperties.$Bus = Mit;
    // app.config.globalProperties.$Dev = "123";
    // app.config.globalProperties.$Filters = {
    //   format<T>(val: T) {
    //     return `123${val}`;
    //   }
    // };
  },
};
