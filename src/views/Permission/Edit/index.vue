<template>
  <el-dialog v-model="dialogVisible" destroy-on-close :title="title" align-center @close="closeHandler">
    <el-form ref="formRef" :rules="rules" label-position="top" :inline="true" size="large" :model="dialogForm">
      <el-form-item prop="parentId" label="父级id">
        <el-input v-model="dialogForm.parentId" size="large" :disabled="true" placeholder="请输入父级id" />
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
        <el-button type="primary" @click="submitHandler">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { addPermission, editPermission } from '@/api';
import { type FormInstance, type FormRules } from 'element-plus';

// props
const props = defineProps<{
  title: string;
  item: any;
}>();

// dialog
const dialogVisible = ref<boolean>(true);
const dialogForm = ref({
  name: '',
  alias: '',
  parentId: null,
});
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  alias: [{ required: true, message: '请输入别名', trigger: 'blur' }],
  parentId: [{ required: true, message: '请输入父级id', trigger: 'blur' }],
});

// ref
const formRef = ref<FormInstance>();

onMounted(() => {
  const data = props.item;
  if (props.title === 'add') {
    dialogForm.value.parentId = data ? data.id : 0;
  } else {
    data.parentId = data.parentId ? data.parentId : 0;
    dialogForm.value = data;
  }
});

const title = computed(() => {
  if (props.title == 'add') {
    return '新增权限';
  } else {
    return '编辑权限';
  }
});

// submit
const submitHandler = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      const { message, success } = await (props.title == 'add' ? addPermission : editPermission)(
        toRaw(dialogForm.value),
      );
      ElMessage[success ? 'success' : 'error'](success ? (props.title == 'add' ? '新增成功' : '编辑成功') : message);
      closeHandler(true);
    } else {
      return false;
    }
  });
};

// close
const closeHandler = (flag = false) => {
  dialogVisible.value = false;
  emits('close', flag);
};

// emits
const emits = defineEmits(['close']);
</script>

<style lang="scss" scoped></style>
