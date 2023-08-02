<template>
  <div v-if="isShow" class="loading">
    <div class="loading-content">Loading...</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const isShow = ref<boolean>(false);

// 显示
const show = () => (isShow.value = true);

// 隐藏
const hide = () => (isShow.value = false);

defineExpose({
  isShow,
  show,
  hide,
});
</script>

<style lang="scss" scoped>
.loading {
  position: fixed;
  inset: 0; /* 等同于 `top: 0; right: 0; bottom: 0; left: 0;` */
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;

  &-content {
    font-size: 30px;
    color: #fff;
  }
}
</style>
