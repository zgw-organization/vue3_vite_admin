<template>
  <el-form ref="formRef" :rules="rules" label-position="top" :inline="true" size="large" :model="dialogForm">
    <el-form-item prop="password" label="新密码">
      <el-input size="large" v-model="dialogForm.password" type="password" placeholder="请输入密码" show-password />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import Axios from '@/utils/http';
import type { FormInstance, FormRules } from 'element-plus';
import { onUnmounted, reactive, ref, toRaw } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { clearToken } from '@/utils/token';

const dialogForm = reactive({
  password: [],
  id: 0
});
const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  password: [
    { required: true, message: "请输入新密码", trigger: 'blur' },
  ]
});
const router = useRouter();
let timer: any;

// 提交
const submit = () => {
  formRef.value?.validate(async valid => {
    if (valid) {
      let res = await Axios.post('/user/changepassword', toRaw(dialogForm));
      if (res.status == 0) {
        ElMessage.success("修改密码成功, 2s后自动退出!");
        timer = setTimeout(() => {
          // 清楚token
          clearToken();
          router.push("/login");
        }, 2000);
      } else {
        ElMessage.error(res.message);
      }
    } else {
      return false;
    }
  });
};

onUnmounted(() => {
  clearTimeout(timer);
});

defineExpose({
  submit,
  dialogForm,
});

</script>

<style lang="scss" scoped>

</style>