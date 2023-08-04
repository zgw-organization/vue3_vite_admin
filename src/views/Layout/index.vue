<template>
  <el-container class="layout">
    <el-aside class="sider">
      <div class="logo"><strong>vue3_vite_admin</strong></div>
      <el-menu
        :default-active="route.path"
        active-text-color="#ffd04b"
        background-color="#545c64"
        unique-opened
        router
        text-color="#fff"
      >
        <Sidebar :data="user.menu"></Sidebar>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="user-info">
          <div class="user-name">{{ user.info.username }}</div>
          <div class="user-logout">
            <el-popconfirm title="是否确认退出？" confirm-button-text="是" cancel-button-text="否" @confirm="logout">
              <template #reference> 退出 </template>
            </el-popconfirm>
          </div>
        </div>
      </el-header>
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
// import { onMounted, reactive, ref, toRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const { user } = useStore();

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

  .sider {
    background: #545c64;
    overflow: hidden;
    user-select: none;
    width: 13vw;

    .logo {
      height: 32px;
      line-height: 32px;
      text-align: center;
      color: #fff;
      background: rgba(255, 255, 255, 0.2);
      margin: 16px;
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
