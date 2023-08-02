<template>
  <el-dialog v-model="dialogVisible" destroy-on-close :title="title" align-center @close="close">
    <el-form ref="formRef" :rules="rules" label-position="top" :inline="true" size="large" :model="dialogForm">
      <el-form-item prop="parentid" label="父级id">
        <el-input v-model="dialogForm.parentid" size="large" :disabled="true" placeholder="请输入父级id" />
      </el-form-item>
      <el-form-item prop="name" label="名称">
        <el-input v-model="dialogForm.name" size="large" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item prop="alias" label="别名">
        <el-input v-model="dialogForm.alias" size="large" placeholder="请输入别名" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import Axios from '@/utils/http';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { onMounted, reactive, ref, toRaw } from 'vue';

type Props = {
  title: string;
  item: any;
};
const props = defineProps<Props>();
const dialogVisible = ref<boolean>(true);
const dialogForm = ref({
  name: '',
  alias: '',
  parentid: null,
});
const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  alias: [{ required: true, message: '请输入别名', trigger: 'blur' }],
  parentid: [{ required: true, message: '请输入父级id', trigger: 'blur' }],
});

// 提交
const submit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      if (props.title == '新增权限') {
        let res = await Axios.post('/permission/add', toRaw(dialogForm.value));
        if (res.status == 0) {
          ElMessage.success(res.message);
          close(true);
        } else {
          ElMessage.error(res.message);
        }
      } else {
        let res = await Axios.post('/permission/edit', toRaw(dialogForm.value));
        if (res.status == 0) {
          ElMessage.success(res.message);
          close();
        } else {
          ElMessage.error(res.message);
        }
      }
    } else {
      return false;
    }
  });
};

// 关闭
const close = (flag = false) => {
  dialogVisible.value = false;
  emits('close', flag);
};

const emits = defineEmits(['close']);

onMounted(() => {
  if (props.title == '新增权限') {
    dialogForm.value.parentid = props.item;
  } else {
    dialogForm.value = props.item;
  }
});
</script>

<style lang="scss" scoped></style>
