<template>
  <template v-for="item in data" :key="item.router">
    <el-sub-menu v-if="item.children && item.children.length" :index="item.router">
      <template #title>
        <el-icon :size="16">
          <component :is="item.icon"></component>
        </el-icon>
        <span>{{ item.title }}</span>
      </template>
      <SidebarItem :data="item.children"></SidebarItem>
    </el-sub-menu>
    <el-menu-item v-else :index="item.router">
      <el-icon :size="16">
        <component :is="item.icon"></component>
      </el-icon>
      <span>{{ item.title }}</span>
    </el-menu-item>
  </template>
</template>

<script lang="ts" setup>
type SidebarList = {
  router: string;
  title: string;
  icon: string;
  children?: SidebarList[] | [];
};

type Props = {
  data?: SidebarList[];
};

defineProps<Props>();
</script>

<script lang="ts">
export default {
  name: 'SidebarItem',
};
</script>

<style lang="scss" scoped></style>
