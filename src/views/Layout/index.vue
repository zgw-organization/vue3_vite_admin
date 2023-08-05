<template>
  <el-container class="layout">
    <el-aside class="sider">
      <div v-if="!isCollapse" class="logo"><strong>vue3_vite_admin</strong></div>
      <div v-else class="hideLog"></div>
      <el-menu
        :default-active="route.path"
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="menu"
        :collapse="isCollapse"
        unique-opened
        router
        text-color="#fff"
        @select="handleSelect"
      >
        <Sidebar :data="user.menu"></Sidebar>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-left" @click="isCollapse = !isCollapse">
          <el-icon size="22"><Fold /></el-icon>
        </div>
        <div class="user-info">
          <div class="user-name">{{ user.info.username }}</div>
          <div class="user-logout">
            <el-popconfirm title="是否确认退出？" confirm-button-text="是" cancel-button-text="否" @confirm="logout">
              <template #reference>
                <el-icon><UserFilled /></el-icon>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </el-header>
      <div class="tabs">
        <el-tabs
          v-model="editableTabsValue"
          type="card"
          class="demo-tabs"
          closable
          @tab-remove="removeTab"
          @tab-click="tabClick"
        >
          <el-tab-pane v-for="(item, index) in editableTabs" :key="index" :label="item.title" :name="item.title">
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer class="footer">
        <span>zhaoguowenaip@sina.com</span>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import Sidebar from '@/components/Sidebar/index.vue';
import useStore from '@/store';
import { clearToken } from '@/utils/token';
import type { TabPaneName, TabsPaneContext } from 'element-plus';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const { user } = useStore();
const isCollapse = ref(false);
const editableTabsValue = ref('首页');
const editableTabs = ref([
  {
    title: '首页',
    path: '/home',
  },
]);

// 选中侧边栏
const handleSelect = (key: string) => {
  const title = getMenuTitle(user.menu, key);
  addTab(title, key);
};

// 点击tab
const tabClick = (tab: TabsPaneContext) => {
  if (tab.props.name === editableTabsValue.value) return;
  const item = editableTabs.value.find((item) => item.title === tab.props.name);
  router.push(item!.path);
};

// 添加tab
const addTab = (title: string, path: string) => {
  if (!editableTabs.value.some((item) => item.title === title)) {
    editableTabs.value.push({ title, path });
  }
  editableTabsValue.value = title;
};

// 删除tab
const removeTab = (title: TabPaneName) => {
  const index = editableTabs.value.findIndex((item) => item.title === title);
  if (!~index) return;
  editableTabs.value.splice(index, 1);
  if (title === editableTabsValue.value) {
    const item = editableTabs.value[Math.min(index, editableTabs.value.length - 1)];
    editableTabsValue.value = item.title;
    router.push(item.path);
  }
};

// 获取title
const getMenuTitle = (arr: any, keyValue: string): string => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].router == keyValue) {
      return arr[i].title;
    }
    if (arr[i].children) {
      return getMenuTitle(arr[i].children, keyValue);
    }
  }
  return '';
};

// 退出
const logout = (): void => {
  // 清楚token
  clearToken();
  user.$reset();
  router.push('/login');
};
</script>

<style lang="scss" scoped>
.layout {
  height: 100vh;

  .header {
    background: rgb(67, 74, 80);
    position: relative;

    .header-left {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      padding-left: 15px;
      color: #fff;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .user-info {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      padding-right: 20px;
      color: #fff;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .user-name {
        margin-right: 20px;
      }

      .user-logout {
        display: inline-block;
        cursor: pointer;
      }
    }
  }

  .tabs {
    padding-top: 10px;
    padding-left: 5px;
    overflow-y: scroll;
  }

  .el-main {
    padding: 5px;
  }

  .sider {
    background: #545c64;
    overflow: hidden;
    user-select: none;
    width: auto;

    .hideLog {
      height: 32px;
      line-height: 32px;
      text-align: center;
      color: #fff;
      background: rgba(255, 255, 255, 0.2);
      margin: 16px;
      border-radius: 100%;
    }

    .logo {
      height: 32px;
      line-height: 32px;
      text-align: center;
      color: #fff;
      background: rgba(255, 255, 255, 0.2);
      margin: 16px;
      border-radius: 5px;
    }

    .menu:not(.el-menu--collapse) {
      width: 13vw;
    }

    .el-menu {
      border-right: 0;
    }
  }

  .footer {
    background: rgb(67, 74, 80);
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 800;
  }
}
</style>
