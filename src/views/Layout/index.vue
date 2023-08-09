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
        <el-tabs v-model="currentTabsValue" type="card" class="demo-tabs" @tab-remove="removeTab" @tab-click="tabClick">
          <el-tab-pane
            v-for="(item, index) in tabs"
            :key="index"
            :label="item.title"
            :name="item.title"
            :closable="index !== 0"
          >
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-main>
        <KeepAliveWrapper></KeepAliveWrapper>
      </el-main>
      <el-footer class="footer">
        <span>zhaoguowenaip@sina.com</span>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import Sidebar from '@/components/SIdebar.vue';
import KeepAliveWrapper from '@/components/KeepAliveWrapper.vue';
import useStore from '@/store';
import { clearToken } from '@/utils/token';
import type { TabPaneName, TabsPaneContext } from 'element-plus';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { removeRouteKeepAliveByEvt, useKeepAliveRoute } from '@/hooks/useKeepAliveHelper';

const router = useRouter();
const route = useRoute();
const { user } = useStore();
const { tabs, currentTabsValue } = storeToRefs(user);
const { removeOneRouteKeepAliveAndToOtherRoute } = useKeepAliveRoute();
const isCollapse = ref(false);

// 选中侧边栏
const handleSelect = (key: string) => {
  const arr = getMenuTitleAndName(user.router, key);
  if (!arr.length) return;
  addTab(arr[0], key, arr[1]);
};

// 点击tab
const tabClick = (tab: TabsPaneContext) => {
  if (tab.props.name === currentTabsValue.value) return;
  const item = tabs.value.find((item) => item.title === tab.props.name);
  router.push(item!.path);
};

// 添加tab
const addTab = (title: string, path: string, name: string) => {
  if (!tabs.value.some((item) => item.title === title)) {
    tabs.value.push({ title, path, name });
  }
  currentTabsValue.value = title;
};

// 删除tab
const removeTab = (title: TabPaneName) => {
  const index = tabs.value.findIndex((item) => item.title === title);
  if (!~index) return;
  const remoteItem = tabs.value.splice(index, 1);
  if (title === currentTabsValue.value) {
    const item = tabs.value[Math.min(index, tabs.value.length - 1)];
    currentTabsValue.value = item.title;
    console.log(remoteItem[0].name, item.path);
    removeOneRouteKeepAliveAndToOtherRoute(remoteItem[0].name, item.path);
  } else {
    // 删除不是当前tab的缓存
    return removeRouteKeepAliveByEvt(remoteItem[0].name);
  }
};

// 获取title
const getMenuTitleAndName = (arr: any, keyValue: string): any[] => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].router == keyValue) {
      return [arr[i].title, arr[i].component];
    }
    if (arr[i].children) {
      return getMenuTitleAndName(arr[i].children, keyValue);
    }
  }
  return [];
};

// 退出
const logout = (): void => {
  // 清楚token
  clearToken();
  user.$reset();
  router.push('/login');
};
</script>

<script lang="ts">
export default {
  name: 'Layout',
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
    overflow-y: hidden;
  }

  .el-tabs {
    --el-tabs-header-height: 30px;
  }

  .el-tabs__item {
    padding: 15px;
  }

  .el-main {
    padding: 5px;
    overflow: hidden;
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
