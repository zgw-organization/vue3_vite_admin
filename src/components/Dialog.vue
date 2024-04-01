<template>
  <el-dialog v-model="dialogVisible" destroy-on-close :title="title" align-center>
    <slot></slot>
    <template #footer>
      <span class="dialog-footer">
        <el-button>取消</el-button>
        <el-button type="primary">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
const dialogVisible = ref(true);
const title = ref('');

const close = () => {
  dialogVisible.value = false;
};

const cancel = () => {
  dialogVisible.value = false;
};

const confirm = () => {
  dialogVisible.value = false;
};

defineExpose({ dialogVisible, title, close, cancel, confirm });
</script>

<style lang="scss" scoped></style>
