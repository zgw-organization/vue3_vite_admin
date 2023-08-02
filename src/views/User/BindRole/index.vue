<template>
  <el-form ref="formRef" :rules="rules" label-position="top" :inline="true" size="large" :model="dialogForm">
    <el-form-item prop="roles" label="角色">
      <el-select
        v-model="dialogForm.roles"
        multiple
        collapse-tags
        collapse-tags-tooltip
        placeholder="请选择角色"
        style="width: 240px"
      >
        <el-option v-for="item in roleList" :key="item.value" :label="item.label" :value="item.value" />
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
const dialogForm = reactive({
  roles: [],
  id: 0,
});
const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  roles: [{ required: true, message: '请选择角色', trigger: 'blur' }],
});

onMounted(() => {
  getRoleList();
});

// 提交
const submit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      let res = await Axios.post('/user/bindRoles', toRaw(dialogForm));
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

//获取角色列表
const getRoleList = async () => {
  let { data } = await Axios.get('/role/selectlist');
  roleList.value = data.map((item: any) => ({
    value: item.id,
    label: `${item.name}-${item.description}`,
  }));
};

const emits = defineEmits(['dialogBackFn']);

defineExpose({
  dialogForm,
  submit,
});
</script>

<style lang="scss" scoped></style>
