export {};

//声明window上自定义属性，如事件总线
// declare interface Window {
//   eventBus: any;
// }

type Lod = {
  show: () => void;
  hide: () => void;
};

declare module 'vue' {
  export interface ComponentCustomProperties {
    $Loading: Lod;
    $Bus;
  }
}

// //声明.vue文件
declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, any>;
  export default component;
}
