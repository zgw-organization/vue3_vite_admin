<template>
  <el-form ref="formRef" :rules="rules" label-position="top" :inline="true" size="large" :model="dialogForm">
    <el-form-item prop="username" label="用户名">
      <el-input v-model="dialogForm.username" size="large" placeholder="请输入用户名" />
    </el-form-item>
    <el-form-item prop="password" label="密码">
      <el-input v-model="dialogForm.password" size="large" type="password" placeholder="请输入密码" show-password />
    </el-form-item>
    <el-form-item prop="roles" label="角色">
      <el-select
        v-model="dialogForm.roles"
        size="large"
        multiple
        collapse-tags
        collapse-tags-tooltip
        placeholder="请选择角色"
      >
        <el-option v-for="item in roleList" :key="item?.value" :label="item?.label" :value="item?.value" />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import Axios from '@/utils/http';
import type { FormInstance, FormRules } from 'element-plus';
import { onMounted, reactive, ref, toRaw } from 'vue';
import { ElMessage } from 'element-plus';

type RoleList = {
  value: number;
  label: string;
};
const roleList = ref<RoleList[]>();
const formRef = ref<FormInstance>();
const dialogForm = reactive({
  username: '',
  password: '',
  roles: [],
});
const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  roles: [{ required: true, message: '请选择角色', trigger: 'blur' }],
});

onMounted(() => {
  getRoleList();
});

//获取角色列表
const getRoleList = async () => {
  let { data } = await Axios.get('/role/selectlist');
  roleList.value = data.map((item: any) => ({
    value: item.id,
    label: `${item.name}-${item.description}`,
  }));
};

// 提交
const submit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      let res = await Axios.post('/user/add', toRaw(dialogForm));
      if (res.status == 0) {
        ElMessage.success(res.message);
        emits('dialogBackFn');
      } else {
        ElMessage.error(res.message);
      }
    } else {
      return false;
    }
  });
};

const emits = defineEmits(['dialogBackFn']);

defineExpose({
  dialogForm,
  submit,
});
</script>

<style lang="scss" scoped></style>
