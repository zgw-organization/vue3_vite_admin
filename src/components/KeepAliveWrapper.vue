<template>
  <!-- 
    当 router-view v-slot="{ Component, route }" 通过这种形式使用，
    且有通过 v-if 控制 component 的显示隐藏时，
    必须设置 key，即使最终返回的是 undefined 
  -->
  <router-view v-slot="{ Component, route }">
    <keep-alive v-if="enableKeepAlive" :include="include" :max="keepAliveMax">
      <component :is="Component" v-if="showRouterView" :key="buildCompKey(route, Component)"></component>
    </keep-alive>
    <component :is="Component" v-else-if="showRouterView" :key="buildCompKey(route, Component)"></component>
  </router-view>
</template>

<script setup lang="ts">
import { onUpdated, type VNode } from 'vue';
import { useKeepAliveWrapperIncludeData } from '../hooks/useKeepAliveHelper';
import type { RouteLocationNormalizedLoaded } from 'vue-router';

export interface KeepAliveWrapperProps {
  /**
   * keepAlive缓存组件数量
   */
  keepAliveMax?: number;
  /**
   * 是否启用keep-alive. 默认: true
   */
  enableKeepAlive?: boolean;
}
withDefaults(defineProps<KeepAliveWrapperProps>(), {
  keepAliveMax: 4,
  enableKeepAlive: true,
});

const { include, showRouterView } = useKeepAliveWrapperIncludeData();

onUpdated(() => {
  console.log('KeepAliveWrapper onUpdated');
});

function buildCompKey(route: RouteLocationNormalizedLoaded, comp?: VNode) {
  if (comp && comp.key) {
    // 组件本身有key，则采用组件的key
    return comp.key;
  }
  if (route.meta.useFullPathAsRouteKey) {
    // 路由配置中设置了使用fullpath作为key，则优先采用fullpath作为key
    return route.fullPath;
  }
  if (route.meta.routeKey) {
    // 如果设置了routeKey则采用routeKey作为key
    return route.meta.routeKey;
  }
  // important: 当以上都没有的时候，应该返回undefined，让vue自行处理
  return undefined;
}
</script>

<style lang="scss" scoped></style>
